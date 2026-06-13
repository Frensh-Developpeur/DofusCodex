// DofusDB API (https://api.dofusdb.fr) — données riches : donjons, monstres, quêtes.
// API Feathers : pagination via $limit/$skip, recherche via slug, multi-ids via id[$in][].
import { getJson, qs } from "./client";

const BASE = "https://api.dofusdb.fr";

type Localized = { fr: string; en?: string } & Record<string, string>;

// Case-insensitive partial match on the french name. Uses the inline (?i) flag
// rather than $options because the monsters service rejects $options (while
// dungeons/quests accept both — (?i) works on all of them).
function searchClause(search?: string): string {
  const term = search?.trim();
  if (!term) return "";
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return `&name.fr[$regex]=${encodeURIComponent("(?i)" + escaped)}`;
}

// Dungeon name filter: always excludes the "Expédition …" variants (which duplicate
// the base dungeons), and optionally requires the search term — in a single regex
// since both constrain name.fr. Lookaheads: forbid "expédition", require the term.
function dungeonNameClause(search?: string): string {
  const term = search?.trim();
  const escaped = term ? term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";
  const pattern = `(?i)^(?!.*expédition)` + (escaped ? `(?=.*${escaped})` : "");
  return `&name.fr[$regex]=${encodeURIComponent(pattern)}`;
}

export interface FeathersList<T> {
  total: number;
  limit: number;
  skip: number;
  data: T[];
}

export interface Dungeon {
  id: number;
  name: Localized;
  slug: Localized;
  optimalPlayerLevel: number;
  monsters: number[];
  mapIds: number[];
  entranceMapId: number;
  subarea: number;
}

export interface MonsterGrade {
  grade: number;
  level: number;
  lifePoints: number;
  actionPoints: number;
  movementPoints: number;
  earthResistance: number;
  fireResistance: number;
  waterResistance: number;
  airResistance: number;
  neutralResistance: number;
  strength?: number;
  intelligence?: number;
  chance?: number;
  agility?: number;
  vitality?: number;
  wisdom?: number;
  gradeXp?: number;
  startingSpellId?: number; // id de NIVEAU de sort du sort « Auto » (passif de départ)
}

export interface MonsterDrop {
  objectId: number;
  percentDropForGrade1: number;
  percentDropForGrade5?: number;
  count: number;
  hasCriteria?: boolean;
}

export interface Monster {
  id: number;
  name: Localized;
  img: string;
  isBoss?: boolean;
  gfxId?: number;
  grades: MonsterGrade[];
  drops?: MonsterDrop[];
  race?: number;
  spells?: number[];
  spellGrades?: string[]; // par sort : "monsterGrade,spellGrade;…" (mappe le niveau du mob au grade du sort)
  look?: string; // look Ankama "{gfx|couleurs|scale}" — la dernière valeur = échelle d'affichage en %
}

export interface ItemLite {
  id: number;
  name: Localized;
  img: string;
  level: number;
}

export interface Quest {
  id: number;
  name: Localized;
  levelMin: number;
  levelMax: number;
  categoryId: number;
  isDungeonQuest: boolean;
  isPartyQuest: boolean;
  repeatType: number;
  stepIds: number[];
  followable: boolean;
}

export interface QuestStep {
  id: number;
  name: Localized;
  description?: Localized;
  questId: number;
  optimalLevel?: number;
}

// ---- Dungeons ----

export interface DungeonQuery {
  search?: string;
  minLevel?: number;
  maxLevel?: number;
  limit?: number;
  skip?: number;
}

export async function listDungeons(q: DungeonQuery, signal?: AbortSignal): Promise<FeathersList<Dungeon>> {
  const params: Record<string, string | number | undefined> = {
    lang: "fr",
    $limit: q.limit ?? 50,
    $skip: q.skip ?? 0,
    // Secondary sort by id makes pagination stable (many dungeons share a level),
    // otherwise the same dungeon can resurface on another page = visible duplicates.
    "$sort[optimalPlayerLevel]": 1,
    "$sort[id]": 1,
    "optimalPlayerLevel[$gte]": q.minLevel,
    "optimalPlayerLevel[$lte]": q.maxLevel,
  };
  let url = `${BASE}/dungeons${qs(params)}`;
  url += dungeonNameClause(q.search);
  return getJson<FeathersList<Dungeon>>(url, signal);
}

export async function getDungeon(id: number, signal?: AbortSignal): Promise<Dungeon | null> {
  const data = await getJson<FeathersList<Dungeon>>(`${BASE}/dungeons${qs({ id, lang: "fr" })}`, signal);
  return data.data[0] ?? null;
}

// Image d'une map (rendu DofusDB) — sert pour la « Map du boss » d'un donjon.
export function dungeonMapImg(mapId: number, scale: "0.25" | "0.5" | "1" = "0.5"): string {
  return `${BASE}/img/maps/${scale}/${mapId}.jpg`;
}

// Aire (région) d'un donjon depuis sa sous-zone : subarea → areaId → nom de l'aire.
// Best-effort : renvoie null si indisponible (ne bloque jamais l'affichage).
export async function getDungeonArea(subareaId: number, signal?: AbortSignal): Promise<string | null> {
  try {
    const s = await getJson<FeathersList<{ areaId?: number }>>(`${BASE}/subareas${qs({ id: subareaId })}`, signal);
    const areaId = s.data[0]?.areaId;
    if (!areaId) return null;
    const a = await getJson<FeathersList<{ name?: Localized }>>(`${BASE}/areas${qs({ id: areaId, lang: "fr" })}`, signal);
    return a.data[0]?.name?.fr ?? null;
  } catch {
    return null;
  }
}

// ---- Monsters ----

export async function getMonstersByIds(ids: number[], signal?: AbortSignal): Promise<Monster[]> {
  if (!ids.length) return [];
  const idParams = ids.map((i) => `id[$in][]=${i}`).join("&");
  const url = `${BASE}/monsters?lang=fr&$limit=${ids.length}&${idParams}`;
  const data = await getJson<FeathersList<Monster>>(url, signal);
  // Keep original dungeon order.
  const byId = new Map(data.data.map((m) => [m.id, m]));
  return ids.map((i) => byId.get(i)).filter(Boolean) as Monster[];
}

// ---- Quests ----

export interface QuestQuery {
  search?: string;
  minLevel?: number;
  maxLevel?: number;
  dungeonOnly?: boolean;
  limit?: number;
  skip?: number;
}

export async function listQuests(q: QuestQuery, signal?: AbortSignal): Promise<FeathersList<Quest>> {
  const params: Record<string, string | number | boolean | undefined> = {
    lang: "fr",
    $limit: q.limit ?? 50,
    $skip: q.skip ?? 0,
    // Stable pagination: secondary sort by id avoids the same quest reappearing across pages.
    "$sort[levelMin]": 1,
    "$sort[id]": 1,
    "levelMin[$gte]": q.minLevel,
    "levelMin[$lte]": q.maxLevel,
    isDungeonQuest: q.dungeonOnly ? true : undefined,
  };
  let url = `${BASE}/quests${qs(params as Record<string, string | number | undefined>)}`;
  url += searchClause(q.search);
  return getJson<FeathersList<Quest>>(url, signal);
}

export async function getQuestSteps(ids: number[], signal?: AbortSignal): Promise<QuestStep[]> {
  if (!ids.length) return [];
  const idParams = ids.map((i) => `id[$in][]=${i}`).join("&");
  const url = `${BASE}/quest-steps?lang=fr&$limit=${ids.length}&${idParams}`;
  const data = await getJson<FeathersList<QuestStep>>(url, signal);
  const byId = new Map(data.data.map((s) => [s.id, s]));
  return ids.map((i) => byId.get(i)).filter(Boolean) as QuestStep[];
}

interface QuestObjective {
  need?: { generated?: { dungeons?: number[] } };
}

// Pour les quêtes de donjon : remonte le donjon ciblé par la quête.
// Chemin : quête → stepIds → objectifs (need.generated.dungeons). Renvoie l'id du
// donjon (== notre route /donjons/{id}) ou null. Les guides Ganymède n'encodent les
// donjons que comme « blocs de quête » → c'est ainsi qu'on relie ex. « Donjon en
// Mousse » (quête 896) à Château Ensablé (donjon 19).
export async function resolveQuestDungeon(questId: number, signal?: AbortSignal): Promise<number | null> {
  const q = await getJson<FeathersList<Quest>>(`${BASE}/quests${qs({ id: questId, lang: "fr" })}`, signal);
  const quest = q.data[0];
  if (!quest?.isDungeonQuest || !quest.stepIds?.length) return null;
  const stepParams = quest.stepIds.map((s) => `stepId[$in][]=${s}`).join("&");
  const url = `${BASE}/quest-objectives?$limit=50&${stepParams}`;
  const objs = await getJson<FeathersList<QuestObjective>>(url, signal);
  for (const o of objs.data) {
    const dungeons = o.need?.generated?.dungeons;
    if (dungeons?.length) return dungeons[0];
  }
  return null;
}

// Lightweight monster fetch for list thumbnails (id, name, boss flag, image).
// img is built from gfxId because the virtual `img` field breaks under $select.
export interface MonsterLite {
  id: number;
  name: Localized;
  img: string;
  isBoss: boolean;
}

export async function getMonstersLite(ids: number[], signal?: AbortSignal): Promise<MonsterLite[]> {
  if (!ids.length) return [];
  const slice = ids.slice(0, 50); // DofusDB caps $limit at 50
  const idParams = slice.map((i) => `id[$in][]=${i}`).join("&");
  const url = `${BASE}/monsters?lang=fr&$limit=50&$select[]=id&$select[]=name&$select[]=gfxId&$select[]=isBoss&${idParams}`;
  const data = await getJson<FeathersList<{ id: number; name: Localized; gfxId: number; isBoss?: boolean }>>(
    url,
    signal,
  );
  return data.data.map((m) => ({
    id: m.id,
    name: m.name,
    isBoss: !!m.isBoss,
    img: `${BASE}/img/monsters/${m.gfxId}.png`,
  }));
}

// Boss heuristic: DofusDB lists the main boss last in the dungeon's monster order
// (preserved by getMonstersByIds). Some dungeons flag several monsters as isBoss
// (e.g. Donjon du Comte Harebourg lists every Frigost boss) → take the LAST flagged
// one, not the first. Fallback: the last declared monster.
export function pickBoss(monsters: Monster[]): Monster | null {
  if (!monsters.length) return null;
  for (let i = monsters.length - 1; i >= 0; i--) {
    if (monsters[i].isBoss) return monsters[i];
  }
  return monsters[monsters.length - 1] ?? null;
}

// ---- Monsters (encyclopédie) ----

export interface MonsterQuery {
  search?: string;
  bossOnly?: boolean;
  limit?: number;
  skip?: number;
}

export async function listMonsters(q: MonsterQuery, signal?: AbortSignal): Promise<FeathersList<Monster>> {
  const params: Record<string, string | number | boolean | undefined> = {
    lang: "fr",
    $limit: q.limit ?? 48,
    $skip: q.skip ?? 0,
    $sort: "id",
    isBoss: q.bossOnly ? true : undefined,
  };
  let url = `${BASE}/monsters${qs(params as Record<string, string | number | undefined>)}`;
  url += searchClause(q.search);
  return getJson<FeathersList<Monster>>(url, signal);
}

export async function getMonster(id: number, signal?: AbortSignal): Promise<Monster | null> {
  const data = await getJson<FeathersList<Monster>>(`${BASE}/monsters${qs({ id, lang: "fr" })}`, signal);
  return data.data[0] ?? null;
}

export interface MonsterResolveHint {
  typeId?: number;
  levelMin?: number;
  levelMax?: number;
}

type MonsterResolveCandidate = Pick<Monster, "id" | "name" | "isBoss" | "grades">;

const MONSTER_RESOLVE_SELECT =
  "&$select[]=id&$select[]=name&$select[]=isBoss&$select[]=grades";

function comparableName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr-FR")
    .replace(/\s+/g, " ")
    .trim();
}

function levelRange(grades?: MonsterGrade[]): { min: number; max: number } | null {
  const levels = (grades ?? []).map((g) => g.level).filter((level) => level > 0);
  if (levels.length === 0) return null;
  return { min: Math.min(...levels), max: Math.max(...levels) };
}

function resolveScore(candidate: MonsterResolveCandidate, wantedName: string, hint: MonsterResolveHint): number {
  const wanted = comparableName(wantedName);
  const actual = comparableName(candidate.name.fr ?? "");
  let score = actual === wanted ? 1000 : actual.includes(wanted) ? 400 : 0;

  if (hint.typeId === 2) score += candidate.isBoss ? 90 : -90;
  if (hint.typeId === 1 || hint.typeId === 3) score += candidate.isBoss ? -30 : 15;

  const wantedMin = hint.levelMin ?? hint.levelMax;
  const wantedMax = hint.levelMax ?? hint.levelMin;
  const range = levelRange(candidate.grades);
  if (range && wantedMin != null && wantedMax != null) {
    if (range.min === wantedMin && range.max === wantedMax) {
      score += 160;
    } else {
      const overlaps = range.min <= wantedMax && range.max >= wantedMin;
      if (overlaps) score += 70;
      score -= Math.min(80, Math.abs(range.min - wantedMin) + Math.abs(range.max - wantedMax));
    }
  }

  return score;
}

export async function resolveMonsterIdByName(
  name: string,
  hint: MonsterResolveHint = {},
  signal?: AbortSignal,
): Promise<number | null> {
  const term = name.trim();
  if (!term) return null;

  const exactUrl = `${BASE}/monsters${qs({
    lang: "fr",
    $limit: 20,
    "$sort[id]": 1,
    "name.fr": term,
  })}${MONSTER_RESOLVE_SELECT}`;
  const exact = await getJson<FeathersList<MonsterResolveCandidate>>(exactUrl, signal);
  let candidates = exact.data;

  if (candidates.length === 0) {
    const searchUrl = `${BASE}/monsters${qs({
      lang: "fr",
      $limit: 20,
      "$sort[id]": 1,
    })}${searchClause(term)}${MONSTER_RESOLVE_SELECT}`;
    const fuzzy = await getJson<FeathersList<MonsterResolveCandidate>>(searchUrl, signal);
    candidates = fuzzy.data;
  }

  if (candidates.length === 0) return null;
  return [...candidates].sort((a, b) => resolveScore(b, term, hint) - resolveScore(a, term, hint) || a.id - b.id)[0].id;
}

// Cherche un monstre par son nom (1er résultat, le plus petit id). Léger (id/nom/img/boss).
// Sert aux avis de recherche : le criminel est un monstre DofusDB → portrait + lien /monstres/:id.
export async function findMonsterByName(name: string, signal?: AbortSignal): Promise<MonsterLite | null> {
  const term = name.trim();
  if (!term) return null;
  const url =
    `${BASE}/monsters?lang=fr&$limit=1&$sort[id]=1` +
    `&$select[]=id&$select[]=name&$select[]=gfxId&$select[]=isBoss${searchClause(term)}`;
  const data = await getJson<FeathersList<{ id: number; name: Localized; gfxId: number; isBoss?: boolean }>>(
    url,
    signal,
  );
  const m = data.data[0];
  if (!m) return null;
  return { id: m.id, name: m.name, isBoss: !!m.isBoss, img: `${BASE}/img/monsters/${m.gfxId}.png` };
}

// Monstres de la même famille (race). Léger (id/nom/img), plafonné à 50 (limite DofusDB).
export async function getMonstersByRace(raceId: number, signal?: AbortSignal): Promise<MonsterLite[]> {
  if (raceId == null) return [];
  const url = `${BASE}/monsters?lang=fr&$limit=50&race=${raceId}&$sort[id]=1&$select[]=id&$select[]=name&$select[]=gfxId&$select[]=isBoss`;
  const data = await getJson<FeathersList<{ id: number; name: Localized; gfxId: number; isBoss?: boolean }>>(
    url,
    signal,
  );
  return data.data.map((m) => ({
    id: m.id,
    name: m.name,
    isBoss: !!m.isBoss,
    img: `${BASE}/img/monsters/${m.gfxId}.png`,
  }));
}

// Nom de la famille/race du monstre (ex. « Invocations de monstre »). Optionnel.
export async function getMonsterRaceName(raceId: number, signal?: AbortSignal): Promise<string | null> {
  if (raceId == null) return null;
  const data = await getJson<FeathersList<{ id: number; name: Localized }>>(
    `${BASE}/monster-races${qs({ id: raceId, lang: "fr" })}`,
    signal,
  );
  return data.data[0]?.name?.fr ?? null;
}

// Reverse drop: which monsters drop a given item (by Ankama object id).
export async function monstersDroppingItem(
  objectId: number,
  limit = 24,
  signal?: AbortSignal,
): Promise<Monster[]> {
  // NB: le champ `img` virtuel casse sous $select (→ undefined.png) → on prend gfxId
  // et on construit l'URL nous-mêmes, comme dans getMonstersLite.
  const url = `${BASE}/monsters?lang=fr&$limit=${limit}&$sort=id&drops.objectId=${objectId}&$select[]=name&$select[]=id&$select[]=gfxId&$select[]=grades&$select[]=isBoss`;
  const data = await getJson<FeathersList<Monster>>(url, signal);
  return data.data.map((m) => ({ ...m, img: `${BASE}/img/monsters/${m.gfxId}.png` }));
}

// Which dungeons contain a given monster.
export async function dungeonsWithMonster(monsterId: number, signal?: AbortSignal): Promise<Dungeon[]> {
  const url = `${BASE}/dungeons?lang=fr&$limit=12&$sort=optimalPlayerLevel&monsters=${monsterId}`;
  const data = await getJson<FeathersList<Dungeon>>(url, signal);
  return data.data;
}

// ---- Items (light, for drop tables) ----

export async function getItemsByIds(ids: number[], signal?: AbortSignal): Promise<ItemLite[]> {
  if (!ids.length) return [];
  // NB: `img` is a virtual field derived from iconId; with $select it would resolve to
  // ".../undefined.png", so we select iconId and build the URL ourselves.
  // DofusDB plafonne $limit à 50 → on pagine par lots de 50 (sinon les ids au-delà du
  // 50ᵉ ne sont jamais renvoyés et s'affichent en « #id » sans nom ni image).
  const out: ItemLite[] = [];
  for (let i = 0; i < ids.length; i += 50) {
    const chunk = ids.slice(i, i + 50);
    const idParams = chunk.map((id) => `id[$in][]=${id}`).join("&");
    const url = `${BASE}/items?lang=fr&$limit=50&$select[]=id&$select[]=name&$select[]=iconId&$select[]=level&${idParams}`;
    const data = await getJson<FeathersList<{ id: number; name: Localized; iconId: number; level: number }>>(
      url,
      signal,
    );
    for (const it of data.data) {
      out.push({ id: it.id, name: it.name, level: it.level, img: `${BASE}/img/items/${it.iconId}.png` });
    }
  }
  return out;
}

// ---- Havre-sacs (thèmes) ----
export interface HavenbagTheme {
  id: number;
  name: Localized;
  mapId: number;
  img: string; // aperçu = rendu de la map (`/img/maps/0.25/{mapId}.jpg`), comme sur DofusDB
}

// Rendu de la map d'un havre-sac à l'échelle voulue (0.25 vignette, 0.5/1 en grand).
export function havenbagMapImg(mapId: number, scale: "0.25" | "0.5" | "1" = "0.5"): string {
  return `${BASE}/img/maps/${scale}/${mapId}.jpg`;
}

export async function listHavenbagThemes(signal?: AbortSignal): Promise<HavenbagTheme[]> {
  // ~48 thèmes → un seul appel ($limit plafonné à 50 suffit).
  const url = `${BASE}/havenbag-themes?lang=fr&$limit=50&$sort[id]=1&$select[]=id&$select[]=name&$select[]=mapId`;
  const data = await getJson<FeathersList<{ id: number; name: Localized; mapId: number }>>(url, signal);
  return data.data.map((t) => ({ id: t.id, name: t.name, mapId: t.mapId, img: havenbagMapImg(t.mapId, "0.25") }));
}

// Éléments de décor d'un thème (sol, meubles, ornements). Pas de nom, juste des sprites
// (`/img/elements/{gfxId}.png`). On dédoublonne par gfxId et on pagine ($limit plafonné à 50).
export async function getHavenbagFurnitures(themeId: number, signal?: AbortSignal): Promise<{ gfxId: number; img: string }[]> {
  const seen = new Set<number>();
  for (let skip = 0; skip < 300; skip += 50) {
    const url = `${BASE}/havenbag-furnitures?themeId=${themeId}&$limit=50&$skip=${skip}&$sort[order]=1&$sort[id]=1&$select[]=gfxId`;
    const data = await getJson<FeathersList<{ gfxId: number }>>(url, signal);
    const rows = data.data ?? [];
    for (const r of rows) if (r.gfxId) seen.add(r.gfxId);
    if (rows.length < 50 || skip + 50 >= (data.total ?? 0)) break;
  }
  return [...seen].map((g) => ({ gfxId: g, img: `${BASE}/img/elements/${g}.png` }));
}

// ---- Items par catégorie (ressources, consommables…) ----
// Un item a un `typeId` ; chaque type a un `superTypeId` (9 = ressource, 6 = consommable,
// 12 = familier, 14 = divers…). On filtre donc les items par la liste des typeIds du superType.
export interface ItemType {
  id: number;
  superTypeId: number;
  name: Localized;
}

export async function listItemTypes(signal?: AbortSignal): Promise<ItemType[]> {
  const url = `${BASE}/item-types?lang=fr&$limit=300&$select[]=id&$select[]=superTypeId&$select[]=name`;
  const data = await getJson<FeathersList<ItemType>>(url, signal);
  return data.data ?? [];
}

export interface BrowseItemsParams {
  typeIds: number[];
  search?: string;
  skip?: number;
  limit?: number;
}

export async function browseItems(p: BrowseItemsParams, signal?: AbortSignal): Promise<ItemLite[]> {
  if (!p.typeIds.length) return [];
  const limit = Math.min(p.limit ?? 48, 50); // $limit plafonné à 50
  const parts = [
    "lang=fr",
    `$limit=${limit}`,
    `$skip=${p.skip ?? 0}`,
    "$sort[level]=-1",
    "$sort[id]=1",
    "$select[]=id",
    "$select[]=name",
    "$select[]=level",
    "$select[]=iconId",
    ...p.typeIds.map((id) => `typeId[$in][]=${id}`),
  ];
  const term = p.search?.trim();
  if (term && term.length >= 2) parts.push(`name.fr[$regex]=(?i)${encodeURIComponent(term)}`);
  const url = `${BASE}/items?${parts.join("&")}`;
  const data = await getJson<FeathersList<{ id: number; name: Localized; level: number; iconId: number }>>(url, signal);
  return data.data.map((it) => ({
    id: it.id,
    name: it.name,
    level: it.level,
    img: `${BASE}/img/items/${it.iconId}.png`,
  }));
}

// Recherche libre d'objets par nom (sert au sélecteur de ressource de la carte).
export async function searchItems(term: string, limit = 24, signal?: AbortSignal): Promise<ItemLite[]> {
  const t = term.trim();
  if (t.length < 2) return [];
  const url =
    `${BASE}/items?lang=fr&$limit=${Math.min(limit, 50)}&$sort[level]=-1&$sort[id]=1` +
    `&$select[]=id&$select[]=name&$select[]=level&$select[]=iconId&name.fr[$regex]=(?i)${encodeURIComponent(t)}`;
  const data = await getJson<FeathersList<{ id: number; name: Localized; level: number; iconId: number }>>(url, signal);
  return data.data.map((it) => ({ id: it.id, name: it.name, level: it.level, img: `${BASE}/img/items/${it.iconId}.png` }));
}

// Item générique (DofusDB connaît tout : ressources, suiveurs, consommables, objets
// de quête… contrairement à l'endpoint « equipment » de DofusDude qui renvoie 404).
// Sert de repli quand un <item> d'un guide n'est pas un équipement.
export interface DbItemEffect {
  description?: Localized;
}
export interface DbItem {
  id: number;
  name: Localized;
  level: number;
  img: string;
  description?: Localized;
  type?: { name?: Localized };
  effects?: DbItemEffect[];
}

export async function getDbItem(id: number, signal?: AbortSignal): Promise<DbItem | null> {
  const data = await getJson<FeathersList<DbItem>>(`${BASE}/items${qs({ id, lang: "fr" })}`, signal);
  const it = data.data[0];
  if (!it) return null;
  // `img` virtuel : présent sur l'objet complet (sans $select), on le garde tel quel.
  return it;
}

// ---- Treasure hunt (chasse au trésor) ----

// 0 = droite (Est), 2 = bas (Sud), 4 = gauche (Ouest), 6 = haut (Nord).
export type HuntDirection = 0 | 2 | 4 | 6;

export interface HuntPoi {
  id: number;
  name: Localized;
}

export interface HuntMap {
  id: number;
  posX: number;
  posY: number;
  pois: HuntPoi[];
  distance: number; // nb de maps depuis le départ, sur l'axe de la direction
}

export async function treasureHunt(
  x: number,
  y: number,
  direction: HuntDirection,
  signal?: AbortSignal,
): Promise<HuntMap[]> {
  const url = `${BASE}/treasure-hunt?lang=fr&x=${x}&y=${y}&direction=${direction}`;
  const data = await getJson<FeathersList<Omit<HuntMap, "distance">>>(url, signal);
  const horizontal = direction === 0 || direction === 4;
  return (data.data ?? [])
    .map((m) => ({ ...m, distance: horizontal ? Math.abs(m.posX - x) : Math.abs(m.posY - y) }))
    .filter((m) => m.distance > 0)
    .sort((a, b) => a.distance - b.distance);
}

// Image de la map du jeu pour un mapId donné (échelles disponibles : 1 / 0.75 / 0.5 / 0.25).
// L'id renvoyé par treasureHunt EST un mapId → image directe, pas d'appel supplémentaire.
export type HuntMapScale = "1" | "0.75" | "0.5" | "0.25";
export function huntMapImage(mapId: number, scale: HuntMapScale = "0.5"): string {
  return `${BASE}/img/maps/${scale}/${mapId}.jpg`;
}

// mapId de la worldmap principale pour des coordonnées données (position de départ).
// Plusieurs maps partagent les mêmes coords (intérieurs/sous-zones) → on garde celle
// qui a la priorité sur la worldmap, sinon la première de la worldmap 1.
export async function huntStartMapId(x: number, y: number, signal?: AbortSignal): Promise<number | null> {
  const url =
    `${BASE}/map-positions/?posX=${x}&posY=${y}&worldMap=1&$limit=20` +
    `&$select[]=id&$select[]=hasPriorityOnWorldmap`;
  const data = await getJson<FeathersList<{ id: number; hasPriorityOnWorldmap?: boolean }>>(url, signal);
  const rows = data.data ?? [];
  if (rows.length === 0) return null;
  return (rows.find((m) => m.hasPriorityOnWorldmap) ?? rows[0]).id;
}

// ---- Classes (breeds) & sorts ----

// Paliers de coût des caractéristiques : [[seuil, coût], …]. Ex Iop Force :
// [[0,1],[100,2],[200,3],[300,4]] → 1 pt = 1 carac jusqu'à 100, puis 2 pts/carac, etc.
export type StatTier = [number, number];

export interface Breed {
  id: number;
  name: Localized;
  img: string;
  imgTransparent?: string;
  complexity: number;
  description?: Localized;
  gameplayDescription?: Localized;
  statsPointsForStrength: StatTier[];
  statsPointsForIntelligence: StatTier[];
  statsPointsForChance: StatTier[];
  statsPointsForAgility: StatTier[];
  statsPointsForVitality: StatTier[];
  statsPointsForWisdom: StatTier[];
}

export async function listBreeds(signal?: AbortSignal): Promise<Breed[]> {
  // Le nom de la classe est dans `shortName` (les breeds n'ont pas de champ `name`).
  const url = `${BASE}/breeds?$limit=20&$sort=id`;
  const data = await getJson<FeathersList<Breed & { shortName?: Localized }>>(url, signal);
  return data.data
    .filter((b) => b.id > 0 && b.shortName?.fr)
    .map((b) => ({ ...b, name: b.shortName as Localized }));
}

// effectElement : 0 Neutre, 1 Terre, 2 Feu, 3 Eau, 4 Air, 5 meilleur élément.
export interface SpellDamage {
  element: number;
  steal: boolean; // vol de vie
  min: number;
  max: number;
  delayed: boolean; // effet différé/déclenché (glyphe, bombe, état type Téléfrag), pas le coup direct
  delay: number; // nombre de tours avant déclenchement (0 = immédiat) → libellé « Dans N tour »
  condition: string; // état requis (depuis targetMask, ex "E244") → effets conditionnels = lignes séparées (pas sommées)
  conditionLabel: string; // nom lisible de l'état (résolu via spell-states, ex "Téléfrag", "Saoul") — "" si aucun
  trigger?: string; // déclencheur lisible (ex. « déclenché lorsque … ») — "" si immédiat
}

export interface SpellLevel {
  grade: number;
  minPlayerLevel: number;
  apCost: number;
  minRange: number;
  range: number;
  critProbability: number; // 0 = le sort ne peut pas faire de critique
  damage: SpellDamage[];
  criticalDamage: SpellDamage[];
  chargeScaled: boolean; // dégâts qui montent par charge/état (effet 293) → fourchettes affichées « par charge »
  castInLine?: boolean; // ne se lance qu'en ligne droite (pour la map de portée)
  castInDiagonal?: boolean; // ne se lance qu'en diagonale
  losRequired?: boolean; // nécessite une ligne de vue (castTestLos)
  zoneShape?: number; // id de forme DofusDB (effet à plus grande aire), 0/80 = mono-case
  zoneSize?: number; // taille de la zone (param1)
  utility?: string[]; // effets non-dégâts rendus en texte (téléporte, repousse, -PA, états…)
  criticalUtility?: string[]; // idem pour les effets critiques
}

export interface ClassSpell {
  id: number;
  name: Localized;
  description: Localized;
  img: string;
  levels: SpellLevel[];
  variantId: number; // identifiant de la variante (regroupe sort de base + variante)
  variantIndex: number; // 0 = sort de base, 1 = variante
  auto?: boolean; // sort « Auto » (passif de départ d'un monstre)
}

const DMG_EFFECTS = new Set([96, 97, 98, 99, 100]); // dégâts directs
const STEAL_EFFECTS = new Set([90, 91, 92, 93, 94, 95]); // vol de vie
// Effets qui posent/retirent un état : leur template est « État #3 » / « Enlève l'état #3 »
// / « Désactive l'état #3 », où #3 (= value) est un id d'état à résoudre en nom (/spell-states).
const STATE_EFFECTS = new Set([950, 951, 952]);
const hasLetters = (s: string) => /[a-zA-ZÀ-ÿ]/.test(s);

// Codes de déclencheur DofusDB → texte. Sûrs (confirmés) : APA/MPA. Le reste → générique.
const TRIGGER_TEXT: Record<string, string> = {
  APA: "la cible subit une tentative de retrait PA",
  MPA: "la cible subit une tentative de retrait PM",
};
function triggerNote(triggers: unknown): string {
  const raw = String(triggers ?? "");
  if (!raw || raw === "I") return ""; // I = immédiat (aucun déclencheur)
  const known = raw.split("|").map((t) => TRIGGER_TEXT[t]).filter(Boolean);
  if (known.length) return `déclenché lorsque ${known.join(" ou ")}`;
  return "effet déclenché sous condition";
}
// Un effet « lance un sort » a un template sans aucune lettre (juste « #1 » ou vide) :
// l'id du sort à lancer est alors dans diceNum (ou value).

function decodeSpellDamage(effects: unknown): SpellDamage[] {
  const out: SpellDamage[] = [];
  if (!Array.isArray(effects)) return out;
  for (const e of effects) {
    if (!e || typeof e !== "object") continue;
    const eff = e as Record<string, number>;
    const isDmg = DMG_EFFECTS.has(eff.effectId);
    const isSteal = STEAL_EFFECTS.has(eff.effectId);
    if (!isDmg && !isSteal) continue;
    const min = eff.diceNum ?? 0;
    const max = eff.diceSide && eff.diceSide > min ? eff.diceSide : min;
    if (min <= 0 && max <= 0) continue;
    const element = typeof eff.effectElement === "number" && eff.effectElement >= 0 ? eff.effectElement : 0;
    const delay = eff.delay ?? 0;
    // Condition = états requis dans le targetMask (tokens contenant un chiffre, ex "*E244"),
    // pour ne pas sommer des effets mutuellement exclusifs (mêmes dégâts sous conditions différentes).
    const mask = String((e as Record<string, unknown>).targetMask ?? "");
    const condition = mask
      .split(",")
      .filter((tok) => /\d/.test(tok))
      .map((tok) => tok.replace(/^[*!]+/, ""))
      .join("+");
    out.push({
      element,
      steal: isSteal,
      min,
      max,
      delayed: delay > 0,
      delay,
      condition,
      conditionLabel: "",
      trigger: triggerNote((e as Record<string, unknown>).triggers),
    });
  }
  return out;
}

// Rend un effet utilitaire (non-dégât) depuis son template Ankama.
//  #1 = diceNum (min) · #2 = diceSide (max) · #3 = value
//  {{~1 … }} = bloc affiché s'il y a une plage (min≠max) · {{~ps}} = pluriel sur #1
function renderEffectTemplate(
  tpl: string,
  e: Record<string, any>,
  refNames: Map<number, string>,
  stateNames: Map<number, string>,
): string {
  const a = e.diceNum ?? 0;
  const b = e.diceSide ?? 0;
  const c = e.value ?? 0;
  const hasRange = b > 0 && b !== a;
  // Un grand nombre (≥1000) est en général un id de sort/monstre → on le remplace par son nom.
  const sub = (n: number) => (n >= 1000 ? refNames.get(n) : undefined) ?? String(n);
  // Effets d'état (« État #3 »…) : #3 est un id d'état → on le remplace par son nom résolu.
  const isState = STATE_EFFECTS.has(e.effectId);
  let s = tpl;
  s = s.replace(/\{\{~1([^{}]*)\}\}/g, (_m, inner) => (hasRange ? String(inner).replace(/~\d+/g, "") : ""));
  s = s.replace(/\{\{~ps\}\}/g, a > 1 ? "s" : "");
  s = s.replace(/\{\{[^{}]*\}\}/g, ""); // autres marqueurs (pluriels divers, refs) → retirés
  s = s.replace(/<[^>]*>/g, ""); // balises (ex. <sprite name="erosion">) → retirées
  s = s.replace(/#1/g, sub(a));
  s = s.replace(/#2/g, hasRange ? sub(b) : "");
  s = s.replace(/#3/g, isState ? (stateNames.get(c) ?? `état ${c}`) : sub(c));
  s = s.replace(/\s+([%):.,])/g, "$1"); // espaces avant ponctuation
  s = s.replace(/\s+/g, " ").trim();
  return s + effectSuffix(e);
}

// Suffixe contextuel d'un effet : délai (« dans N tours »), durée (N tours / infini), probabilité.
function effectSuffix(e: Record<string, any>): string {
  let s = "";
  const delay = e.delay ?? 0;
  const dur = e.duration ?? 0;
  const rnd = e.random ?? 0;
  if (delay > 0) s += ` (dans ${delay} tour${delay > 1 ? "s" : ""})`;
  if (dur === -1) s += " (infini)";
  else if (dur > 0 && delay <= 0) s += ` (${dur} tour${dur > 1 ? "s" : ""})`;
  if (rnd > 0 && rnd < 100) s += ` · ${rnd}% des cas`;
  return s;
}

// Effets non-dégâts d'un niveau, rendus en texte (téléporte, repousse, états, lance un sort…).
function buildUtility(
  effects: unknown,
  tpl: Map<number, string>,
  refNames: Map<number, string>,
  stateNames: Map<number, string>,
): string[] {
  const out: string[] = [];
  if (!Array.isArray(effects)) return out;
  for (const e of effects) {
    const eff = e as Record<string, any>;
    const id = eff?.effectId as number | undefined;
    if (id == null || DMG_EFFECTS.has(id) || STEAL_EFFECTS.has(id) || id === 293) continue;
    const t = tpl.get(id) ?? "";
    const note = triggerNote(eff.triggers);
    const seg = note ? ` — ${note}` : "";
    if (!hasLetters(t)) {
      // Template sans lettre → référence de sort « lancé ». On résout l'id en nom (sinon on ignore).
      const name = refNames.get(eff.diceNum || eff.value || 0);
      if (name) out.push(`Lance le sort ${name}${effectSuffix(eff)}${seg}`);
      continue;
    }
    const s = renderEffectTemplate(t, eff, refNames, stateNames);
    if (s && hasLetters(s)) out.push(s + seg);
  }
  return out;
}

// Les noms d'états DofusDB sont parfois enrobés d'un markup `{{spell,id,n::Nom}}`
// (réf. au sort qui pose l'état) → on ne garde que le libellé final lisible.
function cleanStateName(raw: string): string {
  return raw.replace(/\{\{[^:}]*::([^}]+)\}\}/g, "$1").trim();
}

// Ids d'états numériques contenus dans une condition (ex "E244+f5907" → [244, 5907]).
function stateIdsOf(condition: string): number[] {
  if (!condition) return [];
  return condition
    .split("+")
    .map((tok) => Number(tok.replace(/\D/g, "")))
    .filter((n) => n > 0);
}

// Libellé lisible d'une condition à partir des noms d'états résolus.
function labelForCondition(condition: string, names: Map<number, string>): string {
  const ids = stateIdsOf(condition);
  if (!ids.length) return "";
  return ids.map((id) => names.get(id) ?? `État ${id}`).join(" + ");
}

// Résout des ids d'états → noms lisibles (via /spell-states, paginé par 50). Best-effort :
// renvoie une map vide en cas d'échec (on retombera sur un libellé « état N »).
async function resolveStateNames(ids: Set<number>, signal?: AbortSignal): Promise<Map<number, string>> {
  const names = new Map<number, string>();
  const arr = [...ids].filter((n) => n > 0);
  for (let i = 0; i < arr.length; i += 50) {
    const chunk = arr.slice(i, i + 50);
    const idParams = chunk.map((id) => `id[$in][]=${id}`).join("&");
    try {
      const data = await getJson<FeathersList<{ id: number; name?: Localized }>>(
        `${BASE}/spell-states?lang=fr&$limit=50&${idParams}`,
        signal,
      );
      for (const st of data.data ?? []) if (st.name?.fr) names.set(st.id, cleanStateName(st.name.fr));
    } catch {
      // pas de noms d'états → libellé générique
    }
  }
  return names;
}

// Récupère TOUS les sorts d'une classe via les spell-variants : chaque variante
// embarque le sort de base + sa variante. On complète ensuite avec les spell-levels
// (effets de dégâts par grade), récupérés par paquets de 50 ids.
export async function getClassSpells(breedId: number, signal?: AbortSignal): Promise<ClassSpell[]> {
  // 1. Variantes (chacune contient ses sorts complets : nom, image, niveaux).
  const variants: Record<string, any>[] = [];
  for (let skip = 0; ; skip += 50) {
    const url = `${BASE}/spell-variants?breedId=${breedId}&$limit=50&$skip=${skip}&$sort[id]=1`;
    const page = await getJson<FeathersList<Record<string, any>>>(url, signal);
    variants.push(...(page.data ?? []));
    if (!page.data?.length || skip + 50 >= page.total) break;
  }

  // 2. Aplatir les sorts et collecter tous les ids de niveaux.
  interface RawSpell {
    id: number;
    name: Localized;
    description: Localized;
    img: string;
    levelIds: number[];
    variantId: number;
    variantIndex: number;
  }
  const raw: RawSpell[] = [];
  const levelIds = new Set<number>();
  for (const v of variants) {
    const list: any[] = Array.isArray(v.spells) ? v.spells : [];
    list.forEach((s, idx) => {
      if (!s?.name?.fr) return;
      const ids: number[] = Array.isArray(s.spellLevels) ? s.spellLevels : [];
      raw.push({
        id: s.id,
        name: s.name,
        description: s.description ?? { fr: "" },
        img: s.img,
        levelIds: ids,
        variantId: v.id,
        variantIndex: idx,
      });
      ids.forEach((id) => levelIds.add(id));
    });
  }
  if (!raw.length) return [];

  // 3. Récupérer les niveaux (effets) par paquets de 50 ids.
  const levelById = new Map<number, Record<string, any>>();
  const ids = [...levelIds];
  for (let i = 0; i < ids.length; i += 50) {
    const chunk = ids.slice(i, i + 50);
    const idParams = chunk.map((id) => `id[$in][]=${id}`).join("&");
    const data = await getJson<FeathersList<Record<string, any>>>(
      `${BASE}/spell-levels?$limit=50&${idParams}`,
      signal,
    );
    for (const l of data.data ?? []) levelById.set(l.id, l);
  }

  // 4. Construire les sorts.
  const spells: ClassSpell[] = raw.map((sr) => {
    const levels: SpellLevel[] = sr.levelIds
      .map((id) => levelById.get(id))
      .filter((l): l is Record<string, any> => !!l)
      .map((l) => ({
        grade: l.grade ?? 1,
        minPlayerLevel: l.minPlayerLevel ?? 1,
        apCost: l.apCost ?? 0,
        minRange: l.minRange ?? 0,
        range: l.range ?? 0,
        critProbability: l.criticalHitProbability ?? 0,
        damage: decodeSpellDamage(l.effects),
        criticalDamage: decodeSpellDamage(l.criticalEffect),
        // Effet 293 = « +dégâts par charge/état » → les fourchettes de dégâts sont par charge.
        chargeScaled: Array.isArray(l.effects) && l.effects.some((e: Record<string, number>) => e?.effectId === 293),
      }))
      .sort((a, b) => a.grade - b.grade);
    return {
      id: sr.id,
      name: sr.name,
      description: sr.description,
      img: sr.img,
      levels,
      variantId: sr.variantId,
      variantIndex: sr.variantIndex,
    };
  });

  // 5. Résoudre les noms d'états référencés dans les conditions (pour des libellés
  //    lisibles : « Téléfrag », « Saoul », « Feuillu »… au lieu de « sous condition »).
  const stateIds = new Set<number>();
  for (const sp of spells)
    for (const lv of sp.levels)
      for (const d of [...lv.damage, ...lv.criticalDamage]) stateIdsOf(d.condition).forEach((id) => stateIds.add(id));
  if (stateIds.size) {
    const stateNames = await resolveStateNames(stateIds, signal);
    for (const sp of spells)
      for (const lv of sp.levels)
        for (const d of [...lv.damage, ...lv.criticalDamage]) d.conditionLabel = labelForCondition(d.condition, stateNames);
  }

  // Tri : par variante puis position dans la variante (base avant variante).
  spells.sort((a, b) => a.variantId - b.variantId || a.variantIndex - b.variantIndex);
  return spells;
}

// Sorts d'un monstre par ids (réutilise le décodage de dégâts/effets des sorts de classe).
// Renvoie des ClassSpell (variantId/variantIndex = 0). Inclut castInLine/Diagonal pour la map.
// `startingLevelIds` = ids de NIVEAUX des sorts « Auto » (grade.startingSpellId), résolus vers
// leurs sorts parents et ajoutés en tête (DofusDB les montre en premier, avec le tag Auto).
export async function getMonsterSpells(
  spellIds: number[],
  startingLevelIds: number[] = [],
  signal?: AbortSignal,
): Promise<ClassSpell[]> {
  // Résout les niveaux « Auto » vers leurs sorts parents.
  const autoSpellIds: number[] = [];
  const uniqStart = [...new Set(startingLevelIds.filter(Boolean))];
  for (let i = 0; i < uniqStart.length; i += 50) {
    const chunk = uniqStart.slice(i, i + 50);
    const lp = chunk.map((id) => `id[$in][]=${id}`).join("&");
    const d = await getJson<FeathersList<{ spellId?: number }>>(
      `${BASE}/spell-levels?$limit=50&$select[]=spellId&${lp}`,
      signal,
    );
    for (const l of d.data ?? []) if (l.spellId) autoSpellIds.push(l.spellId);
  }
  const allIds = [...new Set([...autoSpellIds, ...spellIds])];
  if (!allIds.length) return [];
  const idParams = allIds.map((i) => `id[$in][]=${i}`).join("&");
  const sp = await getJson<FeathersList<Record<string, any>>>(
    `${BASE}/spells?lang=fr&$limit=50&${idParams}`,
    signal,
  );
  const byId = new Map<number, Record<string, any>>((sp.data ?? []).map((s) => [s.id, s]));
  const autoSet = new Set(autoSpellIds);
  const ordered = allIds.map((id) => byId.get(id)).filter((s): s is Record<string, any> => !!s);

  const levelIds = [...new Set(ordered.flatMap((s) => (Array.isArray(s.spellLevels) ? s.spellLevels : [])))];
  const levelById = new Map<number, Record<string, any>>();
  for (let i = 0; i < levelIds.length; i += 50) {
    const chunk = levelIds.slice(i, i + 50);
    const lp = chunk.map((id) => `id[$in][]=${id}`).join("&");
    const d = await getJson<FeathersList<Record<string, any>>>(`${BASE}/spell-levels?$limit=50&${lp}`, signal);
    for (const l of d.data ?? []) levelById.set(l.id, l);
  }

  // Templates des effets (pour rendre les effets utilitaires en texte).
  const effectIds = new Set<number>();
  for (const l of levelById.values())
    for (const e of [...(l.effects ?? []), ...(l.criticalEffect ?? [])])
      if (e?.effectId) effectIds.add(e.effectId);
  const tplById = new Map<number, string>();
  const effArr = [...effectIds];
  for (let i = 0; i < effArr.length; i += 50) {
    const chunk = effArr.slice(i, i + 50);
    const ep = chunk.map((id) => `id[$in][]=${id}`).join("&");
    const d = await getJson<FeathersList<{ id: number; description?: Localized }>>(
      `${BASE}/effects?lang=fr&$limit=50&$select[]=id&$select[]=description&${ep}`,
      signal,
    );
    for (const e of d.data ?? []) if (e.description?.fr) tplById.set(e.id, e.description.fr);
  }

  // Références (sorts/monstres) embarquées comme grands nombres dans les effets (≥1000) :
  // sorts « lancés » (template sans lettre) et ids dans #1/#2/#3 (ex. « Invoque: <monstre> »).
  const refIds = new Set<number>();
  for (const l of levelById.values())
    for (const e of [...(l.effects ?? []), ...(l.criticalEffect ?? [])]) {
      const id = e?.effectId;
      if (id == null || DMG_EFFECTS.has(id) || STEAL_EFFECTS.has(id) || id === 293) continue;
      for (const v of [e.diceNum, e.value]) if (typeof v === "number" && v >= 1000) refIds.add(v);
    }
  const refNames = new Map<number, string>();
  const refArr = [...refIds];
  // On résout d'abord en sorts puis en monstres (le monstre l'emporte → « Invoque <monstre> »).
  for (const kind of ["spells", "monsters"] as const) {
    for (let i = 0; i < refArr.length; i += 50) {
      const chunk = refArr.slice(i, i + 50);
      const cp = chunk.map((id) => `id[$in][]=${id}`).join("&");
      const d = await getJson<FeathersList<{ id: number; name?: Localized }>>(
        `${BASE}/${kind}?lang=fr&$limit=50&$select[]=id&$select[]=name&${cp}`,
        signal,
      );
      for (const e of d.data ?? []) if (e.name?.fr) refNames.set(e.id, e.name.fr);
    }
  }

  // États référencés par les sorts → noms lisibles (résolus dynamiquement via /spell-states,
  // donc valable pour les 6000+ états du jeu) :
  //  • effets qui posent/retirent un état (950/951/952) : id dans #3 (= value) ;
  //  • états requis en condition de dégâts (targetMask, ex "*E244").
  const stateIds = new Set<number>();
  for (const l of levelById.values())
    for (const e of [...(l.effects ?? []), ...(l.criticalEffect ?? [])]) {
      if (STATE_EFFECTS.has(e?.effectId) && typeof e.value === "number") stateIds.add(e.value);
      for (const tok of String(e?.targetMask ?? "").split(",")) {
        if (/\d/.test(tok)) {
          const n = Number(tok.replace(/\D/g, ""));
          if (n > 0) stateIds.add(n);
        }
      }
    }
  const stateNames = await resolveStateNames(stateIds, signal);

  const result = ordered.map((s, idx) => {
    const levelIdList: number[] = Array.isArray(s.spellLevels) ? s.spellLevels : [];
    const levels: SpellLevel[] = levelIdList
      .map((id) => levelById.get(id))
      .filter((l): l is Record<string, any> => !!l)
      .map((l) => ({
        grade: l.grade ?? 1,
        minPlayerLevel: l.minPlayerLevel ?? 1,
        apCost: l.apCost ?? 0,
        minRange: l.minRange ?? 0,
        range: l.range ?? 0,
        critProbability: l.criticalHitProbability ?? 0,
        damage: decodeSpellDamage(l.effects),
        criticalDamage: decodeSpellDamage(l.criticalEffect),
        chargeScaled: Array.isArray(l.effects) && l.effects.some((e: Record<string, number>) => e?.effectId === 293),
        castInLine: !!l.castInLine,
        castInDiagonal: !!l.castInDiagonal,
        losRequired: !!l.castTestLos,
        utility: buildUtility(l.effects, tplById, refNames, stateNames),
        criticalUtility: buildUtility(l.criticalEffect, tplById, refNames, stateNames),
        ...extractZone(l.effects),
      }))
      .sort((a, b) => a.grade - b.grade);
    return {
      id: s.id,
      name: s.name,
      description: s.description ?? { fr: "" },
      img: s.img,
      levels,
      variantId: 0,
      variantIndex: idx,
      auto: autoSet.has(s.id),
    };
  });

  // Libellés de condition (« si <état> ») résolus, comme sur la fiche de classe.
  for (const sp of result)
    for (const lv of sp.levels)
      for (const d of [...lv.damage, ...lv.criticalDamage]) d.conditionLabel = labelForCondition(d.condition, stateNames);
  return result;
}

// Récupère la zone d'effet principale (1ʳᵉ qui a une forme/taille) parmi les effets.
// Zone d'effet à prévisualiser : on prend l'effet à plus grande aire (shape ≠ POINT(80)/NONE(0)
// et param1>0) — souvent l'effet de dégâts —, pas le 1ᵉʳ effet (souvent un état mono-case).
// La TAILLE = param1 (l'atténuation de dégâts n'est PAS l'étendue).
function extractZone(effects: unknown): { zoneShape: number; zoneSize: number } {
  let best = { zoneShape: 0, zoneSize: 0 };
  if (Array.isArray(effects)) {
    for (const e of effects) {
      const z = (e as Record<string, any>)?.zoneDescr;
      const shape = z?.shape ?? 0;
      const size = z?.param1 ?? 0;
      if (shape && shape !== 80 && size > 0 && size > best.zoneSize) best = { zoneShape: shape, zoneSize: size };
    }
  }
  return best;
}

// ── Succès (achievements) ────────────────────────────────────────────────────
// Arborescence façon DofusDB : 16 catégories racines (parentId 0) + sous-catégories.
// Chaque catégorie porte la liste des `achievementIds` qu'elle contient.
export interface AchievementCategory {
  id: number;
  parentId: number;
  order: number;
  name: Localized;
  achievementIds: number[];
}

export async function listAchievementCategories(signal?: AbortSignal): Promise<AchievementCategory[]> {
  const out: AchievementCategory[] = [];
  let skip = 0;
  // 124 catégories → pagination $limit 50.
  for (;;) {
    const data = await getJson<FeathersList<AchievementCategory>>(
      `${BASE}/achievement-categories?lang=fr&$limit=50&$skip=${skip}&$sort[id]=1`,
      signal,
    );
    out.push(...data.data);
    skip += 50;
    if (skip >= data.total) break;
  }
  return out.map((c) => ({
    id: c.id,
    parentId: c.parentId,
    order: c.order,
    name: c.name,
    achievementIds: c.achievementIds ?? [],
  }));
}

export interface Achievement {
  id: number;
  name: Localized;
  description: string; // résolue (markup [challenge,N] remplacé par le nom)
  points: number;
  level: number;
  img: string; // construit depuis iconId (le champ `img` virtuel casse sous $select)
  conditions: string[]; // lignes lisibles (challenge, niveau requis…)
  rewards: AchievementRewards;
  monsters: { id: number; name: string }[]; // monstres/boss référencés (liens donjon/monstre)
}

export interface AchievementRewardItem {
  id: number; // id DofusDB de l'item (pour ouvrir l'ItemModal)
  name: string;
  img: string;
  quantity: number;
}
export interface AchievementRewards {
  items: AchievementRewardItem[];
  titles: string[];
  ornaments: string[];
  xp: number; // montant calculé (formules officielles, joueur niveau 200)
  kamas: number;
}

// Formules de récompense Ankama (reprises du calcul DofusDB), pour un joueur niveau 200.
//  • Kamas : ⌊(L² + 20·L − 20) · ratio⌋
//  • XP    : base ⌊pl·(100+2·pl)²/20 · 1,05 · ratio⌋ ; si le joueur (200) dépasse le niveau
//    du succès, mélange 70/30 entre le palier du succès et min(200 ; 1,5·niveau).
const XP_DURATION = 1.05;
function kamasReward(level: number, ratio: number): number {
  if (ratio <= 0) return 0;
  return Math.floor((level * level + 20 * level - 20) * ratio);
}
function xpReward(level: number, ratio: number): number {
  if (ratio <= 0) return 0;
  const pl = 200; // joueur niveau max (DofusDB passe -1 → 200)
  const t = level;
  const r = XP_DURATION;
  if (pl > t) {
    const i = Math.min(pl, 1.5 * t);
    const o = (t * (100 + 2 * t) ** 2) / 20 * r * ratio;
    const s = (i * (100 + 2 * i) ** 2) / 20 * r * ratio;
    return Math.floor(0.7 * s + 0.3 * o);
  }
  return Math.floor((pl * (100 + 2 * pl) ** 2) / 20 * r * ratio);
}

// Nettoie un libellé genré Ankama (« {m}Conquérant,{f}Conquérante » → « Conquérant »).
function cleanGendered(s: string): string {
  const m = s.match(/\{m\}([^,{}]+)/);
  if (m) return m[1].trim();
  return s.replace(/\{[mf]\}/g, "").trim();
}
function locFr(v: unknown): string {
  if (typeof v === "string") return v;
  if (v && typeof v === "object" && "fr" in (v as Record<string, unknown>))
    return String((v as Record<string, unknown>).fr ?? "");
  return "";
}

type RawObjective = { readableCriterion?: unknown; name?: Localized };
type RawRewardItem = { id?: number; name?: Localized; iconId?: number };
type RawReward = {
  experienceRatio?: number;
  kamasRatio?: number;
  items?: RawRewardItem[];
  itemsQuantityReward?: number[];
  titles?: { name?: unknown }[];
  ornaments?: { name?: unknown }[];
};
type RawAchievement = {
  id: number;
  name: Localized;
  description?: Localized;
  points?: number;
  level?: number;
  order?: number;
  iconId?: number;
  objectives?: RawObjective[];
  rewards?: RawReward[];
};

// Construit les lignes de conditions depuis readableCriterion (liste de groupes ;
// chaque groupe = liste de segments string|{name}) et collecte une table id→nom
// (challenge/monstre…) pour résoudre le markup de la description.
function parseObjectives(objs: RawObjective[] | undefined, tokenNames: Map<number, string>): string[] {
  const lines: string[] = [];
  for (const o of objs ?? []) {
    if (!o) continue;
    const rc = o.readableCriterion;
    if (Array.isArray(rc) && rc.length) {
      for (const group of rc as unknown[]) {
        const parts = Array.isArray(group) ? group : [group];
        let line = "";
        for (const p of parts as unknown[]) {
          if (typeof p === "string") line += p;
          else if (p && typeof p === "object") {
            const obj = p as { id?: number; name?: unknown };
            const nm = locFr(obj.name);
            line += nm;
            if (typeof obj.id === "number" && nm) tokenNames.set(obj.id, nm);
          }
        }
        line = line.trim();
        if (line) lines.push(line);
      }
    } else if (o.name?.fr) {
      lines.push(o.name.fr);
    }
  }
  return lines;
}

// Extrait les monstres/boss référencés par les objectifs (refs MonsterData → id ;
// ChallengeData → targetMonsterId = le boss). Le nom vient de la ref, sinon de l'objectif.
function parseMonsters(objs: RawObjective[] | undefined): { id: number; name: string }[] {
  const out: { id: number; name: string }[] = [];
  const seen = new Set<number>();
  const add = (id: number | undefined, name: string) => {
    if (!id || seen.has(id)) return;
    seen.add(id);
    out.push({ id, name });
  };
  for (const o of objs ?? []) {
    if (!o) continue;
    const objName = o.name?.fr ?? "";
    const walk = (x: unknown) => {
      if (Array.isArray(x)) {
        x.forEach(walk);
      } else if (x && typeof x === "object") {
        const ref = x as { className?: string; id?: number; targetMonsterId?: number; name?: unknown };
        if (ref.className === "MonsterData") add(ref.id, locFr(ref.name) || objName);
        else if (ref.className === "ChallengeData" && ref.targetMonsterId) add(ref.targetMonsterId, objName);
      }
    };
    walk(o.readableCriterion);
  }
  return out;
}

function resolveDescription(desc: string, tokenNames: Map<number, string>): string {
  return desc
    .replace(/\[[a-zA-Z]+,(\d+)\]/g, (_m, id) => tokenNames.get(Number(id)) ?? "")
    .replace(/\s+([.,;:])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function parseRewards(rewards: RawReward[] | undefined, level: number): AchievementRewards {
  const out: AchievementRewards = { items: [], titles: [], ornaments: [], xp: 0, kamas: 0 };
  for (const r of rewards ?? []) {
    if (!r) continue;
    out.xp += xpReward(level, r.experienceRatio ?? 0);
    out.kamas += kamasReward(level, r.kamasRatio ?? 0);
    const qty = r.itemsQuantityReward ?? [];
    (r.items ?? []).forEach((it, idx) => {
      out.items.push({
        id: it.id ?? 0,
        name: locFr(it.name),
        img: `${BASE}/img/items/${it.iconId ?? 0}.png`,
        quantity: qty[idx] ?? 1,
      });
    });
    for (const t of r.titles ?? []) {
      const nm = cleanGendered(locFr(t.name));
      if (nm) out.titles.push(nm);
    }
    for (const o of r.ornaments ?? []) {
      const nm = cleanGendered(locFr(o.name));
      if (nm) out.ornaments.push(nm);
    }
  }
  return out;
}

// Récupère des succès par ids (multi-ids via id[$in][], plafonné à 50 → chunks),
// en conservant l'ordre des ids fournis. Inclut conditions + récompenses (embarquées).
export async function getAchievementsByIds(ids: number[], signal?: AbortSignal): Promise<Achievement[]> {
  const out: (Achievement & { _order: number })[] = [];
  for (let i = 0; i < ids.length; i += 50) {
    const chunk = ids.slice(i, i + 50);
    const idParams = chunk.map((id) => `id[$in][]=${id}`).join("&");
    const data = await getJson<FeathersList<RawAchievement>>(
      `${BASE}/achievements?lang=fr&$limit=50&${idParams}`,
      signal,
    );
    for (const a of data.data ?? []) {
      const tokenNames = new Map<number, string>();
      const conditions = parseObjectives(a.objectives, tokenNames);
      out.push({
        id: a.id,
        name: a.name,
        description: resolveDescription(a.description?.fr ?? "", tokenNames),
        points: a.points ?? 0,
        level: a.level ?? 0,
        img: `${BASE}/img/achievements/${a.iconId ?? 0}.png`,
        conditions,
        rewards: parseRewards(a.rewards, a.level ?? 0),
        monsters: parseMonsters(a.objectives),
        _order: a.order ?? 0,
      });
    }
  }
  // Même ordre que DofusDB : tri par `order` (regroupe par donjon/thème), puis id.
  out.sort((a, b) => a._order - b._order || a.id - b.id);
  return out.map(({ _order, ...a }) => a);
}

// ============================================================================
// Métiers & recettes de craft
// ============================================================================

export interface Job {
  id: number;
  name: Localized;
}

// 23 métiers ; on exclut l'id 1 « Base » (pseudo-métier sans recettes propres).
export async function listJobs(signal?: AbortSignal): Promise<Job[]> {
  const url = `${BASE}/jobs?lang=fr&$limit=50&$sort[id]=1&$select[]=id&$select[]=name`;
  const data = await getJson<FeathersList<Job>>(url, signal);
  return (data.data ?? []).filter((j) => j.id !== 1 && j.name?.fr);
}

export interface Recipe {
  id: number;
  resultId: number;
  resultLevel: number;
  jobId: number;
  ingredientIds: number[];
  quantities: number[];
}

export interface RecipeQuery {
  jobId?: number;
  resultId?: number;
  ingredientId?: number; // reverse : recettes utilisant cet ingrédient
  skip?: number;
  limit?: number;
}

export async function listRecipes(q: RecipeQuery, signal?: AbortSignal): Promise<FeathersList<Recipe>> {
  const limit = Math.min(q.limit ?? 50, 50); // $limit plafonné à 50
  const parts = [
    "lang=fr",
    `$limit=${limit}`,
    `$skip=${q.skip ?? 0}`,
    "$sort[resultLevel]=-1",
    "$sort[id]=1",
    "$select[]=id",
    "$select[]=resultId",
    "$select[]=resultLevel",
    "$select[]=jobId",
    "$select[]=ingredientIds",
    "$select[]=quantities",
  ];
  if (q.jobId != null) parts.push(`jobId=${q.jobId}`);
  if (q.resultId != null) parts.push(`resultId=${q.resultId}`);
  if (q.ingredientId != null) parts.push(`ingredientIds[$in][]=${q.ingredientId}`);
  const url = `${BASE}/recipes?${parts.join("&")}`;
  return getJson<FeathersList<Recipe>>(url, signal);
}

// Parmi une liste d'ids, lesquels ont une recette (sont craftables) — 1 requête.
export async function craftableIdsAmong(ids: number[], signal?: AbortSignal): Promise<Set<number>> {
  const uniq = [...new Set(ids)].filter((n) => Number.isFinite(n));
  if (!uniq.length) return new Set();
  const idParams = uniq.map((id) => `resultId[$in][]=${id}`).join("&");
  const url = `${BASE}/recipes?$limit=50&$select[]=resultId&${idParams}`;
  const data = await getJson<FeathersList<{ resultId: number }>>(url, signal);
  return new Set((data.data ?? []).map((r) => r.resultId));
}

// Recette(s) produisant un objet (sert à l'arbre de craft + fiche objet).
export async function getRecipesForResult(itemId: number, signal?: AbortSignal): Promise<Recipe[]> {
  const data = await listRecipes({ resultId: itemId, limit: 50 }, signal);
  return data.data;
}

// Recettes qui consomment un objet (« permet de crafter »).
export async function recipesUsingIngredient(itemId: number, limit = 30, signal?: AbortSignal): Promise<Recipe[]> {
  const data = await listRecipes({ ingredientId: itemId, limit }, signal);
  return data.data;
}

// ============================================================================
// Carte du monde — géométrie, grille de maps, ressources, sous-zones
// ============================================================================

// Niveau de zoom de la pyramide de tuiles : `name` = dossier des tuiles, `x`/`y` = facteur d'échelle.
export interface WorldScaleLevel {
  x: number;
  y: number;
  name: string;
}

export interface WorldGeometry {
  id: number;
  name: Localized;
  origineX: number;
  origineY: number;
  mapWidth: number;
  mapHeight: number;
  totalWidth: number;
  totalHeight: number;
  minScale: number;
  maxScale: number;
  startScale: number;
  zoom: number[];
  customScales: WorldScaleLevel[]; // pyramide de tuiles (cf. carte DofusDB)
  visibleOnMap?: boolean;
}

// URL d'une tuile de la worldmap pré-assemblée (pyramide façon DofusDB) :
// `/img/worlds/{worldId}/{scaleName}/{index}.jpg` où index = ty*columns + tx + 1 (1-based, row-major).
export function worldPyramidTileImg(worldId: number, scaleName: string, index: number): string {
  return `${BASE}/img/worlds/${worldId}/${scaleName}/${index}.jpg`;
}

// 35 mondes ; on ne garde que ceux affichables sur la carte (exclut intérieurs/donjons).
export async function getWorlds(signal?: AbortSignal): Promise<WorldGeometry[]> {
  const url = `${BASE}/worlds?lang=fr&$limit=50&$sort[id]=1`;
  const data = await getJson<FeathersList<WorldGeometry>>(url, signal);
  return (data.data ?? []).filter((w) => w.visibleOnMap !== false && w.name?.fr);
}

export interface MapCell {
  id: number;
  posX: number;
  posY: number;
  subAreaId: number;
}

export interface WorldGrid {
  worldId: number;
  byKey: Map<string, MapCell>;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export function gridKey(posX: number, posY: number): string {
  return `${posX},${posY}`;
}

// Tuile de map (rendu DofusDB) pour la worldmap. Échelles 0.25 / 0.5 / 1.
export type WorldScale = "0.25" | "0.5" | "1";
export function worldMapTileImg(mapId: number, scale: WorldScale): string {
  return `${BASE}/img/maps/${scale}/${mapId}.jpg`;
}

// Grille complète d'un monde : la carte n'affiche QUE les maps `hasPriorityOnWorldmap`
// (la map canonique de chaque cellule ; sinon ~1789 intérieurs s'empilent sur (0,0)).
// ~4669 cellules pour le Monde des Douze → pagination $limit 50 mais en VAGUES PARALLÈLES
// (latence ~0.1 s → ~2-4 s, mis en cache pour la session). Tri stable par id.
export async function getWorldGrid(worldId: number, signal?: AbortSignal): Promise<WorldGrid> {
  type Raw = { id: number; posX: number; posY: number; subAreaId: number };
  const base =
    `${BASE}/map-positions?worldMap=${worldId}&hasPriorityOnWorldmap=true&$sort[id]=1` +
    `&$select[]=id&$select[]=posX&$select[]=posY&$select[]=subAreaId`;
  const first = await getJson<FeathersList<Raw>>(`${base}&$limit=50&$skip=0`, signal);
  const rows: Raw[] = [...first.data];
  const skips: number[] = [];
  for (let s = 50; s < first.total; s += 50) skips.push(s);
  const CONC = 8; // cap de concurrence (le navigateur plafonne ~6/hôte de toute façon)
  for (let i = 0; i < skips.length; i += CONC) {
    const batch = skips.slice(i, i + CONC);
    const pages = await Promise.all(
      batch.map((s) => getJson<FeathersList<Raw>>(`${base}&$limit=50&$skip=${s}`, signal)),
    );
    for (const p of pages) rows.push(...p.data);
  }
  const byKey = new Map<string, MapCell>();
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const m of rows) {
    const key = gridKey(m.posX, m.posY);
    if (!byKey.has(key)) byKey.set(key, { id: m.id, posX: m.posX, posY: m.posY, subAreaId: m.subAreaId });
    if (m.posX < minX) minX = m.posX;
    if (m.posX > maxX) maxX = m.posX;
    if (m.posY < minY) minY = m.posY;
    if (m.posY > maxY) maxY = m.posY;
  }
  if (!byKey.size) return { worldId, byKey, minX: 0, maxX: 0, minY: 0, maxY: 0 };
  return { worldId, byKey, minX, maxX, minY, maxY };
}

// Cellules d'un monde DANS une plage de coords (chargement à la demande par viewport — bien
// plus rapide que de précharger les 4669 cellules avant le 1er affichage). Pagination $limit 50.
export async function getWorldGridRange(
  worldId: number,
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  signal?: AbortSignal,
): Promise<MapCell[]> {
  type Raw = { id: number; posX: number; posY: number; subAreaId: number };
  const out: MapCell[] = [];
  let skip = 0;
  for (;;) {
    const url =
      `${BASE}/map-positions?worldMap=${worldId}&hasPriorityOnWorldmap=true` +
      `&posX[$gte]=${minX}&posX[$lte]=${maxX}&posY[$gte]=${minY}&posY[$lte]=${maxY}` +
      `&$sort[id]=1&$limit=50&$skip=${skip}` +
      `&$select[]=id&$select[]=posX&$select[]=posY&$select[]=subAreaId`;
    const data = await getJson<FeathersList<Raw>>(url, signal);
    for (const m of data.data) out.push({ id: m.id, posX: m.posX, posY: m.posY, subAreaId: m.subAreaId });
    skip += 50;
    if (skip >= data.total || data.data.length === 0) break;
  }
  return out;
}

// Cellule worldmap à une coordonnée précise (clic sur la carte, même quand on est dézoomé et
// que la grille n'est pas préchargée). Renvoie la map prioritaire de la worldmap à (posX,posY).
export async function getMapCellAt(
  worldId: number,
  posX: number,
  posY: number,
  signal?: AbortSignal,
): Promise<MapCell | null> {
  const url =
    `${BASE}/map-positions?worldMap=${worldId}&posX=${posX}&posY=${posY}&hasPriorityOnWorldmap=true&$limit=1` +
    `&$select[]=id&$select[]=posX&$select[]=posY&$select[]=subAreaId`;
  const data = await getJson<FeathersList<{ id: number; posX: number; posY: number; subAreaId: number }>>(url, signal);
  const m = data.data[0];
  return m ? { id: m.id, posX: m.posX, posY: m.posY, subAreaId: m.subAreaId } : null;
}

// Zone (sous-zone) sous une coordonnée : nom + toutes ses cases — pour surligner la zone au survol.
export async function getZoneAt(
  worldId: number,
  posX: number,
  posY: number,
  signal?: AbortSignal,
): Promise<{ subAreaId: number; name: string; cells: { posX: number; posY: number }[] } | null> {
  const cell = await getMapCellAt(worldId, posX, posY, signal);
  if (!cell) return null;
  const [names, cells] = await Promise.all([
    getSubareasByIds([cell.subAreaId], signal),
    getSubareaCells([cell.subAreaId], worldId, signal),
  ]);
  return { subAreaId: cell.subAreaId, name: names[0]?.name?.fr ?? "", cells };
}

// Positions (posX,posY,worldMap,subAreaId) de maps par ids — ex. entrées de donjon pour localiser
// un boss de donjon sur la worldmap. Chunks de 50.
export async function getMapPositionsByIds(
  ids: number[],
  signal?: AbortSignal,
): Promise<{ id: number; posX: number; posY: number; worldMap: number; subAreaId: number }[]> {
  const uniq = [...new Set(ids)].filter((n) => Number.isFinite(n));
  const out: { id: number; posX: number; posY: number; worldMap: number; subAreaId: number }[] = [];
  for (let i = 0; i < uniq.length; i += 50) {
    const idParams = uniq.slice(i, i + 50).map((id) => `id[$in][]=${id}`).join("&");
    const url = `${BASE}/map-positions?$limit=50&$select[]=id&$select[]=posX&$select[]=posY&$select[]=worldMap&$select[]=subAreaId&${idParams}`;
    const data = await getJson<FeathersList<{ id: number; posX: number; posY: number; worldMap: number; subAreaId: number }>>(url, signal);
    out.push(...(data.data ?? []));
  }
  return out;
}

// Position « ancre » d'une sous-zone (1re map prioritaire) — sert à recadrer la carte sur une zone.
export async function getSubareaAnchor(
  subAreaId: number,
  signal?: AbortSignal,
): Promise<{ id: number; posX: number; posY: number; worldMap: number; subAreaId: number } | null> {
  const url =
    `${BASE}/map-positions?subAreaId=${subAreaId}&hasPriorityOnWorldmap=true&$limit=1` +
    `&$select[]=id&$select[]=posX&$select[]=posY&$select[]=worldMap&$select[]=subAreaId`;
  const data = await getJson<FeathersList<{ id: number; posX: number; posY: number; worldMap: number; subAreaId: number }>>(
    url,
    signal,
  );
  return data.data[0] ?? null;
}

export interface ResourcePin {
  mapId: number;
  posX: number;
  posY: number;
  subAreaId: number;
  worldMap: number;
  quantity: number;
}

// Maps qui donnent une ressource (source réelle de la carte DofusDB) : 1 pin par map.
export async function getResourceMaps(itemId: number, signal?: AbortSignal): Promise<ResourcePin[]> {
  type Raw = {
    id: number;
    quantities?: { item: number; quantity: number }[];
    pos?: { posX: number; posY: number; subAreaId: number; worldMap: number };
  };
  // Plusieurs maps (intérieurs/étages) partagent une même coordonnée worldmap → on dédoublonne
  // par coordonnée (worldMap,posX,posY) en gardant la quantité MAX (le meilleur spot du lieu).
  const byCoord = new Map<string, ResourcePin>();
  let skip = 0;
  for (;;) {
    const url = `${BASE}/recoltable?resources[$in][]=${itemId}&$limit=50&$skip=${skip}&$sort[id]=1`;
    const data = await getJson<FeathersList<Raw>>(url, signal);
    for (const r of data.data) {
      if (!r.pos) continue;
      const q = (r.quantities ?? []).find((x) => x.item === itemId)?.quantity ?? 1;
      const key = `${r.pos.worldMap},${r.pos.posX},${r.pos.posY}`;
      const prev = byCoord.get(key);
      if (!prev || q > prev.quantity) {
        byCoord.set(key, {
          mapId: r.id,
          posX: r.pos.posX,
          posY: r.pos.posY,
          subAreaId: r.pos.subAreaId,
          worldMap: r.pos.worldMap,
          quantity: q,
        });
      }
    }
    skip += 50;
    if (skip >= data.total || data.data.length === 0) break;
  }
  return [...byCoord.values()];
}

export interface SubareaInfo {
  id: number;
  name: Localized;
  level: number;
  areaId: number;
  mapIds: number[];
  monsters: number[];
  harvestables: number[];
}

// Noms de sous-zones en lot (pour grouper la liste des maps d'une ressource). Chunks de 50.
export async function getSubareasByIds(ids: number[], signal?: AbortSignal): Promise<{ id: number; name: Localized }[]> {
  const uniq = [...new Set(ids)].filter((n) => Number.isFinite(n));
  const out: { id: number; name: Localized }[] = [];
  for (let i = 0; i < uniq.length; i += 50) {
    const chunk = uniq.slice(i, i + 50);
    const idParams = chunk.map((id) => `id[$in][]=${id}`).join("&");
    const url = `${BASE}/subareas?lang=fr&$limit=50&$select[]=id&$select[]=name&${idParams}`;
    const data = await getJson<FeathersList<{ id: number; name: Localized }>>(url, signal);
    out.push(...(data.data ?? []));
  }
  return out;
}

export async function getSubarea(id: number, signal?: AbortSignal): Promise<SubareaInfo | null> {
  const url =
    `${BASE}/subareas?id=${id}&lang=fr&$limit=1` +
    `&$select[]=id&$select[]=name&$select[]=level&$select[]=areaId` +
    `&$select[]=mapIds&$select[]=monsters&$select[]=harvestables`;
  const data = await getJson<FeathersList<SubareaInfo>>(url, signal);
  return data.data[0] ?? null;
}

// Cases worldmap (posX,posY) appartenant à une/des sous-zone(s) d'un monde — pour surligner la
// zone en bleu, INDÉPENDAMMENT du zoom (ne dépend pas de la grille préchargée du viewport).
export async function getSubareaCells(
  subAreaIds: number[],
  worldId: number,
  signal?: AbortSignal,
): Promise<{ posX: number; posY: number }[]> {
  const ids = [...new Set(subAreaIds)].filter((n) => Number.isFinite(n));
  if (!ids.length) return [];
  const idParams = ids.map((id) => `subAreaId[$in][]=${id}`).join("&");
  const out: { posX: number; posY: number }[] = [];
  let skip = 0;
  for (;;) {
    const url =
      `${BASE}/map-positions?worldMap=${worldId}&hasPriorityOnWorldmap=true&${idParams}` +
      `&$limit=50&$skip=${skip}&$sort[id]=1&$select[]=posX&$select[]=posY`;
    const data = await getJson<FeathersList<{ posX: number; posY: number }>>(url, signal);
    for (const m of data.data) out.push({ posX: m.posX, posY: m.posY });
    skip += 50;
    if (skip >= data.total || data.data.length === 0 || out.length >= 400) break;
  }
  return out;
}

export interface SubareaLite {
  id: number;
  name: Localized;
  level: number;
  areaId: number;
  mapIds: number[];
}

// Sous-zones où récolter une ressource (fiche objet « Où récolter »).
export async function subareasHarvesting(itemId: number, limit = 50, signal?: AbortSignal): Promise<SubareaLite[]> {
  const url =
    `${BASE}/subareas?harvestables[$in][]=${itemId}&lang=fr&$limit=${Math.min(limit, 50)}` +
    `&$sort[level]=1&$sort[id]=1&$select[]=id&$select[]=name&$select[]=level&$select[]=areaId&$select[]=mapIds`;
  const data = await getJson<FeathersList<SubareaLite>>(url, signal);
  return data.data ?? [];
}

// Sous-zones où apparaît un monstre (highlight de zone sur la carte).
export async function subareasWithMonster(monsterId: number, limit = 50, signal?: AbortSignal): Promise<SubareaLite[]> {
  const url =
    `${BASE}/subareas?monsters[$in][]=${monsterId}&lang=fr&$limit=${Math.min(limit, 50)}` +
    `&$sort[level]=1&$sort[id]=1&$select[]=id&$select[]=name&$select[]=level&$select[]=areaId&$select[]=mapIds`;
  const data = await getJson<FeathersList<SubareaLite>>(url, signal);
  return data.data ?? [];
}
