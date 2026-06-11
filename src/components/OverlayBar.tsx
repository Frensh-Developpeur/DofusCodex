import { useEffect, useState } from "react";
import { MapPin } from "./DofusIcons";
import DofusIcon from "./DofusIcon";
import CodexMark from "./CodexMark";
import { useOverlayAlpha, setOverlayAlpha, closeOverlay } from "../lib/overlay";

const SNAP_KEY = "dofuscodex.overlaySnap";

// Barre fine de la fenêtre overlay (remplace la TitleBar). Zone déplaçable + (Windows uniquement)
// accroche qui SUIT la fenêtre Dofus + réglage de l'opacité du FOND + fermeture (croix rouge).
export default function OverlayBar() {
  const alpha = useOverlayAlpha();
  const [platform, setPlatform] = useState("");
  const [running, setRunning] = useState(false); // Dofus détecté ?
  const [snap, setSnap] = useState(() => {
    try {
      return localStorage.getItem(SNAP_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    window.dofusCodex?.getPlatform().then(setPlatform).catch(() => {});
  }, []);
  // L'accroche n'est proposée que sur Windows (sur macOS le plein écran natif la rend peu fiable).
  const isWin = platform === "win32";

  // Windows : détection périodique du jeu + (ré)activation du suivi si l'accroche était cochée.
  useEffect(() => {
    if (!isWin) return;
    if (snap) window.dofusCodex?.overlaySnapMode?.(true);
    let alive = true;
    const tick = () =>
      window.dofusCodex
        ?.detectDofus?.()
        .then((r) => {
          if (alive) setRunning(!!r?.running);
        })
        .catch(() => {});
    tick();
    const id = setInterval(tick, 3000);
    return () => {
      alive = false;
      clearInterval(id);
      window.dofusCodex?.overlaySnapMode?.(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWin]);

  const toggleSnap = () => {
    setSnap((s) => {
      const next = !s;
      try {
        localStorage.setItem(SNAP_KEY, next ? "1" : "0");
      } catch {
        /* best-effort */
      }
      window.dofusCodex?.overlaySnapMode?.(next);
      return next;
    });
  };

  return (
    <div className="drag relative z-30 flex h-9 shrink-0 items-center gap-2 border-b border-white/10 bg-void-900/70 px-2.5 backdrop-blur-md">
      <CodexMark className="h-3.5 w-3.5 shrink-0 text-glow-purple" fill="rgba(124,92,255,0.25)" />
      <span className="shrink-0 text-[11px] font-semibold tracking-wide text-slate-300">Overlay</span>

      {/* Accroche à la fenêtre Dofus — Windows uniquement */}
      {isWin && (
        <button
          onClick={toggleSnap}
          title={
            (running ? "Dofus détecté" : "Dofus non détecté") +
            " — l'overlay suit la fenêtre Dofus (place-le où tu veux, il suivra)"
          }
          className={`no-drag inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-semibold transition ${
            snap ? "bg-glow-purple/25 text-white ring-1 ring-glow-purple/40" : "text-slate-400 hover:bg-white/10"
          }`}
        >
          <MapPin className="h-3 w-3" />
          Suivre Dofus
          <span
            className={`h-1.5 w-1.5 rounded-full ${running ? "bg-glow-emerald shadow-[0_0_5px_0_rgba(52,211,153,0.9)]" : "bg-slate-600"}`}
          />
        </button>
      )}

      {/* Opacité du fond */}
      <div className="no-drag ml-auto flex min-w-0 items-center gap-1.5">
        <span className="shrink-0 text-[10px] uppercase tracking-wide text-slate-500">Fond</span>
        <input
          type="range"
          min={10}
          max={100}
          value={Math.round(alpha * 100)}
          onChange={(e) => setOverlayAlpha(Number(e.target.value) / 100)}
          title={`Opacité du fond ${Math.round(alpha * 100)}%`}
          className="h-1 w-14 cursor-pointer accent-glow-purple"
        />
      </div>

      <button
        onClick={() => closeOverlay()}
        title="Fermer l'overlay (revenir à la fenêtre normale)"
        className="no-drag shrink-0 rounded-md p-0.5 transition hover:bg-white/10"
      >
        <DofusIcon name="closeRed" size={16} />
      </button>
    </div>
  );
}
