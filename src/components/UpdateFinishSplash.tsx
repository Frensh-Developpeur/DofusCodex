import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "./DofusIcons";
import AppLoader from "./AppLoader";

const VERSION_KEY = "dofuscodex.appVersion";
const SHOW_MS = 2400;

const BACKDROP =
  "radial-gradient(120% 90% at 50% 18%, rgb(var(--c-purple)/0.16), transparent 60%)," +
  "radial-gradient(90% 70% at 50% 100%, rgb(var(--c-cyan)/0.1), transparent 55%)," +
  "#070912";

// Affiché au relancement APRÈS une mise à jour : l'install Windows est silencieuse (rien à
// l'écran pendant le remplacement des fichiers) → on confirme visuellement, façon DofusCodex,
// que la maj est bien terminée. Détecté en comparant la version réelle de l'app (IPC) à la
// dernière vue (localStorage). Ne s'affiche jamais à la 1ʳᵉ installation (pas de version stockée).
export default function UpdateFinishSplash() {
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const get = window.dofusCodex?.getAppVersion;
    if (!get) return; // hors Electron (dev navigateur) : rien
    get()
      .then((current) => {
        if (!alive || !current) return;
        let prev: string | null = null;
        try {
          prev = localStorage.getItem(VERSION_KEY);
          localStorage.setItem(VERSION_KEY, current);
        } catch {
          /* localStorage indispo */
        }
        if (prev && prev !== current) {
          setVersion(current);
          window.setTimeout(() => alive && setVersion(null), SHOW_MS);
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <AnimatePresence>
      {version && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-6 px-8 text-center"
          style={{ background: BACKDROP }}
        >
          <AppLoader label={`Mise à jour vers ${version} terminée`} />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-glow-emerald/40 bg-glow-emerald/10 px-4 py-1.5 text-sm font-semibold text-glow-emerald"
          >
            <Check className="h-4 w-4" /> Mise à jour installée — démarrage…
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
