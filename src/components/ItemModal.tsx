import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { X, Hammer, Swords, Crosshair, Sparkles, Layers, Skull, Package } from "lucide-react";
import { getEquipment, getSet } from "../api/dofusdude";
import { monstersDroppingItem, getDbItem } from "../api/dofusdb";
import { effectTone, levelTone } from "../data/meta";
import DofusIcon, { effectIconFromName } from "./DofusIcon";
import { Pill, Spinner, ErrorState } from "./ui";

export default function ItemModal({
  id,
  onClose,
}: {
  id: number;
  onClose: () => void;
  onSelectItem?: (id: number) => void;
}) {
  // L'endpoint DofusDude ne connaît que les équipements → on avale le 404 et on
  // bascule sur DofusDB (ressources, suiveurs, consommables, objets de quête).
  // Clé isolée (≠ Builder) pour ne pas hériter d'un état d'erreur partagé.
  const equip = useQuery({
    queryKey: ["item-equip", id],
    queryFn: ({ signal }) => getEquipment(id, signal).catch(() => null),
  });
  const item = equip.data ?? null;
  const needFallback = equip.isSuccess && item == null;

  const fallback = useQuery({
    queryKey: ["db-item", id],
    queryFn: ({ signal }) => getDbItem(id, signal),
    enabled: needFallback,
  });
  const dbItem = fallback.data ?? null;

  // « settled » = on a fini d'essayer partout. Tant que ce n'est pas le cas → spinner
  // (et surtout PAS d'erreur prématurée tant que le repli DofusDB n'a pas répondu).
  const equipSettled = equip.isSuccess || equip.isError;
  const fallbackSettled = fallback.isSuccess || fallback.isError;
  const settled = equipSettled && (!needFallback || fallbackSettled);
  const notFound = settled && !item && !dbItem; // introuvable des deux côtés (id mort)
  const refetch = () => (needFallback ? fallback.refetch() : equip.refetch());

  const setId = item?.parent_set?.id;
  const { data: set } = useQuery({
    queryKey: ["set", setId],
    queryFn: ({ signal }) => getSet(setId!, signal),
    enabled: !!setId,
  });

  // Reverse drop: monsters that drop this item (Ankama ids match across both APIs).
  const { data: droppers } = useQuery({
    queryKey: ["droppers", id],
    queryFn: ({ signal }) => monstersDroppingItem(id, 18, signal),
    enabled: !!item,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="glass relative max-h-[82vh] w-full max-w-lg overflow-y-auto rounded-3xl p-6"
      >
        <button
          onClick={onClose}
          className="no-drag absolute right-4 top-4 rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {!settled ? (
          <Spinner label="Chargement de l'objet…" />
        ) : item ? (
          <>{/* équipement (DofusDude) — vue riche */}</>
        ) : dbItem ? (
          <DbItemView item={dbItem} />
        ) : notFound ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <Package className="h-10 w-10 text-slate-600" />
            <p className="text-slate-300">Détails indisponibles</p>
            <p className="max-w-xs text-sm text-slate-500">
              Cet objet n'existe plus dans l'encyclopédie (id obsolète dans le guide).
            </p>
          </div>
        ) : (
          <ErrorState onRetry={refetch} />
        )}
        {settled && item && (
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
              <div className="pr-8">
                <h2 className="font-display text-2xl font-extrabold leading-tight text-white">
                  {item.name}
                </h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Pill tone={levelTone(item.level)}>Niv. {item.level}</Pill>
                  <Pill tone="slate">{item.type.name}</Pill>
                  {item.is_weapon && (
                    <Pill tone="ember">
                      <Swords className="h-3 w-3" /> Arme
                    </Pill>
                  )}
                </div>
              </div>
            </div>

            {item.description && (
              <p className="mt-4 text-sm italic leading-relaxed text-slate-400">{item.description}</p>
            )}

            {/* Weapon stats */}
            {item.is_weapon && (
              <div className="mt-4 flex flex-wrap gap-2">
                {item.ap_cost != null && <Pill tone="cyan">{item.ap_cost} PA</Pill>}
                {item.range != null && (
                  <Pill tone="emerald">
                    <Crosshair className="h-3 w-3" /> Portée{" "}
                    {item.range.min === item.range.max
                      ? item.range.max
                      : `${item.range.min}-${item.range.max}`}
                  </Pill>
                )}
                {item.critical_hit_probability != null && (
                  <Pill tone="gold">CC 1/{item.critical_hit_probability}</Pill>
                )}
                {item.max_cast_per_turn != null && (
                  <Pill tone="slate">{item.max_cast_per_turn}× / tour</Pill>
                )}
              </div>
            )}

            {/* Effects */}
            {item.effects && item.effects.length > 0 && (
              <div className="mt-5">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                  <Sparkles className="h-4 w-4 text-glow-violet" /> Caractéristiques
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

            {/* Recipe */}
            {item.recipe && item.recipe.length > 0 && (
              <div className="mt-5">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                  <Hammer className="h-4 w-4 text-glow-gold" /> Recette
                </h3>
                <div className="flex flex-wrap gap-2">
                  {item.recipe.map((r, i) => (
                    <span
                      key={i}
                      className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300"
                    >
                      <span className="font-bold text-glow-gold">{r.quantity}×</span>{" "}
                      {labelSubtype(r.item_subtype)}
                    </span>
                  ))}
                </div>
                <p className="mt-1.5 text-[11px] text-slate-500">
                  {item.recipe.length} ingrédients nécessaires.
                </p>
              </div>
            )}

            {/* Set */}
            {item.parent_set && (
              <div className="mt-5 rounded-2xl border border-glow-purple/20 bg-glow-purple/5 p-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                  <Layers className="h-4 w-4 text-glow-violet" /> Panoplie : {item.parent_set.name}
                </h3>
                {set?.equipment_ids && (
                  <p className="mt-1 text-xs text-slate-400">{set.equipment_ids.length} pièces</p>
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
                            {tier.map((e, j) => {
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

            {/* Droppé par */}
            {droppers && droppers.length > 0 && (
              <div className="mt-5">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                  <Skull className="h-4 w-4 text-glow-rose" /> Droppé par
                </h3>
                <div className="flex flex-wrap gap-2">
                  {droppers.map((m) => (
                    <span
                      key={m.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300"
                    >
                      {m.img && <img src={m.img} alt="" className="h-5 w-5 object-contain" />}
                      {m.name.fr}
                      {m.grades?.[0]?.level ? (
                        <span className="text-[10px] text-slate-500">Niv.{m.grades[0].level}</span>
                      ) : null}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// Vue pour les objets non-équipement (ressources, suiveurs, consommables…), via DofusDB.
function DbItemView({ item }: { item: import("../api/dofusdb").DbItem }) {
  const effects = (item.effects ?? []).filter((e) => e.description?.fr);
  return (
    <>
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-2xl bg-glow-purple/25 blur-xl" />
          <img src={item.img} alt={item.name.fr} className="relative h-20 w-20 object-contain" />
        </div>
        <div className="pr-8">
          <h2 className="font-display text-2xl font-extrabold leading-tight text-white">{item.name.fr}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {item.level > 1 && <Pill tone={levelTone(item.level)}>Niv. {item.level}</Pill>}
            {item.type?.name?.fr && (
              <Pill tone="slate">
                <Package className="h-3 w-3" /> {item.type.name.fr}
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
            <Sparkles className="h-4 w-4 text-glow-violet" /> Effets
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
    </>
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
