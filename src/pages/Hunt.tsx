import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ImageOff,
  Check,
  BadgeCheck,
  dofusUiIcon,
} from "../components/DofusIcons";
import DofusIcon, { type DofusIconName } from "../components/DofusIcon";

// Flèches de chasse authentiques du client Dofus 3 (0=droite 2=bas 4=gauche 6=haut).
// Les sprites sont gris foncé (faits pour un parchemin clair) → on les éclaircit en blanc.
const ARROW_FX = "brightness-0 invert";
const ArrowUp = dofusUiIcon("huntArrowUp", ARROW_FX);
const ArrowDown = dofusUiIcon("huntArrowDown", ARROW_FX);
const ArrowLeft = dofusUiIcon("huntArrowLeft", ARROW_FX);
const ArrowRight = dofusUiIcon("huntArrowRight", ARROW_FX);
import {
  treasureHunt,
  huntMapImage,
  huntStartMapId,
  type HuntDirection,
  type HuntMap,
} from "../api/dofusdb";
import { SectionHeader, Pill, Spinner, EmptyState, ErrorState } from "../components/ui";

const DIRS: { dir: HuntDirection; label: string; icon: typeof ArrowUp; grid: string }[] = [
  { dir: 6, label: "Haut", icon: ArrowUp, grid: "col-start-2 row-start-1" },
  { dir: 4, label: "Gauche", icon: ArrowLeft, grid: "col-start-1 row-start-2" },
  { dir: 0, label: "Droite", icon: ArrowRight, grid: "col-start-3 row-start-2" },
  { dir: 2, label: "Bas", icon: ArrowDown, grid: "col-start-2 row-start-3" },
];

const ALL_DIRS: HuntDirection[] = [0, 2, 4, 6];

// Copie texte : navigator.clipboard, avec repli execCommand (file:// non sécurisé).
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, ""); // strip accents
}

export default function Hunt() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [direction, setDirection] = useState<HuntDirection | null>(null);
  const [clue, setClue] = useState("");
  const [copied, setCopied] = useState(false);
  // Préférence : copier la commande /travel en cliquant « Continuer d'ici ». Mémorisée.
  const [autoTravel, setAutoTravel] = useState(() => {
    try {
      return localStorage.getItem("hunt:autoTravel") !== "0";
    } catch {
      return true;
    }
  });
  const qc = useQueryClient();

  useEffect(() => {
    try {
      localStorage.setItem("hunt:autoTravel", autoTravel ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [autoTravel]);

  // Réinitialise le toast « copié » après un court délai.
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  function copyTravel(px: number, py: number) {
    void copyText(`/travel ${px},${py}`).then((ok) => ok && setCopied(true));
  }

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["hunt", x, y, direction],
    queryFn: ({ signal }) => treasureHunt(x, y, direction as HuntDirection, signal),
    enabled: direction !== null,
    placeholderData: keepPreviousData,
  });

  // Map de départ (worldmap) — pour afficher la position avant de choisir une direction.
  const { data: startMapId } = useQuery({
    queryKey: ["hunt-start", x, y],
    queryFn: ({ signal }) => huntStartMapId(x, y, signal),
    enabled: direction === null,
    placeholderData: keepPreviousData,
  });

  // Quelles directions mènent quelque part depuis [x, y] ? On sonde les 4 directions
  // en parallèle (et on en profite pour amorcer le cache de la query principale, donc
  // le clic sur une flèche est instantané). null tant que ça charge → flèches actives.
  const { data: dirAvail } = useQuery({
    queryKey: ["hunt-dirs", x, y],
    staleTime: 5 * 60_000,
    queryFn: async () => {
      const counts = await Promise.all(
        ALL_DIRS.map((d) =>
          qc
            .fetchQuery({
              queryKey: ["hunt", x, y, d],
              queryFn: ({ signal }) => treasureHunt(x, y, d, signal),
              staleTime: 5 * 60_000,
            })
            .then((r) => r.length)
            .catch(() => 0),
        ),
      );
      const avail = {} as Record<HuntDirection, boolean>;
      ALL_DIRS.forEach((d, i) => (avail[d] = counts[i] > 0));
      return avail;
    },
  });

  const maps = data ?? [];

  // Nearest map in the chosen direction whose clues match the searched text.
  const match = useMemo(() => {
    if (!clue.trim()) return null;
    const q = norm(clue);
    return maps.find((m) => m.pois.some((p) => norm(p.name.fr).includes(q))) ?? null;
  }, [maps, clue]);

  // Map affichée = la plus proche contenant l'indice (maps est triée par distance).
  const activeMap = direction === null ? null : match;

  // Unique clue names available in the loaded direction (clickable suggestions).
  const uniqueClues = useMemo(() => {
    const byKey = new Map<string, string>();
    for (const m of maps) for (const p of m.pois) byKey.set(norm(p.name.fr), p.name.fr);
    return [...byKey.values()].sort((a, b) => a.localeCompare(b, "fr"));
  }, [maps]);

  function setDir(d: HuntDirection) {
    setDirection(d);
  }

  function continueFrom(m: HuntMap) {
    if (autoTravel) copyTravel(m.posX, m.posY); // copie /travel X,Y si l'option est cochée
    setX(m.posX);
    setY(m.posY);
    setDirection(null);
    setClue("");
  }

  const q = norm(clue);

  return (
    <div>
      <SectionHeader
        eyebrow="Outil"
        title="Chasse au trésor"
        subtitle="Entrez votre position de départ, choisissez la direction de la flèche, puis cherchez votre indice : la case exacte et sa map s'affichent."
      />

      {/* Note compacte — données fiables (live) */}
      <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-glow-emerald/20 bg-glow-emerald/[0.07] px-3.5 py-2 text-xs leading-snug text-slate-300">
        <BadgeCheck className="h-4 w-4 shrink-0 text-glow-emerald" />
        <span>
          <span className="font-semibold text-glow-emerald">Données fiables</span> — cases, maps et indices
          calculés en direct depuis les données du jeu.
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Control panel */}
        <div className="space-y-4 lg:col-span-1">
          <div className="glass rounded-2xl p-5">
            <h3 className="mb-3 flex items-center gap-2 font-display font-bold text-white">
              <DofusIcon name="world" size={16} /> Position de départ
            </h3>
            <div className="flex gap-3">
              <Coord label="X" value={x} onChange={setX} />
              <Coord label="Y" value={y} onChange={setY} />
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="mb-3 flex items-center gap-2 font-display font-bold text-white">
              <DofusIcon name="map" size={16} /> Direction de la flèche
            </h3>
            <div className="mx-auto grid w-44 grid-cols-3 grid-rows-3 gap-2">
              {DIRS.map((d) => {
                const active = direction === d.dir;
                // dirAvail null = encore en chargement → on laisse cliquable.
                const blocked = dirAvail ? !dirAvail[d.dir] : false;
                return (
                  <button
                    key={d.dir}
                    onClick={() => setDir(d.dir)}
                    disabled={blocked}
                    title={blocked ? `${d.label} — aucun déplacement possible` : d.label}
                    className={`no-drag ${d.grid} flex aspect-square items-center justify-center rounded-xl border transition ${
                      active
                        ? "border-glow-purple/50 bg-glow-purple/25 text-white shadow-glow"
                        : blocked
                          ? "cursor-not-allowed border-white/5 bg-white/[0.02] text-slate-700"
                          : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <d.icon className="h-5 w-5" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="mb-3 flex items-center gap-2 font-display font-bold text-white">
              <DofusIcon name="pp" size={16} /> Votre indice
            </h3>
            <input
              value={clue}
              onChange={(e) => setClue(e.target.value)}
              placeholder="ex : Statue, Tonneau, Fleurs smiley…"
              className="no-drag w-full rounded-xl border border-white/10 bg-void-800/60 px-3 py-2.5 text-sm text-slate-200 outline-none transition focus:border-glow-purple/50"
            />
            <p className="mt-2 text-xs text-slate-500">
              Tapez le nom de l'indice donné en jeu pour repérer la case directement.
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4 lg:col-span-2">
          {direction === null ? (
            // Avant de choisir une direction : on montre la map de départ.
            <div className="glass overflow-hidden rounded-2xl">
              <MapViewer
                mapId={startMapId ?? null}
                accent="cyan"
                topLeft={
                  <Badge accent="cyan">
                    <DofusIcon name="map" size={14} /> Départ [{x}, {y}]
                  </Badge>
                }
              />
              <div className="p-4">
                <p className="text-sm text-slate-300">
                  Voici votre position actuelle sur la carte du monde.
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Cliquez la flèche correspondant à l'indice donné en jeu pour lancer la recherche.
                </p>
              </div>
            </div>
          ) : isLoading ? (
            <Spinner label="Recherche des indices…" />
          ) : isError ? (
            <ErrorState message={(error as Error)?.message} onRetry={refetch} />
          ) : maps.length === 0 ? (
            <EmptyState title="Aucune map dans cette direction" hint="Vérifiez la position de départ." />
          ) : (
            <div className={`space-y-4 ${isFetching ? "opacity-70" : ""}`}>
              {/* Indices à trouver — le focus principal de cette étape */}
              {uniqueClues.length > 0 && (
                <div className="glass rounded-2xl p-5">
                  <h3 className="flex items-center gap-2 font-display font-bold text-white">
                    <DofusIcon name="zoom" size={16} /> Quel est votre indice ?
                  </h3>
                  <p className="mb-3 mt-1 text-xs text-slate-500">
                    {uniqueClues.length} indice{uniqueClues.length > 1 ? "s" : ""} sur le chemin dans
                    cette direction — le vôtre peut être à plusieurs maps. Cliquez-le pour situer la
                    case exacte.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {uniqueClues.map((c) => {
                      const sel = clue.trim() && norm(c) === norm(clue);
                      return (
                        <button
                          key={c}
                          onClick={() => setClue(sel ? "" : c)}
                          className={`no-drag rounded-xl px-3 py-1.5 text-sm font-medium transition ${
                            sel
                              ? "bg-glow-emerald/25 text-white ring-1 ring-glow-emerald/40"
                              : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Visualiseur de la map la plus proche contenant l'indice */}
              {activeMap && (
                <div className="glass overflow-hidden rounded-2xl ring-1 ring-glow-emerald/40">
                  <MapViewer
                    mapId={activeMap.id}
                    accent="emerald"
                    topLeft={
                      <Badge accent="emerald">
                        <DofusIcon name="map" size={14} />
                        [{activeMap.posX}, {activeMap.posY}]
                      </Badge>
                    }
                    topRight={<DistanceBadge map={activeMap} direction={direction} />}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div className="min-w-0 flex-1">
                      <p className="mb-1.5 text-xs font-medium text-slate-400">
                        Indices sur cette map :
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {activeMap.pois.map((p) => {
                          const ph = clue.trim() && norm(p.name.fr).includes(q);
                          return (
                            <Pill key={p.id} tone={ph ? "emerald" : "slate"}>
                              {p.name.fr}
                            </Pill>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                      <TravelCheck checked={autoTravel} onChange={setAutoTravel} />
                      <button
                        onClick={() => continueFrom(activeMap)}
                        className="no-drag inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-glow-emerald to-glow-cyan px-4 py-2.5 text-sm font-semibold text-void-900 transition hover:brightness-110"
                      >
                        Continuer d'ici <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Aucun indice choisi : invite simple */}
              {!activeMap && (
                <p className="text-xs text-slate-500">
                  Sélectionnez votre indice ci-dessus pour afficher la map la plus proche.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Toast de confirmation de copie /travel */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="pointer-events-none fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-xl border border-glow-emerald/40 bg-void-900/90 px-4 py-2.5 text-sm font-semibold text-glow-emerald shadow-glow backdrop-blur"
          >
            <Check className="h-4 w-4" /> Commande /travel copiée
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type Accent = "cyan" | "purple" | "emerald";

const ACCENT_RING: Record<Accent, string> = {
  cyan: "from-glow-cyan/20",
  purple: "from-glow-purple/20",
  emerald: "from-glow-emerald/20",
};

// Grand visualiseur de la map Dofus (image worldmap) avec overlays.
function MapViewer({
  mapId,
  accent,
  topLeft,
  topRight,
}: {
  mapId: number | null;
  accent: Accent;
  topLeft?: ReactNode;
  topRight?: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative aspect-[955/485] w-full overflow-hidden bg-void-900">
      <AnimatePresence mode="wait">
        {mapId != null && !failed ? (
          <motion.img
            key={mapId}
            src={huntMapImage(mapId, "0.75")}
            alt=""
            onError={() => setFailed(true)}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-600">
            {failed ? <ImageOff className="h-8 w-8" /> : <Spinner />}
            {failed && <span className="text-xs">Carte indisponible</span>}
          </div>
        )}
      </AnimatePresence>
      {/* Voile dégradé pour la lisibilité des overlays */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${ACCENT_RING[accent]} via-transparent to-void-900/70`}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
        {topLeft}
        {topRight}
      </div>
    </div>
  );
}

const BADGE_ACCENT: Record<Accent, string> = {
  cyan: "border-glow-cyan/40 text-glow-cyan",
  purple: "border-glow-purple/40 text-white",
  emerald: "border-glow-emerald/40 text-glow-emerald",
};

function Badge({ accent, children }: { accent: Accent; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border bg-void-900/75 px-2.5 py-1 font-display text-sm font-bold backdrop-blur ${BADGE_ACCENT[accent]}`}
    >
      {children}
    </span>
  );
}

const DIR_ICON_NAME: Record<HuntDirection, DofusIconName> = {
  6: "huntArrowUp",
  4: "huntArrowLeft",
  0: "huntArrowRight",
  2: "huntArrowDown",
};

function DistanceBadge({ map, direction }: { map: HuntMap; direction: HuntDirection }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-void-900/75 px-2.5 py-1 text-sm font-semibold text-slate-200 backdrop-blur">
      <DofusIcon name={DIR_ICON_NAME[direction]} size={16} tint="#34d399" />
      {map.distance} map{map.distance > 1 ? "s" : ""}
    </span>
  );
}

// Coche : si activée, « Continuer d'ici » copie aussi la commande /travel X,Y.
function TravelCheck({ checked, onChange }: { checked: boolean; onChange: (b: boolean) => void }) {
  return (
    <label
      className="no-drag flex cursor-pointer select-none items-center gap-2 text-xs font-medium text-slate-400"
      title="Copier automatiquement /travel en continuant"
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        className={`flex h-4 w-4 items-center justify-center rounded border transition ${
          checked ? "border-glow-emerald/50 bg-glow-emerald/25" : "border-white/15 bg-white/5"
        }`}
      >
        {checked && <Check className="h-3 w-3" />}
      </span>
      Copier <span className="font-mono text-slate-300">/travel</span>
    </label>
  );
}

function Coord({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  // État texte local pour autoriser un champ vide / un « - » en cours de frappe
  // (sinon le 0 contrôlé bloque la saisie). Resynchronisé si value change ailleurs.
  const [raw, setRaw] = useState(String(value));
  useEffect(() => setRaw(String(value)), [value]);

  return (
    <label className="flex-1">
      <span className="mb-1 block text-xs font-medium text-slate-500">{label}</span>
      <input
        type="number"
        value={raw}
        onFocus={(e) => e.target.select()}
        onChange={(e) => {
          const v = e.target.value;
          setRaw(v);
          if (v === "" || v === "-") return; // saisie intermédiaire
          const n = parseInt(v, 10);
          if (!Number.isNaN(n)) onChange(n);
        }}
        onBlur={() => {
          if (raw === "" || raw === "-") {
            setRaw("0");
            onChange(0);
          }
        }}
        className="no-drag w-full rounded-xl border border-white/10 bg-void-800/60 px-3 py-2.5 text-center font-display text-lg font-bold text-white outline-none transition focus:border-glow-purple/50"
      />
    </label>
  );
}
