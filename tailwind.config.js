/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Palette dark pilotée par variables CSS (format canaux « R G B » → l'opacité Tailwind
        // `/30` reste fonctionnelle via <alpha-value>). Valeurs par défaut + overrides par thème
        // dans src/index.css (:root et [data-theme="…"]). Registre des thèmes : src/data/themes.ts.
        void: {
          900: "rgb(var(--c-void-900) / <alpha-value>)",
          800: "rgb(var(--c-void-800) / <alpha-value>)",
          700: "rgb(var(--c-void-700) / <alpha-value>)",
          600: "rgb(var(--c-void-600) / <alpha-value>)",
          500: "rgb(var(--c-void-500) / <alpha-value>)",
        },
        glow: {
          purple: "rgb(var(--c-purple) / <alpha-value>)",
          violet: "rgb(var(--c-violet) / <alpha-value>)",
          cyan: "rgb(var(--c-cyan) / <alpha-value>)",
          gold: "rgb(var(--c-gold) / <alpha-value>)",
          ember: "rgb(var(--c-ember) / <alpha-value>)",
          rose: "rgb(var(--c-rose) / <alpha-value>)",
          emerald: "rgb(var(--c-emerald) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["Outfit", "Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgb(var(--c-purple) / 0.5)",
        "glow-cyan": "0 0 40px -10px rgb(var(--c-cyan) / 0.45)",
        card: "0 10px 40px -15px rgba(0,0,0,0.7)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(rgb(var(--c-purple) / 0.06) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--c-purple) / 0.06) 1px, transparent 1px)",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [],
};
