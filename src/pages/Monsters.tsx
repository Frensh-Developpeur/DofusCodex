import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search } from "../components/DofusIcons";
import DofusIcon from "../components/DofusIcon";
import { listMonsters } from "../api/dofusdb";
import { useDebounce } from "../hooks/useDebounce";
import { useViewState } from "../lib/viewState";
import { dedupeById } from "../lib/dedupe";
import { levelTone } from "../data/meta";
import { Pill, SectionHeader, Skeleton, EmptyState, ErrorState, LoadMore, fadeUp } from "../components/ui";

export default function Monsters() {
  const navigate = useNavigate();
  const [search, setSearch] = useViewState("monsters:search", "");
  const [bossOnly, setBossOnly] = useViewState("monsters:bossOnly", false);
  const debounced = useDebounce(search);

  const { data, isLoading, isError, error, refetch, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["monsters", debounced, bossOnly],
      queryFn: ({ pageParam, signal }) =>
        listMonsters({ search: debounced, bossOnly, limit: 50, skip: pageParam }, signal),
      initialPageParam: 0,
      getNextPageParam: (last) => {
        const loaded = last.skip + last.data.length;
        return loaded < last.total ? loaded : undefined;
      },
      placeholderData: keepPreviousData,
    });

  const monsters = dedupeById(data?.pages.flatMap((p) => p.data) ?? []);
  const total = data?.pages[0]?.total;

  return (
    <div>
      <SectionHeader
        eyebrow="Encyclopédie"
        title="Monstres"
        subtitle="Recherchez n'importe quel monstre : statistiques, résistances, butin complet et donjons où le croiser."
        right={<Pill tone="rose">{total ?? "—"} monstres</Pill>}
      />

      <div className="glass mb-6 flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un monstre (Bouftou, Dragon Cochon…)"
            className="no-drag w-full rounded-xl border border-white/10 bg-void-800/60 py-2.5 pl-10 pr-3 text-sm text-slate-200 outline-none transition focus:border-glow-purple/50"
          />
        </div>
        <button
          onClick={() => setBossOnly((v) => !v)}
          className={`no-drag inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
            bossOnly
              ? "bg-glow-rose/25 text-white ring-1 ring-glow-rose/40"
              : "bg-white/5 text-slate-400 hover:bg-white/10"
          }`}
        >
          <DofusIcon name="boss" size={14} /> Boss uniquement
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState message={(error as Error)?.message} onRetry={refetch} />
      ) : monsters.length === 0 ? (
        <EmptyState title="Aucun monstre" hint="Essayez un autre nom." />
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.025 } } }}
          className={`grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 ${isFetching ? "opacity-70" : ""}`}
        >
          {monsters.map((m, i) => {
            const levels = (m.grades ?? []).map((g) => g.level).filter((l) => l > 0);
            const minL = levels.length ? Math.min(...levels) : 0;
            const maxL = levels.length ? Math.max(...levels) : 0;
            const lvl = maxL;
            return (
              <motion.button
                key={m.id}
                variants={fadeUp}
                custom={i % 16}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/monstres/${m.id}`, { state: { fromSection: true } })}
                className="glass glass-hover no-drag group flex flex-col items-center rounded-2xl p-4 text-center"
              >
                <div className="relative mb-2">
                  <img
                    src={m.img}
                    alt={m.name.fr}
                    loading="lazy"
                    className="h-16 w-16 object-contain"
                    onError={(e) => (e.currentTarget.style.opacity = "0.2")}
                  />
                  {m.isBoss && (
                    <span className="absolute -right-1 -top-1 rounded-full bg-glow-rose p-0.5">
                      <DofusIcon name="boss" size={12} />
                    </span>
                  )}
                </div>
                <p className="line-clamp-2 text-sm font-semibold leading-tight text-white">{m.name.fr}</p>
                {lvl > 0 && (
                  <Pill tone={levelTone(lvl)} className="mt-1.5">
                    Niv. {minL && minL !== maxL ? `${minL}-${maxL}` : lvl}
                  </Pill>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      )}

      {monsters.length > 0 && (
        <LoadMore
          hasMore={!!hasNextPage}
          loading={isFetchingNextPage}
          onClick={() => fetchNextPage()}
          count={monsters.length}
          total={total}
        />
      )}
    </div>
  );
}
