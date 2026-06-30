const DB_NAME = "dofuscodex";
const DB_VERSION = 2;
const GUIDES = "guides";
const META = "meta";
const API_JSON = "apiJson";
const OPEN_TIMEOUT_MS = 3000;

interface ApiCacheRow<T = unknown> {
  url: string;
  storedAt: number;
  data: T;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function ensureStores(db: IDBDatabase) {
  if (!db.objectStoreNames.contains(GUIDES)) db.createObjectStore(GUIDES, { keyPath: "id" });
  if (!db.objectStoreNames.contains(META)) db.createObjectStore(META, { keyPath: "key" });
  if (!db.objectStoreNames.contains(API_JSON)) db.createObjectStore(API_JSON, { keyPath: "url" });
}

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === "undefined" || !indexedDB) {
      reject(new Error("IndexedDB indisponible"));
      return;
    }
    const timer = window.setTimeout(() => reject(new Error("IndexedDB timeout")), OPEN_TIMEOUT_MS);
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => ensureStores(req.result);
    req.onsuccess = () => {
      window.clearTimeout(timer);
      resolve(req.result);
    };
    req.onerror = () => {
      window.clearTimeout(timer);
      reject(req.error);
    };
    req.onblocked = () => {
      window.clearTimeout(timer);
      reject(new Error("IndexedDB bloqué"));
    };
  });
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

export async function getCachedJson<T>(url: string): Promise<T | undefined> {
  try {
    const row = await tx<ApiCacheRow<T> | undefined>(API_JSON, "readonly", (s) => s.get(url));
    return row?.data;
  } catch {
    return undefined;
  }
}

export async function putCachedJson<T>(url: string, data: T): Promise<void> {
  try {
    await tx(API_JSON, "readwrite", (s) => s.put({ url, storedAt: Date.now(), data }));
  } catch {
    /* Cache best-effort : le réseau reste la source principale. */
  }
}

export async function clearApiCache(): Promise<void> {
  try {
    await tx(API_JSON, "readwrite", (s) => s.clear());
  } catch {
    /* IndexedDB indisponible — rien à purger. */
  }
}
