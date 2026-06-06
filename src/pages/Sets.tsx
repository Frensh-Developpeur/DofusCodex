import { useQuery, useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "../components/DofusIcons";
import { browseSets, searchSets, getSet, type SetLight } from "../api/dofusdude";
import { getItemsByIds, type ItemLite } from "../api/dofusdb";
import { useDebounce } from "../hooks/useDebounce";
import { useViewState } from "../lib/viewState";
import { levelTone, statRank } from "../data/meta";
import { Pill, SectionHeader, Skeleton, EmptyState, ErrorState, LoadMore, fadeUp } from "../components/ui";
import DofusIcon, { effectIconFromName } from "../components/DofusIcon";
import DetailBack from "../components/DetailBack";
import { goItem } from "../lib/itemNav";

const PAGE = 30;

// Icône d'une panoplie = icône de son premier item. SetLight (liste) ne contient pas
// les pièces → on résout la panoplie (getSet, mis en cache et partagé avec la page détail)
// puis on charge son premier item. Fallback panoplie le temps du chargement / si échec.
function SetItemIcon({ id, size = 28 }: { id: number; size?: number }) {
  const { data: set } = useQuery({
    queryKey: ["set", id],
    queryFn: ({ signal }) => getSet(id, signal),
    staleTime: 1000 * 60 * 30,
  });
  const firstId = set?.equipment_ids?.[0];
  const { data: items } = useQuery({
    queryKey: ["set-first-item", firstId],
    queryFn: ({ signal }) => getItemsByIds([firstId!], signal),
    enabled: !!firstId,
    staleTime: 1000 * 60 * 30,
  });
  const img = items?.[0]?.img;
  if (img)
    return <img src={img} alt="" loading="lazy" className="object-contain" style={{ width: size, height: size }} />;
  return <DofusIcon name="menuItemsets" size={20} />;
}

export default function Sets() {
  const navigate = useNavigate();
  const [search, setSearch] = useViewState("sets:search", "");
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
                onClick={() => navigate(`/panoplies/${s.ankama_id}`, { state: { fromSection: true } })}
                className="glass glass-hover no-drag group flex items-center gap-3 rounded-2xl p-4 text-left"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-glow-purple/30 to-glow-cyan/15 text-glow-violet">
                  <SetItemIcon id={s.ankama_id} size={30} />
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
                        <DofusIcon name="cosmetics" size={12} /> Apparat
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
    </div>
  );
}

// Page détail d'une panoplie (route /panoplies/:id). Les pièces ouvrent leur propre page item.
export function SetDetail() {
  const { id: idParam } = useParams();
  const id = Number(idParam);
  const navigate = useNavigate();

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
        .map(([k, v]) => ({
          count: Number(k),
          effects: (v ?? [])
            .slice()
            .sort((a, b) => statRank(a.type?.name ?? a.formatted) - statRank(b.type?.name ?? b.formatted)),
        }))
        .filter((t) => t.effects.length > 0)
        .sort((a, b) => a.count - b.count)
    : [];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl">
      <DetailBack />

      <div className="glass rounded-2xl ring-1 ring-white/10">
        <div className="flex items-center gap-3 border-b border-white/10 p-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-glow-purple/40 to-glow-cyan/20 text-glow-violet">
            <SetItemIcon id={id} size={28} />
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

        <div className="p-4">
          {isLoading || !set ? (
            <div className="space-y-3">
              <Skeleton className="h-20" />
              <Skeleton className="h-32" />
            </div>
          ) : (
            <>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Pièces</p>
              <div className="mb-5 flex flex-wrap gap-2">
                {(pieces ?? []).map((p: ItemLite) => (
                  <button
                    key={p.id}
                    onClick={() => goItem(navigate, `/objets/${p.id}`)}
                    title={p.name.fr}
                    className="no-drag group flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-void-900/60 transition hover:border-glow-purple/40"
                  >
                    <img src={p.img} alt={p.name.fr} loading="lazy" className="h-9 w-9 object-contain" />
                  </button>
                ))}
                {!pieces && <Skeleton className="h-12 w-full" />}
              </div>

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
                      {t.effects.map((e, i) => {
                        const ic = effectIconFromName(e.type?.name ?? e.formatted);
                        return (
                          <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                            {ic && <DofusIcon name={ic} size={15} />}
                            {e.formatted}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
                {tiers.length === 0 && <p className="text-sm text-slate-500">Pas de bonus renseigné.</p>}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
