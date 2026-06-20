import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { findMonsterByName } from "../api/dofusdb";
import { useStore, actions } from "../store/store";
import { Pill, ErrorState, SectionHeader } from "../components/ui";
import DofusIcon, { type DofusIconName } from "../components/DofusIcon";
import { Trophy } from "../components/DofusIcons";
import DetailBack from "../components/DetailBack";
import MonsterProfile from "../components/MonsterProfile";
import { levelTone } from "../data/meta";
import { WANTED_POSTERS, ELEMENT_META } from "../data/wantedPosters";

export default function WantedDetail() {
  const { slug } = useParams();
  const poster = WANTED_POSTERS.find((w) => w.slug === slug);
  const done = useStore((s) => (slug ? s.doneWanted.includes(slug) : false));

  // Le criminel est un monstre DofusDB → portrait + lien vers sa fiche complète.
  const { data: monster } = useQuery({
    queryKey: ["wanted-monster", poster?.monsterName ?? poster?.name],
    queryFn: ({ signal }) => findMonsterByName(poster!.monsterName ?? poster!.name, signal),
    enabled: !!poster,
    staleTime: Infinity,
  });

  if (!poster) {
    return (
      <div>
        <DetailBack />
        <ErrorState message="Avis de recherche introuvable." />
      </div>
    );
  }

  return (
    <div>
      <DetailBack />

      {/* En-tête : portrait + identité + faiblesses + récompenses */}
      <div className="glass relative overflow-hidden rounded-3xl p-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(245,158,11,0.14),transparent_50%)]" />
        <DofusIcon
          name="skull"
          size={150}
          className="pointer-events-none absolute -right-4 -top-6 opacity-[0.06]"
        />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-2xl bg-glow-ember/20 blur-xl" />
            <div className="relative grid h-28 w-28 place-items-center rounded-2xl bg-void-900/50 ring-1 ring-white/10">
              {monster ? (
                <img
                  src={monster.img}
                  alt={poster.name}
                  className="h-24 w-24 object-contain"
                  onError={(e) => (e.currentTarget.style.opacity = "0.3")}
                />
              ) : (
                <DofusIcon name="skull" size={56} className="opacity-40" />
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-glow-ember/80">
              Avis de recherche · {poster.region}
            </span>
            <h1 className="font-display text-3xl font-extrabold leading-tight text-white">{poster.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Pill tone={levelTone(poster.level)}>{poster.levelLabel ?? `Niv. ${poster.level}`}</Pill>
              {poster.hp != null && (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-200">
                  <DofusIcon name="pv" size={13} /> {poster.hp.toLocaleString("fr-FR")} PV
                </span>
              )}
              {poster.weakness.length > 0 && (
                <span className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-200">
                  <span className="text-[10px] uppercase tracking-wide text-slate-500">Faible</span>
                  {poster.weakness.map((el) => (
                    <DofusIcon key={el} name={ELEMENT_META[el].icon} size={15} title={ELEMENT_META[el].label} />
                  ))}
                </span>
              )}
              <button
                onClick={() => actions.toggleDoneWanted(poster.slug)}
                className={`no-drag inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
                  done
                    ? "border-glow-emerald/50 bg-glow-emerald/20 text-glow-emerald"
                    : "border-white/15 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                <Trophy className="h-3.5 w-3.5" /> {done ? "Capturé" : "Marquer capturé"}
              </button>
            </div>

            {/* Récompenses */}
            <div className="mt-3 flex flex-wrap gap-2">
              {poster.rewards.map((r) => (
                <span
                  key={r.token}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-glow-gold/30 bg-glow-gold/10 px-3 py-1.5 text-sm font-bold text-glow-gold"
                >
                  <DofusIcon name="reward" size={16} /> {r.amount.toLocaleString("fr-FR")}
                  <span className="text-xs font-normal text-amber-200/80">{r.token}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* Localisation & accès */}
        <section className="glass space-y-3 rounded-2xl p-4">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-white">
            <DofusIcon name="map" size={20} /> Où le trouver
          </h2>
          <InfoLine icon="pin" label="Zone" value={poster.location} />
          {poster.access && <InfoLine icon="zaap" label="Accès" value={poster.access} />}
          {poster.prerequisite && <InfoLine icon="quete" label="Prérequis" value={poster.prerequisite} />}
          {poster.resists && <InfoLine icon="resMultiElement" label="Résistances" value={poster.resists} />}
        </section>

        {/* Protections + sorts */}
        <section className="glass space-y-4 rounded-2xl p-4">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-white">
            <DofusIcon name="spells" size={20} /> Mécaniques
          </h2>

          {poster.protections && poster.protections.length > 0 && (
            <div className="space-y-2">
              {poster.protections.map((p, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-xl border border-glow-rose/30 bg-glow-rose/10 p-2.5 text-sm text-rose-100"
                >
                  <DofusIcon name="warning" size={16} className="mt-0.5 shrink-0" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          )}

          {poster.spells && poster.spells.length > 0 && (
            <ul className="space-y-2">
              {poster.spells.map((s, i) => (
                <li key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
                  <span className="text-sm font-semibold text-glow-violet">{s.name}</span>
                  <p className="mt-0.5 text-sm leading-snug text-slate-300">{s.effect}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Stratégie */}
      <section className="glass mt-5 rounded-2xl p-5">
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-white">
          <DofusIcon name="epeesCroisees" size={20} /> Stratégie
        </h2>
        <ol className="space-y-2.5">
          {poster.strategy.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-glow-ember/20 text-xs font-bold text-glow-ember ring-1 ring-glow-ember/30">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-slate-200">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <p className="mt-4 text-center text-xs text-slate-600">
        Stratégie d'après les fiches DofusPourLesNoobs.
      </p>

      {/* Fiche bestiaire complète du monstre (stats, sorts, butin, donjons, famille). */}
      {monster && (
        <div className="mt-6">
          <SectionHeader eyebrow="Encyclopédie" title="Fiche bestiaire" />
          <MonsterProfile monsterId={monster.id} embedded />
        </div>
      )}
    </div>
  );
}

function InfoLine({ icon, label, value }: { icon: DofusIconName; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <DofusIcon name={icon} size={18} className="mt-0.5 shrink-0 opacity-80" />
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</div>
        <div className="text-sm leading-snug text-slate-200">{value}</div>
      </div>
    </div>
  );
}
