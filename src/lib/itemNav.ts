import type { NavigateFunction } from "react-router-dom";

// Pile de navigation du FLUX des fiches d'objet (/objets/:id). Permet, quand on rouvre un
// item déjà visité dans la chaîne courante (ex. ping-pong A→B→A→B via les pièces de panoplie),
// de REVENIR dessus (navigate négatif) au lieu d'empiler un doublon → « Retour » ne repasse
// plus N fois sur les mêmes pages. La pile est réinitialisée dès qu'on quitte le flux objet.
let stack: string[] = [];

const isItem = (p: string) => /^\/objets\/\d+/.test(p);

// À appeler à chaque changement de location (garde la pile alignée, gère aussi le back natif).
export function trackItemNav(pathname: string) {
  if (!isItem(pathname)) {
    stack = [];
    return;
  }
  const i = stack.indexOf(pathname);
  if (i >= 0) stack = stack.slice(0, i + 1); // on est revenu sur une entrée existante
  else stack.push(pathname);
}

// Navigue vers une fiche objet ; si elle est déjà dans la pile, on y revient (delta négatif)
// au lieu d'empiler un doublon. Cliquer l'item courant → no-op.
export function goItem(navigate: NavigateFunction, to: string) {
  const i = stack.indexOf(to);
  if (i >= 0) {
    const delta = i - (stack.length - 1);
    if (delta !== 0) navigate(delta);
  } else {
    navigate(to);
  }
}
