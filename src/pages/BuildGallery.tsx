import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Sparkles, Layers, Hammer, ChevronRight, FlaskConical } from "lucide-react";
import { listBreeds } from "../api/dofusdb";
import { classIllus } from "../data/classIllus";
import { levelTone } from "../data/meta";
import { actions, useStore } from "../store/store";
import { SectionHeader, Pill, Spinner } from "../components/ui";

function timeAgo(ts: number): string {
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return "à l'instant";
  const m = Math.floor(s / 60);
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `il y a ${d} j`;
  const mo = Math.floor(d / 30);
  return `il y a ${mo} mois`;
}

export default function BuildGallery() {
  const navigate = useNavigate();
  const builds = useStore((s) => s.builds);
  const { data: breeds } = useQuery({ queryKey: ["breeds"], queryFn: ({ signal }) => listBreeds(signal), staleTime: Infinity });

  const [creatorBreed, setCreatorBreed] = useState<number | null>(null);
  const [creatorLevel, setCreatorLevel] = useState(200);
  const [creatorName, setCreatorName] = useState("");

  const breedById = useMemo(() => {
    const m = new Map<number, { name: string; img: string }>();
    for (const b of breeds ?? []) m.set(b.id, { name: b.name.fr, img: b.img });
    return m;
  }, [breeds]);

  const sorted = useMemo(
    () => [...builds].sort((a, b) => (b.updatedAt ?? b.createdAt) - (a.updatedAt ?? a.createdAt)),
    [builds],
  );

  const autoName = creatorBreed != null ? `${breedById.get(creatorBreed)?.name ?? "Build"} niv. ${creatorLevel}` : "";

  function createBuild() {
    if (creatorBreed == null) return;
    const name = creatorName.trim() || autoName;
    const id = actions.saveBuild(name, {}, { breedId: creatorBreed, level: creatorLevel });
    navigate(`/builder/${id}`);
  }

  return (
    <div>
      <SectionHeader
        eyebrow="Théorycraft"
        title="Builder"
        subtitle="Créez un build en choisissant une classe et un niveau — il est sauvegardé automatiquement. Retrouvez tous vos builds ci-dessous et ouvrez-en un pour l'équiper et estimer ses dégâts."
      />

      {/* Avertissement v1 — fiabilité des calculs de dégâts */}
      <div className="mb-8 flex items-start gap-3 rounded-2xl border border-glow-gold/25 bg-glow-gold/10 p-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-glow-gold/15 ring-1 ring-glow-gold/30">
          <FlaskConical className="h-5 w-5 text-glow-gold" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-sm font-bold text-glow-gold">
            Builder v1 — estimation en cours d'affinage
          </p>
          <p className="mt-0.5 text-sm leading-snug text-slate-300">
            Le calcul de dégâts reflète une grosse partie de la réalité, mais reste imparfait sur
            certains sorts à mécaniques particulières (charges, états, déclenchements). À prendre
            comme une estimation, pas une valeur exacte.
          </p>
        </div>
      </div>

      {/* Temps 1 — Créateur : classe + niveau → création (auto-sauvegardée) */}
      <div className="glass mb-8 overflow-hidden rounded-3xl">
        <div className="grid gap-0 lg:grid-cols-[1fr_320px]">
          <div className="p-6">
            <h3 className="mb-1 flex items-center gap-2 font-display text-lg font-bold text-white">
              <Sparkles className="h-5 w-5 text-glow-violet" /> Nouveau build
            </h3>
            <p className="mb-4 text-sm text-slate-400">Choisissez une classe, puis le niveau.</p>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Classe</p>
            <div className="flex flex-wrap gap-2">
              {(breeds ?? []).map((b) => (
                <button
                  key={b.id}
                  onClick={() => setCreatorBreed(b.id)}
                  title={b.name.fr}
                  className={`no-drag relative h-14 w-14 rounded-xl border transition hover:-translate-y-0.5 ${
                    creatorBreed === b.id
                      ? "border-glow-purple/60 bg-glow-purple/15 ring-1 ring-glow-purple/40"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <img src={b.img} alt={b.name.fr} className="h-full w-full object-contain p-2" loading="lazy" />
                </button>
              ))}
              {!breeds && <Spinner label="Chargement des classes…" />}
            </div>
          </div>

          {/* Aperçu + niveau + bouton créer */}
          <div className="relative flex flex-col justify-between border-t border-white/5 bg-void-900/40 p-6 lg:border-l lg:border-t-0">
            {creatorBreed != null && classIllus(creatorBreed) && (
              <img
                src={classIllus(creatorBreed)!}
                alt=""
                className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_25%] opacity-25"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-void-900 via-void-900/70 to-void-900/30" />
            <div className="relative">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Nom du build</p>
              <input
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") createBuild();
                }}
                placeholder={autoName || "Nom du build…"}
                className="no-drag mb-4 w-full rounded-lg border border-white/10 bg-void-800/70 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-glow-purple/50"
              />
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Niveau</p>
                <span className="font-display text-lg font-bold text-white">{creatorLevel}</span>
              </div>
              <input
                type="range"
                min={1}
                max={200}
                value={creatorLevel}
                onChange={(e) => setCreatorLevel(Number(e.target.value))}
                className="no-drag w-full accent-glow-purple"
              />
              <p className="mt-3 truncate text-sm text-slate-300">
                {creatorBreed != null ? (
                  <>
                    <span className="font-semibold text-white">{breedById.get(creatorBreed)?.name}</span>
                    <span className="text-slate-500"> · niveau {creatorLevel}</span>
                  </>
                ) : (
                  <span className="text-slate-500">Sélectionnez une classe…</span>
                )}
              </p>
            </div>
            <button
              onClick={createBuild}
              disabled={creatorBreed == null}
              className="no-drag relative mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-glow-purple to-glow-cyan px-4 py-2.5 font-display font-bold text-white shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:grayscale"
            >
              <Plus className="h-5 w-5" /> Créer le build
            </button>
          </div>
        </div>
      </div>

      {/* Temps 2 — Galerie des builds */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display text-lg font-bold text-white">
          <Layers className="h-5 w-5 text-glow-cyan" /> Mes builds
        </h3>
        {sorted.length > 0 && <Pill tone="slate">{sorted.length}</Pill>}
      </div>

      {sorted.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <Hammer className="mx-auto mb-3 h-8 w-8 text-glow-violet/60" />
          <p className="text-slate-400">Aucun build pour l'instant. Créez-en un ci-dessus pour commencer.</p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence>
            {sorted.map((build) => {
              const meta = build.breedId != null ? breedById.get(build.breedId) : undefined;
              const illus = classIllus(build.breedId);
              const filled = Object.values(build.slots ?? {}).filter((v) => typeof v === "number").length;
              return (
                <motion.button
                  key={build.id}
                  layout
                  variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -4 }}
                  onClick={() => navigate(`/builder/${build.id}`)}
                  className="no-drag group relative flex h-44 flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-void-800/60 p-4 text-left transition hover:border-glow-purple/45 hover:shadow-glow"
                >
                  {/* Illustration de classe en fond */}
                  {illus ? (
                    <img
                      src={illus}
                      alt=""
                      loading="lazy"
                      className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_22%] opacity-45 transition duration-500 group-hover:scale-110 group-hover:opacity-60"
                    />
                  ) : (
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-glow-purple/15 to-void-900" />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void-900 via-void-900/55 to-void-900/10" />

                  {/* Crest classe */}
                  {meta && (
                    <span className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-xl bg-void-900/70 ring-1 ring-white/15 backdrop-blur">
                      <img src={meta.img} alt={meta.name} className="h-7 w-7 object-contain" />
                    </span>
                  )}
                  <Pill tone={levelTone(build.level ?? 1)} className="absolute right-3 top-3">
                    Niv. {build.level ?? "?"}
                  </Pill>

                  {/* Supprimer */}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      actions.deleteBuild(build.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.stopPropagation();
                        actions.deleteBuild(build.id);
                      }
                    }}
                    title="Supprimer"
                    className="absolute bottom-3 right-3 z-10 cursor-pointer rounded-lg bg-black/45 p-1.5 text-slate-300 opacity-0 transition hover:bg-glow-rose/25 hover:text-glow-rose group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </span>

                  {/* Infos */}
                  <div className="relative min-w-0">
                    <p className="truncate font-display text-lg font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                      {build.name}
                    </p>
                    <p className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
                      <span>{meta?.name ?? "Classe ?"}</span>
                      <span className="text-slate-600">·</span>
                      <span>{filled} équipés</span>
                      <span className="text-slate-600">·</span>
                      <span>{timeAgo(build.updatedAt ?? build.createdAt)}</span>
                    </p>
                  </div>
                  <ChevronRight className="absolute bottom-3 right-3 h-5 w-5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-glow-violet group-hover:opacity-0" />
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
