import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X } from "./DofusIcons";
import AccountForm from "./AccountForm";

// Modale « Compte » ouverte depuis la sidebar. Rendue via portail sur <body> car la sidebar
// porte un backdrop-filter → un position:fixed y serait piégé dans son bloc englobant.
export default function AuthModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

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
        className="glass relative w-full max-w-[400px] overflow-hidden rounded-3xl p-6 ring-1 ring-white/10"
      >
        {/* halo décoratif */}
        <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-[22rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-glow-purple/30 to-glow-cyan/20 opacity-50 blur-3xl" />

        <button
          onClick={onClose}
          aria-label="Fermer"
          className="no-drag absolute right-3 top-3 z-10 rounded-lg p-1.5 text-slate-500 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative">
          <AccountForm onDone={onClose} />
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
