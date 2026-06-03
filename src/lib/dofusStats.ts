import type { StatTier } from "../api/dofusdb";

// Points de caractéristique disponibles à un niveau donné : 5 par niveau dès le niveau 2.
export function statPointsForLevel(level: number): number {
  return Math.max(0, (level - 1) * 5);
}

function normalizedLevel(level: number): number {
  return Math.min(200, Math.max(1, Math.floor(level || 1)));
}

// PV natifs du personnage : 55 au niveau 1, puis +5 par niveau.
export function baseHpForLevel(level: number): number {
  return 50 + normalizedLevel(level) * 5;
}

export function baseApForLevel(level: number): number {
  return normalizedLevel(level) >= 100 ? 7 : 6;
}

export function baseMpForLevel() {
  return 3;
}

// Coût (en points) pour atteindre `carac` points de caractéristique, selon les paliers
// [[seuil, coût], …]. Ex Iop Force [[0,1],[100,2],[200,3],[300,4]] :
// 100 premiers à 1 pt, puis 2 pts/carac, etc.
export function pointsForCarac(carac: number, tiers: StatTier[]): number {
  if (carac <= 0) return 0;
  if (!tiers?.length) return carac;
  let cost = 0;
  let done = 0;
  for (let i = 0; i < tiers.length && done < carac; i++) {
    const next = i + 1 < tiers.length ? tiers[i + 1][0] : Infinity;
    const span = Math.min(next - tiers[i][0], carac - done);
    cost += span * tiers[i][1];
    done += span;
  }
  return cost;
}

// Plus haute caractéristique atteignable avec `points` points, selon les paliers.
export function maxCaracForPoints(points: number, tiers: StatTier[]): number {
  if (points <= 0) return 0;
  if (!tiers?.length) return points;
  let carac = 0;
  let remaining = points;
  for (let i = 0; i < tiers.length && remaining > 0; i++) {
    const cost = tiers[i][1];
    const next = i + 1 < tiers.length ? tiers[i + 1][0] : Infinity;
    const span = next - tiers[i][0];
    const affordable = Math.min(span, Math.floor(remaining / cost));
    carac += affordable;
    remaining -= affordable * cost;
  }
  return carac;
}
