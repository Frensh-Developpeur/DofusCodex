import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "../components/DofusIcons";
import DofusIcon, { type DofusIconName } from "../components/DofusIcon";
import {
  searchEquipment,
  browseEquipment,
  browseEquipmentAll,
  type EquipmentLight,
} from "../api/dofusdude";
import { browseItems } from "../api/dofusdb";
import { useDebounce } from "../hooks/useDebounce";
import { useViewState } from "../lib/viewState";
import { SLOTS, WEAPON_SLOTS, levelTone } from "../data/meta";
import { Pill, SectionHeader, Skeleton, EmptyState, ErrorState, LoadMore, fadeUp } from "../components/ui";

const LEVEL_PRESETS = [
  { label: "Tous", min: 1, max: 200 },
  { label: "1-50", min: 1, max: 50 },
  { label: "50-110", min: 50, max: 110 },
  { label: "110-170", min: 110, max: 170 },
  { label: "170-200", min: 170, max: 200 },
];

// Familiers & montures : absents du browse DofusDude (filtrables seulement par recherche),
// mais présents dans /items DofusDB par typeId (id-space partagé → l'ItemModal s'ouvre).
// Teinte unique des silhouettes GRISES du client (slots d'armure, Dragodinde/Muldo) :
// un beige chaud rappelant le manche des armes — cohérent avec l'icône d'équipement.
const ACCENT = "#d8c39a";

// Familiers & montures : même icône « créatures » pour toute la rangée (uniformisé).
const CREATURE_ICON: DofusIconName = "companions";
const CREATURE_CATS: { id: string; label: string; typeIds: number[] }[] = [
  { id: "familier", label: "Familiers", typeIds: [18] },
  { id: "montilier", label: "Montilier", typeIds: [121] },
  { id: "dragodinde", label: "Dragodindes", typeIds: [331] },
  { id: "muldo", label: "Muldos", typeIds: [332] },
  { id: "volkorne", label: "Volkornes", typeIds: [333] },
];
type CreatureId = (typeof CREATURE_CATS)[number]["id"];

// Silhouettes de slots du client (grises) → recolorées dans l'accent de l'app.
const SLOT_TINT: Record<string, DofusIconName> = {
  hat: "slotHat",
  cloak: "slotCloak",
  amulet: "slotAmulet",
  ring: "slotRing",
  belt: "slotBelt",
  boots: "slotBoots",
  shield: "slotShield",
  dofus: "slotDofus",
  trophy: "slotTrophy",
};

const CREATURE_PAGE = 48;
const EQUIP_PAGE = 48; // search: limit API ~plafonné ; browse: page[size]

// Vue unifiée des deux sources (DofusDude équipement / DofusDB créature).
type GridItem = { id: number; name: string; level: number; icon: string; sub?: string };

export default function Stuffinator() {
  const navigate = useNavigate();
  const [search, setSearch] = useViewState("stuff:search", "");
  const [slot, setSlot] = useViewState<string | null>("stuff:slot", null);
  const [creature, setCreature] = useViewState<CreatureId | null>("stuff:creature", null);
  const [preset, setPreset] = useViewState("stuff:preset", 0);
  const debounced = useDebounce(search);
  const lvl = LEVEL_PRESETS[preset];

  const hasSearch = debounced.trim().length >= 2;
  const creatureMode = creature !== null;
  const creatureCat = CREATURE_CATS.find((c) => c.id === creature);

  // --- Équipements (DofusDude) : recherche libre (paginée par skip), ou browse par
  // emplacement/niveau (paginé par page[number]). On renvoie `full` = la page serveur était
  // pleine → pour piloter « Charger plus » même quand un filtre client réduit la page. ---
  const equip = useInfiniteQuery({
    queryKey: ["stuff", hasSearch ? debounced : "", slot, lvl.min, lvl.max],
    queryFn: async ({ pageParam, signal }) => {
      let raw: EquipmentLight[];
      if (hasSearch) {
        raw = await searchEquipment(debounced, EQUIP_PAGE, signal, pageParam * EQUIP_PAGE);
      } else {
        const params = { typeNameId: slot ?? "hat", minLevel: lvl.min, maxLevel: lvl.max, sort: "desc" as const };
        try {
          raw = await browseEquipment({ ...params, pageSize: EQUIP_PAGE, pageNumber: pageParam + 1 }, signal);
        } catch {
          // L'API rejette page[size] > total (HTTP 400) sur les types peu peuplés : on
          // récupère tout le lot d'un coup (uniquement en 1re page → pas de page suivante).
          raw = pageParam === 0 ? await browseEquipmentAll(params, signal) : [];
        }
      }
      const full = raw.length === EQUIP_PAGE;
      let items = raw;
      // La recherche ignore les filtres serveur → on applique emplacement + niveau côté client.
      if (hasSearch && slot) items = items.filter((it) => slotMatches(it, slot));
      items = items.filter((it) => it.level >= lvl.min && it.level <= lvl.max);
      return { items, full };
    },
    initialPageParam: 0,
    getNextPageParam: (last, all) => (last.full ? all.length : undefined),
    placeholderData: keepPreviousData,
    enabled: !creatureMode,
  });

  // --- Familiers & montures (DofusDB) : paginé par typeId, recherche par nom ---
  const beasts = useInfiniteQuery({
    queryKey: ["stuff-creatures", creature, debounced],
    queryFn: ({ pageParam, signal }) =>
      browseItems({ typeIds: [...creatureCat!.typeIds], search: debounced, skip: pageParam, limit: CREATURE_PAGE }, signal),
    initialPageParam: 0,
    getNextPageParam: (last, all) => (last.length === CREATURE_PAGE ? all.flat().length : undefined),
    enabled: creatureMode,
  });

  // Vue unifiée.
  const items: GridItem[] = creatureMode
    ? (beasts.data?.pages.flat() ?? []).map((it) => ({ id: it.id, name: it.name.fr, level: it.level, icon: it.img }))
    : (equip.data?.pages.flatMap((p) => p.items) ?? []).map((it) => ({
        id: it.ankama_id,
        name: it.name,
        level: it.level,
        icon: it.image_urls.icon,
        sub: it.type.name,
      }));

  const active = creatureMode ? beasts : equip;
  const isLoading = active.isLoading;
  const isError = active.isError;
  const isFetching = active.isFetching && !active.isFetchingNextPage;

  // Sélection mutuellement exclusive emplacement ↔ créature.
  const pickSlot = (id: string | null) => {
    setCreature(null);
    setSlot(id);
  };
  const pickCreature = (id: CreatureId) => {
    setSlot(null);
    setCreature(id);
  };

  return (
    <div>
      <SectionHeader
        eyebrow="Encyclopédie"
        title="Équipements"
        subtitle="Cherchez n'importe quel équipement, familier ou monture, filtrez par emplacement et niveau, puis ouvrez sa fiche complète (effets, recette, panoplie)."
        right={items.length > 0 ? <Pill tone="purple">{items.length} résultats</Pill> : undefined}
      />

      {/* Search */}
      <div className="glass mb-4 rounded-2xl p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher (ex : Gelano, Coiffe du Sufokia, Dragodinde Amande…)"
            className="no-drag w-full rounded-xl border border-white/10 bg-void-800/60 py-2.5 pl-10 pr-3 text-sm text-slate-200 outline-none transition focus:border-glow-purple/50"
          />
        </div>
        {!hasSearch && !creatureMode && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Astuce : sans recherche, on parcourt
            l'emplacement sélectionné par niveau décroissant.
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => pickSlot(null)} className={chip(slot === null && !creatureMode)}>
            Tous
          </button>
          {SLOTS.map((s) => {
            const iconName = SLOT_TINT[s.id];
            return (
              <button key={s.id} onClick={() => pickSlot(s.id)} className={chip(slot === s.id)}>
                {iconName ? <DofusIcon name={iconName} tint={ACCENT} size={15} /> : <s.icon className="h-3.5 w-3.5" />} {s.label}
              </button>
            );
          })}
          <div className="mx-1 w-px self-stretch bg-white/10" />
          {WEAPON_SLOTS.map((s) => (
            <button key={s.id} onClick={() => pickSlot(s.id)} className={chip(slot === s.id)}>
              <s.icon className="h-3.5 w-3.5" /> {s.label}
            </button>
          ))}
        </div>
        {/* Familiers & montures */}
        <div className="flex flex-wrap gap-1.5">
          {CREATURE_CATS.map((c) => (
            <button key={c.id} onClick={() => pickCreature(c.id)} className={chip(creature === c.id)}>
              <DofusIcon name={CREATURE_ICON} size={15} /> {c.label}
            </button>
          ))}
        </div>
        {!creatureMode && (
          <div className="flex flex-wrap gap-1.5">
            {LEVEL_PRESETS.map((p, i) => (
              <button key={p.label} onClick={() => setPreset(i)} className={chip(preset === i, "small")}>
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          message={creatureMode ? "Impossible de charger les familiers/montures." : (equip.error as Error)?.message}
          onRetry={() => active.refetch()}
        />
      ) : items.length === 0 ? (
        <EmptyState
          title={creatureMode ? "Aucun familier / monture" : "Aucun équipement"}
          hint={hasSearch ? "Essayez un autre nom." : creatureMode ? "Essayez une autre catégorie." : "Changez d'emplacement ou de tranche de niveau."}
        />
      ) : (
        <>
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.025 } } }}
            className={`grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 ${isFetching ? "opacity-70" : ""}`}
          >
            {items.map((it, i) => (
              <motion.button
                key={it.id}
                variants={fadeUp}
                custom={i % 16}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/objets/${it.id}`, { state: { fromSection: true } })}
                className="glass glass-hover no-drag group flex flex-col items-center rounded-2xl p-4 text-center"
              >
                <div className="relative mb-3">
                  <div className="absolute inset-0 rounded-full bg-glow-purple/20 opacity-0 blur-xl transition group-hover:opacity-100" />
                  <img src={it.icon} alt={it.name} loading="lazy" className="relative h-16 w-16 object-contain" />
                </div>
                <p className="line-clamp-2 text-sm font-semibold leading-tight text-white">{it.name}</p>
                {it.level > 0 && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <Pill tone={levelTone(it.level)}>Niv. {it.level}</Pill>
                  </div>
                )}
                {it.sub && <span className="mt-1 text-[11px] text-slate-500">{it.sub}</span>}
              </motion.button>
            ))}
          </motion.div>

          <LoadMore
            hasMore={!!active.hasNextPage}
            loading={active.isFetchingNextPage}
            onClick={() => active.fetchNextPage()}
            count={items.length}
          />
        </>
      )}
    </div>
  );
}

function chip(active: boolean, size: "normal" | "small" = "normal") {
  const base =
    "no-drag inline-flex items-center gap-1.5 rounded-lg font-medium transition " +
    (size === "small" ? "px-3 py-1.5 text-xs" : "px-3 py-1.5 text-xs");
  return active
    ? `${base} bg-glow-purple/25 text-white ring-1 ring-glow-purple/40`
    : `${base} bg-white/5 text-slate-400 hover:bg-white/10`;
}

// DofusDude search returns localized type names; map a few to our slot ids.
function slotMatches(it: EquipmentLight, slotId: string): boolean {
  const map: Record<string, string[]> = {
    hat: ["chapeau"],
    cloak: ["cape"],
    amulet: ["amulette"],
    ring: ["anneau"],
    belt: ["ceinture"],
    boots: ["bottes"],
    shield: ["bouclier"],
    dofus: ["dofus", "trophée"],
    trophy: ["trophée"],
    sword: ["épée"],
    bow: ["arc"],
    staff: ["bâton"],
    wand: ["baguette"],
    dagger: ["dague"],
    hammer: ["marteau"],
    axe: ["hache"],
  };
  const names = map[slotId];
  if (!names) return true;
  return names.some((n) => it.type.name.toLowerCase().includes(n));
}
