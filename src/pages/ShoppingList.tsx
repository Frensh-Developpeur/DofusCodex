import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, X, ChevronRight, MapPin } from "../components/DofusIcons";
import DofusIcon from "../components/DofusIcon";
import { SectionHeader, Pill, Spinner, EmptyState } from "../components/ui";
import { useDebounce } from "../hooks/useDebounce";
import { levelTone } from "../data/meta";
import { useStore, actions, type ShoppingItem } from "../store/store";
import { searchItems, craftableIdsAmong, getItemsByIds, listItemTypes, type ItemLite } from "../api/dofusdb";
import { aggregateResources } from "../lib/craftAggregator";

export default function ShoppingList() {
  const shoppingList = useStore((s) => s.shoppingList);
  const owned = useStore((s) => s.resourceOwned);
  const [term, setTerm] = useState("");
  const debounced = useDebounce(term);

  // Recherche d'item à ajouter — UNIQUEMENT des objets CRAFTABLES (qui ont une recette),
  // pas les ressources brutes (on les obtient via le craft).
  const searchQ = useQuery({
    queryKey: ["sl-search", debounced],
    queryFn: async ({ signal }) => {
      const items = await searchItems(debounced, 24, signal);
      if (!items.length) return [];
      const craftable = await craftableIdsAmong(
        items.map((i) => i.id),
        signal,
      );
      return items.filter((i) => craftable.has(i.id));
    },
    enabled: debounced.trim().length >= 2,
  });

  // Infos (icône/nom/niveau) des items ajoutés.
  const addedIds = useMemo(() => shoppingList.map((it) => it.itemId), [shoppingList]);
  const addedItemsQ = useQuery({
    queryKey: ["sl-added-items", addedIds.join(",")],
    queryFn: ({ signal }) => getItemsByIds(addedIds, signal),
    enabled: addedIds.length > 0,
    staleTime: Infinity,
  });
  const addedMap = useMemo(() => {
    const m = new Map<number, ItemLite>();
    for (const it of addedItemsQ.data ?? []) m.set(it.id, it);
    return m;
  }, [addedItemsQ.data]);

  // Agrégation des ressources de base (signature = liste + quantités).
  const signature = useMemo(() => shoppingList.map((it) => `${it.itemId}x${it.quantity}`).join(","), [shoppingList]);
  const aggQ = useQuery({
    queryKey: ["shopping-agg", signature],
    queryFn: ({ signal }) =>
      aggregateResources(
        shoppingList.map((it) => ({ itemId: it.itemId, quantity: it.quantity })),
        signal,
      ),
    enabled: shoppingList.length > 0,
    placeholderData: keepPreviousData,
  });
  const aggIds = useMemo(() => Object.keys(aggQ.data ?? {}).map(Number), [aggQ.data]);
  const aggItemsQ = useQuery({
    queryKey: ["sl-agg-items", aggIds.join(",")],
    queryFn: ({ signal }) => getItemsByIds(aggIds, signal),
    enabled: aggIds.length > 0,
    staleTime: Infinity,
  });
  const aggMap = useMemo(() => {
    const m = new Map<number, ItemLite>();
    for (const it of aggItemsQ.data ?? []) m.set(it.id, it);
    return m;
  }, [aggItemsQ.data]);

  // Type d'item (Bois, Minerai, Plante…) → nom, pour grouper les ressources.
  const itemTypesQ = useQuery({ queryKey: ["item-types"], queryFn: ({ signal }) => listItemTypes(signal), staleTime: Infinity });
  const typeName = useMemo(() => {
    const m = new Map<number, string>();
    for (const t of itemTypesQ.data ?? []) m.set(t.id, t.name?.fr ?? "");
    return m;
  }, [itemTypesQ.data]);

  // Lignes de ressources (avec niveau + type, résolus dès que les infos sont chargées).
  const rows = useMemo(() => {
    const data = aggQ.data ?? {};
    return Object.entries(data).map(([id, need]) => {
      const rid = Number(id);
      const have = owned[rid] ?? 0;
      const info = aggMap.get(rid);
      return {
        id: rid,
        need,
        have,
        done: have >= need,
        level: info?.level ?? 0,
        typeName: (info?.typeId != null ? typeName.get(info.typeId) : "") || "Autres",
      };
    });
  }, [aggQ.data, owned, aggMap, typeName]);

  // Groupées par type de ressource ; à l'intérieur, triées par niveau décroissant.
  // Les groupes sont ordonnés par leur plus haut niveau (décroissant).
  const groups = useMemo(() => {
    const byType = new Map<string, typeof rows>();
    for (const r of rows) {
      const g = byType.get(r.typeName) ?? [];
      g.push(r);
      byType.set(r.typeName, g);
    }
    return [...byType.entries()]
      .map(([name, items]) => ({
        name,
        items: [...items].sort((a, b) => b.level - a.level || b.need - a.need),
        maxLevel: Math.max(...items.map((i) => i.level || 0)),
      }))
      .sort((a, b) => b.maxLevel - a.maxLevel || a.name.localeCompare(b.name));
  }, [rows]);

  const totalNeed = rows.reduce((s, r) => s + r.need, 0);
  const totalHave = rows.reduce((s, r) => s + Math.min(r.have, r.need), 0);
  const pct = totalNeed > 0 ? Math.round((totalHave / totalNeed) * 100) : 0;

  return (
    <div>
      <SectionHeader
        eyebrow="Monde"
        title="Liste de courses"
        subtitle="Empilez des objets à fabriquer : toutes les ressources de base nécessaires sont cumulées, et vous suivez votre récolte."
        right={shoppingList.length > 0 ? <Pill tone="gold">{pct}%</Pill> : null}
      />

      {/* Ajouter un item */}
      <div className="glass mb-4 rounded-2xl p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Ajouter un objet (équipement, consommable, ressource…)"
            className="no-drag w-full rounded-xl border border-white/10 bg-void-800/60 py-2.5 pl-10 pr-3 text-sm text-slate-200 outline-none transition focus:border-glow-purple/50"
          />
          {term.trim().length >= 2 && (
            <div className="absolute z-30 mt-1 max-h-72 w-full overflow-y-auto rounded-xl border border-white/10 bg-void-900/95 p-1 shadow-xl backdrop-blur">
              {(searchQ.data ?? []).map((it) => (
                <button
                  key={it.id}
                  onClick={() => {
                    actions.addShoppingItem(it.id, 1);
                    setTerm("");
                  }}
                  className="no-drag flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-slate-200 transition hover:bg-white/10"
                >
                  <img src={it.img} alt="" loading="lazy" className="h-7 w-7 object-contain" />
                  <span className="min-w-0 flex-1 truncate">{it.name.fr}</span>
                  <span className="text-[10px] text-slate-500">Niv.{it.level}</span>
                </button>
              ))}
              {searchQ.isFetching && <p className="px-2 py-1.5 text-xs text-slate-500">Recherche…</p>}
              {!searchQ.isFetching && (searchQ.data?.length ?? 0) === 0 && (
                <p className="px-2 py-1.5 text-xs text-slate-500">Aucun objet craftable.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {shoppingList.length === 0 ? (
        <EmptyState title="Liste vide" hint="Cherchez un objet ci-dessus pour l'ajouter à fabriquer." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          {/* À fabriquer */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-white">
                <DofusIcon name="recipe" size={18} /> À fabriquer
              </h2>
              <button
                onClick={() => actions.clearShoppingList()}
                className="no-drag inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <DofusIcon name="closeRed" size={14} /> Vider
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {shoppingList.map((it) => (
                <ShoppingRow key={it.id} item={it} info={addedMap.get(it.itemId)} />
              ))}
            </div>
          </div>

          {/* Ressources nécessaires */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-white">
                <DofusIcon name="resources" size={18} /> Ressources nécessaires
              </h2>
              {totalNeed > 0 && (
                <span className="text-xs text-slate-500">
                  {totalHave}/{totalNeed} unités
                </span>
              )}
            </div>

            {aggQ.isFetching && !aggQ.data ? (
              <Spinner label="Calcul des ressources…" />
            ) : rows.length === 0 ? (
              <p className="text-sm text-slate-500">Aucune ressource.</p>
            ) : (
              <>
                {/* Barre de progression globale */}
                <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-glow-emerald to-emerald-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  {groups.map((g) => (
                    <div key={g.name}>
                      <div className="mb-1 flex items-center gap-2 px-0.5">
                        <DofusIcon name="resources" size={12} className="text-slate-500" />
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{g.name}</span>
                        <span className="text-[10px] text-slate-600">×{g.items.length}</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {g.items.map((r) => (
                          <ResourceRow key={r.id} id={r.id} need={r.need} have={r.have} done={r.done} info={aggMap.get(r.id)} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Ligne « à fabriquer » : item + quantité éditable + suppression.
function ShoppingRow({ item, info }: { item: ShoppingItem; info?: ItemLite }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass flex items-center gap-3 rounded-2xl p-3"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-void-900/60">
        {info?.img ? (
          <img src={info.img} alt="" loading="lazy" className="h-9 w-9 object-contain" />
        ) : (
          <DofusIcon name="chestGrey" size={18} />
        )}
      </span>
      <Link
        to={`/objets/${item.itemId}`}
        state={{ returnTo: "/liste-courses", returnLabel: "Liste de courses" }}
        className="no-drag min-w-0 flex-1 truncate text-sm font-semibold text-white hover:text-glow-violet"
      >
        {info?.name.fr ?? `Objet #${item.itemId}`}
      </Link>
      <input
        type="number"
        min={1}
        value={item.quantity}
        onChange={(e) => actions.updateShoppingQuantity(item.id, Number(e.target.value))}
        className="no-drag w-16 rounded-lg border border-white/10 bg-void-800/60 px-2 py-1 text-center text-sm text-slate-200 outline-none focus:border-glow-purple/50"
      />
      <button
        onClick={() => actions.removeShoppingItem(item.id)}
        title="Retirer"
        className="no-drag shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-white/10 hover:text-glow-rose"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

// Ligne « ressource nécessaire » : possédé / requis, barre, ✓, liens.
function ResourceRow({
  id,
  need,
  have,
  done,
  info,
}: {
  id: number;
  need: number;
  have: number;
  done: boolean;
  info?: ItemLite;
}) {
  const pct = need > 0 ? Math.min(100, Math.round((have / need) * 100)) : 0;
  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl border px-2.5 py-2 transition ${
        done ? "border-glow-emerald/30 bg-glow-emerald/10" : "border-white/5 bg-white/[0.02]"
      }`}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-void-900/60">
        {info?.img ? (
          <img src={info.img} alt="" loading="lazy" className="h-8 w-8 object-contain" />
        ) : (
          <DofusIcon name="chestGrey" size={15} />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <Link
            to={`/objets/${id}`}
            state={{ returnTo: "/liste-courses", returnLabel: "Liste de courses" }}
            className="no-drag min-w-0 flex-1 truncate text-sm text-slate-200 hover:text-white"
          >
            {info?.name.fr ?? `#${id}`}
          </Link>
          {info?.level ? <Pill tone={levelTone(info.level)}>Niv.{info.level}</Pill> : null}
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full ${done ? "bg-glow-emerald" : "bg-glow-gold"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        {/* − (flèche gauche) */}
        <button
          onClick={() => actions.setResourceOwned(id, Math.max(0, have - 1))}
          title="Retirer 1"
          className="no-drag grid h-6 w-6 place-items-center rounded-md text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <ChevronRight className="h-3.5 w-3.5 rotate-180" />
        </button>
        <input
          type="number"
          min={0}
          value={have}
          onChange={(e) => actions.setResourceOwned(id, Number(e.target.value))}
          className="no-drag w-12 rounded-lg border border-white/10 bg-void-800/60 px-1 py-1 text-center text-xs text-slate-200 outline-none focus:border-glow-purple/50"
        />
        {/* + (flèche droite) */}
        <button
          onClick={() => actions.setResourceOwned(id, have + 1)}
          title="Ajouter 1"
          className="no-drag grid h-6 w-6 place-items-center rounded-md text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
        <span className="px-0.5 text-xs font-semibold text-slate-400">/ {need}</span>
        {/* Valider : trophée quand complet */}
        <button
          onClick={() => actions.setResourceOwned(id, done ? 0 : need)}
          title={done ? "Tout remettre à zéro" : "Marquer comme complet"}
          className={`no-drag grid h-6 w-6 place-items-center rounded-md transition hover:bg-white/10 ${
            done ? "bg-glow-emerald/20" : "opacity-35 hover:opacity-100"
          }`}
        >
          <DofusIcon name="success" size={15} />
        </button>
        <Link
          to={`/carte?resource=${id}`}
          state={{ fromSection: true }}
          className="no-drag grid h-6 w-6 place-items-center rounded-md text-slate-500 transition hover:bg-white/10 hover:text-glow-cyan"
        >
          <MapPin title="Voir les zones de récolte sur la carte" className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
