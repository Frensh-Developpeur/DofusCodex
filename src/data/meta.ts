import { LucideIcon } from "lucide-react";
import {
  Crown,
  Wind,
  Gem,
  CircleDot,
  Anchor,
  Footprints,
  Shield,
  Sparkles,
  Trophy,
  Swords,
  Star,
  Gift,
  Sprout,
  Hammer,
  Heart,
  Coins,
  Music,
  Clock,
} from "lucide-react";

export interface SlotDef {
  id: string; // DofusDude type.name_id
  label: string;
  icon: LucideIcon;
}

// Catégories filtrables du Stuffinator (DofusDude type.name_id vérifiés contre l'API).
export const SLOTS: SlotDef[] = [
  { id: "hat", label: "Chapeau", icon: Crown },
  { id: "cloak", label: "Cape", icon: Wind },
  { id: "amulet", label: "Amulette", icon: Gem },
  { id: "ring", label: "Anneau", icon: CircleDot },
  { id: "belt", label: "Ceinture", icon: Anchor },
  { id: "boots", label: "Bottes", icon: Footprints },
  { id: "shield", label: "Bouclier", icon: Shield },
  { id: "dofus", label: "Dofus", icon: Sparkles },
  { id: "trophy", label: "Trophée", icon: Trophy },
];

export const WEAPON_SLOTS: SlotDef[] = [
  { id: "sword", label: "Épée", icon: Swords },
  { id: "bow", label: "Arc", icon: Swords },
  { id: "staff", label: "Bâton", icon: Swords },
  { id: "wand", label: "Baguette", icon: Swords },
  { id: "dagger", label: "Dague", icon: Swords },
  { id: "hammer", label: "Marteau", icon: Swords },
  { id: "axe", label: "Hache", icon: Swords },
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
export function almanaxBonusStyle(typeId: string): { icon: LucideIcon; tone: PillTone } {
  const id = typeId.toLowerCase();
  if (id.includes("experience")) return { icon: Star, tone: "gold" };
  if (id.includes("loot") || id.includes("perceptors") || id.includes("quality"))
    return { icon: Gift, tone: "purple" };
  if (
    id.startsWith("plenty") ||
    id.includes("resources") ||
    id.includes("nature") ||
    id.includes("paddock") ||
    id.includes("fish")
  )
    return { icon: Sprout, tone: "emerald" };
  if (id.includes("smithmagic") || id.includes("crushing") || id.includes("ingredients"))
    return { icon: Hammer, tone: "ember" };
  if (id.includes("challenge")) return { icon: Swords, tone: "rose" };
  if (id.includes("mounts") || id.includes("love")) return { icon: Heart, tone: "rose" };
  if (id.includes("poverty")) return { icon: Coins, tone: "cyan" };
  if (id.includes("music") || id.includes("sounds")) return { icon: Music, tone: "cyan" };
  if (id.includes("temporal") || id.includes("anomal")) return { icon: Clock, tone: "cyan" };
  return { icon: Sparkles, tone: "purple" };
}
