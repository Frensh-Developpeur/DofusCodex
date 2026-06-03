import type { BuildSlots } from "../store/store";

// Rendu du personnage équipé via le renderer de DofusRoom (POST /buildroom/skin/liveRenderAjax,
// piloté depuis le process Electron — cf. main.cjs). L'endpoint filtre l'Origin, d'où le passage
// par le pont IPC. Hors Electron (navigateur), `window.dofusCodex.renderSkin` est absent → null,
// et l'UI retombe sur l'illustration de classe.

// id breed DofusDB → nom de classe attendu par le renderer (complet, minuscule, sans accent).
export const CLASS_RENDER: Record<number, string> = {
  1: "feca", 2: "osamodas", 3: "enutrof", 4: "sram", 5: "xelor", 6: "ecaflip",
  7: "eniripsa", 8: "iop", 9: "cra", 10: "sadida", 11: "sacrieur", 12: "pandawa",
  13: "roublard", 14: "zobal", 15: "steamer", 16: "eliotrope", 17: "huppermage",
  18: "ouginak", 20: "forgelance",
};

export interface SkinPayload {
  character: string;
  gender: "m" | "f";
  orientation: number;
  items: {
    amulet: string | null;
    ring: { top: string | null; bottom: string | null };
    shield: string | null;
    weapon: string | null;
    hat: string | null;
    cape: string | null;
    belt: string | null;
    boots: string | null;
    creature: string | null;
    trophus: Record<string, string | null>;
  };
}

const id = (slots: BuildSlots, key: string): string | null =>
  typeof slots[key] === "number" ? String(slots[key]) : null;

// Construit le payload du renderer depuis nos slots internes. Renvoie null si la classe
// n'a pas de rendu connu (alors l'appelant garde l'illustration).
export function buildSkinPayload(
  breedId: number | null | undefined,
  slots: BuildSlots,
  gender: "m" | "f" = "m",
  orientation = 1,
): SkinPayload | null {
  if (breedId == null || !CLASS_RENDER[breedId]) return null;
  return {
    character: CLASS_RENDER[breedId],
    gender,
    orientation,
    items: {
      amulet: id(slots, "amulet"),
      ring: { top: id(slots, "ring1"), bottom: id(slots, "ring2") },
      shield: id(slots, "shield"),
      weapon: id(slots, "weapon"),
      hat: id(slots, "hat"),
      cape: id(slots, "cloak"),
      belt: id(slots, "belt"),
      boots: id(slots, "boots"),
      creature: id(slots, "petmount"),
      trophus: {
        "1": id(slots, "dofus1"), "2": id(slots, "dofus2"), "3": id(slots, "dofus3"),
        "4": id(slots, "dofus4"), "5": id(slots, "dofus5"), "6": id(slots, "dofus6"),
      },
    },
  };
}

// Clé stable (pour le cache TanStack Query) résumant le look rendu.
export function skinKey(p: SkinPayload): string {
  const it = p.items;
  return [
    p.character, p.gender, p.orientation,
    it.hat, it.cape, it.amulet, it.ring.top, it.ring.bottom, it.belt,
    it.boots, it.shield, it.weapon, it.creature,
    it.trophus["1"], it.trophus["2"], it.trophus["3"], it.trophus["4"], it.trophus["5"], it.trophus["6"],
  ].join("|");
}

// Appelle le pont Electron. Renvoie un data URL PNG, ou null (hors Electron / échec / timeout).
export async function renderSkin(payload: SkinPayload): Promise<string | null> {
  const bridge = window.dofusCodex?.renderSkin;
  if (!bridge) return null;
  try {
    return await bridge(payload);
  } catch {
    return null;
  }
}
