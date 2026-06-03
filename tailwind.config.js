/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Deep, "next-gen" dark palette
        void: {
          900: "#070912",
          800: "#0b0f1e",
          700: "#121829",
          600: "#1a2238",
          500: "#232c47",
        },
        glow: {
          purple: "#7c5cff",
          violet: "#9d7bff",
          cyan: "#22d3ee",
          gold: "#f5c451",
          ember: "#ff7849",
          rose: "#ff5d8f",
          emerald: "#34d399",
        },
      },
      fontFamily: {
        display: ["Outfit", "Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(124, 92, 255, 0.5)",
        "glow-cyan": "0 0 40px -10px rgba(34, 211, 238, 0.45)",
        card: "0 10px 40px -15px rgba(0,0,0,0.7)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(rgba(124,92,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,255,0.06) 1px, transparent 1px)",
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
