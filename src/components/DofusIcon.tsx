import clsx from "clsx";

// Icônes officielles utilisées par DofusDB (hébergées chez eux). On mappe nos concepts
// (PA/PM/PV, caractéristiques, éléments, résistances, effets, formes de zone) vers leurs PNG.
// Base : https://dofusdb.fr/icons/<chemin>.png  (img-src https: déjà autorisé en CSP).
const BASE = "https://dofusdb.fr/icons";

// clé interne → chemin relatif (sans .png). Les caractéristiques réutilisent l'icône d'élément
// (Force→terre, Intel→feu, Chance→eau, Agilité→air, Vitalité→pv) comme dans le jeu.
const PATHS = {
  // ressources de combat
  pv: "effects/pv",
  pa: "effects/pa",
  pm: "effects/pm",
  po: "effects/po",
  pp: "effects/pp",
  pod: "effects/pod",
  // caractéristiques
  force: "effects/terre",
  intelligence: "effects/feu",
  chance: "effects/eau",
  agilite: "effects/air",
  vitalite: "effects/pv",
  sagesse: "effects/sagesse",
  puissance: "effects/puissance",
  initiative: "effects/initiative",
  tacle: "effects/tacle",
  fuite: "effects/fuite",
  // éléments (dégâts)
  terre: "effects/terre",
  feu: "effects/feu",
  eau: "effects/eau",
  air: "effects/air",
  neutre: "effects/neutre",
  // résistances
  resTerre: "effects/resTerre",
  resFeu: "effects/resFeu",
  resEau: "effects/resEau",
  resAir: "effects/resAir",
  resNeutre: "effects/resNeutre",
  // effets / divers
  dommages: "effects/dommages",
  critique: "effects/critique",
  soin: "effects/soin",
  erosion: "effects/erosion",
  invocation: "effects/invocation",
  teleporter: "effects/teleporter",
  attirer: "effects/attirer",
  echanger: "effects/echanger",
  dmgPoussee: "effects/dmgPoussee",
  retraitPA: "effects/retraitPA",
  retraitPM: "effects/retraitPM",
  esquivePA: "effects/esquivePA",
  esquivePM: "effects/esquivePM",
  bouclier: "effects/bouclier",
  etoile: "effects/etoile",
  infini: "effects/infini",
  kama: "effects/kama",
  xp: "effects/xp",
  sablier: "effects/sablier",
  teteDeMort: "effects/teteDeMort",
  quete: "effects/quete",
  queteValid: "effects/queteValid",
  zaap: "effects/zaap",
  cadeau: "effects/cadeau",
  energie: "effects/energie",
  verrouillage: "effects/verrouillage",
  seuil: "effects/seuil",
  // types de dégâts / résistances détaillées
  dmgMelee: "effects/dmgMelee",
  dmgDistance: "effects/dmgDistance",
  dmgSort: "effects/dmgSort",
  dmgArme: "effects/dmgArme",
  dmgCritique: "effects/dmgCritique",
  resArme: "effects/resArme",
  resMelee: "effects/resMelee",
  resDistance: "effects/resDistance",
  resSort: "effects/resSort",
  resCrit: "effects/resCrit",
  // entités (hors /effects)
  weapon: "weapon",
  armor: "armor",
  shield: "shield",
  panoplie: "panoplie",
  skull: "skull",
  gobbal: "gobbal",
  heal: "heal",
  chains: "chains",
  infinite: "infinite",
  starFilled: "starFilled",
  starEmpty: "starEmpty",
  turn: "turn",
  // formes de zone
  areaCircle: "areaCircle",
  areaRing: "areaRing",
  areaCross: "areaCross",
  areaDiagonalCross: "areaDiagonalCross",
  areaStar: "areaStar",
  areaLine: "areaLine",
  areaPerpendicularLine: "areaPerpendicularLine",
} as const;

export type DofusIconName = keyof typeof PATHS;

export function dofusIconUrl(name: DofusIconName): string {
  return `${BASE}/${PATHS[name]}.png`;
}

// Nom de caractéristique/effet (FR, ex. « Vitalité », « Dommages Feu », « Résistance Terre »,
// « PA », « Prospection »…) → icône Dofus. Renvoie null si rien de pertinent.
export function effectIconFromName(name?: string): DofusIconName | null {
  if (!name) return null;
  const n = name.toLowerCase();
  // résistances (avant les éléments nus)
  if (/résist|resist|réduction/.test(n)) {
    if (n.includes("terre")) return "resTerre";
    if (n.includes("feu")) return "resFeu";
    if (n.includes("eau")) return "resEau";
    if (n.includes("air")) return "resAir";
    if (n.includes("neutre")) return "resNeutre";
    if (n.includes("mêlée") || n.includes("melee")) return "resMelee";
    if (n.includes("distance")) return "resDistance";
    if (n.includes("sort")) return "resSort";
    if (n.includes("critique")) return "resCrit";
    if (n.includes("arme") || n.includes("poussée")) return "resArme";
    return "bouclier";
  }
  // dommages élémentaires / divers
  if (n.includes("dommage")) {
    if (n.includes("terre")) return "terre";
    if (n.includes("feu")) return "feu";
    if (n.includes("eau")) return "eau";
    if (n.includes("air")) return "air";
    if (n.includes("neutre")) return "neutre";
    if (n.includes("mêlée") || n.includes("melee")) return "dmgMelee";
    if (n.includes("distance")) return "dmgDistance";
    if (n.includes("sort")) return "dmgSort";
    if (n.includes("critique")) return "dmgCritique";
    if (n.includes("arme")) return "dmgArme";
    return "dommages";
  }
  if (n.includes("vol ")) {
    if (n.includes("terre")) return "terre";
    if (n.includes("feu")) return "feu";
    if (n.includes("eau")) return "eau";
    if (n.includes("air")) return "air";
    return "neutre";
  }
  if (n.includes("soin")) return "soin";
  if (n.includes("vitalité") || n.includes("vie")) return "vitalite";
  if (n.includes("force")) return "force";
  if (n.includes("intelligence")) return "intelligence";
  if (n.includes("chance")) return "chance";
  if (n.includes("agilité")) return "agilite";
  if (n.includes("sagesse")) return "sagesse";
  if (n.includes("puissance")) return "puissance";
  if (n.includes("initiative")) return "initiative";
  if (n.includes("prospection")) return "pp";
  if (n.includes("pods")) return "pod";
  if (n.includes("invocation")) return "invocation";
  if (n.includes("tacle")) return "tacle";
  if (n.includes("fuite")) return "fuite";
  if (n.includes("érosion") || n.includes("erosion")) return "erosion";
  if (n.includes("esquive pa")) return "esquivePA";
  if (n.includes("esquive pm")) return "esquivePM";
  if (n.includes("retrait pa") || n.includes("perte pa")) return "retraitPA";
  if (n.includes("retrait pm") || n.includes("perte pm")) return "retraitPM";
  if (n.includes("kama")) return "kama";
  if (/\bpa\b|point.*action/.test(n)) return "pa";
  if (/\bpm\b|point.*mouvement/.test(n)) return "pm";
  if (/\bpo\b|portée/.test(n)) return "po";
  if (n.includes("critique")) return "critique";
  if (n.includes("bouclier") || n.includes("armure")) return "bouclier";
  return null;
}

// Élément (0 Neutre · 1 Terre · 2 Feu · 3 Eau · 4 Air) → clé d'icône.
const ELEMENT_ICON: DofusIconName[] = ["neutre", "terre", "feu", "eau", "air"];
export function elementIcon(element: number): DofusIconName {
  return ELEMENT_ICON[element] ?? "neutre";
}

export default function DofusIcon({
  name,
  size = 16,
  className,
  title,
}: {
  name: DofusIconName;
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <img
      src={dofusIconUrl(name)}
      alt={title ?? name}
      title={title}
      width={size}
      height={size}
      loading="lazy"
      className={clsx("inline-block shrink-0 object-contain", className)}
      style={{ width: size, height: size }}
      onError={(e) => (e.currentTarget.style.opacity = "0")}
    />
  );
}
