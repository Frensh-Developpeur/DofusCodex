import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { WifiOff, RefreshCw, Check } from "./DofusIcons";
import { dismissSplash } from "../lib/splash";
import AppLoader from "./AppLoader";

// On sonde une API dont l'app dépend de toute façon (DofusDude, déjà autorisée en CSP et
// CORS). On ne lit pas le corps : seul le fait que la requête aboutisse (online) ou échoue
// (offline) compte. no-store force un vrai aller-retour réseau.
const PROBE_URL = "https://api.dofusdu.de/dofus3/v1/fr/almanax/2024-01-01";
const PROBE_TIMEOUT_MS = 6000;
const RETRY_EVERY_MS = 5000;

// Fond dégradé identique au splash de démarrage (index.html) → continuité visuelle parfaite.
const BACKDROP =
  "radial-gradient(120% 90% at 50% 18%, rgb(var(--c-purple)/0.16), transparent 60%)," +
  "radial-gradient(90% 70% at 50% 100%, rgb(var(--c-cyan)/0.1), transparent 55%)," +
  "#070912";

async function probeConnection(): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return false;
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), PROBE_TIMEOUT_MS);
  const probe = fetch(PROBE_URL, { cache: "no-store", signal: ctrl.signal })
    .then(() => true)
    .catch(() => false)
    .finally(() => window.clearTimeout(timer));
  // Garde-fou anti-blocage : on tranche dans tous les cas, même si le fetch ne se règle
  // jamais (évite un écran de chargement éternel). Verdict "offline" → l'utilisateur peut
  // réessayer, et l'auto-reconnexion prend le relais.
  const guard = new Promise<boolean>((resolve) =>
    window.setTimeout(() => resolve(false), PROBE_TIMEOUT_MS + 500),
  );
  return Promise.race([probe, guard]);
}

type Status = "checking" | "online" | "offline";

// Sonde la connexion au démarrage, mais ne bloque plus l'app hors-ligne : le cache API
// IndexedDB peut maintenant répondre pour les données déjà consultées.
export default function ConnectionGate({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>("checking");
  const [retrying, setRetrying] = useState(false);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const runProbe = useCallback(async () => {
    setRetrying(true);
    const ok = await probeConnection();
    if (!alive.current) return;
    setRetrying(false);
    setStatus(ok ? "online" : "offline");
  }, []);

  // Test initial. On retire le splash HTML DÈS LE MONTAGE (pas dans le callback du probe) :
  // notre <AppLoader/> React prend le relais avec le même visuel, donc le splash ne peut plus
  // rester bloqué si le probe traîne. Le verdict ne fait ensuite que basculer le status.
  useEffect(() => {
    dismissSplash();
    let active = true;
    probeConnection().then((ok) => {
      if (active) setStatus(ok ? "online" : "offline");
    });
    return () => {
      active = false;
    };
  }, []);

  // Auto-reconnexion : seulement pendant l'écran offline (ne perturbe jamais une app déjà
  // ouverte). On re-sonde quand l'OS repasse "online" + une tentative douce périodique.
  useEffect(() => {
    if (status !== "offline") return;
    const onOnline = () => runProbe();
    window.addEventListener("online", onOnline);
    const iv = window.setInterval(() => {
      if (!retrying) runProbe();
    }, RETRY_EVERY_MS);
    return () => {
      window.removeEventListener("online", onOnline);
      window.clearInterval(iv);
    };
  }, [status, retrying, runProbe]);

  if (status === "online") return <>{children}</>;

  if (status === "offline") {
    return (
      <>
        {children}
        <OfflineBanner onRetry={runProbe} retrying={retrying} />
      </>
    );
  }

  // checking : notre loader, identique au splash de démarrage (transition invisible).
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: BACKDROP }}
    >
      <AppLoader />
    </div>
  );
}

function OfflineBanner({ onRetry, retrying }: { onRetry: () => void; retrying: boolean }) {
  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[90] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-glow-gold/30 bg-void-900/95 px-4 py-3 shadow-card backdrop-blur"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-glow-gold/15 text-glow-gold ring-1 ring-glow-gold/30">
          <WifiOff className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">Mode hors-ligne</p>
          <p className="text-xs leading-snug text-slate-400">
            Les données déjà consultées restent disponibles depuis le cache local.
          </p>
        </div>
        <button
          onClick={onRetry}
          disabled={retrying}
          className="no-drag inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.09] disabled:opacity-60"
        >
          {retrying ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
          {retrying ? "Test…" : "Retester"}
        </button>
      </motion.div>
    </div>
  );
}
