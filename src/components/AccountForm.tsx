import { useState } from "react";
import { motion } from "framer-motion";
import { LogOut, Loader2, CheckCircle2, RefreshCw } from "./DofusIcons";
import DofusIcon from "./DofusIcon";
import { useAccount, signIn, signUp, signOut, syncNow } from "../lib/cloudSync";

const SPRING = { type: "spring", stiffness: 420, damping: 34 } as const;

// Contenu « compte » (utilisé dans la modale de la sidebar) : connexion / inscription avec
// pseudo, ou vue « connecté » (statut de synchro + déconnexion). Local-first.
export default function AccountForm({ onDone }: { onDone?: () => void }) {
  const account = useAccount();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setBusy(true);
    setError(null);
    setInfo(null);
    if (mode === "signin") {
      const { error } = await signIn(email.trim(), password);
      if (error) setError(error);
      else {
        setPassword("");
        onDone?.();
      }
    } else {
      const { error, needsConfirmation } = await signUp(email.trim(), password, pseudo);
      if (error) setError(error);
      else if (needsConfirmation)
        setInfo("Compte créé ! Vérifie tes mails pour confirmer ton adresse, puis connecte-toi.");
      else {
        setPassword("");
        onDone?.();
      }
    }
    setBusy(false);
  };

  // ---- Vue « connecté » ----
  if (account.status === "signedIn") {
    const initial = (account.pseudo || account.email || "?").trim().charAt(0).toUpperCase();
    return (
      <div className="text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-glow-purple to-glow-cyan text-2xl font-extrabold text-white shadow-glow">
          {initial}
        </div>
        <h3 className="mt-3 font-display text-xl font-bold text-white">{account.pseudo || "Mon compte"}</h3>
        {account.email && <p className="text-xs text-slate-500">{account.email}</p>}

        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium">
          {account.syncing ? (
            <span className="inline-flex items-center gap-1.5 text-glow-cyan">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Synchronisation…
            </span>
          ) : account.error ? (
            <span className="text-glow-rose">Erreur de synchro</span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-glow-emerald">
              <CheckCircle2 className="h-3.5 w-3.5" /> Sauvegardé{account.syncedAt ? ` · ${relative(account.syncedAt)}` : ""}
            </span>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={() => syncNow()}
            disabled={account.syncing}
            className="no-drag inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-glow-purple to-glow-violet px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:opacity-60"
          >
            <RefreshCw className="h-4 w-4" /> Synchroniser maintenant
          </button>
          <button
            onClick={() => {
              signOut();
              onDone?.();
            }}
            className="no-drag inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Se déconnecter
          </button>
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
          Ta progression est sauvegardée sur ton compte et restaurée sur tous tes appareils — tout
          reste aussi en local, l'app marche sans connexion.
        </p>
      </div>
    );
  }

  // ---- Vue « déconnecté » (connexion / inscription) ----
  return (
    <div>
      <div className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-glow-purple/40 to-glow-cyan/20 ring-1 ring-white/10">
          <DofusIcon name="character" size={26} />
        </div>
        <h3 className="mt-3 font-display text-xl font-bold text-white">
          {mode === "signin" ? "Content de te revoir" : "Rejoins DofusCodex"}
        </h3>
        <p className="mx-auto mt-1 max-w-[18rem] text-xs leading-relaxed text-slate-400">
          {mode === "signin"
            ? "Connecte-toi pour retrouver ta progression partout."
            : "Crée un compte pour sauvegarder ta progression et la retrouver sur tous tes appareils."}
        </p>
      </div>

      {/* Contrôle segmenté Connexion / Inscription */}
      <div className="relative mt-5 grid grid-cols-2 gap-1 rounded-xl bg-void-900/60 p-1 ring-1 ring-white/10">
        {(["signin", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
              setInfo(null);
            }}
            className={`no-drag relative rounded-lg py-1.5 text-xs font-semibold transition-colors ${
              mode === m ? "text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {mode === m && (
              <motion.span
                layoutId="auth-seg"
                transition={SPRING}
                className="absolute inset-0 rounded-lg bg-glow-purple/25 ring-1 ring-glow-purple/40"
              />
            )}
            <span className="relative">{m === "signin" ? "Connexion" : "Inscription"}</span>
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-4 space-y-2.5">
        {mode === "signup" && (
          <Field
            label="Pseudo"
            value={pseudo}
            onChange={setPseudo}
            type="text"
            placeholder="Ton pseudo en jeu"
            autoComplete="nickname"
          />
        )}
        <Field
          label="E-mail"
          value={email}
          onChange={setEmail}
          type="email"
          placeholder="toi@exemple.com"
          autoComplete="email"
        />
        <Field
          label="Mot de passe"
          value={password}
          onChange={setPassword}
          type="password"
          placeholder="Min. 6 caractères"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />

        {error && (
          <p className="rounded-lg border border-glow-rose/30 bg-glow-rose/10 px-3 py-2 text-xs text-rose-100">
            {error}
          </p>
        )}
        {info && (
          <p className="rounded-lg border border-glow-emerald/30 bg-glow-emerald/10 px-3 py-2 text-xs text-emerald-100">
            {info}
          </p>
        )}

        <button
          type="submit"
          disabled={busy || !email.trim() || !password}
          className="no-drag mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-glow-purple to-glow-cyan px-4 py-3 text-sm font-bold text-white shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "signin" ? "Se connecter" : "Créer mon compte"}
        </button>
      </form>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
        <DofusIcon name="verrouillage" size={12} /> Données privées · l'app fonctionne aussi sans compte.
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type,
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="no-drag w-full rounded-xl border border-white/10 bg-void-900/60 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-glow-purple/60 focus:ring-2 focus:ring-glow-purple/25"
      />
    </label>
  );
}

// « il y a 2 min », « il y a 1 h »… (relatif court, FR).
function relative(ts: number): string {
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (s < 10) return "à l'instant";
  if (s < 60) return `il y a ${s} s`;
  const m = Math.round(s / 60);
  if (m < 60) return `il y a ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `il y a ${h} h`;
  return `il y a ${Math.round(h / 24)} j`;
}
