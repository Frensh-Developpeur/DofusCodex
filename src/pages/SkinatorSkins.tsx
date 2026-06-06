import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "../components/DofusIcons";
import DofusIcon from "../components/DofusIcon";
import { useStore, actions, type BarbofusSkin } from "../store/store";
import { skinatorEngine } from "../store/skinatorEngine";

export default function SkinatorSkins() {
  const skins = useStore((s) => s.barbofusSkins);
  const navigate = useNavigate();

  const loadSkin = (skin: BarbofusSkin) => {
    skinatorEngine.requestLoadSkin(skin.url);
    navigate("/skinator");
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-glow-purple/40 to-glow-cyan/25 text-white shadow-glow">
              <DofusIcon name="glyph" size={20} />
            </span>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">Mes Skins</h1>
          </div>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Tes skins Barbofus sauvegardés. Clique pour les rouvrir dans le moteur. Pour en
            ajouter, ouvre un skin dans le <span className="text-glow-violet">Skinator</span> et
            utilise « Sauvegarder ».
          </p>
        </div>
        <button
          onClick={() => navigate("/skinator")}
          className="no-drag inline-flex items-center gap-2 rounded-xl border border-glow-purple/40 bg-glow-purple/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-glow-purple/30"
        >
          <DofusIcon name="ajouterEtat" size={16} tint="#04ff2d" /> Ouvrir le Skinator
        </button>
      </header>

      {skins.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center gap-4 rounded-2xl px-6 py-16 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/[0.04] text-slate-500">
            <DofusIcon name="glyph" size={28} />
          </span>
          <div>
            <p className="font-display text-lg font-bold text-white">Aucun skin sauvegardé</p>
            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
              Va dans le Skinator, ouvre le moteur et compose un skin. Une fois ton lien généré
              sur Barbofus, clique « Sauvegarder » — il apparaîtra ici.
            </p>
          </div>
          <button
            onClick={() => navigate("/skinator")}
            className="no-drag inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            <DofusIcon name="character" size={16} /> Aller au Skinator
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {skins.map((skin, i) => (
              <SkinCard key={skin.id} skin={skin} index={i} onLoad={() => loadSkin(skin)} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function SkinCard({ skin, index, onLoad }: { skin: BarbofusSkin; index: number; onLoad: () => void }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(skin.name);

  const commit = () => {
    actions.renameBarbofusSkin(skin.id, name);
    setEditing(false);
  };
  const cancel = () => {
    setName(skin.name);
    setEditing(false);
  };

  // Carte alignée sur le langage visuel du Builder : rendu du skin en fond plein cadre, dégradé
  // bas, nom + date superposés, actions révélées au survol (slide-up). Pas de mix-blend (le fond
  // sombre de la capture se fond déjà dans le fond sombre de la carte).
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{
        layout: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
        delay: Math.min(index * 0.04, 0.3),
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -5 }}
      className="group relative h-60 overflow-hidden rounded-2xl border border-white/10 bg-void-900 ring-1 ring-white/[0.03] transition-colors duration-300 hover:border-glow-purple/45"
    >
      {/* Rendu du skin en fond */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 78% 72% at 50% 40%, rgba(124,92,255,.20), rgba(34,211,238,.06) 52%, transparent 76%), #0a0d18",
        }}
      >
        {skin.thumb ? (
          <img
            src={skin.thumb}
            alt={skin.name}
            className="mx-auto h-full w-auto max-w-full object-contain transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <span className="grid h-full w-full place-items-center text-slate-700">
            <DofusIcon name="character" size={56} className="opacity-50" />
          </span>
        )}
      </div>

      {/* Halo violet doux au survol */}
      <div className="pointer-events-none absolute inset-0 bg-glow-purple/0 transition-colors duration-300 group-hover:bg-glow-purple/10" />

      {/* Dégradé bas pour lisibilité du nom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-void-900 via-void-900/70 to-transparent" />

      {/* Badge #id */}
      {skin.skinId && (
        <span className="pointer-events-none absolute right-3 top-3 rounded-md bg-black/55 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-200 backdrop-blur">
          #{skin.skinId}
        </span>
      )}

      {/* Nom + date en bas — glissent vers le haut au survol pour laisser place aux actions */}
      {!editing && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4 transition-transform duration-300 ease-out group-hover:-translate-y-[60px]">
          <p className="truncate font-display text-lg font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {skin.name}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            Sauvegardé le {new Date(skin.createdAt).toLocaleDateString("fr-FR")}
          </p>
        </div>
      )}

      {/* Barre d'actions — apparaît en glissant depuis le bas au survol */}
      {!editing && (
        <div className="absolute inset-x-0 bottom-0 z-20 flex translate-y-3 items-center gap-1.5 p-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={onLoad}
            className="no-drag inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-glow-purple/45 bg-glow-purple/25 px-3 py-2 text-sm font-bold text-white shadow-glow transition hover:bg-glow-purple/40"
          >
            <DofusIcon name="character" size={16} /> Charger
          </button>
          <button
            onClick={() => setEditing(true)}
            className="no-drag inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-slate-200 backdrop-blur transition hover:bg-white/20"
          >
            Renommer
          </button>
          <button
            onClick={() => actions.deleteBarbofusSkin(skin.id)}
            title="Supprimer"
            className="no-drag inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 p-2 backdrop-blur transition hover:border-glow-rose/40 hover:bg-glow-rose/15"
          >
            <DofusIcon name="closeRed" size={16} />
          </button>
        </div>
      )}

      {/* Édition du nom — overlay dédié */}
      {editing && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-void-900/90 p-4 backdrop-blur-sm">
          <div className="w-full">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit();
                if (e.key === "Escape") cancel();
              }}
              className="no-drag w-full rounded-lg border border-glow-purple/50 bg-void-900/80 px-2.5 py-2 text-sm font-bold text-white outline-none"
            />
            <div className="mt-2 flex justify-end gap-1.5">
              <button
                onClick={commit}
                className="no-drag inline-flex items-center gap-1 rounded-lg bg-glow-emerald/15 px-2.5 py-1.5 text-xs font-semibold text-glow-emerald transition hover:bg-glow-emerald/25"
              >
                <Check className="h-4 w-4" /> Valider
              </button>
              <button
                onClick={cancel}
                className="no-drag inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-glow-rose/15 hover:text-glow-rose"
              >
                <DofusIcon name="closeRed" size={16} /> Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
