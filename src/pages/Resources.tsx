import { useMemo, useState } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Boxes, FlaskConical, Cat, Package } from "lucide-react";
import { listItemTypes, browseItems } from "../api/dofusdb";
import { useDebounce } from "../hooks/useDebounce";
import { levelTone } from "../data/meta";
import { Pill, SectionHeader, Skeleton, EmptyState, ErrorState, LoadMore, fadeUp } from "../components/ui";
import ItemModal from "../components/ItemModal";

const PAGE = 48;

const CATEGORIES = [
  { key: "res", label: "Ressources", superTypeId: 9, icon: Boxes },
  { key: "conso", label: "Consommables", superTypeId: 6, icon: FlaskConical },
  { key: "pets", label: "Familiers", superTypeId: 12, icon: Cat },
  { key: "divers", label: "Divers", superTypeId: 14, icon: Package },
] as const;

export default function Resources() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]["key"]>("res");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const debounced = useDebounce(search);

  const { data: types, isLoading: typesLoading } = useQuery({
    queryKey: ["item-types"],
    queryFn: ({ signal }) => listItemTypes(signal),
    staleTime: Infinity,
  });

  const category = CATEGORIES.find((c) => c.key === cat)!;
  const typeIds = useMemo(
    () => (types ?? []).filter((t) => t.superTypeId === category.superTypeId).map((t) => t.id),
    [types, category.superTypeId],
  );

  const browse = useInfiniteQuery({
    queryKey: ["items-browse", cat, debounced],
    queryFn: ({ pageParam, signal }) =>
      browseItems({ typeIds, search: debounced, skip: pageParam, limit: PAGE }, signal),
    initialPageParam: 0,
    getNextPageParam: (last, all) => (last.length === PAGE ? all.flat().length : undefined),
    enabled: typeIds.length > 0,
  });

  const items = browse.data?.pages.flat() ?? [];
  const loading = typesLoading || (browse.isLoading && typeIds.length > 0);

  return (
    <div>
      <SectionHeader
        eyebrow="Encyclopédie"
        title="Objets & Ressources"
        subtitle="Tout ce qui n'est pas équipement : ressources, consommables, familiers, objets divers. Clique pour la fiche complète."
      />

      <div className="glass mb-4 rounded-2xl p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher (ex : Frostiz, Pelote, Ortie…)"
            className="no-drag w-full rounded-xl border border-white/10 bg-void-800/60 py-2.5 pl-10 pr-3 text-sm text-slate-200 outline-none transition focus:border-glow-purple/50"
          />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-1.5">
        {CATEGORIES.map((c) => (
          <button key={c.key} onClick={() => setCat(c.key)} className={chip(cat === c.key)}>
            <c.icon className="h-3.5 w-3.5" /> {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : browse.isError ? (
        <ErrorState message="Impossible de charger les objets." onRetry={() => browse.refetch()} />
      ) : items.length === 0 ? (
        <EmptyState
          title="Aucun objet"
          hint={debounced.trim().length >= 2 ? "Essayez un autre nom." : "Changez de catégorie."}
        />
      ) : (
        <>
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.02 } } }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
          >
            {items.map((it, i) => (
              <motion.button
                key={it.id}
                variants={fadeUp}
                custom={i % 16}
                whileHover={{ y: -4 }}
                onClick={() => setSelected(it.id)}
                className="glass glass-hover no-drag group flex flex-col items-center rounded-2xl p-4 text-center"
              >
                <div className="relative mb-3">
                  <div className="absolute inset-0 rounded-full bg-glow-purple/20 opacity-0 blur-xl transition group-hover:opacity-100" />
                  <img src={it.img} alt={it.name.fr} loading="lazy" className="relative h-16 w-16 object-contain" />
                </div>
                <p className="line-clamp-2 text-sm font-semibold leading-tight text-white">{it.name.fr}</p>
                {it.level > 0 && (
                  <div className="mt-2">
                    <Pill tone={levelTone(it.level)}>Niv. {it.level}</Pill>
                  </div>
                )}
              </motion.button>
            ))}
          </motion.div>

          <LoadMore
            hasMore={!!browse.hasNextPage}
            loading={browse.isFetchingNextPage}
            onClick={() => browse.fetchNextPage()}
            count={items.length}
          />
        </>
      )}

      <AnimatePresence>
        {selected !== null && <ItemModal id={selected} onClose={() => setSelected(null)} onSelectItem={setSelected} />}
      </AnimatePresence>
    </div>
  );
}

function chip(active: boolean) {
  const base = "no-drag inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ";
  return active ? `${base} bg-glow-purple/25 text-white ring-1 ring-glow-purple/40` : `${base} bg-white/5 text-slate-400 hover:bg-white/10`;
}
