import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "./DofusIcons";
import DofusIcon from "./DofusIcon";
import { getRecipesForResult, getItemsByIds, type Recipe } from "../api/dofusdb";

const MAX_DEPTH = 5;

// Arbre de craft : liste les ingrédients d'une recette, chacun dépliable s'il est
// lui-même craftable (récursif, lazy — la recette d'un ingrédient n'est chargée qu'à
// l'ouverture). Garde-fous : profondeur max + anti-cycle (ancêtres).
export default function CraftTree({ recipe }: { recipe: Recipe }) {
  return (
    <div className="flex flex-col gap-1">
      {recipe.ingredientIds.map((id, i) => (
        <CraftIngredient
          key={`${id}-${i}`}
          itemId={id}
          quantity={recipe.quantities[i] ?? 1}
          depth={1}
          ancestors={new Set([recipe.resultId])}
        />
      ))}
    </div>
  );
}

function CraftIngredient({
  itemId,
  quantity,
  depth,
  ancestors,
}: {
  itemId: number;
  quantity: number;
  depth: number;
  ancestors: Set<number>;
}) {
  const [open, setOpen] = useState(false);
  const itemQ = useQuery({
    queryKey: ["item-lite", itemId],
    queryFn: ({ signal }) => getItemsByIds([itemId], signal).then((r) => r[0] ?? null),
    staleTime: Infinity,
  });
  const canRecurse = depth < MAX_DEPTH && !ancestors.has(itemId);
  const recipeQ = useQuery({
    queryKey: ["recipe-for", itemId],
    queryFn: ({ signal }) => getRecipesForResult(itemId, signal),
    enabled: open && canRecurse,
    staleTime: Infinity,
  });
  const sub = recipeQ.data?.[0];
  const item = itemQ.data;
  const indent = (depth - 1) * 14;

  return (
    <div>
      <div
        className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-2 py-1.5"
        style={{ marginLeft: indent }}
      >
        {canRecurse ? (
          <button
            onClick={() => setOpen((o) => !o)}
            title={open ? "Replier" : "Voir comment crafter cet ingrédient"}
            className="no-drag grid h-5 w-5 shrink-0 place-items-center rounded text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <ChevronRight className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-90" : ""}`} />
          </button>
        ) : (
          <span className="w-5 shrink-0" />
        )}
        <Link
          to={`/objets/${itemId}`}
          state={{ fromSection: true }}
          className="no-drag group flex min-w-0 flex-1 items-center gap-2 text-sm text-slate-200"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-void-900/60">
            {item?.img ? (
              <img src={item.img} alt="" loading="lazy" className="h-7 w-7 object-contain" />
            ) : (
              <DofusIcon name="chestGrey" size={16} />
            )}
          </span>
          <span className="font-bold text-glow-gold">{quantity}×</span>
          <span className="min-w-0 flex-1 truncate transition group-hover:text-white">
            {item?.name.fr ?? `#${itemId}`}
          </span>
          <ChevronRight className="h-3 w-3 shrink-0 text-slate-600 transition group-hover:text-glow-violet" />
        </Link>
      </div>
      {open && canRecurse && (
        <div className="mt-1 flex flex-col gap-1">
          {recipeQ.isLoading ? (
            <p className="text-[11px] text-slate-500" style={{ marginLeft: indent + 30 }}>
              Chargement…
            </p>
          ) : sub ? (
            sub.ingredientIds.map((id, i) => (
              <CraftIngredient
                key={`${id}-${i}`}
                itemId={id}
                quantity={sub.quantities[i] ?? 1}
                depth={depth + 1}
                ancestors={new Set([...ancestors, itemId])}
              />
            ))
          ) : (
            <p className="text-[11px] text-slate-500" style={{ marginLeft: indent + 30 }}>
              Ressource de base — obtenue par drop ou récolte.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
