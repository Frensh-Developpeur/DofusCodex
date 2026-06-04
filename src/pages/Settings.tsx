import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Upload,
  Check,
  RefreshCw,
  Loader2,
  Github,
  ShieldCheck,
  HardDrive,
  Database,
  Swords,
  BookOpen,
  Hammer,
  Palette,
  Heart,
  CheckCircle2,
} from "lucide-react";
import { useStore, actions } from "../store/store";
import { getSyncState, type SyncState } from "../lib/guideStore";
import { SectionHeader, fadeUp } from "../components/ui";
import ClearCacheButton from "../components/ClearCacheButton";

// Sources de données live (sans clé API) — affichées à titre informatif.
const SOURCES = [
  { name: "DofusDude", desc: "Objets, équipements, panoplies, almanax", url: "https://github.com/dofusdude" },
  { name: "DofusDB", desc: "Donjons, monstres, drops, quêtes, classes, chasse", url: "https://dofusdb.fr" },
  { name: "Ganymède", desc: "Guides communautaires", url: "https://ganymede-app.com" },
];

function platformLabel(p?: string): string {
  if (p === "darwin") return "macOS";
  if (p === "win32") return "Windows";
  if (p === "linux") return "Linux";
  return "—";
}

// Comparaison semver basique (x.y.z) → 1 si a > b, -1 si a < b, 0 sinon.
function cmpVersion(a: string, b: string): number {
  const pa = a.split(".").map((n) => parseInt(n, 10) || 0);
  const pb = b.split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d !== 0) return d > 0 ? 1 : -1;
  }
  return 0;
}

type CheckState =
  | { kind: "idle" }
  | { kind: "checking" }
  | { kind: "uptodate" }
  | { kind: "available"; version: string }
  | { kind: "unavailable" }
  | { kind: "error" };

export default function Settings() {
  const [version, setVersion] = useState<string>("");
  const [platform, setPlatform] = useState<string>("");
  const [sync, setSync] = useState<SyncState | null>(null);
  const [check, setCheck] = useState<CheckState>({ kind: "idle" });

  // Stats locales (sélecteurs primitifs → pas de boucle de rendu).
  const favoriteDungeons = useStore((s) => s.favoriteDungeons.length);
  const doneDungeons = useStore((s) => s.doneDungeons.length);
  const doneQuests = useStore((s) => s.doneQuests.length);
  const builds = useStore((s) => s.builds.length);
  const skinDesigns = useStore((s) => s.skinDesigns.length);
  const barbofusSkins = useStore((s) => s.barbofusSkins.length);
  const doneGuides = useStore((s) => s.doneGuides.length);
  const favoriteGuides = useStore((s) => s.favoriteGuides.length);

  useEffect(() => {
    window.dofusCodex?.getAppVersion?.().then(setVersion).catch(() => {});
    window.dofusCodex?.getPlatform?.().then(setPlatform).catch(() => {});
    getSyncState().then(setSync).catch(() => {});
  }, []);

  const runCheck = async () => {
    if (!window.dofusCodex?.checkUpdate) {
      setCheck({ kind: "unavailable" });
      return;
    }
    setCheck({ kind: "checking" });
    try {
      const r = await window.dofusCodex.checkUpdate();
      if (!r.ok) {
        setCheck({ kind: r.reason === "dev" ? "unavailable" : "error" });
        return;
      }
      if (r.latest && r.current && cmpVersion(r.latest, r.current) > 0) {
        setCheck({ kind: "available", version: r.latest });
      } else {
        setCheck({ kind: "uptodate" });
      }
    } catch {
      setCheck({ kind: "error" });
    }
  };

  const stats = [
    { icon: Heart, label: "Donjons favoris", value: favoriteDungeons, tone: "text-glow-rose" },
    { icon: Swords, label: "Donjons terminés", value: doneDungeons, tone: "text-glow-violet" },
    { icon: CheckCircle2, label: "Quêtes terminées", value: doneQuests, tone: "text-glow-emerald" },
    { icon: Hammer, label: "Builds enregistrés", value: builds, tone: "text-glow-gold" },
    { icon: Palette, label: "Skins sauvegardés", value: skinDesigns + barbofusSkins, tone: "text-glow-cyan" },
    { icon: BookOpen, label: "Guides suivis / favoris", value: doneGuides + favoriteGuides, tone: "text-glow-violet" },
  ];

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" className="pb-12">
      <SectionHeader
        eyebrow="Configuration"
        title="Paramètres"
        subtitle="Version de l'app, sources de données et gestion de tes données locales."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {/* À propos / mises à jour */}
        <section className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-glow-violet" />
            <h2 className="font-display text-lg font-bold text-white">À propos</h2>
          </div>

          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-slate-400">Version</dt>
              <dd className="font-semibold text-white">{version ? `v${version}` : "—"}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-400">Plateforme</dt>
              <dd className="font-semibold text-white">{platformLabel(platform)}</dd>
            </div>
          </dl>

          <button
            onClick={runCheck}
            disabled={check.kind === "checking"}
            className="no-drag mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-glow-purple/40 bg-glow-purple/15 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-glow-purple/25 disabled:opacity-60"
          >
            {check.kind === "checking" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Vérifier les mises à jour
          </button>

          {check.kind === "uptodate" && (
            <p className="mt-2.5 flex items-center gap-1.5 text-xs text-glow-emerald">
              <Check className="h-3.5 w-3.5" /> Tu utilises déjà la dernière version.
            </p>
          )}
          {check.kind === "available" && (
            <p className="mt-2.5 text-xs text-glow-gold">
              Version v{check.version} disponible — voir le bandeau en bas à droite.
            </p>
          )}
          {check.kind === "unavailable" && (
            <p className="mt-2.5 text-xs text-slate-500">
              Vérification disponible uniquement dans l'application installée.
            </p>
          )}
          {check.kind === "error" && (
            <p className="mt-2.5 text-xs text-glow-rose">Échec de la vérification. Réseau indisponible ?</p>
          )}

          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            DofusCodex vérifie automatiquement les mises à jour au lancement, toutes les 30&nbsp;min
            et au retour sur la fenêtre.
          </p>
        </section>

        {/* Sources de données */}
        <section className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2.5">
            <Database className="h-5 w-5 text-glow-cyan" />
            <h2 className="font-display text-lg font-bold text-white">Données live</h2>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Les données du jeu sont récupérées en temps réel depuis des API open-source,{" "}
            <span className="text-slate-300">sans clé API ni serveur à héberger</span>.
          </p>
          <ul className="mt-4 space-y-2.5">
            {SOURCES.map((s) => (
              <li key={s.name} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{s.name}</span>
                  <a
                    href={s.url}
                    className="no-drag inline-flex items-center gap-1 text-xs text-slate-500 transition hover:text-slate-300"
                  >
                    <Github className="h-3.5 w-3.5" /> Source
                  </a>
                </div>
                <p className="mt-0.5 text-xs text-slate-400">{s.desc}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Mes données locales */}
        <section className="glass rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <HardDrive className="h-5 w-5 text-glow-emerald" />
            <h2 className="font-display text-lg font-bold text-white">Mes données</h2>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Toutes tes données (favoris, progression, builds, skins, suivi des guides) sont stockées{" "}
            <span className="font-semibold text-slate-200">uniquement sur cet appareil</span>. Pense à
            exporter une sauvegarde avant de changer de machine.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {stats.map((st) => (
              <div key={st.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <div className="flex items-center gap-2">
                  <st.icon className={`h-4 w-4 ${st.tone}`} />
                  <span className="font-display text-xl font-extrabold text-white">{st.value}</span>
                </div>
                <p className="mt-0.5 text-[11px] leading-tight text-slate-400">{st.label}</p>
              </div>
            ))}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-glow-cyan" />
                <span className="font-display text-xl font-extrabold text-white">
                  {sync ? sync.storedCount : "—"}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] leading-tight text-slate-400">
                Guides téléchargés{sync && sync.totalFr ? ` / ${sync.totalFr}` : ""}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <BackupButtons />
          </div>
        </section>

        {/* Zone sensible */}
        <section className="rounded-2xl border border-glow-rose/20 bg-glow-rose/[0.04] p-5 lg:col-span-2">
          <h2 className="font-display text-lg font-bold text-white">Réinitialisation</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            Vider le cache supprime définitivement toutes tes données locales et les guides
            téléchargés, puis redémarre l'application. Cette action est irréversible.
          </p>
          <div className="mt-4 max-w-xs">
            <ClearCacheButton />
          </div>
        </section>
      </div>
    </motion.div>
  );
}

// Export / import de la sauvegarde locale (.json). Repris de l'ancien composant DataBackup,
// adapté à un rendu pleine largeur.
function BackupButtons() {
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
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (actions.importData(String(reader.result))) {
        window.location.reload();
      } else {
        alert("Fichier de sauvegarde invalide.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <button
        onClick={exportData}
        className="no-drag inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-glow-emerald/30 hover:bg-glow-emerald/10 hover:text-glow-emerald"
      >
        {done ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
        {done ? "Sauvegarde exportée" : "Exporter mes données"}
      </button>
      <button
        onClick={() => fileRef.current?.click()}
        className="no-drag inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-glow-cyan/30 hover:bg-glow-cyan/10 hover:text-glow-cyan"
      >
        <Upload className="h-4 w-4" /> Importer une sauvegarde
      </button>
      <input ref={fileRef} type="file" accept="application/json,.json" onChange={importData} className="hidden" />
    </>
  );
}
