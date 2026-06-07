import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Copy,
  Eye,
  ExternalLink,
  ImageOff,
  Info,
  Loader2,
  Search,
  dofusUiIcon,
} from "../components/DofusIcons";
import DofusIcon from "../components/DofusIcon";
import clsx from "clsx";
import { browseEquipment, browseEquipmentAll, searchEquipment, type EquipmentLight } from "../api/dofusdude";
import { listBreeds, type Breed } from "../api/dofusdb";
import { classIllus } from "../data/classIllus";
import AppLoader from "../components/AppLoader";
import { skinatorEngine, useEngineOpen, useSkinLoadRequest } from "../store/skinatorEngine";
import { useDebounce } from "../hooks/useDebounce";
import { buildSkinPayload, renderSkin, skinKey, type SkinPayload } from "../lib/skinRender";
import { actions, useStore, type SkinCosmetic, type SkinDesign } from "../store/store";
import { EmptyState, ErrorState, Pill, SectionHeader, Skeleton, fadeUp } from "../components/ui";

const DEFAULT_COLORS = {
  skin: "#d49a73",
  hair: "#efe0b9",
  primary: "#2b6f8f",
  secondary: "#f5b64c",
  accent: "#7c5cff",
};

const COLOR_PRESETS = [
  ["#d49a73", "#efe0b9", "#2b6f8f", "#f5b64c", "#7c5cff"],
  ["#b9855f", "#12151f", "#7d1f2f", "#20242f", "#d8b55b"],
  ["#8f654a", "#f0f4f8", "#315c45", "#d7e9ce", "#ed8936"],
  ["#c68b68", "#734630", "#463f7f", "#e6c66a", "#22d3ee"],
  ["#684936", "#dad7cd", "#1f2937", "#8b5cf6", "#f472b6"],
];

const COSMETIC_SLOTS = [
  { id: "hat", label: "Coiffe", typeNameId: "hat", icon: dofusUiIcon("armor") },
  { id: "cloak", label: "Cape", typeNameId: "cloak", icon: dofusUiIcon("armor") },
  { id: "shield", label: "Bouclier", typeNameId: "shield", icon: dofusUiIcon("shield") },
  { id: "weapon", label: "Arme", typeNameId: "sword", icon: dofusUiIcon("weapon") },
  { id: "petmount", label: "Familier", typeNameId: "pet", icon: dofusUiIcon("familier") },
] as const;

const RENDER_AVAILABLE = typeof window !== "undefined" && !!window.dofusCodex?.renderSkin;
const BARBOFUS_VIEW_HEIGHT = 760;

type SlotId = (typeof COSMETIC_SLOTS)[number]["id"];

type Draft = Omit<SkinDesign, "id" | "createdAt" | "updatedAt">;

function emptyCosmetics(): Record<string, SkinCosmetic | null> {
  return Object.fromEntries(COSMETIC_SLOTS.map((slot) => [slot.id, null]));
}

function newDraft(): Draft {
  return {
    name: "Nouveau skin",
    breedId: 8,
    gender: "m",
    orientation: 1,
    colors: DEFAULT_COLORS,
    cosmetics: emptyCosmetics(),
  };
}

export default function Skinator() {
  // Skinator est monté en permanence (cf. App.tsx) pour garder le moteur Barbofus vivant.
  // `active` = page réellement visible : sert à neutraliser les effets de bord quand elle
  // est masquée (sinon ils impacteraient les autres pages).
  const active = useLocation().pathname === "/skinator";
  const savedSkins = useStore((s) => s.skinDesigns);
  const [engine, setEngine] = useState<"barbofus" | "local">("barbofus");
  const [barbofusUrl, setBarbofusUrl] = useState("https://barbofus.com/skinator");
  const [barbofusInput, setBarbofusInput] = useState("");
  const [draft, setDraft] = useState<Draft>(() => newDraft());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeSlot, setActiveSlot] = useState<SlotId>("hat");
  const [search, setSearch] = useState("");
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const debounced = useDebounce(search);

  const { data: breeds, isLoading: breedsLoading } = useQuery({
    queryKey: ["breeds"],
    queryFn: ({ signal }) => listBreeds(signal),
    staleTime: Infinity,
  });

  const selectedBreed = breeds?.find((breed) => breed.id === draft.breedId) ?? null;
  const activeSlotDef = COSMETIC_SLOTS.find((slot) => slot.id === activeSlot)!;
  const itemQuery = debounced.trim();
  const hasSearch = itemQuery.length >= 2;

  const {
    data: cosmetics,
    isLoading: cosmeticsLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["skinator-cosmetics", activeSlot, hasSearch ? itemQuery : ""],
    queryFn: async ({ signal }) => {
      let items: EquipmentLight[];
      if (hasSearch) {
        items = await searchEquipment(itemQuery, 42, signal);
        return items.filter((item) => cosmeticMatches(item, activeSlot));
      }
      try {
        items = await browseEquipment({ typeNameId: activeSlotDef.typeNameId, pageSize: 36, sort: "desc" }, signal);
      } catch {
        items = await browseEquipmentAll({ typeNameId: activeSlotDef.typeNameId, sort: "desc" }, signal);
      }
      return items.slice(0, 42);
    },
    placeholderData: keepPreviousData,
  });

  const exportCode = useMemo(() => btoa(unescape(encodeURIComponent(JSON.stringify(draft)))), [draft]);
  const previewImage = classIllus(draft.breedId);
  const renderPayload = useMemo(() => buildDraftSkinPayload(draft), [draft]);
  const { data: renderedSkin, isFetching: skinFetching } = useQuery({
    queryKey: ["skinator-render", renderPayload ? skinKey(renderPayload) : "none"],
    queryFn: () => renderSkin(renderPayload!),
    enabled: RENDER_AVAILABLE && !!renderPayload,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
    retry: 1,
    placeholderData: (prev) => prev,
  });
  const [lastRenderedSkin, setLastRenderedSkin] = useState<string | null>(null);
  useEffect(() => {
    if (renderedSkin) setLastRenderedSkin(renderedSkin);
  }, [renderedSkin]);

  useEffect(() => {
    if (!active) return; // page masquée : ne pas imposer la largeur aux autres pages
    document.body.dataset.skinatorWide = engine === "barbofus" ? "true" : "false";
    return () => {
      delete document.body.dataset.skinatorWide;
    };
  }, [engine, active]);

  // Chargement d'un skin sauvegardé depuis la page « Mes Skins » : on bascule sur le moteur
  // Barbofus, on charge l'URL du skin et on ouvre le moteur (la navigation vers /skinator est
  // faite par la page « Mes Skins »).
  const skinLoad = useSkinLoadRequest();
  useEffect(() => {
    if (!skinLoad) return;
    setEngine("barbofus");
    setBarbofusUrl(skinLoad.url);
    skinatorEngine.setOpen(true);
    skinatorEngine.clearLoadRequest();
  }, [skinLoad]);

  // Fermeture du moteur (« Fermer le moteur ») → on remet l'URL de base, pour que la
  // prochaine ouverture reparte sur un skinator neuf au lieu de recharger le dernier skin
  // chargé via « Charger ». (« Laisser en fond » garde le moteur ouvert → non concerné.)
  const engineOpen = useEngineOpen();
  useEffect(() => {
    if (!engineOpen) setBarbofusUrl("https://barbofus.com/skinator");
  }, [engineOpen]);

  function patch(patch: Partial<Draft>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  function setColor(key: keyof Draft["colors"], value: string) {
    setDraft((current) => ({ ...current, colors: { ...current.colors, [key]: value } }));
  }

  function selectCosmetic(item: EquipmentLight | null) {
    setDraft((current) => ({
      ...current,
      cosmetics: {
        ...current.cosmetics,
        [activeSlot]: item
          ? { id: item.ankama_id, name: item.name, icon: item.image_urls.icon, type: item.type.name }
          : null,
      },
    }));
  }

  function save() {
    if (editingId) {
      actions.updateSkinDesign(editingId, draft);
      return;
    }
    setEditingId(actions.saveSkinDesign(draft));
  }

  function loadSkin(skin: SkinDesign) {
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...next } = skin;
    setDraft(next);
    setEditingId(skin.id);
  }

  function reset() {
    setDraft(newDraft());
    setEditingId(null);
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(exportCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCode(exportCode);
    }
  }

  function importCode() {
    try {
      const parsed = JSON.parse(decodeURIComponent(escape(atob(code.trim())))) as Partial<Draft>;
      setDraft({
        ...newDraft(),
        ...parsed,
        colors: { ...DEFAULT_COLORS, ...(parsed.colors ?? {}) },
        cosmetics: { ...emptyCosmetics(), ...(parsed.cosmetics ?? {}) },
      });
      setEditingId(null);
      setCode("");
    } catch {
      setCode("");
    }
  }

  return (
    <div>
      <SectionHeader
        eyebrow="Apparence"
        title="Skinator"
        subtitle="Compose et anime ton apparence directement dans le moteur Barbofus."
      />

      {engine === "barbofus" ? (
        <div className="skinator-wide-surface">
          <BarbofusEngine url={barbofusUrl} active={active} />
        </div>
      ) : (

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-5">
          <div className="glass overflow-hidden rounded-2xl">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_300px]">
              <SkinPreview
                draft={draft}
                breed={selectedBreed}
                previewImage={previewImage}
                renderedSkin={renderedSkin ?? lastRenderedSkin}
                isRendering={skinFetching}
                canRender={RENDER_AVAILABLE}
                payload={renderPayload}
              />
              <div className="border-t border-white/10 p-4 lg:border-l lg:border-t-0">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-white">Identité</h2>
                  <Pill tone="cyan">
                    <DofusIcon name="dofusEgg" size={14} /> Dofus
                  </Pill>
                </div>
                <input
                  value={draft.name}
                  onChange={(e) => patch({ name: e.target.value })}
                  className="no-drag mb-3 w-full rounded-xl border border-white/10 bg-void-800/70 px-3 py-2 text-sm font-semibold text-white outline-none focus:border-glow-purple/50"
                />
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => patch({ gender: "m" })} className={choiceButton(draft.gender === "m")}>
                    Masculin
                  </button>
                  <button onClick={() => patch({ gender: "f" })} className={choiceButton(draft.gender === "f")}>
                    Féminin
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((orientation) => (
                    <button
                      key={orientation}
                      onClick={() => patch({ orientation })}
                      className={choiceButton(draft.orientation === orientation)}
                      title={`Orientation ${orientation}`}
                    >
                      {orientation}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-4">
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-white">
              <DofusIcon name="emote" size={20} /> Classes
            </h2>
            {breedsLoading ? (
              <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
                {Array.from({ length: 20 }).map((_, index) => (
                  <Skeleton key={index} className="h-14" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
                {(breeds ?? []).map((breed) => (
                  <button
                    key={breed.id}
                    onClick={() => patch({ breedId: breed.id })}
                    title={breed.name.fr}
                    className={clsx(
                      "no-drag grid h-14 place-items-center rounded-xl border bg-white/[0.035] transition",
                      draft.breedId === breed.id
                        ? "border-glow-purple/50 ring-2 ring-glow-purple/20"
                        : "border-white/10 hover:border-white/25",
                    )}
                  >
                    <img src={breed.img} alt={breed.name.fr} className="h-11 w-11 object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="glass rounded-2xl p-4">
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-white">
              <DofusIcon name="character" size={20} /> Codes couleur
            </h2>
            <div className="grid gap-3 md:grid-cols-5">
              {Object.entries(draft.colors).map(([key, value]) => (
                <label key={key} className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {colorLabel(key)}
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => setColor(key as keyof Draft["colors"], e.target.value)}
                      className="no-drag h-9 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
                    />
                    <input
                      value={value}
                      onChange={(e) => setColor(key as keyof Draft["colors"], normalizeHex(e.target.value))}
                      className="no-drag min-w-0 flex-1 bg-transparent text-xs font-bold uppercase text-slate-300 outline-none"
                    />
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {COLOR_PRESETS.map((preset, index) => (
                <button
                  key={preset.join("-")}
                  onClick={() =>
                    patch({
                      colors: {
                        skin: preset[0],
                        hair: preset[1],
                        primary: preset[2],
                        secondary: preset[3],
                        accent: preset[4],
                      },
                    })
                  }
                  className="no-drag flex rounded-xl border border-white/10 bg-white/5 p-1 transition hover:border-glow-cyan/40"
                  title={`Palette ${index + 1}`}
                >
                  {preset.map((color) => (
                    <span key={color} className="h-6 w-6 first:rounded-l-lg last:rounded-r-lg" style={{ background: color }} />
                  ))}
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-white">
                <DofusIcon name="armor" size={20} /> Cosmétiques
              </h2>
              <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Rechercher ${activeSlotDef.label.toLowerCase()}`}
                  className="no-drag w-full rounded-xl border border-white/10 bg-void-800/70 py-2 pl-9 pr-3 text-sm text-slate-200 outline-none focus:border-glow-purple/50"
                />
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {COSMETIC_SLOTS.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setActiveSlot(slot.id)}
                  className={choiceButton(activeSlot === slot.id)}
                >
                  <slot.icon className="h-4 w-4" /> {slot.label}
                </button>
              ))}
              <button onClick={() => selectCosmetic(null)} className={choiceButton(false)}>
                <DofusIcon name="closeRed" size={16} /> Vider
              </button>
            </div>

            {cosmeticsLoading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {Array.from({ length: 12 }).map((_, index) => (
                  <Skeleton key={index} className="h-28" />
                ))}
              </div>
            ) : isError ? (
              <ErrorState message={(error as Error)?.message} onRetry={refetch} />
            ) : cosmetics?.length ? (
              <motion.div
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.02 } } }}
                className={clsx("grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6", isFetching && "opacity-70")}
              >
                {cosmetics.map((item, index) => (
                  <motion.button
                    key={item.ankama_id}
                    custom={index % 12}
                    variants={fadeUp}
                    onClick={() => selectCosmetic(item)}
                    className={clsx(
                      "glass-hover no-drag relative flex h-28 flex-col items-center justify-center rounded-xl border p-2 text-center",
                      draft.cosmetics[activeSlot]?.id === item.ankama_id
                        ? "border-glow-purple/50 bg-glow-purple/10"
                        : "border-white/10 bg-white/[0.025]",
                    )}
                  >
                    {draft.cosmetics[activeSlot]?.id === item.ankama_id && (
                      <span className="absolute right-1.5 top-1.5 rounded-full bg-glow-purple p-1 text-white">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                    <img src={item.image_urls.icon} alt="" loading="lazy" className="h-12 w-12 object-contain" />
                    <span className="mt-2 line-clamp-2 text-xs font-semibold leading-tight text-slate-200">
                      {item.name}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <EmptyState title="Aucun cosmétique" hint="Essayez une recherche plus courte ou un autre slot." />
            )}
          </div>
        </section>

        <aside className="space-y-5">
          <div className="glass rounded-2xl p-4">
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-white">
              <DofusIcon name="liaison" size={20} /> Partage
            </h2>
            <button onClick={copyCode} className={toolButton("cyan") + " mb-3 w-full justify-center"}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copié" : "Copier le code"}
            </button>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Coller un code Skinator"
              className="no-drag h-24 w-full resize-none rounded-xl border border-white/10 bg-void-800/70 p-3 text-xs text-slate-300 outline-none focus:border-glow-purple/50"
            />
            <button onClick={importCode} disabled={!code.trim()} className={toolButton("slate") + " mt-2 w-full justify-center disabled:opacity-40"}>
              Importer
            </button>
          </div>

          <div className="glass rounded-2xl p-4">
            <h2 className="mb-3 font-display text-lg font-bold text-white">Galerie locale</h2>
            {savedSkins.length === 0 ? (
              <p className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-500">
                Les skins sauvegardés apparaîtront ici.
              </p>
            ) : (
              <div className="space-y-2">
                <AnimatePresence initial={false}>
                  {savedSkins.map((skin) => (
                    <motion.div
                      key={skin.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      className={clsx(
                        "rounded-xl border bg-white/[0.03] p-3",
                        editingId === skin.id ? "border-glow-purple/45" : "border-white/10",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <SkinMini colors={skin.colors} />
                        <button onClick={() => loadSkin(skin)} className="no-drag min-w-0 flex-1 text-left">
                          <p className="truncate text-sm font-bold text-white">{skin.name}</p>
                          <p className="text-xs text-slate-500">{breedName(breeds, skin.breedId)}</p>
                        </button>
                        <button
                          onClick={() => actions.deleteSkinDesign(skin.id)}
                          className="no-drag rounded-lg border border-white/10 bg-white/5 p-2 text-slate-500 transition hover:border-glow-rose/30 hover:text-glow-rose"
                          title="Supprimer"
                        >
                          <DofusIcon name="closeRed" size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </aside>
      </div>
      )}
    </div>
  );
}

function BarbofusEngine({ url, active }: { url: string; active: boolean }) {
  const isElectron = typeof window !== "undefined" && !!window.dofusCodex;
  const webviewRef = useRef<BarbofusWebviewElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [webviewReady, setWebviewReady] = useState(false);
  const [viewHeight, setViewHeight] = useState(BARBOFUS_VIEW_HEIGHT);
  const [expanded, setExpanded] = useState(false);
  // Le webview n'est monté qu'au clic : ouvrir la page Skinator ne tape donc PAS sur
  // barbofus.com tant que l'utilisateur n'a pas demandé le rendu (moins de charge sur leur
  // serveur, et moins de risque de ban). Skinator étant monté en permanence (App.tsx),
  // `opened` — et le skin en cours dans le webview — persistent tant que l'app reste ouverte.
  // L'état vit dans un store éphémère pour pouvoir fermer le moteur depuis ailleurs
  // (modal « quitter le Skinator » → bouton « Fermer le moteur »).
  const opened = useEngineOpen();
  const [saveMsg, setSaveMsg] = useState<{ text: string; tone: "ok" | "warn" } | null>(null);
  const saveTimer = useRef<number | null>(null);
  // URL sauvegardable du skin courant, détectée depuis l'URL du webview (null = pas encore de
  // skin encodé dans l'URL). Sert à activer « Sauvegarder » dès qu'un lien rechargeable existe.
  const [currentSkinUrl, setCurrentSkinUrl] = useState<string | null>(null);
  // Modal de sauvegarde : url en cours, nom saisi, et cible d'écrasement ("" = nouveau skin).
  const savedSkins = useStore((s) => s.barbofusSkins);
  const [saveDialog, setSaveDialog] = useState<string | null>(null);
  const [saveName, setSaveName] = useState("");
  const [overwriteId, setOverwriteId] = useState("");

  // Hauteur responsive (mode inline) : le moteur remplit l'espace restant sous lui pour
  // que la page Skinator tienne dans la fenêtre, sans scroll externe.
  useLayoutEffect(() => {
    if (expanded) return; // en mode agrandi le cadre est en flex-1, pas de mesure fenêtre
    if (!active) return; // page masquée : rect non fiable → on (re)mesure au retour sur la page
    const measure = () => {
      const el = frameRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      const next = Math.max(420, Math.round(window.innerHeight - top - 24));
      setViewHeight((prev) => (Math.abs(prev - next) > 2 ? next : prev));
    };
    measure();
    window.addEventListener("resize", measure);
    const t1 = window.setTimeout(measure, 200);
    const t2 = window.setTimeout(measure, 600);
    return () => {
      window.removeEventListener("resize", measure);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [expanded, active]);

  // Échap ferme la modal agrandie.
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  // Le <main> est en `z-10` (App.tsx) : il crée un contexte d'empilement qui plafonne
  // notre overlay/modal en `fixed z-50` sous la Sidebar (z-20) et la TitleBar (z-30).
  // On portalerait normalement la modal hors du <main>, mais cela déplacerait le nœud
  // de la <webview> Barbofus → rechargement. On élève donc temporairement le <main>
  // au-dessus de la chrome pendant l'agrandissement (restauré à la fermeture).
  useEffect(() => {
    if (!expanded) return;
    const main = document.querySelector("main");
    if (!main) return;
    const prev = (main as HTMLElement).style.zIndex;
    (main as HTMLElement).style.zIndex = "50";
    return () => {
      (main as HTMLElement).style.zIndex = prev;
    };
  }, [expanded]);

  // Moteur fermé (via le modal « quitter ») : on réarme le loader pour la prochaine ouverture.
  useEffect(() => {
    if (!opened) setWebviewReady(false);
  }, [opened]);

  // Changement de skin (chargement depuis « Mes Skins ») : le webview est remonté (key={url})
  // → on réaffiche le loader le temps que le nouveau skin charge.
  useEffect(() => {
    setWebviewReady(false);
  }, [url]);

  // Surveillance de l'URL : capte le `skin=ID` dès qu'il apparaît (après un « Partager » sur
  // Barbofus, ou au chargement d'un skin sauvegardé). getURL() est local (pas de réseau).
  useEffect(() => {
    if (!opened) {
      setCurrentSkinUrl(null);
      return;
    }
    const read = () => {
      const wv = webviewRef.current;
      if (!wv) return;
      try {
        setCurrentSkinUrl(savableSkinUrl(wv.getURL()));
      } catch {
        /* getURL indispo */
      }
    };
    read();
    const iv = window.setInterval(read, 1500);
    return () => window.clearInterval(iv);
  }, [opened, url]);

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    // Garde-fou : ne jamais laisser le loader tourner à l'infini si dom-ready ne tire pas
    // (page d'erreur, hôte injoignable…). On découvre le webview au pire après ce délai.
    const safety = window.setTimeout(() => setWebviewReady(true), 12000);

    const onReady = async () => {
      window.clearTimeout(safety);
      syncWebviewShadowFrame(webview);
      normalizeBarbofusViewport(webview);
      // Masquer le chrome Barbofus + boutons Partager/Copier URL AVANT de retirer le loader :
      // sinon ces boutons « flashent » visibles le temps que l'injection JS s'applique. On
      // attend donc l'injection (avec un garde-fou court), puis on découvre le moteur.
      try {
        await Promise.race([applyBarbofusFocus(webview), wait(2500)]);
      } catch {
        /* injection indispo : on découvre quand même pour ne pas bloquer */
      }
      setWebviewReady(true);
      const resettle = () => {
        syncWebviewShadowFrame(webview);
        applyBarbofusFocus(webview);
      };
      window.setTimeout(resettle, 250);
      window.setTimeout(resettle, 1000);
    };
    // On ne réaffiche le loader que pour un VRAI rechargement du frame principal. À filtrer :
    //  • sous-frames (embed Twitch, reCAPTCHA…) → isMainFrame false ;
    //  • navigations « in-place » / même document (history.pushState de Livewire quand on
    //    clique une classe/un item, ancres…) → isInPlace / isSameDocument true.
    // Sans ces filtres, chaque interaction dans le skinator relancerait le loader.
    const onNavigate = (e: Event) => {
      const ev = e as { isMainFrame?: boolean; isInPlace?: boolean; isSameDocument?: boolean };
      if (ev.isMainFrame !== true) return;
      if (ev.isInPlace || ev.isSameDocument) return;
      setWebviewReady(false);
    };

    webview.addEventListener("dom-ready", onReady);
    webview.addEventListener("did-start-navigation", onNavigate as EventListener);
    return () => {
      window.clearTimeout(safety);
      webview.removeEventListener("dom-ready", onReady);
      webview.removeEventListener("did-start-navigation", onNavigate as EventListener);
    };
    // `opened` dans les deps : le webview n'est monté qu'au clic, l'effet doit donc se
    // relancer pour attacher dom-ready (sinon onReady ne tirerait jamais après ouverture).
  }, [url, opened]);

  // Le cadre interne suit la taille réelle du webview (resize fenêtre OU passage en modal),
  // sans jamais recharger la webview.
  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview || !webviewReady) return;
    syncWebviewShadowFrame(webview);
    applyBarbofusFocus(webview);
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => syncWebviewShadowFrame(webview));
    ro.observe(webview);
    return () => ro.disconnect();
  }, [webviewReady, expanded]);

  const flashSave = (msg: { text: string; tone: "ok" | "warn" }) => {
    setSaveMsg(msg);
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => setSaveMsg(null), 3500);
  };
  const safeSavableUrl = (wv: BarbofusWebviewElement): string | null => {
    try {
      return savableSkinUrl(wv.getURL());
    } catch {
      return null;
    }
  };
  // Ouvre la modal de sauvegarde (nom + nouveau/écraser). L'URL courante encode le skin
  // (cf. « Copier URL » de Barbofus) → on la garde telle quelle, sans compte ni extraction d'ID.
  const openSaveDialog = () => {
    const wv = webviewRef.current;
    if (!wv) return;
    const skinUrl = currentSkinUrl ?? safeSavableUrl(wv);
    if (!skinUrl) {
      flashSave({
        text: "Aucun skin détecté dans l'URL. Compose ton skin (l'URL Barbofus encode le rendu), puis réessaie.",
        tone: "warn",
      });
      return;
    }
    const existing = savedSkins.find((sk) => sk.url === skinUrl);
    const id = extractSkinId(skinUrl);
    setSaveName(existing?.name ?? (id ? `Skin #${id}` : ""));
    setOverwriteId(existing?.id ?? "");
    setSaveDialog(skinUrl);
  };
  const confirmSave = async () => {
    if (!saveDialog) return;
    const url = saveDialog;
    const skinId = extractSkinId(url) ?? undefined;
    const name = saveName.trim() || "Mon skin";
    setSaveDialog(null);
    // Vignette capturée depuis le moteur (perso visible à cet instant). Peut être null.
    const thumb = await captureSkinThumb(webviewRef.current);
    const noThumb = thumb ? "" : " (sans vignette)";
    if (overwriteId) {
      actions.updateBarbofusSkin(overwriteId, { name, url, skinId, ...(thumb ? { thumb } : {}) });
      flashSave({ text: `Skin mis à jour ✓${noThumb}`, tone: "ok" });
    } else {
      const res = actions.saveBarbofusSkin({ name, url, skinId, thumb: thumb ?? undefined });
      flashSave(
        res === "exists"
          ? { text: "Ce skin (même URL) est déjà sauvegardé.", tone: "warn" }
          : { text: `Skin sauvegardé dans « Mes Skins » ✓${noThumb}`, tone: "ok" },
      );
    }
  };

  const header = (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.035] px-4 py-2">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-glow-purple/40 to-emerald-500/30 text-emerald-200 shadow-[0_0_14px_-2px_rgba(16,185,129,0.5)]">
          <DofusIcon name="character" size={16} />
        </span>
        <h2 className="truncate font-display text-base font-bold text-white">Moteur Barbofus</h2>
        <span className="hidden text-[10px] font-semibold uppercase tracking-widest text-emerald-300/80 sm:inline">Animé</span>
      </div>
      {opened && (
        <span
          className="hidden items-center gap-1.5 rounded-full border border-glow-purple/25 bg-glow-purple/10 px-2.5 py-1 text-[11px] font-medium text-glow-violet lg:inline-flex"
          title="Le partage Barbofus est désactivé ici — pour garder un skin, utilise « Sauvegarder »."
        >
          <Info className="h-3.5 w-3.5" />
          Partage désactivé — utilise « Sauvegarder »
        </span>
      )}
      {opened && (
        <div className="flex items-center gap-2">
          <button
            onClick={openSaveDialog}
            className={toolButton("cyan")}
            title="Sauvegarder ce skin dans « Mes Skins »"
          >
            <DofusIcon name="bank" size={16} />{" "}
            <span className="hidden sm:inline">
              Sauvegarder{currentSkinUrl && extractSkinId(currentSkinUrl) ? ` #${extractSkinId(currentSkinUrl)}` : ""}
            </span>
          </button>
          <button onClick={() => setExpanded((v) => !v)} className={toolButton(expanded ? "slate" : "purple")}>
            {expanded ? (
              <>
                <DofusIcon name="closeRed" size={16} /> Réduire
              </>
            ) : (
              <>
                <DofusIcon name="zoom" size={16} /> Agrandir
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );

  // Écran de lancement : on ne monte pas le webview tant que l'utilisateur ne l'a pas demandé.
  const launch = (
    <div
      className="relative flex flex-col items-center justify-center gap-5 overflow-hidden px-8 text-center"
      style={{
        height: viewHeight,
        background:
          "radial-gradient(ellipse 70% 55% at 50% 42%, rgba(124,58,237,.14), rgba(34,211,238,.05) 45%, transparent 72%), #070912",
      }}
    >
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-glow-purple/40 to-glow-cyan/25 text-white shadow-glow">
        <DofusIcon name="character" size={28} />
      </span>
      <div className="space-y-1.5">
        <p className="font-display text-xl font-bold text-white">Rendu animé Barbofus</p>
        <p className="mx-auto max-w-md text-sm leading-6 text-slate-400">
          Le moteur se charge depuis barbofus.com. Pour ne pas solliciter leur serveur
          inutilement, il ne s'ouvre qu'à la demande.
        </p>
      </div>
      <button onClick={() => skinatorEngine.setOpen(true)} className={toolButton("purple")}>
        Ouvrir le moteur
      </button>
    </div>
  );

  const body = !isElectron ? (
    <div className="flex min-h-[520px] flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <ImageOff className="h-10 w-10 text-slate-600" />
      <div>
        <p className="font-display text-xl font-bold text-white">Webview Electron requise</p>
        <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
          Barbofus bloque les iframes classiques. Dans l'app desktop, Skinator utilise une webview Electron.
        </p>
      </div>
      <a href={url} className={toolButton("cyan")}>
        <ExternalLink className="h-4 w-4" /> Ouvrir Barbofus
      </a>
    </div>
  ) : opened ? (
    <div
      ref={frameRef}
      className={
        expanded
          ? "relative min-h-0 flex-1 overflow-hidden bg-void-900"
          : "relative overflow-hidden bg-void-900"
      }
      style={expanded ? undefined : { height: viewHeight }}
    >
      <webview
        ref={webviewRef}
        key={url}
        src={url}
        title="Barbofus Skinator"
        partition="persist:barbofus-skinator"
        allowpopups="true"
        style={{ height: expanded ? "100%" : viewHeight }}
        className="block h-full w-full bg-void-900"
      />
      {/* Notre loader recouvre le webview tant que la page Barbofus n'est pas prête, puis
          s'efface en fondu (le fondu masque le bref flash avant l'injection de notre CSS). */}
      <AnimatePresence>
        {!webviewReady && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute inset-0 z-10 flex items-center justify-center"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 18%, rgba(124, 92, 255, 0.16), transparent 60%)," +
                "radial-gradient(90% 70% at 50% 100%, rgba(34, 211, 238, 0.1), transparent 55%)," +
                "#070912",
            }}
          >
            <AppLoader label="Chargement du moteur Barbofus…" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ) : (
    launch
  );

  // Le wrapper reste au même index du fragment dans les deux modes (les slots conditionnels
  // valent `false` quand repliés) : React ne remonte donc pas la webview → pas de rechargement.
  return (
    <>
      {/* Réserve la place inline pour éviter un saut de layout quand le moteur passe en modal. */}
      {expanded ? <div style={{ height: viewHeight }} /> : false}
      {expanded ? (
        <div
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm"
          onClick={() => setExpanded(false)}
        />
      ) : (
        false
      )}
      <div
        className={
          expanded
            ? "fixed inset-3 z-50 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-void-900 shadow-card sm:inset-5 lg:inset-8"
            : "overflow-visible rounded-2xl border border-white/10 bg-void-900 shadow-card"
        }
      >
        {header}
        {body}
      </div>

      {/* Toast de confirmation de sauvegarde du skin. */}
      <AnimatePresence>
        {saveMsg && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className={clsx(
              "fixed bottom-6 left-1/2 z-[60] max-w-[90vw] -translate-x-1/2 rounded-xl border px-4 py-2.5 text-sm font-semibold shadow-card backdrop-blur",
              saveMsg.tone === "ok"
                ? "border-glow-emerald/40 bg-void-900/90 text-glow-emerald"
                : "border-glow-gold/40 bg-void-900/90 text-glow-gold",
            )}
          >
            {saveMsg.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de sauvegarde : nom + nouveau skin ou écrasement d'un skin existant. */}
      <AnimatePresence>
        {saveDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setSaveDialog(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-void-800 p-5 shadow-card"
            >
              <h3 className="font-display text-lg font-bold text-white">Sauvegarder le skin</h3>

              <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Nom
              </label>
              <input
                autoFocus
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmSave();
                  if (e.key === "Escape") setSaveDialog(null);
                }}
                placeholder="Mon skin"
                className="no-drag mt-1.5 w-full rounded-xl border border-white/10 bg-void-900/70 px-3 py-2 text-sm text-white outline-none focus:border-glow-purple/50"
              />

              <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Enregistrer comme
              </label>
              <select
                value={overwriteId}
                onChange={(e) => {
                  setOverwriteId(e.target.value);
                  const target = savedSkins.find((sk) => sk.id === e.target.value);
                  if (target) setSaveName(target.name);
                }}
                className="no-drag mt-1.5 w-full rounded-xl border border-white/10 bg-void-900/70 px-3 py-2 text-sm text-white outline-none focus:border-glow-purple/50"
              >
                <option value="">✨ Nouveau skin</option>
                {savedSkins.map((sk) => (
                  <option key={sk.id} value={sk.id}>
                    ♻︎ Écraser : {sk.name}
                  </option>
                ))}
              </select>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => setSaveDialog(null)}
                  className="no-drag rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmSave}
                  className="no-drag inline-flex items-center gap-1.5 rounded-xl border border-glow-purple/40 bg-glow-purple/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-glow-purple/30"
                >
                  <DofusIcon name="bank" size={16} /> {overwriteId ? "Écraser" : "Enregistrer"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

type BarbofusWebviewElement = HTMLElement & {
  insertCSS: (css: string) => Promise<string>;
  executeJavaScript: <T = unknown>(code: string) => Promise<T>;
  reload: () => void;
  getURL: () => string;
  capturePage: (rect?: { x: number; y: number; width: number; height: number }) => Promise<{
    toDataURL: () => string;
  }>;
  setZoomFactor?: (factor: number) => void;
};

// Réduit une dataURL d'image à `max` px (côté long) en webp compressé — vignette légère pour
// le store (persisté en localStorage). Repli sur l'original si quoi que ce soit échoue.
function downscaleDataUrl(dataUrl: string, max: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height) || 1);
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(dataUrl);
      ctx.drawImage(img, 0, 0, w, h);
      try {
        resolve(canvas.toDataURL("image/webp", 0.8));
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

// Capture une vignette du perso depuis le moteur ouvert. On recadre sur le plus grand
// `.canvas-renderer` / `canvas` / `#skinator-form` visible ; en dernier recours, capture
// pleine page. Réduit ensuite l'image. Renvoie null si capturePage indispo / image vide.
async function captureSkinThumb(wv: BarbofusWebviewElement | null): Promise<string | null> {
  if (!wv || typeof wv.capturePage !== "function") return null;
  try {
    const rectJson = await wv.executeJavaScript<string | null>(`(() => {
      function rectOf(sel) {
        var els = Array.prototype.slice.call(document.querySelectorAll(sel));
        var best = els.map(function (e) { return e.getBoundingClientRect(); })
          .filter(function (r) { return r.width > 40 && r.height > 40 && r.bottom > 0 && r.right > 0; })
          .sort(function (a, b) { return b.width * b.height - a.width * a.height; })[0];
        return best || null;
      }
      var r = rectOf('.canvas-renderer') || rectOf('canvas') || rectOf('#skinator-form');
      return r ? JSON.stringify({ x: r.x, y: r.y, width: r.width, height: r.height }) : null;
    })()`);
    let img;
    if (rectJson) {
      const r = JSON.parse(rectJson) as { x: number; y: number; width: number; height: number };
      img = await wv.capturePage({
        x: Math.max(0, Math.floor(r.x)),
        y: Math.max(0, Math.floor(r.y)),
        width: Math.max(1, Math.ceil(r.width)),
        height: Math.max(1, Math.ceil(r.height)),
      });
    } else {
      img = await wv.capturePage(); // repli : pleine page
    }
    const data = img.toDataURL();
    if (!data || data.length < 256) return null; // capture vide / échouée
    return await downscaleDataUrl(data, 260);
  } catch {
    return null;
  }
}

// Extrait l'ID d'un skin depuis l'URL (?skin=ID ou /unity-skin/ID), pour l'affichage. Optionnel.
function extractSkinId(url: string): string | null {
  return url.match(/(?:[?&]skin=|unity-skin\/)(\d+)/)?.[1] ?? null;
}

// L'URL Barbofus encode le skin (format variable : ?skin=ID, paramètres compressés…), et c'est
// exactement ce que copie leur bouton « Copier URL » = window.location.href = getURL(). On
// considère « sauvegardable » toute URL du skinator qui porte un état (query/hash/chemin au-delà
// de la base) — pas besoin de compte ni d'extraire un ID, on garde l'URL complète telle quelle.
function savableSkinUrl(raw: string): string | null {
  try {
    const u = new URL(raw);
    if (u.hostname !== "barbofus.com" && !u.hostname.endsWith(".barbofus.com")) return null;
    if (!/skin/i.test(u.pathname)) return null; // /skinator, /unity-skin/...
    const hasPayload = u.search.length > 1 || u.hash.length > 1 || /\/unity-skin\/\d+/i.test(u.pathname);
    return hasPayload ? raw : null;
  } catch {
    return null;
  }
}

function normalizeBarbofusViewport(webview: BarbofusWebviewElement) {
  try {
    webview.setZoomFactor?.(1);
  } catch {
    /* unavailable in some webview contexts */
  }
  webview.insertCSS(`
    html, body {
      margin: 0 !important;
      min-height: 100vh !important;
      overflow-x: hidden !important;
    }
  `).catch(() => {});
  webview.executeJavaScript(`
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  `).catch(() => {});
}

function syncWebviewShadowFrame(webview: BarbofusWebviewElement) {
  const iframe = webview.shadowRoot?.querySelector("iframe") as HTMLIFrameElement | null;
  if (!iframe) return;
  // L'iframe interne remplit son conteneur (height 100%) au lieu d'être figée à la hauteur
  // mesurée en px : sinon, quand le conteneur grandit (modal agrandie en flex-1), l'iframe
  // restait coincée à l'ancienne valeur → contenu Barbofus coupé en bas et scroll qui
  // « rebondit ». min-height très bas = simple garde-fou anti-collapse : on laisse height:100%
  // + le CSS de Barbofus gérer la mise en page dans tous les cas (y compris petites fenêtres,
  // où un plancher élevé rognait le bas).
  iframe.style.display = "block";
  iframe.style.flex = "1 1 auto";
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.minHeight = "240px";
  iframe.style.border = "0";
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function applyBarbofusFocus(webview: BarbofusWebviewElement): Promise<unknown> {
  try {
    webview.setZoomFactor?.(1);
  } catch {
    /* unavailable in some webview contexts */
  }

  // On laisse le CSS de Barbofus gérer la mise en page et le scroll (bien géré chez eux) :
  // on masque seulement le chrome du site pour isoler l'outil Skinator dans la modal.
  // Halo radial doux centré sur le perso : comble le vide sous l'outil (l'outil Barbofus
  // est calé en haut et plus court que la vue → grosse bande noire sinon) sans voler la
  // vedette au personnage. `background-attachment: fixed` garde le halo en place au scroll.
  const css = `
    html {
      background:
        radial-gradient(ellipse 70% 55% at 50% 40%,
          rgba(124, 58, 237, 0.12),
          rgba(34, 211, 238, 0.05) 45%,
          transparent 70%),
        #070912 !important;
      background-attachment: fixed !important;
      margin: 0 !important;
    }

    body {
      background: transparent !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    body > .sticky,
    #header,
    nav,
    body > h1,
    footer,
    /* Partage Barbofus inutilisable embarqué : masqué dès l'injection CSS (avant tout flash).
       Le bouton « Partager » a un id stable ; « Copier URL »/« S'enregistrer » sont gérés en JS. */
    #btnShare {
      display: none !important;
    }
  `;

  const cssDone = webview.insertCSS(css).catch(() => {});
  const jsDone = webview.executeJavaScript(`
    (() => {
      const form = document.querySelector('#skinator-form');
      if (form && !document.body.dataset.dofusCodexCompact) {
        let node = form.previousElementSibling;
        while (node) {
          const previous = node.previousElementSibling;
          if (node instanceof HTMLElement) node.style.display = 'none';
          node = previous;
        }

        node = form.nextElementSibling;
        while (node) {
          const next = node.nextElementSibling;
          if (node instanceof HTMLElement) node.style.display = 'none';
          node = next;
        }

        document.body.dataset.dofusCodexCompact = 'true';
      }

      // Le partage Barbofus est inutilisable embarqué (redirige vers le login) → on grise
      // « Partager » / « Copier URL » / « S'enregistrer » et on pose un texte de remplacement.
      // Un MutationObserver réapplique le masque après les re-rendus Livewire.
      const dcMaskShare = () => {
        const hide = (el) => {
          if (!el || el.dataset.dcHidden) return;
          el.dataset.dcHidden = '1';
          el.style.display = 'none';
        };
        hide(document.getElementById('btnShare'));
        document.querySelectorAll('button, a').forEach((el) => {
          const t = (el.textContent || '').trim().toLowerCase();
          if (t === 'partager' || t.indexOf('copier url') !== -1 || t.indexOf("s'enregistrer") !== -1) hide(el);
        });
        // Nettoie l'ancien texte injecté (déplacé dans la barre du moteur côté DofusCodex).
        const oldNote = document.getElementById('dc-share-note');
        if (oldNote) oldNote.remove();
      };
      dcMaskShare();
      if (!window.__dcShareObserver) {
        let queued = false;
        const run = () => {
          if (queued) return;
          queued = true;
          requestAnimationFrame(() => {
            queued = false;
            dcMaskShare();
          });
        };
        window.__dcShareObserver = new MutationObserver(run);
        window.__dcShareObserver.observe(document.body, { childList: true, subtree: true });
      }

      document.documentElement.style.background = '#070912';
      document.body.style.background = '#070912';
      window.scrollTo(0, 0);
      return true;
    })();
  `).catch(() => {});

  // Résout quand le masque (CSS + JS) est appliqué → onReady peut retirer le loader sans flash.
  return Promise.all([cssDone, jsDone]);
}

function SkinPreview({
  draft,
  breed,
  previewImage,
  renderedSkin,
  isRendering,
  canRender,
  payload,
}: {
  draft: Draft;
  breed: Breed | null;
  previewImage: string | null;
  renderedSkin: string | null;
  isRendering: boolean;
  canRender: boolean;
  payload: SkinPayload | null;
}) {
  const selected = COSMETIC_SLOTS.map((slot) => ({ slot, item: draft.cosmetics[slot.id] })).filter((entry) => entry.item);
  const showRendered = !!renderedSkin;
  const showArtwork = !showRendered && !!previewImage;
  return (
    <div className="relative min-h-[500px] overflow-hidden bg-void-900">
      <div className="absolute inset-0 bg-grid-faint bg-[length:32px_32px] opacity-30" />
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background: `radial-gradient(circle at 50% 35%, ${draft.colors.accent}40, transparent 34%),
          linear-gradient(135deg, ${draft.colors.primary}26, transparent 45%, ${draft.colors.secondary}1f)`,
        }}
      />
      <div className="relative flex h-full min-h-[500px] flex-col">
        <div className="flex items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-glow-cyan">
              {showRendered ? "Moteur live" : "Skinator"}
            </p>
            <h2 className="truncate font-display text-2xl font-extrabold text-white">
              {breed?.name.fr ?? "Classe Dofus"}
            </h2>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {canRender ? (
              <Pill tone={showRendered ? "emerald" : "slate"}>
                {isRendering ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
                {showRendered ? "Rendu classe" : isRendering ? "Rendu..." : "Prêt"}
              </Pill>
            ) : (
              <Pill tone="slate">
                <ImageOff className="h-3.5 w-3.5" /> Electron requis
              </Pill>
            )}
            <Pill tone="purple">Orientation {draft.orientation}</Pill>
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 items-end justify-center px-4">
          {showRendered ? (
            <motion.img
              key={renderedSkin!.slice(-28)}
              src={renderedSkin!}
              alt={breed ? `${breed.name.fr} rendu` : "Personnage Dofus rendu"}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.28 }}
              className="relative z-10 max-h-[390px] w-auto max-w-[90%] object-contain drop-shadow-[0_28px_40px_rgba(0,0,0,0.62)]"
              style={{
                filter: `drop-shadow(0 0 18px ${draft.colors.accent}44)`,
              }}
            />
          ) : showArtwork ? (
            <motion.img
              key={`${draft.breedId}-${draft.gender}`}
              src={previewImage!}
              alt={breed?.name.fr ?? "Classe Dofus"}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-10 max-h-[380px] w-auto max-w-[86%] object-contain drop-shadow-[0_28px_40px_rgba(0,0,0,0.55)]"
              style={{
                filter: `drop-shadow(0 0 18px ${draft.colors.accent}55) saturate(1.04)`,
              }}
            />
          ) : isRendering ? (
            <div className="relative z-10 mb-20 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300">
              <Loader2 className="h-4 w-4 animate-spin text-glow-cyan" /> Rendu du personnage...
            </div>
          ) : (
            <div className="relative z-10 mb-14 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-slate-400">
              Sélectionnez une classe.
            </div>
          )}
          {canRender && !showRendered && !isRendering && payload && (
            <div className="absolute bottom-4 z-20 rounded-xl border border-glow-ember/25 bg-glow-ember/10 px-3 py-2 text-xs text-glow-ember">
              Rendu live indisponible, affichage artwork.
            </div>
          )}
        </div>

        <div className="relative z-20 border-t border-white/10 bg-void-900/60 p-3 backdrop-blur-md">
          <div className="grid grid-cols-5 gap-2">
            {COSMETIC_SLOTS.map((slot) => {
              const item = draft.cosmetics[slot.id];
              return (
                <div key={slot.id} className="rounded-xl border border-white/10 bg-white/[0.035] p-2">
                  <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    <slot.icon className="h-3 w-3" /> {slot.label}
                  </div>
                  {item ? (
                    <div className="flex items-center gap-2">
                      <img src={item.icon} alt="" className="h-8 w-8 object-contain" />
                      <span className="min-w-0 truncate text-xs font-semibold text-slate-200">{item.name}</span>
                    </div>
                  ) : (
                    <span className="block truncate text-xs text-slate-600">Vide</span>
                  )}
                </div>
              );
            })}
          </div>
          {selected.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {selected.map(({ slot, item }) => (
                <Pill key={slot.id} tone="slate">
                  <slot.icon className="h-3.5 w-3.5" /> {item!.name}
                </Pill>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SkinMini({ colors }: { colors: Draft["colors"] }) {
  return (
    <div className="flex h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/10">
      {[colors.skin, colors.hair, colors.primary, colors.secondary, colors.accent].map((color) => (
        <span key={color} className="flex-1" style={{ background: color }} />
      ))}
    </div>
  );
}

function buildDraftSkinPayload(draft: Draft): SkinPayload | null {
  return buildSkinPayload(draft.breedId, {}, draft.gender, draft.orientation);
}

function resolveBarbofusUrl(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "https://barbofus.com/skinator";

  const id = trimmed.match(/(?:unity-skin\/|skin=)?(\d+)/)?.[1];
  if (id) return `https://barbofus.com/skinator?skin=${id}`;

  try {
    const url = new URL(trimmed);
    if (url.hostname === "barbofus.com" || url.hostname.endsWith(".barbofus.com")) return url.toString();
  } catch {
    /* not an URL */
  }

  return "https://barbofus.com/skinator";
}

function colorLabel(key: string) {
  const labels: Record<string, string> = {
    skin: "Peau",
    hair: "Cheveux",
    primary: "Primaire",
    secondary: "Secondaire",
    accent: "Accent",
  };
  return labels[key] ?? key;
}

function normalizeHex(value: string) {
  const clean = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(clean)) return clean;
  if (/^[0-9a-fA-F]{6}$/.test(clean)) return `#${clean}`;
  return clean.startsWith("#") ? clean : `#${clean.slice(0, 6)}`;
}

function cosmeticMatches(item: EquipmentLight, slot: SlotId) {
  const type = item.type.name.toLowerCase();
  const map: Record<SlotId, string[]> = {
    hat: ["chapeau", "coiffe"],
    cloak: ["cape"],
    shield: ["bouclier"],
    weapon: ["épée", "arc", "bâton", "baguette", "dague", "marteau", "hache", "arme"],
    petmount: ["familier", "montilier", "monture"],
  };
  return map[slot].some((part) => type.includes(part));
}

function breedName(breeds: Breed[] | undefined, id: number | null) {
  return breeds?.find((breed) => breed.id === id)?.name.fr ?? "Classe Dofus";
}

function choiceButton(active: boolean) {
  return clsx(
    "no-drag inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition",
    active
      ? "border-glow-purple/45 bg-glow-purple/20 text-white"
      : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200",
  );
}

function toolButton(tone: "purple" | "cyan" | "slate") {
  const tones = {
    purple: "border-glow-purple/40 bg-glow-purple/20 text-white hover:bg-glow-purple/30",
    cyan: "border-glow-cyan/35 bg-glow-cyan/15 text-glow-cyan hover:bg-glow-cyan/25",
    slate: "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10",
  };
  return `no-drag inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition ${tones[tone]}`;
}
