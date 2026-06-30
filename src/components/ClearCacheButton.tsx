import { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Loader2 } from "./DofusIcons";
import DofusIcon from "./DofusIcon";
import { actions } from "../store/store";
import { idbClearAll } from "../lib/guideDb";
import { clearApiCache } from "../lib/apiCache";
import { clearViewState } from "../lib/viewState";
import { syncNow } from "../lib/cloudSync";

// Liste affichée dans l'avertissement.
const WIPES = [
  "Tes skins sauvegardés (Mes Skins & Skinator)",
  "Tes builds enregistrés",
  "La progression des donjons et des quêtes",
  "Le suivi des guides (étapes, cases cochées, favoris, récents)",
  "Les guides téléchargés hors-ligne",
  "Le cache hors-ligne des données déjà consultées",
  "Ta sauvegarde dans le cloud (si tu es connecté·e)",
];

export default function ClearCacheButton({ collapsed = false }: { collapsed?: boolean }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const qc = useQueryClient();

  const wipe = async () => {
    setBusy(true);
    try {
      actions.resetAll(); // store + localStorage
      // Si connecté au cloud : pousse immédiatement l'état VIDE pour écraser la sauvegarde
      // distante, sinon la synchro la re-fusionnerait au prochain lancement (progression
      // « ressuscitée »). No-op si déconnecté.
      await syncNow();
      clearViewState(); // filtres/recherche/scroll mémorisés
      await idbClearAll(); // cache guides (IndexedDB)
      await clearApiCache(); // cache API générique (DofusDB/DofusDude)
      qc.clear(); // cache requêtes en mémoire
    } catch {
      /* on recharge quand même */
    }
    window.location.reload();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Vider le cache"
        className={
          collapsed
            ? "no-drag mx-auto mt-2 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] p-2 text-slate-400 transition hover:border-glow-rose/30 hover:bg-glow-rose/10 hover:text-glow-rose"
            : "no-drag mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-glow-rose/30 hover:bg-glow-rose/10 hover:text-glow-rose"
        }
      >
        <DofusIcon name="closeRed" size={14} />
        {!collapsed && " Vider le cache"}
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
              onClick={() => !busy && setOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{ type: "spring", stiffness: 280, damping: 26 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-2xl border border-glow-rose/25 bg-void-800 p-6 shadow-card"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-glow-rose/15 text-glow-rose ring-1 ring-glow-rose/30">
                    <AlertTriangle className="h-5 w-5" />
                  </span>
                  <h2 className="font-display text-xl font-extrabold text-white">Vider le cache ?</h2>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-300">
                  Toutes tes données sont stockées <span className="font-semibold text-white">uniquement sur cet appareil</span>.
                  Vider le cache va <span className="font-semibold text-glow-rose">supprimer définitivement</span> :
                </p>
                <ul className="mt-3 space-y-1.5">
                  {WIPES.map((w) => (
                    <li key={w} className="flex items-start gap-2 text-sm text-slate-400">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-glow-rose/70" />
                      {w}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-slate-500">
                  Cette action est irréversible. L'application va redémarrer.
                </p>

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={() => setOpen(false)}
                    disabled={busy}
                    className="no-drag rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={wipe}
                    disabled={busy}
                    className="no-drag inline-flex items-center gap-1.5 rounded-xl border border-glow-rose/40 bg-glow-rose/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-glow-rose/30 disabled:opacity-60"
                  >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <DofusIcon name="closeRed" size={16} />}
                    Tout supprimer
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
