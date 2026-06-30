import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Download, RefreshCw, X, ExternalLink, Loader2 } from "./DofusIcons";
import DofusIcon from "./DofusIcon";
import AppLoader from "./AppLoader";

export const OPEN_UPDATE_LAUNCHER_EVENT = "dofuscodex:open-update-launcher";

export function openUpdateLauncher() {
  window.dispatchEvent(new Event(OPEN_UPDATE_LAUNCHER_EVENT));
}

const BACKDROP =
  "radial-gradient(120% 90% at 50% 18%, rgb(var(--c-purple)/0.16), transparent 60%)," +
  "radial-gradient(90% 70% at 50% 100%, rgb(var(--c-cyan)/0.1), transparent 55%)," +
  "#070912";

function fmtBytes(value?: number | null) {
  if (!value || value <= 0) return "—";
  const units = ["o", "Ko", "Mo", "Go"];
  let n = value;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function fmtSpeed(value?: number | null) {
  return value ? `${fmtBytes(value)}/s` : "—";
}

function timeLabel(ts?: number) {
  if (!ts) return "Jamais";
  return new Date(ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function stripNotes(text?: string | null) {
  if (!text) return "";
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 420);
}

function statusCopy(evt: UpdateEvent | null) {
  const version = evt?.version ? `v${evt.version}` : "la dernière version";
  if (!evt) return { title: "Launcher DofusCodex", detail: "Vérifie les mises à jour et prépare l'installation." };
  if (evt.state === "checking") return { title: "Recherche de mise à jour", detail: "Connexion au dépôt de publication…" };
  if (evt.state === "available") return { title: `${version} disponible`, detail: evt.isMac ? "Téléchargement manuel requis sur macOS." : "Prête à être téléchargée depuis le launcher." };
  if (evt.state === "downloading") return { title: `Téléchargement ${evt.percent ?? 0}%`, detail: `${fmtBytes(evt.transferred)} / ${fmtBytes(evt.total)} · ${fmtSpeed(evt.bytesPerSecond)}` };
  if (evt.state === "downloaded") return { title: `${version} prête`, detail: "Redémarre DofusCodex pour installer la mise à jour." };
  if (evt.state === "not-available") return { title: "DofusCodex est à jour", detail: `Version actuelle v${evt.current ?? "—"}.` };
  if (evt.state === "dev") return { title: "Mode développement", detail: "Les mises à jour sont disponibles uniquement dans l'application installée." };
  if (evt.state === "unavailable") return { title: "Mise à jour indisponible", detail: evt.error || "Le moteur de mise à jour n'est pas disponible." };
  if (evt.state === "error") return { title: "Échec de mise à jour", detail: evt.error || "Une erreur est survenue." };
  return { title: "Launcher DofusCodex", detail: "Prêt à vérifier les mises à jour." };
}

export default function UpdateBanner({ startupGate = false }: { startupGate?: boolean }) {
  const [evt, setEvt] = useState<UpdateEvent | null>(null);
  const [open, setOpen] = useState(startupGate);
  const [gateOpen, setGateOpen] = useState(startupGate);
  const [installing, setInstalling] = useState(false);
  const startupCheckStarted = useRef(false);
  const autoDownloadKey = useRef<string | null>(null);

  useEffect(() => {
    const offUpdate = window.dofusCodex?.onUpdate?.((p) => {
      setEvt(p);
      if (["available", "downloaded"].includes(p.state) || gateOpen) setOpen(true);
    });
    const onOpen = () => {
      setOpen(true);
      window.dofusCodex?.updateStatus?.().then((p) => p && setEvt(p)).catch(() => {});
    };
    window.addEventListener(OPEN_UPDATE_LAUNCHER_EVENT, onOpen);
    window.dofusCodex?.peekUpdate?.().then((p) => {
      if (p) setEvt(p);
    });
    window.dofusCodex?.updateStatus?.().then((p) => {
      if (p) setEvt((cur) => cur ?? p);
    }).catch(() => {});
    return () => {
      offUpdate?.();
      window.removeEventListener(OPEN_UPDATE_LAUNCHER_EVENT, onOpen);
    };
  }, [gateOpen]);

  useEffect(() => {
    if (!startupGate || startupCheckStarted.current) return;
    startupCheckStarted.current = true;
    setOpen(true);
    setGateOpen(true);
    window.dofusCodex?.updateStatus?.().then((p) => {
      if (p) setEvt(p);
      if (!p || ["idle", "error", "dev", "unavailable", "not-available"].includes(p.state)) {
        return window.dofusCodex?.checkUpdate?.().then((r) => {
          if (r.payload) setEvt(r.payload);
        });
      }
      return undefined;
    }).catch(() => {
      void window.dofusCodex?.checkUpdate?.().then((r) => {
        if (r.payload) setEvt(r.payload);
      });
    });
  }, [startupGate]);

  useEffect(() => {
    if (!gateOpen || !evt) return;
    if (["not-available", "dev", "unavailable"].includes(evt.state)) {
      const t = window.setTimeout(() => {
        setGateOpen(false);
        setOpen(false);
      }, evt.state === "not-available" ? 700 : 1100);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [evt, gateOpen]);

  useEffect(() => {
    if (!gateOpen || evt?.state !== "available" || evt.isMac) return;
    const key = evt.version || "available";
    if (autoDownloadKey.current === key) return;
    autoDownloadKey.current = key;
    void window.dofusCodex?.downloadUpdate?.();
  }, [evt, gateOpen]);

  const copy = statusCopy(evt);
  const notes = stripNotes(evt?.releaseNotes);
  const hasAttention = !!evt && ["available", "downloaded", "downloading", "error"].includes(evt.state);
  const progress = Math.max(0, Math.min(100, evt?.percent ?? 0));
  const isGate = gateOpen || installing;
  const canClose = !isGate;
  const canBypassGate = gateOpen && !!evt && ["error"].includes(evt.state);

  const check = () => {
    setOpen(true);
    void window.dofusCodex?.checkUpdate?.().then((r) => r.payload && setEvt(r.payload)).catch(() => {});
  };
  const download = () => {
    setOpen(true);
    void window.dofusCodex?.downloadUpdate?.();
  };
  const install = () => {
    setInstalling(true);
    window.setTimeout(() => window.dofusCodex?.installUpdate?.(), 900);
  };
  const openReleases = () => window.dofusCodex?.openReleases?.();

  const primary =
    evt?.state === "downloaded"
      ? { label: "Redémarrer & installer", icon: RefreshCw, run: install }
      : evt?.state === "available" && evt.isMac
        ? { label: "Ouvrir le téléchargement", icon: ExternalLink, run: openReleases }
        : evt?.state === "available"
          ? { label: "Télécharger", icon: Download, run: download }
          : evt?.state === "downloading"
            ? null
            : { label: "Vérifier", icon: RefreshCw, run: check };

  return (
    <>
      <AnimatePresence>
        {hasAttention && !open && !installing && !gateOpen && (
          <motion.button
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            onClick={() => setOpen(true)}
            className="no-drag fixed bottom-5 right-5 z-[55] flex max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-2xl border border-glow-purple/30 bg-void-800/95 px-4 py-3 text-left shadow-card ring-1 ring-white/10 backdrop-blur transition hover:bg-void-800"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-glow-purple/40 to-glow-cyan/20">
              <DofusIcon name="download" size={19} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-white">{copy.title}</span>
              <span className="block max-w-[17rem] truncate text-xs text-slate-400">{copy.detail}</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(open || gateOpen) && !installing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 flex items-center justify-center p-4 backdrop-blur-sm ${isGate ? "z-[9998] bg-void-950" : "z-[90] bg-black/70"}`}
            style={isGate ? { background: BACKDROP } : undefined}
            onClick={() => {
              if (canClose) setOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-void-900/96 shadow-card"
            >
              <div className="relative overflow-hidden p-6">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_10%,rgb(var(--c-purple)/0.22),transparent_40%),radial-gradient(circle_at_90%_0%,rgb(var(--c-cyan)/0.12),transparent_35%)]" />
                <div className="relative flex items-start gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-glow-purple/30 bg-glow-purple/15">
                    {evt?.state === "checking" || evt?.state === "downloading" ? (
                      <Loader2 className="h-6 w-6 animate-spin text-glow-violet" />
                    ) : evt?.state === "downloaded" || evt?.state === "not-available" ? (
                      <Check className="h-6 w-6 text-glow-emerald" />
                    ) : (
                      <DofusIcon name="download" size={28} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase text-glow-purple/80">DofusCodex Launcher</p>
                    <h2 className="mt-1 font-display text-2xl font-extrabold text-white">
                      {gateOpen && evt?.state === "available" ? "Mise à jour obligatoire" : copy.title}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      {gateOpen && evt?.state === "available" && !evt.isMac
                        ? "DofusCodex télécharge cette version avant de lancer l'app."
                        : gateOpen && evt?.state === "available" && evt.isMac
                          ? "Télécharge et installe la dernière version pour lancer DofusCodex."
                          : gateOpen && evt?.state === "downloaded"
                            ? "La mise à jour est prête. Redémarre pour ouvrir DofusCodex sur la dernière version."
                            : copy.detail}
                    </p>
                  </div>
                  {canClose && (
                    <button onClick={() => setOpen(false)} className="no-drag rounded-xl p-2 text-slate-500 transition hover:bg-white/10 hover:text-white">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="relative mt-6 grid gap-3 sm:grid-cols-3">
                  <InfoBox label="Installée" value={evt?.current ? `v${evt.current}` : "—"} />
                  <InfoBox label="Dernière" value={evt?.version ? `v${evt.version}` : "—"} />
                  <InfoBox label="Dernier check" value={timeLabel(evt?.checkedAt)} />
                </div>

                {(evt?.state === "downloading" || evt?.state === "downloaded") && (
                  <div className="relative mt-5">
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                      <span>{evt.state === "downloaded" ? "Téléchargement terminé" : "Téléchargement"}</span>
                      <span className="font-mono text-slate-300">{progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-glow-purple to-glow-cyan"
                        animate={{ width: `${evt.state === "downloaded" ? 100 : progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {notes && (
                  <div className="relative mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Notes de version</p>
                    <p className="text-sm leading-6 text-slate-300">{notes}</p>
                  </div>
                )}

                <div className="relative mt-6 flex flex-wrap justify-end gap-2">
                  {canBypassGate && (
                    <button
                      onClick={() => {
                        setGateOpen(false);
                        setOpen(false);
                      }}
                      className="no-drag inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.08]"
                    >
                      Lancer quand même
                    </button>
                  )}
                  <button
                    onClick={check}
                    disabled={evt?.state === "checking" || evt?.state === "downloading"}
                    className="no-drag inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.08] disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${evt?.state === "checking" ? "animate-spin" : ""}`} /> Vérifier
                  </button>
                  {primary && (
                    <button
                      onClick={primary.run}
                      disabled={evt?.state === "checking"}
                      className="no-drag inline-flex items-center gap-2 rounded-xl border border-glow-purple/45 bg-glow-purple/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-glow-purple/30 disabled:opacity-50"
                    >
                      <primary.icon className="h-4 w-4" /> {primary.label}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {installing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 px-8 text-center"
            style={{ background: BACKDROP }}
          >
            <AppLoader label="Installation de la mise à jour…" />
            <p className="max-w-sm text-sm leading-6 text-slate-400">
              DofusCodex va redémarrer automatiquement pour appliquer la mise à jour.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
      <p className="text-[10px] font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 truncate font-display text-lg font-bold text-white">{value}</p>
    </div>
  );
}
