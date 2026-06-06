import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useStore } from "./store/store";
import { getGuideListData, getGuideData, getSyncState, syncGuides, SYNC_REFRESH_MS } from "./lib/guideStore";
import { trackItemNav } from "./lib/itemNav";
import TitleBar from "./components/TitleBar";
import Sidebar from "./components/Sidebar";
import ErrorBoundary from "./components/ErrorBoundary";
import SkinatorLeavePrompt from "./components/SkinatorLeavePrompt";
import UpdateBanner from "./components/UpdateBanner";
import Dashboard from "./pages/Dashboard";
import Dungeons from "./pages/Dungeons";
import DungeonDetail from "./pages/DungeonDetail";
import Builder from "./pages/Builder";
import BuildGallery from "./pages/BuildGallery";
import Skinator from "./pages/Skinator";
import SkinatorSkins from "./pages/SkinatorSkins";
import Guides from "./pages/Guides";
import GuideDetail from "./pages/GuideDetail";
import Almanax from "./pages/Almanax";
import Hunt from "./pages/Hunt";
import Monsters from "./pages/Monsters";
import MonsterDetail from "./pages/MonsterDetail";
import Sets, { SetDetail } from "./pages/Sets";
import Classes, { ClassDetail } from "./pages/Classes";
import Resources from "./pages/Resources";
import Havenbags, { HavenbagDetail } from "./pages/Havenbags";
import Achievements from "./pages/Achievements";
import Settings from "./pages/Settings";
import Stuffinator from "./pages/Stuffinator";
import ItemDetail from "./pages/ItemDetail";

const SHELL = "app-page-shell mx-auto max-w-6xl px-8 py-8";

// ── Keep-alive : pages « persistantes ». Montées une fois (à la 1re visite) puis
// simplement masquées quand on navigue ailleurs → état local, scroll, abonnements
// React Query et moteur Skinator restent vivants. Revenir = ré-affichage instantané,
// rien n'est ré-initialisé. (Les pages de DÉTAIL ci-dessous restent, elles, montées/
// démontées normalement : elles dépendent d'un :id et ne doivent pas s'accumuler.)
const KEEP_ALIVE: Array<[string, ReactNode]> = [
  ["/", <Dashboard />],
  ["/donjons", <Dungeons />],
  ["/stuffinator", <Stuffinator />],
  ["/builder", <BuildGallery />],
  ["/mes-skins", <SkinatorSkins />],
  ["/chasse", <Hunt />],
  ["/monstres", <Monsters />],
  ["/panoplies", <Sets />],
  ["/classes", <Classes />],
  ["/objets", <Resources />],
  ["/havre-sac", <Havenbags />],
  ["/succes", <Achievements />],
  ["/guides", <Guides />],
  ["/almanax", <Almanax />],
  ["/parametres", <Settings />],
  ["/skinator", <Skinator />],
];
const KEEP_MAP = new Map(KEEP_ALIVE);

// Une page de détail = un chemin à segment(s) sous l'une de ces racines.
const isDetailPath = (p: string) =>
  /^\/(donjons|builder|monstres|guides|objets|panoplies|classes|havre-sac)\/[^/]+/.test(p);

export default function App() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const qc = useQueryClient();
  const recentGuides = useStore((s) => s.recentGuides);

  // Au lancement : réchauffe le catalogue + les guides récents depuis le stockage local
  // (IndexedDB), et lance une mise à jour discrète si la dernière synchro est trop ancienne.
  useEffect(() => {
    qc.prefetchQuery({
      queryKey: ["ganymede-guides"],
      queryFn: ({ signal }) => getGuideListData(signal),
      staleTime: 1000 * 60 * 30,
    });
    for (const id of recentGuides) {
      qc.prefetchQuery({
        queryKey: ["ganymede-guide", id],
        queryFn: ({ signal }) => getGuideData(id, signal),
        staleTime: 1000 * 60 * 30,
      });
    }
    getSyncState()
      .then((st) => {
        if (st.lastSync != null && Date.now() - st.lastSync > SYNC_REFRESH_MS) {
          syncGuides().catch(() => {});
        }
      })
      .catch(() => {});
    // au montage uniquement
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const path = location.pathname;
  const fromSidebar = (location.state as { fromSidebar?: boolean } | null)?.fromSidebar === true;
  const detail = isDetailPath(path);
  const activeKey = !detail && KEEP_MAP.has(path) ? path : null;

  // Suit le flux des fiches d'objet pour dédoublonner la pile de retour (cf. itemNav).
  useEffect(() => {
    trackItemNav(path);
  }, [path]);

  // Ensemble des pages keep-alive déjà montées (on monte à la 1re visite, jamais on ne démonte).
  const [mounted, setMounted] = useState<string[]>(() => (activeKey ? [activeKey] : []));
  useEffect(() => {
    if (activeKey) setMounted((m) => (m.includes(activeKey) ? m : [...m, activeKey]));
  }, [activeKey]);

  // ── Mémoire de défilement (un seul conteneur scrollable : <main>) ─────────────
  // Clé courante = page keep-alive active, ou le chemin du détail.
  const scrollKey = detail ? path : (activeKey ?? "");
  const mainRef = useRef<HTMLElement>(null);
  const scrollPos = useRef<Map<string, number>>(new Map());
  const scrollKeyRef = useRef(scrollKey);
  const restoring = useRef(false);

  // Détection du changement de page PENDANT le rendu : à cet instant React n'a pas encore
  // committé la nouvelle page → `main` affiche encore l'ancienne avec sa position RÉELLE.
  // On la fige donc ici (plus fiable que de compter sur le dernier event `scroll`). Quand la
  // navigation vient de la sidebar, on remet volontairement l'ancienne page en haut pour sa
  // prochaine visite (cas des pages de recherche quittées via un bouton du menu).
  // On gèle ensuite la sauvegarde le temps de restaurer (la bascule display:none clampe scrollTop).
  if (scrollKeyRef.current !== scrollKey) {
    const el = mainRef.current;
    if (el) {
      const previousKey = scrollKeyRef.current;
      scrollPos.current.set(previousKey, fromSidebar && navigationType !== "POP" ? 0 : el.scrollTop);
    }
    scrollKeyRef.current = scrollKey;
    restoring.current = true;
  }

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => {
      if (!restoring.current) scrollPos.current.set(scrollKeyRef.current, el.scrollTop);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Restauration après affichage de la nouvelle page. Le DOM keep-alive existe déjà, donc
  // c'est quasi immédiat ; la petite boucle rAF couvre le cas où le layout n'est pas encore
  // à sa hauteur finale (page de détail qui charge, etc.).
  useLayoutEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    // Pages de détail : toujours en haut. Pages de liste (keep-alive) : on restaure la position.
    const target = detail ? 0 : (scrollPos.current.get(scrollKey) ?? 0);
    let raf = 0;
    let tries = 0;
    const apply = () => {
      el.scrollTop = target;
      tries += 1;
      if (Math.abs(el.scrollTop - target) > 1 && tries < 20) {
        raf = requestAnimationFrame(apply);
      } else {
        restoring.current = false;
      }
    };
    apply();
    return () => cancelAnimationFrame(raf);
  }, [scrollKey, detail]);

  return (
    <div className="relative flex h-screen flex-col">
      <TitleBar />
      <div className="relative flex flex-1 overflow-hidden">
        <Sidebar />
        <main ref={mainRef} className="relative z-10 min-w-0 flex-1 overflow-y-auto">
          {/* Pages keep-alive : toutes montées une fois visitées, seule l'active est affichée. */}
          {mounted.map((key) => (
            <div key={key} className={key === activeKey ? SHELL : "hidden"}>
              <ErrorBoundary>{KEEP_MAP.get(key)}</ErrorBoundary>
            </div>
          ))}

          {/* Pages de détail : montées/démontées normalement (dépendent d'un :id). */}
          {detail && (
            <div className={SHELL}>
              <ErrorBoundary>
                <Routes location={location}>
                  <Route path="/donjons/:id" element={<DungeonDetail />} />
                  <Route path="/builder/:id" element={<Builder />} />
                  <Route path="/monstres/:id" element={<MonsterDetail />} />
                  <Route path="/guides/:id" element={<GuideDetail />} />
                  <Route path="/objets/:id" element={<ItemDetail />} />
                  <Route path="/panoplies/:id" element={<SetDetail />} />
                  <Route path="/classes/:id" element={<ClassDetail />} />
                  <Route path="/havre-sac/:id" element={<HavenbagDetail />} />
                </Routes>
              </ErrorBoundary>
            </div>
          )}
        </main>
      </div>

      {/* Choix plein écran quand on quitte le Skinator avec le moteur ouvert. */}
      <SkinatorLeavePrompt />
      <UpdateBanner />
    </div>
  );
}
