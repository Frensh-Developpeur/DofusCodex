import { useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, X } from "./DofusIcons";
import DofusIcon from "./DofusIcon";
import { useAccount, completePasswordRecovery, dismissRecovery } from "../lib/cloudSync";

// Écran « choisis un nouveau mot de passe ». S'affiche tout seul quand on revient d'un lien de
// réinitialisation (dofuscodex://reset → handleAuthDeepLink lève account.recovery). Monté en
// permanence dans App ; ne rend rien tant que recovery est faux.
export default function RecoveryModal() {
  const account = useAccount();
  if (!account.recovery) return null;
  return <RecoveryDialog email={account.email} />;
}

function RecoveryDialog({ email }: { email: string | null }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) return setError("Le mot de passe doit faire 6 caractères minimum.");
    if (password !== confirm) return setError("Les deux mots de passe ne correspondent pas.");
    setBusy(true);
    const { error } = await completePasswordRecovery(password);
    setBusy(false);
    if (error) setError(error);
    else {
      setDone(true);
      setTimeout(() => dismissRecovery(), 1400);
    }
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[95] flex items-start justify-center bg-black/70 p-6 pt-[12vh] backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="glass relative w-full max-w-[400px] overflow-hidden rounded-3xl p-6 ring-1 ring-white/10"
      >
        <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-[22rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-glow-purple/30 to-glow-cyan/20 opacity-50 blur-3xl" />

        <button
          onClick={() => dismissRecovery()}
          aria-label="Fermer"
          className="no-drag absolute right-3 top-3 z-10 rounded-lg p-1.5 text-slate-500 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative">
          {done ? (
            <div className="py-4 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-glow-emerald/15 ring-1 ring-glow-emerald/40">
                <CheckCircle2 className="h-7 w-7 text-glow-emerald" />
              </div>
              <h3 className="mt-3 font-display text-xl font-bold text-white">Mot de passe modifié</h3>
              <p className="mt-1 text-xs text-slate-400">Tu es connecté. Bon jeu !</p>
            </div>
          ) : (
            <>
              <div className="text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-glow-purple/40 to-glow-cyan/20 ring-1 ring-white/10">
                  <DofusIcon name="verrouillage" size={24} />
                </div>
                <h3 className="mt-3 font-display text-xl font-bold text-white">Nouveau mot de passe</h3>
                <p className="mx-auto mt-1 max-w-[19rem] text-xs leading-relaxed text-slate-400">
                  {email ? `Choisis un nouveau mot de passe pour ${email}.` : "Choisis ton nouveau mot de passe."}
                </p>
              </div>

              <form onSubmit={submit} className="mt-5 space-y-2.5">
                <Field
                  label="Nouveau mot de passe"
                  value={password}
                  onChange={setPassword}
                  placeholder="Min. 6 caractères"
                />
                <Field label="Confirmer" value={confirm} onChange={setConfirm} placeholder="Retape-le" />
                {error && (
                  <p className="rounded-lg border border-glow-rose/30 bg-glow-rose/10 px-3 py-2 text-xs text-rose-100">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={busy || !password || !confirm}
                  className="no-drag mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-glow-purple to-glow-cyan px-4 py-3 text-sm font-bold text-white shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                  Mettre à jour et continuer
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="new-password"
        className="no-drag w-full rounded-xl border border-white/10 bg-void-900/60 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-glow-purple/60 focus:ring-2 focus:ring-glow-purple/25"
      />
    </label>
  );
}
