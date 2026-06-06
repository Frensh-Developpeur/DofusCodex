import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "../components/DofusIcons";
import DofusIcon from "../components/DofusIcon";
import { listHavenbagThemes, getHavenbagFurnitures, havenbagMapImg } from "../api/dofusdb";
import { SectionHeader, Skeleton, EmptyState, ErrorState, Pill, fadeUp } from "../components/ui";
import { useViewState } from "../lib/viewState";
import DetailBack from "../components/DetailBack";

export default function Havenbags() {
  const navigate = useNavigate();
  const [search, setSearch] = useViewState("havenbags:search", "");
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["havenbag-themes"],
    queryFn: ({ signal }) => listHavenbagThemes(signal),
    staleTime: Infinity,
  });

  const themes = useMemo(() => {
    const q = search.trim().toLowerCase();
    const all = data ?? [];
    return q ? all.filter((t) => t.name.fr.toLowerCase().includes(q)) : all;
  }, [data, search]);

  return (
    <div>
      <SectionHeader
        eyebrow="Encyclopédie"
        title="Havre-Sacs"
        subtitle="Tous les thèmes de havre-sac de Dofus. Clique pour voir la map en grand et ses décorations."
        right={data ? <Pill tone="purple">{data.length} havre-sacs</Pill> : undefined}
      />

      <div className="glass mb-6 rounded-2xl p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un havre-sac (ex : Amakna, Bonta, Frigost…)"
            className="no-drag w-full rounded-xl border border-white/10 bg-void-800/60 py-2.5 pl-10 pr-3 text-sm text-slate-200 outline-none transition focus:border-glow-purple/50"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState message="Impossible de charger les havre-sacs." onRetry={refetch} />
      ) : themes.length === 0 ? (
        <EmptyState title="Aucun havre-sac" hint="Essayez un autre nom." />
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.025 } } }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        >
          {themes.map((t, i) => (
            <motion.button
              key={t.id}
              variants={fadeUp}
              custom={i % 16}
              whileHover={{ y: -4 }}
              onClick={() => navigate(`/havre-sac/${t.id}`, { state: { fromSection: true } })}
              className="glass glass-hover no-drag group overflow-hidden rounded-2xl text-left"
            >
              <div className="relative h-32 overflow-hidden bg-gradient-to-br from-void-700 to-void-900">
                <span className="absolute inset-0 grid place-items-center text-white/10">
                  <DofusIcon name="havenbag" size={40} className="opacity-20" />
                </span>
                <img
                  src={t.img}
                  alt={t.name.fr}
                  loading="lazy"
                  onError={(e) => (e.currentTarget.style.opacity = "0")}
                  className="relative h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/55 to-transparent" />
                <span className="absolute right-2 top-2 rounded-md bg-black/45 px-1.5 py-0.5 text-[10px] font-bold text-white/90 backdrop-blur">
                  #{t.id}
                </span>
              </div>
              <div className="p-3">
                <p className="truncate text-center text-sm font-semibold text-white">{t.name.fr}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// Page détail d'un havre-sac (route /havre-sac/:id) : map + décorations.
export function HavenbagDetail() {
  const { id: idParam } = useParams();
  const id = Number(idParam);
  const [big, setBig] = useState(false);

  const { data: themes } = useQuery({
    queryKey: ["havenbag-themes"],
    queryFn: ({ signal }) => listHavenbagThemes(signal),
    staleTime: Infinity,
  });
  const theme = themes?.find((t) => t.id === id);

  const { data: furnitures, isLoading } = useQuery({
    queryKey: ["havenbag-furnitures", id],
    queryFn: ({ signal }) => getHavenbagFurnitures(id, signal),
    staleTime: 1000 * 60 * 30,
    enabled: !!theme,
  });

  // Repli d'échelle si le rendu n'existe pas à cette taille.
  const downgrade = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.dataset.scale === "1") {
      img.dataset.scale = "0.5";
      img.src = havenbagMapImg(theme!.mapId, "0.5");
    } else if (img.dataset.scale === "0.5") {
      img.dataset.scale = "0.25";
      img.src = havenbagMapImg(theme!.mapId, "0.25");
    } else {
      img.style.display = "none";
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl">
      <DetailBack />

      <div className="glass flex flex-col overflow-hidden rounded-2xl ring-1 ring-white/10">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-glow-purple/40 to-glow-cyan/20 text-glow-violet">
              <DofusIcon name="havenbag" size={22} />
            </span>
            <div className="min-w-0">
              <h2 className="truncate font-display text-lg font-bold text-white">{theme?.name.fr ?? "Havre-Sac"}</h2>
              <p className="text-xs text-slate-500">Havre-Sac #{id}</p>
            </div>
          </div>
          <button
            onClick={() => setBig(true)}
            className="no-drag inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <DofusIcon name="zoom" size={14} /> Agrandir
          </button>
        </div>

        <div className="p-4">
          {!theme ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <>
              <div className="grid min-h-[180px] place-items-center overflow-hidden rounded-xl border border-white/10 bg-void-900">
                <img
                  src={havenbagMapImg(theme.mapId, "0.5")}
                  alt={`Map du havre-sac ${theme.name.fr}`}
                  data-scale="0.5"
                  onError={downgrade}
                  className="block max-h-[52vh] w-auto max-w-full object-contain"
                />
              </div>

              <div className="mt-5">
                <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <DofusIcon name="cupboard" size={14} /> Décorations
                  {furnitures && <span className="text-slate-600">· {furnitures.length}</span>}
                </p>
                {isLoading ? (
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-12" />
                    ))}
                  </div>
                ) : !furnitures?.length ? (
                  <p className="text-sm text-slate-500">Aucune décoration référencée.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {furnitures.map((f) => (
                      <div
                        key={f.gfxId}
                        className="grid h-12 w-12 place-items-center rounded-lg border border-white/10 bg-void-900/60 p-1"
                      >
                        <img
                          src={f.img}
                          alt=""
                          loading="lazy"
                          onError={(e) => (e.currentTarget.style.display = "none")}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Map en grand — même mécanique que la map interactive des monstres (zoom + croix rouge). */}
      <AnimatePresence>
        {big && theme && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setBig(false)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="glass relative max-h-[92vh] w-full max-w-4xl overflow-auto rounded-3xl p-5 ring-1 ring-white/10"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 font-display text-lg font-bold text-white">
                  <DofusIcon name="havenbag" size={20} /> {theme.name.fr}
                </h3>
                <button
                  onClick={() => setBig(false)}
                  className="no-drag rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <DofusIcon name="closeRed" size={16} />
                </button>
              </div>
              <div className="grid place-items-center overflow-auto rounded-xl border border-white/10 bg-void-900">
                <img
                  src={havenbagMapImg(theme.mapId, "1")}
                  alt={`Map du havre-sac ${theme.name.fr}`}
                  data-scale="1"
                  onError={downgrade}
                  className="block w-auto max-w-full object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
