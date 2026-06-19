import type { DofusIconName } from "../components/DofusIcon";

// Définition partagée des entrées du menu (sidebar + gestionnaire de favoris).
export type NavItem = { to: string; label: string; end?: boolean; dofus: DofusIconName };
export type NavGroup = { title?: string; items: NavItem[]; collapsible?: boolean };

export const NAV_GROUPS: NavGroup[] = [
  {
    items: [{ to: "/", label: "Accueil", dofus: "world", end: true }],
  },
  {
    title: "Jeu",
    collapsible: true,
    items: [
      { to: "/donjons", label: "Donjons", dofus: "dungeon" },
      { to: "/quetes", label: "Quêtes", dofus: "quete" },
      { to: "/avis-de-recherche", label: "Avis de recherche", dofus: "teteDeMort" },
      { to: "/guides", label: "Guides", dofus: "book" },
      { to: "/arbre", label: "Arbre des guides", dofus: "genealogy" },
    ],
  },
  {
    title: "Monde",
    collapsible: true,
    items: [
      { to: "/carte", label: "Carte du monde", dofus: "map" },
      { to: "/metiers", label: "Métiers & Craft", dofus: "job" },
      { to: "/liste-courses", label: "Liste de courses", dofus: "cupboard" },
    ],
  },
  {
    title: "Encyclopédie",
    collapsible: true,
    items: [
      { to: "/classes", label: "Classes", dofus: "emote" },
      { to: "/monstres", label: "Monstres", dofus: "bestiary" },
      { to: "/stuffinator", label: "Équipements", dofus: "menuStuffs" },
      { to: "/panoplies", label: "Panoplies", dofus: "menuItemsets" },
      { to: "/objets", label: "Objets & Ressources", dofus: "inventory" },
      { to: "/havre-sac", label: "Havre-Sacs", dofus: "havenbag" },
      { to: "/succes", label: "Succès", dofus: "trophy" },
    ],
  },
  {
    title: "Skin",
    collapsible: true,
    items: [
      { to: "/skinator", label: "Skinator", dofus: "character" },
      { to: "/mes-skins", label: "Mes Skins", dofus: "glyph" },
    ],
  },
  {
    title: "Outils",
    collapsible: true,
    items: [
      { to: "/builder", label: "Builder", dofus: "characteristic" },
      { to: "/forgemagie", label: "Forgemagie", dofus: "fm" },
      { to: "/rentabilite-metiers", label: "XP métier", dofus: "recipe" },
      { to: "/xp-familier", label: "XP familier", dofus: "bestiary" },
      { to: "/chasse", label: "Chasse au trésor", dofus: "map" },
      { to: "/metamob", label: "Metamob", dofus: "archmonster" },
      { to: "/almanax", label: "Almanax", dofus: "calendar" },
    ],
  },
];

// Tous les items indexés par chemin (hors Accueil) → résolution des favoris (label + icône).
export const ALL_NAV_ITEMS = new Map<string, NavItem>();
for (const g of NAV_GROUPS) for (const it of g.items) if (it.to !== "/") ALL_NAV_ITEMS.set(it.to, it);
