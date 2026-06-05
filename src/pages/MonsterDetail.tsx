import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import {
  ArrowLeft,
  Heart,
  Zap,
  Footprints,
  Skull,
  Swords,
  Package,
  Sparkles,
  Crosshair,
  Star,
  Target,
  Maximize2,
  X,
  Move,
  WandSparkles,
} from "lucide-react";
import {
  getMonster,
  getMonsterSpells,
  getMonsterRaceName,
  getMonstersByRace,
  getItemsByIds,
  dungeonsWithMonster,
  type MonsterGrade,
  type ClassSpell,
  type SpellLevel,
  type SpellDamage,
} from "../api/dofusdb";
import { Pill, Spinner, ErrorState, SectionHeader } from "../components/ui";
import ItemModal from "../components/ItemModal";

// 0 Neutre · 1 Terre · 2 Feu · 3 Eau · 4 Air · 5 meilleur élément.
const ELEMENTS = [
  { label: "Neutre", text: "text-slate-300", dot: "bg-slate-400" },
  { label: "Terre", text: "text-amber-400", dot: "bg-amber-500" },
  { label: "Feu", text: "text-glow-ember", dot: "bg-glow-ember" },
  { label: "Eau", text: "text-glow-cyan", dot: "bg-glow-cyan" },
  { label: "Air", text: "text-glow-emerald", dot: "bg-glow-emerald" },
  { label: "Meilleur élément", text: "text-glow-violet", dot: "bg-glow-violet" },
];

const RES = [
  { key: "earthResistance", label: "Terre", el: 1 },
  { key: "fireResistance", label: "Feu", el: 2 },
  { key: "waterResistance", label: "Eau", el: 3 },
  { key: "airResistance", label: "Air", el: 4 },
  { key: "neutralResistance", label: "Neutre", el: 0 },
] as const;

const CHARS = [
  { key: "strength", label: "Force", el: 1 },
  { key: "intelligence", label: "Intelligence", el: 2 },
  { key: "chance", label: "Chance", el: 3 },
  { key: "agility", label: "Agilité", el: 4 },
  { key: "vitality", label: "Vitalité", el: 5 },
  { key: "wisdom", label: "Sagesse", el: 5 },
] as const;

export default function MonsterDetail() {
  const { id } = useParams();
  const monsterId = Number(id);

  const { data: monster, isLoading, isError, refetch } = useQuery({
    queryKey: ["monster", monsterId],
    queryFn: ({ signal }) => getMonster(monsterId, signal),
    enabled: Number.isFinite(monsterId),
  });

  const spellIds = monster?.spells ?? [];
  // Sorts « Auto » : niveaux de départ portés par les grades (hors `spells`).
  const startingLevelIds = [
    ...new Set((monster?.grades ?? []).map((g) => g.startingSpellId).filter((v): v is number => !!v)),
  ];
  const { data: spells } = useQuery({
    queryKey: ["monster-spells", monsterId, spellIds, startingLevelIds],
    queryFn: ({ signal }) => getMonsterSpells(spellIds, startingLevelIds, signal),
    enabled: spellIds.length > 0 || startingLevelIds.length > 0,
  });
  const { data: raceName } = useQuery({
    queryKey: ["monster-race", monster?.race],
    queryFn: ({ signal }) => getMonsterRaceName(monster!.race!, signal),
    enabled: monster?.race != null,
  });
  const dropIds = (monster?.drops ?? []).map((d) => d.objectId);
  const { data: dropItems } = useQuery({
    queryKey: ["drop-items", monsterId, dropIds],
    queryFn: ({ signal }) => getItemsByIds(dropIds, signal),
    enabled: dropIds.length > 0,
  });
  const { data: dungeons } = useQuery({
    queryKey: ["monster-dungeons", monsterId],
    queryFn: ({ signal }) => dungeonsWithMonster(monsterId, signal),
    enabled: Number.isFinite(monsterId),
  });
  const { data: family } = useQuery({
    queryKey: ["monster-family", monster?.race],
    queryFn: ({ signal }) => getMonstersByRace(monster!.race!, signal),
    enabled: monster?.race != null,
  });

  const grades = monster?.grades ?? [];
  const [gradeIdx, setGradeIdx] = useState(0);
  const [spellId, setSpellId] = useState<number | null>(null);
  const [openItem, setOpenItem] = useState<number | null>(null);
  const [mapBig, setMapBig] = useState(false);

  // Reset de la sélection quand on navigue vers un autre monstre (composant non remonté).
  useEffect(() => {
    setGradeIdx(0);
    setSpellId(null);
  }, [monsterId]);
  const grade = grades[Math.min(gradeIdx, Math.max(0, grades.length - 1))];

  // Par défaut on sélectionne un sort « normal » (pas l'Auto), pour montrer une vraie portée.
  const selectedSpell =
    (spells ?? []).find((s) => s.id === spellId) ?? (spells ?? []).find((s) => !s.auto) ?? (spells ?? [])[0];
  // Niveau du sort calé sur le grade du monstre via spellGrades ("mobGrade,spellGrade;…").
  // spellGrades est parallèle à `monster.spells` → on indexe par id (pas variantIndex, décalé
  // par les sorts Auto ajoutés en tête).
  const spellLevel = useMemo<SpellLevel | undefined>(() => {
    const lv = selectedSpell?.levels;
    if (!lv?.length) return undefined;
    const mobGrade = grade?.grade ?? gradeIdx + 1;
    const sgIdx = (monster?.spells ?? []).indexOf(selectedSpell!.id);
    const map = parseSpellGrades(sgIdx >= 0 ? monster?.spellGrades?.[sgIdx] : undefined);
    const targetGrade = map.get(mobGrade) ?? mobGrade;
    return lv.find((l) => l.grade === targetGrade) ?? lv[Math.min(gradeIdx, lv.length - 1)];
  }, [selectedSpell, gradeIdx, grade, monster]);

  if (isLoading) return <Spinner label="Chargement du monstre…" />;
  if (isError || !monster) return <ErrorState message="Monstre introuvable." onRetry={refetch} />;

  const drops = [...(monster.drops ?? [])].sort(
    (a, b) => (b.percentDropForGrade1 ?? 0) - (a.percentDropForGrade1 ?? 0),
  );
  const itemById = new Map((dropItems ?? []).map((it) => [it.id, it]));

  return (
    <div>
      <Link
        to="/monstres"
        className="no-drag mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Monstres
      </Link>

      {/* En-tête : portrait + identité + sélecteur de niveau + stats du grade. */}
      <div className="glass relative overflow-hidden rounded-3xl p-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(244,63,94,0.12),transparent_45%)]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-2xl bg-glow-rose/20 blur-xl" />
              <div className="relative grid h-28 w-28 place-items-center rounded-2xl bg-void-900/50 ring-1 ring-white/10">
                <img
                  src={monster.img}
                  alt={monster.name.fr}
                  className="h-24 w-24 object-contain"
                  onError={(e) => (e.currentTarget.style.opacity = "0.3")}
                />
              </div>
            </div>
            <div>
              <h1 className="font-display text-3xl font-extrabold leading-tight text-white">{monster.name.fr}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {raceName && (
                  <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300">
                    {raceName}
                  </span>
                )}
                {monster.isBoss && (
                  <Pill tone="rose">
                    <Skull className="h-3 w-3" /> Boss
                  </Pill>
                )}
              </div>
              {/* Sélecteur de niveau (grades) */}
              {grades.length > 1 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {grades.map((gr, i) => (
                    <button
                      key={gr.grade}
                      onClick={() => setGradeIdx(i)}
                      className={clsx(
                        "no-drag rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide transition",
                        i === gradeIdx
                          ? "bg-glow-purple/25 text-white ring-1 ring-glow-purple/50"
                          : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200",
                      )}
                    >
                      Niv. {gr.level}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {grade && <StatsBlock grade={grade} />}
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Sorts + détail */}
        {(spells?.length ?? 0) > 0 && (
          <section className="glass rounded-2xl p-4">
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-white">
              <Sparkles className="h-5 w-5 text-glow-violet" /> Sorts
            </h2>
            <div className="mb-4 flex flex-wrap gap-2">
              {spells!.map((sp) => (
                <button
                  key={sp.id}
                  onClick={() => setSpellId(sp.id)}
                  className={clsx(
                    "no-drag inline-flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-sm font-semibold transition",
                    selectedSpell?.id === sp.id
                      ? "border-glow-purple/50 bg-glow-purple/15 text-white"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10",
                  )}
                >
                  <img src={sp.img} alt="" className="h-6 w-6 rounded object-cover" onError={(e) => (e.currentTarget.style.opacity = "0.3")} />
                  {sp.name.fr}
                  {sp.auto && (
                    <span className="rounded bg-glow-emerald/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-glow-emerald">
                      Auto
                    </span>
                  )}
                </button>
              ))}
            </div>
            {selectedSpell && <SpellDetail spell={selectedSpell} level={spellLevel} grade={grade} />}
          </section>
        )}

        {/* Map de portée + Drops */}
        <section className="space-y-5">
          {selectedSpell && spellLevel && (
            <div className="glass rounded-2xl p-4">
              <div className="mb-1 flex items-center justify-between gap-2">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-white">
                  <Target className="h-5 w-5 text-glow-cyan" /> Zone ciblable
                </h2>
                <button
                  onClick={() => setMapBig(true)}
                  className="no-drag inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <Maximize2 className="h-3.5 w-3.5" /> Agrandir
                </button>
              </div>
              <p className="mb-2 text-xs text-slate-500">
                {mapSubtitle(spellLevel)}
              </p>
              <SpellRangeMap level={spellLevel} />
            </div>
          )}

          {drops.length > 0 && (
            <div className="glass rounded-2xl p-4">
              <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-white">
                <Package className="h-5 w-5 text-glow-gold" /> Butin ({drops.length})
              </h2>
              <div className="grid max-h-[300px] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
                {drops.map((d) => {
                  const it = itemById.get(d.objectId);
                  return (
                    <button
                      key={d.objectId}
                      onClick={() => setOpenItem(d.objectId)}
                      title={it?.name.fr ?? `Objet #${d.objectId}`}
                      className="no-drag group relative flex flex-col items-center gap-1 rounded-xl border border-white/5 bg-white/[0.02] p-2 text-center transition hover:border-glow-gold/40 hover:bg-white/[0.05]"
                    >
                      <span className="absolute right-1 top-1 rounded bg-void-900/80 px-1 text-[10px] font-semibold text-glow-gold ring-1 ring-glow-gold/30">
                        {fmtPct(d.percentDropForGrade1)}%
                      </span>
                      {it?.img ? (
                        <img src={it.img} alt="" className="h-10 w-10 object-contain" />
                      ) : (
                        <div className="h-10 w-10 rounded bg-white/5" />
                      )}
                      <span className="line-clamp-2 text-[11px] leading-tight text-slate-300">
                        {it?.name.fr ?? `Objet #${d.objectId}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>

      {dungeons && dungeons.length > 0 && (
        <div className="mt-5">
          <SectionHeader eyebrow="Localisation" title="Apparaît dans" />
          <div className="flex flex-wrap gap-2">
            {dungeons.map((dg) => (
              <Link
                key={dg.id}
                to={`/donjons/${dg.id}`}
                className="no-drag inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:border-glow-ember/40 hover:bg-white/10"
              >
                <Swords className="h-4 w-4 text-glow-ember" /> {dg.name.fr}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Même famille (race) — clic = navigation directe vers le monstre. */}
      {family && family.filter((m) => m.id !== monsterId).length > 0 && (
        <div className="mt-5">
          <SectionHeader eyebrow="Famille" title={raceName ?? "Même famille"} />
          <div className="grid max-h-[320px] grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4 lg:grid-cols-6">
            {family
              .filter((m) => m.id !== monsterId)
              .map((m) => (
                <Link
                  key={m.id}
                  to={`/monstres/${m.id}`}
                  title={m.name.fr}
                  className="no-drag glass glass-hover group relative flex flex-col items-center gap-1 rounded-xl p-2 text-center"
                >
                  {m.isBoss && (
                    <span className="absolute right-1 top-1 rounded-full bg-glow-rose p-0.5">
                      <Skull className="h-2.5 w-2.5 text-white" />
                    </span>
                  )}
                  <img
                    src={m.img}
                    alt=""
                    loading="lazy"
                    className="h-11 w-11 object-contain transition group-hover:scale-110"
                    onError={(e) => (e.currentTarget.style.opacity = "0.25")}
                  />
                  <span className="line-clamp-2 text-[11px] leading-tight text-slate-300">{m.name.fr}</span>
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* Zone ciblable agrandie */}
      <AnimatePresence>
        {mapBig && selectedSpell && spellLevel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMapBig(false)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="glass relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-3xl p-5 ring-1 ring-white/10"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 font-display text-lg font-bold text-white">
                  <Target className="h-5 w-5 text-glow-cyan" /> {selectedSpell.name.fr} — Zone ciblable
                </h3>
                <button
                  onClick={() => setMapBig(false)}
                  className="no-drag rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mb-3 text-xs text-slate-500">
                {mapSubtitle(spellLevel)}
              </p>
              <SpellRangeMap level={spellLevel} cell={24} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openItem !== null && (
          <ItemModal id={openItem} onClose={() => setOpenItem(null)} onSelectItem={setOpenItem} />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatsBlock({ grade }: { grade: MonsterGrade }) {
  return (
    <div className="flex-1">
      <div className="flex flex-wrap gap-2">
        <BigStat icon={Heart} label="PV" value={grade.lifePoints.toLocaleString("fr-FR")} color="text-glow-rose" />
        <BigStat icon={Zap} label="PA" value={grade.actionPoints} color="text-glow-cyan" />
        <BigStat icon={Footprints} label="PM" value={grade.movementPoints} color="text-glow-emerald" />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {CHARS.map((c) => {
          const v = (grade[c.key] as number | undefined) ?? 0;
          return (
            <div key={c.key} className="rounded-xl border border-white/5 bg-white/[0.02] p-2 text-center">
              <div className="truncate text-[10px] uppercase tracking-wide text-slate-500">{c.label}</div>
              <div className="text-sm font-bold text-white">{v}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-2 grid grid-cols-5 gap-2">
        {RES.map((r) => {
          const v = (grade[r.key] as number) ?? 0;
          const el = ELEMENTS[r.el];
          return (
            <div key={r.key} className="rounded-xl border border-white/5 bg-white/[0.02] p-2 text-center">
              <div className="mb-0.5 flex items-center justify-center gap-1">
                <span className={clsx("h-1.5 w-1.5 rounded-full", el.dot)} />
                <span className="text-[10px] uppercase text-slate-500">{r.label}</span>
              </div>
              <div className={clsx("text-sm font-bold", v < 0 ? "text-glow-emerald" : "text-white")}>
                {v > 0 ? "+" : ""}
                {v}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SpellDetail({ spell, level, grade }: { spell: ClassSpell; level?: SpellLevel; grade?: MonsterGrade }) {
  // Dégâts mis à l'échelle du niveau du mob : dé × (100 + stat de l'élément) / 100.
  const dmg = level ? scaleAll(level.damage, grade) : [];
  const crit = level ? scaleAll(level.criticalDamage, grade) : [];
  const util = level?.utility ?? [];
  const critUtil = level?.criticalUtility ?? [];
  const hasAny = dmg.length || crit.length || util.length || critUtil.length;
  return (
    <motion.div
      key={spell.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
    >
      <div className="flex items-start gap-3">
        <img
          src={spell.img}
          alt={spell.name.fr}
          className="h-12 w-12 shrink-0 rounded-lg bg-void-700/60 object-cover ring-1 ring-white/10"
          onError={(e) => (e.currentTarget.style.opacity = "0.3")}
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-lg font-bold text-white">{spell.name.fr}</h3>
          {level && (
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <Pill tone="cyan">
                <Zap className="h-3 w-3" /> {level.apCost} PA
              </Pill>
              <Pill tone="purple">
                <Crosshair className="h-3 w-3" /> {rangeLabel(level)} PO
              </Pill>
              {level.critProbability > 0 && (
                <Pill tone="gold">
                  <Star className="h-3 w-3" /> {level.critProbability}%
                </Pill>
              )}
            </div>
          )}
        </div>
      </div>

      {spell.description.fr && (
        <p className="mt-3 text-sm leading-6 text-slate-400">{spell.description.fr}</p>
      )}

      {(dmg.length > 0 || util.length > 0) && <EffectList title="Effets" damage={dmg} utility={util} />}
      {(crit.length > 0 || critUtil.length > 0) && (
        <EffectList title="Effets critiques" damage={crit} utility={critUtil} />
      )}
      {level && !hasAny && (
        <p className="mt-3 text-xs italic text-slate-500">Aucun effet listé.</p>
      )}
      {grade && (dmg.length > 0 || crit.length > 0) && (
        <p className="mt-2 text-[11px] text-slate-500">Dégâts calculés au niveau {grade.level} du monstre.</p>
      )}
    </motion.div>
  );
}

function EffectList({ title, damage, utility = [] }: { title: string; damage: SpellDamage[]; utility?: string[] }) {
  return (
    <div className="mt-3">
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <ul className="space-y-1">
        {damage.map((d, i) => {
          const el = ELEMENTS[d.element] ?? ELEMENTS[0];
          const range = d.min === d.max ? `${d.max}` : `${d.min} à ${d.max}`;
          return (
            <li
              key={`d${i}`}
              className="rounded-lg border border-white/5 bg-white/[0.02] px-2.5 py-1.5 text-sm"
            >
              <div className="flex items-center gap-2">
                <span className={clsx("h-2.5 w-2.5 shrink-0 rounded-full", el.dot)} />
                <span className="text-slate-200">
                  <span className="font-semibold text-white">{range}</span>{" "}
                  {d.steal ? "vol de vie" : "dommages"} <span className={clsx("font-semibold", el.text)}>{el.label}</span>
                  {d.delayed ? <span className="text-slate-500">{` (dans ${d.delay} tour${d.delay > 1 ? "s" : ""})`}</span> : ""}
                  {d.conditionLabel ? <span className="text-slate-500">{` · si ${d.conditionLabel}`}</span> : ""}
                </span>
              </div>
              {d.trigger && <p className="ml-4 mt-0.5 text-xs leading-snug text-slate-500">{d.trigger}</p>}
            </li>
          );
        })}
        {utility.map((u, i) => {
          const { Icon, color } = utilityIcon(u);
          const [main, anno] = splitAnnotation(u);
          return (
            <li
              key={`u${i}`}
              className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-2.5 py-1.5 text-sm"
            >
              <Icon className={clsx("h-3.5 w-3.5 shrink-0", color)} />
              <span className="text-slate-200">
                {main}
                {anno && <span className="text-slate-500">{anno}</span>}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Décalages des cases touchées par la zone du sort (relatifs à l'impact), d'après les ids de
// forme officiels DofusDB. size = param1. dir = direction lanceur→impact (lignes/perpendiculaires).
function zoneOffsets(level: SpellLevel, dirX: number, dirY: number): [number, number][] {
  const id = level.zoneShape ?? 0;
  const size = Math.min(level.zoneSize ?? 0, 6);
  const out: [number, number][] = [[0, 0]];
  if (!id || id === 80 || size <= 0) return out; // NONE / POINT → mono-case
  const dx = dirX || 1;
  const dy = dirY || 0;
  const cardinal = () => {
    for (let k = 1; k <= size; k++) out.push([k, 0], [-k, 0], [0, k], [0, -k]);
  };
  const diagonal = () => {
    for (let k = 1; k <= size; k++) out.push([k, k], [-k, -k], [k, -k], [-k, k]);
  };
  switch (id) {
    case 67: // CIRCLE
      for (let x = -size; x <= size; x++) for (let y = -size; y <= size; y++) if (Math.abs(x) + Math.abs(y) <= size && (x || y)) out.push([x, y]);
      break;
    case 79: // RING
      for (let x = -size; x <= size; x++) for (let y = -size; y <= size; y++) if (Math.abs(x) + Math.abs(y) === size) out.push([x, y]);
      break;
    case 88: // CROSS (cardinale)
      cardinal();
      break;
    case 43: // DIAGONAL CROSS
      diagonal();
      break;
    case 42: // STAR (cardinale + diagonale)
      cardinal();
      diagonal();
      break;
    case 76: // LINE (direction du tir)
      for (let k = 1; k <= size; k++) out.push([dx * k, dy * k]);
      break;
    case 84: // PERPENDICULAR LINE
      for (let k = 1; k <= size; k++) out.push([-dy * k, dx * k], [dy * k, -dx * k]);
      break;
    default:
      break; // formes rares (cône, boomerang…) non gérées → mono-case (pas de fausse zone)
  }
  return out;
}

function spellHasZone(level: SpellLevel): boolean {
  return zoneOffsets(level, 1, 0).length > 1;
}

function mapSubtitle(level: SpellLevel): string {
  const wholeMap = level.zoneShape === 97 || level.zoneShape === 65;
  const range = level.range ?? 0;
  const selfCast = !wholeMap && range === 0;
  // Une portée peut coexister avec un effet « toute la carte » → on montre les deux.
  let s: string;
  if (selfCast) s = "Sur le lanceur";
  else s = `Portée ${rangeLabel(level)}`;
  if (wholeMap) s += " · toute la carte";
  if (level.castInLine) s += " · en ligne";
  if (level.castInDiagonal) s += " · en diagonale";
  s += level.losRequired ? " · ligne de vue" : " · sans ligne de vue";
  if (!selfCast && !wholeMap && spellHasZone(level)) s += " · survole une case pour la zone";
  return s;
}

// Grille isométrique (diamant) des cases ciblables, façon Dofus.
const TILT = 0.6; // aplatissement vertical (perspective iso de Dofus)
const GRID_R = 6; // rayon FIXE de la grille (13×13) → même taille de cases pour tous les sorts
function SpellRangeMap({ level, cell = 16 }: { level: SpellLevel; cell?: number }) {
  const range = level.range ?? 0;
  const minRange = Math.max(0, level.minRange ?? 0);
  const line = !!level.castInLine;
  const diag = !!level.castInDiagonal;
  const wholeMap = level.zoneShape === 97 || level.zoneShape === 65; // effet sur toute la carte
  const selfCast = !wholeMap && range === 0; // lancé sur le lanceur
  const R = GRID_R; // grille fixe (les cases ne rétrécissent jamais selon le sort)
  const size = R * 2 + 1;
  const gap = Math.max(3, Math.round(cell / 6));
  const gridPx = size * cell + (size - 1) * gap;
  const diagPx = gridPx * Math.SQRT2; // largeur du losange (constante car grille fixe)
  const boxW = Math.round(diagPx) + 24;
  const boxH = Math.round(diagPx * TILT) + 24;
  const gridTransform = `scaleY(${TILT}) rotate(45deg)`;

  const [hover, setHover] = useState<{ dx: number; dy: number } | null>(null);

  const cells: { key: string; dx: number; dy: number; center: boolean; target: boolean }[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const dx = c - R;
      const dy = r - R;
      const dist = Math.abs(dx) + Math.abs(dy);
      const center = dist === 0;
      let target = dist > 0 && dist >= Math.max(1, minRange) && dist <= range;
      // castInLine / castInDiagonal : contraintes combinées en OU (les deux = 8 directions).
      if (target && (line || diag)) {
        const onLine = dx === 0 || dy === 0;
        const onDiag = Math.abs(dx) === Math.abs(dy);
        target = (line && onLine) || (diag && onDiag);
      }
      cells.push({ key: `${r}-${c}`, dx, dy, center, target });
    }
  }

  const zoneSet = useMemo(() => {
    if (!hover) return null;
    const set = new Set<string>();
    for (const [ox, oy] of zoneOffsets(level, Math.sign(hover.dx), Math.sign(hover.dy))) {
      set.add(`${hover.dx + ox},${hover.dy + oy}`);
    }
    return set;
  }, [hover, level]);

  // Sort lancé sur le lanceur : zone d'effet fixe autour du mob (centre).
  const selfZone = useMemo(() => {
    if (!selfCast) return null;
    return new Set(zoneOffsets(level, 1, 0).map(([x, y]) => `${x},${y}`));
  }, [selfCast, level]);

  return (
    <div>
    <div
      className="relative mx-auto flex items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-void-900/70"
      style={{ width: boxW, height: boxH, maxWidth: "100%" }}
    >
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${size}, ${cell}px)`, gap, transform: gridTransform }}
      >
        {cells.map((c) => {
          const key = `${c.dx},${c.dy}`;
          const inZone = zoneSet?.has(key);
          const isImpact = hover && c.dx === hover.dx && c.dy === hover.dy;
          const inSelf = selfCast && !c.center && selfZone?.has(key);
          const canHover = range > 0 && c.target;
          // Effet « toute la carte » : fond vert clair sur les cases hors portée (et hors centre).
          const mapFill = wholeMap && !c.center && !c.target;
          return (
            <div
              key={c.key}
              style={{ width: cell, height: cell }}
              onMouseEnter={canHover ? () => setHover({ dx: c.dx, dy: c.dy }) : undefined}
              onMouseLeave={canHover ? () => setHover(null) : undefined}
              className={clsx(
                "relative rounded-[3px] border transition-colors",
                c.center
                  ? "border-glow-violet bg-glow-violet/50"
                  : isImpact
                    ? "border-glow-emerald bg-glow-emerald/70"
                    : inZone
                      ? "border-glow-emerald/80 bg-glow-emerald/45"
                      : inSelf
                        ? "border-glow-emerald/80 bg-glow-emerald/45"
                        : c.target
                          ? "cursor-pointer border-glow-cyan/60 bg-glow-cyan/30 hover:bg-glow-cyan/50"
                          : mapFill
                            ? "border-glow-emerald/35 bg-glow-emerald/20"
                            : "border-white/20 bg-white/[0.05]",
              )}
            />
          );
        })}
      </div>

      {/* Badge de ciblage spécial */}
      {(wholeMap || selfCast) && (
        <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-glow-emerald/30 bg-void-900/80 px-3 py-1 text-[11px] font-semibold text-glow-emerald">
          {wholeMap ? "Affecte toute la carte" : "Lancé sur le monstre"}
        </span>
      )}

      {/* Marqueur du lanceur — case centrale animée (pulsation), alignée sur le diamant incliné. */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
        <div style={{ transform: `scaleY(${TILT}) rotate(45deg)` }}>
          <motion.span
            className="block rounded-[4px] bg-glow-violet/55 ring-2 ring-glow-violet shadow-[0_0_14px_-2px_rgba(157,123,255,0.9)]"
            style={{ width: cell, height: cell }}
            animate={{ opacity: [1, 0.5, 1], scale: [1, 1.18, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>

    {/* Légende */}
    <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-400">
      <span className="inline-flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-[3px] border border-glow-violet bg-glow-violet/50" /> Monstre (au centre)
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-[3px] border border-glow-cyan/60 bg-glow-cyan/25" /> Portée
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-[3px] border border-glow-emerald/80 bg-glow-emerald/45" /> Zone d'effet
      </span>
    </div>
    </div>
  );
}

// Décalages des cases touchées par la zone du sort (relatifs à la case d'impact),
// selon la forme Ankama (code ASCII) + taille. dirX/dirY = direction lanceur → impact
// (pour les lignes/perpendiculaires). Formes inconnues mais à zone → cercle (sûr).
function BigStat({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Heart;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <Icon className={`h-5 w-5 ${color}`} />
      <div className="leading-none">
        <div className="text-base font-bold text-white">{value}</div>
        <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
      </div>
    </div>
  );
}

// "1,1;2,2;3,3" → Map(mobGrade → spellGrade).
function parseSpellGrades(raw?: string): Map<number, number> {
  const map = new Map<number, number>();
  if (!raw) return map;
  for (const pair of raw.split(";")) {
    const [m, s] = pair.split(",").map(Number);
    if (Number.isFinite(m) && Number.isFinite(s)) map.set(m, s);
  }
  return map;
}

// Caractéristique qui booste l'élément : Neutre/Terre→Force, Feu→Intel, Eau→Chance, Air→Agi.
function statForElement(grade: MonsterGrade | undefined, element: number): number {
  if (!grade) return 0;
  switch (element) {
    case 2:
      return grade.intelligence ?? 0;
    case 3:
      return grade.chance ?? 0;
    case 4:
      return grade.agility ?? 0;
    case 5:
      return Math.max(grade.strength ?? 0, grade.intelligence ?? 0, grade.chance ?? 0, grade.agility ?? 0);
    default:
      return grade.strength ?? 0; // 0 Neutre, 1 Terre
  }
}

// Applique le scaling de stat à chaque ligne de dégât (formule Ankama des monstres).
function scaleAll(damage: SpellDamage[], grade?: MonsterGrade): SpellDamage[] {
  return damage.map((d) => {
    const stat = statForElement(grade, d.element);
    const f = (100 + stat) / 100;
    return { ...d, min: Math.floor(d.min * f), max: Math.floor(d.max * f) };
  });
}

// Sépare le libellé d'un effet de ses annotations (« (dans N tours) », « · X% des cas »).
function splitAnnotation(s: string): [string, string] {
  const m = s.match(/^(.*?)(\s(?:\(|·|—).*)$/);
  return m ? [m[1], m[2]] : [s, ""];
}

// Icône + couleur d'un effet utilitaire selon son libellé.
function utilityIcon(text: string): { Icon: typeof Star; color: string } {
  const t = text.toLowerCase();
  if (t.startsWith("lance le sort")) return { Icon: WandSparkles, color: "text-glow-violet" };
  if (/\bpa\b/.test(t)) return { Icon: Zap, color: "text-glow-cyan" };
  if (/\bpm\b/.test(t)) return { Icon: Footprints, color: "text-glow-emerald" };
  if (/téléporte|repousse|attire|échange|position|pousse/.test(t)) return { Icon: Move, color: "text-glow-violet" };
  if (/soin|soigne|vie|pv/.test(t)) return { Icon: Heart, color: "text-glow-rose" };
  return { Icon: Star, color: "text-glow-gold" };
}

function rangeLabel(level: SpellLevel): string {
  return level.minRange && level.minRange !== level.range ? `${level.minRange}-${level.range}` : `${level.range}`;
}

function fmtPct(p: number): string {
  if (p == null) return "—";
  return p < 1 ? p.toFixed(2) : Math.round(p).toString();
}
