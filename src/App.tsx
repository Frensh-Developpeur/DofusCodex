import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "./store/store";
import { getGuideListData, getGuideData, getSyncState, syncGuides, SYNC_REFRESH_MS } from "./lib/guideStore";
import TitleBar from "./components/TitleBar";
import Sidebar from "./components/Sidebar";
import ErrorBoundary from "./components/ErrorBoundary";
import SkinatorLeavePrompt from "./components/SkinatorLeavePrompt";
import UpdateBanner from "./components/UpdateBanner";
import Dashboard from "./pages/Dashboard";
import Dungeons from "./pages/Dungeons";
import DungeonDetail from "./pages/DungeonDetail";
import Stuffinator from "./pages/Stuffinator";
import Builder from "./pages/Builder";
import BuildGallery from "./pages/BuildGallery";
import Skinator from "./pages/Skinator";
import SkinatorSkins from "./pages/SkinatorSkins";
import Guides from "./pages/Guides";
import GuideDetail from "./pages/GuideDetail";
import Almanax from "./pages/Almanax";
import Hunt from "./pages/Hunt";
import Monsters from "./pages/Monsters";
import Sets from "./pages/Sets";
import Classes from "./pages/Classes";
import Resources from "./pages/Resources";
import Havenbags from "./pages/Havenbags";
import Achievements from "./pages/Achievements";
import Settings from "./pages/Settings";

function Page({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
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
        // Mise à jour de fond uniquement si déjà tout téléchargé une fois (sinon c'est à
        // l'utilisateur de lancer le téléchargement initial depuis la page Guides).
        if (st.lastSync != null && Date.now() - st.lastSync > SYNC_REFRESH_MS) {
          syncGuides().catch(() => {});
        }
      })
      .catch(() => {});
    // au montage uniquement
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clé de transition : on garde une clé STABLE pour le détail de guide afin que passer
  // d'un guide à l'autre ne remonte pas la page (pas de fondu plein écran) — GuideDetail
  // se contente de re-render avec le nouvel id. Sinon, clé = chemin (transition normale).
  const pageKey = location.pathname.startsWith("/guides/") ? "guide-detail" : location.pathname;
  const isSkinator = location.pathname === "/skinator";

  return (
    <div className="relative flex h-screen flex-col">
      <TitleBar />
      <div className="relative flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="relative z-10 min-w-0 flex-1 overflow-y-auto">
          {/* Pages routées classiques (démontées/remontées à chaque navigation). */}
          <div className={isSkinator ? "hidden" : "app-page-shell mx-auto max-w-6xl px-8 py-8"}>
            <ErrorBoundary>
            <AnimatePresence mode="wait">
              <Routes location={location} key={pageKey}>
                <Route path="/" element={<Page><Dashboard /></Page>} />
                <Route path="/donjons" element={<Page><Dungeons /></Page>} />
                <Route path="/donjons/:id" element={<Page><DungeonDetail /></Page>} />
                <Route path="/stuffinator" element={<Page><Stuffinator /></Page>} />
                <Route path="/builder" element={<Page><BuildGallery /></Page>} />
                <Route path="/builder/:id" element={<Page><Builder /></Page>} />
                <Route path="/mes-skins" element={<Page><SkinatorSkins /></Page>} />
                <Route path="/chasse" element={<Page><Hunt /></Page>} />
                <Route path="/monstres" element={<Page><Monsters /></Page>} />
                <Route path="/panoplies" element={<Page><Sets /></Page>} />
                <Route path="/classes" element={<Page><Classes /></Page>} />
                <Route path="/objets" element={<Page><Resources /></Page>} />
                <Route path="/havre-sac" element={<Page><Havenbags /></Page>} />
                <Route path="/succes" element={<Page><Achievements /></Page>} />
                <Route path="/guides" element={<Page><Guides /></Page>} />
                <Route path="/guides/:id" element={<Page><GuideDetail /></Page>} />
                <Route path="/almanax" element={<Page><Almanax /></Page>} />
                <Route path="/parametres" element={<Page><Settings /></Page>} />
              </Routes>
            </AnimatePresence>
            </ErrorBoundary>
          </div>

          {/* Skinator monté en permanence : garde le moteur Barbofus + le skin en cours
              en vie quand on navigue ailleurs (jamais démonté → reset uniquement à la
              fermeture de l'app). Simplement masqué hors de sa page. */}
          <div className={isSkinator ? "app-page-shell mx-auto max-w-6xl px-8 py-8" : "hidden"}>
            <ErrorBoundary>
              <Skinator />
            </ErrorBoundary>
          </div>
        </main>
      </div>

      {/* Choix plein écran quand on quitte le Skinator avec le moteur ouvert. Au niveau
          racine (hors <main>) pour ne pas être piégé dans son contexte d'empilement. */}
      <SkinatorLeavePrompt />
      <UpdateBanner />
    </div>
  );
}
