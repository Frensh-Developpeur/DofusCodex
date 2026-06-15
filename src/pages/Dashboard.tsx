import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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

type Feature = {
  to: string;
  title: string;
  dofus: DofusIconName;
  desc: string;
};

type Category = {
  title: string;
  blurb: string;
  icon: DofusIconName;
  accent: string; // texte de l'icône
  glow: string; // bordure au survol
  grad: string; // halo de fond
  ring: string; // anneau du badge d'en-tête
  features: Feature[];
};

// Chiffres marquants de l'app (faits vérifiables : guides rédigés, primes, modules du menu).
const STATS: { value?: number; suffix?: string; text?: string; label: string; accent: string }[] = [
  { value: 122, label: "Guides de donjon", accent: "text-glow-ember" },
  { value: 23, label: "Modules & outils", accent: "text-glow-emerald" },
  { value: 82, label: "Avis de recherche", accent: "text-glow-rose" },
  { text: "macOS & Windows", label: "Application desktop", accent: "text-glow-cyan" },
];

// Présentation de l'app, organisée comme la sidebar. Chaque entrée décrit
// concrètement ce que la page apporte (pas un simple intitulé d'onglet).
const CATEGORIES: Category[] = [
  {
    title: "Jeu",
    blurb: "Donjons, quêtes et parcours guidés pour avancer.",
    icon: "dungeon",
    accent: "text-glow-ember",
    glow: "group-hover:border-glow-ember/45",
    grad: "from-glow-ember/30 to-glow-rose/10",
    ring: "border-glow-ember/30 bg-glow-ember/10 text-glow-ember",
    features: [
      {
        to: "/donjons",
        title: "Donjons",
        dofus: "dungeon",
        desc: "122 guides rédigés à la main : mécaniques de boss phase par phase, élément de faiblesse exact, résistances, placements et succès. Boss identifié au bon endroit, schémas de stratégie à l'appui.",
      },
      {
        to: "/quetes",
        title: "Quêtes",
        dofus: "quete",
        desc: "Base de quêtes filtrable avec étapes, objectifs et récompenses détaillés. Coche ta progression : l'app retient les quêtes terminées.",
      },
      {
        to: "/avis-de-recherche",
        title: "Avis de recherche",
        dofus: "teteDeMort",
        desc: "81 criminels de la chasse aux primes : fiches de stratégie, montants de jetons et conseils, le tout filtrable par alignement et niveau.",
      },
      {
        to: "/guides",
        title: "Guides",
        dofus: "book",
        desc: "≈700 guides communautaires Ganymède, pas à pas : coordonnées de map, items, monstres et donjons cliquables. Téléchargeables une fois pour une navigation instantanée et synchronisés en arrière-plan.",
      },
      {
        to: "/arbre",
        title: "Arbre des guides",
        dofus: "genealogy",
        desc: "Vue généalogique de l'enchaînement des guides pour visualiser ta progression et le bon ordre à suivre.",
      },
    ],
  },
  {
    title: "Monde",
    blurb: "Explore le Monde des Douze et optimise tes métiers.",
    icon: "map",
    accent: "text-glow-emerald",
    glow: "group-hover:border-glow-emerald/45",
    grad: "from-glow-emerald/30 to-glow-cyan/10",
    ring: "border-glow-emerald/30 bg-glow-emerald/10 text-glow-emerald",
    features: [
      {
        to: "/carte",
        title: "Carte du monde",
        dofus: "map",
        desc: "Carte interactive des zones et sous-zones, avec les positions remarquables épinglées sur la worldmap.",
      },
      {
        to: "/metiers",
        title: "Métiers & Craft",
        dofus: "job",
        desc: "Recettes, ingrédients et ressources récoltables par métier. Calcule la rentabilité et planifie ton XP de craft.",
      },
      {
        to: "/liste-courses",
        title: "Liste de courses",
        dofus: "cupboard",
        desc: "Agrège automatiquement les ingrédients de tes crafts en une seule liste consolidée, prête pour l'HdV.",
      },
    ],
  },
  {
    title: "Encyclopédie",
    blurb: "La base de données complète de Dofus 3, en direct.",
    icon: "bestiary",
    accent: "text-glow-rose",
    glow: "group-hover:border-glow-rose/45",
    grad: "from-glow-rose/30 to-glow-purple/10",
    ring: "border-glow-rose/30 bg-glow-rose/10 text-glow-rose",
    features: [
      {
        to: "/classes",
        title: "Classes",
        dofus: "emote",
        desc: "Toutes les classes avec leurs sorts, caractéristiques et identité de jeu.",
      },
      {
        to: "/monstres",
        title: "Monstres",
        dofus: "bestiary",
        desc: "Bestiaire complet : caractéristiques, résistances et tables de drops avec taux, recherche par nom.",
      },
      {
        to: "/stuffinator",
        title: "Équipements",
        dofus: "menuStuffs",
        desc: "Tous les équipements filtrables par emplacement, niveau et statistiques, avec leurs effets détaillés.",
      },
      {
        to: "/panoplies",
        title: "Panoplies",
        dofus: "menuItemsets",
        desc: "Panoplies et bonus de set selon le nombre de pièces équipées.",
      },
      {
        to: "/objets",
        title: "Objets & Ressources",
        dofus: "inventory",
        desc: "Ressources, consommables, suiveurs et tout le reste — avec leurs provenances et usages.",
      },
      {
        to: "/havre-sac",
        title: "Havre-Sacs",
        dofus: "havenbag",
        desc: "Catalogue des havre-sacs et de leurs aménagements.",
      },
      {
        to: "/succes",
        title: "Succès",
        dofus: "trophy",
        desc: "Liste des succès avec objectifs et récompenses associées.",
      },
    ],
  },
  {
    title: "Skin",
    blurb: "Crée, prévisualise et sauvegarde tes apparences.",
    icon: "character",
    accent: "text-glow-cyan",
    glow: "group-hover:border-glow-cyan/45",
    grad: "from-glow-cyan/30 to-glow-emerald/10",
    ring: "border-glow-cyan/30 bg-glow-cyan/10 text-glow-cyan",
    features: [
      {
        to: "/skinator",
        title: "Skinator",
        dofus: "character",
        desc: "Compose une apparence de A à Z et visualise le rendu animé du personnage en temps réel avant de te lancer.",
      },
      {
        to: "/mes-skins",
        title: "Mes Skins",
        dofus: "glyph",
        desc: "Ta bibliothèque personnelle de skins sauvegardés, prête à être rouverte et modifiée.",
      },
    ],
  },
  {
    title: "Outils",
    blurb: "Calculateurs et utilitaires pour optimiser ton perso.",
    icon: "characteristic",
    accent: "text-glow-violet",
    glow: "group-hover:border-glow-purple/45",
    grad: "from-glow-purple/30 to-glow-cyan/10",
    ring: "border-glow-purple/30 bg-glow-purple/10 text-glow-violet",
    features: [
      {
        to: "/builder",
        title: "Builder",
        dofus: "characteristic",
        desc: "Compose ton stuff complet, additionne les statistiques de toutes les pièces et simule les dégâts grâce à la formule répliquée du jeu.",
      },
      {
        to: "/rentabilite-metiers",
        title: "XP métier",
        dofus: "recipe",
        desc: "Trouve les crafts les plus rentables en XP et planifie la montée de tes métiers, forgemagie comprise.",
      },
      {
        to: "/xp-familier",
        title: "XP familier",
        dofus: "bestiary",
        desc: "Calculateur d'XP de familier du niveau 1 à 100 : quelles ressources, en quelle quantité, pour atteindre ta cible.",
      },
      {
        to: "/chasse",
        title: "Chasse au trésor",
        dofus: "map",
        desc: "Résous tes chasses au trésor en un éclair : entre une position et une direction, l'app remonte les indices de map en map.",
      },
      {
        to: "/metamob",
        title: "Metamob",
        dofus: "archmonster",
        desc: "Gère tes archimonstres recherchés et proposés, synchronisés avec ton compte Metamob.",
      },
      {
        to: "/almanax",
        title: "Almanax",
        dofus: "calendar",
        desc: "L'Almanax du jour : offrande à réaliser, bonus actif et récompense en kamas, sur n'importe quelle date.",
      },
    ],
  },
];

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
    <div className="mx-auto max-w-5xl space-y-9 py-2">
      <Hero />
      <StatsBand />
      <AlmanaxStrip day={day} />

      <div className="space-y-10 pt-1">
        {CATEGORIES.map((cat, ci) => (
          <CategorySection key={cat.title} cat={cat} index={ci} />
        ))}
      </div>
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

      {/* Orbes lumineux flottants en arrière-plan */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-6 h-52 w-52 rounded-full bg-glow-purple/20 blur-3xl"
        animate={{ x: [0, 24, 0], y: [0, -16, 0], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-14 bottom-0 h-56 w-56 rounded-full bg-glow-cyan/15 blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, 14, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

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

        <p className="max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
          Le compagnon nouvelle génération pour <span className="text-slate-200">Dofus 3</span>. Donjons,
          builds, skins, métiers, encyclopédie complète et bien plus — réunis dans une seule app desktop, avec
          des <span className="text-slate-200">données live</span> et sans aucune configuration ni clé API.
        </p>

        <Pill tone="cyan">
          <DofusIcon name="world" size={14} /> Données live · DofusDude, DofusDB &amp; Ganymède
        </Pill>
      </div>
    </motion.section>
  );
}

function StatsBand() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
    >
      {STATS.map((s) => (
        <motion.div
          key={s.label}
          variants={fadeUp}
          className="glass relative overflow-hidden rounded-2xl border border-white/10 px-4 py-4 text-center"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          {s.text ? (
            <p className={`flex h-9 items-center justify-center font-display text-lg font-extrabold leading-tight ${s.accent}`}>
              {s.text}
            </p>
          ) : (
            <p className={`font-display text-3xl font-extrabold tabular-nums ${s.accent}`}>
              <CountUp value={s.value!} />
              {s.suffix}
            </p>
          )}
          <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-slate-500">{s.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Compteur animé : démarre quand la valeur entre dans le viewport.
function CountUp({ value, duration = 1.1 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || value === 0) {
      if (value === 0) setDisplay(0);
      return;
    }
    let raf = 0;
    let start: number | null = null;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / (duration * 1000), 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return <span ref={ref}>{display}</span>;
}

function CategorySection({ cat, index }: { cat: Category; index: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: Math.min(index, 3) * 0.04 }}
    >
      <div className="mb-3.5 flex items-center gap-3">
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${cat.ring}`}>
          <DofusIcon name={cat.icon} size={18} />
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-base font-bold tracking-tight text-white">{cat.title}</h2>
          <p className="truncate text-xs text-slate-500">{cat.blurb}</p>
        </div>
        <span className="ml-auto hidden h-px flex-1 max-w-[40%] bg-gradient-to-r from-white/10 to-transparent sm:block" />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {cat.features.map((f, i) => (
          <FeatureCard key={f.to} feature={f} cat={cat} index={i} />
        ))}
      </div>
    </motion.section>
  );
}

function FeatureCard({
  feature,
  cat,
  index,
}: {
  feature: Feature;
  cat: Category;
  index: number;
}) {
  return (
    <MotionLink
      to={feature.to}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      whileHover={{ y: -3 }}
      className={`glass no-drag group relative flex gap-4 overflow-hidden rounded-2xl border border-white/10 p-4 transition ${cat.glow}`}
    >
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${cat.grad} opacity-50 blur-2xl transition group-hover:opacity-90`}
      />
      <span
        className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-void-900/55 ${cat.accent} transition group-hover:scale-105`}
      >
        <DofusIcon
          name={feature.dofus}
          size={24}
          className="drop-shadow-[0_3px_8px_rgba(0,0,0,0.45)]"
        />
      </span>
      <div className="relative min-w-0 flex-1">
        <h3 className="flex items-center gap-1.5 font-display text-base font-bold text-white">
          {feature.title}
          <ChevronRight className="h-4 w-4 -translate-x-1 text-slate-600 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
        </h3>
        <p className="mt-1 text-[13px] leading-6 text-slate-400">{feature.desc}</p>
      </div>
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
