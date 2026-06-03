import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Download, RefreshCw, CheckCircle2, HardDriveDownload } from "lucide-react";
import { idbCountGuides, idbGetMeta } from "../lib/guideDb";
import { syncGuides, type SyncProgress } from "../lib/guideStore";

// Barre de gestion du stockage local : télécharger tous les guides (1er lancement) ou
// mettre à jour ce qui a changé. `total` = nombre de guides FR connus (depuis la liste).
export default function GuidesSyncBar({ total }: { total: number }) {
  const qc = useQueryClient();
  const [stored, setStored] = useState<number | null>(null);
  const [lastSync, setLastSync] = useState<number | null>(null);
  const [progress, setProgress] = useState<SyncProgress | null>(null);
  const running = progress !== null;
  const abort = useRef<AbortController | null>(null);

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
            <HardDriveDownload className="h-4 w-4 animate-pulse text-glow-cyan" />
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
        <button
          onClick={run}
          className="no-drag inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Mettre à jour
        </button>
      </div>
    );
  }

  // Pas (encore) tout téléchargé → invitation
  return (
    <div className="glass mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-glow-purple/20 bg-glow-purple/[0.04] px-4 py-3">
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-sm font-semibold text-white">
          <HardDriveDownload className="h-4 w-4 text-glow-violet" /> Pré-télécharger les guides
        </p>
        <p className="mt-0.5 text-xs text-slate-400">
          Téléchargez tous les guides une fois pour une navigation instantanée (zéro chargement à
          l'ouverture){total > 0 ? ` — ≈ ${total} guides` : ""}.{stored ? ` ${stored} déjà en local.` : ""}
        </p>
      </div>
      <button
        onClick={run}
        className="no-drag inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-glow-purple/25 px-3.5 py-2 text-sm font-semibold text-white ring-1 ring-glow-purple/40 transition hover:bg-glow-purple/35"
      >
        <Download className="h-4 w-4" /> Tout télécharger
      </button>
    </div>
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
