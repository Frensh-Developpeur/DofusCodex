const api = window.dofusCodexLauncher;
const el = (id) => document.getElementById(id);

const fmtBytes = (value) => {
  if (!value || value <= 0) return "—";
  const units = ["o", "Ko", "Mo", "Go"];
  let n = value;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
};

const button = (label, action, primary) => {
  const b = document.createElement("button");
  b.className = `action${primary ? " primary" : ""}`;
  b.textContent = label;
  b.onclick = action;
  return b;
};

function setActions(actions) {
  const root = el("actions");
  root.innerHTML = "";
  actions.forEach((a) => root.appendChild(a));
}

function render(s) {
  const state = s && s.state ? s.state : "checking";
  const version = s && s.version ? `v${s.version}` : "—";
  const current = s && s.current ? `v${s.current}` : "—";
  const percent = Math.max(0, Math.min(100, Math.round(s && s.percent ? s.percent : 0)));
  const ready = state === "not-available" || state === "dev" || state === "unavailable";

  el("current").textContent = current;
  el("latest").textContent = version;
  el("percent").textContent = ready || state === "installing" ? "100%" : `${percent}%`;
  el("fill").style.width = `${ready || state === "installing" ? 100 : Math.max(8, percent)}%`;
  el("orb").className = "orb";
  el("symbol").textContent = "↻";
  setActions([]);

  if (state === "checking") {
    el("title").textContent = "Recherche de mise à jour";
    el("detail").textContent = "Le launcher vérifie GitHub Releases avant d'ouvrir DofusCodex.";
    el("phase").textContent = "Connexion";
  } else if (state === "available") {
    el("orb").className = "orb wait";
    el("symbol").textContent = "↓";
    el("title").textContent = "Mise à jour obligatoire";
    el("detail").textContent = s.isMac
      ? "Télécharge et installe la dernière version pour lancer DofusCodex."
      : "Nouvelle version trouvée. Le téléchargement va commencer automatiquement.";
    el("phase").textContent = s.isMac ? "Téléchargement manuel requis" : "En attente du téléchargement";
    if (s.isMac) setActions([button("Télécharger", () => api.openReleases(), true), button("Quitter", () => api.quit(), false)]);
  } else if (state === "downloading") {
    el("title").textContent = "Téléchargement de la mise à jour";
    el("detail").textContent = `${fmtBytes(s.transferred)} / ${fmtBytes(s.total)}${s.bytesPerSecond ? ` · ${fmtBytes(s.bytesPerSecond)}/s` : ""}`;
    el("phase").textContent = "Téléchargement";
  } else if (state === "downloaded") {
    el("orb").className = "orb done";
    el("symbol").textContent = "✓";
    el("title").textContent = "Mise à jour prête";
    el("detail").textContent = "Installation et redémarrage de DofusCodex.";
    el("phase").textContent = "Installation";
  } else if (state === "installing") {
    el("title").textContent = "Installation en cours";
    el("detail").textContent = "DofusCodex va redémarrer automatiquement.";
    el("phase").textContent = "Installation";
  } else if (ready) {
    el("orb").className = "orb done";
    el("symbol").textContent = "✓";
    el("title").textContent = "DofusCodex est prêt";
    el("detail").textContent = state === "dev"
      ? "Mode développement : le launcher est prêt à ouvrir l'app."
      : "Aucune mise à jour obligatoire. Tu peux ouvrir l'app.";
    el("phase").textContent = "Prêt";
    setActions([button("Démarrer", () => api.continueToApp(), true), button("Quitter", () => api.quit(), false)]);
  } else {
    el("orb").className = "orb error";
    el("symbol").textContent = "!";
    el("title").textContent = "Vérification impossible";
    el("detail").textContent = s.error || "Le launcher n'a pas pu vérifier les mises à jour.";
    el("phase").textContent = "Erreur";
    setActions([button("Réessayer", () => api.retry(), true), button("Lancer quand même", () => api.continueToApp(), false)]);
  }
}

if (!api) {
  render({ state: "error", error: "Le bridge du launcher n'a pas démarré." });
} else {
  api.onState(render);
  api.ready();
  window.setTimeout(() => {
    if (el("phase").textContent === "Initialisation") {
      render({ state: "error", error: "Le launcher ne reçoit pas l'état de mise à jour." });
    }
  }, 8000);
  el("quit").onclick = () => api.quit();
}
