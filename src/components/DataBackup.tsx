import { useRef, useState } from "react";
import { Download, Upload, Check } from "lucide-react";
import { actions } from "../store/store";

// Sauvegarde locale des données utilisateur (favoris, progression, builds, skins…) :
// export en .json et restauration. Filet de sécurité en plus de la persistance auto.
export default function DataBackup() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [done, setDone] = useState(false);

  const exportData = () => {
    const blob = new Blob([actions.exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dofuscodex-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDone(true);
    window.setTimeout(() => setDone(false), 1800);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // permet de ré-importer le même fichier
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (actions.importData(String(reader.result))) {
        window.location.reload(); // recharge pour appliquer partout
      } else {
        alert("Fichier de sauvegarde invalide.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="mt-2 grid grid-cols-2 gap-2">
      <button
        onClick={exportData}
        title="Exporter mes données (sauvegarde .json)"
        className="no-drag inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-2 py-2 text-xs font-semibold text-slate-400 transition hover:border-glow-emerald/30 hover:bg-glow-emerald/10 hover:text-glow-emerald"
      >
        {done ? <Check className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
        {done ? "Exporté" : "Exporter"}
      </button>
      <button
        onClick={() => fileRef.current?.click()}
        title="Importer une sauvegarde .json"
        className="no-drag inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-2 py-2 text-xs font-semibold text-slate-400 transition hover:border-glow-cyan/30 hover:bg-glow-cyan/10 hover:text-glow-cyan"
      >
        <Upload className="h-3.5 w-3.5" /> Importer
      </button>
      <input ref={fileRef} type="file" accept="application/json,.json" onChange={importData} className="hidden" />
    </div>
  );
}
