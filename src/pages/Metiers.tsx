import { useEffect, useMemo, useState } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, X, ChevronRight } from "../components/DofusIcons";
import DofusIcon from "../components/DofusIcon";
import { SectionHeader, Pill, Skeleton, EmptyState, ErrorState, LoadMore, Spinner } from "../components/ui";
import { useDebounce } from "../hooks/useDebounce";
import { useViewState } from "../lib/viewState";
import { levelTone } from "../data/meta";
import CraftTree from "../components/CraftTree";
import {
  listJobs,
  listRecipes,
  getRecipesForResult,
  getItemsByIds,
  searchItems,
  type Recipe,
  type ItemLite,
} from "../api/dofusdb";

const PAGE = 50;

export default function Metiers() {
  const [jobId, setJobId] = useViewState<number | null>("metiers:job", null);
  const [term, setTerm] = useState("");
  const debounced = useDebounce(term);
  const [focused, setFocused] = useState<{ id: number; name: string } | null>(null);

  const jobsQ = useQuery({ queryKey: ["jobs"], queryFn: ({ signal }) => listJobs(signal), staleTime: Infinity });
  const jobs = jobsQ.data ?? [];

  // Métier par défaut : le premier (Bûcheron) une fois la liste chargée.
  useEffect(() => {
    if (jobId == null && jobs.length) setJobId(jobs[0].id);
  }, [jobId, jobs, setJobId]);

  const recipesQ = useInfiniteQuery({
    queryKey: ["recipes", jobId],
    queryFn: ({ pageParam, signal }) => listRecipes({ jobId: jobId!, skip: pageParam, limit: PAGE }, signal),
    initialPageParam: 0,
    getNextPageParam: (last) => {
      const loaded = last.skip + last.data.length;
      return loaded < last.total ? loaded : undefined;
    },
    enabled: jobId != null && !focused,
  });
  const recipes = useMemo(() => recipesQ.data?.pages.flatMap((p) => p.data) ?? [], [recipesQ.data]);
  const total = recipesQ.data?.pages[0]?.total;

  // Résolution groupée des objets résultats de la page courante (icône + nom).
  const resultIds = useMemo(() => recipes.map((r) => r.resultId), [recipes]);
  const itemsQ = useQuery({
    queryKey: ["recipe-results", jobId, resultIds.length],
    queryFn: ({ signal }) => getItemsByIds(resultIds, signal),
    enabled: resultIds.length > 0,
    staleTime: Infinity,
  });
  const itemMap = useMemo(() => {
    const m = new Map<number, ItemLite>();
    for (const it of itemsQ.data ?? []) m.set(it.id, it);
    return m;
  }, [itemsQ.data]);

  const searchQ = useQuery({
    queryKey: ["metiers-search", debounced],
    queryFn: ({ signal }) => searchItems(debounced, 12, signal),
    enabled: debounced.trim().length >= 2,
  });

  return (
    <div>
      <SectionHeader
        eyebrow="Encyclopédie"
        title="Métiers & Craft"
        subtitle="Toutes les recettes, par métier. Dépliez un ingrédient pour voir comment le crafter à son tour."
        right={total != null ? <Pill tone="gold">{total} recettes</Pill> : null}
      />

      {/* Recherche d'un objet à crafter */}
      <div className="glass mb-4 rounded-2xl p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Rechercher un objet à fabriquer…"
            className="no-drag w-full rounded-xl border border-white/10 bg-void-800/60 py-2.5 pl-10 pr-3 text-sm text-slate-200 outline-none transition focus:border-glow-purple/50"
          />
          {term.trim().length >= 2 && (
            <div className="absolute z-30 mt-1 max-h-72 w-full overflow-y-auto rounded-xl border border-white/10 bg-void-900/95 p-1 shadow-xl backdrop-blur">
              {(searchQ.data ?? []).map((it) => (
                <button
                  key={it.id}
                  onClick={() => {
                    setFocused({ id: it.id, name: it.name.fr });
                    setTerm("");
                  }}
                  className="no-drag flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-slate-200 transition hover:bg-white/10"
                >
                  <img src={it.img} alt="" loading="lazy" className="h-7 w-7 object-contain" />
                  <span className="min-w-0 flex-1 truncate">{it.name.fr}</span>
                  <span className="text-[10px] text-slate-500">Niv.{it.level}</span>
                </button>
              ))}
              {searchQ.isFetching && <p className="px-2 py-1.5 text-xs text-slate-500">Recherche…</p>}
              {!searchQ.isFetching && (searchQ.data?.length ?? 0) === 0 && (
                <p className="px-2 py-1.5 text-xs text-slate-500">Aucun objet.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {focused ? (
        <FocusedCraft id={focused.id} name={focused.name} onClose={() => setFocused(null)} />
      ) : (
        <>
          {/* Sélecteur de métier */}
          <div className="mb-6 flex flex-wrap gap-1.5">
            {jobsQ.isLoading
              ? Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-8 w-24 rounded-lg" />)
              : jobs.map((j) => (
                  <button key={j.id} onClick={() => setJobId(j.id)} className={chip(jobId === j.id)}>
                    <DofusIcon name="job" size={14} /> {j.name.fr}
                  </button>
                ))}
          </div>

          {recipesQ.isLoading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-2xl" />
              ))}
            </div>
          ) : recipesQ.isError ? (
            <ErrorState message="Impossible de charger les recettes." onRetry={() => recipesQ.refetch()} />
          ) : recipes.length === 0 ? (
            <EmptyState title="Aucune recette" hint="Ce métier n'a pas de recette répertoriée." />
          ) : (
            <>
              <div className="flex flex-col gap-2">
                {recipes.map((r, i) => (
                  <RecipeRow key={`${r.id}-${i}`} recipe={r} result={itemMap.get(r.resultId)} index={i} />
                ))}
              </div>
              <LoadMore
                hasMore={!!recipesQ.hasNextPage}
                loading={recipesQ.isFetchingNextPage}
                onClick={() => recipesQ.fetchNextPage()}
                count={recipes.length}
                total={total}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

// Une recette (résultat) dépliable vers son arbre d'ingrédients.
function RecipeRow({ recipe, result, index }: { recipe: Recipe; result?: ItemLite; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 16) * 0.02 }}
      className="glass overflow-hidden rounded-2xl"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="no-drag flex w-full items-center gap-3 p-3 text-left transition hover:bg-white/[0.03]"
      >
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-void-900/60">
          {result?.img ? (
            <img src={result.img} alt="" loading="lazy" className="h-10 w-10 object-contain" />
          ) : (
            <DofusIcon name="recipe" size={20} />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-white">{result?.name.fr ?? `Objet #${recipe.resultId}`}</p>
          <p className="text-xs text-slate-500">{recipe.ingredientIds.length} ingrédients</p>
        </div>
        {recipe.resultLevel > 0 && <Pill tone={levelTone(recipe.resultLevel)}>Niv. {recipe.resultLevel}</Pill>}
        <ChevronRight className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <div className="border-t border-white/5 p-3">
          <CraftTree recipe={recipe} />
        </div>
      )}
    </motion.div>
  );
}

// Vue focalisée : la recette d'un objet recherché (avec arbre déplié d'office).
function FocusedCraft({ id, name, onClose }: { id: number; name: string; onClose: () => void }) {
  const recipeQ = useQuery({
    queryKey: ["recipe-for", id],
    queryFn: ({ signal }) => getRecipesForResult(id, signal),
    staleTime: Infinity,
  });
  const recipe = recipeQ.data?.[0];
  return (
    <div>
      <button
        onClick={onClose}
        className="no-drag mb-4 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10"
      >
        <X className="h-3.5 w-3.5" /> Retour aux métiers
      </button>
      <div className="glass rounded-2xl p-4">
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-white">
          <DofusIcon name="recipe" size={18} /> {name}
        </h2>
        {recipeQ.isLoading ? (
          <Spinner />
        ) : recipe ? (
          <CraftTree recipe={recipe} />
        ) : (
          <p className="text-sm text-slate-400">
            Cet objet n'a pas de recette de craft (ressource de base, drop, ou récompense).
          </p>
        )}
      </div>
    </div>
  );
}

function chip(active: boolean) {
  const base = "no-drag inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ";
  return active ? `${base} bg-glow-purple/25 text-white ring-1 ring-glow-purple/40` : `${base} bg-white/5 text-slate-400 hover:bg-white/10`;
}
