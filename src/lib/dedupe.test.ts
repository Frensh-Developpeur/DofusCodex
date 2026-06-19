import { describe, it, expect } from "vitest";
import { dedupeById } from "./dedupe";

describe("dedupeById", () => {
  it("garde la première occurrence de chaque id, dans l'ordre", () => {
    const out = dedupeById([{ id: 1 }, { id: 2 }, { id: 1 }, { id: 3 }, { id: 2 }]);
    expect(out.map((x) => x.id)).toEqual([1, 2, 3]);
  });
  it("préserve l'objet d'origine (première occurrence)", () => {
    const a = { id: 1, v: "a" };
    const b = { id: 1, v: "b" };
    expect(dedupeById([a, b])[0]).toBe(a);
  });
  it("liste vide → liste vide", () => {
    expect(dedupeById([])).toEqual([]);
  });
});
