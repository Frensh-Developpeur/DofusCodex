import { describe, it, expect } from "vitest";
import { spellLevelAt } from "./damage";
import type { ClassSpell, SpellDamage, SpellLevel } from "../api/dofusdb";

function dmg(min: number, max: number, element = 1): SpellDamage {
  return { element, steal: false, min, max, delayed: false, delay: 0, condition: "", conditionLabel: "" };
}
function lvl(p: Partial<SpellLevel>): SpellLevel {
  return {
    grade: 1,
    minPlayerLevel: 1,
    apCost: 3,
    minRange: 1,
    range: 1,
    critProbability: 0,
    damage: [],
    criticalDamage: [],
    chargeScaled: false,
    ...p,
  };
}
function spell(levels: SpellLevel[]): ClassSpell {
  return { id: 1, name: { fr: "Test" }, description: { fr: "" }, img: "", levels, variantId: 0, variantIndex: 0 };
}

describe("spellLevelAt", () => {
  it("null si aucun grade débloqué au niveau du perso", () => {
    const s = spell([lvl({ grade: 1, minPlayerLevel: 50, damage: [dmg(10, 20)] })]);
    expect(spellLevelAt(s, 10)).toBeNull();
  });

  it("renvoie le plus haut grade débloqué quand il n'y a pas de palier suivant", () => {
    const s = spell([lvl({ grade: 1, minPlayerLevel: 1, range: 4, damage: [dmg(30, 40)] })]);
    const cur = spellLevelAt(s, 200);
    expect(cur?.range).toBe(4);
    expect(cur?.damage[0]).toMatchObject({ min: 30, max: 40 });
  });

  it("interpole les dégâts entre deux grades selon le niveau exact", () => {
    const s = spell([
      lvl({ grade: 1, minPlayerLevel: 1, damage: [dmg(10, 20)] }),
      lvl({ grade: 2, minPlayerLevel: 101, damage: [dmg(30, 40)] }),
    ]);
    expect(spellLevelAt(s, 1)?.damage[0]).toMatchObject({ min: 10, max: 20 }); // t=0
    expect(spellLevelAt(s, 51)?.damage[0]).toMatchObject({ min: 20, max: 30 }); // t=0.5
    expect(spellLevelAt(s, 101)?.damage[0]).toMatchObject({ min: 30, max: 40 }); // grade 2 atteint
  });

  it("préserve les champs de zone/portée du grade courant", () => {
    const s = spell([lvl({ grade: 1, minPlayerLevel: 1, range: 6, zoneShape: 67, zoneSize: 2, damage: [dmg(5, 9)] })]);
    const cur = spellLevelAt(s, 50);
    expect(cur?.zoneShape).toBe(67);
    expect(cur?.zoneSize).toBe(2);
  });
});
