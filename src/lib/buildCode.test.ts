import { describe, it, expect } from "vitest";
import { encodeBuild, decodeBuild, buildShareLink, parseBuildDeepLink } from "./buildCode";
import type { Build } from "../store/store";

function mk(p: Partial<Build> = {}): Build {
  return { id: "b_x", name: "Build", slots: {}, createdAt: 0, ...p };
}

// Reproduit l'encodage base64url pour fabriquer des payloads « à la main » (clés inconnues,
// version arbitraire) sans dépendre des internes du module.
function craft(obj: unknown): string {
  const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
  return "DCB1." + b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

describe("encodeBuild / decodeBuild", () => {
  it("round-trip fidèle sur un build complet", () => {
    const build = mk({
      name: "Cra Feu",
      breedId: 12,
      level: 200,
      slots: { hat: 3142, cloak: 2891, ring1: 5604, dofus1: 1210 },
      caracs: { force: 0, intelligence: 350, chance: 0, agilite: 0, vitalite: 100, sagesse: 0 },
      parch: { intelligence: 100 },
      fm: { hat: { "Vitalité": 80 } },
      exos: { belt: "PA" },
      target: { resPct: [0, 10, 0, 0, 0], resFlat: [0, 0, 0, 0, 0] },
    });
    const res = decodeBuild(encodeBuild(build));
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.draft).toEqual({
      name: "Cra Feu",
      breedId: 12,
      level: 200,
      slots: { hat: 3142, cloak: 2891, ring1: 5604, dofus1: 1210 },
      caracs: { force: 0, intelligence: 350, chance: 0, agilite: 0, vitalite: 100, sagesse: 0 },
      parch: { intelligence: 100 },
      fm: { hat: { "Vitalité": 80 } },
      exos: { belt: "PA" },
      target: { resPct: [0, 10, 0, 0, 0], resFlat: [0, 0, 0, 0, 0] },
    });
  });

  it("omet les champs vides (build minimal → brouillon minimal)", () => {
    const res = decodeBuild(encodeBuild(mk({ name: "Vide", breedId: 1, level: 50 })));
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.draft).toEqual({ name: "Vide", breedId: 1, level: 50, slots: {} });
    expect(res.draft.caracs).toBeUndefined();
    expect(res.draft.fm).toBeUndefined();
    expect(res.draft.target).toBeUndefined();
  });

  it("tolère l'absence du préfixe DCB1.", () => {
    const code = encodeBuild(mk({ name: "Sans préfixe", slots: { hat: 42 } }));
    const stripped = code.replace(/^DCB1\./, "");
    const res = decodeBuild(stripped);
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.draft.name).toBe("Sans préfixe");
    expect(res.draft.slots).toEqual({ hat: 42 });
  });

  it("tolère qu'on colle le lien profond entier", () => {
    const code = encodeBuild(mk({ name: "Lien", slots: { hat: 7 } }));
    const res = decodeBuild(buildShareLink(code));
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.draft.slots).toEqual({ hat: 7 });
  });

  it("rejette une version inconnue sans lever", () => {
    const res = decodeBuild("DCB9." + "eyJ2Ijo5fQ"); // {"v":9}
    expect(res.ok).toBe(false);
    if (res.ok) return;
    expect(res.error).toMatch(/version/i);
  });

  it("rejette un code corrompu sans lever", () => {
    expect(decodeBuild("DCB1.@@@not-base64@@@").ok).toBe(false);
    expect(decodeBuild("DCB1." + btoa("hello world")).ok).toBe(false); // base64 valide mais pas du JSON
    expect(decodeBuild("").ok).toBe(false);
    expect(decodeBuild("   ").ok).toBe(false);
  });

  it("ignore les clés inconnues", () => {
    const res = decodeBuild(craft({ v: 1, n: "X", s: { hat: 1 }, z: 99, extra: "ignore" }));
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    // toEqual ci-dessus garantit déjà l'absence de toute clé inconnue (z, extra).
    expect(res.draft).toEqual({ name: "X", slots: { hat: 1 } });
  });

  it("nettoie les entrées de slots non numériques", () => {
    const res = decodeBuild(craft({ v: 1, s: { hat: 10, bad: "oops", cloak: 20 } }));
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.draft.slots).toEqual({ hat: 10, cloak: 20 });
  });

  it("borne le niveau hors limites", () => {
    const hi = decodeBuild(craft({ v: 1, l: 999 }));
    const lo = decodeBuild(craft({ v: 1, l: 0 }));
    expect(hi.ok && hi.draft.level).toBe(200);
    expect(lo.ok && lo.draft.level).toBe(1);
  });
});

describe("parseBuildDeepLink", () => {
  it("extrait le code d'un lien build", () => {
    expect(parseBuildDeepLink("dofuscodex://build/DCB1.abc-_")).toBe("DCB1.abc-_");
  });

  it("renvoie null pour un lien de reset de mot de passe", () => {
    expect(parseBuildDeepLink("dofuscodex://reset#access_token=xyz&type=recovery")).toBeNull();
  });

  it("renvoie null pour une chaîne quelconque", () => {
    expect(parseBuildDeepLink("https://example.com")).toBeNull();
    expect(parseBuildDeepLink("")).toBeNull();
  });

  it("aller-retour avec buildShareLink", () => {
    const code = encodeBuild(mk({ name: "RT", slots: { hat: 5 } }));
    expect(parseBuildDeepLink(buildShareLink(code))).toBe(code);
  });
});
