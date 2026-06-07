import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  ThumbsUp,
  Download,
  BadgeCheck,
  CheckCircle2,
  dofusUiIcon,
  type DofusUiIcon,
} from "../components/DofusIcons";
import DofusIcon from "../components/DofusIcon";
import { STATUS_LABEL, type GuideLight, type GuideStatus } from "../api/ganymede";
import { getGuideListData, getGuideData } from "../lib/guideStore";
import { idbGetStepCounts } from "../lib/guideDb";
import { categoryOf } from "../lib/guideCategory";
import { useDebounce } from "../hooks/useDebounce";
import { useViewState } from "../lib/viewState";
import { useStore, actions } from "../store/store";
import { stripGuideMarkup } from "../lib/guideMarkup";
import { Pill, SectionHeader, Skeleton, EmptyState, ErrorState, fadeUp } from "../components/ui";
import GuideTabs from "../components/GuideTabs";
import GuidesSyncBar from "../components/GuidesSyncBar";

// Un seul jeu d'onglets : progression (perso) puis catégories (type de guide).
const CATEGORIES: { label: string; Icon: DofusUiIcon }[] = [
  { label: "Tous", Icon: dofusUiIcon("book") },
  { label: "Principal", Icon: dofusUiIcon("crown") },
  { label: "Quête", Icon: dofusUiIcon("dofusQuest") },
  { label: "Donjon", Icon: dofusUiIcon("dungeon") },
  { label: "Succès", Icon: dofusUiIcon("trophy") },
  { label: "Frigost", Icon: dofusUiIcon("eau") },
  { label: "Guide", Icon: dofusUiIcon("book") },
];

// Filtres de progression (état perso) — en tête, mis en avant.
const PROGRESS: { label: string; Icon: DofusUiIcon }[] = [
  { label: "En cours", Icon: dofusUiIcon("sablier") },
  { label: "Terminés", Icon: dofusUiIcon("tick") },
  { label: "Favoris", Icon: dofusUiIcon("starFilled") },
];

type SortMode = "likes" | "downloads" | "recent";
const SORTS: { id: SortMode; label: string }[] = [
  { id: "likes", label: "Populaires" },
  { id: "downloads", label: "Téléchargés" },
  { id: "recent", label: "Récents" },
];

const STATUS_TONE: Record<GuideStatus, "gold" | "purple" | "cyan" | "slate"> = {
  gp: "gold",
  certified: "purple",
  public: "cyan",
  draft: "slate",
};

export default function Guides() {
  const [search, setSearch] = useViewState("guides:search", "");
  const [category, setCategory] = useViewState("guides:category", "Tous");
  const [sort, setSort] = useViewState<SortMode>("guides:sort", "likes");
  const debounced = useDebounce(search);

  const guideStep = useStore((s) => s.guideStep);
  const guideTotalSteps = useStore((s) => s.guideTotalSteps);
  const doneGuides = useStore((s) => s.doneGuides);
  const favoriteGuides = useStore((s) => s.favoriteGuides);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["ganymede-guides"],
    queryFn: ({ signal }) => getGuideListData(signal), // local (IndexedDB) → réseau en repli
    staleTime: 1000 * 60 * 30,
  });

  // Charge les totaux d'étapes depuis le cache local des guides (API) → permet aux cards
  // d'afficher « étape X / Y » et de déduire la complétude, même sans les avoir ouverts.
  useEffect(() => {
    idbGetStepCounts()
      .then((counts) => actions.mergeGuideTotalSteps(counts))
      .catch(() => {});
  }, [data]);

  // Base (FR, hors brouillons) filtrée par recherche — sert aussi aux compteurs d'onglets.
  const filtered = useMemo(() => {
    let list = (data ?? []).filter((g) => g.lang === "fr" && g.status !== "draft");
    const q = debounced.trim().toLowerCase();
    if (q.length >= 2)
      list = list.filter(
        (g) => g.name.toLowerCase().includes(q) || (g.user?.name ?? "").toLowerCase().includes(q),
      );
    return list;
  }, [data, debounced]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const g of filtered) {
      const l = categoryOf(g.name).label;
      c[l] = (c[l] ?? 0) + 1;
    }
    return c;
  }, [filtered]);

  // Terminé = marqué explicitement OU étape courante == dernière étape (total connu).
  const isDoneGuide = (g: GuideLight) => {
    if (doneGuides.includes(g.id)) return true;
    const cur = guideStep[g.id];
    const total = guideTotalSteps[g.id];
    return cur != null && total != null && cur >= total - 1;
  };
  // « En cours » = guide commencé (étape > 0) mais pas terminé.
  const isInProgress = (g: GuideLight) => (guideStep[g.id] ?? 0) > 0 && !isDoneGuide(g);

  // Compteurs des filtres de progression (sur la base filtrée statut + recherche).
  const progressCounts = useMemo(
    () => ({
      "En cours": filtered.filter(isInProgress).length,
      "Terminés": filtered.filter(isDoneGuide).length,
      Favoris: filtered.filter((g) => favoriteGuides.includes(g.id)).length,
    }),
    [filtered, guideStep, guideTotalSteps, doneGuides, favoriteGuides],
  );

  const guides = useMemo(() => {
    let list: GuideLight[];
    if (category === "En cours") list = filtered.filter(isInProgress);
    else if (category === "Terminés") list = filtered.filter(isDoneGuide);
    else if (category === "Favoris") list = filtered.filter((g) => favoriteGuides.includes(g.id));
    else if (category === "Tous") list = filtered;
    else list = filtered.filter((g) => categoryOf(g.name).label === category);
    const sorted = [...list];
    if (sort === "likes") sorted.sort((a, b) => b.likes - a.likes);
    else if (sort === "downloads") sorted.sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0));
    else sorted.sort((a, b) => (b.updated_at ?? "").localeCompare(a.updated_at ?? ""));
    // Priorité : les guides en cours remontent en tête (tri stable → ordre conservé).
    if (category !== "En cours")
      sorted.sort((a, b) => Number(isInProgress(b)) - Number(isInProgress(a)));
    return sorted;
  }, [filtered, category, sort, guideStep, guideTotalSteps, doneGuides, favoriteGuides]);

  const total = filtered.length;
  const frTotal = useMemo(
    () => (data ?? []).filter((g) => g.lang === "fr" && g.status !== "draft").length,
    [data],
  );

  return (
    <div>
      <GuideTabs />
      <GuidesSyncBar total={frTotal} />
      <SectionHeader
        eyebrow="Guides"
        title="Guides Ganymède"
        subtitle="Guides communautaires pas-à-pas (quêtes, leveling, donjons, succès). Chaque étape est suivie : reprenez exactement où vous vous êtes arrêté."
        right={<Pill tone="cyan">{total || "—"} guides</Pill>}
      />

      {/* Avertissement compact — guides communautaires (Ganymède) */}
      <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-glow-gold/20 bg-glow-gold/[0.07] px-3.5 py-2 text-xs leading-snug text-slate-300">
        <DofusIcon name="book" size={16} />
        <span>
          <span className="font-semibold text-glow-gold">Guides communautaires (Ganymède)</span> — qualité et
          exactitude variables selon l'auteur ; certains peuvent être incomplets ou datés.
        </span>
      </div>

      <div className="glass mb-6 flex flex-col gap-3 rounded-2xl p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un guide ou un auteur…"
            className="no-drag w-full rounded-xl border border-white/10 bg-void-800/60 py-2.5 pl-10 pr-3 text-sm text-slate-200 outline-none transition focus:border-glow-purple/50"
          />
        </div>
        {/* Une seule rangée : progression (en avant) + catégories, tri à droite */}
        <div className="flex flex-wrap items-center gap-1.5">
          {PROGRESS.map((p) => {
            const n = progressCounts[p.label as keyof typeof progressCounts];
            if (n === 0 && category !== p.label) return null;
            const active = category === p.label;
            return (
              <button
                key={p.label}
                onClick={() => setCategory(p.label)}
                className={`no-drag inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "bg-glow-cyan/25 text-white ring-1 ring-glow-cyan/40"
                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                <p.Icon className="h-3.5 w-3.5" /> {p.label}
                <span className={`text-[10px] ${active ? "text-white/70" : "text-slate-600"}`}>{n}</span>
              </button>
            );
          })}
          <div className="mx-0.5 h-5 w-px self-center bg-white/10" />
          {CATEGORIES.map((c) => {
            const active = category === c.label;
            const n = c.label === "Tous" ? total : counts[c.label] ?? 0;
            if (c.label !== "Tous" && n === 0) return null;
            return (
              <button
                key={c.label}
                onClick={() => setCategory(c.label)}
                className={`no-drag inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "bg-glow-purple/25 text-white ring-1 ring-glow-purple/40"
                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                <c.Icon className="h-3.5 w-3.5" /> {c.label}
                <span className={`text-[10px] ${active ? "text-white/70" : "text-slate-600"}`}>{n}</span>
              </button>
            );
          })}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            title="Trier"
            className="no-drag ml-auto rounded-lg border border-white/10 bg-void-800/60 px-2.5 py-1.5 text-xs font-medium text-slate-300 outline-none transition hover:bg-white/10 focus:border-glow-purple/50"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id} className="bg-void-800">
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState message={(error as Error)?.message} onRetry={refetch} />
      ) : guides.length === 0 ? (
        <EmptyState title="Aucun guide" hint="Ajustez la recherche ou les filtres." />
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.02 } } }}
          className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
        >
          {guides.map((g, i) => (
            <GuideCard
              key={g.id}
              guide={g}
              index={i}
              currentStep={guideStep[g.id]}
              totalSteps={guideTotalSteps[g.id]}
              done={isDoneGuide(g)}
              favorite={favoriteGuides.includes(g.id)}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

function GuideCard({
  guide,
  index,
  currentStep,
  totalSteps,
  done,
  favorite,
}: {
  guide: GuideLight;
  index: number;
  currentStep?: number;
  totalSteps?: number;
  done: boolean;
  favorite: boolean;
}) {
  const excerpt = stripGuideMarkup(guide.description || guide.web_description || "");
  const inProgress = currentStep != null && currentStep > 0 && !done;
  const pct = inProgress && totalSteps ? Math.round(((currentStep + 1) / totalSteps) * 100) : null;
  const cat = categoryOf(guide.name);
  const qc = useQueryClient();

  return (
    <motion.div variants={fadeUp} custom={index % 16} whileHover={{ y: -4 }}>
      <Link
        to={`/guides/${guide.id}`} state={{ fromSection: true }}
        onMouseEnter={() =>
          qc.prefetchQuery({
            queryKey: ["ganymede-guide", guide.id],
            queryFn: ({ signal }) => getGuideData(guide.id, signal),
            staleTime: 1000 * 60 * 30,
          })
        }
        className={`glass no-drag group relative flex h-full flex-col overflow-hidden rounded-2xl p-4 transition-shadow duration-300 hover:shadow-[0_8px_40px_-12px_rgba(124,92,255,0.45)] ${
          done ? "ring-1 ring-glow-emerald/40" : "hover:ring-1 hover:ring-white/15"
        }`}
      >
        {/* halo de catégorie qui s'illumine au survol */}
        <div
          className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${cat.tile} opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100`}
        />

        <div className="relative mb-3 flex items-start gap-3">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cat.tile} ring-1 ring-white/10`}>
            <cat.Icon className={`h-5 w-5 ${cat.text}`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-1.5">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${cat.text}`}>{cat.label}</span>
              {guide.status !== "public" && (
                <Pill tone={STATUS_TONE[guide.status]} className="!px-1.5 !py-0 !text-[10px]">
                  {STATUS_LABEL[guide.status]}
                </Pill>
              )}
            </div>
            <h3 className="line-clamp-2 font-display font-bold leading-tight text-white transition-colors group-hover:text-glow-violet">
              {guide.name}
            </h3>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {done ? (
              <CheckCircle2 className="h-5 w-5 text-glow-emerald" />
            ) : inProgress ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-glow-cyan/15 px-2 py-0.5 text-[10px] font-bold text-glow-cyan">
                <DofusIcon name="sablier" size={12} />
                {totalSteps ? `${currentStep! + 1} / ${totalSteps}` : `étape ${currentStep! + 1}`}
              </span>
            ) : null}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                actions.toggleFavoriteGuide(guide.id);
              }}
              title={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              className={`rounded-md p-1 transition ${
                favorite
                  ? "text-glow-gold"
                  : "text-slate-600 opacity-0 hover:text-glow-gold group-hover:opacity-100"
              }`}
            >
              <DofusIcon name={favorite ? "starFilled" : "starEmpty"} size={16} />
            </button>
          </div>
        </div>

        {excerpt && (
          <p className="relative line-clamp-2 text-xs leading-relaxed text-slate-400">{excerpt}</p>
        )}

        <div className="relative mt-auto flex items-center gap-3 pt-3 text-xs text-slate-500">
          {done ? (
            <span className="inline-flex items-center gap-1 font-semibold text-glow-emerald">
              <CheckCircle2 className="h-3.5 w-3.5" /> Terminé
            </span>
          ) : (
            guide.user && (
              <span className="inline-flex min-w-0 items-center gap-1 truncate">
                {guide.user.is_certified ? <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-glow-purple" /> : null}
                <span className="truncate">{guide.user.name}</span>
              </span>
            )
          )}
          <span className="ml-auto inline-flex shrink-0 items-center gap-1">
            <ThumbsUp className="h-3.5 w-3.5" /> {guide.likes}
          </span>
          {guide.downloads != null && (
            <span className="inline-flex shrink-0 items-center gap-1">
              <Download className="h-3.5 w-3.5" /> {fmt(guide.downloads)}
            </span>
          )}
        </div>

        {/* Barre de progression en bas de la card */}
        {done ? (
          <span className="absolute inset-x-0 bottom-0 h-0.5 bg-glow-emerald/60" />
        ) : inProgress ? (
          <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white/5">
            <span
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-glow-purple to-glow-cyan transition-[width] duration-500"
              style={{ width: pct != null ? `${pct}%` : "40%" }}
            />
          </span>
        ) : null}
      </Link>
    </motion.div>
  );
}

function fmt(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n);
}
