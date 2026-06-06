import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "../components/DofusIcons";
import { useQueries, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import {
  X,
  ChevronRight,
  Shuffle,
  Save,
  ChevronDown,
  dofusUiIcon,
  type DofusUiIcon,
} from "../components/DofusIcons";
import { getEquipment, getSet, type EquipmentLight } from "../api/dofusdude";
import {
  listBreeds,
  getClassSpells,
  type Breed,
  type ClassSpell,
  type SpellDamage,
  type StatTier,
} from "../api/dofusdb";
import {
  emptyStats,
  emptyTarget,
  applyItemEffect,
  estimateSpell,
  estimateDamageValue,
  spellLevelAt,
  ELEMENTS,
  ELEMENT_TONE,
  type CharacterStats,
  type TargetStats,
  type DamageLine,
} from "../lib/damage";
import { baseApForLevel, baseHpForLevel, baseMpForLevel, statPointsForLevel, pointsForCarac } from "../lib/dofusStats";
import { levelTone } from "../data/meta";
import { classIllus } from "../data/classIllus";
import { buildSkinPayload, renderSkin, skinKey } from "../lib/skinRender";
import { actions, useStore, type Build, type BuildSlots } from "../store/store";
import { Pill, Spinner, DofusLoader } from "../components/ui";
import DofusIcon, { effectIconFromName, elementIcon, type DofusIconName } from "../components/DofusIcon";

// Icône Dofus pour les caractéristiques d'un sort (par libellé).
const CARAC_ROW_ICON: Record<string, DofusIconName> = {
  Coût: "pa",
  Portée: "po",
  Critique: "critique",
  Relance: "sablier",
  Zone: "areaCircle",
  Lancer: "areaLine",
};

const ICON_FORCE = dofusUiIcon("terre");
const ICON_INTELLIGENCE = dofusUiIcon("feu");
const ICON_CHANCE = dofusUiIcon("eau");
const ICON_AGILITE = dofusUiIcon("air");
const ICON_VITALITE = dofusUiIcon("pv");
const ICON_SAGESSE = dofusUiIcon("sagesse");
const ICON_PUISSANCE = dofusUiIcon("puissance");
const ICON_WEAPON = dofusUiIcon("weapon");
const ICON_MULTI_ELEMENT = dofusUiIcon("multiElement");
const ICON_DMG_ENVOYES = dofusUiIcon("dmgEnvoyes");
const ICON_DMG_SORT = dofusUiIcon("dmgSort");
const ICON_DMG_MELEE = dofusUiIcon("dmgMelee");
const ICON_DMG_DISTANCE = dofusUiIcon("dmgDistance");
const ICON_CRITIQUE = dofusUiIcon("critique");
const ICON_SOIN = dofusUiIcon("soin");
const ICON_RESISTANCE = dofusUiIcon("bouclier");
const ICON_PA = dofusUiIcon("pa");
const ICON_PM = dofusUiIcon("pm");
const ICON_PO = dofusUiIcon("po");
const ICON_TACLE = dofusUiIcon("tacle");
const ICON_PROSPECTION = dofusUiIcon("pp");
const ICON_INVOCATION = dofusUiIcon("invocation");
const ICON_INITIATIVE = dofusUiIcon("initiative");
const ICON_PODS = dofusUiIcon("pod");
const ICON_NEUTRE = dofusUiIcon("neutre");
const ICON_TOUR = dofusUiIcon("tour");
const ICON_ZONE = dofusUiIcon("areaCircle");
const ICON_LINE = dofusUiIcon("areaLine");
const ICON_SPECIAL = dofusUiIcon("etoile");
import SlotPicker from "../components/SlotPicker";

interface SlotDef {
  key: string;
  label: string;
  icon: DofusUiIcon;
  types: string[];
}

type RoomSpell = {
  label: string;
  description?: string;
  fRank?: number;
  sRank?: number;
  tRank?: number;
  caracs?: RoomCarac[];
  lines?: Record<string, Record<string, RoomDamageEffect>>[];
  effects?: RoomEffects | RoomRankedEffects;
};

type RoomCarac = {
  pa?: number;
  po?: string;
  cc?: number;
  area?: { type?: string; size?: number } | false;
  alterableRange?: boolean;
  line?: boolean;
  diagonale?: boolean;
  throughObstacles?: boolean;
  perTurn?: number;
  perTurnPerPlayer?: number;
  stack?: number;
  interval?: number;
};

type RoomDamageEffect = {
  normal?: { min: number; max: number };
  critical?: { min: number; max: number };
  label?: { fr?: string };
};

type RoomEffectOption = {
  label?: string;
  stats?: Record<string, number>;
};

type RoomEffects = {
  description?: string;
  options?: RoomEffectOption[];
};

type RoomRankedEffects = Partial<Record<"fRank" | "sRank" | "tRank", RoomEffects>>;

type RoomLineEstimate = {
  label: string;
  stat: string;
  baseMin: number;
  baseMax: number;
  baseCritMin?: number;
  baseCritMax?: number;
  min: number;
  max: number;
  critMin?: number;
  critMax?: number;
};

const SLOTS: SlotDef[] = [
  { key: "hat", label: "Chapeau", icon: dofusUiIcon("slotHat"), types: ["hat"] },
  { key: "cloak", label: "Cape", icon: dofusUiIcon("slotCloak"), types: ["cloak"] },
  { key: "amulet", label: "Amulette", icon: dofusUiIcon("slotAmulet"), types: ["amulet"] },
  { key: "ring1", label: "Anneau 1", icon: dofusUiIcon("slotRing"), types: ["ring"] },
  { key: "ring2", label: "Anneau 2", icon: dofusUiIcon("slotRing"), types: ["ring"] },
  { key: "belt", label: "Ceinture", icon: dofusUiIcon("slotBelt"), types: ["belt"] },
  { key: "boots", label: "Bottes", icon: dofusUiIcon("slotBoots"), types: ["boots"] },
  { key: "shield", label: "Bouclier", icon: dofusUiIcon("slotShield"), types: ["shield"] },
  { key: "weapon", label: "Arme", icon: dofusUiIcon("slotWeapon"), types: ["sword", "bow", "staff", "wand", "dagger", "hammer", "axe"] },
  { key: "petmount", label: "Familier/Monture", icon: dofusUiIcon("slotPet"), types: ["pet", "dragoturkey", "petsmount"] },
  ...Array.from({ length: 6 }).map((_, i) => ({
    key: `dofus${i + 1}`,
    label: `Dofus/Trophée ${i + 1}`,
    icon: dofusUiIcon("slotDofus"),
    types: ["dofus", "trophy", "prysmaradite"],
  })),
];

function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function roomClassSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function flattenRoomSpells(data: unknown): RoomSpell[] {
  const root = data && typeof data === "object" ? (data as { spells?: unknown }).spells : null;
  if (!root || typeof root !== "object") return [];
  const out: RoomSpell[] = [];
  for (const pair of Object.values(root as Record<string, unknown>)) {
    if (Array.isArray(pair)) out.push(...(pair.filter((s) => s && typeof s === "object") as RoomSpell[]));
  }
  return out;
}

function findRoomSpell(spells: RoomSpell[], name: string): RoomSpell | undefined {
  const wanted = normalizeName(name);
  return spells.find((spell) => normalizeName(spell.label) === wanted);
}

// Caractéristiques réparties + couleur d'accent + tier API correspondant.
type CaracKey = "strength" | "intelligence" | "chance" | "agility" | "vitality" | "wisdom";
const CARACS: { key: CaracKey; label: string; sub: string; tone: string; icon: DofusUiIcon; tier: keyof Breed }[] = [
  { key: "strength", label: "Force", sub: "Terre / Neutre", tone: "text-amber-400", icon: ICON_FORCE, tier: "statsPointsForStrength" },
  { key: "intelligence", label: "Intelligence", sub: "Feu", tone: "text-glow-ember", icon: ICON_INTELLIGENCE, tier: "statsPointsForIntelligence" },
  { key: "chance", label: "Chance", sub: "Eau", tone: "text-glow-cyan", icon: ICON_CHANCE, tier: "statsPointsForChance" },
  { key: "agility", label: "Agilité", sub: "Air", tone: "text-glow-emerald", icon: ICON_AGILITE, tier: "statsPointsForAgility" },
  { key: "vitality", label: "Vitalité", sub: "Points de vie", tone: "text-glow-rose", icon: ICON_VITALITE, tier: "statsPointsForVitality" },
  { key: "wisdom", label: "Sagesse", sub: "Résistances / PM", tone: "text-glow-violet", icon: ICON_SAGESSE, tier: "statsPointsForWisdom" },
];

// Icône + couleur d'une ligne de bonus (panoplie / effet) selon son intitulé, pour
// que chaque ligne soit identifiable d'un coup d'œil (au lieu d'un bloc monochrome).
function effectVisual(label: string): { icon: DofusUiIcon; tone: string } {
  const n = label.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const el = n.includes("terre")
    ? "text-amber-400"
    : n.includes("feu")
      ? "text-glow-ember"
      : n.includes("eau")
        ? "text-glow-cyan"
        : n.includes("air")
          ? "text-glow-emerald"
          : n.includes("neutre")
            ? "text-slate-300"
            : null;
  if (n.includes("resistance") || n.includes("renvoi")) return { icon: ICON_RESISTANCE, tone: el ?? "text-glow-violet" };
  if (n.includes("dommage") && n.includes("critique")) return { icon: ICON_CRITIQUE, tone: "text-glow-gold" };
  if (n.includes("critique")) return { icon: ICON_CRITIQUE, tone: "text-glow-gold" };
  if (n.includes("dommage") || n.includes("puissance")) return { icon: ICON_WEAPON, tone: el ?? "text-glow-ember" };
  if (n.includes("soin")) return { icon: ICON_SOIN, tone: "text-glow-emerald" };
  if (n.includes("vitalit") || n.includes(" pv") || n.includes("vie")) return { icon: ICON_VITALITE, tone: "text-glow-rose" };
  if (n.includes("sagesse")) return { icon: ICON_SAGESSE, tone: "text-glow-violet" };
  if (n.includes("force")) return { icon: ICON_FORCE, tone: "text-amber-400" };
  if (n.includes("intelligence")) return { icon: ICON_INTELLIGENCE, tone: "text-glow-ember" };
  if (n.includes("chance")) return { icon: ICON_CHANCE, tone: "text-glow-cyan" };
  if (n.includes("agilit")) return { icon: ICON_AGILITE, tone: "text-glow-emerald" };
  if (/\bpa\b/.test(n) || n.includes("action")) return { icon: ICON_PA, tone: "text-glow-cyan" };
  if (/\bpm\b/.test(n) || n.includes("mouvement")) return { icon: ICON_PM, tone: "text-glow-emerald" };
  if (/\bpo\b/.test(n) || n.includes("portee")) return { icon: ICON_PO, tone: "text-glow-violet" };
  if (n.includes("tacle")) return { icon: ICON_TACLE, tone: "text-amber-400" };
  if (n.includes("fuite")) return { icon: ICON_AGILITE, tone: "text-glow-emerald" };
  if (n.includes("prospection")) return { icon: ICON_PROSPECTION, tone: "text-glow-gold" };
  if (n.includes("invocation")) return { icon: ICON_INVOCATION, tone: "text-glow-violet" };
  if (n.includes("initiative")) return { icon: ICON_INITIATIVE, tone: "text-glow-cyan" };
  if (n.includes("pods")) return { icon: ICON_PODS, tone: "text-slate-300" };
  return { icon: ICON_NEUTRE, tone: "text-slate-400" };
}

type Caracs = Record<CaracKey, number>;
const ZERO_CARACS: Caracs = { strength: 0, intelligence: 0, chance: 0, agility: 0, vitality: 0, wisdom: 0 };

// Exotage (forgemagie exotique) : une stat bonus posée sur un item.
type ExoType = "" | "pa" | "pm" | "po" | "invo";
const PARCH_MAX = 100;
const DOFUS_SLOT_KEYS = SLOTS.filter((s) => s.key.startsWith("dofus")).map((s) => s.key);
const DOFUS_SLOTS = SLOTS.filter((s) => s.key.startsWith("dofus"));
// Paper-doll : colonnes gauche/droite façon inventaire Dofus (DofusRoom-like).
const LEFT_KEYS = ["hat", "amulet", "ring1", "ring2", "belt"];
const RIGHT_KEYS = ["cloak", "weapon", "shield", "boots", "petmount"];
const byKey = (k: string) => SLOTS.find((s) => s.key === k)!;
const LEFT_SLOTS = LEFT_KEYS.map(byKey);
const RIGHT_SLOTS = RIGHT_KEYS.map(byKey);

// Cycle d'exo au clic (— → PA → PM → PO → Invoc. → —).
const EXO_CYCLE: ExoType[] = ["", "pa", "pm", "po", "invo"];
const EXO_LABEL: Record<ExoType, string> = { "": "", pa: "PA", pm: "PM", po: "PO", invo: "Inv" };

function multiSlotGroup(key: string): string[] | null {
  if (key === "ring1" || key === "ring2") return ["ring1", "ring2"];
  if (key.startsWith("dofus")) return DOFUS_SLOT_KEYS;
  return null;
}

// Wrapper routeur : résout le build depuis l'URL et redirige vers la galerie si introuvable.
export default function Builder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const build = useStore((s) => s.builds.find((b) => b.id === id));

  useEffect(() => {
    if (!build) navigate("/builder", { replace: true });
  }, [build, navigate]);

  if (!build) return null;
  // `key` force un remontage propre quand on passe d'un build à un autre.
  return <BuildEditor key={build.id} build={build} />;
}

function BuildEditor({ build }: { build: Build }) {
  const navigate = useNavigate();
  const [breedId, setBreedId] = useState<number | null>(build.breedId ?? null);
  const [level, setLevel] = useState(Math.min(200, Math.max(1, build.level ?? 200)));
  const [caracs, setCaracs] = useState<Caracs>({ ...ZERO_CARACS, ...(build.caracs as Partial<Caracs> | undefined) });
  const [parch, setParch] = useState<Caracs>({ ...ZERO_CARACS, ...(build.parch as Partial<Caracs> | undefined) }); // parchemins (+100 max)
  const [slots, setSlots] = useState<BuildSlots>(build.slots ?? {});
  const [exos, setExos] = useState<Record<string, ExoType>>((build.exos as Record<string, ExoType> | undefined) ?? {});
  const [target, setTarget] = useState<TargetStats>(build.target ?? emptyTarget());
  const [pickerSlot, setPickerSlot] = useState<SlotDef | null>(null);
  const [showSpells, setShowSpells] = useState(false);
  const [buildName, setBuildName] = useState(build.name);
  const [saved, setSaved] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [levelOpen, setLevelOpen] = useState(false);
  const [selectedSpellId, setSelectedSpellId] = useState<number | null>(null);

  // Auto-save : à chaque modification, on patche le build dans le store (debounce léger).
  const skipFirst = useRef(true);
  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    const t = window.setTimeout(() => {
      actions.updateBuild(build.id, {
        name: buildName.trim() || "Build sans nom",
        slots,
        breedId,
        level,
        caracs,
        parch,
        exos,
        target,
      });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1400);
    }, 500);
    return () => window.clearTimeout(t);
  }, [build.id, buildName, slots, breedId, level, caracs, parch, exos, target]);

  const { data: breeds } = useQuery({ queryKey: ["breeds"], queryFn: ({ signal }) => listBreeds(signal), staleTime: Infinity });
  const breed = breeds?.find((b) => b.id === breedId);
  const roomSlug = breed ? roomClassSlug(breed.name.fr) : null;

  const { data: spells, isLoading: spellsLoading } = useQuery({
    queryKey: ["class-spells", breedId],
    queryFn: ({ signal }) => getClassSpells(breedId!, signal),
    enabled: !!breedId,
    staleTime: 1000 * 60 * 60,
  });

  const { data: roomSpells } = useQuery({
    queryKey: ["dofusroom-spells", roomSlug],
    queryFn: async () => {
      if (!roomSlug || !window.dofusCodex?.getDofusRoomSpells) return [];
      const data = await window.dofusCodex.getDofusRoomSpells(roomSlug);
      return flattenRoomSpells(data);
    },
    enabled: !!roomSlug && !!window.dofusCodex?.getDofusRoomSpells,
    staleTime: 1000 * 60 * 60,
  });

  // --- Équipement ---
  const equippedIds = useMemo(
    () => Object.values(slots).filter((v): v is number => typeof v === "number"),
    [slots],
  );
  const itemQueries = useQueries({
    queries: equippedIds.map((id) => ({
      queryKey: ["equipment", id],
      queryFn: ({ signal }: { signal: AbortSignal }) => getEquipment(id, signal),
      staleTime: 1000 * 60 * 30,
    })),
  });
  const items = itemQueries.map((q) => q.data).filter(Boolean) as NonNullable<(typeof itemQueries)[number]["data"]>[];

  const setCounts = useMemo(() => {
    const map = new Map<number, { name: string; count: number }>();
    for (const it of items) {
      const set = it.parent_set;
      if (!set) continue;
      const prev = map.get(set.id);
      map.set(set.id, { name: set.name, count: (prev?.count ?? 0) + 1 });
    }
    return map;
  }, [items]);

  const setIds = useMemo(() => [...setCounts.keys()], [setCounts]);
  const setQueries = useQueries({
    queries: setIds.map((id) => ({
      queryKey: ["set", id],
      queryFn: ({ signal }: { signal: AbortSignal }) => getSet(id, signal),
      staleTime: 1000 * 60 * 60,
    })),
  });
  const sets = setQueries.map((q) => q.data).filter(Boolean) as NonNullable<(typeof setQueries)[number]["data"]>[];

  const activeSets = useMemo(() => {
    return sets
      .map((set) => {
        const count = setCounts.get(set.ankama_id)?.count ?? 0;
        const effects = count >= 2 ? (set.effects?.[String(count)] ?? []) : [];
        // Tous les paliers de bonus définis (2, 3, 4… objets), triés.
        const tiers = Object.entries(set.effects ?? {})
          .map(([n, eff]) => ({ n: Number(n), effects: eff ?? [] }))
          .filter((t) => t.n >= 2 && t.effects.length > 0)
          .sort((a, b) => a.n - b.n);
        return { id: set.ankama_id, name: set.name, count, total: set.equipment_ids.length, effects, tiers };
      })
      .filter((set) => set.count > 0);
  }, [sets, setCounts]);

  const activeSetEffects = useMemo(() => activeSets.flatMap((set) => set.effects ?? []), [activeSets]);

  // Stats apportées par l'équipement + bonus de panoplie (mappées vers le modèle de calcul)
  // + agrégat brut de toutes les lignes (pour le résumé complet). Valeur = jet max, sinon fixe.
  const { equipStats, rawEquip } = useMemo(() => {
    const s = emptyStats();
    const raw = new Map<string, number>();
    const applyEffects = (effects: NonNullable<typeof items[number]["effects"]>) => {
      for (const e of effects) {
        const name = e.type?.name ?? "";
        const v = e.int_maximum || e.int_minimum || 0;
        if (!name || !v) continue;
        if (e.type?.is_active) continue; // dégâts/vols propres à l'arme, pas des stats de personnage.
        const low = name.toLowerCase();
        if (low.includes("spell") || low.includes("échangeable") || low.includes("attitude") || low.includes("apparence")) continue;
        applyItemEffect(s, name, v, e.type);
        raw.set(name, (raw.get(name) ?? 0) + v);
      }
    };
    for (const it of items) {
      applyEffects(it.effects ?? []);
    }
    applyEffects(activeSetEffects);
    return { equipStats: s, rawEquip: raw };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.map((i) => i.ankama_id).join(","), activeSetEffects]);

  // Stats totales = caractéristiques réparties + parchemins + équipement.
  const total: CharacterStats = useMemo(() => {
    const s = emptyStats();
    (Object.keys(caracs) as CaracKey[]).forEach((k) => (s[k] = caracs[k] + parch[k]));
    s.strength += equipStats.strength;
    s.intelligence += equipStats.intelligence;
    s.chance += equipStats.chance;
    s.agility += equipStats.agility;
    s.vitality += equipStats.vitality;
    s.wisdom += equipStats.wisdom;
    s.power += equipStats.power;
    s.damageFlat += equipStats.damageFlat;
    s.damageBestElement += equipStats.damageBestElement;
    s.damageFinal += equipStats.damageFinal;
    s.damageSpell += equipStats.damageSpell;
    s.damageMelee += equipStats.damageMelee;
    s.damageRanged += equipStats.damageRanged;
    s.critChance += equipStats.critChance;
    s.critDamage += equipStats.critDamage;
    s.damageByElement = equipStats.damageByElement.slice();
    return s;
  }, [caracs, parch, equipStats]);

  // Points de caractéristique.
  const pointsBudget = statPointsForLevel(level);
  const pointsUsed = useMemo(() => {
    if (!breed) return 0;
    return CARACS.reduce((sum, c) => sum + pointsForCarac(caracs[c.key], (breed[c.tier] as StatTier[]) || []), 0);
  }, [caracs, breed]);
  const pointsLeft = pointsBudget - pointsUsed;

  function setCarac(key: CaracKey, value: number) {
    const v = Math.max(0, Math.floor(value || 0));
    setCaracs((c) => {
      const next = { ...c, [key]: v };
      if (breed) {
        const used = CARACS.reduce((sum, cc) => sum + pointsForCarac(next[cc.key], (breed[cc.tier] as StatTier[]) || []), 0);
        if (used > pointsBudget) return c; // dépassement → refus
      }
      return next;
    });
  }

  function equip(item: EquipmentLight) {
    if (pickerSlot) {
      setSlots((s) => {
        const group = multiSlotGroup(pickerSlot.key);
        const targetKey =
          group && s[pickerSlot.key] != null
            ? (group.find((key) => s[key] == null) ?? pickerSlot.key)
            : pickerSlot.key;
        return { ...s, [targetKey]: item.ankama_id };
      });
    }
    setPickerSlot(null);
  }
  function unequip(key: string) {
    setSlots((s) => {
      const next = { ...s };
      delete next[key];
      return next;
    });
    setExos((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
  }
  function setParchVal(key: CaracKey, value: number) {
    const v = Math.max(0, Math.min(PARCH_MAX, Math.floor(value || 0)));
    setParch((p) => ({ ...p, [key]: v }));
  }
  function resetAll() {
    setSlots({});
    setExos({});
    setCaracs(ZERO_CARACS);
    setParch(ZERO_CARACS);
    setTarget(emptyTarget());
  }

  const filledCount = equippedIds.length;
  // Tous les sorts, regroupés par variante (sort de base + sa variante).
  const allSpells = spells ?? [];
  const damageCount = allSpells.filter((s) => s.levels.some((l) => l.damage.length > 0)).length;

  // Colonnes de sorts façon DofusDB : chaque colonne = sort de base + sa variante empilés.
  const spellColumns = useMemo(() => {
    const groups = new Map<number, ClassSpell[]>();
    for (const sp of allSpells) {
      const arr = groups.get(sp.variantId) ?? [];
      arr.push(sp);
      groups.set(sp.variantId, arr);
    }
    return [...groups.values()].map((arr) => [...arr].sort((a, b) => a.variantIndex - b.variantIndex));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSpells.map((s) => s.id).join(",")]);
  // Nombre de lignes par colonne (base + variante) → alignement uniforme de la grille.
  const spellRows = Math.max(1, ...spellColumns.map((c) => c.length));
  const selSpell =
    allSpells.find((s) => s.id === selectedSpellId) ??
    allSpells.find((s) => s.levels.some((l) => l.damage.length > 0)) ??
    allSpells[0];
  const selTwin = selSpell
    ? allSpells.find((o) => o.variantId === selSpell.variantId && o.id !== selSpell.id)
    : undefined;
  const roomSpell = selSpell ? findRoomSpell(roomSpells ?? [], selSpell.name.fr) : undefined;

  // Résumé complet : stats non-offensives lues sur l'agrégat brut de l'équipement.
  const eqSum = (pred: (k: string) => boolean) => {
    let t = 0;
    for (const [k, v] of rawEquip) if (pred(k.toLowerCase())) t += v;
    return t;
  };
  const RES_EL = ["neutre", "terre", "feu", "eau", "air"];
  // Exos posés sur les items équipés (uniquement les slots encore équipés).
  const exoCount = (t: ExoType) =>
    Object.entries(exos).filter(([k, v]) => v === t && slots[k] != null).length;
  const kpi = {
    hp: baseHpForLevel(level) + total.vitality,
    pa: baseApForLevel(level) + eqSum((k) => k === "pa") + exoCount("pa"),
    pm: baseMpForLevel() + eqSum((k) => k === "pm") + exoCount("pm"),
    po: eqSum((k) => k.includes("portée") || k.includes("portee")) + exoCount("po"),
    vitality: total.vitality,
  };
  const misc = {
    initiative: eqSum((k) => k.includes("initiative")),
    prospection: eqSum((k) => k.includes("prospection")),
    tacle: eqSum((k) => k.includes("tacle")),
    fuite: eqSum((k) => k.includes("fuite")),
    invocation: eqSum((k) => k.includes("invocation")) + exoCount("invo"),
    pods: eqSum((k) => k.includes("pods")),
    soin: eqSum((k) => k.includes("soin")),
  };
  const resPct = RES_EL.map((el) => eqSum((k) => k.includes("résistance") && k.includes("%") && k.includes(el)));

  // Bonus spéciaux / passifs (Dofus, items à effet : marqués `is_meta`) — ignorés par le calcul de stats.
  const specialBonuses = items
    .map((it) => ({
      id: it.ankama_id,
      name: it.name,
      icon: it.image_urls.icon,
      lines: (it.effects ?? [])
        .filter((e) => e.type?.is_meta && e.formatted)
        .map((e) => e.formatted.trim()),
    }))
    .filter((b) => b.lines.length > 0);

  // Chips du résumé détaillé (icône + valeur), façon DofusRoom.
  const dmgChips = [
    { icon: ICON_PUISSANCE, label: "Puissance", value: total.power },
    { icon: ICON_WEAPON, label: "Dommages", value: total.damageFlat },
    { icon: ICON_MULTI_ELEMENT, label: "Dom. meilleur élt", value: total.damageBestElement },
    { icon: ICON_DMG_ENVOYES, label: "% Dom. finaux", value: total.damageFinal, suffix: "%" },
    { icon: ICON_DMG_SORT, label: "% Dom. sorts", value: total.damageSpell, suffix: "%" },
    { icon: ICON_DMG_MELEE, label: "% Dom. mêlée", value: total.damageMelee, suffix: "%" },
    { icon: ICON_DMG_DISTANCE, label: "% Dom. distance", value: total.damageRanged, suffix: "%" },
    { icon: ICON_CRITIQUE, label: "% Critique", value: total.critChance, suffix: "%", tone: "text-glow-gold" },
    { icon: ICON_CRITIQUE, label: "Dom. Critiques", value: total.critDamage, tone: "text-glow-gold" },
  ].filter((c) => c.value !== 0);
  const supportChips = [
    { icon: ICON_VITALITE, label: "PV de base", value: baseHpForLevel(level), tone: "text-glow-rose" },
    { icon: ICON_VITALITE, label: "Vitalité", value: total.vitality, tone: "text-glow-rose" },
    { icon: ICON_SAGESSE, label: "Sagesse", value: total.wisdom, tone: "text-glow-violet" },
    { icon: ICON_SOIN, label: "Soins", value: misc.soin, tone: "text-glow-emerald" },
    { icon: ICON_INVOCATION, label: "Invocations", value: misc.invocation },
    { icon: ICON_INITIATIVE, label: "Initiative", value: misc.initiative },
    { icon: ICON_PROSPECTION, label: "Prospection", value: misc.prospection },
    { icon: ICON_TACLE, label: "Tacle", value: misc.tacle },
    { icon: ICON_AGILITE, label: "Fuite", value: misc.fuite },
    { icon: ICON_PODS, label: "Pods", value: misc.pods },
  ];

  const renderSlot = (slot: SlotDef) => (
    <SlotCard
      key={slot.key}
      slot={slot}
      itemId={slots[slot.key]}
      exo={exos[slot.key] ?? ""}
      onExo={(v) => setExos((e) => ({ ...e, [slot.key]: v }))}
      onOpen={() => setPickerSlot(slot)}
      onClear={() => unequip(slot.key)}
    />
  );

  return (
    <div>
      {/* En-tête éditeur : retour + nom + classe + niveau + auto-save + suppression */}
      <div className="mb-6 flex flex-wrap items-center gap-2.5">
        <button
          onClick={() => navigate("/builder")}
          className="no-drag inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" /> Mes builds
        </button>
        <input
          value={buildName}
          onChange={(e) => setBuildName(e.target.value)}
          placeholder="Nom du build"
          className="no-drag min-w-[8rem] flex-1 rounded-xl border border-transparent bg-transparent px-2 py-1 font-display text-2xl font-extrabold tracking-tight text-white outline-none transition placeholder:text-slate-600 hover:border-white/10 focus:border-glow-purple/50 focus:bg-void-800/60"
        />

        {/* Petit bouton Classe (popover de sélection) */}
        <div className="relative">
          <button
            onClick={() => { setClassOpen((o) => !o); setLevelOpen(false); }}
            title="Changer de classe"
            className="no-drag inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            {breed ? (
              <img src={breed.img} alt="" className="h-6 w-6 object-contain" />
            ) : (
              <DofusIcon name="emote" size={20} />
            )}
            <span className="hidden sm:inline">{breed?.name.fr ?? "Classe"}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
          <AnimatePresence>
            {classOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="glass absolute right-0 z-30 mt-2 grid w-[16.5rem] grid-cols-5 gap-1.5 rounded-2xl p-2"
              >
                {(breeds ?? []).map((b) => (
                  <button
                    key={b.id}
                    onClick={() => { setBreedId(b.id); setClassOpen(false); }}
                    title={b.name.fr}
                    className={`no-drag relative h-11 w-11 rounded-lg border transition ${
                      breedId === b.id
                        ? "border-glow-purple/60 bg-glow-purple/15 ring-1 ring-glow-purple/40"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <img src={b.img} alt={b.name.fr} className="h-full w-full object-contain p-1.5" loading="lazy" />
                  </button>
                ))}
                {!breeds && <div className="col-span-5 py-2"><Spinner /></div>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Petit bouton Niveau (popover slider + input) */}
        <div className="relative">
          <button
            onClick={() => { setLevelOpen((o) => !o); setClassOpen(false); }}
            title="Changer le niveau"
            className="no-drag inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Niv. {level} <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
          <AnimatePresence>
            {levelOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="glass absolute right-0 z-30 mt-2 w-64 rounded-2xl p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Niveau</p>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={level}
                    onChange={(e) => setLevel(Math.min(200, Math.max(1, Number(e.target.value) || 1)))}
                    className="no-drag w-16 rounded-lg border border-white/10 bg-void-800/60 px-2 py-1 text-right text-sm font-bold text-white outline-none focus:border-glow-purple/50"
                  />
                </div>
                <input
                  type="range"
                  min={1}
                  max={200}
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                  className="no-drag w-full accent-glow-purple"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold transition ${
            saved ? "text-glow-emerald" : "text-slate-500"
          }`}
        >
          <Save className="h-3.5 w-3.5" /> <span className="hidden sm:inline">{saved ? "Enregistré" : "Auto-save"}</span>
        </span>
        <button
          onClick={() => {
            actions.deleteBuild(build.id);
            navigate("/builder");
          }}
          title="Supprimer ce build"
          className="no-drag rounded-xl border border-white/10 bg-white/5 p-2 text-slate-500 transition hover:border-glow-rose/30 hover:bg-glow-rose/10 hover:text-glow-rose"
        >
          <DofusIcon name="closeRed" size={16} />
        </button>
      </div>

      {/* Ferme les popovers au clic extérieur */}
      {(classOpen || levelOpen) && (
        <button
          aria-hidden
          tabIndex={-1}
          onClick={() => { setClassOpen(false); setLevelOpen(false); }}
          className="fixed inset-0 z-20 cursor-default"
        />
      )}

      {!breed ? (
        <div className="glass rounded-2xl p-10 text-center">
          <DofusIcon name="emote" size={32} className="mx-auto mb-3 opacity-60" />
          <p className="text-slate-400">Sélectionnez une classe pour afficher ses sorts et estimer vos dégâts.</p>
        </div>
      ) : (
        <>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Équipement : grande zone */}
          <div className="lg:col-span-2">
            <div className="glass rounded-3xl p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-display text-lg font-bold text-white">
                  <DofusIcon name="armor" size={20} /> Équipement
                </h3>
                <div className="flex items-center gap-2">
                  <Pill tone="slate">{filledCount}/{SLOTS.length}</Pill>
                  <button
                    onClick={resetAll}
                    className="no-drag inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10"
                  >
                    <DofusIcon name="reset" size={14} tint="#22d3ee" /> Réinitialiser
                  </button>
                </div>
              </div>
              {/* Paper-doll : colonnes d'emplacements miroir autour du perso */}
              <div className="grid items-start gap-4 lg:grid-cols-[7rem_1fr_7rem]">
                <div className="order-2 grid grid-cols-3 gap-3 min-[420px]:grid-cols-5 lg:order-1 lg:grid-cols-1">
                  {LEFT_SLOTS.map(renderSlot)}
                </div>
                <CharacterPanel breed={breed} level={level} kpi={kpi} filled={filledCount} total={SLOTS.length} className="order-1 lg:order-2" />
                <div className="order-3 grid grid-cols-3 gap-3 min-[420px]:grid-cols-5 lg:grid-cols-1">
                  {RIGHT_SLOTS.map(renderSlot)}
                </div>
              </div>
              <div className="mt-5">
                <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  <DofusIcon name="dofus" size={14} /> Dofus &amp; Trophées
                </p>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {DOFUS_SLOTS.map(renderSlot)}
                </div>
              </div>
              {activeSets.length > 0 && (
                <div className="mt-5 border-t border-white/5 pt-4">
                  <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    <DofusIcon name="menuItemsets" size={14} /> Panoplies
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {activeSets.map((set) => {
                      const active = set.effects.length > 0;
                      return (
                        <div
                          key={set.id}
                          className={`rounded-2xl border p-3 ${
                            active ? "border-glow-cyan/30 bg-glow-cyan/[0.07]" : "border-white/10 bg-white/[0.03]"
                          }`}
                        >
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-bold text-white" title={set.name}>
                              {set.name}
                            </p>
                            <Pill tone={active ? "cyan" : "slate"}>
                              {set.count}/{set.total}
                            </Pill>
                          </div>
                          {/* Pastilles de progression (objets équipés) */}
                          <div className="mb-2 flex gap-1">
                            {Array.from({ length: set.total }).map((_, i) => (
                              <span
                                key={i}
                                className={`h-1.5 flex-1 rounded-full ${
                                  i < set.count ? "bg-glow-cyan/70" : "bg-white/10"
                                }`}
                              />
                            ))}
                          </div>
                          {/* Paliers de bonus : actif mis en avant, verrouillés grisés */}
                          {set.tiers.length > 0 ? (
                            <div className="space-y-1.5">
                              {set.tiers.map((tier) => {
                                const reached = set.count >= tier.n;
                                const isCurrent = set.count === tier.n;
                                return (
                                  <div
                                    key={tier.n}
                                    className={`rounded-lg px-2 py-1.5 transition ${
                                      isCurrent
                                        ? "bg-glow-cyan/10 ring-1 ring-glow-cyan/30"
                                        : reached
                                          ? "bg-white/[0.03]"
                                          : "opacity-45"
                                    }`}
                                  >
                                    <p
                                      className={`mb-0.5 text-[10px] font-bold uppercase tracking-wide ${
                                        reached ? "text-glow-cyan" : "text-slate-500"
                                      }`}
                                    >
                                      {tier.n} objets {isCurrent && "· actif"}
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                      {tier.effects.map((e, idx) => {
                                        const v = effectVisual(e.formatted);
                                        const dIco = effectIconFromName(e.formatted);
                                        return (
                                          <span
                                            key={idx}
                                            className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] leading-tight ring-1 ${
                                              reached
                                                ? "bg-white/[0.04] text-slate-200 ring-white/10"
                                                : "text-slate-500 ring-transparent"
                                            }`}
                                          >
                                            {dIco ? (
                                              <DofusIcon name={dIco} size={12} />
                                            ) : (
                                              <v.icon className={`h-3 w-3 shrink-0 ${reached ? v.tone : "text-slate-600"}`} />
                                            )}
                                            {e.formatted}
                                          </span>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-500">Bonus actif à partir de 2 objets.</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {specialBonuses.length > 0 && (
                <div className="mt-5 border-t border-white/5 pt-4">
                  <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    <DofusIcon name="etoile" size={14} /> Bonus spéciaux
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {specialBonuses.map((b) => (
                      <div key={b.id} className="rounded-2xl border border-glow-gold/20 bg-glow-gold/[0.06] p-3">
                        <div className="mb-1.5 flex items-center gap-2">
                          <img src={b.icon} alt="" className="h-6 w-6 shrink-0 object-contain" />
                          <p className="truncate text-sm font-semibold text-white">{b.name}</p>
                        </div>
                        <div className="space-y-1.5">
                          {b.lines.map((line, i) => (
                            <p key={i} className="whitespace-pre-line text-[11px] leading-snug text-slate-300">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Colonne latérale : sorts (bouton) + caractéristiques + cible */}
          <div className="space-y-6">
            {/* Bouton vers la modale des sorts */}
            <button
              onClick={() => setShowSpells(true)}
              className="no-drag group flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-glow-ember/20 to-glow-rose/15 p-4 text-left ring-1 ring-glow-ember/30 transition hover:from-glow-ember/30 hover:to-glow-rose/25"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-glow-ember/20 text-glow-ember">
                <DofusIcon name="spells" size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display font-bold text-white">Sorts &amp; dégâts</span>
                <span className="block text-xs text-slate-400">
                  {spellsLoading ? "Chargement…" : `${allSpells.length} sorts · ${damageCount} offensifs`}
                </span>
              </span>
              <ChevronRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-glow-ember" />
            </button>

            {/* Caractéristiques */}
            <div className="glass rounded-2xl p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display font-bold text-white">Caractéristiques</h3>
                <Pill tone={pointsLeft < 0 ? "rose" : "purple"}>{pointsLeft} pts</Pill>
              </div>
              <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-glow-purple to-glow-cyan transition-all"
                  style={{ width: `${Math.min(100, (pointsUsed / Math.max(1, pointsBudget)) * 100)}%` }}
                />
              </div>
              <div className="mb-1 flex items-center gap-1.5 px-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-600">
                <span className="flex-1" />
                <span className="w-12 text-center">Réparti</span>
                <span className="w-12 text-center">Parch.</span>
                <span className="w-10 text-right">Total</span>
              </div>
              <div className="space-y-1.5">
                {CARACS.map((c) => {
                  const equipBonus = equipStats[c.key];
                  const totalC = caracs[c.key] + parch[c.key] + equipBonus;
                  return (
                    <div key={c.key} className="flex items-center gap-1.5">
                      <c.icon className="h-4 w-4" />
                      <div className="min-w-0 flex-1 truncate">
                        <span className={`text-sm font-semibold ${c.tone}`}>{c.label}</span>
                        {equipBonus !== 0 && (
                          <span className="ml-1 text-[10px] text-slate-500" title="Apport de l'équipement">
                            +{equipBonus}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        min={0}
                        value={caracs[c.key]}
                        onChange={(e) => setCarac(c.key, Number(e.target.value))}
                        title="Points répartis"
                        className="no-drag w-12 rounded-md border border-white/10 bg-void-800/60 px-1 py-1 text-center text-sm font-bold text-white outline-none focus:border-glow-purple/50"
                      />
                      <input
                        type="number"
                        min={0}
                        max={PARCH_MAX}
                        value={parch[c.key]}
                        onChange={(e) => setParchVal(c.key, Number(e.target.value))}
                        title="Parchemins (100 max)"
                        className="no-drag w-12 rounded-md border border-glow-violet/30 bg-glow-violet/5 px-1 py-1 text-center text-sm font-bold text-glow-violet outline-none focus:border-glow-violet/60"
                      />
                      <span className="w-10 text-right text-sm font-bold text-white">{totalC}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dommages & Résistances */}
            <div className="glass rounded-2xl p-5">
              <h3 className="mb-3 flex items-center gap-2 font-display font-bold text-white">
                <DofusIcon name="weapon" size={20} /> Dommages &amp; Résistances
              </h3>
              {dmgChips.length > 0 && (
                <div className="mb-3 grid grid-cols-2 gap-2">
                  {dmgChips.map((c) => (
                    <StatChip key={c.label} icon={c.icon} label={c.label} value={c.value} suffix={c.suffix} tone={c.tone} />
                  ))}
                </div>
              )}
              {/* Table par élément : dommages fixes + résistance % */}
              <div className="overflow-hidden rounded-xl border border-white/10">
                <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                  <span className="flex-1">Élément</span>
                  <span className="w-16 text-right">Dommages</span>
                  <span className="w-12 text-right">Rés. %</span>
                </div>
                {ELEMENTS.map((el, i) => {
                  const dmg = total.damageByElement[i];
                  return (
                    <div key={el} className="flex items-center gap-2 px-3 py-1.5 odd:bg-white/[0.02]">
                      <span className={`flex flex-1 items-center gap-1.5 text-sm font-medium ${ELEMENT_TONE[i]}`}>
                        <DofusIcon name={elementIcon(i)} size={14} /> {el}
                      </span>
                      <span className="w-16 text-right text-sm font-bold tabular-nums text-white">
                        {dmg > 0 ? "+" : ""}
                        {dmg}
                      </span>
                      <span
                        className={`w-12 text-right text-sm font-bold tabular-nums ${
                          resPct[i] < 0 ? "text-glow-rose" : resPct[i] > 0 ? "text-glow-emerald" : "text-slate-400"
                        }`}
                      >
                        {resPct[i]}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Soutien & divers */}
            <div className="glass rounded-2xl p-5">
              <h3 className="mb-3 flex items-center gap-2 font-display font-bold text-white">
                <DofusIcon name="pv" size={20} /> Soutien &amp; divers
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {supportChips.map((c) => (
                  <StatChip key={c.label} icon={c.icon} label={c.label} value={c.value} tone={c.tone} />
                ))}
              </div>
            </div>
          </div>
        </div>
        </>
      )}

      <AnimatePresence>
        {pickerSlot && (
          <SlotPicker
            title={pickerSlot.label}
            allowedTypes={pickerSlot.types}
            maxLevel={level}
            onPick={equip}
            onClose={() => setPickerSlot(null)}
          />
        )}
      </AnimatePresence>

      {/* Modale « page temporaire » des sorts & dégâts — en portal pour passer au-dessus
          de la Sidebar/TitleBar (le <main> z-10 crée un contexte d'empilement qui piégeait le z-50). */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {showSpells && breed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSpells(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-void-900/80 p-4 backdrop-blur-sm sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 16 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="glass flex h-[80vh] max-h-[760px] w-full max-w-5xl flex-col overflow-hidden rounded-3xl p-5 shadow-card ring-1 ring-white/10"
            >
              {/* En-tête */}
              <div className="mb-4 flex shrink-0 items-center gap-3 border-b border-white/10 pb-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-glow-ember/15 ring-1 ring-glow-ember/30">
                  <img src={breed.img} alt={breed.name.fr} className="h-8 w-8 object-contain" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-xl font-bold text-white">
                    Sorts de {breed.name.fr} <span className="text-slate-500">· Niv. {level}</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Sélectionnez un sort — dégâts estimés à votre niveau exact (formule DofusRoom).
                  </p>
                </div>
                <button
                  onClick={() => setShowSpells(false)}
                  className="no-drag rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {spellsLoading ? (
                <Spinner label="Chargement des sorts…" />
              ) : allSpells.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-500">
                  Aucun sort trouvé pour cette classe.
                </div>
              ) : (
                <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
                  {/* Grille d'icônes : sort de base en haut, sa variante juste en dessous.
                      Chaque colonne occupe le même nombre de lignes → alignement net au wrap. */}
                  <div className="flex flex-wrap content-start gap-1.5 overflow-y-auto rounded-2xl bg-void-900/50 p-2 ring-1 ring-white/10 lg:w-[296px] lg:shrink-0">
                    {spellColumns.map((col, i) => (
                      <div key={i} className="flex flex-col gap-1.5">
                        {Array.from({ length: spellRows }).map((_, row) => {
                          const sp = col[row];
                          if (!sp) return <div key={row} className="h-12 w-12 shrink-0" aria-hidden />;
                          return (
                            <button
                              key={sp.id}
                              onClick={() => setSelectedSpellId(sp.id)}
                              title={sp.name.fr}
                              className={`no-drag h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-void-700/60 transition ${
                                selSpell?.id === sp.id
                                  ? "shadow-[0_0_18px_-4px_rgba(124,92,255,0.7)] ring-2 ring-glow-violet"
                                  : "ring-1 ring-white/10 hover:ring-glow-violet/40"
                              }`}
                            >
                              <img
                                src={sp.img}
                                alt={sp.name.fr}
                                loading="lazy"
                                className="h-full w-full object-cover"
                                onError={(e) => (e.currentTarget.style.opacity = "0.3")}
                              />
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  {/* Détail du sort sélectionné — scroll vertical indépendant */}
                  <div className="min-h-0 min-w-0 flex-1 overflow-y-auto pr-1">
                    {selSpell && (
                      <SpellDetail
                        spell={selSpell}
                        twinName={selTwin?.name.fr}
                        level={level}
                        stats={total}
                        target={target}
                        roomSpell={roomSpell}
                      />
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}

// Panneau de détail d'un sort (agencement DofusDB) : en-tête + caractéristiques + dégâts estimés.
function SpellDetail({
  spell,
  twinName,
  level,
  stats,
  target,
  roomSpell,
}: {
  spell: ClassSpell;
  twinName?: string;
  level: number;
  stats: CharacterStats;
  target: TargetStats;
  roomSpell?: RoomSpell;
}) {
  // Sort au niveau EXACT du perso (interpolation continue entre grades).
  const cur = spellLevelAt(spell, level);
  const est = cur ? estimateSpell(cur, stats, target) : null;
  // Sorts à charges (Téléfrag, Xélor) : paliers simulés au plus près de DofusBook.
  const tierLines =
    cur && cur.chargeScaled
      ? chargeTierLines(spell.name.fr, cur.damage, cur.criticalDamage, stats, target, (cur.range ?? 0) > 1)
      : null;
  const damageLines: DamageLine[] = tierLines ?? est?.lines ?? [];
  const isVariant = spell.variantIndex === 1;
  const elems = cur ? [...new Set(cur.damage.map((d) => d.element))] : [];
  const rangeLabel = cur ? (cur.minRange === cur.range ? `${cur.range}` : `${cur.minRange}-${cur.range}`) : "—";
  const grades = [...spell.levels].filter((l) => l.damage.length > 0).sort((a, b) => a.grade - b.grade);
  const roomLines = cur && roomSpell ? estimateRoomLines(roomSpell, level, stats, target) : [];
  const roomRank = roomSpell ? roomRankInfo(roomSpell, level) : null;
  const roomCarac = roomRank ? roomSpell?.caracs?.[roomRank.index] : null;
  const roomEffects = roomRank && roomSpell ? activeRoomEffects(roomSpell.effects, roomRank.key) : null;
  const roomNote = roomSpell?.description ? specialDamageNote(roomSpell.description) : null;
  const triggerLabel = roomTriggerLabel(roomSpell, roomLines);
  const description = roomSpell?.description ? cleanRoomDescription(roomSpell.description) : "";
  const caracRows = roomCarac
    ? roomCaracRows(roomCarac)
    : cur
      ? [
          { label: "Coût", value: `${cur.apCost} PA`, icon: ICON_PA, tone: "text-glow-cyan" },
          { label: "Portée", value: `${rangeLabel} PO`, icon: ICON_PO, tone: "text-glow-violet" },
          ...(est && est.critChance > 0
            ? [{ label: "Critique", value: `${est.critChance}%`, icon: ICON_CRITIQUE, tone: "text-glow-gold" }]
            : []),
        ]
      : [];
  const visibleLevels = roomSpell
    ? roomRankLevels(roomSpell)
    : grades.map((g) => ({ key: String(g.grade), level: g.minPlayerLevel, active: g.minPlayerLevel <= level }));
  const activeLevel = roomRank?.level ?? cur?.minPlayerLevel ?? level;

  return (
    <motion.div
      key={spell.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]"
    >
      <section className="min-w-0 rounded-2xl bg-[#3e3e3e] p-4 ring-1 ring-black/25">
        <div className="flex items-start gap-4">
          <img
            src={spell.img}
            alt={spell.name.fr}
            className="h-14 w-14 shrink-0 rounded-lg bg-void-700/60 object-cover ring-1 ring-black/30"
            onError={(e) => (e.currentTarget.style.opacity = "0.3")}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="flex min-w-0 items-center gap-2 font-display text-lg font-bold text-white">
                  <span className="truncate">{roomSpell?.label ?? spell.name.fr}</span>
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
                      isVariant ? "bg-glow-violet/20 text-glow-violet" : "bg-white/10 text-slate-300"
                    }`}
                  >
                    {isVariant ? "Variante" : "Base"}
                  </span>
                </h3>
                {twinName && (
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-glow-violet/90">
                    <Shuffle className="h-3 w-3 shrink-0" />
                    {isVariant ? `Variante de ${twinName}` : `Variante : ${twinName}`}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <span className="font-semibold uppercase tracking-wide text-slate-500">Niveau</span>
                {visibleLevels.map((rank) => (
                  <span
                    key={rank.key}
                    className={`font-display text-sm font-bold tabular-nums ${
                      rank.level === activeLevel ? "text-glow-gold" : "text-slate-400"
                    }`}
                  >
                    {rank.level}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <dl className="mt-5 space-y-1 text-sm">
          {caracRows.map((row) => {
            const d = CARAC_ROW_ICON[row.label];
            return (
              <div key={`${row.label}-${row.value}`} className="flex items-center gap-2 text-slate-300">
                <dt className="min-w-[8rem] text-slate-400">{row.label}</dt>
                <dd className="flex min-w-0 items-center gap-2 font-semibold text-white">
                  {d ? <DofusIcon name={d} size={16} /> : <row.icon className={`h-4 w-4 ${row.tone}`} />}
                  {row.value}
                </dd>
              </div>
            );
          })}
        </dl>

        <div className="mt-5">
          <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Effets</h4>
          {roomLines.length > 0 ? (
            <ul className="overflow-hidden rounded-sm">
              {roomLines.map((line, i) => (
                <li
                  key={`${line.label}-${line.stat}-${i}`}
                  className="flex items-center justify-between gap-4 px-3 py-2 text-sm odd:bg-black/16 even:bg-white/[0.035]"
                >
                  <span className="flex min-w-0 items-center gap-3 text-slate-100">
                    <RoomStatIcon stat={line.stat} />
                    <span className="min-w-0">
                      <span className="font-semibold">
                        {line.baseMin === line.baseMax ? line.baseMin : `${line.baseMin} à ${line.baseMax}`}
                      </span>
                      <span className="ml-1 text-slate-200">{line.stat.replace(/^dommages /, "dommages ")}</span>
                      {line.baseCritMin != null && (
                        <span className="ml-2 text-glow-gold">
                          {line.baseCritMin === line.baseCritMax ? line.baseCritMin : `${line.baseCritMin} à ${line.baseCritMax}`} CC
                        </span>
                      )}
                      {line.label && <span className="ml-2 text-slate-300">({line.label})</span>}
                    </span>
                  </span>
                  <span className="h-3 w-3 shrink-0 rotate-45 bg-lime-500/80" />
                </li>
              ))}
              {roomEffects?.options?.map((opt, i) => (
                <li
                  key={`${opt.label ?? "option"}-${i}`}
                  className="flex items-center justify-between gap-4 px-3 py-2 text-sm odd:bg-black/16 even:bg-white/[0.035]"
                >
                  <span className="min-w-0 text-slate-100">
                    <span className="font-semibold">{formatRoomEffectOption(opt)}</span>
                    {opt.label && <span className="ml-2 text-slate-300">({opt.label})</span>}
                  </span>
                  <span className="h-3 w-3 shrink-0 rotate-45 bg-lime-500/80" />
                </li>
              ))}
            </ul>
          ) : roomEffects?.options?.length ? (
            <ul className="overflow-hidden rounded-sm">
              {roomEffects.options.map((opt, i) => (
                <li
                  key={`${opt.label ?? "option"}-${i}`}
                  className="flex items-center justify-between gap-4 px-3 py-2 text-sm odd:bg-black/16 even:bg-white/[0.035]"
                >
                  <span className="font-semibold text-slate-100">{formatRoomEffectOption(opt)}</span>
                  <span className="h-3 w-3 shrink-0 rotate-45 bg-lime-500/80" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-sm bg-black/16 px-3 py-2 text-sm italic text-slate-300">
              Sort utilitaire ou effet sans ligne de dégâts chiffrée.
            </p>
          )}
        </div>

        {(description || roomNote) && (
          <div className="mt-5 space-y-3 text-sm leading-relaxed text-slate-300">
            {description.split("\n\n").map((paragraph, i) => (
              <p key={i} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
            {roomNote && <p className="font-semibold text-glow-violet">{roomNote}</p>}
          </div>
        )}
      </section>

      <aside className="rounded-2xl bg-[#2f2f2f] p-4 ring-1 ring-black/25 lg:sticky lg:top-4">
        <h4 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-white">
          <DofusIcon name="weapon" size={20} />
          Dégâts
        </h4>
        {damageLines.length > 0 ? (
          <div className="space-y-3">
            {est && est.critChance > 0 && (
              <p className="text-[11px] font-semibold text-glow-gold">Coups critiques : {est.critChance}%</p>
            )}
            {damageLines.map((line) => (
              <div key={`${line.label}-${line.delay}`} className="rounded-xl bg-void-900/40 p-3 ring-1 ring-white/5">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{line.label}</p>
                <div className="space-y-1.5">
                  {line.elements.map((e) => {
                    return (
                      <div key={e.element} className="flex items-center justify-between gap-3 text-sm tabular-nums">
                        <span className={`flex items-center gap-1.5 font-semibold ${ELEMENT_TONE[e.element]}`}>
                          <DofusIcon name={elementIcon(e.element)} size={14} />
                          {e.min === e.max ? e.min : `${e.min} - ${e.max}`}
                        </span>
                        {e.critMax > 0 && (
                          <span className="font-semibold text-glow-gold">
                            {e.critMin === e.critMax ? e.critMin : `${e.critMin} - ${e.critMax}`} CC
                          </span>
                        )}
                      </div>
                    );
                  })}
                  {line.elements.length > 1 && (
                    <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-1.5 text-sm font-bold tabular-nums">
                      <span className="flex items-center gap-1.5 text-glow-gold">
                        <DofusIcon name="critique" size={14} />
                        {line.totalMin} - {line.totalMax}
                      </span>
                      {line.totalCritMax > 0 && (
                        <span className="text-glow-gold">
                          {line.totalCritMin} - {line.totalCritMax} CC
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {cur?.chargeScaled && (
              <p className="text-[11px] leading-snug text-slate-500">
                {tierLines
                  ? "Paliers de charges (Téléfrag) — simulation au plus près de DofusBook."
                  : "Dégâts par charge — le total monte avec le nombre de charges accumulées."}
              </p>
            )}
            {roomNote && (
              <p className="rounded-xl bg-glow-violet/10 p-3 text-sm font-semibold text-glow-violet ring-1 ring-glow-violet/25">
                {roomNote}
              </p>
            )}
          </div>
        ) : (
          <p className="rounded-xl bg-white/[0.04] p-3 text-sm italic text-slate-400">
            Aucun dégât direct calculable.
          </p>
        )}
        {elems.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5 border-t border-white/10 pt-4">
            {elems.map((el) => (
              <span
                key={el}
                className={`rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold ring-1 ring-white/10 ${
                  el === 5 ? "text-glow-violet" : ELEMENT_TONE[el]
                }`}
              >
                {el === 5 ? "Meilleur élt" : ELEMENTS[el]}
              </span>
            ))}
          </div>
        )}
      </aside>
    </motion.div>
  );
}

function RoomStatIcon({ stat }: { stat: string }) {
  const dofus = effectIconFromName(stat);
  if (dofus) return <DofusIcon name={dofus} size={16} />;
  const n = normalizeName(stat);
  const fallback: DofusIconName = n.includes("feu")
    ? "feu"
    : n.includes("eau")
      ? "eau"
      : n.includes("air")
        ? "air"
        : n.includes("terre")
          ? "terre"
          : n.includes("neutre")
            ? "neutre"
            : n.includes("poussee")
              ? "dmgPoussee"
              : "weapon";
  return <DofusIcon name={fallback} size={16} />;
}

function roomRankInfo(spell: RoomSpell, level: number): { key: "fRank" | "sRank" | "tRank"; level: number; index: number } | null {
  const ranks = (["fRank", "sRank", "tRank"] as const)
    .map((key, index) => ({ key, index, level: Number(spell[key] ?? 0) }))
    .filter((rank) => rank.level > 0 && rank.level <= level)
    .sort((a, b) => b.level - a.level);
  return ranks[0] ?? null;
}

function roomRankLevels(spell: RoomSpell): { key: string; level: number; active: boolean }[] {
  return (["fRank", "sRank", "tRank"] as const)
    .map((key) => ({ key, level: Number(spell[key] ?? 0), active: false }))
    .filter((rank) => rank.level > 0);
}

function roomCaracRows(carac: RoomCarac): { label: string; value: string; icon: DofusUiIcon; tone: string }[] {
  const rows: { label: string; value: string; icon: DofusUiIcon; tone: string }[] = [];
  if (carac.pa != null) rows.push({ label: "Coût", value: `${carac.pa} PA`, icon: ICON_PA, tone: "text-glow-cyan" });
  if (carac.po) {
    rows.push({
      label: "Portée",
      value: `${carac.po.replace(/\s*-\s*/g, " - ")}${carac.alterableRange ? " (modifiable)" : ""}`,
      icon: ICON_PO,
      tone: "text-glow-violet",
    });
  }
  if (carac.cc != null) rows.push({ label: "Critique", value: `${carac.cc}%`, icon: ICON_CRITIQUE, tone: "text-glow-gold" });
  if (carac.area) {
    const size = carac.area.size ?? 1;
    rows.push({
      label: "Zone",
      value: `${areaLabel(carac.area.type)} ${size} case${size > 1 ? "s" : ""}`,
      icon: ICON_ZONE,
      tone: "text-glow-emerald",
    });
  }
  if (carac.line) rows.push({ label: "Lancer", value: "En ligne", icon: ICON_LINE, tone: "text-slate-300" });
  if (carac.diagonale) rows.push({ label: "Lancer", value: "En diagonale", icon: ICON_LINE, tone: "text-slate-300" });
  if (carac.throughObstacles === false) rows.push({ label: "Ligne de vue", value: "Requise", icon: ICON_PROSPECTION, tone: "text-slate-300" });
  if (carac.perTurnPerPlayer) {
    rows.push({ label: "Limitation par tour par cible", value: String(carac.perTurnPerPlayer), icon: ICON_TOUR, tone: "text-slate-300" });
  }
  if (carac.stack) rows.push({ label: "Cumul max. des effets", value: String(carac.stack), icon: ICON_SPECIAL, tone: "text-slate-300" });
  if (carac.perTurn) rows.push({ label: "Utilisations par tour", value: String(carac.perTurn), icon: ICON_TOUR, tone: "text-slate-300" });
  if (carac.interval) rows.push({ label: "Relance", value: `${carac.interval} tour${carac.interval > 1 ? "s" : ""}`, icon: ICON_TOUR, tone: "text-slate-300" });
  return rows;
}

function areaLabel(type?: string): string {
  switch (type) {
    case "circle":
      return "Cercle";
    case "square":
      return "Carré";
    case "ring":
      return "Anneau";
    case "cross":
    case "empty-cross":
      return "Croix";
    default:
      return "Zone";
  }
}

function activeRoomEffects(effects: RoomSpell["effects"], rank: "fRank" | "sRank" | "tRank"): RoomEffects | null {
  if (!effects || Array.isArray(effects)) return null;
  if ("options" in effects || "description" in effects) return effects as RoomEffects;
  return (effects as RoomRankedEffects)[rank] ?? null;
}

function formatRoomEffectOption(option: RoomEffectOption): string {
  const stats = option.stats ? Object.entries(option.stats) : [];
  if (!stats.length) return option.label ?? "Effet";
  return stats
    .map(([name, value]) => `${value > 0 ? "+" : ""}${value} ${name}`)
    .join(" · ");
}

function cleanRoomDescription(description: string): string {
  return description
    .replace(/\r/g, "")
    .replace(/\{\{spell,\d+,\d+::([^}]+)\}\}/g, "$1")
    .replace(/\{\{[^:}]+::([^}]+)\}\}/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function roomTriggerLabel(spell: RoomSpell | undefined, lines: RoomLineEstimate[]): string {
  const labels = lines.map((line) => line.label).filter(Boolean);
  const haystack = `${spell?.description ?? ""} ${labels.join(" ")}`.toLowerCase();
  if (haystack.includes("téléfrag") || haystack.includes("telefrag")) return "Téléfrag";
  const charge = labels.find((label) => normalizeName(label).includes("charge"));
  if (charge) return charge;
  const state = labels.find((label) => normalizeName(label).includes("etat"));
  if (state) return state;
  return "effet déclenché";
}

function DamageEstimateCard({
  title,
  average,
  min,
  max,
  critMin,
  critMax,
  critChance,
  accent,
  hint,
}: {
  title: string;
  average: number;
  min: number;
  max: number;
  critMin: number;
  critMax: number;
  critChance: number;
  accent: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl bg-void-900/50 p-4 ring-1 ring-white/5">
      <p className="mb-2 flex items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <DofusIcon name="weapon" size={14} /> {title}
        </span>
        {hint && <span className="normal-case tracking-normal text-glow-violet/80">{hint}</span>}
      </p>
      <div className="flex items-end justify-between gap-2">
        <div>
          <div className="font-display text-3xl font-extrabold leading-none text-white">{average}</div>
          <div className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">moyenne</div>
        </div>
        <div className="text-right">
          <div className="font-display text-base font-bold tabular-nums text-slate-200">
            {min}–{max}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">fourchette</div>
        </div>
      </div>
      {critChance > 0 && (
        <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2.5">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-glow-gold">
            <DofusIcon name="critique" size={14} /> Critique {critChance}%
          </span>
          <span className="font-display text-base font-bold tabular-nums text-glow-gold">
            {critMin}–{critMax}
          </span>
        </div>
      )}
    </div>
  );
}

function roomRankKey(spell: RoomSpell, level: number): "fRank" | "sRank" | "tRank" | null {
  const ranks = (["fRank", "sRank", "tRank"] as const)
    .map((key) => ({ key, level: Number(spell[key] ?? 0) }))
    .filter((rank) => rank.level > 0 && rank.level <= level)
    .sort((a, b) => b.level - a.level);
  return ranks[0]?.key ?? null;
}

function roomIsRanged(spell: RoomSpell, rank: "fRank" | "sRank" | "tRank"): boolean {
  const idx = rank === "fRank" ? 0 : rank === "sRank" ? 1 : 2;
  const po = String(spell.caracs?.[idx]?.po ?? "");
  const max = Number((po.split("-").pop() ?? po).trim());
  return max > 1 || Boolean(spell.caracs?.[idx]?.area);
}

function elementFromRoomStat(stat: string): number | "best" | "worst" | null {
  const n = normalizeName(stat);
  if (n.includes("meilleurelem")) return "best";
  if (n.includes("pireelem")) return "worst";
  if (n.includes("neutre")) return 0;
  if (n.includes("terre")) return 1;
  if (n.includes("feu")) return 2;
  if (n.includes("eau")) return 3;
  if (n.includes("air")) return 4;
  return null;
}

function estimateRoomValue(
  base: number,
  stat: string,
  stats: CharacterStats,
  target: TargetStats,
  crit: boolean,
  isRanged: boolean,
): number {
  const element = elementFromRoomStat(stat);
  if (element === null) return base;
  if (typeof element === "number") return estimateDamageValue(base, element, stats, target, crit, isRanged);

  const values = [1, 2, 3, 4].map((el) => estimateDamageValue(base, el, stats, target, crit, isRanged));
  return element === "worst" ? Math.min(...values) : Math.max(...values);
}

// Mécanique de charges (Téléfrag) — propre au Xélor : dégâts = formule( valeurParCharge × (N + base) ).
// `base` = charges accordées en consommant 1 Téléfrag, `max` = nb de charges max affiché. Constantes
// reversées des tables DofusBook (introuvables dans les données — cf. memory damage-formula).
const CHARGE_CONFIG: Record<string, { base: number; max: number }> = {
  // base = charges du « Téléfrag consommé » (minimum 1 Téléfrag requis) ; max = charges supplémentaires.
  Glas: { base: 2, max: 5 },
};

function chargeTierLines(
  spellName: string,
  damage: SpellDamage[],
  critDamage: SpellDamage[],
  stats: CharacterStats,
  target: TargetStats,
  isRanged: boolean,
): DamageLine[] | null {
  const cfg = CHARGE_CONFIG[spellName];
  if (!cfg || !damage.length) return null;
  void critDamage; // le crit reprend la valeur normale par charge (même incrément) + Dommages Critiques en flat
  const resolveEl = (d: SpellDamage, crit: boolean) =>
    d.element === 5
      ? [1, 2, 3, 4].reduce((b, el) =>
          estimateDamageValue(d.max, el, stats, target, crit, isRanged) >
          estimateDamageValue(d.max, b, stats, target, crit, isRanged)
            ? el
            : b, 1)
      : d.element;
  const mkLine = (label: string, mult: number): DamageLine => {
    const elMap = new Map<number, { element: number; min: number; max: number; critMin: number; critMax: number }>();
    const cell = (el: number) => {
      let c = elMap.get(el);
      if (!c) {
        c = { element: el, min: 0, max: 0, critMin: 0, critMax: 0 };
        elMap.set(el, c);
      }
      return c;
    };
    for (const d of damage) {
      const el = resolveEl(d, false);
      const c = cell(el);
      c.min += estimateDamageValue(d.min * mult, el, stats, target, false, isRanged);
      c.max += estimateDamageValue(d.max * mult, el, stats, target, false, isRanged);
      c.critMin += estimateDamageValue(d.min * mult, el, stats, target, true, isRanged);
      c.critMax += estimateDamageValue(d.max * mult, el, stats, target, true, isRanged);
    }
    const elements = [...elMap.values()];
    return {
      label,
      delay: mult,
      elements,
      totalMin: elements.reduce((a, e) => a + e.min, 0),
      totalMax: elements.reduce((a, e) => a + e.max, 0),
      totalCritMin: elements.reduce((a, e) => a + e.critMin, 0),
      totalCritMax: elements.reduce((a, e) => a + e.critMax, 0),
    };
  };
  const lines = [mkLine("Lanceur sous Téléfrag consommé", cfg.base)];
  for (let n = 1; n <= cfg.max; n++) lines.push(mkLine(`${n} charge${n > 1 ? "s" : ""}`, cfg.base + n));
  return lines;
}

function estimateRoomLines(
  spell: RoomSpell,
  level: number,
  stats: CharacterStats,
  target: TargetStats,
): RoomLineEstimate[] {
  const rank = roomRankKey(spell, level);
  if (!rank) return [];
  const isRanged = roomIsRanged(spell, rank);
  const lines: RoomLineEstimate[] = [];

  for (const fullLine of spell.lines ?? []) {
    const rankLine = fullLine[rank];
    if (!rankLine) continue;
    for (const [stat, effect] of Object.entries(rankLine)) {
      if (!effect.normal) continue;
      const label = effect.label?.fr?.trim() ?? "";
      const min = estimateRoomValue(effect.normal.min, stat, stats, target, false, isRanged);
      const max = estimateRoomValue(effect.normal.max, stat, stats, target, false, isRanged);
      const critMin = effect.critical
        ? estimateRoomValue(effect.critical.min, stat, stats, target, true, isRanged)
        : undefined;
      const critMax = effect.critical
        ? estimateRoomValue(effect.critical.max, stat, stats, target, true, isRanged)
        : undefined;
      lines.push({
        label,
        stat,
        baseMin: effect.normal.min,
        baseMax: effect.normal.max,
        baseCritMin: effect.critical?.min,
        baseCritMax: effect.critical?.max,
        min,
        max,
        critMin,
        critMax,
      });
    }
  }

  return lines;
}

function specialDamageNote(description: string): string | null {
  const normalized = description
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (normalized.includes("dommages sont augmentes") && normalized.includes("telefrag")) {
    return "Téléfrag : les dégâts augmentent selon les Téléfrags consommés depuis le dernier lancer. DofusRoom expose les lignes de base mais pas le coefficient public du cumul.";
  }
  return null;
}

const RENDER_AVAILABLE = typeof window !== "undefined" && !!window.dofusCodex?.renderSkin;

// Panneau central du paper-doll : rendu du perso (DofusRoom, classe de base rotative) + nom/niveau + KPIs.
function CharacterPanel({
  breed,
  level,
  kpi,
  filled,
  total,
  className,
}: {
  breed: Breed;
  level: number;
  kpi: { hp: number; pa: number; pm: number; po: number };
  filled: number;
  total: number;
  className?: string;
}) {
  const [illusOk, setIllusOk] = useState(true);
  const [orientation, setOrientation] = useState(1);
  const [gender, setGender] = useState<"m" | "f">("m");
  const illus = classIllus(breed.id);

  // Rendu du personnage via DofusRoom (classe de base, rotatif/genré). On n'envoie PAS
  // l'équipement : le renderer attend ses ids internes, introuvables depuis nos ids Ankama
  // (sa recherche d'items est gated par session). L'équipement reste affiché dans les slots.
  const payload = useMemo(
    () => buildSkinPayload(breed.id, {}, gender, orientation),
    [breed.id, gender, orientation],
  );
  const { data: skin, isFetching } = useQuery({
    queryKey: ["skin", payload ? skinKey(payload) : "none"],
    queryFn: () => renderSkin(payload!),
    enabled: RENDER_AVAILABLE && !!payload,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
    retry: 1,
    placeholderData: (prev) => prev, // garde le rendu précédent pendant le re-render (pas de flash)
  });

  const kpis: { dofus: DofusIconName; tone: string; label: string; value: number }[] = [
    { dofus: "pv", tone: "text-glow-rose", label: "PV", value: kpi.hp },
    { dofus: "pa", tone: "text-glow-cyan", label: "PA", value: kpi.pa },
    { dofus: "pm", tone: "text-glow-emerald", label: "PM", value: kpi.pm },
    { dofus: "po", tone: "text-glow-violet", label: "PO", value: kpi.po },
  ];

  // Pseudo-3D : position du curseur normalisée (-0.5 → 0.5) sur la carte.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 160, damping: 18, mass: 0.4 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), spring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-8, 8]), spring);
  // Le perso (premier plan) suit légèrement le curseur ; le fond recule → profondeur.
  const frontX = useSpring(useTransform(px, [-0.5, 0.5], [-14, 14]), spring);
  const frontY = useSpring(useTransform(py, [-0.5, 0.5], [-10, 10]), spring);
  const bgX = useSpring(useTransform(px, [-0.5, 0.5], [12, -12]), spring);
  const bgY = useSpring(useTransform(py, [-0.5, 0.5], [10, -10]), spring);
  const glowX = useTransform(px, [-0.5, 0.5], ["25%", "75%"]);
  const glowY = useTransform(py, [-0.5, 0.5], ["20%", "80%"]);
  const glow = useMotionTemplate`radial-gradient(circle at ${glowX} ${glowY}, rgba(124,92,255,0.4), transparent 55%)`;

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  const showSkin = RENDER_AVAILABLE && !!skin;
  const showLoader = RENDER_AVAILABLE && !skin && isFetching;

  return (
    <div className={className} style={{ perspective: 1000 }}>
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY }}
        className="relative flex min-h-[480px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-void-800/40 will-change-transform"
      >
        {/* Fond : illustration de classe floutée (recule en parallax) */}
        {illus && illusOk && (
          <motion.img
            src={illus}
            alt=""
            onError={() => setIllusOk(false)}
            style={{ x: bgX, y: bgY }}
            className="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover object-[center_20%] opacity-20 blur-md"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void-900/50 via-void-900/20 to-void-900" />
        <motion.div style={{ background: glow }} className="pointer-events-none absolute inset-0 mix-blend-screen" />

        {/* Crest + nom + niveau */}
        <div className="relative z-10 flex items-center gap-3 p-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-void-900/70 ring-1 ring-white/15 backdrop-blur">
            <img src={breed.img} alt="" className="h-9 w-9 object-contain" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-display text-2xl font-extrabold leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
              {breed.name.fr}
            </h3>
            <div className="mt-0.5 flex items-center gap-2">
              <Pill tone={levelTone(level)}>Niv. {level}</Pill>
              <span className="text-xs font-medium text-slate-300">{filled}/{total} équipés</span>
            </div>
          </div>
        </div>

        {/* Rendu du personnage équipé (premier plan, parallax) */}
        <div className="relative z-10 flex flex-1 items-center justify-center px-4">
          {showSkin ? (
            <motion.img
              key={skin!.slice(-24)}
              src={skin!}
              alt={`${breed.name.fr} équipé`}
              style={{ x: frontX, y: frontY }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="max-h-[320px] w-auto object-contain drop-shadow-[0_18px_36px_rgba(0,0,0,0.65)]"
            />
          ) : showLoader ? (
            <DofusLoader label="Rendu du personnage…" />
          ) : illus && illusOk ? (
            <motion.img
              src={illus}
              alt={breed.name.fr}
              style={{ x: frontX, y: frontY }}
              className="max-h-[300px] w-full rounded-xl object-cover object-[center_20%]"
            />
          ) : (
            <img src={breed.img} alt={breed.name.fr} className="h-28 w-28 object-contain opacity-80" />
          )}
          {showSkin && isFetching && (
            <div className="absolute right-3 top-1">
              <DofusLoader />
            </div>
          )}
        </div>

        {/* Contrôles : rotation + genre (uniquement si le rendu est dispo) */}
        {RENDER_AVAILABLE && (
          <div className="relative z-10 flex items-center justify-center gap-2 pb-3 pt-1">
            <button
              onClick={() => setOrientation((o) => (o + 7) % 8)}
              title="Pivoter à gauche"
              className="no-drag grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setGender((g) => (g === "m" ? "f" : "m"))}
              title="Changer de sexe"
              className="no-drag h-8 rounded-lg border border-white/10 bg-white/5 px-3 text-sm font-bold text-slate-300 transition hover:bg-white/10"
            >
              {gender === "m" ? "♂" : "♀"}
            </button>
            <button
              onClick={() => setOrientation((o) => (o + 1) % 8)}
              title="Pivoter à droite"
              className="no-drag grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* KPIs sous le perso */}
        <div className="relative z-10 grid grid-cols-2 gap-2 p-3 sm:grid-cols-4">
          {kpis.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2"
            >
              <DofusIcon name={s.dofus} size={20} />
              <div className="min-w-0">
                <div className="font-display text-lg font-bold leading-none text-white">{s.value}</div>
                <div className="text-[10px] uppercase tracking-wide text-slate-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function SlotCard({
  slot,
  itemId,
  exo,
  onExo,
  onOpen,
  onClear,
}: {
  slot: SlotDef;
  itemId?: number;
  exo: ExoType;
  onExo: (v: ExoType) => void;
  onOpen: () => void;
  onClear: () => void;
}) {
  const { data: item } = useQuery({
    queryKey: ["equipment", itemId ?? 0],
    queryFn: ({ signal }) => getEquipment(itemId!, signal),
    enabled: !!itemId,
    staleTime: 1000 * 60 * 30,
  });

  // Tooltip rendu dans un portal (fixed) pour échapper au `overflow-y-auto` du <main>.
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{ left: number; below: boolean; offset: number; maxH: number } | null>(null);
  const closeTimer = useRef<number | null>(null);
  const TIP_W = 288;

  const cancelClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const openTip = () => {
    cancelClose();
    if (!itemId) return;
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    const center = r.left + r.width / 2;
    const left = Math.max(8, Math.min(window.innerWidth - TIP_W - 8, center - TIP_W / 2));
    // Toujours vers le bas ; la hauteur est bornée à l'espace disponible (liste scrollable).
    const below = true;
    const offset = r.bottom + 8;
    const maxH = Math.max(140, Math.floor(window.innerHeight - r.bottom - 16));
    setTip({ left, below, offset, maxH });
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setTip(null), 130);
  };
  useEffect(() => () => cancelClose(), []);

  // Lignes de jets affichées dans le tooltip (on garde les effets utiles, comme le résumé).
  const jetLines = (item?.effects ?? []).filter((e) => {
    const n = (e.type?.name ?? "").toLowerCase();
    return e.formatted && !n.includes("échangeable") && !n.includes("apparence") && !n.includes("attitude");
  });

  return (
    <motion.div
      ref={wrapRef}
      layout
      className="group relative flex flex-col items-center gap-1"
      onMouseEnter={openTip}
      onMouseLeave={scheduleClose}
    >
      <div
        className={`relative aspect-square w-full overflow-hidden rounded-2xl border bg-gradient-to-br from-white/[0.05] to-white/[0.01] transition hover:-translate-y-0.5 ${
          exo
            ? "border-glow-gold/45 shadow-[0_0_22px_-10px_rgba(245,196,81,0.6)]"
            : itemId
              ? "border-glow-purple/35 hover:border-glow-purple/55"
              : "border-dashed border-white/10 hover:border-glow-violet/45"
        }`}
      >
        {itemId && item ? (
          <>
            <button
              onClick={onOpen}
              title={`${item.name} — changer`}
              className="no-drag flex h-full w-full items-center justify-center p-2"
            >
              <img
                src={item.image_urls.icon}
                alt={item.name}
                loading="lazy"
                className="h-full w-full object-contain drop-shadow"
              />
            </button>
            <button
              onClick={onClear}
              title="Retirer"
              className="no-drag absolute right-1 top-1 z-10 rounded-lg bg-black/50 p-1 text-slate-300 opacity-0 transition hover:bg-glow-rose/25 hover:text-glow-rose group-hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            {exo && (
              <span className="pointer-events-none absolute bottom-1 left-1 z-10 rounded-md bg-glow-gold/20 px-1.5 py-0.5 text-[9px] font-bold leading-none text-glow-gold ring-1 ring-glow-gold/50">
                +1 {EXO_LABEL[exo]}
              </span>
            )}
          </>
        ) : (
          <button
            onClick={onOpen}
            title={slot.label}
            className="no-drag flex h-full w-full flex-col items-center justify-center gap-1.5 text-slate-600 transition group-hover:text-glow-violet"
          >
            <slot.icon className="h-7 w-7" />
          </button>
        )}
      </div>
      <p
        className={`line-clamp-1 w-full text-center text-[10px] font-medium leading-tight ${
          itemId && item ? "text-slate-300" : "text-slate-500"
        }`}
        title={itemId && item ? item.name : slot.label}
      >
        {itemId && item ? item.name : slot.label}
      </p>

      {/* Tooltip (portal fixed) : jets de l'item + sélecteur d'exo */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {tip && itemId && item && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: tip.below ? -6 : 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: tip.below ? -6 : 6 }}
                transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
                style={{
                  position: "fixed",
                  left: tip.left,
                  width: TIP_W,
                  maxHeight: tip.maxH,
                  ...(tip.below ? { top: tip.offset } : { bottom: tip.offset }),
                  transformOrigin: tip.below ? "top center" : "bottom center",
                }}
                className="z-[60] flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-void-800 p-3.5 shadow-card ring-1 ring-black/40"
              >
                <div className="mb-2.5 flex shrink-0 items-start gap-2.5 border-b border-white/10 pb-2.5">
                  <img src={item.image_urls.icon} alt="" className="h-10 w-10 shrink-0 object-contain" />
                  <div className="min-w-0">
                    <p className="truncate font-display text-base font-bold text-white">{item.name}</p>
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">
                      {item.type?.name} · Niv. {item.level}
                    </p>
                  </div>
                </div>
                {jetLines.length > 0 ? (
                  <ul className="mb-3 min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
                    {jetLines.map((e, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm leading-snug text-slate-200">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-glow-violet" />
                        {e.formatted}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mb-3 text-sm italic text-slate-500">Aucun jet.</p>
                )}
                {/* Sélecteur d'exo (forgemagie exotique) */}
                <p className="mb-1.5 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-glow-gold/80">
                  Exo (forgemagie exotique)
                </p>
                <div className="flex shrink-0 flex-wrap gap-1.5">
                  {EXO_CYCLE.map((v) => (
                    <button
                      key={v || "none"}
                      onClick={() => onExo(v)}
                      className={`no-drag rounded-lg px-2 py-1 text-xs font-bold leading-none ring-1 transition ${
                        exo === v
                          ? "bg-glow-gold/25 text-glow-gold ring-glow-gold/50"
                          : "bg-white/5 text-slate-400 ring-white/10 hover:bg-white/10 hover:text-slate-200"
                      }`}
                    >
                      {v ? `+1 ${EXO_LABEL[v]}` : "Aucun"}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </motion.div>
  );
}

// Petite carte stat (icône + valeur + libellé), façon DofusRoom mais à notre thème.
function StatChip({
  icon: Icon,
  label,
  value,
  tone,
  suffix,
}: {
  icon: DofusUiIcon;
  label: string;
  value: number;
  tone?: string;
  suffix?: string;
}) {
  const dofus = effectIconFromName(label); // icône Dofus dérivée du libellé (sinon repli Dofus)
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-2.5 py-2">
      {dofus ? (
        <DofusIcon name={dofus} size={16} />
      ) : (
        <Icon className={`h-4 w-4 shrink-0 ${tone ?? "text-slate-400"}`} />
      )}
      <div className="min-w-0">
        <div className={`font-display text-sm font-bold leading-none ${value < 0 ? "text-glow-rose" : "text-white"}`}>
          {value > 0 ? "+" : ""}
          {value}
          {suffix ?? ""}
        </div>
        <div className="truncate text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
      </div>
    </div>
  );
}
