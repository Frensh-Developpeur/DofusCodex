import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useStore, actions } from "../store/store";
import { skinatorEngine, useEngineOpen } from "../store/skinatorEngine";
import {
  LayoutDashboard,
  Swords,
  Shirt,
  Hammer,
  BookOpen,
  CalendarDays,
  Skull,
  Compass,
  Palette,
  Images,
  Layers3,
  Users,
  Boxes,
  Tent,
  Trophy,
  Settings,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import clsx from "clsx";
import { useState } from "react";

type Item = { to: string; label: string; icon: typeof Swords; end?: boolean };

const GROUPS: { title?: string; items: Item[]; collapsible?: boolean }[] = [
  {
    items: [{ to: "/", label: "Accueil", icon: LayoutDashboard, end: true }],
  },
  {
    title: "Jeu",
    collapsible: true,
    items: [
      { to: "/donjons", label: "Donjons", icon: Swords },
      { to: "/guides", label: "Guides", icon: BookOpen },
    ],
  },
  {
    title: "Encyclopédie",
    collapsible: true,
    items: [
      { to: "/classes", label: "Classes", icon: Users },
      { to: "/monstres", label: "Monstres", icon: Skull },
      { to: "/stuffinator", label: "Équipements", icon: Shirt },
      { to: "/panoplies", label: "Panoplies", icon: Layers3 },
      { to: "/objets", label: "Objets & Ressources", icon: Boxes },
      { to: "/havre-sac", label: "Havre-Sacs", icon: Tent },
      { to: "/succes", label: "Succès", icon: Trophy },
    ],
  },
  {
    title: "Skin",
    collapsible: true,
    items: [
      { to: "/skinator", label: "Skinator", icon: Palette },
      { to: "/mes-skins", label: "Mes Skins", icon: Images },
    ],
  },
  {
    title: "Outils",
    collapsible: true,
    items: [
      { to: "/builder", label: "Builder", icon: Hammer },
      { to: "/chasse", label: "Chasse au trésor", icon: Compass },
      { to: "/almanax", label: "Almanax", icon: CalendarDays },
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
              const to = isGuides && lastGuide ? `/guides/${lastGuide}` : item.to;
              const forceActive = isGuides && location.pathname.startsWith("/guides");
              return (
                <NavLink
                  key={item.to}
                  to={to}
                  end={item.end}
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
                      isActive || forceActive ? "text-white" : "text-slate-400 hover:text-slate-200",
                    )
                  }
                >
                  {({ isActive }) => {
                    const active = isActive || forceActive;
                    return (
                      <>
                        {active && (
                          <motion.span
                            layoutId="nav-active"
                            className="absolute inset-0 rounded-xl border border-glow-purple/30 bg-gradient-to-r from-glow-purple/20 to-glow-cyan/10 shadow-glow"
                            transition={{ type: "spring", stiffness: 400, damping: 32 }}
                          />
                        )}
                        <item.icon
                          className={clsx(
                            "relative h-[18px] w-[18px] shrink-0 transition-colors",
                            active ? "text-glow-violet" : "text-slate-500 group-hover:text-slate-300",
                          )}
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
              <Settings
                className={clsx(
                  "relative h-[18px] w-[18px] shrink-0 transition-colors",
                  isActive ? "text-glow-violet" : "text-slate-500 group-hover:text-slate-300",
                )}
              />
              {!collapsed && <span className="relative truncate">Paramètres</span>}
            </>
          )}
        </NavLink>
      </div>
    </aside>
  );
}
