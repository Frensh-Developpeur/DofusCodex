import { useMemo, useState } from "react";
import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, X, ArrowDownWideNarrow, ArrowUpNarrowWide, ArrowDownAZ } from "lucide-react";
import { searchEquipment, browseEquipment, browseEquipmentAll, type EquipmentLight } from "../api/dofusdude";
import { useDebounce } from "../hooks/useDebounce";
import { levelTone } from "../data/meta";
import { Pill, Spinner, EmptyState } from "./ui";

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
  onPick,
  onClose,
}: {
  title: string;
  allowedTypes: string[];
  maxLevel?: number;
  onPick: (item: EquipmentLight) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [maxLevel, setMaxLevel] = useState(maxLevelProp);
  const [sort, setSort] = useState<SortMode>("level-desc");
  const [activeType, setActiveType] = useState(allowedTypes[0]);
  const debounced = useDebounce(search);
  const hasSearch = debounced.trim().length >= 2;
  const apiSort = sort === "level-asc" ? "asc" : "desc";

  const { data, isLoading, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["picker", title, hasSearch ? debounced : "", activeType, maxLevel, apiSort],
      initialPageParam: 1,
      queryFn: async ({ pageParam, signal }) => {
        // Dofus & Prysmaradites ont un niveau 0 : le filtre API max_level les exclut → on l'omet.
        const levelless = activeType === "dofus" || activeType === "prysmaradite";
        const lvl = levelless ? undefined : maxLevel;
        let raw: EquipmentLight[];
        let end: boolean;
        if (hasSearch) {
          raw = await searchEquipment(debounced, PAGE, signal);
          end = true;
        } else {
          try {
            raw = await browseEquipment(
              { typeNameId: activeType, maxLevel: lvl, pageSize: PAGE, pageNumber: pageParam, sort: apiSort },
              signal,
            );
            end = raw.length < PAGE;
          } catch {
            // L'API rejette page[size] > total (HTTP 400) pour les types peu peuplés
            // (Dofus, Prysma, armes rares) : on récupère tout le type d'un coup.
            if (pageParam === 1) {
              raw = await browseEquipmentAll({ typeNameId: activeType, maxLevel: lvl, sort: apiSort }, signal);
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
        if (!levelless) items = items.filter((it) => it.level <= maxLevel);
        return { items, page: pageParam as number, end };
      },
      getNextPageParam: (last) => (last.end ? undefined : last.page + 1),
      placeholderData: keepPreviousData,
    });

  const items = useMemo(() => {
    const arr = (data?.pages ?? []).flatMap((p) => p.items);
    // Le tri par niveau suit déjà l'ordre de l'API ; on ne re-trie côté client que par nom.
    if (sort === "name") arr.sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [data, sort]);

  function onScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 240 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
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
        className="glass flex max-h-[82vh] w-full max-w-2xl flex-col rounded-3xl p-5"
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-white">
            Choisir : {title}
            {items.length > 0 && (
              <span className="ml-2 text-sm font-normal text-slate-500">{items.length} objets</span>
            )}
          </h3>
          <button
            onClick={onClose}
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
        <div className="relative mb-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Rechercher un(e) ${title.toLowerCase()}…`}
            className="no-drag w-full rounded-xl border border-white/10 bg-void-800/60 py-2.5 pl-10 pr-3 text-sm text-slate-200 outline-none transition focus:border-glow-purple/50"
          />
        </div>

        {/* Filtres : niveau max + tri */}
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <div className="flex flex-1 items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Niv. max</span>
            <input
              type="range"
              min={1}
              max={200}
              value={maxLevel}
              onChange={(e) => setMaxLevel(Number(e.target.value))}
              className="no-drag flex-1 accent-glow-purple"
            />
            <span className="w-9 text-right text-sm font-bold text-white">{maxLevel}</span>
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

        <div
          onScroll={onScroll}
          className={`-mr-2 flex-1 overflow-y-auto pr-2 ${isFetching && !isFetchingNextPage ? "opacity-70" : ""}`}
        >
          {isLoading ? (
            <Spinner label="Chargement…" />
          ) : items.length === 0 ? (
            <EmptyState title="Aucun objet" hint="Essayez un autre nom ou augmentez le niveau max." />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {items.map((it) => (
                  <button
                    key={it.ankama_id}
                    onClick={() => onPick(it)}
                    className="no-drag group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-left transition hover:border-glow-purple/40 hover:bg-white/[0.06]"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-white/10 to-white/[0.03] ring-1 ring-white/10">
                      <img
                        src={it.image_urls.icon}
                        alt={it.name}
                        loading="lazy"
                        className="h-10 w-10 object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white group-hover:text-glow-violet">
                        {it.name}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <Pill tone={levelTone(it.level)}>Niv. {it.level}</Pill>
                        <span className="truncate text-[11px] text-slate-500">{it.type.name}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {isFetchingNextPage && (
                <p className="py-4 text-center text-xs text-slate-500">Chargement de la suite…</p>
              )}
              {!hasNextPage && !hasSearch && (
                <p className="py-4 text-center text-xs text-slate-600">Fin de la liste</p>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
