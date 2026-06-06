import clsx from "clsx";
import DofusIcon, { type DofusIconName } from "./DofusIcon";

export type DofusUiIcon = (props: IconProps) => JSX.Element;

type IconProps = {
  className?: string;
  size?: number | string;
  title?: string;
  fill?: string;
  strokeWidth?: number | string;
  [key: string]: unknown;
};

type Alias = {
  icon: DofusIconName;
  className?: string;
};

// Correspondance explicite des anciens noms d'icônes UI vers les icônes DofusDB.
// Les noms restent compatibles avec les imports existants, mais les choix suivent
// le vocabulaire DofusDB : donjon, monstre, quête, trophée, coffre, atelier, etc.
// Les anciens noms Lucide ne sont qu'une couche de compatibilité.
const ALIASES: Record<string, Alias> = {
  // Navigation / actions
  AlertTriangle: { icon: "warning" },
  ArrowDown: { icon: "arrowRight", className: "rotate-90" },
  ArrowDownAZ: { icon: "arrowRight", className: "rotate-90" },
  ArrowDownWideNarrow: { icon: "arrowRight", className: "rotate-90" },
  ArrowLeft: { icon: "arrowRight", className: "rotate-180" },
  ArrowRight: { icon: "arrowRight" },
  ArrowUp: { icon: "arrowRight", className: "-rotate-90" },
  ArrowUpNarrowWide: { icon: "arrowRight", className: "-rotate-90" },
  ArrowUpRight: { icon: "externalArrow" },
  Check: { icon: "tick" },
  ChevronDown: { icon: "arrowRight", className: "rotate-90 opacity-50 drop-shadow-none" },
  ChevronLeft: { icon: "arrowRight", className: "rotate-180 opacity-70 drop-shadow-none" },
  ChevronRight: { icon: "arrowRight", className: "opacity-70 drop-shadow-none" },
  Copy: { icon: "copy", className: "brightness-0 invert" },
  Download: { icon: "cadeau" },
  ExternalLink: { icon: "externalArrow" },
  Github: { icon: "externalArrow" },
  ImageOff: { icon: "warning" },
  Info: { icon: "info" },
  Loader2: { icon: "sablier" },
  Maximize2: { icon: "areaSquare" },
  Minimize2: { icon: "areaSquareWithoutDiagonal" },
  PanelLeftClose: { icon: "arrowRight", className: "rotate-180 opacity-70 drop-shadow-none" },
  PanelLeftOpen: { icon: "arrowRight", className: "opacity-70 drop-shadow-none" },
  Pencil: { icon: "fm" },
  Plus: { icon: "ajouterEtat" },
  RefreshCw: { icon: "tour" },
  RotateCcw: { icon: "tour", className: "-scale-x-100" },
  RotateCw: { icon: "tour" },
  Save: { icon: "tick" },
  Search: { icon: "search" },
  SearchX: { icon: "warning" },
  Settings: { icon: "settingsGear" },
  SlidersHorizontal: { icon: "settingsGear" },
  Trash2: { icon: "danger" },
  Upload: { icon: "teleporter" },
  X: { icon: "close" },

  // Domaines de l'app
  Activity: { icon: "world" },
  BadgeCheck: { icon: "success" },
  BookOpen: { icon: "questGroup" },
  Boxes: { icon: "chestGrey" },
  CalendarDays: { icon: "calendar" },
  CalendarRange: { icon: "calendar" },
  Compass: { icon: "world" },
  Crown: { icon: "armor" },
  Database: { icon: "workbenchOn" },
  Flag: { icon: "questGroup" },
  FlaskConical: { icon: "fm" },
  Gift: { icon: "cadeau" },
  Hammer: { icon: "weaponSmith" },
  HardDrive: { icon: "workbenchOn" },
  HardDriveDownload: { icon: "workbenchOff" },
  Hexagon: { icon: "dofusQuest" },
  Images: { icon: "glyph" },
  Layers: { icon: "menuItemsets" },
  Layers3: { icon: "menuItemsets" },
  LayoutDashboard: { icon: "world" },
  LayoutGrid: { icon: "areaCross" },
  MapPin: { icon: "ping" },
  Package: { icon: "chestGrey" },
  Palette: { icon: "fm" },
  PlayCircle: { icon: "tour" },
  Power: { icon: "energie" },
  ScrollText: { icon: "dofusQuest" },
  Shield: { icon: "shield" },
  ShieldAlert: { icon: "warning" },
  ShieldCheck: { icon: "shield" },
  Shirt: { icon: "armor" },
  Skull: { icon: "monsterGrey" },
  Sofa: { icon: "chestGrey" },
  Sparkles: { icon: "etoile" },
  Star: { icon: "etoile" },
  Sword: { icon: "weapon" },
  Swords: { icon: "weapon" },
  Tent: { icon: "world" },
  ThumbsUp: { icon: "likeHeart" },
  Timer: { icon: "sablier" },
  Trophy: { icon: "trophy" },
  WandSparkles: { icon: "fm" },
  WifiOff: { icon: "noDispellable" },

  // Stats / éléments / créatures
  Anchor: { icon: "armor" },
  Bird: { icon: "air" },
  Cat: { icon: "familier" },
  CheckCircle2: { icon: "success" },
  CircleDot: { icon: "anneau" },
  Clock: { icon: "sablier" },
  Coins: { icon: "kama" },
  Crosshair: { icon: "po" },
  Droplet: { icon: "eau" },
  Eye: { icon: "pp" },
  Flame: { icon: "feu" },
  Footprints: { icon: "armor" },
  Gauge: { icon: "initiative" },
  Gem: { icon: "starFilled" },
  Heart: { icon: "pv" },
  Lightbulb: { icon: "sagesse" },
  Mountain: { icon: "terre" },
  Music: { icon: "sagesse" },
  PawPrint: { icon: "familier" },
  Rabbit: { icon: "familier" },
  Shuffle: { icon: "echanger" },
  Snowflake: { icon: "eau" },
  Sprout: { icon: "soin" },
  Squirrel: { icon: "familier" },
  Target: { icon: "po" },
  TrendingUp: { icon: "puissance" },
  User: { icon: "group" },
  Users: { icon: "group" },
  Wind: { icon: "air" },
  Zap: { icon: "pa" },
};

function sizeFromClassName(className?: string): number {
  if (!className) return 16;
  const match = className.match(/\bh-(\d+(?:\.\d+)?)\b/);
  return match ? Number(match[1]) * 4 : 16;
}

export function dofusUiIcon(name: DofusIconName, extraClassName?: string, fallbackTitle?: string): DofusUiIcon {
  return function DirectDofusIcon({ className, size, title, ...props }: IconProps) {
    const numericSize = typeof size === "number" ? size : sizeFromClassName(className);
    return (
      <DofusIcon
        name={name}
        size={numericSize}
        className={clsx("drop-shadow-[0_1px_3px_rgba(0,0,0,0.55)]", extraClassName, className)}
        title={title ?? fallbackTitle ?? name}
        {...props}
      />
    );
  };
}

function icon(aliasName: keyof typeof ALIASES): DofusUiIcon {
  const alias = ALIASES[aliasName];
  return dofusUiIcon(alias.icon, alias.className, aliasName);
}

export const Activity = icon("Activity");
export const AlertTriangle = icon("AlertTriangle");
export const Anchor = icon("Anchor");
export const ArrowDown = icon("ArrowDown");
export const ArrowDownAZ = icon("ArrowDownAZ");
export const ArrowDownWideNarrow = icon("ArrowDownWideNarrow");
export const ArrowLeft = icon("ArrowLeft");
export const ArrowRight = icon("ArrowRight");
export const ArrowUp = icon("ArrowUp");
export const ArrowUpNarrowWide = icon("ArrowUpNarrowWide");
export const ArrowUpRight = icon("ArrowUpRight");
export const BadgeCheck = icon("BadgeCheck");
export const Bird = icon("Bird");
export const BookOpen = icon("BookOpen");
export const Boxes = icon("Boxes");
export const CalendarDays = icon("CalendarDays");
export const CalendarRange = icon("CalendarRange");
export const Cat = icon("Cat");
export const Check = icon("Check");
export const CheckCircle2 = icon("CheckCircle2");
export const ChevronDown = icon("ChevronDown");
export const ChevronLeft = icon("ChevronLeft");
export const ChevronRight = icon("ChevronRight");
export const CircleDot = icon("CircleDot");
export const Clock = icon("Clock");
export const Coins = icon("Coins");
export const Compass = icon("Compass");
export const Copy = icon("Copy");
export const Crosshair = icon("Crosshair");
export const Crown = icon("Crown");
export const Database = icon("Database");
export const Download = icon("Download");
export const Droplet = icon("Droplet");
export const ExternalLink = icon("ExternalLink");
export const Eye = icon("Eye");
export const Flag = icon("Flag");
export const Flame = icon("Flame");
export const FlaskConical = icon("FlaskConical");
export const Footprints = icon("Footprints");
export const Gauge = icon("Gauge");
export const Gem = icon("Gem");
export const Gift = icon("Gift");
export const Github = icon("Github");
export const Hammer = icon("Hammer");
export const HardDrive = icon("HardDrive");
export const HardDriveDownload = icon("HardDriveDownload");
export const Heart = icon("Heart");
export const Hexagon = icon("Hexagon");
export const ImageOff = icon("ImageOff");
export const Images = icon("Images");
export const Info = icon("Info");
export const Layers = icon("Layers");
export const Layers3 = icon("Layers3");
export const LayoutDashboard = icon("LayoutDashboard");
export const LayoutGrid = icon("LayoutGrid");
export const Lightbulb = icon("Lightbulb");
export const Loader2 = icon("Loader2");
export const MapPin = icon("MapPin");
export const Maximize2 = icon("Maximize2");
export const Minimize2 = icon("Minimize2");
export const Mountain = icon("Mountain");
export const Music = icon("Music");
export const Package = icon("Package");
export const Palette = icon("Palette");
export const PanelLeftClose = icon("PanelLeftClose");
export const PanelLeftOpen = icon("PanelLeftOpen");
export const PawPrint = icon("PawPrint");
export const Pencil = icon("Pencil");
export const PlayCircle = icon("PlayCircle");
export const Plus = icon("Plus");
export const Power = icon("Power");
export const Rabbit = icon("Rabbit");
export const RefreshCw = icon("RefreshCw");
export const RotateCcw = icon("RotateCcw");
export const RotateCw = icon("RotateCw");
export const Save = icon("Save");
export const ScrollText = icon("ScrollText");
export const Search = icon("Search");
export const SearchX = icon("SearchX");
export const Settings = icon("Settings");
export const Shield = icon("Shield");
export const ShieldAlert = icon("ShieldAlert");
export const ShieldCheck = icon("ShieldCheck");
export const Shirt = icon("Shirt");
export const Shuffle = icon("Shuffle");
export const Skull = icon("Skull");
export const SlidersHorizontal = icon("SlidersHorizontal");
export const Snowflake = icon("Snowflake");
export const Sofa = icon("Sofa");
export const Sparkles = icon("Sparkles");
export const Sprout = icon("Sprout");
export const Squirrel = icon("Squirrel");
export const Star = icon("Star");
export const Sword = icon("Sword");
export const Swords = icon("Swords");
export const Target = icon("Target");
export const Tent = icon("Tent");
export const ThumbsUp = icon("ThumbsUp");
export const Timer = icon("Timer");
export const Trash2 = icon("Trash2");
export const TrendingUp = icon("TrendingUp");
export const Trophy = icon("Trophy");
export const Upload = icon("Upload");
export const User = icon("User");
export const Users = icon("Users");
export const WandSparkles = icon("WandSparkles");
export const WifiOff = icon("WifiOff");
export const Wind = icon("Wind");
export const X = icon("X");
export const Zap = icon("Zap");
