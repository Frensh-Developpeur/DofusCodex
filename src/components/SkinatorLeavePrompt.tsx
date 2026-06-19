import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import DofusIcon from "./DofusIcon";
import { skinatorEngine, usePendingLeave } from "../store/skinatorEngine";

const BACKDROP =
  "radial-gradient(120% 90% at 50% 18%, rgb(var(--c-purple)/0.16), transparent 60%)," +
  "radial-gradient(90% 70% at 50% 100%, rgb(var(--c-cyan)/0.1), transparent 55%)," +
  "rgba(7, 9, 18, 0.92)";

// Affiché quand on tente de quitter le Skinator alors que le moteur Barbofus est ouvert :
// laisse choisir entre libérer les ressources (fermer) ou préserver le skin (laisser en fond).
export default function SkinatorLeavePrompt() {
  const navigate = useNavigate();
  const pending = usePendingLeave();

  // Échap = annuler (on reste sur le Skinator).
  useEffect(() => {
    if (!pending) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skinatorEngine.clearPending();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pending]);

  const cancel = () => skinatorEngine.clearPending();
  const leave = (closeEngine: boolean) => {
    const path = pending;
    if (closeEngine) skinatorEngine.setOpen(false);
    skinatorEngine.clearPending();
    if (path) navigate(path);
  };

  return (
    <AnimatePresence>
      {pending && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center gap-9 px-6 text-center backdrop-blur-md"
          style={{ background: BACKDROP }}
          onClick={cancel}
        >
          <button
            onClick={cancel}
            aria-label="Annuler"
            className="absolute right-5 top-5 rounded-lg border border-white/10 bg-white/[0.04] p-2 text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
          >
            <DofusIcon name="closeRed" size={20} />
          </button>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-9"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-2.5">
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Quitter le Skinator ?
              </h2>
              <p className="mx-auto max-w-md text-sm leading-6 text-slate-400">
                Le moteur Barbofus est ouvert. Que veux-tu en faire avant de changer de page ?
              </p>
            </div>

            <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
              {/* Fermer le moteur — perf */}
              <button
                onClick={() => leave(true)}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center transition hover:border-glow-ember/40 hover:bg-white/[0.06]"
              >
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-glow-ember/15 text-glow-ember ring-1 ring-glow-ember/30 transition group-hover:bg-glow-ember/25">
                  <DofusIcon name="lightning" size={24} />
                </span>
                <span className="font-display text-base font-bold text-white">Fermer le moteur</span>
                <span className="text-xs leading-5 text-slate-400">
                  Libère la mémoire et le processeur. Ton skin en cours sera perdu — il faudra
                  rouvrir le moteur au retour.
                </span>
              </button>

              {/* Laisser en fond — préserve le skin */}
              <button
                onClick={() => leave(false)}
                className="group relative flex flex-col items-center gap-3 rounded-2xl border border-glow-purple/40 bg-gradient-to-br from-glow-purple/15 to-glow-cyan/5 p-6 text-center shadow-glow transition hover:from-glow-purple/25 hover:to-glow-cyan/10"
              >
                <span className="absolute right-3 top-3 rounded-full bg-glow-purple/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-glow-violet">
                  Recommandé
                </span>
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-glow-purple/20 text-glow-violet ring-1 ring-glow-purple/40 transition group-hover:bg-glow-purple/30">
                  <DofusIcon name="sablier" size={24} />
                </span>
                <span className="font-display text-base font-bold text-white">Laisser en fond</span>
                <span className="text-xs leading-5 text-slate-300">
                  Garde ton skin intact. Le moteur continue de tourner en arrière-plan (un peu
                  plus de mémoire utilisée).
                </span>
              </button>
            </div>

            <button
              onClick={cancel}
              className="text-xs font-medium text-slate-500 transition hover:text-slate-300"
            >
              Annuler — rester sur le Skinator
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
