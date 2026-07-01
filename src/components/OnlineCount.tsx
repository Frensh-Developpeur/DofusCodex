import clsx from "clsx";
import { usePresenceCount } from "../lib/presence";

// Indicateur discret « N en ligne » (Supabase Realtime Presence). Masqué tant que le compteur
// n'est pas disponible (Supabase non configuré / pas encore synchronisé).
export default function OnlineCount({ collapsed }: { collapsed?: boolean }) {
  const count = usePresenceCount();
  if (count == null) return null;

  const label = `${count} joueur${count > 1 ? "s" : ""} en ligne`;

  return (
    <div
      title={label}
      className={clsx(
        "mb-2 flex items-center rounded-lg text-xs font-medium text-slate-400",
        collapsed ? "justify-center px-2 py-1.5" : "gap-2 px-2.5 py-1.5",
      )}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-glow-emerald/70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-glow-emerald" />
      </span>
      {collapsed ? (
        <span className="ml-1 font-semibold tabular-nums text-glow-emerald">{count}</span>
      ) : (
        <span>
          <span className="font-semibold tabular-nums text-glow-emerald">{count}</span> en ligne
        </span>
      )}
    </div>
  );
}
