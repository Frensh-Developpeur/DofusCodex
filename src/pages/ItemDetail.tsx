import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronRight } from "../components/DofusIcons";
import { getEquipment, getSet } from "../api/dofusdude";
import { monstersDroppingItem, getItemsByIds, type ItemLite } from "../api/dofusdb";
import { effectTone, levelTone, statRank } from "../data/meta";
import DofusIcon, { effectIconFromName } from "../components/DofusIcon";
import DetailBack from "../components/DetailBack";
import { goItem } from "../lib/itemNav";
import { Pill, Spinner } from "../components/ui";
import ResourceDetail from "./ResourceDetail";

// Page détail d'un ÉQUIPEMENT (route /objets/:id). DofusDude ne connaît que les
// équipements → si l'id n'en est pas un, on délègue à la page ressource dédiée
// (ResourceDetail, qui interroge DofusDB). Même URL, deux vues distinctes.
export default function ItemDetail() {
  const { id: idParam } = useParams();
  const id = Number(idParam);
  const navigate = useNavigate();

  const equip = useQuery({
    queryKey: ["item-equip", id],
    queryFn: ({ signal }) => getEquipment(id, signal).catch(() => null),
  });
  const item = equip.data ?? null;
  const equipSettled = equip.isSuccess || equip.isError;

  const setId = item?.parent_set?.id;
  const { data: set } = useQuery({
    queryKey: ["set", setId],
    queryFn: ({ signal }) => getSet(setId!, signal),
    enabled: !!setId,
  });

  const { data: setPieces } = useQuery({
    queryKey: ["set-pieces", setId, set?.equipment_ids],
    queryFn: ({ signal }) => getItemsByIds(set!.equipment_ids, signal),
    enabled: !!set?.equipment_ids?.length,
    staleTime: 1000 * 60 * 30,
  });

  const recipeIds = item?.recipe?.map((r) => r.item_ankama_id) ?? [];
  const { data: recipeItems } = useQuery({
    queryKey: ["recipe-items", id, recipeIds.join(",")],
    queryFn: ({ signal }) => getItemsByIds(recipeIds, signal),
    enabled: recipeIds.length > 0,
    staleTime: 1000 * 60 * 30,
  });
  const recipeMap = new Map<number, ItemLite>((recipeItems ?? []).map((it) => [it.id, it]));

  const { data: droppers } = useQuery({
    queryKey: ["droppers", id],
    queryFn: ({ signal }) => monstersDroppingItem(id, 18, signal),
    enabled: !!item,
  });

  // Pas un équipement → ressource/consommable/divers : page dédiée (DofusDB).
  if (equipSettled && !item) return <ResourceDetail />;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl">
      <DetailBack />

      <div className="glass rounded-3xl p-6">
        {!item ? (
          <Spinner label="Chargement de l'objet…" />
        ) : item ? (
          <>
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-glow-purple/25 blur-xl" />
                <img
                  src={item.image_urls.sd ?? item.image_urls.icon}
                  alt={item.name}
                  className="relative h-20 w-20 object-contain"
                />
              </div>
              <div>
                <h2 className="font-display text-2xl font-extrabold leading-tight text-white">{item.name}</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Pill tone={levelTone(item.level)}>Niv. {item.level}</Pill>
                  <Pill tone="slate">{item.type.name}</Pill>
                  {item.is_weapon && (
                    <Pill tone="ember">
                      <DofusIcon name="weapon" size={12} /> Arme
                    </Pill>
                  )}
                </div>
              </div>
            </div>

            {item.description && (
              <p className="mt-4 text-sm italic leading-relaxed text-slate-400">{item.description}</p>
            )}

            {item.is_weapon && (
              <div className="mt-4 flex flex-wrap gap-2">
                {item.ap_cost != null && <Pill tone="cyan">{item.ap_cost} PA</Pill>}
                {item.range != null && (
                  <Pill tone="emerald">
                    <DofusIcon name="po" size={12} /> Portée{" "}
                    {item.range.min === item.range.max ? item.range.max : `${item.range.min}-${item.range.max}`}
                  </Pill>
                )}
                {item.critical_hit_probability != null && (
                  <Pill tone="gold">CC 1/{item.critical_hit_probability}</Pill>
                )}
                {item.max_cast_per_turn != null && <Pill tone="slate">{item.max_cast_per_turn}× / tour</Pill>}
              </div>
            )}

            {item.effects && item.effects.length > 0 && (
              <div className="mt-5">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                  <DofusIcon name="characteristic" size={16} /> Caractéristiques
                </h3>
                <ul className="space-y-1 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  {item.effects.map((e, i) => {
                    const ic = effectIconFromName(e.type.name);
                    return (
                      <li key={i} className={`flex items-center gap-2 text-sm font-medium ${effectTone(e.type.name)}`}>
                        {ic && <DofusIcon name={ic} size={15} />}
                        {e.formatted}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {item.recipe && item.recipe.length > 0 && (
              <div className="mt-5">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                  <DofusIcon name="recipe" size={16} /> Recette
                </h3>
                <div className="flex flex-col gap-1.5">
                  {item.recipe.map((r, i) => {
                    const ing = recipeMap.get(r.item_ankama_id);
                    return (
                      <button
                        key={i}
                        onClick={() => goItem(navigate, `/objets/${r.item_ankama_id}`)}
                        title={ing?.name.fr ?? labelSubtype(r.item_subtype)}
                        className="no-drag group flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-left text-xs text-slate-200 transition hover:border-glow-purple/40 hover:bg-white/10"
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-void-900/60">
                          {ing?.img ? (
                            <img src={ing.img} alt="" loading="lazy" className="h-7 w-7 object-contain" />
                          ) : (
                            <DofusIcon name="chestGrey" size={16} />
                          )}
                        </span>
                        <span className="font-bold text-glow-gold">{r.quantity}×</span>
                        <span className="min-w-0 flex-1 truncate">{ing?.name.fr ?? labelSubtype(r.item_subtype)}</span>
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-500 transition group-hover:text-glow-violet" />
                      </button>
                    );
                  })}
                </div>
                <p className="mt-1.5 text-[11px] text-slate-500">{item.recipe.length} ingrédients nécessaires.</p>
              </div>
            )}

            {item.parent_set && (
              <div className="mt-5 rounded-2xl border border-glow-purple/20 bg-glow-purple/5 p-4">
                <button
                  onClick={() => setId && navigate(`/panoplies/${setId}`)}
                  className="no-drag group flex w-full items-center gap-2 text-left text-sm font-bold text-white"
                >
                  <DofusIcon name="menuItemsets" size={16} /> Panoplie : {item.parent_set.name}
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500 transition group-hover:text-glow-violet" />
                </button>
                {set?.equipment_ids && <p className="mt-1 text-xs text-slate-400">{set.equipment_ids.length} pièces</p>}

                {setPieces && setPieces.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {setPieces.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => goItem(navigate, `/objets/${p.id}`)}
                        title={p.name.fr}
                        className={`no-drag grid h-10 w-10 place-items-center rounded-lg border bg-void-900/60 transition hover:border-glow-purple/50 ${
                          p.id === id ? "border-glow-purple/60 ring-1 ring-glow-purple/40" : "border-white/10"
                        }`}
                      >
                        <img src={p.img} alt={p.name.fr} loading="lazy" className="h-8 w-8 object-contain" />
                      </button>
                    ))}
                  </div>
                )}

                {set?.effects && Object.values(set.effects).some((tier) => tier && tier.length > 0) && (
                  <div className="mt-3 space-y-3">
                    {Object.entries(set.effects).map(([count, tier]) =>
                      tier && tier.length > 0 ? (
                        <div key={count}>
                          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-glow-violet">
                            {count} pièces
                          </p>
                          <ul className="space-y-0.5">
                            {tier
                              .slice()
                              .sort((a, b) => statRank(a.type.name) - statRank(b.type.name))
                              .map((e, j) => {
                                const ic = effectIconFromName(e.type.name);
                                return (
                                  <li key={j} className={`flex items-center gap-1.5 text-xs ${effectTone(e.type.name)}`}>
                                    {ic && <DofusIcon name={ic} size={13} />}
                                    {e.formatted}
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      ) : null,
                    )}
                  </div>
                )}
              </div>
            )}

            {droppers && droppers.length > 0 && (
              <div className="mt-5">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                  <DofusIcon name="bestiary" size={16} /> Droppé par
                </h3>
                <div className="flex flex-wrap gap-2">
                  {droppers.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => navigate(`/monstres/${m.id}`)}
                      title={`Voir ${m.name.fr}`}
                      className="no-drag group inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300 transition hover:border-glow-rose/40 hover:bg-white/10 hover:text-white"
                    >
                      {m.img && <img src={m.img} alt="" className="h-5 w-5 object-contain" />}
                      {m.name.fr}
                      {m.grades?.[0]?.level ? <span className="text-[10px] text-slate-500">Niv.{m.grades[0].level}</span> : null}
                      <ChevronRight className="h-3 w-3 text-slate-500 transition group-hover:text-glow-rose" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </motion.div>
  );
}

function labelSubtype(s: string): string {
  const map: Record<string, string> = {
    resources: "Ressource",
    equipment: "Équipement",
    consumables: "Consommable",
    quest_items: "Objet de quête",
  };
  return map[s] ?? s;
}
