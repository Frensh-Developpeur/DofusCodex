import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Palette, WandSparkles, Trash2, ExternalLink, Pencil, Check, X, Plus } from "lucide-react";
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
              <Palette className="h-5 w-5" />
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
          <Plus className="h-4 w-4" /> Ouvrir le Skinator
        </button>
      </header>

      {skins.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center gap-4 rounded-2xl px-6 py-16 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/[0.04] text-slate-500">
            <WandSparkles className="h-7 w-7" />
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
            <Palette className="h-4 w-4" /> Aller au Skinator
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="glass glass-hover flex flex-col gap-3 rounded-2xl p-4"
    >
      {skin.thumb ? (
        <button
          onClick={onLoad}
          className="no-drag group/thumb relative h-40 overflow-hidden rounded-xl border border-white/10"
          title="Charger ce skin"
          style={{
            background:
              "radial-gradient(ellipse 75% 70% at 50% 42%, rgba(124,92,255,.22), rgba(34,211,238,.07) 50%, transparent 75%), #0a0d18",
          }}
        >
          {/* mix-blend screen : le fond noir de la capture se fond dans le dégradé, le perso ressort */}
          <img
            src={skin.thumb}
            alt={skin.name}
            className="mx-auto h-full w-auto max-w-full object-contain mix-blend-screen transition-transform duration-500 ease-out group-hover/thumb:scale-[1.06]"
          />
          {/* balayage lumineux au survol */}
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover/thumb:translate-x-full" />
          {/* léger vignettage bas pour ancrer le perso */}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />
        </button>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-white/10 bg-void-900 text-slate-600">
          <WandSparkles className="h-8 w-8" />
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        {editing ? (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") cancel();
            }}
            className="no-drag min-w-0 flex-1 rounded-lg border border-glow-purple/50 bg-void-800/70 px-2 py-1 text-sm font-bold text-white outline-none"
          />
        ) : (
          <p className="min-w-0 flex-1 truncate font-display text-base font-bold text-white">{skin.name}</p>
        )}
        {editing ? (
          <div className="flex shrink-0 gap-1">
            <button onClick={commit} className="rounded-lg bg-glow-emerald/15 p-1.5 text-glow-emerald transition hover:bg-glow-emerald/25" title="Valider">
              <Check className="h-4 w-4" />
            </button>
            <button onClick={cancel} className="rounded-lg bg-white/5 p-1.5 text-slate-400 transition hover:bg-white/10" title="Annuler">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="shrink-0 rounded-lg bg-white/5 p-1.5 text-slate-500 transition hover:bg-white/10 hover:text-slate-300"
            title="Renommer"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-500">
        {skin.skinId && (
          <span className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-slate-400">#{skin.skinId}</span>
        )}
        <span>{new Date(skin.createdAt).toLocaleDateString("fr-FR")}</span>
      </div>

      <div className="mt-auto flex items-center gap-2">
        <button
          onClick={onLoad}
          className="no-drag inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-glow-purple/40 bg-glow-purple/20 px-3 py-2 text-sm font-semibold text-white transition hover:bg-glow-purple/30"
        >
          <WandSparkles className="h-4 w-4" /> Charger
        </button>
        <a
          href={skin.url}
          className="no-drag inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-slate-200"
          title="Ouvrir sur barbofus.com"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
        <button
          onClick={() => actions.deleteBarbofusSkin(skin.id)}
          className="no-drag inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-slate-500 transition hover:border-glow-rose/30 hover:text-glow-rose"
          title="Supprimer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
