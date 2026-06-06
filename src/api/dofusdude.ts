// DofusDude API (https://docs.dofusdu.de) — Dofus 3, langue FR.
// Items, équipements, sets, consommables, almanax.
import { getJson, qs } from "./client";

const BASE = "https://api.dofusdu.de/dofus3/v1/fr";

export interface ImageUrls {
  icon: string;
  sd?: string;
  hd?: string;
}

export interface ItemEffect {
  formatted: string;
  int_minimum: number;
  int_maximum: number;
  type: { name: string; id: number; is_meta?: boolean; is_active?: boolean };
}

export interface ItemCondition {
  // DofusDude returns a nested condition tree; we only need the rendered text.
  is_operand?: boolean;
  element?: { name?: string };
}

export interface RecipeEntry {
  item_ankama_id: number;
  item_subtype: string;
  quantity: number;
}

export interface EquipmentLight {
  ankama_id: number;
  name: string;
  level: number;
  type: { name: string; id: number };
  image_urls: ImageUrls;
}

export interface EquipmentDetail extends EquipmentLight {
  description?: string;
  is_weapon: boolean;
  pods?: number;
  effects?: ItemEffect[];
  recipe?: RecipeEntry[];
  conditions?: unknown;
  range?: { min: number; max: number }; // DofusDude renvoie un objet, pas un nombre
  ap_cost?: number;
  max_cast_per_turn?: number;
  critical_hit_probability?: number;
  parent_set?: { id: number; name: string };
}

export interface SetLight {
  ankama_id: number;
  name: string;
  items: number; // count
  level: number;
  contains_cosmetics?: boolean;
  contains_cosmetics_only?: boolean;
}

export interface SetDetail {
  ankama_id: number;
  name: string;
  effects?: Record<string, ItemEffect[] | null>; // effects per number of items equipped
  equipment_ids: number[];
  highest_equipment_level?: number;
}

export interface AlmanaxDay {
  date: string;
  bonus: { description: string; type: { name: string; id: string } };
  reward_kamas: number;
  tribute: {
    item: { ankama_id: number; name: string; image_urls: ImageUrls; subtype: string };
    quantity: number;
  };
}

interface ListResponse<T> {
  items: T[];
  _links?: { next?: string | null };
}

// ---- Equipment ----

export function searchEquipment(query: string, limit = 24, signal?: AbortSignal, skip = 0) {
  // L'endpoint search accepte `skip` → pagination par décalage (limit plafonné à ~50 côté API).
  const url = `${BASE}/items/equipment/search${qs({ query, limit, skip: skip || undefined })}`;
  return getJson<EquipmentLight[]>(url, signal);
}

export interface BrowseParams {
  minLevel?: number;
  maxLevel?: number;
  typeNameId?: string; // e.g. "hat", "cloak", "ring"
  pageSize?: number;
  pageNumber?: number;
  sort?: "asc" | "desc";
}

export async function browseEquipment(p: BrowseParams, signal?: AbortSignal) {
  const params: Record<string, string | number | undefined> = {
    "filter[min_level]": p.minLevel,
    "filter[max_level]": p.maxLevel,
    "filter[type.name_id]": p.typeNameId,
    "page[size]": p.pageSize ?? 24,
    "page[number]": p.pageNumber ?? 1,
    "sort[level]": p.sort ?? "desc",
  };
  const url = `${BASE}/items/equipment${qs(params)}`;
  const data = await getJson<ListResponse<EquipmentLight>>(url, signal);
  return data.items ?? [];
}

// L'API renvoie une erreur 400 « Invalid pagination » quand page[size] dépasse le
// nombre total d'objets correspondant au filtre (types peu peuplés : Dofus, Prysma,
// armes rares, tranches de niveau étroites). On récupère alors tout le lot avec une
// taille de page dégressive sûre, en paginant jusqu'à épuisement.
export async function browseEquipmentAll(
  p: Omit<BrowseParams, "pageSize" | "pageNumber">,
  signal?: AbortSignal,
): Promise<EquipmentLight[]> {
  let size = 40;
  let first: EquipmentLight[] = [];
  while (size >= 1) {
    try {
      first = await browseEquipment({ ...p, pageSize: size, pageNumber: 1 }, signal);
      if (first.length > 0) break;
    } catch {
      /* size > total → réduire */
    }
    size = Math.floor(size / 2);
  }
  const all = [...first];
  let prev = first;
  let page = 2;
  while (prev.length === size && size > 0 && page < 30) {
    let next: EquipmentLight[];
    try {
      next = await browseEquipment({ ...p, pageSize: size, pageNumber: page }, signal);
    } catch {
      break;
    }
    if (!next.length) break;
    all.push(...next);
    prev = next;
    page += 1;
  }
  return all;
}

export function getEquipment(id: number, signal?: AbortSignal) {
  return getJson<EquipmentDetail>(`${BASE}/items/equipment/${id}`, signal);
}

// ---- Sets ----

export async function searchSets(query: string, limit = 12, signal?: AbortSignal) {
  const url = `${BASE}/sets/search${qs({ query, limit })}`;
  return getJson<SetLight[]>(url, signal);
}

// Parcourt les panoplies par page (tri par niveau). La réponse a la clé `sets` (≠ `items`).
export async function browseSets(
  p: { pageSize?: number; pageNumber?: number; sort?: "asc" | "desc" },
  signal?: AbortSignal,
): Promise<SetLight[]> {
  const url = `${BASE}/sets${qs({
    "page[size]": p.pageSize ?? 30,
    "page[number]": p.pageNumber ?? 1,
    "sort[level]": p.sort ?? "desc",
  })}`;
  const data = await getJson<{ sets: SetLight[] }>(url, signal);
  return data.sets ?? [];
}

export function getSet(id: number, signal?: AbortSignal) {
  return getJson<SetDetail>(`${BASE}/sets/${id}`, signal);
}

// ---- Almanax ----

// The almanax endpoint returns a 7-day window starting at `date` (index 0 = that day).
export function getAlmanax(date: string, signal?: AbortSignal) {
  return getJson<AlmanaxDay[]>(`${BASE}/almanax${qs({ date })}`, signal);
}

// Single day for ANY date (past or future) — the list endpoint ignores its `date`
// param and always starts at the server's "today", so day navigation must go here.
export function getAlmanaxDay(date: string, signal?: AbortSignal) {
  return getJson<AlmanaxDay>(`${BASE}/almanax/${date}`, signal);
}

// Arbitrary inclusive date range (YYYY-MM-DD). `range[from]`/`range[to]` are honoured
// even when the bare `date` param is not.
export function getAlmanaxRange(from: string, to: string, signal?: AbortSignal) {
  const url = `${BASE}/almanax${qs({ "range[from]": from, "range[to]": to })}`;
  return getJson<AlmanaxDay[]>(url, signal);
}
