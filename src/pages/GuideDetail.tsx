import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Copy,
  Check,
  ThumbsUp,
  Download,
  BadgeCheck,
  CheckCircle2,
  RotateCcw,
  Flag,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { STATUS_LABEL, type GuideStatus } from "../api/ganymede";
import { getGuideData } from "../lib/guideStore";
import { categoryOf } from "../lib/guideCategory";
import { useStore, actions } from "../store/store";
import { GuideText } from "../lib/guideMarkup";
import { Pill, Spinner, ErrorState } from "../components/ui";
import ItemModal from "../components/ItemModal";
import MonsterModal from "../components/MonsterModal";
import GuideTabs from "../components/GuideTabs";

const STATUS_TONE: Record<GuideStatus, "gold" | "purple" | "cyan" | "slate"> = {
  gp: "gold",
  certified: "purple",
  public: "cyan",
  draft: "slate",
};

export default function GuideDetail() {
  const { id } = useParams();
  const guideId = Number(id);

  // L'étape courante vit dans le store (source unique) : un « Retour » depuis une
  // page donjon/objet, ou un lien interne, reprend toujours au bon endroit.
  const savedStep = useStore((s) => s.guideStep[guideId] ?? 0);
  const done = useStore((s) => s.doneGuides.includes(guideId));

  const [itemId, setItemId] = useState<number | null>(null);
  const [monsterId, setMonsterId] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [focus, setFocus] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["ganymede-guide", guideId],
    queryFn: ({ signal }) => getGuideData(guideId, signal),
    enabled: Number.isFinite(guideId),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  // Le composant ne remonte plus entre guides (clé stable) : on referme donc les
  // modales/focus quand on bascule sur un autre guide.
  useEffect(() => {
    setItemId(null);
    setMonsterId(null);
    setCopied(false);
    document.querySelector("main")?.scrollTo({ top: 0 });
  }, [guideId]);

  const steps = data?.steps ?? [];
  const total = steps.length;
  const step = total ? Math.min(Math.max(savedStep, 0), total - 1) : 0;

  // Mémorise le guide ouvert (reprise depuis le menu + onglets récents).
  useEffect(() => {
    if (data) actions.pushRecentGuide(guideId);
  }, [data, guideId]);

  const setStep = useCallback(
    (n: number) => {
      const clamped = total ? Math.min(Math.max(n, 0), total - 1) : 0;
      actions.setGuideStep(guideId, clamped);
    },
    [total, guideId],
  );

  // Navigation clavier ← →.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight") setStep(step + 1);
      if (e.key === "ArrowLeft") setStep(step - 1);
      if (e.key === "Escape") setFocus(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, setStep]);

  const current = steps[step];
  const pct = total ? Math.round(((step + 1) / total) * 100) : 0;

  function copyPos() {
    if (!current) return;
    navigator.clipboard?.writeText(`/travel ${current.pos_x},${current.pos_y}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  }

  if (isLoading) return <Spinner label="Chargement du guide…" />;
  if (isError || !data) return <ErrorState message={(error as Error)?.message} onRetry={refetch} />;

  const hasPos =
    current && current.map && current.map !== "Nomap" && !(current.pos_x === 0 && current.pos_y === 0);
  const cat = categoryOf(data.name);

  return (
    <div>
      <GuideTabs activeId={guideId} />

      {/* En-tête */}
      <div className="glass relative mb-4 overflow-hidden rounded-2xl p-5">
        {/* halo de catégorie */}
        <div
          className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br ${cat.tile} opacity-40 blur-3xl`}
        />
        <div className="relative flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 gap-3">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.tile} ring-1 ring-white/10`}>
              <cat.Icon className={`h-6 w-6 ${cat.text}`} />
            </div>
            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${cat.text}`}>{cat.label}</span>
                <Pill tone={STATUS_TONE[data.status]} className="!px-1.5 !py-0 !text-[10px]">
                  {STATUS_LABEL[data.status]}
                </Pill>
                {data.user && (
                  <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                    {data.user.is_certified ? <BadgeCheck className="h-3.5 w-3.5 text-glow-purple" /> : null}
                    {data.user.name}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <ThumbsUp className="h-3.5 w-3.5" /> {data.likes}
                </span>
                {data.downloads != null && (
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                    <Download className="h-3.5 w-3.5" /> {data.downloads}
                  </span>
                )}
              </div>
              <h1 className="font-display text-2xl font-extrabold leading-tight tracking-tight text-white">
                {data.name}
              </h1>
            </div>
          </div>
          <div className="relative flex shrink-0 items-center gap-2">
            <button
              onClick={() => actions.toggleDoneGuide(guideId)}
              className={`no-drag inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                done
                  ? "bg-glow-emerald/20 text-glow-emerald ring-1 ring-glow-emerald/40"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              <CheckCircle2 className="h-4 w-4" /> {done ? "Terminé" : "Marquer terminé"}
            </button>
            <button
              onClick={() => {
                actions.resetGuide(guideId);
                setStep(0);
              }}
              title="Réinitialiser la progression"
              className="no-drag rounded-lg bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="relative mt-4">
          <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
            <span>
              Étape {step + 1} / {total}
            </span>
            <span>{pct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-glow-purple to-glow-cyan"
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
        {/* Sommaire des étapes */}
        <aside className="glass sticky top-4 hidden max-h-[78vh] self-start overflow-y-auto rounded-2xl p-2 lg:block">
          <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Étapes ({total})
          </p>
          <ol className="relative space-y-0.5">
            {/* ligne de liaison verticale */}
            <span className="pointer-events-none absolute bottom-3 left-[18px] top-3 w-px bg-white/10" />
            {steps.map((s, i) => {
              const state = i < step ? "done" : i === step ? "current" : "todo";
              return (
                <li key={i} className="relative">
                  <button
                    onClick={() => setStep(i)}
                    className={`no-drag flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-xs transition ${
                      state === "current"
                        ? "bg-glow-purple/20 text-white ring-1 ring-glow-purple/40"
                        : "text-slate-400 hover:bg-white/5"
                    }`}
                  >
                    <span
                      className={`relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ring-2 ring-void-900 transition ${
                        state === "done"
                          ? "bg-glow-emerald/25 text-glow-emerald"
                          : state === "current"
                            ? "bg-gradient-to-br from-glow-purple to-glow-cyan text-white shadow-[0_0_12px_-2px_rgba(124,92,255,0.8)]"
                            : "bg-white/5 text-slate-500"
                      }`}
                    >
                      {state === "done" ? "✓" : i + 1}
                    </span>
                    <span className="truncate">{s.name?.trim() || `Étape ${i + 1}`}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>

        {/* Étape courante */}
        <div className="min-w-0">
          <div className="glass rounded-2xl p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
              <h2 className="font-display text-lg font-bold text-white">
                {current?.name?.trim() || `Étape ${step + 1}`}
              </h2>
              <div className="flex items-center gap-2">
                {hasPos && (
                  <button
                    onClick={copyPos}
                    title="Copier la commande /travel"
                    className="no-drag inline-flex items-center gap-1.5 rounded-lg border border-glow-cyan/30 bg-glow-cyan/10 px-2.5 py-1.5 text-xs font-medium text-glow-cyan transition hover:bg-glow-cyan/20"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    {current!.map} [{current!.pos_x}, {current!.pos_y}]
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                )}
                <button
                  onClick={() => setFocus(true)}
                  title="Mode lecture plein écran"
                  className="no-drag rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.18 }}
                className="text-[15px]"
              >
                {current && (
                  <GuideText
                    text={current.text}
                    guideId={guideId}
                    stepIndex={step}
                    onItem={setItemId}
                    onMonster={setMonsterId}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 0}
              className="no-drag inline-flex items-center gap-1.5 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" /> Précédent
            </button>
            {step < total - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="no-drag inline-flex items-center gap-1.5 rounded-xl bg-glow-purple/25 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-glow-purple/40 transition hover:bg-glow-purple/35"
              >
                Suivant <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => actions.toggleDoneGuide(guideId)}
                className={`no-drag inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  done
                    ? "bg-glow-emerald/20 text-glow-emerald ring-1 ring-glow-emerald/40"
                    : "bg-glow-emerald/25 text-white ring-1 ring-glow-emerald/40 hover:bg-glow-emerald/35"
                }`}
              >
                <Flag className="h-4 w-4" /> {done ? "Guide terminé" : "Terminer le guide"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mode lecture plein écran */}
      <AnimatePresence>
        {focus && current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col bg-void-900/95 backdrop-blur-xl"
          >
            <div
              className={`pointer-events-none absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-br ${cat.tile} opacity-30 blur-3xl`}
            />
            <div className="relative flex items-center justify-between gap-3 border-b border-white/5 px-6 py-4">
              <div className="min-w-0">
                <p className={`text-[11px] font-bold uppercase tracking-wider ${cat.text}`}>{cat.label}</p>
                <h2 className="truncate font-display text-lg font-bold text-white">{data.name}</h2>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {hasPos && (
                  <button
                    onClick={copyPos}
                    className="no-drag inline-flex items-center gap-1.5 rounded-lg border border-glow-cyan/30 bg-glow-cyan/10 px-2.5 py-1.5 text-xs font-medium text-glow-cyan transition hover:bg-glow-cyan/20"
                  >
                    <MapPin className="h-3.5 w-3.5" /> {current.map} [{current.pos_x}, {current.pos_y}]
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                )}
                <span className="rounded-lg bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-300">
                  {step + 1} / {total}
                </span>
                <button
                  onClick={() => setFocus(false)}
                  title="Quitter (Échap)"
                  className="no-drag rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="relative flex-1 overflow-y-auto px-6 py-10">
              <div className="mx-auto max-w-2xl">
                <h3 className="mb-4 font-display text-2xl font-extrabold text-white">
                  {current.name?.trim() || `Étape ${step + 1}`}
                </h3>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.18 }}
                    className="text-lg"
                  >
                    <GuideText
                      text={current.text}
                      guideId={guideId}
                      stepIndex={step}
                      onItem={setItemId}
                      onMonster={setMonsterId}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="relative flex items-center justify-between gap-3 border-t border-white/5 px-6 py-4">
              <button
                onClick={() => setStep(step - 1)}
                disabled={step === 0}
                className="no-drag inline-flex items-center gap-1.5 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" /> Précédent
              </button>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/5">
                <div className="h-full rounded-full bg-gradient-to-r from-glow-purple to-glow-cyan" style={{ width: `${pct}%` }} />
              </div>
              <button
                onClick={() => setStep(step + 1)}
                disabled={step >= total - 1}
                className="no-drag inline-flex items-center gap-1.5 rounded-xl bg-glow-purple/25 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-glow-purple/40 transition hover:bg-glow-purple/35 disabled:opacity-40"
              >
                Suivant <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {itemId !== null && (
          <ItemModal id={itemId} onClose={() => setItemId(null)} onSelectItem={setItemId} />
        )}
        {monsterId !== null && <MonsterModal id={monsterId} onClose={() => setMonsterId(null)} />}
      </AnimatePresence>
    </div>
  );
}
