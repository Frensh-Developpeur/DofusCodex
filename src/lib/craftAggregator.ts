import { getRecipesForResult, type Recipe } from "../api/dofusdb";

// Agrège récursivement les RESSOURCES DE BASE nécessaires pour fabriquer une liste d'items.
// On déplie chaque recette jusqu'aux feuilles (items sans recette = ressources de base : drop,
// récolte) et on somme les quantités (multipliées le long de l'arbre). Garde-fous : profondeur
// max + anti-cycle (ancestors). Un cache de recettes par itemId évite tout refetch dans un run.
const MAX_DEPTH = 6;

export async function aggregateResources(
  items: { itemId: number; quantity: number }[],
  signal?: AbortSignal,
): Promise<Record<number, number>> {
  const totals: Record<number, number> = {};
  const recipeCache = new Map<number, Recipe | null>();

  async function recipeOf(id: number): Promise<Recipe | null> {
    const cached = recipeCache.get(id);
    if (cached !== undefined) return cached;
    let r: Recipe | null = null;
    try {
      r = (await getRecipesForResult(id, signal))[0] ?? null;
    } catch {
      r = null;
    }
    recipeCache.set(id, r);
    return r;
  }

  async function expand(id: number, qty: number, depth: number, ancestors: Set<number>) {
    const recipe = depth < MAX_DEPTH && !ancestors.has(id) ? await recipeOf(id) : null;
    if (!recipe || !recipe.ingredientIds.length) {
      totals[id] = (totals[id] ?? 0) + qty; // feuille = ressource de base
      return;
    }
    const next = new Set(ancestors).add(id);
    for (let i = 0; i < recipe.ingredientIds.length; i++) {
      await expand(recipe.ingredientIds[i], (recipe.quantities[i] ?? 1) * qty, depth + 1, next);
    }
  }

  for (const it of items) {
    await expand(it.itemId, Math.max(1, it.quantity), 0, new Set());
  }
  return totals;
}
