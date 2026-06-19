import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRunes, type Rune } from "../api/dofusdb";
import DofusIcon from "../components/DofusIcon";
import { Search } from "../components/DofusIcons";
import { Pill, Spinner, SectionHeader } from "../components/ui";

// Poids unitaire de forgemagie par caractéristique (poids consommé du « puits » par +1 de stat).
// Non exposé par l'API → table curée (réf. tableau des poids FM, Dofus 2026), libellés vérifiés
// sur les noms officiels DofusDB. Les runes (valeurs/icônes) viennent, elles, de l'API.
const STAT_WEIGHTS: Record<number, { label: string; weight: number }> = {
  1: { label: "Point d'Action (PA)", weight: 100 },
  23: { label: "Point de Mouvement (PM)", weight: 90 },
  19: { label: "Portée", weight: 51 },
  26: { label: "Invocation", weight: 30 },
  16: { label: "Dommages", weight: 20 },
  88: { label: "Dommages Terre", weight: 15 },
  89: { label: "Dommages Feu", weight: 15 },
  90: { label: "Dommages Eau", weight: 15 },
  91: { label: "Dommages Air", weight: 15 },
  92: { label: "Dommages Neutre", weight: 15 },
  49: { label: "Soins", weight: 10 },
  50: { label: "Renvoi de dommages", weight: 10 },
  18: { label: "% Critique", weight: 10 },
  84: { label: "Dommages Poussée", weight: 5 },
  86: { label: "Dommages Critiques", weight: 5 },
  79: { label: "Tacle", weight: 4 },
  78: { label: "Fuite", weight: 4 },
  33: { label: "Résistance % Terre", weight: 6 },
  34: { label: "Résistance % Feu", weight: 6 },
  35: { label: "Résistance % Eau", weight: 6 },
  36: { label: "Résistance % Air", weight: 6 },
  37: { label: "Résistance % Neutre", weight: 6 },
  12: { label: "Sagesse", weight: 3 },
  48: { label: "Prospection", weight: 3 },
  25: { label: "Puissance", weight: 2 },
  10: { label: "Force", weight: 1 },
  15: { label: "Intelligence", weight: 1 },
  13: { label: "Chance", weight: 1 },
  14: { label: "Agilité", weight: 1 },
  11: { label: "Vitalité", weight: 0.25 },
  40: { label: "Pods", weight: 0.25 },
  44: { label: "Initiative", weight: 0.1 },
};

interface StatOption {
  charac: number;
  label: string;
  weight: number;
  runes: Rune[]; // triées par valeur décroissante (Ra → Pa → basique)
  icon: string; // image de la rune de base
}

const nf = new Intl.NumberFormat("fr-FR");
function round2(n: number) {
  return Math.round(n * 100) / 100;
}

// Décompose une valeur de stat en runes (gloutonne : grosses runes d'abord → nombre minimal).
function breakdown(target: number, runes: Rune[]) {
  let rem = target;
  const lines: { rune: Rune; count: number }[] = [];
  for (const r of runes) {
    const n = Math.floor(rem / r.value);
    if (n > 0) {
      lines.push({ rune: r, count: n });
      rem -= n * r.value;
    }
  }
  let achieved = target - rem;
  let rounded = false;
  // Valeur non atteignable pile (rune de base > 1, ex. Vitalité +5) → on ajoute une rune.
  if (rem > 0 && runes.length) {
    const small = runes[runes.length - 1];
    const existing = lines.find((l) => l.rune.id === small.id);
    if (existing) existing.count += 1;
    else lines.push({ rune: small, count: 1 });
    achieved += small.value;
    rounded = true;
  }
  const total = lines.reduce((s, l) => s + l.count, 0);
  return { lines, achieved, rounded, total };
}

export default function Forgemagie() {
  const { data: runes, isLoading } = useQuery({
    queryKey: ["runes"],
    queryFn: ({ signal }) => getRunes(signal),
    staleTime: 1000 * 60 * 60 * 12,
  });

  const stats = useMemo<StatOption[]>(() => {
    const byCharac = new Map<number, Rune[]>();
    for (const r of runes ?? []) {
      if (!(r.charac in STAT_WEIGHTS)) continue;
      (byCharac.get(r.charac) ?? byCharac.set(r.charac, []).get(r.charac)!).push(r);
    }
    const out: StatOption[] = [];
    for (const [charac, list] of byCharac) {
      const sorted = [...list].sort((a, b) => b.value - a.value);
      out.push({
        charac,
        label: STAT_WEIGHTS[charac].label,
        weight: STAT_WEIGHTS[charac].weight,
        runes: sorted,
        icon: sorted[sorted.length - 1].img, // rune de base
      });
    }
    return out.sort((a, b) => a.label.localeCompare(b.label));
  }, [runes]);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [target, setTarget] = useState(50);
  const [pricePerWeight, setPricePerWeight] = useState(0);

  const filtered = useMemo(() => {
    const t = search.trim().toLowerCase();
    return t ? stats.filter((s) => s.label.toLowerCase().includes(t)) : stats;
  }, [stats, search]);

  const current = stats.find((s) => s.charac === selected) ?? filtered[0] ?? stats[0];
  const result = current ? breakdown(Math.max(0, Math.floor(target || 0)), current.runes) : null;
  const totalWeight = current && result ? round2(result.achieved * current.weight) : 0;
  const cost = pricePerWeight > 0 ? Math.round(totalWeight * pricePerWeight) : 0;

  return (
    <div className="mx-auto max-w-5xl space-y-5 py-2">
      <SectionHeader
        eyebrow="Outils"
        title="Forgemagie — calculateur de runes"
        subtitle="Choisis une caractéristique et une valeur cible : l'app calcule les runes nécessaires et le poids de forgemagie."
      />

      {isLoading ? (
        <Spinner label="Chargement des runes…" />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Liste des caractéristiques */}
          <div className="glass flex max-h-[70vh] flex-col rounded-2xl p-3 ring-1 ring-white/10">
            <div className="relative mb-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Caractéristique…"
                className="no-drag w-full rounded-xl border border-white/10 bg-void-800/60 py-2 pl-9 pr-3 text-sm text-slate-200 outline-none focus:border-glow-purple/50"
              />
            </div>
            <div className="-mr-1 flex-1 space-y-1 overflow-y-auto pr-1">
              {filtered.map((s) => (
                <button
                  key={s.charac}
                  onClick={() => setSelected(s.charac)}
                  className={`no-drag flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition ${
                    current?.charac === s.charac ? "bg-glow-purple/20 ring-1 ring-glow-purple/40" : "hover:bg-white/5"
                  }`}
                >
                  <img src={s.icon} alt="" loading="lazy" className="h-7 w-7 shrink-0 object-contain" />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">{s.label}</span>
                  <span className="shrink-0 text-[11px] text-slate-500">poids {s.weight}</span>
                </button>
              ))}
              {filtered.length === 0 && <p className="px-3 py-6 text-center text-sm text-slate-500">Aucune caractéristique.</p>}
            </div>
          </div>

          {/* Calculateur */}
          {current && result && (
            <div className="glass rounded-2xl p-5 ring-1 ring-white/10">
              <div className="mb-4 flex items-center gap-3">
                <img src={current.icon} alt="" className="h-10 w-10 object-contain" />
                <div>
                  <h3 className="font-display text-lg font-bold text-white">{current.label}</h3>
                  <p className="text-xs text-slate-500">Poids unitaire : {current.weight} / point</p>
                </div>
              </div>

              {/* Saisie cible + prix */}
              <div className="mb-5 flex flex-wrap items-end gap-4">
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Valeur cible</span>
                  <input
                    type="number"
                    min={0}
                    value={target}
                    onChange={(e) => setTarget(Number(e.target.value))}
                    className="no-drag w-28 rounded-lg border border-white/10 bg-void-800/60 px-3 py-2 text-sm font-bold text-white outline-none focus:border-glow-purple/50"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Prix au poids (kamas) — optionnel</span>
                  <input
                    type="number"
                    min={0}
                    value={pricePerWeight || ""}
                    onChange={(e) => setPricePerWeight(Number(e.target.value))}
                    placeholder="ex. 800"
                    className="no-drag w-36 rounded-lg border border-white/10 bg-void-800/60 px-3 py-2 text-sm font-bold text-white outline-none focus:border-glow-purple/50"
                  />
                </label>
              </div>

              {/* Récap */}
              <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Runes" value={nf.format(result.total)} tone="violet" />
                <Stat label="Poids FM" value={nf.format(totalWeight)} tone="cyan" />
                <Stat label="Valeur obtenue" value={`+${nf.format(result.achieved)}`} tone="emerald" />
                <Stat label="Coût estimé" value={cost > 0 ? `${nf.format(cost)} k` : "—"} tone="gold" />
              </div>
              {result.rounded && (
                <p className="mb-3 text-[11px] text-glow-gold">
                  ⚠ Valeur non atteignable pile avec ces runes → arrondie à +{result.achieved}.
                </p>
              )}

              {/* Détail des runes */}
              <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Runes à injecter</h4>
              {result.lines.length === 0 ? (
                <p className="text-sm text-slate-500">Entre une valeur cible.</p>
              ) : (
                <div className="space-y-1.5">
                  {result.lines.map((l) => (
                    <div key={l.rune.id} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
                      <img src={l.rune.img} alt="" loading="lazy" className="h-9 w-9 shrink-0 object-contain" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">{l.rune.name}</p>
                        <p className="text-[11px] text-slate-500">+{l.rune.value} par rune</p>
                      </div>
                      <span className="shrink-0 font-display text-lg font-bold text-glow-violet">×{l.count}</span>
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-4 text-[11px] leading-relaxed text-slate-600">
                Le « poids FM » est le poids consommé dans le puits de l'objet (valeur × poids unitaire). Au-delà du
                maximum d'une ligne, le poids réel augmente fortement (sur-poids) — non pris en compte ici. Le coût est
                une estimation : entre le prix moyen au poids constaté à l'HdV.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "violet" | "cyan" | "emerald" | "gold" }) {
  const color = {
    violet: "text-glow-violet",
    cyan: "text-glow-cyan",
    emerald: "text-glow-emerald",
    gold: "text-glow-gold",
  }[tone];
  return (
    <div className="rounded-xl border border-white/10 bg-void-900/40 px-3 py-2.5 text-center">
      <p className={`font-display text-xl font-extrabold tabular-nums ${color}`}>{value}</p>
      <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
    </div>
  );
}
