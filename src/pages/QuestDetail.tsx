import { useMemo } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import DofusIcon from "../components/DofusIcon";
import { ChevronRight } from "../components/DofusIcons";
import { getQuest, listQuestCategories, type QuestStepFull, type QuestSegment } from "../api/dofusdb";
import { levelTone } from "../data/meta";
import { Pill, Spinner, ErrorState, EmptyState } from "../components/ui";

function fmt(n: number): string {
  return Math.round(n).toLocaleString("fr-FR");
}

export default function QuestDetail() {
  const { id } = useParams();
  const questId = Number(id);
  const location = useLocation();
  const back = (location.state as { returnTo?: string; returnLabel?: string }) ?? {};

  const questQ = useQuery({ queryKey: ["quest", questId], queryFn: ({ signal }) => getQuest(questId, signal), enabled: Number.isFinite(questId) });
  const categoriesQ = useQuery({ queryKey: ["quest-categories"], queryFn: ({ signal }) => listQuestCategories(signal), staleTime: Infinity });
  const categoryName = useMemo(() => {
    const m = new Map<number, string>();
    for (const c of categoriesQ.data ?? []) m.set(c.id, c.name.fr);
    return m;
  }, [categoriesQ.data]);

  const q = questQ.data;

  return (
    <div>
      <Link
        to={back.returnTo ?? "/quetes"}
        className="no-drag mb-4 inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-white"
      >
        <ChevronRight className="h-4 w-4 rotate-180" /> {back.returnLabel ?? "Quêtes"}
      </Link>

      {questQ.isLoading ? (
        <Spinner label="Chargement de la quête…" />
      ) : questQ.isError ? (
        <ErrorState message="Impossible de charger cette quête." onRetry={() => questQ.refetch()} />
      ) : !q ? (
        <EmptyState title="Quête introuvable" />
      ) : (
        <div className="space-y-3">
          <div className="glass rounded-2xl p-5">
            <h1 className="flex items-center gap-2 font-display text-xl font-bold text-white">
              <DofusIcon name="quete" size={22} /> {q.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Pill tone={levelTone(q.levelMax || q.levelMin || 1)}>
                {q.levelMin === q.levelMax ? `Niv. ${q.levelMin}` : `Niv. ${q.levelMin}-${q.levelMax}`}
              </Pill>
              {categoryName.get(q.categoryId) && <Pill tone="slate">{categoryName.get(q.categoryId)}</Pill>}
              {q.isDungeonQuest && <Pill tone="purple">Donjon</Pill>}
              {q.isPartyQuest && <Pill tone="gold">Multi-joueur</Pill>}
              {q.repeatable && <Pill tone="cyan">Répétable</Pill>}
            </div>
          </div>

          {q.steps.length === 0 ? (
            <EmptyState title="Aucune étape détaillée" hint="DofusDB n'expose pas le détail de cette quête." />
          ) : (
            q.steps.map((step, i) => <StepCard key={step.id} step={step} index={i} returnTo={back.returnTo} />)
          )}
        </div>
      )}
    </div>
  );
}

function StepCard({ step, index, returnTo }: { step: QuestStepFull; index: number; returnTo?: string }) {
  const rw = step.rewards;
  const hasRewards = rw.items.length > 0 || rw.xp > 0 || rw.kamas > 0 || rw.titles.length > 0 || rw.ornaments.length > 0;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index, 12) * 0.03 }} className="glass rounded-2xl p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-glow-purple/20 font-display text-sm font-bold text-glow-violet">
          {index + 1}
        </span>
        <h2 className="font-display font-bold text-white">{step.name}</h2>
        {step.optimalLevel ? <Pill tone={levelTone(step.optimalLevel)}>Niv. {step.optimalLevel}</Pill> : null}
      </div>

      {step.description && <p className="mb-3 text-sm leading-relaxed text-slate-400">{cleanText(step.description)}</p>}

      {step.objectives.length > 0 && (
        <div className="space-y-1.5">
          {step.objectives.map((o, j) => (
            <div key={j} className="flex items-start gap-2 rounded-lg border border-white/5 bg-void-900/40 px-3 py-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-glow-violet/70" />
              <div className="min-w-0 flex-1 text-sm text-slate-300">
                {o.segments.length ? o.segments.map((seg, k) => <Segment key={k} seg={seg} returnTo={returnTo} />) : "Objectif"}
                {o.dungeonId ? (
                  <Link
                    to={`/donjons/${o.dungeonId}`}
                    state={{ returnTo: returnTo ?? "/quetes", returnLabel: "Quêtes" }}
                    className="no-drag ml-2 inline-flex items-center gap-1 rounded-md bg-glow-purple/15 px-1.5 py-0.5 text-[11px] font-semibold text-glow-violet hover:bg-glow-purple/25"
                  >
                    <DofusIcon name="questDungeon" size={12} /> Donjon
                  </Link>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {hasRewards && (
        <div className="mt-3 rounded-xl border border-white/5 bg-void-900/45 p-3">
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <DofusIcon name="trophy" size={13} /> Récompenses
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {rw.xp > 0 && <span className="rounded-md bg-glow-violet/15 px-2 py-1 text-xs font-semibold text-glow-violet">{fmt(rw.xp)} XP</span>}
            {rw.kamas > 0 && <span className="rounded-md bg-glow-gold/15 px-2 py-1 text-xs font-semibold text-glow-gold">{fmt(rw.kamas)} kamas</span>}
            {rw.titles.map((t) => (
              <span key={t} className="rounded-md bg-white/5 px-2 py-1 text-xs text-slate-300">Titre : {t}</span>
            ))}
            {rw.ornaments.map((o) => (
              <span key={o} className="rounded-md bg-white/5 px-2 py-1 text-xs text-slate-300">Ornement : {o}</span>
            ))}
          </div>
          {rw.items.length > 0 && (
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {rw.items.map((it) => (
                <Link
                  key={it.id}
                  to={`/objets/${it.id}`}
                  state={{ returnTo: returnTo ?? "/quetes", returnLabel: "Quêtes" }}
                  className="no-drag flex items-center gap-2 rounded-lg border border-white/5 bg-void-900/40 p-2 transition hover:bg-white/[0.05]"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-void-950/70">
                    {it.img ? <img src={it.img} alt="" loading="lazy" className="h-8 w-8 object-contain" /> : <DofusIcon name="inventory" size={14} />}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-slate-200">{it.name || `#${it.id}`}</span>
                  {it.quantity > 1 && <span className="shrink-0 font-mono text-xs font-bold text-slate-300">×{it.quantity}</span>}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

// Un segment d'objectif : texte brut, ou entité résolue (monstre/objet cliquables, PNJ nommé).
function Segment({ seg, returnTo }: { seg: QuestSegment; returnTo?: string }) {
  if ("text" in seg) return <>{seg.text}</>;
  const { kind, id, name } = seg.ref;
  const state = { returnTo: returnTo ?? "/quetes", returnLabel: "Quêtes" };
  if (kind === "monster")
    return (
      <Link to={`/monstres/${id}`} state={state} className="no-drag font-semibold text-glow-rose hover:underline">
        {name}
      </Link>
    );
  if (kind === "item")
    return (
      <Link to={`/objets/${id}`} state={state} className="no-drag font-semibold text-glow-violet hover:underline">
        {name}
      </Link>
    );
  // PNJ (pas de page dédiée) et zone → texte mis en valeur.
  return <span className={kind === "npc" ? "font-semibold text-slate-100" : "italic text-slate-300"}>{name}</span>;
}

// Nettoie le markup résiduel des descriptions ({..}/[type,id]).
function cleanText(t: string): string {
  return t
    .replace(/\{[^}]*\}/g, "")
    .replace(/\[[a-zA-Z]+,\d+\]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}
