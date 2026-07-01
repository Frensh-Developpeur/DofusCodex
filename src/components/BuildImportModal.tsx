import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { X, Download, AlertTriangle } from "./DofusIcons";
import { listBreeds } from "../api/dofusdb";
import { actions, useStore } from "../store/store";
import { decodeBuild } from "../lib/buildCode";

// Modale d'import, PARTAGÉE par les deux entrées : le bouton « Importer » de la galerie
// (code vide → mode collage) et le lien profond `dofuscodex://build/<code>` (code pré-rempli).
// Pilotée par le drapeau `buildImport` du store (calqué sur account.recovery → RecoveryModal).
// Montée une fois dans App, à l'intérieur du Router → accès à useNavigate.
export default function BuildImportModal() {
  const pending = useStore((s) => s.buildImport);
  if (!pending) return null;
  // key = code : un nouveau lien profond remonte le corps avec un état propre.
  return <ImportBody key={pending.code} initialCode={pending.code} />;
}

function ImportBody({ initialCode }: { initialCode: string }) {
  const navigate = useNavigate();
  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState("");
  const { data: breeds } = useQuery({
    queryKey: ["breeds"],
    queryFn: ({ signal }) => listBreeds(signal),
    staleTime: Infinity,
  });

  const close = () => actions.closeBuildImport();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const decoded = useMemo(() => (code.trim() ? decodeBuild(code) : null), [code]);
  const draft = decoded?.ok ? decoded.draft : null;
  const breed = draft?.breedId != null ? breeds?.find((b) => b.id === draft.breedId) : undefined;
  const itemCount = draft ? Object.keys(draft.slots).length : 0;

  function doImport() {
    const res = actions.importBuildFromCode(code);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    close();
    navigate(`/builder/${res.id}`);
  }

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={close}
      className="fixed inset-0 z-[90] flex items-start justify-center bg-black/70 p-6 pt-[11vh] backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="glass relative w-full max-w-[520px] overflow-hidden rounded-3xl p-6 ring-1 ring-white/10"
      >
        <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-[22rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-glow-cyan/30 to-glow-purple/20 opacity-50 blur-3xl" />

        <button
          onClick={close}
          aria-label="Fermer"
          className="no-drag absolute right-3 top-3 z-10 rounded-lg p-1.5 text-slate-500 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-white">
            <Download className="h-5 w-5 text-glow-cyan" /> Importer un build
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Collez un code de build (ou un lien <span className="font-mono text-xs text-slate-300">dofuscodex://build/…</span>) partagé par un autre joueur.
          </p>

          <textarea
            autoFocus
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError("");
            }}
            placeholder="DCB1.…"
            rows={3}
            className="no-drag no-scrollbar mt-4 w-full resize-none break-all rounded-xl border border-white/10 bg-void-800/70 px-3 py-2 font-mono text-xs leading-relaxed text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-glow-cyan/50"
          />

          {/* Aperçu / erreur */}
          <div className="mt-3 min-h-[3.25rem]">
            {draft ? (
              <div className="flex items-center gap-3 rounded-xl border border-glow-cyan/20 bg-glow-cyan/[0.06] p-3">
                {breed ? (
                  <img src={breed.img} alt="" className="h-10 w-10 shrink-0 object-contain" />
                ) : (
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/5 text-slate-500">?</span>
                )}
                <div className="min-w-0">
                  <p className="truncate font-display font-bold text-white">{draft.name || "Build importé"}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-400">
                    <span>{breed?.name.fr ?? (draft.breedId != null ? "Classe inconnue" : "Sans classe")}</span>
                    <span className="text-slate-600">·</span>
                    <span>niveau {draft.level ?? "?"}</span>
                    <span className="text-slate-600">·</span>
                    <span>{itemCount} équipé{itemCount > 1 ? "s" : ""}</span>
                  </p>
                </div>
              </div>
            ) : code.trim() ? (
              <p className="flex items-center gap-2 rounded-xl border border-glow-rose/25 bg-glow-rose/10 p-3 text-sm text-glow-rose">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {error || (decoded && !decoded.ok ? decoded.error : "Code invalide.")}
              </p>
            ) : (
              <p className="p-1 text-xs text-slate-500">L'aperçu (classe, niveau, équipement) s'affichera ici.</p>
            )}
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              onClick={close}
              className="no-drag rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10"
            >
              Annuler
            </button>
            <button
              onClick={doImport}
              disabled={!draft}
              className="no-drag inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-glow-cyan to-glow-purple px-4 py-2 font-display font-bold text-white shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:grayscale"
            >
              <Download className="h-4 w-4" /> Importer
            </button>
          </div>
          <p className="mt-3 text-xs leading-snug text-slate-500">
            Un <span className="text-slate-300">nouveau</span> build est créé — vos builds existants ne sont pas modifiés.
          </p>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
