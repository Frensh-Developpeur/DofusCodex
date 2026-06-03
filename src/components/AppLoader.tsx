// Loader DofusCodex réutilisable — mêmes visuels que le splash de démarrage (index.html).
// Les styles vivent dans index.css (classes .al-*). Utilisé p.ex. en overlay pendant le
// chargement du webview Barbofus.
export default function AppLoader({ label = "Chargement du codex…" }: { label?: string }) {
  return (
    <div className="al-stack" role="status" aria-label={label}>
      <div className="al-emblem">
        <div className="al-ring" />
        <svg
          className="al-hex"
          viewBox="0 0 24 24"
          fill="rgba(124,92,255,0.25)"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
      </div>
      <div className="al-word">
        Dofus<span>Codex</span>
      </div>
      <div className="al-bar" />
      <div className="al-sub">{label}</div>
    </div>
  );
}
