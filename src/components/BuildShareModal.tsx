import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X, Copy, Check, Upload } from "./DofusIcons";
import type { Build } from "../store/store";
import { encodeBuild, buildShareLink } from "../lib/buildCode";

// Modale d'export : transforme le build courant en code partageable + lien profond, avec copie
// presse-papier. Portail sur <body> (comme AuthModal) car la page porte des backdrop-filter.
export default function BuildShareModal({ build, onClose }: { build: Build; onClose: () => void }) {
  const code = useMemo(() => encodeBuild(build), [build]);
  const link = useMemo(() => buildShareLink(code), [code]);
  const [copied, setCopied] = useState<"" | "code" | "link">("");
  const codeRef = useRef<HTMLTextAreaElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function copy(text: string, which: "code" | "link", el: HTMLTextAreaElement | HTMLInputElement | null) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      window.setTimeout(() => setCopied(""), 1200);
    } catch {
      // Repli : sélectionne le champ pour un ⌘/Ctrl+C manuel.
      el?.focus();
      el?.select();
    }
  }

  const copyBtn = "no-drag inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition";

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
      className="fixed inset-0 z-[90] flex items-start justify-center bg-black/70 p-6 pt-[11vh] backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="glass relative w-full max-w-[520px] overflow-hidden rounded-3xl p-6 ring-1 ring-white/10"
      >
        <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-[22rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-glow-purple/30 to-glow-cyan/20 opacity-50 blur-3xl" />

        <button
          onClick={onClose}
          aria-label="Fermer"
          className="no-drag absolute right-3 top-3 z-10 rounded-lg p-1.5 text-slate-500 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-white">
            <Upload className="h-5 w-5 text-glow-purple" /> Partager ce build
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Copiez le code et envoyez-le. La personne l'importe depuis <span className="text-slate-300">Builder → Importer un build</span>.
          </p>

          {/* Code */}
          <p className="mb-1.5 mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">Code du build</p>
          <div className="flex items-start gap-2">
            <textarea
              ref={codeRef}
              readOnly
              value={code}
              onFocus={(e) => e.currentTarget.select()}
              rows={3}
              className="no-drag no-scrollbar min-w-0 flex-1 resize-none break-all rounded-xl border border-white/10 bg-void-800/70 px-3 py-2 font-mono text-xs leading-relaxed text-slate-200 outline-none focus:border-glow-purple/50"
            />
            <button
              onClick={() => copy(code, "code", codeRef.current)}
              className={`${copyBtn} ${
                copied === "code"
                  ? "border-glow-emerald/40 bg-glow-emerald/15 text-glow-emerald"
                  : "border-glow-purple/40 bg-glow-purple/20 text-white hover:bg-glow-purple/30"
              }`}
            >
              {copied === "code" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied === "code" ? "Copié" : "Copier"}
            </button>
          </div>

          {/* Lien profond */}
          <p className="mb-1.5 mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Lien (ouvre l'app)</p>
          <div className="flex items-center gap-2">
            <input
              ref={linkRef}
              readOnly
              value={link}
              onFocus={(e) => e.currentTarget.select()}
              className="no-drag min-w-0 flex-1 truncate rounded-xl border border-white/10 bg-void-800/70 px-3 py-2 font-mono text-xs text-slate-300 outline-none focus:border-glow-purple/50"
            />
            <button
              onClick={() => copy(link, "link", linkRef.current)}
              className={`${copyBtn} ${
                copied === "link"
                  ? "border-glow-emerald/40 bg-glow-emerald/15 text-glow-emerald"
                  : "border-white/15 bg-white/5 text-slate-200 hover:bg-white/10"
              }`}
            >
              {copied === "link" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied === "link" ? "Copié" : "Copier"}
            </button>
          </div>
          <p className="mt-3 text-xs leading-snug text-slate-500">
            Le code est autonome : il contient la classe, le niveau, l'équipement, la forgemagie et la
            cible. Aucune donnée n'est envoyée sur un serveur.
          </p>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
