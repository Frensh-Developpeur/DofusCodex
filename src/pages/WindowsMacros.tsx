import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, Check, Copy, Download, Plus, Power, Save, Settings } from "../components/DofusIcons";
import DofusIcon, { type DofusIconName } from "../components/DofusIcon";
import { SectionHeader, fadeUp, Pill } from "../components/ui";
import { useStore, actions, storeApi } from "../store/store";

// Égalité de config en ignorant `updatedAt` (évite une boucle entre sauvegarde locale et
// adoption de la version cloud — seul le contenu compte).
function configEqual(a: NativeMacroConfig | null, b: NativeMacroConfig | null) {
  const strip = (c: (NativeMacroConfig & { updatedAt?: number }) | null) =>
    c ? JSON.stringify({ ...c, updatedAt: undefined }) : "";
  return strip(a) === strip(b);
}

type Macro = NativeMacroConfig["macros"][number];
type StepKind = "key" | "text" | "mouse" | "sleep";
type TargetMode = "active" | "dofus";

const HOTKEYS = [
  { value: "MButton", label: "Clic molette" },
  { value: "XButton1", label: "Souris 4" },
  { value: "XButton2", label: "Souris 5" },
  { value: "F13", label: "F13" },
  { value: "F14", label: "F14" },
  { value: "F15", label: "F15" },
  { value: "Ctrl+Alt+V", label: "Ctrl + Alt + V" },
  { value: "Ctrl+Alt+Enter", label: "Ctrl + Alt + Entrée" },
  { value: "Ctrl+Shift+V", label: "Ctrl + Shift + V" },
];

const KEYS = ["Space", "Ctrl+V", "Ctrl+A", "Delete", "Enter", "Escape", "Tab", "Backspace", "Up", "Down", "Left", "Right"];
const MOUSE = ["LeftClick", "RightClick", "MiddleClick"];

const PRESETS: Array<{
  id: string;
  label: string;
  summary: string;
  icon: DofusIconName;
  steps: NativeMacroStep[];
}> = [
  {
    id: "paste-send",
    label: "Coller et envoyer",
    summary: "Espace, collage, validation, fermeture",
    icon: "tick",
    steps: [{ key: "Space" }, { sleepMs: 150 }, { key: "Ctrl+V" }, { sleepMs: 100 }, { key: "Enter" }, { sleepMs: 100 }, { key: "Escape" }],
  },
  {
    id: "replace-paste",
    label: "Remplacer puis coller",
    summary: "Sélectionne le champ, efface, colle",
    icon: "reset",
    steps: [{ key: "Ctrl+A" }, { sleepMs: 60 }, { key: "Delete" }, { sleepMs: 60 }, { key: "Ctrl+V" }],
  },
  {
    id: "paste-only",
    label: "Coller seulement",
    summary: "Simple Ctrl+V global",
    icon: "copy",
    steps: [{ key: "Ctrl+V" }],
  },
  {
    id: "clear-field",
    label: "Vider le champ",
    summary: "Sélectionne tout puis supprime",
    icon: "closeRed",
    steps: [{ key: "Ctrl+A" }, { sleepMs: 60 }, { key: "Delete" }],
  },
  {
    id: "custom-text",
    label: "Texte fixe",
    summary: "Écrit un texte configurable",
    icon: "dofusQuest",
    steps: [{ text: "Texte à envoyer" }],
  },
];

const DEFAULT_CONFIG: NativeMacroConfig = {
  version: 1,
  enabled: true,
  suppressHotkeys: true,
  debounceMs: 180,
  focusDelayMs: 120,
  // Aucune macro par défaut : l'utilisateur crée ses raccourcis lui-même.
  macros: [],
};

function cloneSteps(steps: NativeMacroStep[]) {
  return steps.map((s) => ({ ...s }));
}

function cloneConfig(config: NativeMacroConfig): NativeMacroConfig {
  return JSON.parse(JSON.stringify(config));
}

function presetFor(macro: Macro) {
  const normalized = JSON.stringify(macro.steps.map((s) => ({ key: s.key, text: s.text, mouse: s.mouse, sleepMs: s.sleepMs, repeat: s.repeat })));
  return PRESETS.find((p) => JSON.stringify(p.steps.map((s) => ({ key: s.key, text: s.text, mouse: s.mouse, sleepMs: s.sleepMs, repeat: s.repeat }))) === normalized);
}

const MOUSE_LABELS: Record<string, string> = {
  MButton: "Clic molette",
  XButton1: "Souris 4",
  XButton2: "Souris 5",
  LButton: "Clic gauche",
  RButton: "Clic droit",
};

// Affichage lisible d'un déclencheur (combo clavier ou bouton souris).
function prettyHotkey(value: string): string {
  if (!value) return "Non défini";
  return MOUSE_LABELS[value] ?? value.replace(/\+/g, " + ");
}

function hotkeyLabel(value: string) {
  return HOTKEYS.find((h) => h.value === value)?.label ?? prettyHotkey(value);
}

// Nom de touche normalisé (style AutoHotkey, attendu par le helper natif). null = modificateur seul.
function normalizeKey(e: KeyboardEvent): string | null {
  const k = e.key;
  if (["Control", "Alt", "Shift", "Meta", "OS", "Dead", "AltGraph"].includes(k)) return null;
  const named: Record<string, string> = {
    " ": "Space", Spacebar: "Space", ArrowUp: "Up", ArrowDown: "Down", ArrowLeft: "Left",
    ArrowRight: "Right", Escape: "Escape", Enter: "Enter", Tab: "Tab", Backspace: "Backspace",
    Delete: "Delete", Insert: "Insert", Home: "Home", End: "End", PageUp: "PageUp", PageDown: "PageDown",
  };
  if (named[k]) return named[k];
  if (/^F\d{1,2}$/.test(k)) return k;
  if (k.length === 1) return k.toUpperCase();
  return k;
}

// Combo clavier complet (modificateurs + touche) depuis un événement clavier.
function comboFromEvent(e: KeyboardEvent): string | null {
  const key = normalizeKey(e);
  if (!key) return null;
  const mods: string[] = [];
  if (e.ctrlKey) mods.push("Ctrl");
  if (e.altKey) mods.push("Alt");
  if (e.shiftKey) mods.push("Shift");
  if (e.metaKey) mods.push("Win");
  return [...mods, key].join("+");
}

// Capteur de déclencheur : l'utilisateur clique puis presse une touche / un combo / un bouton
// souris (molette, Souris 4/5) → enregistré au format attendu par le moteur. Clic gauche = annuler.
function HotkeyCapture({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!listening) return;
    const onKey = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const combo = comboFromEvent(e);
      if (combo) {
        onChange(combo);
        setListening(false);
      }
    };
    const onMouse = (e: MouseEvent) => {
      const map: Record<number, string> = { 1: "MButton", 3: "XButton1", 4: "XButton2" };
      const btn = map[e.button];
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        onChange(btn);
        setListening(false);
      }
    };
    const onContext = (e: MouseEvent) => e.preventDefault();
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("mousedown", onMouse, true);
    window.addEventListener("contextmenu", onContext, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("mousedown", onMouse, true);
      window.removeEventListener("contextmenu", onContext, true);
    };
  }, [listening, onChange]);

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={() => setListening((v) => !v)}
        className={clsx(
          "flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition",
          listening
            ? "animate-pulse border-glow-cyan/60 bg-glow-cyan/15 text-glow-cyan"
            : "border-white/10 bg-void-900/80 text-white hover:border-glow-cyan/45",
        )}
      >
        <DofusIcon name="key" size={16} />
        {listening ? "Appuie sur une touche / un bouton…" : prettyHotkey(value)}
      </button>
      <p className="mt-1 text-[11px] text-slate-500">
        {listening
          ? "Touche, combo (Ctrl/Alt/Shift/Win) ou bouton souris · clic gauche pour annuler"
          : "Clique pour définir le déclencheur"}
      </p>
    </div>
  );
}

function stepKind(step: NativeMacroStep): StepKind {
  if (step.text != null) return "text";
  if (step.mouse != null) return "mouse";
  if (step.sleepMs != null) return "sleep";
  return "key";
}

function emptyStep(kind: StepKind): NativeMacroStep {
  if (kind === "text") return { text: "" };
  if (kind === "mouse") return { mouse: "LeftClick" };
  if (kind === "sleep") return { sleepMs: 100 };
  return { key: "Ctrl+V" };
}

function macroSummary(macro: Macro) {
  const preset = presetFor(macro);
  if (preset) return preset.summary;
  return macro.steps.map((step) => {
    if (step.text != null) return `Texte`;
    if (step.mouse) return step.mouse;
    if (step.sleepMs != null) return `${step.sleepMs} ms`;
    return step.key ?? "Touche";
  }).join(" / ");
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  }
}

function downloadConfig(config: NativeMacroConfig) {
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "dofuscodex-macros.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function WindowsMacros() {
  const [config, setConfig] = useState<NativeMacroConfig>(() => cloneConfig(DEFAULT_CONFIG));
  const [status, setStatus] = useState<NativeMacroStatus | null>(null);
  const [selectedId, setSelectedId] = useState(DEFAULT_CONFIG.macros[0]?.id ?? "");
  const [advanced, setAdvanced] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const selectedIndex = Math.max(0, config.macros.findIndex((m) => m.id === selectedId));
  const selected = config.macros[selectedIndex] ?? config.macros[0];
  const json = useMemo(() => JSON.stringify(config, null, 2), [config]);
  const activeMacros = config.macros.filter((m) => m.enabled).length;
  const dofusMacros = config.macros.filter((m) => m.enabled && m.target === "dofus").length;

  async function refreshStatus() {
    const s = await window.dofusCodex?.macrosStatus?.();
    if (s) setStatus(s);
  }

  // `loaded` passe à true une fois la config disque lue → empêche la sauvegarde auto d'écraser
  // le fichier avant le chargement initial.
  const loaded = useRef(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      // Source de vérité = le store (synchronisé cloud). À défaut, on migre l'ancienne config
      // disque vers le store. Sinon, config par défaut (vide).
      const fromStore = storeApi.getState().macroConfig;
      const disk = await window.dofusCodex?.macrosLoadConfig?.().catch(() => null);
      if (!alive) return;
      if (fromStore) {
        setConfig(fromStore);
        setSelectedId(fromStore.macros[0]?.id ?? "");
        window.dofusCodex?.macrosSaveConfig?.(fromStore).catch(() => {}); // aligne la copie disque
      } else if (disk && Array.isArray(disk.macros)) {
        setConfig(disk);
        setSelectedId(disk.macros[0]?.id ?? "");
        actions.setMacroConfig(disk); // migration disque → store → cloud
      }
      loaded.current = true;
    })();
    refreshStatus().catch(() => {});
    const timer = window.setInterval(() => refreshStatus().catch(() => {}), 1500);
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, []);

  // Sauvegarde AUTOMATIQUE (debouncée) : toute modif (ajout, suppression, édition) est persistée
  // sur DISQUE (pour le helper natif) ET dans le STORE (→ synchro cloud). Survit au rechargement
  // et se retrouve sur les autres appareils.
  useEffect(() => {
    if (!loaded.current) return;
    const t = window.setTimeout(() => {
      window.dofusCodex?.macrosSaveConfig?.(config).catch(() => {});
      actions.setMacroConfig(config);
    }, 400);
    return () => window.clearTimeout(t);
  }, [config]);

  // Synchro cloud → appareil : si un AUTRE appareil modifie la config (ou au 1er pull), on
  // l'adopte et on réaligne la copie disque. Comparaison hors `updatedAt` → pas de boucle.
  const storeConfig = useStore((s) => s.macroConfig);
  useEffect(() => {
    if (!loaded.current || !storeConfig || configEqual(storeConfig, config)) return;
    setConfig(storeConfig);
    setSelectedId((id) => (storeConfig.macros.some((m) => m.id === id) ? id : storeConfig.macros[0]?.id ?? ""));
    window.dofusCodex?.macrosSaveConfig?.(storeConfig).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeConfig]);

  function patchConfig(patch: Partial<NativeMacroConfig>) {
    setConfig((current) => ({ ...current, ...patch }));
  }

  function patchMacro(index: number, patch: Partial<Macro>) {
    setConfig((current) => ({
      ...current,
      macros: current.macros.map((macro, i) => (i === index ? { ...macro, ...patch } : macro)),
    }));
  }

  function patchStep(macroIndex: number, stepIndex: number, patch: NativeMacroStep) {
    setConfig((current) => ({
      ...current,
      macros: current.macros.map((macro, i) =>
        i === macroIndex
          ? { ...macro, steps: macro.steps.map((step, j) => (j === stepIndex ? patch : step)) }
          : macro,
      ),
    }));
  }

  function createMacro(preset?: typeof PRESETS[number]) {
    const macro: Macro = {
      id: `macro-${Date.now()}`,
      enabled: true,
      label: preset?.label ?? "Nouveau raccourci",
      hotkey: nextHotkey(config.macros.length),
      target: "active",
      steps: cloneSteps(preset?.steps ?? [{ key: "Ctrl+V" }]),
    };
    setConfig((current) => ({ ...current, macros: [...current.macros, macro] }));
    setSelectedId(macro.id);
  }

  function applyPreset(index: number, preset: typeof PRESETS[number]) {
    patchMacro(index, { label: preset.label, steps: cloneSteps(preset.steps) });
  }

  function removeMacro(index: number) {
    setConfig((current) => {
      const next = current.macros.filter((_, i) => i !== index);
      setSelectedId(next[Math.max(0, index - 1)]?.id ?? next[0]?.id ?? "");
      return { ...current, macros: next };
    });
  }

  function addStep(macroIndex: number) {
    setConfig((current) => ({
      ...current,
      macros: current.macros.map((macro, i) =>
        i === macroIndex ? { ...macro, steps: [...macro.steps, { sleepMs: 100 }] } : macro,
      ),
    }));
  }

  function removeStep(macroIndex: number, stepIndex: number) {
    setConfig((current) => ({
      ...current,
      macros: current.macros.map((macro, i) =>
        i === macroIndex ? { ...macro, steps: macro.steps.filter((_, j) => j !== stepIndex) } : macro,
      ),
    }));
  }

  function moveStep(macroIndex: number, stepIndex: number, direction: -1 | 1) {
    setConfig((current) => ({
      ...current,
      macros: current.macros.map((macro, i) => {
        if (i !== macroIndex) return macro;
        const target = stepIndex + direction;
        if (target < 0 || target >= macro.steps.length) return macro;
        const steps = [...macro.steps];
        const [step] = steps.splice(stepIndex, 1);
        steps.splice(target, 0, step);
        return { ...macro, steps };
      }),
    }));
  }

  async function save() {
    setBusy(true);
    try {
      const clean = await window.dofusCodex?.macrosSaveConfig?.(config);
      if (clean) setConfig(clean);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1400);
      await refreshStatus();
    } finally {
      setBusy(false);
    }
  }

  async function start() {
    setBusy(true);
    try {
      await window.dofusCodex?.macrosStart?.(config);
      await refreshStatus();
    } finally {
      setBusy(false);
    }
  }

  async function stop() {
    setBusy(true);
    try {
      await window.dofusCodex?.macrosStop?.();
      await refreshStatus();
    } finally {
      setBusy(false);
    }
  }

  async function copyJson() {
    if (await copyText(json)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    }
  }

  const statusTone = status?.running ? "emerald" : status?.available ? "gold" : "rose";
  const statusLabel = status?.running ? "Actif" : status?.available ? "Prêt" : "Indisponible";

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" className="pb-12">
      <SectionHeader
        eyebrow="Outils Windows"
        title="Macros Windows"
        subtitle="Raccourcis globaux natifs, configurables en mode assisté ou avancé."
        right={
          <div className="flex flex-wrap gap-2">
            <button
              onClick={save}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl border border-glow-cyan/35 bg-glow-cyan/15 px-3 py-2 text-sm font-semibold text-white transition hover:bg-glow-cyan/25 disabled:opacity-60"
            >
              {saved ? <Check className="h-4 w-4 text-glow-emerald" /> : <Save className="h-4 w-4" />}
              {saved ? "Sauvé" : "Sauvegarder"}
            </button>
            {status?.running ? (
              <button
                onClick={stop}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-xl border border-glow-rose/35 bg-glow-rose/15 px-3 py-2 text-sm font-semibold text-white transition hover:bg-glow-rose/25 disabled:opacity-60"
              >
                <Power className="h-4 w-4" />
                Arrêter
              </button>
            ) : (
              <button
                onClick={start}
                disabled={busy || status?.platform !== "win32" || status?.available === false}
                className="inline-flex items-center gap-2 rounded-xl border border-glow-emerald/35 bg-glow-emerald/15 px-3 py-2 text-sm font-semibold text-white transition hover:bg-glow-emerald/25 disabled:opacity-50"
              >
                <Power className="h-4 w-4" />
                Démarrer
              </button>
            )}
          </div>
        }
      />

      <div className="mb-5 grid gap-3 lg:grid-cols-4">
        <StatusCard icon="lightning" label="Moteur" value={statusLabel} tone={statusTone} />
        <StatusCard icon="key" label="Raccourcis" value={`${activeMacros} / ${config.macros.length}`} tone="cyan" />
        <StatusCard icon="sablier" label="Sécurité clic" value={`${config.debounceMs} ms`} tone="gold" />
        <StatusCard icon="target" label="Cible Dofus" value={dofusMacros ? `${dofusMacros} actif(s)` : "non"} tone={dofusMacros ? "rose" : "purple"} />
      </div>

      {dofusMacros > 0 && (
        <div className="mb-5 rounded-2xl border border-glow-rose/30 bg-glow-rose/10 p-4 text-sm leading-relaxed text-slate-300">
          <span className="font-semibold text-glow-rose">Ciblage Dofus activé.</span>{" "}
          Les macros concernées ramènent Dofus au premier plan avant d'envoyer les actions. L'utilisateur reste seul responsable
          des raccourcis configurés et du respect des règles des logiciels ciblés.
        </div>
      )}

      {status?.platform && status.platform !== "win32" && (
        <div className="mb-5 rounded-2xl border border-glow-gold/25 bg-glow-gold/10 p-4 text-sm text-glow-gold">
          Le moteur natif tourne uniquement dans l'application Windows. La configuration reste modifiable ici.
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.8fr)_minmax(420px,1fr)]">
        <section className="space-y-5">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-white">Ajouter un raccourci</h2>
                <p className="text-xs text-slate-500">Choisis un modèle, puis ajuste la touche et la cible.</p>
              </div>
              <button
                onClick={() => createMacro()}
                className="inline-flex items-center gap-2 rounded-xl border border-glow-purple/35 bg-glow-purple/15 px-3 py-2 text-sm font-semibold text-white transition hover:bg-glow-purple/25"
              >
                <Plus className="h-4 w-4" />
                Ajouter
              </button>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => createMacro(preset)}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left transition hover:border-glow-cyan/35 hover:bg-white/[0.06]"
                >
                  <DofusIcon name={preset.icon} size={22} />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-white">{preset.label}</span>
                    <span className="block truncate text-xs text-slate-500">{preset.summary}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h2 className="font-display text-lg font-bold text-white">Mes raccourcis</h2>
            <div className="mt-4 space-y-2">
              {config.macros.length === 0 && (
                <p className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-500">
                  Aucun raccourci configuré.
                </p>
              )}
              {config.macros.map((macro, index) => (
                <button
                  key={macro.id}
                  onClick={() => setSelectedId(macro.id)}
                  className={clsx(
                    "w-full rounded-xl border p-3 text-left transition",
                    selected?.id === macro.id
                      ? "border-glow-cyan/45 bg-glow-cyan/12"
                      : "border-white/10 bg-white/[0.025] hover:bg-white/[0.05]",
                  )}
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <DofusIcon name={macro.target === "dofus" ? "target" : "eye"} size={17} />
                        <span className="truncate font-semibold text-white">{macro.label}</span>
                      </span>
                      <span className="mt-1 block truncate text-xs text-slate-500">
                        {hotkeyLabel(macro.hotkey)} · {macro.target === "dofus" ? "Dofus" : "fenêtre active"} · {macroSummary(macro)}
                      </span>
                    </span>
                    <span className={clsx("rounded-full px-2 py-0.5 text-[11px] font-bold", macro.enabled ? "bg-glow-emerald/15 text-glow-emerald" : "bg-white/5 text-slate-500")}>
                      {macro.enabled ? "ON" : "OFF"}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-5">
          {selected ? (
            <div className="glass rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-bold text-white">{selected.label}</h2>
                  <p className="text-sm text-slate-500">{macroSummary(selected)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={selected.enabled}
                      onChange={(e) => patchMacro(selectedIndex, { enabled: e.target.checked })}
                      className="h-4 w-4 accent-glow-cyan"
                    />
                    Actif
                  </label>
                  <button
                    onClick={() => removeMacro(selectedIndex)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition hover:border-glow-rose/40 hover:text-glow-rose"
                    aria-label="Supprimer le raccourci"
                  >
                    <DofusIcon name="closeRed" size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_200px]">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nom</span>
                  <input
                    value={selected.label}
                    onChange={(e) => patchMacro(selectedIndex, { label: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-void-900/80 px-3 py-2 text-sm text-white outline-none transition focus:border-glow-cyan/60"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Déclencheur</span>
                  <HotkeyCapture
                    value={selected.hotkey}
                    onChange={(hotkey) => patchMacro(selectedIndex, { hotkey })}
                  />
                </label>
              </div>

              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Action</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {PRESETS.map((preset) => {
                    const active = presetFor(selected)?.id === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => applyPreset(selectedIndex, preset)}
                        className={clsx(
                          "flex items-center gap-3 rounded-xl border p-3 text-left transition",
                          active ? "border-glow-cyan/45 bg-glow-cyan/15" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                        )}
                      >
                        <DofusIcon name={preset.icon} size={20} />
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-white">{preset.label}</span>
                          <span className="block truncate text-xs text-slate-500">{preset.summary}</span>
                        </span>
                        {active && <Check className="ml-auto h-4 w-4 text-glow-cyan" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Cible</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <TargetButton
                    active={(selected.target ?? "active") === "active"}
                    icon="eye"
                    title="Fenêtre active"
                    hint="N'échange pas le focus"
                    onClick={() => patchMacro(selectedIndex, { target: "active" })}
                  />
                  <TargetButton
                    active={selected.target === "dofus"}
                    icon="target"
                    title="Fenêtre Dofus"
                    hint="Cherche Dofus avant l'envoi"
                    onClick={() => patchMacro(selectedIndex, { target: "dofus" })}
                  />
                </div>
                {selected.target === "dofus" && (
                  <p className="mt-3 rounded-xl border border-glow-rose/25 bg-glow-rose/10 px-3 py-2 text-xs leading-relaxed text-slate-300">
                    Si aucune fenêtre Dofus n'est trouvée, ce raccourci s'arrête sans écrire dans la fenêtre active.
                  </p>
                )}
              </div>

              <button
                onClick={() => setAdvanced((v) => !v)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.07]"
              >
                <Settings className="h-4 w-4" />
                {advanced ? "Masquer les réglages avancés" : "Réglages avancés"}
              </button>
            </div>
          ) : null}

          {advanced && selected && (
            <AdvancedPanel
              config={config}
              macro={selected}
              macroIndex={selectedIndex}
              json={json}
              copied={copied}
              onPatchConfig={patchConfig}
              onPatchStep={patchStep}
              onAddStep={addStep}
              onRemoveStep={removeStep}
              onMoveStep={moveStep}
              onCopyJson={copyJson}
              onDownload={() => downloadConfig(config)}
            />
          )}

          <section className="glass rounded-2xl p-5">
            <h2 className="font-display text-lg font-bold text-white">Moteur</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-400">
              <p>Par défaut, les actions partent vers la fenêtre Windows déjà active. Le ciblage Dofus est optionnel, explicite et isolé par raccourci.</p>
              <p>DofusCodex fournit un moteur local de raccourcis. Chaque utilisateur reste responsable de sa configuration et de son usage.</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Pill tone="cyan">Global hooks</Pill>
              <Pill tone="emerald">SendInput</Pill>
              <Pill tone="slate">Sans AHK</Pill>
            </div>
          </section>
        </section>
      </div>
    </motion.div>
  );
}

function nextHotkey(count: number) {
  return HOTKEYS[Math.min(count, HOTKEYS.length - 1)]?.value ?? "F13";
}

function StatusCard({ icon, label, value, tone }: { icon: DofusIconName; label: string; value: string; tone: "emerald" | "gold" | "rose" | "cyan" | "purple" }) {
  const toneClass = {
    emerald: "text-glow-emerald",
    gold: "text-glow-gold",
    rose: "text-glow-rose",
    cyan: "text-glow-cyan",
    purple: "text-glow-violet",
  }[tone];
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <DofusIcon name={icon} size={16} />
        {label}
      </div>
      <p className={`mt-2 font-display text-lg font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}

function TargetButton({ active, icon, title, hint, onClick }: { active: boolean; icon: DofusIconName; title: string; hint: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center gap-3 rounded-xl border p-3 text-left transition",
        active ? "border-glow-cyan/45 bg-glow-cyan/15" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
      )}
    >
      <DofusIcon name={icon} size={20} />
      <span>
        <span className="block text-sm font-semibold text-white">{title}</span>
        <span className="block text-xs text-slate-500">{hint}</span>
      </span>
      {active && <Check className="ml-auto h-4 w-4 text-glow-cyan" />}
    </button>
  );
}

function AdvancedPanel({
  config,
  macro,
  macroIndex,
  json,
  copied,
  onPatchConfig,
  onPatchStep,
  onAddStep,
  onRemoveStep,
  onMoveStep,
  onCopyJson,
  onDownload,
}: {
  config: NativeMacroConfig;
  macro: Macro;
  macroIndex: number;
  json: string;
  copied: boolean;
  onPatchConfig: (patch: Partial<NativeMacroConfig>) => void;
  onPatchStep: (macroIndex: number, stepIndex: number, step: NativeMacroStep) => void;
  onAddStep: (macroIndex: number) => void;
  onRemoveStep: (macroIndex: number, stepIndex: number) => void;
  onMoveStep: (macroIndex: number, stepIndex: number, direction: -1 | 1) => void;
  onCopyJson: () => void;
  onDownload: () => void;
}) {
  return (
    <section className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2.5">
        <Settings className="h-5 w-5 text-glow-cyan" />
        <h2 className="font-display text-lg font-bold text-white">Avancé</h2>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Toggle
          label="Moteur activé"
          checked={config.enabled}
          onChange={(enabled) => onPatchConfig({ enabled })}
        />
        <Toggle
          label="Bloquer le déclencheur"
          checked={config.suppressHotkeys}
          onChange={(suppressHotkeys) => onPatchConfig({ suppressHotkeys })}
        />
        <NumberField label="Anti double-clic" value={config.debounceMs} min={0} max={5000} onChange={(debounceMs) => onPatchConfig({ debounceMs })} />
        <NumberField label="Délai focus Dofus" value={config.focusDelayMs ?? 120} min={0} max={1000} onChange={(focusDelayMs) => onPatchConfig({ focusDelayMs })} />
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Étapes du raccourci</p>
          <button
            onClick={() => onAddStep(macroIndex)}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.07]"
          >
            <Plus className="h-3.5 w-3.5" />
            Étape
          </button>
        </div>
        {macro.steps.map((step, stepIndex) => (
          <StepEditor
            key={stepIndex}
            step={step}
            onChange={(next) => onPatchStep(macroIndex, stepIndex, next)}
            onRemove={() => onRemoveStep(macroIndex, stepIndex)}
            onMoveUp={() => onMoveStep(macroIndex, stepIndex, -1)}
            onMoveDown={() => onMoveStep(macroIndex, stepIndex, 1)}
            canMoveUp={stepIndex > 0}
            canMoveDown={stepIndex < macro.steps.length - 1}
          />
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4">
          <div>
            <h3 className="font-display text-base font-bold text-white">JSON</h3>
            <p className="text-xs text-slate-500">Configuration brute lue par le helper.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onCopyJson}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.07]"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-glow-emerald" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copié" : "Copier"}
            </button>
            <button
              onClick={onDownload}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.07]"
            >
              <Download className="h-3.5 w-3.5" />
              JSON
            </button>
          </div>
        </div>
        <pre className="max-h-[360px] overflow-auto bg-void-950/80 p-4 text-xs leading-relaxed text-slate-200">
          <code>{json}</code>
        </pre>
      </div>
    </section>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <span className="block text-sm font-semibold text-white">{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-glow-cyan" />
    </label>
  );
}

function NumberField({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return (
    <label className="block rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <span className="text-sm font-semibold text-white">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-void-900/80 px-3 py-2 text-sm text-white outline-none transition focus:border-glow-cyan/60"
      />
    </label>
  );
}

function StepEditor({
  step,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: {
  step: NativeMacroStep;
  onChange: (step: NativeMacroStep) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const kind = stepKind(step);
  return (
    <div className="grid gap-2 rounded-xl border border-white/10 bg-white/[0.025] p-3 md:grid-cols-[132px_minmax(0,1fr)_84px_82px_40px]">
      <select
        value={kind}
        onChange={(e) => onChange(emptyStep(e.target.value as StepKind))}
        className="rounded-lg border border-white/10 bg-void-900/80 px-2 py-2 text-sm text-white outline-none transition focus:border-glow-cyan/60"
      >
        <option value="key">Touche</option>
        <option value="text">Texte</option>
        <option value="mouse">Souris</option>
        <option value="sleep">Pause</option>
      </select>

      {kind === "key" && (
        <input
          list="macro-keys"
          value={step.key ?? ""}
          onChange={(e) => onChange({ ...step, key: e.target.value })}
          className="rounded-lg border border-white/10 bg-void-900/80 px-2 py-2 text-sm text-white outline-none transition focus:border-glow-cyan/60"
        />
      )}
      {kind === "text" && (
        <input
          value={step.text ?? ""}
          onChange={(e) => onChange({ text: e.target.value, repeat: step.repeat })}
          placeholder="Texte à écrire"
          className="rounded-lg border border-white/10 bg-void-900/80 px-2 py-2 text-sm text-white outline-none transition focus:border-glow-cyan/60"
        />
      )}
      {kind === "mouse" && (
        <select
          value={step.mouse ?? "LeftClick"}
          onChange={(e) => onChange({ ...step, mouse: e.target.value })}
          className="rounded-lg border border-white/10 bg-void-900/80 px-2 py-2 text-sm text-white outline-none transition focus:border-glow-cyan/60"
        >
          {MOUSE.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      )}
      {kind === "sleep" && (
        <input
          type="number"
          min={0}
          max={10000}
          value={step.sleepMs ?? 0}
          onChange={(e) => onChange({ sleepMs: Number(e.target.value) || 0 })}
          className="rounded-lg border border-white/10 bg-void-900/80 px-2 py-2 text-sm text-white outline-none transition focus:border-glow-cyan/60"
        />
      )}

      <input
        type="number"
        min={1}
        max={50}
        value={step.repeat ?? 1}
        onChange={(e) => onChange({ ...step, repeat: Number(e.target.value) || 1 })}
        className="rounded-lg border border-white/10 bg-void-900/80 px-2 py-2 text-sm text-white outline-none transition focus:border-glow-cyan/60"
        aria-label="Répétitions"
      />
      <div className="flex gap-1">
        <button
          onClick={onMoveUp}
          disabled={!canMoveUp}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 transition hover:border-glow-cyan/40 hover:text-glow-cyan disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-slate-400"
          aria-label="Monter l'étape"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={!canMoveDown}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 transition hover:border-glow-cyan/40 hover:text-glow-cyan disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-slate-400"
          aria-label="Descendre l'étape"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
      </div>
      <button
        onClick={onRemove}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 transition hover:border-glow-rose/40 hover:text-glow-rose"
        aria-label="Supprimer l'étape"
      >
        <DofusIcon name="closeRed" size={16} />
      </button>
      <datalist id="macro-keys">
        {KEYS.map((k) => <option key={k} value={k} />)}
      </datalist>
    </div>
  );
}
