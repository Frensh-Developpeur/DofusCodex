import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { ChevronDown, Check, ImageOff } from "../components/DofusIcons";
import {
  getDungeon,
  getMonstersByIds,
  getItemsByIds,
  getDungeonArea,
  dungeonMapImg,
  pickBoss,
  type Monster,
} from "../api/dofusdb";
import { getDungeonGuide, type BossPhase } from "../data/dungeonGuides";
import { levelTone } from "../data/meta";
import { useStore, actions } from "../store/store";
import { Pill, Spinner, ErrorState, fadeUp } from "../components/ui";
import DofusIcon, { type DofusIconName } from "../components/DofusIcon";
import DetailBack from "../components/DetailBack";
import { MonsterSpellMapModal } from "../components/SpellRangeMap";

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

function fmtPct(p?: number): string {
  if (p == null) return "—";
  return p < 1 ? p.toFixed(2) : Math.round(p).toString();
}

// Petite stat (icône Dofus + valeur + libellé), façon MonsterDetail.
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
      <button onClick={() => setOpen((o) => !o)} className="no-drag flex w-full items-center gap-4 p-4 text-left">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 font-display text-lg font-bold text-white">
          {index + 1}
          <span className={`absolute inset-0 -z-10 rounded-xl bg-gradient-to-br ${meta.bar} opacity-30 blur`} />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-display font-bold text-white">{phase.title}</h4>
            <Pill tone={meta.tone}>{meta.label}</Pill>
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

// Carte monstre du roster — clic = ouvre la carte de portée interactive du monstre.
function MonsterCard({ monster, isBoss, onSelect }: { monster: Monster; isBoss: boolean; onSelect: () => void }) {
  const g = monster.grades?.[0];
  return (
    <button
      onClick={onSelect}
      title={`Voir la zone ciblable de ${monster.name.fr}`}
      className={clsx(
        "glass glass-hover no-drag group relative flex items-center gap-3 rounded-xl p-3 text-left transition",
        isBoss ? "ring-1 ring-glow-rose/40" : "hover:ring-1 hover:ring-white/15",
      )}
    >
      <div className="relative h-14 w-14 shrink-0">
        <img
          src={monster.img}
          alt={monster.name.fr}
          loading="lazy"
          className="h-full w-full rounded-lg bg-void-700 object-contain transition group-hover:scale-105"
          onError={(e) => (e.currentTarget.style.opacity = "0.2")}
        />
        {isBoss && (
          <span className="absolute -right-1 -top-1 rounded-full bg-glow-rose p-0.5 ring-2 ring-void-800">
            <DofusIcon name="boss" size={12} />
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white group-hover:text-glow-violet">{monster.name.fr}</p>
        <div className="mt-1 flex flex-wrap gap-1 text-[11px] text-slate-400">
          {g && <span>Niv. {g.level}</span>}
          {g && <span>· {g.lifePoints.toLocaleString("fr-FR")} PV</span>}
        </div>
      </div>
      <DofusIcon
        name="target"
        size={16}
        className="shrink-0 text-slate-600 transition group-hover:text-glow-cyan"
      />
    </button>
  );
}

// Rendu d'une map de donjon (image DofusDB) avec repli si indisponible.
function BossMap({ mapId, scale = "0.5" }: { mapId: number; scale?: "0.25" | "0.5" | "1" }) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center bg-void-900 text-slate-600">
        <ImageOff className="h-8 w-8" />
      </div>
    );
  return (
    <img
      src={dungeonMapImg(mapId, scale)}
      alt="Map du boss"
      loading="lazy"
      onError={() => setFailed(true)}
      className="block w-full bg-void-900 object-contain"
    />
  );
}

export default function DungeonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  // Région (aire) du donjon — best-effort, ne bloque rien.
  const { data: area } = useQuery({
    queryKey: ["dungeon-area", dungeon?.subarea],
    queryFn: ({ signal }) => getDungeonArea(dungeon!.subarea, signal),
    enabled: !!dungeon?.subarea,
    staleTime: Infinity,
  });

  // Grade du boss sélectionné (G1…G5) + map agrandie. Reset au changement de donjon.
  const [gradeIdx, setGradeIdx] = useState(0);
  const [mapBig, setMapBig] = useState(false);
  // Monstre sélectionné dans « Habitants » → carte de portée interactive (modal).
  const [spellMonster, setSpellMonster] = useState<Monster | null>(null);
  useEffect(() => {
    setGradeIdx(0);
    setMapBig(false);
    setSpellMonster(null);
  }, [dungeonId]);

  const roster = monsters ?? [];

  // Butin agrégé du donjon : tous les drops des monstres, dédoublonnés (meilleur %), triés.
  const dropList = useMemo(() => {
    const m = new Map<number, number>();
    for (const mon of roster) for (const d of mon.drops ?? []) {
      const p = d.percentDropForGrade1 ?? 0;
      if (p > (m.get(d.objectId) ?? 0)) m.set(d.objectId, p);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roster.map((m) => m.id).join(",")]);
  const dropIds = useMemo(() => dropList.map(([oid]) => oid), [dropList]);

  const { data: dropItems } = useQuery({
    queryKey: ["dungeon-drops", dungeonId, dropIds.length],
    queryFn: ({ signal }) => getItemsByIds(dropIds, signal),
    enabled: dropIds.length > 0,
    staleTime: 1000 * 60 * 30,
  });

  if (loadingDungeon) return <Spinner label="Chargement du donjon…" />;
  if (isError || !dungeon) return <ErrorState onRetry={refetch} />;

  const boss = monsters ? pickBoss(monsters) : null;
  const grades = boss?.grades ?? [];
  const bossGrade = grades[Math.min(gradeIdx, Math.max(0, grades.length - 1))];
  // Map du boss : dernière salle du donjon (convention) — rendu DofusDB.
  const bossMapId = dungeon.mapIds?.[dungeon.mapIds.length - 1];
  const { guide, authored } = getDungeonGuide(
    dungeon.id,
    dungeon.name.fr,
    dungeon.optimalPlayerLevel,
    dungeon.monsters?.length ?? 0,
  );
  const itemById = new Map((dropItems ?? []).map((it) => [it.id, it]));
  // On n'affiche que les ressources résolues (nom + image). Certains objectId de drop
  // n'existent pas dans /items (autre table, retirés du jeu…) → carrés noirs « #id » sinon.
  // Tant que dropItems charge, itemById est vide → on garde dropList pour ne pas vider la grille.
  const visibleDrops = dropItems ? dropList.filter(([oid]) => itemById.has(oid)) : dropList;
  const tone = levelTone(dungeon.optimalPlayerLevel);

  return (
    <div className="space-y-6">
      <DetailBack />

      {/* En-tête : portrait boss (cliquable) + identité + actions + stats du boss. */}
      <div className="glass relative overflow-hidden rounded-3xl p-5 sm:p-7">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_25%,rgba(244,63,94,0.14),transparent_48%)]" />
        <motion.div
          className="pointer-events-none absolute -right-12 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-glow-rose/15 blur-3xl"
          animate={{ opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Portrait du boss */}
          <button
            onClick={() => boss && navigate(`/monstres/${boss.id}`)}
            disabled={!boss}
            className="no-drag group relative mx-auto shrink-0 disabled:cursor-default"
            title={boss ? `Voir ${boss.name.fr}` : undefined}
          >
            <div className="absolute inset-0 rounded-2xl bg-glow-rose/20 blur-xl" />
            <div className="relative grid h-32 w-32 place-items-center rounded-2xl bg-void-900/50 ring-1 ring-white/10">
              {loadingMonsters ? (
                <div className="h-24 w-24 animate-pulse rounded-xl bg-white/5" />
              ) : boss ? (
                <motion.img
                  src={boss.img}
                  alt={boss.name.fr}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="h-28 w-28 object-contain drop-shadow-[0_10px_24px_rgba(255,93,143,0.45)] transition group-hover:scale-105"
                  onError={(e) => (e.currentTarget.style.opacity = "0.3")}
                />
              ) : (
                <DofusIcon name="boss" size={72} className="opacity-40" />
              )}
            </div>
          </button>

          {/* Identité + actions */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="rose">
                <DofusIcon name="boss" size={14} /> Boss de donjon
              </Pill>
              <Pill tone={tone}>Niv. optimal {dungeon.optimalPlayerLevel}</Pill>
              {area && (
                <Pill tone="cyan">
                  <DofusIcon name="map" size={12} /> {area}
                </Pill>
              )}
              <Pill tone={authored ? "purple" : "slate"}>
                <DofusIcon name="book" size={12} /> {authored ? "Guide détaillé" : "Guide auto-généré"}
              </Pill>
              {guide.achievements && guide.achievements.length > 0 && (
                <Pill tone="gold">
                  <DofusIcon name="trophy" size={12} /> {guide.achievements.length} succès
                </Pill>
              )}
            </div>

            <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
              {dungeon.name.fr}
            </h1>
            {boss && (
              <p className="mt-1 text-sm text-glow-rose">
                Boss : <span className="font-semibold">{boss.name.fr}</span>
              </p>
            )}
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">{guide.summary}</p>

            {/* Méta rapide : salles · ennemis · butin */}
            <div className="mt-4 flex flex-wrap gap-2">
              <BigStat icon="dungeonDoor" label="Salles" value={dungeon.mapIds?.length ?? 0} />
              <BigStat icon="bestiary" label="Ennemis" value={dungeon.monsters?.length ?? 0} />
              {visibleDrops.length > 0 && <BigStat icon="reward" label="Butin" value={visibleDrops.length} />}
            </div>

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
          </div>
        </div>

        {/* Bloc stats du boss (PV/PA/PM/Niveau) */}
        {bossGrade && (
          <div className="relative mt-5 border-t border-white/5 pt-5">
            {grades.length > 1 && (
              <div className="mb-3 flex flex-wrap items-center gap-1.5">
                <span className="mr-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Grade du boss
                </span>
                {grades.map((gr, i) => (
                  <button
                    key={gr.grade}
                    onClick={() => setGradeIdx(i)}
                    className={clsx(
                      "no-drag rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide transition",
                      i === gradeIdx
                        ? "bg-glow-rose/25 text-white ring-1 ring-glow-rose/50"
                        : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200",
                    )}
                  >
                    Niv. {gr.level}
                  </button>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <BigStat icon="pv" label="PV" value={bossGrade.lifePoints.toLocaleString("fr-FR")} />
              <BigStat icon="pa" label="PA" value={bossGrade.actionPoints} />
              <BigStat icon="pm" label="PM" value={bossGrade.movementPoints} />
              <BigStat icon="boss" label="Niveau" value={bossGrade.level} />
            </div>
          </div>
        )}
      </div>

      {/* Habitants du donjon — roster compact (clic = carte de portée interactive). */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-white">
          <DofusIcon name="bestiary" size={20} /> Habitants du donjon
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs font-normal text-slate-400">
            {roster.length}
          </span>
        </h2>
        {loadingMonsters ? (
          <Spinner label="Chargement des monstres…" />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {roster.map((m) => (
              <MonsterCard
                key={m.id}
                monster={m}
                isBoss={boss?.id === m.id}
                onSelect={() => setSpellMonster(m)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Corps : stratégie à gauche (mécaniques · conseils · succès), référence collante à droite (map · résistances · composition). */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
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
          </div>

          <div className="glass rounded-2xl p-5">
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
        </div>

        <div className="lg:col-span-1">
          <div className="space-y-5 lg:sticky lg:top-4">
          {bossMapId && (
            <div className="glass overflow-hidden rounded-2xl">
              <div className="flex items-center justify-between gap-2 border-b border-white/10 p-4">
                <h3 className="flex items-center gap-2 font-display font-bold text-white">
                  <DofusIcon name="map" size={18} /> Map du boss
                </h3>
                <button
                  onClick={() => setMapBig(true)}
                  className="no-drag inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <DofusIcon name="zoom" size={14} /> Agrandir
                </button>
              </div>
              <button onClick={() => setMapBig(true)} className="no-drag block w-full" title="Agrandir la map">
                <BossMap mapId={bossMapId} />
              </button>
            </div>
          )}

          {bossGrade && (
            <div className="glass rounded-2xl p-5">
              <h3 className="mb-4 flex items-center gap-2 font-display font-bold text-white">
                <DofusIcon name="bouclier" size={18} /> Résistances du boss
              </h3>
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
            <h3 className="mb-3 flex items-center gap-2 font-display font-bold text-white">
              <DofusIcon name="emote" size={18} /> Composition conseillée
            </h3>
            <p className="text-sm text-slate-300">{guide.composition}</p>
            <p className="mt-2 text-xs text-slate-500">Niveau recommandé : {guide.recommendedLevel}</p>
            {guide.rewards.length > 0 && (
              <>
                <p className="mb-2 mt-4 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  <DofusIcon name="reward" size={14} /> Loot notable
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {guide.rewards.map((rw, i) => (
                    <span key={i} className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300">
                      {rw}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
          </div>
        </div>
      </div>

      {/* Butin du donjon — drops résolus (nom + image), cliquables vers la fiche objet. */}
      {visibleDrops.length > 0 && (
        <div>
          <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-white">
            <DofusIcon name="reward" size={20} /> Butin du donjon
            <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs font-normal text-slate-400">
              {visibleDrops.length}
            </span>
          </h2>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
            {visibleDrops.map(([oid, pct]) => {
              const it = itemById.get(oid);
              return (
                <button
                  key={oid}
                  onClick={() => navigate(`/objets/${oid}`)}
                  title={it?.name.fr ?? `Objet #${oid}`}
                  className="no-drag group relative flex flex-col items-center gap-1 rounded-xl border border-white/5 bg-white/[0.02] p-2 text-center transition hover:border-glow-gold/40 hover:bg-white/[0.05]"
                >
                  <span className="absolute right-1 top-1 rounded bg-void-900/80 px-1 text-[10px] font-semibold text-glow-gold ring-1 ring-glow-gold/30">
                    {fmtPct(pct)}%
                  </span>
                  {it?.img ? (
                    <img src={it.img} alt="" loading="lazy" className="h-10 w-10 object-contain transition group-hover:scale-110" />
                  ) : (
                    <div className="h-10 w-10 rounded bg-white/5" />
                  )}
                  <span className="line-clamp-2 text-[11px] leading-tight text-slate-300">
                    {it?.name.fr ?? `#${oid}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Carte de portée interactive du monstre sélectionné dans « Habitants ». */}
      {spellMonster && (
        <MonsterSpellMapModal
          monster={spellMonster}
          onClose={() => setSpellMonster(null)}
          onViewDetail={() => navigate(`/monstres/${spellMonster.id}`)}
        />
      )}

      {/* Map du boss agrandie — en portal pour passer au-dessus de la chrome. */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {mapBig && bossMapId && (
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
                  className="glass relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded-3xl p-5 ring-1 ring-white/10"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h3 className="flex items-center gap-2 font-display text-lg font-bold text-white">
                      <DofusIcon name="map" size={20} /> {dungeon.name.fr} — Map du boss
                    </h3>
                    <button
                      onClick={() => setMapBig(false)}
                      className="no-drag rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                    >
                      <DofusIcon name="closeRed" size={16} />
                    </button>
                  </div>
                  <div className="overflow-auto rounded-xl border border-white/10 bg-void-900">
                    <BossMap mapId={bossMapId} scale="1" />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
