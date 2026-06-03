import { ReactNode, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Hexagon, SearchX } from "lucide-react";
import clsx from "clsx";

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx("skeleton", className)} />;
}

// Petit emblème DofusCodex animé (hexagone + anneau conique rotatif).
export function DofusLoader({ label, className }: { label?: string; className?: string }) {
  return (
    <div className={clsx("flex items-center justify-center gap-3 text-slate-400", className)}>
      <span className="relative inline-flex h-7 w-7 items-center justify-center">
        <span
          className="absolute inset-0 animate-spin rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, #7c5cff 150deg, #22d3ee 280deg, transparent 340deg)",
            WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))",
          }}
        />
        <Hexagon className="h-3.5 w-3.5 text-glow-violet" fill="rgba(124,92,255,0.35)" />
      </span>
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return <DofusLoader label={label} className="py-16" />;
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
      <SearchX className="h-10 w-10 text-slate-600" />
      <p className="text-slate-300">{title}</p>
      {hint && <p className="text-sm text-slate-500">{hint}</p>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <AlertTriangle className="h-10 w-10 text-glow-ember" />
      <p className="text-slate-300">Impossible de charger les données</p>
      {message && <p className="max-w-md text-sm text-slate-500">{message}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="no-drag mt-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  right,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-glow-purple/80">
            {eyebrow}
          </span>
        )}
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-slate-400">{subtitle}</p>}
      </div>
      {right && <div className="no-drag">{right}</div>}
    </div>
  );
}

export function Pill({
  children,
  tone = "purple",
  className,
}: {
  children: ReactNode;
  tone?: "purple" | "cyan" | "gold" | "ember" | "emerald" | "rose" | "slate";
  className?: string;
}) {
  const tones: Record<string, string> = {
    purple: "bg-glow-purple/15 text-glow-violet border-glow-purple/30",
    cyan: "bg-glow-cyan/15 text-glow-cyan border-glow-cyan/30",
    gold: "bg-glow-gold/15 text-glow-gold border-glow-gold/30",
    ember: "bg-glow-ember/15 text-glow-ember border-glow-ember/30",
    emerald: "bg-glow-emerald/15 text-glow-emerald border-glow-emerald/30",
    rose: "bg-glow-rose/15 text-glow-rose border-glow-rose/30",
    slate: "bg-white/5 text-slate-300 border-white/10",
  };
  return <span className={clsx("pill border", tones[tone], className)}>{children}</span>;
}

export function LoadMore({
  hasMore,
  loading,
  onClick,
  count,
  total,
}: {
  hasMore: boolean;
  loading: boolean;
  onClick: () => void;
  count: number;
  total?: number;
}) {
  // Chargement automatique : on observe une sentinelle et on déclenche la suite
  // dès qu'elle approche du viewport (plus de bouton « Charger plus »).
  const sentinel = useRef<HTMLDivElement>(null);
  const cb = useRef(onClick);
  cb.current = onClick;
  useEffect(() => {
    if (!hasMore || loading) return;
    const el = sentinel.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) cb.current();
      },
      { rootMargin: "400px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loading]);

  return (
    <div className="mt-6 flex flex-col items-center gap-2">
      <div ref={sentinel} className="h-px w-full" />
      {hasMore && <DofusLoader label={loading ? "Chargement…" : undefined} className="py-2" />}
      {total != null && (
        <p className="text-xs text-slate-500">
          {count} / {total} affichés
        </p>
      )}
    </div>
  );
}

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function MotionGrid({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.04 } } }}
    >
      {children}
    </motion.div>
  );
}
