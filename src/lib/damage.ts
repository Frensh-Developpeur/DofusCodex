import type { ClassSpell, SpellLevel, SpellDamage } from "../api/dofusdb";

// Éléments indexés comme effectElement de DofusDB : 0 Neutre, 1 Terre, 2 Feu, 3 Eau, 4 Air.
export const ELEMENTS = ["Neutre", "Terre", "Feu", "Eau", "Air"] as const;
export const ELEMENT_TONE = [
  "text-slate-300",
  "text-amber-400",
  "text-glow-ember",
  "text-glow-cyan",
  "text-glow-emerald",
];

export interface CharacterStats {
  strength: number;
  intelligence: number;
  chance: number;
  agility: number;
  vitality: number;
  wisdom: number;
  power: number; // Puissance (s'ajoute à toutes les caractéristiques pour les dégâts)
  damageFlat: number; // Dommages (fixe, tous éléments)
  damageByElement: number[]; // Dommages fixes par élément (index 0..4)
  damageBestElement: number; // Dommages fixes du meilleur élément
  // % de dégâts, multiplicatifs et séparés (formule DofusRoom) :
  damageFinal: number; // % Dommages finaux
  damageSpell: number; // % Dommages aux sorts
  damageMelee: number; // % Dommages mêlée
  damageRanged: number; // % Dommages distance
  critChance: number; // Coups Critiques (%)
  critDamage: number; // Dommages Critiques (fixe)
}

export interface TargetStats {
  resPct: number[]; // résistances % par élément (0..4)
  resFlat: number[]; // résistances fixes par élément (0..4)
}

export function emptyStats(): CharacterStats {
  return {
    strength: 0,
    intelligence: 0,
    chance: 0,
    agility: 0,
    vitality: 0,
    wisdom: 0,
    power: 0,
    damageFlat: 0,
    damageByElement: [0, 0, 0, 0, 0],
    damageBestElement: 0,
    damageFinal: 0,
    damageSpell: 0,
    damageMelee: 0,
    damageRanged: 0,
    critChance: 0,
    critDamage: 0,
  };
}

export function emptyTarget(): TargetStats {
  return { resPct: [0, 0, 0, 0, 0], resFlat: [0, 0, 0, 0, 0] };
}

// Caractéristique qui amplifie un élément donné (Neutre & Terre → Force).
function caracForElement(element: number, s: CharacterStats): number {
  switch (element) {
    case 2:
      return s.intelligence; // Feu
    case 3:
      return s.chance; // Eau
    case 4:
      return s.agility; // Air
    default:
      return s.strength; // Neutre (0) & Terre (1)
  }
}

function bestStatElement(s: CharacterStats): number {
  const values = [
    { el: 1, value: s.strength },
    { el: 2, value: s.intelligence },
    { el: 3, value: s.chance },
    { el: 4, value: s.agility },
  ];
  values.sort((a, b) => b.value - a.value || a.el - b.el);
  return values[0]?.el ?? 1;
}

// Formule de dégâts répliquée de DofusRoom (calculateElementDamage) :
//   inside  = floor( base × (1 + (puissance + carac)/100) + dommagesFixesÉlément (+ critiques si crit) )
//   facteur = (1 + %DomFinaux/100) × (1 + %DomSorts/100) × (1 + %DomMêlée|Distance/100)
//   dégâts  = floor(inside × facteur)  puis  × (1 − rés%/100) − résFixe
// `isRanged` : le sort est-il lancé à distance (portée > 1) → %Distance, sinon %Mêlée.
function applyFormula(
  base: number,
  element: number,
  s: CharacterStats,
  t: TargetStats,
  crit: boolean,
  isRanged: boolean,
): number {
  const carac = caracForElement(element, s);
  const bestElementDamage = element === bestStatElement(s) ? s.damageBestElement : 0;
  let flat = s.damageFlat + (s.damageByElement[element] ?? 0) + bestElementDamage;
  if (crit) flat += s.critDamage;
  const inside = Math.floor(base * (1 + (carac + s.power) / 100) + flat);
  const factor =
    (1 + s.damageFinal / 100) *
    (1 + s.damageSpell / 100) *
    (1 + (isRanged ? s.damageRanged : s.damageMelee) / 100);
  let dmg = Math.floor(inside * factor);
  // Cible : résistance % puis résistance fixe.
  dmg = Math.floor(dmg * (1 - (t.resPct[element] ?? 0) / 100)) - (t.resFlat[element] ?? 0);
  return Math.max(0, dmg);
}

export function estimateDamageValue(
  base: number,
  element: number,
  s: CharacterStats,
  t: TargetStats,
  crit: boolean,
  isRanged: boolean,
): number {
  return applyFormula(base, element, s, t, crit, isRanged);
}

// Pour le "meilleur élément" (effectElement 5), on teste les éléments élémentaires
// réels avec la formule complète plutôt qu'un simple score de caractéristique.
function bestElementForDamage(
  d: SpellDamage,
  s: CharacterStats,
  t: TargetStats,
  crit: boolean,
  isRanged: boolean,
): number {
  let best = 1;
  let bestScore = -Infinity;
  const base = Math.round((d.min + d.max) / 2);
  for (let el = 1; el <= 4; el++) {
    const score = applyFormula(base, el, s, t, crit, isRanged);
    if (score > bestScore) {
      bestScore = score;
      best = el;
    }
  }
  return best;
}

// Une ligne de dégâts par condition/déclencheur (façon DofusBook) : fourchettes par
// élément + total, en coup normal et en coup critique. Pas de moyenne.
export interface DamageElementLine {
  element: number; // 0..4 (5 résolu vers l'élément réel)
  min: number;
  max: number;
  critMin: number;
  critMax: number;
}
export interface DamageLine {
  label: string; // "Ennemi" (immédiat) | "Ennemi - Dans N tour" (différé)
  delay: number;
  elements: DamageElementLine[];
  totalMin: number;
  totalMax: number;
  totalCritMin: number;
  totalCritMax: number;
}

export interface SpellEstimate {
  hasDamage: boolean;
  lines: DamageLine[]; // affichage par condition (DofusBook-like)
  min: number;
  max: number;
  critMin: number;
  critMax: number;
  average: number; // pondéré par la probabilité de critique
  critChance: number; // % effectif
  mechanicMin: number;
  mechanicMax: number;
  mechanicCritMin: number;
  mechanicCritMax: number;
  mechanicAverage: number;
  totalMin: number;
  totalMax: number;
  totalCritMin: number;
  totalCritMax: number;
  totalAverage: number;
  hasMechanics: boolean;
}

// Probabilité de critique effective d'un sort (0 si le sort ne peut pas critiquer).
function effectiveCrit(level: SpellLevel, s: CharacterStats): number {
  if (!level.critProbability || level.critProbability <= 0) return 0;
  return Math.min(100, Math.max(0, level.critProbability + s.critChance));
}

// DofusDB ne stocke que ~3 grades par sort, débloqués à des paliers de niveau.
// On interpole linéairement la base de dégâts entre le grade courant et le suivant
// selon le niveau exact, pour un scaling continu sur les 200 niveaux du jeu.
export function spellLevelAt(spell: ClassSpell, playerLevel: number): SpellLevel | null {
  const unlocked = spell.levels
    .filter((l) => l.minPlayerLevel <= playerLevel)
    .sort((a, b) => a.grade - b.grade);
  if (!unlocked.length) return null;
  const cur = unlocked[unlocked.length - 1];
  const next = spell.levels.find((l) => l.grade === cur.grade + 1);
  if (!next || next.damage.length !== cur.damage.length || next.minPlayerLevel <= cur.minPlayerLevel) {
    return cur;
  }
  const t = Math.min(1, Math.max(0, (playerLevel - cur.minPlayerLevel) / (next.minPlayerLevel - cur.minPlayerLevel)));
  const damage: SpellDamage[] = cur.damage.map((d, i) => {
    const nd = next.damage[i];
    return {
      element: d.element,
      steal: d.steal,
      min: Math.round(d.min + (nd.min - d.min) * t),
      max: Math.round(d.max + (nd.max - d.max) * t),
      delayed: d.delayed,
      delay: d.delay,
      condition: d.condition,
      conditionLabel: d.conditionLabel,
    };
  });
  const criticalDamage: SpellDamage[] = cur.criticalDamage.map((d, i) => {
    const nd = next.criticalDamage[i];
    if (!nd) return d;
    return {
      element: d.element,
      steal: d.steal,
      min: Math.round(d.min + (nd.min - d.min) * t),
      max: Math.round(d.max + (nd.max - d.max) * t),
      delayed: d.delayed,
      delay: d.delay,
      condition: d.condition,
      conditionLabel: d.conditionLabel,
    };
  });
  return { ...cur, damage, criticalDamage };
}

function emptySpellEstimate(critChance = 0): SpellEstimate {
  return {
    hasDamage: false,
    lines: [],
    min: 0,
    max: 0,
    critMin: 0,
    critMax: 0,
    average: 0,
    critChance,
    mechanicMin: 0,
    mechanicMax: 0,
    mechanicCritMin: 0,
    mechanicCritMax: 0,
    mechanicAverage: 0,
    totalMin: 0,
    totalMax: 0,
    totalCritMin: 0,
    totalCritMax: 0,
    totalAverage: 0,
    hasMechanics: false,
  };
}

export function estimateSpell(
  level: SpellLevel,
  s: CharacterStats,
  t: TargetStats,
): SpellEstimate {
  const dmgEffects = level.damage;
  const p = effectiveCrit(level, s) / 100;
  if (!dmgEffects.length) {
    return emptySpellEstimate(Math.round(p * 100));
  }
  // Mêlée vs distance : on se base sur la portée du sort (portée > 1 → distance).
  const isRanged = (level.range ?? 0) > 1;
  const resolveEl = (d: SpellDamage, crit: boolean) =>
    d.element === 5 ? bestElementForDamage(d, s, t, crit, isRanged) : d.element;
  const directEffects = dmgEffects.filter((d) => !d.delayed);
  const critEffects = level.criticalDamage.length ? level.criticalDamage : dmgEffects;
  const directCritEffects = critEffects.filter((d) => !d.delayed);
  const mechanicEffects = dmgEffects.filter((d) => d.delayed);
  const mechanicCritEffects = critEffects.filter((d) => d.delayed);
  const sumEffects = (effects: SpellDamage[], crit: boolean, side: "min" | "max") =>
    effects.reduce((sum, d) => {
      const el = resolveEl(d, crit);
      return sum + applyFormula(d[side], el, s, t, crit, isRanged);
    }, 0);

  const min = sumEffects(directEffects, false, "min");
  const max = sumEffects(directEffects, false, "max");
  const critMin = sumEffects(directCritEffects, true, "min");
  const critMax = sumEffects(directCritEffects, true, "max");
  const mechanicMin = sumEffects(mechanicEffects, false, "min");
  const mechanicMax = sumEffects(mechanicEffects, false, "max");
  const mechanicCritMin = sumEffects(mechanicCritEffects, true, "min");
  const mechanicCritMax = sumEffects(mechanicCritEffects, true, "max");
  const totalMin = min + mechanicMin;
  const totalMax = max + mechanicMax;
  const totalCritMin = critMin + mechanicCritMin;
  const totalCritMax = critMax + mechanicCritMax;
  const avgNonCrit = (min + max) / 2;
  const avgCrit = (critMin + critMax) / 2;
  const avgMechanicNonCrit = (mechanicMin + mechanicMax) / 2;
  const avgMechanicCrit = (mechanicCritMin + mechanicCritMax) / 2;
  const avgTotalNonCrit = (totalMin + totalMax) / 2;
  const avgTotalCrit = (totalCritMin + totalCritMax) / 2;
  const average = Math.round(avgNonCrit * (1 - p) + avgCrit * p);
  const mechanicAverage = Math.round(avgMechanicNonCrit * (1 - p) + avgMechanicCrit * p);
  const totalAverage = Math.round(avgTotalNonCrit * (1 - p) + avgTotalCrit * p);

  // Lignes par condition/déclencheur (DofusBook-like) : groupées par `delay` ET `condition`
  // (états du targetMask).
  //  • Effets différés (delay > 0) → ligne propre « Dans N tour » (timing séparé, jamais sommé au coup direct).
  //  • Effets conditionnels (état requis) → la ligne CUMULE l'effet de base (même delay, sans condition) :
  //    ex. Aiguille = 9-12 toujours, +9-12 si la cible a Téléfrag → ligne « Téléfrag » = 18-24 (et non 9-12).
  //    Si aucun effet de base au même delay (ex. états exclusifs Saoul/Sobre), la ligne ne montre que sa propre valeur.
  const groups = new Map<
    string,
    { delay: number; condition: string; label: string; normal: SpellDamage[]; crit: SpellDamage[] }
  >();
  const groupOf = (d: SpellDamage) => {
    const key = `${d.delay}|${d.condition}`;
    let g = groups.get(key);
    if (!g) {
      g = { delay: d.delay, condition: d.condition, label: d.conditionLabel, normal: [], crit: [] };
      groups.set(key, g);
    }
    if (!g.label && d.conditionLabel) g.label = d.conditionLabel;
    return g;
  };
  for (const d of dmgEffects) groupOf(d).normal.push(d);
  for (const d of critEffects) groupOf(d).crit.push(d);
  // Effets de base (sans condition) par delay, à cumuler dans les lignes conditionnelles.
  const baseNormalByDelay = new Map<number, SpellDamage[]>();
  const baseCritByDelay = new Map<number, SpellDamage[]>();
  for (const g of groups.values()) {
    if (!g.condition) {
      baseNormalByDelay.set(g.delay, g.normal);
      baseCritByDelay.set(g.delay, g.crit);
    }
  }
  const lines: DamageLine[] = [...groups.values()]
    .sort((a, b) => a.delay - b.delay || a.condition.localeCompare(b.condition))
    .map((g) => {
      const delay = g.delay;
      // Ligne conditionnelle : on préfixe les effets de base (mêmes delay) car ils s'appliquent aussi.
      const normal = g.condition ? [...(baseNormalByDelay.get(delay) ?? []), ...g.normal] : g.normal;
      const crit = g.condition ? [...(baseCritByDelay.get(delay) ?? []), ...g.crit] : g.crit;
      const elMap = new Map<number, DamageElementLine>();
      const cell = (el: number) => {
        let c = elMap.get(el);
        if (!c) {
          c = { element: el, min: 0, max: 0, critMin: 0, critMax: 0 };
          elMap.set(el, c);
        }
        return c;
      };
      for (const d of normal) {
        const el = resolveEl(d, false);
        const c = cell(el);
        c.min += applyFormula(d.min, el, s, t, false, isRanged);
        c.max += applyFormula(d.max, el, s, t, false, isRanged);
      }
      for (const d of crit) {
        const el = resolveEl(d, true);
        const c = cell(el);
        c.critMin += applyFormula(d.min, el, s, t, true, isRanged);
        c.critMax += applyFormula(d.max, el, s, t, true, isRanged);
      }
      const elements = [...elMap.values()];
      const parts = [level.chargeScaled ? "Par charge" : "Ennemi"];
      if (delay > 0) parts.push(`Dans ${delay} tour${delay > 1 ? "s" : ""}`);
      if (g.condition) parts.push(g.label || "sous condition");
      return {
        label: parts.join(" - "),
        delay,
        elements,
        totalMin: elements.reduce((a, e) => a + e.min, 0),
        totalMax: elements.reduce((a, e) => a + e.max, 0),
        totalCritMin: elements.reduce((a, e) => a + e.critMin, 0),
        totalCritMax: elements.reduce((a, e) => a + e.critMax, 0),
      };
    });

  return {
    hasDamage: directEffects.length > 0 || mechanicEffects.length > 0,
    lines,
    min,
    max,
    critMin,
    critMax,
    average,
    critChance: Math.round(p * 100),
    mechanicMin,
    mechanicMax,
    mechanicCritMin,
    mechanicCritMax,
    mechanicAverage,
    totalMin,
    totalMax,
    totalCritMin,
    totalCritMax,
    totalAverage,
    hasMechanics: mechanicEffects.length > 0 || mechanicCritEffects.length > 0,
  };
}

const ITEM_EFFECT_IDS = {
  vitality: 9,
  wisdom: 10,
  intelligence: 13,
  chance: 22,
  critChance: 29,
  damageFlat: 30,
  power: 32,
  agility: 36,
  critDamage: 38,
  strength: 45,
  damageAir: 47,
  damageEarth: 48,
  damageNeutral: 49,
  damageFire: 61,
  damagePushback: 62,
  weaponDamageInflicted: 41,
  damageWater: 27,
  damageSpell: 93, // % Dommages aux sorts
} as const;

type ItemEffectTypeMeta = {
  id?: number;
  is_active?: boolean;
  isActive?: boolean;
};

function normalizedEffectName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function applyItemEffectById(s: CharacterStats, id: number, value: number): boolean {
  switch (id) {
    case ITEM_EFFECT_IDS.strength:
      s.strength += value;
      return true;
    case ITEM_EFFECT_IDS.intelligence:
      s.intelligence += value;
      return true;
    case ITEM_EFFECT_IDS.chance:
      s.chance += value;
      return true;
    case ITEM_EFFECT_IDS.agility:
      s.agility += value;
      return true;
    case ITEM_EFFECT_IDS.vitality:
      s.vitality += value;
      return true;
    case ITEM_EFFECT_IDS.wisdom:
      s.wisdom += value;
      return true;
    case ITEM_EFFECT_IDS.power:
      s.power += value;
      return true;
    case ITEM_EFFECT_IDS.critChance:
      s.critChance += value;
      return true;
    case ITEM_EFFECT_IDS.critDamage:
      s.critDamage += value;
      return true;
    case ITEM_EFFECT_IDS.damageFlat:
      s.damageFlat += value;
      return true;
    case ITEM_EFFECT_IDS.damageNeutral:
      s.damageByElement[0] += value;
      return true;
    case ITEM_EFFECT_IDS.damageEarth:
      s.damageByElement[1] += value;
      return true;
    case ITEM_EFFECT_IDS.damageFire:
      s.damageByElement[2] += value;
      return true;
    case ITEM_EFFECT_IDS.damageWater:
      s.damageByElement[3] += value;
      return true;
    case ITEM_EFFECT_IDS.damageAir:
      s.damageByElement[4] += value;
      return true;
    case ITEM_EFFECT_IDS.damageSpell:
      s.damageSpell += value;
      return true;
    case ITEM_EFFECT_IDS.damagePushback:
    case ITEM_EFFECT_IDS.weaponDamageInflicted:
      return true;
    default:
      return false;
  }
}

// --- Mapping des effets d'items DofusDude vers CharacterStats ---
// Priorité à type.id : c'est stable et évite les collisions entre "Dommage",
// "Dommage Terre" et les lignes actives d'armes. Le texte reste en fallback.
export function applyItemEffect(s: CharacterStats, name: string, value: number, type?: ItemEffectTypeMeta) {
  if (!value || type?.is_active || type?.isActive) return;
  if (typeof type?.id === "number" && applyItemEffectById(s, type.id, value)) return;

  const n = normalizedEffectName(name);
  // On ignore les résistances ici (elles ne servent qu'au résumé défensif).
  if (n.includes("resistance")) return;
  if (n.includes("dommage") && n.includes("critique")) s.critDamage += value;
  else if (n.includes("critique")) s.critChance += value; // Coups Critiques / % Critique
  else if (n.includes("vitalite")) s.vitality += value;
  else if (n.includes("sagesse")) s.wisdom += value;
  else if (n.includes("puissance")) s.power += value;
  else if (n.includes("force")) s.strength += value;
  else if (n.includes("intelligence")) s.intelligence += value;
  else if (n.includes("chance")) s.chance += value;
  else if (n.includes("agilite")) s.agility += value;
  else if (n.includes("dommage") && (n.includes("final") || n.includes("finaux"))) s.damageFinal += value;
  else if (n.includes("%") && n.includes("dommage") && n.includes("sort")) s.damageSpell += value;
  else if (n.includes("%") && n.includes("dommage") && n.includes("arme")) return; // n'affecte que les armes
  else if (n.includes("%") && n.includes("dommage") && (n.includes("melee") || n.includes("mêlée") || n.includes("corps")))
    s.damageMelee += value;
  else if (n.includes("%") && n.includes("dommage") && n.includes("distance")) s.damageRanged += value;
  else if (n.includes("dommage") && n.includes("poussee")) return;
  else if (n.includes("dommage") && n.includes("renvoy")) return;
  else if (n.includes("dommage") && n.includes("meilleur element")) s.damageBestElement += value;
  else if (n.includes("dommage") && n.includes("neutre")) s.damageByElement[0] += value;
  else if (n.includes("dommage") && n.includes("terre")) s.damageByElement[1] += value;
  else if (n.includes("dommage") && n.includes("feu")) s.damageByElement[2] += value;
  else if (n.includes("dommage") && n.includes("eau")) s.damageByElement[3] += value;
  else if (n.includes("dommage") && n.includes("air")) s.damageByElement[4] += value;
  else if (n.includes("%") && n.includes("dommage")) s.damageFinal += value; // % Dommages génériques → finaux (multiplicatif)
  else if (n.includes("dommage")) s.damageFlat += value; // Dommage (fixe)
}
