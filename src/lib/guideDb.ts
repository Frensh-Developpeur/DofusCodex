// Stockage local des guides Ganymède via IndexedDB (pas de limite pratique de taille,
// contrairement à localStorage). Permet de TOUT télécharger une fois et de naviguer
// hors-ligne ensuite, sans serveur à héberger.
import { firstGuideImage, type GuideLight, type GuideDetail } from "../api/ganymede";

const DB_NAME = "dofuscodex";
const DB_VERSION = 2;
const GUIDES = "guides"; // détails complets, clé = id
const META = "meta"; // { key, value } : liste, lastSync…
const API_JSON = "apiJson"; // cache générique des réponses API JSON, clé = url

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === "undefined" || !indexedDB) {
      reject(new Error("IndexedDB indisponible"));
      return;
    }
    // Filet de sécurité : si l'ouverture ne se résout pas (env. restreint), on échoue
    // proprement pour basculer sur le réseau plutôt que de bloquer l'app.
    const timer = setTimeout(() => reject(new Error("IndexedDB timeout")), 3000);
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(GUIDES)) db.createObjectStore(GUIDES, { keyPath: "id" });
      if (!db.objectStoreNames.contains(META)) db.createObjectStore(META, { keyPath: "key" });
      if (!db.objectStoreNames.contains(API_JSON)) db.createObjectStore(API_JSON, { keyPath: "url" });
    };
    req.onsuccess = () => {
      clearTimeout(timer);
      resolve(req.result);
    };
    req.onerror = () => {
      clearTimeout(timer);
      reject(req.error);
    };
    req.onblocked = () => {
      clearTimeout(timer);
      reject(new Error("IndexedDB bloqué"));
    };
  });
  // Un échec ne doit pas désactiver IDB pour toute la session : on autorise un nouvel essai.
  dbPromise.catch(() => {
    dbPromise = null;
  });
  return dbPromise;
}

function tx<T>(store: string, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(store, mode);
        const req = fn(t.objectStore(store));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      }),
  );
}

export function idbGetGuide(id: number): Promise<GuideDetail | undefined> {
  return tx<GuideDetail | undefined>(GUIDES, "readonly", (s) => s.get(id));
}

export async function idbGetAllGuides(): Promise<GuideDetail[]> {
  return tx<GuideDetail[]>(GUIDES, "readonly", (s) => s.getAll());
}

export async function idbCountGuides(): Promise<number> {
  return tx<number>(GUIDES, "readonly", (s) => s.count());
}

// Nombre d'étapes par guide (id -> steps.length), lu via curseur : chaque détail est
// chargé puis relâché un à un → empreinte mémoire minime, même sur ~700 guides.
export async function idbGetStepCounts(): Promise<Record<number, number>> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const counts: Record<number, number> = {};
    const t = db.transaction(GUIDES, "readonly");
    const req = t.objectStore(GUIDES).openCursor();
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        const g = cursor.value as GuideDetail;
        if (Array.isArray(g.steps)) counts[g.id] = g.steps.length;
        cursor.continue();
      } else {
        resolve(counts);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

// Vignette (première image) par guide (id -> url), lue via curseur comme idbGetStepCounts :
// chaque détail est chargé puis relâché un à un → empreinte mémoire minime sur ~700 guides.
export async function idbGetThumbnails(): Promise<Record<number, string>> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const thumbs: Record<number, string> = {};
    const t = db.transaction(GUIDES, "readonly");
    const req = t.objectStore(GUIDES).openCursor();
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        const g = cursor.value as GuideDetail;
        const url = firstGuideImage(g.steps);
        if (url) thumbs[g.id] = url;
        cursor.continue();
      } else {
        resolve(thumbs);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

// Écrit plusieurs guides dans une seule transaction (rapide pour les gros lots).
export async function idbPutGuides(guides: GuideDetail[]): Promise<void> {
  if (!guides.length) return;
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const t = db.transaction(GUIDES, "readwrite");
    const store = t.objectStore(GUIDES);
    for (const g of guides) store.put(g);
    t.oncomplete = () => resolve();
    t.onerror = () => reject(t.error);
  });
}

export async function idbGetMeta<T>(key: string): Promise<T | undefined> {
  const row = await tx<{ key: string; value: T } | undefined>(META, "readonly", (s) => s.get(key));
  return row?.value;
}

export async function idbSetMeta<T>(key: string, value: T): Promise<void> {
  await tx(META, "readwrite", (s) => s.put({ key, value }));
}

export async function idbGetList(): Promise<GuideLight[] | undefined> {
  return idbGetMeta<GuideLight[]>("list");
}

// Vide tout le cache local des guides (détails + méta/liste/lastSync). Échec silencieux.
export async function idbClearAll(): Promise<void> {
  try {
    await tx(GUIDES, "readwrite", (s) => s.clear());
    await tx(META, "readwrite", (s) => s.clear());
  } catch {
    /* IDB indisponible — rien à purger */
  }
}
