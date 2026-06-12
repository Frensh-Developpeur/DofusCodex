import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  getDbItem,
  getRecipesForResult,
  recipesUsingIngredient,
  subareasHarvesting,
  getItemsByIds,
  type ItemLite,
} from "../api/dofusdb";
import { levelTone } from "../data/meta";
import DofusIcon, { effectIconFromName } from "../components/DofusIcon";
import DetailBack from "../components/DetailBack";
import CraftTree from "../components/CraftTree";
import { ChevronRight, MapPin } from "../components/DofusIcons";
import { Pill, Spinner } from "../components/ui";

// Page détail d'un objet NON-équipement (ressource, consommable, suiveur, objet divers…),
// via DofusDB. Atteinte via /objets/:id quand ItemDetail détecte que l'id n'est pas un
// équipement. Fetch dédupliqué avec l'aiguilleur (même queryKey ["db-item", id]).
export default function ResourceDetail() {
  const { id: idParam } = useParams();
  const id = Number(idParam);

  const { data: item, isLoading } = useQuery({
    queryKey: ["db-item", id],
    queryFn: ({ signal }) => getDbItem(id, signal),
  });
  const effects = (item?.effects ?? []).filter((e) => e.description?.fr);

  // Craft : comment fabriquer cet objet (arbre récursif).
  const craftQ = useQuery({
    queryKey: ["recipe-for", id],
    queryFn: ({ signal }) => getRecipesForResult(id, signal),
    staleTime: Infinity,
    enabled: Number.isFinite(id),
  });
  const recipe = craftQ.data?.[0];

  // Où récolter (sous-zones) → bouton « Voir sur la carte ».
  const harvestQ = useQuery({
    queryKey: ["harvest-zones", id],
    queryFn: ({ signal }) => subareasHarvesting(id, 40, signal),
    staleTime: Infinity,
    enabled: Number.isFinite(id),
  });
  const zones = harvestQ.data ?? [];

  // Permet de crafter (recettes qui consomment cet objet).
  const usesQ = useQuery({
    queryKey: ["recipes-using", id],
    queryFn: ({ signal }) => recipesUsingIngredient(id, 24, signal),
    staleTime: Infinity,
    enabled: Number.isFinite(id),
  });
  const useResultIds = useMemo(() => (usesQ.data ?? []).map((r) => r.resultId), [usesQ.data]);
  const usesItemsQ = useQuery({
    queryKey: ["uses-items", id, useResultIds.length],
    queryFn: ({ signal }) => getItemsByIds(useResultIds, signal),
    enabled: useResultIds.length > 0,
    staleTime: Infinity,
  });
  const usesItems: ItemLite[] = usesItemsQ.data ?? [];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl">
      <DetailBack />

      <div className="glass rounded-3xl p-6">
        {isLoading ? (
          <Spinner label="Chargement de l'objet…" />
        ) : !item ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <DofusIcon name="chestGrey" size={40} />
            <p className="text-slate-300">Détails indisponibles</p>
            <p className="max-w-xs text-sm text-slate-500">Cet objet n'existe plus dans l'encyclopédie (id obsolète).</p>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-glow-purple/25 blur-xl" />
                <img src={item.img} alt={item.name.fr} className="relative h-20 w-20 object-contain" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-extrabold leading-tight text-white">{item.name.fr}</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.level > 1 && <Pill tone={levelTone(item.level)}>Niv. {item.level}</Pill>}
                  {item.type?.name?.fr && (
                    <Pill tone="slate">
                      <DofusIcon name="inventory" size={12} /> {item.type.name.fr}
                    </Pill>
                  )}
                </div>
              </div>
            </div>

            {item.description?.fr && (
              <p className="mt-4 text-sm italic leading-relaxed text-slate-400">{item.description.fr}</p>
            )}

            {effects.length > 0 && (
              <div className="mt-5">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                  <DofusIcon name="characteristic" size={16} /> Effets
                </h3>
                <ul className="space-y-1 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  {effects.map((e, i) => {
                    const ic = effectIconFromName(e.description!.fr);
                    return (
                      <li key={i} className="flex items-center gap-2 text-sm font-medium text-slate-200">
                        {ic && <DofusIcon name={ic} size={15} />}
                        {e.description!.fr}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Recette (craft) — arbre récursif d'ingrédients */}
            {recipe && (
              <div className="mt-5">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                  <DofusIcon name="recipe" size={16} /> Recette
                </h3>
                <CraftTree recipe={recipe} />
              </div>
            )}

            {/* Où récolter + carte */}
            {zones.length > 0 && (
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                    <DofusIcon name="resources" size={16} /> Où récolter
                  </h3>
                  <Link
                    to={`/carte?resource=${id}`}
                    state={{ fromSection: true }}
                    className="no-drag inline-flex items-center gap-1.5 rounded-lg border border-glow-cyan/30 bg-glow-cyan/10 px-2.5 py-1 text-xs font-semibold text-glow-cyan transition hover:bg-glow-cyan/20"
                  >
                    <MapPin className="h-3.5 w-3.5" /> Voir sur la carte
                  </Link>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {zones.map((z) => (
                    <span
                      key={z.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300"
                    >
                      {z.name.fr}
                      {z.level > 0 && <span className="text-[10px] text-slate-500">Niv.{z.level}</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Permet de crafter */}
            {usesItems.length > 0 && (
              <div className="mt-5">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                  <DofusIcon name="iconRecipeGrey" size={16} /> Permet de crafter
                </h3>
                <div className="flex flex-wrap gap-2">
                  {usesItems.map((it) => (
                    <Link
                      key={it.id}
                      to={`/objets/${it.id}`}
                      state={{ fromSection: true }}
                      className="no-drag group inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300 transition hover:border-glow-gold/40 hover:bg-white/10 hover:text-white"
                    >
                      {it.img && <img src={it.img} alt="" loading="lazy" className="h-5 w-5 object-contain" />}
                      <span className="max-w-[12rem] truncate">{it.name.fr}</span>
                      <ChevronRight className="h-3 w-3 text-slate-500 transition group-hover:text-glow-gold" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
