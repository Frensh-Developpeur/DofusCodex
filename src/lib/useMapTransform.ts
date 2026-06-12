import { useCallback, useEffect, useRef, useState } from "react";

// Moteur pan/zoom fait-main pour la worldmap (cf. décision d'archi : pas de Leaflet).
// Un « plan monde » en coordonnées pixel de la worldmap (totalWidth×totalHeight) est positionné
// par transform: translate(tx,ty) scale(s) (origin 0 0). Les tuiles/pins sont des enfants du plan
// → ils suivent le transform sans calcul par élément. On écrit le transform en IMPÉRATIF dans les
// handlers (fluide, pas de render par tick) et on publie une vue throttlée (rAF) pour le culling.

export interface MapGeometry {
  origineX: number;
  origineY: number;
  mapWidth: number;
  mapHeight: number;
  totalWidth: number;
  totalHeight: number;
  startScale?: number;
}

export interface MapView {
  tx: number;
  ty: number;
  s: number;
  vw: number;
  vh: number;
}

// Zoom max : l'échelle 1 = résolution native de la worldmap (niveau le plus détaillé avec tuiles).
// On autorise un peu au-delà (agrandissement des tuiles « 1 ») pour lire les détails, sans casser.
const MAX_SCALE = 2;
const KEEP = 120; // px du monde toujours visibles (anti perte totale au pan)

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

export function useMapTransform(geo: MapGeometry | null, onTap?: (x: number, y: number) => void) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const tf = useRef({ tx: 0, ty: 0, s: 1 });
  const size = useRef({ vw: 0, vh: 0 });
  const geoRef = useRef(geo);
  geoRef.current = geo;
  const onTapRef = useRef(onTap);
  onTapRef.current = onTap;
  const initDone = useRef(false);

  // Convertit une position écran (relative au viewport) en coordonnée du plan monde.
  const screenToPlane = useCallback((x: number, y: number) => {
    const { tx, ty, s } = tf.current;
    return { px: (x - tx) / s, py: (y - ty) / s };
  }, []);

  const [view, setView] = useState<MapView>({ tx: 0, ty: 0, s: 1, vw: 0, vh: 0 });

  // Échelle min = celle qui fait tenir le monde entier dans le viewport (la pyramide rend ça
  // efficace : tout le monde = quelques dizaines de tuiles au niveau le plus dézoomé).
  const minScale = useCallback(() => {
    const g = geoRef.current;
    const { vw, vh } = size.current;
    if (!g || !vw || !vh) return 0.1;
    return Math.max(0.03, Math.min(vw / g.totalWidth, vh / g.totalHeight) * 0.9);
  }, []);

  const apply = useCallback(() => {
    const el = planeRef.current;
    if (el) {
      const { tx, ty, s } = tf.current;
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${s})`;
    }
  }, []);

  const publishRaf = useRef(0);
  const publish = useCallback(() => {
    if (publishRaf.current) return;
    publishRaf.current = requestAnimationFrame(() => {
      publishRaf.current = 0;
      const { tx, ty, s } = tf.current;
      const { vw, vh } = size.current;
      setView((prev) =>
        prev.tx === tx && prev.ty === ty && prev.s === s && prev.vw === vw && prev.vh === vh
          ? prev
          : { tx, ty, s, vw, vh },
      );
    });
  }, []);

  const clampPan = useCallback(() => {
    const g = geoRef.current;
    if (!g) return;
    const { vw, vh } = size.current;
    const { s } = tf.current;
    const W = g.totalWidth * s;
    const H = g.totalHeight * s;
    tf.current.tx = clamp(tf.current.tx, KEEP - W, vw - KEEP);
    tf.current.ty = clamp(tf.current.ty, KEEP - H, vh - KEEP);
  }, []);

  // Zoom centré sur un point écran (cx,cy) — garde le point du plan sous le curseur fixe.
  const zoomAt = useCallback(
    (cx: number, cy: number, factor: number) => {
      const s0 = tf.current.s;
      const s1 = clamp(s0 * factor, minScale(), MAX_SCALE);
      if (s1 === s0) return;
      tf.current.tx = cx - (cx - tf.current.tx) * (s1 / s0);
      tf.current.ty = cy - (cy - tf.current.ty) * (s1 / s0);
      tf.current.s = s1;
      clampPan();
      apply();
      publish();
    },
    [apply, clampPan, minScale, publish],
  );

  // Centre une coordonnée du plan dans le viewport (deep-link ressource / sélection de monde).
  const focusOn = useCallback(
    (planeX: number, planeY: number, scale?: number) => {
      const { vw, vh } = size.current;
      if (scale != null) tf.current.s = clamp(scale, minScale(), MAX_SCALE);
      const s = tf.current.s;
      tf.current.tx = vw / 2 - planeX * s;
      tf.current.ty = vh / 2 - planeY * s;
      clampPan();
      apply();
      publish();
    },
    [apply, clampPan, minScale, publish],
  );

  const zoomBy = useCallback(
    (factor: number) => {
      const { vw, vh } = size.current;
      zoomAt(vw / 2, vh / 2, factor);
    },
    [zoomAt],
  );

  // Attache molette + pointeurs (drag + pinch) en non-passif (pour preventDefault sur la molette).
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = vp.getBoundingClientRect();
      const factor = Math.exp(-e.deltaY * 0.0015);
      zoomAt(e.clientX - r.left, e.clientY - r.top, factor);
    };

    const pointers = new Map<number, { x: number; y: number }>();
    let pinchDist = 0;
    let dragging = false;
    let downAt = { x: 0, y: 0 };
    let moved = false;

    const onDown = (e: PointerEvent) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      vp.setPointerCapture(e.pointerId);
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
      } else {
        dragging = true;
        downAt = { x: e.clientX, y: e.clientY };
        moved = false;
      }
    };

    const onMove = (e: PointerEvent) => {
      const prev = pointers.get(e.pointerId);
      if (!prev) return;
      const cur = { x: e.clientX, y: e.clientY };
      pointers.set(e.pointerId, cur);
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchDist > 0 && dist > 0) {
          const r = vp.getBoundingClientRect();
          zoomAt((a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top, dist / pinchDist);
        }
        pinchDist = dist;
      } else if (dragging) {
        tf.current.tx += cur.x - prev.x;
        tf.current.ty += cur.y - prev.y;
        if (Math.hypot(cur.x - downAt.x, cur.y - downAt.y) > 6) moved = true;
        clampPan();
        apply();
        publish();
      }
    };

    const onUp = (e: PointerEvent) => {
      const wasSingle = pointers.size === 1;
      pointers.delete(e.pointerId);
      try {
        vp.releasePointerCapture(e.pointerId);
      } catch {
        /* déjà relâché */
      }
      // Tap (pas de drag, un seul pointeur) → sélection de la cellule sous le pointeur.
      if (wasSingle && !moved && onTapRef.current) {
        const r = vp.getBoundingClientRect();
        onTapRef.current(e.clientX - r.left, e.clientY - r.top);
      }
      if (pointers.size < 2) pinchDist = 0;
      if (pointers.size === 0) dragging = false;
    };

    vp.addEventListener("wheel", onWheel, { passive: false });
    vp.addEventListener("pointerdown", onDown);
    vp.addEventListener("pointermove", onMove);
    vp.addEventListener("pointerup", onUp);
    vp.addEventListener("pointercancel", onUp);

    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      // Ignore les tailles nulles (page keep-alive masquée en display:none) → ne pas
      // corrompre le transform ; on retrouvera la bonne taille au ré-affichage.
      if (!rect || rect.width === 0 || rect.height === 0) return;
      size.current = { vw: rect.width, vh: rect.height };
      const g = geoRef.current;
      if (g && rect.width && rect.height && !initDone.current) {
        initDone.current = true;
        // Vue de départ : centre du monde, à l'échelle « régionale » de DofusDB (startScale).
        tf.current.s = clamp(g.startScale ?? 0.6, minScale(), MAX_SCALE);
        tf.current.tx = rect.width / 2 - (g.totalWidth / 2) * tf.current.s;
        tf.current.ty = rect.height / 2 - (g.totalHeight / 2) * tf.current.s;
        apply();
      } else {
        // S'assure que l'échelle reste >= minScale quand le viewport change.
        tf.current.s = Math.max(tf.current.s, minScale());
        clampPan();
        apply();
      }
      publish();
    });
    ro.observe(vp);

    return () => {
      vp.removeEventListener("wheel", onWheel);
      vp.removeEventListener("pointerdown", onDown);
      vp.removeEventListener("pointermove", onMove);
      vp.removeEventListener("pointerup", onUp);
      vp.removeEventListener("pointercancel", onUp);
      ro.disconnect();
      if (publishRaf.current) cancelAnimationFrame(publishRaf.current);
    };
  }, [apply, clampPan, minScale, publish, zoomAt]);

  return { viewportRef, planeRef, view, focusOn, zoomBy, screenToPlane };
}
