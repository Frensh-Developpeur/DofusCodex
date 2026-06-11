import { useEffect, useState, useSyncExternalStore } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw, CheckCircle2 } from "./DofusIcons";
import DofusIcon from "./DofusIcon";
import { idbCountGuides, idbGetMeta, idbGetStepCounts } from "../lib/guideDb";
import { startGuideSync, guideSync, ensureGuidesDownloaded, type SyncProgress } from "../lib/guideStore";
import { actions } from "../store/store";

// Barre d'état du stockage local des guides. La synchro est désormais AUTOMATIQUE (au
// lancement de l'app, cf. App.tsx → startGuideSync) : cette barre se contente d'afficher la
// progression / l'état, propose une mise à jour manuelle, et l'import de progression Ganymède.
type ImportState = "idle" | "loading" | "ok" | "not-found" | "error";

export default function GuidesSyncBar({ total }: { total: number }) {
  const qc = useQueryClient();
  const sync = useSyncExternalStore(guideSync.subscribe, guideSync.getSnapshot, guideSync.getSnapshot);
  const [stored, setStored] = useState<number | null>(null);
  const [lastSync, setLastSync] = useState<number | null>(null);
  const [importProgress, setImportProgress] = useState<SyncProgress | null>(null);

  const hasGanymedeIpc = !!window.dofusCodex?.readGanymedeProgress;
  const [importState, setImportState] = useState<ImportState>("idle");
  const [importCount, setImportCount] = useState(0);

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
  }, []);

  // À chaque fin de synchro globale → rafraîchit les compteurs et la liste affichée.
  useEffect(() => {
    if (!sync.running) {
      refresh();
      qc.invalidateQueries({ queryKey: ["ganymede-guides"] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sync.running]);

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
      const ids = result.progresses.map((p) => p.id);
      await ensureGuidesDownloaded(ids, { onProgress: (p) => setImportProgress(p.total > 0 ? p : null) });
      setImportProgress(null);
      const counts = await idbGetStepCounts().catch(() => ({}) as Record<number, number>);
      actions.mergeGuideTotalSteps(counts);
      await refresh();
      qc.invalidateQueries({ queryKey: ["ganymede-guides"] });
      setImportState("ok");
    } catch {
      setImportProgress(null);
      setImportState("error");
    }
    setTimeout(() => setImportState("idle"), 4000);
  }

  const running = sync.running || importProgress !== null;
  const progress = sync.running ? sync.progress : importProgress;
  const complete = total > 0 && stored != null && stored >= total;
  const pct = progress && progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  // En cours de téléchargement / mise à jour (auto ou manuel)
  if (running) {
    return (
      <div className="glass mb-4 rounded-2xl p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-2 font-medium text-white">
            <DofusIcon name="book" size={16} className="animate-pulse" />
            Téléchargement des guides…
          </span>
          <span className="text-xs text-slate-400">
            {progress && progress.total ? `${progress.done} / ${progress.total}` : "vérification…"}
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

  // État au repos : tout en local (vert) ou décompte ; + import Ganymède + maj manuelle.
  return (
    <div className="glass mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-2.5">
      <span className="inline-flex items-center gap-2 text-sm text-slate-300">
        {complete ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-glow-emerald" />
            {stored} guides en local · chargement instantané
            <span className="text-xs text-slate-500">· {relativeTime(lastSync)}</span>
          </>
        ) : (
          <>
            <DofusIcon name="book" size={16} />
            {stored ?? 0}
            {total > 0 ? ` / ${total}` : ""} guides en local · synchro automatique au lancement
          </>
        )}
      </span>
      <div className="flex items-center gap-2">
        {hasGanymedeIpc && (
          <GanymedeImportButton state={importState} count={importCount} onClick={importFromGanymede} />
        )}
        <button
          onClick={() => startGuideSync()}
          className="no-drag inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Mettre à jour
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
