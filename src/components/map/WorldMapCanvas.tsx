import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getMapCellAt,
  getZoneAt,
  worldPyramidTileImg,
  type MapCell,
  type ResourcePin,
  type WorldGeometry,
} from "../../api/dofusdb";
import { useMapTransform, type MapView } from "../../lib/useMapTransform";
import { useDebounce } from "../../hooks/useDebounce";

interface Props {
  geo: WorldGeometry;
  worldId: number;
  pins?: ResourcePin[];
  /** Cases (posX,posY) de la zone à surligner — fournies par le parent, indépendant du zoom. */
  highlightCells?: { posX: number; posY: number }[];
  selectedCell?: MapCell | null;
  focusTarget?: { x: number; y: number; scale?: number } | null;
  onSelectCell?: (cell: MapCell) => void;
}

export default function WorldMapCanvas({
  geo,
  worldId,
  pins,
  highlightCells,
  selectedCell,
  focusTarget,
  onSelectCell,
}: Props) {
  const selectRef = useRef(onSelectCell);
  selectRef.current = onSelectCell;

  // Tap → cellule sous le pointeur (le hook ne déclenche que sur un vrai tap, pas un drag).
  // La cellule est récupérée à la demande (getMapCellAt) → marche à n'importe quel zoom.
  const tapRef = useRef<(sx: number, sy: number) => void>(() => {});
  const onTap = useCallback((sx: number, sy: number) => tapRef.current(sx, sy), []);
  const { viewportRef, planeRef, view, focusOn, zoomBy, screenToPlane } = useMapTransform(geo, onTap);
  tapRef.current = (sx, sy) => {
    const { px, py } = screenToPlane(sx, sy);
    const posX = Math.floor((px - geo.origineX) / geo.mapWidth);
    const posY = Math.floor((py - geo.origineY) / geo.mapHeight);
    getMapCellAt(worldId, posX, posY)
      .then((c) => c && selectRef.current?.(c))
      .catch(() => {});
  };

  // Recadrage programmatique (deep-link ressource / sélection monstre). On attend une taille réelle.
  const focusedRef = useRef<Props["focusTarget"]>(null);
  useEffect(() => {
    if (focusTarget && view.vw > 0 && focusedRef.current !== focusTarget) {
      focusedRef.current = focusTarget;
      focusOn(focusTarget.x, focusTarget.y, focusTarget.scale);
    }
  }, [focusTarget, view.vw, focusOn]);

  const cw = geo.mapWidth + 0.6;
  const ch = geo.mapHeight + 0.6;

  // Survol d'une case (highlight + coordonnées, façon carte du jeu). MAJ uniquement au changement
  // de case (pas à chaque pixel) pour limiter les rendus.
  const [hover, setHover] = useState<{ posX: number; posY: number } | null>(null);
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const { px, py } = screenToPlane(e.clientX - r.left, e.clientY - r.top);
    const posX = Math.floor((px - geo.origineX) / geo.mapWidth);
    const posY = Math.floor((py - geo.origineY) / geo.mapHeight);
    setHover((h) => (h && h.posX === posX && h.posY === posY ? h : { posX, posY }));
  };

  // Survol → zone (sous-zone entière + nom), récupérée après un court délai (debounce).
  const debHover = useDebounce(hover, 130);
  const zoneQ = useQuery({
    queryKey: ["zone-at", worldId, debHover?.posX, debHover?.posY],
    queryFn: ({ signal }) => getZoneAt(worldId, debHover!.posX, debHover!.posY, signal),
    enabled: !!debHover,
    staleTime: Infinity,
  });
  const zone = hover && zoneQ.data ? zoneQ.data : null; // n'affiche la zone que si on survole encore

  return (
    <div
      ref={viewportRef}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setHover(null)}
      className="relative h-full w-full touch-none overflow-hidden rounded-2xl border border-white/10 bg-void-900 [&_*]:select-none"
      style={{ cursor: "grab" }}
    >
      <div ref={planeRef} className="absolute left-0 top-0 origin-top-left will-change-transform">
        {/* Fond : pyramide de tuiles pré-assemblée (carte cohérente, sans trous — comme DofusDB). */}
        <PyramidTiles geo={geo} view={view} />

        {/* Surlignage de zone (cases fournies par le parent → marche à tout zoom). */}
        {highlightCells?.map((c, i) => (
          <div
            key={`${c.posX},${c.posY},${i}`}
            className="pointer-events-none absolute bg-glow-purple/45 ring-1 ring-inset ring-glow-purple/60"
            style={{
              left: geo.origineX + c.posX * geo.mapWidth,
              top: geo.origineY + c.posY * geo.mapHeight,
              width: cw,
              height: ch,
            }}
          />
        ))}

        {/* Map sélectionnée (anneau or, très visible). */}
        {selectedCell && (
          <div
            className="pointer-events-none absolute ring-[3px] ring-inset ring-glow-gold"
            style={{
              left: geo.origineX + selectedCell.posX * geo.mapWidth,
              top: geo.origineY + selectedCell.posY * geo.mapHeight,
              width: cw,
              height: ch,
            }}
          />
        )}

        {/* Survol : ZONE entière surlignée (sous-zone) + case sous le curseur + coordonnées/nom. */}
        {zone?.cells.map((c, i) => (
          <div
            key={`z${c.posX},${c.posY},${i}`}
            className="pointer-events-none absolute bg-glow-cyan/25"
            style={{
              left: geo.origineX + c.posX * geo.mapWidth,
              top: geo.origineY + c.posY * geo.mapHeight,
              width: cw,
              height: ch,
            }}
          />
        ))}
        {hover && (
          <>
            <div
              className="pointer-events-none absolute rounded-[2px] bg-glow-cyan/15 ring-2 ring-inset ring-white"
              style={{
                left: geo.origineX + hover.posX * geo.mapWidth,
                top: geo.origineY + hover.posY * geo.mapHeight,
                width: cw,
                height: ch,
              }}
            />
            <div
              className="pointer-events-none absolute"
              style={{
                left: geo.origineX + hover.posX * geo.mapWidth + geo.mapWidth / 2,
                top: geo.origineY + hover.posY * geo.mapHeight + geo.mapHeight,
              }}
            >
              <div
                className="max-w-[260px] rounded-lg border border-white/25 bg-void-900 px-2.5 py-1.5 text-center shadow-xl"
                style={{ transform: `translate(-50%, 6px) scale(${1 / view.s})`, transformOrigin: "top center" }}
              >
                {zone?.name && (
                  <div className="truncate text-[14px] font-extrabold leading-tight text-white drop-shadow">{zone.name}</div>
                )}
                <div className="font-mono text-[12px] font-bold text-glow-gold">
                  [{hover.posX}, {hover.posY}]
                </div>
              </div>
            </div>
          </>
        )}

        {/* Pins ressource — marqueur « goutte » (taille écran constante via contre-échelle 1/s,
            la pointe touche la map). Dégradé emerald + anneau blanc + ombre, quantité au centre. */}
        {pins?.map((p) => {
          const px = geo.origineX + p.posX * geo.mapWidth + geo.mapWidth / 2;
          const py = geo.origineY + p.posY * geo.mapHeight + geo.mapHeight / 2;
          return (
            <div key={p.mapId} className="pointer-events-none absolute" style={{ left: px, top: py }}>
              <div
                className="flex flex-col items-center"
                style={{ transform: `translate(-50%, -100%) scale(${1 / view.s})`, transformOrigin: "bottom center" }}
              >
                <div className="grid h-[22px] min-w-[22px] place-items-center rounded-full bg-gradient-to-b from-[#fb7185] to-[#e11d48] px-1.5 shadow-[0_3px_7px_rgba(0,0,0,0.6)] ring-2 ring-white">
                  <span className="text-[11px] font-extrabold leading-none text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.55)]">
                    {p.quantity}
                  </span>
                </div>
                {/* pointe vers le bas (couleur = bas du dégradé) */}
                <div className="-mt-px h-0 w-0 border-x-[5px] border-t-[7px] border-x-transparent border-t-[#e11d48]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Contrôles de zoom — stopPropagation pour ne pas déclencher drag/tap du viewport. */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1" onPointerDown={(e) => e.stopPropagation()}>
        <button
          onClick={() => zoomBy(1.4)}
          title="Zoomer"
          className="no-drag grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-void-900/80 text-lg font-bold leading-none text-slate-200 backdrop-blur transition hover:bg-white/10"
        >
          +
        </button>
        <button
          onClick={() => zoomBy(1 / 1.4)}
          title="Dézoomer"
          className="no-drag grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-void-900/80 text-lg font-bold leading-none text-slate-200 backdrop-blur transition hover:bg-white/10"
        >
          −
        </button>
      </div>
    </div>
  );
}

// Couche de fond : pyramide de tuiles 250px (façon DofusDB). On choisit le niveau de la pyramide
// dont le facteur d'échelle est juste ≥ au zoom courant (tuiles nettes), puis on ne rend que les
// tuiles intersectant le viewport. Positionnées dans le plan en coords pixel-monde.
function PyramidTiles({ geo, view }: { geo: WorldGeometry; view: MapView }) {
  const tiles = useMemo(() => {
    const scales = geo.customScales;
    if (!scales?.length || !view.vw || !view.s) return null;
    // Seuls les niveaux à nom NUMÉRIQUE ("0.2".."1") ont de vraies tuiles ; les "customN" sont des
    // niveaux d'interpolation SANS image (404). On pioche donc dans les niveaux réels, et au-delà du
    // plus détaillé on agrandit ses tuiles (zoom net jusqu'à l'échelle 1, puis adouci — jamais de trou).
    const asc = scales.filter((s) => /^[\d.]+$/.test(s.name)).sort((a, b) => a.x - b.x);
    if (!asc.length) return null;
    const lvl = asc.find((s) => s.x >= view.s) ?? asc[asc.length - 1];
    const columns = Math.ceil((geo.totalWidth * lvl.x) / 250);
    const rows = Math.ceil((geo.totalHeight * lvl.y) / 250);
    const tileW = 250 / lvl.x;
    const tileH = 250 / lvl.y;

    const { tx, ty, s, vw, vh } = view;
    const planeLeft = (0 - tx) / s;
    const planeRight = (vw - tx) / s;
    const planeTop = (0 - ty) / s;
    const planeBottom = (vh - ty) / s;
    const clamp = (v: number, hi: number) => Math.max(0, Math.min(v, hi));
    const tx0 = clamp(Math.floor((planeLeft * lvl.x) / 250) - 1, columns - 1);
    const tx1 = clamp(Math.ceil((planeRight * lvl.x) / 250) + 1, columns - 1);
    const ty0 = clamp(Math.floor((planeTop * lvl.y) / 250) - 1, rows - 1);
    const ty1 = clamp(Math.ceil((planeBottom * lvl.y) / 250) + 1, rows - 1);

    const out: { key: string; src: string; left: number; top: number }[] = [];
    for (let yy = ty0; yy <= ty1; yy++) {
      for (let xx = tx0; xx <= tx1; xx++) {
        const o = yy * columns + xx + 1;
        out.push({
          key: `${lvl.name}:${o}`,
          src: worldPyramidTileImg(geo.id, lvl.name, o),
          left: xx * tileW,
          top: yy * tileH,
        });
      }
      if (out.length > 400) break; // garde-fou
    }
    return { tiles: out, tileW: tileW + 0.5, tileH: tileH + 0.5 };
  }, [geo, view]);

  if (!tiles) return null;
  return (
    <>
      {tiles.tiles.map((t) => (
        <img
          key={t.key}
          src={t.src}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute max-w-none"
          style={{ left: t.left, top: t.top, width: tiles.tileW, height: tiles.tileH, pointerEvents: "none" }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
          }}
        />
      ))}
    </>
  );
}
