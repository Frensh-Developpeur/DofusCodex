import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Zap, Crosshair, Star } from "lucide-react";
import { listBreeds, getClassSpells, type Breed, type ClassSpell } from "../api/dofusdb";
import { classIllus } from "../data/classIllus";
import { SectionHeader, Skeleton, ErrorState, EmptyState, Pill, fadeUp } from "../components/ui";

export default function Classes() {
  const [openId, setOpenId] = useState<number | null>(null);
  const { data: breeds, isLoading, isError, refetch } = useQuery({
    queryKey: ["breeds"],
    queryFn: ({ signal }) => listBreeds(signal),
    staleTime: Infinity,
  });

  return (
    <div>
      <SectionHeader
        eyebrow="Encyclopédie"
        title="Classes"
        subtitle="Les classes de Dofus, leur difficulté, leur description et leur arbre de sorts."
      />

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState message="Impossible de charger les classes." onRetry={refetch} />
      ) : !breeds?.length ? (
        <EmptyState title="Aucune classe" />
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.03 } } }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        >
          {breeds.map((b, i) => (
            <motion.button
              key={b.id}
              variants={fadeUp}
              custom={i % 16}
              whileHover={{ y: -4 }}
              onClick={() => setOpenId(b.id)}
              className="glass glass-hover no-drag group relative flex flex-col items-center overflow-hidden rounded-2xl p-4 text-center"
            >
              <div className="relative mb-2 h-24 w-24">
                <div className="absolute inset-0 rounded-full bg-glow-purple/20 opacity-0 blur-2xl transition group-hover:opacity-100" />
                <img
                  src={classIllus(b.id) ?? b.img}
                  alt={b.name.fr}
                  loading="lazy"
                  className="relative h-24 w-24 object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)]"
                />
              </div>
              <p className="font-display text-sm font-bold text-white">{b.name.fr}</p>
              <span className="mt-1">
                <ComplexityDots value={b.complexity} />
              </span>
            </motion.button>
          ))}
        </motion.div>
      )}

      <AnimatePresence>{openId !== null && <ClassModal id={openId} onClose={() => setOpenId(null)} />}</AnimatePresence>
    </div>
  );
}

function ComplexityDots({ value }: { value: number }) {
  // complexity DofusDB : 1 (facile) → 3 (difficile)
  const n = Math.max(1, Math.min(3, value || 1));
  return (
    <span className="inline-flex items-center gap-0.5" title={`Difficulté ${n}/3`}>
      {[1, 2, 3].map((d) => (
        <span key={d} className={`h-1.5 w-1.5 rounded-full ${d <= n ? "bg-glow-violet" : "bg-white/15"}`} />
      ))}
    </span>
  );
}

function ClassModal({ id, onClose }: { id: number; onClose: () => void }) {
  const { data: breeds } = useQuery({ queryKey: ["breeds"], queryFn: ({ signal }) => listBreeds(signal), staleTime: Infinity });
  const breed: Breed | undefined = breeds?.find((b) => b.id === id);
  const { data: spells, isLoading: spellsLoading } = useQuery({
    queryKey: ["class-spells", id],
    queryFn: ({ signal }) => getClassSpells(id, signal),
    staleTime: 1000 * 60 * 30,
  });
  const [selId, setSelId] = useState<number | null>(null);

  const desc = breed?.gameplayDescription?.fr || breed?.description?.fr || "";
  const allSpells = spells ?? [];

  // Mêmes sorts que le Builder : groupés par variante (sort de base + sa variante empilés).
  const spellColumns = useMemo(() => {
    const groups = new Map<number, ClassSpell[]>();
    for (const sp of allSpells) {
      const arr = groups.get(sp.variantId) ?? [];
      arr.push(sp);
      groups.set(sp.variantId, arr);
    }
    return [...groups.values()].map((arr) => [...arr].sort((a, b) => a.variantIndex - b.variantIndex));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSpells.map((s) => s.id).join(",")]);
  const spellRows = Math.max(1, ...spellColumns.map((c) => c.length));
  const sel = allSpells.find((s) => s.id === selId) ?? allSpells[0];

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
        className="glass flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl ring-1 ring-white/10"
      >
        <div className="relative flex items-center gap-4 border-b border-white/10 p-4">
          <img
            src={breed ? (classIllus(breed.id) ?? breed.img) : ""}
            alt={breed?.name.fr ?? ""}
            className="h-16 w-16 shrink-0 object-contain drop-shadow-[0_6px_16px_rgba(0,0,0,0.5)]"
          />
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-2xl font-extrabold text-white">{breed?.name.fr ?? "Classe"}</h2>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
              <ComplexityDots value={breed?.complexity ?? 1} />
              <span>Difficulté {Math.max(1, Math.min(3, breed?.complexity ?? 1))}/3</span>
            </div>
          </div>
          <button onClick={onClose} className="no-drag rounded-lg bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {desc && <p className="mb-5 text-sm leading-6 text-slate-300">{desc}</p>}

          <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-glow-violet" /> Sorts
          </p>
          {spellsLoading ? (
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 16 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-12" />
              ))}
            </div>
          ) : !allSpells.length ? (
            <p className="text-sm text-slate-500">Sorts indisponibles pour cette classe.</p>
          ) : (
            <div className="flex flex-col gap-4 lg:flex-row">
              {/* Grille d'icônes : sort de base en haut, sa variante juste en dessous. */}
              <div className="flex flex-wrap content-start gap-1.5 rounded-2xl bg-void-900/50 p-2 ring-1 ring-white/10 lg:w-[260px] lg:shrink-0">
                {spellColumns.map((col, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    {Array.from({ length: spellRows }).map((_, row) => {
                      const sp = col[row];
                      if (!sp) return <div key={row} className="h-12 w-12 shrink-0" aria-hidden />;
                      return (
                        <button
                          key={sp.id}
                          onClick={() => setSelId(sp.id)}
                          title={sp.name.fr}
                          className={`no-drag h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-void-700/60 transition ${
                            sel?.id === sp.id
                              ? "shadow-[0_0_18px_-4px_rgba(124,92,255,0.7)] ring-2 ring-glow-violet"
                              : "ring-1 ring-white/10 hover:ring-glow-violet/40"
                          }`}
                        >
                          <img
                            src={sp.img}
                            alt={sp.name.fr}
                            loading="lazy"
                            className="h-full w-full object-cover"
                            onError={(e) => (e.currentTarget.style.opacity = "0.3")}
                          />
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
              {/* Détail du sort sélectionné : description + caractéristiques. */}
              <div className="min-w-0 flex-1">{sel && <SpellDetail spell={sel} />}</div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function SpellDetail({ spell }: { spell: ClassSpell }) {
  const lvl = spell.levels[spell.levels.length - 1];
  const isVariant = spell.variantIndex === 1;
  const range = lvl ? (lvl.minRange === lvl.range ? `${lvl.range}` : `${lvl.minRange}-${lvl.range}`) : "—";
  return (
    <motion.div
      key={spell.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
    >
      <div className="flex items-start gap-3">
        <img
          src={spell.img}
          alt={spell.name.fr}
          className="h-14 w-14 shrink-0 rounded-lg bg-void-700/60 object-cover ring-1 ring-white/10"
          onError={(e) => (e.currentTarget.style.opacity = "0.3")}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-display text-lg font-bold text-white">{spell.name.fr}</h3>
            <span
              className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
                isVariant ? "bg-glow-violet/20 text-glow-violet" : "bg-white/10 text-slate-300"
              }`}
            >
              {isVariant ? "Variante" : "Base"}
            </span>
          </div>
          {lvl && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Pill tone="cyan">
                <Zap className="h-3 w-3" /> {lvl.apCost} PA
              </Pill>
              <Pill tone="purple">
                <Crosshair className="h-3 w-3" /> {range} PO
              </Pill>
              {lvl.critProbability > 0 && (
                <Pill tone="gold">
                  <Star className="h-3 w-3" /> {lvl.critProbability}%
                </Pill>
              )}
            </div>
          )}
        </div>
      </div>

      {spell.description.fr ? (
        <p className="mt-4 text-sm leading-6 text-slate-300">{spell.description.fr}</p>
      ) : (
        <p className="mt-4 text-sm italic text-slate-500">Pas de description.</p>
      )}
    </motion.div>
  );
}
