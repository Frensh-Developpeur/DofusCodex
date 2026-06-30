// État ÉPHÉMÈRE (non persisté) du moteur Barbofus du Skinator + coordination de la
// navigation. Volontairement hors du store localStorage : à la fermeture de l'app tout
// repart à zéro (le webview n'existe plus de toute façon → reopen depuis le CTA).
//
//  • engineOpen  : le moteur Skinator (webview) est-il monté/ouvert ?
//  • galleryOpen : la galerie Barbofus (webview) est-elle montée/ouverte ?
//  • pendingLeave : navigation interceptée en attente d'un choix de l'utilisateur
//                   (fermer le ou les webviews vs laisser en fond) — null si aucun.
import { useSyncExternalStore } from "react";

let engineOpen = false;
let galleryOpen = false;
type PendingLeave = { path: string; source: "skinator" | "gallery" | "both" };
let pendingLeave: PendingLeave | null = null;
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
  setGalleryOpen(v: boolean) {
    if (galleryOpen === v) return;
    galleryOpen = v;
    emit();
  },
  requestLeave(path: string, source: PendingLeave["source"] = "skinator") {
    if (pendingLeave?.path === path && pendingLeave.source === source) return;
    pendingLeave = { path, source };
    emit();
  },
  clearPending() {
    if (pendingLeave === null) return;
    pendingLeave = null;
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
const getGalleryOpen = () => galleryOpen;
const getPendingLeave = () => pendingLeave;
const getLoadRequest = () => loadRequest;

export function useEngineOpen(): boolean {
  return useSyncExternalStore(subscribe, getEngineOpen, getEngineOpen);
}
export function useGalleryOpen(): boolean {
  return useSyncExternalStore(subscribe, getGalleryOpen, getGalleryOpen);
}
export function usePendingLeave(): PendingLeave | null {
  return useSyncExternalStore(subscribe, getPendingLeave, getPendingLeave);
}
export function useSkinLoadRequest(): { url: string; nonce: number } | null {
  return useSyncExternalStore(subscribe, getLoadRequest, getLoadRequest);
}
