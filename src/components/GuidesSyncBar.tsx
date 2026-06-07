import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Download, RefreshCw, CheckCircle2 } from "./DofusIcons";
import DofusIcon from "./DofusIcon";
import { idbCountGuides, idbGetMeta, idbGetStepCounts } from "../lib/guideDb";
import { syncGuides, ensureGuidesDownloaded, type SyncProgress } from "../lib/guideStore";
import { actions } from "../store/store";

// Barre de gestion du stockage local : télécharger tous les guides (1er lancement) ou
// mettre à jour ce qui a changé. `total` = nombre de guides FR connus (depuis la liste).
type ImportState = "idle" | "loading" | "ok" | "not-found" | "error";

export default function GuidesSyncBar({ total }: { total: number }) {
  const qc = useQueryClient();
  const [stored, setStored] = useState<number | null>(null);
  const [lastSync, setLastSync] = useState<number | null>(null);
  const [progress, setProgress] = useState<SyncProgress | null>(null);
  const running = progress !== null;
  const abort = useRef<AbortController | null>(null);

  const hasGanymedeIpc = !!window.dofusCodex?.readGanymedeProgress;
  const [importState, setImportState] = useState<ImportState>("idle");
  const [importCount, setImportCount] = useState(0);

  async function importFromGanymede() {
    if (!window.dofusCodex?.readGanymedeProgress) return;
    setImportState("loading");
    try {
      const result = await window.dofusCodex.readGanymedeProgress();
      if (!result) {
        setImportState("not-found");
        setTimeout(() => setImportState("idle"), 4000);
        return;
      }
      const n = actions.importGanymedeProgress(result.progresses);
      setImportCount(n);
      // Télécharge depuis l'API le contenu des guides importés (ceux manquants en local),
      // puis fusionne leurs totaux d'étapes → cards « X / Y » + détection « terminé ».
      const ids = result.progresses.map((p) => p.id);
      // N'affiche la grande barre que s'il y a effectivement des guides à télécharger
      // (sinon tout est déjà en local → évite un flash inutile).
      await ensureGuidesDownloaded(ids, { onProgress: (p) => setProgress(p.total > 0 ? p : null) });
      setProgress(null);
      const counts = await idbGetStepCounts().catch(() => ({}) as Record<number, number>);
      actions.mergeGuideTotalSteps(counts);
      await refresh();
      qc.invalidateQueries({ queryKey: ["ganymede-guides"] });
      setImportState("ok");
    } catch {
      setProgress(null);
      setImportState("error");
    }
    setTimeout(() => setImportState("idle"), 4000);
  }

  async function refresh() {
    const [c, ls] = await Promise.all([
      idbCountGuides().catch(() => 0),
      idbGetMeta<number>("lastSync").catch(() => undefined),
    ]);
    setStored(c);
    setLastSync(ls ?? null);
  }
  useEffect(() => {
    refresh();
    return () => abort.current?.abort();
  }, []);

  async function run() {
    abort.current = new AbortController();
    setProgress({ done: 0, total: 0 });
    try {
      await syncGuides({ onProgress: setProgress, signal: abort.current.signal });
    } finally {
      setProgress(null);
      await refresh();
      qc.invalidateQueries({ queryKey: ["ganymede-guides"] });
    }
  }

  const complete = total > 0 && stored != null && stored >= total;
  const pct = progress && progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  // En cours de téléchargement
  if (running) {
    return (
      <div className="glass mb-4 rounded-2xl p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-2 font-medium text-white">
            <DofusIcon name="book" size={16} className="animate-pulse" />
            Téléchargement des guides…
          </span>
          <span className="text-xs text-slate-400">
            {progress!.total ? `${progress!.done} / ${progress!.total}` : "préparation…"}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-glow-purple to-glow-cyan transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  // Tout est en local → état + mise à jour
  if (complete) {
    return (
      <div className="glass mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-2.5">
        <span className="inline-flex items-center gap-2 text-sm text-slate-300">
          <CheckCircle2 className="h-4 w-4 text-glow-emerald" />
          {stored} guides en local · chargement instantané
          <span className="text-xs text-slate-500">· {relativeTime(lastSync)}</span>
        </span>
        <div className="flex items-center gap-2">
          {hasGanymedeIpc && (
            <GanymedeImportButton state={importState} count={importCount} onClick={importFromGanymede} />
          )}
          <button
            onClick={run}
            className="no-drag inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Mettre à jour
          </button>
        </div>
      </div>
    );
  }

  // Pas (encore) tout téléchargé → invitation
  return (
    <div className="glass mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-glow-purple/20 bg-glow-purple/[0.04] px-4 py-3">
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-sm font-semibold text-white">
          <DofusIcon name="book" size={16} /> Pré-télécharger les guides
        </p>
        <p className="mt-0.5 text-xs text-slate-400">
          Téléchargez tous les guides une fois pour une navigation instantanée (zéro chargement à
          l'ouverture){total > 0 ? ` — ≈ ${total} guides` : ""}.{stored ? ` ${stored} déjà en local.` : ""}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {hasGanymedeIpc && (
          <GanymedeImportButton state={importState} count={importCount} onClick={importFromGanymede} />
        )}
        <button
          onClick={run}
          className="no-drag inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-glow-purple/25 px-3.5 py-2 text-sm font-semibold text-white ring-1 ring-glow-purple/40 transition hover:bg-glow-purple/35"
        >
          <Download className="h-4 w-4" /> Tout télécharger
        </button>
      </div>
    </div>
  );
}

function GanymedeImportButton({
  state,
  count,
  onClick,
}: {
  state: ImportState;
  count: number;
  onClick: () => void;
}) {
  const label =
    state === "loading" ? "Import…" :
    state === "ok" ? `${count} guide${count !== 1 ? "s" : ""} importé${count !== 1 ? "s" : ""}` :
    state === "not-found" ? "Ganymède introuvable" :
    state === "error" ? "Erreur import" :
    "Importer Ganymède";

  const tone =
    state === "ok" ? "text-glow-emerald ring-glow-emerald/40 bg-glow-emerald/10" :
    state === "not-found" || state === "error" ? "text-glow-gold ring-glow-gold/40 bg-glow-gold/10" :
    "text-slate-300 bg-white/5 hover:bg-white/10";

  return (
    <button
      onClick={onClick}
      disabled={state === "loading" || state === "ok"}
      title="Importer la progression du profil actif de l'app Ganymède installée sur ce poste"
      className={`no-drag inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ring-1 ring-transparent transition disabled:cursor-default ${tone}`}
    >
      <DofusIcon name={state === "ok" ? "tick" : "book"} size={14} />
      {label}
    </button>
  );
}

function relativeTime(ts: number | null): string {
  if (!ts) return "jamais synchronisé";
  const diff = Date.now() - ts;
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "à jour à l'instant";
  if (h < 24) return `à jour il y a ${h} h`;
  const d = Math.floor(h / 24);
  return `à jour il y a ${d} j`;
}
