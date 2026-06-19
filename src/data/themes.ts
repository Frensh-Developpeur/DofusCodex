// Thèmes de couleur de l'app. Chaque thème ne change que les 3 accents de marque
// (purple/violet/cyan) ; les valeurs réelles vivent en CSS (src/index.css : [data-theme="id"]).
// Ici on ne garde que l'id (= valeur de data-theme sur <html>), le libellé et 3 hex pour
// l'aperçu (pastilles du sélecteur). « void » = thème par défaut (aucun override CSS requis).

export interface Theme {
  id: string;
  label: string;
  swatch: [string, string, string]; // primary, primaryLight, secondary — pour l'aperçu
}

export const THEMES: Theme[] = [
  { id: "void", label: "Améthyste", swatch: ["#7c5cff", "#9d7bff", "#22d3ee"] },
  { id: "emerald", label: "Émeraude", swatch: ["#10b981", "#34d399", "#2dd4bf"] },
  { id: "ocean", label: "Océan", swatch: ["#3b82f6", "#60a5fa", "#22d3ee"] },
  { id: "ruby", label: "Rubis", swatch: ["#f43f5e", "#fb7185", "#fb923c"] },
  { id: "amber", label: "Ambre", swatch: ["#f59e0b", "#fbbf24", "#fb7185"] },
  { id: "rose", label: "Magenta", swatch: ["#ec4899", "#f472b6", "#a855f7"] },
  { id: "lime", label: "Citron vert", swatch: ["#84cc16", "#a3e635", "#facc15"] },
  { id: "teal", label: "Turquoise", swatch: ["#14b8a6", "#2dd4bf", "#22d3ee"] },
  { id: "indigo", label: "Indigo", swatch: ["#4f46e5", "#6366f1", "#38bdf8"] },
  { id: "crimson", label: "Écarlate", swatch: ["#dc2626", "#f87171", "#f97316"] },
  { id: "slate", label: "Ardoise", swatch: ["#64748b", "#94a3b8", "#38bdf8"] },
];

export const DEFAULT_THEME = "void";

export function isTheme(id: string | undefined | null): boolean {
  return !!id && THEMES.some((t) => t.id === id);
}
