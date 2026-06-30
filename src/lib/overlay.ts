import { useSyncExternalStore } from "react";

// Mode overlay = une FENÊTRE DÉDIÉE, transparente et always-on-top, qui flotte au-dessus du jeu
// pour lire un guide. La fenêtre principale n'est pas touchée (elle est juste masquée le temps de
// l'overlay). Cette fenêtre charge le même renderer avec `?overlay=1` → on le détecte ici.
//
// L'opacité s'applique au FOND uniquement (couche translucide réglable, texte opaque par-dessus),
// pas via l'opacité de fenêtre. La valeur est persistée pour être retrouvée.

export const isOverlayWindow =
  typeof window !== "undefined" && new URLSearchParams(window.location.search).get("overlay") === "1";

export const overlaySupported = typeof window !== "undefined" && !!window.dofusCodex?.overlayOpen;

let overlayMode = isOverlayWindow;
const modeSubs = new Set<() => void>();

function applyOverlayMode(active: boolean) {
  overlayMode = active;
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("overlay-win", active);
  }
  for (const s of modeSubs) s();
}

if (typeof window !== "undefined") {
  if (overlayMode) document.documentElement.classList.add("overlay-win");
  window.dofusCodex?.onOverlayState?.((payload) => {
    const active = !!payload?.active;
    if (payload?.route && active) window.location.hash = payload.route;
    applyOverlayMode(active);
  });
}

export function useOverlayMode(): boolean {
  return useSyncExternalStore(
    (cb) => {
      modeSubs.add(cb);
      return () => modeSubs.delete(cb);
    },
    () => overlayMode,
    () => overlayMode,
  );
}

// ---- Opacité du fond (0.1 → 1), partagée par fenêtre via localStorage ----
const ALPHA_KEY = "dofuscodex.overlayAlpha";
function loadAlpha(): number {
  const n = Number(typeof localStorage !== "undefined" ? localStorage.getItem(ALPHA_KEY) : null);
  return Number.isFinite(n) && n > 0 ? Math.min(1, Math.max(0.1, n)) : 0.82;
}

let alpha = loadAlpha();
const subs = new Set<() => void>();

export function useOverlayAlpha(): number {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => alpha,
    () => alpha,
  );
}

export function setOverlayAlpha(v: number) {
  alpha = Math.min(1, Math.max(0.1, v));
  try {
    localStorage.setItem(ALPHA_KEY, String(alpha));
  } catch {
    /* best-effort */
  }
  for (const s of subs) s();
}

// ---- Pilotage de la fenêtre overlay ----
// (fenêtre principale) ouvre l'overlay sur un chemin interne (ou un guideId historique).
export function openOverlay(target: number | string) {
  const path = typeof target === "number" ? `/guides/${target}` : target;
  if (path) window.location.hash = path;
  window.dofusCodex?.overlayOpen?.(path);
}
// (fenêtre overlay) la ferme et réaffiche la fenêtre principale
export function closeOverlay() {
  window.dofusCodex?.overlayClose?.();
}
