import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Search } from "../components/DofusIcons";
import DofusIcon from "../components/DofusIcon";
import { SectionHeader, Skeleton, ErrorState, EmptyState, fadeUp } from "../components/ui";
import { getDofusNews, NEWS_FEEDS, type NewsCategory, type NewsItem } from "../api/dofusNews";

type Filter = "all" | NewsCategory;

// Teinte par catégorie (réutilise les couleurs de thème → suit le thème actif).
const TONE: Record<NewsCategory, string> = {
  news: "border-glow-cyan/30 bg-glow-cyan/15 text-glow-cyan",
  changelog: "border-glow-emerald/30 bg-glow-emerald/15 text-glow-emerald",
  devblog: "border-glow-purple/30 bg-glow-purple/15 text-glow-violet",
};

function formatDate(ts: number): string {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default function News() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<NewsItem | null>(null);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["dofus-news"],
    queryFn: getDofusNews,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });

  const items = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data ?? []).filter((n) => {
      if (filter !== "all" && n.category !== filter) return false;
      if (q && !(`${n.title} ${n.excerpt}`.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [data, filter, search]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: data?.length ?? 0 };
    for (const n of data ?? []) c[n.category] = (c[n.category] ?? 0) + 1;
    return c;
  }, [data]);

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" className="pb-12">
      <SectionHeader
        eyebrow="Officiel"
        title="Actualités Dofus"
        subtitle="Les dernières annonces, changelogs et devblogs publiés sur dofus.com — mis à jour en direct."
      />

      {/* Filtres : catégories + recherche */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label="Toutes" count={counts.all} />
        {NEWS_FEEDS.map((f) => (
          <FilterChip
            key={f.category}
            active={filter === f.category}
            onClick={() => setFilter(f.category)}
            label={f.label}
            count={counts[f.category] ?? 0}
          />
        ))}
        <div className="relative ml-auto w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une actu"
            className="no-drag w-full rounded-xl border border-white/10 bg-void-800/70 py-2 pl-9 pr-3 text-sm text-slate-200 outline-none focus:border-glow-purple/50"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-72" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState message={(error as Error)?.message} onRetry={refetch} />
      ) : items.length === 0 ? (
        <EmptyState title="Aucune actualité" hint="Essaie un autre filtre ou une autre recherche." />
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.04 } } }}
          className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? "opacity-70" : ""}`}
        >
          {items.map((n, i) => (
            <NewsCard key={n.id} item={n} index={i} onOpen={() => setOpen(n)} />
          ))}
        </motion.div>
      )}

      <AnimatePresence>{open && <ArticleModal item={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </motion.div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`no-drag inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-semibold transition ${
        active
          ? "border-glow-purple/45 bg-glow-purple/20 text-white"
          : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
      }`}
    >
      {label}
      <span className={`text-xs ${active ? "text-glow-violet" : "text-slate-500"}`}>{count}</span>
    </button>
  );
}

function NewsCard({ item, index, onOpen }: { item: NewsItem; index: number; onOpen: () => void }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = item.image && !imageFailed;

  return (
    <motion.button
      custom={index % 9}
      variants={fadeUp}
      onClick={onOpen}
      className="no-drag group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] text-left transition hover:-translate-y-0.5 hover:border-glow-purple/40 hover:shadow-glow"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-void-800">
        {showImage ? (
          <img
            src={item.image}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-slate-700">
            <DofusIcon name="world" size={40} className="opacity-40" />
          </div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-md border px-2 py-0.5 text-[11px] font-bold backdrop-blur ${TONE[item.category]}`}
        >
          {item.categoryLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-slate-500">{formatDate(item.date)}</p>
        <h3 className="mt-1 line-clamp-2 font-display text-base font-bold leading-snug text-white group-hover:text-glow-violet">
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-400">{item.excerpt}</p>
      </div>
    </motion.button>
  );
}

function ArticleModal({ item, onClose }: { item: NewsItem; onClose: () => void }) {
  // Portalisé sur <body> : sinon le `fixed` est piégé par un ancêtre transformé (anim de page,
  // layout overlay) et l'article se retrouve contraint à la zone de contenu / sous la sidebar.
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 16 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-void-900 shadow-card"
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/10 bg-white/[0.035] p-4">
          <div className="min-w-0">
            <span className={`mb-1.5 inline-block rounded-md border px-2 py-0.5 text-[11px] font-bold ${TONE[item.category]}`}>
              {item.categoryLabel}
            </span>
            <h2 className="font-display text-xl font-extrabold leading-tight text-white">{item.title}</h2>
            <p className="mt-1 text-xs text-slate-500">{formatDate(item.date)}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="no-drag shrink-0 rounded-lg border border-white/10 bg-white/[0.04] p-2 text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
          >
            <DofusIcon name="closeRed" size={18} />
          </button>
        </div>

        <div
          className="news-article max-h-[64vh] overflow-y-auto p-5 text-sm leading-relaxed text-slate-300"
          onErrorCapture={(e) => {
            if (e.target instanceof HTMLImageElement) e.target.remove();
          }}
          dangerouslySetInnerHTML={{ __html: item.html }}
        />

        <div className="flex justify-end border-t border-white/10 p-3">
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="no-drag inline-flex items-center gap-2 rounded-xl border border-glow-cyan/35 bg-glow-cyan/15 px-4 py-2 text-sm font-semibold text-glow-cyan transition hover:bg-glow-cyan/25"
          >
            <ExternalLink className="h-4 w-4" /> Lire sur dofus.com
          </a>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
