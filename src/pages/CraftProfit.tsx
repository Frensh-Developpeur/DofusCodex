import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import DofusIcon from "../components/DofusIcon";
import { SectionHeader, Pill, Skeleton, EmptyState, ErrorState, Spinner } from "../components/ui";
import { levelTone } from "../data/meta";
import { useViewState } from "../lib/viewState";
import {
  getItemsByIds,
  listJobs,
  listItemTypes,
  listRecipesForJobRange,
  resolveItemsByName,
  type ItemLite,
  type ItemType,
  type Job,
  type Recipe,
} from "../api/dofusdb";

const MAX_LEVEL = 200;
const BAND_SIZE = 20;
const STEP_SIZE = 5;
const DEFAULT_XP_COEF = 100;
// Pénalité appliquée à une recette qu'on a déjà quittée : assez forte pour ne pas
// y revenir (variété des objets), mais sans toucher la recette courante (un craft
// qui domine vraiment reste choisi et toutes ses étapes fusionnent en une seule).
const DIVERSITY_PENALTY = 3;

const GATHER_JOB_IDS = new Set([2, 24, 26, 28, 36, 41]);
const MAGE_JOB_IDS = new Set([44, 48, 62, 63, 64, 74]);
// Métiers Temporis (serveurs événementiels) masqués de la page : Parchomage, Bestiologue.
const TEMPORIS_JOB_IDS = new Set([75, 78]);

const COMMON_TYPE_HINTS = [
  "bois",
  "minerai",
  "céréale",
  "cereale",
  "plante",
  "fleur",
  "poisson",
  "viande",
  "farine",
  "pain",
  "planche",
  "alliage",
  "potion",
  "huile",
];

const COSTLY_NAME_HINTS = [
  "galet",
  "kolizéton",
  "kolizeton",
  "pépite",
  "pepite",
  "rose des sables",
  "fragment",
  "essence de gardien",
  "ressource de boss",
  "dofus",
  "parchemin de sort",
  "tourmaline",
  "orichor",
];

const SOURCES = [
  { label: "Recettes & métiers : DofusDB", href: "https://dofusdb.fr/fr/" },
  { label: "Guide craft : Dafous", href: "https://dafous.app/craft-dofus" },
  { label: "Forum Dofus : guide métiers", href: "https://www.dofus.com/fr/forum/1992-tutoriels-astuces/2435565-guide-ultime-monter-metiers" },
  { label: "Métiers de récolte : Gamosaurus", href: "https://www.gamosaurus.com/jeux/dofus/dofus-unity-liste-des-meilleurs-metiers-de-recolte" },
];

function clampLevel(n: number): number {
  return Math.max(1, Math.min(MAX_LEVEL, Math.floor(n) || 1));
}

function fmt(n: number): string {
  return Math.round(n).toLocaleString("fr-FR");
}

function itemMapOf(items?: ItemLite[]): Map<number, ItemLite> {
  const m = new Map<number, ItemLite>();
  for (const it of items ?? []) m.set(it.id, it);
  return m;
}

function typeMapOf(types?: ItemType[]): Map<number, string> {
  const m = new Map<number, string>();
  for (const t of types ?? []) m.set(t.id, t.name?.fr ?? "");
  return m;
}

function jobKind(job?: Job): "gather" | "mage" | "craft" | "special" {
  if (!job) return "craft";
  if (GATHER_JOB_IDS.has(job.id)) return "gather";
  if (MAGE_JOB_IDS.has(job.id)) return "mage";
  if (job.id === 79) return "special"; // Éleveur : module d'élevage, pas de parcours de recettes
  return "craft";
}

export default function CraftProfit() {
  const [jobId, setJobId] = useViewState<number | null>("craft-route:job", null);
  const [currentLevel, setCurrentLevel] = useViewState("craft-route:current", 1);
  const [targetLevel, setTargetLevel] = useViewState("craft-route:target", 200);
  const [openKey, setOpenKey] = useState<string | null>(null);

  const jobsQ = useQuery({ queryKey: ["jobs"], queryFn: ({ signal }) => listJobs(signal), staleTime: Infinity });
  // On masque les métiers Temporis (événementiels) : 78 Bestiologue, 75 Parchomage.
  const jobs = (jobsQ.data ?? []).filter((j) => !TEMPORIS_JOB_IDS.has(j.id));

  useEffect(() => {
    if (jobId == null && jobs.length) setJobId(jobs[0].id);
  }, [jobId, jobs, setJobId]);

  const selectedJob = jobs.find((j) => j.id === jobId);
  const kind = jobKind(selectedJob);
  const minLevel = Math.max(1, currentLevel);
  const maxLevel = Math.max(minLevel, targetLevel);

  const recipesQ = useQuery({
    queryKey: ["craft-route-recipes", jobId, minLevel, maxLevel],
    queryFn: ({ signal }) => listRecipesForJobRange(jobId!, 1, maxLevel, signal),
    enabled: jobId != null && kind !== "special",
    staleTime: 1000 * 60 * 15,
  });
  const recipes = recipesQ.data ?? [];

  const itemIds = useMemo(() => {
    const s = new Set<number>();
    for (const r of recipes) {
      s.add(r.resultId);
      for (const id of r.ingredientIds) s.add(id);
    }
    return [...s];
  }, [recipes]);

  const itemsQ = useQuery({
    queryKey: ["craft-route-items", itemIds.join(",")],
    queryFn: ({ signal }) => getItemsByIds(itemIds, signal),
    enabled: itemIds.length > 0,
    staleTime: Infinity,
  });
  const itemById = useMemo(() => itemMapOf(itemsQ.data), [itemsQ.data]);
  const itemTypesQ = useQuery({
    queryKey: ["item-types"],
    queryFn: ({ signal }) => listItemTypes(signal),
    staleTime: Infinity,
  });
  const typeNameById = useMemo(() => typeMapOf(itemTypesQ.data), [itemTypesQ.data]);
  const bands = useMemo(
    () => buildRoute(recipes, itemById, typeNameById, minLevel, maxLevel, kind),
    [recipes, itemById, typeNameById, minLevel, maxLevel, kind],
  );

  return (
    <div>
      <SectionHeader
        eyebrow="Monde"
        title="XP métier"
        subtitle="Un chemin de montée par métier : une recette recommandée par étape, quantités à crafter et total des ingrédients à préparer."
        right={
          <div className="flex flex-wrap justify-end gap-2">
            <Pill tone="gold">{bands.length} paliers</Pill>
            {recipes.length > 0 && <Pill tone="emerald">{recipes.length} recettes analysées</Pill>}
          </div>
        }
      />

      <div className="mb-5 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_340px]">
        <div className="glass rounded-2xl p-4">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {jobsQ.isLoading
              ? Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-8 w-24 rounded-lg" />)
              : jobs.map((j) => (
                  <button key={j.id} onClick={() => setJobId(j.id)} className={chip(jobId === j.id)}>
                    <DofusIcon name="job" size={14} /> {j.name.fr}
                  </button>
                ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            <Field label="Départ">
              <NumberInput value={currentLevel} min={1} max={MAX_LEVEL} onChange={(v) => setCurrentLevel(clampLevel(v))} />
            </Field>
            <Field label="Objectif">
              <NumberInput value={targetLevel} min={currentLevel} max={MAX_LEVEL} onChange={(v) => setTargetLevel(clampLevel(v))} />
            </Field>
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Profil</p>
              <p className="mt-1 text-sm font-semibold text-white">{profileLabel(kind)}</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Méthode</p>
              <p className="mt-1 text-sm font-semibold text-white">{methodLabel(kind)}</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <h2 className="mb-2 flex items-center gap-2 font-display font-bold text-white">
            <DofusIcon name="book" size={18} /> Sources
          </h2>
          <p className="mb-3 text-sm leading-relaxed text-slate-400">
            Les paliers sont générés depuis les recettes DofusDB. La logique suit les guides métier actuels :
            monter avec les recettes proches du niveau, mais en priorisant les composants historiquement bas
            (récolte commune, transformations simples) et en évitant galets, fragments, essences et ressources boss.
            Les quantités utilisent la formule de l'outil XP Métier DofusDB.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SOURCES.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="no-drag rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {kind === "special" ? (
        <BreederPlan job={selectedJob} />
      ) : kind === "mage" && !recipesQ.isLoading && recipes.length === 0 ? (
        <MageJobPlan job={selectedJob} />
      ) : recipesQ.isLoading || itemsQ.isLoading ? (
        <Spinner label="Construction du parcours…" />
      ) : recipesQ.isError ? (
        <ErrorState message="Impossible de charger les recettes du métier." onRetry={() => recipesQ.refetch()} />
      ) : bands.length === 0 ? (
        <EmptyState title="Aucun parcours généré" hint="Ce métier n'a pas assez de recettes dans cette tranche." />
      ) : (
        <div className="space-y-3">
          {bands.map((band, i) => (
            <BandCard
              key={`${band.from}-${band.to}`}
              band={band}
              index={i}
              openKey={openKey}
              setOpenKey={setOpenKey}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface RoutePick {
  recipe: Recipe;
  result?: ItemLite;
  ingredients: { id: number; quantity: number; item?: ItemLite }[];
  score: number;
  effort: number;
  sameBandIngredients: number;
  cheapScore: number;
  costlyHits: number;
}

interface RouteStep {
  from: number;
  to: number;
  craftCap: number;
  pick: RoutePick;
  quantity: number;
  xpGained: number;
}

interface RouteBand {
  from: number;
  to: number;
  focus: string;
  note: string;
  steps: RouteStep[];
}

function buildRoute(
  recipes: Recipe[],
  itemById: Map<number, ItemLite>,
  typeNameById: Map<number, string>,
  minLevel: number,
  maxLevel: number,
  kind: "gather" | "mage" | "craft" | "special",
): RouteBand[] {
  const bands: RouteBand[] = [];
  let from = minLevel;
  while (from < maxLevel) {
    const to = Math.min(maxLevel, from <= 1 ? 20 : from + BAND_SIZE);
    const rawSteps: RouteStep[] = [];
    let cursor = from;
    let actualXp = levelToJobXp(cursor);
    const closedRecipes = new Set<number>();
    let lastRecipeId: number | null = null;
    while (cursor < to) {
      const craftCap = Math.max(1, xpToJobLevel(actualXp));
      const candidates = recipes
        .filter((r) => r.resultLevel >= Math.max(1, craftCap - 20) && r.resultLevel <= craftCap)
        .map((r) => scoreRoutePick(r, itemById, typeNameById, cursor, to, craftCap, kind))
        .sort((a, b) => b.score - a.score);
      // On garde la recette courante tant qu'elle domine (ses étapes fusionnent
      // ensuite en une seule) ; les recettes déjà quittées sont pénalisées pour
      // varier les objets quand aucune ne domine vraiment.
      const pick = candidates
        .map((c) => ({ c, eff: c.score - (closedRecipes.has(c.recipe.id) ? DIVERSITY_PENALTY : 0) }))
        .sort((a, b) => b.eff - a.eff)[0]?.c;
      if (!pick) break;
      const stepTo = nextStepTarget(cursor, to);
      const step = estimateStep(pick, cursor, stepTo, craftCap, actualXp);
      if (step.quantity < 1 || step.xpGained < 1) break;
      if (lastRecipeId != null && lastRecipeId !== pick.recipe.id) closedRecipes.add(lastRecipeId);
      lastRecipeId = pick.recipe.id;
      rawSteps.push(step);
      actualXp += step.xpGained;
      const nextCursor = Math.min(to, Math.max(stepTo, xpToJobLevel(actualXp)));
      if (nextCursor <= cursor) break;
      cursor = nextCursor;
    }
    const steps = mergeAdjacentSteps(rawSteps);
    if (!steps.length) {
      from = to;
      continue;
    }
    bands.push({
      from,
      to,
      focus: focusFor(kind, from, to),
      note: noteFor(kind, from, to, steps),
      steps,
    });
    from = to;
  }
  return bands;
}

// Fusionne les étapes consécutives qui utilisent la même recette : si un seul
// objet est le plus rentable sur tout le palier, on obtient une étape unique.
function mergeAdjacentSteps(steps: RouteStep[]): RouteStep[] {
  const out: RouteStep[] = [];
  for (const step of steps) {
    const prev = out[out.length - 1];
    if (prev && prev.pick.recipe.id === step.pick.recipe.id) {
      out[out.length - 1] = {
        ...prev,
        to: step.to,
        craftCap: Math.max(prev.craftCap, step.craftCap),
        quantity: prev.quantity + step.quantity,
        xpGained: prev.xpGained + step.xpGained,
      };
    } else {
      out.push(step);
    }
  }
  return out;
}

function nextStepTarget(from: number, bandTo: number): number {
  if (from <= 1) return Math.min(bandTo, 7);
  return Math.min(bandTo, from + STEP_SIZE);
}

function estimateStep(pick: RoutePick, from: number, to: number, craftCap: number, startingXp: number): RouteStep {
  const targetXp = levelToJobXp(to);
  let actualXp = Math.max(startingXp, levelToJobXp(from));
  let quantity = 0;
  let xpGained = 0;
  while (actualXp < targetXp && quantity < 99999) {
    const jobLevel = xpToJobLevel(actualXp);
    const craftXp = getCraftXpByJobLevel(pick.recipe, jobLevel);
    if (craftXp < 1) break;
    actualXp += craftXp;
    xpGained += craftXp;
    quantity += 1;
  }
  return { from, to, craftCap, pick, quantity, xpGained };
}

function xpToJobLevel(xp: number): number {
  return Math.max(Math.min(Math.floor((Math.sqrt(1 + 0.4 * xp) + 1) / 2), MAX_LEVEL), 1);
}

function levelToJobXp(level: number): number {
  return level * (level - 1) * 10;
}

function getCraftXpByJobLevel(recipe: Recipe, jobLevel: number): number {
  if (jobLevel - 100 > recipe.resultLevel) return 0;
  const base = (20 * recipe.resultLevel) / (((jobLevel - recipe.resultLevel) ** 1.1) / 10 + 1);
  const xp = Math.floor(base) * (DEFAULT_XP_COEF / 100);
  return Number.isNaN(xp) ? 0 : Math.floor(xp);
}

function scoreRoutePick(
  recipe: Recipe,
  itemById: Map<number, ItemLite>,
  typeNameById: Map<number, string>,
  from: number,
  to: number,
  craftCap: number,
  kind: "gather" | "mage" | "craft" | "special",
): RoutePick {
  const ingredients = recipe.ingredientIds.map((id, i) => ({
    id,
    quantity: recipe.quantities[i] ?? 1,
    item: itemById.get(id),
  }));
  const quantityTotal = ingredients.reduce((s, it) => s + it.quantity, 0);
  const ingredientCount = ingredients.length || 1;
  const cheapStats = ingredients.map((it) => ingredientCheapness(it.item, typeNameById, from, craftCap));
  const cheapScore = cheapStats.reduce((s, it) => s + it.score, 0) / ingredientCount;
  const costlyHits = cheapStats.filter((it) => it.costly).length;
  const sameBandIngredients = ingredients.filter((it) => {
    const level = it.item?.level ?? 0;
    return level >= Math.max(1, craftCap - 30) && level <= craftCap + 10;
  }).length;

  // Meilleur compromis du parcours d'XP = maximiser l'XP par unité de coût, pas juste
  // la simplicité. On rapporte l'XP RÉELLE d'un craft (formule DofusDB, max près du cap)
  // au coût estimé des ingrédients (proxy via « cheapness » — pas de prix marché en public).
  let costPerCraft = 0.6; // coût fixe de manipulation par craft
  ingredients.forEach((it, i) => {
    const unit = Math.max(0.2, 1.45 - cheapStats[i].score) + (cheapStats[i].costly ? 4 : 0);
    costPerCraft += unit * it.quantity;
  });
  const xpPerCraft = Math.max(1, getCraftXpByJobLevel(recipe, craftCap));
  const efficiency = xpPerCraft / costPerCraft; // XP par unité de coût
  // Pondérations légères et multiplicatives (l'efficacité reste le critère dominant).
  const simplicityFactor = 1 + Math.max(0, 3 - ingredientCount) * 0.05; // un poil moins d'ingrédients à chasser
  const gatherFactor = kind === "gather" ? 1 + (sameBandIngredients / ingredientCount) * 0.3 : 1; // récolte : tu farms tes propres composants
  const accessibility = recipe.resultLevel <= craftCap ? 1 : 0.55; // au-dessus du cap = quasi pas craftable
  const score = efficiency * simplicityFactor * gatherFactor * accessibility;
  return {
    recipe,
    result: itemById.get(recipe.resultId),
    ingredients,
    score,
    effort: ingredientCount * 10 + quantityTotal,
    sameBandIngredients,
    cheapScore,
    costlyHits,
  };
}

function ingredientCheapness(
  item: ItemLite | undefined,
  typeNameById: Map<number, string>,
  from: number,
  to: number,
): { score: number; costly: boolean } {
  if (!item) return { score: 0.25, costly: false };
  const name = item.name.fr.toLowerCase();
  const type = item.typeId != null ? (typeNameById.get(item.typeId) ?? "").toLowerCase() : "";
  const level = item.level ?? 0;
  const commonType = COMMON_TYPE_HINTS.some((hint) => type.includes(hint) || name.includes(hint));
  const costly = COSTLY_NAME_HINTS.some((hint) => name.includes(hint) || type.includes(hint));
  const inBand = level <= to + 10;
  const lowForBand = level <= Math.max(to, from + 20);
  let score = 0.45;
  if (commonType) score += 0.45;
  if (inBand) score += 0.25;
  if (lowForBand) score += 0.15;
  if (level <= 20) score += 0.1;
  if (costly) score -= 0.75;
  if (level > to + 40) score -= 0.25;
  return { score: Math.max(0, Math.min(1.25, score)), costly };
}

function BandCard({
  band,
  index,
  openKey,
  setOpenKey,
}: {
  band: RouteBand;
  index: number;
  openKey: string | null;
  setOpenKey: (v: string | null) => void;
}) {
  const totals = useMemo(() => bandTotals(band.steps), [band.steps]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 16) * 0.02 }}
      className="glass rounded-2xl p-4"
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-lg font-bold text-white">
              Niveaux {band.from} → {band.to}
            </h2>
            <Pill tone={levelTone(band.to)}>{band.focus}</Pill>
          </div>
          <p className="mt-1 text-sm text-slate-400">{band.note}</p>
        </div>
        <Pill tone="slate">{band.steps.length} étapes</Pill>
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="grid gap-2">
          {band.steps.map((step, i) => {
            const key = `${band.from}-${step.from}-${step.pick.recipe.id}`;
            return (
              <RouteStepCard
                key={key}
                step={step}
                rank={i + 1}
                open={openKey === key}
                onToggle={() => setOpenKey(openKey === key ? null : key)}
              />
            );
          })}
        </div>
        <BandTotals totals={totals} />
      </div>
    </motion.div>
  );
}

function RouteStepCard({ step, rank, open, onToggle }: { step: RouteStep; rank: number; open: boolean; onToggle: () => void }) {
  const pick = step.pick;
  const recipeTotal = useMemo(
    () => pick.ingredients.map((it) => ({ ...it, quantity: it.quantity * step.quantity })),
    [pick.ingredients, step.quantity],
  );
  return (
    <div className="overflow-hidden rounded-xl border border-white/5 bg-white/[0.025]">
      <button onClick={onToggle} className="no-drag flex w-full items-center gap-3 p-3 text-left transition hover:bg-white/[0.04]">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-void-900/70">
          {pick.result?.img ? <img src={pick.result.img} alt="" loading="lazy" className="h-9 w-9 object-contain" /> : <DofusIcon name="recipe" size={18} />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <span className="rounded-md bg-glow-purple/15 px-1.5 py-0.5 text-[10px] font-bold text-glow-violet">
              {rank}. {step.from} → {step.to}
            </span>
            <Link
              to={`/objets/${pick.recipe.resultId}`}
              state={{ returnTo: "/rentabilite-metiers", returnLabel: "XP métier" }}
              onClick={(e) => e.stopPropagation()}
              className="no-drag truncate font-semibold text-white hover:text-glow-violet"
            >
              {pick.result?.name.fr ?? `Objet #${pick.recipe.resultId}`}
            </Link>
            <Pill tone="gold">×{fmt(step.quantity)}</Pill>
            <Pill tone={levelTone(pick.recipe.resultLevel)}>Niv.{pick.recipe.resultLevel}</Pill>
            <Pill tone="slate">craft max niv.{step.craftCap}</Pill>
            <Pill tone={pick.costlyHits > 0 ? "ember" : pick.cheapScore >= 0.9 ? "emerald" : "slate"}>
              {pick.costlyHits > 0 ? "à surveiller" : pick.cheapScore >= 0.9 ? "bas coût" : "standard"}
            </Pill>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {fmt(step.xpGained)} XP · {pick.ingredients.length} ingrédients · {fmt(recipeTotal.reduce((s, it) => s + it.quantity, 0))} unités au total
          </p>
        </div>
        <DofusIcon name="recipe" size={16} className="shrink-0 opacity-60" />
      </button>
      {open && (
        <div className="border-t border-white/5 p-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Cumul de l'étape</p>
            <Pill tone="slate">
              {fmt(step.quantity)} crafts pour {step.from} → {step.to}
            </Pill>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {recipeTotal.map((it) => (
              <Ingredient key={it.id} ingredient={it} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function bandTotals(steps: RouteStep[]) {
  const m = new Map<number, RoutePick["ingredients"][number]>();
  for (const step of steps) {
    const pick = step.pick;
    for (const ingredient of pick.ingredients) {
      const prev = m.get(ingredient.id);
      m.set(ingredient.id, {
        ...ingredient,
        quantity: (prev?.quantity ?? 0) + ingredient.quantity * step.quantity,
        item: ingredient.item ?? prev?.item,
      });
    }
  }
  return [...m.values()].sort((a, b) => b.quantity - a.quantity || (a.item?.level ?? 0) - (b.item?.level ?? 0));
}

function BandTotals({ totals }: { totals: RoutePick["ingredients"] }) {
  return (
    <div className="rounded-xl border border-white/5 bg-void-900/45 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 font-display text-sm font-bold text-white">
          <DofusIcon name="resources" size={16} /> Total palier
        </h3>
        <Pill tone="slate">{totals.length}</Pill>
      </div>
      <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
        {totals.map((it) => (
          <Ingredient key={it.id} ingredient={it} />
        ))}
      </div>
    </div>
  );
}

function Ingredient({ ingredient }: { ingredient: RoutePick["ingredients"][number] }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-void-900/40 p-2">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-void-950/70">
        {ingredient.item?.img ? <img src={ingredient.item.img} alt="" loading="lazy" className="h-7 w-7 object-contain" /> : <DofusIcon name="resources" size={14} />}
      </span>
      <div className="min-w-0 flex-1">
        <Link
          to={`/objets/${ingredient.id}`}
          state={{ returnTo: "/rentabilite-metiers", returnLabel: "XP métier" }}
          className="no-drag block truncate text-sm text-slate-200 hover:text-white"
        >
          {ingredient.item?.name.fr ?? `#${ingredient.id}`}
        </Link>
        {ingredient.item?.level ? <p className="text-[11px] text-slate-500">Niv.{ingredient.item.level}</p> : null}
      </div>
      <span className="font-mono text-xs font-bold text-slate-300">×{ingredient.quantity}</span>
    </div>
  );
}

type BreederTab = "croisements" | "calculs" | "enclos" | "metier";

const BREEDER_TABS: { key: BreederTab; label: string }[] = [
  { key: "croisements", label: "Croisements" },
  { key: "calculs", label: "Calculateurs" },
  { key: "enclos", label: "Enclos & pâtée" },
  { key: "metier", label: "Métier" },
];

function BreederPlan({ job }: { job?: Job }) {
  const [tab, setTab] = useState<BreederTab>("croisements");
  return (
    <div className="space-y-3">
      <div className="glass rounded-2xl p-5">
        <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-bold text-white">
          <DofusIcon name="havenbag" size={20} /> {job?.name.fr ?? "Éleveur"}
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          L'Éleveur ne se monte pas comme un métier de récolte ou de craft. L'XP vient de trois gestes —{" "}
          <span className="text-slate-200">capturer</span>, <span className="text-slate-200">reproduire</span> et{" "}
          <span className="text-slate-200">fabriquer</span> les objets d'élevage — et le vrai jeu est la{" "}
          <span className="text-slate-200">cascade de croisements</span> pour faire monter génération et couleur des montures.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {BREEDER_TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={chip(tab === t.key)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "croisements" && <DragoCrossings />}
      {tab === "calculs" && <BreederCalculators />}
      {tab === "enclos" && <BreederEnclos />}
      {tab === "metier" && <BreederMetier />}
    </div>
  );
}

function DragoCrossings() {
  return (
    <div className="space-y-3">
      <div className="glass rounded-2xl p-5">
        <h3 className="mb-1 flex items-center gap-2 font-display font-bold text-white">
          <DofusIcon name="genealogy" size={18} /> Arbre des couleurs — Dragodinde
        </h3>
        <p className="text-sm leading-relaxed text-slate-400">
          Tout part de <span className="text-slate-200">3 couleurs de base</span> capturées à l'état sauvage. On obtient
          une nouvelle couleur en croisant deux bicolores parents (ex. « Amande et Dorée » = Amande pur × Dorée pur), puis
          en croisant ces bicolores entre eux. Deux dragodindes <span className="text-slate-200">pures</span> (arbre
          généalogique d'une seule couleur) maximisent la chance d'obtenir la couleur visée.
        </p>
      </div>

      {DRAGO_TIERS.map((tier) => (
        <div key={tier.label} className="glass rounded-2xl p-5">
          <div className="mb-3 flex items-center gap-2">
            <Pill tone={tier.tone}>{tier.label}</Pill>
            <span className="text-xs text-slate-500">{tier.gen}</span>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {tier.colors.map((c) => (
              <div key={c.name} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.025] p-3">
                <span
                  className="mt-0.5 h-9 w-9 shrink-0 rounded-lg border border-white/15 shadow-inner"
                  style={{ background: c.hex }}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display font-bold text-white">{c.name}</span>
                    <span className="rounded-md bg-emerald-400/10 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                      {c.bonus}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    <span className="text-slate-500">Croisement : </span>
                    {c.recipe}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <p className="px-1 text-xs text-slate-500">
        Muldo et Volkorne suivent la même logique de cascade (le Volkorne ajoute des couleurs « gemmes » :
        Jade, Rubis, Saphir, Améthyste). Données de croisement : Dofus pour les Noobs.
      </p>
    </div>
  );
}

function BreederCalculators() {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <TargetGenCalc />
      <CascadeSim />
    </div>
  );
}

function targetGenChance(levelA: number, levelB: number, opti: boolean, alma: boolean): number {
  const base = 30;
  const fromLevels = Math.min(60, (levelA + levelB) * 0.15);
  const total = base + fromLevels + (opti ? 10 : 0) + (alma ? 20 : 0);
  return Math.max(0, Math.min(100, total));
}

function TargetGenCalc() {
  const [a, setA] = useState(50);
  const [b, setB] = useState(50);
  const [opti, setOpti] = useState(false);
  const [alma, setAlma] = useState(false);
  const chance = targetGenChance(a, b, opti, alma);
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="mb-1 flex items-center gap-2 font-display font-bold text-white">
        <DofusIcon name="characteristic" size={18} /> Génération cible
      </h3>
      <p className="mb-3 text-sm leading-relaxed text-slate-400">
        Chance que le petit monte d'une génération : <span className="text-slate-200">30 %</span> de base
        {" + "}<span className="text-slate-200">0,15 %</span> par niveau cumulé des parents (plafond +60 %).
      </p>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Niveau parent 1">
          <NumberInput value={a} min={1} max={MAX_LEVEL} onChange={(v) => setA(clampLevel(v))} />
        </Field>
        <Field label="Niveau parent 2">
          <NumberInput value={b} min={1} max={MAX_LEVEL} onChange={(v) => setB(clampLevel(v))} />
        </Field>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Toggle active={opti} onClick={() => setOpti((v) => !v)} label="Optimakina (+10 %)" />
        <Toggle active={alma} onClick={() => setAlma((v) => !v)} label="Almanax Takéza (+20 %)" />
      </div>
      <div className="mt-4 rounded-xl border border-glow-purple/20 bg-glow-purple/10 p-4 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Chance de génération supérieure</p>
        <p className="mt-1 font-display text-3xl font-bold text-glow-violet">{chance.toFixed(2).replace(".", ",")} %</p>
      </div>
    </div>
  );
}

interface CascadeRow {
  gen: number;
  couples: number;
  produced: number;
  target: number;
}

function CascadeSim() {
  const [stock, setStock] = useState(10);
  const [targetGen, setTargetGen] = useState(5);
  const [avgLevel, setAvgLevel] = useState(60);
  const [opti, setOpti] = useState(true);
  const [litter, setLitter] = useState(4);
  const [costPer, setCostPer] = useState(1500);
  const [priceTarget, setPriceTarget] = useState(20000);
  const [priceOther, setPriceOther] = useState(3000);

  const sim = useMemo(() => {
    const p = targetGenChance(avgLevel, avgLevel, opti, false) / 100;
    const rows: CascadeRow[] = [];
    let mounts = Math.max(2, stock);
    let totalProduced = 0;
    for (let gen = 1; gen < Math.max(2, targetGen); gen++) {
      const couples = Math.floor(mounts / 2);
      if (couples < 1) break;
      const produced = couples * Math.max(1, litter);
      const target = Math.round(produced * p);
      rows.push({ gen: gen + 1, couples, produced, target });
      totalProduced += produced;
      mounts = Math.max(2, target);
    }
    const finalTarget = rows.length ? rows[rows.length - 1].target : 0;
    const others = Math.max(0, totalProduced - finalTarget);
    const revenue = finalTarget * priceTarget + others * priceOther;
    const cost = totalProduced * costPer;
    return { p, rows, totalProduced, finalTarget, others, revenue, cost, net: revenue - cost };
  }, [stock, targetGen, avgLevel, opti, litter, costPer, priceTarget, priceOther]);

  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="mb-1 flex items-center gap-2 font-display font-bold text-white">
        <DofusIcon name="recipe" size={18} /> Simulateur de cascade
      </h3>
      <p className="mb-3 text-sm leading-relaxed text-slate-400">
        Estimation paramétrable de la production en cascade jusqu'à la génération visée, du coût de pâtée et du
        bénéfice à la revente. Ajuste les hypothèses à ton serveur.
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Field label="Stock gén.1">
          <NumberInput value={stock} min={2} max={500} onChange={(v) => setStock(Math.max(2, Math.floor(v) || 2))} />
        </Field>
        <Field label="Génération visée">
          <NumberInput value={targetGen} min={2} max={20} onChange={(v) => setTargetGen(Math.max(2, Math.min(20, Math.floor(v) || 2)))} />
        </Field>
        <Field label="Niveau moyen">
          <NumberInput value={avgLevel} min={1} max={MAX_LEVEL} onChange={(v) => setAvgLevel(clampLevel(v))} />
        </Field>
        <Field label="Petits / couple">
          <NumberInput value={litter} min={1} max={20} onChange={(v) => setLitter(Math.max(1, Math.floor(v) || 1))} />
        </Field>
        <Field label="Coût pâtée / monture">
          <NumberInput value={costPer} min={0} max={1000000} onChange={(v) => setCostPer(Math.max(0, Math.floor(v) || 0))} />
        </Field>
        <Field label="Revente gén. cible">
          <NumberInput value={priceTarget} min={0} max={10000000} onChange={(v) => setPriceTarget(Math.max(0, Math.floor(v) || 0))} />
        </Field>
        <Field label="Revente secondaire">
          <NumberInput value={priceOther} min={0} max={10000000} onChange={(v) => setPriceOther(Math.max(0, Math.floor(v) || 0))} />
        </Field>
      </div>
      <div className="mt-2">
        <Toggle active={opti} onClick={() => setOpti((v) => !v)} label={`Optimakina · génération cible ${(sim.p * 100).toFixed(0)} %`} />
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-white/5">
        <div className="grid grid-cols-4 bg-void-900/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          <span>Gén.</span>
          <span className="text-right">Couples</span>
          <span className="text-right">Produits</span>
          <span className="text-right">Gén. cible</span>
        </div>
        {sim.rows.map((r) => (
          <div key={r.gen} className="grid grid-cols-4 border-t border-white/5 px-3 py-1.5 text-sm text-slate-300">
            <span>gén.{r.gen}</span>
            <span className="text-right">{fmt(r.couples)}</span>
            <span className="text-right">{fmt(r.produced)}</span>
            <span className="text-right text-glow-violet">{fmt(r.target)}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <Stat label="Montures produites" value={fmt(sim.totalProduced)} />
        <Stat label="Coût pâtée" value={`${fmt(sim.cost)} kamas`} tone="ember" />
        <Stat label="Bénéfice net" value={`${fmt(sim.net)} kamas`} tone={sim.net >= 0 ? "emerald" : "ember"} />
      </div>
      <p className="mt-2 text-[11px] text-slate-500">
        Montants en kamas. Revente des {fmt(sim.others)} montures hors gén. cible estimée à {fmt(priceOther)} kamas pièce.
      </p>
    </div>
  );
}

function BreederEnclos() {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-1 flex items-center gap-2 font-display font-bold text-white">
            <DofusIcon name="resources" size={18} /> Jauges & sérénité
          </h3>
          <p className="mb-3 text-sm leading-relaxed text-slate-400">
            La <span className="text-slate-200">sérénité</span> (−5000 → +5000) décide quelle jauge monte ; endurance,
            maturité et amour doivent atteindre <span className="text-slate-200">20 000</span> pour rendre la monture féconde.
            La pâtée se consomme toutes les 10 s (enclos plein ≈ 17 h 48) : remplis le maximum de cases.
          </p>
          <div className="space-y-1.5">
            {BREEDER_GAUGES.map((g) => (
              <div key={g.name} className="flex items-center justify-between gap-2 rounded-lg border border-white/5 bg-void-900/40 px-3 py-2">
                <span className="text-sm font-semibold text-slate-200">{g.name}</span>
                <span className="text-xs text-slate-400">{g.detail}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="mb-1 flex items-center gap-2 font-display font-bold text-white">
            <DofusIcon name="recipe" size={18} /> Paliers de pâtée
          </h3>
          <p className="mb-3 text-sm leading-relaxed text-slate-400">
            Plus la pâtée est haute, plus la jauge grimpe vite (et plus elle se vide vite). Débloquée par le niveau de métier.
          </p>
          <div className="space-y-1.5">
            {FUEL_TIERS.map((f) => (
              <div key={f.tier} className="flex items-center justify-between gap-2 rounded-lg border border-white/5 bg-void-900/40 px-3 py-2">
                <span className="text-sm font-semibold text-slate-200">{f.tier} · {f.item}</span>
                <span className="text-xs text-slate-400">+{f.gain}/10 s · niv.{f.level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="mb-1 flex items-center gap-2 font-display font-bold text-white">
          <DofusIcon name="characteristic" size={18} /> Makinas
        </h3>
        <p className="mb-3 text-sm leading-relaxed text-slate-400">
          Capacités spéciales qui n'apparaissent que via une makina lors du croisement.
        </p>
        <div className="grid gap-2 md:grid-cols-3">
          {BREEDER_MAKINAS.map((m) => (
            <div key={m.name} className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
              <p className="font-display font-bold text-white">{m.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{m.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BreederMetier() {
  return (
    <div className="space-y-3">
      <div className="glass rounded-2xl p-5">
        <h3 className="mb-3 flex items-center gap-2 font-display font-bold text-white">
          <DofusIcon name="job" size={18} /> Sources d'expérience
        </h3>
        <div className="grid gap-3 md:grid-cols-3">
          {BREEDER_XP.map((src) => (
            <div key={src.label} className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
              <Pill tone={src.tone}>{src.label}</Pill>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{src.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="mb-3 flex items-center gap-2 font-display font-bold text-white">
          <DofusIcon name="book" size={18} /> Déblocages par niveau
        </h3>
        <div className="grid gap-1.5 sm:grid-cols-2">
          {BREEDER_UNLOCKS.map((u) => (
            <div key={u.level + u.label} className="flex items-center gap-3 rounded-lg border border-white/5 bg-void-900/40 px-3 py-2">
              <Pill tone={levelTone(u.level)}>Niv.{u.level}</Pill>
              <span className="text-sm text-slate-300">{u.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Toggle({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className={chip(active)}>
      <span className={`grid h-3.5 w-3.5 place-items-center rounded-[4px] border ${active ? "border-glow-purple bg-glow-purple/60" : "border-white/20"}`}>
        {active && <span className="h-1.5 w-1.5 rounded-[1px] bg-white" />}
      </span>
      {label}
    </button>
  );
}

function Stat({ label, value, tone = "slate" }: { label: string; value: string; tone?: "slate" | "emerald" | "ember" }) {
  const color = tone === "emerald" ? "text-emerald-300" : tone === "ember" ? "text-amber-300" : "text-white";
  return (
    <div className="rounded-xl border border-white/5 bg-void-900/40 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 font-display text-base font-bold ${color}`}>{value}</p>
    </div>
  );
}

const MAGE_RUNE_LEGEND =
  "Forgemage l'item le plus proche de ton niveau et renouvelle-le tous les ~5-10 niveaux. Runes : fo force · ine intel · age agi · cha chance · vi vita · sa sagesse · cri %critique · do/dom dommages · ini initiative · tac tacle · fui fuite · pui puissance · prospe prospection · res résistance · pa/ra runes plus denses.";

function MageItemsTable({ rows, note }: { rows: MageRow[]; note?: string }) {
  const names = useMemo(() => rows.map((r) => r.item), [rows]);
  const resolveQ = useQuery({
    queryKey: ["mage-items", names.join("|")],
    queryFn: ({ signal }) => resolveItemsByName(names, signal),
    staleTime: Infinity,
  });
  const byName = resolveQ.data;
  return (
    <>
      <div className="space-y-1.5">
        {rows.map((r, i) => {
          const next = rows[i + 1]?.from;
          const range = next ? `${r.from}–${next - 1}` : `${r.from}+`;
          const found = byName?.get(r.item.toLowerCase());
          const runes = r.runes.split(",").map((s) => s.trim()).filter(Boolean);
          return (
            <div
              key={r.item}
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.025] p-2.5 transition hover:border-white/10 hover:bg-white/[0.05]"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-void-900/70 ring-1 ring-white/5">
                {found?.img ? (
                  <img src={found.img} alt="" loading="lazy" className="h-9 w-9 object-contain" />
                ) : (
                  <DofusIcon name="recipe" size={16} className="opacity-40" />
                )}
              </span>
              <span className="w-14 shrink-0 rounded-md bg-glow-purple/15 px-1.5 py-1 text-center font-mono text-xs font-bold text-glow-violet">
                {range}
              </span>
              <div className="min-w-0 flex-1">
                {found ? (
                  <Link
                    to={`/objets/${found.id}`}
                    state={{ returnTo: "/rentabilite-metiers", returnLabel: "XP métier" }}
                    className="no-drag block truncate font-semibold text-white hover:text-glow-violet"
                  >
                    {r.item}
                  </Link>
                ) : (
                  <span className="block truncate font-semibold text-slate-200">{r.item}</span>
                )}
                <div className="mt-1 flex flex-wrap gap-1">
                  {runes.map((rune, j) => (
                    <span key={j} className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                      {rune}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{note ?? MAGE_RUNE_LEGEND}</p>
    </>
  );
}

function GenericMageItems({ types }: { types?: string }) {
  const items = genericMageItems(types ?? "équipements");
  return (
    <>
      <p className="mb-3 text-xs text-slate-500">
        Pas de liste nommée fiable pour cette spécialité : applique la méthode sur les {types?.toLowerCase() ?? "items"} les
        moins chers de chaque palier (la voie la moins chère reste la bijouterie, Joaillomage).
      </p>
      <div className="grid gap-2 md:grid-cols-2">
        {items.map((it) => (
          <div key={it.name} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.025] p-3">
            <Pill tone={it.tone}>{it.levels}</Pill>
            <div className="min-w-0 flex-1">
              <p className="font-display font-bold text-white">{it.name}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{it.note}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function MageJobPlan({ job }: { job?: Job }) {
  const spec = MAGE_SPECS[job?.id ?? 0];
  return (
    <div className="space-y-3">
      <div className="glass rounded-2xl p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-white">
            <DofusIcon name="recipe" size={20} /> {job?.name.fr ?? "Forgemagie"}
          </h2>
          {spec && <Pill tone="cyan">{spec.types}</Pill>}
        </div>
        <p className="text-sm leading-relaxed text-slate-400">
          L'XP de mage = <span className="text-slate-200">niveau de l'objet</span> ×{" "}
          <span className="text-slate-200">densité de la rune posée</span>. On monte donc sur des supports bon marché en
          posant les runes les plus denses au meilleur prix, et on exploite le <span className="text-slate-200">puits</span>{" "}
          (surcoût) : casser une stat lourde libère de la densité qui protège les lignes suivantes.
        </p>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="mb-3 flex items-center gap-2 font-display font-bold text-white">
          <DofusIcon name="inventory" size={18} /> Meilleurs items à exploiter, par niveau
        </h3>
        {spec?.table ? <MageItemsTable rows={spec.table} note={spec.note} /> : <GenericMageItems types={spec?.types} />}
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="mb-1 flex items-center gap-2 font-display font-bold text-white">
          <DofusIcon name="characteristic" size={18} /> Meilleures runes (XP par kama)
        </h3>
        <p className="mb-3 text-sm leading-relaxed text-slate-400">
          L'XP d'une rune = sa <span className="text-slate-200">densité</span>. Les plus rentables cumulent grosse densité
          et prix bas. Au concasseur : <span className="text-slate-200">1 Ra = 3 Pa = 9 basiques</span>.
        </p>
        <div className="mb-3 grid gap-2 md:grid-cols-3">
          {MAGE_BEST_RUNES.map((r) => (
            <div key={r.name} className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
              <Pill tone={r.tone}>{r.name}</Pill>
              <p className="mt-2 text-sm text-slate-300">{r.detail}</p>
            </div>
          ))}
        </div>
        <div className="overflow-hidden rounded-xl border border-white/5">
          <div className="grid grid-cols-2 bg-void-900/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <span>Statistique</span>
            <span className="text-right">Densité / +1 (rune)</span>
          </div>
          {RUNE_WEIGHTS.map((w) => (
            <div key={w.stat} className={`grid grid-cols-2 border-t border-white/5 px-3 py-1.5 text-sm ${w.heavy ? "text-amber-300" : "text-slate-300"}`}>
              <span>{w.stat}</span>
              <span className="text-right font-mono">{w.weight}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 rounded-lg border border-amber-400/15 bg-amber-400/5 px-3 py-2 text-xs text-amber-200/80">
          À éviter pour l'XP : les exos <span className="font-semibold">PA (100)</span>, <span className="font-semibold">PM (90)</span> et{" "}
          <span className="font-semibold">PO (51)</span> — densité énorme mais ≈ 1 % de réussite, runes hors de prix et gros puits à l'échec.
        </p>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="mb-3 flex items-center gap-2 font-display font-bold text-white">
          <DofusIcon name="book" size={18} /> Méthode par palier
        </h3>
        <div className="grid gap-3 md:grid-cols-3">
          {MAGE_METHOD.map((step) => (
            <div key={step.title} className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
              <Pill tone={step.tone}>{step.levels}</Pill>
              <h3 className="mt-3 font-display font-bold text-white">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">{step.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-slate-500">
          Les items et prix exacts varient selon ton serveur ; vise un budget de ≈ 8-12 % de la valeur de revente max par support.
          Données runes : guide Forgemagie 2026 (dafous).
        </p>
      </div>
    </div>
  );
}

const BREEDER_XP = [
  { label: "Capture", detail: "+30 XP par monture capturée. Le filet multiplicatif (niv. 100) donne 30 XP par monture dupliquée en plus.", tone: "emerald" as const },
  { label: "Reproduction", detail: "+30 XP × génération × monture. Croiser deux montures gén. 5 rapporte 5 × 30 × 2 = 300 XP.", tone: "cyan" as const },
  { label: "Fabrication", detail: "Chaque objet d'élevage crafté donne de l'XP, croissante avec le niveau de la recette.", tone: "purple" as const },
];

const BREEDER_GAUGES = [
  { name: "Sérénité", detail: "−5000 → +5000 · pilote la jauge active" },
  { name: "Endurance", detail: "sérénité négative · cible 20 000" },
  { name: "Maturité", detail: "sérénité neutre · cible 20 000" },
  { name: "Amour", detail: "sérénité positive · cible 20 000" },
  { name: "Expérience", detail: "monte la monture en parallèle (1 → 200)" },
];

const BREEDER_MAKINAS = [
  { name: "Animakina", detail: "capacité aléatoire : amoureux / endurant / précoce 27 %, sage 14 %, reproducteur 5 %." },
  { name: "Kromakina", detail: "capacité caméléone garantie : la monture prend les couleurs du personnage." },
  { name: "Optimakina", detail: "+10 % de chance de génération cible lors du croisement." },
];

const BREEDER_UNLOCKS = [
  { level: 1, label: "Filet de capture universel + enclos débutant (10 cases)" },
  { level: 5, label: "Extraits de pâtée (carburant T1)" },
  { level: 40, label: "Enclos novice" },
  { level: 55, label: "Philtres de pâtée (T2)" },
  { level: 80, label: "Enclos apprenti" },
  { level: 100, label: "Filet multiplicatif (capture en double)" },
  { level: 105, label: "Potions de pâtée (T3)" },
  { level: 120, label: "Enclos initié" },
  { level: 150, label: "Filet renforcé (capture de zone)" },
  { level: 155, label: "Élixirs de pâtée (T4)" },
  { level: 160, label: "Enclos vétéran" },
  { level: 200, label: "Enclos maître + filet renforcé multiplicatif" },
];

const FUEL_TIERS = [
  { tier: "T1", item: "Extraits de pâtée", gain: 10, level: 5 },
  { tier: "T2", item: "Philtres de pâtée", gain: 20, level: 55 },
  { tier: "T3", item: "Potions de pâtée", gain: 30, level: 105 },
  { tier: "T4", item: "Élixirs de pâtée", gain: 40, level: 155 },
];

// Arbre des couleurs de dragodinde (source : Dofus pour les Noobs). Une couleur s'obtient
// en croisant les deux bicolores parents indiqués ; les 3 couleurs de base sont sauvages.
const DRAGO_TIERS: {
  label: string;
  gen: string;
  tone: "emerald" | "cyan" | "purple" | "gold" | "rose";
  colors: { name: string; hex: string; bonus: string; recipe: string }[];
}[] = [
  {
    label: "Base",
    gen: "sauvages, gén.1",
    tone: "emerald",
    colors: [
      { name: "Amande", hex: "#b7d97a", bonus: "+1700 Initiative", recipe: "capture à l'état sauvage" },
      { name: "Rousse", hex: "#c0563a", bonus: "+60 Soins", recipe: "capture à l'état sauvage" },
      { name: "Dorée", hex: "#e3b53a", bonus: "+2 Invocations", recipe: "capture à l'état sauvage" },
    ],
  },
  {
    label: "Croisement simple",
    gen: "gén.3",
    tone: "cyan",
    colors: [
      { name: "Ebène", hex: "#2b2b33", bonus: "+120 Agilité", recipe: "Amande+Dorée × Dorée+Rousse" },
      { name: "Indigo", hex: "#4b4fce", bonus: "+120 Chance", recipe: "Amande+Dorée × Amande+Rousse" },
    ],
  },
  {
    label: "Croisement avancé",
    gen: "gén.5",
    tone: "purple",
    colors: [
      { name: "Pourpre", hex: "#8e2f6a", bonus: "+120 Force", recipe: "Ebène+Indigo × Amande+Rousse" },
      { name: "Orchidée", hex: "#b56fc6", bonus: "+120 Intelligence", recipe: "Ebène+Indigo × Dorée+Rousse" },
    ],
  },
  {
    label: "Croisement expert",
    gen: "gén.7",
    tone: "gold",
    colors: [
      { name: "Ivoire", hex: "#ece6d2", bonus: "+90 Puissance", recipe: "Orchidée+Pourpre × Indigo+Pourpre" },
      { name: "Turquoise", hex: "#2bb6b6", bonus: "+90 Prospection", recipe: "Orchidée+Pourpre × Ebène+Orchidée" },
    ],
  },
  {
    label: "Croisement maître",
    gen: "gén.9",
    tone: "rose",
    colors: [
      { name: "Emeraude", hex: "#2fae5a", bonus: "+14 % Coup Critique", recipe: "Ivoire+Turquoise × Ivoire+Pourpre" },
      { name: "Prune", hex: "#6a2f5a", bonus: "+2 Portée", recipe: "Ivoire+Turquoise × Turquoise+Orchidée" },
    ],
  },
];

interface MageItemRec {
  levels: string;
  name: string;
  note: string;
  tone: "emerald" | "cyan" | "purple" | "rose";
}

// Une ligne du tableau de montée : à partir du niveau `from`, on forgemage `item` avec `runes`.
interface MageRow {
  from: number;
  item: string;
  runes: string;
}

// Tableaux par niveau (source : dofastuces pour Joaillomage/Cordomage/Costumage ; Papycha pour
// Forgemage d'Épée). Sculptemage/Façomage : pas de liste nommée fiable → méthode générique.
const MAGE_SPECS: Record<number, { types: string; table?: MageRow[]; note?: string }> = {
  44: {
    types: "Armes : épées, dagues, haches, marteaux, pelles",
    table: [
      { from: 6, item: "Épée de Boisaille", runes: "fo" },
      { from: 25, item: "Épée d'Alle", runes: "fo, ine" },
      { from: 51, item: "Lame du Chef Bwork", runes: "fo, age" },
      { from: 75, item: "Épée Choh", runes: "fo, age" },
      { from: 100, item: "Épée la plus proche de ton niveau", runes: "Ra Sa, dommages, cri" },
    ],
    note: "Voie Épée (source : Papycha) détaillée jusqu'au niv. 100 ; option rapide mais chère : Griffe Pourpre (cri, do). Au-delà de 100, garde la logique : épée la plus proche du niveau, runes lourdes.",
  },
  48: { types: "Armes : arcs, baguettes, bâtons" },
  62: {
    types: "Ceintures & bottes",
    table: [
      { from: 1, item: "Les Incrustes", runes: "cha, ine" },
      { from: 11, item: "Bottes de l'aventurier", runes: "pa cha/ine/fo/age, cri" },
      { from: 20, item: "Bottes de l'homme Ours", runes: "pa ine, cri, dom feu" },
      { from: 31, item: "Ceinture de rapine", runes: "pa ine/age, cri" },
      { from: 43, item: "Mégabottes", runes: "pa cha, cri, ini, res eau" },
      { from: 57, item: "Geta Aerdala", runes: "pa vi/age, cri" },
      { from: 68, item: "Geta Feudala", runes: "pa age/ine, cri, prospe" },
      { from: 84, item: "Ceinture des vents", runes: "pa ine/cha, cri, do" },
      { from: 100, item: "Slip du Chef Bwork", runes: "pa fo/age, cri, res" },
      { from: 124, item: "Ceinture du Dragoeuf", runes: "pa vi/cha/fo, cri, prospe" },
      { from: 142, item: "Bottes de Frigostine", runes: "pa vi/age/cha, cri, fui" },
      { from: 163, item: "Ceinture des Prophètes", runes: "pa vi/ine/cha, cri, fui" },
      { from: 184, item: "Bottes Répané", runes: "pa vi/cha/ine, prospe, do, soins" },
    ],
  },
  63: {
    types: "Anneaux & amulettes",
    table: [
      { from: 1, item: "Le Plussain", runes: "fo, age" },
      { from: 9, item: "Amulette de Krokette", runes: "cha, cri" },
      { from: 13, item: "Anneau du Champ Champ", runes: "vi, cri, tac" },
      { from: 19, item: "Amulette du Chafer", runes: "fo, cha, cri" },
      { from: 26, item: "Larvamulette", runes: "pa vi/ine/age" },
      { from: 31, item: "Anneau Solo", runes: "pa fo/age, cri" },
      { from: 43, item: "Scaranneau Vert", runes: "pa fo, cri, pui, ini, res terre" },
      { from: 50, item: "Anodindo", runes: "pa age/fo/ine/cha/sa" },
      { from: 59, item: "Anneau Merta", runes: "pa ine/age, cri, soins, ini, res" },
      { from: 81, item: "Alliance Feudala", runes: "pa sa/ine, cri, soins, res eau" },
      { from: 89, item: "La Feuille d'Automne", runes: "cri, pa cha/age, Ra cha/age" },
      { from: 108, item: "Anneau du Dragon Cochon", runes: "pa vi/age/cha/fo, cri" },
      { from: 121, item: "Bague Moutheuze", runes: "pa vi/cha, cri" },
      { from: 140, item: "Anneau du Mansot Royal", runes: "pa vi/fo, cri, dom terre/eau, tac" },
      { from: 175, item: "Anneau de Guten Tak", runes: "pa fo/cha, cri, dom terre/neutre" },
      { from: 190, item: "Anneau de Kolosso", runes: "pa vi/fo, cri, ini, tac" },
    ],
  },
  64: {
    types: "Coiffes, capes & sacs",
    table: [
      { from: 1, item: "La Cape S'loque", runes: "fo, sa" },
      { from: 10, item: "Cape du Piou Vert", runes: "pa age, vi, pa vi" },
      { from: 14, item: "Coiffe Champêtre", runes: "pui, cri, pa sa" },
      { from: 28, item: "Masque de Frakacia", runes: "pa vi/cha, tac, dom eau" },
      { from: 37, item: "Lorko Kasko", runes: "pa fo/ine/vi" },
      { from: 56, item: "Cape Hôte", runes: "pa vi, ine, soins, sa" },
      { from: 74, item: "Chapeau de Barbroussa", runes: "pa age/sa, %res terre, cri" },
      { from: 92, item: "Cape Feudala", runes: "pa vi/sa, cri, res" },
      { from: 105, item: "Couvre-chef du Rat Blanc", runes: "pa vi/age/fo, cri, ini" },
      { from: 118, item: "Solomonk", runes: "pa vi/age/fo, cri, dom, ini" },
      { from: 125, item: "Coiffe du Royalmouth", runes: "pa vi/ine/cha/sa, cri" },
      { from: 141, item: "Coiffe du Meulou", runes: "pa vi/fo/age/ine, do, cri" },
      { from: 157, item: "Coiffe du Minotot", runes: "pa vi/cha/ine, ini, cri, soins" },
      { from: 177, item: "Cape de Tengu Givrefoux", runes: "pa vi/ine/age/sa, cri, fui, soins" },
      { from: 190, item: "Capignon", runes: "pa vi/ine, cri, soins, do" },
    ],
  },
  74: { types: "Boucliers" },
};

function genericMageItems(types: string): MageItemRec[] {
  const t = types.replace(/^Armes\s*:\s*/i, "").toLowerCase();
  return [
    { levels: "1 → 50", name: `${types} bas niveau`, note: `Les ${t} les moins chers du palier, lignes sagesse/dommages — runes basiques puis Pa.`, tone: "emerald" },
    { levels: "50 → 100", name: "Items à exploiter au puits", note: "Privilégie les supports à 1 PA/PM : casse la stat lourde → puits → repose une Ga, revends.", tone: "cyan" },
    { levels: "100 → 200", name: `${types} THL bon marché`, note: "Par tranches de 5 niveaux ; garde les bons jets, recycle les échecs en runes.", tone: "rose" },
  ];
}

// Densité par +1 de stat (= XP par rune). Source : guide Forgemagie 2026 (dafous).
const RUNE_WEIGHTS: { stat: string; weight: number; heavy?: boolean }[] = [
  { stat: "PA (exo)", weight: 100, heavy: true },
  { stat: "PM (exo)", weight: 90, heavy: true },
  { stat: "Portée (PO)", weight: 51, heavy: true },
  { stat: "Invocation", weight: 30 },
  { stat: "Dommages", weight: 20 },
  { stat: "Soin", weight: 10 },
  { stat: "% Critique", weight: 10 },
  { stat: "Retrait PA/PM", weight: 7 },
  { stat: "% Résistance", weight: 6 },
  { stat: "Dommages élément", weight: 5 },
  { stat: "Tacle / Fuite", weight: 4 },
  { stat: "Prospection", weight: 3 },
  { stat: "Sagesse", weight: 3 },
  { stat: "Force / Intel / Chance / Agi", weight: 1 },
  { stat: "Vitalité", weight: 0.25 },
];

const MAGE_BEST_RUNES = [
  { name: "Ra Sagesse", detail: "Densité 30 par rune, peu chère → meilleur XP/kama.", tone: "emerald" as const },
  { name: "Dommages", detail: "Densité 20 par rune basique : grosse XP, prix moyen.", tone: "cyan" as const },
  { name: "Ra Force / Intel / Chance / Agi", detail: "Densité 10 par rune, runes très bon marché → XP de masse.", tone: "purple" as const },
];

const MAGE_METHOD = [
  {
    levels: "1 → 50",
    title: "Rush bas niveau",
    text: "Items niv. 1-50 bon marché, runes lourdes pas chères (dommages, sagesse) en basiques puis Pa. On cherche le volume d'XP, pas le profit.",
    tone: "emerald" as const,
  },
  {
    levels: "50 → 100",
    title: "Exploiter le puits",
    text: "Items à valeur (ex. Gelano) : casse une stat lourde (PA) → gros puits → repose une Ga PA et revends. L'XP vient des grosses densités.",
    tone: "cyan" as const,
  },
  {
    levels: "100 → 200",
    title: "Tranches de 5 niveaux",
    text: "Supports THL peu chers à remonter, par paliers de 5 niveaux : garde les bons jets revendables, recycle les échecs en runes au concasseur.",
    tone: "rose" as const,
  },
];

function focusFor(kind: "gather" | "mage" | "craft" | "special", from: number, to: number) {
  if (kind === "gather") return from < 40 ? "récolte + recettes simples" : "récolte du palier + transformations";
  if (kind === "mage") return to < 80 ? "runes simples" : "enchaînement d'items proches du niveau";
  return from < 60 ? "recettes courtes" : from < 140 ? "crafts répétables" : "crafts proches du niveau";
}

function noteFor(kind: "gather" | "mage" | "craft" | "special", from: number, to: number, steps: RouteStep[]) {
  const first = steps[0];
  const best = first?.pick.result?.name.fr ?? "la première recette";
  if (kind === "gather") return `Du niveau ${from} à ${to}, enchaîne les étapes dans l'ordre : départ sur ${best}, puis le craft max suit ton niveau réel.`;
  if (kind === "mage") return `Du niveau ${from} à ${to}, utiliser des supports accessibles au niveau courant ; le craft max est recalculé après chaque étape.`;
  return `Du niveau ${from} à ${to}, parcours unique optimisé : commence par ${best}, avec uniquement des crafts dont le niveau est déjà accessible.`;
}

function profileLabel(kind: "gather" | "mage" | "craft" | "special") {
  if (kind === "gather") return "Récolte";
  if (kind === "mage") return "Forgemagie";
  if (kind === "special") return "Spécial";
  return "Craft";
}

function methodLabel(kind: "gather" | "mage" | "craft" | "special") {
  if (kind === "gather") return "Farmer puis transformer";
  if (kind === "mage") return "Runes + items support";
  if (kind === "special") return "Objectifs terrain";
  return "Recettes simples";
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function NumberInput({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <input
      type="number"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="no-drag h-9 w-full rounded-lg border border-white/10 bg-void-800/70 px-2 text-sm text-slate-200 outline-none focus:border-glow-purple/50"
    />
  );
}

function chip(active: boolean) {
  const base = "no-drag inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ";
  return active ? `${base} bg-glow-purple/25 text-white ring-1 ring-glow-purple/40` : `${base} bg-white/5 text-slate-400 hover:bg-white/10`;
}
