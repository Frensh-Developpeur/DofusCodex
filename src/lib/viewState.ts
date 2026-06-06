import { useCallback, useState } from "react";

// ───────────────────────────────────────────────────────────────────────────
// État d'affichage persistant (le temps de la session)
//
// Filet de sécurité : se comporte comme `useState` mais mémorise sa valeur dans un
// cache module, indexé par une clé stable propre à la page. Même si une page venait
// à être démontée, on repartirait du dernier état connu (filtres, recherche, onglet…).
// Avec le keep-alive en place (App.tsx), les pages de liste ne sont de toute façon plus
// démontées — mais ce hook reste utile et inoffensif.
// ───────────────────────────────────────────────────────────────────────────

const viewStore = new Map<string, unknown>();

export function useViewState<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => (viewStore.has(key) ? (viewStore.get(key) as T) : initial));
  const set = useCallback(
    (v: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
        viewStore.set(key, next);
        return next;
      });
    },
    [key],
  );
  return [state, set];
}

// Purge totale (branché sur « Vider le cache »).
export function clearViewState() {
  viewStore.clear();
}
