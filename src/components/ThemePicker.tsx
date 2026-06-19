import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { Check } from "./DofusIcons";
import { THEMES, type Theme } from "../data/themes";
import { useStore, actions } from "../store/store";

// Aperçu d'un thème : trois pastilles (primaire / clair / secondaire).
export function ThemeSwatch({ theme, size = 14 }: { theme: Theme; size?: number }) {
  return (
    <span className="inline-flex shrink-0 items-center -space-x-1">
      {theme.swatch.map((c, i) => (
        <span
          key={i}
          className="rounded-full ring-1 ring-black/40"
          style={{ background: c, width: size, height: size }}
        />
      ))}
    </span>
  );
}

// Grille de sélection (page Paramètres) : un bouton par thème, accent + nom, coche sur l'actif.
export function ThemePicker() {
  const current = useStore((s) => s.theme);
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {THEMES.map((t) => {
        const active = current === t.id;
        return (
          <button
            key={t.id}
            onClick={() => actions.setTheme(t.id)}
            className={clsx(
              "no-drag group relative flex items-center gap-2.5 rounded-xl border p-3 text-left transition",
              active
                ? "border-glow-purple/50 bg-glow-purple/10 shadow-glow"
                : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]",
            )}
          >
            <ThemeSwatch theme={t} size={16} />
            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-white">{t.label}</span>
            {active && (
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-glow-purple text-white">
                <Check className="h-3 w-3" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Bouton + popover compact pour le pied de la barre latérale : aperçu du thème courant,
// ouvre une liste rapide. Fermé au clic extérieur ou sur Échap.
export function ThemeMenu({ collapsed }: { collapsed: boolean }) {
  const current = useStore((s) => s.theme);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const currentTheme = THEMES.find((t) => t.id === current) ?? THEMES[0];

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        title="Thème de couleur"
        className={clsx(
          "no-drag group flex w-full items-center rounded-xl text-sm font-medium text-slate-400 transition-colors hover:text-slate-200",
          collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
        )}
      >
        <ThemeSwatch theme={currentTheme} size={collapsed ? 11 : 13} />
        {!collapsed && <span className="relative truncate">Thème</span>}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-full left-0 z-50 mb-2 w-52 overflow-hidden rounded-xl border border-white/10 bg-void-800/95 p-1.5 shadow-card backdrop-blur"
          >
            <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Thème de couleur
            </p>
            {THEMES.map((t) => {
              const active = current === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    actions.setTheme(t.id);
                    setOpen(false);
                  }}
                  className={clsx(
                    "no-drag flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition",
                    active ? "bg-glow-purple/15 text-white" : "text-slate-300 hover:bg-white/5",
                  )}
                >
                  <ThemeSwatch theme={t} size={13} />
                  <span className="min-w-0 flex-1 truncate text-left font-medium">{t.label}</span>
                  {active && <Check className="h-3.5 w-3.5 text-glow-violet" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
