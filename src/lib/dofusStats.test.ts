import { describe, it, expect } from "vitest";
import {
  statPointsForLevel,
  baseHpForLevel,
  baseApForLevel,
  baseMpForLevel,
  pointsForCarac,
  maxCaracForPoints,
} from "./dofusStats";
import type { StatTier } from "../api/dofusdb";

// Paliers « Iop Force » : 100 premiers à 1 pt, puis 2, 3, 4.
const IOP: StatTier[] = [
  [0, 1],
  [100, 2],
  [200, 3],
  [300, 4],
];

describe("statPointsForLevel", () => {
  it("0 au niveau 1, +5 par niveau ensuite", () => {
    expect(statPointsForLevel(1)).toBe(0);
    expect(statPointsForLevel(2)).toBe(5);
    expect(statPointsForLevel(200)).toBe(995);
  });
  it("ne descend jamais sous 0", () => {
    expect(statPointsForLevel(0)).toBe(0);
    expect(statPointsForLevel(-10)).toBe(0);
  });
});

describe("base PV / PA / PM", () => {
  it("PV = 55 au niveau 1, +5 par niveau, borné à 200", () => {
    expect(baseHpForLevel(1)).toBe(55);
    expect(baseHpForLevel(200)).toBe(1050);
    expect(baseHpForLevel(300)).toBe(1050); // borné à 200
  });
  it("PA = 6 avant 100, 7 à partir de 100", () => {
    expect(baseApForLevel(99)).toBe(6);
    expect(baseApForLevel(100)).toBe(7);
    expect(baseApForLevel(200)).toBe(7);
  });
  it("PM = 3", () => {
    expect(baseMpForLevel()).toBe(3);
  });
});

describe("pointsForCarac", () => {
  it("0 pour une carac nulle/négative", () => {
    expect(pointsForCarac(0, IOP)).toBe(0);
    expect(pointsForCarac(-5, IOP)).toBe(0);
  });
  it("applique les paliers", () => {
    expect(pointsForCarac(50, IOP)).toBe(50); // 50 × 1
    expect(pointsForCarac(100, IOP)).toBe(100); // 100 × 1
    expect(pointsForCarac(150, IOP)).toBe(200); // 100×1 + 50×2
    expect(pointsForCarac(250, IOP)).toBe(450); // 100×1 + 100×2 + 50×3
  });
  it("coût 1:1 sans paliers", () => {
    expect(pointsForCarac(73, [])).toBe(73);
  });
});

describe("maxCaracForPoints", () => {
  it("inverse de pointsForCarac", () => {
    expect(maxCaracForPoints(0, IOP)).toBe(0);
    expect(maxCaracForPoints(100, IOP)).toBe(100);
    expect(maxCaracForPoints(200, IOP)).toBe(150);
    expect(maxCaracForPoints(450, IOP)).toBe(250);
  });
  it("arrondit vers le bas (points insuffisants pour la carac suivante)", () => {
    // 201 pts : 100 (×1) + 50 (×2=100) = 150 carac, reste 1 pt < 2 → toujours 150.
    expect(maxCaracForPoints(201, IOP)).toBe(150);
  });
  it("1:1 sans paliers", () => {
    expect(maxCaracForPoints(42, [])).toBe(42);
  });
});
