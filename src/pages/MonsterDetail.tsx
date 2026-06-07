import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

import {
  getMonster,
  getMonsterSpells,
  getMonsterRaceName,
  getMonstersByRace,
  getItemsByIds,
  dungeonsWithMonster,
  type MonsterGrade,
  type SpellLevel,
} from "../api/dofusdb";
import { Pill, Spinner, ErrorState, SectionHeader } from "../components/ui";
import DofusIcon, { type DofusIconName } from "../components/DofusIcon";
import DetailBack from "../components/DetailBack";
import { SpellRangeMap, SpellDetail, mapSubtitle, spellLevelForGrade } from "../components/SpellRangeMap";

const RES = [
  { key: "earthResistance", label: "Terre", icon: "resTerre" },
  { key: "fireResistance", label: "Feu", icon: "resFeu" },
  { key: "waterResistance", label: "Eau", icon: "resEau" },
  { key: "airResistance", label: "Air", icon: "resAir" },
  { key: "neutralResistance", label: "Neutre", icon: "resNeutre" },
] as const;

const CHARS = [
  { key: "strength", label: "Force", icon: "force" },
  { key: "intelligence", label: "Intelligence", icon: "intelligence" },
  { key: "chance", label: "Chance", icon: "chance" },
  { key: "agility", label: "Agilité", icon: "agilite" },
  { key: "vitality", label: "Vitalité", icon: "vitalite" },
  { key: "wisdom", label: "Sagesse", icon: "sagesse" },
] as const;

export default function MonsterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
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
  // Niveau du sort calé sur le grade du monstre (voir spellLevelForGrade / spellGrades).
  const spellLevel = useMemo<SpellLevel | undefined>(
    () => (monster ? spellLevelForGrade(monster, selectedSpell, gradeIdx) : undefined),
    [monster, selectedSpell, gradeIdx],
  );

  if (isLoading) return <Spinner label="Chargement du monstre…" />;
  if (isError || !monster) return <ErrorState message="Monstre introuvable." onRetry={refetch} />;

  const drops = [...(monster.drops ?? [])].sort(
    (a, b) => (b.percentDropForGrade1 ?? 0) - (a.percentDropForGrade1 ?? 0),
  );
  const itemById = new Map((dropItems ?? []).map((it) => [it.id, it]));

  return (
    <div>
      <DetailBack />

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
                    <DofusIcon name="boss" size={12} /> Boss
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
              <DofusIcon name="spells" size={20} /> Sorts
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
                  <DofusIcon name="target" size={20} /> Zone ciblable
                </h2>
                <button
                  onClick={() => setMapBig(true)}
                  className="no-drag inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <DofusIcon name="zoom" size={14} /> Agrandir
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
                <DofusIcon name="reward" size={20} /> Butin ({drops.length})
              </h2>
              <div className="grid max-h-[300px] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
                {drops.map((d) => {
                  const it = itemById.get(d.objectId);
                  return (
                    <button
                      key={d.objectId}
                      onClick={() => navigate(`/objets/${d.objectId}`)}
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
                <DofusIcon name="dungeon" size={16} /> {dg.name.fr}
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
                      <DofusIcon name="boss" size={10} />
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
                  <DofusIcon name="target" size={20} /> {selectedSpell.name.fr} — Zone ciblable
                </h3>
                <button
                  onClick={() => setMapBig(false)}
                  className="no-drag rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <DofusIcon name="closeRed" size={16} />
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
    </div>
  );
}

function StatsBlock({ grade }: { grade: MonsterGrade }) {
  return (
    <div className="flex-1">
      <div className="flex flex-wrap gap-2">
        <BigStat icon="pv" label="PV" value={grade.lifePoints.toLocaleString("fr-FR")} />
        <BigStat icon="pa" label="PA" value={grade.actionPoints} />
        <BigStat icon="pm" label="PM" value={grade.movementPoints} />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {CHARS.map((c) => {
          const v = (grade[c.key] as number | undefined) ?? 0;
          return (
            <div key={c.key} className="rounded-xl border border-white/5 bg-white/[0.02] p-2 text-center">
              <div className="mb-0.5 flex items-center justify-center gap-1">
                <DofusIcon name={c.icon} size={13} />
                <span className="truncate text-[10px] uppercase tracking-wide text-slate-500">{c.label}</span>
              </div>
              <div className="text-sm font-bold text-white">{v}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-2 grid grid-cols-5 gap-2">
        {RES.map((r) => {
          const v = (grade[r.key] as number) ?? 0;
          return (
            <div key={r.key} className="rounded-xl border border-white/5 bg-white/[0.02] p-2 text-center">
              <div className="mb-0.5 flex items-center justify-center gap-1">
                <DofusIcon name={r.icon} size={13} />
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

function BigStat({ icon, label, value }: { icon: DofusIconName; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <DofusIcon name={icon} size={20} />
      <div className="leading-none">
        <div className="text-base font-bold text-white">{value}</div>
        <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
      </div>
    </div>
  );
}

function fmtPct(p: number): string {
  if (p == null) return "—";
  return p < 1 ? p.toFixed(2) : Math.round(p).toString();
}
