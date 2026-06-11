import { useEffect, useState } from "react";

// Questions secrètes proposées (+ « Autre » pour une question personnalisée).
export const SECRET_QUESTIONS = [
  "Le nom de ton premier familier ?",
  "Le nom de ton personnage principal ?",
  "Ta classe préférée sur Dofus ?",
  "Ta ville de naissance ?",
  "Le prénom de ton meilleur ami d'enfance ?",
  "Le nom de ton tout premier serveur ?",
];

const CUSTOM_QUESTION = "__custom__";

// Sélecteur de question secrète : liste déroulante + champ libre via « Autre ». Remonte la
// question effective (string) au parent. Réutilisé à l'inscription, dans la gestion du compte
// et dans la modale qui force le choix.
export default function SecretQuestionPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (q: string) => void;
}) {
  const startsCustom = value !== "" && !SECRET_QUESTIONS.includes(value);
  const [choice, setChoice] = useState(startsCustom ? CUSTOM_QUESTION : value || SECRET_QUESTIONS[0]);
  const [custom, setCustom] = useState(startsCustom ? value : "");

  // Remonte la question effective au parent dès qu'un champ change (et au montage).
  useEffect(() => {
    onChange(choice === CUSTOM_QUESTION ? custom.trim() : choice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choice, custom]);

  return (
    <div className="space-y-2">
      <label className="block">
        <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Question secrète</span>
        <select
          value={choice}
          onChange={(e) => setChoice(e.target.value)}
          className="no-drag w-full rounded-xl border border-white/10 bg-void-900/60 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-glow-purple/60 focus:ring-2 focus:ring-glow-purple/25"
        >
          {SECRET_QUESTIONS.map((q) => (
            <option key={q} value={q} className="bg-void-900 text-slate-100">
              {q}
            </option>
          ))}
          <option value={CUSTOM_QUESTION} className="bg-void-900 text-slate-100">
            Autre (personnalisée)…
          </option>
        </select>
      </label>
      {choice === CUSTOM_QUESTION && (
        <input
          type="text"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Écris ta propre question"
          className="no-drag w-full rounded-xl border border-white/10 bg-void-900/60 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-glow-purple/60 focus:ring-2 focus:ring-glow-purple/25"
        />
      )}
    </div>
  );
}
