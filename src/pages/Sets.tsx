import { useState } from "react";
import { useQuery, useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Layers, Sparkles, X } from "lucide-react";
import { browseSets, searchSets, getSet, type SetLight } from "../api/dofusdude";
import { getItemsByIds, type ItemLite } from "../api/dofusdb";
import { useDebounce } from "../hooks/useDebounce";
import { levelTone } from "../data/meta";
import { Pill, SectionHeader, Skeleton, EmptyState, ErrorState, LoadMore, fadeUp } from "../components/ui";
import ItemModal from "../components/ItemModal";

const PAGE = 30;

export default function Sets() {
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);
  const debounced = useDebounce(search);
  const hasSearch = debounced.trim().length >= 2;

  const browse = useInfiniteQuery({
    queryKey: ["sets-browse"],
    queryFn: ({ pageParam, signal }) => browseSets({ pageNumber: pageParam, pageSize: PAGE, sort: "desc" }, signal),
    initialPageParam: 1,
    getNextPageParam: (last, all) => (last.length === PAGE ? all.length + 1 : undefined),
    enabled: !hasSearch,
  });

  const searchQ = useQuery({
    queryKey: ["sets-search", debounced],
    queryFn: ({ signal }) => searchSets(debounced, 40, signal),
    enabled: hasSearch,
    placeholderData: keepPreviousData,
  });

  const sets: SetLight[] = hasSearch ? (searchQ.data ?? []) : (browse.data?.pages.flat() ?? []);
  const isLoading = hasSearch ? searchQ.isLoading : browse.isLoading;
  const isError = hasSearch ? searchQ.isError : browse.isError;

  return (
    <div>
      <SectionHeader
        eyebrow="Encyclopédie"
        title="Panoplies"
        subtitle="Toutes les panoplies du jeu : leurs bonus selon le nombre d'items équipés et les pièces qui les composent."
      />

      <div className="glass mb-6 rounded-2xl p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une panoplie (ex : Gelano, Bouftou, Royale…)"
            className="no-drag w-full rounded-xl border border-white/10 bg-void-800/60 py-2.5 pl-10 pr-3 text-sm text-slate-200 outline-none transition focus:border-glow-purple/50"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          message="Impossible de charger les panoplies."
          onRetry={() => (hasSearch ? searchQ.refetch() : browse.refetch())}
        />
      ) : sets.length === 0 ? (
        <EmptyState title="Aucune panoplie" hint="Essayez un autre nom." />
      ) : (
        <>
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.02 } } }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {sets.map((s, i) => (
              <motion.button
                key={s.ankama_id}
                variants={fadeUp}
                custom={i % 18}
                whileHover={{ y: -3 }}
                onClick={() => setOpenId(s.ankama_id)}
                className="glass glass-hover no-drag group flex items-center gap-3 rounded-2xl p-4 text-left"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-glow-purple/30 to-glow-cyan/15 text-glow-violet">
                  <Layers className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">{s.name}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <Pill tone={levelTone(s.level)}>Niv. {s.level}</Pill>
                    <Pill tone="slate">
                      {s.items} item{s.items > 1 ? "s" : ""}
                    </Pill>
                    {s.contains_cosmetics_only && (
                      <Pill tone="cyan">
                        <Sparkles className="h-3 w-3" /> Apparat
                      </Pill>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>

          {!hasSearch && (
            <LoadMore
              hasMore={!!browse.hasNextPage}
              loading={browse.isFetchingNextPage}
              onClick={() => browse.fetchNextPage()}
              count={sets.length}
            />
          )}
        </>
      )}

      <AnimatePresence>{openId !== null && <SetModal id={openId} onClose={() => setOpenId(null)} />}</AnimatePresence>
    </div>
  );
}

function SetModal({ id, onClose }: { id: number; onClose: () => void }) {
  const [piece, setPiece] = useState<number | null>(null);
  const { data: set, isLoading } = useQuery({
    queryKey: ["set", id],
    queryFn: ({ signal }) => getSet(id, signal),
    staleTime: 1000 * 60 * 30,
  });
  const { data: pieces } = useQuery({
    queryKey: ["set-pieces", id, set?.equipment_ids],
    queryFn: ({ signal }) => getItemsByIds(set!.equipment_ids, signal),
    enabled: !!set?.equipment_ids?.length,
    staleTime: 1000 * 60 * 30,
  });

  // Paliers de bonus (clé = nombre d'items équipés), triés croissant, vides ignorés.
  const tiers = set?.effects
    ? Object.entries(set.effects)
        .map(([k, v]) => ({ count: Number(k), effects: v ?? [] }))
        .filter((t) => t.effects.length > 0)
        .sort((a, b) => a.count - b.count)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="glass flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl ring-1 ring-white/10"
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-glow-purple/40 to-glow-cyan/20 text-glow-violet">
              <Layers className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="truncate font-display text-lg font-bold text-white">{set?.name ?? "Panoplie"}</h2>
              {set && (
                <p className="text-xs text-slate-500">
                  {set.equipment_ids.length} pièces · niveau max {set.highest_equipment_level ?? "?"}
                </p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="no-drag rounded-lg bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {isLoading || !set ? (
            <div className="space-y-3">
              <Skeleton className="h-20" />
              <Skeleton className="h-32" />
            </div>
          ) : (
            <>
              {/* Pièces */}
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Pièces</p>
              <div className="mb-5 flex flex-wrap gap-2">
                {(pieces ?? []).map((p: ItemLite) => (
                  <button
                    key={p.id}
                    onClick={() => setPiece(p.id)}
                    title={p.name.fr}
                    className="no-drag group flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-void-900/60 transition hover:border-glow-purple/40"
                  >
                    <img src={p.img} alt={p.name.fr} loading="lazy" className="h-9 w-9 object-contain" />
                  </button>
                ))}
                {!pieces && <Skeleton className="h-12 w-full" />}
              </div>

              {/* Bonus par palier */}
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Bonus de panoplie</p>
              <div className="space-y-3">
                {tiers.map((t) => (
                  <div key={t.count} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-md bg-glow-purple/20 px-2 py-0.5 text-xs font-bold text-glow-violet">
                        {t.count} items
                      </span>
                    </div>
                    <ul className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
                      {t.effects.map((e, i) => (
                        <li key={i} className="text-sm text-slate-300">
                          {e.formatted}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {tiers.length === 0 && <p className="text-sm text-slate-500">Pas de bonus renseigné.</p>}
              </div>
            </>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {piece !== null && <ItemModal id={piece} onClose={() => setPiece(null)} onSelectItem={setPiece} />}
      </AnimatePresence>
    </motion.div>
  );
}
