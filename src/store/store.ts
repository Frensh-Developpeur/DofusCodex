import { useRef, useSyncExternalStore } from "react";

// ---- Types ----

export interface BuildSlots {
  [slotKey: string]: number; // slotKey -> item ankama_id
}

export interface Build {
  id: string;
  name: string;
  slots: BuildSlots;
  createdAt: number;
  updatedAt?: number;
  breedId?: number | null;
  level?: number;
  caracs?: Record<string, number>;
  parch?: Record<string, number>;
  exos?: Record<string, string>;
  target?: { resPct: number[]; resFlat: number[] };
}

export interface SkinCosmetic {
  id: number;
  name: string;
  icon: string;
  type?: string;
}

export interface SkinDesign {
  id: string;
  name: string;
  breedId: number | null;
  gender: "m" | "f";
  orientation: number;
  colors: {
    skin: string;
    hair: string;
    primary: string;
    secondary: string;
    accent: string;
  };
  cosmetics: Record<string, SkinCosmetic | null>;
  createdAt: number;
  updatedAt?: number;
}

// Skin Barbofus sauvegardé : on ne mémorise que l'ID/URL (rechargeable via ?skin=ID) + un nom.
export interface BarbofusSkin {
  id: string; // id local
  name: string;
  skinId?: string; // id côté Barbofus si l'URL en expose un (?skin=ID) — sinon absent
  url: string; // URL rechargeable complète (l'URL encode le skin, format variable)
  thumb?: string; // vignette (dataURL webp) capturée du moteur à la sauvegarde — affichage galerie
  createdAt: number;
  updatedAt?: number;
}

// Connexion au compte Metamob (suivi de capture d'archimonstres). Clé Bearer générée
// par l'utilisateur dans ses réglages metamob.fr — stockée localement (jamais envoyée ailleurs).
export interface MetamobAuth {
  pseudo: string;
  apiKey: string;
  slug?: string; // quête (chasse) sélectionnée, si l'utilisateur en a plusieurs
}

export interface AppState {
  favoriteDungeons: number[];
  doneDungeons: number[];
  doneQuests: number[];
  doneWanted: string[]; // avis de recherche « capturés » (par slug)
  builds: Build[];
  // Suivi des guides Ganymède.
  guideStep: Record<number, number>; // guideId -> index de l'étape en cours
  guideTotalSteps: Record<number, number>; // guideId -> nombre total d'étapes
  guideChecks: Record<string, boolean>; // clé "guideId:stepIdx:cbIdx" -> coché
  doneGuides: number[]; // guides marqués terminés
  favoriteGuides: number[]; // guides mis en favori
  recentGuides: number[]; // guides récemment ouverts (plus récent en tête) — pour reprise & onglets
  skinDesigns: SkinDesign[];
  barbofusSkins: BarbofusSkin[]; // skins Barbofus sauvegardés (page « Mes Skins »)
  sidebarCollapsed: boolean; // navbar repliée (icônes seules)
  metamob: MetamobAuth | null; // connexion au compte Metamob (null = non connecté)
}

const STORAGE_KEY = "dofuscodex.state.v1";

const DEFAULT_STATE: AppState = {
  favoriteDungeons: [],
  doneDungeons: [],
  doneQuests: [],
  doneWanted: [],
  builds: [],
  guideStep: {},
  guideTotalSteps: {},
  guideChecks: {},
  doneGuides: [],
  favoriteGuides: [],
  recentGuides: [],
  skinDesigns: [],
  barbofusSkins: [],
  sidebarCollapsed: false,
  metamob: null,
};

// ---- Tiny external store (useSyncExternalStore) ----

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    // Migration-safe : on fusionne avec les défauts → une sauvegarde d'une ancienne version
    // (champs en moins) reste valide, les nouveaux champs prennent leur valeur par défaut.
    // ⚠️ Ne PAS changer STORAGE_KEY entre versions, sinon les données seraient « perdues »
    // (orphelines sous l'ancienne clé). Le dossier userData survit déjà aux mises à jour.
    return { ...DEFAULT_STATE, ...(JSON.parse(raw) as Partial<AppState>) };
  } catch {
    return DEFAULT_STATE;
  }
}

let state: AppState = load();
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function setState(updater: (s: AppState) => AppState) {
  state = updater(state);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota / private mode — keep in memory */
  }
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return state;
}

// API bas-niveau du store, pour les couches non-React (ex. synchro cloud) :
// lire l'état courant et s'abonner aux changements.
export const storeApi = {
  getState: getSnapshot,
  subscribe,
};

function shallowEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  const ka = Object.keys(a as object);
  const kb = Object.keys(b as object);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => Object.is((a as any)[k], (b as any)[k]));
}

// Generic selector hook. Caches the last snapshot and reuses it when shallow-equal
// so a selector returning a fresh object/array can't trigger an infinite render loop.
export function useStore<T>(selector: (s: AppState) => T): T {
  const ref = useRef<{ value: T } | null>(null);
  const getSnapshot = () => {
    const next = selector(state);
    if (ref.current && shallowEqual(ref.current.value, next)) {
      return ref.current.value;
    }
    ref.current = { value: next };
    return next;
  };
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

// ---- Helpers ----

function toggle(list: number[], id: number): number[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export const actions = {
  toggleFavoriteDungeon(id: number) {
    setState((s) => ({ ...s, favoriteDungeons: toggle(s.favoriteDungeons, id) }));
  },
  toggleDoneDungeon(id: number) {
    setState((s) => ({ ...s, doneDungeons: toggle(s.doneDungeons, id) }));
  },
  toggleDoneQuest(id: number) {
    setState((s) => ({ ...s, doneQuests: toggle(s.doneQuests, id) }));
  },
  toggleDoneWanted(slug: string) {
    setState((s) => ({
      ...s,
      doneWanted: s.doneWanted.includes(slug)
        ? s.doneWanted.filter((x) => x !== slug)
        : [...s.doneWanted, slug],
    }));
  },
  saveBuild(name: string, slots: BuildSlots, extra?: Omit<Partial<Build>, "id" | "name" | "slots" | "createdAt">): string {
    const now = Date.now();
    const id = `b_${now.toString(36)}`;
    setState((s) => ({
      ...s,
      builds: [{ id, name: name.trim() || "Build sans nom", slots, createdAt: now, updatedAt: now, ...extra }, ...s.builds],
    }));
    return id;
  },
  // Met à jour un build existant (auto-save de l'éditeur).
  updateBuild(id: string, patch: Partial<Omit<Build, "id" | "createdAt">>) {
    setState((s) => ({
      ...s,
      builds: s.builds.map((b) => (b.id === id ? { ...b, ...patch, updatedAt: Date.now() } : b)),
    }));
  },
  deleteBuild(id: string) {
    setState((s) => ({ ...s, builds: s.builds.filter((b) => b.id !== id) }));
  },
  saveSkinDesign(design: Omit<SkinDesign, "id" | "createdAt" | "updatedAt">): string {
    const now = Date.now();
    const id = `s_${now.toString(36)}`;
    setState((s) => ({
      ...s,
      skinDesigns: [
        { ...design, id, createdAt: now, updatedAt: now, name: design.name.trim() || "Skin sans nom" },
        ...s.skinDesigns,
      ],
    }));
    return id;
  },
  updateSkinDesign(id: string, patch: Partial<Omit<SkinDesign, "id" | "createdAt">>) {
    setState((s) => ({
      ...s,
      skinDesigns: s.skinDesigns.map((skin) =>
        skin.id === id ? { ...skin, ...patch, updatedAt: Date.now() } : skin,
      ),
    }));
  },
  deleteSkinDesign(id: string) {
    setState((s) => ({ ...s, skinDesigns: s.skinDesigns.filter((skin) => skin.id !== id) }));
  },
  // ---- Skins Barbofus sauvegardés ----
  // Renvoie "exists" si la même URL est déjà en galerie, "saved" sinon.
  saveBarbofusSkin(input: { name: string; url: string; skinId?: string; thumb?: string }): "saved" | "exists" {
    let result: "saved" | "exists" = "saved";
    setState((s) => {
      if (s.barbofusSkins.some((sk) => sk.url === input.url)) {
        result = "exists";
        return s;
      }
      const now = Date.now();
      const skin: BarbofusSkin = {
        id: `bs_${now.toString(36)}`,
        name: input.name.trim() || "Skin Barbofus",
        skinId: input.skinId,
        url: input.url,
        thumb: input.thumb,
        createdAt: now,
      };
      return { ...s, barbofusSkins: [skin, ...s.barbofusSkins] };
    });
    return result;
  },
  renameBarbofusSkin(id: string, name: string) {
    setState((s) => ({
      ...s,
      barbofusSkins: s.barbofusSkins.map((sk) =>
        sk.id === id ? { ...sk, name: name.trim() || sk.name } : sk,
      ),
    }));
  },
  // Écrase un skin existant (nouvelle URL/nom) — utilisé par « Sauvegarder → Écraser ».
  updateBarbofusSkin(id: string, patch: { name?: string; url?: string; skinId?: string; thumb?: string }) {
    setState((s) => ({
      ...s,
      barbofusSkins: s.barbofusSkins.map((sk) =>
        sk.id === id
          ? { ...sk, ...patch, name: patch.name?.trim() || sk.name, updatedAt: Date.now() }
          : sk,
      ),
    }));
  },
  deleteBarbofusSkin(id: string) {
    setState((s) => ({ ...s, barbofusSkins: s.barbofusSkins.filter((sk) => sk.id !== id) }));
  },
  toggleSidebar() {
    setState((s) => ({ ...s, sidebarCollapsed: !s.sidebarCollapsed }));
  },
  // ---- Compte Metamob ----
  setMetamobAuth(auth: MetamobAuth) {
    setState((s) => ({ ...s, metamob: auth }));
  },
  setMetamobSlug(slug: string) {
    setState((s) => (s.metamob ? { ...s, metamob: { ...s.metamob, slug } } : s));
  },
  clearMetamob() {
    setState((s) => ({ ...s, metamob: null }));
  },
  // ---- Sauvegarde / restauration (export-import JSON) ----
  exportData(): string {
    return JSON.stringify(state, null, 2);
  },
  // Restaure une sauvegarde. Fusionne avec les valeurs par défaut (tolérant aux anciennes
  // sauvegardes : les nouveaux champs prennent leur défaut). Renvoie false si le JSON est invalide.
  importData(json: string): boolean {
    try {
      const parsed = JSON.parse(json);
      if (!parsed || typeof parsed !== "object") return false;
      setState(() => ({ ...DEFAULT_STATE, ...(parsed as Partial<AppState>) }));
      return true;
    } catch {
      return false;
    }
  },
  // Remplace tout l'état (fusionné avec les défauts → tolérant). Utilisé par la synchro cloud
  // pour appliquer l'état fusionné local+distant. Persiste et notifie comme un setState normal.
  replaceAll(next: Partial<AppState>) {
    setState(() => ({ ...DEFAULT_STATE, ...next }));
  },
  // Réinitialise TOUTES les données locales (favoris, progression, builds, suivi guides, skins…).
  resetAll() {
    state = { ...DEFAULT_STATE };
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* mode privé / quota */
    }
    emit();
  },
  // ---- Suivi des guides ----
  setGuideStep(id: number, step: number) {
    setState((s) => ({ ...s, guideStep: { ...s.guideStep, [id]: step } }));
  },
  setGuideTotalSteps(id: number, total: number) {
    setState((s) => {
      if (s.guideTotalSteps[id] === total) return s;
      return { ...s, guideTotalSteps: { ...s.guideTotalSteps, [id]: total } };
    });
  },
  // Fusionne en masse les totaux d'étapes (depuis le cache IndexedDB des guides API).
  mergeGuideTotalSteps(counts: Record<number, number>) {
    setState((s) => {
      let changed = false;
      const guideTotalSteps = { ...s.guideTotalSteps };
      for (const [id, total] of Object.entries(counts)) {
        const k = Number(id);
        if (guideTotalSteps[k] !== total) {
          guideTotalSteps[k] = total;
          changed = true;
        }
      }
      return changed ? { ...s, guideTotalSteps } : s;
    });
  },
  toggleGuideCheck(key: string) {
    setState((s) => {
      const next = { ...s.guideChecks };
      if (next[key]) delete next[key];
      else next[key] = true;
      return { ...s, guideChecks: next };
    });
  },
  toggleDoneGuide(id: number) {
    setState((s) => ({ ...s, doneGuides: toggle(s.doneGuides, id) }));
  },
  toggleFavoriteGuide(id: number) {
    setState((s) => ({ ...s, favoriteGuides: toggle(s.favoriteGuides, id) }));
  },
  pushRecentGuide(id: number) {
    setState((s) => {
      if (s.recentGuides[0] === id) return s; // déjà en tête, rien à faire
      return { ...s, recentGuides: [id, ...s.recentGuides.filter((g) => g !== id)].slice(0, 10) };
    });
  },
  closeRecentGuide(id: number) {
    setState((s) => ({ ...s, recentGuides: s.recentGuides.filter((g) => g !== id) }));
  },
  // Import depuis l'app Ganymède : on ne reprend QUE l'avancement (étape courante +
  // cases cochées). La complétude est ensuite déduite (étape courante == dernière étape),
  // le contenu des guides venant toujours de l'API.
  importGanymedeProgress(
    progresses: Array<{ id: number; currentStep: number; steps: Record<string, { checkboxes: number[] }> }>,
  ): number {
    let count = 0;
    setState((s) => {
      const guideStep = { ...s.guideStep };
      const guideChecks = { ...s.guideChecks };
      for (const p of progresses) {
        if (!Number.isFinite(p.id) || !Number.isFinite(p.currentStep)) continue;
        if (p.currentStep > (guideStep[p.id] ?? -1)) {
          guideStep[p.id] = p.currentStep;
          count++;
        }
        for (const [stepIdx, stepData] of Object.entries(p.steps ?? {})) {
          for (const cbIdx of stepData.checkboxes ?? []) {
            const key = `${p.id}:${stepIdx}:${cbIdx}`;
            if (!guideChecks[key]) guideChecks[key] = true;
          }
        }
      }
      return { ...s, guideStep, guideChecks };
    });
    return count;
  },
  resetGuide(id: number) {
    setState((s) => {
      const guideStep = { ...s.guideStep };
      delete guideStep[id];
      const prefix = `${id}:`;
      const guideChecks: Record<string, boolean> = {};
      for (const k of Object.keys(s.guideChecks)) {
        if (!k.startsWith(prefix)) guideChecks[k] = s.guideChecks[k];
      }
      return {
        ...s,
        guideStep,
        guideChecks,
        doneGuides: s.doneGuides.filter((g) => g !== id),
      };
    });
  },
};
