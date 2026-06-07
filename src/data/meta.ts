import { dofusUiIcon, type DofusUiIcon } from "../components/DofusIcons";

export interface SlotDef {
  id: string; // DofusDude type.name_id
  label: string;
  icon: DofusUiIcon;
}

// Icônes de slots officielles du client Dofus 3 (placeholders gris distincts par type).
const HatIcon = dofusUiIcon("slotHat");
const CloakIcon = dofusUiIcon("slotCloak");
const AmuletIcon = dofusUiIcon("slotAmulet");
const RingIcon = dofusUiIcon("slotRing");
const BeltIcon = dofusUiIcon("slotBelt");
const BootsIcon = dofusUiIcon("slotBoots");
const ShieldIcon = dofusUiIcon("slotShield");
const DofusSlotIcon = dofusUiIcon("slotDofus");
const TrophyIcon = dofusUiIcon("slotTrophy");
const WeaponIcon = dofusUiIcon("weaponColored");

const AlmanaxXpIcon = dofusUiIcon("xp");
const AlmanaxLootIcon = dofusUiIcon("reward");
const AlmanaxHarvestIcon = dofusUiIcon("resources");
const AlmanaxCraftIcon = dofusUiIcon("job");
const AlmanaxChallengeIcon = dofusUiIcon("epeesCroisees");
const AlmanaxMountIcon = dofusUiIcon("mount");
const AlmanaxKamaIcon = dofusUiIcon("kama");
const AlmanaxKnowledgeIcon = dofusUiIcon("sagesse");
const AlmanaxTimeIcon = dofusUiIcon("sablier");
const AlmanaxDefaultIcon = dofusUiIcon("etoile");

// Catégories filtrables du Stuffinator (DofusDude type.name_id vérifiés contre l'API).
export const SLOTS: SlotDef[] = [
  { id: "hat", label: "Chapeau", icon: HatIcon },
  { id: "cloak", label: "Cape", icon: CloakIcon },
  { id: "amulet", label: "Amulette", icon: AmuletIcon },
  { id: "ring", label: "Anneau", icon: RingIcon },
  { id: "belt", label: "Ceinture", icon: BeltIcon },
  { id: "boots", label: "Bottes", icon: BootsIcon },
  { id: "shield", label: "Bouclier", icon: ShieldIcon },
  { id: "dofus", label: "Dofus", icon: DofusSlotIcon },
  { id: "trophy", label: "Trophée", icon: TrophyIcon },
];

export const WEAPON_SLOTS: SlotDef[] = [
  { id: "sword", label: "Épée", icon: WeaponIcon },
  { id: "bow", label: "Arc", icon: WeaponIcon },
  { id: "staff", label: "Bâton", icon: WeaponIcon },
  { id: "wand", label: "Baguette", icon: WeaponIcon },
  { id: "dagger", label: "Dague", icon: WeaponIcon },
  { id: "hammer", label: "Marteau", icon: WeaponIcon },
  { id: "axe", label: "Hache", icon: WeaponIcon },
];

// Couleur d'accent selon le type d'effet (pour colorer les lignes de stats).
export function effectTone(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("vitalité") || n.includes("vie")) return "text-glow-rose";
  if (n.includes("force") || n.includes("terre")) return "text-amber-400";
  if (n.includes("intelligence") || n.includes("feu")) return "text-glow-ember";
  if (n.includes("chance") || n.includes("eau")) return "text-glow-cyan";
  if (n.includes("agilité") || n.includes("air")) return "text-glow-emerald";
  if (n.includes("sagesse")) return "text-glow-violet";
  if (n.includes("puissance") || n.includes("dommage")) return "text-glow-gold";
  if (n.includes("po") || n.includes("portée")) return "text-sky-300";
  if (n.includes("pa") || n.includes("pm")) return "text-white";
  if (n.includes("résistance") || n.includes("%")) return "text-slate-300";
  return "text-slate-300";
}

// Couleur de pastille selon le palier de niveau.
export function levelTone(level: number): "emerald" | "cyan" | "gold" | "ember" | "rose" {
  if (level < 50) return "emerald";
  if (level < 110) return "cyan";
  if (level < 170) return "gold";
  if (level < 200) return "ember";
  return "rose";
}

export type PillTone = "purple" | "cyan" | "gold" | "ember" | "emerald" | "rose" | "slate";

// Icône + accent couleur d'un bonus Almanax, regroupés par famille (le `type.id`
// DofusDude est en kebab-case stable). Sert à colorer cartes et pastilles.
export function almanaxBonusStyle(typeId: string): { icon: DofusUiIcon; tone: PillTone } {
  const id = typeId.toLowerCase();
  if (id.includes("experience")) return { icon: AlmanaxXpIcon, tone: "gold" };
  if (id.includes("loot") || id.includes("perceptors") || id.includes("quality"))
    return { icon: AlmanaxLootIcon, tone: "purple" };
  if (
    id.startsWith("plenty") ||
    id.includes("resources") ||
    id.includes("nature") ||
    id.includes("paddock") ||
    id.includes("fish")
  )
    return { icon: AlmanaxHarvestIcon, tone: "emerald" };
  if (id.includes("smithmagic") || id.includes("crushing") || id.includes("ingredients"))
    return { icon: AlmanaxCraftIcon, tone: "ember" };
  if (id.includes("challenge")) return { icon: AlmanaxChallengeIcon, tone: "rose" };
  if (id.includes("mounts") || id.includes("love")) return { icon: AlmanaxMountIcon, tone: "rose" };
  if (id.includes("poverty")) return { icon: AlmanaxKamaIcon, tone: "cyan" };
  if (id.includes("music") || id.includes("sounds")) return { icon: AlmanaxKnowledgeIcon, tone: "cyan" };
  if (id.includes("temporal") || id.includes("anomal")) return { icon: AlmanaxTimeIcon, tone: "cyan" };
  return { icon: AlmanaxDefaultIcon, tone: "purple" };
}

// Ordre canonique « comme un item » pour trier les bonus de panoplie (DofusDude les
// renvoie en vrac). Rang par nom d'effet : caracs primaires → secondaires/utilitaires
// → dommages → résistances en dernier. Tri stable côté appelant (égalités conservées).
export function statRank(name: string): number {
  const n = (name || "").toLowerCase();
  if (/retrait\s*pa/.test(n)) return 30;
  if (/retrait\s*pm/.test(n)) return 31;
  if (/esquive\s*pa/.test(n)) return 32;
  if (/esquive\s*pm/.test(n)) return 33;
  if (/vitalit|(?:^|\s)vie\b/.test(n)) return 0;
  if (/sagesse/.test(n)) return 1;
  if (/force/.test(n)) return 2;
  if (/intelligence/.test(n)) return 3;
  if (/chance/.test(n)) return 4;
  if (/agilit/.test(n)) return 5;
  if (/puissance/.test(n) && !/piège|piege/.test(n)) return 6;
  if (/\bpa\b|points?\s*d['’]action/.test(n)) return 7;
  if (/\bpm\b|points?\s*de\s*mouvement/.test(n)) return 8;
  if (/portée|portee|\bpo\b/.test(n)) return 9;
  if (/initiative/.test(n)) return 10;
  if (/prospection|\bpp\b/.test(n)) return 11;
  if (/invocation/.test(n)) return 12;
  if (/pods/.test(n)) return 13;
  if (/tacle/.test(n)) return 14;
  if (/fuite/.test(n)) return 15;
  if (/soin/.test(n)) return 40;
  if (/renvoi/.test(n)) return 41;
  if (/dommage|dégât|degat/.test(n)) {
    if (/critique/.test(n)) return 55;
    if (/poussée|poussee/.test(n)) return 56;
    if (/piège|piege/.test(n)) return 57;
    if (/neutre/.test(n)) return 50;
    if (/terre/.test(n)) return 51;
    if (/feu/.test(n)) return 52;
    if (/eau/.test(n)) return 53;
    if (/air/.test(n)) return 54;
    return 49;
  }
  if (/critique/.test(n)) return 60;
  if (/résist|resist|réduction|reduction/.test(n)) {
    if (/critique/.test(n)) return 75;
    if (/poussée|poussee/.test(n)) return 76;
    if (/neutre/.test(n)) return 70;
    if (/terre/.test(n)) return 71;
    if (/feu/.test(n)) return 72;
    if (/eau/.test(n)) return 73;
    if (/air/.test(n)) return 74;
    return 77;
  }
  return 90;
}
