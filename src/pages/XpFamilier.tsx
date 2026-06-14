import { useMemo, useState } from "react";
import DofusIcon from "../components/DofusIcon";
import { SectionHeader, Pill } from "../components/ui";

// Table d'XP CUMULÉE d'un familier pour atteindre chaque niveau (1 → 100).
// Source : tableau d'XP familier DofusTool (jalons recoupés avec Dofus pour les Noobs).
// La courbe est quasi plate jusqu'au 50 puis explose : ~1 882 XP au niv. 50, 196 159 au niv. 100.
const CUMUL_XP = [
  1, 2, 3, 5, 7, 9, 11, 13, 15, 18, 21, 24, 28, 32, 37, 42, 48, 55, 62, 70, 79, 89, 101, 114, 128, 144, 162, 182, 204,
  228, 255, 285, 318, 355, 396, 441, 491, 546, 607, 675, 750, 832, 923, 1023, 1134, 1256, 1391, 1539, 1702, 1882, 2080,
  2298, 2537, 2800, 3089, 3407, 3756, 4140, 4561, 5023, 5530, 6087, 6698, 7368, 8102, 8907, 9789, 10755, 11814, 12974,
  14244, 15634, 17156, 18822, 20645, 22640, 24822, 27208, 29818, 32672, 35792, 39202, 42929, 47002, 51452, 56314, 61625,
  67426, 73761, 80678, 88230, 96475, 105475, 115298, 126018, 137715, 150478, 164402, 179591, 196159,
];
const MAX_LEVEL = 100;

// XP donnée à un familier par unité de ressource (source : Dofus pour les Noobs / DofusTool).
// La croquette enrichie (500 XP) est la référence « rapide » ; les autres servent de repères.
const RESOURCES = [
  { name: "Croquette enrichie", xp: 500, note: "100 Kolizétons ou 100 Pépites" },
  { name: "Rune Ga PA", xp: 500, note: "rune lourde recyclée" },
  { name: "Cœur Gelé", xp: 375, note: "" },
  { name: "Alliage Ivre", xp: 375, note: "" },
  { name: "Cuir Onique", xp: 300, note: "" },
  { name: "Étoffe givrée", xp: 254, note: "" },
  { name: "Bihilète magistrale", xp: 212, note: "" },
  { name: "Brûlâme encapsulé", xp: 43, note: "" },
  { name: "Croquette", xp: 1, note: "croquette de base, très lente" },
];

const MILESTONES = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

function fmt(n: number): string {
  return Math.round(n).toLocaleString("fr-FR");
}

function clampLevel(n: number): number {
  return Math.max(1, Math.min(MAX_LEVEL, Math.floor(n) || 1));
}

function cumul(level: number): number {
  return CUMUL_XP[clampLevel(level) - 1] ?? 0;
}

export default function XpFamilier() {
  const [current, setCurrent] = useState(1);
  const [target, setTarget] = useState(100);
  const [resIndex, setResIndex] = useState(0);
  const [xpPerUnit, setXpPerUnit] = useState(RESOURCES[0].xp);
  const [price, setPrice] = useState(0);

  const safeTarget = Math.max(current, target);
  const calc = useMemo(() => {
    const xpNeeded = Math.max(0, cumul(safeTarget) - cumul(current));
    const units = xpPerUnit > 0 ? Math.ceil(xpNeeded / xpPerUnit) : 0;
    const cost = price > 0 ? units * price : null;
    return { xpNeeded, units, cost };
  }, [current, safeTarget, xpPerUnit, price]);

  function pickResource(i: number) {
    setResIndex(i);
    setXpPerUnit(RESOURCES[i].xp);
  }

  return (
    <div>
      <SectionHeader
        eyebrow="Monde"
        title="XP familier"
        subtitle="Combien de ressources pour monter ton familier ? On nourrit un familier avec n'importe quelle ressource : l'XP gagnée vaut l'XP « familier » de la ressource donnée. La courbe est douce jusqu'au niveau 50 puis grimpe en flèche."
        right={
          <div className="flex flex-wrap justify-end gap-2">
            <Pill tone="gold">Niv. max 100</Pill>
            <Pill tone="emerald">{fmt(CUMUL_XP[MAX_LEVEL - 1])} XP au 100</Pill>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="glass rounded-2xl p-5">
          <h2 className="mb-3 flex items-center gap-2 font-display font-bold text-white">
            <DofusIcon name="characteristic" size={18} /> Calculateur
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Niveau actuel">
              <NumberInput value={current} min={1} max={MAX_LEVEL} onChange={(v) => setCurrent(clampLevel(v))} />
            </Field>
            <Field label="Niveau visé">
              <NumberInput value={target} min={current} max={MAX_LEVEL} onChange={(v) => setTarget(clampLevel(v))} />
            </Field>
          </div>

          <div className="mt-3">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Ressource</p>
            <div className="flex flex-wrap gap-1.5">
              {RESOURCES.map((r, i) => (
                <button key={r.name} onClick={() => pickResource(i)} className={chip(resIndex === i)}>
                  {r.name} <span className="opacity-60">· {r.xp} XP</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <Field label="XP par ressource">
              <NumberInput value={xpPerUnit} min={1} max={100000} onChange={(v) => setXpPerUnit(Math.max(1, Math.floor(v) || 1))} />
            </Field>
            <Field label="Prix / ressource (kamas, option.)">
              <NumberInput value={price} min={0} max={100000000} onChange={(v) => setPrice(Math.max(0, Math.floor(v) || 0))} />
            </Field>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <Stat label="XP à gagner" value={fmt(calc.xpNeeded)} />
            <Stat label="Ressources" value={fmt(calc.units)} tone="violet" />
            <Stat label="Coût estimé" value={calc.cost == null ? "—" : `${fmt(calc.cost)} kamas`} tone={calc.cost == null ? "slate" : "ember"} />
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
            {current >= safeTarget
              ? "Choisis un niveau visé supérieur au niveau actuel."
              : `De ${current} à ${safeTarget} : ${fmt(calc.xpNeeded)} XP, soit ${fmt(calc.units)} × ${RESOURCES[resIndex]?.name ?? "ressource"} (${xpPerUnit} XP/u).`}
          </p>
        </div>

        <div className="glass rounded-2xl p-5">
          <h2 className="mb-1 flex items-center gap-2 font-display font-bold text-white">
            <DofusIcon name="book" size={18} /> Courbe d'XP cumulée
          </h2>
          <p className="mb-3 text-sm leading-relaxed text-slate-400">
            XP totale pour atteindre un niveau depuis le niveau 1. Tout se joue après le 50 : le 51→100 coûte ≈ 40× le
            1→50.
          </p>
          <div className="overflow-hidden rounded-xl border border-white/5">
            <div className="grid grid-cols-2 bg-void-900/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <span>Niveau</span>
              <span className="text-right">XP cumulée</span>
            </div>
            {MILESTONES.map((lvl) => (
              <div key={lvl} className="grid grid-cols-2 border-t border-white/5 px-3 py-1.5 text-sm text-slate-300">
                <span>Niv. {lvl}</span>
                <span className="text-right font-mono">{fmt(cumul(lvl))}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass mt-4 rounded-2xl p-5">
        <h2 className="mb-1 flex items-center gap-2 font-display font-bold text-white">
          <DofusIcon name="resources" size={18} /> Ressources de référence
        </h2>
        <p className="mb-3 text-sm leading-relaxed text-slate-400">
          XP « familier » par unité. N'importe quelle ressource du jeu nourrit un familier — vise le meilleur rapport
          XP / prix sur ton serveur. Source : Dofus pour les Noobs / DofusTool.
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.map((r) => (
            <div key={r.name} className="flex items-center justify-between gap-2 rounded-lg border border-white/5 bg-void-900/40 px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-200">{r.name}</p>
                {r.note && <p className="truncate text-[11px] text-slate-500">{r.note}</p>}
              </div>
              <span className="shrink-0 font-mono text-xs font-bold text-emerald-300">{r.xp} XP</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, tone = "white" }: { label: string; value: string; tone?: "white" | "violet" | "ember" | "slate" }) {
  const color = tone === "violet" ? "text-glow-violet" : tone === "ember" ? "text-amber-300" : tone === "slate" ? "text-slate-400" : "text-white";
  return (
    <div className="rounded-xl border border-white/5 bg-void-900/40 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 font-display text-base font-bold ${color}`}>{value}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function NumberInput({ value, min, max, onChange }: { value: number; min: number; max: number; onChange: (v: number) => void }) {
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
  const base = "no-drag inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ";
  return active ? `${base} bg-glow-purple/25 text-white ring-1 ring-glow-purple/40` : `${base} bg-white/5 text-slate-400 hover:bg-white/10`;
}
