import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

import {
  getMonsterSpells,
  type Monster,
  type ClassSpell,
  type SpellLevel,
  type MonsterGrade,
  type SpellDamage,
} from "../api/dofusdb";
import { Pill } from "./ui";
import DofusIcon, { elementIcon, type DofusIconName } from "./DofusIcon";

// 0 Neutre · 1 Terre · 2 Feu · 3 Eau · 4 Air · 5 meilleur élément.
const ELEMENTS = [
  { label: "Neutre", text: "text-slate-300", dot: "bg-slate-400" },
  { label: "Terre", text: "text-amber-400", dot: "bg-amber-500" },
  { label: "Feu", text: "text-glow-ember", dot: "bg-glow-ember" },
  { label: "Eau", text: "text-glow-cyan", dot: "bg-glow-cyan" },
  { label: "Air", text: "text-glow-emerald", dot: "bg-glow-emerald" },
  { label: "Meilleur élément", text: "text-glow-violet", dot: "bg-glow-violet" },
];

// Décalages des cases touchées par la zone du sort (relatifs à l'impact), d'après les ids de
// forme officiels DofusDB. size = param1. dir = direction lanceur→impact (lignes/perpendiculaires).
export function zoneOffsets(level: SpellLevel, dirX: number, dirY: number): [number, number][] {
  const id = level.zoneShape ?? 0;
  const size = Math.min(level.zoneSize ?? 0, 6);
  const out: [number, number][] = [[0, 0]];
  if (!id || id === 80 || size <= 0) return out; // NONE / POINT → mono-case
  // Direction lanceur→impact, telle quelle : une cible sur l'axe vertical a dirX=0 — il NE
  // faut PAS forcer dirX à 1 (sinon la ligne/perpendiculaire part en diagonale). On ne met une
  // direction par défaut que si AUCUNE n'est fournie (cas dégénéré, ne devrait pas arriver).
  const dy = dirY;
  let dx = dirX;
  if (dx === 0 && dy === 0) dx = 1;
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

export function spellHasZone(level: SpellLevel): boolean {
  return zoneOffsets(level, 1, 0).length > 1;
}

export function rangeLabel(level: SpellLevel): string {
  return level.minRange && level.minRange !== level.range ? `${level.minRange}-${level.range}` : `${level.range}`;
}

export function mapSubtitle(level: SpellLevel): string {
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

// "1,1;2,2;3,3" → Map(mobGrade → spellGrade).
export function parseSpellGrades(raw?: string): Map<number, number> {
  const map = new Map<number, number>();
  if (!raw) return map;
  for (const pair of raw.split(";")) {
    const [m, s] = pair.split(",").map(Number);
    if (Number.isFinite(m) && Number.isFinite(s)) map.set(m, s);
  }
  return map;
}

// Niveau du sort calé sur le grade du monstre via spellGrades ("mobGrade,spellGrade;…").
// spellGrades est parallèle à `monster.spells` → on indexe par id (pas variantIndex, décalé
// par les sorts Auto ajoutés en tête).
export function spellLevelForGrade(
  monster: Monster,
  spell: ClassSpell | undefined,
  gradeIdx: number,
): SpellLevel | undefined {
  const lv = spell?.levels;
  if (!lv?.length) return undefined;
  const grade = monster.grades?.[Math.min(gradeIdx, Math.max(0, (monster.grades?.length ?? 1) - 1))];
  const mobGrade = grade?.grade ?? gradeIdx + 1;
  const sgIdx = (monster.spells ?? []).indexOf(spell!.id);
  const map = parseSpellGrades(sgIdx >= 0 ? monster.spellGrades?.[sgIdx] : undefined);
  const targetGrade = map.get(mobGrade) ?? mobGrade;
  return lv.find((l) => l.grade === targetGrade) ?? lv[Math.min(gradeIdx, lv.length - 1)];
}

// Grille isométrique (diamant) des cases ciblables, façon Dofus.
const TILT = 0.6; // aplatissement vertical (perspective iso de Dofus)
const GRID_R = 6; // rayon FIXE de la grille (13×13) → même taille de cases pour tous les sorts
export function SpellRangeMap({ level, cell = 16 }: { level: SpellLevel; cell?: number }) {
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

// Modal autonome : sélecteur de grade + de sort + carte de portée interactive d'un monstre.
// Réutilisé par la page Donjon (« Habitants du donjon » → clic sur un monstre).
export function MonsterSpellMapModal({
  monster,
  onClose,
  onViewDetail,
}: {
  monster: Monster;
  onClose: () => void;
  onViewDetail?: () => void;
}) {
  const spellIds = monster.spells ?? [];
  const startingLevelIds = [
    ...new Set((monster.grades ?? []).map((g) => g.startingSpellId).filter((v): v is number => !!v)),
  ];
  const { data: spells, isLoading } = useQuery({
    queryKey: ["monster-spells", monster.id, spellIds, startingLevelIds],
    queryFn: ({ signal }) => getMonsterSpells(spellIds, startingLevelIds, signal),
    enabled: spellIds.length > 0 || startingLevelIds.length > 0,
  });

  const grades = monster.grades ?? [];
  const [gradeIdx, setGradeIdx] = useState(0);
  const [spellId, setSpellId] = useState<number | null>(null);

  // Par défaut : un sort « normal » (pas l'Auto), pour montrer une vraie portée.
  const selectedSpell =
    (spells ?? []).find((s) => s.id === spellId) ?? (spells ?? []).find((s) => !s.auto) ?? (spells ?? [])[0];
  const spellLevel = useMemo(
    () => spellLevelForGrade(monster, selectedSpell, gradeIdx),
    [monster, selectedSpell, gradeIdx],
  );
  const grade = grades[Math.min(gradeIdx, Math.max(0, grades.length - 1))];

  // Fermeture au clavier (Échap).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
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
          {/* En-tête : portrait + nom + fermeture */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={monster.img}
                alt={monster.name.fr}
                className="h-12 w-12 shrink-0 rounded-lg bg-void-700/60 object-contain ring-1 ring-white/10"
                onError={(e) => (e.currentTarget.style.opacity = "0.3")}
              />
              <div className="min-w-0">
                <h3 className="truncate font-display text-lg font-bold text-white">{monster.name.fr}</h3>
                <p className="text-xs text-slate-500">Zone ciblable des sorts</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="no-drag shrink-0 rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <DofusIcon name="closeRed" size={16} />
            </button>
          </div>

          {/* Sélecteur de grade */}
          {grades.length > 1 && (
            <div className="mb-3 flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Grade</span>
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

          {isLoading ? (
            <p className="py-8 text-center text-sm text-slate-500">Chargement des sorts…</p>
          ) : (spells?.length ?? 0) === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">Aucun sort listé pour ce monstre.</p>
          ) : (
            <>
              {/* Sélecteur de sort */}
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
                    <img
                      src={sp.img}
                      alt=""
                      className="h-6 w-6 rounded object-cover"
                      onError={(e) => (e.currentTarget.style.opacity = "0.3")}
                    />
                    {sp.name.fr}
                    {sp.auto && (
                      <span className="rounded bg-glow-emerald/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-glow-emerald">
                        Auto
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {selectedSpell && spellLevel ? (
                <>
                  <p className="mb-3 text-xs text-slate-500">{mapSubtitle(spellLevel)}</p>
                  <SpellRangeMap level={spellLevel} cell={24} />
                  {/* Détail du sort : dégâts/effets calés sur le grade (comme la fiche monstre). */}
                  <div className="mt-4">
                    <SpellDetail spell={selectedSpell} level={spellLevel} grade={grade} />
                  </div>
                </>
              ) : (
                <p className="py-8 text-center text-sm text-slate-500">Pas de portée pour ce sort.</p>
              )}
            </>
          )}

          {onViewDetail && (
            <div className="mt-4 flex justify-end border-t border-white/5 pt-4">
              <button
                onClick={onViewDetail}
                className="no-drag inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <DofusIcon name="bestiary" size={14} /> Voir la fiche complète
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}

// Fiche détaillée d'un sort : portée/PA + description + dégâts (calés sur le grade du mob) + effets.
export function SpellDetail({ spell, level, grade }: { spell: ClassSpell; level?: SpellLevel; grade?: MonsterGrade }) {
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
                <DofusIcon name="pa" size={13} /> {level.apCost} PA
              </Pill>
              <Pill tone="purple">
                <DofusIcon name="po" size={13} /> {rangeLabel(level)} PO
              </Pill>
              {level.critProbability > 0 && (
                <Pill tone="gold">
                  <DofusIcon name="critique" size={13} /> {level.critProbability}%
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
                <DofusIcon name={elementIcon(d.element)} size={16} />
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
          const [main, anno] = splitAnnotation(u);
          return (
            <li
              key={`u${i}`}
              className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-2.5 py-1.5 text-sm"
            >
              <DofusIcon name={utilityIcon(u)} size={16} />
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

// Icône Dofus d'un effet utilitaire selon son libellé.
function utilityIcon(text: string): DofusIconName {
  const t = text.toLowerCase();
  if (t.startsWith("lance le sort")) return "etoile";
  if (t.startsWith("invoque")) return "invocation";
  if (t.includes("téléporte") || t.includes("position")) return "teleporter";
  if (t.includes("attire")) return "attirer";
  if (t.includes("échange")) return "echanger";
  if (t.includes("repousse") || t.includes("pousse")) return "dmgPoussee";
  if (t.includes("érosion") || t.includes("erosion")) return "erosion";
  if (/\bpm\b/.test(t)) return "pm";
  if (/\bpa\b/.test(t)) return "pa";
  if (t.includes("soin") || t.includes("soigne") || t.includes("vie")) return "soin";
  if (t.includes("bouclier") || t.includes("réduction") || t.includes("armure")) return "bouclier";
  return "etoile";
}
