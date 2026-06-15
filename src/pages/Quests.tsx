import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useInfiniteQuery, useQuery, keepPreviousData } from "@tanstack/react-query";
import { motion } from "framer-motion";
import DofusIcon from "../components/DofusIcon";
import { Search, ChevronRight } from "../components/DofusIcons";
import { listQuests, listQuestCategories } from "../api/dofusdb";
import { useDebounce } from "../hooks/useDebounce";
import { useViewState } from "../lib/viewState";
import { levelTone } from "../data/meta";
import { dedupeById } from "../lib/dedupe";
import { Pill, SectionHeader, Skeleton, EmptyState, ErrorState, LoadMore, fadeUp } from "../components/ui";

const RANGES = [
  { label: "Tous", min: undefined, max: undefined },
  { label: "1-50", min: 1, max: 50 },
  { label: "50-110", min: 50, max: 110 },
  { label: "110-170", min: 110, max: 170 },
  { label: "170-200", min: 170, max: 200 },
];

export default function Quests() {
  const [search, setSearch] = useViewState("quests:search", "");
  const [range, setRange] = useViewState("quests:range", 0);
  const [categoryId, setCategoryId] = useViewState("quests:category", 0);
  const [dungeonOnly, setDungeonOnly] = useViewState("quests:dungeonOnly", false);
  const debounced = useDebounce(search);
  const r = RANGES[range];

  const categoriesQ = useQuery({ queryKey: ["quest-categories"], queryFn: ({ signal }) => listQuestCategories(signal), staleTime: Infinity });
  const categoryName = useMemo(() => {
    const m = new Map<number, string>();
    for (const c of categoriesQ.data ?? []) m.set(c.id, c.name.fr);
    return m;
  }, [categoriesQ.data]);

  const { data, isLoading, isError, error, refetch, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["quests", debounced, r.min, r.max, categoryId, dungeonOnly],
      queryFn: ({ pageParam, signal }) =>
        listQuests(
          { search: debounced, minLevel: r.min, maxLevel: r.max, categoryId: categoryId || undefined, dungeonOnly, limit: 50, skip: pageParam },
          signal,
        ),
      initialPageParam: 0,
      getNextPageParam: (last) => {
        const loaded = last.skip + last.data.length;
        return loaded < last.total ? loaded : undefined;
      },
      placeholderData: keepPreviousData,
    });

  const all = dedupeById(data?.pages.flatMap((p) => p.data) ?? []);
  const total = data?.pages[0]?.total;
  const quests = all;

  return (
    <div>
      <SectionHeader
        eyebrow="Jeu"
        title="Quêtes"
        subtitle="Parcourez les quêtes du jeu par catégorie et niveau, ouvrez le détail (étapes, objectifs, récompenses) et cochez celles que vous avez terminées."
        right={<Pill tone="ember">{total ?? "—"} quêtes</Pill>}
      />

      <div className="glass mb-6 flex flex-col gap-4 rounded-2xl p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une quête…"
              className="no-drag w-full rounded-xl border border-white/10 bg-void-800/60 py-2.5 pl-10 pr-3 text-sm text-slate-200 outline-none transition focus:border-glow-purple/50"
            />
          </div>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            className="no-drag rounded-xl border border-white/10 bg-void-800/60 px-3 py-2.5 text-sm text-slate-200 outline-none transition focus:border-glow-purple/50"
          >
            <option value={0}>Toutes catégories</option>
            {(categoriesQ.data ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name.fr}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {RANGES.map((rg, i) => (
            <button key={rg.label} onClick={() => setRange(i)} className={chip(range === i)}>
              {rg.label}
            </button>
          ))}
          <button onClick={() => setDungeonOnly((v) => !v)} className={chip(dungeonOnly, "purple")}>
            <DofusIcon name="questDungeon" size={14} /> Donjon
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState message={(error as Error)?.message} onRetry={refetch} />
      ) : quests.length === 0 ? (
        <EmptyState title="Aucune quête trouvée" hint="Essayez un autre nom, une autre catégorie ou tranche de niveau." />
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.02 } } }}
          className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${isFetching ? "opacity-70" : ""}`}
        >
          {quests.map((q, i) => {
            const lvl = q.levelMin === q.levelMax ? `Niv. ${q.levelMin}` : `Niv. ${q.levelMin}-${q.levelMax}`;
            return (
              <motion.div key={q.id} variants={fadeUp} custom={i % 12}>
                <Link
                  to={`/quetes/${q.id}`}
                  state={{ returnTo: "/quetes", returnLabel: "Quêtes" }}
                  className="glass glass-hover group relative flex h-full items-center gap-3 rounded-2xl p-4"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-void-900/70 ring-1 ring-white/5">
                    <DofusIcon name="quete" size={18} className="opacity-80" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display font-bold text-white">{q.name.fr}</h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <Pill tone={levelTone(q.levelMax || q.levelMin || 1)}>{lvl}</Pill>
                      {categoryName.get(q.categoryId) && (
                        <span className="truncate text-[11px] text-slate-500">{categoryName.get(q.categoryId)}</span>
                      )}
                      {q.isDungeonQuest && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-glow-violet/90">
                          <DofusIcon name="questDungeon" size={12} /> Donjon
                        </span>
                      )}
                      {q.isPartyQuest && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-glow-gold/90">
                          <DofusIcon name="emote" size={12} /> Groupe
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-glow-violet" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {all.length > 0 && (
        <LoadMore hasMore={!!hasNextPage} loading={isFetchingNextPage} onClick={() => fetchNextPage()} count={all.length} total={total} />
      )}
    </div>
  );
}

function chip(active: boolean, tone: "purple" | "emerald" = "purple") {
  const on = tone === "emerald" ? "bg-glow-emerald/25 text-white ring-1 ring-glow-emerald/40" : "bg-glow-purple/25 text-white ring-1 ring-glow-purple/40";
  const base = "no-drag inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ";
  return active ? `${base} ${on}` : `${base} bg-white/5 text-slate-400 hover:bg-white/10`;
}
