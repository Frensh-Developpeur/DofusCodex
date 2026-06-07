import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getEquipment } from "../api/dofusdude";
import { useStore, actions } from "../store/store";
import { skinatorEngine, useEngineOpen } from "../store/skinatorEngine";
import DofusIcon, { type DofusIconName } from "./DofusIcon";
import {
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
} from "./DofusIcons";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

type Item = { to: string; label: string; end?: boolean; dofus: DofusIconName };

const GROUPS: { title?: string; items: Item[]; collapsible?: boolean }[] = [
  {
    items: [{ to: "/", label: "Accueil", dofus: "world", end: true }],
  },
  {
    title: "Jeu",
    collapsible: true,
    items: [
      { to: "/donjons", label: "Donjons", dofus: "dungeon" },
      { to: "/guides", label: "Guides", dofus: "book" },
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
      { to: "/chasse", label: "Chasse au trésor", dofus: "map" },
      { to: "/metamob", label: "Metamob", dofus: "archmonster" },
      { to: "/almanax", label: "Almanax", dofus: "calendar" },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const lastGuide = useStore((s) => s.recentGuides[0]);
  const collapsed = useStore((s) => s.sidebarCollapsed);
  // Groupes repliables (ex. Encyclopédie) : repliés par défaut au lancement, mais ouverts
  // d'emblée si l'onglet courant est dedans (pour voir la page active). État de session.
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const g of GROUPS) {
      if (g.collapsible && g.title) {
        init[g.title] = g.items.some((it) => it.to !== "/" && location.pathname.startsWith(it.to));
      }
    }
    return init;
  });
  const toggleGroup = (title: string) => setOpenGroups((s) => ({ ...s, [title]: !s[title] }));
  // Quitter le Skinator avec le moteur ouvert → on intercepte pour proposer un choix.
  const engineOpen = useEngineOpen();
  const guardLeave = location.pathname === "/skinator" && engineOpen;

  // Mémoire de section : dernier chemin visité sous chaque onglet (le temps de la session).
  // Recliquer un onglet ramène donc sur la sous-page quittée (ex. la fiche d'un monstre/donjon
  // ouverte), pas sur la liste — sauf si on est déjà dans la section (là, on va à la liste).
  // Sur une fiche objet /objets/:id, l'item peut être un ÉQUIPEMENT (→ onglet Équipements)
  // ou une ressource (→ onglet Objets). On lit le même cache que la page détail (queryKey
  // ["item-equip", id]) pour décider quel onglet surligner. `itemSection` ne vaut que sur ces
  // pages ; ailleurs il est null → comportement normal (NavLink isActive) pour tout le reste.
  const itemMatch = location.pathname.match(/^\/objets\/(\d+)/);
  const itemId = itemMatch ? Number(itemMatch[1]) : null;
  const { data: equipItem } = useQuery({
    queryKey: ["item-equip", itemId],
    queryFn: ({ signal }) => getEquipment(itemId!, signal).catch(() => null),
    enabled: itemId != null,
  });
  const itemSection = itemId == null ? null : equipItem ? "/stuffinator" : "/objets";

  // Mémoire de section : dernier chemin visité par onglet. Pour une fiche objet, on rattache
  // la save à la section RÉELLE (itemSection) — pas à /objets via l'URL — afin que recliquer
  // l'onglet d'origine (ex. Équipements) y revienne. On attend que le type soit connu.
  const sectionMemory = useRef<Record<string, string>>({});
  useEffect(() => {
    const path = location.pathname;
    if (itemId != null) {
      if (itemSection) sectionMemory.current[itemSection] = path;
      return;
    }
    for (const g of GROUPS) {
      for (const it of g.items) {
        if (it.to !== "/" && (path === it.to || path.startsWith(it.to + "/"))) {
          sectionMemory.current[it.to] = path;
        }
      }
    }
  }, [location.pathname, itemId, itemSection]);

  return (
    <aside
      className={clsx(
        "relative z-20 flex shrink-0 flex-col border-r border-white/5 bg-void-900/40 backdrop-blur-md transition-[width] duration-200 ease-out",
        collapsed ? "w-[68px]" : "w-[230px]",
      )}
    >
      {/* Bouton réduire / agrandir */}
      <div className={clsx("flex p-3 pb-1", collapsed ? "justify-center" : "justify-end")}>
        <button
          onClick={() => actions.toggleSidebar()}
          title={collapsed ? "Agrandir le menu" : "Réduire le menu"}
          aria-label={collapsed ? "Agrandir le menu" : "Réduire le menu"}
          className="no-drag rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-2.5 overflow-y-auto overflow-x-hidden px-3 pb-3">
        {GROUPS.map((group, gi) => {
          // En mode icônes (sidebar réduite) on affiche tout ; sinon on respecte le repli du groupe.
          const isCollapsibleHeader = !!group.collapsible && !!group.title && !collapsed;
          const groupOpen = !isCollapsibleHeader || (group.title ? openGroups[group.title] : true);
          return (
          <div key={gi} className="flex flex-col gap-0.5">
            {group.title &&
              (collapsed ? (
                gi > 0 && <div className="mx-auto my-1.5 h-px w-6 bg-white/10" />
              ) : isCollapsibleHeader ? (
                <button
                  onClick={() => toggleGroup(group.title!)}
                  className="no-drag flex items-center justify-between rounded-lg px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600 transition hover:text-slate-400"
                  aria-expanded={groupOpen}
                >
                  <span>{group.title}</span>
                  <ChevronDown className={clsx("h-3.5 w-3.5 transition-transform", groupOpen ? "rotate-180" : "")} />
                </button>
              ) : (
                <span className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                  {group.title}
                </span>
              ))}
            {groupOpen &&
              group.items.map((item) => {
              const isGuides = item.to === "/guides";
              // « Dans la section » inclut le cas fiche objet rattachée à cet onglet
              // (itemSection) → recliquer l'onglet actif y ramène à la liste, et depuis
              // une AUTRE section on revient à l'item mémorisé.
              const inSection =
                location.pathname === item.to ||
                location.pathname.startsWith(item.to + "/") ||
                item.to === itemSection;
              const remembered = sectionMemory.current[item.to];
              // Guides : repère via le store (persistant). Autres sections : mémoire de session.
              // Si on est déjà dans la section, on cible la liste (item.to) pour pouvoir y revenir.
              const to = isGuides && lastGuide ? `/guides/${lastGuide}` : !inSection && remembered ? remembered : item.to;
              const forceActive = isGuides && location.pathname.startsWith("/guides");
              // Sur une fiche objet, l'onglet actif dépend du type (équipement → Équipements,
              // ressource → Objets) ; partout ailleurs, highlight normal (NavLink isActive).
              const activeFor = (isActive: boolean) =>
                itemSection ? item.to === itemSection : isActive || forceActive;
              return (
                <NavLink
                  key={item.to}
                  to={to}
                  end={item.end}
                  // Arrivée « par la sidebar » = interne à la section → la fiche éventuelle
                  // propose un retour vers la liste de la section (et non un navigate(-1)).
                  state={{ fromSection: true }}
                  title={collapsed ? item.label : undefined}
                  onClick={(e) => {
                    if (guardLeave && to !== "/skinator") {
                      e.preventDefault();
                      skinatorEngine.requestLeave(to);
                    }
                  }}
                  className={({ isActive }) =>
                    clsx(
                      "no-drag group relative flex items-center rounded-xl text-sm font-medium transition-colors",
                      collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
                      activeFor(isActive) ? "text-white" : "text-slate-400 hover:text-slate-200",
                    )
                  }
                >
                  {({ isActive }) => {
                    const active = activeFor(isActive);
                    return (
                      <>
                        {active && (
                          <motion.span
                            layoutId="nav-active"
                            className="absolute inset-0 rounded-xl border border-glow-purple/30 bg-gradient-to-r from-glow-purple/20 to-glow-cyan/10 shadow-glow"
                            transition={{ type: "spring", stiffness: 400, damping: 32 }}
                          />
                        )}
                        <DofusIcon
                          name={item.dofus}
                          size={18}
                          className={clsx("relative transition", active ? "opacity-100" : "opacity-70 group-hover:opacity-100")}
                        />
                        {!collapsed && <span className="relative truncate">{item.label}</span>}
                      </>
                    );
                  }}
                </NavLink>
              );
            })}
          </div>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/5 p-3">
        <NavLink
          to="/parametres"
          state={{ fromSidebar: true }}
          title={collapsed ? "Paramètres" : undefined}
          onClick={(e) => {
            if (guardLeave) {
              e.preventDefault();
              skinatorEngine.requestLeave("/parametres");
            }
          }}
          className={({ isActive }) =>
            clsx(
              "no-drag group relative flex items-center rounded-xl text-sm font-medium transition-colors",
              collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
              isActive ? "text-white" : "text-slate-400 hover:text-slate-200",
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl border border-glow-purple/30 bg-gradient-to-r from-glow-purple/20 to-glow-cyan/10 shadow-glow"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <DofusIcon
                name="settingsGear"
                size={18}
                className={clsx("relative transition", isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100")}
              />
              {!collapsed && <span className="relative truncate">Paramètres</span>}
            </>
          )}
        </NavLink>
      </div>
    </aside>
  );
}
