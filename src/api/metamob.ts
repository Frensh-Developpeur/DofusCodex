// Client de l'API Metamob (suivi de capture d'archimonstres — quête de l'Ocre).
// Doc : https://www.metamob.fr/help/api — base v1, auth par jeton Bearer personnel
// (généré dans les réglages du compte Metamob). Un seul jeton, pas de clé d'application.
//
// L'API ayant été refondue récemment et les schémas de réponse n'étant pas tous figés,
// le parsing est volontairement DÉFENSIF : on lit plusieurs noms de champ possibles et on
// normalise vers nos propres types. Toute évolution de l'API ne casse que la normalisation.
import { ApiError } from "./client";

const BASE = "https://www.metamob.fr/api/v1";
const IMG_BASE = "https://www.metamob.fr/img/monsters";

export interface MetamobQuest {
  slug: string;
  characterName: string;
  currentStep?: number;
  server?: string;
  serverId?: number;
  parallelQuests?: number;
  wantedCount?: number;
  offeredCount?: number;
  showTrades?: boolean;
  tradeMode?: number;
  tradeOfferThreshold?: number | null;
  tradeWantThreshold?: number | null;
  neverOfferNormal?: boolean;
  neverWantNormal?: boolean;
  neverOfferBoss?: boolean;
  neverWantBoss?: boolean;
  neverOfferArch?: boolean;
  neverWantArch?: boolean;
  templateMonsterCount?: number;
  templateStepCount?: number;
}

export type MetamobStatus = "wanted" | "offered" | "none";

export interface MetamobMonster {
  id: number;
  codexMonsterId?: number; // id DofusDB/Ankama si l'API Metamob l'expose, différent de l'id Metamob.
  name: string;
  img: string;
  type: string; // libellé (Archimonstre, Boss…) si fourni, sinon ""
  typeId?: number;
  step?: number;
  levelMin?: number;
  levelMax?: number;
  owned: number; // quantité possédée (0–30)
  statusValue: number; // valeur Metamob calculée (owned - quêtes parallèles) si fournie
  wanted: number; // nombre recherché visible sur Metamob
  offered: number; // nombre proposé visible sur Metamob
  tradeOffer?: number | null; // surcharge manuelle, null/undefined = auto
  tradeWant?: number | null; // surcharge manuelle, null/undefined = auto
  status: MetamobStatus; // recherché / proposé / neutre
}

export interface MetamobServer {
  id: number;
  name: string;
  community?: string;
  gameVersion?: string;
}

export interface MetamobQuestSettings {
  characterName?: string;
  parallelQuests?: number;
  currentStep?: number;
  showTrades?: boolean;
  tradeMode?: number;
  tradeOfferThreshold?: number | null;
  tradeWantThreshold?: number | null;
  neverOfferNormal?: boolean;
  neverWantNormal?: boolean;
  neverOfferBoss?: boolean;
  neverWantBoss?: boolean;
  neverOfferArch?: boolean;
  neverWantArch?: boolean;
}

export interface MetamobTradeMonster {
  id: number;
  codexMonsterId?: number;
  name: string;
  img?: string;
  typeId?: number;
  levelMin?: number;
  levelMax?: number;
  available: number;
  needed: number;
  coversNeed: boolean;
}

export interface MetamobTradeMatch {
  username: string;
  characterName: string;
  parallelQuests?: number;
  lastActive?: string;
  avatar?: string;
  questSlug?: string;
  score: number;
  theyHaveYouWant: MetamobTradeMonster[];
  youHaveTheyWant: MetamobTradeMonster[];
}

export interface MetamobUserSearchResult {
  username: string;
  avatar?: string;
  lastActive?: string;
}

export interface MetamobZoneMonster extends MetamobMonster {
  required: number;
  zoneStatus: "validated" | "completed" | "incomplete" | string;
  offer: number;
  want: number;
}

export interface MetamobSubzone {
  id: number;
  name: string;
  completed: number;
  total: number;
  monsters: MetamobZoneMonster[];
}

export interface MetamobZone {
  id: number;
  name: string;
  completed: number;
  total: number;
  subzones: MetamobSubzone[];
}

export interface MetamobKraloveEvent {
  id: number;
  datetime: string;
  description: string;
  creator: string;
  server: string;
  serverId?: number;
  participantsCount: number;
  characterCount: number;
  messagesCount: number;
  participants?: { username: string; characterCount: number }[];
  messages?: { username: string; content: string; createdAt: string }[];
}

// ─── fetch bas niveau ────────────────────────────────────────────────────────
// ⚠️ L'API metamob.fr n'envoie AUCUN en-tête CORS → un fetch direct depuis le renderer
// échoue (« Failed to fetch »). Sous Electron on passe donc par le pont IPC
// (window.dofusCodex.metamobRequest, requête faite côté Node, sans CORS). Hors Electron
// (dev navigateur) on retombe sur fetch (qui restera bloqué par CORS — attendu).
function friendlyError(status: number, data: any): ApiError {
  let msg = (data && data.message) || `Erreur Metamob (${status})`;
  if (status === 401) msg = "Clé API invalide ou expirée.";
  else if (status === 403) msg = "Accès refusé (cette chasse ne vous appartient pas ?).";
  else if (status === 404) msg = "Pseudo ou chasse introuvable sur Metamob.";
  else if (status === 429) msg = "Trop de requêtes — réessayez dans une minute.";
  return new ApiError(msg, status);
}

interface ReqOpts {
  method?: string;
  body?: unknown;
  signal?: AbortSignal;
}

async function mmRequest<T>(path: string, apiKey: string, opts: ReqOpts = {}): Promise<T> {
  const method = opts.method ?? "GET";
  const bridge = typeof window !== "undefined" ? window.dofusCodex?.metamobRequest : undefined;

  if (bridge) {
    let r: { ok: boolean; status: number; data: unknown; error?: string };
    try {
      r = await bridge({ method, path, apiKey, body: opts.body });
    } catch {
      throw new ApiError("Connexion à Metamob impossible.", 0);
    }
    if (!r) throw new ApiError("Réponse vide de Metamob.", 0);
    if (!r.ok) {
      if (!r.status) throw new ApiError(`Connexion à Metamob impossible${r.error ? ` (${r.error})` : ""}.`, 0);
      throw friendlyError(r.status, r.data);
    }
    return r.data as T;
  }

  // Repli navigateur (dev hors Electron) — soumis au CORS.
  const res = await fetch(`${BASE}${path}`, {
    method,
    signal: opts.signal,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...(opts.body != null ? { "Content-Type": "application/json" } : {}),
    },
    body: opts.body != null ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) {
    let data: any = null;
    try {
      data = await res.json();
    } catch {
      /* corps non-JSON */
    }
    throw friendlyError(res.status, data);
  }
  if (res.status === 204) return null as T;
  return (await res.json()) as T;
}

// Extrait un tableau quel que soit l'enveloppe ({data}, {monsters}, {quests} ou tableau brut).
function asList(res: any): any[] {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.monsters)) return res.data.monsters;
  if (Array.isArray(res?.data?.quests)) return res.data.quests;
  if (Array.isArray(res?.monsters)) return res.monsters;
  if (Array.isArray(res?.quests)) return res.quests;
  if (Array.isArray(res?.items)) return res.items;
  return [];
}

function paginationTotal(res: any): number | undefined {
  const total = res?.total ?? res?.meta?.total ?? res?.pagination?.total ?? res?.data?.pagination?.total;
  return typeof total === "number" ? total : undefined;
}

function qs(params: Record<string, string | number | boolean | undefined | null>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v != null && v !== "") sp.set(k, String(v));
  }
  const out = sp.toString();
  return out ? `?${out}` : "";
}

// Localisé {fr,en,es} ou chaîne simple → chaîne fr.
function loc(v: any): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object") return v.fr ?? v.en ?? v.es ?? String(Object.values(v)[0] ?? "");
  return String(v);
}

function monsterImg(raw: any): string {
  const img = raw.image ?? raw.img ?? "";
  if (!img) return `${IMG_BASE}/placeholder.png`;
  const s = String(img);
  return s.startsWith("http") ? s : `${IMG_BASE}/${s}`;
}

function optionalMonsterImg(raw: any): string | undefined {
  const img =
    raw.image ??
    raw.img ??
    raw.icon ??
    raw.monster?.image ??
    raw.monster?.img ??
    raw.monster_type?.image ??
    raw.monster_type?.img ??
    raw.monsterType?.image ??
    raw.monsterType?.img;
  if (!img) return undefined;
  const s = String(img);
  return s.startsWith("http") ? s : `${IMG_BASE}/${s}`;
}

// L'avatar Metamob est un objet { id, name, image } (image = nom de fichier d'archimonstre).
// Renvoie l'URL complète, ou undefined si aucun avatar → l'UI affiche un générique.
function avatarUrl(raw: any): string | undefined {
  const img = raw?.image ?? raw?.img;
  if (!img) return undefined;
  const s = String(img);
  return s.startsWith("http") ? s : `${IMG_BASE}/${s}`;
}

// Quantités EFFECTIVES recherchées / proposées d'un monstre.
// ⚠️ L'endpoint liste (GET …/quests/{slug}) ne renvoie QUE `want`/`offer` (valeurs effectives,
// après calcul auto + overrides manuels + règles de quête) et `quantity` (possédé). Il n'expose
// ni `status`, ni `effective_*`, ni `trade_*` : ces champs n'apparaissent que dans la réponse du
// PATCH batch. On lit donc `want`/`offer` en priorité, avec replis défensifs sur les autres noms.
function monsterWantOffer(raw: any): { want: number; offer: number } {
  const want = Math.max(0, Number(raw.want ?? raw.effective_want ?? raw.wanted ?? raw.trade_want ?? 0) || 0);
  const offer = Math.max(0, Number(raw.offer ?? raw.effective_offer ?? raw.offered ?? raw.trade_offer ?? 0) || 0);
  // Ultime repli : `status` (réponse batch) = possédé − quêtes parallèles (négatif = recherché).
  if (want === 0 && offer === 0 && typeof raw.status === "number") {
    return raw.status < 0 ? { want: -raw.status, offer: 0 } : { want: 0, offer: raw.status };
  }
  return { want, offer };
}

function monsterTypeId(raw: any): number | undefined {
  const typeRaw = raw.type;
  const id = raw.monster_type_id ?? raw.monsterTypeId ?? raw.type_id ?? raw.typeId ?? typeRaw?.id ?? typeRaw;
  const n = Number(id);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function monsterTypeName(raw: any): string {
  const explicit = loc(raw.type?.name ?? raw.monster_type?.name ?? raw.monsterType?.name ?? raw.type_name ?? raw.typeName);
  if (explicit && !/^\d+$/.test(explicit)) return explicit;
  const id = monsterTypeId(raw);
  if (id === 1) return "Monstre";
  if (id === 2) return "Boss";
  if (id === 3) return "Archimonstre";
  return explicit;
}

function optionalPositiveNumber(value: unknown): number | undefined {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function monsterCodexId(raw: any): number | undefined {
  return optionalPositiveNumber(
    raw.dofusdb_id ??
      raw.dofusdbId ??
      raw.dofusDbId ??
      raw.dofus_db_id ??
      raw.dofus_id ??
      raw.dofusId ??
      raw.ankama_id ??
      raw.ankamaId ??
      raw.game_id ??
      raw.gameId ??
      raw.dofusdb?.id ??
      raw.dofusDb?.id ??
      raw.dofus_db?.id,
  );
}

function normalizeMonster(raw: any): MetamobMonster {
  const type = monsterTypeName(raw);
  const { want: wanted, offer: offered } = monsterWantOffer(raw);
  // Valeur signée (proposé > 0, recherché < 0) pour le tri « Échange ».
  const statusValue = offered > 0 ? offered : wanted > 0 ? -wanted : 0;
  const status: MetamobStatus = wanted > 0 ? "wanted" : offered > 0 ? "offered" : "none";
  return {
    id: Number(raw.id ?? raw.monster_id ?? raw.monsterId ?? 0),
    codexMonsterId: monsterCodexId(raw),
    name: loc(raw.name ?? raw.nom) || `#${raw.id ?? "?"}`,
    img: monsterImg(raw),
    type,
    typeId: monsterTypeId(raw),
    step: raw.step ?? raw.etape ?? undefined,
    levelMin: raw.level_min ?? raw.levelMin ?? undefined,
    levelMax: raw.level_max ?? raw.levelMax ?? undefined,
    owned: Math.max(0, Number(raw.quantity ?? raw.owned ?? raw.quantite ?? 0) || 0),
    statusValue,
    wanted,
    offered,
    tradeOffer: raw.trade_offer ?? raw.tradeOffer ?? undefined,
    tradeWant: raw.trade_want ?? raw.tradeWant ?? undefined,
    status,
  };
}

function normalizeQuest(raw: any): MetamobQuest {
  const server = raw.server ?? {};
  const template = raw.quest_template ?? raw.questTemplate ?? {};
  return {
    slug: String(raw.slug ?? raw.id ?? ""),
    characterName: loc(raw.character_name ?? raw.characterName ?? raw.name ?? raw.pseudo) || "Personnage",
    currentStep: raw.current_step ?? raw.currentStep ?? undefined,
    server: loc(server.name ?? raw.server ?? raw.serveur) || undefined,
    serverId: server.id ?? raw.server_id ?? raw.serverId ?? undefined,
    parallelQuests: raw.parallel_quests ?? raw.parallelQuests ?? undefined,
    wantedCount: raw.wanted_count ?? raw.wantedCount ?? undefined,
    offeredCount: raw.offered_count ?? raw.offeredCount ?? undefined,
    showTrades: raw.show_trades ?? raw.showTrades ?? undefined,
    tradeMode: raw.trade_mode ?? raw.tradeMode ?? undefined,
    tradeOfferThreshold: raw.trade_offer_threshold ?? raw.tradeOfferThreshold ?? undefined,
    tradeWantThreshold: raw.trade_want_threshold ?? raw.tradeWantThreshold ?? undefined,
    neverOfferNormal: raw.never_offer_normal ?? raw.neverOfferNormal ?? undefined,
    neverWantNormal: raw.never_want_normal ?? raw.neverWantNormal ?? undefined,
    neverOfferBoss: raw.never_offer_boss ?? raw.neverOfferBoss ?? undefined,
    neverWantBoss: raw.never_want_boss ?? raw.neverWantBoss ?? undefined,
    neverOfferArch: raw.never_offer_arch ?? raw.neverOfferArch ?? undefined,
    neverWantArch: raw.never_want_arch ?? raw.neverWantArch ?? undefined,
    templateMonsterCount: template.monster_count ?? template.monsterCount ?? undefined,
    templateStepCount: template.step_count ?? template.stepCount ?? undefined,
  };
}

function normalizeServer(raw: any): MetamobServer {
  const gameVersion = raw.game_version ?? raw.gameVersion ?? {};
  return {
    id: Number(raw.id ?? 0),
    name: loc(raw.name) || `Serveur #${raw.id ?? "?"}`,
    community: raw.community ?? undefined,
    gameVersion: loc(gameVersion.name ?? gameVersion) || undefined,
  };
}

function normalizeTradeMonster(raw: any): MetamobTradeMonster {
  const monster = raw.monster ?? raw.monster_type ?? raw.monsterType ?? {};
  return {
    id: Number(raw.id ?? raw.monster_id ?? raw.monsterId ?? monster.id ?? 0),
    codexMonsterId: monsterCodexId(raw) ?? monsterCodexId(monster),
    name: loc(raw.name ?? raw.nom ?? monster.name) || `#${raw.id ?? raw.monster_id ?? "?"}`,
    img: optionalMonsterImg(raw),
    typeId: monsterTypeId(raw) ?? monsterTypeId(monster),
    levelMin: raw.level_min ?? raw.levelMin ?? monster.level_min ?? monster.levelMin ?? undefined,
    levelMax: raw.level_max ?? raw.levelMax ?? monster.level_max ?? monster.levelMax ?? undefined,
    available: Number(raw.available ?? 0) || 0,
    needed: Number(raw.needed ?? 0) || 0,
    coversNeed: Boolean(raw.covers_need ?? raw.coversNeed),
  };
}

function normalizeTradeMatch(raw: any): MetamobTradeMatch {
  const user = raw.user ?? {};
  const quest = raw.quest ?? {};
  const matches = raw.matches ?? {};
  return {
    username: String(user.username ?? raw.username ?? ""),
    characterName: loc(quest.character_name ?? quest.characterName ?? raw.character_name ?? raw.characterName) || "Personnage",
    parallelQuests: quest.parallel_quests ?? quest.parallelQuests ?? undefined,
    lastActive: user.last_active ?? user.lastActive ?? undefined,
    avatar: avatarUrl(user.avatar),
    questSlug: quest.slug ?? undefined,
    score: Number(raw.match_score ?? raw.matchScore ?? 0) || 0,
    theyHaveYouWant: asList(matches.they_have_you_want ?? matches.theyHaveYouWant).map(normalizeTradeMonster),
    youHaveTheyWant: asList(matches.you_have_they_want ?? matches.youHaveTheyWant).map(normalizeTradeMonster),
  };
}

function normalizeUserSearchResult(raw: any): MetamobUserSearchResult {
  return {
    username: String(raw.username ?? ""),
    avatar: avatarUrl(raw.avatar),
    lastActive: raw.last_active ?? raw.lastActive ?? undefined,
  };
}

function normalizeZoneMonster(raw: any): MetamobZoneMonster {
  return {
    ...normalizeMonster(raw),
    required: Number(raw.required ?? 0) || 0,
    zoneStatus: raw.status ?? "incomplete",
    offer: Number(raw.offer ?? 0) || 0,
    want: Number(raw.want ?? 0) || 0,
  };
}

function normalizeZone(raw: any): MetamobZone {
  return {
    id: Number(raw.id ?? 0),
    name: loc(raw.name) || `Zone #${raw.id ?? "?"}`,
    completed: Number(raw.completed ?? 0) || 0,
    total: Number(raw.total ?? 0) || 0,
    subzones: asList(raw.subzones).map((s) => ({
      id: Number(s.id ?? 0),
      name: loc(s.name) || `Sous-zone #${s.id ?? "?"}`,
      completed: Number(s.completed ?? 0) || 0,
      total: Number(s.total ?? 0) || 0,
      monsters: asList(s.monsters).map(normalizeZoneMonster),
    })),
  };
}

function normalizeKraloveEvent(raw: any): MetamobKraloveEvent {
  const server = raw.server ?? {};
  return {
    id: Number(raw.id ?? 0),
    datetime: String(raw.event_datetime ?? raw.eventDatetime ?? raw.datetime ?? ""),
    description: String(raw.description ?? ""),
    creator: String(raw.creator ?? ""),
    server: loc(server.name ?? server) || "Serveur",
    serverId: server.id ?? raw.server_id ?? raw.serverId ?? undefined,
    participantsCount: Number(raw.participants_count ?? raw.participantsCount ?? 0) || 0,
    characterCount: Number(raw.character_count ?? raw.characterCount ?? 0) || 0,
    messagesCount: Number(raw.messages_count ?? raw.messagesCount ?? 0) || 0,
    participants: asList(raw.participants).map((p) => ({
      username: String(p.username ?? ""),
      characterCount: Number(p.character_count ?? p.characterCount ?? 0) || 0,
    })),
    messages: asList(raw.messages).map((m) => ({
      username: String(m.username ?? ""),
      content: String(m.content ?? ""),
      createdAt: String(m.created_at ?? m.createdAt ?? ""),
    })),
  };
}

// ─── API publique ────────────────────────────────────────────────────────────

// Quêtes (chasses) publiques d'un utilisateur. Sert aussi à valider la connexion.
export async function getMetamobQuests(
  pseudo: string,
  apiKey: string,
  signal?: AbortSignal,
): Promise<MetamobQuest[]> {
  const res = await mmRequest<any>(`/users/${encodeURIComponent(pseudo)}/quests`, apiKey, { signal });
  return asList(res).map(normalizeQuest).filter((q) => q.slug);
}

export async function getMetamobServers(apiKey: string, signal?: AbortSignal): Promise<MetamobServer[]> {
  const res = await mmRequest<any>("/servers", apiKey, { signal });
  return asList(res).map(normalizeServer).filter((s) => s.id);
}

// Tous les monstres d'une chasse (paginés si besoin), normalisés.
export async function getMetamobMonsters(
  pseudo: string,
  slug: string,
  apiKey: string,
  signal?: AbortSignal,
): Promise<MetamobMonster[]> {
  const out: MetamobMonster[] = [];
  const limit = 200; // borne batch documentée
  let offset = 0;
  for (let i = 0; i < 40; i++) {
    const res = await mmRequest<any>(
      `/users/${encodeURIComponent(pseudo)}/quests/${encodeURIComponent(slug)}?limit=${limit}&offset=${offset}`,
      apiKey,
      { signal },
    );
    const list = asList(res);
    out.push(...list.map(normalizeMonster));
    const total = paginationTotal(res);
    offset += list.length;
    if (list.length < limit) break; // dernière page
    if (typeof total === "number" && offset >= total) break;
    if (list.length === 0) break;
  }
  // Dédoublonne par id (au cas où la pagination chevauche).
  const byId = new Map<number, MetamobMonster>();
  for (const m of out) if (m.id) byId.set(m.id, m);
  return [...byId.values()];
}

// Met à jour la quantité possédée d'un monstre (0–30) sur une chasse de l'utilisateur.
export async function setMetamobQuantity(
  slug: string,
  monsterId: number,
  quantity: number,
  apiKey: string,
  signal?: AbortSignal,
): Promise<void> {
  const q = Math.max(0, Math.min(30, Math.round(quantity)));
  await mmRequest<void>(`/quests/${encodeURIComponent(slug)}/monsters/${monsterId}`, apiKey, {
    method: "PATCH",
    body: { quantity: q },
    signal,
  });
}

export async function updateMetamobQuestSettings(
  slug: string,
  settings: MetamobQuestSettings,
  apiKey: string,
  signal?: AbortSignal,
): Promise<MetamobQuest> {
  const body: Record<string, unknown> = {};
  if (settings.characterName !== undefined) body.character_name = settings.characterName;
  if (settings.parallelQuests !== undefined) body.parallel_quests = settings.parallelQuests;
  if (settings.currentStep !== undefined) body.current_step = settings.currentStep;
  if (settings.showTrades !== undefined) body.show_trades = settings.showTrades;
  if (settings.tradeMode !== undefined) body.trade_mode = settings.tradeMode;
  if (settings.tradeOfferThreshold !== undefined) body.trade_offer_threshold = settings.tradeOfferThreshold;
  if (settings.tradeWantThreshold !== undefined) body.trade_want_threshold = settings.tradeWantThreshold;
  if (settings.neverOfferNormal !== undefined) body.never_offer_normal = settings.neverOfferNormal;
  if (settings.neverWantNormal !== undefined) body.never_want_normal = settings.neverWantNormal;
  if (settings.neverOfferBoss !== undefined) body.never_offer_boss = settings.neverOfferBoss;
  if (settings.neverWantBoss !== undefined) body.never_want_boss = settings.neverWantBoss;
  if (settings.neverOfferArch !== undefined) body.never_offer_arch = settings.neverOfferArch;
  if (settings.neverWantArch !== undefined) body.never_want_arch = settings.neverWantArch;
  const res = await mmRequest<any>(`/quests/${encodeURIComponent(slug)}`, apiKey, {
    method: "PATCH",
    body,
    signal,
  });
  return normalizeQuest(res?.data ?? res);
}

export async function updateMetamobQuantitiesBatch(
  slug: string,
  updates: { monsterId: number; quantity: number }[],
  apiKey: string,
  signal?: AbortSignal,
): Promise<void> {
  for (let i = 0; i < updates.length; i += 200) {
    const chunk = updates.slice(i, i + 200);
    await mmRequest<void>(`/quests/${encodeURIComponent(slug)}/monsters`, apiKey, {
      method: "PATCH",
      body: {
        monsters: chunk.map((u) => ({
          monster_id: u.monsterId,
          quantity: Math.max(0, Math.min(30, Math.round(u.quantity))),
        })),
      },
      signal,
    });
  }
}

export async function resetMetamobQuest(
  slug: string,
  pseudo: string,
  monsters: Pick<MetamobMonster, "id" | "owned">[],
  apiKey: string,
  signal?: AbortSignal,
): Promise<void> {
  // On ne remet à zéro QUE les monstres réellement possédés : le batch passe ainsi de
  // ~plusieurs centaines d'entrées à quelques-unes → on évite les 500/timeouts côté Metamob.
  const toReset = monsters.filter((m) => (m.owned ?? 0) > 0);
  if (toReset.length > 0) {
    await updateMetamobQuantitiesBatch(
      slug,
      toReset.map((m) => ({ monsterId: m.id, quantity: 0 })),
      apiKey,
      signal,
    );
  }
  // ⚠️ Metamob renvoie un 500 (corps vide) sur `PATCH /quests/{slug}` avec `current_step` — y compris
  // current_step=1 — alors que la valeur EST bien appliquée (bug de recalcul serveur après écriture).
  // Les autres champs (parallel_quests, character_name…) répondent 200. On tolère donc CE 500 précis
  // en vérifiant l'état réel : si l'étape est bien revenue à 1, la réinitialisation est un succès.
  try {
    await updateMetamobQuestSettings(slug, { currentStep: 1 }, apiKey, signal);
  } catch (err) {
    if (!(err instanceof ApiError) || err.status !== 500) throw err;
    const quests = await getMetamobQuests(pseudo, apiKey, signal).catch(() => [] as MetamobQuest[]);
    const q = quests.find((x) => x.slug === slug);
    if (q && q.currentStep !== 1) throw err; // l'étape n'a pas été appliquée → vraie erreur
  }
}

// Résultat EFFECTIF d'un réglage de trade : l'override manuel demandé (`tradeOffer`/`tradeWant`)
// PLUS les quantités réellement appliquées par Metamob (`offered`/`wanted` = effective_*), qui
// peuvent différer si un seuil ou une règle de quête borne la valeur (vu : trade_want 3 → effectif 1).
export interface MetamobTradeResult {
  monsterId: number;
  tradeOffer: number | null;
  tradeWant: number | null;
  offered: number;
  wanted: number;
}

export async function setMetamobTradeSettings(
  slug: string,
  monsterId: number,
  tradeOffer: number | null,
  tradeWant: number | null,
  apiKey: string,
  signal?: AbortSignal,
): Promise<MetamobTradeResult> {
  const res = await mmRequest<any>(`/quests/${encodeURIComponent(slug)}/monsters/${monsterId}/trade`, apiKey, {
    method: "PATCH",
    body: { trade_offer: tradeOffer, trade_want: tradeWant },
    signal,
  });
  const d = res?.data ?? res ?? {};
  return {
    monsterId: Number(d.monster_id ?? d.monsterId ?? monsterId),
    tradeOffer: d.trade_offer ?? d.tradeOffer ?? null,
    tradeWant: d.trade_want ?? d.tradeWant ?? null,
    offered: Math.max(0, Number(d.effective_offer ?? d.offer ?? 0) || 0),
    wanted: Math.max(0, Number(d.effective_want ?? d.want ?? 0) || 0),
  };
}

export async function getMetamobTradeMatches(
  slug: string,
  apiKey: string,
  opts: { minParallelQuests?: number; onlyPossibleTrades?: boolean; signal?: AbortSignal } = {},
): Promise<MetamobTradeMatch[]> {
  const res = await mmRequest<any>(
    `/quests/${encodeURIComponent(slug)}/matches${qs({
      limit: 50,
      min_parallel_quests: opts.minParallelQuests,
      only_possible_trades: opts.onlyPossibleTrades ? 1 : undefined,
    })}`,
    apiKey,
    { signal: opts.signal },
  );
  return asList(res).map(normalizeTradeMatch).filter((m) => m.username);
}

export async function searchMetamobUsers(
  apiKey: string,
  opts: { query: string; serverId?: number; activeWithinDays?: number; signal?: AbortSignal },
): Promise<MetamobUserSearchResult[]> {
  const q = opts.query.trim();
  if (q.length < 3) return [];
  const res = await mmRequest<any>(
    `/users/search${qs({
      q,
      server_id: opts.serverId,
      active_within_days: opts.activeWithinDays,
      limit: 50,
    })}`,
    apiKey,
    { signal: opts.signal },
  );
  return asList(res).map(normalizeUserSearchResult).filter((u) => u.username);
}

export async function getMetamobZones(
  slug: string,
  apiKey: string,
  opts: { monsterTypeId?: number; signal?: AbortSignal } = {},
): Promise<MetamobZone[]> {
  const res = await mmRequest<any>(
    `/quests/${encodeURIComponent(slug)}/zones${qs({ monster_type_id: opts.monsterTypeId })}`,
    apiKey,
    { signal: opts.signal },
  );
  return asList(res).map(normalizeZone);
}

export async function getMetamobKraloveEvents(
  apiKey: string,
  opts: { serverId?: number; from?: string; signal?: AbortSignal } = {},
): Promise<MetamobKraloveEvent[]> {
  const res = await mmRequest<any>(
    `/kralove${qs({ server: opts.serverId, from: opts.from })}`,
    apiKey,
    { signal: opts.signal },
  );
  return asList(res).map(normalizeKraloveEvent).filter((e) => e.id);
}

export async function getMetamobKraloveEvent(
  id: number,
  apiKey: string,
  signal?: AbortSignal,
): Promise<MetamobKraloveEvent> {
  const res = await mmRequest<any>(`/kralove/${id}`, apiKey, { signal });
  return normalizeKraloveEvent(res?.data ?? res);
}

// Profil public d'un joueur (avatar, bio, dernière activité + ses chasses publiques).
// Sert à consulter un partenaire d'échange sans quitter l'app.
export interface MetamobUserProfile {
  username: string;
  bio?: string;
  avatar?: string;
  createdAt?: string;
  lastActive?: string;
  quests: MetamobQuest[];
}

export async function getMetamobUser(
  username: string,
  apiKey: string,
  signal?: AbortSignal,
): Promise<MetamobUserProfile> {
  const res = await mmRequest<any>(`/users/${encodeURIComponent(username)}`, apiKey, { signal });
  const raw = res?.data ?? res ?? {};
  return {
    username: String(raw.username ?? username),
    bio: raw.bio ? String(raw.bio) : undefined,
    avatar: avatarUrl(raw.avatar),
    createdAt: raw.created_at ?? raw.createdAt ?? undefined,
    lastActive: raw.last_active ?? raw.lastActive ?? undefined,
    quests: asList(raw.quests).map(normalizeQuest).filter((q) => q.slug),
  };
}
