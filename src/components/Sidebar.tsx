import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useStore, actions } from "../store/store";
import { skinatorEngine, useEngineOpen } from "../store/skinatorEngine";
import ClearCacheButton from "./ClearCacheButton";
import DataBackup from "./DataBackup";
import {
  LayoutDashboard,
  Swords,
  Shirt,
  Hammer,
  BookOpen,
  CalendarDays,
  Skull,
  Compass,
  Github,
  Palette,
  Images,
  Layers3,
  Users,
  Boxes,
  Tent,
  Trophy,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import clsx from "clsx";

type Item = { to: string; label: string; icon: typeof Swords; end?: boolean };

const GROUPS: { title?: string; items: Item[] }[] = [
  {
    items: [{ to: "/", label: "Accueil", icon: LayoutDashboard, end: true }],
  },
  {
    title: "Jeu",
    items: [
      { to: "/donjons", label: "Donjons", icon: Swords },
      { to: "/guides", label: "Guides", icon: BookOpen },
    ],
  },
  {
    title: "Encyclopédie",
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
    items: [
      { to: "/skinator", label: "Skinator", icon: Palette },
      { to: "/mes-skins", label: "Mes Skins", icon: Images },
    ],
  },
  {
    title: "Outils",
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
        {GROUPS.map((group, gi) => (
          <div key={gi} className="flex flex-col gap-0.5">
            {group.title &&
              (collapsed ? (
                gi > 0 && <div className="mx-auto my-1.5 h-px w-6 bg-white/10" />
              ) : (
                <span className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                  {group.title}
                </span>
              ))}
            {group.items.map((item) => {
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
        ))}
      </nav>

      <div className="mt-auto p-3">
        {!collapsed && (
          <div className="glass rounded-xl p-3 text-xs text-slate-400">
            <p className="font-semibold text-slate-300">Données live</p>
            <p className="mt-1 leading-relaxed">
              Propulsé par <span className="text-glow-violet">DofusDude</span> &{" "}
              <span className="text-glow-cyan">DofusDB</span>.
            </p>
            <a
              href="https://github.com/dofusdude"
              className="no-drag mt-2 inline-flex items-center gap-1.5 text-slate-500 transition hover:text-slate-300"
            >
              <Github className="h-3.5 w-3.5" /> API open-source
            </a>
            <DataBackup />
          </div>
        )}
        <ClearCacheButton collapsed={collapsed} />
      </div>
    </aside>
  );
}
