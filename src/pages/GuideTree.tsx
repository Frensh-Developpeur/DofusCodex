import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { RotateCcw, CheckCircle2 } from "../components/DofusIcons";
import { Pill, SectionHeader } from "../components/ui";
import { useStore } from "../store/store";
import { getGuideData } from "../lib/guideStore";
import { levelTone } from "../data/meta";
import { TREE_NODES, TREE_EDGES, TREE_BANDS, TREE_IMG_BASE, type TreeNode } from "../data/guideTree";

// Géométrie : on utilise la disposition « Débutant » (xAlt,yAlt) — ordonnée par paliers de
// niveau comme sur Ganymède. La grille est convertie en pixels.
const XCELL = 92; // espacement horizontal entre colonnes
const YCELL = 104; // espacement vertical entre lignes
const NODE = 80; // largeur d'un nœud
const GUTTER = 92; // largeur de la gouttière des libellés de paliers (à gauche)
const PAD_L = GUTTER + 12 + NODE / 2; // les nœuds démarrent APRÈS la gouttière (pas de chevauchement)
const PAD_T = 40;
const PAD_R = 48;
const PAD_B = 48;

const px = (n: TreeNode) => n.xAlt;
const py = (n: TreeNode) => n.yAlt;
const MIN_X = Math.min(...TREE_NODES.map(px));
const MIN_Y = Math.min(...TREE_NODES.map(py));
const MAX_X = Math.max(...TREE_NODES.map(px));
const MAX_Y = Math.max(...TREE_NODES.map(py));
const CANVAS_W = (MAX_X - MIN_X) * XCELL + PAD_L + PAD_R;
const CANVAS_H = (MAX_Y - MIN_Y) * YCELL + PAD_T + PAD_B;

// Centre en pixels d'un nœud (sert aux nœuds ET aux extrémités des arêtes).
const cx = (n: TreeNode) => (px(n) - MIN_X) * XCELL + PAD_L;
const cy = (n: TreeNode) => (py(n) - MIN_Y) * YCELL + PAD_T;
const rowY = (yAlt: number) => (yAlt - MIN_Y) * YCELL + PAD_T;

const ZOOM_MIN = 0.3;
const ZOOM_MAX = 1.2;
const ZOOM_STEP = 0.1;

const EDGE_COLOR = { done: "rgb(52 211 153)", next: "rgb(34 211 238)", base: "rgba(255,255,255,0.13)" };

export default function GuideTree() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  // Zoom : par défaut « adapté à la fenêtre » (la fresque tient en largeur). L'utilisateur peut
  // surcharger via +/− ; « reset » revient à l'ajustement auto, recalculé au redimensionnement.
  const boxRef = useRef<HTMLDivElement>(null);
  const [availW, setAvailW] = useState(0);
  const [userZoom, setUserZoom] = useState<number | null>(null);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = () => setAvailW(el.clientWidth - 16); // -16 = padding p-2
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const fitZoom =
    availW > 0 ? Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, +(availW / CANVAS_W).toFixed(3))) : 0.6;
  const zoom = userZoom ?? fitZoom;
  // Nœud survolé + sa position écran (rect) → carte d'info lisible en position fixed
  // (taille constante quel que soit le zoom, jamais rognée par le conteneur défilable).
  const [hover, setHover] = useState<{ node: TreeNode; rect: DOMRect } | null>(null);

  const doneGuides = useStore((s) => s.doneGuides);
  const guideStep = useStore((s) => s.guideStep);
  const guideTotalSteps = useStore((s) => s.guideTotalSteps);

  // Statut de progression d'un nœud, déduit du guide associé (même logique que la page Guides).
  const statusOf = useMemo(() => {
    const done = new Set(doneGuides);
    return (n: TreeNode): "done" | "progress" | "todo" => {
      const gid = n.guideId;
      if (gid == null) return "todo";
      const cur = guideStep[gid];
      const tot = guideTotalSteps[gid];
      if (done.has(gid) || (cur != null && tot != null && cur >= tot - 1)) return "done";
      if ((cur ?? 0) > 0) return "progress";
      return "todo";
    };
  }, [doneGuides, guideStep, guideTotalSteps]);

  const byId = useMemo(() => new Map(TREE_NODES.map((n) => [n.id, n])), []);
  const doneCount = useMemo(() => TREE_NODES.filter((n) => statusOf(n) === "done").length, [statusOf]);

  const open = (n: TreeNode) => {
    if (n.guideId == null) return;
    navigate(`/guides/${n.guideId}`, { state: { returnTo: "/arbre", returnLabel: "Arbre des guides" } });
  };

  return (
    <div>
      <SectionHeader
        eyebrow="Guides · Ganymède"
        title="Arbre des guides"
        subtitle="La fresque de progression Ganymède, ordonnée par paliers de niveau. Chaque nœud est une étape clé (donjons, Dofus, zones) reliée à son guide pas-à-pas — suivez les flèches du haut vers le bas."
        right={
          <Pill tone={doneCount === TREE_NODES.length ? "emerald" : "cyan"}>
            {doneCount} / {TREE_NODES.length} terminés
          </Pill>
        }
      />

      {/* Barre d'outils : légende + zoom */}
      <div className="glass mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl px-4 py-2.5 text-xs">
        <span className="inline-flex items-center gap-1.5 text-slate-400">
          <span className="h-2.5 w-2.5 rounded-full bg-glow-emerald" /> Terminé
        </span>
        <span className="inline-flex items-center gap-1.5 text-slate-400">
          <span className="h-2.5 w-2.5 rounded-full bg-glow-cyan" /> En cours / accessible
        </span>
        <span className="inline-flex items-center gap-1.5 text-slate-400">
          <span className="h-2.5 w-2.5 rounded-full bg-white/25 ring-1 ring-white/20" /> À faire
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={() => setUserZoom(Math.max(ZOOM_MIN, +(zoom - ZOOM_STEP).toFixed(2)))}
            title="Dézoomer"
            className="no-drag grid h-7 w-7 place-items-center rounded-lg bg-white/5 text-base font-bold leading-none text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            −
          </button>
          <span className="w-10 text-center font-semibold text-slate-300">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setUserZoom(Math.min(ZOOM_MAX, +(zoom + ZOOM_STEP).toFixed(2)))}
            title="Zoomer"
            className="no-drag grid h-7 w-7 place-items-center rounded-lg bg-white/5 text-base font-bold leading-none text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            +
          </button>
          <button
            onClick={() => setUserZoom(null)}
            title="Adapter à la fenêtre"
            className="no-drag grid h-7 w-7 place-items-center rounded-lg bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Canevas défilable. Le contenu est mis à l'échelle via transform ; le wrapper porte
          la taille mise à l'échelle pour que les barres de défilement restent cohérentes. */}
      <div ref={boxRef} className="glass no-scrollbar h-[calc(100dvh-20rem)] min-h-[24rem] overflow-auto rounded-2xl p-2">
        <div style={{ width: CANVAS_W * zoom, height: CANVAS_H * zoom }}>
          <div
            className="relative origin-top-left"
            style={{ width: CANVAS_W, height: CANVAS_H, transform: `scale(${zoom})` }}
          >
            {/* Bandes de paliers : séparateur pointillé + libellé à gauche. */}
            {TREE_BANDS.map((b) => (
              <div key={b.yAlt} className="pointer-events-none absolute left-0" style={{ top: rowY(b.yAlt), width: CANVAS_W }}>
                <div
                  className="absolute border-t border-dashed border-white/10"
                  style={{ left: GUTTER, right: 0, top: -YCELL / 2 }}
                />
                <div className="absolute -translate-y-1/2 pr-3 text-right" style={{ left: 0, width: GUTTER }}>
                  <div className="text-sm font-bold text-slate-300">{b.label}</div>
                  {b.note && <div className="text-[10px] uppercase tracking-wide text-slate-500">{b.note}</div>}
                </div>
              </div>
            ))}

            {/* Arêtes (prérequis → débloqué), avec flèche directionnelle, tracées derrière les nœuds. */}
            <svg className="pointer-events-none absolute inset-0" width={CANVAS_W} height={CANVAS_H}>
              <defs>
                {Object.entries(EDGE_COLOR).map(([k, color]) => (
                  <marker
                    key={k}
                    id={`arrow-${k}`}
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M0,0 L10,5 L0,10 z" fill={color} />
                  </marker>
                ))}
              </defs>
              {TREE_EDGES.map((e, i) => {
                const a = byId.get(e.from);
                const b = byId.get(e.to);
                if (!a || !b) return null;
                const sa = statusOf(a);
                const sb = statusOf(b);
                const kind = sa === "done" && sb === "done" ? "done" : sa === "done" ? "next" : "base";
                // On raccourcit l'arête au bord des nœuds pour que la flèche ne soit pas cachée dessous.
                const x1 = cx(a), y1 = cy(a), x2 = cx(b), y2 = cy(b);
                const dx = x2 - x1, dy = y2 - y1;
                const len = Math.hypot(dx, dy) || 1;
                const r = NODE / 2 - 4;
                return (
                  <line
                    key={i}
                    x1={x1 + (dx / len) * r}
                    y1={y1 + (dy / len) * r}
                    x2={x2 - (dx / len) * r}
                    y2={y2 - (dy / len) * r}
                    stroke={EDGE_COLOR[kind]}
                    strokeWidth={kind === "base" ? 2 : 3}
                    strokeLinecap="round"
                    markerEnd={`url(#arrow-${kind})`}
                  />
                );
              })}
            </svg>

            {/* Nœuds (ronds, sans texte permanent — info au survol, comme Ganymède) */}
            {TREE_NODES.map((n) => {
              const status = statusOf(n);
              const ring =
                status === "done"
                  ? "ring-2 ring-glow-emerald shadow-[0_0_12px_-2px_rgba(52,211,153,0.6)]"
                  : status === "progress"
                    ? "ring-2 ring-glow-cyan shadow-[0_0_12px_-2px_rgb(var(--c-cyan)/0.5)]"
                    : "ring-1 ring-white/15";
              return (
                <button
                  key={n.id}
                  onClick={() => open(n)}
                  onMouseEnter={(e) => {
                    setHover({ node: n, rect: e.currentTarget.getBoundingClientRect() });
                    if (n.guideId != null)
                      qc.prefetchQuery({
                        queryKey: ["ganymede-guide", n.guideId],
                        queryFn: ({ signal }) => getGuideData(n.guideId!, signal),
                        staleTime: 1000 * 60 * 30,
                      });
                  }}
                  onMouseLeave={() => setHover((h) => (h?.node.id === n.id ? null : h))}
                  className="no-drag group absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full transition hover:z-50 focus:z-50"
                  style={{ left: cx(n), top: cy(n), width: NODE, height: NODE }}
                >
                  <div
                    className={`relative grid h-[62px] w-[62px] place-items-center overflow-hidden rounded-full bg-void-900/80 transition group-hover:scale-110 ${ring} ${
                      status === "todo" ? "opacity-90" : ""
                    }`}
                  >
                    <img
                      src={`${TREE_IMG_BASE}/${n.image}`}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                      onError={(e) => (e.currentTarget.style.opacity = "0.15")}
                    />
                    {status === "done" && (
                      <span className="absolute -bottom-0.5 -right-0.5 rounded-full bg-void-900 p-0.5">
                        <CheckCircle2 className="h-4 w-4 text-glow-emerald" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-slate-600">
        Fresque de progression d'après Ganymède (vue par paliers). Les guides s'ouvrent dans le lecteur pas-à-pas.
      </p>

      {hover && <HoverCard node={hover.node} rect={hover.rect} status={statusOf(hover.node)} />}
    </div>
  );
}

// Carte d'info au survol d'un nœud. Position fixed (échappe au conteneur défilable),
// taille constante quel que soit le zoom, placée au-dessus du nœud (ou en dessous si peu de place).
function HoverCard({
  node,
  rect,
  status,
}: {
  node: TreeNode;
  rect: DOMRect;
  status: "done" | "progress" | "todo";
}) {
  const W = 248;
  const centerX = Math.min(Math.max(rect.left + rect.width / 2, W / 2 + 8), window.innerWidth - W / 2 - 8);
  const above = rect.top > 220;
  const style: React.CSSProperties = above
    ? { left: centerX, top: rect.top - 10, transform: "translate(-50%, -100%)" }
    : { left: centerX, top: rect.bottom + 10, transform: "translateX(-50%)" };
  const statusMeta =
    status === "done"
      ? { label: "Terminé", cls: "text-glow-emerald" }
      : status === "progress"
        ? { label: "En cours", cls: "text-glow-cyan" }
        : { label: "À faire", cls: "text-slate-400" };
  return (
    <div className="pointer-events-none fixed z-[80]" style={{ width: W, ...style }}>
      <div className="glass rounded-xl border border-white/15 p-3 shadow-2xl ring-1 ring-black/30">
        <div className="flex items-center gap-2.5">
          <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-void-900 ring-1 ring-white/10">
            <img src={`${TREE_IMG_BASE}/${node.image}`} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="line-clamp-2 font-display text-sm font-bold leading-tight text-white">{node.name}</div>
            <div className="mt-1 flex items-center gap-1.5">
              <Pill tone={levelTone(node.level)} className="!px-1.5 !py-0 !text-[10px]">
                Niv. {node.level}
              </Pill>
              <span className={`text-[10px] font-semibold uppercase tracking-wide ${statusMeta.cls}`}>
                {statusMeta.label}
              </span>
            </div>
          </div>
        </div>
        {node.description && (
          <p className="mt-2 text-xs leading-snug text-slate-300">{node.description}</p>
        )}
        <div className="mt-2 border-t border-white/10 pt-1.5 text-[11px] font-semibold text-glow-violet">
          Ouvrir le guide →
        </div>
      </div>
    </div>
  );
}
