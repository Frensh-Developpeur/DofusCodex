// Retrait du splash de démarrage (#app-loader, défini dans index.html) en fondu.
// Min 600 ms pour éviter un flash si le boot est très rapide. Idempotent : appelable
// plusieurs fois sans effet (le ConnectionGate le déclenche une fois le test de connexion fini).
const SPLASH_MIN_MS = 600;
const splashStart = performance.now();
let dismissed = false;

export function dismissSplash() {
  if (dismissed) return;
  dismissed = true;
  const el = document.getElementById("app-loader");
  if (!el) return;
  const wait = Math.max(0, SPLASH_MIN_MS - (performance.now() - splashStart));
  window.setTimeout(() => {
    el.classList.add("app-loader--done");
    el.addEventListener("transitionend", () => el.remove(), { once: true });
    window.setTimeout(() => el.remove(), 800); // filet de sécurité si transitionend ne tire pas
  }, wait);
}
