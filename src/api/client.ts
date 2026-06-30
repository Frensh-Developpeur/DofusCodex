// Thin fetch helpers shared by both API modules.
import { getCachedJson, putCachedJson } from "../lib/apiCache";

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  try {
    const res = await fetch(url, { signal, headers: { Accept: "application/json" } });
    if (!res.ok) {
      if (res.status >= 500) {
        const cached = await getCachedJson<T>(url);
        if (cached !== undefined) return cached;
      }
      throw new ApiError(`Requête échouée (${res.status})`, res.status);
    }
    const data = (await res.json()) as T;
    void putCachedJson(url, data);
    return data;
  } catch (error) {
    if (signal?.aborted) throw error;
    if (error instanceof ApiError) throw error;
    const cached = await getCachedJson<T>(url);
    if (cached !== undefined) return cached;
    throw error;
  }
}

export function qs(params: Record<string, string | number | undefined | null>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") sp.append(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}
