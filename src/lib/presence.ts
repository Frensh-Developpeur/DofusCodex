// Compteur d'utilisateurs en ligne via Supabase Realtime *Presence*.
//
// 100 % géré par le serveur Realtime de Supabase : AUCUNE table, AUCUNE écriture en BDD, aucun
// serveur à héberger. Chaque instance de l'app rejoint un canal de présence ; on compte les clés
// uniques (= appareils/utilisateurs distincts, pas les fenêtres). La clé anon suffit — les
// utilisateurs déconnectés sont comptés aussi.
//
// Dégradation propre : si Supabase n'est pas configuré (`supabase === null`), le compteur reste
// `null` et l'UI se masque. Un seul canal partagé pour toute l'app (singleton) quel que soit le
// nombre de composants qui lisent le compteur.
import { useSyncExternalStore } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "./supabase";

// Identité stable par appareil : plusieurs fenêtres du même appareil (ex. principale + overlay)
// partagent la clé → comptées UNE fois. Signés ou non, peu importe.
const DEVICE_KEY = "dofuscodex.deviceId";
function getDeviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  } catch {
    return `anon-${Math.random().toString(36).slice(2)}`;
  }
}

let count: number | null = null;
let channel: RealtimeChannel | null = null;
let started = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

// Rejoint le canal une seule fois, à la première lecture du compteur. Le canal vit ensuite pour
// toute la session (le compteur est quasi toujours monté) — pas de teardown.
function start() {
  if (started || !supabase) return;
  started = true;
  const key = getDeviceId();
  channel = supabase.channel("online-users", { config: { presence: { key } } });
  channel
    .on("presence", { event: "sync" }, () => {
      // presenceState() = { [key]: metas[] } → nb de clés = utilisateurs distincts connectés.
      count = Object.keys(channel!.presenceState()).length;
      emit();
    })
    .subscribe((status) => {
      // On ne s'annonce qu'une fois abonné (sinon `track` est ignoré).
      if (status === "SUBSCRIBED") void channel!.track({ at: Date.now() });
    });
}

/** Nombre d'utilisateurs actuellement en ligne, ou `null` si indisponible (Supabase non configuré
 *  ou pas encore synchronisé). */
export function usePresenceCount(): number | null {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      start();
      return () => listeners.delete(cb);
    },
    () => count,
    () => count,
  );
}
