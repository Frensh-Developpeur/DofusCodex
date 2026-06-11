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
// (fenêtre principale) ouvre l'overlay sur un guide donné
export function openOverlay(guideId: number) {
  window.dofusCodex?.overlayOpen?.(guideId);
}
// (fenêtre overlay) la ferme et réaffiche la fenêtre principale
export function closeOverlay() {
  window.dofusCodex?.overlayClose?.();
}
