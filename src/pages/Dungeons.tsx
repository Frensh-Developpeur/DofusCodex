import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useInfiniteQuery, useQueries, keepPreviousData } from "@tanstack/react-query";
import { motion } from "framer-motion";
import DofusIcon from "../components/DofusIcon";
import { Search, ChevronRight, Check } from "../components/DofusIcons";
import { listDungeons, getMonstersLite, type Dungeon, type MonsterLite } from "../api/dofusdb";
import { useDebounce } from "../hooks/useDebounce";
import { useViewState } from "../lib/viewState";
import { hasGuide } from "../data/dungeonGuides";
import { levelTone } from "../data/meta";
import { useStore, actions } from "../store/store";
import { dedupeById } from "../lib/dedupe";
import { Pill, SectionHeader, Skeleton, EmptyState, ErrorState, LoadMore, fadeUp } from "../components/ui";

const RANGES = [
  { label: "Tous", min: undefined, max: undefined },
  { label: "1-50", min: 1, max: 50 },
  { label: "50-110", min: 50, max: 110 },
  { label: "110-170", min: 110, max: 170 },
  { label: "170-200", min: 170, max: 200 },
  { label: "200+", min: 200, max: undefined },
];

export default function Dungeons() {
  const [search, setSearch] = useViewState("dungeons:search", "");
  const [range, setRange] = useViewState("dungeons:range", 0);
  const [favOnly, setFavOnly] = useViewState("dungeons:favOnly", false);
  const debounced = useDebounce(search);
  const r = RANGES[range];

  const favorites = useStore((s) => s.favoriteDungeons);
  const done = useStore((s) => s.doneDungeons);

  const { data, isLoading, isError, error, refetch, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["dungeons", debounced, r.min, r.max],
      queryFn: ({ pageParam, signal }) =>
        listDungeons({ search: debounced, minLevel: r.min, maxLevel: r.max, limit: 50, skip: pageParam }, signal),
      initialPageParam: 0,
      getNextPageParam: (last) => {
        const loaded = last.skip + last.data.length;
        return loaded < last.total ? loaded : undefined;
      },
      placeholderData: keepPreviousData,
    });

  const all = dedupeById(data?.pages.flatMap((p) => p.data) ?? []);
  const total = data?.pages[0]?.total;
  const dungeons = favOnly ? all.filter((d) => favorites.includes(d.id)) : all;

  // Resolve boss thumbnails: gather every monster id, fetch in chunks of 50, cache.
  const monsterIds = useMemo(() => {
    const s = new Set<number>();
    for (const d of all) for (const m of d.monsters ?? []) s.add(m);
    return [...s];
  }, [all]);

  const chunks = useMemo(() => {
    const out: number[][] = [];
    for (let i = 0; i < monsterIds.length; i += 50) out.push(monsterIds.slice(i, i + 50));
    return out;
  }, [monsterIds]);

  const monsterQueries = useQueries({
    queries: chunks.map((chunk) => ({
      queryKey: ["monsters-lite", chunk],
      queryFn: ({ signal }: { signal: AbortSignal }) => getMonstersLite(chunk, signal),
      staleTime: 1000 * 60 * 30,
    })),
  });

  const resolved = monsterQueries.filter((q) => q.isSuccess).length;
  const monsterMap = useMemo(() => {
    const m = new Map<number, MonsterLite>();
    for (const q of monsterQueries) for (const mon of q.data ?? []) m.set(mon.id, mon);
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolved]);

  function bossOf(d: Dungeon): MonsterLite | undefined {
    const ids = d.monsters ?? [];
    // DofusDB lists the main boss last; some dungeons flag several bosses
    // (e.g. Comte Harebourg) → scan from the end for the last flagged one.
    for (let i = ids.length - 1; i >= 0; i--) {
      const m = monsterMap.get(ids[i]);
      if (m?.isBoss) return m;
    }
    // Fallback: the last *declared* monster that's loaded.
    for (let i = ids.length - 1; i >= 0; i--) {
      const m = monsterMap.get(ids[i]);
      if (m) return m;
    }
    return undefined;
  }

  return (
    <div>
      <SectionHeader
        eyebrow="Guides"
        title="Donjons"
        subtitle="Sélectionnez un donjon pour ouvrir son guide animé : mécaniques de boss, roster et résistances."
        right={<Pill tone="ember">{total ?? "—"} donjons</Pill>}
      />

      {/* Avertissement — guides rédigés, pas forcément parfaits. Masqué en overlay (place). */}
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-glow-gold/25 bg-glow-gold/10 p-4 overlay:hidden">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-glow-gold/15 ring-1 ring-glow-gold/30">
          <DofusIcon name="info" size={20} />
        </span>
        <div className="min-w-0">
          <p className="font-display text-sm font-bold text-glow-gold">Guides v1 — en amélioration continue</p>
          <p className="mt-0.5 text-sm leading-snug text-slate-300">
            Les guides de donjon couvrent les mécaniques essentielles, mais ne sont pas forcément
            parfaits ni exhaustifs. À compléter avec votre propre expérience du combat.
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="glass mb-6 flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un donjon…"
            className="no-drag w-full rounded-xl border border-white/10 bg-void-800/60 py-2.5 pl-10 pr-3 text-sm text-slate-200 outline-none transition focus:border-glow-purple/50"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {RANGES.map((rg, i) => (
            <button
              key={rg.label}
              onClick={() => setRange(i)}
              className={`no-drag rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                range === i
                  ? "bg-glow-purple/25 text-white ring-1 ring-glow-purple/40"
                  : "bg-white/5 text-slate-400 hover:bg-white/10"
              }`}
            >
              {rg.label}
            </button>
          ))}
          <button
            onClick={() => setFavOnly((v) => !v)}
            className={`no-drag inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              favOnly
                ? "bg-glow-gold/25 text-white ring-1 ring-glow-gold/40"
                : "bg-white/5 text-slate-400 hover:bg-white/10"
            }`}
          >
            <DofusIcon name={favOnly ? "starFilled" : "starEmpty"} size={14} /> Favoris
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState message={(error as Error)?.message} onRetry={refetch} />
      ) : dungeons.length === 0 ? (
        <EmptyState title="Aucun donjon trouvé" hint="Essayez un autre nom ou une autre tranche de niveau." />
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.03 } } }}
          className={`grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? "opacity-70" : ""}`}
        >
          {dungeons.map((d, i) => {
            const tone = levelTone(d.optimalPlayerLevel);
            const isFav = favorites.includes(d.id);
            const isDone = done.includes(d.id);
            const authored = hasGuide(d.id);
            const boss = bossOf(d);
            return (
              <motion.div key={d.id} variants={fadeUp} custom={i % 12}>
                <Link
                  to={`/donjons/${d.id}`} state={{ fromSection: true }}
                  className={`glass glass-hover group relative flex h-full flex-col rounded-2xl p-4 ${
                    isDone ? "ring-1 ring-glow-emerald/40" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Vignette du boss */}
                    <div className="relative h-16 w-16 shrink-0">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-glow-ember/30 to-glow-rose/20 opacity-50 blur-md transition group-hover:opacity-90" />
                      <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-void-700/60">
                        {boss?.img ? (
                          <img
                            src={boss.img}
                            alt={boss.name.fr}
                            loading="lazy"
                            className="h-14 w-14 object-contain drop-shadow-[0_4px_10px_rgba(255,93,143,0.35)]"
                            onError={(e) => (e.currentTarget.style.visibility = "hidden")}
                          />
                        ) : (
                          <DofusIcon name="dungeon" size={26} className="opacity-80" />
                        )}
                      </div>
                      {isDone && (
                        <span className="absolute -right-1 -top-1 rounded-full bg-glow-emerald p-0.5 ring-2 ring-void-800">
                          <Check className="h-3 w-3 text-void-900" />
                        </span>
                      )}
                    </div>

                    {/* Nom + boss + niveau */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-2 font-display font-bold leading-tight text-white">
                          {d.name.fr}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            actions.toggleFavoriteDungeon(d.id);
                          }}
                          className="no-drag -mr-1 -mt-1 shrink-0 rounded-md p-1 text-slate-500 transition hover:bg-white/10 hover:text-glow-gold"
                          title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                        >
                          <DofusIcon name={isFav ? "starFilled" : "starEmpty"} size={16} />
                        </button>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <Pill tone={tone}>Niv. {d.optimalPlayerLevel}</Pill>
                        {boss && (
                          <span className="inline-flex min-w-0 items-center gap-1 text-[11px] text-glow-rose/90">
                            <DofusIcon name="boss" size={12} />
                            <span className="truncate">{boss.name.fr}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Méta bas de carte */}
                  <div className="mt-3 flex items-center gap-3 border-t border-white/5 pt-2.5 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <DofusIcon name="dungeonDoor" size={14} /> {d.mapIds?.length ?? 0} salles
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <DofusIcon name="bestiary" size={14} /> {d.monsters?.length ?? 0} ennemis
                    </span>
                    {authored && (
                      <span
                        className="inline-flex items-center gap-1 text-glow-violet/80"
                        title="Guide rédigé disponible"
                      >
                        <DofusIcon name="book" size={14} /> Guide
                      </span>
                    )}
                    <ChevronRight className="ml-auto h-4 w-4 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-glow-violet" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {!favOnly && all.length > 0 && (
        <LoadMore
          hasMore={!!hasNextPage}
          loading={isFetchingNextPage}
          onClick={() => fetchNextPage()}
          count={all.length}
          total={total}
        />
      )}
    </div>
  );
}
