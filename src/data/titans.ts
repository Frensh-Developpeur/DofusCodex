// Titans (contenu Dofus 3) — données curées depuis DofusPourLesNoobs (DPLN).
// Les Titans sont des boss colossaux logés au cœur des dimensions divines, affrontables dans
// leur Temple. Pas d'API publique → contenu de référence rédigé + illustration et guide complet
// hotlinkés depuis DPLN (cf. memory dungeon-strat-images : hotlink DPLN autorisé).

const DPLN = "https://www.dofuspourlesnoobs.com";

export interface TitanFact {
  label: string;
  value: string;
}

export interface Titan {
  slug: string;
  name: string;
  order: string; // ex. « 1er Titan »
  dimension: string;
  image: string; // illustration (hotlink DPLN)
  guideUrl: string; // guide complet DPLN
  intro: string;
  facts: TitanFact[];
  sections: { title: string; body: string }[];
}

// Intro générale affichée en tête de page.
export const TITANS_INTRO =
  "Les Titans sont des créatures colossales sur lesquelles reposent les dimensions divines. " +
  "Corrompus par un parasite, ils ne peuvent être affrontés qu'en fin de semaine, dans leur Temple, " +
  "après avoir présenté une offrande. Un défi d'endgame qui récompense les groupes les mieux préparés.";

export const TITANS: Titan[] = [
  {
    slug: "gargandyas",
    name: "Gargandyas",
    order: "1er Titan",
    dimension: "Osavora",
    image: `${DPLN}/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/Accueil/News/actu-gargandyas.jpg`,
    guideUrl: `${DPLN}/temple-de-gargandyas.html`,
    intro:
      "Gargandyas est le premier Titan de Dofus. La dimension Osavora repose littéralement sur son dos : " +
      "on n'affronte donc pas le Titan directement, mais la corruption qui le ronge, dans son Temple.",
    facts: [
      { label: "Dimension", value: "Osavora" },
      { label: "Entrée du temple", value: "Osavora [17,8] (téléporteur en [10,11])" },
      { label: "Quête liée", value: "Destructeur de mondes" },
      { label: "Fenêtre d'accès", value: "Week-end : du vendredi 19h au lundi 8h" },
      { label: "Victoires / week-end", value: "5 maximum" },
      { label: "Tentatives", value: "Illimitées (depuis la 3.4)" },
      { label: "Clef", value: "Aucune — une offrande à la place" },
    ],
    sections: [
      {
        title: "Conditions d'accès",
        body:
          "Le Titan n'est accessible que le week-end (vendredi 19h → lundi 8h), pour 5 victoires maximum. " +
          "Depuis la 3.4, le nombre de tentatives est illimité. Aucune clef n'est requise : il faut présenter " +
          "une offrande pour ouvrir l'accès au combat.",
      },
      {
        title: "L'offrande",
        body:
          "L'offrande se drope sur les familles de monstres d'Osavora. La famille concernée change à chaque " +
          "saison (la ressource n'est droppable que pendant sa saison). La PP et les challenges augmentent le " +
          "taux de drop. Consulte le guide complet DPLN pour le tableau saison par saison.",
      },
    ],
  },
];
