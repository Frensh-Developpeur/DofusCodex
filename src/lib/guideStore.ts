// Couche d'accès aux guides : lit d'abord le stockage local (IndexedDB), retombe sur
// le réseau Ganymède sinon. Fournit aussi la synchro « tout télécharger » + mise à jour.
import { listGuides, getGuide, type GuideLight, type GuideDetail } from "../api/ganymede";
import {
  idbGetGuide,
  idbGetAllGuides,
  idbCountGuides,
  idbPutGuides,
  idbGetList,
  idbSetMeta,
  idbGetMeta,
  idbGetStepCounts,
} from "./guideDb";

// Guides FR exploitables (la liste brute contient toutes les langues + brouillons).
function frGuides(list: GuideLight[]): GuideLight[] {
  return list.filter((g) => g.lang === "fr" && g.status !== "draft");
}

// ---- Lecture (DB d'abord, réseau en repli avec persistance) ----

export async function getGuideListData(signal?: AbortSignal): Promise<GuideLight[]> {
  // IDB d'abord ; toute défaillance/lenteur du stockage local → repli réseau direct.
  const local = await idbGetList().catch(() => undefined);
  if (local?.length) return local;
  const net = await listGuides(signal);
  void idbSetMeta("list", net).catch(() => {}); // persistance best-effort, non bloquante
  return net;
}

export async function getGuideData(id: number, signal?: AbortSignal): Promise<GuideDetail> {
  const local = await idbGetGuide(id).catch(() => undefined);
  if (local) return local;
  const net = await getGuide(id, signal);
  void idbPutGuides([net]).catch(() => {});
  return net;
}

// ---- Synchronisation (téléchargement complet / mise à jour) ----

export interface SyncState {
  storedCount: number; // guides détaillés en local
  totalFr: number; // guides FR connus (selon la dernière liste)
  lastSync: number | null;
  complete: boolean; // tout est téléchargé
}

export async function getSyncState(): Promise<SyncState> {
  const [storedCount, list, lastSync] = await Promise.all([
    idbCountGuides().catch(() => 0),
    idbGetList().catch(() => undefined),
    idbGetMeta<number>("lastSync").catch(() => undefined),
  ]);
  const totalFr = list ? frGuides(list).length : 0;
  return {
    storedCount,
    totalFr,
    lastSync: lastSync ?? null,
    complete: totalFr > 0 && storedCount >= totalFr,
  };
}

// Exécute `task` sur chaque élément avec une concurrence bornée.
async function pool<T>(items: T[], limit: number, task: (item: T) => Promise<void>): Promise<void> {
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      await task(items[idx]);
    }
  });
  await Promise.all(workers);
}

export interface SyncProgress {
  done: number;
  total: number;
}

// Télécharge (ou met à jour) tous les guides FR : on rafraîchit la liste, puis on ne
// (re)télécharge que les détails manquants ou dont `updated_at` a changé.
export async function syncGuides(opts: {
  onProgress?: (p: SyncProgress) => void;
  signal?: AbortSignal;
} = {}): Promise<{ downloaded: number }> {
  const list = await listGuides(opts.signal);
  await idbSetMeta("list", list);
  const fr = frGuides(list);

  const stored = await idbGetAllGuides();
  const storedAt = new Map(stored.map((g) => [g.id, g.updated_at]));
  const todo = fr.filter((g) => storedAt.get(g.id) !== g.updated_at);

  let done = 0;
  const total = todo.length;
  opts.onProgress?.({ done, total });

  await pool(todo, 6, async (g) => {
    try {
      const detail = await getGuide(g.id, opts.signal);
      await idbPutGuides([detail]);
    } catch {
      /* un guide qui échoue ne bloque pas le lot */
    }
    done += 1;
    opts.onProgress?.({ done, total });
  });

  await idbSetMeta("lastSync", Date.now());
  return { downloaded: total };
}

// Télécharge (et persiste) le détail de guides précis qui ne sont pas déjà en local.
// Utilisé après un import Ganymède : on récupère le contenu API des guides importés pour
// connaître leur nombre d'étapes (→ « X / Y » + détection de complétude sur les cards).
export async function ensureGuidesDownloaded(
  ids: number[],
  opts: { onProgress?: (p: SyncProgress) => void; signal?: AbortSignal } = {},
): Promise<{ downloaded: number }> {
  const existing = await idbGetStepCounts().catch(() => ({}) as Record<number, number>);
  const todo = [...new Set(ids)].filter((id) => Number.isFinite(id) && existing[id] == null);

  let done = 0;
  const total = todo.length;
  opts.onProgress?.({ done, total });

  await pool(todo, 6, async (id) => {
    try {
      const detail = await getGuide(id, opts.signal);
      await idbPutGuides([detail]);
    } catch {
      /* un guide qui échoue ne bloque pas le lot */
    }
    done += 1;
    opts.onProgress?.({ done, total });
  });

  return { downloaded: total };
}

// Délai au-delà duquel on revérifie les mises à jour en tâche de fond (3 jours).
export const SYNC_REFRESH_MS = 1000 * 60 * 60 * 24 * 3;
