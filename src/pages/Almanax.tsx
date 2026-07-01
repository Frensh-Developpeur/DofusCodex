import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Timer,
  BadgeCheck,
} from "../components/DofusIcons";
import { getAlmanaxDay, getAlmanaxRange, type AlmanaxDay } from "../api/dofusdude";
import { almanaxBonusStyle, type PillTone } from "../data/meta";
import DofusIcon from "../components/DofusIcon";
import { parseLocalIsoDate, shiftLocalIsoDate, toLocalIsoDate, useTodayIso } from "../lib/date";
import { Pill, SectionHeader, Skeleton, ErrorState, fadeUp } from "../components/ui";

function fmtDate(iso: string, opts: Intl.DateTimeFormatOptions) {
  return new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", opts);
}

// Décale une date ISO (YYYY-MM-DD) de `days` jours, en restant en heure locale.
function shiftDate(iso: string, days: number): string {
  return shiftLocalIsoDate(iso, days);
}

// Premier jour du mois d'une date ISO (le format est fixe, slice suffit).
function firstOfMonth(iso: string): string {
  return iso.slice(0, 8) + "01";
}

// Décale d'un nombre de mois, en se calant sur le 1er.
function shiftMonth(anchorIso: string, delta: number): string {
  const d = parseLocalIsoDate(anchorIso);
  d.setDate(1);
  d.setMonth(d.getMonth() + delta);
  return toLocalIsoDate(d);
}

// 42 cases (6 semaines, lundi → dimanche) couvrant le mois ancré.
function buildCalendarGrid(monthAnchorIso: string): string[] {
  const first = parseLocalIsoDate(monthAnchorIso);
  const lead = (first.getDay() + 6) % 7; // lundi = 0
  const start = new Date(first);
  start.setDate(1 - lead);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return toLocalIsoDate(d);
  });
}

// Aura/pastille colorée selon la famille de bonus (classes littérales → JIT Tailwind).
const TONE_GLOW: Record<PillTone, string> = {
  purple: "bg-glow-purple/25",
  cyan: "bg-glow-cyan/25",
  gold: "bg-glow-gold/25",
  ember: "bg-glow-ember/25",
  emerald: "bg-glow-emerald/25",
  rose: "bg-glow-rose/25",
  slate: "bg-white/10",
};
const TONE_DOT: Record<PillTone, string> = {
  purple: "bg-glow-violet",
  cyan: "bg-glow-cyan",
  gold: "bg-glow-gold",
  ember: "bg-glow-ember",
  emerald: "bg-glow-emerald",
  rose: "bg-glow-rose",
  slate: "bg-slate-400",
};

// Temps restant avant la prochaine réinitialisation de l'Almanax (minuit local).
function useResetCountdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const end = new Date();
  end.setHours(24, 0, 0, 0);
  const diff = Math.max(0, end.getTime() - now);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(diff / 3.6e6))}:${pad(Math.floor((diff % 3.6e6) / 6e4))}:${pad(
    Math.floor((diff % 6e4) / 1000),
  )}`;
}

export default function Almanax() {
  const navigate = useNavigate();
  const today = useTodayIso();
  const [selected, setSelected] = useState(today);
  const [monthAnchor, setMonthAnchor] = useState(firstOfMonth(today));
  const [calendarOpen, setCalendarOpen] = useState(false);
  const countdown = useResetCountdown();
  const featuredRef = useRef<HTMLDivElement>(null);
  const previousTodayRef = useRef(today);

  // Si l'app reste ouverte pendant le reset quotidien, on bascule automatiquement
  // sur la nouvelle offrande uniquement quand l'utilisateur suivait "aujourd'hui".
  useEffect(() => {
    const previousToday = previousTodayRef.current;
    setSelected((current) => {
      return current === previousToday ? today : current;
    });
    setMonthAnchor((current) => (current < firstOfMonth(today) ? firstOfMonth(today) : current));
    previousTodayRef.current = today;
  }, [today]);

  // Quand le jour vedette change de mois, le calendrier suit.
  useEffect(() => {
    const m = firstOfMonth(selected);
    if (m !== monthAnchor) setMonthAnchor(m);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // Sélectionner un jour depuis le bandeau ou le calendrier ramène l'œil sur la
  // carte vedette (qui vient de se mettre à jour, mais peut être hors écran).
  const pickDay = (date: string) => {
    setSelected(date);
    featuredRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Le jour mis en avant : endpoint « jour unique » qui accepte n'importe quelle date.
  const dayQuery = useQuery({
    queryKey: ["almanax-day", selected],
    queryFn: ({ signal }) => getAlmanaxDay(selected, signal),
  });

  // Les 6 prochains jours (demain → +6), pour un aperçu rapide.
  const upcomingQuery = useQuery({
    queryKey: ["almanax-range", shiftDate(today, 1), shiftDate(today, 6)],
    queryFn: ({ signal }) => getAlmanaxRange(shiftDate(today, 1), shiftDate(today, 6), signal),
  });
  const upcoming = upcomingQuery.data ?? [];

  const isToday = selected === today;

  return (
    <div>
      <SectionHeader
        eyebrow="Quotidien"
        title="Almanax"
        subtitle="Le bonus du jour, l'offrande à déposer au Temple du Zaap et les prochains jours."
        right={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCalendarOpen(true)}
              className="no-drag flex items-center gap-2 rounded-xl border border-glow-purple/30 bg-glow-purple/10 px-3 py-2 text-sm font-semibold text-glow-violet transition hover:bg-glow-purple/20"
            >
              <CalendarRange className="h-4 w-4" /> Calendrier
            </button>
            <div className="flex items-center gap-2 rounded-xl border border-glow-gold/30 bg-glow-gold/10 px-3 py-2 text-glow-gold">
              <Timer className="h-4 w-4" />
              <div className="leading-tight">
                <span className="block text-[10px] uppercase tracking-wider text-glow-gold/70">
                  Prochain almanax
                </span>
                <span className="font-mono text-sm font-bold tabular-nums">{countdown}</span>
              </div>
            </div>
          </div>
        }
      />

      {/* Note compacte — données fiables (live). Masquée en overlay : place précieuse en jeu. */}
      <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-glow-emerald/20 bg-glow-emerald/[0.07] px-3.5 py-2 text-xs leading-snug text-slate-300 overlay:hidden">
        <BadgeCheck className="h-4 w-4 shrink-0 text-glow-emerald" />
        <span>
          <span className="font-semibold text-glow-emerald">Données fiables</span> — bonus, offrandes et dates
          synchronisés en direct avec l'Almanax officiel.
        </span>
      </div>

      <div ref={featuredRef} className="scroll-mt-6">
        {dayQuery.isLoading ? (
          <Skeleton className="h-60 w-full rounded-3xl" />
        ) : dayQuery.isError || !dayQuery.data ? (
          <ErrorState onRetry={dayQuery.refetch} />
        ) : (
          <FeaturedDay
            day={dayQuery.data}
            isToday={isToday}
            onPrev={selected > today ? () => setSelected(shiftDate(selected, -1)) : undefined}
            onNext={() => setSelected(shiftDate(selected, 1))}
            onResetToday={isToday ? undefined : () => setSelected(today)}
            onOpenItem={() => dayQuery.data && navigate(`/objets/${dayQuery.data.tribute.item.ankama_id}`)}
          />
        )}
      </div>

      <h2 className="mb-4 mt-10 overlay:mt-5 flex items-center gap-2 font-display text-xl font-bold text-white">
        <CalendarDays className="h-5 w-5 text-glow-violet" /> Les 6 prochains jours
      </h2>

      {upcomingQuery.isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : upcomingQuery.isError ? (
        <ErrorState onRetry={upcomingQuery.refetch} />
      ) : upcoming.length === 0 ? (
        <p className="text-sm text-slate-500">Prochains jours indisponibles.</p>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.04 } } }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {upcoming.map((d, i) => (
            <UpcomingCard
              key={d.date}
              day={d}
              index={i}
              active={d.date === selected}
              onSelect={() => pickDay(d.date)}
            />
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {calendarOpen && (
          <CalendarModal
            monthAnchor={monthAnchor}
            today={today}
            selected={selected}
            onSelect={(date) => {
              pickDay(date);
              setCalendarOpen(false);
            }}
            onMonthShift={(delta) => setMonthAnchor((m) => shiftMonth(m, delta))}
            onClose={() => setCalendarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function FeaturedDay({
  day,
  isToday,
  onPrev,
  onNext,
  onResetToday,
  onOpenItem,
}: {
  day: AlmanaxDay;
  isToday: boolean;
  onPrev?: () => void;
  onNext: () => void;
  onResetToday?: () => void;
  onOpenItem: () => void;
}) {
  const bonus = almanaxBonusStyle(day.bonus.type.id);
  const BonusIcon = bonus.icon;
  const navBtn =
    "no-drag flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30";

  return (
    <motion.div
      key={day.date}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass relative overflow-hidden rounded-3xl p-8 overlay:p-4"
    >
      {/* Auras colorées selon la famille de bonus */}
      <div className={`absolute -right-12 -top-12 h-56 w-56 rounded-full blur-3xl ${TONE_GLOW[bonus.tone]}`} />
      <div className={`absolute -bottom-16 -left-10 h-48 w-48 rounded-full blur-3xl ${TONE_GLOW[bonus.tone]} opacity-60`} />

      {/* Navigation par jour */}
      <div className="relative mb-6 flex items-center justify-between gap-2">
        <button onClick={onPrev} disabled={!onPrev} className={navBtn} aria-label="Jour précédent">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          {isToday ? (
            <Pill tone="gold">Aujourd'hui</Pill>
          ) : (
            <button
              onClick={onResetToday}
              className="no-drag flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 transition hover:bg-white/10"
            >
              <DofusIcon name="reset" size={12} /> Aujourd'hui
            </button>
          )}
        </div>
        <button onClick={onNext} className={navBtn} aria-label="Jour suivant">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
        <button
          onClick={onOpenItem}
          className="no-drag group relative flex shrink-0 items-center justify-center"
          aria-label={`Voir ${day.tribute.item.name}`}
        >
          <motion.div
            className={`absolute h-32 w-32 rounded-full blur-2xl ${TONE_GLOW[bonus.tone]}`}
            animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3.5, repeat: Infinity }}
          />
          <motion.img
            src={day.tribute.item.image_urls.sd ?? day.tribute.item.image_urls.icon}
            alt={day.tribute.item.name}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-28 w-28 object-contain drop-shadow-[0_8px_24px_rgba(245,196,81,0.4)] transition group-hover:scale-105"
          />
          <span className="pointer-events-none absolute -bottom-2 rounded-full border border-white/10 bg-void-800/90 px-2 py-0.5 text-[11px] font-bold text-white shadow-lg">
            ×{day.tribute.quantity}
          </span>
        </button>

        <div className="flex-1">
          <Pill tone={bonus.tone}>
            <BonusIcon className="h-3.5 w-3.5" />{" "}
            <span className="capitalize">
              {fmtDate(day.date, { weekday: "long", day: "numeric", month: "long" })}
            </span>
          </Pill>
          <button
            onClick={onOpenItem}
            className="no-drag mt-3 block text-left font-display text-2xl font-extrabold text-white transition hover:text-glow-gold"
          >
            Offrande : {day.tribute.quantity}× {day.tribute.item.name}
          </button>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
            {day.bonus.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill tone="emerald">
              <DofusIcon name="kama" size={14} /> +{day.reward_kamas.toLocaleString("fr-FR")} kamas
            </Pill>
            <Pill tone={bonus.tone}>
              <BonusIcon className="h-3.5 w-3.5" /> {day.bonus.type.name}
            </Pill>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function UpcomingCard({
  day,
  index,
  active,
  onSelect,
}: {
  day: AlmanaxDay;
  index: number;
  active: boolean;
  onSelect: () => void;
}) {
  const bonus = almanaxBonusStyle(day.bonus.type.id);
  const BonusIcon = bonus.icon;
  return (
    <motion.button
      variants={fadeUp}
      custom={index}
      onClick={onSelect}
      className={`no-drag glass glass-hover relative overflow-hidden rounded-2xl p-4 text-left transition ${
        active ? "ring-2 ring-glow-gold/60" : ""
      }`}
    >
      <span className={`absolute left-0 top-0 h-full w-1 ${TONE_DOT[bonus.tone]}`} />
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold capitalize text-white">
          {fmtDate(day.date, { weekday: "long", day: "numeric", month: "short" })}
        </span>
        <Pill tone="gold">
          <DofusIcon name="kama" size={12} /> {day.reward_kamas.toLocaleString("fr-FR")}
        </Pill>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <img
          src={day.tribute.item.image_urls.icon}
          alt={day.tribute.item.name}
          className="h-10 w-10 shrink-0 rounded-lg border border-white/10 bg-void-700 p-0.5"
        />
        <div className="min-w-0">
          <p className="truncate text-xs text-slate-300">
            {day.tribute.quantity}× {day.tribute.item.name}
          </p>
          <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-slate-500">
            <BonusIcon className="h-3 w-3 shrink-0" /> {day.bonus.type.name}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

function CalendarModal({
  monthAnchor,
  today,
  selected,
  onSelect,
  onMonthShift,
  onClose,
}: {
  monthAnchor: string;
  today: string;
  selected: string;
  onSelect: (date: string) => void;
  onMonthShift: (delta: number) => void;
  onClose: () => void;
}) {
  const cells = useMemo(() => buildCalendarGrid(monthAnchor), [monthAnchor]);
  const currentMonth = monthAnchor.slice(0, 7); // "YYYY-MM"

  // Fermeture au clavier (Échap).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const rangeQuery = useQuery({
    queryKey: ["almanax-range", cells[0], cells[41]],
    queryFn: ({ signal }) => getAlmanaxRange(cells[0], cells[41], signal),
  });

  const byDate = useMemo(() => {
    const m = new Map<string, AlmanaxDay>();
    for (const d of rangeQuery.data ?? []) m.set(d.date, d);
    return m;
  }, [rangeQuery.data]);

  const navBtn =
    "no-drag flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="glass w-full max-w-lg overflow-hidden rounded-3xl bg-gradient-to-br from-white/[0.04] to-transparent p-5"
      >
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-white">
            <CalendarRange className="h-5 w-5 text-glow-violet" /> Calendrier
          </h2>
          <div className="no-drag flex items-center gap-2">
            <button onClick={() => onMonthShift(-1)} className={navBtn} aria-label="Mois précédent">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[8rem] text-center text-sm font-semibold capitalize text-white">
              {fmtDate(monthAnchor, { month: "long", year: "numeric" })}
            </span>
            <button onClick={() => onMonthShift(1)} className={navBtn} aria-label="Mois suivant">
              <ChevronRight className="h-4 w-4" />
            </button>
            <button onClick={onClose} className={`${navBtn} ml-1`} aria-label="Fermer">
              <DofusIcon name="closeRed" size={16} />
            </button>
          </div>
        </div>

      <div className="relative">
        {rangeQuery.isError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-void-900/60 backdrop-blur-sm">
            <ErrorState onRetry={rangeQuery.refetch} />
          </div>
        )}

        <div className="mb-2 grid grid-cols-7 gap-1.5 sm:gap-2">
          {WEEKDAYS.map((w, i) => (
            <div
              key={i}
              className={`text-center text-[11px] font-semibold uppercase ${
                i >= 5 ? "text-glow-violet/70" : "text-slate-500"
              }`}
            >
              {w}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {cells.map((date, i) => {
            const day = byDate.get(date);
            const inMonth = date.slice(0, 7) === currentMonth;
            const isToday = date === today;
            const isSelected = date === selected;
            const isWeekend = i % 7 >= 5;
            const dayNum = Number(date.slice(8, 10));
            const tone = day ? almanaxBonusStyle(day.bonus.type.id).tone : "slate";
            return (
              <button
                key={date}
                onClick={() => day && onSelect(date)}
                disabled={!day}
                title={day ? `${day.tribute.quantity}× ${day.tribute.item.name}` : undefined}
                className={`no-drag group relative flex aspect-square flex-col items-center justify-center gap-0.5 rounded-xl border p-1 transition ${
                  isSelected
                    ? "border-glow-gold/70 bg-glow-gold/10 shadow-[0_0_20px_-6px_rgba(245,196,81,0.6)]"
                    : isToday
                      ? "border-glow-gold/40 hover:border-glow-gold/60 hover:bg-white/5"
                      : `border-white/5 hover:border-white/15 hover:-translate-y-0.5 hover:bg-white/5 ${isWeekend ? "bg-white/[0.015]" : ""}`
                } ${inMonth ? "" : "opacity-35"} ${day ? "" : "cursor-default"}`}
              >
                <span
                  className={`text-[11px] font-semibold leading-none ${
                    isToday || isSelected ? "text-glow-gold" : "text-slate-400"
                  }`}
                >
                  {dayNum}
                </span>
                {day ? (
                  <img
                    src={day.tribute.item.image_urls.icon}
                    alt=""
                    className="h-7 w-7 object-contain transition group-hover:scale-110 sm:h-9 sm:w-9"
                  />
                ) : (
                  <span className="h-7 w-7 sm:h-9 sm:w-9" />
                )}
                {/* Pastille de couleur = famille de bonus */}
                {day && (
                  <span
                    className={`absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full ${TONE_DOT[tone]} ${
                      isToday ? "ring-2 ring-glow-gold/50" : ""
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {rangeQuery.isLoading && (
          <p className="mt-3 text-center text-xs text-slate-500">Chargement du mois…</p>
        )}
        </div>
      </motion.div>
    </motion.div>
  );
}
