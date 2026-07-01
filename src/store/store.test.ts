import { describe, it, expect } from "vitest";
import { actions, storeApi } from "./store";
import { encodeBuild } from "../lib/buildCode";

describe("builds — sauvegarde / mise à jour / import", () => {
  it("saveBuild puis updateBuild persistent dans l'état", () => {
    const id = actions.saveBuild("T", { hat: 100 }, { breedId: 5, level: 120 });
    const created = storeApi.getState().builds.find((b) => b.id === id);
    expect(created?.slots).toEqual({ hat: 100 });
    expect(created?.level).toBe(120);

    actions.updateBuild(id, { level: 150, slots: { hat: 100, cloak: 200 } });
    const updated = storeApi.getState().builds.find((b) => b.id === id);
    expect(updated?.level).toBe(150);
    expect(updated?.slots).toEqual({ hat: 100, cloak: 200 });
  });

  it("importBuildFromCode crée un NOUVEAU build sans écraser", () => {
    const before = storeApi.getState().builds.length;
    const code = encodeBuild({ id: "x", name: "Partagé", slots: { amulet: 42 }, createdAt: 0, breedId: 3, level: 200 });
    const res = actions.importBuildFromCode(code);
    expect("id" in res).toBe(true);
    if (!("id" in res)) return;
    const builds = storeApi.getState().builds;
    expect(builds.length).toBe(before + 1);
    const imported = builds.find((b) => b.id === res.id);
    expect(imported?.name).toBe("Partagé");
    expect(imported?.slots).toEqual({ amulet: 42 });
    expect(imported?.breedId).toBe(3);
  });

  it("importBuildFromCode renvoie une erreur sur code invalide (sans lever)", () => {
    expect("error" in actions.importBuildFromCode("DCB1.@@@")).toBe(true);
  });
});
