import { useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui";
import DofusIcon from "./DofusIcon";
import { getDplnGuide, dplnSlug } from "../lib/dplnGuide";

// Guide complet récupéré EN DIRECT depuis DofusPourLesNoobs et restylé pour l'app (contenu non
// statique : il suit la page DPLN). Aucune redirection externe : tout est lu dans l'app, et
// cliquer une image l'agrandit dans une lightbox (au lieu d'ouvrir DPLN).
export default function DplnGuide({ url }: { url: string }) {
  const slug = dplnSlug(url);
  const [zoom, setZoom] = useState<string | null>(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dpln-guide", slug],
    queryFn: ({ signal }) => getDplnGuide(slug as string, signal),
    enabled: !!slug,
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });

  // Délégation : un clic sur une <img> du contenu rendu ouvre la lightbox.
  const onContentClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG") {
      const src = (target as HTMLImageElement).currentSrc || (target as HTMLImageElement).src;
      if (src) setZoom(src);
    }
  };

  return (
    <section className="mt-6 border-t border-white/10 pt-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-display text-lg font-bold text-white">Guide complet</h3>
        <span className="text-xs font-medium text-slate-500">Source : DofusPourLesNoobs</span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className={i % 3 === 1 ? "h-40" : "h-4"} />
          ))}
        </div>
      ) : isError || !data ? (
        <div className="rounded-xl border border-glow-gold/30 bg-glow-gold/[0.06] p-4 text-sm text-slate-300">
          Impossible de charger le guide pour le moment. Réessaie plus tard.
        </div>
      ) : (
        <div
          className="news-article dpln-guide text-sm leading-relaxed text-slate-300"
          onClick={onContentClick}
          dangerouslySetInnerHTML={{ __html: data }}
        />
      )}

      <Lightbox src={zoom} onClose={() => setZoom(null)} />
    </section>
  );
}

// Visionneuse plein écran d'une image (portalisée au-dessus de la modale). Clic / Échap = fermer.
function Lightbox({ src, onClose }: { src: string | null; onClose: () => void }) {
  useEffect(() => {
    if (!src) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [src, onClose]);

  return createPortal(
    <AnimatePresence>
      {src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-10"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="no-drag absolute right-4 top-4 rounded-lg border border-white/10 bg-black/40 p-2 text-slate-200 transition hover:bg-black/60"
          >
            <DofusIcon name="closeRed" size={20} />
          </button>
          <motion.img
            key={src}
            src={src}
            alt=""
            referrerPolicy="no-referrer"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full cursor-zoom-out rounded-lg object-contain shadow-card"
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
