import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Check, dofusUiIcon } from "../components/DofusIcons";
import DofusIcon from "../components/DofusIcon";
import { useStore, actions } from "../store/store";
import { getSyncState, type SyncState } from "../lib/guideStore";
import { SectionHeader, fadeUp } from "../components/ui";
import ClearCacheButton from "../components/ClearCacheButton";
import { ThemePicker } from "../components/ThemePicker";
import { openUpdateLauncher } from "../components/UpdateBanner";

// Sources de données live (sans clé API) — affichées à titre informatif.
const SOURCES = [
  { name: "DofusDude", desc: "Objets, équipements, panoplies, almanax", url: "https://github.com/dofusdude" },
  { name: "DofusDB", desc: "Donjons, monstres, drops, quêtes, classes, chasse", url: "https://dofusdb.fr" },
  { name: "Ganymède", desc: "Guides communautaires", url: "https://ganymede-app.com" },
  { name: "Barbofus", desc: "Rendu de skins (Skinator)", url: "https://barbofus.com" },
];

const DungeonStatIcon = dofusUiIcon("dungeon");
const FavoriteStatIcon = dofusUiIcon("etoile");
const QuestStatIcon = dofusUiIcon("success");
const BuildStatIcon = dofusUiIcon("characteristic");
const SkinStatIcon = dofusUiIcon("character");
const GuideStatIcon = dofusUiIcon("book");

function platformLabel(p?: string): string {
  if (p === "darwin") return "macOS";
  if (p === "win32") return "Windows";
  if (p === "linux") return "Linux";
  return "—";
}

export default function Settings() {
  const [version, setVersion] = useState<string>("");
  const [platform, setPlatform] = useState<string>("");
  const [sync, setSync] = useState<SyncState | null>(null);

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

  const stats = [
    { icon: FavoriteStatIcon, label: "Donjons favoris", value: favoriteDungeons, tone: "text-glow-rose" },
    { icon: DungeonStatIcon, label: "Donjons terminés", value: doneDungeons, tone: "text-glow-violet" },
    { icon: QuestStatIcon, label: "Quêtes terminées", value: doneQuests, tone: "text-glow-emerald" },
    { icon: BuildStatIcon, label: "Builds enregistrés", value: builds, tone: "text-glow-gold" },
    { icon: SkinStatIcon, label: "Skins sauvegardés", value: skinDesigns + barbofusSkins, tone: "text-glow-cyan" },
    { icon: GuideStatIcon, label: "Guides suivis / favoris", value: doneGuides + favoriteGuides, tone: "text-glow-violet" },
  ];

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" className="pb-12">
      <SectionHeader
        eyebrow="Configuration"
        title="Paramètres"
        subtitle="Version de l'app, sources de données et gestion de tes données locales."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Apparence / thème */}
        <section className="glass rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <DofusIcon name="glyph" size={20} />
            <h2 className="font-display text-lg font-bold text-white">Apparence</h2>
          </div>
          <p className="mt-2 mb-4 text-sm leading-relaxed text-slate-400">
            Choisis le thème de couleur de l'app. Accessible aussi rapidement depuis le bouton{" "}
            <span className="text-slate-300">Thème</span> en bas de la barre latérale.
          </p>
          <ThemePicker />
        </section>

        {/* À propos / mises à jour */}
        <section className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2.5">
            <DofusIcon name="info" size={20} />
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
            onClick={openUpdateLauncher}
            className="no-drag mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-glow-purple/40 bg-glow-purple/15 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-glow-purple/25 disabled:opacity-60"
          >
            <DofusIcon name="download" size={16} />
            Ouvrir le launcher de mise à jour
          </button>

          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            DofusCodex vérifie automatiquement les mises à jour au lancement, toutes les 30&nbsp;min
            et au retour sur la fenêtre. Le launcher gère la vérification, les notes de version, le
            téléchargement et l'installation.
          </p>
        </section>

        {/* Sources de données */}
        <section className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2.5">
            <DofusIcon name="world" size={20} />
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
                    target="_blank"
                    rel="noreferrer"
                    className="no-drag inline-flex items-center gap-1 text-xs text-slate-500 transition hover:text-slate-300"
                  >
                    <DofusIcon name="world" size={14} /> Source
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
            <DofusIcon name="inventory" size={20} />
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
                <DofusIcon name="book" size={16} />
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
        {done ? <Check className="h-4 w-4" /> : <DofusIcon name="bank" size={16} />}
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
