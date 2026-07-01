// Code de build partageable (autonome, hors-ligne, déterministe).
//
// Un build se résume à des ids d'items Ankama (mêmes ids partout : DofusDB/DofusDude/DofusRoom),
// donc on le sérialise tel quel — aucun mapping à maintenir. Le code est du base64url d'un JSON
// compact (clés courtes, champs vides omis), préfixé par une version `DCB1.` pour pouvoir évoluer
// sans casser les codes déjà partagés.
//
// Le décodage traite un code venant de l'extérieur comme une entrée NON fiable : chaque champ est
// re-validé/nettoyé (jamais d'exception propagée, jamais de type inattendu injecté dans le store).
import type { Build, BuildSlots } from "../store/store";

const VERSION = 1;
const PREFIX = `DCB${VERSION}.`;

// ---- base64url (UTF-8 safe, même idiome que l'export Skinator) ----

function toBase64Url(json: string): string {
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(code: string): string {
  const b64 = code.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  return decodeURIComponent(escape(atob(b64 + pad)));
}

// ---- Forme compacte encodée ----

interface Compact {
  v: number;
  n?: string; // name
  b?: number | null; // breedId
  l?: number; // level
  s?: BuildSlots; // slots (slotKey -> ankama_id)
  c?: Record<string, number>; // caracs
  p?: Record<string, number>; // parch
  f?: Record<string, Record<string, number>>; // fm
  e?: Record<string, string>; // exos
  t?: { resPct: number[]; resFlat: number[] }; // target
}

function hasKeys(o: unknown): o is Record<string, unknown> {
  return !!o && typeof o === "object" && Object.keys(o as object).length > 0;
}

/** Sérialise un build en code partageable `DCB1.<base64url>`. Les champs vides sont omis. */
export function encodeBuild(build: Build): string {
  const c: Compact = { v: VERSION };
  if (build.name) c.n = build.name;
  if (build.breedId != null) c.b = build.breedId;
  if (build.level != null) c.l = build.level;
  if (hasKeys(build.slots)) c.s = build.slots;
  if (hasKeys(build.caracs)) c.c = build.caracs;
  if (hasKeys(build.parch)) c.p = build.parch;
  if (hasKeys(build.fm)) c.f = build.fm;
  if (hasKeys(build.exos)) c.e = build.exos;
  const t = build.target;
  // On ne conserve que les deux tableaux attendus (la cible runtime peut porter des champs en plus).
  if (t && (t.resPct?.some((x) => x) || t.resFlat?.some((x) => x))) c.t = { resPct: t.resPct, resFlat: t.resFlat };
  return PREFIX + toBase64Url(JSON.stringify(c));
}

// ---- Décodage (entrée non fiable → nettoyage systématique) ----

export interface DecodedBuild {
  name: string;
  breedId?: number | null;
  level?: number;
  slots: BuildSlots;
  caracs?: Record<string, number>;
  parch?: Record<string, number>;
  fm?: Record<string, Record<string, number>>;
  exos?: Record<string, string>;
  target?: { resPct: number[]; resFlat: number[] };
}

export type DecodeResult = { ok: true; draft: DecodedBuild } | { ok: false; error: string };

function clampLevel(n: number): number {
  return Math.min(200, Math.max(1, Math.floor(n)));
}

function sanitizeSlots(v: unknown): BuildSlots {
  const out: BuildSlots = {};
  if (v && typeof v === "object") {
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      if (typeof val === "number" && Number.isFinite(val)) out[k] = val;
    }
  }
  return out;
}

function sanitizeNumMap(v: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (v && typeof v === "object") {
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      if (typeof val === "number" && Number.isFinite(val)) out[k] = val;
    }
  }
  return out;
}

function sanitizeStrMap(v: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (v && typeof v === "object") {
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      if (typeof val === "string") out[k] = val;
    }
  }
  return out;
}

function sanitizeFmMap(v: unknown): Record<string, Record<string, number>> {
  const out: Record<string, Record<string, number>> = {};
  if (v && typeof v === "object") {
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      const inner = sanitizeNumMap(val);
      if (Object.keys(inner).length) out[k] = inner;
    }
  }
  return out;
}

function sanitizeTarget(v: unknown): { resPct: number[]; resFlat: number[] } | undefined {
  if (!v || typeof v !== "object") return undefined;
  const o = v as { resPct?: unknown; resFlat?: unknown };
  const nums = (a: unknown): number[] =>
    Array.isArray(a) ? a.map((x) => (typeof x === "number" && Number.isFinite(x) ? x : 0)) : [];
  const resPct = nums(o.resPct);
  const resFlat = nums(o.resFlat);
  if (!resPct.length && !resFlat.length) return undefined;
  return { resPct, resFlat };
}

/**
 * Décode un code (ou un lien complet `dofuscodex://build/<code>`) en brouillon de build nettoyé.
 * Ne lève jamais : renvoie `{ ok: false, error }` sur code vide/illisible/version inconnue.
 */
export function decodeBuild(input: string): DecodeResult {
  const raw = (input ?? "").trim();
  if (!raw) return { ok: false, error: "Code vide." };

  // Tolère qu'on colle le lien entier plutôt que le code seul.
  let body = parseBuildDeepLink(raw) ?? raw;

  // Tolère la présence/absence du préfixe de version (`DCBn.`).
  const m = body.match(/^DCB(\d+)\./);
  if (m) {
    const version = Number(m[1]);
    if (version !== VERSION) {
      return { ok: false, error: `Code d'une version non prise en charge (DCB${version}).` };
    }
    body = body.slice(m[0].length);
  }

  let json: string;
  try {
    json = fromBase64Url(body);
  } catch {
    return { ok: false, error: "Code illisible (encodage invalide)." };
  }

  let obj: unknown;
  try {
    obj = JSON.parse(json);
  } catch {
    return { ok: false, error: "Code illisible (format invalide)." };
  }
  if (!obj || typeof obj !== "object") return { ok: false, error: "Code invalide." };

  const c = obj as Compact;
  if (typeof c.v === "number" && c.v !== VERSION) {
    return { ok: false, error: `Code d'une version non prise en charge (DCB${c.v}).` };
  }

  const draft: DecodedBuild = {
    name: typeof c.n === "string" ? c.n : "",
    slots: sanitizeSlots(c.s),
  };
  if (typeof c.b === "number") draft.breedId = c.b;
  if (typeof c.l === "number") draft.level = clampLevel(c.l);
  const caracs = sanitizeNumMap(c.c);
  if (Object.keys(caracs).length) draft.caracs = caracs;
  const parch = sanitizeNumMap(c.p);
  if (Object.keys(parch).length) draft.parch = parch;
  const fm = sanitizeFmMap(c.f);
  if (Object.keys(fm).length) draft.fm = fm;
  const exos = sanitizeStrMap(c.e);
  if (Object.keys(exos).length) draft.exos = exos;
  const target = sanitizeTarget(c.t);
  if (target) draft.target = target;

  return { ok: true, draft };
}

// ---- Lien profond ----

/** Construit le lien profond ouvrant l'app sur l'import (`dofuscodex://build/<code>`). */
export function buildShareLink(code: string): string {
  return `dofuscodex://build/${code}`;
}

/**
 * Extrait le code d'un lien `dofuscodex://build/<code>`. Renvoie `null` si l'URL n'est pas un
 * lien de build (ex. lien de reset de mot de passe `dofuscodex://reset#…`).
 */
export function parseBuildDeepLink(url: string): string | null {
  if (typeof url !== "string") return null;
  const m = url.match(/^dofuscodex:\/\/build\/(.+)$/i);
  if (!m) return null;
  let code = m[1].split(/[#?]/)[0].trim();
  try {
    code = decodeURIComponent(code);
  } catch {
    /* garde le code brut si non ré-encodé */
  }
  return code || null;
}
