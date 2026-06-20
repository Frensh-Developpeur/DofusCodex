import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { searchItems, listMonsters, listDungeons, listQuests } from "../api/dofusdb";
import { useDebounce } from "../hooks/useDebounce";
import { ALL_NAV_ITEMS } from "../lib/navItems";
import { WANTED_POSTERS } from "../data/wantedPosters";
import DofusIcon, { type DofusIconName } from "./DofusIcon";
import { Search, X } from "./DofusIcons";

// Événement custom pour ouvrir la palette depuis n'importe où (ex. un bouton de la barre).
export const OPEN_SEARCH_EVENT = "dofuscodex:open-search";
export function openGlobalSearch() {
  window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
}

type Hit = {
  key: string;
  to: string;
  label: string;
  sub?: string;
  group: string;
  icon?: DofusIconName;
  img?: string;
};

const GROUP_ORDER = ["Pages", "Avis de recherche", "Objets", "Monstres", "Donjons", "Quêtes"];

export default function GlobalSearch() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const debounced = useDebounce(query, 250);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Ouverture : Cmd/Ctrl+K (global) ou événement custom (bouton). Fermeture : Échap.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_SEARCH_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_SEARCH_EVENT, onOpen);
    };
  }, []);

  // À l'ouverture : focus + reset. À la fermeture : on vide la requête.
  useEffect(() => {
    if (open) {
      setSel(0);
      const id = window.setTimeout(() => inputRef.current?.focus(), 30);
      return () => window.clearTimeout(id);
    }
    setQuery("");
  }, [open]);

  const term = debounced.trim();
  const hasTerm = term.length >= 2;

  // Sources distantes (DofusDB) — lancées en parallèle, plafonnées par catégorie.
  const { data: remote, isFetching } = useQuery({
    queryKey: ["global-search", term],
    enabled: open && hasTerm,
    placeholderData: keepPreviousData,
    queryFn: async ({ signal }) => {
      const [items, monsters, dungeons, quests] = await Promise.all([
        searchItems(term, 6, signal).catch(() => []),
        listMonsters({ search: term, limit: 6 }, signal).then((r) => r.data).catch(() => []),
        listDungeons({ search: term, limit: 6 }, signal).then((r) => r.data).catch(() => []),
        listQuests({ search: term, limit: 6 }, signal).then((r) => r.data).catch(() => []),
      ]);
      return { items, monsters, dungeons, quests };
    },
  });

  // Résultats locaux (instantanés) : pages du menu + avis de recherche.
  const localHits = useMemo<Hit[]>(() => {
    const t = query.trim().toLowerCase();
    if (!t) return [];
    const out: Hit[] = [];
    const pages = [{ to: "/", label: "Accueil", dofus: "world" as DofusIconName }, ...ALL_NAV_ITEMS.values()];
    for (const p of pages) {
      if (p.label.toLowerCase().includes(t)) out.push({ key: `page:${p.to}`, to: p.to, label: p.label, group: "Pages", icon: p.dofus });
    }
    for (const w of WANTED_POSTERS) {
      if (w.name.toLowerCase().includes(t))
        out.push({ key: `wanted:${w.slug}`, to: `/avis-de-recherche/${w.slug}`, label: w.name, sub: `Niv. ${w.level}`, group: "Avis de recherche", icon: "skull" });
      if (out.filter((h) => h.group === "Avis de recherche").length >= 6) break;
    }
    return out;
  }, [query]);

  const hits = useMemo<Hit[]>(() => {
    const remoteHits: Hit[] = [];
    for (const it of remote?.items ?? [])
      remoteHits.push({ key: `item:${it.id}`, to: `/objets/${it.id}`, label: it.name.fr, sub: `Niv. ${it.level}`, group: "Objets", img: it.img });
    for (const m of remote?.monsters ?? [])
      remoteHits.push({ key: `mob:${m.id}`, to: `/monstres/${m.id}`, label: m.name.fr, sub: m.grades?.[0]?.level ? `Niv. ${m.grades[0].level}` : undefined, group: "Monstres", img: m.img });
    for (const d of remote?.dungeons ?? [])
      remoteHits.push({ key: `dj:${d.id}`, to: `/donjons/${d.id}`, label: d.name.fr, sub: `Niv. ${d.optimalPlayerLevel}`, group: "Donjons", icon: "dungeon" });
    for (const q of remote?.quests ?? [])
      remoteHits.push({ key: `q:${q.id}`, to: `/quetes/${q.id}`, label: q.name.fr, sub: q.levelMin ? `Niv. ${q.levelMin}` : undefined, group: "Quêtes", icon: "quete" });
    const all = [...localHits, ...remoteHits];
    all.sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group));
    return all;
  }, [localHits, remote]);

  // Garder la sélection dans les bornes quand la liste change.
  useEffect(() => {
    setSel((s) => Math.max(0, Math.min(s, hits.length - 1)));
  }, [hits.length]);

  // Faire défiler l'élément sélectionné dans la vue.
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${sel}"]`)?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  function go(hit: Hit | undefined) {
    if (!hit) return;
    navigate(hit.to);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(s + 1, hits.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(hits[sel]);
    }
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[70] flex items-start justify-center bg-black/70 p-4 pt-[12vh] backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="glass flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl ring-1 ring-white/10"
          >
            {/* Barre de recherche */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-slate-500" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Rechercher un objet, monstre, donjon, quête, page…"
                className="no-drag min-w-0 flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
              />
              {isFetching && <span className="h-3 w-3 shrink-0 animate-spin rounded-full border-2 border-glow-purple/40 border-t-glow-purple" />}
              <button
                onClick={() => setOpen(false)}
                className="no-drag shrink-0 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                Échap
              </button>
            </div>

            {/* Résultats */}
            <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto p-2">
              {!hasTerm && localHits.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-slate-500">
                  Tapez au moins 2 caractères — objets, monstres, donjons, quêtes, avis de recherche et pages.
                </p>
              ) : hits.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-slate-500">
                  {isFetching ? "Recherche…" : "Aucun résultat."}
                </p>
              ) : (
                hits.map((hit, i) => {
                  const newGroup = i === 0 || hits[i - 1].group !== hit.group;
                  return (
                    <div key={hit.key}>
                      {newGroup && (
                        <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                          {hit.group}
                        </p>
                      )}
                      <button
                        data-idx={i}
                        onClick={() => go(hit)}
                        onMouseMove={() => setSel(i)}
                        className={`no-drag flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ${
                          i === sel ? "bg-glow-purple/20 ring-1 ring-glow-purple/40" : "hover:bg-white/5"
                        }`}
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-lg bg-void-900/60 ring-1 ring-white/10">
                          {hit.img ? (
                            <img src={hit.img} alt="" loading="lazy" className="h-7 w-7 object-contain" onError={(e) => (e.currentTarget.style.opacity = "0.2")} />
                          ) : (
                            <DofusIcon name={hit.icon ?? "world"} size={16} />
                          )}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">{hit.label}</span>
                        {hit.sub && <span className="shrink-0 text-[11px] text-slate-500">{hit.sub}</span>}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex items-center gap-3 border-t border-white/10 px-4 py-2 text-[10px] text-slate-600">
              <span><kbd className="rounded bg-white/10 px-1">↑</kbd><kbd className="ml-0.5 rounded bg-white/10 px-1">↓</kbd> naviguer</span>
              <span><kbd className="rounded bg-white/10 px-1">↵</kbd> ouvrir</span>
              <span className="ml-auto"><kbd className="rounded bg-white/10 px-1">⌘</kbd><kbd className="ml-0.5 rounded bg-white/10 px-1">K</kbd> recherche</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
