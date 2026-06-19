import { describe, it, expect } from "vitest";
import { toLocalIsoDate, parseLocalIsoDate, shiftLocalIsoDate } from "./date";

describe("toLocalIsoDate", () => {
  it("formate en YYYY-MM-DD (heure locale)", () => {
    // 19 juin 2026 (mois 0-indexé → 5).
    expect(toLocalIsoDate(new Date(2026, 5, 19))).toBe("2026-06-19");
    expect(toLocalIsoDate(new Date(2026, 0, 3))).toBe("2026-01-03"); // zéro-padding
  });
});

describe("parseLocalIsoDate", () => {
  it("parse à midi local (évite les décalages de fuseau/DST)", () => {
    const d = parseLocalIsoDate("2026-06-19");
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(5);
    expect(d.getDate()).toBe(19);
    expect(d.getHours()).toBe(12);
  });
  it("aller-retour stable", () => {
    expect(toLocalIsoDate(parseLocalIsoDate("2026-02-28"))).toBe("2026-02-28");
  });
});

describe("shiftLocalIsoDate", () => {
  it("décale de N jours, gère les changements de mois/année", () => {
    expect(shiftLocalIsoDate("2026-06-19", 1)).toBe("2026-06-20");
    expect(shiftLocalIsoDate("2026-06-30", 1)).toBe("2026-07-01");
    expect(shiftLocalIsoDate("2026-01-01", -1)).toBe("2025-12-31");
    expect(shiftLocalIsoDate("2026-06-19", 0)).toBe("2026-06-19");
  });
});
