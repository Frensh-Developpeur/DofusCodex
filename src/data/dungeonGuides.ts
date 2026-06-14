// Stratégies écrites pour les boss de donjon. Les API fournissent les stats/monstres
// mais pas les mécaniques rédigées : on les complète ici, avec un fallback générique
// généré pour tout donjon non couvert.
import { EXTRA_GUIDES } from "./dungeonGuidesExtra";

// Diagramme de stratégie (schéma de sort, confusion, placement…) — illustration à afficher.
export interface StratImage {
  src: string;
  caption?: string;
}

export interface BossPhase {
  title: string;
  hp?: string; // tranche de PV où la phase se déclenche
  mechanics: string[];
  danger?: "low" | "medium" | "high" | "extreme";
  images?: StratImage[]; // schémas illustrant la phase (sorts, confusions…)
}

export interface DungeonAchievement {
  name: string; // nom exact du succès
  strategy?: string; // comment l'obtenir (si connu)
  image?: string; // illustration du succès
}

export interface DungeonGuide {
  summary: string;
  recommendedLevel: string;
  composition: string;
  keyResist: string[]; // éléments à privilégier
  phases: BossPhase[];
  tips: string[];
  rewards: string[];
  achievements?: DungeonAchievement[]; // succès du donjon + stratégie
}

// Schémas de stratégie hébergés par DofusPourLesNoobs (source des guides rédigés).
const DPLN = "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384";

// Guides détaillés par id de donjon (DofusDB).
const GUIDES: Record<number, DungeonGuide> = {
  // Cour du Bouftou Royal — Bouftou Royal
  1: {
    summary:
      "Donjon d'initiation. Le Bouftou Royal n'a pas d'attaque marquante mais soigne et protège ses sbires, avec une IA fuyante : on perce ses soutiens et on le fixe au corps-à-corps.",
    recommendedLevel: "30 — 50",
    composition: "Solo possible bien stuffé ; idéal 2-3 joueurs en bas niveau.",
    keyResist: ["Air"],
    phases: [
      {
        title: "Soins & protections",
        mechanics: [
          "Guérison Bouftou soigne ses alliés de 200 PV jusqu'à 6 PO (2 fois par tour).",
          "Cuirasse Laineuse applique 70% de réduction de dégâts à un allié (7 PO).",
          "Morsure du Bouftou Royal : 100 dégâts Feu, au corps-à-corps uniquement.",
        ],
        danger: "low",
      },
      {
        title: "Les sbires",
        mechanics: [
          "Bouftou Noir applique une vulnérabilité (+20% dégâts subis) : tuez-le tôt.",
          "Chef de Guerre Bouftou avance de 3 cases et tape 50 Terre.",
          "IA fuyante : le boss attaque puis recule ; collez-lui un corps-à-corps pour le fixer.",
        ],
        danger: "low",
      },
    ],
    tips: [
      "Tapez Air (sa plus faible résistance, 25%) ; évitez le Neutre (55%).",
      "Focalisez les soutiens : Cuirasse Laineuse annule presque tous vos dégâts.",
      "Le succès « Blitzkrieg » demande un gros burst ou 6+ joueurs.",
    ],
    rewards: ["Laine du Bouftou Royal", "Coiffe / Cape du Bouftou Royal", "Familier Bouftou"],
    achievements: [
      { name: "Prudent", strategy: "Ne jamais finir son tour sur une case adjacente à un ennemi." },
      { name: "Blitzkrieg", strategy: "Achever chaque ennemi attaqué avant le début de son tour." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Un Mulou dans la Bergerie", strategy: "Les ennemis ne doivent recevoir aucun soin." },
    ],
  },

  // Donjon des Scarafeuilles — Scarabosse Doré
  45: {
    summary:
      "Le Scarabosse Doré est entouré de Scarafeuilles colorés, chacun faible à un élément précis. On répartit les cibles par couleur et on gère son retrait de PA/PM et ses soins.",
    recommendedLevel: "40 — 70",
    composition: "Groupe multi-élément idéal ; solo possible bien stuffé dès 60. Difficulté modérée.",
    keyResist: ["Blanc→Terre", "Bleu→Feu", "Rouge→Eau", "Vert→Air"],
    phases: [
      {
        title: "Tri par couleur",
        mechanics: [
          "Chaque Scarafeuille a 100% de résistance dans sa couleur et -50% de faiblesse ailleurs : Blanc→Terre, Bleu→Feu, Rouge→Eau, Vert→Air.",
          "Brouillard Empoisonné retire 6 PA / 2 PM à toute l'équipe pour 1 tour.",
          "Naissance invoque un Scarafeuille Immature tous les 5 tours (il mûrit après 2 tours).",
        ],
        danger: "low",
      },
      {
        title: "Soins & invisibilité",
        mechanics: [
          "Premiers soins soigne le boss et ses alliés de 100 PV en zone.",
          "Picoti : 60 dégâts en vol de vie dans un élément aléatoire (cible unique).",
          "Le Scarafeuille Noir retire des PM et rend le groupe invisible : tuez-le avant le tour 2.",
        ],
        danger: "medium",
      },
    ],
    tips: [
      "Tapez chaque ennemi dans sa faiblesse (-50%), jamais dans sa couleur (100%).",
      "Éliminez les Immatures avant leur transformation.",
    ],
    rewards: ["Carapaces de Scarafeuille", "Set Scarafeuille", "Ressources de forgemagie"],
    achievements: [
      { name: "Zombie", strategy: "Utiliser exactement 1 PM par tour de jeu." },
      { name: "Mains propres", strategy: "Achever les ennemis sans leur infliger de dégâts directs." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Dorée, mi fa sol", strategy: "Les invocations ennemies ne doivent subir aucun dégât." },
    ],
  },

  // Donjon des Tofus — Batofu
  48: {
    summary:
      "Donjon nerveux : les ennemis fuient (8-12 PM). Le Batofu invoque sans cesse et n'est dangereux que si on le laisse libre. On le bloque, on coupe ses invocations et on tape Feu/Eau.",
    recommendedLevel: "40 — 70",
    composition: "Une classe de tacle/blocage (Pandawa, invocations) facilite énormément. Difficulté modérée.",
    keyResist: ["Feu", "Eau"],
    phases: [
      {
        title: "Bloquer le Batofu",
        mechanics: [
          "Béco de Batofu : 110 dégâts Air jusqu'à 2 PO.",
          "Gotame invoque un Tofu Noir (relance 5 tours) ; Lancer de Tofu Fugace invoque une créature fragile qui meurt au tour 2.",
          "Encerclez le Batofu (persos ou invocations) : bloqué, il ne peut plus invoquer.",
        ],
        danger: "medium",
      },
      {
        title: "IA fuyarde",
        mechanics: [
          "Les monstres ont 8-12 PM et fuient : avancer vers eux les fait reculer, jouez à distance ou taclez.",
          "Tuez le Tofukaz avant le tour 2 pour éviter l'invisibilité de groupe.",
          "Ordre conseillé : Tofukaz → Tofoune → Batofu bloqué → Tofu Ventripotent (faible Eau, -21%).",
        ],
        danger: "medium",
      },
    ],
    tips: [
      "Le blocage transforme le donjon en formalité : dédiez-y une classe.",
      "Tapez Feu/Eau : le Batofu résiste 36% à l'Air.",
    ],
    rewards: ["Plumes de Tofu / Corbac", "Set du Corbac", "Familier Tofu"],
    achievements: [
      { name: "Statue", strategy: "Finir chaque tour sur la case où on l'a commencé, tout le combat." },
      { name: "Versatile", strategy: "N'utiliser chaque action qu'une seule fois par tour." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Bécotam", strategy: "N'infliger des dégâts qu'en ligne directe avec la cible." },
      { name: "Rats... au sens propre ou au figuré", strategy: "Combattre à 4 persos min. avec au moins un Rapiat, Rapine, Ougicle ou Hulkrap." },
    ],
  },

  // Donjon des Bworks — Bworkette
  13: {
    summary:
      "La Bworkette se soigne beaucoup (et soigne ses sbires) et monte en dégâts avec le temps. On tape Eau, on élimine ses soutiens et on évite de laisser traîner le combat.",
    recommendedLevel: "50 — 80",
    composition: "Groupe niveau 50+ ; érosion utile face aux soins. Difficulté modérée.",
    keyResist: ["Eau"],
    phases: [
      {
        title: "Les sbires",
        mechanics: [
          "La Bworkette est accompagnée de Bwork, Bwork Archer et Bwork Mage : éliminez-les en premier.",
          "Mot Croisé : 100 dégâts Feu en croix ET soigne ses alliés de 100 PV (2 fois par tour).",
          "Espacez vos personnages pour limiter les dégâts de zone.",
        ],
        danger: "medium",
      },
      {
        title: "Soins de la Bworkette",
        mechanics: [
          "Reconstitution Bwork la soigne de 50% de ses PV max tous les 6 tours.",
          "Abolition retire une de vos invocations tous les 5 tours.",
          "Appliquez de l'érosion ou un état insoignable si vos dégâts sont justes.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Eau (18% de résistance) ; évitez le Feu (48%).",
      "Ne laissez pas traîner : ses dégâts montent avec le temps.",
    ],
    rewards: ["Set Bwork", "Ressources de craft niveau 50", "Familier"],
    achievements: [
      { name: "Misanthrope", strategy: "Ne jamais finir son tour sur une case adjacente à un allié." },
      { name: "Premier", strategy: "Bworkette doit être achevé en premier." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Tombés sous le charme", strategy: "N'achever les ennemis qu'avec des combattants en état insoignable." },
      { name: "Les pandaliens", strategy: "Combattre à 4 persos min. avec au moins un Mirh, Rekto Topi, Traçon ou Logram." },
    ],
  },

  // Château du Wa Wabbit — Wa Wabbit
  52: {
    summary:
      "Le Wa Wabbit (3000-4500 PV) débuffe lourdement vos caractéristiques et soigne ses alliés. On nettoie ses sbires, on dissipe ses malus et on tape Eau/Air.",
    recommendedLevel: "60 — 90",
    composition: "Groupe de 4 : dégâts Eau/Air, dissipation des malus, espacement. Difficulté modérée.",
    keyResist: ["Eau", "Air"],
    phases: [
      {
        title: "Les sbires",
        mechanics: [
          "Accompagné de 2 Grand Pa Wabbit (1200 PV, dégâts de zone rayon 2) et 1 Wo Wabbit.",
          "Cawotte Woyale pose des glyphes de soin en croix rendant 60 PV à ses alliés (jusqu'à 5 PO).",
          "Ordre conseillé : Wo Wabbit → Grand Pa Wabbit → Wa Wabbit. Espacez-vous contre les zones.",
        ],
        danger: "medium",
      },
      {
        title: "Débuffs du Wa Wabbit",
        mechanics: [
          "Abrutissement retire 101-400 points de caractéristique (Force/Chance/Intelligence/Agilité) pour 3 tours (reset tous les 6 tours).",
          "WaWabehameha : 70 dégâts Neutre (240 en critique), cible unique à portée 11.",
          "Ventroboom (corps-à-corps) repousse de 6 cases : ne restez pas collé.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Eau/Air ; le boss résiste fortement au Neutre, à la Terre et au Feu.",
      "Dissipez les malus de caractéristiques avec un soutien.",
      "Le succès « Blitzkrieg » exige une élimination en un tour.",
    ],
    rewards: ["Set du Wabbit", "Dofus Vulbis (parcours lié)", "Familier Wabbit"],
    achievements: [
      { name: "Hardi", strategy: "Finir son tour sur une case adjacente à un ennemi." },
      { name: "Blitzkrieg", strategy: "Achever chaque ennemi attaqué avant le début de son tour." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Mené à la cawotte", strategy: "Quand une Cawotte Woyale est présente, seul le Wa Wabbit doit subir des dégâts." },
    ],
  },

  // Clos des Blops — Blop Royal
  11: {
    summary:
      "On affronte un Blop Royal coloré (Coco, Griotte, Indigo ou Reinette) : 94% de résistance dans sa propre couleur, -12% dans les autres. On le tape dans un autre élément et on gère ses invocations dangereuses.",
    recommendedLevel: "60 — 90",
    composition: "Multi-élément (chaque Blop Royal force un autre élément). Difficulté modérée.",
    keyResist: ["Tout sauf la couleur du Blop"],
    phases: [
      {
        title: "Le Blop Royal",
        mechanics: [
          "Blopunition Royale : 120 dégâts en vol de vie et vole 1-2 PM (4 PO).",
          "Blotection donne 100% de résistance dans sa couleur à un allié.",
          "Tapez le Blop dans n'importe quel élément SAUF le sien (94% de résistance).",
        ],
        danger: "medium",
      },
      {
        title: "Invocations & glyphes",
        mechanics: [
          "Blovocation invoque des créatures aléatoires, dont le Gloutoblop qui OS au corps-à-corps.",
          "Les Blyphes (glyphes des petits Blops) retirent 1 PM et infligent 60 dégâts si on finit son tour dessus.",
          "Tuez le Blopignon en priorité (gros dégâts malgré ses faibles PV).",
        ],
        danger: "medium",
      },
    ],
    tips: [
      "Éliminez le Blop Royal avant qu'il ne joue (il fuit ensuite).",
      "Ne finissez jamais un tour sur un Blyphe.",
      "Évitez le corps-à-corps du Gloutoblop (OS).",
    ],
    rewards: ["Set Blop", "Graines & ressources d'alchimie", "Familier Blop"],
    achievements: [
      { name: "Duel", strategy: "Un seul allié doit attaquer chaque ennemi durant tout le combat." },
      { name: "Prudent", strategy: "Ne jamais finir son tour sur une case adjacente à un ennemi." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Touche pas à mon blop", strategy: "Les invocations ennemies ne doivent subir aucun dégât." },
    ],
  },

  // Caverne du Koulosse — Koulosse
  30: {
    summary:
      "Le Koulosse attire à distance puis transforme ses cibles en Boufcoul (privées de PA). On coupe ses lignes de vue, on lui retire la portée et on tape Eau/Feu.",
    recommendedLevel: "100 — 130",
    composition: "Équipe multi-élément (2 Eau/Feu + 2 Terre/Air) ; classes de débuff utiles. Difficulté modérée.",
    keyResist: ["Eau", "Feu"],
    phases: [
      {
        title: "Attraction & transformation",
        mechanics: [
          "Appel du Koulosse (seul sort au tour 1) attire la cible de 10 cases en ligne (jusqu'à 8 PO).",
          "Souffle du Koulosse (dès le tour 2) transforme la cible en Boufcoul et lui retire 100 PA pour 1 tour (ligne, 5 PO) — dissipable.",
          "Coupez les lignes de vue avec le décor pour éviter attraction et transformation.",
        ],
        danger: "high",
      },
      {
        title: "Invocations",
        mechanics: [
          "Il invoque un Bouftou des Cavernes ; en coup critique, un Boufcoul qui rend invisible et donne +5 PM.",
          "Tuez le Boufcoul immédiatement avant qu'il ne rende le Koulosse invisible.",
          "Calumet de la Paix booste ses invocations (+200 stats, +5 PM, 2 tours).",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Retirez-lui la PO : limité à la mêlée, il devient quasi inoffensif.",
      "Koulosse et Boufcoul faibles Eau/Feu ; Bouftous des Cavernes faibles Terre/Air.",
    ],
    rewards: ["Set Koulosse", "Pierres précieuses", "Ressources THL intermédiaire"],
    achievements: [
      { name: "Zombie", strategy: "Utiliser exactement 1 PM par tour de jeu." },
      { name: "Mains propres", strategy: "Achever les ennemis sans leur infliger de dégâts directs." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "À la cool", strategy: "Aucun allié ne doit être transformé en Boufcool." },
    ],
  },

  // Antre du Dragon Cochon — Dragon Cochon
  6: {
    summary:
      "Boss très mécanique : dès le tour 1, « Étourderie Mortelle » transforme chaque PA dépensé en perte massive de PV. Tout le combat consiste à dissiper ce piège, rester à distance et gérer ses poisons.",
    recommendedLevel: "100 — 130",
    composition: "Équipe à distance avec dissipation (Jouvence / Lait de Bambou) et retrait PM. Pierre d'âme 100+ pour la capture.",
    keyResist: ["Feu", "Air"],
    phases: [
      {
        title: "Tour 1 — Étourderie Mortelle",
        mechanics: [
          "Au tour 1, Étourderie Mortelle inflige 750 dégâts Air + 750 Terre, applique l'état « Étourderie » et un poison sur 3 tours.",
          "Sous Étourderie, dépenser ne serait-ce qu'1 PA provoque une énorme perte de PV (OS probable) : ne lancez aucun sort avant de l'avoir dissipée.",
          "Retirez l'état avec Jouvence ou Lait de Bambou avant d'agir.",
        ],
        danger: "extreme",
      },
      {
        title: "Pression à distance",
        mechanics: [
          "Porkorosouffle (cône 3 PO, sans ligne de vue) : 1200 dégâts Feu + poison Feu (750/tour) et 10% érosion sur 2 tours.",
          "Cochonnerie (5 PO) : 900 dégâts Eau et pose un glyphe insoignable (zone 3) infligeant 1400 Eau/tour à qui y reste.",
          "Grointimidation buffe un sbire (+4 PM, +400 puissance, +40 tacle) : gérez les Cochons de Farle, Don Dorgan, Don Duss Ang et Porsalu.",
        ],
        danger: "high",
      },
      {
        title: "Ne pas le toucher au contact",
        mechanics: [
          "Croutage (mêlée) : 1000 dégâts Terre, repousse de 16 cases et applique Pesanteur 2 tours.",
          "Immobilisation (mêlée) : retire tous les PM.",
          "Retirez plutôt les PM du boss à distance que de le frapper au corps-à-corps.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Ne dépensez aucun PA tant qu'Étourderie n'est pas dissipée : c'est la cause n°1 de wipe.",
      "Jouez à distance : Croutage et Immobilisation au contact sont dévastateurs.",
      "Évitez les dégâts de poussée pour le succès « Faut pas pousser les cochons dans la confiture d'orties ».",
    ],
    rewards: ["Set du Dragon Cochon", "Ressources rares", "Familier"],
    achievements: [
      { name: "Les crados", strategy: "Combattre à 4 persos min. avec au moins un Grüt, Gobeuf, Turyé ou Piggy Paupe." },
      { name: "Hardi", strategy: "Finir son tour sur une case adjacente à un ennemi." },
      { name: "Versatile", strategy: "N'utiliser chaque action qu'une seule fois par tour." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Faut pas pousser les cochons dans la confiture d'orties", strategy: "Les alliés ne doivent subir aucun dégât de poussée." },
    ],
  },

  // Donjon des Squelettes — Chafer Rônin
  47: {
    summary:
      "Le Chafer Rônin a peu de PV : le vrai danger vient de ses Chafers Draugr (poison et glyphes) et de ses illusions. On nettoie les alliés avant de révéler le boss.",
    recommendedLevel: "40 — 70",
    composition: "Solo possible bien placé ; un sort de zone aide à débusquer le boss.",
    keyResist: ["Terre", "Feu (Draugr -9%)"],
    phases: [
      {
        title: "Élimination des Draugr",
        hp: "100% — 60%",
        mechanics: [
          "Les Chafers Draugr lancent « Hel » : poison qui inflige des dégâts par PM dépensé, et posent des glyphes dangereux.",
          "Réduisez leurs PA/PM et tenez-les à distance, focus-les en premier.",
        ],
        danger: "medium",
      },
      {
        title: "Bunshin (illusions)",
        hp: "60% — 0%",
        mechanics: [
          "Dès le tour 2, le Rônin crée 4 illusions de lui-même par tour : le vrai boss se révèle en tapant la bonne cible parmi les 5.",
          "Un poison/dégât de fin de tour révèle automatiquement le vrai boss et purge les illusions.",
          "Ses sorts : Bushido (60 Terre en vol de vie, ligne, mêlée) et Kikoha (45 Feu, -1 PM, jusqu'à 6 PO). Il tape peu : gardez-le pour la fin.",
        ],
        danger: "low",
      },
    ],
    tips: [
      "Appliquez un dégât de fin de tour tôt pour révéler le boss sans deviner.",
      "Les sorts de zone identifient vite le vrai Rônin parmi les clones.",
    ],
    rewards: ["Set du Chafer", "Os & ressources de Chafer", "Familier"],
    achievements: [
      { name: "Nomade", strategy: "Utiliser tous ses PM à chaque tour, tout le combat." },
      { name: "Premier", strategy: "Chafer Rōnin doit être achevé en premier." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Désillusion", strategy: "Aucune illusion du Rônin ne doit être présente au début de son tour." },
      { name: "Revenus d'outre-tombe", strategy: "Combattre à 4 persos min. avec un Kockis, Kubitus, Kalkanéus, Hectaupe ou Hichète." },
    ],
  },

  // Donjon des Forgerons — Coffre des Forgerons
  21: {
    summary:
      "Boss neutre sans faiblesse : le Coffre devient dangereux à mesure qu'il perd des PV (« Tchaiste » inflige des dégâts selon les PV manquants). On le laisse plein le plus longtemps possible.",
    recommendedLevel: "50 — 80",
    composition: "Réussite liée aux dégâts plus qu'à la classe ; un peu de soin sécurise.",
    keyResist: ["Neutre", "Tous éléments équivalents"],
    phases: [
      {
        title: "Nettoyage des sbires",
        hp: "100% — 100%",
        mechanics: [
          "Éliminez d'abord les sbires en laissant le boss à pleins PV (ses dégâts montent avec les PV manquants).",
          "Restez à 3 PO ou moins : « Tchaiste » frappe les cases à 4+ cases (cercle inversé).",
        ],
        danger: "medium",
      },
      {
        title: "Burst du Coffre",
        hp: "100% — 0%",
        mechanics: [
          "Une fois seul, bursté-le en un tour, ou bloquez-le en restant ≤3 PO.",
          "« Avidité » au contact vole 4 PA et vole de la vie : évitez le corps-à-corps prolongé.",
          "Sans burst, prévoyez d'encaisser ~300 dégâts en le finissant.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Le boss n'avance pas s'il ne peut pas atteindre le corps-à-corps : jouez à distance.",
      "Ne le faites pas descendre lentement : plus il est bas, plus il fait mal.",
    ],
    rewards: ["Set des Forgerons", "Ressources de forge", "Familier"],
    achievements: [
      { name: "Nomade", strategy: "Utiliser tous ses PM à chaque tour, tout le combat." },
      { name: "Premier", strategy: "Coffre des Forgerons doit être achevé en premier." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Ouverture facile", strategy: "N'achever les ennemis que lorsque le boss a moins de 50% PV, et finir le boss en dernier." },
    ],
  },

  // Donjon des Larves — Shin Larve
  33: {
    summary:
      "Shin Larve résiste au Neutre/Terre/Feu : il faut taper Eau ou Air. Il invoque des larves et la Larve Saphir soigne — à tuer en priorité.",
    recommendedLevel: "50 — 80",
    composition: "2+ joueurs (séparation imposée) ; dégâts Eau/Air fortement conseillés.",
    keyResist: ["Eau", "Air (résiste Neutre/Terre/Feu)"],
    phases: [
      {
        title: "Invocations & soins",
        hp: "100% — 50%",
        mechanics: [
          "Invoque des larves aléatoires tous les 2 tours dès le tour 2.",
          "La Larve Saphir soigne jusqu'à 200 PV/tour aux alliés : focus-la dès qu'elle apparaît.",
          "Le boss n'a que 2 PM et tape uniquement au corps-à-corps.",
        ],
        danger: "medium",
      },
      {
        title: "Enlisement",
        hp: "50% — 0%",
        mechanics: [
          "« Enlisement » (tour 2 puis tous les 3 tours) donne +4 PA aux alliés mais retire 6 PM.",
          "Placez-vous avant l'Enlisement pour profiter du bonus de PA et bursté.",
        ],
        danger: "medium",
      },
    ],
    tips: [
      "Sans dégâts Eau ou Air, le combat traîne énormément.",
      "Priorisez toujours la Larve Saphir pour couper les soins.",
    ],
    rewards: ["Set de la Larve", "Poudres & ressources", "Familier Larve"],
    achievements: [
      { name: "Prudent", strategy: "Ne jamais finir son tour sur une case adjacente à un ennemi." },
      { name: "Versatile", strategy: "N'utiliser chaque action qu'une seule fois par tour." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Enlisement larvaire", strategy: "N'infliger des dégâts à la Shin Larve que sous l'effet de son sort Enlisement." },
    ],
  },

  // Centre du Labyrinthe du Minotoror — Minotoror
  4: {
    summary:
      "Boss faible à la Terre (-20%). Il invoque des Tofus et envoie « Sabotage » : 600 dégâts + poussée de 6 cases. On l'explose en Terre en évitant les murs.",
    recommendedLevel: "120 — 150",
    composition: "Équipe orientée Terre (Sacrieur, Osamodas…) ; 2 joueurs min pour le labyrinthe.",
    keyResist: ["Terre (-20%)", "Éviter Neutre/Feu/Eau/Air (40-60%)"],
    phases: [
      {
        title: "Sabotage & poussées",
        hp: "100% — 50%",
        mechanics: [
          "« Sabotage » au contact : ~600 dégâts + poussée de 6 cases — ne restez jamais collé à un mur.",
          "Invoque un Tofu Lancé (99 PV) chaque tour.",
          "Accompagné de Déminoboule et Mominotor (grosses réserves de PV).",
        ],
        danger: "high",
      },
      {
        title: "Burst Terre",
        hp: "50% — 0%",
        mechanics: [
          "Empilez les dégâts Terre pour profiter de la faiblesse et finir vite.",
          "Un soutien soigne la poussée contre les murs.",
        ],
        danger: "medium",
      },
    ],
    tips: [
      "Gardez de la distance : le corps-à-corps déclenche les poussées dangereuses.",
      "Le succès « Garde emplumée » impose de ne pas subir de dégâts tant que les totems Tofu sont là.",
    ],
    rewards: ["Set du Minotoror", "Clés & ressources THL", "Familier"],
    achievements: [
      { name: "Misanthrope", strategy: "Ne jamais finir son tour sur une case adjacente à un allié." },
      { name: "Mains propres", strategy: "Achever les ennemis sans leur infliger de dégâts directs." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Garde emplumée", strategy: "Le Minotoror ne doit pas subir de dommages si au moins un de ses tofus est présent sur le terrain." },
    ],
  },

  // Antre de Crocabulia — Crocabulia
  7: {
    summary:
      "Donjon assez abordable. Les monstres invoquent des « Coquilles Ula » qui buffent : on détruit les coquilles de soin/protection à distance (elles explosent).",
    recommendedLevel: "120 — 150",
    composition: "Accessible en duo avec des dégâts corrects ; pas de phase d'invulnérabilité.",
    keyResist: ["Multi-élément", "Pas de faiblesse marquée"],
    phases: [
      {
        title: "Coquilles Ula",
        hp: "100% — 50%",
        mechanics: [
          "Des coquilles sont invoquées tous les 4 tours et buffent les alliés.",
          "Les détruire déclenche une explosion de zone avec malus : restez à 8+ PM de distance.",
          "Détruisez les coquilles de soin/protection ; ignorez celles de dégâts/vitesse.",
        ],
        danger: "medium",
      },
      {
        title: "Mise à mort",
        hp: "50% — 0%",
        mechanics: [
          "Le boss alterne poussée courte, buff de zone moyenne et cône longue portée avec glyphes persistants.",
          "Finissez les autres monstres avant de concentrer Crocabulia.",
        ],
        danger: "medium",
      },
    ],
    tips: [
      "Tenez vos distances quand vous cassez une coquille pour éviter l'explosion.",
      "Ne perdez pas de tours sur les coquilles de dégâts : inutiles à détruire.",
    ],
    rewards: ["Set de Crocabulia", "Ressources rares", "Familier"],
    achievements: [
      { name: "Statue", strategy: "Finir chaque tour sur la case où on l'a commencé, tout le combat." },
      { name: "Versatile", strategy: "N'utiliser chaque action qu'une seule fois par tour." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "En cassant des œufs", strategy: "Les coquilles invoquées doivent être achevées avant le début de leur troisième tour et aucun allié ne doit subir de dommages causés par leur explosion." },
    ],
  },

  // Laboratoire du Tynril — les 4 Tynrils
  51: {
    summary:
      "Quatre Tynrils, chacun faible à un élément précis. Ils appliquent « -2000% résistance » dans leur élément aux cibles proches : le contrôle des PM est la clé.",
    recommendedLevel: "140 — 170",
    composition: "Équipe avec retrait de PM (Crâ, Iop…) et bon placement. À 8, coordination requise.",
    keyResist: ["Perfide→Feu", "Déconcerté→Eau", "Consterné→Air", "Ahuri→Terre"],
    phases: [
      {
        title: "Contrôle des PM",
        hp: "100% — 70%",
        mechanics: [
          "Chaque Tynril applique -2000% de résistance dans son élément aux cibles proches : un coup de près est fatal.",
          "Ils n'ont que 2 PM : réduisez-les tous à 0 PM en priorité.",
          "Placez vos persos les plus fragiles loin des points d'apparition.",
        ],
        danger: "extreme",
      },
      {
        title: "Échanges & reconstruction",
        hp: "70% — 0%",
        mechanics: [
          "Les Tynrils échangent leurs positions chaque tour.",
          "Deux Tynrils adjacents se reconstruisent mutuellement : évitez de les laisser côte à côte.",
          "Frappez chaque Tynril dans son élément faible une fois immobilisé.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Pas de soin nécessaire : tout repose sur le retrait de PM puis le burst.",
      "Tapez toujours dans la faibleur élémentaire propre à chaque Tynril.",
    ],
    rewards: ["Set du Tynril", "Ressources d'alchimie THL", "Familier"],
    achievements: [
      { name: "Intouchable", strategy: "Les combattants alliés ne doivent pas perdre de points de vie." },
      { name: "Zombie", strategy: "Utiliser exactement 1 PM par tour de jeu." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Prendre racine", strategy: "Les ennemis ne doivent ni être déplacés, ni subir de tentative de retrait PM par les alliés." },
    ],
  },

  // Antre du Korriandre — Korriandre
  59: {
    summary:
      "Donjon à glyphes mortels : commencer son tour sur une case de départ piégée = mort. Il faut tuer Korriandre très vite (idéalement en un tour).",
    recommendedLevel: "180 — 200",
    composition: "Gros burst obligatoire ; placement rigoureux (cases espacées).",
    keyResist: ["Multi-élément", "Adapter au groupe"],
    phases: [
      {
        title: "Glyphes de départ",
        hp: "100% — 60%",
        mechanics: [
          "Des glyphes apparaissent sur les cases de départ chaque tour : commencer dessus tue instantanément.",
          "Le boss vous attire et inflige 700-800 dégâts (montent quand il descend).",
          "Ne lancez jamais de sort sur les Mérulettes : ça déclenche « raulebaque » qui replace toute l'équipe au départ (= sur les glyphes).",
        ],
        danger: "extreme",
      },
      {
        title: "Burst Korriandre",
        hp: "60% — 0%",
        mechanics: [
          "Tuez Korriandre en premier, si possible en un tour, pour stopper les attirances vers les glyphes.",
          "Les invocations Sporakne poussent et enchaînent les poussées : attention aux placements.",
          "Gardez le Fongeur (inoffensif) pour la fin.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Un Osamodas peut nettoyer des glyphes en mourant stratégiquement.",
      "Pour le succès, terminez vos tours à 3 cases ou plus les uns des autres.",
    ],
    rewards: ["Set du Korriandre", "Ressources THL", "Familier"],
    achievements: [
      { name: "Mystique", strategy: "Les combattants alliés ne doivent infliger que des dégâts et soins de sorts durant leurs tours de jeu." },
      { name: "Zombie", strategy: "Utiliser exactement 1 PM par tour de jeu." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 15 tours." },
      { name: "Pas dans mes pattes", strategy: "Les combattants alliés doivent terminer leur tour à plus de 3 cases d'un allié." },
    ],
  },

  // Grotte du Bworker — Bworker
  14: {
    summary:
      "Bworker frappe uniquement au corps-à-corps, avec des dégâts énormes basés sur vos PV manquants. Tout le donjon consiste à l'empêcher de vous toucher.",
    recommendedLevel: "180 — 200",
    composition: "Tank + retrait de PM (Énutrof) + DPS distance. Contrôle > dégâts bruts.",
    keyResist: ["Neutre (attaques neutres)", "Varié"],
    phases: [
      {
        title: "Kiting du Bworker",
        hp: "100% — 50%",
        mechanics: [
          "« Correction Bwork » inflige 30-45% de vos PV manquants ; « Sanction Bwork » : 2400 au contact.",
          "Il gagne +3 PM via « Poursuite » : retirez-lui des PM (Énutrof) pour l'empêcher d'engager.",
          "Bloquez-le dans un coin avec des sorts de placement (Pandawa) et des alliés tacle.",
        ],
        danger: "high",
      },
      {
        title: "Mise à mort",
        hp: "50% — 0%",
        mechanics: [
          "Ses dégâts montent avec vos PV manquants : soignez-vous pour réduire les coups.",
          "Nettoyez les sbires autour avant de concentrer le boss.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Les classes corps-à-corps évitent le contact direct sauf pour bloquer.",
      "Le succès dépend du placement, pas du DPS pur.",
    ],
    rewards: ["Set du Bworker", "Ressources rares", "Familier"],
    achievements: [
      { name: "Hardi", strategy: "Finir son tour sur une case adjacente à un ennemi." },
      { name: "Blitzkrieg", strategy: "Achever chaque ennemi attaqué avant le début de son tour." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 15 tours." },
      { name: "Baston équitable", strategy: "Les ennemis ne doivent subir ni retrait PM, ni retrait PA, ni retrait PO, ni tentative de déplacement." },
    ],
  },

  // Cavernes du Kolosso — Kolosso
  60: {
    summary:
      "Le Kolosso est invulnérable en permanence : on ne le blesse qu'en faisant frapper une invocation placée à son contact. Impossible de se soigner de tout le combat (-10 000 soin) : c'est un check de placement et de burst.",
    recommendedLevel: "190 — 200",
    composition: "Pensé pour 8 ; classes à invocations + retrait PM. Pierre d'âme 190+ pour la capture.",
    keyResist: ["Terre"],
    phases: [
      {
        title: "Salles de reliques",
        mechanics: [
          "Terminez les 4 salles de mini-boss pour obtenir les reliques avant le combat final.",
          "Dès le combat final, tous les persos subissent -10 000 soin (non dissipable) : aucun soin ne fonctionne de tout le combat.",
        ],
        danger: "high",
      },
      {
        title: "Briser l'invulnérabilité",
        mechanics: [
          "Le Kolosso est invulnérable : invoquez une créature à son contact pour qu'elle le frappe et lève l'invulnérabilité 1 tour.",
          "Razepoutine (Terre) ne se déclenche que si un allié/invocation est à son corps-à-corps : gros dégâts en triangle (croissants quand il descend), et il peut vous attirer au contact.",
          "Retirez les PM de tous les ennemis chaque tour pour empêcher Razepoutine ; placez un Sacrieur au fond de la map.",
        ],
        danger: "extreme",
      },
      {
        title: "Professeur Xa",
        mechanics: [
          "Xa tape Feu (zone 3 cases) et retire des PA ; tous les 2 tours (T1, T3, T5), Kirbili donne aux alliés +100 dégâts par coup reçu et les soigne de 100 PV près des monstres touchés.",
          "Il peut ressusciter les ennemis tombés : tuez-le juste avant de finir le Kolosso.",
          "Une fois seuls Xa et Kolosso : boostez, tuez Xa, invoquez au contact du Kolosso pour briser l'invu, puis bursté-le en un tour.",
        ],
        danger: "extreme",
      },
    ],
    tips: [
      "Sans invocation à son contact, le Kolosso reste invulnérable : c'est toute la clé du combat.",
      "Empêchez le corps-à-corps (retrait PM) : sinon Razepoutine devient ingérable.",
      "Tapez Terre (sa faiblesse).",
    ],
    rewards: ["Set du Kolosso", "Pierres précieuses THL", "Familier"],
    achievements: [
      { name: "Dernier", strategy: "Blérom doit être achevé en dernier." },
      { name: "Premier", strategy: "Professeur Xa doit être achevé en premier." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Alliés passés au futur", strategy: "Les alliés ne doivent pas recevoir de soin." },
    ],
  },

  // Transporteur de Sylargh — Sylargh
  67: {
    summary:
      "Sylargh est invulnérable et « lourd ». Les monstres tués reviennent en Zombi à 10% PV ; tuer le premier Zombi déclenche une chaîne. Restez sous 90% PV et à distance.",
    recommendedLevel: "200",
    composition: "DPS distance + retrait PA/PM. Évitez le corps-à-corps (« Mortier »).",
    keyResist: ["Multi-élément", "Jeu de placement"],
    phases: [
      {
        title: "Gestion des Zombis",
        hp: "100% — 50%",
        mechanics: [
          "Un monstre vaincu ressuscite en « Zombi » à 10% PV, placé à 6 PO.",
          "Tuez le premier Zombi pour enchaîner les morts sans les retoucher.",
          "Un Zombi qui meurt explose (« Zombidule », cercle 5) : restez à 5+ PO.",
          "À 90%+ PV vous devenez pacifiste quand un Zombi meurt : restez sous 90% PV.",
        ],
        danger: "extreme",
      },
      {
        title: "Fenêtre de vulnérabilité",
        hp: "50% — 0%",
        mechanics: [
          "Sylargh n'est vulnérable que positionné à 5-10 PO.",
          "Placez-le à gauche de la map pour que les résurrections ne gênent pas votre placement.",
          "Retirez-lui PA/PM pour limiter sa portée d'action.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Jouez à distance : le corps-à-corps déclenche « Mortier » (dégâts bonus).",
      "Duo possible sous 40 tours avec une classe retrait de PM.",
    ],
    rewards: ["Set de Sylargh", "Ressources THL", "Familier"],
    achievements: [
      { name: "Misanthrope", strategy: "Ne jamais finir son tour sur une case adjacente à un allié." },
      { name: "Barbare", strategy: "Les personnages alliés doivent achever les ennemis avec une arme." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 40 tours." },
      { name: "Brikolère", strategy: "Les ennemis dans l'état Zombi ne doivent pas être achevés à 5 cases ou moins d'un allié ou d'un autre ennemi." },
      { name: "Les z'autres", strategy: "Combattre à 4 persos min. avec au moins un Haku, Manitou Zoth, Karotz, Grouillot ou Phong Huss." },
    ],
  },

  // Laboratoire de Nileza — Nileza
  70: {
    summary:
      "Donjon sans glyphes, 100% placement. « Chifouchimie » : finir son tour à côté d'un allié le tue instantanément. Le boss échange sa place avec qui le tape à distance.",
    recommendedLevel: "200",
    composition: "Difficulté moyenne pour du 200 ; duo possible. Classes de placement appréciées.",
    keyResist: ["Multi-élément", "Jeu de distance"],
    phases: [
      {
        title: "Placement vital",
        hp: "100% — 50%",
        mechanics: [
          "« Chifouchimie » : un personnage qui finit son tour adjacent à un allié = mort instantanée de l'allié.",
          "« Ogavodra » : le boss échange sa position avec quiconque inflige des dégâts à distance.",
          "« Molalité illéplochable » : le boss renvoie 200% en Air dans 2 PO et applique 40% d'érosion.",
        ],
        danger: "extreme",
      },
      {
        title: "Pacifisme",
        hp: "50% — 0%",
        mechanics: [
          "Dès le tour 3, le boss applique Pacifiste aux personnages éloignés (distance requise réduite à chaque cycle).",
          "Restez proche du boss aux tours pairs pour éviter le Pacifiste aux tours impairs.",
          "Empilez des ennemis à 2 PO et tapez le boss pour déclencher le renvoi et nettoyer les adds.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Ne finissez JAMAIS votre tour à côté d'un allié.",
      "Bonne mobilité et contrôle de placement indispensables.",
    ],
    rewards: ["Set de Nileza", "Ressources THL", "Familier"],
    achievements: [
      { name: "Prudent", strategy: "Ne jamais finir son tour sur une case adjacente à un ennemi." },
      { name: "Dernier", strategy: "Nileza doit être achevé en dernier." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 40 tours." },
      { name: "Alchi-pludent", strategy: "Aucun allié ne doit entrer dans l'état Pacifiste." },
      { name: "Les pandaliens", strategy: "Combattre à 4 persos min. avec au moins un Mirh, Rekto Topi, Traçon ou Logram." },
    ],
  },

  // Donjon du Comte Harebourg — Comte Harebourg (stratégie + schémas : DofusPourLesNoobs)
  71: {
    summary:
      "Boss final de Frigost 3, parmi les contenus les plus techniques du jeu. Le Comte est invulnérable en permanence et ne se rend vulnérable que les tours pairs, via un échange de position — le tout sous une confusion qui fait pivoter chacun de vos sorts selon votre vitalité. La lecture des glyphes mortels est vitale.",
    recommendedLevel: "200",
    composition:
      "Tout passe une fois les confusions maîtrisées. Pour une première : Pandawa (placement/Stabilisation), Zobal (boucliers), Iop (burst), Eniripsa (soin) — du bouclier et du soin pour avoir droit à l'erreur.",
    keyResist: ["Variable (voir résistances)"],
    phases: [
      {
        title: "Les sorts du Comte",
        mechanics: [
          "Mi-temps : à chaque début de tour, pose un glyphe en croix (taille 3) autour de lui — centre compris depuis la 3.5. Un allié qui commence son tour dessus est tué. Dure 1 tour.",
          "Contretemps (jusqu'à 14 PO, en ligne, sans ligne de vue) : 700 Terre + une 2ᵉ ligne Eau valant 7% des PV manquants de la cible (10% au càc). S'il est vulnérable, téléporte la cible à sa case de début de tour.",
          "Jaquemart (invulnérable uniquement, 4 PO, sans ligne de vue) : 700 Eau en vol de vie, retire 3 PA esquivables (4 au càc) pour 1 tour.",
          "Multicomte (le tour suivant sa désactivation, 6 PO, ligne/diagonale, avec ligne de vue) : 500 Feu en cercle de rayon 3 à 5 et crée des illusions.",
        ],
        danger: "high",
        images: [
          { src: `${DPLN}/mi-temps3_orig.png`, caption: "Mi-temps — glyphe en croix (taille 3)" },
          { src: `${DPLN}/contretemps_1_orig.png`, caption: "Contretemps — ligne, jusqu'à 14 PO" },
          { src: `${DPLN}/jaquemart_orig.png`, caption: "Jaquemart — seulement invulnérable" },
          { src: `${DPLN}/multicomte_orig.png`, caption: "Multicomte — cercle 3 à 5 + illusions" },
        ],
      },
      {
        title: "Lever l'invulnérabilité (échange de place)",
        mechanics: [
          "Le Comte est invulnérable toute la durée du combat ; l'état ne se désactive QUE les tours pairs (2, 4, 6…).",
          "Pour le rendre vulnérable : provoquez un changement de place avec une entité (alliée ou ennemie) au moment où le Comte change de position.",
          "Une fois vulnérable, surveillez la case où vous le laissez en fin de tour : son glyphe + la téléportation de Contretemps peuvent renvoyer vos persos commencer leur tour DANS le glyphe (= mort).",
          "Astuce : Stabilisation sur le Comte après lui avoir retiré l'invulnérabilité l'empêche de bouger quand vous le tapez — précieux si les confusions horaires vous gênent.",
        ],
        danger: "extreme",
        images: [
          { src: `${DPLN}/vulne-desec_orig.png`, caption: "Désactivation de l'état invulnérable" },
          { src: `${DPLN}/impair_orig.png`, caption: "Tour impair — invulnérable" },
          { src: `${DPLN}/pair_orig.png`, caption: "Tour pair — fenêtre de vulnérabilité" },
        ],
      },
      {
        title: "Confusions & trigonométrie",
        mechanics: [
          "Chaque tour, vos sorts sont redirigés (90°, 180° ou 270°, horaire/anti-horaire) selon votre pourcentage de vitalité.",
          "Frapper un monstre au corps-à-corps décale votre confusion de 90° anti-horaire PAR ligne de dégâts (plusieurs fois si le sort tape plusieurs lignes) ; plus de changement au-delà de 10 coups.",
          "Le plus rapide : jouez en ligne ou en diagonale pour viser sans calcul — vous n'avez que 30 s par tour.",
          "Un sort redirigé vers une case inexistante ou inaccessible provoque un échec critique (et un tour passé si c'est votre corps-à-corps).",
        ],
        danger: "high",
        images: [
          { src: `${DPLN}/comte-harebourg_orig.png`, caption: "La roue des confusions" },
          { src: `${DPLN}/effet-epee_orig.png`, caption: "Sort à deux lignes de dégâts" },
          { src: `${DPLN}/confusion-cac_orig.png`, caption: "1re frappe : respecter la confusion" },
          { src: `${DPLN}/confusion-cac2_orig.png`, caption: "2e frappe : décalée de -90° par ligne" },
        ],
      },
      {
        title: "Les sbires",
        mechanics: [
          "Cycloïde : tacle, retire des PM et attire — le plus pénible. À tuer en premier (le Sinistrofu d'abord en équipe de 6+). Bloquez-le (invocation, retrait PM).",
          "Granduk : gagne de l'intelligence ; ses dégâts à distance montent avec vos PV manquants, et il arrive vite au contact.",
          "Nocturlabe : gros tacle et renvoie les dégâts ; rush au contact.",
          "Sinistrofu : rend invisible avec renvoi de dégâts.",
          "Strigide : échange de place et booste la PO ; son « Stridicule » retire 25% PV à ses alliés en cercle inversé (taille 5) mais fait perdre 50% PV temporaires à vos persos pris dans la zone.",
        ],
        danger: "medium",
      },
    ],
    tips: [
      "Votre première fois : tuez le Comte en DERNIER, pour maîtriser vos confusions avant d'avoir à le gérer vulnérable.",
      "Jouez en lignes/diagonales pour calculer la redirection vite — le timer n'est que de 30 s.",
      "En tour pair, maîtrisez la case finale du Comte pour qu'aucun allié ne commence son tour dans son prochain glyphe.",
      "Tout repose sur le placement et l'échange de position, pas sur les dégâts bruts.",
    ],
    rewards: ["Set d'Harebourg (Glacomponents)", "Ressources THL rares", "Succès prestigieux"],
    achievements: [
      {
        name: "Versatile",
        strategy:
          "N'utiliser chaque sort/action qu'une seule fois par tour. Gérez confusions ET unicité des sorts ; le Pandawa est handicapé (porter/jeter = un seul et même sort).",
        image: `${DPLN}/custom_themes/586567114324766674/files/dj-succes/illus/versatile.png`,
      },
      {
        name: "Statue",
        strategy:
          "Finir chaque tour sur sa case de départ. Difficile à cause de l'attirance du Cycloïde (qui sépare vos persos) et du glyphe du Comte.",
        image: `${DPLN}/custom_themes/586567114324766674/files/dj-succes/illus/statue.png`,
      },
      {
        name: "L'échec n'est pas une option",
        strategy: "Les ennemis ne doivent subir aucun dégât au corps-à-corps : jouez à distance et maîtrisez vos confusions.",
        image: `${DPLN}/custom_themes/586567114324766674/files/dj-succes/illus/special.png`,
      },
      {
        name: "Duo",
        strategy:
          "Vaincre à 2 personnages max en moins de 40 tours. Ex. simples : Iop + Pandawa (le Panda porte le Iop quasi en permanence), ou un tacle air (pour tuer le Cycloïde) + un tapeur feu avec càc de soin.",
        image: `${DPLN}/custom_themes/586567114324766674/files/dj-succes/illus/duo.png`,
      },
      { name: "Mini Nuits'", strategy: "Combattre à 4 persos min. avec au moins un Inferno, Styx, Mandrin ou Will Killson." },
    ],
  },

  // Palais du roi Nidas — Roi Nidas
  76: {
    summary:
      "Combat à vagues (5 vagues tous les 5 tours). Évitez la Terre (42% résist), jouez Air/Eau/Feu. La Boubourse alliée donne des boucliers : à contrôler. Confusion « Zizanie » qui retourne les alliés.",
    recommendedLevel: "200",
    composition: "Jeu à distance préféré ; DPS distance + contrôle PM/PO + placement (Roublard, Pandawa, Eliotrope…).",
    keyResist: ["Air", "Eau", "Feu (éviter Terre 42%)"],
    phases: [
      {
        title: "Vagues",
        hp: "100% — 50%",
        mechanics: [
          "5 vagues d'ennemis apparaissent tous les 5 tours : nettoyez vite pour ne pas être submergé.",
          "« Attrape-mutin » attire à 6 cases et échange les positions.",
          "« Confusion » applique Zizanie : vos alliés se tapent entre eux au tour suivant.",
        ],
        danger: "high",
      },
      {
        title: "Contrôle de la Boubourse",
        hp: "50% — 0%",
        mechanics: [
          "Le boss invoque la Boubourse (soutien) qui donne des boucliers et retire les buffs.",
          "Gardez la Boubourse dans votre camp pour limiter la mobilité du boss.",
          "Si Zizanie vous touche, dispersez les alliés groupés pour éviter les dégâts de zone.",
        ],
        danger: "medium",
      },
    ],
    tips: [
      "Restez à distance pour éviter échanges de position et confusion.",
      "Ne tapez pas en Terre : adaptez vos sorts.",
    ],
    rewards: ["Set du Roi Nidas", "Ressources THL", "Familier"],
    achievements: [
      { name: "Premier", strategy: "Roi Nidas doit être achevé en premier." },
      { name: "Statue", strategy: "Finir chaque tour sur la case où on l'a commencé, tout le combat." },
      { name: "Trio", strategy: "Vaincre tous les monstres avec 3 personnages maximum et en moins de 80 tours." },
      { name: "Rats... au sens propre ou au figuré", strategy: "Combattre à 4 persos min. avec au moins un Rapiat, Rapine, Ougicle ou Hulkrap." },
      { name: "Pingrerie", strategy: "Lorsqu'un allié occasionne des dommages, il doit se situer en ligne ou en diagonale de sa cible." },
    ],
  },

  // Brasserie du roi Dazak — Dazak Martegel
  110: {
    summary:
      "Boss à +100% de résistance dans tous les éléments : on baisse ses résistances par la POUSSÉE, pas par l'élément. Système de « Nimpatience » à gérer absolument.",
    recommendedLevel: "200",
    composition: "DPS distance (Crâ idéal pour se replacer) + utilitaire retrait PM.",
    keyResist: [">100% partout", "Réduire via poussées/attirances"],
    phases: [
      {
        title: "Nimpatience",
        hp: "100% — 50%",
        mechanics: [
          "Boss et sbires montent en Nimpatience (1→3) quand ils ne touchent personne ; au niveau 3 ils débloquent un sort surpuissant.",
          "Tuez Tanklume avant son Nimpatience 3 (il téléporte l'équipe au contact et applique immobilité).",
          "« Ninfiltration » (tours pairs dès le tour 2) inflige des dégâts et retire des PM en large zone : restez à 5+ cases.",
        ],
        danger: "extreme",
      },
      {
        title: "Réduction par poussée",
        hp: "50% — 0%",
        mechanics: [
          "Pendant les 2 tours suivant le Nimpatience 3 du boss, chaque poussée/attirance retire 5% de résistances (infini).",
          "Subir une poussée donne au contraire +10% résistances au boss : poussez, ne vous faites pas pousser.",
          "Enchaînez les déplacements (ex : « Friction » d'Iop) pendant cette fenêtre pour effondrer ses résistances puis bursté.",
        ],
        danger: "extreme",
      },
    ],
    tips: [
      "Inutile de chercher une faiblesse élémentaire : tout passe par la poussée.",
      "Gérez la Nimpatience des sbires en priorité, surtout Tanklume.",
    ],
    rewards: ["Set de Dazak", "Ressources THL rares", "Succès"],
    achievements: [
      { name: "Chevaliers tourmentés", strategy: "Combattre à 4 persos min. avec au moins un Flamme, Goutte, Nuage, Feuille ou Ténèbre." },
      { name: "Premier", strategy: "Dazak Martegel doit être achevé en premier." },
      { name: "Liberté", strategy: "Ne pas tenter de retirer de PM ou de PO aux adversaires pendant toute la durée du combat." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 40 tours." },
      { name: "Manque de nimpatience", strategy: "Les ennemis ne doivent être achevés que lorsqu'ils se trouvent dans l'état Nimpatience III." },
    ],
  },

  // Crypte de Kardorim — Kardorim
  90: {
    summary:
      "Le tout premier boss de donjon : très accessible. Kardorim tape uniquement au corps-à-corps et invoque un Kardorib qui pousse — la seule vraie menace.",
    recommendedLevel: "10 — 30",
    composition: "Solo ou groupe, dès le niveau 12 avec un stuff basique.",
    keyResist: ["Eau", "Terre"],
    phases: [
      {
        title: "Le Kardorib",
        hp: "100% — 50%",
        mechanics: [
          "Invoque un Kardorib tous les 6 tours : il tape au contact et pousse de 2 cases.",
          "Tuez le Kardorib vite ou tenez-le à distance pour éviter les poussées contre les obstacles.",
        ],
        danger: "low",
      },
      {
        title: "Mise à mort",
        hp: "50% — 0%",
        mechanics: [
          "Kardorim n'a que 4 PM et tape modérément : focus-le, il tombe en quelques coups.",
          "Tapez Eau/Terre pour accélérer.",
        ],
        danger: "low",
      },
    ],
    tips: [
      "Priorisez Kardorim : c'est son invocation qui dérange, pas lui.",
      "Bien placé, niveau 12+ le tue en 3 attaques.",
    ],
    rewards: ["Set de Kardorim", "Ossements & ressources", "Familier"],
    achievements: [
      { name: "Zombie", strategy: "Utiliser exactement 1 PM par tour de jeu." },
      { name: "Premier", strategy: "Kardorim doit être achevé en premier." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Lâche mes côtes", strategy: "Kardorim ne doit jamais finir son tour au corps-à-corps ; les Kardoribs ne doivent ni être touchés ni poussés." },
    ],
  },

  // Cache de Kankreblath — Kankreblath
  88: {
    summary:
      "Boss imprévisible : un sort aléatoire le rend invisible, le téléporte ou invoque des monstres. Le Pyrasite buffe tout le camp — c'est la priorité absolue.",
    recommendedLevel: "40 — 70",
    composition: "Solo/groupe ; jeu à distance recommandé.",
    keyResist: ["Eau", "Multi-élément"],
    phases: [
      {
        title: "Chaos & invocations",
        hp: "100% — 50%",
        mechanics: [
          "Son sort aléatoire (33% chacun) le rend invisible, le téléporte ou invoque un monstre.",
          "« Blathération » : dégâts Feu en ligne de 6 cases à 1 PO ; « Kankroulahoup » soigne ses alliés dans 3 cases.",
          "Le Pyrasite donne +2 PM et +50 puissance à toutes les créatures.",
        ],
        danger: "high",
      },
      {
        title: "Nettoyage",
        hp: "50% — 0%",
        mechanics: [
          "Éliminez chaque invocation dès son apparition pour garder de la place.",
          "Restez à distance : la plupart des ennemis tapent de près.",
        ],
        danger: "medium",
      },
    ],
    tips: [
      "Focus le Pyrasite en premier : il booste tout le reste.",
      "Gérez l'espace de l'arène en tuant vite les invocations.",
    ],
    rewards: ["Set de Kankreblath", "Ressources", "Familier"],
    achievements: [
      { name: "Bandits du Magik Riktus", strategy: "Combattre à 4 persos min. avec au moins un Riktus fine-lame, Riktus archer, Riktus baroudeur ou Riktus ensorceleuse." },
      { name: "Dernier", strategy: "Kankreblath doit être achevé en dernier." },
      { name: "Collant", strategy: "Finir son tour sur une case adjacente à un autre allié." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "La ligne interdite", strategy: "Les alliés (hors invocations statiques) ne doivent terminer leur tour ni en ligne d'un ennemi, ni en ligne d'un autre allié." },
    ],
  },

  // Akadémie des Gobs — Directeur Grunob
  138: {
    summary:
      "Les Gobelins se renforcent en groupe (+5% dégâts par Gob proche). On éclate les sbires et le Dagobert (voleur de PA) avant de concentrer le Directeur.",
    recommendedLevel: "40 — 70",
    composition: "Aucune compo particulière requise ; faible Eau.",
    keyResist: ["Eau"],
    phases: [
      {
        title: "Travail d'équipe",
        hp: "100% — 50%",
        mechanics: [
          "Passif « Travail d'équipe! » : +5% dégâts par Gob dans un rayon de 2.",
          "Invoque Dagobert (cooldown 4 tours) qui vole 1 PA aux ennemis proches.",
          "« Cuvée des Gobs » attire les ennemis et inflige des dégâts Eau jusqu'à 6 PO.",
        ],
        danger: "medium",
      },
      {
        title: "Le Directeur",
        hp: "50% — 0%",
        mechanics: [
          "Grunob n'a qu'un seul sort de dégâts : gardez vos distances.",
          "Tuez Dagobert dès son invocation pour couper le vol de PA.",
        ],
        danger: "medium",
      },
    ],
    tips: [
      "Éliminez les monstres compagnons d'abord : plus rapides que le boss.",
      "Ne laissez pas les Gobs se regrouper (bonus de dégâts cumulatif).",
    ],
    rewards: ["Set des Gobs", "Ressources", "Familier"],
    achievements: [
      { name: "Les crados", strategy: "Combattre à 4 persos min. avec au moins un Grüt, Gobeuf, Turyé ou Piggy Paupe." },
      { name: "Nomade", strategy: "Utiliser tous ses PM à chaque tour, tout le combat." },
      { name: "Premier", strategy: "Directeur Grunob doit être achevé en premier." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Dirige mais mal rédige", strategy: "À partir du tour 2, les combattants ennemis doivent commencer leur tour sur une cellule adjacente à celle d'un allié ou d'un ennemi." },
    ],
  },

  // Grotte Hesque — Corailleur Magistral
  25: {
    summary:
      "Inoffensif à distance, mortel au contact : quand il se buffe (« Coraillement Magistral »), sa Frappe de Corail tue en un coup (20 000 dégâts). Mais le buff lui retire tous ses PM.",
    recommendedLevel: "50 — 80",
    composition: "4+ joueurs avec dégâts Air/Terre ; jeu à distance impératif.",
    keyResist: ["Air", "Terre"],
    phases: [
      {
        title: "Les Palmifleurs",
        hp: "100% — 60%",
        mechanics: [
          "Les Palmifleurs appliquent « Décapsulation » : -100% de résistances pendant 2 tours (dégâts doublés).",
          "Tuez les Palmifleurs en priorité.",
        ],
        danger: "high",
      },
      {
        title: "Coraillement Magistral",
        hp: "60% — 0%",
        mechanics: [
          "Buffé, le boss gagne +12 PA et +400 puissance mais perd ses 3 PM (immobile).",
          "Sa Frappe de Corail Magistrale (OS, 20 000) ne marche qu'au corps-à-corps : ne l'approchez JAMAIS buffé.",
          "Profitez de son immobilité pour le canarder à distance.",
        ],
        danger: "extreme",
      },
    ],
    tips: [
      "Ne jamais engager le corps-à-corps avec le boss.",
      "Le boss perd sa mobilité quand il se buffe : c'est votre fenêtre de tir.",
    ],
    rewards: ["Set du Corailleur", "Ressources marines", "Familier"],
    achievements: [
      { name: "Les z'autres", strategy: "Combattre à 4 persos min. avec au moins un Haku, Manitou Zoth, Karotz, Grouillot ou Phong Huss." },
      { name: "Hardi", strategy: "Finir son tour sur une case adjacente à un ennemi." },
      { name: "Blitzkrieg", strategy: "Achever chaque ennemi attaqué avant le début de son tour." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Collé-serré", strategy: "À partir du tour global 2, les combattants alliés doivent commencer leur tour au contact du Corailleur Magistral. Le challenge échoue si le Corailleur Magistral n'est pas achevé en dernier." },
    ],
  },

  // Nid du Kwakwa — Kwakwa
  32: {
    summary:
      "80% de résistance dans tous les éléments : on les baisse via les mécaniques, pas via un point faible. Chaque mort de monstre retire 40% de résistance du Kwakwa dans cet élément.",
    recommendedLevel: "50 — 80",
    composition: "2+ joueurs ; couverture multi-élément idéale.",
    keyResist: ["Multi-élément", "Baisser via Kwayauté/poussées"],
    phases: [
      {
        title: "Invocations élémentaires",
        hp: "100% — 50%",
        mechanics: [
          "Invoque 4 Bwaks (un par élément) au début, ré-invoqués tous les 5 tours si tous morts.",
          "« Kwayauté » : chaque monstre tué retire 40% de résistance du boss dans son élément (mais +40 dégâts de poussée).",
          "« Kwapoussée » : les dégâts de poussée retirent -10% de résistances 3 tours.",
        ],
        danger: "medium",
      },
      {
        title: "Effondrement des résistances",
        hp: "50% — 0%",
        mechanics: [
          "Tuez les Kwaks de différents éléments pour baisser les résistances correspondantes du boss.",
          "Placez-vous loin au début : le boss recule après avoir invoqué (tour 2 plus sûr).",
        ],
        danger: "medium",
      },
    ],
    tips: [
      "Variez les éléments pour effondrer plusieurs résistances à la fois.",
      "À défaut de poison/invocations, utilisez la poussée pour affaiblir le boss.",
    ],
    rewards: ["Set du Kwakwa", "Plumes & ressources", "Familier"],
    achievements: [
      { name: "Chevaliers tourmentés", strategy: "Combattre à 4 persos min. avec au moins un Flamme, Goutte, Nuage, Feuille ou Ténèbre." },
      { name: "Zombie", strategy: "Utiliser exactement 1 PM par tour de jeu." },
      { name: "Mains propres", strategy: "Achever les ennemis sans leur infliger de dégâts directs." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Kwakwa ? Kwapoussée !", strategy: "Les ennemis ne doivent subir aucun dégât de poussée." },
    ],
  },

  // Donjon de Nowel — Sapik
  36: {
    summary:
      "Sapik est immobile (0 PM) et canarde à distance en Eau. Il invoque des Kipik pour vous gêner. On nettoie les sbires hors de sa ligne de vue, puis on le burst en Feu.",
    recommendedLevel: "50 — 80",
    composition: "Au niveau, jeu prudent ; faible Feu.",
    keyResist: ["Feu"],
    phases: [
      {
        title: "Hors de la ligne de vue",
        hp: "100% — 50%",
        mechanics: [
          "Sapik est immobile et frappe en Eau à portée infinie (avec ligne de vue) + malus de coups critiques.",
          "Il invoque jusqu'à 5 Kipik (un par tour) pour vous bloquer.",
          "Occupez-vous des monstres en restant hors de sa ligne de vue (décor, invocations).",
        ],
        danger: "medium",
      },
      {
        title: "Burst du Sapik",
        hp: "50% — 0%",
        mechanics: [
          "Priorisez les Kwakus et Kitsou Nakwatus, les plus dangereux.",
          "Une fois les adds gérés, concentrez le Sapik en Feu.",
        ],
        danger: "medium",
      },
    ],
    tips: [
      "Coupez les lignes de vue : c'est tout le donjon.",
      "Gardez un peu de soin pour les multiples Kipik.",
    ],
    rewards: ["Set de Nowel", "Ressources d'événement", "Familier"],
    achievements: [
      { name: "Chrono", strategy: "Vaincre tous les monstres en moins de 9 tours." },
      { name: "Hardi", strategy: "Finir son tour sur une case adjacente à un ennemi." },
      { name: "Blitzkrieg", strategy: "Achever chaque ennemi attaqué avant le début de son tour." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Ça pique le Kipik", strategy: "À la fin du tour du Sapik, il ne doit pas y avoir plus d'un Kipik." },
    ],
  },

  // Grange du Tournesol Affamé — Tournesol Affamé
  8: {
    summary:
      "Un boss végétal qui se gave : il vole de la vie, se renforce et invoque sans cesse. L'idéal est de le burst au tour 1 avant qu'il ne fasse boule de neige.",
    recommendedLevel: "20 — 40",
    composition: "Solo/groupe ; faible Eau.",
    keyResist: ["Eau"],
    phases: [
      {
        title: "Goinfrage",
        hp: "100% — 50%",
        mechanics: [
          "« Goinfrage » au contact (vol de vie) le booste de +10 dégâts pour 2 tours.",
          "« Appel des Champs » invoque des monstres tous les 6 tours.",
          "« Soin Feuillu » soigne ses alliés de 50 PV dans 2 cases.",
        ],
        danger: "medium",
      },
      {
        title: "Mise à mort",
        hp: "50% — 0%",
        mechanics: [
          "Tuez le boss le plus tôt possible pour éviter les invocations.",
          "Pour le succès : détruisez les invocations avant leur 2e tour.",
        ],
        danger: "low",
      },
    ],
    tips: ["Bursté-le au tour 1 si possible.", "Tapez Eau."],
    rewards: ["Set du Tournesol", "Graines & ressources", "Familier"],
    achievements: [
      { name: "Collant", strategy: "Finir son tour sur une case adjacente à un autre allié." },
      { name: "Premier", strategy: "Tournesol Affamé doit être achevé en premier." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Mauvaise graine", strategy: "Achever chaque invocation du Tournesol Affamé avant le début de son 2e tour de jeu." },
    ],
  },

  // Château Ensablé — Mob l'Éponge
  19: {
    summary:
      "Mob l'Éponge a 100% de résistance dans tous les éléments : on ne le tape pas directement, on frappe les Pichons colorés qui transfèrent les dégâts et baissent ses résistances.",
    recommendedLevel: "20 — 40",
    composition: "Sorts de zone appréciés ; jeu à distance.",
    keyResist: ["Via les Pichons (transfert)", "Multi-élément"],
    phases: [
      {
        title: "Les Pichons",
        hp: "100% — 50%",
        mechanics: [
          "Mob l'Éponge a 100% de résistance partout : insensible aux dégâts directs, on frappe les Pichons colorés qui transfèrent les dégâts dans leur élément (Orange=Feu, Bleu=Eau, Vert=Terre, Blanc=Air).",
          "Chaque ligne de dégâts sur un Pichon retire 1% de résistance au boss : les sorts de zone effondrent vite ses résistances.",
          "Régénération Spontanée : il se soigne de 10% PV (12% en critique) tous les 4 tours (+ par sbire présent) — appliquez de l'érosion.",
        ],
        danger: "medium",
      },
      {
        title: "Dégraissage & Rinçage",
        hp: "50% — 0%",
        mechanics: [
          "Dégraissage (3-16 PO, 3x/tour) : 900 dégâts Feu sur 2 tours et applique un état affaibli ouvrant un corps-à-corps.",
          "Rinçage (2 PO max) : 600 Eau et -70% soins reçus ; sur une cible affaiblie il retire les buffs, pousse de 20 cases et ajoute 1 100 Terre.",
          "Gardez le boss loin (Dégraissage exige 3 PO) ; tuez-le vite pour éviter ses régénérations.",
        ],
        danger: "high",
      },
    ],
    tips: ["Concentrez les zones sur les Pichons.", "Gardez vos distances pour éviter le poison."],
    rewards: ["Set du Château Ensablé", "Ressources", "Familier"],
    achievements: [
      { name: "Misanthrope", strategy: "Ne jamais finir son tour sur une case adjacente à un allié." },
      { name: "Versatile", strategy: "N'utiliser chaque action qu'une seule fois par tour." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Passer l'éponge", strategy: "À partir du tour 2, Mob l'éponge doit être poussé ou attiré au moins une fois à chaque tour global." },
    ],
  },

  // Maison Fantôme — Boostache
  34: {
    summary:
      "Boostache est immobile (lourd et enraciné) et ressuscite les monstres tués chaque tour. On le concentre directement, en gérant la perte de PM des Ashi-magari.",
    recommendedLevel: "40 — 70",
    composition: "Faible Air ; placement soigné (rien n'est déplaçable).",
    keyResist: ["Air"],
    phases: [
      {
        title: "L'Enfer des Zombies",
        hp: "100% — 50%",
        mechanics: [
          "Le boss est en permanence Lourd et Enraciné : impossible de le déplacer ou de coopérer.",
          "« L'Enfer des Zombies » ressuscite les monstres vaincus chaque tour.",
          "Les Ashi-magari retirent 100 PM au corps-à-corps.",
        ],
        danger: "high",
      },
      {
        title: "Focus boss",
        hp: "50% — 0%",
        mechanics: [
          "Concentrez le boss directement (les invocations reviennent de toute façon) — idéal pour le succès.",
          "Placez-vous pour éviter le drain de PM.",
        ],
        danger: "medium",
      },
    ],
    tips: ["Ignorez les zombies, focus le boss.", "Tapez Air."],
    rewards: ["Set de la Maison Fantôme", "Ressources d'Halouine", "Familier"],
    achievements: [
      { name: "Les héros", strategy: "Combattre à 4 persos min. avec au moins un Krosmoglob, Korbax, Masse ou Chevalier d'Astrub." },
      { name: "Misanthrope", strategy: "Ne jamais finir son tour sur une case adjacente à un allié." },
      { name: "Dernier", strategy: "Boostache doit être achevé en dernier." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Empêtrement d'esprit entêtant", strategy: "Aucun Ashi-magari ne doit être achevé pendant toute la durée du combat." },
    ],
  },

  // Refuge sylvestre — Rakoopeur
  142: {
    summary:
      "Rakoopeur tape multi-élément à distance et se protège via ses alliés (Camaraderie : bouclier). Sa faiblesse prismatique (-10% par coup, cumulable 3×) récompense la variété élémentaire.",
    recommendedLevel: "50 — 80",
    composition: "Couverture multi-élément ; jeu à distance.",
    keyResist: ["Multi-élément (faiblesse prismatique)"],
    phases: [
      {
        title: "Les alliés",
        hp: "100% — 50%",
        mechanics: [
          "« Camaraderie » téléporte le boss vers un allié et lui donne un bouclier de 100 PB (2 tours).",
          "Ne tapez pas l'allié protégé par Camaraderie tant que le bouclier est actif.",
          "Éliminez les alliés d'abord : Timongouste, puis Buffalourd et Grolours.",
        ],
        danger: "medium",
      },
      {
        title: "Burst prismatique",
        hp: "50% — 0%",
        mechanics: [
          "« Serpe boomerang »/« Serpette » : dégâts multi-élément à moyenne portée.",
          "La faiblesse prismatique applique -10% résistances tous éléments (cumul 3×) : variez les éléments.",
        ],
        danger: "medium",
      },
    ],
    tips: ["Variez les éléments pour empiler la faiblesse prismatique.", "Évitez l'allié bouclié."],
    rewards: ["Set du Refuge sylvestre", "Ressources sylvestres", "Familier"],
    achievements: [
      { name: "Mini Nuits'", strategy: "Combattre à 4 persos min. avec au moins un Inferno, Styx, Mandrin ou Will Killson." },
      { name: "Dernier", strategy: "Rakoopeur doit être achevé en dernier." },
      { name: "Prudent", strategy: "Ne jamais finir son tour sur une case adjacente à un ennemi." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Vigilance forestière", strategy: "Les alliés ne doivent pas cumuler plus de deux faiblesses élémentaires différentes au début de leur tour." },
    ],
  },

  // Gelaxième Dimension — Gelées Royales (Bleuet, Citron, Fraise, Menthe)
  24: {
    summary:
      "Quatre Gelées Royales colorées, chacune faible (10%) à son propre élément. Elles posent des glyphes et invoquent du soutien. Astuce maîtresse : les Gelées n'ont aucune résistance à la poussée.",
    recommendedLevel: "60 — 90",
    composition: "Multi-élément idéal ; un pousseur aide énormément.",
    keyResist: ["Bleuet→Eau", "Citron→Air", "Fraise→Feu", "Menthe→Terre"],
    phases: [
      {
        title: "Glyphes & soutien",
        hp: "100% — 50%",
        mechanics: [
          "Chaque Gelée pose des glyphes de son élément et invoque des gelées de soutien.",
          "Bleuet donne +3 PA aux alliés ; Citron réduit les dégâts subis de 24 et retire la puissance.",
          "Menthe donne +2 PM et retire des PM ; Fraise se soigne (10% PV max) et augmente les soins reçus de 30%.",
        ],
        danger: "high",
      },
      {
        title: "Élimination",
        hp: "50% — 0%",
        mechanics: [
          "Tapez chaque Gelée dans son élément faible (10%).",
          "Priorité à Fraise (soins) : empêchez le buff ou bursté à travers.",
          "Les Gelées n'ont AUCUNE résistance poussée : utilisez la poussée pour finir.",
        ],
        danger: "high",
      },
    ],
    tips: ["Un coup dans la mauvaise couleur = peu d'effet : respectez les éléments.", "Exploitez la poussée."],
    rewards: ["Set de la Gelée Royale", "Ressources d'alchimie", "Familier"],
    achievements: [
      { name: "Duel", strategy: "Un seul allié doit attaquer chaque ennemi durant tout le combat." },
      { name: "Collant", strategy: "Finir son tour sur une case adjacente à un autre allié." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Privé de dessert", strategy: "Les invocations ennemies ne doivent subir aucun dommage." },
    ],
  },

  // Village Kanniboul — Kanniboul Ebil
  27: {
    summary:
      "Kanniboul Ebil est faible Air (éviter la Terre). Il maudit (renvoi de dégâts via sa Poupée) et soigne ses alliés : la gestion de distance et de placement fait tout.",
    recommendedLevel: "60 — 90",
    composition: "Jeu à distance ; faible Air, éviter Terre (30%).",
    keyResist: ["Air (éviter Terre 30%)"],
    phases: [
      {
        title: "La Poupée Aycetroy",
        hp: "100% — 50%",
        mechanics: [
          "La Poupée (invoquée tour 1) gagne 50 puissance/tour et échange les positions — ne la tapez pas, elle réapparaît.",
          "État « Maudit » (sort Bouboule) : tous les dégâts infligés à la Poupée vous reviennent.",
          "« Bénédiction Moonesque » soigne les alliés à 2 cases d'une cible touchée (50% des dégâts).",
        ],
        danger: "high",
      },
      {
        title: "Focus adds",
        hp: "50% — 0%",
        mechanics: [
          "Concentrez les adds en premier (priorité Kanniboul Sarbak), ignorez la Poupée.",
          "Espacez-vous pour casser les chaînes de soin.",
        ],
        danger: "medium",
      },
    ],
    tips: ["Restez à distance pour éviter la malédiction.", "Ne tapez jamais la Poupée maudit."],
    rewards: ["Set Kanniboul", "Ressources", "Familier"],
    achievements: [
      { name: "Zombie", strategy: "Utiliser exactement 1 PM par tour de jeu." },
      { name: "Premier", strategy: "Kanniboul Ebil doit être achevé en premier." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Rituel de survie", strategy: "Quand un ennemi subit des dégâts, il doit être adjacent à au moins une entité." },
    ],
  },

  // Fonderie des Waddicts — Mawabouaino
  113: {
    summary:
      "Mawabouaino (faible Terre) invoque des Twakeuf et crée des glyphes Chocomatose à la mort des ennemis (gros buff en les traversant). On nettoie les adds avant de le concentrer.",
    recommendedLevel: "60 — 90",
    composition: "Faible Terre ; gestion des glyphes.",
    keyResist: ["Terre"],
    phases: [
      {
        title: "Twakeuf & Chocomatose",
        hp: "100% — 50%",
        mechanics: [
          "« Chokohowte » invoque des Twakeuf.",
          "Des glyphes Chocomatose apparaissent à la mort d'un ennemi : les traverser donne +300 puissance/+3 PA (2 tours).",
          "« Éclat » inflige des dégâts et pousse tout le monde dans un rayon de 2.",
        ],
        danger: "medium",
      },
      {
        title: "Mise à mort",
        hp: "50% — 0%",
        mechanics: [
          "Éliminez tous les adds avant le boss.",
          "Gérez les glyphes Chocomatose selon le succès visé.",
        ],
        danger: "medium",
      },
    ],
    tips: ["Tapez Terre.", "Profitez des glyphes Chocomatose pour vos pics de dégâts."],
    rewards: ["Set des Waddicts", "Ressources de forge", "Familier"],
    achievements: [
      { name: "Chrono", strategy: "Vaincre tous les monstres en moins de 9 tours." },
      { name: "Versatile", strategy: "N'utiliser chaque action qu'une seule fois par tour." },
      { name: "Collant", strategy: "Finir son tour sur une case adjacente à un autre allié." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Fou de choco", strategy: "Tous les combattants alliés doivent entrer dans l'état Chocomatose au moins une fois au cours du combat." },
    ],
  },

  // Pitons Rocheux des Craqueleurs — Craqueleur Légendaire
  18: {
    summary:
      "Le Craqueleur Légendaire (faible Feu) monte en PA chaque tour : à 20 PA, sa Pierre Étourdissante frappe toute la map. Lui retirer des PA est vital, sinon il faut le tuer avant le tour 4.",
    recommendedLevel: "70 — 100",
    composition: "Retrait de PA très utile ; faible Feu, dégâts Neutre = bouclier.",
    keyResist: ["Feu", "Neutre (donne un bouclier)"],
    phases: [
      {
        title: "Montée en PA",
        hp: "100% — 50%",
        mechanics: [
          "« Couche Rocailleuse » : +50% résistances, 200 résistances fixes et grosse esquive PA/PM tout le combat.",
          "Le boss gagne 1 PA/tour ; à 20 PA il lance « Pierre Étourdissante » (dégâts sur toute la map + Craqueboulisation).",
          "Invoque des Craqueleurs aléatoires tous les 3 tours.",
        ],
        danger: "high",
      },
      {
        title: "Course contre le PA",
        hp: "50% — 0%",
        mechanics: [
          "Retirez-lui des PA à tout prix pour l'empêcher d'atteindre 20.",
          "Sans retrait, focus et tuez le boss avant le tour 4.",
          "Tuez d'abord les invocations, surtout le Craqueboule (très dangereux au contact).",
        ],
        danger: "extreme",
      },
    ],
    tips: ["Les dégâts Neutre donnent un bouclier de 3000 (2 tours).", "Empêchez les 20 PA absolument."],
    rewards: ["Set du Craqueleur", "Pierres précieuses", "Familier"],
    achievements: [
      { name: "Prudent", strategy: "Ne jamais finir son tour sur une case adjacente à un ennemi." },
      { name: "Premier", strategy: "Craqueleur Légendaire doit être achevé en premier." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "De véritables craqu'", strategy: "Aucun combattant ennemi ne doit subir de dommages lorsque des invocations ennemies sont en vie." },
    ],
  },

  // Laboratoire de Brumen Tinctorias — Nelween
  35: {
    summary:
      "Nelween pénalise vos ressources : soigner coûte des PA/PM, elle retire des PA et des résistances et vole de la vie. Un combat de gestion plus que de burst.",
    recommendedLevel: "70 — 100",
    composition: "Gestion des PA/PM ; évitez de dépendre des soins.",
    keyResist: ["Multi-élément"],
    phases: [
      {
        title: "Ponction de ressources",
        hp: "100% — 0%",
        mechanics: [
          "Dès le début : soigner un allié coûte 1 PM/PA.",
          "Retire des PA et des pourcentages de résistance, et vole des PV.",
          "Pose un renvoi de sorts sur ses alliés.",
        ],
        danger: "medium",
      },
    ],
    tips: [
      "Gardez vos PA pour les dégâts plutôt que les soins.",
      "Pour le succès : restez à 3+ cases des alliés en infligeant des dégâts.",
    ],
    rewards: ["Set de Brumen", "Ressources d'alchimie", "Familier"],
    achievements: [
      { name: "Dernier", strategy: "Nelween doit être achevé en dernier." },
      { name: "Misanthrope", strategy: "Ne jamais finir son tour sur une case adjacente à un allié." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Laboratoire de curiosité", strategy: "Les combattants alliés ne doivent avoir aucun allié situé à 3 cases ou moins d'eux lorsqu'ils infligent des dommages à un ennemi." },
      { name: "Compagnons, quel est votre métier ?", strategy: "Combattre à 4 persos min. avec un Kloug, Klûme, Grizou ou Laikteur." },
    ],
  },

  // Épreuve de Draegnerys — Draegnerys
  116: {
    summary:
      "Draegnerys (faible Feu) invoque des Dragoeufs en continu et buffe ses alliés. Gérer les invocations et les poussées du Knout est la clé.",
    recommendedLevel: "70 — 100",
    composition: "Faible Feu ; gestion des adds et du placement.",
    keyResist: ["Feu"],
    phases: [
      {
        title: "Pépinière",
        hp: "100% — 50%",
        mechanics: [
          "« Pépinière » invoque 2 Dragoeufs au tour 1, puis d'autres tous les 2 tours.",
          "« Knout » : 90 dégâts Feu + poussée de 2 cases.",
          "« Somatotropine » buffe les alliés (+2 PA, +2 PM et stats) pour 2 tours.",
        ],
        danger: "high",
      },
      {
        title: "Mise à mort",
        hp: "50% — 0%",
        mechanics: [
          "Coupez les buffs d'alliés quand vous le pouvez.",
          "Placez-vous pour éviter les poussées du Knout.",
        ],
        danger: "medium",
      },
    ],
    tips: ["Tapez Feu.", "Gérez le flux constant de Dragoeufs."],
    rewards: ["Set de Draegnerys", "Œufs & ressources", "Familier"],
    achievements: [
      { name: "Les héros", strategy: "Combattre à 4 persos min. avec au moins un Krosmoglob, Korbax, Masse ou Chevalier d'Astrub." },
      { name: "Focus", strategy: "Lorsqu'un ennemi est attaqué par un allié, il doit être achevé avant qu'un autre ennemi ne soit attaqué." },
      { name: "Hardi", strategy: "Finir son tour sur une case adjacente à un ennemi." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Sortir de sa coquille", strategy: "Les ennemis ne doivent être achevés que lorsqu'au moins l'un d'eux se trouve dans l'état Intrépide (évolution maximale)." },
    ],
  },

  // Terrier du Wa Wabbit — Wa Wobot
  17: {
    summary:
      "Wa Wobot (faible Feu) invoque des Buffers répulsifs. La technique pro : aligner deux Buffers à 5 cases et faire rebondir le boss entre eux pour l'éliminer en un tour. La poussée est reine.",
    recommendedLevel: "80 — 110",
    composition: "Sorts de poussée/attirance essentiels (Libération utile).",
    keyResist: ["Feu"],
    phases: [
      {
        title: "Les Buffers",
        hp: "100% — 60%",
        mechanics: [
          "« Mékattwaction » attire la cible, inflige 80 Neutre et crée un Buffer ; les Carottes alliées se transforment aussi en Buffers.",
          "Pousser un ennemi dans un Buffer vous téléporte symétriquement ; les Buffers repoussent tout à 6 cases.",
          "Le boss gagne +30% résistances tous les 5 tours (grosse réserve de PV).",
        ],
        danger: "high",
      },
      {
        title: "Rebond mortel",
        hp: "60% — 0%",
        mechanics: [
          "Placez 2 Buffers alignés à 5 cases et faites rebondir le boss entre eux : dégâts de poussée continus, mort en un tour.",
          "Focus les adds d'abord (surtout le Black Wo Wabbit et sa Pesanteur). Évitez le contact des Buffers.",
        ],
        danger: "high",
      },
    ],
    tips: ["Apportez de la poussée (Libération à défaut).", "Maîtrisez les rebonds entre Buffers."],
    rewards: ["Set du Wabbit", "Ressources", "Familier"],
    achievements: [
      { name: "Mains propres", strategy: "Achever les ennemis sans leur infliger de dégâts directs." },
      { name: "Blitzkrieg", strategy: "Achever chaque ennemi attaqué avant le début de son tour." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "À fond les boulons", strategy: "Les alliés ne doivent pas recevoir de dommages de poussée." },
    ],
  },

  // Cimetière des Mastodontes — Mantiscore
  100: {
    summary:
      "Mantiscore (faible Feu) se téléporte dès qu'on le tape à distance. On abuse de ce mécanisme pour garder la distance, en évitant le corps-à-corps qui le soigne.",
    recommendedLevel: "80 — 110",
    composition: "Jeu à distance ; faible Feu.",
    keyResist: ["Feu"],
    phases: [
      {
        title: "Garde-Bouclier",
        hp: "100% — 50%",
        mechanics: [
          "« Garde-Bouclier » : le boss se téléporte dès qu'on le frappe à distance. Bloquez ses 4 cases adjacentes pour l'empêcher de fuir : il perd alors 50% de résistances (mais gagne +200 puissance 2 tours) — c'est la fenêtre de burst.",
          "« Darmoclès » (mêlée) : 200 Feu et applique Sursis ; sur une cible déjà sous Sursis, 300 Feu et le boss se soigne de 600 PV.",
          "« Provocaspion » attire tous les ennemis de 3 cases tous les 5 tours (il gagne 50 puissance par ennemi au contact).",
        ],
        danger: "medium",
      },
      {
        title: "Priorités",
        hp: "50% — 0%",
        mechanics: [
          "Éliminez les Léolhyènes en premier (leur « Mort Sûre » peut OS).",
          "Évitez le corps-à-corps pour ne pas empiler Sursis ni soigner le boss.",
        ],
        danger: "high",
      },
    ],
    tips: ["Abusez du téléport pour rester à distance.", "Ne le bloquez pas sans case libre."],
    rewards: ["Set du Mastodonte", "Ossements anciens", "Familier"],
    achievements: [
      { name: "Mains propres", strategy: "Achever les ennemis sans leur infliger de dégâts directs." },
      { name: "Zombie", strategy: "Utiliser exactement 1 PM par tour de jeu." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "À portée de dard", strategy: "Le Mantiscore ne doit pas recevoir de dommages à distance." },
    ],
  },

  // Domaine Ancestral — Abraknyde Ancestral
  9: {
    summary:
      "L'Abraknyde Ancestral résiste à 53% partout sauf Agilité et Feu. Il retire de l'agilité et des PA, se soigne et empoisonne : prévoyez de quoi dissiper le poison.",
    recommendedLevel: "90 — 120",
    composition: "Dégâts Feu/Agilité ; un dissipeur de poison conseillé.",
    keyResist: ["Feu", "Agilité"],
    phases: [
      {
        title: "Poison & invocations",
        hp: "100% — 50%",
        mechanics: [
          "~150 dégâts au contact ; invoque des Araknes Majeures qui poussent et debuffent.",
          "Retire l'agilité et des PA ; peut se soigner d'environ 2000 PV.",
          "Empoisonne un allié : chaque PA dépensé lui inflige 50 dégâts.",
        ],
        danger: "high",
      },
      {
        title: "Mise à mort",
        hp: "50% — 0%",
        mechanics: [
          "Dissipez le poison ; évitez de jouer un DD agilité s'il est debuffé.",
          "Restez à distance du boss et des invocations.",
        ],
        danger: "medium",
      },
    ],
    tips: ["Tapez Feu ou Agilité (ses seuls points faibles).", "Gérez le poison de PA."],
    rewards: ["Set Ancestral", "Bois & ressources", "Familier"],
    achievements: [
      { name: "Nomade", strategy: "Utiliser tous ses PM à chaque tour, tout le combat." },
      { name: "Premier", strategy: "Abraknyde Ancestral doit être achevé en premier." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Distance respectueuse", strategy: "N'avoir aucun ennemi à 3 PO ou moins de soi quand on inflige des dégâts." },
    ],
  },

  // Antre de la Reine Nyée — Reine Nyée
  89: {
    summary:
      "La Reine Nyée est faible Eau/Feu (éviter Terre/Air). Le vrai danger, ce sont ses servantes : la Néfileuse (cocon qui retire 100 PA/PM) est à tuer en priorité.",
    recommendedLevel: "90 — 120",
    composition: "Dégâts Eau ou Feu ; gestion des invocations.",
    keyResist: ["Eau", "Feu (éviter Terre/Air 30-40%)"],
    phases: [
      {
        title: "Les servantes",
        hp: "100% — 50%",
        mechanics: [
          "« Mitraille de soie » retire 15% de résistance élémentaire en cercle à distance.",
          "Invoque des œufs tous les 2 tours → Tregenaires qui soignent et montent en puissance quand le boss est touché.",
          "Néfileuse : cocon qui retire 100 PA/100 PM et prépare des OS par l'Arapex ; Dardalaine renvoie les dégâts.",
        ],
        danger: "high",
      },
      {
        title: "Focus boss",
        hp: "50% — 0%",
        mechanics: [
          "Tuez la Néfileuse en premier, puis gérez Dardalaine (pas de corps-à-corps).",
          "Concentrez ensuite la Reine en Eau/Feu.",
        ],
        danger: "high",
      },
    ],
    tips: ["Les servantes > la Reine en danger.", "Évitez Terre/Air."],
    rewards: ["Set de la Reine Nyée", "Soie & ressources", "Familier"],
    achievements: [
      { name: "Chevaliers tourmentés", strategy: "Combattre à 4 persos min. avec au moins un Flamme, Goutte, Nuage, Feuille ou Ténèbre." },
      { name: "Premier", strategy: "Reine Nyée doit être achevé en premier." },
      { name: "Hardi", strategy: "Finir son tour sur une case adjacente à un ennemi." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "On ne peut la Nyée", strategy: "Lorsque la Reine Nyée invoque un Oeuf de Trégénaire, celui-ci doit être achevé avant le début de son prochain tour." },
    ],
  },

  // Bateau du Chouque — Le Chouque
  91: {
    summary:
      "Le Chouque (taper Neutre, éviter Eau) maudit les joueurs et frappe le plus proche non maudit. Garder ses PV au-dessus de 50% évite les mécaniques d'OS.",
    recommendedLevel: "90 — 120",
    composition: "Dégâts Neutre ; gestion des PV et du placement.",
    keyResist: ["Neutre (éviter Eau 36%)"],
    phases: [
      {
        title: "Malédiction Pirate",
        hp: "100% — 50%",
        mechanics: [
          "Passif : inflige 110 Eau/tour au joueur le plus proche non maudit ET à tous les maudits.",
          "« Coup de Sabre Maudit » applique une malédiction 2 tours et invoque des pirates si la cible est ≤50% PV.",
          "Le boss se téléporte pour échanger avec un allié (bloqué par Pesanteur).",
        ],
        danger: "high",
      },
      {
        title: "Priorités",
        hp: "50% — 0%",
        mechanics: [
          "Restez au-dessus de 50% PV pour éviter les OS (boss ou Nakunbra).",
          "Tuez les sbires d'abord : Ivremor (distance), puis Nakunbra (mêlée).",
        ],
        danger: "high",
      },
    ],
    tips: ["Appliquez Pesanteur pour bloquer les échanges.", "Gardez >50% PV."],
    rewards: ["Set du Chouque", "Butin de pirate", "Familier"],
    achievements: [
      { name: "Dernier", strategy: "Le Chouque doit être achevé en dernier." },
      { name: "Nomade", strategy: "Utiliser tous ses PM à chaque tour, tout le combat." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Saute-pirate", strategy: "Lorsque le Chouque échange de place avec un de ses alliés, ce dernier doit être achevé en moins de deux tours." },
    ],
  },

  // Chapiteau des Magik Riktus — Choudini
  105: {
    summary:
      "Choudini (Neutre, sans résistance élémentaire) échange sa place avec qui le touche au contact en début de tour. On reste mobile et on tue d'abord ses quatre compagnons.",
    recommendedLevel: "90 — 120",
    composition: "Diversité élémentaire (les sbires résistent 60% chacun).",
    keyResist: ["Neutre", "Multi-élément pour les sbires"],
    phases: [
      {
        title: "Les compagnons",
        hp: "100% — 50%",
        mechanics: [
          "« Prends ma place » : si un perso est au contact du Choudini en début de tour, il échange de place.",
          "« Reste assis » : poison qui scale avec les PM dépensés.",
          "« Détriktus » pousse les alliés de 3 cases.",
        ],
        danger: "medium",
      },
      {
        title: "Le magicien",
        hp: "50% — 0%",
        mechanics: [
          "Tuez les 4 compagnons d'abord (plus dangereux que le Choudini évasif).",
          "Anticipez les échanges de place et limitez vos PM si empoisonné.",
        ],
        danger: "medium",
      },
    ],
    tips: ["Restez mobile pour gérer les échanges.", "Variez les éléments contre les sbires."],
    rewards: ["Set des Magik Riktus", "Ressources", "Familier"],
    achievements: [
      { name: "Bandits du Magik Riktus", strategy: "Combattre à 4 persos min. avec au moins un Riktus fine-lame, Riktus archer, Riktus baroudeur ou Riktus ensorceleuse." },
      { name: "Collant", strategy: "Finir son tour sur une case adjacente à un autre allié." },
      { name: "Hardi", strategy: "Finir son tour sur une case adjacente à un ennemi." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Chacun son tour de magie", strategy: "Lorsqu'un ennemi déplace un allié, cet ennemi doit être lui-même déplacé par un allié avant le début de son prochain tour." },
    ],
  },

  // Cale de l'Arche d'Otomaï — Gourlo le Terrible
  39: {
    summary:
      "Gourlo le Terrible est invulnérable tant qu'une faiblesse ne lui est pas appliquée via les tonneaux qu'il invoque. Le donjon repose entièrement sur la gestion de ces tonneaux élémentaires.",
    recommendedLevel: "70 — 100",
    composition: "Groupe mono-élément conseillé pour exploiter une seule couleur de tonneau.",
    keyResist: ["Variable", "Selon les tonneaux conservés"],
    phases: [
      {
        title: "Invocation des tonneaux",
        hp: "100% — 60%",
        mechanics: [
          "Gourlo invoque un tonneau par tour et gagne 200 agilité par tonneau présent.",
          "Chaque tonneau a 100% de résistance dans un élément aléatoire et 0% dans les autres.",
          "Conservez uniquement les tonneaux correspondant à votre élément de dégâts.",
        ],
        danger: "medium",
      },
      {
        title: "Fenêtre de faiblesse",
        hp: "60% — 0%",
        mechanics: [
          "Dès le tour 3, un tonneau adjacent applique 200% de faiblesse à l'ennemi proche dans son élément.",
          "Placez un tonneau collé au boss pour déclencher la faiblesse et le rendre vulnérable.",
          "Concentrez les dégâts pendant la fenêtre de 3 tours de faiblesse.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Nettoyez les invocations adverses avant d'exploiter la faiblesse.",
      "Une équipe mono-élément simplifie énormément le tri des tonneaux.",
    ],
    rewards: ["Set d'Otomaï", "Ressources de l'Arche", "Familier"],
    achievements: [
      { name: "Premier", strategy: "Gourlo le Terrible doit être achevé en premier." },
      { name: "Econome", strategy: "Les combattants alliés ne doivent utiliser qu'une seule fois la même action durant toute la durée du combat." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Tonneaux truands", strategy: "Tous les ennemis doivent subir au moins une fois l'effet d'un tonneau de pirate." },
    ],
  },

  // Tanière du Meulou — Meulou
  15: {
    summary:
      "Donjon de niveau 100 réputé bien plus dur que ses voisins. Le Meulou enchaîne invulnérabilité, montée en puissance et auto-soin : un vrai mur si l'on n'adapte pas sa façon de taper.",
    recommendedLevel: "100 — 140",
    composition: "DD Feu, un soutien retrait de soin, un placeur. Difficile même à 150+.",
    keyResist: ["Feu"],
    phases: [
      {
        title: "Invulnérabilité & fureur",
        hp: "100% — 50%",
        mechanics: [
          "Le Meulou est invulnérable : il faut le toucher une fois par tour pour retirer l'état avant de lui infliger des dégâts.",
          "Fureur : il gagne 30 puissance par ligne de dégâts reçue (durée 4 tours).",
          "Privilégiez les sorts mono-ligne à gros dégâts plutôt que les sorts multi-lignes.",
        ],
        danger: "high",
      },
      {
        title: "Soins & invocations",
        hp: "50% — 0%",
        mechanics: [
          "Il invoque des Milimeulou tous les 8 tours : ne les tuez pas, ils boostent ses alliés si mal gérés.",
          "Sous 80% de vie, il se soigne de 2 000 PV tous les 6 tours.",
          "Appliquez érosion ou état insoignable pour bloquer ses soins.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Restez à distance pour éviter ses attaques de corps-à-corps.",
      "Tapez le Feu (seulement -5% de résistance) et limitez le nombre de lignes de dégâts.",
    ],
    rewards: ["Set du Meulou", "Laine de Meulou", "Familier Meulou"],
    achievements: [
      { name: "Mini Nuits'", strategy: "Combattre à 4 persos min. avec au moins un Inferno, Styx, Mandrin ou Will Killson." },
      { name: "Premier", strategy: "Meulou doit être achevé en premier." },
      { name: "Hardi", strategy: "Finir son tour sur une case adjacente à un ennemi." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Meulou y es-tu ?", strategy: "Un même allié ne doit pas infliger plus de 3 attaques par tour à un ennemi." },
    ],
  },

  // Potager d'Halouine — Halouine
  66: {
    summary:
      "Boss saisonnier (Halloween) qui se soigne énormément au corps-à-corps et ressuscite vos ennemis abattus. Le maître-mot est de le tenir à distance.",
    recommendedLevel: "100 — 130",
    composition: "Groupe avec retrait PO/PM et dispel. Difficulté modérée si la distance est gérée.",
    keyResist: ["Terre"],
    phases: [
      {
        title: "Moissonnage",
        hp: "100% — 50%",
        mechanics: [
          "Au corps-à-corps, Moissonnage soigne Halouine de 20% de sa vie, cumulable jusqu'à 5 fois sur 3 tours.",
          "Tenez-le à distance pour neutraliser cet auto-soin dévastateur.",
          "Retirez-lui PO/PM pour limiter ses déplacements et ses attractions.",
        ],
        danger: "medium",
      },
      {
        title: "Plantes zombies",
        hp: "50% — 0%",
        mechanics: [
          "Dès le tour 3, tous les 2 tours, il ressuscite le dernier ennemi tombé à 1% PV avec 1 tour d'invulnérabilité.",
          "Râttirance attire les cibles de 5 cases en ligne et applique Pesanteur (bloque la téléportation).",
          "Dissipez les bonus de vitalité quand sa vie restante approche le bonus accumulé.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Gardez Halouine éloigné en permanence : c'est tout le donjon.",
      "Les sbires (Cauchemarakne, Lanverne, Champêtrouille) sont secondaires.",
    ],
    rewards: ["Set d'Halouine", "Ressources d'Halloween", "Familier saisonnier"],
    achievements: [
      { name: "Chrono", strategy: "Vaincre tous les monstres en moins de 9 tours." },
      { name: "Hardi", strategy: "Finir son tour sur une case adjacente à un ennemi." },
      { name: "Dernier", strategy: "Halouine doit être achevé en dernier." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Rester planté là", strategy: "Les alliés ne doivent jamais être déplacés." },
    ],
  },

  // Théâtre de Dramak — Maître des Pantins
  72: {
    summary:
      "Considéré comme l'un des pires donjons de sa tranche. Le Maître des Pantins est invulnérable tant que ses 5 marionnettes colorées vivent, et celles-ci se réinvoquent vite.",
    recommendedLevel: "100 — 130",
    composition: "5 joueurs multi-éléments, minimum 1 500 PV par perso. Synergie d'équipe requise.",
    keyResist: ["Tous", "Selon la couleur des marionnettes"],
    phases: [
      {
        title: "Les marionnettes",
        hp: "100% — 60%",
        mechanics: [
          "Le boss est invulnérable tant que les 5 Marionnettes colorées ne sont pas éliminées.",
          "Chaque marionnette résiste à 200% dans sa propre couleur.",
          "Tuez les 5 avant le tour 5, sinon elles se réinvoquent tous les 4 tours.",
        ],
        danger: "high",
      },
      {
        title: "Fenêtre de vulnérabilité",
        hp: "60% — 0%",
        mechanics: [
          "Le boss devient vulnérable 2 tours après la mort des marionnettes.",
          "L'état Bunraku invoque un petit pantin allié s'il n'est pas purgé par les dégâts d'un allié.",
          "Placez-vous prudemment au tour 1 pour éviter les attaques immédiates.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Synchronisez la mort des 5 marionnettes pour ouvrir la fenêtre de dégâts.",
      "Répartissez les éléments pour ne pas taper une marionnette dans sa couleur.",
    ],
    rewards: ["Set de Dramak", "Ressources du Théâtre", "Familier"],
    achievements: [
      { name: "Statue", strategy: "Finir chaque tour sur la case où on l'a commencé, tout le combat." },
      { name: "Mains propres", strategy: "Achever les ennemis sans leur infliger de dégâts directs." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Spectacle de marionnettes", strategy: "Achever les marionnettes dans leur ordre d'invocation (Blanche > Bleue > Rouge > Verte > Grise)." },
    ],
  },

  // Fabrique de Malléfisk — Malléfisk
  77: {
    summary:
      "Donjon à vagues : Malléfisk est présent dès le départ et 5 vagues de monstres arrivent tous les 5 tours. La gestion du surnombre prime sur la complexité mécanique.",
    recommendedLevel: "100 — 130",
    composition: "Groupe capable de nettoyer vite les vagues. Difficulté modérée.",
    keyResist: ["Agilité"],
    phases: [
      {
        title: "Gestion des vagues",
        hp: "100% — 50%",
        mechanics: [
          "5 vagues de monstres arrivent tous les 5 tours (sauf si nettoyées plus tôt).",
          "Ofranor donne +100 puissance infiniment au boss ET à l'attaquant.",
          "Tuez les vagues rapidement pour éviter d'être submergé.",
        ],
        danger: "medium",
      },
      {
        title: "Boucliers (sous 50%)",
        hp: "50% — 0%",
        mechanics: [
          "Sous 50% de vie, le boss gagne 500 de bouclier par ligne de dégâts reçue.",
          "Privilégiez les attaques mono-ligne à gros dégâts pour limiter puissance et boucliers.",
          "Un sort type Colère de Iop évite l'empilement excessif de boucliers.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "« Échapper au fisk » : éliminez les 5 vagues avant de tuer Malléfisk.",
      "Tapez Agilité, l'élément principal du boss.",
    ],
    rewards: ["Set Malléfisk", "Ressources de la Fabrique", "Familier"],
    achievements: [
      { name: "Rats... au sens propre ou au figuré", strategy: "Combattre à 4 persos min. avec au moins un Rapiat, Rapine, Ougicle ou Hulkrap." },
      { name: "Circulez !", strategy: "Ne tenter aucun retrait de PM sur les ennemis durant tout le combat." },
      { name: "Blitzkrieg", strategy: "Achever chaque ennemi attaqué avant le début de son tour." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 30 tours." },
      { name: "Échapper au fisk", strategy: "Tuer Malléfisk en dernier." },
    ],
  },

  // Arbre de Moon — Moon
  92: {
    summary:
      "Moon a 100% de résistances dans tous les éléments : il faut placer 4 totems colorés sur leurs glyphes pour le rendre vulnérable. Un donjon de placement et de coordination élémentaire.",
    recommendedLevel: "100 — 130",
    composition: "Groupe multi-éléments coordonné, capable de pousser les totems en ligne.",
    keyResist: ["Tous", "Après placement des totems"],
    phases: [
      {
        title: "Les totems",
        hp: "100% — 60%",
        mechanics: [
          "Moon résiste à 100% partout tant que les totems ne sont pas sur leurs glyphes.",
          "4 totems (Rouge/Feu, Vert/Air, Bleu/Eau, Jaune/Terre) doivent être touchés dans leur élément pour se déplacer.",
          "Tapez un totem en ligne avec son élément assorti pour l'attirer vers vous, puis sur son glyphe.",
        ],
        danger: "high",
      },
      {
        title: "Vulnérabilité",
        hp: "60% — 0%",
        mechanics: [
          "Une fois les 4 totems sur leurs glyphes, Moon perd ses résistances et devient vulnérable.",
          "Darkli Moon échange les places avec les joueurs et booste Moon de 100 puissance.",
          "Évitez le Gobage du Gloutovore, qui élimine instantanément une cible.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Coordonnez les sorts élémentaires pour caler les totems le plus tôt possible.",
      "Gérez les positions face aux échanges de place de Darkli Moon.",
    ],
    rewards: ["Set de Moon", "Bois de Moon", "Familier"],
    achievements: [
      { name: "Les pandaliens", strategy: "Combattre à 4 persos min. avec au moins un Mirh, Rekto Topi, Traçon ou Logram." },
      { name: "Versatile", strategy: "N'utiliser chaque action qu'une seule fois par tour." },
      { name: "Statue", strategy: "Finir chaque tour sur la case où on l'a commencé, tout le combat." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Animal totem", strategy: "Les totems de Darkli Moon ne doivent jamais perdre de PV." },
    ],
  },

  // Repaire du Kharnozor — Kharnozor
  115: {
    summary:
      "Kharnozor est immobile mais monte en puissance à chaque mort de monstre et punit sévèrement le corps-à-corps. La distance et l'ordre d'élimination des sbires font tout.",
    recommendedLevel: "100 — 130",
    composition: "Groupe à distance ; positionnement tactique requis.",
    keyResist: ["Neutre", "Air", "Terre"],
    phases: [
      {
        title: "Montée en puissance",
        hp: "100% — 50%",
        mechanics: [
          "Le boss gagne 710 PV et +10% de dégâts à chaque mort d'un monstre.",
          "Il reste immobile durant tout le combat.",
          "Planifiez soigneusement l'ordre d'élimination : le scaling devient sévère.",
        ],
        danger: "medium",
      },
      {
        title: "Punition du corps-à-corps",
        hp: "50% — 0%",
        mechanics: [
          "Attaqué à moins de 2 cases, il vous attire au corps-à-corps et déclenche « Mort sûre ».",
          "Il applique en permanence Assourdi, ajoutant Incurable et Pesanteur 2 tours au contact.",
          "Attaquez toujours à plus de 2 cases avec des sorts à distance.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Restez hors de portée du corps-à-corps en toutes circonstances.",
      "Gérez le rythme des morts pour limiter le scaling du boss.",
    ],
    rewards: ["Set du Kharnozor", "Ressources du Repaire", "Familier"],
    achievements: [
      { name: "Dernier", strategy: "Kharnozor doit être achevé en dernier." },
      { name: "Circulez !", strategy: "Ne tenter aucun retrait de PM sur les ennemis durant tout le combat." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Les yeux aussi gros que le ventre", strategy: "Chaque ennemi doit avoir au moins un allié en ligne de vue au début de son tour." },
    ],
  },

  // Bibliothèque du Maître Corbac — Maître Corbac
  3: {
    summary:
      "Boss à faibles PV mais résistances extrêmes : seul l'élément Terre passe correctement. Les sbires (buffs/débuffs) doivent être éliminés dans le bon ordre avant le boss.",
    recommendedLevel: "110 — 140",
    composition: "Donjon 4-8 joueurs scalable ; DD Terre indispensables.",
    keyResist: ["Terre"],
    phases: [
      {
        title: "Gestion des sbires",
        hp: "100% — 60%",
        mechanics: [
          "Éliminez les monstres dans l'ordre : Corbac Apprivoisé → Renarbo → Buveur, puis le boss.",
          "Le Buveur donne 75% de résistances, le Renarbo les retire : priorité aux supports.",
          "Le Corbac Apprivoisé purge les débuffs : retirez-les quand c'est possible.",
        ],
        danger: "medium",
      },
      {
        title: "Carapace d'Ailes",
        hp: "60% — 0%",
        mechanics: [
          "Dès le tour 3, Carapace d'Ailes renvoie 400 dégâts quand le boss est touché et lui coûte 12 PA / 5 PM pendant 2 tours.",
          "Ne perdez pas de temps à tuer ses invocations Corbac : il les réinvoque aussitôt.",
          "Gardez le boss à distance : il ne tape qu'au corps-à-corps.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Terre (25% de résistance seulement, contre 45%+ ailleurs).",
      "Faibles PV (4 500-6 600) mais résistances énormes : la pénétration compte.",
    ],
    rewards: ["Set du Maître Corbac", "Ressources de la Bibliothèque", "Familier Corbac"],
    achievements: [
      { name: "Collant", strategy: "Finir son tour sur une case adjacente à un autre allié." },
      { name: "Premier", strategy: "Maître Corbac doit être achevé en premier." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Maître Corbac sur un arbre perché", strategy: "Terminer son tour à 5 PO ou moins d'un ennemi." },
    ],
  },

  // Caverne de Nowel — Papa Nowel
  37: {
    summary:
      "Boss saisonnier en deux phases : le Papa Nowel se reconstitue puis se scinde en jambes + buste. Burst, gestion des PM et placement contre son OS au corps-à-corps sont la clé.",
    recommendedLevel: "110 — 140",
    composition: "Groupe avec burst, gestion PM et placement. Difficulté modérée à élevée.",
    keyResist: ["Neutre", "Variable selon vos sorts"],
    phases: [
      {
        title: "Forme unique",
        hp: "100% — 30%",
        mechanics: [
          "Infantophagie OS la cible au corps-à-corps et le soigne de 500 PV : restez à distance.",
          "Aspir'nenfan attire de 3 cases en ligne ; Hotte d'or lui donne 5 PO par tentative de retrait PM.",
          "Tuez tous les sbires avant de focus le boss.",
        ],
        danger: "medium",
      },
      {
        title: "Séparation (Dichotomie)",
        hp: "30% — 0%",
        mechanics: [
          "À bas PV il utilise Embûche de Nowel : soin total et état « Fragilisé », puis se scinde.",
          "Dichotomie sacrifie 50% de ses PV pour invoquer un Demi Papa Nowel (jambes + buste).",
          "Tentez de le tuer en un tour avant la séparation ; sinon visez les jambes (50% PV après split) pour finir.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Empaquetage transforme un perso en cadeau (-1 PM, -4 PA, Affaibli) : burstez avant.",
      "Évitez le corps-à-corps face à Infantophagie.",
    ],
    rewards: ["Set de Nowel", "Ressources de Nowel", "Familier saisonnier"],
    achievements: [
      { name: "Chrono", strategy: "Vaincre tous les monstres en moins de 9 tours." },
      { name: "Premier", strategy: "Papa Nowel doit être achevé en premier." },
      { name: "Statue", strategy: "Finir chaque tour sur la case où on l'a commencé, tout le combat." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Un Nowel presque parfait", strategy: "Les alliés doivent achever le Demi Papa Nowel sans occasionner de dommages au Papa Nowel une fois qu'il entre dans l'état Séparé. Le challenge échoue si le Papa Nowel est achevé avant d'entrer dans cet état." },
    ],
  },

  // Goulet du Rasboul — Silf le Rasboul Majeur
  41: {
    summary:
      "Silf résiste à 200% dans tous les éléments : il faut manipuler ses PA pour ouvrir une fenêtre de vulnérabilité. Combat de focus mono-élément sur 4 salles de vagues.",
    recommendedLevel: "110 — 140",
    composition: "Groupe mono-élément avec contrôle des PA. Difficulté modérée.",
    keyResist: ["Au choix", "Un seul élément maintenu"],
    phases: [
      {
        title: "Résistances & invocations",
        hp: "100% — 60%",
        mechanics: [
          "Silf a 200% de résistance dans tous les éléments au départ.",
          "Il invoque 1-2 Rasboul Mineurs par tour (75% partout, -75% dans un élément aléatoire).",
          "Les mineurs peuvent soigner intégralement leurs alliés : éliminez-les.",
        ],
        danger: "medium",
      },
      {
        title: "Fenêtre Hololole",
        hp: "60% — 0%",
        mechanics: [
          "Boosté à 14+ PA, Silf lance Hololole qui réduit la résistance de la cible de 50% par coup.",
          "Manipulez ses PA (retrait ou ajout) pour atteindre le seuil de 14 PA et déclencher la vulnérabilité.",
          "Frappez 4 fois avec des sorts à faible coût PA dans votre élément avant que la résistance ne se réinitialise.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Choisissez un seul élément et maintenez-le tout le combat.",
      "Gérez les PA du boss : c'est le cœur de la stratégie.",
    ],
    rewards: ["Set du Rasboul", "Ressources du Goulet", "Familier"],
    achievements: [
      { name: "Premier", strategy: "Silf le Rasboul Majeur doit être achevé en premier." },
      { name: "Temps qui court", strategy: "Vaincre Silf le Rasboul Majeur dans son donjon. Les personnages ne doivent pas retirer de PA aux adversaires." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Ras le boule", strategy: "Il ne doit jamais y avoir plus de 2 Rasbouls mineurs sur le terrain au début du tour de Silf le Rasboul Majeur." },
    ],
  },

  // Garde-manger du Rat Blanc — Rat Blanc
  42: {
    summary:
      "Le Rat Blanc empile des résistances à chaque coup dans le même élément, jusqu'à l'immunité. Il faut varier les éléments et purger ses résistances.",
    recommendedLevel: "110 — 140",
    composition: "Équipe variée avec dispels recommandés. Difficulté modérée.",
    keyResist: ["Variez les éléments", "Évitez de stacker un seul élément"],
    phases: [
      {
        title: "Rascasse",
        hp: "100% — 50%",
        mechanics: [
          "Rascasse donne 50% de résistance par coup dans l'élément touché, cumulable jusqu'à 100% d'immunité.",
          "Utilisez des sorts de dissipation pour retirer Rascasse avant qu'elle ne soit maximale.",
          "Variez vos éléments pour ne pas le rendre immunisé.",
        ],
        danger: "medium",
      },
      {
        title: "Peste Blanche",
        hp: "50% — 0%",
        mechanics: [
          "L'état Peste Blanche retire tous les buffs si vous soignez la cible affligée.",
          "Séparez le boss de la portée de soin de l'Aloevée Rat.",
          "Tuez l'Aloevée Rat en premier si vous ne visez pas le succès « Premier ».",
        ],
        danger: "medium",
      },
    ],
    tips: [
      "Les débuffeurs sont précieux contre Rascasse.",
      "Le corps-à-corps fait des dégâts modérés, la distance reste gérable.",
    ],
    rewards: ["Set du Rat Blanc", "Ressources du Garde-manger", "Familier"],
    achievements: [
      { name: "Premier", strategy: "Rat Blanc doit être achevé en premier." },
      { name: "Hardi", strategy: "Finir son tour sur une case adjacente à un ennemi." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "La taille du rat", strategy: "Chaque ennemi doit subir des dégâts au moins une fois entre chacun de ses tours." },
    ],
  },

  // Sousouricière du Rat Noir — Rat Noir
  43: {
    summary:
      "Pendant noir du Rat Blanc : il punit les soins et la mauvaise gestion des éléments. Tapez Feu/Air, fuyez la Terre/Neutre qui le soignent.",
    recommendedLevel: "110 — 140",
    composition: "DD à distance avec soutien soin maîtrisé. Difficulté modérée.",
    keyResist: ["Feu", "Air"],
    phases: [
      {
        title: "Peste Noire & soins",
        hp: "100% — 50%",
        mechanics: [
          "Peste Noire inflige des dégâts quand on soigne le perso affligé : préférez le vol de vie.",
          "Kackisoigne soigne ses alliés quand ils subissent des dégâts Terre/Neutre : bannissez ces éléments.",
          "Tapez Feu et Air (20% de faiblesse) ; évitez la Terre (50% de résistance).",
        ],
        danger: "medium",
      },
      {
        title: "Kackitu",
        hp: "50% — 0%",
        mechanics: [
          "Kackitu est une attaque au corps-à-corps qui applique un état létal.",
          "Restez à distance ou utilisez des leurres/tanks pour éviter Kackitu.",
          "Coordonnez les soins pour ne pas déclencher Peste Noire.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Boostez Feu/Air pour accélérer le kill.",
      "Le vol de vie remplace avantageusement les soins directs.",
    ],
    rewards: ["Set du Rat Noir", "Ressources de la Sousouricière", "Familier"],
    achievements: [
      { name: "Blitzkrieg", strategy: "Achever chaque ennemi attaqué avant le début de son tour." },
      { name: "Hardi", strategy: "Finir son tour sur une case adjacente à un ennemi." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Rat-trapage", strategy: "Le Rat Noir ne doit pas subir de dommages avant que tous les autres ennemis soient achevés." },
      { name: "Rats... au sens propre ou au figuré", strategy: "Combattre à 4 persos min. avec au moins un Rapiat, Rapine, Ougicle ou Hulkrap." },
    ],
  },

  // Miausolée du Pounicheur — Le Pounicheur
  93: {
    summary:
      "Le Pounicheur renvoie près du double des dégâts sauf si ses 3 puces invulnérables sont alignées sur le même état. Combat à puzzle autour de la mécanique des puces.",
    recommendedLevel: "110 — 140",
    composition: "Donjon modulable selon la taille du groupe. Difficulté modérée à élevée.",
    keyResist: ["Neutre", "Poison / burst conseillés (renvoi)"],
    phases: [
      {
        title: "Les puces",
        hp: "100% — 50%",
        mechanics: [
          "Le boss invoque 3 puces invulnérables (Tipoune, Tipoune, Tipoude) avec des états tournants (I, II, III).",
          "Frapper une puce au corps-à-corps incrémente son état et décrémente celui des deux autres.",
          "Alignez les 3 puces sur le même état pour empêcher le renvoi de dégâts.",
        ],
        danger: "high",
      },
      {
        title: "Pourrification",
        hp: "50% — 0%",
        mechanics: [
          "Quand les 3 puces partagent le même état, le Pounicheur lance Pourrification (retire la durée des buffs).",
          "Tant que les puces ne sont pas alignées, il renvoie ~200% des dégâts reçus.",
          "Utilisez poison ou burst mono-coup (type Colère de Iop) pour contourner le renvoi.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Maîtriser l'état des puces est la condition pour survivre au renvoi.",
      "Tuez les vagues d'adds vite (5 vagues) pour éviter le surnombre.",
    ],
    rewards: ["Set du Pounicheur", "Ressources du Miausolée", "Familier"],
    achievements: [
      { name: "Blitzkrieg", strategy: "Achever chaque ennemi attaqué avant le début de son tour." },
      { name: "Statue", strategy: "Finir chaque tour sur la case où on l'a commencé, tout le combat." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 30 tours." },
      { name: "Sac à pupuces", strategy: "Chaque pupuce invoquée par le Pounicheur ne doit pas changer d'état plus d'une fois par tour global." },
    ],
  },

  // Bambusaie de Damadrya — Damadrya
  125: {
    summary:
      "Boss simple et direct : Damadrya applique un vol de vie érosif et invoque des bourgeons explosifs. Pas de mécanique d'invulnérabilité, on tape fort et vite.",
    recommendedLevel: "110 — 140",
    composition: "Solo à 4 joueurs. Difficulté faible : « pas de stratégie particulière, tapez ! ».",
    keyResist: ["Aléatoire", "Tous éléments touchent"],
    phases: [
      {
        title: "Sangsuc",
        hp: "100% — 50%",
        mechanics: [
          "Sangsuc est appliqué en début de combat : draine 50 PV/tour en vol de vie avec 20% d'érosion.",
          "La durée de Sangsuc décroît selon l'ordre d'initiative (8 tours pour le premier perso).",
          "Tuez Damadrya rapidement pour minimiser les rencontres de bourgeons.",
        ],
        danger: "low",
      },
      {
        title: "Bourgeons & Urticaire",
        hp: "50% — 0%",
        mechanics: [
          "Elle invoque des Bourgeons (20 PV) qui explosent pour 80 dégâts à l'approche.",
          "Urticaire frappe toutes les cibles adjacentes et réduit la puissance de 50.",
          "Gardez vos distances avec les bourgeons invoqués.",
        ],
        danger: "medium",
      },
    ],
    tips: [
      "Succès duo : terminer en moins de 20 tours à 2 persos max.",
      "Burst : tuer vite limite tous les effets de zone.",
    ],
    rewards: ["Set de Damadrya", "Ressources de la Bambusaie", "Familier"],
    achievements: [
      { name: "Premier", strategy: "Damadrya doit être achevé en premier." },
      { name: "Hardi", strategy: "Finir son tour sur une case adjacente à un ennemi." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "On lui pèlera le bourgeon", strategy: "Un allié ne doit pas subir plus d'une fois l'explosion d'un Bourgeon de Damadrya." },
    ],
  },

  // Repaire de Skeunk — Skeunk
  46: {
    summary:
      "Skeunk est un boss soigneur entouré de poupées Sadida. La poupée affamée ressuscite les sbires chaque tour : l'ordre d'élimination fait tout le donjon.",
    recommendedLevel: "120 — 150",
    composition: "Skeunk + 5 créatures (4 poupées Sadida + poupée affamée). Difficulté modérée à élevée.",
    keyResist: ["Feu"],
    phases: [
      {
        title: "La poupée affamée",
        hp: "100% — 60%",
        mechanics: [
          "La poupée affamée ressuscite tous les sbires tombés à chaque tour : tuez-la en premier.",
          "Diamantine peut invoquer un OS au corps-à-corps : restez vigilant à courte portée.",
          "Rubise transforme en totem et retire PA/PM : prudence.",
        ],
        danger: "high",
      },
      {
        title: "Le soigneur",
        hp: "60% — 0%",
        mechanics: [
          "Skeunk se soigne et soigne ses alliés : appliquez de l'érosion ou un état insoignable.",
          "Tapez Feu, son élément principal.",
          "Finissez les poupées restantes avant de focus le boss.",
        ],
        danger: "medium",
      },
    ],
    tips: [
      "Priorité absolue : la poupée affamée, sinon le combat ne finit jamais.",
      "Gérez l'ordre de mort des Sadida pour neutraliser leurs effets.",
    ],
    rewards: ["Set de Skeunk", "Ressources du Repaire", "Familier"],
    achievements: [
      { name: "Statue", strategy: "Finir chaque tour sur la case où on l'a commencé, tout le combat." },
      { name: "Blitzkrieg", strategy: "Achever chaque ennemi attaqué avant le début de son tour." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 26 tours." },
      { name: "Les fans et les enfants d'abord", strategy: "Les poupées doivent être achevées dans l'ordre défini. Au début du combat, l'une d'elles est choisie, puis détermine la prochaine à sa mort. Toutes les poupées doivent être achevées avant que Skeunk ne puisse subir de dégâts." },
    ],
  },

  // Antre du Blop Multicolore Royal — Blop Multicolore Royal
  49: {
    summary:
      "Cinq Blops Royaux à 100% de résistances : tuer chaque variante colorée retire l'immunité de son élément. Combat de gros volume de PV exigeant tous les éléments.",
    recommendedLevel: "120 — 150",
    composition: "Équipe 4 éléments idéale ; les groupes de 6+ ont un net avantage. Difficulté élevée.",
    keyResist: ["Air", "Feu", "Eau", "Terre"],
    phases: [
      {
        title: "Retrait des résistances",
        hp: "100% — 50%",
        mechanics: [
          "Le boss démarre à 100% de résistance dans tous les éléments.",
          "Tuez chaque Blop Royal de couleur pour retirer 100% de résistance dans l'élément correspondant.",
          "Une équipe multi-élément exploite les 30% de faiblesse de chaque variante.",
        ],
        danger: "high",
      },
      {
        title: "Blopoutrage Royal",
        hp: "50% — 0%",
        mechanics: [
          "Blopoutrage Royal inflige ~320 dégâts dans tous les éléments en vol de vie.",
          "Tous les 3 tours : poison + état insoignable sur tous les persos, et +300 dégâts aux Blops pendant 2 tours.",
          "Maintenez 6+ de portée pour éviter les attaques des Blops Royaux.",
        ],
        danger: "extreme",
      },
    ],
    tips: [
      "Équipez une pierre d'âme de niveau 150+ minimum.",
      "Coordonnez les éléments pour abattre les variantes une à une.",
    ],
    rewards: ["Set du Blop Royal", "Ressources de l'Antre", "Familier Blop"],
    achievements: [
      { name: "Hardi", strategy: "Finir son tour sur une case adjacente à un ennemi." },
      { name: "Duel", strategy: "Un seul allié doit attaquer chaque ennemi durant tout le combat." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Touche pas à mes blops", strategy: "Toutes les attaques doivent être concentrées sur le Blop Multicolore Royal jusqu'à ce qu'il meure." },
    ],
  },

  // Tofulailler Royal — Tofu Royal
  50: {
    summary:
      "Le Tofu Royal est ultra-mobile (30 PM) et applique une perte de Vitalité à chaque coup. Tout le donjon consiste à le bloquer pour l'empêcher de fuir.",
    recommendedLevel: "120 — 150",
    composition: "Solo ou groupe. Difficulté modérée à élevée à cause de sa mobilité.",
    keyResist: ["Terre", "Agilité"],
    phases: [
      {
        title: "Pression et mobilité",
        hp: "100% — 50%",
        mechanics: [
          "Ses attaques appliquent -60 Vitalité, qui s'accumule.",
          "Il dispose de 30 PM : il fuit en permanence le corps-à-corps.",
          "Au corps-à-corps il tape Terre ; à distance (~3 PO en zone) il tape Agilité.",
        ],
        danger: "medium",
      },
      {
        title: "Encerclement",
        hp: "50% — 0%",
        mechanics: [
          "Ses attaques de zone appliquent Pesanteur et repoussent.",
          "Bloquez-le en l'entourant de personnages ou d'invocations pour l'empêcher de s'échapper.",
          "Une fois immobilisé, focus jusqu'à la mort.",
        ],
        danger: "medium",
      },
    ],
    tips: [
      "Pierre d'âme niveau 150+ pour la capture (utile pour la quête du Dofus Ocre).",
      "Sans blocage, le combat s'éternise : priorité au contrôle.",
    ],
    rewards: ["Set du Tofu Royal", "Plume du Tofu Royal", "Familier"],
    achievements: [
      { name: "Chevaliers tourmentés", strategy: "Combattre à 4 persos min. avec au moins un Flamme, Goutte, Nuage, Feuille ou Ténèbre." },
      { name: "Dernier", strategy: "Tofu Royal doit être achevé en dernier." },
      { name: "Statue", strategy: "Finir chaque tour sur la case où on l'a commencé, tout le combat." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Poursuite royale", strategy: "Chaque combattant ennemi doit jouer au moins un tour de jeu sans utiliser de PM avant d'être achevé." },
    ],
  },

  // Serre du Royalmouth — Royalmouth
  54: {
    summary:
      "Le Royalmouth est invulnérable en permanence : il faut le pousser pour briser l'invulnérabilité 1 tour. Mais pousser un ennemi dans sa ligne tue instantanément — placement chirurgical.",
    recommendedLevel: "120 — 150",
    composition: "Groupe coordonné avec un pousseur dédié. Difficulté modérée à élevée.",
    keyResist: ["Feu"],
    phases: [
      {
        title: "Briser l'invulnérabilité",
        hp: "100% — 50%",
        mechanics: [
          "Invulnérabilité infinie brisée 1 tour en poussant le boss.",
          "Pousser le boss lui donne +4 PM pour 1 tour (cumulable).",
          "Pousser un autre ennemi contre le boss tue les personnages alignés avec lui.",
        ],
        danger: "high",
      },
      {
        title: "Invocations & attraction",
        hp: "50% — 0%",
        mechanics: [
          "Aléamouth invoque des monstres aléatoires du donjon.",
          "Regroupmouth attire les ennemis et retire 1 PM.",
          "Désignez un seul pousseur, les autres tapent sans le déplacer.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Un joueur pousse, les autres attaquent pendant la fenêtre de vulnérabilité.",
      "Lichemouth tape Feu : taper Feu reste pertinent.",
    ],
    rewards: ["Set du Royalmouth", "Ressources de la Serre", "Familier"],
    achievements: [
      { name: "Mains propres", strategy: "Achever les ennemis sans leur infliger de dégâts directs." },
      { name: "Premier", strategy: "Royalmouth doit être achevé en premier." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Parcimonie royale", strategy: "Durant son tour de jeu, si un allié déplace un ennemi, il ne doit plus occasionner de dommages à cet ennemi pendant le reste de son tour." },
    ],
  },

  // Volière de la Haute Truche — Haute Truche
  80: {
    summary:
      "La Haute Truche devient invulnérable 2 tours si on la frappe au corps-à-corps. Donjon de placement à distance, sur plusieurs salles avant l'arène finale.",
    recommendedLevel: "130 — 160",
    composition: "Équipe à distance privilégiée. Difficulté modérée à élevée.",
    keyResist: ["Variable"],
    phases: [
      {
        title: "Éviter le corps-à-corps",
        hp: "100% — 50%",
        mechanics: [
          "Frapper le boss au corps-à-corps le rend invulnérable 2 tours.",
          "Privilégiez les dégâts à distance pour ne jamais déclencher l'invulnérabilité.",
          "Le donjon comporte 4 salles préparatoires avant l'arène du boss.",
        ],
        danger: "medium",
      },
      {
        title: "Contrôle & déplacement",
        hp: "50% — 0%",
        mechanics: [
          "Le succès spécial demande de déplacer les ennemis avant de leur infliger des dégâts.",
          "Misez sur le contrôle et le positionnement plutôt que le burst brut.",
          "Pierre d'âme niveau 150+ minimum pour la capture.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Aucun DD au corps-à-corps : le risque d'invulnérabilité est trop grand.",
      "Gérez les positions sur l'ensemble des salles.",
    ],
    rewards: ["Set de la Haute Truche", "Plume de Truche", "Familier"],
    achievements: [
      { name: "Premier", strategy: "Haute Truche doit être achevé en premier." },
      { name: "Barbare", strategy: "Les personnages alliés doivent achever les ennemis avec une arme." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Truchement", strategy: "Les ennemis doivent être déplacés avant de subir des dommages. Un ennemi déplacé est considéré comme tel jusqu'au début de son prochain tour." },
    ],
  },

  // Ring du Capitaine Ekarlatte — Capitaine Ekarlatte
  81: {
    summary:
      "Donjon « dimension » à arène unique avec 5 vagues de renforts. Le Capitaine Ekarlatte multiplie les déplacements (attraction, échanges, téléportation) qui perturbent le placement.",
    recommendedLevel: "130 — 160",
    composition: "Donjon modulable (adds selon la taille du groupe). Difficulté modérée à élevée.",
    keyResist: ["Variable"],
    phases: [
      {
        title: "Vagues de renforts",
        hp: "100% — 50%",
        mechanics: [
          "5 vagues arrivent selon le nombre de tours ou l'élimination des ennemis.",
          "Les vagues se superposent si elles sont tuées trop lentement.",
          "Les Tromblions alliés vous poussent de 2 cases : prévoyez du PM.",
        ],
        danger: "medium",
      },
      {
        title: "Déplacements du boss",
        hp: "50% — 0%",
        mechanics: [
          "Le boss enchaîne attraction, échanges de place et téléportation.",
          "Priorisez le boss tôt pour limiter ses perturbations.",
          "Succès « Sortie de ring » : tous les alliés finissent sur leur case de départ.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tuez les vagues vite pour éviter le surnombre.",
      "Gardez du PM pour compenser les poussées des Tromblions.",
    ],
    rewards: ["Set du Capitaine Ekarlatte", "Ressources du Ring", "Familier"],
    achievements: [
      { name: "Bandits du Magik Riktus", strategy: "Combattre à 4 persos min. avec au moins un Riktus fine-lame, Riktus archer, Riktus baroudeur ou Riktus ensorceleuse." },
      { name: "Focus", strategy: "Lorsqu'un ennemi est attaqué par un allié, il doit être achevé avant qu'un autre ennemi ne soit attaqué." },
      { name: "Statue", strategy: "Finir chaque tour sur la case où on l'a commencé, tout le combat." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 30 tours." },
    ],
  },

  // Caverne d'El Piko — El Piko
  101: {
    summary:
      "El Piko impose à tous des États Tactiques tournants (A, B, C, D) qui changent ses faiblesses et vos bonus à chaque tour. Combat à distance où il ne faut pas finir collé à un allié.",
    recommendedLevel: "130 — 160",
    composition: "2+ joueurs, jeu à distance. Difficulté modérée.",
    keyResist: ["Variable", "Selon l'État Tactique (Air, Eau, Terre, Feu)"],
    phases: [
      {
        title: "États Tactiques",
        hp: "100% — 50%",
        mechanics: [
          "L'effet Guerillero donne à tous un État Tactique aléatoire chaque tour (résistances, esquive, puissance ou précision).",
          "Les effets des sorts changent selon l'État Tactique courant.",
          "Tapez l'élément correspondant à l'état actif.",
        ],
        danger: "medium",
      },
      {
        title: "Adjacence & adds",
        hp: "50% — 0%",
        mechanics: [
          "Finir son tour adjacent à un coéquipier déclenche des dégâts (tir ami).",
          "Tuez les Lévito en premier pour réduire la pression d'états.",
          "Jouez à distance pour éviter les capacités de corps-à-corps.",
        ],
        danger: "medium",
      },
    ],
    tips: [
      "Ne finissez jamais votre tour collé à un allié.",
      "Adaptez votre élément à l'État Tactique du tour.",
    ],
    rewards: ["Set d'El Piko", "Ressources de la Caverne", "Familier"],
    achievements: [
      { name: "Blitzkrieg", strategy: "Achever chaque ennemi attaqué avant le début de son tour." },
      { name: "Duel", strategy: "Un seul allié doit attaquer chaque ennemi durant tout le combat." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Guerilla", strategy: "Les alliés ne doivent pas infliger de dommages à un autre allié par le biais du sort Guerillero." },
    ],
  },

  // Croquanterie — Croqueleur
  112: {
    summary:
      "Le Croqueleur démarre invulnérable : il faut déclencher 4 pépites en le tapant dans le bon élément puis en le poussant. Combat de tempo, plutôt orienté corps-à-corps.",
    recommendedLevel: "130 — 160",
    composition: "Équipes corps-à-corps recommandées (pépites résistantes à distance). 4-8 joueurs.",
    keyResist: ["Feu", "Air", "Eau", "Terre/Neutre (selon la phase)"],
    phases: [
      {
        title: "Les pépites",
        hp: "100% — 50%",
        mechanics: [
          "Tapez le boss dans l'élément requis puis poussez-le pour déclencher une pépite.",
          "Chaque pépite tuée retire un de ses 4 états et inflige 25% de dégâts au boss.",
          "PV croissants (25%, 35%, 45%, 55%) et résistance distance qui monte à chaque phase.",
        ],
        danger: "high",
      },
      {
        title: "Tempo des pépites",
        hp: "50% — 0%",
        mechanics: [
          "La 1re pépite doit mourir en 1 tour, les autres en 2 tours max.",
          "Le perso qui joue juste après le boss déclenche les pépites (temps max d'élimination).",
          "Privilégiez le corps-à-corps (la dernière pépite n'a que 10% de résistance distance).",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tuez d'abord tous les sbires, puis focus le boss.",
      "Ordre des éléments : Feu → Air → Eau → Terre/Neutre.",
    ],
    rewards: ["Set de la Croquanterie", "Ressources", "Familier"],
    achievements: [
      { name: "Chrono", strategy: "Vaincre tous les monstres en moins de 9 tours." },
      { name: "Circulez !", strategy: "Ne tenter aucun retrait de PM sur les ennemis durant tout le combat." },
      { name: "Blitzkrieg", strategy: "Achever chaque ennemi attaqué avant le début de son tour." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "J'accours, les croquants !", strategy: "Les combattants ennemis ne doivent subir aucune tentative de dommages à distance." },
    ],
  },

  // Vallée de la Dame des eaux — Nagate
  123: {
    summary:
      "Nagate reste invulnérable sur une île lointaine : impossible de la toucher sans le puzzle de la Bombombre à Eau qui vous téléporte jusqu'à elle. Le défi est l'exécution, pas le burst.",
    recommendedLevel: "130 — 160",
    composition: "Groupe maîtrisant la mécanique de téléportation. Difficulté élevée.",
    keyResist: ["Eau"],
    phases: [
      {
        title: "Atteindre l'île",
        hp: "100% — 60%",
        mechanics: [
          "Nagate est intouchable tant qu'on n'a pas rejoint son île.",
          "Attendez qu'un monstre invoque une Bombombre à Eau (pas une normale).",
          "Placez la Bombombre à Eau au bord de la map et endommagez-la sans la détruire pour déclencher la téléportation.",
        ],
        danger: "high",
      },
      {
        title: "Sur l'île",
        hp: "60% — 0%",
        mechanics: [
          "Si votre perso n'est pas adjacent à Nagate en début de son tour, elle vous renvoie.",
          "Elle soigne tous les monstres de ~800 PV par tour.",
          "Retraite de la dame applique Pesanteur à tous les ennemis.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Contrôlez un Kwapa avec Révérence pour garantir les Bombombres à Eau (100%).",
      "Le combat est un puzzle de placement avant tout.",
    ],
    rewards: ["Set de la Dame des eaux", "Ressources de la Vallée", "Familier"],
    achievements: [
      { name: "Les crados", strategy: "Combattre à 4 persos min. avec au moins un Grüt, Gobeuf, Turyé ou Piggy Paupe." },
      { name: "Nomade", strategy: "Utiliser tous ses PM à chaque tour, tout le combat." },
      { name: "Prudent", strategy: "Ne jamais finir son tour sur une case adjacente à un ennemi." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Le jeu de la Dame", strategy: "Les Bombombres ne doivent subir aucun dommage." },
    ],
  },

  // Atelier du Tanukouï San — Tanukouï San
  126: {
    summary:
      "Tanukouï San devient invulnérable sur ses glyphes, qui évoluent à chaque phase. Combat de placement où l'on déplace boss et sbires hors des glyphes, avant ses paliers de soin.",
    recommendedLevel: "130 — 160",
    composition: "5 types de sbires aux glyphes distincts ; coordination requise. Difficulté modérée à élevée.",
    keyResist: ["Terre"],
    phases: [
      {
        title: "Glyphes évolutifs",
        hp: "100% — 50%",
        mechanics: [
          "Le boss est invulnérable tant qu'il est sur un glyphe.",
          "Les formes de glyphes changent : carré 7x7 (Phase I), damier rayon 6 (Phase II), étoile infinie (Phase III).",
          "Déplacez-le hors des glyphes : le tir attire de 2 cases, le corps-à-corps repousse de 2 cases.",
        ],
        danger: "high",
      },
      {
        title: "Paliers de soin (X.5)",
        hp: "50% — 0%",
        mechanics: [
          "Les phases « X.5 » déclenchent un auto-soin (~20% PV max) s'il n'est pas tué avant son prochain tour.",
          "Calez vos dégâts pour franchir les seuils de phase avant les soins.",
          "Gérez aussi le placement des sbires hors de leurs glyphes.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Terre, son élément principal.",
      "Anticipez les changements de glyphes à chaque phase.",
    ],
    rewards: ["Set du Tanukouï San", "Ressources de l'Atelier", "Familier"],
    achievements: [
      { name: "Compagnons, quel est votre métier ?", strategy: "Combattre à 4 persos min. avec un Kloug, Klûme, Grizou ou Laikteur." },
      { name: "Statue", strategy: "Finir chaque tour sur la case où on l'a commencé, tout le combat." },
      { name: "Versatile", strategy: "N'utiliser chaque action qu'une seule fois par tour." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Se faire des kouïs en or", strategy: "Un ennemi ne doit pas être déplacé plus d'une fois entre chacun de ses tours." },
    ],
  },

  // Clairière du Chêne Mou — Chêne Mou
  10: {
    summary:
      "Le Chêne Mou attire puis repousse au gros dégât Eau, et retire les PM pour empêcher le corps-à-corps. Ses branches sont invulnérables tant qu'il vit.",
    recommendedLevel: "140 — 170",
    composition: "Groupe avec retrait PM. Difficulté modérée si le placement est géré.",
    keyResist: ["Eau", "Air"],
    phases: [
      {
        title: "Attraction & retrait PM",
        hp: "100% — 50%",
        mechanics: [
          "Il attire en ligne, inflige de gros dégâts Eau, puis repousse.",
          "Il retire des PM pour empêcher le corps-à-corps.",
          "Retirez-lui ses PM pour neutraliser ses attractions.",
        ],
        danger: "medium",
      },
      {
        title: "Branches & buffs",
        hp: "50% — 0%",
        mechanics: [
          "Il se buffe fortement en Portée, CC et dégâts.",
          "Les branches qui l'accompagnent sont invulnérables jusqu'à sa mort.",
          "En expédition de guilde, tuez les sbires d'abord, puis focus le boss.",
        ],
        danger: "medium",
      },
    ],
    tips: [
      "Tapez Eau/Air (ses plus faibles résistances).",
      "Éloignez les persos à faibles PV en début de combat.",
    ],
    rewards: ["Set du Chêne Mou", "Ressources de la Clairière", "Familier"],
    achievements: [
      { name: "Liberté", strategy: "Ne pas tenter de retirer de PM ou de PO aux adversaires pendant toute la durée du combat." },
      { name: "Premier", strategy: "Chêne Mou doit être achevé en premier." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Enchaînemou", strategy: "Les alliés (hors invocations statiques) doivent terminer leur tour en ligne d'un ennemi." },
    ],
  },

  // Excavation du Mansot Royal — Mansot Royal
  55: {
    summary:
      "Le Mansot Royal est invulnérable sauf si un allié est soigné au corps-à-corps. Ses dégâts montent quand sa vie baisse et il gagne des bonus permanents à chaque mort d'allié.",
    recommendedLevel: "140 — 170",
    composition: "Équipe avec soigneur, positionnement coordonné. Recommandé aux équipes rodées.",
    keyResist: ["Feu"],
    phases: [
      {
        title: "Briser l'invulnérabilité",
        hp: "100% — 50%",
        mechanics: [
          "Invulnérable : il faut soigner un allié au corps-à-corps du boss pour le rendre vulnérable 6 tours.",
          "La cible soignée doit survivre, sinon le boss redevient invulnérable.",
          "Placez un soigneur pour déclencher la fenêtre de vulnérabilité.",
        ],
        danger: "high",
      },
      {
        title: "Scaling & bonus",
        hp: "50% — 0%",
        mechanics: [
          "Ses dégâts augmentent à mesure que sa vie baisse.",
          "Chaque allié tué lui donne +1000 PV, +50 dégâts, +1 PM (permanents).",
          "Évitez de laisser mourir vos persos, ou burstez le boss avant le scaling.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Feu, son élément principal.",
      "Le soigneur de la fenêtre de vulnérabilité est la pièce maîtresse.",
    ],
    rewards: ["Set du Mansot Royal", "Ressources de l'Excavation", "Familier"],
    achievements: [
      { name: "Mini Nuits'", strategy: "Combattre à 4 persos min. avec au moins un Inferno, Styx, Mandrin ou Will Killson." },
      { name: "Dernier", strategy: "Mansot Royal doit être achevé en dernier." },
      { name: "Collant", strategy: "Finir son tour sur une case adjacente à un autre allié." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Privilège royal", strategy: "Chaque début de tour, le Mansot Royal désigne un combattant allié. Seul le combattant désigné peut recevoir des soins." },
    ],
  },

  // Dojo du Vent — Hanshi & Shihan
  122: {
    summary:
      "Double boss à barre de vie partagée : Hanshi réduit les dégâts au corps-à-corps, Shihan les dégâts à distance. Il faut composer avec ces deux réductions simultanées.",
    recommendedLevel: "140 — 170",
    composition: "Équipe de 4 recommandée, esquive utile. Difficulté modérée à élevée.",
    keyResist: ["Feu", "Mixte"],
    phases: [
      {
        title: "Réductions de dégâts",
        hp: "100% — 50%",
        mechanics: [
          "Barre de vie partagée entre les deux boss.",
          "Hanshi réduit de 50% les dégâts au corps-à-corps ; Shihan réduit de 50% les dégâts à distance.",
          "Les deux gagnent des boosts de PM à des seuils de vie.",
        ],
        danger: "high",
      },
      {
        title: "Jufang & contrôle",
        hp: "50% — 0%",
        mechanics: [
          "Jufang bloque les joueurs au corps-à-corps avec Pesanteur/immobilisation.",
          "Montez 60-70+ esquive pour échapper au tacle de Jufang.",
          "Nettoyez les adds avant d'engager les boss.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Pour le succès « Dernier », rushez Shihan au corps-à-corps.",
      "Adaptez vos sorts à la réduction active (CC vs distance).",
    ],
    rewards: ["Set du Dojo du Vent", "Ressources", "Familier"],
    achievements: [
      { name: "Les pandaliens", strategy: "Combattre à 4 persos min. avec au moins un Mirh, Rekto Topi, Traçon ou Logram." },
      { name: "Prudent", strategy: "Ne jamais finir son tour sur une case adjacente à un ennemi." },
      { name: "Dernier", strategy: "Hanshi doit être achevé en dernier." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Vents contraires", strategy: "Les ennemis qui maitrisent le souffle du Wukin ne doivent subir que des dommages en mêlée et les ennemis qui maitrisent le souffle du Wukang ne doivent subir que des dommages à distance." },
    ],
  },

  // Fabrique de foux d'artifice — Founoroshi
  124: {
    summary:
      "Founoroshi est invulnérable tant que les 8 feux de la map ne sont pas éteints, via un système de glyphes. Donjon de mobilité et de placement exigeant.",
    recommendedLevel: "140 — 170",
    composition: "Classes mobiles (Pandawa, Iop, Xélor, Éliotrope), 6 PM conseillés. Difficulté modérée à élevée.",
    keyResist: ["Feu", "Mixte (quand vulnérable)"],
    phases: [
      {
        title: "Éteindre les feux",
        hp: "100% — 60%",
        mechanics: [
          "Le boss et les monstres sont invulnérables tant que les 8 feux brûlent.",
          "Passez sur les glyphes noirs pour gagner l'état « Extinction de feu », puis sur les glyphes marron à côté des feux pour les éteindre.",
          "Le boss pose 1-4 glyphes noirs par tour ; les feux réapparaissent au bout de 8 tours s'il est encore invulnérable.",
        ],
        danger: "high",
      },
      {
        title: "Phase vulnérable",
        hp: "60% — 0%",
        mechanics: [
          "Évitez le corps-à-corps en début de tour sous peine d'OS.",
          "Une fois les feux éteints, tuez Founoroshi en premier (les feux disparaissent à sa mort).",
          "Le Dofus Abyssal et un stuff 6 PM facilitent la mobilité.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "La gestion des glyphes prime sur le DPS.",
      "Gardez de la mobilité pour enchaîner les extinctions.",
    ],
    rewards: ["Set de Founoroshi", "Ressources de la Fabrique", "Familier"],
    achievements: [
      { name: "Prudent", strategy: "Ne jamais finir son tour sur une case adjacente à un ennemi." },
      { name: "Collant", strategy: "Finir son tour sur une case adjacente à un autre allié." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Raviver la flamme", strategy: "Aucun feu ne doit se rallumer, une fois éteint." },
    ],
  },

  // Repaire de Sphincter Cell — Sphincter Cell
  44: {
    summary:
      "Sphincter Cell a 200% de résistances partout : il faut le rendre vulnérable via les tortues colorées invoquées. Les Rat Noir/Rat Blanc compliquent le combat.",
    recommendedLevel: "150 — 180",
    composition: "Pierre d'âme 150+. Gestion des statuts et placement requis. Difficulté modérée à élevée.",
    keyResist: ["Variable", "Après application de la faiblesse"],
    phases: [
      {
        title: "Les sbires Rat",
        hp: "100% — 60%",
        mechanics: [
          "Le Rat Noir applique des poisons létaux ; le Rat Blanc gagne 50% de résistance selon l'élément reçu.",
          "Éliminez Rat Noir et Rat Blanc en premier pour simplifier.",
          "Le boss se téléporte et invoque des tortues pendant le combat.",
        ],
        danger: "medium",
      },
      {
        title: "Vulnérabilité par tortues",
        hp: "60% — 0%",
        mechanics: [
          "Le boss a 200% de résistance dans tous les éléments.",
          "Chaque tortue placée adjacente au boss applique -200% de résistance dans son élément pendant 2 tours.",
          "Immobilisez le boss (corruption/Pesanteur) avant l'expiration de la faiblesse.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Placez un perso adjacent à la tortue pour qu'elle applique la faiblesse au boss.",
      "Synchronisez vos dégâts avec la fenêtre de 2 tours.",
    ],
    rewards: ["Set de Sphincter Cell", "Ressources du Repaire", "Familier"],
    achievements: [
      { name: "Hardi", strategy: "Finir son tour sur une case adjacente à un ennemi." },
      { name: "Dernier", strategy: "Sphincter Cell doit être achevé en dernier." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Pizwa quatre couleurs", strategy: "Aucun allié ne doit subir les effets du sort Kawabunga." },
    ],
  },

  // Épave du Grolandais violent — Ben le Ripate
  56: {
    summary:
      "Ben le Ripate est invulnérable en permanence : seul un Hamrack invoqué, atteignant son corps-à-corps, lève l'invulnérabilité 5 tours. Combat-puzzle de placement.",
    recommendedLevel: "150 — 180",
    composition: "Groupe maîtrisant la mécanique du Hamrack. Difficulté modérée.",
    keyResist: ["Feu"],
    phases: [
      {
        title: "Le Hamrack",
        hp: "100% — 50%",
        mechanics: [
          "Le boss démarre avec invulnérabilité infinie et Pesanteur.",
          "Il invoque un Hamrack (2 PM) tous les 2 tours qui doit atteindre son corps-à-corps pour lever l'invulnérabilité 5 tours.",
          "L'explosion du Hamrack inflige 350 dégâts Eau aux alliés proches.",
        ],
        danger: "medium",
      },
      {
        title: "Acheminer le Hamrack",
        hp: "50% — 0%",
        mechanics: [
          "Boostez les PM du Hamrack (ou réduisez-les pour déclencher son auto-boost +3 PM) pour qu'il rejoigne le boss.",
          "Bloquez le déplacement du boss pour le garder près du Hamrack (il joue avant lui).",
          "Le boss invoque des monstres aléatoires tous les 3 tours.",
        ],
        danger: "medium",
      },
    ],
    tips: [
      "Éloignez les alliés du Hamrack pour éviter l'explosion.",
      "Tapez Feu, son élément principal.",
    ],
    rewards: ["Set du Grolandais", "Ressources de l'Épave", "Familier"],
    achievements: [
      { name: "Revenus d'outre-tombe", strategy: "Combattre à 4 persos min. avec un Kockis, Kubitus, Kalkanéus, Hectaupe ou Hichète." },
      { name: "Circulez !", strategy: "Ne tenter aucun retrait de PM sur les ennemis durant tout le combat." },
      { name: "Statue", strategy: "Finir chaque tour sur la case où on l'a commencé, tout le combat." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Hamrack'n roll", strategy: "Les alliés ne doivent pas subir de dommages provenant d'un Hamrack." },
    ],
  },

  // Galerie du Phossile — Phossile
  79: {
    summary:
      "Le Phossile OS tout ce qui est à moins de 3 cases tous les 4 tours (T5/T9/T13) et soigne les ennemis trop éloignés. Donjon de contrainte de placement plus que de DPS.",
    recommendedLevel: "150 — 180",
    composition: "Composition standard de 4 joueurs. Difficulté modérée avec un bon placement.",
    keyResist: ["Eau"],
    phases: [
      {
        title: "Abîme & Centrage",
        hp: "100% — 50%",
        mechanics: [
          "Abîme : tous les 4 tours (T5/T9/T13), élimine tous les joueurs à moins de 3 cases.",
          "Centrage : soigne les ennemis éloignés (8+ cases) et leur retire des PM.",
          "Restez dans une fourchette entre 3 et 8 cases du boss.",
        ],
        danger: "high",
      },
      {
        title: "Glyphiphi",
        hp: "50% — 0%",
        mechanics: [
          "Glyphiphi crée des glyphes dégâts à chaque poussée/attraction et augmente les dégâts subis de 30%.",
          "Évitez les déplacements inutiles d'ennemis.",
          "Tuez le boss avant le T5 pour éviter le premier Abîme, ou écartez-vous à plus de 3 cases.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Eau, son élément principal.",
      "Gérez le placement sur les 5 vagues d'ennemis.",
    ],
    rewards: ["Set du Phossile", "Ressources de la Galerie", "Familier"],
    achievements: [
      { name: "Hardi", strategy: "Finir son tour sur une case adjacente à un ennemi." },
      { name: "Liberté", strategy: "Ne pas tenter de retirer de PM ou de PO aux adversaires pendant toute la durée du combat." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 30 tours." },
      { name: "Diagonale du vide", strategy: "Les alliés (hors invocations statiques) ne doivent pas terminer leur tour en étant placés en diagonale d'un ennemi ou d'un allié." },
    ],
  },

  // Tertre du long sommeil — Hell Mina
  139: {
    summary:
      "Hell Mina impose à chaque tour un état « Rage » élémentaire : il faut la frapper dans l'élément assigné pour faire monter son compteur de vulnérabilité (6 coups). Vulnérable, elle devient redoutable.",
    recommendedLevel: "150 — 180",
    composition: "Composition standard de 4 joueurs multi-éléments. Difficulté modérée.",
    keyResist: ["Eau", "Air"],
    phases: [
      {
        title: "Compteur de vulnérabilité",
        hp: "100% — 50%",
        mechanics: [
          "Elle donne un état « Rage » élémentaire aléatoire à chaque tour ; tapez dans l'élément assigné pour incrémenter son compteur.",
          "Il faut 6 coups élémentaires au total pour retirer son état Invulnérable.",
          "Ne pas utiliser l'élément assigné inflige 500 dégâts dans cet élément.",
        ],
        danger: "medium",
      },
      {
        title: "Hell Mina vulnérable",
        hp: "50% — 0%",
        mechanics: [
          "Une fois vulnérable, elle gagne 3 PM, +40% dégâts et 50% de coups critiques.",
          "Tuez tous les sbires d'abord, tout en montant le compteur.",
          "Déclenchez la vulnérabilité finale seulement quand le terrain est nettoyé.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Elle a 31% de résistance Feu : privilégiez Eau et Air.",
      "Tankable tant qu'invulnérable : prenez votre temps.",
    ],
    rewards: ["Set de Hell Mina", "Ressources du Tertre", "Familier"],
    achievements: [
      { name: "Les héros", strategy: "Combattre à 4 persos min. avec au moins un Krosmoglob, Korbax, Masse ou Chevalier d'Astrub." },
      { name: "Dernier", strategy: "Hell Mina doit être achevé en dernier." },
      { name: "Statue", strategy: "Finir chaque tour sur la case où on l'a commencé, tout le combat." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Hellémentaire", strategy: "Les alliés doivent obligatoirement occasionner des dommages à Hell Mina correspondant à l'état élémentaire qu'elle attribue à chaque tour." },
    ],
  },

  // Canopée du Kimbo — Kimbo
  28: {
    summary:
      "Kimbo a 400% de résistances partout, levées uniquement s'il commence son tour sur un glyphe. Donjon de placement millimétré : commencer son propre tour sur un glyphe = mort instantanée.",
    recommendedLevel: "160 — 190",
    composition: "Équipe de 4 mobile et de contrôle. Difficulté de placement élevée.",
    keyResist: ["Eau/Terre OU Air/Feu (au choix)"],
    phases: [
      {
        title: "Comprendre les glyphes",
        hp: "100% — 60%",
        mechanics: [
          "Taper Eau/Terre déclenche « Glyphe Impair » (distances impaires) ; Air/Feu déclenche « Glyphe Pair ».",
          "Le Disciple pose les glyphes après que vous touchez Kimbo : placez-vous à la distance opposée.",
          "Commencer SON tour sur un glyphe tue instantanément.",
        ],
        danger: "high",
      },
      {
        title: "Fenêtre de vulnérabilité",
        hp: "60% — 0%",
        mechanics: [
          "Quand Kimbo commence son tour sur un glyphe, il perd ses 400% de résistance dans vos éléments, 1 tour.",
          "Repoussez le Disciple d'un nombre impair de cases pour réinitialiser les glyphes.",
          "Le Bitouf peut vous pousser sur un glyphe : tuez les autres ennemis d'abord si vous débutez.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Choisissez un couple d'éléments (Eau/Terre ou Air/Feu) et tenez-vous-y.",
      "Une simple erreur de placement est fatale : anticipez le tour du Disciple.",
    ],
    rewards: ["Set du Kimbo", "Ressources de la Canopée", "Familier"],
    achievements: [
      { name: "Statue", strategy: "Finir chaque tour sur la case où on l'a commencé, tout le combat." },
      { name: "Premier", strategy: "Kimbo doit être achevé en premier." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 8 tours." },
      { name: "Une paire d'impairs", strategy: "Chaque combattant ennemi doit être sous les effets d'un des glyphes du Disciple du Kimbo avant de recevoir des dégâts." },
    ],
  },

  // Salle du Minotot — Minotot
  53: {
    summary:
      "Le Minotot transforme en tofu, vole les PA et se soigne massivement à 15 PA. La course contre la montre (tuer avant le tour 4) et la gestion de ses PA sont clés.",
    recommendedLevel: "160 — 190",
    composition: "Persos Chance/Agilité pour la couverture élémentaire. Difficulté modérée.",
    keyResist: ["Eau", "Air"],
    phases: [
      {
        title: "Destinos & Mythos",
        hp: "100% — 50%",
        mechanics: [
          "Destinos (tous les 3 tours dès T1) transforme en tofu, retire 100 PA pour 3 tours, applique 400 poison Feu/tour et repousse de 5 cases.",
          "Mythos inflige des dégâts en ligne (4 PO) et vole 2 PA (2 fois/tour).",
          "Tuez le boss avant le tour 4 pour éviter Destinos.",
        ],
        danger: "high",
      },
      {
        title: "Kitos (soins)",
        hp: "50% — 0%",
        mechanics: [
          "À 15 PA, Kitos soigne le boss et ses alliés de 2000 PV/tour pendant 3 tours.",
          "Dissipez le buff Motivatos quand le boss atteint 13-14 PA pour bloquer les soins.",
          "Les tofus invoqués sont invulnérables, infligent 200 dégâts et repoussent.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Eau/Air, ses faiblesses.",
      "Restez à distance pour éviter le vol de PA de Mythos.",
    ],
    rewards: ["Set du Minotot", "Corne de Minotot", "Familier"],
    achievements: [
      { name: "Circulez !", strategy: "Ne tenter aucun retrait de PM sur les ennemis durant tout le combat." },
      { name: "Premier", strategy: "Minotot doit être achevé en premier." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Tofu-phobie", strategy: "Aucun combattant allié ne doit subir l'effet du sort Destinos." },
    ],
  },

  // Hypogée de l'Obsidiantre — Obsidiantre
  57: {
    summary:
      "L'Obsidiantre est invulnérable sauf si on pousse un allié contre lui. Ses dégâts montent quand sa vie baisse et ses Pougnettes OS les persos trop éloignés. Pierre d'âme 190+ pour la capture.",
    recommendedLevel: "160 — 190",
    composition: "Joueurs expérimentés, coordination requise. Difficulté élevée.",
    keyResist: ["Feu"],
    phases: [
      {
        title: "Briser l'invulnérabilité",
        hp: "100% — 50%",
        mechanics: [
          "Poussez un personnage allié contre le boss pour lever l'invulnérabilité 3 tours.",
          "Il se soigne de 2000 PV quand des ennemis sont poussés sur ses cases adjacentes.",
          "Utilisez un Pandawa pour déclencher la vulnérabilité sans activer le soin.",
        ],
        danger: "high",
      },
      {
        title: "Pougnettes & scaling",
        hp: "50% — 0%",
        mechanics: [
          "Il invoque une Pougnette tous les 3 tours qui explose au tour 5 et OS les persos à plus de 7 cases.",
          "Ses dégâts augmentent à mesure que sa vie baisse.",
          "Restez à moins de 7 cases de la Pougnette à son tour 5, ou détruisez-la (elle renvoie 150 dégâts par coup).",
        ],
        danger: "extreme",
      },
    ],
    tips: [
      "Tapez Feu, son élément principal.",
      "Succès : évitez toute attraction/poussée.",
    ],
    rewards: ["Set de l'Obsidiantre", "Ressources de l'Hypogée", "Familier"],
    achievements: [
      { name: "Premier", strategy: "Obsidiantre doit être achevé en premier." },
      { name: "Statue", strategy: "Finir chaque tour sur la case où on l'a commencé, tout le combat." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "À son hypogée", strategy: "Les ennemis ne doivent être ni attirés, ni poussés." },
    ],
  },

  // Grotte de Kanigroula — Kanigroula
  75: {
    summary:
      "Kanigroula fuit et accumule des effets de statut en cascade : ses phéromones boostent les ennemis, et sa mort renforce ses alliés survivants. L'ordre d'élimination des sbires est crucial.",
    recommendedLevel: "160 — 190",
    composition: "DD à distance. Difficulté modérée à élevée (statuts en cascade).",
    keyResist: ["Eau"],
    phases: [
      {
        title: "Les sbires d'abord",
        hp: "100% — 50%",
        mechanics: [
          "Phéromones Sauvages donne aux ennemis +10% crit et +100 puissance par tour autour des joueurs actifs.",
          "Mort Méphitique débuffe votre équipe (-10% résistance, -50 puissance) à chaque mort de monstre.",
          "Ordre : Kaniblou > Orfélin > Kanihilan, puis le boss.",
        ],
        danger: "medium",
      },
      {
        title: "Renforcement à la mort",
        hp: "50% — 0%",
        mechanics: [
          "À sa mort, Kanigroula booste tous les alliés vivants : +2 PM, +200 puissance, +10% résistances.",
          "Gardez l'Orfélin à distance (capacité de réduction de dégâts au corps-à-corps).",
          "Tuez Kanigroula en dernier, terrain nettoyé.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Eau, son élément principal.",
      "Sa mort renforce les survivants : ne la tuez pas trop tôt.",
    ],
    rewards: ["Set de Kanigroula", "Ressources de la Grotte", "Familier"],
    achievements: [
      { name: "Premier", strategy: "Kanigroula doit être achevé en premier." },
      { name: "Hardi", strategy: "Finir son tour sur une case adjacente à un ennemi." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Crocs à crocs", strategy: "Les combattants ennemis ne doivent subir aucune tentative de dommages à distance." },
      { name: "Bandits du Magik Riktus", strategy: "Combattre à 4 persos min. avec au moins un Riktus fine-lame, Riktus archer, Riktus baroudeur ou Riktus ensorceleuse." },
    ],
  },

  // Plateau de Ush — Ush Galesh
  94: {
    summary:
      "Deux Ush Galesh partagent leur barre de vie et alternent des états Rouge (corps-à-corps) et Noir (distance). C'est un puzzle de mécaniques plus qu'un check de dégâts.",
    recommendedLevel: "160 — 190",
    composition: "Équipe capable d'alterner CC et distance. Difficulté modérée.",
    keyResist: ["Feu (distance)", "Neutre (corps-à-corps)"],
    phases: [
      {
        title: "Alternance des états",
        hp: "100% — 50%",
        mechanics: [
          "Les dégâts sur l'un des Ush sont partagés entre les deux.",
          "État Rouge : il faut le frapper au corps-à-corps ; état Noir : il faut le frapper à distance.",
          "Adaptez votre attaque à l'état courant.",
        ],
        danger: "medium",
      },
      {
        title: "Statuts partagés",
        hp: "50% — 0%",
        mechanics: [
          "Les deux Ush partagent de lourds effets de statut, transférables entre eux.",
          "Le placement devient délicat quand on cherche à sortir du corps-à-corps.",
          "Les sorts à gros dégâts par coup éliminent vite les vagues avant qu'elles ne s'accumulent.",
        ],
        danger: "medium",
      },
    ],
    tips: [
      "Tapez Feu à distance, Neutre au corps-à-corps selon l'état.",
      "Anticipez les transferts de CC entre les deux boss.",
    ],
    rewards: ["Set de Ush", "Ressources du Plateau", "Familier"],
    achievements: [
      { name: "Premier", strategy: "Ush Galesh doit être achevé en premier." },
      { name: "Zombie", strategy: "Utiliser exactement 1 PM par tour de jeu." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 30 tours." },
      { name: "Duel et pique", strategy: "Les alliés ne doivent pas attaquer plusieurs fois dans le même tour un même ennemi." },
    ],
  },

  // Tombe du Shogun Tofugawa — Shogun Tofugawa
  132: {
    summary:
      "Le Shogun est invulnérable jusqu'à être touché par la Lanterne des Spiritueurs (-invuln 2 tours). Le vrai danger vient des adds, pas du boss lui-même.",
    recommendedLevel: "160 — 190",
    composition: "DD à distance + contrôle, un Pandawa utile. Difficulté modérée.",
    keyResist: ["Air"],
    phases: [
      {
        title: "La Lanterne",
        hp: "100% — 50%",
        mechanics: [
          "Invulnérable en permanence jusqu'à être touché par la Lanterne des Spiritueurs (lève l'invulnérabilité 2 tours).",
          "Bloquez le Shogun contre un mur/allié pendant l'usage de la lanterne pour qu'il reste visible et sur le glyphe.",
          "Il a peu de mobilité (4 PM) : tenez-le à distance.",
        ],
        danger: "medium",
      },
      {
        title: "Brume & adds",
        hp: "50% — 0%",
        mechanics: [
          "Délocké, il invoque des Brumes Spectrales rendant les ennemis invisibles 2 tours, et 2 Assaïshin.",
          "Aspiration du Yokomaïnu attire les cibles jusqu'à 7 cases en ligne.",
          "Éliminez d'abord les adds (Tambouraï, Kabushido) avant de focus.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Air, son élément principal.",
      "Burst fort pour finir dans les 2 tours de vulnérabilité.",
    ],
    rewards: ["Set du Shogun Tofugawa", "Ressources de la Tombe", "Familier"],
    achievements: [
      { name: "Premier", strategy: "Shogun Tofugawa doit être achevé en premier." },
      { name: "Hardi", strategy: "Finir son tour sur une case adjacente à un ennemi." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Une lanterne dans la nuit", strategy: "Aucun ennemi ne doit subir les effets du sort Lanterne des Spiritueurs à l'exception du Shogun Tofugawa." },
      { name: "Les pandaliens", strategy: "Combattre à 4 persos min. avec au moins un Mirh, Rekto Topi, Traçon ou Logram." },
    ],
  },

  // Tanière Givrefoux — Tengu Givrefoux
  58: {
    summary:
      "Le Tengu Givrefoux est invulnérable tant que deux états ne lui sont pas appliqués simultanément, via deux sbires distincts. Combat coordonné dans une grande arène.",
    recommendedLevel: "170 — 200",
    composition: "Équipe coordonnée avec une arme à distance. Difficulté modérée.",
    keyResist: ["Eau"],
    phases: [
      {
        title: "Les deux états",
        hp: "100% — 50%",
        mechanics: [
          "Placez le Yomi Givrefoux en ligne avec le boss et frappez-le à l'arme (applique Fulguration).",
          "Poussez/attirez le Yokaï Givrefoux dans la diagonale du boss (applique Floutage).",
          "Les deux états présents simultanément lèvent l'invulnérabilité 4 tours.",
        ],
        danger: "medium",
      },
      {
        title: "Coordination",
        hp: "50% — 0%",
        mechanics: [
          "Coordonnez les deux actions dans le même tour pour éviter ses capacités mono-état dangereuses.",
          "Il invoque des sbires tous les 3 tours dès le tour 2.",
          "Restez à distance des Yomi et Maho qui tapent au corps-à-corps.",
        ],
        danger: "medium",
      },
    ],
    tips: [
      "Tapez Eau, son élément principal.",
      "Une arme à distance est nécessaire pour endommager le Yomi en sécurité.",
    ],
    rewards: ["Set Givrefoux", "Ressources de la Tanière", "Familier"],
    achievements: [
      { name: "Premier", strategy: "Tengu Givrefoux doit être achevé en premier." },
      { name: "Statue", strategy: "Finir chaque tour sur la case où on l'a commencé, tout le combat." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 15 tours." },
      { name: "Autonomie givrée", strategy: "Les alliés (hors invocations statiques) doivent terminer leur tour à plus de 4 cases de tous les autres alliés." },
    ],
  },

  // Horologium de XLII — XLII
  86: {
    summary:
      "L'Horologium impose une horloge invulnérable dont l'heure module les dégâts (40% à 150%) pour tous. Donjon à vagues où il faut synchroniser ses gros coups avec les heures fortes.",
    recommendedLevel: "170 — 200",
    composition: "Équipe gérant les vagues et le tempo de l'horloge. Difficulté élevée.",
    keyResist: ["Air", "Eau"],
    phases: [
      {
        title: "L'Auroraire (horloge)",
        hp: "100% — 50%",
        mechanics: [
          "Une horloge invulnérable avance d'une heure par tour : multiplicateur de 40% (12e heure) à 150% (11e heure), pour vous ET les ennemis.",
          "Souffle démoniaque inflige Pacifisme jusqu'à 3 cases (empêche d'attaquer).",
          "Déréglement : repositionner XLII déclenche un sort bonus et des échanges de place — à éviter.",
        ],
        danger: "high",
      },
      {
        title: "Vagues & tempo",
        hp: "50% — 0%",
        mechanics: [
          "Boostez vos stats pendant les heures faibles (12e-5e), puis éliminez les sbires aux heures fortes (6e-11e).",
          "Priorité au Trantroa (dégâts croissants sous 50% PV).",
          "Finissez XLII avant le retour de l'Auroraire à la 12e heure.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Air/Eau ; restez hors de portée du Pacifisme.",
      "Calez vos burst sur les heures à fort multiplicateur.",
    ],
    rewards: ["Set de XLII", "Ressources de l'Horologium", "Familier"],
    achievements: [
      { name: "Barbare", strategy: "Les personnages alliés doivent achever les ennemis avec une arme." },
      { name: "Collant", strategy: "Finir son tour sur une case adjacente à un autre allié." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 80 tours." },
      { name: "C'est très vague !", strategy: "Tous les ennemis d'une vague doivent être achevés avant l'arrivée d'une nouvelle vague." },
    ],
  },

  // Boyau du Père Ver — Père Ver
  102: {
    summary:
      "Le Père Ver est immobile et invulnérable à distance : on ne le combat qu'au corps-à-corps. Il applique une érosion constante et partage ses dégâts avec ses sbires.",
    recommendedLevel: "170 — 200",
    composition: "Tank + DD corps-à-corps. Dofus Émeraude/Dorigami conseillés. Difficulté modérée.",
    keyResist: ["Corps-à-corps obligatoire"],
    phases: [
      {
        title: "Combat de mêlée",
        hp: "100% — 50%",
        mechanics: [
          "Immobile et invulnérable à distance : seul le corps-à-corps fonctionne.",
          "Digestion Lente applique 10% d'érosion à tous et déclenche des dégâts au déplacement.",
          "Il pose des glyphes de soin chaque tour qui rendent 15% PV si on finit son tour dessus.",
        ],
        danger: "medium",
      },
      {
        title: "Sbires & partage de dégâts",
        hp: "50% — 0%",
        mechanics: [
          "Paternalisme (T2+) partage ses dégâts avec ses sbires (-50% d'efficacité).",
          "Les sbires ont Décès Traumatisant : 500 dégâts Feu en ligne de vue à leur mort.",
          "Éliminez les sbires d'abord, le Trémorse en priorité.",
        ],
        danger: "medium",
      },
    ],
    tips: [
      "Finissez votre tour sur votre glyphe marron pour le soin.",
      "Ne ciblez pas les monstres en partage de dégâts actif (dégâts gaspillés).",
    ],
    rewards: ["Set du Père Ver", "Ressources du Boyau", "Familier"],
    achievements: [
      { name: "Premier", strategy: "Père Ver doit être achevé en premier." },
      { name: "Zombie", strategy: "Utiliser exactement 1 PM par tour de jeu." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "On ne touche pas", strategy: "Les combattants alliés doivent terminer leur tour en diagonale d'un ennemi." },
    ],
  },

  // Demeure des Esprits — Koumiho
  131: {
    summary:
      "Koumiho est invulnérable tant que ses deux flammes Kitsounebi ne meurent pas dans le même tour. Tuer une seule flamme déclenche ~2500 dégâts : la coordination est vitale.",
    recommendedLevel: "170 — 200",
    composition: "Classes à distance ; duo Pandawa/Roublard excelle pour les succès. Difficulté modérée à élevée.",
    keyResist: ["Eau"],
    phases: [
      {
        title: "Les Kitsounebi",
        hp: "100% — 50%",
        mechanics: [
          "Tuez les deux Kitsounebi dans le même tour pour rendre le boss vulnérable.",
          "Les flammes deviennent invisibles après le tour 2 : utilisez glyphes bleus ou la lanterne pour les repérer.",
          "Ne tuez jamais une flamme sans l'autre, sinon ~2500 dégâts.",
        ],
        danger: "high",
      },
      {
        title: "Retraite (sous 50%)",
        hp: "50% — 0%",
        mechanics: [
          "Sous 50% PV, Koumiho utilise Retraite : invisibilité + soin + bouclier au tour suivant.",
          "La Lanterne des Spiritueurs inflige 20% des PV actuels des Kitsounebi en dégâts Eau (rayon 3).",
          "Restez à distance : tous ses sorts ont une courte portée (8 PO max).",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Eau, son élément principal.",
      "Coordonnez le burst sur les deux flammes simultanément.",
    ],
    rewards: ["Set de Koumiho", "Ressources de la Demeure", "Familier"],
    achievements: [
      { name: "Focus", strategy: "Lorsqu'un ennemi est attaqué par un allié, il doit être achevé avant qu'un autre ennemi ne soit attaqué." },
      { name: "Premier", strategy: "Koumiho doit être achevé en premier." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "La lumière ne fut jamais", strategy: "Aucun allié ne doit utiliser le sort Lanterne des Spiritueurs." },
      { name: "Revenus d'outre-tombe", strategy: "Combattre à 4 persos min. avec un Kockis, Kubitus, Kalkanéus, Hectaupe ou Hichète." },
    ],
  },

  // Poste de contrôle du Supervizœuf — Supervizœuf
  163: {
    summary:
      "Le Supervizœuf est invulnérable en phase 1 jusqu'à 4 états « Zoeuf'd » (explosions d'œufs près du boss). En phase 2 il se téléporte et se clone. Donjon de placement à vagues.",
    recommendedLevel: "170 — 200",
    composition: "Classes de placement fortement recommandées. Difficulté élevée (5 vagues).",
    keyResist: ["Terre"],
    phases: [
      {
        title: "Phase 1 — invulnérabilité",
        hp: "100% — 50%",
        mechanics: [
          "Invulnérable jusqu'à 4 états « Zoeuf'd », déclenchés par des explosions d'œufs près du boss.",
          "Gardez plusieurs Kabombz vivants pour générer des œufs (le Kamikabz est idéal).",
          "Placez les œufs près du Supervizœuf avant de les faire exploser.",
        ],
        danger: "high",
      },
      {
        title: "Phase 2 — téléportation & clone",
        hp: "50% — 0%",
        mechanics: [
          "Il se téléporte sur le joueur le plus proche chaque tour, gagne 20% crit et 10% dégâts finaux.",
          "Il invoque un clone (moitié PV, +4 PM, 1000 tacle) qui explose après 2 tours (500 dégâts Feu, rayon 3).",
          "Focus le boss immédiatement après la transition de phase 1.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Terre (attaques Bzélan).",
      "Restez hors des zones d'explosion.",
    ],
    rewards: ["Set du Supervizœuf", "Ressources du Poste", "Familier"],
    achievements: [
      { name: "Conquérant", strategy: "Lorsqu'un combattant allié tue un ou plusieurs ennemis, il doit finir son tour sur la case qu'occupait l'un de ce ou ces ennemis." },
      { name: "Collant", strategy: "Finir son tour sur une case adjacente à un autre allié." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 60 tours." },
      { name: "Bombzerman", strategy: "Le Supervizœuf ne doit plus être invulnérable à l'arrivée de la deuxième vague." },
    ],
  },

  // Temple du Grand Ougah — Grand Ougah
  22: {
    summary:
      "Le Grand Ougah accumule des boosts de puissance et se soigne via des spores buffées. Sans dispel ni burst, le combat devient ingérable avec les invocations.",
    recommendedLevel: "180 — 200",
    composition: "4 joueurs : dispel, gros DD, soutien. 4 persos requis pour passer la salle 3 (puzzle). Difficulté élevée.",
    keyResist: ["Feu", "Terre"],
    phases: [
      {
        title: "Boosts & spores",
        hp: "100% — 50%",
        mechanics: [
          "Bizarrerie booste les ennemis de 50 puissance par dégât reçu (jusqu'à 5x), ou 300 en zone.",
          "Spore Hanchambre donne un buff aléatoire : soin total du boss quand touché, ou perte PA/PM (33% chacun).",
          "Avoir des classes pouvant débuff pour retirer ces effets avant de taper.",
        ],
        danger: "high",
      },
      {
        title: "Opiniâtreté & invocations",
        hp: "50% — 0%",
        mechanics: [
          "Opiniâtreté inflige de gros dégâts en croix, applique une faiblesse Air et du poison.",
          "Il invoque des monstres aléatoires chaque tour dès le tour 2 (jusqu'à 6).",
          "Tuez Ougah au plus tôt (idéalement tour 1) pour limiter les invocations.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Feu/Terre, ses éléments.",
      "Composition corps-à-corps ou gros burst pour raccourcir le combat.",
    ],
    rewards: ["Set du Grand Ougah", "Ressources du Temple", "Familier"],
    achievements: [
      { name: "Compagnons, quel est votre métier ?", strategy: "Combattre à 4 persos min. avec un Kloug, Klûme, Grizou ou Laikteur." },
      { name: "Collant", strategy: "Finir son tour sur une case adjacente à un autre allié." },
      { name: "Dernier", strategy: "Ougah doit être achevé en dernier." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 15 tours." },
      { name: "Mycologie", strategy: "Les combattants alliés ne doivent pas terminer leur tour en ligne ou en diagonale d'un ennemi." },
    ],
  },

  // Antre du Kralamoure Géant — Kralamoure Géant
  31: {
    summary:
      "Boss de raid : le Kralamoure Géant a 900% de résistances, levées 1 tour seulement via 4 tentacules invoqués dans le bon ordre. Coordination de raid indispensable.",
    recommendedLevel: "180 — 200",
    composition: "48+ joueurs pour ouvrir le donjon, groupe raid (8+) pour le boss. Difficulté très élevée.",
    keyResist: ["Air", "Eau", "Feu", "Terre"],
    phases: [
      {
        title: "Cycle des tentacules",
        hp: "100% — 50%",
        mechanics: [
          "900% de résistance partout : invoquez 4 tentacules pour la retirer 1 tour.",
          "Ordre : Eau → Feu → Terre → Air sur les tours 1-4.",
          "Le Tentacule Primaire OS au corps-à-corps : bloquez sa ligne de vue vers le boss.",
        ],
        danger: "high",
      },
      {
        title: "Fenêtre de dégâts",
        hp: "50% — 0%",
        mechanics: [
          "Tourbe écrasante applique Pesanteur infinie et +1000 sagesse au boss pour 6 tours.",
          "Le boss gagne d'énormes buffs (8000 dégâts, 63 PA, 1000 PV) au déclenchement des vulnérabilités.",
          "Infligez le maximum au tour 7 quand la résistance chute, ou relancez le cycle.",
        ],
        danger: "extreme",
      },
    ],
    tips: [
      "Placez 3 tentacules autour d'un tank Pandawasta, le Primaire devant le boss.",
      "La coordination du placement et du timing fait tout.",
    ],
    rewards: ["Set du Kralamoure Géant", "Encre de Kralamoure", "Familier"],
    achievements: [
      { name: "Les héros", strategy: "Combattre à 4 persos min. avec au moins un Krosmoglob, Korbax, Masse ou Chevalier d'Astrub." },
      { name: "Nomade", strategy: "Utiliser tous ses PM à chaque tour, tout le combat." },
      { name: "Blitzkrieg", strategy: "Achever chaque ennemi attaqué avant le début de son tour." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 40 tours." },
      { name: "Un projet tentaculaire", strategy: "Les combattants ne doivent pas terminer leur tour en ligne d'un allié." },
    ],
  },

  // Maison du Papa Nowel — Père Fwetar
  38: {
    summary:
      "Le Père Fwetar gagne 1 PM par tentative de retrait (à ne jamais faire), tape à portée infinie et se soigne entièrement à ~30% PV. Donjon dense en menaces et invocations.",
    recommendedLevel: "180 — 200",
    composition: "5-6 joueurs ; variété de menaces et de pantins. Difficulté élevée.",
    keyResist: ["Terre"],
    phases: [
      {
        title: "Menaces à distance",
        hp: "100% — 50%",
        mechanics: [
          "Il gagne 1 PM infiniment par tentative de retrait PM : ne retirez JAMAIS ses PM.",
          "Fwetage inflige 700 dégâts à portée infinie (8 PO minimum) ; restez à 7 cases ou moins.",
          "Aspir'nenfan attire de 3 cases ; il a aussi un OS au corps-à-corps.",
        ],
        danger: "high",
      },
      {
        title: "Pantins & soin",
        hp: "50% — 0%",
        mechanics: [
          "Il invoque un Poutch Ingball tous les 3 tours, parfois boosté de 2 PA (boosté 2x, il OS l'équipe).",
          "À ~30% PV, Embûche de Nowel le soigne entièrement et booste tous les monstres.",
          "Tuez la Peluche Wabbit en premier (elle soigne fortement les alliés).",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Terre, sa faiblesse.",
      "Éliminez les Poutch Ingball boostés avant leur relance.",
    ],
    rewards: ["Set du Père Fwetar", "Ressources de Nowel", "Familier saisonnier"],
    achievements: [
      { name: "Chrono", strategy: "Vaincre tous les monstres en moins de 9 tours." },
      { name: "Nomade", strategy: "Utiliser tous ses PM à chaque tour, tout le combat." },
      { name: "Hardi", strategy: "Finir son tour sur une case adjacente à un ennemi." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Sale gosse !", strategy: "Les alliés doivent achever au moins une marionnette du Père Fwetar avant d'achever ce dernier." },
    ],
  },

  // Cave du Toxoliath — Toxoliath
  82: {
    summary:
      "Le Toxoliath punit le mouvement et les dégâts directs par des poisons. Tuer avant le tour 6 (Poison Volatile) ou gérer finement les PM est la clé.",
    recommendedLevel: "180 — 200",
    composition: "Équipe à distance avec retrait PM ou burst ; un Eniripsa (purge) très utile. Difficulté modérée à élevée.",
    keyResist: ["Neutre", "Multi-élément"],
    phases: [
      {
        title: "Toxmose",
        hp: "100% — 50%",
        mechanics: [
          "Toxmose : par ligne de dégâts direct reçue, il applique un poison Eau infligeant 700 par PM utilisé pendant 2 tours.",
          "N'utilisez pas vos PM après avoir tapé le boss : préférez téléport/rush.",
          "Venin Salvateur applique une vulnérabilité (+50% dégâts subis) tout en soignant les attaquants.",
        ],
        danger: "high",
      },
      {
        title: "Poison Volatile (T6+)",
        hp: "50% — 0%",
        mechanics: [
          "Dès le tour 6, Poison Volatile retire des PA, applique un poison Feu et augmente les dégâts subis de 50% en zone.",
          "Tuez le boss avant le tour 6 pour éviter son déploiement.",
          "5 vagues arrivent aux tours 1/6/11/16/21 ou à l'élimination des ennemis.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Gérable à 200, exigeant à 180 sans gros burst.",
      "Une purge (Eniripsa) facilite énormément la gestion des poisons.",
    ],
    rewards: ["Set du Toxoliath", "Ressources de la Cave", "Familier"],
    achievements: [
      { name: "Circulez !", strategy: "Ne tenter aucun retrait de PM sur les ennemis durant tout le combat." },
      { name: "Misanthrope", strategy: "Ne jamais finir son tour sur une case adjacente à un allié." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 80 tours." },
      { name: "Relation toxique", strategy: "Tuer Toxoliath en dernier." },
    ],
  },

  // Antichambre des Gloursons — Glourséleste
  61: {
    summary:
      "Le Glourséleste est invulnérable sauf au corps-à-corps, où toute poussée tue instantanément. Ses dégâts montent quand sa vie baisse et il ressuscite ses compagnons si on le déplace.",
    recommendedLevel: "190 — 200",
    composition: "Équipe équilibrée avec soin/bouclier et gros dégâts mono-cible. Difficulté élevée.",
    keyResist: ["Terre"],
    phases: [
      {
        title: "Invulnérabilité au corps-à-corps",
        hp: "100% — 50%",
        mechanics: [
          "Il faut le frapper au corps-à-corps chaque tour pour lever l'invulnérabilité.",
          "Toute poussée (4 cases dans un obstacle) inflige un OS : attention au Glourmand.",
          "Il vole 700-800 PV deux fois par tour.",
        ],
        danger: "high",
      },
      {
        title: "Scaling & résurrections",
        hp: "50% — 0%",
        mechanics: [
          "Il inflige 10% des PV manquants en dégâts au corps-à-corps : il tape plus fort en bas de vie.",
          "Il ressuscite ses compagnons si vous retirez PM/PO ou le déplacez.",
          "Tuez Glourmand et Méliglours d'abord pour éviter les dégâts en cascade.",
        ],
        danger: "extreme",
      },
    ],
    tips: [
      "Tapez Terre, sa faiblesse.",
      "Tuez le boss en 1-2 tours si possible : les combats longs deviennent ingérables.",
    ],
    rewards: ["Set du Glourséleste", "Ressources de l'Antichambre", "Familier Glourson"],
    achievements: [
      { name: "Mini Nuits'", strategy: "Combattre à 4 persos min. avec au moins un Inferno, Styx, Mandrin ou Will Killson." },
      { name: "Premier", strategy: "Glourséleste doit être achevé en premier." },
      { name: "Collant", strategy: "Finir son tour sur une case adjacente à un autre allié." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Complaisance gloursonne", strategy: "Les ennemis ne doivent subir aucune tentative de retrait de PM, de PA, de PO, ou de déplacement par les alliés." },
    ],
  },

  // Donjon de la mine de Sakaï — Grolloum
  62: {
    summary:
      "Le Grolloum est invulnérable en permanence : il faut tuer un monstre qu'il a ressuscité en zombie, au corps-à-corps contre lui, pour le rendre vulnérable 1 tour.",
    recommendedLevel: "190 — 200",
    composition: "4 joueurs max, DD Eau conseillés. Difficulté modérée à élevée.",
    keyResist: ["Eau"],
    phases: [
      {
        title: "Le cycle zombie",
        hp: "100% — 50%",
        mechanics: [
          "Il ressuscite le dernier monstre tombé en zombie tous les 2 tours (état Instant).",
          "Tuer ce zombie au corps-à-corps du boss lève son invulnérabilité 1 tour.",
          "Toute tentative de retrait PM lui donne 8000 de résistance à tout.",
        ],
        danger: "high",
      },
      {
        title: "Fenêtre de dégâts",
        hp: "50% — 0%",
        mechanics: [
          "Arrangez-vous pour qu'il ressuscite le Gobus (le moins dangereux) en zombie final.",
          "Réduisez les PV du zombie au maximum avant de l'achever (PA minimaux pour aussi taper le boss).",
          "Tuez le Grolloum en un tour pendant qu'il est vulnérable.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Eau, sa faiblesse.",
      "Ne retirez jamais ses PM (8000 de résistance).",
    ],
    rewards: ["Set du Grolloum", "Ressources de la Mine", "Familier"],
    achievements: [
      { name: "Les crados", strategy: "Combattre à 4 persos min. avec au moins un Grüt, Gobeuf, Turyé ou Piggy Paupe." },
      { name: "Versatile", strategy: "N'utiliser chaque action qu'une seule fois par tour." },
      { name: "Blitzkrieg", strategy: "Achever chaque ennemi attaqué avant le début de son tour." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 28 tours." },
      { name: "On voulait l'autre", strategy: "Les ennemis dans l'état Zombi ne doivent pas être déplacés par les alliés." },
    ],
  },

  // Pyramide d'Ombre — Ombre
  74: {
    summary:
      "Ombre n'est vulnérable que si la Silhouette se trouve dans le glyphe blanc du Globilum tandis qu'Ombre reste dehors. Puzzle de placement avant tout.",
    recommendedLevel: "190 — 200",
    composition: "Équipe de placement. Difficulté modérée (puzzle plus que dégâts).",
    keyResist: ["Eau"],
    phases: [
      {
        title: "Le glyphe du Globilum",
        hp: "100% — 50%",
        mechanics: [
          "Ombre devient vulnérable quand la Silhouette est dans le glyphe blanc ET qu'Ombre reste dehors.",
          "Le Globilum invoque une Silhouette (dégâts Feu selon l'érosion, retire des PM).",
          "La Silhouette fuit après avoir attaqué : placez-la pour qu'elle recule dans le glyphe.",
        ],
        danger: "medium",
      },
      {
        title: "Encrage",
        hp: "50% — 0%",
        mechanics: [
          "Encrage : Ombre et la Silhouette deviennent immobiles 1 tour après déplacement et gagnent 100 puissance.",
          "Vous ne pouvez déplacer Ombre/Silhouette qu'une fois par tour chacun.",
          "Sinon : tuez Ombre en premier, ou les sbires (Sombléro → Caznoar → Noctulule).",
        ],
        danger: "medium",
      },
    ],
    tips: [
      "Tapez Eau (sort Distorsion).",
      "C'est un puzzle de positionnement, pas un check de DPS.",
    ],
    rewards: ["Set de l'Ombre", "Ressources de la Pyramide", "Familier"],
    achievements: [
      { name: "Chevaliers tourmentés", strategy: "Combattre à 4 persos min. avec au moins un Flamme, Goutte, Nuage, Feuille ou Ténèbre." },
      { name: "Premier", strategy: "Ombre doit être achevé en premier." },
      { name: "Collant", strategy: "Finir son tour sur une case adjacente à un autre allié." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 26 tours." },
      { name: "Jeux d'ombres", strategy: "Les combattants ennemis ne doivent subir aucune tentative de dommages à distance." },
    ],
  },

  // Camp du Comte Razof — Comte Razof
  104: {
    summary:
      "Le Comte Razof perd 20% de résistances par invocation alliée vivante en fin de son tour. Les classes à invocations massives (Sadida/Osamodas) trivialisent le combat.",
    recommendedLevel: "190 — 200",
    composition: "Groupes organisés à invocations. Tank fort ou contrôle distance. Difficulté moyenne à élevée.",
    keyResist: ["Eau"],
    phases: [
      {
        title: "Réduction par invocations",
        hp: "100% — 50%",
        mechanics: [
          "Il invoque un Minikrone en début de combat : sa mort vous retire des résistances.",
          "Il perd 20% de résistances par invocation alliée vivante en fin de son tour.",
          "Empilez les invocations (Sadida/Osamodas) hors de sa ligne de vue.",
        ],
        danger: "medium",
      },
      {
        title: "Trophée de Chasse",
        hp: "50% — 0%",
        mechanics: [
          "Trophée de Chasse élimine vos invocations contre des buffs (corps-à-corps, T2+).",
          "Pelliste (15 PO) impose une gestion de la distance.",
          "Éliminez Viandargh en premier (réduction de puissance + attractions).",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Eau, sa faiblesse principale.",
      "Un perso à ~150 tacle bloque Razof et protège les alliés.",
    ],
    rewards: ["Set du Comte Razof", "Ressources du Camp", "Familier"],
    achievements: [
      { name: "Liberté", strategy: "Ne pas tenter de retirer de PM ou de PO aux adversaires pendant toute la durée du combat." },
      { name: "Premier", strategy: "Comte Razof doit être achevé en premier." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Nos amies les bêtes", strategy: "Aucune invocation alliée ne doit être achevée par un ennemi." },
    ],
  },

  // Bastion des Marteaux-Aigris — Barbéryl Clochecuivre
  141: {
    summary:
      "Barbéryl Clochecuivre monte en puissance (Nimpatience) et débloque un OS au niveau III. Très mobile, elle échange les places : il faut la tuer vite.",
    recommendedLevel: "190 — 200",
    composition: "3-4 joueurs, gros burst ou retrait PM. Difficulté modérée (18 000 PV).",
    keyResist: ["Eau", "Terre"],
    phases: [
      {
        title: "Clochecuivre",
        hp: "100% — 50%",
        mechanics: [
          "Le 1er allié touché chaque tour gagne un débuff ; Barbéryl échange de place avec lui et applique -100 PM.",
          "Retirez l'état Clochecuivre en frappant le boss au corps-à-corps.",
          "Appliquez Pesanteur pour bloquer ses téléportations et échanges.",
        ],
        danger: "medium",
      },
      {
        title: "Nimpatience",
        hp: "50% — 0%",
        mechanics: [
          "Elle gagne des bonus de dégâts (jusqu'à 100% au niveau V) en infligeant des dégâts.",
          "Au niveau III, elle débloque un sort OS.",
          "Tuez-la avant le tour 2 pour l'empêcher d'atteindre Nimpatience III.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Eau/Terre, ses faiblesses.",
      "Téléportation de 6 cases tous les 2 tours : Pesanteur indispensable.",
    ],
    rewards: ["Set des Marteaux-Aigris", "Ressources du Bastion", "Familier"],
    achievements: [
      { name: "Les z'autres", strategy: "Combattre à 4 persos min. avec au moins un Haku, Manitou Zoth, Karotz, Grouillot ou Phong Huss." },
      { name: "Dernier", strategy: "Barbéryl Clochecuivre doit être achevé en dernier." },
      { name: "Versatile", strategy: "N'utiliser chaque action qu'une seule fois par tour." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours." },
      { name: "Antioxydant", strategy: "Aucun ennemi ne doit entrer dans l'état Nimpatience V." },
    ],
  },

  // Salons privés de Klime — Klime
  68: {
    summary:
      "Klime est invulnérable jusqu'au tour 3, levé en poussant des unités contre lui. Il impose Pacifisme chaque tour, contré uniquement en se tenant sur ses glyphes blancs.",
    recommendedLevel: "200",
    composition: "Classes corps-à-corps/placement avec repositionnement ; éviter le full distance. Difficulté modérée à élevée.",
    keyResist: ["Feu"],
    phases: [
      {
        title: "Briser l'invulnérabilité",
        hp: "100% — 50%",
        mechanics: [
          "Invulnérable jusqu'au tour 3 : poussez alliés/ennemis contre lui pour le rendre vulnérable.",
          "Carcastagne applique Pacifisme chaque tour, évitable via les glyphes « Peau Lisse ».",
          "Il pose des glyphes blancs (durée 2 tours) qui donnent Peau Lisse et +300 dégâts aux alliés.",
        ],
        danger: "high",
      },
      {
        title: "Cuir à feu doux",
        hp: "50% — 0%",
        mechanics: [
          "Vulnérable, Cuir à feu doux renvoie tous les alliés à leur case de départ (échanges si superposition), +100 tenacité et +300 dégâts.",
          "Dès le tour 3, positionnez tous vos attaquants sur les glyphes blancs pour éviter le Pacifisme.",
          "Tuez Klime vite une fois vulnérable (dégâts croissants en bas de vie).",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Feu, son élément principal.",
      "Tuez les sbires d'abord : Empaillé → Grodruche → Cuirboule.",
    ],
    rewards: ["Set de Klime", "Ressources des Salons", "Familier"],
    achievements: [
      { name: "Prudent", strategy: "Ne jamais finir son tour sur une case adjacente à un ennemi." },
      { name: "Nomade", strategy: "Utiliser tous ses PM à chaque tour, tout le combat." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 40 tours." },
      { name: "Dur à cuir", strategy: "Aucun allié ne doit entrer dans l'état Pacifiste." },
      { name: "Compagnons, quel est votre métier ?", strategy: "Combattre à 4 persos min. avec un Kloug, Klûme, Grizou ou Laikteur." },
    ],
  },

  // Aquadôme de Merkator — Merkator
  73: {
    summary:
      "Merkator pénalise les dégâts à distance et attire en ligne les tours impairs. Donjon accessible où un Féca (protection) contre efficacement ses mécaniques.",
    recommendedLevel: "200",
    composition: "Équipe équilibrée ; Féca (protection), DD distance, soin. Difficulté accessible.",
    keyResist: ["Terre"],
    phases: [
      {
        title: "Mer Kantile",
        hp: "100% — 50%",
        mechanics: [
          "Mer Kantile réduit les dégâts à distance de 50%, donne +2% dégâts finaux par coup à distance et immobilise tout le monde.",
          "Mer Veille inflige ~500 dégâts Feu en cas de tentative de retrait PM.",
          "Restez à distance au début (le boss a peu de portée).",
        ],
        danger: "medium",
      },
      {
        title: "Marée & résurrection",
        hp: "50% — 0%",
        mechanics: [
          "Marée Descendante attire tous les ennemis en ligne (tours impairs, T3+) et retire 4 PM.",
          "Évitez la ligne de vue du boss les tours impairs.",
          "Bouche-à-Bouche ressuscite ses alliés à partir du tour 7 : éliminez les Cyclophandres d'abord.",
        ],
        danger: "medium",
      },
    ],
    tips: [
      "Tapez Terre (Sondage de Bronze).",
      "Un Féca neutralise Mer Veille grâce à ses protections.",
    ],
    rewards: ["Set de Merkator", "Ressources de l'Aquadôme", "Familier"],
    achievements: [
      { name: "Dernier", strategy: "Merkator doit être achevé en dernier." },
      { name: "Mystique", strategy: "Les combattants alliés ne doivent infliger que des dégâts et soins de sorts durant leurs tours de jeu." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 40 tours." },
      { name: "Voyez, il y a du monde", strategy: "Chaque combattant allié doit commencer ou terminer son tour en ligne d'un ennemi." },
      { name: "Les crados", strategy: "Combattre à 4 persos min. avec au moins un Grüt, Gobeuf, Turyé ou Piggy Paupe." },
    ],
  },

  // Trône de la Cour Sombre — Reine des Voleurs
  83: {
    summary:
      "La Reine des Voleurs impose un système de bonbombes (rouges = OS, bleues = soin) et une malédiction de mort. La gestion des bombes et la distance font tout le combat.",
    recommendedLevel: "200",
    composition: "4-5 joueurs ; Cra (poussée) + Enutrof (retrait) + DD. Difficulté modérée à élevée.",
    keyResist: ["Eau", "Neutre"],
    phases: [
      {
        title: "Les bonbombes",
        hp: "100% — 50%",
        mechanics: [
          "Votre équipe invoque des bombes chaque tour : les rouges OS en ligne, les bleues (déclenchées en diagonale) soignent.",
          "Chaque bombe sur le terrain réduit les dégâts du boss de 10%.",
          "Placez vos persos en formation pour que les explosions soignent au lieu de tuer.",
        ],
        danger: "high",
      },
      {
        title: "Mort en Sursis & Brume",
        hp: "50% — 0%",
        mechanics: [
          "Mort en Sursis : malédiction de mort sur 6 tours (attaque en ligne, 5 PO) ; soin ou kill du boss requis pour survivre.",
          "Brume : le boss devient invisible dans un cercle mais n'occupe que 3 cases possibles (33% chacune).",
          "Éliminez les Terristocrates et réduisez la portée des Magouille pour éviter les pièges retrait PM.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Eau/Neutre.",
      "Gardez le boss à distance (Cra/Enutrof) pour éviter le corps-à-corps et la malédiction.",
    ],
    rewards: ["Set de la Reine des Voleurs", "Ressources de la Cour Sombre", "Familier"],
    achievements: [
      { name: "Premier", strategy: "Reine des Voleurs doit être achevé en premier." },
      { name: "Collant", strategy: "Finir son tour sur une case adjacente à un autre allié." },
      { name: "Trio", strategy: "Vaincre tous les monstres avec 3 personnages maximum et en moins de 80 tours." },
      { name: "La vie est une chausse-trappe", strategy: "Les alliés ne doivent pas être soignés par le biais des Bonbombes bleues." },
      { name: "Les crados", strategy: "Combattre à 4 persos min. avec au moins un Grüt, Gobeuf, Turyé ou Piggy Paupe." },
    ],
  },

  // Ventre de la Baleine — Protozorreur
  84: {
    summary:
      "Le Protozorreur est invulnérable (dégâts redirigés sur le Malamibe) : il faut l'attirer dans les glyphes violets pour déclencher l'Infection sur 10 tours. Mécaniques très exigeantes.",
    recommendedLevel: "200",
    composition: "Enutrof (retrait PM + init), DD, soin/protection optionnel. Difficulté élevée.",
    keyResist: ["Air"],
    phases: [
      {
        title: "Le Malamibe",
        hp: "100% — 50%",
        mechanics: [
          "Le boss est invulnérable : les dégâts sont redirigés sur le Malamibe (2000 PV par perso vivant).",
          "Frappez en étant aligné avec le boss pour l'attirer dans les glyphes violets.",
          "Éliminez Tabacille et Bacterrib tôt pour simplifier.",
        ],
        danger: "high",
      },
      {
        title: "Infection",
        hp: "50% — 0%",
        mechanics: [
          "Attirez le Protozorreur dans les glyphes violets 10 tours consécutifs pour déclencher l'Infection.",
          "L'état Infection se réinitialise s'il entre à nouveau : repositionnez avec soin.",
          "Restez à distance pour éviter le boost Jet Proto ; repositionnez au moins tous les 2 tours.",
        ],
        danger: "extreme",
      },
    ],
    tips: [
      "Tapez Air, son élément principal.",
      "Un Enutrof avec initiative est idéal pour caler les glyphes et retirer des PM.",
    ],
    rewards: ["Set du Protozorreur", "Ressources du Ventre", "Familier"],
    achievements: [
      { name: "Barbare", strategy: "Les personnages alliés doivent achever les ennemis avec une arme." },
      { name: "Statue", strategy: "Finir chaque tour sur la case où on l'a commencé, tout le combat." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 40 tours." },
      { name: "Qui dit boum ?", strategy: "La Malamibe doit toujours être achevée avant le début de son prochain tour." },
    ],
  },

  // Œil de Vortex — Œil de Vortex
  87: {
    summary:
      "L'Œil de Vortex ressuscite tous les sbires : il faut les « corrompre » en les tuant deux fois à la même heure de l'Auroraire. Combat long centré sur la mécanique d'horloge.",
    recommendedLevel: "200",
    composition: "DD distance + soutien, retrait PM utile. Difficulté modérée à élevée.",
    keyResist: ["Terre"],
    phases: [
      {
        title: "L'Auroraire",
        hp: "100% — 60%",
        mechanics: [
          "Le boss démarre invulnérable avec 0 PM et ressuscite tous les sbires tombés.",
          "L'horloge Auroraire avance chaque tour et buffe les sbires ressuscités selon l'heure de leur mort.",
          "Corrompez les sbires en les tuant deux fois à la même heure pour les retirer définitivement.",
        ],
        danger: "high",
      },
      {
        title: "Vulnérabilité",
        hp: "60% — 0%",
        mechanics: [
          "Le boss devient vulnérable une fois les 5 vagues de sbires corrompues.",
          "Heurage : téléportation dangereuse vers la position de l'Auroraire tous les 3 tours.",
          "Évitez d'être en ligne avec l'Auroraire au tour du Vortex (sort En temps et en heure).",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Terre, son élément principal.",
      "Jouez à 3, 4 ou 6 pour des cycles d'Auroraire prévisibles.",
    ],
    rewards: ["Set de l'Œil de Vortex", "Ressources du Vortex", "Familier"],
    achievements: [
      { name: "Focus", strategy: "Lorsqu'un ennemi est attaqué par un allié, il doit être achevé avant qu'un autre ennemi ne soit attaqué." },
      { name: "Hardi", strategy: "Finir son tour sur une case adjacente à un ennemi." },
      { name: "Trio", strategy: "Vaincre tous les monstres avec 3 personnages maximum et en moins de 80 tours." },
      { name: "Heure de la mort", strategy: "Tous les ennemis doivent être achevés à la même heure." },
    ],
  },

  // Vaisseau du Capitaine Meno — Capitaine Meno
  97: {
    summary:
      "Le Capitaine Meno réduit tous les dégâts de 50% mais vous donne +20% dégâts finaux cumulables par tour. C'est un combat de survie sur ~10 tours, le poison étant idéal.",
    recommendedLevel: "200",
    composition: "Équipe équilibrée avec contrôle, soin et poison. Difficulté moyenne à élevée.",
    keyResist: ["Air", "Poison (ignore la réduction)"],
    phases: [
      {
        title: "Réduction & montée en dégâts",
        hp: "100% — 50%",
        mechanics: [
          "Il réduit tous les dégâts subis de 50% mais donne +20% dégâts finaux par tour aux joueurs (cumulable à l'infini).",
          "Le poison est idéal car il contourne la réduction de 50%.",
          "Survivre est l'objectif principal : comptez ~10 tours avant de pouvoir l'achever.",
        ],
        danger: "high",
      },
      {
        title: "Invocations & Crystallisation",
        hp: "50% — 0%",
        mechanics: [
          "Il invoque 2-3 monstres par tour dès le tour 2 ; tous invulnérables mais perdant 25% PV/tour (morts en 4 tours).",
          "Crystallisation pose des glyphes : dégâts en ligne mais 1000 bouclier aux alliés dessus.",
          "Placez les alliés en diagonale sur des glyphes séparés pour éviter le tir ami.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Air, ou misez sur le poison.",
      "Retrait PM (Cra, Enutrof, Sadida) pour gérer le placement des monstres.",
    ],
    rewards: ["Set du Capitaine Meno", "Ressources du Vaisseau", "Familier"],
    achievements: [
      { name: "Bandits du Magik Riktus", strategy: "Combattre à 4 persos min. avec au moins un Riktus fine-lame, Riktus archer, Riktus baroudeur ou Riktus ensorceleuse." },
      { name: "Blitzkrieg", strategy: "Achever chaque ennemi attaqué avant le début de son tour." },
      { name: "Prudent", strategy: "Ne jamais finir son tour sur une case adjacente à un ennemi." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 40 tours." },
      { name: "Parfum de mutinerie", strategy: "Les combattants alliés doivent terminer leur tour en ligne d'un combattant allié." },
    ],
  },

  // Temple de Koutoulou — Larve de Koutoulou
  98: {
    summary:
      "On affronte la Larve de Koutoulou (le vrai Koutoulou est en fond). Tout tourne autour des états Folie (1-10) : à 10 c'est la mort. Le poison et le placement hors ligne de vue sont essentiels.",
    recommendedLevel: "200",
    composition: "Équipe gérant la Folie et le placement ; solo possible à la fin. Difficulté modérée à élevée.",
    keyResist: ["Terre"],
    phases: [
      {
        title: "États Folie",
        hp: "100% — 50%",
        mechanics: [
          "On gagne des états Folie en subissant des attaques ou en finissant son tour en ligne de vue du boss. État 10 = mort.",
          "Paliers : -50% soins reçus (état 4), x2 dégâts subis (état 6), renvoi aux alliés proches (état 2).",
          "Le poison ne déclenche ni échanges de place ni gains de Folie : abusez-en.",
        ],
        danger: "high",
      },
      {
        title: "Horreur Cosmique & Univers Vacillant",
        hp: "50% — 0%",
        mechanics: [
          "Horreur Cosmique : chaque dégât force un échange de place avec l'entité la plus proche (risque d'invulnérabilité ou de Folie).",
          "Univers Vacillant téléporte les persos en ligne de vue au corps-à-corps en début de tour (T2+).",
          "Gardez le Shokkoth à 5+ cases pour éviter la création de clones.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Terre, son élément.",
      "Ne finissez jamais votre tour en ligne de vue du boss.",
    ],
    rewards: ["Set de Koutoulou", "Ressources du Temple", "Familier"],
    achievements: [
      { name: "Prudent", strategy: "Ne jamais finir son tour sur une case adjacente à un ennemi." },
      { name: "Hardi", strategy: "Finir son tour sur une case adjacente à un ennemi." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 40 tours." },
      { name: "Chaises musicales", strategy: "Après son premier tour, un ennemi doit échanger de place avec un allié au moins une fois entre chacun de ses tours." },
      { name: "Mini Nuits'", strategy: "Combattre à 4 persos min. avec au moins un Inferno, Styx, Mandrin ou Will Killson." },
    ],
  },

  // Palais de Dantinéa — Dantinéa
  99: {
    summary:
      "Dantinéa invoque un Grokillage par joueur qui réduit vos dégâts de 50% et vous fait perdre 1 PM/tour. Tous les 5 tours elle les élimine et les rejette : course contre la montre.",
    recommendedLevel: "200",
    composition: "Équipe coordonnée, placement soigné en phase de préparation. Difficulté modérée à élevée.",
    keyResist: ["Neutre"],
    phases: [
      {
        title: "Les Grokillages",
        hp: "100% — 50%",
        mechanics: [
          "Elle invoque un Grokillage par joueur : tant qu'il vit, vos dégâts sont réduits de 50%.",
          "Vous perdez 1 PM/tour tant que votre Grokillage lié survit.",
          "Tuez en priorité les Grokillages de vos plus gros DD.",
        ],
        danger: "high",
      },
      {
        title: "Cycles d'élimination",
        hp: "50% — 0%",
        mechanics: [
          "Tous les 5 tours, Dantinéa élimine les Grokillages restants et en réinvoque de nouveaux.",
          "Nettoyez tous les Grokillages avant les tours 6, 11 ou 16 pour éviter l'élimination de persos.",
          "Elle peut se téléporter avec eux et inflige 600 dégâts Eau aux persos en ligne.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Neutre, son élément principal.",
      "Focus le Tryde avant les autres adds (empilement de puissance).",
    ],
    rewards: ["Set de Dantinéa", "Ressources du Palais", "Familier"],
    achievements: [
      { name: "Les héros", strategy: "Combattre à 4 persos min. avec au moins un Krosmoglob, Korbax, Masse ou Chevalier d'Astrub." },
      { name: "Dernier", strategy: "Dantinéa doit être achevé en dernier." },
      { name: "Statue", strategy: "Finir chaque tour sur la case où on l'a commencé, tout le combat." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 40 tours." },
      { name: "Chasse aux coquillages", strategy: "Un Grokillage ne doit subir des dommages que de la part du combattant auquel il est lié." },
    ],
  },

  // Chambre de Tal Kasha — Tal Kasha
  103: {
    summary:
      "Tal Kasha est invulnérable tant qu'elle n'est pas placée sur 3 glyphes de monstres tombés. Elle attaque à travers ses alliés : ne jamais s'aligner avec un monstre ou le boss.",
    recommendedLevel: "200",
    composition: "Enutrof (retrait PM), Cra (poussée), DD distance. Difficulté modérée à élevée.",
    keyResist: ["Neutre", "Feu", "Eau"],
    phases: [
      {
        title: "Invulnérabilité & lignes de vue",
        hp: "100% — 50%",
        mechanics: [
          "Invulnérable jusqu'à être placée sur 3 glyphes laissés par des monstres tués.",
          "Elle peut lancer Transe-Perse et Filature à travers n'importe lequel de ses alliés.",
          "Ne vous alignez jamais avec un monstre ou le boss.",
        ],
        danger: "high",
      },
      {
        title: "Résurrections",
        hp: "50% — 0%",
        mechanics: [
          "Les ennemis tombés réapparaissent chaque tour via glyphes (perte de 1 PM permanente).",
          "Transe-Perse inflige 1700 dégâts Neutre au corps-à-corps.",
          "Appliquez de l'érosion sur les adds pour réduire leurs PV de résurrection à presque rien.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Un Enutrof gère l'approche des ennemis via le retrait PM.",
      "Le placement chirurgical prime sur le DPS.",
    ],
    rewards: ["Set de Tal Kasha", "Ressources de la Chambre", "Familier"],
    achievements: [
      { name: "Statue", strategy: "Finir chaque tour sur la case où on l'a commencé, tout le combat." },
      { name: "Focus", strategy: "Lorsqu'un ennemi est attaqué par un allié, il doit être achevé avant qu'un autre ennemi ne soit attaqué." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 40 tours." },
      { name: "Système pyramidal", strategy: "Un ennemi ne doit pas être ressuscité plus de deux fois." },
    ],
  },

  // Manoir des Katrepat — Anerice la Shushess
  106: {
    summary:
      "Anerice réduit tous les dégâts de 90% (Résilience vampyrique) : seule l'érosion ou la transformation des joueurs en goules permet de la blesser. Combat de stratégie pure.",
    recommendedLevel: "200",
    composition: "Cra + Enutrof (distance) OU Iop/Roublard + Pandawa (burst goule). Difficulté modérée à élevée.",
    keyResist: ["Eau"],
    phases: [
      {
        title: "Résilience vampyrique",
        hp: "100% — 50%",
        mechanics: [
          "Elle réduit tous les dégâts de 90% en début de combat.",
          "Goulification transforme les joueurs en goules : la cible subit +150% dégâts, et chaque goule présente affaiblit Anerice.",
          "Appliquez 40%+ d'érosion pour contourner sa réduction de dégâts.",
        ],
        danger: "high",
      },
      {
        title: "Renforcement des monstres",
        hp: "50% — 0%",
        mechanics: [
          "Elle booste tous les monstres de +2 PM et +50% dégâts tous les 3 tours.",
          "Coopération téléporte et regroupe les ennemis près des alliés transformés.",
          "Tuez le Kerigoule avant le tour 2 pour empêcher le partage de dégâts.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Eau, son élément principal.",
      "Tenez Anerice à distance pour éviter les transformations en phase de sbires.",
    ],
    rewards: ["Set d'Anerice", "Ressources du Manoir", "Familier"],
    achievements: [
      { name: "Les héros", strategy: "Combattre à 4 persos min. avec au moins un Krosmoglob, Korbax, Masse ou Chevalier d'Astrub." },
      { name: "Prudent", strategy: "Ne jamais finir son tour sur une case adjacente à un ennemi." },
      { name: "Premier", strategy: "Anerice la Shushess doit être achevé en premier." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 40 tours." },
      { name: "Qu'est-ce qu'elle a ma goule ?", strategy: "Chaque combattant allié doit être goulifié au moins une fois au cours du combat." },
    ],
  },

  // Belvédère d'Ilyzaelle — Ilyzaelle
  107: {
    summary:
      "Combat en deux phases : Ilyzaelle se téléporte à votre camp à 75% et 50% PV en devenant invulnérable. Il faut déclencher ces seuils au bon moment et éviter ses attractions.",
    recommendedLevel: "200",
    composition: "Gros DD, Enutrof (ralentissement) utile. Difficulté élevée.",
    keyResist: ["Eau"],
    phases: [
      {
        title: "Seuils & invulnérabilité",
        hp: "100% — 50%",
        mechanics: [
          "À 75% et 50% PV, elle se téléporte à votre camp, devient invulnérable et pose un glyphe bénéfique.",
          "L'état Brûlure s'applique en se déplaçant ou en retirant des PM ; les monstres le consomment via des attaques spéciales.",
          "Évitez l'érosion pour ne pas fausser les seuils de phase.",
        ],
        danger: "high",
      },
      {
        title: "Attractions & invocations",
        hp: "50% — 0%",
        mechanics: [
          "Vers les ténèbres attire tous les joueurs vers elle tous les 3 tours.",
          "Elle invoque 2-3 monstres tous les 3 tours selon la taille du groupe.",
          "Restez derrière des obstacles aux tours 3, 6, 9 pour éviter l'attraction.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Eau (15% de résistance).",
      "Minimisez le stuff critique : elle a 250 de résistance aux coups critiques.",
    ],
    rewards: ["Set d'Ilyzaelle", "Ressources du Belvédère", "Familier"],
    achievements: [
      { name: "Bandits du Magik Riktus", strategy: "Combattre à 4 persos min. avec au moins un Riktus fine-lame, Riktus archer, Riktus baroudeur ou Riktus ensorceleuse." },
      { name: "Liberté", strategy: "Ne pas tenter de retirer de PM ou de PO aux adversaires pendant toute la durée du combat." },
      { name: "Focus", strategy: "Lorsqu'un ennemi est attaqué par un allié, il doit être achevé avant qu'un autre ennemi ne soit attaqué." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 40 tours." },
      { name: "Aux portes d'Externam", strategy: "Ilyzaelle doit être achevée avant l'apparition de la troisième vague de monstres." },
    ],
  },

  // Tour de Bethel — Bethel Akarna
  108: {
    summary:
      "Bethel Akarna ne peut être blessé que par un Dagon allié, obtenu en détruisant le Monolithe. Et tout kill sans l'état Nécronyx wipe l'équipe. Donjon mécanique très technique.",
    recommendedLevel: "200",
    composition: "Équipe corps-à-corps avec tank (Pandawa), 4000+ PV, Dofus Ivoire. Difficulté élevée.",
    keyResist: ["Air"],
    phases: [
      {
        title: "Nécronyx & Monolithe",
        hp: "100% — 50%",
        mechanics: [
          "Appliquez l'état Nécronyx avant de tuer un ennemi, sinon l'équipe wipe.",
          "Détruisez le Monolithe (corps-à-corps uniquement, invulnérable à distance) pour faire apparaître un Dagon allié.",
          "Restez à moins de 6 PO des monstres chaque tour, sinon ils gagnent +2 PM, +1 PO.",
        ],
        danger: "high",
      },
      {
        title: "Le Dagon allié",
        hp: "50% — 0%",
        mechanics: [
          "Seul le Dagon allié peut blesser Bethel via son Souffle Chaud au corps-à-corps.",
          "Rafraîchissez Nécronyx sur Bethel tous les 3 tours (il expire).",
          "Les glyphes de bordure infligent -100 PM et Pesanteur.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Air, son élément principal.",
      "Un tank Pandawa bloque Bethel et évite les poussées dans les pièges de bordure.",
    ],
    rewards: ["Set de Bethel Akarna", "Ressources de la Tour", "Familier"],
    achievements: [
      { name: "Revenus d'outre-tombe", strategy: "Combattre à 4 persos min. avec un Kockis, Kubitus, Kalkanéus, Hectaupe ou Hichète." },
      { name: "Mystique", strategy: "Les combattants alliés ne doivent infliger que des dégâts et soins de sorts durant leurs tours de jeu." },
      { name: "Zombie", strategy: "Utiliser exactement 1 PM par tour de jeu." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 40 tours." },
      { name: "La mort sait attendre", strategy: "Aucun ennemi ne doit entrer dans l'état Nécronyx avant la mort de Bethel." },
    ],
  },

  // Tour de Solar — Solar
  109: {
    summary:
      "Solar enchaîne 4 états cycliques (Aurore, Zénith, Crépuscule, Nadir) et n'est vulnérable qu'en Nadir. Comme Bethel, tout kill sans Nécronyx wipe l'équipe.",
    recommendedLevel: "200",
    composition: "Équipe coordonnée à gros burst. Difficulté moyenne à élevée.",
    keyResist: ["Feu", "Terre"],
    phases: [
      {
        title: "Cycle d'états",
        hp: "100% — 50%",
        mechanics: [
          "4 états (Aurore, Zénith, Crépuscule, Nadir) se répètent tous les 3 tours ; vulnérable seulement en Nadir.",
          "Nécronyx doit être appliqué avant de tuer Solar, sinon l'équipe entière est éliminée.",
          "Solar renvoie les dégâts dans un carré autour de lui.",
        ],
        danger: "high",
      },
      {
        title: "Fenêtre Nadir",
        hp: "50% — 0%",
        mechanics: [
          "Utilisez Nécronyx pour faire avancer le cycle d'états jusqu'au Nadir.",
          "Appliquez Nécronyx tôt dans votre tour pour que les alliés tapent en CC sans subir le renvoi.",
          "Préparez un gros burst pour finir en 1-2 tours pendant le Nadir (tours 4 ou 10+).",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Feu/Terre selon la phase.",
      "Un glyphe de bordure inflige dégâts et débuffs selon l'état de Solar.",
    ],
    rewards: ["Set de Solar", "Ressources de la Tour", "Familier"],
    achievements: [
      { name: "Revenus d'outre-tombe", strategy: "Combattre à 4 persos min. avec un Kockis, Kubitus, Kalkanéus, Hectaupe ou Hichète." },
      { name: "Versatile", strategy: "N'utiliser chaque action qu'une seule fois par tour." },
      { name: "Focus", strategy: "Lorsqu'un ennemi est attaqué par un allié, il doit être achevé avant qu'un autre ennemi ne soit attaqué." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 40 tours." },
      { name: "La mort sait attendre", strategy: "Aucun ennemi (à l'exception de Solar) ne doit entrer dans l'état Necronyx avant la mort de Solar." },
    ],
  },

  // Temple du dieu Kao — Prêtresse de Kao
  111: {
    summary:
      "La Prêtresse de Kao est vulnérable après avoir tué 3 Éclats Kao, mais les frapper applique Chocolathée qui booste les ennemis. Le poison est la clé pour les gérer proprement.",
    recommendedLevel: "200",
    composition: "Gros DD (Iop, Sram, Roublard, Éliotrope) + Pandawa + protection/soin. Difficulté modérée à élevée.",
    keyResist: ["Terre"],
    phases: [
      {
        title: "Les Éclats Kao",
        hp: "100% — 50%",
        mechanics: [
          "Tuez 3 Éclats Kao pour rendre le boss vulnérable (chaque kill donne un boost de dégâts : +52%, +74%, +99%).",
          "Frapper un Éclat applique Chocolathée à l'attaquant (booste les dégâts des sorts ennemis et les Cloches du Kao de 50 par joueur affecté).",
          "OS les Éclats ou utilisez le poison pour éviter Chocolathée.",
        ],
        danger: "high",
      },
      {
        title: "Vulnérabilité",
        hp: "50% — 0%",
        mechanics: [
          "Les Éclats ont 1000 PV + 500/joueur ; ils perdent leur bonus PV après le tour 2 puis meurent seuls.",
          "Le poison sur les monstres ignore la réduction de 50% de dégâts.",
          "Empilez les classes de protection/soin (Féca, Eniripsa, Zobal) pour tanker les dégâts inévitables.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Terre, sa faiblesse.",
      "Combat mécanique : la gestion des Éclats prime sur les stats.",
    ],
    rewards: ["Set du dieu Kao", "Ressources du Temple", "Familier"],
    achievements: [
      { name: "Chrono", strategy: "Vaincre tous les monstres en moins de 9 tours." },
      { name: "Premier", strategy: "Prêtresse de Kao doit être achevé en premier." },
      { name: "Liberté", strategy: "Ne pas tenter de retirer de PM ou de PO aux adversaires pendant toute la durée du combat." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 40 tours." },
      { name: "Charier la chocolaterie", strategy: "Aucun Éclats du Kao ne doit être sur le terrain lorsqu'un combattant ennemi est achevé." },
    ],
  },

  // Sanctuaire de Torkélonia — Torkélonia
  114: {
    summary:
      "Tous les ennemis démarrent invulnérables (à lever via le glyphe bleu). Un cycle lunaire à 8 phases module les bonus : tuer aux mauvaises phases est puni, finir le boss hors Pleine/Nouvelle lune OS.",
    recommendedLevel: "200",
    composition: "Tank Pandawa + DD corps-à-corps. Difficulté élevée (cycle lunaire).",
    keyResist: ["Eau"],
    phases: [
      {
        title: "Invulnérabilité & cycle lunaire",
        hp: "100% — 50%",
        mechanics: [
          "Tenez-vous sur le glyphe bleu et infligez des dégâts une fois pour lever l'invulnérabilité (par tour).",
          "Le cycle lunaire à 8 phases tourne dans le sens horaire chaque tour (réduction de dégâts, PA/PM bonus, soin...).",
          "Tuer aux bonnes phases lunaires donne des buffs permanents aux survivants.",
        ],
        danger: "high",
      },
      {
        title: "Lunorbe & timing",
        hp: "50% — 0%",
        mechanics: [
          "Le Lunorbe immobile soigne les ennemis qui passent sur son glyphe rotatif.",
          "Évitez de tuer les monstres en Pleine lune (le plus grave) et en Nouvelle lune.",
          "Le joueur qui tue Torkélonia est OS sauf si c'est fait en Nouvelle ou Pleine lune.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Eau, son élément principal.",
      "Tuez l'Alashasss en premier (soigneur).",
    ],
    rewards: ["Set de Torkélonia", "Ressources du Sanctuaire", "Familier"],
    achievements: [
      { name: "Chevaliers tourmentés", strategy: "Combattre à 4 persos min. avec au moins un Flamme, Goutte, Nuage, Feuille ou Ténèbre." },
      { name: "Dernier", strategy: "Torkélonia doit être achevé en dernier." },
      { name: "Statue", strategy: "Finir chaque tour sur la case où on l'a commencé, tout le combat." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 40 tours." },
      { name: "Lunatique", strategy: "Chaque ennemi doit être achevé soit durant la phase de Nouvelle Lune, soit durant la phase de Pleine Lune. La Lunorbe ne doit jamais être utilisée pour accélérer le rythme du cycle lunaire." },
    ],
  },

  // Arbre de Mort — Corruption
  117: {
    summary:
      "Premier Cavalier de l'Eliocalypse. Corruption diffuse des maladies et une aura de poison Terre. La gestion des maladies via le vol de vie et le retrait d'aura font le combat.",
    recommendedLevel: "200",
    composition: "Soigneur + DD. Difficulté modérée à élevée (gestion des maladies).",
    keyResist: ["Feu"],
    phases: [
      {
        title: "Aura Kissiphrot",
        hp: "100% — 50%",
        mechanics: [
          "Kissiphrot Sipique applique ~1400 poison Terre par coup ; retirez-le en soignant les alliés adjacents aux ennemis.",
          "Après retrait de l'état, Corruption descend de sa monture 3 tours, puis remonte et réapplique l'aura.",
          "Peau pourrissante (état de base) empêche les maladies mais réduit les dégâts de 90%.",
        ],
        danger: "high",
      },
      {
        title: "Maladies",
        hp: "50% — 0%",
        mechanics: [
          "Bombe Bactériologique et glyphes Bouillon de culture appliquent des maladies aléatoires.",
          "Utilisez le vol de vie pour retirer les maladies efficacement (3 soins par maladie).",
          "Gardez vos distances avec ses attaques de zone ; utilisez des invocations pour déclencher le retrait d'état.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Feu, son élément principal.",
      "Retirez l'aura sur les sbires avant de focus Corruption.",
    ],
    rewards: ["Set de l'Eliocalypse", "Ressources de l'Arbre", "Familier"],
    achievements: [
      { name: "Collant", strategy: "Finir son tour sur une case adjacente à un autre allié." },
      { name: "Mains propres", strategy: "Achever les ennemis sans leur infliger de dégâts directs." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 40 tours." },
      { name: "Immunité collective", strategy: "Seuls les alliés sans aucune maladie peuvent occasionner des dommages aux ennemis." },
    ],
  },

  // Fers de la Tyrannie — Servitude
  118: {
    summary:
      "Cavalier le plus dur de l'Eliocalypse. Servitude renvoie 200% des dégâts sauf si l'on a l'état « Traître », et enchaîne 3 phases dont une remise à zéro de la map.",
    recommendedLevel: "200",
    composition: "Éliotrope + Iop (ou Sram + Féca). Plus on est nombreux, plus c'est simple. Difficulté élevée.",
    keyResist: ["Terre"],
    phases: [
      {
        title: "Renvoi & Armécréantes",
        hp: "100% — 50%",
        mechanics: [
          "Renvoie 200% des dégâts infligés sauf si vous avez l'état « Traître ».",
          "Gagnez « Traître » en finissant votre tour sur les glyphes blancs (incrémenté en attaquant les alliés).",
          "Elle invoque des Armécréantes les tours impairs : tuez-les vite ou elles invoquent des Ioppimés.",
        ],
        danger: "high",
      },
      {
        title: "Phases 2 & 3",
        hp: "50% — 0%",
        mechanics: [
          "Phase 2 à 50% PV : elle monte sa créature et gagne des capacités améliorées.",
          "Phase 3 à 1 PV : remise à zéro de la map et soin de 25%.",
          "Appliquez l'état Insoignable avant la phase 3 pour bloquer le soin.",
        ],
        danger: "extreme",
      },
    ],
    tips: [
      "Tapez Terre (15% de résistance seulement).",
      "Les protections du Féca contournent totalement le renvoi de dégâts.",
    ],
    rewards: ["Set de l'Eliocalypse", "Ressources des Fers", "Familier"],
    achievements: [
      { name: "Focus", strategy: "Lorsqu'un ennemi est attaqué par un allié, il doit être achevé avant qu'un autre ennemi ne soit attaqué." },
      { name: "Versatile", strategy: "N'utiliser chaque action qu'une seule fois par tour." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 40 tours." },
      { name: "Bain de foule", strategy: "Les alliés ne doivent pas achever les Armécréantes invoquées." },
    ],
  },

  // Sentence de la Balance — Misère
  119: {
    summary:
      "Misère vole les stats que ses monstres collectent et attire tout le monde vers elle. En phase 2 elle monte son vautour, gagne 4 PM et devient vite ingérable.",
    recommendedLevel: "200",
    composition: "Maîtrise du placement, dégâts soutenus. Difficulté élevée.",
    keyResist: ["Eau"],
    phases: [
      {
        title: "Vol de stats & attraction",
        hp: "100% — 50%",
        mechanics: [
          "Les monstres en état « Collecte » volent des stats ; Misère les récupère en début de tour si elle a une ligne de vue.",
          "Chaque tour et par ligne de dégâts infligée, elle attire toutes les entités (1-4 cases selon les PV).",
          "Balance-Fléau vole 200 puissance (max 5 stacks, plafond 1000).",
        ],
        danger: "high",
      },
      {
        title: "Phase 2 (vautour)",
        hp: "50% — 0%",
        mechanics: [
          "À 50% PV, elle monte son vautour, gagne 4 PM (10 au total), invulnérable 1 tour, et apprend de nouveaux sorts.",
          "Les cadavres créent des soins/boucliers : les monstres à 4 PO les déclenchent, Misère les consomme en boucliers.",
          "Tuez-la vite en phase 2 avant que ses 10 PM et sa coopération longue portée ne deviennent ingérables.",
        ],
        danger: "extreme",
      },
    ],
    tips: [
      "Tapez Eau (résistances les plus basses).",
      "Tuez tous les sbires d'abord et restez derrière des obstacles en phase 1.",
    ],
    rewards: ["Set de l'Eliocalypse", "Ressources de la Sentence", "Familier"],
    achievements: [
      { name: "Hardi", strategy: "Finir son tour sur une case adjacente à un ennemi." },
      { name: "Mains propres", strategy: "Achever les ennemis sans leur infliger de dégâts directs." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 40 tours." },
      { name: "Abjecte opulence", strategy: "Misère doit être achevée en premier, elle doit également rentrer dans l'état Collecte au moins une fois par tour." },
    ],
  },

  // Trône de Sang — Guerre
  120: {
    summary:
      "Guerre est indéplaçable et invulnérable tant que ses sbires vivent. Elle invoque des armes géantes par paliers de 20% PV et fixe un joueur via Bravoure. Puzzle de placement.",
    recommendedLevel: "200",
    composition: "Escouade de 4 joueurs. Difficulté modérée à élevée (placement plus que DPS).",
    keyResist: ["Feu"],
    phases: [
      {
        title: "Forcer la vulnérabilité",
        hp: "100% — 50%",
        mechanics: [
          "Indéplaçable et invulnérable jusqu'à la mort de tous les sbires (puis montée = vulnérable).",
          "Bravoure fixe un joueur en focus 2 tours, avec pénalité Pacifiste pour les autres.",
          "Ordre des sbires : Trancharnier, Olgoth (à distance) en premier, puis Ravalame.",
        ],
        danger: "high",
      },
      {
        title: "Armes géantes",
        hp: "50% — 0%",
        mechanics: [
          "Elle invoque des armes géantes par paliers de 20% PV (Épée, Marteau, Hache, Morgenstern).",
          "Les armes survivantes à son tour lui donnent des buffs et peuvent échanger de place via Célérité.",
          "Tuez les armes avant son tour, ou ignorez-les (les tuer après son tour déclenche soin/résistances).",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Feu, son élément principal.",
      "Le perso en état Bravoure maximise les dégâts (cible unique de Guerre).",
    ],
    rewards: ["Set de l'Eliocalypse", "Ressources du Trône", "Familier"],
    achievements: [
      { name: "Zombie", strategy: "Utiliser exactement 1 PM par tour de jeu." },
      { name: "Misanthrope", strategy: "Ne jamais finir son tour sur une case adjacente à un allié." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 40 tours." },
      { name: "Arsenal total", strategy: "Aucune arme de Guerre ne doit être achevée ou déplacée par un allié." },
    ],
  },

  // Tempête de l'Eliocalypse — les 4 Cavaliers
  121: {
    summary:
      "Combat final contre les 4 Cavaliers simultanément, épaulé par un Feu Primordial allié invulnérable. Si l'invocateur du Feu meurt, le combat est perdu. L'ordre de focus est décisif.",
    recommendedLevel: "200",
    composition: "Pandawa (placement) + Féca (contrôle) + DD. Plus simple à 5+ joueurs. Difficulté modérée.",
    keyResist: ["Neutre"],
    phases: [
      {
        title: "Le Feu Primordial",
        hp: "100% — 50%",
        mechanics: [
          "Les 4 Cavaliers combattent en même temps ; le Feu Primordial allié vous épaule (+500 puissance, +2 PA/PM, résistances, PV bonus).",
          "Si le perso qui invoque le Feu Primordial meurt, le combat est automatiquement perdu.",
          "Feu Primordial inflige 750 dégâts Neutre.",
        ],
        danger: "high",
      },
      {
        title: "Ordre de focus",
        hp: "50% — 0%",
        mechanics: [
          "Chaque Cavalier garde ses mécaniques (Corruption = maladies, Servitude = renvoi 200%, Misère = attractions, Guerre = invulnérable jusqu'à isolement).",
          "Ordre conseillé : Corruption d'abord, puis Servitude, Misère, et Guerre en dernier.",
          "Des monstres supplémentaires apparaissent aux butins 5+.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Protégez l'invocateur du Feu Primordial à tout prix.",
      "Respectez l'ordre de focus pour neutraliser les mécaniques une à une.",
    ],
    rewards: ["Set de l'Eliocalypse", "Ressources de la Tempête", "Familier légendaire"],
  },

  // Mémoire d'Orukam — Roi Imagami
  133: {
    summary:
      "Le Roi Imagami devient invulnérable 5 tours en forme Lotus à 75/50/25% PV, invoquant la Reine Amirukam pour vous aider. Donjon simplifié depuis le patch 2.71.",
    recommendedLevel: "200",
    composition: "Équipe de 4 équilibrée, DD distance conseillés. Difficulté modérée.",
    keyResist: ["Neutre"],
    phases: [
      {
        title: "Seuils Lotus",
        hp: "100% — 50%",
        mechanics: [
          "À 75%, 50%, 25% PV, il passe en forme Lotus : invulnérable 5 tours et invoque la Reine Amirukam (alliée).",
          "Papetuerie pose des glyphes blancs tous les 3 tours : tenez-vous sur la case centrale pour éviter 700 dégâts à tous.",
          "3 vagues d'ennemis apparaissent aux tours 4, 5 et 10.",
        ],
        danger: "medium",
      },
      {
        title: "Aide de la Reine",
        hp: "50% — 0%",
        mechanics: [
          "Déclenchez les seuils vite pour bénéficier de l'aide de la Reine (gros dégâts via portails).",
          "Utilisez la zone de glyphe rétrécissante (3→2→1) pour éliminer les ennemis en zone d'encre.",
          "Priorité à la Reine avec son sort Extinction avant que le boss ne récupère.",
        ],
        danger: "medium",
      },
    ],
    tips: [
      "Tapez Neutre, son élément principal.",
      "Synchronisez les seuils pour maximiser l'aide de la Reine.",
    ],
    rewards: ["Set d'Orukam", "Ressources de la Mémoire", "Familier"],
    achievements: [
      { name: "Hardi", strategy: "Finir son tour sur une case adjacente à un ennemi." },
      { name: "Mains propres", strategy: "Achever les ennemis sans leur infliger de dégâts directs." },
      { name: "Trio", strategy: "Vaincre tous les monstres avec 3 personnages maximum et en moins de 80 tours." },
      { name: "Régence d'encre", strategy: "L'invocation \"Reine Amirukam\" doit être achevée par un allié avant que le Roi Imagami ne sorte de sa phase Lotus." },
    ],
  },

  // Souvenir d'Imagiro — Reine Amirukam
  134: {
    summary:
      "Pendant du donjon d'Orukam : la Reine Amirukam passe en forme Lotus à 75/50/25% PV et invoque le Roi Imagami pour aider. Gestion des glyphes et du poison cumulatif.",
    recommendedLevel: "200",
    composition: "Équipe de 4 équilibrée, DD distance conseillés. Difficulté modérée.",
    keyResist: ["Eau"],
    phases: [
      {
        title: "Seuils Lotus",
        hp: "100% — 50%",
        mechanics: [
          "À 75%, 50%, 25% PV, elle passe en forme Lotus : invulnérable 5 tours et invoque le Roi Imagami (allié).",
          "Brouillard d'Encre pose des glyphes infligeant des dégâts au tour suivant à qui se tient dessus.",
          "Toner Deubraiste applique un poison cumulatif (+5% dégâts subis, cumulable).",
        ],
        danger: "medium",
      },
      {
        title: "Aide du Roi",
        hp: "50% — 0%",
        mechanics: [
          "Déclenchez les seuils vite pour maximiser l'aide du Roi Imagami contre les vagues.",
          "Les glyphes noirs éliminent les ennemis en zone de papier à la sortie de Lotus.",
          "Utilisez Inspiration du Wukang du Roi pour toucher plusieurs ennemis sans ligne de vue.",
        ],
        danger: "medium",
      },
    ],
    tips: [
      "Tapez Eau, son élément principal.",
      "Restez à distance et hors des glyphes pour éviter les stacks de poison.",
    ],
    rewards: ["Set d'Imagiro", "Ressources du Souvenir", "Familier"],
    achievements: [
      { name: "Les pandaliens", strategy: "Combattre à 4 persos min. avec au moins un Mirh, Rekto Topi, Traçon ou Logram." },
      { name: "Prudent", strategy: "Ne jamais finir son tour sur une case adjacente à un ennemi." },
      { name: "Mains propres", strategy: "Achever les ennemis sans leur infliger de dégâts directs." },
      { name: "Trio", strategy: "Vaincre tous les monstres avec 3 personnages maximum et en moins de 80 tours." },
      { name: "Régence de papier", strategy: "L'invocation \"Roi Imagami\" doit être achevée par un allié avant que la Reine Amirukam ne sorte de sa phase Lotus." },
    ],
  },

  // Rituel de Kabahal — Kabahal
  135: {
    summary:
      "Kabahal est invulnérable : on ne le blesse qu'à travers les Bras Démoniaques contrôlés. Il faut le maintenir à portée des bras et focus dès le tour 1 avant les invasions.",
    recommendedLevel: "200",
    composition: "Pandawa (tank/placement) + soin/soutien + DD. Hautes résistances essentielles. Difficulté élevée.",
    keyResist: ["Neutre"],
    phases: [
      {
        title: "Les Bras Démoniaques",
        hp: "100% — 50%",
        mechanics: [
          "Invulnérable : les dégâts ne passent qu'via les Bras Démoniaques contrôlés.",
          "Menace Grandissante pose des runes qui font apparaître des bras au prochain tour de Kabahal.",
          "Tenez-vous sur les runes avant son tour pour contrôler un bras au tour suivant.",
        ],
        danger: "high",
      },
      {
        title: "Boosts alternés",
        hp: "50% — 0%",
        mechanics: [
          "Il alterne boost à distance (tours impairs) et boost au corps-à-corps (tours pairs).",
          "Placez le boss près des bras (Pandawa) pour déclencher des dégâts automatiques chaque tour.",
          "Il invoque des monstres dès le tour 5 si les 5 positions de bras sont remplies.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Neutre (via les Bras Démoniaques).",
      "Focus Kabahal dès le tour 1 : les combats longs sont punis par les invasions.",
    ],
    rewards: ["Set de Kabahal", "Ressources du Rituel", "Familier"],
    achievements: [
      { name: "Hardi", strategy: "Finir son tour sur une case adjacente à un ennemi." },
      { name: "Mains propres", strategy: "Achever les ennemis sans leur infliger de dégâts directs." },
      { name: "Duo", strategy: "Vaincre tous les monstres avec 2 personnages maximum et en moins de 40 tours." },
      { name: "Gros Bras", strategy: "Les ennemis doivent être achevés uniquement à l'aide des bras démoniaques." },
    ],
  },

  // Breuil du Vénérable — Vénérable Endormi
  164: {
    summary:
      "Le Vénérable dort et reste invulnérable tant qu'aucun monstre ne subit de dégâts à moins de 3 cases de lui. On nettoie d'abord les vagues, puis on détruit sa monture.",
    recommendedLevel: "200",
    composition: "Gros burst (Roublard, Éliotrope + Iop) + tank protection en phase 2. Difficulté modérée à élevée.",
    keyResist: ["Terre", "Neutre"],
    phases: [
      {
        title: "Le sommeil",
        hp: "100% — 50%",
        mechanics: [
          "Invulnérable tant qu'il dort ; il se réveille si un monstre subit des dégâts à moins de 3 cases.",
          "Ignorez le boss au début : éliminez d'abord les 5 vagues de sbires.",
          "Sa monture donne +2% dégâts finaux/tour à tous les alliés (plafond 20%).",
        ],
        danger: "medium",
      },
      {
        title: "Gare au Gorille",
        hp: "50% — 0%",
        mechanics: [
          "À 50% PV, il entre en phase « Gare au Gorille » : +20% dégâts finaux et stats améliorées.",
          "Détruisez la monture avant de combattre le boss réveillé pour retirer l'invulnérabilité.",
          "Il utilise des attaques de zone qui attirent/repoussent et se téléporte jusqu'à 6 cases.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Terre/Neutre.",
      "Évitez de toucher les monstres à moins de 3 cases du boss pour ne pas le réveiller.",
    ],
    rewards: ["Set du Vénérable", "Ressources du Breuil", "Familier"],
    achievements: [
      { name: "Premier", strategy: "Vénérable Endormi doit être achevé en premier." },
      { name: "Hardi", strategy: "Finir son tour sur une case adjacente à un ennemi." },
      { name: "Trio", strategy: "Vaincre tous les monstres avec 3 personnages maximum et en moins de 80 tours." },
      { name: "Ça ronfle fort", strategy: "Tuer Vénérable Endormi en dernier." },
    ],
  },

  // Autel de la Déchireuse — La Déchireuse
  165: {
    summary:
      "La Déchireuse est invulnérable jusqu'à déclencher les effets alliés via l'Autel de la Chasse. Elle se téléporte au plus proche et applique Espèce en Danger (2e application = OS). Donjon difficile de la dimension.",
    recommendedLevel: "200",
    composition: "DD distance + soin + débuffeur. Difficulté variable selon la saison. Difficulté élevée.",
    keyResist: ["Eau", "Feu"],
    phases: [
      {
        title: "Briser l'invulnérabilité",
        hp: "100% — 50%",
        mechanics: [
          "Déclenchez les effets alliés saisonniers via l'Autel de la Chasse pour lever son invulnérabilité.",
          "Elle se téléporte au perso le plus proche dans sa ligne de vue et applique Espèce en Danger (2e application = OS).",
          "Effet Matriarche : elle gagne 1 PM par monstre allié en ligne avec elle en début de tour.",
        ],
        danger: "high",
      },
      {
        title: "Barbarie (phase 2)",
        hp: "50% — 0%",
        mechanics: [
          "À 1 PV, elle entre en état Barbarie : soin total et changement de sorts.",
          "Appliquez des réductions de dégâts avant la phase 2 (elle ne peut pas être rendue « Inapte »).",
          "Focus-la vite : la phase 2 est extrêmement dangereuse.",
        ],
        danger: "extreme",
      },
    ],
    tips: [
      "Tapez Eau/Feu.",
      "Restez derrière des obstacles pour couper sa ligne de vue et éviter la téléportation.",
    ],
    rewards: ["Set de la Déchireuse", "Ressources de l'Autel", "Familier"],
    achievements: [
      { name: "Nomade", strategy: "Utiliser tous ses PM à chaque tour, tout le combat." },
      { name: "En ligne de mire", strategy: "Les combattants alliés doivent terminer leurs tours en ligne de vue d'au moins un ennemi." },
      { name: "Trio", strategy: "Vaincre tous les monstres avec 3 personnages maximum et en moins de 80 tours." },
      { name: "Autelière", strategy: "Aucun ennemi autre que la Déchireuse ne doit subir les effets de l'Autel de la Chasse" },
    ],
  },

  // Défi du Chalœil — Chalœil
  95: {
    summary:
      "Le Chalœil est invulnérable jusqu'au tour 21 (arrivée de la 5e vague) : c'est avant tout une épreuve de survie et de placement autour de son système de dés. Donjon difficile.",
    recommendedLevel: "200",
    composition: "1 classe de retrait PM + 2 DD. Difficulté élevée (20+ tours de survie avant les vrais dégâts).",
    keyResist: ["Eau"],
    phases: [
      {
        title: "Système de dés",
        hp: "100% — 50%",
        mechanics: [
          "Le Chalœil invoque des dés et des glyphes de soin selon la case numérotée (1-6) où il finit son tour.",
          "Gros Yeux : tous les 3 tours (T3, T6, T9...), il se booste lui et ses alliés selon leur état de dé.",
          "Farce et Attrape échange sa place avec un ennemi jusqu'à 6 cases et inflige 1000 dégâts.",
        ],
        danger: "high",
      },
      {
        title: "Survie jusqu'au tour 21",
        hp: "50% — 0%",
        mechanics: [
          "Il reste invulnérable jusqu'au tour 21, quand la 5e vague de monstres arrive.",
          "Utilisez le retrait PM pour contrôler son placement et l'empêcher d'atteindre l'équipe.",
          "Placez-le dans un coin sur une case « Dé 6 » pour limiter les obstacles invoqués.",
        ],
        danger: "high",
      },
    ],
    tips: [
      "Tapez Eau (sort Toilette Ecaflip).",
      "Éliminez tôt les Cavaliers Chanceux (gros dégâts de poussée une fois buffés).",
    ],
    rewards: ["Set du Chalœil", "Ressources du Défi", "Familier Ecaflip"],
    achievements: [
      { name: "Liberté", strategy: "Ne pas tenter de retirer de PM ou de PO aux adversaires pendant toute la durée du combat." },
      { name: "Prudent", strategy: "Ne jamais finir son tour sur une case adjacente à un ennemi." },
      { name: "Trio", strategy: "Vaincre tous les monstres avec 3 personnages maximum et en moins de 80 tours." },
      { name: "Les bons comptes font les bons ennemis", strategy: "Les combattants alliés doivent toujours terminer leur tour sur une cellule correspondant au numéro de leur cellule de début de combat." },
      { name: "Compagnons, quel est votre métier ?", strategy: "Combattre à 4 persos min. avec un Kloug, Klûme, Grizou ou Laikteur." },
    ],
  },
};

const DANGER_BY_PHASE: BossPhase["danger"][] = ["low", "medium", "high", "extreme"];

// Fallback : construit un guide cohérent à partir du niveau du donjon.
export function buildGenericGuide(name: string, level: number, monsterCount: number): DungeonGuide {
  const tier = level < 50 ? "bas" : level < 110 ? "moyen" : level < 180 ? "haut" : "THL";
  const phaseCount = level < 60 ? 2 : level < 150 ? 3 : 4;

  const phases: BossPhase[] = Array.from({ length: phaseCount }).map((_, i) => {
    const from = 100 - Math.round((100 / phaseCount) * i);
    const to = 100 - Math.round((100 / phaseCount) * (i + 1));
    return {
      title:
        i === 0
          ? "Mise en place"
          : i === phaseCount - 1
            ? "Phase finale"
            : `Montée en pression ${i}`,
      hp: `${from}% — ${to}%`,
      danger: DANGER_BY_PHASE[Math.min(i, DANGER_BY_PHASE.length - 1)],
      mechanics:
        i === 0
          ? [
              "Positionnez-vous pour ne pas être pris à revers par les invocations.",
              "Identifiez l'élément de résistance du boss et adaptez vos sorts.",
            ]
          : i === phaseCount - 1
            ? [
                "Le boss déclenche ses mécaniques les plus punitives sous 25% de PV.",
                "Préparez vos pics de dégâts (buffs, debuffs de résistance) pour finir vite.",
                "Surveillez les soins/invocations qui prolongent le combat.",
              ]
            : [
                "Le boss alterne attaques de zone et ciblées : espacez le groupe.",
                "Nettoyez les invocations gênantes sans perdre le focus sur le boss.",
              ],
    };
  });

  return {
    summary: `${name} est un donjon de niveau ${tier}. ${
      monsterCount > 1 ? `La salle finale compte ${monsterCount} ennemis : ` : ""
    }gérez les sbires avant de concentrer le boss.`,
    recommendedLevel: `${Math.max(1, level - 10)} — ${level + 30}`,
    composition:
      level < 60
        ? "Accessible en petit groupe ou solo bien stuffé."
        : level < 150
          ? "Groupe de 3-4 recommandé, un soutien et un tank appréciés."
          : "Groupe optimisé conseillé : tank, dégâts, soutien et placement.",
    keyResist: level < 100 ? ["Neutre", "Terre"] : ["Multi-élément", "Adapter selon le boss"],
    phases,
    tips: [
      "Inspectez les résistances du boss ci-dessous et tapez dans son point faible.",
      "Bloquez les cases d'invocation pour limiter le surnombre.",
      "Gardez de quoi soigner/relancer un allié pour la phase finale.",
    ],
    rewards: [
      "Ressources de craft du donjon",
      "Pièces d'équipement du set associé",
      "Succès & familiers liés au donjon",
    ],
  };
}

export function getDungeonGuide(
  id: number,
  name: string,
  level: number,
  monsterCount: number,
): { guide: DungeonGuide; authored: boolean } {
  // Les guides enrichis (DPLN, avec schémas) priment sur les guides rédigés de base.
  const authored = EXTRA_GUIDES[id] ?? GUIDES[id];
  if (authored) return { guide: authored, authored: true };
  return { guide: buildGenericGuide(name, level, monsterCount), authored: false };
}

// Un guide rédigé (non auto-généré) existe-t-il pour ce donjon ?
export function hasGuide(id: number): boolean {
  return Object.prototype.hasOwnProperty.call(GUIDES, id);
}
