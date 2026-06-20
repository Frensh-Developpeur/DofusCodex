import { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import DofusIcon from "../components/DofusIcon";
import DplnGuide from "../components/DplnGuide";
import { SectionHeader, fadeUp } from "../components/ui";
import { GUILD_RAIDS, GUILD_RAIDS_INTRO, type GuildRaid } from "../data/guildRaids";

export default function GuildRaids() {
  const [open, setOpen] = useState<GuildRaid | null>(null);

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" className="pb-12">
      <SectionHeader
        eyebrow="Guilde · 3.6"
        title="Raids de guilde"
        subtitle="Réunissez votre guilde pour accomplir un maximum d'objectifs et débloquer la frise de récompenses."
      />

      <div className="mb-6 rounded-2xl border border-glow-emerald/20 bg-glow-emerald/[0.06] p-4 text-sm leading-relaxed text-slate-300">
        {GUILD_RAIDS_INTRO}
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.05 } } }}
        className="grid gap-4 sm:grid-cols-2"
      >
        {GUILD_RAIDS.map((r) => (
          <RaidCard key={r.slug} raid={r} onOpen={() => setOpen(r)} />
        ))}
      </motion.div>

      <AnimatePresence>{open && <RaidModal raid={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </motion.div>
  );
}

function RaidCard({ raid, onOpen }: { raid: GuildRaid; onOpen: () => void }) {
  return (
    <motion.button
      variants={fadeUp}
      onClick={onOpen}
      className="no-drag group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] text-left transition hover:-translate-y-0.5 hover:border-glow-purple/40 hover:shadow-glow"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-void-800">
        <img
          src={raid.image}
          alt={raid.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg font-bold text-white group-hover:text-glow-violet">{raid.name}</h3>
        <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-slate-400">{raid.intro}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {raid.highlights.slice(0, 3).map((h) => (
            <span key={h} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-300">
              {h}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
}

function RaidModal({ raid, onClose }: { raid: GuildRaid; onClose: () => void }) {
  const [expanded, setExpanded] = useState(false);
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 16 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className={`my-auto w-full overflow-hidden rounded-2xl border border-white/10 bg-void-900 shadow-card transition-[max-width] duration-300 ${
          expanded ? "max-w-6xl" : "max-w-2xl"
        }`}
      >
        <div className="relative aspect-[16/8] overflow-hidden">
          <img src={raid.image} alt={raid.name} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-void-900 via-void-900/40 to-transparent" />
          <div className="absolute right-3 top-3 flex items-center gap-2">
            <button
              onClick={() => setExpanded((v) => !v)}
              title={expanded ? "Réduire" : "Agrandir"}
              className="no-drag inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 text-sm font-semibold text-slate-200 transition hover:bg-black/60"
            >
              <DofusIcon name="zoom" size={16} /> {expanded ? "Réduire" : "Agrandir"}
            </button>
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="no-drag rounded-lg border border-white/10 bg-black/40 p-2 text-slate-200 transition hover:bg-black/60"
            >
              <DofusIcon name="closeRed" size={18} />
            </button>
          </div>
          <h2 className="absolute bottom-3 left-4 font-display text-2xl font-extrabold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {raid.name}
          </h2>
        </div>

        <div className={`overflow-y-auto p-5 ${expanded ? "max-h-[78vh]" : "max-h-[58vh]"}`}>
          <p className="text-sm leading-relaxed text-slate-300">{raid.intro}</p>

          <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {raid.stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-center">
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{s.label}</dt>
                <dd className="mt-0.5 text-sm font-bold text-glow-violet">{s.value}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mb-2 mt-4 font-display text-base font-bold text-white">Contenu du raid</h3>
          <div className="flex flex-wrap gap-1.5">
            {raid.highlights.map((h) => (
              <span
                key={h}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-slate-300"
              >
                {h}
              </span>
            ))}
          </div>

          <DplnGuide url={raid.guideUrl} />
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
