// Synchro cloud de la progression (compte Supabase) — LOCAL-FIRST.
//
// Principe : localStorage reste la source de vérité (l'app marche hors-ligne et sans compte).
// Quand l'utilisateur est connecté, on FUSIONNE local + distant à la connexion, puis on pousse
// (débouncé) chaque changement. La fusion est ADDITIVE (union des listes, max des progressions,
// dédup des builds/skins par id) → aucune perte entre deux appareils, pas de « dernier écrase tout ».
//
// Tout vit dans une seule ligne `user_state` (jsonb) par utilisateur, isolée par RLS.
import { useSyncExternalStore } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";
import { storeApi, actions, type AppState, type BarbofusSkin } from "../store/store";

const TABLE = "user_state";

// ---- État « compte » observable (pour l'UI) ----
export type AccountStatus = "disabled" | "signedOut" | "signedIn";
export interface AccountState {
  status: AccountStatus;
  email: string | null;
  pseudo: string | null;
  syncing: boolean;
  syncedAt: number | null;
  error: string | null;
  recovery: boolean; // session ouverte via un lien de reset → on demande un nouveau mot de passe
  needsSecurityQuestion: boolean; // connecté sans question secrète → on force le choix
}

let account: AccountState = {
  status: isSupabaseConfigured ? "signedOut" : "disabled",
  email: null,
  pseudo: null,
  syncing: false,
  syncedAt: null,
  error: null,
  recovery: false,
  needsSecurityQuestion: false,
};
const listeners = new Set<() => void>();
function setAccount(patch: Partial<AccountState>) {
  account = { ...account, ...patch };
  for (const l of listeners) l();
}
// Références stables pour useSyncExternalStore (pas de ré-abonnement à chaque rendu).
function subscribeAccount(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
const getAccount = () => account;

export function useAccount(): AccountState {
  return useSyncExternalStore(subscribeAccount, getAccount, getAccount);
}

const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));

// ---- Fusion additive ----
function uniq<T>(a: T[] = [], b: T[] = []): T[] {
  return Array.from(new Set([...(a ?? []), ...(b ?? [])]));
}

function mergeById<T extends { id: string; createdAt?: number; updatedAt?: number }>(a: T[] = [], b: T[] = []): T[] {
  const stamp = (x: T) => x.updatedAt ?? x.createdAt ?? 0;
  const map = new Map<string, T>();
  for (const item of [...(a ?? []), ...(b ?? [])]) {
    const cur = map.get(item.id);
    if (!cur || stamp(item) >= stamp(cur)) map.set(item.id, item);
  }
  return Array.from(map.values());
}

function mergeNumMap(a: Record<number, number> = {}, b: Record<number, number> = {}): Record<number, number> {
  const out: Record<number, number> = { ...a };
  for (const [k, v] of Object.entries(b ?? {})) {
    const n = Number(k);
    out[n] = Math.max(out[n] ?? Number.NEGATIVE_INFINITY, v);
  }
  return out;
}

function mergeChecks(a: Record<string, boolean> = {}, b: Record<string, boolean> = {}): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const k of new Set([...Object.keys(a ?? {}), ...Object.keys(b ?? {})])) {
    if (a?.[k] || b?.[k]) out[k] = true;
  }
  return out;
}

function mergeStates(local: AppState, remote: Partial<AppState>): AppState {
  // Réattache les vignettes locales (non synchronisées) aux skins fusionnés.
  const localThumbs = new Map(local.barbofusSkins.map((s) => [s.id, s.thumb]));
  const barbofusSkins = mergeById<BarbofusSkin>(local.barbofusSkins, remote.barbofusSkins ?? []).map((s) =>
    s.thumb ? s : localThumbs.get(s.id) ? { ...s, thumb: localThumbs.get(s.id) } : s,
  );
  return {
    ...local, // conserve les champs non synchronisés (ex. sidebarCollapsed, propre à l'appareil)
    favoriteDungeons: uniq(local.favoriteDungeons, remote.favoriteDungeons),
    doneDungeons: uniq(local.doneDungeons, remote.doneDungeons),
    doneQuests: uniq(local.doneQuests, remote.doneQuests),
    doneWanted: uniq(local.doneWanted, remote.doneWanted),
    doneGuides: uniq(local.doneGuides, remote.doneGuides),
    favoriteGuides: uniq(local.favoriteGuides, remote.favoriteGuides),
    recentGuides: uniq(local.recentGuides, remote.recentGuides).slice(0, 10),
    builds: mergeById(local.builds, remote.builds ?? []),
    skinDesigns: mergeById(local.skinDesigns, remote.skinDesigns ?? []),
    barbofusSkins,
    guideStep: mergeNumMap(local.guideStep, remote.guideStep),
    guideTotalSteps: mergeNumMap(local.guideTotalSteps, remote.guideTotalSteps),
    guideChecks: mergeChecks(local.guideChecks, remote.guideChecks),
    metamob: local.metamob ?? remote.metamob ?? null,
    macroConfig: newerConfig(local.macroConfig, remote.macroConfig),
  };
}

// Config macros : on garde la version la plus récente (horodatage updatedAt) entre l'appareil
// et le cloud — « dernier qui écrit gagne ».
function newerConfig(local: AppState["macroConfig"], remote: AppState["macroConfig"] | undefined) {
  if (!local) return remote ?? null;
  if (!remote) return local;
  return (remote.updatedAt ?? 0) > (local.updatedAt ?? 0) ? remote : local;
}

// Sous-ensemble réellement stocké côté serveur : on retire la pref d'UI locale et les
// vignettes de skins (lourdes, base64) — regénérées/conservées localement.
function toRemote(s: AppState): Partial<AppState> {
  const { sidebarCollapsed: _omit, barbofusSkins, ...rest } = s;
  void _omit;
  return { ...rest, barbofusSkins: barbofusSkins.map(({ thumb: _t, ...sk }) => sk) };
}

// ---- Cycle de vie de la synchro ----
let currentUserId: string | null = null;
let applyingRemote = false;
let unsubscribeStore: (() => void) | null = null;
let pushTimer: ReturnType<typeof setTimeout> | null = null;

async function pull(userId: string): Promise<Partial<AppState> | null> {
  const { data, error } = await supabase!.from(TABLE).select("state").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return (data?.state as Partial<AppState> | undefined) ?? null;
}

async function pushNow(userId: string) {
  const { error } = await supabase!
    .from(TABLE)
    .upsert({ user_id: userId, state: toRemote(storeApi.getState()), updated_at: new Date().toISOString() });
  if (error) throw error;
}

function schedulePush() {
  if (!currentUserId) return;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(async () => {
    pushTimer = null;
    const uid = currentUserId;
    if (!uid) return;
    setAccount({ syncing: true });
    try {
      await pushNow(uid);
      setAccount({ syncing: false, syncedAt: Date.now(), error: null });
    } catch (e) {
      setAccount({ syncing: false, error: errMsg(e) });
    }
  }, 2500);
}

async function hydrate(userId: string, email: string | null, pseudo: string | null) {
  currentUserId = userId; // synchrone → garde contre une double hydratation concurrente
  setAccount({ status: "signedIn", email, pseudo, syncing: true, error: null });
  try {
    const remote = await pull(userId);
    const merged = mergeStates(storeApi.getState(), remote ?? {});
    applyingRemote = true;
    actions.replaceAll(merged);
    applyingRemote = false;
    await pushNow(userId); // renvoie l'état fusionné (inclut les ajouts locaux)
    setAccount({ syncing: false, syncedAt: Date.now(), error: null });
  } catch (e) {
    setAccount({ syncing: false, error: errMsg(e) });
  }
  if (!unsubscribeStore) {
    unsubscribeStore = storeApi.subscribe(() => {
      if (!applyingRemote) schedulePush();
    });
  }
  // Vérifie qu'une question secrète existe (sinon on forcera le choix). Sauté juste après une
  // inscription (la question vient d'être posée) pour éviter une fausse alerte / un flash.
  void refreshSecurityQuestionFlag(email);
}

// Une question secrète est-elle définie ? Sinon → on lèvera needsSecurityQuestion. Tolérant aux
// erreurs (SQL non déployé / réseau) : en cas de doute on NE force PAS (pas de blocage).
let skipNextSecurityCheck = false;
async function refreshSecurityQuestionFlag(email: string | null) {
  if (skipNextSecurityCheck) {
    skipNextSecurityCheck = false;
    setAccount({ needsSecurityQuestion: false });
    return;
  }
  if (!supabase || !email) return;
  const { question, error } = await getSecurityQuestion(email);
  if (error) return; // indéterminé → on ne force pas
  setAccount({ needsSecurityQuestion: question === null });
}

function teardown() {
  currentUserId = null;
  if (unsubscribeStore) {
    unsubscribeStore();
    unsubscribeStore = null;
  }
  if (pushTimer) {
    clearTimeout(pushTimer);
    pushTimer = null;
  }
}

// ---- Init (appelé une fois au démarrage de l'app) ----
let inited = false;
export function initCloudSync() {
  if (inited || !supabase) return;
  inited = true;
  // onAuthStateChange émet aussi l'événement INITIAL_SESSION au montage → couvre la reprise
  // de session au lancement ET les connexions/déconnexions ultérieures.
  supabase.auth.onAuthStateChange((_event, session) => {
    const user = session?.user;
    if (user) {
      const pseudo = (user.user_metadata?.pseudo as string | undefined)?.trim() || null;
      if (currentUserId !== user.id) hydrate(user.id, user.email ?? null, pseudo);
      else setAccount({ email: user.email ?? null, pseudo });
    } else {
      teardown();
      setAccount({
        status: "signedOut",
        email: null,
        pseudo: null,
        syncing: false,
        syncedAt: null,
        recovery: false,
        needsSecurityQuestion: false,
      });
    }
  });
}

// ---- Actions auth (UI) ----
export async function signIn(email: string, password: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Compte indisponible (Supabase non configuré)." };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error: error?.message ?? null };
}

export async function signUp(
  email: string,
  password: string,
  pseudo?: string,
  question?: string,
  answer?: string,
): Promise<{ error: string | null; needsConfirmation: boolean }> {
  if (!supabase) return { error: "Compte indisponible (Supabase non configuré).", needsConfirmation: false };
  // L'hydratation déclenchée par l'inscription ne doit pas lever « pas de question secrète »
  // (on la pose juste après) → on neutralise la vérification pour cette session.
  skipNextSecurityCheck = true;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { pseudo: pseudo?.trim() || null } }, // → user_metadata.pseudo
  });
  if (error) {
    skipNextSecurityCheck = false;
    return { error: error.message, needsConfirmation: false };
  }
  // Session déjà ouverte (confirmation d'e-mail désactivée) → onAuthStateChange connecte direct ;
  // sinon on tente une connexion immédiate pour logger l'utilisateur sans étape supplémentaire.
  let loggedIn = !!data.session;
  if (!loggedIn) {
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
    loggedIn = !signInErr;
  }
  if (!loggedIn) skipNextSecurityCheck = false; // pas de session → aucune hydratation à neutraliser
  // Enregistre la question secrète (best-effort : ne bloque jamais l'inscription).
  if (loggedIn && question?.trim() && answer?.trim()) {
    const { error: qErr } = await supabase.rpc("set_security_question", {
      p_question: question.trim(),
      p_answer: answer,
    });
    if (qErr) console.warn("[security-question] enregistrement impossible:", qErr.message);
  }
  // needsConfirmation = true uniquement si Supabase EXIGE une confirmation d'e-mail.
  return { error: null, needsConfirmation: !loggedIn };
}

// ---- Récupération par question secrète (sans e-mail — cf. supabase/recovery.sql) ----

// Définit / met à jour sa question secrète (utilisateur connecté).
export async function setSecurityQuestion(question: string, answer: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Compte indisponible." };
  const { error } = await supabase.rpc("set_security_question", {
    p_question: question.trim(),
    p_answer: answer,
  });
  if (!error) setAccount({ needsSecurityQuestion: false });
  return { error: error?.message ?? null };
}

// Ferme la modale « définis ta question secrète » sans l'enregistrer (réapparaît à la prochaine
// connexion tant qu'aucune question n'est définie).
export function dismissSecurityPrompt() {
  setAccount({ needsSecurityQuestion: false });
}

// Renvoie la question secrète associée à un e-mail (null si compte inconnu / pas de question).
export async function getSecurityQuestion(email: string): Promise<{ question: string | null; error: string | null }> {
  if (!supabase) return { question: null, error: "Compte indisponible." };
  const { data, error } = await supabase.rpc("get_security_question", { p_email: email.trim() });
  return { question: (data as string | null) ?? null, error: error?.message ?? null };
}

// Vérifie la réponse, réinitialise le mot de passe côté serveur, puis connecte l'utilisateur.
export async function resetPasswordWithAnswer(
  email: string,
  answer: string,
  newPassword: string,
): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Compte indisponible." };
  const { data, error } = await supabase.rpc("reset_password_with_answer", {
    p_email: email.trim(),
    p_answer: answer,
    p_new_password: newPassword,
  });
  if (error) return { error: error.message };
  if (data !== true) return { error: "Réponse incorrecte." };
  const { error: signInErr } = await supabase.auth.signInWithPassword({ email: email.trim(), password: newPassword });
  return { error: signInErr?.message ?? null };
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

// ---- Gestion du compte (mot de passe / pseudo) ----

// Change le mot de passe d'un utilisateur connecté. On revérifie d'abord le mot de passe
// actuel (re-connexion silencieuse) → une session laissée ouverte ne suffit pas à le changer.
export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Compte indisponible." };
  const email = account.email;
  if (!email) return { error: "Tu dois être connecté." };
  const { error: reauthErr } = await supabase.auth.signInWithPassword({ email, password: currentPassword });
  if (reauthErr) return { error: "Mot de passe actuel incorrect." };
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return { error: error?.message ?? null };
}

// Met à jour le pseudo (user_metadata) — reflété immédiatement dans l'état « compte ».
export async function updatePseudo(pseudo: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Compte indisponible." };
  const clean = pseudo.trim();
  const { error } = await supabase.auth.updateUser({ data: { pseudo: clean || null } });
  if (!error) setAccount({ pseudo: clean || null });
  return { error: error?.message ?? null };
}

// URL de retour du lien de reset → ouvre l'app sur l'écran « nouveau mot de passe »
// (doit figurer dans Supabase → Authentication → URL Configuration → Redirect URLs).
const RECOVERY_REDIRECT = "dofuscodex://reset";

// Mot de passe oublié — étape 1 : envoie un e-mail de réinitialisation (lien + code).
export async function requestPasswordReset(email: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Compte indisponible." };
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: RECOVERY_REDIRECT });
  return { error: error?.message ?? null };
}

// Récupère le token d'un lien de réinitialisation collé (sinon null → on traite l'entrée comme un code).
function extractRecoveryToken(input: string): string | null {
  const s = input.trim();
  if (!/^https?:\/\//i.test(s) && !/token/i.test(s)) return null;
  try {
    const url = new URL(s);
    return url.searchParams.get("token_hash") || url.searchParams.get("token");
  } catch {
    const m = s.match(/token(?:_hash)?=([^&\s]+)/i);
    return m ? decodeURIComponent(m[1]) : null;
  }
}

// Mot de passe oublié — étape 2 : valide le code (OTP de type recovery) OU le lien collé,
// puis fixe le nouveau mot de passe. verifyOtp ouvre une session → l'utilisateur est connecté.
export async function confirmPasswordReset(
  email: string,
  codeOrLink: string,
  newPassword: string,
): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Compte indisponible." };
  const tokenHash = extractRecoveryToken(codeOrLink);
  const { error: otpErr } = tokenHash
    ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" })
    : await supabase.auth.verifyOtp({ email: email.trim(), token: codeOrLink.trim(), type: "recovery" });
  if (otpErr) return { error: "Code ou lien invalide / expiré." };
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return { error: error?.message ?? null };
}

// Traite un lien profond dofuscodex:// (clic sur le lien de reset reçu par e-mail). On ouvre la
// session à partir des jetons de l'URL ; si c'est une récupération, on lève le drapeau `recovery`
// → l'UI affiche l'écran « choisis un nouveau mot de passe ». detectSessionInUrl étant désactivé
// (Electron), c'est nous qui posons la session manuellement.
export async function handleAuthDeepLink(url: string): Promise<void> {
  if (!supabase || !url) return;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return;
  }
  const hash = new URLSearchParams(parsed.hash.replace(/^#/, ""));
  const get = (k: string) => hash.get(k) ?? parsed.searchParams.get(k);

  const errDesc = get("error_description") || get("error");
  if (errDesc) {
    setAccount({ error: decodeURIComponent(errDesc.replace(/\+/g, " ")) });
    return;
  }

  const accessToken = hash.get("access_token");
  const refreshToken = hash.get("refresh_token");
  const code = parsed.searchParams.get("code");
  try {
    if (accessToken && refreshToken) {
      const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      if (error) throw error;
    } else if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
    } else {
      return; // rien d'exploitable dans l'URL
    }
  } catch (e) {
    setAccount({ error: errMsg(e) });
    return;
  }
  // Session posée → onAuthStateChange hydrate le compte. Reset de mot de passe → on le demande.
  if (get("type") === "recovery") setAccount({ recovery: true });
}

// Finalise une récupération : fixe le nouveau mot de passe puis lève le drapeau.
export async function completePasswordRecovery(newPassword: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Compte indisponible." };
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (!error) setAccount({ recovery: false });
  return { error: error?.message ?? null };
}

// Ferme l'écran de récupération sans changer le mot de passe (l'utilisateur reste connecté).
export function dismissRecovery() {
  setAccount({ recovery: false });
}

// Force une synchro immédiate (bouton « Synchroniser maintenant »).
export async function syncNow() {
  const uid = currentUserId;
  if (!uid) return;
  if (pushTimer) {
    clearTimeout(pushTimer);
    pushTimer = null;
  }
  setAccount({ syncing: true });
  try {
    await pushNow(uid);
    setAccount({ syncing: false, syncedAt: Date.now(), error: null });
  } catch (e) {
    setAccount({ syncing: false, error: errMsg(e) });
  }
}
