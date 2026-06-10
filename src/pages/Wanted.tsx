import { useMemo, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Search, ArrowUp, ArrowDown, Trophy } from "../components/DofusIcons";
import DofusIcon from "../components/DofusIcon";
import { findMonsterByName } from "../api/dofusdb";
import { useStore, actions } from "../store/store";
import { useViewState } from "../lib/viewState";
import { levelTone } from "../data/meta";
import { Pill, SectionHeader, EmptyState, fadeUp } from "../components/ui";
import {
  WANTED_POSTERS,
  WANTED_REGIONS,
  type WantedPoster,
  type WantedRegion,
} from "../data/wantedPosters";

function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

const regionOrder = (r: WantedRegion) => WANTED_REGIONS.indexOf(r);

// Ordre d'affichage des jetons : la prime principale (Aviton/Aliton) d'abord, le bonus (Kama de Glace) ensuite.
const TOKEN_ORDER = ["Aviton", "Aliton", "Kama de Glace"];
const rewardOrder = (t: string) => {
  const i = TOKEN_ORDER.indexOf(t);
  return i === -1 ? 99 : i;
};

type Statut = "all" | "todo" | "done";
type Tri = "region" | "level-asc" | "level-desc";

export default function Wanted() {
  const navigate = useNavigate();
  const doneWanted = useStore((s) => s.doneWanted);
  const [search, setSearch] = useViewState("wanted:search", "");
  const [region, setRegion] = useViewState<WantedRegion | "all">("wanted:region", "all");
  const [statut, setStatut] = useViewState<Statut>("wanted:statut", "all");
  const [token, setToken] = useViewState<string>("wanted:token", "all");
  const [tri, setTri] = useViewState<Tri>("wanted:tri", "region");

  const doneSet = useMemo(() => new Set(doneWanted), [doneWanted]);

  // Jetons de récompense réellement présents dans les données (pour le filtre).
  const tokens = useMemo(() => {
    const set = new Set<string>();
    for (const w of WANTED_POSTERS) for (const r of w.rewards) set.add(r.token);
    return [...set].sort((a, b) => rewardOrder(a) - rewardOrder(b) || a.localeCompare(b));
  }, []);

  const regions = useMemo(() => {
    const present = new Set(WANTED_POSTERS.map((w) => w.region));
    return WANTED_REGIONS.filter((r) => present.has(r));
  }, []);

  const list = useMemo(() => {
    const q = norm(search);
    return WANTED_POSTERS.filter((w) => {
      if (region !== "all" && w.region !== region) return false;
      const isDone = doneSet.has(w.slug);
      if (statut === "todo" && isDone) return false;
      if (statut === "done" && !isDone) return false;
      if (token !== "all" && !w.rewards.some((r) => r.token === token)) return false;
      if (q && !norm(w.name).includes(q) && !norm(w.location).includes(q)) return false;
      return true;
    }).sort((a, b) => {
      if (tri === "level-asc") return a.level - b.level || a.name.localeCompare(b.name);
      if (tri === "level-desc") return b.level - a.level || a.name.localeCompare(b.name);
      return regionOrder(a.region) - regionOrder(b.region) || a.level - b.level || a.name.localeCompare(b.name);
    });
  }, [search, region, statut, token, doneSet, tri]);

  const doneCount = doneWanted.length;

  return (
    <div>
      <SectionHeader
        eyebrow="Avis de recherche"
        title="On recherche…"
        subtitle="Traquez les criminels du Monde des Douze : zone, faiblesse, mécaniques de combat et récompenses pour chaque avis."
        right={
          <Pill tone={doneCount === WANTED_POSTERS.length ? "emerald" : "ember"}>
            {doneCount} / {WANTED_POSTERS.length} capturés
          </Pill>
        }
      />

      <div className="glass mb-6 flex flex-col gap-3 rounded-2xl p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un criminel ou une zone (Chevalier de Glace, Frigost…)"
            className="no-drag w-full rounded-xl border border-white/10 bg-void-800/60 py-2.5 pl-10 pr-3 text-sm text-slate-200 outline-none transition focus:border-glow-ember/50"
          />
        </div>

        {/* Régions */}
        <div className="flex flex-wrap gap-1.5">
          <Chip active={region === "all"} onClick={() => setRegion("all")}>
            Toutes les régions
          </Chip>
          {regions.map((r) => (
            <Chip key={r} active={region === r} onClick={() => setRegion(r)}>
              {r}
            </Chip>
          ))}
        </div>

        {/* Statut + jeton */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-white/5 pt-3">
          <span className="mr-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Statut</span>
          <Chip active={statut === "all"} onClick={() => setStatut("all")}>Tous</Chip>
          <Chip active={statut === "todo"} onClick={() => setStatut("todo")}>À faire</Chip>
          <Chip active={statut === "done"} onClick={() => setStatut("done")} tone="emerald">Capturés</Chip>
          <span className="mx-2 hidden h-4 w-px bg-white/10 sm:block" />
          <span className="mr-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Jeton</span>
          <Chip active={token === "all"} onClick={() => setToken("all")}>Tous</Chip>
          {tokens.map((t) => (
            <Chip key={t} active={token === t} onClick={() => setToken(t)} tone="gold">
              {t}
            </Chip>
          ))}
        </div>

        {/* Tri */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-white/5 pt-3">
          <span className="mr-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Trier</span>
          <Chip active={tri === "region"} onClick={() => setTri("region")}>Région</Chip>
          <Chip active={tri === "level-asc"} onClick={() => setTri("level-asc")}>
            <span className="inline-flex items-center gap-1">Niveau <ArrowUp className="h-3 w-3" /></span>
          </Chip>
          <Chip active={tri === "level-desc"} onClick={() => setTri("level-desc")}>
            <span className="inline-flex items-center gap-1">Niveau <ArrowDown className="h-3 w-3" /></span>
          </Chip>
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState title="Aucun avis de recherche" hint="Essayez d'autres filtres." />
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.02 } } }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {list.map((w, i) => (
            <WantedCard
              key={w.slug}
              w={w}
              index={i % 12}
              done={doneSet.has(w.slug)}
              onToggleDone={() => actions.toggleDoneWanted(w.slug)}
              onClick={() => navigate(`/avis-de-recherche/${w.slug}`, { state: { fromSection: true } })}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  tone = "ember",
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  tone?: "ember" | "emerald" | "gold";
}) {
  const tones = {
    ember: "bg-glow-ember/25 text-white ring-1 ring-glow-ember/40",
    emerald: "bg-glow-emerald/25 text-white ring-1 ring-glow-emerald/40",
    gold: "bg-glow-gold/25 text-white ring-1 ring-glow-gold/40",
  };
  return (
    <button
      onClick={onClick}
      className={`no-drag rounded-lg px-3 py-1.5 text-xs font-medium transition ${
        active ? tones[tone] : "bg-white/5 text-slate-400 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

function WantedCard({
  w,
  index,
  done,
  onToggleDone,
  onClick,
}: {
  w: WantedPoster;
  index: number;
  done: boolean;
  onToggleDone: () => void;
  onClick: () => void;
}) {
  const rewards = [...w.rewards].sort((a, b) => rewardOrder(a.token) - rewardOrder(b.token));
  const { data: monster } = useQuery({
    queryKey: ["wanted-monster", w.monsterName ?? w.name],
    queryFn: ({ signal }) => findMonsterByName(w.monsterName ?? w.name, signal),
    staleTime: Infinity,
  });

  return (
    <motion.button
      variants={fadeUp}
      custom={index}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`glass glass-hover no-drag group relative flex items-center gap-3 overflow-hidden rounded-2xl p-3.5 text-left transition ${
        done ? "opacity-60" : ""
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_-20%,rgba(245,158,11,0.1),transparent_55%)]" />

      {/* Bouton « capturé » */}
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          onToggleDone();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            onToggleDone();
          }
        }}
        title={done ? "Marquer comme non capturé" : "Marquer comme capturé"}
        className={`absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full border transition ${
          done
            ? "border-glow-emerald/50 bg-glow-emerald/25 text-glow-emerald"
            : "border-white/15 bg-void-900/60 text-slate-500 opacity-0 hover:bg-white/10 hover:text-slate-200 group-hover:opacity-100"
        }`}
      >
        <Trophy className="h-4 w-4" />
      </span>

      {/* Portrait du mob */}
      <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-void-900/50 ring-1 ring-white/10">
        {monster ? (
          <img
            src={monster.img}
            alt={w.name}
            loading="lazy"
            className="h-14 w-14 object-contain"
            onError={(e) => (e.currentTarget.style.opacity = "0.2")}
          />
        ) : (
          <DofusIcon name="teteDeMort" size={30} className="opacity-30" />
        )}
      </div>

      {/* Identité */}
      <div className="relative min-w-0 flex-1">
        <h3 className="truncate pr-7 font-display text-base font-bold leading-tight text-white">{w.name}</h3>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <Pill tone={levelTone(w.level)}>{w.levelLabel ?? `Niv. ${w.level}`}</Pill>
          <span className="text-[11px] text-slate-500">{w.region}</span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
          {rewards.map((r) => (
            <span key={r.token} className="inline-flex items-center gap-1 text-sm font-semibold text-glow-gold">
              <DofusIcon name={r.token.includes("Kama") ? "kama" : "reward"} size={15} />
              {r.amount.toLocaleString("fr-FR")}
              <span className="text-xs font-normal text-slate-400">{r.token}</span>
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
}
