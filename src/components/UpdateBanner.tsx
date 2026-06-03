import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, RefreshCw, X, Sparkles } from "lucide-react";

// Bandeau de mise à jour (toast bas-droite).
//  • Windows : téléchargement auto → « Redémarrer & installer ».
//  • macOS : « Nouvelle version dispo → Télécharger » (ouvre la page des releases).
export default function UpdateBanner() {
  const [evt, setEvt] = useState<UpdateEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const off = window.dofusCodex?.onUpdate?.((p) => {
      setEvt(p);
      setDismissed(false);
    });
    return off;
  }, []);

  const show = !!evt && !dismissed;
  const version = evt?.version ? `v${evt.version}` : "";

  let title = "";
  let action: { label: string; icon: typeof Download; run: () => void } | null = null;
  if (evt) {
    if (evt.state === "downloaded") {
      title = `Mise à jour ${version} prête`;
      action = { label: "Redémarrer & installer", icon: RefreshCw, run: () => window.dofusCodex?.installUpdate?.() };
    } else if (evt.state === "downloading") {
      title = `Téléchargement de la mise à jour… ${evt.percent ?? 0}%`;
    } else if (evt.isMac) {
      title = `Nouvelle version ${version} disponible`;
      action = { label: "Télécharger", icon: Download, run: () => window.dofusCodex?.openReleases?.() };
    } else {
      title = `Nouvelle version ${version} — préparation…`;
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="fixed bottom-5 right-5 z-[55] w-[330px] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-2xl border border-glow-purple/30 bg-void-800/95 shadow-card ring-1 ring-white/10 backdrop-blur"
        >
          <div className="flex items-start gap-3 p-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-glow-purple/40 to-glow-cyan/20 text-glow-violet">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-snug text-white">{title}</p>
              {action && (
                <button
                  onClick={action.run}
                  className="no-drag mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-glow-purple/40 bg-glow-purple/20 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-glow-purple/30"
                >
                  <action.icon className="h-3.5 w-3.5" /> {action.label}
                </button>
              )}
            </div>
            <button
              onClick={() => setDismissed(true)}
              aria-label="Fermer"
              className="no-drag -mr-1 -mt-1 rounded-lg p-1.5 text-slate-500 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {evt?.state === "downloading" && (
            <div className="h-1 w-full bg-white/5">
              <div
                className="h-full bg-gradient-to-r from-glow-purple to-glow-cyan transition-[width] duration-300"
                style={{ width: `${evt.percent ?? 0}%` }}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
