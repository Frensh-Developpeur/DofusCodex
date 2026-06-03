import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Tent, X, Sofa, ExternalLink, Maximize2, Minimize2 } from "lucide-react";
import { listHavenbagThemes, getHavenbagFurnitures, havenbagMapImg, type HavenbagTheme } from "../api/dofusdb";
import { SectionHeader, Skeleton, EmptyState, ErrorState, Pill, fadeUp } from "../components/ui";

export default function Havenbags() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<HavenbagTheme | null>(null);
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
              onClick={() => setOpen(t)}
              className="glass glass-hover no-drag group overflow-hidden rounded-2xl text-left"
            >
              <div className="relative h-32 overflow-hidden bg-gradient-to-br from-void-700 to-void-900">
                <span className="absolute inset-0 grid place-items-center text-white/10">
                  <Tent className="h-10 w-10" />
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

      <AnimatePresence>{open && <HavenbagModal theme={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </div>
  );
}

function HavenbagModal({ theme, onClose }: { theme: HavenbagTheme; onClose: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const { data: furnitures, isLoading } = useQuery({
    queryKey: ["havenbag-furnitures", theme.id],
    queryFn: ({ signal }) => getHavenbagFurnitures(theme.id, signal),
    staleTime: 1000 * 60 * 30,
  });

  // Comme dans Skinator : le <main> (z-10) plafonne notre modal (z-50) sous la chrome
  // (Sidebar z-20 / TitleBar z-30). En agrandi on élève temporairement le <main> au-dessus.
  useEffect(() => {
    if (!expanded) return;
    const main = document.querySelector("main");
    if (!main) return;
    const prev = (main as HTMLElement).style.zIndex;
    (main as HTMLElement).style.zIndex = "50";
    return () => {
      (main as HTMLElement).style.zIndex = prev;
    };
  }, [expanded]);

  // Repli d'échelle si le rendu n'existe pas à cette taille.
  const downgrade = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.dataset.scale === "1") {
      img.dataset.scale = "0.5";
      img.src = havenbagMapImg(theme.mapId, "0.5");
    } else if (img.dataset.scale === "0.5") {
      img.dataset.scale = "0.25";
      img.src = havenbagMapImg(theme.mapId, "0.25");
    } else {
      img.style.display = "none";
    }
  };

  const mapScale = expanded ? "1" : "0.5";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className={
          expanded
            ? "glass fixed inset-3 z-50 flex flex-col overflow-hidden rounded-2xl ring-1 ring-white/10 sm:inset-5 lg:inset-8"
            : "glass flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl ring-1 ring-white/10"
        }
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-glow-purple/40 to-glow-cyan/20 text-glow-violet">
              <Tent className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="truncate font-display text-lg font-bold text-white">{theme.name.fr}</h2>
              <p className="text-xs text-slate-500">Havre-Sac #{theme.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`https://dofusdb.fr/fr/database/havenbag/${theme.id}`}
              className="no-drag hidden items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 sm:inline-flex"
              title="Voir sur DofusDB"
            >
              <ExternalLink className="h-3.5 w-3.5" /> DofusDB
            </a>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="no-drag inline-flex items-center gap-1.5 rounded-lg border border-glow-purple/40 bg-glow-purple/20 px-3 py-2 text-xs font-semibold text-white transition hover:bg-glow-purple/30"
            >
              {expanded ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5" /> Réduire
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5" /> Agrandir
                </>
              )}
            </button>
            <button onClick={onClose} className="no-drag rounded-lg bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {/* Map (scale selon l'état agrandi ; repli auto si l'échelle n'existe pas). */}
          <div className="grid min-h-[180px] place-items-center overflow-hidden rounded-xl border border-white/10 bg-void-900">
            <img
              key={mapScale}
              src={havenbagMapImg(theme.mapId, mapScale)}
              alt={`Map du havre-sac ${theme.name.fr}`}
              data-scale={mapScale}
              onError={downgrade}
              className={`block w-auto max-w-full object-contain ${expanded ? "max-h-[72vh]" : "max-h-[52vh]"}`}
            />
          </div>

          {/* Décorations / éléments */}
          <div className="mt-5">
            <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Sofa className="h-3.5 w-3.5 text-glow-violet" /> Décorations
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
                    <img src={f.img} alt="" loading="lazy" onError={(e) => (e.currentTarget.style.display = "none")} className="max-h-full max-w-full object-contain" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
