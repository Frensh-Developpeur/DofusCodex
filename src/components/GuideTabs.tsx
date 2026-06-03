import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { LayoutGrid, X, CheckCircle2 } from "lucide-react";
import { getGuideListData, getGuideData } from "../lib/guideStore";
import { useStore, actions } from "../store/store";

// Barre d'onglets persistante (liste + guides récemment ouverts) pour switcher
// rapidement entre plusieurs guides. La liste des récents vit dans le store.
export default function GuideTabs({ activeId }: { activeId?: number }) {
  const recent = useStore((s) => s.recentGuides);
  const doneGuides = useStore((s) => s.doneGuides);
  const navigate = useNavigate();
  const qc = useQueryClient();

  // Précharge tous les guides ouverts → basculer d'onglet est instantané (cache).
  useEffect(() => {
    for (const id of recent) {
      qc.prefetchQuery({
        queryKey: ["ganymede-guide", id],
        queryFn: ({ signal }) => getGuideData(id, signal),
        staleTime: 1000 * 60 * 30,
      });
    }
  }, [recent, qc]);

  // La liste complète est en cache (mémoire + localStorage) → résolution instantanée des noms.
  const { data } = useQuery({
    queryKey: ["ganymede-guides"],
    queryFn: ({ signal }) => getGuideListData(signal),
    staleTime: 1000 * 60 * 30,
  });
  const nameById = useMemo(() => {
    const m = new Map<number, string>();
    for (const g of data ?? []) m.set(g.id, g.name);
    return m;
  }, [data]);

  if (recent.length === 0) return null;

  function close(id: number) {
    const rest = recent.filter((g) => g !== id);
    actions.closeRecentGuide(id);
    if (id === activeId) navigate(rest[0] ? `/guides/${rest[0]}` : "/guides");
  }

  return (
    <div className="no-drag mb-4 flex items-center gap-1.5 overflow-x-auto pb-1">
      <Link
        to="/guides"
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
          activeId == null
            ? "bg-glow-purple/25 text-white ring-1 ring-glow-purple/40"
            : "bg-white/5 text-slate-400 hover:bg-white/10"
        }`}
      >
        <LayoutGrid className="h-3.5 w-3.5" /> Liste
      </Link>

      {recent.map((id) => {
        const active = id === activeId;
        const done = doneGuides.includes(id);
        const name = nameById.get(id) ?? `Guide #${id}`;
        return (
          <div
            key={id}
            className={`group inline-flex shrink-0 items-center gap-1 rounded-lg pl-2.5 pr-1 py-1.5 text-xs font-medium transition ${
              active
                ? "bg-glow-purple/25 text-white ring-1 ring-glow-purple/40"
                : "bg-white/5 text-slate-400 hover:bg-white/10"
            }`}
          >
            <Link to={`/guides/${id}`} className="flex items-center gap-1.5">
              {done && <CheckCircle2 className="h-3 w-3 shrink-0 text-glow-emerald" />}
              <span className="max-w-[11rem] truncate">{name}</span>
            </Link>
            <button
              onClick={() => close(id)}
              title="Fermer l'onglet"
              className="shrink-0 rounded p-0.5 text-slate-500 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
