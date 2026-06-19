import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useInfiniteQuery, useQuery, keepPreviousData } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  ArrowDownAZ,
  Check,
  RotateCcw,
} from "./DofusIcons";
import DofusIcon, { effectIconFromName } from "./DofusIcon";
import {
  searchEquipment,
  browseEquipment,
  browseEquipmentAll,
  getEquipment,
  type EquipmentLight,
} from "../api/dofusdude";
import { useDebounce } from "../hooks/useDebounce";
import { levelTone, effectTone } from "../data/meta";
import { Pill, EmptyState } from "./ui";

// Map a slot's allowed DofusDude type.name_id list to localized type names,
// so we can filter free-text search results to the right slot.
const TYPE_NAMES: Record<string, string[]> = {
  hat: ["chapeau"],
  cloak: ["cape"],
  amulet: ["amulette"],
  ring: ["anneau"],
  belt: ["ceinture"],
  boots: ["bottes"],
  shield: ["bouclier"],
  dofus: ["dofus"],
  trophy: ["trophée"],
  prysmaradite: ["prysmaradite", "prisme"],
  pet: ["familier"],
  dragoturkey: ["dragodinde"],
  petsmount: ["montilier"],
  seemyool: ["muldo"],
  rhineetle: ["volkorne"],
  sword: ["épée"],
  bow: ["arc"],
  staff: ["bâton"],
  wand: ["baguette"],
  dagger: ["dague"],
  hammer: ["marteau"],
  axe: ["hache"],
};

// Libellés courts des types, pour les onglets quand un slot accepte plusieurs types.
const TYPE_LABEL: Record<string, string> = {
  dofus: "Dofus",
  trophy: "Trophée",
  prysmaradite: "Prysma",
  pet: "Familier",
  dragoturkey: "Dragodinde",
  petsmount: "Montilier",
  seemyool: "Muldo",
  rhineetle: "Volkorne",
  sword: "Épée",
  bow: "Arc",
  staff: "Bâton",
  wand: "Baguette",
  dagger: "Dague",
  hammer: "Marteau",
  axe: "Hache",
};

const PAGE = 50;
type SortMode = "level-desc" | "level-asc" | "name";

export default function SlotPicker({
  title,
  allowedTypes,
  maxLevel: maxLevelProp = 200,
  currentIds = [],
  onPick,
  onClose,
}: {
  title: string;
  allowedTypes: string[];
  maxLevel?: number;
  currentIds?: number[];
  onPick: (item: EquipmentLight) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [minLevel, setMinLevel] = useState(1);
  const [maxLevel, setMaxLevel] = useState(maxLevelProp);
  const [sort, setSort] = useState<SortMode>("level-desc");
  const [activeType, setActiveType] = useState(allowedTypes[0]);
  // Aperçu des jets au survol d'un objet (chargé à la demande).
  const [hover, setHover] = useState<{ id: number; name: string; rect: DOMRect } | null>(null);
  const debounced = useDebounce(search);
  const hasSearch = debounced.trim().length >= 2;
  const apiSort = sort === "level-asc" ? "asc" : "desc";

  // Dofus & Prysmaradites ont un niveau 0 → le filtre de niveau ne s'applique pas.
  const levelless = activeType === "dofus" || activeType === "prysmaradite";
  const equipped = useMemo(() => new Set(currentIds), [currentIds]);

  const filtersDirty =
    search.trim() !== "" || minLevel !== 1 || maxLevel !== maxLevelProp || sort !== "level-desc";

  // Échap pour fermer (en plus du clic sur le fond et de la croix).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const { data, isLoading, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["picker", title, hasSearch ? debounced : "", activeType, minLevel, maxLevel, apiSort],
      initialPageParam: 1,
      queryFn: async ({ pageParam, signal }) => {
        const lvlMin = levelless ? undefined : minLevel;
        const lvlMax = levelless ? undefined : maxLevel;
        let raw: EquipmentLight[];
        let end: boolean;
        if (hasSearch) {
          raw = await searchEquipment(debounced, PAGE, signal);
          end = true;
        } else {
          try {
            raw = await browseEquipment(
              {
                typeNameId: activeType,
                minLevel: lvlMin,
                maxLevel: lvlMax,
                pageSize: PAGE,
                pageNumber: pageParam,
                sort: apiSort,
              },
              signal,
            );
            end = raw.length < PAGE;
          } catch {
            // L'API rejette page[size] > total (HTTP 400) pour les types peu peuplés
            // (Dofus, Prysma, armes rares) : on récupère tout le type d'un coup.
            if (pageParam === 1) {
              raw = await browseEquipmentAll(
                { typeNameId: activeType, minLevel: lvlMin, maxLevel: lvlMax, sort: apiSort },
                signal,
              );
            } else {
              raw = [];
            }
            end = true;
          }
        }
        // On filtre sur le type sélectionné (onglet actif).
        const allowedNames = TYPE_NAMES[activeType] ?? [];
        let items = raw;
        if (allowedNames.length) {
          items = items.filter((it) => allowedNames.some((n) => it.type.name.toLowerCase().includes(n)));
        }
        // La recherche libre ignore les filtres de niveau de l'API → on borne côté client.
        if (!levelless) items = items.filter((it) => it.level >= minLevel && it.level <= maxLevel);
        return { items, page: pageParam as number, end };
      },
      getNextPageParam: (last) => (last.end ? undefined : last.page + 1),
      placeholderData: keepPreviousData,
    });

  const items = useMemo(() => {
    const arr = (data?.pages ?? []).flatMap((p) => p.items);
    // Le tri par niveau suit déjà l'ordre de l'API ; on ne re-trie côté client que par nom.
    if (sort === "name") arr.sort((a, b) => a.name.localeCompare(b.name));
    // L'objet déjà équipé remonte en tête (repère visuel rapide).
    if (equipped.size) {
      arr.sort((a, b) => Number(equipped.has(b.ankama_id)) - Number(equipped.has(a.ankama_id)));
    }
    return arr;
  }, [data, sort, equipped]);

  function onScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 240 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }

  function resetFilters() {
    setSearch("");
    setMinLevel(1);
    setMaxLevel(maxLevelProp);
    setSort("level-desc");
  }

  const SORTS: { mode: SortMode; icon: typeof ArrowDownAZ; label: string }[] = [
    { mode: "level-desc", icon: ArrowDownWideNarrow, label: "Niv." },
    { mode: "level-asc", icon: ArrowUpNarrowWide, label: "Niv." },
    { mode: "name", icon: ArrowDownAZ, label: "Nom" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="glass flex max-h-[85vh] w-full max-w-2xl flex-col rounded-3xl p-5"
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-white">
            Choisir : {title}
            {!isLoading && items.length > 0 && (
              <span className="ml-2 text-sm font-normal text-slate-500">
                {items.length}
                {hasNextPage ? "+" : ""} objet{items.length > 1 ? "s" : ""}
              </span>
            )}
          </h3>
          <button
            onClick={onClose}
            title="Fermer (Échap)"
            className="no-drag rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Onglets de type (slots multi-types : armes, dofus/trophée/prisme) */}
        {allowedTypes.length > 1 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {allowedTypes.map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`no-drag rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  activeType === t
                    ? "bg-glow-purple/25 text-white ring-1 ring-glow-purple/40"
                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                {TYPE_LABEL[t] ?? t}
              </button>
            ))}
          </div>
        )}

        {/* Recherche */}
        <div className="relative mb-2.5">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && items.length > 0) onPick(items[0]);
            }}
            placeholder={`Rechercher un(e) ${title.toLowerCase()}…`}
            className="no-drag w-full rounded-xl border border-white/10 bg-void-800/60 py-2.5 pl-10 pr-9 text-sm text-slate-200 outline-none transition focus:border-glow-purple/50"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              title="Effacer"
              className="no-drag absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filtres : plage de niveau + tri */}
        <div className="mb-3 space-y-2.5">
          <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${levelless ? "opacity-40" : ""}`}>
            <div className="flex min-w-[230px] flex-1 items-center gap-2">
              <span className="w-14 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Niveau
              </span>
              <span className="w-8 text-center text-xs font-bold text-glow-cyan">{minLevel}</span>
              <div className="flex flex-1 items-center gap-1.5">
                <input
                  type="range"
                  min={1}
                  max={200}
                  value={minLevel}
                  disabled={levelless}
                  onChange={(e) => setMinLevel(Math.min(Number(e.target.value), maxLevel))}
                  className="no-drag flex-1 accent-glow-cyan"
                  title="Niveau minimum"
                />
                <span className="text-xs text-slate-600">→</span>
                <input
                  type="range"
                  min={1}
                  max={200}
                  value={maxLevel}
                  disabled={levelless}
                  onChange={(e) => setMaxLevel(Math.max(Number(e.target.value), minLevel))}
                  className="no-drag flex-1 accent-glow-purple"
                  title="Niveau maximum"
                />
              </div>
              <span className="w-8 text-center text-xs font-bold text-white">{maxLevel}</span>
            </div>
            <div className="flex items-center gap-1">
              {SORTS.map((s) => (
                <button
                  key={s.mode}
                  onClick={() => setSort(s.mode)}
                  title={`Trier par ${s.label.toLowerCase()}`}
                  className={`no-drag inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition ${
                    sort === s.mode
                      ? "bg-glow-purple/25 text-white ring-1 ring-glow-purple/40"
                      : "bg-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  <s.icon className="h-3.5 w-3.5" />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Raccourcis de niveau + réinitialisation */}
          {!levelless && (
            <div className="flex flex-wrap items-center gap-1.5">
              <LevelChip label="Tous" active={minLevel === 1 && maxLevel === 200} onClick={() => { setMinLevel(1); setMaxLevel(200); }} />
              <LevelChip
                label={`Mon niveau (${maxLevelProp})`}
                active={minLevel === 1 && maxLevel === maxLevelProp}
                onClick={() => { setMinLevel(1); setMaxLevel(maxLevelProp); }}
              />
              <LevelChip
                label={`Proches (${Math.max(1, maxLevelProp - 20)}–${maxLevelProp})`}
                active={minLevel === Math.max(1, maxLevelProp - 20) && maxLevel === maxLevelProp}
                onClick={() => { setMinLevel(Math.max(1, maxLevelProp - 20)); setMaxLevel(maxLevelProp); }}
              />
              {filtersDirty && (
                <button
                  onClick={resetFilters}
                  className="no-drag ml-auto inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-medium text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <RotateCcw className="h-3 w-3" /> Réinitialiser
                </button>
              )}
            </div>
          )}
        </div>

        <div
          onScroll={onScroll}
          className={`-mr-2 flex-1 overflow-y-auto pr-2 transition-opacity ${isFetching && !isFetchingNextPage ? "opacity-60" : ""}`}
        >
          {isLoading ? (
            <SkeletonGrid />
          ) : items.length === 0 ? (
            <EmptyState
              title="Aucun objet"
              hint={hasSearch ? "Aucun résultat pour cette recherche." : "Élargissez la plage de niveau ou changez de filtre."}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {items.map((it) => {
                  const isEquipped = equipped.has(it.ankama_id);
                  return (
                    <button
                      key={it.ankama_id}
                      onClick={() => onPick(it)}
                      onMouseEnter={(e) =>
                        setHover({ id: it.ankama_id, name: it.name, rect: e.currentTarget.getBoundingClientRect() })
                      }
                      onMouseLeave={() => setHover((h) => (h?.id === it.ankama_id ? null : h))}
                      className={`no-drag group flex items-center gap-3 rounded-xl border p-2.5 text-left transition ${
                        isEquipped
                          ? "border-glow-emerald/40 bg-glow-emerald/[0.08]"
                          : "border-white/5 bg-white/[0.02] hover:border-glow-purple/40 hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-white/10 to-white/[0.03] ring-1 ring-white/10">
                        <img
                          src={it.image_urls.icon}
                          alt={it.name}
                          loading="lazy"
                          className="h-10 w-10 object-contain"
                        />
                        {isEquipped && (
                          <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-glow-emerald text-void-900 ring-2 ring-void-900">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`truncate text-sm font-semibold ${isEquipped ? "text-glow-emerald" : "text-white group-hover:text-glow-violet"}`}>
                          {it.name}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <Pill tone={levelTone(it.level)}>Niv. {it.level}</Pill>
                          <span className="truncate text-[11px] text-slate-500">{it.type.name}</span>
                          {isEquipped && (
                            <span className="ml-auto shrink-0 text-[10px] font-bold uppercase tracking-wide text-glow-emerald">
                              Équipé
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              {isFetchingNextPage && (
                <p className="py-4 text-center text-xs text-slate-500">Chargement de la suite…</p>
              )}
              {!hasNextPage && !hasSearch && items.length > 8 && (
                <p className="py-4 text-center text-xs text-slate-600">Fin de la liste</p>
              )}
            </>
          )}
        </div>
      </motion.div>

      {/* Aperçu des jets au survol (portal → au-dessus de la modale, hors overflow). */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>{hover && <ItemStatsTooltip key={hover.id} hover={hover} />}</AnimatePresence>,
          document.body,
        )}
    </motion.div>
  );
}

// Bulle d'aperçu : charge le détail de l'objet à la demande et liste ses jets.
function ItemStatsTooltip({ hover }: { hover: { id: number; name: string; rect: DOMRect } }) {
  const { data, isLoading } = useQuery({
    queryKey: ["equipment", hover.id],
    queryFn: ({ signal }) => getEquipment(hover.id, signal),
    staleTime: 1000 * 60 * 30,
  });

  const WIDTH = 260;
  const GAP = 10;
  const { rect } = hover;
  // À droite de la carte si ça tient, sinon à gauche.
  const left = rect.right + GAP + WIDTH <= window.innerWidth ? rect.right + GAP : Math.max(8, rect.left - GAP - WIDTH);
  const top = Math.min(rect.top, window.innerHeight - 320);

  const effects = (data?.effects ?? []).filter((e) => e.formatted);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.12 }}
      style={{ left, top, width: WIDTH }}
      className="pointer-events-none fixed z-[60] origin-left rounded-2xl border border-white/10 bg-void-900/95 p-3 shadow-glow backdrop-blur-md"
    >
      <p className="mb-1 truncate font-display text-sm font-bold text-white">{hover.name}</p>
      {isLoading ? (
        <p className="text-xs text-slate-500">Chargement des jets…</p>
      ) : effects.length === 0 ? (
        <p className="text-xs text-slate-500">Aucun effet.</p>
      ) : (
        <ul className="max-h-72 space-y-0.5 overflow-hidden">
          {effects.map((e, i) => {
            const ic = effectIconFromName(e.type.name);
            return (
              <li key={i} className={`flex items-center gap-1.5 text-[12px] font-medium ${effectTone(e.type.name)}`}>
                {ic && <DofusIcon name={ic} size={13} />}
                <span className="truncate">{e.formatted}</span>
              </li>
            );
          })}
        </ul>
      )}
    </motion.div>
  );
}

function LevelChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`no-drag rounded-lg px-2 py-1 text-[11px] font-medium transition ${
        active
          ? "bg-glow-purple/25 text-white ring-1 ring-glow-purple/40"
          : "bg-white/5 text-slate-400 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
          <div className="h-12 w-12 shrink-0 animate-pulse rounded-lg bg-white/5" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3 w-3/4 animate-pulse rounded bg-white/5" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
