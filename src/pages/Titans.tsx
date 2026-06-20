import { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import DofusIcon from "../components/DofusIcon";
import DplnGuide from "../components/DplnGuide";
import { SectionHeader, fadeUp } from "../components/ui";
import { TITANS, TITANS_INTRO, type Titan } from "../data/titans";

export default function Titans() {
  const [open, setOpen] = useState<Titan | null>(null);

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" className="pb-12">
      <SectionHeader
        eyebrow="Endgame"
        title="Titans"
        subtitle="Les boss colossaux des dimensions divines, affrontables le week-end dans leur Temple."
      />

      <div className="mb-6 rounded-2xl border border-glow-purple/20 bg-glow-purple/[0.06] p-4 text-sm leading-relaxed text-slate-300">
        {TITANS_INTRO}
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.05 } } }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {TITANS.map((t) => (
          <TitanCard key={t.slug} titan={t} onOpen={() => setOpen(t)} />
        ))}
      </motion.div>

      <AnimatePresence>{open && <TitanModal titan={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </motion.div>
  );
}

function TitanCard({ titan, onOpen }: { titan: Titan; onOpen: () => void }) {
  return (
    <motion.button
      variants={fadeUp}
      onClick={onOpen}
      className="no-drag group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] text-left transition hover:-translate-y-0.5 hover:border-glow-purple/40 hover:shadow-glow"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-void-800">
        <img
          src={titan.image}
          alt={titan.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-md border border-glow-ember/30 bg-glow-ember/15 px-2 py-0.5 text-[11px] font-bold text-glow-ember backdrop-blur">
          {titan.order}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg font-bold text-white group-hover:text-glow-violet">{titan.name}</h3>
        <p className="text-xs text-slate-500">Dimension {titan.dimension}</p>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-400">{titan.intro}</p>
      </div>
    </motion.button>
  );
}

function TitanModal({ titan, onClose }: { titan: Titan; onClose: () => void }) {
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
          <img src={titan.image} alt={titan.name} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
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
          <div className="absolute bottom-3 left-4">
            <span className="text-xs font-bold uppercase tracking-wider text-glow-ember">{titan.order}</span>
            <h2 className="font-display text-2xl font-extrabold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {titan.name}
            </h2>
            <p className="text-sm text-slate-300">Dimension {titan.dimension}</p>
          </div>
        </div>

        <div className={`overflow-y-auto p-5 ${expanded ? "max-h-[78vh]" : "max-h-[58vh]"}`}>
          <p className="text-sm leading-relaxed text-slate-300">{titan.intro}</p>

          <dl className="mt-4 grid gap-2 sm:grid-cols-2">
            {titan.facts.map((f) => (
              <div key={f.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{f.label}</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-200">{f.value}</dd>
              </div>
            ))}
          </dl>

          {titan.sections.map((s) => (
            <div key={s.title} className="mt-4">
              <h3 className="mb-1 font-display text-base font-bold text-white">{s.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{s.body}</p>
            </div>
          ))}

          <DplnGuide url={titan.guideUrl} />
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
