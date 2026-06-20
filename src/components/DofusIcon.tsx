import clsx from "clsx";

// Icônes utilisées par DofusDB (hébergées chez eux). On mappe nos concepts
// (PA/PM/PV, caractéristiques, éléments, résistances, effets, formes de zone) vers leurs PNG.
// Base : https://dofusdb.fr/icons/<chemin>.png  (img-src https: déjà autorisé en CSP).
const HOST = "https://dofusdb.fr";
const BASE = `${HOST}/icons`;
const CLIENT_ICON_BASE = `${import.meta.env.BASE_URL}dofus-icons/client`;
// Icônes officielles extraites du client Dofus 3 (uiassets_assets_2x.bundle).
// Vrai style du jeu pour les caractéristiques/éléments/résistances/stats détaillées.
const OFFICIAL_ICON_BASE = `${import.meta.env.BASE_URL}dofus-icons/official`;

// clé interne → chemin relatif (sans .png). Les caractéristiques réutilisent l'icône d'élément
// (Force→terre, Intel→feu, Chance→eau, Agilité→air, Vitalité→pv) comme dans le jeu.
const PATHS = {
  // icônes DofusDB génériques / navigation
  arrowRight: "arrowTripleTop",
  arrowTripleTop: "arrowTripleTop",
  archmonster: "archmonster",
  chestGrey: "chest_grey",
  danger: "skull",
  dispellable: "dispellable",
  dispellableAtDeath: "dispellableAtDeath",
  dofusEgg: "Quetes_tx_PictoQuest",
  dofusQuest: "Quetes_tx_PictoQuest",
  dungeon: "dungeon",
  dungeonDoor: "dungeon",
  externalArrow: "effects/liaison",
  cosmetics: "cosmetics",
  consumables: "consumables",
  resources: "resources",
  cupboard: "cupboard",
  bank: "chest_grey",
  lightning: "lightning",
  emote: "emote",
  dofus: "chest_grey",
  reset: "swirl",
  job: "scythe",
  download: "chest_grey",
  grid: "chest_grey",
  pin: "ping",
  glyph: "glyph",
  group: "group",
  hudPingGrey: "icon_hud_ping_grey",
  iconCup: "icon_cup",
  iconNpc: "icon_npc",
  iconRecipeGrey: "icon_recipe_grey",
  iconScytheGrey: "icon_scythe_grey",
  info: "info",
  likeHeart: "heart",
  mouseLeft: "mouseLeft",
  monsterGrey: "monster_grey",
  noDispellable: "nodispellable",
  nodispellable: "nodispellable",
  pip: "pip",
  ping: "icon_hud_ping_grey",
  questDungeon: "dungeon",
  questGroup: "quest_grp",
  questRepeatable: "quest_repeatable",
  redCross: "effects/soin",
  recoltable: "scythe",
  scythe: "scythe",
  search: "effects/pp",
  settingsGear: "seuil",
  success: "success",
  tick: "tick",
  trophy: "icon_cup",
  warning: "nodispellable",
  weaponSmith: "weaponSmith",
  workbenchOff: "workbench_off",
  workbenchOn: "workbench_on",
  world: "world",
  genealogy: "world", // repli distant ; l'icône réelle est l'asset officiel ci-dessous
  calendar: "calendar",
  close: "close",
  closeRed: "close",
  havenbag: "world",
  inventory: "chest_grey",
  map: "world",
  copy: "effects/liaison",
  share: "effects/liaison",
  characteristic: "effects/etoile",
  character: "group",
  book: "quest_grp",
  bestiary: "monster_grey",
  boss: "monster_grey",
  reward: "effects/cadeau",
  spells: "effects/multiElement",
  target: "effects/croix",
  zoom: "effects/pp",
  companions: "effects/familier",
  mount: "effects/familier",
  dragodinde: "effects/familier",
  horseshoe: "effects/familier",
  weaponColored: "weapon",
  crown: "icon_cup",
  questionMark: "info",
  titan: "monster_grey", // fallback distant ; icône réelle = asset officiel (iconBossSkull)
  guild: "group", // fallback distant ; icône réelle = asset officiel (guild.png)
  key: "info", // fallback distant ; icône réelle = asset officiel (key.png)
  eye: "info", // fallback distant ; icône réelle = asset client (eye.png)
  // slots d'équipement (résolus en officiel ci-dessous ; fallback distant générique)
  slotHat: "armor",
  slotCloak: "armor",
  slotAmulet: "armor",
  slotRing: "effects/anneau",
  slotBelt: "armor",
  slotBoots: "armor",
  slotShield: "shield",
  slotDofus: "armor",
  slotTrophy: "icon_cup",
  slotWeapon: "weapon",
  slotPet: "effects/familier",
  // flèches de chasse au trésor (0=droite 2=bas 4=gauche 6=haut)
  huntArrowRight: "arrowTripleTop",
  huntArrowDown: "arrowTripleTop",
  huntArrowLeft: "arrowTripleTop",
  huntArrowUp: "arrowTripleTop",
  menuItemsets: "/menu/menu_itemsets.png",
  menuStuffs: "/menu/menu_stuffs.png",

  // ressources de combat
  pv: "effects/pv",
  pa: "effects/pa",
  pm: "effects/pm",
  po: "effects/po",
  pp: "effects/pp",
  pod: "effects/pod",
  pvOfficial: "characteristics/tx_health",
  paOfficial: "characteristics/tx_actionPoints",
  pmOfficial: "characteristics/tx_movementPoints",
  poOfficial: "characteristics/tx_range",
  ppOfficial: "characteristics/tx_prospecting",
  podsOfficial: "characteristics/tx_pods",
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
  forceOfficial: "characteristics/tx_strength",
  intelligenceOfficial: "characteristics/tx_intelligence",
  chanceOfficial: "characteristics/tx_chance",
  agiliteOfficial: "characteristics/tx_agility",
  sagesseOfficial: "characteristics/tx_carac_wisdom",
  initiativeOfficial: "characteristics/tx_initiative",
  tacleOfficial: "characteristics/tx_tackle",
  fuiteOfficial: "characteristics/tx_escape",
  dommageOfficial: "characteristics/tx_damage",
  critiqueOfficial: "characteristics/tx_crit",
  dommageCritiqueOfficial: "characteristics/tx_criticalDamage",
  resCritiqueOfficial: "characteristics/tx_criticalReduction",
  soinOfficial: "characteristics/tx_heal",
  dommageDistanceOfficial: "characteristics/tx_distanceDamage",
  dommageMeleeOfficial: "characteristics/tx_meleeDamage",
  dommageSortOfficial: "characteristics/tx_spellDamage",
  dommageArmeOfficial: "characteristics/tx_weaponDamage",
  dommagePousseeOfficial: "characteristics/tx_push",
  resPousseeOfficial: "characteristics/tx_pushReduction",
  retraitPaOfficial: "characteristics/tx_attackAP",
  retraitPmOfficial: "characteristics/tx_attackMP",
  esquivePaOfficial: "characteristics/tx_dodgeAP",
  esquivePmOfficial: "characteristics/tx_dodgeMP",
  invocationOfficial: "characteristics/tx_summonableCreaturesBoost",
  piegeOfficial: "characteristics/tx_trap",
  piegePercentOfficial: "characteristics/tx_trapPercent",
  retourOfficial: "characteristics/tx_return",
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
  ajouterEtat: "effects/ajouterEtat",
  anneau: "effects/anneau",
  armeChasse: "effects/armeChasse",
  boomerang: "effects/boomerang",
  carre: "effects/carre",
  carreSansDiagonales: "effects/carreSansDiagonales",
  cercle: "effects/cercle",
  cone: "effects/cone",
  croix: "effects/croix",
  croixCentreVide: "effects/croixCentreVide",
  croixEnDiagonale: "effects/croixEnDiagonale",
  croixEnDiagonaleCentreVide: "effects/croixEnDiagonaleCentreVide",
  demiCercle: "effects/demiCercle",
  dmgPoussee: "effects/dmgPoussee",
  resPoussee: "effects/resPoussee",
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
  teteDeMort: "effects/soin",
  quete: "effects/quete",
  queteValid: "effects/queteValid",
  zaap: "effects/zaap",
  cadeau: "effects/cadeau",
  energie: "effects/energie",
  verrouillage: "effects/verrouillage",
  seuil: "effects/seuil",
  tour: "effects/tour",
  epeesCroisees: "effects/epeesCroisees",
  familier: "effects/familier",
  fm: "effects/fm",
  fourche: "effects/fourche",
  liaison: "effects/liaison",
  ligne: "effects/ligne",
  ligneDepuisLeCaster: "effects/ligneDepuisLeCaster",
  ligneDiagonale: "effects/ligneDiagonale",
  ligneDiagonaleOrthogonale: "effects/ligneDiagonaleOrthogonale",
  ligneOrthogonale: "effects/ligneOrthogonale",
  link: "effects/liaison",
  losange: "effects/losange",
  renvoi: "effects/renvoi",
  dmgEnvoyes: "effects/dmgEnvoyes",
  dmgRecus: "effects/dmgRecus",
  piege: "effects/piege",
  piegeDeclenche: "effects/piegeDeclenche",
  multiElement: "effects/multiElement",
  retour: "characteristics/tx_return",
  // types de dégâts / résistances détaillées
  dmgMelee: "effects/dmgMelee",
  dmgDistance: "effects/dmgDistance",
  dmgSort: "effects/dmgSort",
  dmgArme: "effects/dmgArme",
  dmgCritique: "effects/dmgCritique",
  resArme: "effects/resArme",
  resMelee: "effects/resMelee",
  resDistance: "effects/resDistance",
  resMultiElement: "effects/resMultiElement",
  resSort: "effects/resSort",
  resCrit: "effects/resCrit",
  rectangle: "effects/rectangle",
  soinDonne: "effects/soinDonne",
  soinRecu: "effects/soinRecu",
  // entités (hors /effects)
  weapon: "weapon",
  armor: "armor",
  shield: "shield",
  panoplie: "panoplie",
  // alias historiques encore utilisés par certains écrans
  cup: "icon_cup",
  monster: "monster_grey",
  chest: "chest_grey",
  resource: "scythe",
  workbench: "workbench_on",
  recipe: "icon_recipe_grey",
  npc: "icon_npc",
  skull: "skull",
  gobbal: "gobbal",
  heal: "heal",
  chains: "chains",
  infinite: "infinite",
  starFilled: "starFilled",
  starEmpty: "starEmpty",
  turn: "turn",
  // formes de zone
  areaBoomerang: "areaBoomerang",
  areaCircle: "areaCircle",
  areaCone: "areaCone",
  areaCross: "areaCross",
  areaCrossWithoutCenter: "areaCrossWithoutCenter",
  areaDiagonalCross: "areaDiagonalCross",
  areaDiagonalCrossWithoutCenter: "areaDiagonalCrossWithoutCenter",
  areaDiagonalLine: "areaDiagonalLine",
  areaFork: "areaFork",
  areaHalfCircle: "areaHalfCircle",
  areaStar: "areaStar",
  areaLine: "areaLine",
  areaLineFromCaster: "areaLineFromCaster",
  areaPerpendicularDiagonalLine: "areaPerpendicularDiagonalLine",
  areaPerpendicularLine: "areaPerpendicularLine",
  areaRectangle: "areaRectangle",
  areaRing: "areaRing",
  areaSquare: "areaSquare",
  areaSquareWithoutDiagonal: "areaSquareWithoutDiagonal",
} as const;

export type DofusIconName = keyof typeof PATHS;

const CLIENT_PATHS: Partial<Record<DofusIconName, string>> = {
  // Navigation / actions extraites du client Dofus 3.
  ajouterEtat: "plus.png",
  arrowRight: "arrow-right.png",
  danger: "danger.png",
  externalArrow: "external-arrow.png",
  info: "info.png",
  likeHeart: "heart.png",
  redCross: "red-cross.png",
  sablier: "hourglass.png",
  search: "search.png",
  settingsGear: "settings.png",
  seuil: "settings.png",
  success: "success.png",
  tick: "tick.png",
  tour: "swirl.png",
  warning: "warning.png",

  // Navigation métier de l'app.
  anneau: "ring.png",
  areaCircle: "area-circle.png",
  areaCross: "area-cross.png",
  areaLine: "area-line.png",
  armor: "armor.png",
  bouclier: "shield.png",
  cadeau: "gift.png",
  chest: "chest.png",
  chestGrey: "chest.png",
  close: "close.png",
  closeRed: "close-red.png",
  dofusEgg: "dofus-egg.png",
  dofusQuest: "quest.png",
  dungeon: "dungeon.png",
  dungeonDoor: "dungeon.png",
  energie: "lightning.png",
  lightning: "lightning.png",
  etoile: "star.png",
  familier: "pet.png",
  eye: "eye.png",
  fm: "magic.png",
  glyph: "glyph.png",
  group: "group.png",
  hudPingGrey: "ping.png",
  iconCup: "trophy.png",
  iconRecipeGrey: "recipe.png",
  iconScytheGrey: "scythe.png",
  kama: "coin.png",
  menuItemsets: "sets.png",
  menuStuffs: "equipment.png",
  monster: "monster.png",
  monsterGrey: "monster.png",
  panoplie: "sets.png",
  ping: "ping.png",
  pip: "clue.png",
  pp: "eye.png",
  questDungeon: "dungeon.png",
  questGroup: "guide.png",
  questRepeatable: "calendar.png",
  recipe: "recipe.png",
  recoltable: "scythe.png",
  scythe: "scythe.png",
  shield: "shield.png",
  soin: "red-cross.png",
  starEmpty: "star-alt.png",
  starFilled: "star.png",
  trophy: "trophy.png",
  weapon: "sword.png",
  weaponSmith: "hammer.png",
  workbench: "hammer.png",
  workbenchOff: "crate.png",
  workbenchOn: "hammer.png",
  world: "world.png",
  xp: "xp.png",
};

// Caractéristiques / éléments / résistances / stats détaillées → icônes officielles
// du client Dofus 3 (fichiers tx_*.png dans /dofus-icons/official). Style authentique
// et homogène partout. Résolues AVANT le client générique et le distant dofusdb.
const OFFICIAL_PATHS: Partial<Record<DofusIconName, string>> = {
  cosmetics: "cosmetics.png",
  consumables: "consumables.png",
  resources: "resources.png",
  cupboard: "cupboard.png",
  bank: "bank.png",
  emote: "emote.png",
  dofus: "dofus.png",
  reset: "btnIcon_reset.png",
  job: "job.png",
  download: "btnIcon_update.png",
  grid: "btnIcon_grid.png",
  pin: "btnIcon_pin.png",
  // ressources de combat
  pv: "tx_health.png",
  pa: "tx_actionPoints.png",
  pm: "tx_movementPoints.png",
  po: "tx_range.png",
  pp: "tx_prospecting.png",
  pod: "tx_pods.png",
  pvOfficial: "tx_health.png",
  paOfficial: "tx_actionPoints.png",
  pmOfficial: "tx_movementPoints.png",
  poOfficial: "tx_range.png",
  ppOfficial: "tx_prospecting.png",
  podsOfficial: "tx_pods.png",
  // caractéristiques
  force: "tx_strength.png",
  intelligence: "tx_intelligence.png",
  chance: "tx_chance.png",
  agilite: "tx_agility.png",
  vitalite: "tx_vitality.png",
  sagesse: "tx_wisdom.png",
  initiative: "tx_initiative.png",
  tacle: "tx_tackle.png",
  fuite: "tx_escape.png",
  forceOfficial: "tx_strength.png",
  intelligenceOfficial: "tx_intelligence.png",
  chanceOfficial: "tx_chance.png",
  agiliteOfficial: "tx_agility.png",
  sagesseOfficial: "tx_wisdom.png",
  initiativeOfficial: "tx_initiative.png",
  tacleOfficial: "tx_tackle.png",
  fuiteOfficial: "tx_escape.png",
  // éléments (dégâts) — mêmes icônes que les caracs, comme dans le jeu
  terre: "tx_strength.png",
  feu: "tx_intelligence.png",
  eau: "tx_chance.png",
  air: "tx_agility.png",
  neutre: "tx_neutral.png",
  // résistances
  resTerre: "tx_strengthRes.png",
  resFeu: "tx_intelligenceRes.png",
  resEau: "tx_chanceRes.png",
  resAir: "tx_agilityRes.png",
  resNeutre: "tx_neutralRes.png",
  resMelee: "tx_resMelee.png",
  resDistance: "tx_distanceRes.png",
  resSort: "tx_spellsRes.png",
  resArme: "tx_weaponRes.png",
  resCrit: "tx_criticalReduction.png",
  resMultiElement: "tx_multiElement.png",
  // effets / stats détaillées
  dommages: "tx_damage.png",
  critique: "tx_crit.png",
  soin: "tx_heal.png",
  erosion: "tx_erosion.png",
  invocation: "tx_summonableCreaturesBoost.png",
  energie: "tx_energy.png",
  bouclier: "tx_healthShield.png",
  seuil: "tx_step.png",
  renvoi: "tx_return.png",
  retour: "tx_return.png",
  retourOfficial: "tx_return.png",
  piege: "tx_trap.png",
  multiElement: "tx_multiElement.png",
  dmgMelee: "tx_damageMelee.png",
  dmgDistance: "tx_distance.png",
  dmgSort: "tx_spells.png",
  dmgArme: "tx_weapon.png",
  dmgCritique: "tx_criticalDamage.png",
  dmgPoussee: "tx_push.png",
  resPoussee: "tx_pushReduction.png",
  retraitPA: "tx_attackAP.png",
  retraitPM: "tx_attackMP.png",
  esquivePA: "tx_dodgeAP.png",
  esquivePM: "tx_dodgeMP.png",
  // variantes "*Official" (mêmes fichiers)
  dommageOfficial: "tx_damage.png",
  critiqueOfficial: "tx_crit.png",
  dommageCritiqueOfficial: "tx_criticalDamage.png",
  resCritiqueOfficial: "tx_criticalReduction.png",
  soinOfficial: "tx_heal.png",
  dommageDistanceOfficial: "tx_distance.png",
  dommageMeleeOfficial: "tx_damageMelee.png",
  dommageSortOfficial: "tx_spells.png",
  dommageArmeOfficial: "tx_weapon.png",
  dommagePousseeOfficial: "tx_push.png",
  resPousseeOfficial: "tx_pushReduction.png",
  retraitPaOfficial: "tx_attackAP.png",
  retraitPmOfficial: "tx_attackMP.png",
  esquivePaOfficial: "tx_dodgeAP.png",
  esquivePmOfficial: "tx_dodgeMP.png",
  invocationOfficial: "tx_summonableCreaturesBoost.png",
  piegeOfficial: "tx_trap.png",
  piegePercentOfficial: "tx_trapPercent.png",
  // navigation / domaines (icônes officielles du jeu)
  quete: "quest.png",
  dofusQuest: "quest.png",
  etoile: "star.png",
  success: "success.png",
  calendar: "calendar.png",
  havenbag: "havenbag.png",
  inventory: "inventory.png",
  map: "map.png",
  copy: "btnIcon_copy.png",
  share: "btnIcon_share.png",
  characteristic: "characteristic.png",
  character: "character.png",
  genealogy: "genealogy.png", // arbre généalogique → icône « Arbre des guides »
  book: "encyclopedia.png",
  bestiary: "bestiary.png",
  boss: "iconBossSkull.png",
  reward: "icon_bonus_reward.png",
  spells: "spells.png",
  target: "btnIcon_focus.png",
  zoom: "icon_magnifier.png",
  companions: "companions.png",
  titan: "iconBossSkull.png",
  guild: "guild.png",
  key: "key.png",
  mount: "mount.png",
  dragodinde: "dragoturkey.png",
  horseshoe: "horseshoe.png",
  weaponColored: "equipments.png",
  // entités authentiques du client Dofus 3
  dungeon: "Quetes_tx_PictoDonjon.png",
  archmonster: "Quetes_tx_PictoArchmonster.png",
  monster: "icon_monster_grey.png",
  monsterGrey: "icon_monster_grey.png",
  skull: "icon_skull_grey.png",
  teteDeMort: "red-cross.png",
  kama: "icon_kama.png",
  recipe: "icon_recipe_grey.png",
  iconRecipeGrey: "icon_recipe_grey.png",
  scythe: "icon_scythe_grey.png",
  recoltable: "icon_scythe_grey.png",
  iconScytheGrey: "icon_scythe_grey.png",
  weaponSmith: "icon_hammer_grey.png",
  workbench: "icon_hammer_grey.png",
  workbenchOn: "icon_hammer_grey.png",
  epeesCroisees: "icon_crossed_swords_grey.png",
  crown: "tx_crown.png",
  questionMark: "tx_questionMark.png",
  // slots d'équipement (placeholders gris officiels)
  slotHat: "icon_slot_helmet_inventory.png",
  slotCloak: "icon_slot_cape_inventory.png",
  slotAmulet: "icon_slot_collar_inventory.png",
  slotRing: "icon_slot_ring_inventory.png",
  slotBelt: "icon_slot_belt_inventory.png",
  slotBoots: "icon_slot_shoe_inventory.png",
  slotShield: "icon_slot_shield_inventory.png",
  slotDofus: "icon_slot_dofus_inventory.png",
  slotTrophy: "icon_slot_trophy_inventory.png",
  slotWeapon: "icon_slot_weapon_inventory.png",
  slotPet: "icon_slot_pet_inventory.png",
  // flèches de chasse au trésor
  huntArrowRight: "icon_hunt_arrow0.png",
  huntArrowDown: "icon_hunt_arrow2.png",
  huntArrowLeft: "icon_hunt_arrow4.png",
  huntArrowUp: "icon_hunt_arrow6.png",
};

export function dofusIconUrl(name: DofusIconName): string {
  const officialPath = OFFICIAL_PATHS[name];
  if (officialPath) return `${OFFICIAL_ICON_BASE}/${officialPath}`;
  const clientPath = CLIENT_PATHS[name];
  if (clientPath) return `${CLIENT_ICON_BASE}/${clientPath}`;
  const path = PATHS[name];
  if (path.startsWith("/")) return `${HOST}${path}`;
  return `${BASE}/${path}.png`;
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
  tint,
}: {
  name: DofusIconName;
  size?: number;
  className?: string;
  title?: string;
  // Si fourni : l'icône (silhouette monochrome) est recolorée à cette couleur via un
  // masque CSS. Les icônes du client sont des <img> qui ignorent `color`/`currentColor` ;
  // le masque permet donc de teinter une silhouette (ex. slots d'équipement gris → couleur).
  tint?: string;
}) {
  const url = dofusIconUrl(name);
  if (tint) {
    return (
      <span
        title={title}
        aria-label={title ?? name}
        className={clsx("inline-block shrink-0", className)}
        style={{
          width: size,
          height: size,
          backgroundColor: tint,
          WebkitMaskImage: `url("${url}")`,
          maskImage: `url("${url}")`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
    );
  }
  return (
    <img
      src={url}
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
