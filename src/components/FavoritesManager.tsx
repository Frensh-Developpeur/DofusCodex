import { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import DofusIcon from "./DofusIcon";
import { X } from "./DofusIcons";
import { useStore, actions } from "../store/store";
import { NAV_GROUPS, ALL_NAV_ITEMS } from "../lib/navItems";

// Réordonne `list` en plaçant `from` à la position de `to`.
function reorder(list: string[], from: string, to: string): string[] {
  const a = [...list];
  const i = a.indexOf(from);
  const j = a.indexOf(to);
  if (i < 0 || j < 0 || i === j) return list;
  a.splice(i, 1);
  a.splice(j, 0, from);
  return a;
}

// Petite poignée de glisser (6 points) — pas d'icône dédiée dans le set DofusDB.
function GripDots() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor" aria-hidden className="shrink-0">
      <circle cx="2.5" cy="3" r="1.2" />
      <circle cx="7.5" cy="3" r="1.2" />
      <circle cx="2.5" cy="8" r="1.2" />
      <circle cx="7.5" cy="8" r="1.2" />
      <circle cx="2.5" cy="13" r="1.2" />
      <circle cx="7.5" cy="13" r="1.2" />
    </svg>
  );
}

// Fenêtre de gestion des favoris : choisir les pages épinglées et les ordonner au calme,
// sans encombrer la sidebar. Ouverte depuis le bouton « Favoris » de la sidebar.
export default function FavoritesManager({ open, onClose }: { open: boolean; onClose: () => void }) {
  const favoritePages = useStore((s) => s.favoritePages);
  const favItems = favoritePages.map((to) => ALL_NAV_ITEMS.get(to)).filter((it): it is NonNullable<typeof it> => !!it);
  const [dragId, setDragId] = useState<string | null>(null);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-void-800 shadow-card"
          >
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
              <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-white">
                <DofusIcon name="starFilled" size={18} className="text-glow-gold" /> Gérer les favoris
              </h2>
              <button onClick={onClose} className="no-drag rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid flex-1 gap-4 overflow-y-auto p-5 md:grid-cols-2">
              {/* Colonne 1 : favoris actuels, ordonnables */}
              <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Mes favoris ({favItems.length})
                </p>
                {favItems.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-slate-500">
                    Aucun favori. Ajoute des pages depuis la liste à droite, puis glisse-les pour les ordonner.
                  </p>
                ) : (
                  <>
                    <p className="mb-2 text-[11px] text-slate-500">Glisse pour réordonner.</p>
                    <div className="space-y-1.5">
                      {favItems.map((item) => (
                        <div
                          key={item.to}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.effectAllowed = "move";
                            setDragId(item.to);
                          }}
                          onDragEnd={() => setDragId(null)}
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (!dragId || dragId === item.to) return;
                            const next = reorder(favoritePages, dragId, item.to);
                            if (next !== favoritePages) actions.setFavoritePages(next);
                          }}
                          onDrop={(e) => e.preventDefault()}
                          className={`flex cursor-grab items-center gap-2 rounded-xl border p-2 transition active:cursor-grabbing ${
                            dragId === item.to ? "border-glow-purple/40 bg-glow-purple/10 opacity-60" : "border-white/5 bg-void-900/50"
                          }`}
                        >
                          <span className="text-slate-600">
                            <GripDots />
                          </span>
                          <DofusIcon name={item.dofus} size={16} className="shrink-0 opacity-80" />
                          <span className="min-w-0 flex-1 truncate text-sm text-slate-200">{item.label}</span>
                          <button
                            draggable={false}
                            onClick={() => actions.toggleFavoritePage(item.to)}
                            title="Retirer des favoris"
                            className="no-drag rounded-md p-1 text-slate-400 transition hover:bg-glow-rose/15 hover:text-glow-rose"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Colonne 2 : toutes les pages, à épingler/désépingler */}
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Toutes les pages</p>
                <div className="space-y-3">
                  {NAV_GROUPS.filter((g) => g.title).map((g) => (
                    <div key={g.title}>
                      <p className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">{g.title}</p>
                      <div className="space-y-1">
                        {g.items.map((item) => {
                          const fav = favoritePages.includes(item.to);
                          return (
                            <button
                              key={item.to}
                              onClick={() => actions.toggleFavoritePage(item.to)}
                              className={`no-drag flex w-full items-center gap-2 rounded-lg border px-2 py-1.5 text-sm transition ${
                                fav
                                  ? "border-glow-gold/30 bg-glow-gold/10 text-white"
                                  : "border-white/5 bg-void-900/40 text-slate-300 hover:bg-white/[0.06]"
                              }`}
                            >
                              <DofusIcon name={item.dofus} size={15} className="shrink-0 opacity-80" />
                              <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
                              <DofusIcon
                                name={fav ? "starFilled" : "starEmpty"}
                                size={14}
                                className={fav ? "text-glow-gold" : "text-slate-500"}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-white/5 px-5 py-3">
              <button
                onClick={onClose}
                className="no-drag rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              >
                Terminé
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
