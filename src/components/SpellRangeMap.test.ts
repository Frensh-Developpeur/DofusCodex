import { describe, it, expect } from "vitest";
import { zoneOffsets, rangeLabel, parseSpellGrades } from "./SpellRangeMap";
import type { SpellLevel } from "../api/dofusdb";

function lvl(p: Partial<SpellLevel>): SpellLevel {
  return {
    grade: 1,
    minPlayerLevel: 1,
    apCost: 3,
    minRange: 0,
    range: 1,
    critProbability: 0,
    damage: [],
    criticalDamage: [],
    chargeScaled: false,
    ...p,
  };
}
const has = (offs: [number, number][], x: number, y: number) => offs.some(([a, b]) => a === x && b === y);

describe("zoneOffsets", () => {
  it("mono-case par défaut (point / taille 0)", () => {
    expect(zoneOffsets(lvl({ zoneShape: 80, zoneSize: 1 }), 1, 0)).toHaveLength(1); // POINT
    expect(zoneOffsets(lvl({ zoneShape: 67, zoneSize: 0 }), 1, 0)).toHaveLength(1); // taille 0
    expect(zoneOffsets(lvl({}), 1, 0)).toHaveLength(1); // pas de zone
  });

  it("cercle de 2 = losange Manhattan ≤ 2 (13 cases)", () => {
    const z = zoneOffsets(lvl({ zoneShape: 67, zoneSize: 2 }), 1, 0);
    expect(z).toHaveLength(13);
    expect(has(z, 0, 0)).toBe(true);
    expect(has(z, 2, 0)).toBe(true);
    expect(has(z, 1, 1)).toBe(true);
    expect(has(z, 3, 0)).toBe(false);
  });

  it("croix cardinale (shape 88) de 1 = 5 cases", () => {
    const z = zoneOffsets(lvl({ zoneShape: 88, zoneSize: 1 }), 1, 0);
    expect(z).toHaveLength(5);
    expect(has(z, 1, 0) && has(z, -1, 0) && has(z, 0, 1) && has(z, 0, -1)).toBe(true);
    expect(has(z, 1, 1)).toBe(false); // pas de diagonale
  });

  it("shape 81 (Libération) = croix de 1, pas un carré", () => {
    const z = zoneOffsets(lvl({ zoneShape: 81, zoneSize: 1 }), 1, 0);
    expect(z).toHaveLength(5);
    expect(has(z, 1, 1)).toBe(false); // serait présent si c'était un carré 3×3
  });

  it("ligne (shape 76) suit la direction du tir", () => {
    const z = zoneOffsets(lvl({ zoneShape: 76, zoneSize: 3 }), 1, 0);
    expect(z).toHaveLength(4); // centre + 3 cases en ligne
    expect(has(z, 3, 0)).toBe(true);
    expect(has(z, 0, 1)).toBe(false);
  });
});

describe("rangeLabel", () => {
  it("portée simple ou plage min-max", () => {
    expect(rangeLabel(lvl({ minRange: 0, range: 5 }))).toBe("5");
    expect(rangeLabel(lvl({ minRange: 2, range: 5 }))).toBe("2-5");
    expect(rangeLabel(lvl({ minRange: 5, range: 5 }))).toBe("5");
  });
});

describe("parseSpellGrades", () => {
  it("parse les paires mobGrade,spellGrade", () => {
    const m = parseSpellGrades("1,1;2,3;5,4");
    expect(m.get(1)).toBe(1);
    expect(m.get(2)).toBe(3);
    expect(m.get(5)).toBe(4);
    expect(m.size).toBe(3);
  });
  it("vide ou invalide → Map vide", () => {
    expect(parseSpellGrades("").size).toBe(0);
    expect(parseSpellGrades(undefined).size).toBe(0);
  });
});
