import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  CalendarDays,
  ChevronRight,
  Coins,
} from "../components/DofusIcons";
import DofusIcon, { type DofusIconName } from "../components/DofusIcon";
import CodexMark from "../components/CodexMark";
import { getAlmanax } from "../api/dofusdude";
import { almanaxBonusStyle } from "../data/meta";
import { useTodayIso } from "../lib/date";
import { APP_VERSION, APP_STAGE } from "../lib/version";
import { Pill, fadeUp } from "../components/ui";

const MotionLink = motion(Link);

const TILES = [
  {
    to: "/donjons",
    title: "Donjons",
    desc: "Mécaniques de boss & résistances",
    dofus: "dungeon",
    grad: "from-glow-ember/30 to-glow-rose/10",
    accent: "text-glow-ember",
    glow: "group-hover:border-glow-ember/45",
  },
  {
    to: "/builder",
    title: "Builder",
    desc: "Compose ton stuff, stats cumulées",
    dofus: "characteristic",
    grad: "from-glow-purple/30 to-glow-cyan/10",
    accent: "text-glow-violet",
    glow: "group-hover:border-glow-purple/45",
  },
  {
    to: "/skinator",
    title: "Skinator",
    desc: "Crée et sauvegarde tes apparences",
    dofus: "character",
    grad: "from-glow-cyan/30 to-glow-emerald/10",
    accent: "text-glow-cyan",
    glow: "group-hover:border-glow-cyan/45",
  },
  {
    to: "/guides",
    title: "Guides",
    desc: "Quêtes & parcours pas à pas",
    dofus: "book",
    grad: "from-glow-emerald/30 to-glow-cyan/10",
    accent: "text-glow-emerald",
    glow: "group-hover:border-glow-emerald/45",
  },
  {
    to: "/monstres",
    title: "Encyclopédie",
    desc: "Monstres, items, panoplies, classes…",
    dofus: "bestiary",
    grad: "from-glow-rose/30 to-glow-purple/10",
    accent: "text-glow-rose",
    glow: "group-hover:border-glow-rose/45",
  },
  {
    to: "/chasse",
    title: "Chasse au trésor",
    desc: "Résous tes chasses en un éclair",
    dofus: "map",
    grad: "from-glow-gold/30 to-glow-ember/10",
    accent: "text-glow-gold",
    glow: "group-hover:border-glow-gold/45",
  },
] as const;

function formatKamas(value?: number) {
  return value == null ? "0" : new Intl.NumberFormat("fr-FR").format(value);
}

export default function Dashboard() {
  const today = useTodayIso();
  const { data: alma } = useQuery({
    queryKey: ["almanax", today],
    queryFn: ({ signal }) => getAlmanax(today, signal),
  });
  const day = alma?.[0];

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-2">
      <Hero />

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
            Accès rapide
          </h2>
        </div>
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {TILES.map((t, i) => (
            <Tile key={t.to} tile={t} index={i} />
          ))}
        </motion.div>
      </section>

      <AlmanaxStrip day={day} />
    </div>
  );
}

function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass relative overflow-hidden rounded-3xl border-white/10 bg-void-800/60"
    >
      <div className="absolute inset-0 bg-grid-faint bg-[length:30px_30px] opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_-10%,rgba(124,92,255,0.20),transparent_55%)]" />
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-glow-cyan/80 to-transparent"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative flex flex-col items-center gap-5 px-6 py-12 text-center sm:py-16">
        <LogoMark />

        <div className="flex flex-wrap items-center justify-center gap-3">
          <h1 className="font-display text-4xl font-extrabold leading-none text-white sm:text-5xl">
            Dofus<span className="text-gradient">Codex</span>
          </h1>
          <span className="inline-flex items-center gap-2 rounded-xl border border-glow-purple/40 bg-gradient-to-r from-glow-purple/25 to-glow-cyan/15 px-3 py-1.5 shadow-glow">
            <span className="font-display text-2xl font-extrabold leading-none text-white sm:text-3xl">
              {APP_VERSION}
            </span>
            <span className="rounded-md bg-glow-gold/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest text-glow-gold ring-1 ring-glow-gold/30">
              {APP_STAGE}
            </span>
          </span>
        </div>

        <p className="max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
          Le guide nouvelle génération pour <span className="text-slate-200">Dofus 3</span> — donjons,
          builds, skins, encyclopédie et Almanax. Données live, sans configuration.
        </p>

        <Pill tone="cyan">
          <DofusIcon name="world" size={14} /> Données live · DofusDude & DofusDB
        </Pill>
      </div>
    </motion.section>
  );
}

function Tile({ tile, index }: { tile: (typeof TILES)[number]; index: number }) {
  return (
    <MotionLink
      to={tile.to}
      custom={index}
      variants={fadeUp}
      whileHover={{ y: -4 }}
      className={`glass no-drag group relative overflow-hidden rounded-2xl border border-white/10 p-5 transition ${tile.glow}`}
    >
      <div className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${tile.grad} opacity-60 blur-2xl transition group-hover:opacity-100`} />
      <div className="relative flex items-start">
        <span className={`grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-void-900/55 ${tile.accent}`}>
          <DofusIcon name={tile.dofus as DofusIconName} size={28} className="drop-shadow-[0_3px_8px_rgba(0,0,0,0.45)]" />
        </span>
      </div>
      <h3 className="relative mt-4 font-display text-lg font-bold text-white">{tile.title}</h3>
      <p className="relative mt-1 text-sm leading-6 text-slate-400">{tile.desc}</p>
    </MotionLink>
  );
}

type AlmanaxDay = Awaited<ReturnType<typeof getAlmanax>>[number];

function AlmanaxStrip({ day }: { day: AlmanaxDay | undefined }) {
  const bonus = day ? almanaxBonusStyle(day.bonus.type.id) : null;
  const BonusIcon = bonus?.icon;
  return (
    <MotionLink
      to="/almanax"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      whileHover={{ y: -2 }}
      className="glass no-drag group flex items-center gap-4 rounded-2xl border border-glow-gold/20 bg-gradient-to-r from-glow-gold/[0.07] to-transparent p-4"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-glow-gold/25 bg-glow-gold/10 text-glow-gold">
        {day ? (
          <img src={day.tribute.item.image_urls.icon} alt={day.tribute.item.name} className="h-9 w-9 object-contain" />
        ) : (
          <CalendarDays className="h-5 w-5" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-glow-gold">
          Almanax du jour
          {BonusIcon && bonus && <BonusIcon className="h-3.5 w-3.5" />}
        </p>
        {day ? (
          <p className="mt-0.5 truncate text-sm text-slate-300">
            <span className="font-semibold text-white">{day.tribute.item.name}</span>
            <span className="text-slate-500"> · {day.bonus.type.name}</span>
          </p>
        ) : (
          <p className="mt-0.5 text-sm text-slate-500">Chargement…</p>
        )}
      </div>
      {day && (
        <span className="hidden items-center gap-1.5 rounded-lg border border-glow-emerald/20 bg-glow-emerald/10 px-3 py-1.5 text-xs font-semibold text-glow-emerald sm:inline-flex">
          <Coins className="h-3.5 w-3.5" /> {formatKamas(day.reward_kamas)}
        </span>
      )}
      <ChevronRight className="h-5 w-5 shrink-0 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-glow-gold" />
    </MotionLink>
  );
}

function LogoMark() {
  return (
    <div className="relative grid h-24 w-24 place-items-center">
      <motion.div
        aria-hidden
        className="absolute inset-1 rounded-[26px] border border-glow-cyan/25 bg-glow-cyan/[0.03]"
        animate={{ scale: [0.97, 1.04, 0.97], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-[28px] border border-glow-purple/20"
        animate={{ opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="relative grid h-20 w-20 place-items-center overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-void-700/90 via-void-900/95 to-void-800/90 shadow-glow"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-grid-faint bg-[length:14px_14px] opacity-35" />
        <div className="absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-glow-cyan/70 to-transparent" />
        <CodexMark
          title="DofusCodex"
          className="relative h-11 w-11 text-glow-violet drop-shadow-[0_0_10px_rgba(124,92,255,0.55)]"
          fill="rgba(124,92,255,0.28)"
          strokeWidth={1.9}
        />
        <span className="absolute h-2 w-2 rounded-full bg-glow-cyan shadow-glow-cyan" />
      </motion.div>
    </div>
  );
}
