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
}

let account: AccountState = {
  status: isSupabaseConfigured ? "signedOut" : "disabled",
  email: null,
  pseudo: null,
  syncing: false,
  syncedAt: null,
  error: null,
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
  };
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
      setAccount({ status: "signedOut", email: null, pseudo: null, syncing: false, syncedAt: null });
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
): Promise<{ error: string | null; needsConfirmation: boolean }> {
  if (!supabase) return { error: "Compte indisponible (Supabase non configuré).", needsConfirmation: false };
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { pseudo: pseudo?.trim() || null } }, // → user_metadata.pseudo
  });
  return { error: error?.message ?? null, needsConfirmation: !!data.user && !data.session };
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
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
