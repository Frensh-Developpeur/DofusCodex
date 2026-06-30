import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getEquipment } from "../api/dofusdude";
import { useStore, actions } from "../store/store";
import { skinatorEngine, useEngineOpen, useGalleryOpen } from "../store/skinatorEngine";
import DofusIcon from "./DofusIcon";
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from "./DofusIcons";
import clsx from "clsx";
import { Fragment, useEffect, useRef, useState } from "react";
import AccountButton from "./AccountButton";
import FavoritesManager from "./FavoritesManager";
import { ThemeMenu } from "./ThemePicker";
import { openGlobalSearch } from "./GlobalSearch";
import { openOverlay, overlaySupported } from "../lib/overlay";
import { NAV_GROUPS as GROUPS, ALL_NAV_ITEMS as ALL_ITEMS, type NavItem as Item } from "../lib/navItems";


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
  // Quitter le Skinator avec le moteur ouvert → on intercepte pour proposer un choix. Mais on
  // ne propose ça que si on QUITTE la section skin : naviguer entre Skinator / Galerie Barbofus /
  // Mes Skins garde le moteur en fond sans popup (ces pages sont keep-alive, le moteur survit).
  const engineOpen = useEngineOpen();
  const galleryOpen = useGalleryOpen();
  const isSkinPage = (to: string) =>
    to === "/skinator" || to === "/galerie-skins" || to === "/mes-skins";
  const leaveSource =
    engineOpen && galleryOpen ? "both" : galleryOpen ? "gallery" : engineOpen ? "skinator" : null;
  const guardLeave = isSkinPage(location.pathname) && leaveSource != null;

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

  // Pages favorites (épinglées) résolues en items (label + icône), dans l'ordre choisi.
  const favoritePages = useStore((s) => s.favoritePages);
  const favItems = favoritePages.map((to) => ALL_ITEMS.get(to)).filter((it): it is Item => !!it);
  const [favManagerOpen, setFavManagerOpen] = useState(false);

  // Rendu d'un lien de menu (réutilisé par les groupes ET la section Favoris).
  // `region` : layoutId distinct pour les favoris → la pastille active ne « vole » jamais
  // entre la section Favoris et les groupes (deux contextes d'animation séparés).
  const renderLink = (item: Item, region: "group" | "fav" = "group") => {
    const isGuides = item.to === "/guides";
    const inSection =
      location.pathname === item.to || location.pathname.startsWith(item.to + "/") || item.to === itemSection;
    const remembered = sectionMemory.current[item.to];
    const to = isGuides && lastGuide ? `/guides/${lastGuide}` : !inSection && remembered ? remembered : item.to;
    const forceActive = isGuides && location.pathname.startsWith("/guides");
    const activeFor = (isActive: boolean) => (itemSection ? item.to === itemSection : isActive || forceActive);
    return (
      <NavLink
        to={to}
        end={item.end}
        state={{ fromSection: true }}
        title={collapsed ? item.label : undefined}
        onClick={(e) => {
          if (guardLeave && !isSkinPage(to)) {
            e.preventDefault();
            skinatorEngine.requestLeave(to, leaveSource);
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
                  layoutId={region === "fav" ? "nav-active-fav" : "nav-active"}
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
  };

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
        {/* Recherche globale (Cmd/Ctrl+K) */}
        <button
          onClick={openGlobalSearch}
          title="Rechercher (Ctrl/⌘ + K)"
          className={clsx(
            "no-drag group flex items-center rounded-xl border border-white/10 bg-void-900/50 text-sm font-medium text-slate-400 transition hover:border-glow-purple/40 hover:text-white",
            collapsed ? "justify-center px-2 py-2.5" : "gap-2.5 px-3 py-2",
          )}
        >
          <DofusIcon name="search" size={16} className="shrink-0 opacity-80 group-hover:opacity-100" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">Rechercher…</span>
              <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">⌘K</span>
            </>
          )}
        </button>

        {overlaySupported && (
          <button
            onClick={() => openOverlay(location.pathname)}
            title="Passer l'app en overlay"
            className={clsx(
              "no-drag group flex items-center rounded-xl border border-glow-cyan/25 bg-glow-cyan/10 text-sm font-semibold text-glow-cyan transition hover:bg-glow-cyan/20 hover:text-white",
              collapsed ? "justify-center px-2 py-2.5" : "gap-2.5 px-3 py-2",
            )}
          >
            <DofusIcon name="eye" size={16} className="shrink-0 opacity-90 group-hover:opacity-100" />
            {!collapsed && <span className="flex-1 text-left">Overlay</span>}
          </button>
        )}

        {GROUPS.map((group, gi) => {
          // En mode icônes (sidebar réduite) on affiche tout ; sinon on respecte le repli du groupe.
          const isCollapsibleHeader = !!group.collapsible && !!group.title && !collapsed;
          const groupOpen = !isCollapsibleHeader || (group.title ? openGroups[group.title] : true);
          // Une page épinglée n'apparaît PLUS dans son groupe (elle vit dans « Favoris »).
          // L'Accueil ("/") reste toujours là. Un groupe entièrement épinglé est masqué (entête compris).
          const visibleItems = group.items.filter((it) => it.to === "/" || !favoritePages.includes(it.to));
          const groupNode =
            group.title && visibleItems.length === 0 ? null : (
              <div key={gi} className="flex flex-col gap-0.5">
                {group.title &&
                  (collapsed ? (
                    <div className="mx-auto my-1.5 h-px w-6 bg-white/10" />
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
                {groupOpen && visibleItems.map((item) => <Fragment key={item.to}>{renderLink(item, "group")}</Fragment>)}
              </div>
            );
          // La section Favoris (toujours visible) s'insère juste après l'Accueil (1er groupe).
          // Pas de contrôles inline : un bouton discret ouvre la fenêtre de gestion.
          if (gi === 0) {
            return (
              <Fragment key="accueil-favoris">
                {groupNode}
                <div className="flex flex-col gap-0.5">
                  {collapsed ? (
                    <button
                      onClick={() => setFavManagerOpen(true)}
                      title="Gérer les favoris"
                      className="no-drag mx-auto my-1 grid h-9 w-9 place-items-center rounded-xl text-glow-gold/70 transition hover:bg-white/10 hover:text-glow-gold"
                    >
                      <DofusIcon name="starFilled" size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => setFavManagerOpen(true)}
                      title="Gérer les favoris"
                      className="no-drag group flex items-center justify-between rounded-lg px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-glow-gold/70 transition hover:text-glow-gold"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <DofusIcon name="starFilled" size={11} /> Favoris
                      </span>
                      <DofusIcon name="settingsGear" size={12} className="opacity-0 transition group-hover:opacity-100" />
                    </button>
                  )}
                  {favItems.map((item) => (
                    <Fragment key={item.to}>{renderLink(item, "fav")}</Fragment>
                  ))}
                </div>
              </Fragment>
            );
          }
          return groupNode;
        })}
      </nav>

      <div className="mt-auto border-t border-white/5 p-3">
        <AccountButton collapsed={collapsed} />
        <ThemeMenu collapsed={collapsed} />
        <NavLink
          to="/parametres"
          state={{ fromSidebar: true }}
          title={collapsed ? "Paramètres" : undefined}
          onClick={(e) => {
            if (guardLeave) {
              e.preventDefault();
              skinatorEngine.requestLeave("/parametres", leaveSource);
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

      <FavoritesManager open={favManagerOpen} onClose={() => setFavManagerOpen(false)} />
    </aside>
  );
}
