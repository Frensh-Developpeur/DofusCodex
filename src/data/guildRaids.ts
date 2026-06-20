// Raids de guilde (Dofus 3, intro. 3.6) — données curées depuis DofusPourLesNoobs (DPLN).
// Activité de guilde : une équipe de joueurs réalise un maximum d'objectifs dans un temps imparti
// pour débloquer les récompenses d'une frise. Pas d'API → fiches de référence + guide complet
// et illustration hotlinkés depuis DPLN.

const DPLN = "https://www.dofuspourlesnoobs.com";

export interface RaidStat {
  label: string;
  value: string;
}

export interface GuildRaid {
  slug: string;
  name: string;
  image: string;
  guideUrl: string;
  intro: string;
  stats: RaidStat[];
  highlights: string[]; // points clés du contenu
}

export const GUILD_RAIDS_INTRO =
  "Introduits avec la mise à jour 3.6, les Raids de Guilde réunissent une équipe de joueurs d'une même " +
  "guilde pour accomplir un maximum d'objectifs dans un temps imparti et débloquer les récompenses d'une frise. " +
  "Il faut appartenir à une guilde et disposer du droit de création de raids ; le raid se crée depuis la boutique " +
  "(onglet Raids de Guilde), puis se lance quand l'équipe est prête.";

export const GUILD_RAIDS: GuildRaid[] = [
  {
    slug: "sanctuaire-des-jardins-eternels",
    name: "Sanctuaire des Jardins éternels",
    image: `${DPLN}/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/ilus-tutos/sanctuaire-jardins-eternels.jpg`,
    guideUrl: `${DPLN}/sanctuaire-des-jardins-eternels.html`,
    intro:
      "Un raid d'énigmes et de combats : chaque action réalisée rapporte du score. Quatre énigmes, quatre gardiens, " +
      "80 monstres à vaincre et deux boss finaux.",
    stats: [
      { label: "Coût de création", value: "480 Kamas de guilde" },
      { label: "Membres", value: "8 à 16" },
      { label: "Durée max", value: "2 heures" },
      { label: "Score max", value: "50 000" },
    ],
    highlights: ["4 énigmes à déchiffrer", "4 gardiens", "80 monstres", "2 boss finaux"],
  },
  {
    slug: "gouffre-du-gigalodon",
    name: "Gouffre du Gigalodon",
    image: `${DPLN}/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/ilus-tutos/gouffre-gigalodon.jpg`,
    guideUrl: `${DPLN}/gouffre-du-gigalodon.html`,
    intro:
      "Un raid bâti sur une mécanique de lumière : moins une zone est éclairée, plus ses monstres (et les boss) " +
      "sont surpuissants. Essentiellement des combats, du drop et des boss, avec deux énigmes.",
    stats: [
      { label: "Coût de création", value: "360 Kamas de guilde" },
      { label: "Membres", value: "8 à 12" },
      { label: "Durée max", value: "1 heure" },
      { label: "Score max", value: "Infini" },
    ],
    highlights: ["Mécanique de lumière", "20 groupes de monstres", "2 énigmes", "Boss à vaincre"],
  },
];
