import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Check,
} from "../components/DofusIcons";
import { getDungeon, getMonstersByIds, pickBoss, type Monster } from "../api/dofusdb";
import { getDungeonGuide, type BossPhase } from "../data/dungeonGuides";
import { levelTone } from "../data/meta";
import { useStore, actions } from "../store/store";
import { Pill, Spinner, ErrorState, fadeUp } from "../components/ui";
import DofusIcon, { type DofusIconName } from "../components/DofusIcon";
import DetailBack from "../components/DetailBack";

const ELEMENTS: { key: keyof Monster["grades"][0]; label: string; color: string; icon: DofusIconName }[] = [
  { key: "earthResistance", label: "Terre", color: "bg-amber-500", icon: "resTerre" },
  { key: "fireResistance", label: "Feu", color: "bg-glow-ember", icon: "resFeu" },
  { key: "waterResistance", label: "Eau", color: "bg-glow-cyan", icon: "resEau" },
  { key: "airResistance", label: "Air", color: "bg-glow-emerald", icon: "resAir" },
  { key: "neutralResistance", label: "Neutre", color: "bg-slate-400", icon: "resNeutre" },
];

const DANGER_META: Record<BossPhase["danger"], { label: string; tone: any; bar: string }> = {
  low: { label: "Facile", tone: "emerald", bar: "from-glow-emerald to-glow-cyan" },
  medium: { label: "Modéré", tone: "gold", bar: "from-glow-gold to-glow-ember" },
  high: { label: "Dangereux", tone: "ember", bar: "from-glow-ember to-glow-rose" },
  extreme: { label: "Extrême", tone: "rose", bar: "from-glow-rose to-glow-purple" },
};

function StatChip({ icon: Icon, dofus, label, value, color }: any) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      {dofus ? <DofusIcon name={dofus} size={16} /> : <Icon className={`h-4 w-4 ${color}`} />}
      <div className="leading-none">
        <div className="text-sm font-bold text-white">{value}</div>
        <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
      </div>
    </div>
  );
}

function ResistanceBar({ label, value, color, icon }: { label: string; value: number; color: string; icon: DofusIconName }) {
  const width = Math.min(100, Math.max(4, Math.abs(value)));
  const weak = value < 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-slate-400">
          <DofusIcon name={icon} size={14} /> {label}
        </span>
        <span className={weak ? "font-semibold text-glow-emerald" : "text-slate-300"}>
          {value > 0 ? `+${value}` : value}%{weak && " ⤵ faible"}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${weak ? "bg-glow-emerald" : color} opacity-80`}
        />
      </div>
    </div>
  );
}

function PhaseCard({ phase, index }: { phase: BossPhase; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const meta = DANGER_META[phase.danger];
  return (
    <motion.div variants={fadeUp} custom={index} className="glass overflow-hidden rounded-2xl">
      <button
        onClick={() => setOpen((o) => !o)}
        className="no-drag flex w-full items-center gap-4 p-4 text-left"
      >
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 font-display text-lg font-bold text-white">
          {index + 1}
          <span className={`absolute inset-0 -z-10 rounded-xl bg-gradient-to-br ${meta.bar} opacity-30 blur`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-display font-bold text-white">{phase.title}</h4>
            {phase.hp && <span className="text-xs text-slate-500">{phase.hp} PV</span>}
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 text-slate-500 transition ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="space-y-2 px-4 pb-4 pl-16">
              {phase.mechanics.map((m, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-glow-purple" />
                  {m}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MonsterCard({ monster, isBoss }: { monster: Monster; isBoss: boolean }) {
  const g = monster.grades?.[0];
  return (
    <div
      className={`glass relative flex items-center gap-3 rounded-xl p-3 ${
        isBoss ? "ring-1 ring-glow-rose/40" : ""
      }`}
    >
      <div className="relative h-14 w-14 shrink-0">
        <img
          src={monster.img}
          alt={monster.name.fr}
          loading="lazy"
          className="h-full w-full rounded-lg bg-void-700 object-contain"
          onError={(e) => (e.currentTarget.style.opacity = "0.2")}
        />
        {isBoss && (
          <span className="absolute -right-1 -top-1 rounded-full bg-glow-rose p-0.5">
            <DofusIcon name="boss" size={12} />
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-white">{monster.name.fr}</p>
        <div className="mt-1 flex flex-wrap gap-1 text-[11px] text-slate-400">
          {g && <span>Niv. {g.level}</span>}
          {g && <span>· {g.lifePoints} PV</span>}
        </div>
      </div>
    </div>
  );
}

export default function DungeonDetail() {
  const { id } = useParams();
  const dungeonId = Number(id);

  const { data: dungeon, isLoading: loadingDungeon, isError, refetch } = useQuery({
    queryKey: ["dungeon", dungeonId],
    queryFn: ({ signal }) => getDungeon(dungeonId, signal),
    enabled: Number.isFinite(dungeonId),
  });

  const { data: monsters, isLoading: loadingMonsters } = useQuery({
    queryKey: ["dungeon-monsters", dungeonId, dungeon?.monsters],
    queryFn: ({ signal }) => getMonstersByIds(dungeon!.monsters, signal),
    enabled: !!dungeon?.monsters?.length,
  });

  const isFav = useStore((s) => s.favoriteDungeons.includes(dungeonId));
  const isDone = useStore((s) => s.doneDungeons.includes(dungeonId));

  if (loadingDungeon) return <Spinner label="Chargement du donjon…" />;
  if (isError || !dungeon) return <ErrorState onRetry={refetch} />;

  const boss = monsters ? pickBoss(monsters) : null;
  const roster = monsters ?? [];
  const bossGrade = boss?.grades?.[0];
  const { guide, authored } = getDungeonGuide(
    dungeon.id,
    dungeon.name.fr,
    dungeon.optimalPlayerLevel,
    dungeon.monsters?.length ?? 0,
  );

  return (
    <div className="space-y-8">
      <DetailBack />

      {/* Boss hero */}
      <div className="glass relative overflow-hidden rounded-3xl p-8">
        <motion.div
          className="absolute -right-10 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-glow-rose/20 blur-3xl"
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <div className="relative flex flex-col items-center gap-8 md:flex-row md:items-stretch">
          {/* Boss visual */}
          <div className="relative flex w-full shrink-0 items-center justify-center md:w-64">
            <motion.div
              className="absolute h-48 w-48 rounded-full bg-gradient-to-br from-glow-rose/30 to-glow-purple/20 blur-2xl"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            {loadingMonsters ? (
              <div className="h-44 w-44 animate-pulse rounded-2xl bg-white/5" />
            ) : boss ? (
              <motion.img
                src={boss.img}
                alt={boss.name.fr}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                transition={{
                  opacity: { duration: 0.5 },
                  scale: { duration: 0.5 },
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                }}
                className="relative h-44 w-44 object-contain drop-shadow-[0_10px_30px_rgba(255,93,143,0.45)]"
                onError={(e) => (e.currentTarget.style.opacity = "0.3")}
              />
            ) : (
              <DofusIcon name="boss" size={128} className="opacity-40" />
            )}
          </div>

          {/* Boss info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="rose">
                <DofusIcon name="boss" size={14} /> Boss de donjon
              </Pill>
              <Pill tone={levelTone(dungeon.optimalPlayerLevel)}>
                Niv. optimal {dungeon.optimalPlayerLevel}
              </Pill>
              {authored ? (
                <Pill tone="purple">
                  <DofusIcon name="book" size={12} /> Guide détaillé
                </Pill>
              ) : (
                <Pill tone="slate">
                  <DofusIcon name="book" size={12} /> Guide auto-généré
                </Pill>
              )}
              {guide.achievements && guide.achievements.length > 0 && (
                <Pill tone="gold">
                  <DofusIcon name="trophy" size={12} /> {guide.achievements.length} succès
                </Pill>
              )}
            </div>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-white">
              {dungeon.name.fr}
            </h1>
            {boss && (
              <p className="mt-1 text-glow-rose">
                Boss : <span className="font-semibold">{boss.name.fr}</span>
              </p>
            )}
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">{guide.summary}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => actions.toggleDoneDungeon(dungeonId)}
                className={`no-drag inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  isDone
                    ? "bg-glow-emerald/20 text-glow-emerald ring-1 ring-glow-emerald/40"
                    : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                }`}
              >
                <Check className="h-4 w-4" /> {isDone ? "Donjon terminé" : "Marquer comme fait"}
              </button>
              <button
                onClick={() => actions.toggleFavoriteDungeon(dungeonId)}
                className={`no-drag inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  isFav
                    ? "bg-glow-gold/20 text-glow-gold ring-1 ring-glow-gold/40"
                    : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                }`}
              >
                <DofusIcon name={isFav ? "starFilled" : "starEmpty"} size={16} /> Favori
              </button>
            </div>

            {bossGrade && (
              <div className="mt-5 flex flex-wrap gap-2">
                <StatChip dofus="pv" label="PV" value={bossGrade.lifePoints.toLocaleString("fr-FR")} />
                <StatChip dofus="pa" label="PA" value={bossGrade.actionPoints} />
                <StatChip dofus="pm" label="PM" value={bossGrade.movementPoints} />
                <StatChip dofus="boss" label="Niveau" value={bossGrade.level} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Phases */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-white">
            <DofusIcon name="epeesCroisees" size={20} /> Mécaniques du combat
          </h2>
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            className="space-y-3"
          >
            {guide.phases.map((p, i) => (
              <PhaseCard key={i} phase={p} index={i} />
            ))}
          </motion.div>

          {/* Tips */}
          <div className="glass mt-6 rounded-2xl p-5">
            <h3 className="mb-3 flex items-center gap-2 font-display font-bold text-white">
              <DofusIcon name="info" size={20} /> Conseils
            </h3>
            <ul className="space-y-2">
              {guide.tips.map((t, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-glow-gold" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar: résistances + infos + rewards */}
        <div className="space-y-6">
          {bossGrade && (
            <div className="glass rounded-2xl p-5">
              <h3 className="mb-4 font-display font-bold text-white">Résistances du boss</h3>
              <div className="space-y-3">
                {ELEMENTS.map((el) => (
                  <ResistanceBar
                    key={el.key}
                    label={el.label}
                    value={(bossGrade[el.key] as number) ?? 0}
                    color={el.color}
                    icon={el.icon}
                  />
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Tapez dans l'élément où la résistance est la plus faible (voire négative).
              </p>
            </div>
          )}

          <div className="glass rounded-2xl p-5">
            <h3 className="mb-3 font-display font-bold text-white">Composition conseillée</h3>
            <p className="text-sm text-slate-300">{guide.composition}</p>
            <p className="mt-2 text-xs text-slate-500">Niveau recommandé : {guide.recommendedLevel}</p>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="mb-3 flex items-center gap-2 font-display font-bold text-white">
              <DofusIcon name="reward" size={20} /> Récompenses
            </h3>
            <div className="flex flex-wrap gap-2">
              {guide.rewards.map((rw, i) => (
                <span
                  key={i}
                  className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300"
                >
                  {rw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Succès */}
      {guide.achievements && guide.achievements.length > 0 && (
        <div>
          <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-white">
            <DofusIcon name="trophy" size={20} /> Succès
            <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs font-normal text-slate-400">
              {guide.achievements.length}
            </span>
          </h2>
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.05 } } }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {guide.achievements.map((a, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className="glass rounded-2xl p-4 transition hover:ring-1 hover:ring-glow-gold/30"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-glow-gold/15 text-glow-gold ring-1 ring-glow-gold/30">
                    <DofusIcon name="trophy" size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display font-semibold leading-snug text-white">{a.name}</p>
                    {a.strategy ? (
                      <p className="mt-1 text-sm leading-relaxed text-slate-400">{a.strategy}</p>
                    ) : (
                      <p className="mt-1 text-xs italic text-slate-600">Stratégie non documentée</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Roster */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-white">
          <DofusIcon name="bestiary" size={20} /> Habitants du donjon
        </h2>
        {loadingMonsters ? (
          <Spinner label="Chargement des monstres…" />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {roster.map((m) => (
              <MonsterCard key={m.id} monster={m} isBoss={boss?.id === m.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
