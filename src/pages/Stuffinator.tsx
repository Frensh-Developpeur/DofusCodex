import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, Sword } from "lucide-react";
import {
  searchEquipment,
  browseEquipment,
  browseEquipmentAll,
  type EquipmentLight,
} from "../api/dofusdude";
import { useDebounce } from "../hooks/useDebounce";
import { SLOTS, WEAPON_SLOTS, levelTone } from "../data/meta";
import { Pill, SectionHeader, Skeleton, EmptyState, ErrorState, fadeUp } from "../components/ui";
import ItemModal from "../components/ItemModal";

const LEVEL_PRESETS = [
  { label: "Tous", min: 1, max: 200 },
  { label: "1-50", min: 1, max: 50 },
  { label: "50-110", min: 50, max: 110 },
  { label: "110-170", min: 110, max: 170 },
  { label: "170-200", min: 170, max: 200 },
];

export default function Stuffinator() {
  const [search, setSearch] = useState("");
  const [slot, setSlot] = useState<string | null>(null);
  const [preset, setPreset] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const debounced = useDebounce(search);
  const lvl = LEVEL_PRESETS[preset];

  const hasSearch = debounced.trim().length >= 2;

  // Two modes: free-text search, or browse-by-slot/level when no query.
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["stuff", hasSearch ? debounced : "", slot, lvl.min, lvl.max],
    queryFn: async ({ signal }) => {
      let items: EquipmentLight[];
      if (hasSearch) {
        items = await searchEquipment(debounced, 48, signal);
        if (slot) items = items.filter((it) => slotMatches(it, slot));
      } else {
        const params = { typeNameId: slot ?? "hat", minLevel: lvl.min, maxLevel: lvl.max, sort: "desc" as const };
        try {
          items = await browseEquipment({ ...params, pageSize: 48 }, signal);
        } catch {
          // L'API rejette page[size] > total (HTTP 400) : on récupère tout le lot.
          items = await browseEquipmentAll(params, signal);
        }
      }
      // Apply level bounds client-side too (search ignores level filter).
      return items.filter((it) => it.level >= lvl.min && it.level <= lvl.max);
    },
    placeholderData: keepPreviousData,
  });

  const items = data ?? [];

  return (
    <div>
      <SectionHeader
        eyebrow="Encyclopédie"
        title="Équipements"
        subtitle="Cherchez n'importe quel équipement, filtrez par emplacement et niveau, puis ouvrez sa fiche complète (effets, recette, panoplie)."
        right={items.length > 0 ? <Pill tone="purple">{items.length} résultats</Pill> : undefined}
      />

      {/* Search */}
      <div className="glass mb-4 rounded-2xl p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un équipement (ex : Gelano, Coiffe du Sufokia…)"
            className="no-drag w-full rounded-xl border border-white/10 bg-void-800/60 py-2.5 pl-10 pr-3 text-sm text-slate-200 outline-none transition focus:border-glow-purple/50"
          />
        </div>
        {!hasSearch && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Astuce : sans recherche, on parcourt
            l'emplacement sélectionné par niveau décroissant.
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSlot(null)}
            className={chip(slot === null)}
          >
            Tous
          </button>
          {SLOTS.map((s) => (
            <button key={s.id} onClick={() => setSlot(s.id)} className={chip(slot === s.id)}>
              <s.icon className="h-3.5 w-3.5" /> {s.label}
            </button>
          ))}
          <div className="mx-1 w-px self-stretch bg-white/10" />
          {WEAPON_SLOTS.map((s) => (
            <button key={s.id} onClick={() => setSlot(s.id)} className={chip(slot === s.id)}>
              <Sword className="h-3.5 w-3.5" /> {s.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {LEVEL_PRESETS.map((p, i) => (
            <button key={p.label} onClick={() => setPreset(i)} className={chip(preset === i, "small")}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState message={(error as Error)?.message} onRetry={refetch} />
      ) : items.length === 0 ? (
        <EmptyState
          title="Aucun équipement"
          hint={hasSearch ? "Essayez un autre nom." : "Changez d'emplacement ou de tranche de niveau."}
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.025 } } }}
          className={`grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 ${isFetching ? "opacity-70" : ""}`}
        >
          {items.map((it, i) => (
            <motion.button
              key={it.ankama_id}
              variants={fadeUp}
              custom={i % 16}
              whileHover={{ y: -4 }}
              onClick={() => setSelected(it.ankama_id)}
              className="glass glass-hover no-drag group flex flex-col items-center rounded-2xl p-4 text-center"
            >
              <div className="relative mb-3">
                <div className="absolute inset-0 rounded-full bg-glow-purple/20 opacity-0 blur-xl transition group-hover:opacity-100" />
                <img
                  src={it.image_urls.icon}
                  alt={it.name}
                  loading="lazy"
                  className="relative h-16 w-16 object-contain"
                />
              </div>
              <p className="line-clamp-2 text-sm font-semibold leading-tight text-white">{it.name}</p>
              <div className="mt-2 flex items-center gap-1.5">
                <Pill tone={levelTone(it.level)}>Niv. {it.level}</Pill>
              </div>
              <span className="mt-1 text-[11px] text-slate-500">{it.type.name}</span>
            </motion.button>
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {selected !== null && (
          <ItemModal id={selected} onClose={() => setSelected(null)} onSelectItem={setSelected} />
        )}
      </AnimatePresence>
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
