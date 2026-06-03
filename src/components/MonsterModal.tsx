import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Skull, Heart, Zap, Footprints, X, Swords, Package } from "lucide-react";
import { getMonster, getItemsByIds, dungeonsWithMonster } from "../api/dofusdb";
import { levelTone } from "../data/meta";
import { Pill, Spinner, ErrorState } from "./ui";

const RES = [
  { key: "earthResistance", label: "Terre" },
  { key: "fireResistance", label: "Feu" },
  { key: "waterResistance", label: "Eau" },
  { key: "airResistance", label: "Air" },
  { key: "neutralResistance", label: "Neutre" },
] as const;

export default function MonsterModal({ id, onClose }: { id: number; onClose: () => void }) {
  const { data: monster, isLoading, isError, refetch } = useQuery({
    queryKey: ["monster", id],
    queryFn: ({ signal }) => getMonster(id, signal),
  });

  const dropIds = (monster?.drops ?? []).map((d) => d.objectId);
  const { data: dropItems } = useQuery({
    queryKey: ["drop-items", id, dropIds],
    queryFn: ({ signal }) => getItemsByIds(dropIds, signal),
    enabled: dropIds.length > 0,
  });
  const { data: dungeons } = useQuery({
    queryKey: ["monster-dungeons", id],
    queryFn: ({ signal }) => dungeonsWithMonster(id, signal),
  });

  const g = monster?.grades?.[0];
  const itemById = new Map((dropItems ?? []).map((it) => [it.id, it]));
  const drops = [...(monster?.drops ?? [])].sort(
    (a, b) => (b.percentDropForGrade1 ?? 0) - (a.percentDropForGrade1 ?? 0),
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="glass relative max-h-[84vh] w-full max-w-lg overflow-y-auto rounded-3xl p-6"
      >
        <button
          onClick={onClose}
          className="no-drag absolute right-4 top-4 rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {isLoading ? (
          <Spinner label="Chargement du monstre…" />
        ) : isError || !monster ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <>
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-glow-rose/20 blur-xl" />
                <img
                  src={monster.img}
                  alt={monster.name.fr}
                  className="relative h-24 w-24 object-contain"
                  onError={(e) => (e.currentTarget.style.opacity = "0.3")}
                />
              </div>
              <div className="pr-8">
                <h2 className="font-display text-2xl font-extrabold leading-tight text-white">
                  {monster.name.fr}
                </h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {g && <Pill tone={levelTone(g.level)}>Niv. {g.level}</Pill>}
                  {monster.isBoss && (
                    <Pill tone="rose">
                      <Skull className="h-3 w-3" /> Boss
                    </Pill>
                  )}
                </div>
              </div>
            </div>

            {g && (
              <>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Stat icon={Heart} label="PV" value={g.lifePoints.toLocaleString("fr-FR")} color="text-glow-rose" />
                  <Stat icon={Zap} label="PA" value={g.actionPoints} color="text-glow-cyan" />
                  <Stat icon={Footprints} label="PM" value={g.movementPoints} color="text-glow-emerald" />
                </div>
                <div className="mt-4 grid grid-cols-5 gap-2">
                  {RES.map((r) => {
                    const v = (g[r.key] as number) ?? 0;
                    return (
                      <div key={r.key} className="rounded-xl border border-white/5 bg-white/[0.02] p-2 text-center">
                        <div className="text-[10px] uppercase text-slate-500">{r.label}</div>
                        <div className={`text-sm font-bold ${v < 0 ? "text-glow-emerald" : "text-white"}`}>
                          {v > 0 ? "+" : ""}
                          {v}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Drops */}
            {drops.length > 0 && (
              <div className="mt-5">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                  <Package className="h-4 w-4 text-glow-gold" /> Butin ({drops.length})
                </h3>
                <ul className="space-y-1">
                  {drops.map((d) => {
                    const it = itemById.get(d.objectId);
                    return (
                      <li
                        key={d.objectId}
                        className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-2"
                      >
                        {it?.img ? (
                          <img src={it.img} alt="" className="h-8 w-8 shrink-0 object-contain" />
                        ) : (
                          <div className="h-8 w-8 shrink-0 rounded bg-white/5" />
                        )}
                        <span className="min-w-0 flex-1 truncate text-sm text-slate-200">
                          {it?.name.fr ?? `Objet #${d.objectId}`}
                        </span>
                        <span className="text-xs font-semibold text-glow-gold">
                          {fmtPct(d.percentDropForGrade1)}%
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Appears in */}
            {dungeons && dungeons.length > 0 && (
              <div className="mt-5">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                  <Swords className="h-4 w-4 text-glow-ember" /> Apparaît dans
                </h3>
                <div className="flex flex-wrap gap-2">
                  {dungeons.map((dg) => (
                    <Link
                      key={dg.id}
                      to={`/donjons/${dg.id}`}
                      onClick={onClose}
                      className="no-drag rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 transition hover:border-glow-ember/40 hover:bg-white/10"
                    >
                      {dg.name.fr}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

function Stat({ icon: Icon, label, value, color }: any) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <Icon className={`h-4 w-4 ${color}`} />
      <div className="leading-none">
        <div className="text-sm font-bold text-white">{value}</div>
        <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
      </div>
    </div>
  );
}

function fmtPct(p: number): string {
  if (p == null) return "—";
  return p < 1 ? p.toFixed(2) : Math.round(p).toString();
}
