// État ÉPHÉMÈRE (non persisté) du moteur Barbofus du Skinator + coordination de la
// navigation. Volontairement hors du store localStorage : à la fermeture de l'app tout
// repart à zéro (le webview n'existe plus de toute façon → reopen depuis le CTA).
//
//  • engineOpen  : le moteur (webview) est-il monté/ouvert ?
//  • pendingPath : navigation interceptée en attente d'un choix de l'utilisateur
//                  (fermer le moteur vs le laisser en fond) — null si aucun.
import { useSyncExternalStore } from "react";

let engineOpen = false;
let pendingPath: string | null = null;
// Demande de chargement d'un skin sauvegardé dans le moteur (depuis la page « Mes Skins »).
// Le nonce force la re-consommation même si on recharge deux fois la même URL.
let loadRequest: { url: string; nonce: number } | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export const skinatorEngine = {
  setOpen(v: boolean) {
    if (engineOpen === v) return;
    engineOpen = v;
    emit();
  },
  requestLeave(path: string) {
    if (pendingPath === path) return;
    pendingPath = path;
    emit();
  },
  clearPending() {
    if (pendingPath === null) return;
    pendingPath = null;
    emit();
  },
  requestLoadSkin(url: string) {
    loadRequest = { url, nonce: Date.now() };
    emit();
  },
  clearLoadRequest() {
    if (loadRequest === null) return;
    loadRequest = null;
    emit();
  },
};

const getEngineOpen = () => engineOpen;
const getPendingPath = () => pendingPath;
const getLoadRequest = () => loadRequest;

export function useEngineOpen(): boolean {
  return useSyncExternalStore(subscribe, getEngineOpen, getEngineOpen);
}
export function usePendingLeave(): string | null {
  return useSyncExternalStore(subscribe, getPendingPath, getPendingPath);
}
export function useSkinLoadRequest(): { url: string; nonce: number } | null {
  return useSyncExternalStore(subscribe, getLoadRequest, getLoadRequest);
}
