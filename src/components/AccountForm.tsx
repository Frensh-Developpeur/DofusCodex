import { useState, type FormEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { LogOut, Loader2, CheckCircle2, RefreshCw, ChevronDown, ArrowLeft } from "./DofusIcons";
import DofusIcon, { type DofusIconName } from "./DofusIcon";
import {
  useAccount,
  signIn,
  signUp,
  signOut,
  syncNow,
  changePassword,
  updatePseudo,
  requestPasswordReset,
  confirmPasswordReset,
  type AccountState,
} from "../lib/cloudSync";

const SPRING = { type: "spring", stiffness: 420, damping: 34 } as const;

// Contenu « compte » (utilisé dans la modale de la sidebar). Local-first.
//  • connecté   → statut de synchro, gestion (mot de passe / pseudo), déconnexion
//  • déconnecté → connexion / inscription / mot de passe oublié
export default function AccountForm({ onDone }: { onDone?: () => void }) {
  const account = useAccount();
  if (account.status === "signedIn") return <LoggedIn account={account} onDone={onDone} />;
  return <LoggedOut onDone={onDone} />;
}

// ───────────────────────── Vue « connecté » ─────────────────────────
function LoggedIn({ account, onDone }: { account: AccountState; onDone?: () => void }) {
  const [panel, setPanel] = useState<null | "password" | "pseudo">(null);
  const initial = (account.pseudo || account.email || "?").trim().charAt(0).toUpperCase();
  const toggle = (p: "password" | "pseudo") => setPanel((cur) => (cur === p ? null : p));

  return (
    <div className="text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-glow-purple to-glow-cyan text-2xl font-extrabold text-white shadow-glow">
        {initial}
      </div>
      <h3 className="mt-3 font-display text-xl font-bold text-white">{account.pseudo || "Mon compte"}</h3>
      {account.email && <p className="text-xs text-slate-500">{account.email}</p>}

      <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium">
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
      </div>

      {/* Gestion du compte */}
      <div className="mt-3 space-y-2 text-left">
        <ExpandRow label="Modifier le pseudo" icon="fm" open={panel === "pseudo"} onClick={() => toggle("pseudo")} />
        {panel === "pseudo" && <ChangePseudoForm current={account.pseudo} onSaved={() => setPanel(null)} />}
        <ExpandRow
          label="Changer le mot de passe"
          icon="verrouillage"
          open={panel === "password"}
          onClick={() => toggle("password")}
        />
        {panel === "password" && <ChangePasswordForm onSaved={() => setPanel(null)} />}
      </div>

      <button
        onClick={() => {
          signOut();
          onDone?.();
        }}
        className="no-drag mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
      >
        <LogOut className="h-4 w-4" /> Se déconnecter
      </button>

      <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
        Ta progression est sauvegardée sur ton compte et restaurée sur tous tes appareils — tout reste
        aussi en local, l'app marche sans connexion.
      </p>
    </div>
  );
}

function ExpandRow({
  label,
  icon,
  open,
  onClick,
}: {
  label: string;
  icon: DofusIconName;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`no-drag flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        open ? "bg-white/10 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      <DofusIcon name={icon} size={16} className="opacity-80" />
      <span className="flex-1 text-left">{label}</span>
      <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
  );
}

function ChangePseudoForm({ current, onSaved }: { current: string | null; onSaved: () => void }) {
  const [pseudo, setPseudo] = useState(current ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await updatePseudo(pseudo);
    setBusy(false);
    if (error) setError(error);
    else {
      setOk(true);
      setTimeout(onSaved, 900);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-2.5 rounded-xl border border-white/10 bg-void-900/40 p-3">
      <Field label="Pseudo" value={pseudo} onChange={setPseudo} type="text" placeholder="Ton pseudo en jeu" autoComplete="nickname" />
      <Note tone="error">{error}</Note>
      <Note tone="ok">{ok ? "Pseudo mis à jour ✓" : null}</Note>
      <SubmitBtn busy={busy} disabled={busy}>
        Enregistrer
      </SubmitBtn>
    </form>
  );
}

function ChangePasswordForm({ onSaved }: { onSaved: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (next.length < 6) return setError("Le nouveau mot de passe doit faire 6 caractères minimum.");
    if (next !== confirm) return setError("Les deux mots de passe ne correspondent pas.");
    setBusy(true);
    const { error } = await changePassword(current, next);
    setBusy(false);
    if (error) setError(error);
    else {
      setOk(true);
      setCurrent("");
      setNext("");
      setConfirm("");
      setTimeout(onSaved, 1100);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-2.5 rounded-xl border border-white/10 bg-void-900/40 p-3">
      <Field label="Mot de passe actuel" value={current} onChange={setCurrent} type="password" autoComplete="current-password" />
      <Field label="Nouveau mot de passe" value={next} onChange={setNext} type="password" placeholder="Min. 6 caractères" autoComplete="new-password" />
      <Field label="Confirmer le nouveau" value={confirm} onChange={setConfirm} type="password" autoComplete="new-password" />
      <Note tone="error">{error}</Note>
      <Note tone="ok">{ok ? "Mot de passe mis à jour ✓" : null}</Note>
      <SubmitBtn busy={busy} disabled={busy || !current || !next || !confirm}>
        Mettre à jour
      </SubmitBtn>
    </form>
  );
}

// ───────────────────────── Vue « déconnecté » ─────────────────────────
function LoggedOut({ onDone }: { onDone?: () => void }) {
  const [mode, setMode] = useState<"signin" | "signup" | "reset">("signin");
  if (mode === "reset") return <ResetFlow onBack={() => setMode("signin")} onDone={onDone} />;
  return <AuthForm mode={mode} setMode={setMode} onForgot={() => setMode("reset")} onDone={onDone} />;
}

function AuthForm({
  mode,
  setMode,
  onForgot,
  onDone,
}: {
  mode: "signin" | "signup";
  setMode: (m: "signin" | "signup" | "reset") => void;
  onForgot: () => void;
  onDone?: () => void;
}) {
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
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
          <Field label="Pseudo" value={pseudo} onChange={setPseudo} type="text" placeholder="Ton pseudo en jeu" autoComplete="nickname" />
        )}
        <Field label="E-mail" value={email} onChange={setEmail} type="email" placeholder="toi@exemple.com" autoComplete="email" />
        <Field
          label="Mot de passe"
          value={password}
          onChange={setPassword}
          type="password"
          placeholder="Min. 6 caractères"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />

        <Note tone="error">{error}</Note>
        <Note tone="ok">{info}</Note>

        <button
          type="submit"
          disabled={busy || !email.trim() || !password}
          className="no-drag mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-glow-purple to-glow-cyan px-4 py-3 text-sm font-bold text-white shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "signin" ? "Se connecter" : "Créer mon compte"}
        </button>
      </form>

      {mode === "signin" && (
        <button
          type="button"
          onClick={onForgot}
          className="no-drag mx-auto mt-3 block text-xs font-medium text-slate-400 underline-offset-2 transition hover:text-glow-cyan hover:underline"
        >
          Mot de passe oublié ?
        </button>
      )}

      <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
        <DofusIcon name="verrouillage" size={12} /> Données privées · l'app fonctionne aussi sans compte.
      </p>
    </div>
  );
}

function ResetFlow({ onBack, onDone }: { onBack: () => void; onDone?: () => void }) {
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendCode = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    setError(null);
    const { error } = await requestPasswordReset(email.trim());
    setBusy(false);
    if (error) setError(error);
    else setStep("confirm");
  };

  const reset = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!code.trim()) return setError("Saisis le code (ou colle le lien) reçu par e-mail.");
    if (password.length < 6) return setError("Le mot de passe doit faire 6 caractères minimum.");
    setBusy(true);
    const { error } = await confirmPasswordReset(email.trim(), code, password);
    setBusy(false);
    if (error) setError(error);
    else onDone?.(); // verifyOtp a ouvert une session → on est connecté
  };

  return (
    <div>
      <div className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-glow-purple/40 to-glow-cyan/20 ring-1 ring-white/10">
          <DofusIcon name="verrouillage" size={24} />
        </div>
        <h3 className="mt-3 font-display text-xl font-bold text-white">Mot de passe oublié</h3>
        <p className="mx-auto mt-1 max-w-[19rem] text-xs leading-relaxed text-slate-400">
          {step === "request"
            ? "Indique ton e-mail : on t'envoie un code de réinitialisation."
            : `On a envoyé un code à ${email}. Saisis-le ci-dessous (ou colle le lien du mail) avec ton nouveau mot de passe.`}
        </p>
      </div>

      {step === "request" ? (
        <form onSubmit={sendCode} className="mt-5 space-y-2.5">
          <Field label="E-mail" value={email} onChange={setEmail} type="email" placeholder="toi@exemple.com" autoComplete="email" />
          <Note tone="error">{error}</Note>
          <SubmitBtn busy={busy} disabled={busy || !email.trim()} primary>
            Envoyer le code
          </SubmitBtn>
        </form>
      ) : (
        <form onSubmit={reset} className="mt-5 space-y-2.5">
          <Field label="Code reçu (ou lien)" value={code} onChange={setCode} type="text" placeholder="123456" autoComplete="one-time-code" />
          <Field
            label="Nouveau mot de passe"
            value={password}
            onChange={setPassword}
            type="password"
            placeholder="Min. 6 caractères"
            autoComplete="new-password"
          />
          <Note tone="error">{error}</Note>
          <SubmitBtn busy={busy} disabled={busy} primary>
            Réinitialiser et se connecter
          </SubmitBtn>
          <button
            type="button"
            onClick={() => {
              setStep("request");
              setError(null);
            }}
            className="no-drag mx-auto block text-[11px] text-slate-500 transition hover:text-slate-300"
          >
            Je n'ai pas reçu de code
          </button>
        </form>
      )}

      <button
        type="button"
        onClick={onBack}
        className="no-drag mx-auto mt-4 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-400 transition hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Retour à la connexion
      </button>
    </div>
  );
}

// ───────────────────────── Briques partagées ─────────────────────────
function SubmitBtn({
  busy,
  disabled,
  primary,
  children,
}: {
  busy: boolean;
  disabled?: boolean;
  primary?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`no-drag inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 ${
        primary ? "bg-gradient-to-r from-glow-purple to-glow-cyan py-3" : "bg-gradient-to-r from-glow-purple to-glow-violet"
      }`}
    >
      {busy && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

function Note({ tone, children }: { tone: "error" | "ok"; children: ReactNode }) {
  if (!children) return null;
  const cls =
    tone === "error"
      ? "border-glow-rose/30 bg-glow-rose/10 text-rose-100"
      : "border-glow-emerald/30 bg-glow-emerald/10 text-emerald-100";
  return <p className={`rounded-lg border px-3 py-2 text-xs ${cls}`}>{children}</p>;
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
