import { useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck } from "./DofusIcons";
import SecretQuestionPicker from "./SecretQuestionPicker";
import { useAccount, setSecurityQuestion, dismissSecurityPrompt } from "../lib/cloudSync";

// Modale qui FORCE le choix d'une question secrète : s'affiche quand un compte connecté n'en a
// pas (cf. cloudSync.refreshSecurityQuestionFlag, à la connexion / au lancement). Non fermable au
// clic extérieur ; un discret « Plus tard » permet d'esquiver, mais elle réapparaît au prochain
// lancement tant qu'aucune question n'est définie. Montée en permanence dans App.
export default function SecurityQuestionPrompt() {
  const account = useAccount();
  if (account.status !== "signedIn" || !account.needsSecurityQuestion) return null;
  return <Dialog />;
}

function Dialog() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (question.trim().length < 3) return setError("Choisis ou écris une question.");
    if (!answer.trim()) return setError("Indique une réponse.");
    setBusy(true);
    const { error } = await setSecurityQuestion(question, answer);
    setBusy(false);
    if (error) setError(error); // setSecurityQuestion efface le drapeau au succès → la modale se ferme
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[96] flex items-start justify-center bg-black/75 p-6 pt-[11vh] backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="glass relative w-full max-w-[400px] overflow-hidden rounded-3xl p-6 ring-1 ring-white/10"
      >
        <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-[22rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-glow-purple/30 to-glow-cyan/20 opacity-50 blur-3xl" />

        <div className="relative">
          <div className="text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-glow-purple/40 to-glow-cyan/20 ring-1 ring-white/10">
              <ShieldCheck className="h-7 w-7 text-glow-cyan" />
            </div>
            <h3 className="mt-3 font-display text-xl font-bold text-white">Sécurise ton compte</h3>
            <p className="mx-auto mt-1 max-w-[20rem] text-xs leading-relaxed text-slate-400">
              Définis une question secrète : c'est le seul moyen de récupérer ton compte si tu oublies
              ton mot de passe. La casse et les espaces sont ignorés.
            </p>
          </div>

          <form onSubmit={submit} className="mt-5 space-y-2.5">
            <SecretQuestionPicker value={question} onChange={setQuestion} />
            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Réponse secrète</span>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Ta réponse"
                autoComplete="off"
                className="no-drag w-full rounded-xl border border-white/10 bg-void-900/60 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-glow-purple/60 focus:ring-2 focus:ring-glow-purple/25"
              />
            </label>

            {error && (
              <p className="rounded-lg border border-glow-rose/30 bg-glow-rose/10 px-3 py-2 text-xs text-rose-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy || !answer.trim()}
              className="no-drag mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-glow-purple to-glow-cyan px-4 py-3 text-sm font-bold text-white shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Enregistrer ma question secrète
            </button>
          </form>

          <button
            type="button"
            onClick={() => dismissSecurityPrompt()}
            className="no-drag mx-auto mt-3 block text-[11px] text-slate-500 transition hover:text-slate-300"
          >
            Plus tard
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
