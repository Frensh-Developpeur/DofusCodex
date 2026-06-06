import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { WifiOff, RefreshCw } from "./DofusIcons";
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
  "radial-gradient(120% 90% at 50% 18%, rgba(124, 92, 255, 0.16), transparent 60%)," +
  "radial-gradient(90% 70% at 50% 100%, rgba(34, 211, 238, 0.1), transparent 55%)," +
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

// Bloque le montage de l'app tant qu'on n'a pas confirmé une connexion. L'app étant 100%
// online (toutes les données viennent d'API), il n'y a rien à afficher sans réseau.
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

  if (status === "offline") return <OfflineScreen onRetry={runProbe} retrying={retrying} />;

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

function OfflineScreen({ onRetry, retrying }: { onRetry: () => void; retrying: boolean }) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-7 px-8 text-center"
      style={{ background: BACKDROP }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative grid h-28 w-28 place-items-center"
      >
        <span className="absolute inset-2 rounded-full bg-glow-purple/25 blur-2xl" />
        <WifiOff className="relative h-12 w-12 text-glow-violet drop-shadow-[0_0_12px_rgba(124,92,255,0.7)]" />
      </motion.div>

      <div className="space-y-2.5">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-white">
          Pas de connexion
        </h1>
        <p className="mx-auto max-w-sm text-sm leading-6 text-slate-400">
          DofusCodex n'arrive pas à joindre ses serveurs. Toutes ses données (donjons,
          équipements, guides…) viennent du net&nbsp;: vérifie ta connexion Internet, puis réessaie.
        </p>
      </div>

      <button
        onClick={onRetry}
        disabled={retrying}
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCw className={`h-4 w-4 ${retrying ? "animate-spin" : ""}`} />
        {retrying ? "Vérification…" : "Réessayer"}
      </button>
    </div>
  );
}
