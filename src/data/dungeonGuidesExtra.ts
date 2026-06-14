// Guides enrichis (stratégie détaillée + schémas) extraits de DofusPourLesNoobs.
// Générés depuis les pages DPLN publiques pré-nettoyées, puis filtrés pour ne garder que les schémas de stratégie.
// Le Comte Harebourg (71) reste dans dungeonGuides.ts : version relue à la main.
import type { DungeonGuide } from "./dungeonGuides";

export const EXTRA_GUIDES: Record<number, DungeonGuide> = {
  // Le Bouftou Royal est un boss de niveau bas aux mécaniques simples : il soigne ses alliés (
  1: {
    "summary": "Le Bouftou Royal est un boss de niveau bas aux mécaniques simples : il soigne ses alliés (jusqu'à 6PO) mais ne peut pas se soigner lui-même, et il a une IA fuyarde — il recule après avoir tapé. La stratégie principale consiste à le garder à distance pendant qu'on élimine ses acolytes un par un.",
    "recommendedLevel": "30",
    "composition": "Équipe quelconque. Des classes capables de pousser aident pour le succès Prudent. Pour le succès Duo, 2 personnages suffisent avec une bonne gestion de la distance et de la ligne de vue.",
    "keyResist": [
      "Air"
    ],
    "phases": [
      {
        "title": "Monstres du donjon",
        "mechanics": [
          "Boufton Blanc — Bavouille : retire 2 PA (3 cc) esquivables jusqu'à 3PO ; Machouillage : 45 dégâts air en mêlée.",
          "Boufton Noir — Crachouille : retire 2 PM (3 cc) esquivables jusqu'à 3PO ; Mordillement : 45 dégâts eau en mêlée.",
          "Bouftou — Bêlement : boost de 2 PM aux alliés au contact (à partir du tour 2, relance 3 tours) ; Morsure du Bouftou : 55 dégâts feu en mêlée.",
          "Bouftou Noir — Grognement : +20% dommages subis (ligne jusqu'à 6PO, relance 2 tours) ; Haleine du Bouftou : attire de 2 cases + 40 dégâts air en ligne jusqu'à 5PO ; Morsure Obscure : 50 dégâts neutre en mêlée.",
          "Chef de Guerre Bouftou — Fureur du Bouftou : s'avance de 3 cases + 50 dégâts terre en ligne jusqu'à 4PO ; Morsure de Guerre : 60 dégâts neutre en mêlée ; Ralliement de Guerre : attire tous les Bouftous d'une case vers la cible + -15% fuite (mêlée, tour 2+, relance 3 tours).",
          "Priorité : focus Bouftou Noir et Chef de Guerre Bouftou en premier (les plus dangereux).",
          "Éviter d'être en ligne ou en mêlée avec le Bouftou Royal pour ne pas subir ses soins sur ses alliés."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj63-bavouille_orig.png",
            "caption": "Zone d'effet Bavouille (Boufton Blanc)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj63-machouillage_orig.png",
            "caption": "Zone d'effet Machouillage (Boufton Blanc)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj63-crachouille_orig.png",
            "caption": "Zone d'effet Crachouille (Boufton Noir)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj63-mordillement_orig.png",
            "caption": "Zone d'effet Mordillement (Boufton Noir)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj63-belement_orig.png",
            "caption": "Zone d'effet Bêlement (Bouftou)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj63-grognement_orig.png",
            "caption": "Zone d'effet Grognement (Bouftou Noir)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj63-haleine-du-bouftou_orig.png",
            "caption": "Zone d'effet Haleine du Bouftou (Bouftou Noir)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj63-fureur-du-bouftou_orig.png",
            "caption": "Zone d'effet Fureur du Bouftou (Chef de Guerre Bouftou)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj63-ralliement-de-guerre_orig.png",
            "caption": "Zone d'effet Ralliement de Guerre (Chef de Guerre Bouftou)"
          }
        ]
      },
      {
        "title": "Sorts du Boss — Bouftou Royal",
        "mechanics": [
          "Cuirasse Laineuse : applique +70% dommages subis (55% cc) à un allié du boss pour 1 tour jusqu'à 7PO — éviter d'attaquer la cible sous cet effet.",
          "Guérison Bouftou : soigne un allié de 200 PV jusqu'à 6PO (modifiable), lançable 2 fois par tour, 1 fois par cible.",
          "Morsure du Bouftou Royal : 100 dégâts feu en mêlée uniquement ; si la cible est une invocation les dégâts deviennent un vol de vie.",
          "Le Bouftou Royal NE PEUT PAS se soigner lui-même.",
          "IA fuyarde : après avoir tapé, il recule — placer une invocation à son contact pour le faire reculer.",
          "Le boss a 5 PM : se tenir à au moins 7 cases de lui pour être hors de portée de mêlée."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj63-cuirasse-laineuse_orig.png",
            "caption": "Zone d'effet Cuirasse Laineuse"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj63-guerison-bouftou_orig.png",
            "caption": "Zone d'effet Guérison Bouftou"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj63-morsure-du-bouftou-royal_orig.png",
            "caption": "Zone d'effet Morsure du Bouftou Royal"
          }
        ]
      },
      {
        "title": "Stratégie globale",
        "mechanics": [
          "Phase de préparation : placer un personnage à contact du Bouftou Royal pour qu'il le tape et recule ; les autres restent éloignés.",
          "Garder le Bouftou Royal à distance (au moins 7 cases) tout au long du combat.",
          "Focus les monstres un par un : Bouftou Noir et Chef de Guerre Bouftou en priorité.",
          "Utiliser des invocations comme boucliers pour faire reculer le boss s'il se rapproche.",
          "Ne pas mettre un personnage avec agilité ou tacle au contact du boss (risque de le tacler).",
          "Le Bouftou Royal soigne 2 alliés par tour maximum : si nécessaire, bloquer sa ligne de vue sur la cible attaquée ou retirer sa PO.",
          "Une fois les autres monstres éliminés, focus tranquillement le boss en restant à distance."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj63-30placement-prepa_orig.jpg",
            "caption": "Exemple de placement en phase de préparation : un perso au contact du boss, les autres à distance"
          }
        ]
      }
    ],
    "tips": [
      "Entrée du donjon : Tainéla en [2,-34].",
      "Recette de la clef : 2× Corne de Boufton, 2× Laine de Boufton Noir, 2× Laine de Bouftou, 2× Laine du Chef de Guerre Bouftou, 2× Viande Frelatée, 2× Crabe Sourimi, 3× Sauge, 3× Orge.",
      "Pierre d'âme de capture 50 minimum recommandée pour capturer le boss.",
      "L'âme du Bouftou Royal est utile pour la quête du Dofus Ocre : L'éternelle moisson.",
      "Quêtes liées : Revenons à nos Bouftons, L'avis de la Mort.",
      "Familier Chacha : parler à un Chacha Hargneux après le combat et donner 5× Laine de Bouftou. Permet d'obtenir jusqu'à 70 puissance et 40 fuite."
    ],
    "rewards": [
      "Familier Chacha (5× Laine de Bouftou donnés à un Chacha Hargneux après le combat)",
      "Bouclier du Bouftou Royal (drop sur le boss lors d'événements week-end Ankama)"
    ],
    "achievements": [
      {
        "name": "Prudent",
        "strategy": "Les combattants alliés ne doivent jamais finir leur tour sur une cellule adjacente à celle d'un ennemi. Focus Bouftou et Chef de Guerre Bouftou en premier car ils ont une IA agressive (viennent en mêlée). Rester à distance, utiliser des sorts de poussée. Attention au Bouftou Noir qui attire en ligne et au Chef de Guerre Bouftou qui peut s'avancer sur vous.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/prudent.png"
      },
      {
        "name": "Blitzkrieg",
        "strategy": "Lorsqu'un ennemi est attaqué, il doit être achevé avant le début de son tour. Difficile à niveau 30 — plus facile avec plusieurs niveaux de plus, une team de 6 ou plus, ou beaucoup de dégâts. Commencer à attaquer un monstre juste après qu'il ait joué pour avoir un tour entier. Éviter de focus un monstre sous Cuirasse Laineuse. Une fois le boss seul, préparer un tour de boost pour le one-shot.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/blitzkrieg.png"
      },
      {
        "name": "Spécial : Un Mulou dans la Bergerie",
        "strategy": "Les ennemis ne doivent pas recevoir de soin. Éliminer le Bouftou Royal en premier (il est le seul soigneur), ou Blitz tous les monstres avant que le boss ne joue son tour. Au tour du Bouftou Royal, tous les alliés Bouftous doivent avoir leurs PV au max ou être morts.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 20 tours. Placer un perso au contact du boss en prépa. Focus les monstres rapidement ; si les dégâts sont insuffisants : taper tous les monstres (le boss ne peut en soigner que 2 par tour), bloquer la ligne de vue du boss avec un personnage/invocation/obstacle, ou retirer sa PO. Une fois les monstres morts, rester à distance du boss.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Le Maître Corbac est un boss aux résistances élevées dans tous les éléments (25-55%), part
  3: {
    "summary": "Le Maître Corbac est un boss aux résistances élevées dans tous les éléments (25-55%), particulièrement vulnérable en terre (25%). La mécanique principale est sa Carapace d'Ailes : au tour 3, il renvoie 400 dégâts et inflige des dégâts air en vol de vie AoE — il ne faut pas le taper pendant cet effet. La stratégie consiste à éliminer d'abord les monstres (Corbac Apprivoisé > Renarbo > Buveur), à tenir le boss à distance, et à débuffer la Carapace d'Ailes avant de finir le boss.",
    "recommendedLevel": "110",
    "composition": "Un personnage terre est fortement conseillé (seul élément à 25% de résistance). Des classes pouvant débuffer (Sadida, Pandawa) facilitent grandement le combat en retirant la Carapace d'Ailes et le Buvette du Buveur.",
    "keyResist": [
      "Terre (25% de résistance, 20% de moins que les autres éléments)"
    ],
    "phases": [
      {
        "title": "Phase d'exploration — Trouver les 3 monstres uniques",
        "mechanics": [
          "Le donjon comporte 16 salles en accès libre. Trouver 3 monstres uniques cachés parmi elles : Rono le Renarbo, Horace le Corbac Apprivoisé, Kapotie le Buveur.",
          "Chaque monstre unique ne se trouve qu'en un seul exemplaire. S'il est en combat, attendre son repop.",
          "Vaincre chaque unique confère une altération : Plume de Rono, Plume de Kapotie, Plume d'Horace.",
          "Faire les challenges sur les monstres uniques uniquement pour le succès Monstres.",
          "Une fois les 3 plumes obtenues, parler à Virgil dans la première salle pour accéder au Capsaaloocke puis au Maître Corbac (trousseau de clefs requis).",
          "NOTE : l'accès libre à la Bibliothèque ne nécessite pas de clef, mais le trousseau est requis pour les boss."
        ]
      },
      {
        "title": "Monstres du donjon — Sorts et particularités",
        "mechanics": [
          "Buveur — Buvette : lui et les alliés à son contact croix T1 gagnent 75% de résistances tous éléments pour 3 tours (4 en cc, débuffable). Relance 5 tours.",
          "Buveur — Daudoh : retire 2-3 PM et PA (3-4 en cc) à tous les personnages/invocations dans cercle T5 ; soigne les monstres alliés dans la zone de 160 PV. Relance 4 tours.",
          "Buveur — Parchotage : 160 dégâts eau vol de vie + repousse 5 cases dans croix T1 autour de lui. 1×/tour.",
          "Corbac Apprivoisé — Bousculade Plumeuse : 100 dégâts eau + 100 feu vol de vie, attire la cible 12 cases puis repousse 12 cases en ligne jusqu'à 12PO. 1×/cible. Dégâts de poussée élevés.",
          "Corbac Apprivoisé — Plumeau Déstabilisant : retire tous les envoûtements du Corbac et alliés croix T1. 1×/tour.",
          "Corbac Apprivoisé — Plumette : retire 30 esquive PA et PM (45 en cc) pour 3 tours en ligne jusqu'à 8PO. Relance 3 tours.",
          "Corbac — Cri Déstabilisateur : 100 dégâts air + retire tous les envoûtements de la cible en ligne jusqu'à 6PO. 1×/tour.",
          "Corbac — Dilacération : 200 dégâts terre (vol de vie en cc) en mêlée. Relance 2 tours.",
          "Corbac — Lancer d'oeuf : 140 dégâts terre en ligne jusqu'à 8PO. 1×/cible.",
          "Renarbo — Croassement : retire 100% résistances (150 en cc) dans un élément aléatoire (Terre/Feu/Eau/Air) pour 2 tours en ligne jusqu'à 6PO. 1×/cible. Les éléments les plus dangereux : terre et air (Corbac, Maître Corbac et Renarbo tapent dans ces éléments).",
          "Renarbo — Déplumage : 160 dégâts air, retire 60 esquive PA (90 en cc), vole 1-2 PA pour 1 tour en mêlée. 1×/cible.",
          "Renarbo — Ramage : Renarbo et alliés croix T1 gagnent 4PO (6 en cc) pour 3 tours. Relance 4 tours. Renarbo a 11PM — atteint facilement le corps à corps."
        ]
      },
      {
        "title": "Combat contre le Capsaaloocke",
        "mechanics": [
          "Mini-boss sans mécanique spéciale. NOTE : faire un challenge sur le Capsaaloocke pour le succès Monstres [Corbacs].",
          "Éclaireurs : lui et alliés cercle T5 gagnent 20 fuite, 1PM pour 2-3 tours et esquivent 100% des dégâts en mêlée en reculant d'une case pendant 1 tour (débuffable). Dévoile les invisibles. Relance 4 tours.",
          "Lancenglanté : 160 dégâts air, vole 100 agilité (150 en cc) pour 2 tours, applique un effet qui fait perdre 1PM à la cible à chaque dégât de poussée. Jusqu'à 8PO, 1×/tour.",
          "Saut du Bison : 160 dégâts terre + repousse 1 case en étoile T2 à 1PO, recule le Capsaaloocke d'une case par rapport à la cible lors de dégâts en mêlée. 1×/tour."
        ]
      },
      {
        "title": "Mécanique principale du boss — Carapace d'Ailes",
        "mechanics": [
          "Carapace d'Ailes : dès le tour 3 (puis tous les 4 tours), le Maître Corbac se recroqueville dans ses ailes pour 2 tours.",
          "Pendant cet effet : perd 12PA et 5PM (ne garde qu'1 PM de déplacement), renvoie 400 dégâts (800 en cc) à chaque attaque reçue (sauf poisons), et inflige 135 dégâts air en vol de vie (270 en cc) à tous les personnages et invocations sur la map à chaque début de son tour.",
          "NE PAS taper le boss pendant la Carapace d'Ailes — risque de renvoie fatal. Les poisons ne sont pas renvoyés.",
          "Les effets de la Carapace d'Ailes sont débuffables — utiliser des sorts de débuff pour la retirer et continuer le focus.",
          "Pendant la Carapace d'Ailes, profiter du temps pour repousser les monstres, se soigner et se repositionner.",
          "Lien Volatile : les monstres alliés dans cercle T2 gagnent 7-10% de critique (10-15 en cc) pour 6 tours, cumulable et débuffable. Le boss est affecté s'il est dans la zone. Jusqu'à 8PO sans LdV, 1×/tour.",
          "Sanction Ténébreuse : 350 dégâts air en mêlée (doublés en cc). 1×/cible. Garder le boss à distance !"
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark57mc28_orig.jpg",
            "caption": "Les effets de la Carapace d'Ailes sont débuffables"
          }
        ]
      },
      {
        "title": "Stratégie globale du combat contre le Maître Corbac",
        "mechanics": [
          "Tour 1 : éloigner le Buveur de ses alliés (repoussée, retrait PM, blocage par invocation) pour l'empêcher de donner les 75% de résistances. L'éliminer avant qu'il joue est idéal mais très difficile au niveau 110 car il joue juste après le boss.",
          "Focus recommandé : Corbac Apprivoisé en premier (dégâts élevés jusqu'à 12PO en ligne, dangereux). Pendant ce temps, garder le boss à distance et ignorer le Corbac invoqué.",
          "Ensuite : Renarbo (s'approche en mêlée dès le tour 2 avec ses 11PM). Ignorer les Corbac invoqués — le boss les réinvoque immédiatement.",
          "Tour 3 : Carapace d'Ailes — arrêter de taper le boss, débuffer si possible ou attendre le tour 5.",
          "Tour 4 : finir le Buveur (perd ses résistances, sauf si cc → attendre tour 5). Avant le tour 6, l'achever pour éviter sa seconde Buvette.",
          "Une fois les 3 monstres éliminés, finir le boss en le gardant à distance et en débuffant la Carapace d'Ailes à chaque fois qu'elle est active.",
          "Ne pas se booster inutilement — le Corbac invoqué retire les envoûtements à chaque tour.",
          "Modulation du donjon : tous les monstres (pas seulement le boss) sont affectés par la modulation. Entre butin 4 et 8 : double de PV et double de dégâts pour chaque monstre."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark57mc50_orig.jpg",
            "caption": "Bloquer le Buveur avec une invocation dès le tour 1"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark57mc40_orig.jpg",
            "caption": "Au tour 4 : focus le Buveur une fois ses résistances expirées"
          }
        ]
      }
    ],
    "tips": [
      "Clef du donjon (trousseau de clefs) requise pour affronter le Capsaaloocke et le Maître Corbac. Recette : 2 Plume de Buveur, 2 Plume de Corbac Apprivoisé, 2 Patte de Corbac, 2 Poil de Renarbo, 2 Viande Séchée, 2 Dorade Grise, 3 Edelweiss, 3 Seigle.",
      "Accès en [-15,-62] aux Pénates du Corbac. Parler à Virgil pour entrer.",
      "L'entrée dans la Bibliothèque est libre (sans clef), mais le trousseau est requis pour Virgil (accès boss) : \"Montrer les plumes, et utiliser le trousseau de clefs.\"",
      "Pierre d'âme de niveau 150 minimum recommandée pour capturer l'âme du boss (utile pour la quête du Dofus Ocre : L'éternelle moisson).",
      "Quête liée au donjon : Voler dans les plumes.",
      "Ne jamais éliminer les Corbac invoqués par le boss — il les réinvoque immédiatement au tour suivant, en perdant un PM pour rien.",
      "Le Maître Corbac ne tape qu'en mêlée (Sanction Ténébreuse) — le garder à distance annule l'essentiel de ses dégâts directs.",
      "Ne pas s'aligner en ligne avec le Corbac Apprivoisé : il attire + repousse jusqu'à 12 cases avec dégâts de poussée importants.",
      "Le malus de résistance du Renarbo (Croassement) est particulièrement dangereux en terre et air. Se débuffer ou s'éloigner si vous avez ce malus.",
      "Des classes de débuff (Sadida, Pandawa) simplifient grandement le combat : retrait de la Carapace d'Ailes, de Buvette et du malus Croassement.",
      "Le donjon est modulaire : tous les monstres (pas seulement le boss) sont affectés par la modulation. Butin 8 = double PV et double dégâts pour tous.",
      "NOTE : Depuis la refonte des challenges, le succès Collant ne se réalise plus avec des invocations — il faut être adjacent à un personnage ou compagnon allié."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Collant",
        "strategy": "Les combattants alliés doivent finir leur tour sur une cellule adjacente à celle d'un autre combattant allié (personnage ou compagnon, pas une invocation). Faire attention au Corbac Apprivoisé qui peut pousser les personnages loin les uns des autres (jusqu'à 12 cases), et au Daudoh du Buveur qui retire jusqu'à 4PM en zone.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/collant.png"
      },
      {
        "name": "Premier",
        "strategy": "Le Maître Corbac doit être achevé en premier. Plus facile en butin 8 (pas plus de monstres). Avoir des personnages terre pour le focus rapidement. Empêcher le Buveur d'utiliser Buvette sur le boss (l'éloigner, lui retirer des PM). Débuffer la Carapace d'Ailes au tour 3 pour continuer le focus. Éviter la mêlée avec le boss. Commencer à taper le boss dès le tour 1. Utiliser des poisons pendant la Carapace d'Ailes si pas de débuff. Le tour 6 : éviter que le Buveur relance Buvette sur le boss.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/premier.png"
      },
      {
        "name": "Maître Corbac sur un arbre perché",
        "strategy": "Les combattants alliés doivent terminer leur tour à 5PO ou moins d'un ennemi. Éliminer le Corbac Apprivoisé en premier (il peut pousser à l'autre bout de la map). Stratégie recommandée : placer tous les personnages près du Renarbo (IA agressive, ne s'enfuit jamais) et s'occuper du reste. Couplage avec Premier conseillé. Le Corbac a une IA fuyarde — ne pas compter dessus pour ce succès. Du retrait PM aide à maintenir les ennemis à portée.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 20 tours. Un personnage terre conseillé. Ordre de focus : Corbac Apprivoisé > Renarbo > Buveur. Garder le boss à distance, ignorer les Corbac invoqués, ne pas se placer en ligne avec le Corbac Apprivoisé, ne pas taper pendant la Carapace d'Ailes.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Le Minotoror est le boss du Centre du Labyrinthe du Minotoror, accompagné de ses mini-boss
  4: {
    "summary": "Le Minotoror est le boss du Centre du Labyrinthe du Minotoror, accompagné de ses mini-boss Déminoboule et Mominotor. Il est extrêmement résistant dans tous les éléments sauf la Terre (-20% de résistances), ce qui en fait l'élément de frappe privilégié. La stratégie repose sur la gestion des invocations ennemies (Tofus lancés, Dégelées), le maintien à distance du boss et de ses sbires, et le contrôle des déplacements.",
    "recommendedLevel": "Niveau non précisé (donjon accessible après avoir traversé le labyrinthe)",
    "composition": "Au moins un personnage frappant en Terre pour focus rapidement le Minotoror. Idéalement un deuxième personnage en Eau/Agilité pour gérer le Mominotor et le Déminoboule. Pour le duo, prévoir Terre + Eau/Air.",
    "keyResist": [
      "Terre (faiblesse -20% du Minotoror)",
      "Eau et Feu (faiblesse du Déminoboule)",
      "Air et Terre (faiblesse du Mominotor)"
    ],
    "phases": [
      {
        "title": "Navigation dans le labyrinthe (pré-donjon)",
        "mechanics": [
          "Le labyrinthe comporte 25 salles + 1 salle de départ (phénix). Il faut récupérer 2 reliques : Relique du Déminoboule et Relique du Mominotor, obtenues en battant ces deux mini-boss dans leurs salles respectives.",
          "Les reliques ne se cumulent pas : re-battre un mini-boss ne donne pas une seconde relique.",
          "Le levier de la salle du phénix contrôle TOUTES les grilles du labyrinthe — l'activer ferme tout. La grille principale reste ouverte 6 minutes.",
          "Méthode optimale à 2 joueurs : personnage A fait le tour du pourtour, personnage B fait les salles intérieures, chacun ouvrant les grilles pour l'autre via les leviers adjacents.",
          "Si bloqué : parler à Lorkos présent dans chaque salle pour retourner à l'entrée.",
          "Une fois les deux reliques obtenues, se rendre en salle 13 (centre) pour donner la clef et les reliques à Lorkos et accéder au boss."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj55-14labyrinthe_orig.jpg",
            "caption": "Schéma du labyrinthe du Minotoror (25 salles + phénix)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj55-17action1_orig.jpg",
            "caption": "Fonctionnement des leviers et grilles dans le labyrinthe"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj55-18laby-chemin-opti_orig.jpg",
            "caption": "Chemin optimal à 2 joueurs pour visiter toutes les salles"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj55-19labyrinthe-rejoindre_orig.jpg",
            "caption": "Comment rejoindre un allié dans une salle adjacente"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj55-20centre-2persos_orig.jpg",
            "caption": "Rejoindre le centre (salle 13) à 2 personnages"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj55-21centre-solo_orig.jpg",
            "caption": "Rejoindre le centre (salle 13) en solo"
          }
        ]
      },
      {
        "title": "Monstres du donjon : Déminoboule",
        "mechanics": [
          "Coup de Boulet : inflige 200 dégâts Terre, uniquement en ligne à exactement 2PO.",
          "Minorage : boost lui et ses alliés au contact de +201 à +300 Puissance (401 à 600 en CC) pour 2 tours, débuffable (relance 6 tours).",
          "Souffle Étourdissant : inflige 170 dégâts Terre, retire 201 à 250 Puissance (401 à 500 en CC) pour 3 tours et applique -2 à -3 PM/tour pendant 3 tours — uniquement en mêlée (relance 3 tours), débuffable.",
          "Souffle Libératoire : repousse les personnages en mêlée de 3 cases, autour de lui (1 fois/tour).",
          "DANGER : le malus de Puissance peut descendre jusqu'à -500 en critique. Garder le Déminoboule à distance absolument."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj55-coup-de-boulet_orig.png",
            "caption": "Portée et zone de Coup de Boulet (Déminoboule)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj55-minorage_orig.png",
            "caption": "Zone d'effet de Minorage (Déminoboule)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj55-souffle-etourdissant_orig.png",
            "caption": "Zone de Souffle Étourdissant (Déminoboule)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj55-souffle-liberatoire_orig.png",
            "caption": "Zone de Souffle Libératoire (Déminoboule)"
          }
        ]
      },
      {
        "title": "Monstres du donjon : Mominotor",
        "mechanics": [
          "Embaumement : inflige 200 dégâts Air + poison 50 dégâts Air/tour en vol de vie pour 5 tours — uniquement en mêlée, débuffable.",
          "Kanope : attire la cible de 7 cases, uniquement en ligne de 2 à 8PO (1 fois/cible).",
          "Lancer de Dégelée : invoque une Dégelée (960 PV) sur la case ciblée + inflige 80 dégâts Eau + repousse de 1 case — uniquement en ligne de 2 à 8PO (1 fois/tour). La Dégelée frappe en mêlée dans un élément aléatoire ou boost/soigne ses alliés.",
          "Malédiction du Mominotor : déclenche uniquement si une invocation ennemie est sur le terrain. Inflige 650 dégâts Feu en vol de vie à TOUTES les invocations, puis les OS (alliées ET ennemies). Transforme vos personnages en momie 2 tours + retire 3 PM/tour pendant 2 tours (6 PM en CC), débuffable (relance 6 tours).",
          "STRATÉGIE invocateurs : invoquer une invocation sacrifiée dès le tour 1 pour forcer la Malédiction du Mominotor, puis invoquer librement pendant 6 tours.",
          "STRATÉGIE non-invocateurs : ne pas invoquer du tout pour éviter de déclencher la Malédiction du Mominotor.",
          "Bloquer les 4 cases adjacentes au Mominotor en mêlée l'empêche d'utiliser Lancer de Dégelée (sort en ligne à 2PO minimum)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj55-embaumement_orig.png",
            "caption": "Zone d'Embaumement (Mominotor)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj55-kanope_orig.png",
            "caption": "Portée de Kanope — attraction 7 cases (Mominotor)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj55-lancer-degelee_orig.png",
            "caption": "Zone de Lancer de Dégelée (Mominotor)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj55-malediction-mominotor_orig.png",
            "caption": "Zone de Malédiction du Mominotor (toute la map si invocation ennemie présente)"
          }
        ]
      },
      {
        "title": "Monstres du donjon : Gamino et Scaratos",
        "mechanics": [
          "Gamino — Chevauchée Malicieuse : +10 PM et +100 Agilité pour 4 tours, sur lui-même, débuffable.",
          "Gamino — Coup de Sceptre : inflige 150 dégâts Terre + retire 3 PM pour 1 tour, en ligne jusqu'à 3PO (1 fois/cible).",
          "Gamino — Esprit d'équipe : boost lui et ses alliés (cercle rayon 2) de +50 Dommages et +2 PM pour 2 tours (relance 2 tours). Les boss spéciaux (Déminoboule, Mominotor, Minotoror) reçoivent +75 Dommages au lieu de +50.",
          "Scaratos — Cuticule : boost résistances (21-25%) et renvoi de 15 dégâts à ses alliés proches pour 2 tours (relance 6 tours), débuffable.",
          "Scaratos — Défonce : inflige 100 dégâts Air + retire 1PA — uniquement en mêlée (1 fois/cible).",
          "Scaratos — Recueillement : boost +1 à +2 PA et soin début de tour (200 PV) pour 6 tours à ses alliés proches (relance 6 tours), débuffable.",
          "Scaratos — Scaracornos : inflige 60 dégâts Terre + repousse de 3 cases — en mêlée (1 fois/cible)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj55-esprit-dequipe_orig.png",
            "caption": "Zone d'Esprit d'équipe (Gamino) — boost dégâts pour tous les alliés proches"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj55-cuticule_orig.png",
            "caption": "Zone de Cuticule (Scaratos) — boost résistances alliés"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj55-recueillement_orig.png",
            "caption": "Zone de Recueillement (Scaratos) — boost PA alliés"
          }
        ]
      },
      {
        "title": "Boss : Minotoror — Sorts et principes",
        "mechanics": [
          "Graines Magiques : boost une invocation alliée de +100 Vitalité et +50 Dommages pour 2 tours — jusqu'à 5PO (1 fois/tour), débuffable et non-cumulable.",
          "Lancer de Tofu : invoque un Tofu lancé (99 PV, 11 PM) sur la case ciblée + inflige 150 dégâts Neutre + repousse de 1 case le personnage présent — en ligne jusqu'à 10PO (1 fois/tour). Le Tofu frappe à 2PO max dans l'élément Air.",
          "Sabotage : inflige 600 dégâts Neutre (1000 en CC) + repousse de 6 cases — uniquement en mêlée (2 fois/tour, 1 fois/cible). Attention aux dégâts de poussée si un obstacle est proche.",
          "Résistances : 40 à 60% dans les éléments Neutre, Feu, Eau et Air. -20% de résistances dans l'élément Terre (faiblesse majeure).",
          "Le Minotoror invoque un Tofu lancé au début de chaque tour (maximum 4 sur le terrain simultanément).",
          "Il ne frappe qu'en mêlée (Sabotage) — éviter sa mêlée rend le combat beaucoup plus sûr."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj55-lancer-tofu_orig.png",
            "caption": "Portée de Lancer de Tofu (Minotoror) — en ligne jusqu'à 10PO"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj55-sabotage_orig.png",
            "caption": "Zone de Sabotage (Minotoror) — corps à corps, repousse 6 cases"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj55-23sabotage_orig.png",
            "caption": "Illustration du cumul dégâts directs + poussée de Sabotage"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj55-graines-magiques_orig.png",
            "caption": "Zone de Graines Magiques (Minotoror) — boost invocations alliées"
          }
        ]
      },
      {
        "title": "Stratégie globale du combat",
        "mechanics": [
          "Priorité de focus si personnage Terre dans l'équipe : Minotoror en premier (faiblesse -20% Terre), puis Mominotor (faiblesse Air/moins de résistances Terre), puis Déminoboule (faiblesse Eau/Feu).",
          "Priorité sans personnage Terre : focus Gamino en premier, puis selon les éléments disponibles.",
          "Déminoboule et Mominotor ont plus de PV que le Minotoror (en butin 4) — ne pas sous-estimer leur durabilité.",
          "Garder tous les ennemis à distance : ils sont dangereux en mêlée, peu menaçants à distance. Retirer des PM et pousser sont les outils clés.",
          "Gérer les Tofus invoqués progressivement — ils ont peu de PV (99 PV de base, 199 boostés) et peuvent être éliminés rapidement."
        ]
      }
    ],
    "tips": [
      "Clef du donjon : 2x Plume du Serpiplume, 2x Peau de Minoskito, 2x Peau de Kraméléhon, 2x Peau de Mandrine, 2x Viande Saignante, 2x Perche, 2x Graine de Pandouille, 2x Malt.",
      "Position : Île du Minotoror en [-42,-17], puis naviguer jusqu'au centre du labyrinthe.",
      "Quêtes liées : Des donjons, encore des donjons ; Taures et détours.",
      "Pierre d'âme : puissance 150 minimum pour capturer ce boss.",
      "L'âme de ce boss est utile pour la quête du Dofus Ocre (L'éternelle moisson).",
      "Le Dofus Pourpre ne drop plus sur ce boss — il s'obtient désormais par une série de quêtes.",
      "Ne pas se placer en mêlée du Minotoror : Sabotage peut infliger jusqu'à 1000 dégâts + dégâts de poussée contre un obstacle.",
      "Entourer complètement le Mominotor en mêlée l'empêche d'utiliser Lancer de Dégelée (portée min 2PO en ligne).",
      "Garder le Déminoboule à distance : son Souffle Étourdissant peut retirer jusqu'à 500 Puissance en critique (débuffable)."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Misanthrope",
        "strategy": "Les combattants alliés ne doivent jamais finir leur tour sur une cellule adjacente à celle d'un autre combattant allié. Éviter la mêlée du Déminoboule (retrait PM pouvant atteindre -5 PM en CC) et ne pas invoquer pour éviter que le Mominotor utilise Malédiction du Mominotor (retrait -3 à -6 PM). Éliminer les Tofus invoqués au fur et à mesure pour réduire le nombre d'alliés à éviter. Prévoir des sorts de déplacement (Libération minimum) pour se désengager des situations critiques.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/misanthrope.png"
      },
      {
        "name": "Mains propres",
        "strategy": "Les personnages alliés doivent achever les ennemis sans leur occasionner de dommages directs. Seuls les pièges, glyphes, poisons, dégâts de poussée, renvois et invocations sont autorisés. Recommandé avec Féca, Roublard, Osamodas, Sadida, Sram. Avant d'invoquer tout l'arsenal, invoquer d'abord des invocations sacrifiées pour forcer la Malédiction du Mominotor (relance 6 tours). Attention : achever une invocation ennemie (Tofu lancé, Dégelée) avec des dégâts directs fait aussi échouer le succès — les Tofus ont très peu de PV, ne pas les cibler avec des sorts de zone.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/mains-propres.png"
      },
      {
        "name": "Garde emplumée",
        "strategy": "Le Minotoror ne doit pas subir de dommages si au moins un de ses Tofus lancés est présent sur le terrain. Éliminer tous les Tofus présents avant chaque attaque sur le Minotoror. Les Tofus ont 99 PV de base (199 PV s'ils sont boostés par Graines Magiques) et 50% de résistances dans tous les éléments — faciles à éliminer en un coup. Deux approches : (1) éliminer tous les sbires en premier sans jamais toucher le Minotoror, puis éliminer les 4 Tofus et attaquer ; (2) avec un personnage Terre, focus direct sur le Minotoror — le joueur suivant élimine le(s) Tofu(s) invoqués après chaque tour du Minotoror.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 20 tours. Indispensable : un personnage Terre pour le Minotoror (40% rés. Neutre, -20% rés. Terre, 50% rés. Feu, 60% rés. Eau, 50% rés. Air). L'autre personnage idéalement en Eau/Agilité pour gérer le Mominotor et le Déminoboule. Éviter la mêlée du Déminoboule (retrait Puissance), ne pas invoquer si possible (risque de momification), éviter la mêlée du Minotoror (Sabotage + dégâts de poussée).",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Le Dragon Cochon est le boss de l'Antre du Dragon Cochon, accessible via un labyrinthe à [
  6: {
    "summary": "Le Dragon Cochon est le boss de l'Antre du Dragon Cochon, accessible via un labyrinthe à [-1,33] sur l'île des Porcos. Il frappe uniquement au CAC et lance Étourderie Mortelle à son premier tour — un sort dévastateur qui tue toute cible utilisant le moindre PA pendant 3 tours. La stratégie principale consiste à rester à distance en lui retirant ses PM.",
    "recommendedLevel": "Variable (donjon île des Porcos, mid-game)",
    "composition": "Aucune composition spécifique mentionnée. Un soin ou un sort de désenvoutement (Jouvence, Lait de Bambou) est très utile pour contrer Étourderie Mortelle.",
    "keyResist": [
      "Neutre",
      "Air"
    ],
    "phases": [
      {
        "title": "Salles 1-2 : Gaz Méphitique (traversée rapide)",
        "mechanics": [
          "Traverser les salles 1 et 2 très rapidement pour éviter la malédiction Gaz Méphitique.",
          "Gaz Méphitique : malédiction gênante appliquée si l'on reste trop longtemps dans ces salles."
        ]
      },
      {
        "title": "Salle 3 : Cochons de Farle et Porsalus",
        "mechanics": [
          "Cochon de Farle : frappe au CAC et retire des PA.",
          "Porsalu : frappe à distance en élément Agilité (Air) et applique l'état Affaibli (empêche l'utilisation du CAC)."
        ]
      },
      {
        "title": "Salle 5 : Don Dorgans",
        "mechanics": [
          "Don Dorgan : frappe en Feu et invoque des Cochons de Farle.",
          "Don Dorgan : applique un malus en esquive PA.",
          "Don Dorgan au CAC : applique un malus dans toutes les caractéristiques."
        ]
      },
      {
        "title": "Salle 9 : Don Duss Ang",
        "mechanics": [
          "Don Duss Ang : attire les joueurs au CAC.",
          "Don Duss Ang : vol de PV Eau au CAC.",
          "Don Duss Ang : applique un malus aux coups critiques."
        ]
      },
      {
        "title": "Salle 11 : Mini-boss Gorgouille",
        "mechanics": [
          "La Gorgouille est dans l'état Lourd.",
          "Glyphe automatique au début du combat autour du cercle formé par l'équipe.",
          "Le glyphe retire jusqu'à 4 PA si l'on commence son tour dessus.",
          "La Gorgouille pousse ou coopère les joueurs sur ses glyphes."
        ]
      },
      {
        "title": "Boss : Dragon Cochon",
        "mechanics": [
          "Étourderie Mortelle (1er tour) : inflige 750 dégâts Air + 750 dégâts Terre et applique l'état 'Étourderie Mortelle' pendant 3 tours — au bout de 2 tours la cible meurt et est remplacée par un Cochon de Farle. Se lance uniquement en mêlée. (relance 2 tours)",
          "Immobilisation : retire des PM (souvent tous) — permet de rattraper les joueurs qui gardaient leurs distances.",
          "Le Dragon Cochon frappe uniquement au CAC — rester à distance permet de ne jamais être touché.",
          "CAC + Poussée : s'il vous atteint, il pousse tout en frappant ; si la poussée percute un obstacle, dégâts supplémentaires.",
          "CAC critique très douloureux.",
          "Étourderie Mortelle est débuffable (Jouvence, Lait de Bambou).",
          "Écrasement Handicapant : réduit les résistances de 30% pendant 1 tour de tous les personnages et invocations sur le terrain puis inflige 2200 dégâts Terre. Tous les monstres alliés gagnent 500% de leur niveau en bouclier pour 3 tours. (relance 2 tours)",
          "Croutage : inflige 1000 dégâts Terre, repousse de 16 cases et applique Pesanteur 2 tours. Uniquement en mêlée. (1 fois par cible, 2 fois par tour)",
          "Porkorosouffle : 10% érosion 2 tours + 1200 dégâts Feu en cône taille 4 + poison 750 dégâts Feu 2 tours. En ligne jusqu'à 3PO sans LdV. (1 fois par tour)",
          "Cochonnerie : 900 dégâts Eau + glyphe cercle taille 3 appliquant l'état Insoignable + 1400 dégâts Eau à ceux qui commencent leur tour dans le glyphe. Jusqu'à 5PO sans LdV. (relance 2 tours)",
          "Grointimidation : donne 4PM (6 CC), 400 Puissance (600 CC) et 40 Tacle (60 CC) pour 1 tour à un allié. Jusqu'à 10PO sans LdV. (1 fois par tour)"
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png",
            "caption": "Tactique succès spécial : Faut pas pousser les cochons dans la confiture d'orties"
          }
        ]
      }
    ],
    "tips": [
      "Il faut 2 clefs pour entrer dans ce donjon : la Clef du Labyrinthe du Dragon Cochon (5x Charnière Cassée, 1x Deuxième partie de la clef, 1x Première partie de la clef, 5x Trident Cassé, 5x Coque Endommagée) et la Clef de l'Antre du Dragon Cochon (2x Peau de Don Dorgan, 2x Peau de Don Duss Ang, 2x Peau de Cochon de Farle, 2x Cuir de Porsalu, 2x Viande Exsudative, 2x Anguille, 2x Edelweiss, 2x Seigle).",
      "Rendez-vous en [-1,33] sur l'île des Porcos. Parlez à Fwoued pour accéder au labyrinthe puis à nouveau pour entrer dans le donjon (depuis le centre du labyrinthe).",
      "Pour capturer ce Boss, prévoyez une pierre d'âme de puissance 100 minimum.",
      "La capture de l'âme du Dragon Cochon est utile pour la quête du Dofus Ocre : L'éternelle moisson.",
      "Étourderie Mortelle est débuffable : des sorts comme Jouvence ou Lait de Bambou permettent de se désenvouteur et d'agir normalement.",
      "Le Dragon Cochon ne frappe qu'au CAC : lui retirer ses PM (ou ne pas se laisser immobiliser) est la stratégie principale pour ne jamais subir ses attaques.",
      "Attention à Cochonnerie (glyphe Insoignable) : ne pas débuter son tour dans la zone du glyphe.",
      "Quêtes liées : Un juge hystérique / Plongeon et dragon."
    ],
    "rewards": [
      "Le Dofus Turquoise se droppait autrefois sur le Dragon Cochon (0,02% de base) mais s'obtient désormais uniquement via une série de quêtes."
    ],
    "achievements": [
      {
        "name": "Faut pas pousser les cochons dans la confiture d'orties",
        "strategy": "Les alliés ne doivent pas recevoir de dommages de poussée. Ce succès revient à ne jamais être en mêlée avec le Dragon Cochon, car c'est le seul ennemi qui peut infliger des dommages de poussée. Attention également à ne pas s'infliger des dégâts de poussée entre alliés. Il est préférable d'éliminer le Dragon Cochon en premier.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // La Crocabulia est un boss sans invulnérabilité ni mécanique de seuil, dont la difficulté r
  7: {
    "summary": "La Crocabulia est un boss sans invulnérabilité ni mécanique de seuil, dont la difficulté repose sur l'effet Coquillettes Ula : tous les 4 tours, un monstre invoque une Coquille (Brutale, Protectrice, Soigneuse ou Véloce) qui booste les alliés et explose avec malus en zone si on la tue. La stratégie consiste à gérer intelligemment les Coquilles selon leur type, éliminer les monstres en priorité, et finir sur la Crocabulia.",
    "recommendedLevel": "Non précisé (Sanctuaire des Dragoeufs, Amakna)",
    "composition": "N'importe quelle composition standard. Deux classes damage dealer suffisent pour le succès Duo. Privilégier des classes capables de faire des dégâts pour éliminer rapidement les monstres.",
    "keyResist": [
      "Variable (voir résistances)"
    ],
    "phases": [
      {
        "title": "Effet Coquillettes Ula — Mécanique centrale",
        "mechanics": [
          "Tous les monstres (Crocabulia incluse) ont l'effet Coquillettes Ula : 1 chance sur 4 d'invoquer une Coquille au début de leur tour, avec une relance globale de 4 tours (invocations aux tours 1, 5, 9, etc.)",
          "Une seule Coquille peut être présente à la fois ; elle meurt automatiquement après 4 tours (état Passe Khal dégressif de 4 à 1)",
          "Renforcement Coquillesque : à chaque début de tour, la Coquille booste tous les monstres et la Crocabulia selon son type",
          "Coquille Brutale : +10% dommages finaux pour 4 tours aux monstres, +20% à Crocabulia (non-cumulable)",
          "Coquille Protectrice : +400% niveau en PB pour 1 tour aux monstres (débuffable), +800% à Crocabulia",
          "Coquille Soigneuse : soigne de 10% PV max les monstres, 20% pour Crocabulia",
          "Coquille Véloce : +2PM pour 4 tours aux monstres (non-cumulable), +4PM à Crocabulia",
          "Coup quillesque (si on tue la Coquille avant sa mort naturelle) : frappe 130 en zone cercle rayon 8 + malus selon type",
          "Brutale tuée : frappe Terre 130 + réduit dommages finaux de 20% | Protectrice : Eau 130 + augmente dommages subis de 20% | Soigneuse : Feu 130 + Insoignable | Véloce : Air 130 + retire 4PM",
          "La force et la durée du Coup quillesque varient selon le temps que la Coquille a passé sur le terrain : plus tôt elle est tuée, plus fort et plus long est l'effet"
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj54-12effets-coquilles_orig.png",
            "caption": "Effets des 4 types de Coquilles sur les monstres et la Crocabulia"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj54-14renforcement_orig.png",
            "caption": "Renforcement Coquillesque : boost appliqué par chaque coquille"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj54-13coup-quillesque_orig.png",
            "caption": "Coup quillesque : zone d'explosion et malus à la mort d'une Coquille"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj54-11passe-khal_orig.png",
            "caption": "État Passe Khal au-dessus de la Coquille indiquant ses tours restants"
          }
        ]
      },
      {
        "title": "Effet Éruption — Dragmatique",
        "mechanics": [
          "Uniquement sur le Dragmatique : à chaque fin de tour il lance une Éruption dont la puissance dépend de sa Pression magmatique restante",
          "Pression magmatique démarre à 3 au début de son tour et descend de 1 par sort lancé",
          "Pression 3 → Éruption Explosive : 230 feu en zone cercle rayon 2 | Pression 2 → Éruptive : 190 feu | Pression 1 → Éffusive : 120 feu | Pression 0 → Inoffensive",
          "Plus il utilise de sorts dans son tour, moins l'éruption est violente"
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj54-15eruption_orig.png",
            "caption": "Effet Éruption sur le Dragmatique"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj54-17evolution-eruption_orig.png",
            "caption": "Évolution de l'Éruption selon la Pression magmatique"
          }
        ]
      },
      {
        "title": "Sorts du Boss — Crocabulia",
        "mechanics": [
          "Crokenjambe : repousse alliés et ennemis de 3 cases (jusqu'à 3PO, 3 fois/tour, 2 fois/cible) ; si ennemi → 250 Air ; si allié → +100 Puissance pour 1 tour",
          "Pied Tinement : 200 Terre en zone cercle rayon 5 autour d'elle + boost alliés dans la zone de 2PA pour 1 tour (débuffable) ; relance 2 tours",
          "Souffle : cible un personnage en ligne jusqu'à 10PO (relance 3 tours) → 350 Feu direct + 250 Feu en cône de taille 5 (la cible prend les deux) + glyphe rouge dans le cône pour 2 tours (150 Feu si on termine son tour dedans)"
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj54-crokenjambe_orig.png",
            "caption": "Crokenjambe : portée et zone d'effet"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj54-pied-tinement_orig.png",
            "caption": "Pied Tinement : zone autour de Crocabulia"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj54-souffle_orig.png",
            "caption": "Souffle : cône feu + glyphe rouge"
          }
        ]
      },
      {
        "title": "Stratégie globale du combat",
        "mechanics": [
          "Dès le tour 1, la Crocabulia (premier à jouer) invoque une Coquille aléatoire",
          "Si Coquille Soigneuse ou Protectrice → éliminer rapidement en restant à plus de 8PO pour éviter le Coup quillesque",
          "Si Coquille Brutale ou Véloce → ignorer, attendre sa mort naturelle",
          "Éliminer les monstres accompagnateurs avant de focus la Crocabulia (les monstres ne sont pas très dangereux, le focus n'a pas d'importance particulière)",
          "Éliminer en priorité les monstres qu'on peut tuer le plus vite possible",
          "Une fois seule, focus Crocabulia en gérant les Coquilles au fil de leur invocation",
          "Éviter de terminer son tour dans le glyphe rouge du Souffle de Crocabulia"
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj54-18coquilles_orig.jpg",
            "caption": "Illustration du principe de combat avec les coquilles"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj54-19glyphe_orig.jpg",
            "caption": "Glyphe rouge posé par le Souffle de Crocabulia"
          }
        ]
      }
    ],
    "tips": [
      "Position du donjon : Amakna, Sanctuaire des Dragoeufs [-2,25]. Accès via le Kanojedo, parler à Ziho en [-4,24]",
      "Recette de la clef : 2x Peau de Dragueuse, 2x Peau de Dragnarok, 2x Corne de Dragacé, 2x Peau de Draguaindrop, 2x Perche, 2x Graine de Pandouille, 2x Malt, 2x Viande Saignante",
      "Pierre d'âme de puissance 150 minimum pour capturer le boss",
      "L'âme de Crocabulia est utile pour la quête du Dofus Ocre : L'éternelle moisson",
      "Quêtes liées : Des donjons, encore des donjons et Le forgeur de légende",
      "Les Coquilles frappent en zone cercle rayon 8 à leur mort : se placer à plus de 8PO de la Coquille avant de la tuer pour éviter dégâts et malus",
      "Croquille Brutale ou Véloce : préférer les ignorer jusqu'à leur mort naturelle (4 tours)",
      "Coquille Soigneuse ou Protectrice : éliminer rapidement pour éviter qu'elles ne ralentissent le focus"
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Versatile",
        "strategy": "Chaque combattant allié ne doit utiliser qu'une seule fois chaque action par tour. Rien dans le combat ne risque de faire échouer ce succès, tout repose sur la vigilance. Attention aux sorts qu'on utilise souvent plusieurs fois instinctivement : Picole/Karcham (Pandawa), Portail/Portail Flexible (Éliotrope).",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/versatile.png"
      },
      {
        "name": "Statue",
        "strategy": "Chaque combattant allié doit finir son tour sur la même case qu'au début de son tour, pendant tout le combat. Soigner son placement de départ pour avoir un angle d'attaque sur les monstres. Tous les monstres finissent par venir vers vous. Le glyphe de Crocabulia sera difficile à éviter mais ses dégâts sont raisonnables.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/statue.png"
      },
      {
        "name": "Spécial : En cassant des œufs",
        "strategy": "Les Coquilles invoquées doivent être achevées avant leur 3ème tour (état Passe Khal 4 ou 3) et aucun allié ne doit subir de dommage de leur explosion (rester à plus de 8PO de la Coquille quand on la tue). Éliminer chaque Coquille dès qu'elle est invoquée. La relance globale de 4 tours permet souvent d'éliminer tous les monstres avant qu'une 2ème Coquille ne soit invoquée.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 20 tours. N'importe quel duo convient, idéalement deux damage dealers. Gérer les Coquilles de soin/protection, éliminer les monstres rapidement puis la Crocabulia.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Le Tournesol Affamé est le boss de la Grange du Tournesol Affamé, situé dans les Champs d'
  8: {
    "summary": "Le Tournesol Affamé est le boss de la Grange du Tournesol Affamé, situé dans les Champs d'Astrub. Il est indéplaçable et invulnérable à distance, ce qui force à l'attaquer en mêlée tout en gérant ses invocations régulières.",
    "recommendedLevel": "30 — 60",
    "composition": "Composition flexible. Un Roublard est particulièrement utile pour taper le boss à distance via explosions de bombes posées en mêlée sans s'exposer directement. Les classes avec retrait PM peuvent ralentir le boss si nécessaire.",
    "keyResist": [
      "Neutre",
      "Air (boss faible en neutre : -5%)"
    ],
    "phases": [
      {
        "title": "Salles préliminaires — monstres des champs",
        "mechanics": [
          "Épouvanteur — Fuyez ! Pauvres fous ! : frappe eau au càc, retire 40 puissance pour 1 tour",
          "Épouvanteur — Protection des Champs : frappe air en ligne à 4PO max, attire de 3 cases",
          "Gardienne Champêtre — Désherbant : frappe feu en zone croix à 5PO max",
          "Gardienne Champêtre — Engrais : boost de 50 puissance et soin de 20 PV en cercle rayon 3 autour d'elle",
          "Pissenlit Diabolique — Herbe Sauvage : frappe feu en ligne à 5PO max, retire 2PM esquivables",
          "Pissenlit Diabolique — Zizou : frappe terre au càc",
          "Rose Démoniaque — Pétale Empoisonné : frappe terre + poison 10 dommages terre/3 tours à 3PO max",
          "Rose Démoniaque — Rose Épineuse : frappe eau, retire 1PA/PM esquivables au càc",
          "Tournesol Sauvage — Poison Sauvage : poison feu (1PA utilisé = 1PV perdu) à 6PO max",
          "Tournesol Sauvage — Racine Pivotante : frappe terre à 5PO max"
        ]
      },
      {
        "title": "Combat du boss — Tournesol Affamé",
        "mechanics": [
          "Appel des Champs : invoque un monstre du donjon tous les 6 tours",
          "Goinfrage : frappe eau en vol de vie au càc, se boost de 10 dommages pour 2 tours",
          "Soin Feuillu : soigne ses alliés de 50 PV en cercle rayon 2 autour de lui",
          "Le boss est indéplaçable et invulnérable à distance : il faut absolument l'attaquer en mêlée",
          "Si une invocation est à portée, il peut se téléporter sur elle (Ecodigestion)",
          "Stratégie idéale : éliminer le Tournesol Affamé dès le tour 1 pour éviter les invocations"
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/goinfrage-2_orig.png",
            "caption": "Zone d'effet du sort Goinfrage (mêlée, vol de vie)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/soin-feuillu_orig.png",
            "caption": "Zone d'effet du sort Soin Feuillu (cercle rayon 2)"
          }
        ]
      }
    ],
    "tips": [
      "Position du donjon : entrée dans les Champs d'Astrub en [7,-24]",
      "Recette de la clef : 2x Pétale de Rose Démoniaque, 2x Fleur de Pissenlit Diabolique, 2x Pétale de Tournesol Sauvage, 2x Langue d'Épouvanteur, 2x Viande Hachée, 2x Greuvette, 3x Ortie, 3x Blé",
      "Pour capturer le boss, prévoir une pierre d'âme de capture niveau 50 minimum",
      "La capture de l'âme du boss est utile pour la quête du Dofus Ocre : L'éternelle moisson",
      "Le boss est invulnérable à distance : rester loin de lui le rend totalement inoffensif",
      "Retrait PM utile pour limiter ses déplacements",
      "Un Roublard peut taper le boss via explosions de bombes posées en mêlée, sans s'y exposer directement",
      "Quête liée : Le tour du monde"
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Mauvaise graine",
        "strategy": "Les invocations du Tournesol Affamé doivent systématiquement être achevées avant le début de leur deuxième tour de jeu. L'idéal est d'éliminer le Tournesol Affamé dès le tour 1 pour ne pas avoir à gérer les invocations.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Le boss du Domaine Ancestral est l'Abraknyde Ancestral, accompagné des monstres du donjon 
  9: {
    "summary": "Le boss du Domaine Ancestral est l'Abraknyde Ancestral, accompagné des monstres du donjon (Abraknes Sombres, Araknotrons, Tronknydes, Champas). Il frappe au corps-à-corps, invoque des Araknes Majeures, retire de l'agilité et des PA, peut se reconstituer environ 2 000 PV, et empoisonne un allié (50 dégâts par PA utilisé). Le meilleur élément pour le vaincre est le feu, ou l'agilité si le personnage n'est pas affecté par le malus d'agilité.",
    "recommendedLevel": "Estimé ~100",
    "composition": "Prévoir un personnage capable de désenvoutement pour retirer l'empoisonnement PA. Privilégier des combattants feu ou agilité.",
    "keyResist": [
      "Feu",
      "Air (Agilité)"
    ],
    "phases": [
      {
        "title": "Salles 1 à 4 — Monstres du donjon",
        "mechanics": [
          "Abrakne Sombre : peut se téléporter, frappe au CAC en terre, retire des PA, invoque des Champas.",
          "Abraknyde Sombre : frappe à distance (~150 PDV), retire des PA, invoque des Tronknydes.",
          "Abraknyde Vénérable : possède Écrasement Handicapant, Reconstitution, Abraknassion et Écorce Blindée.",
          "Araknotron : booste les alliés en dommages et en PO, frappe à distance."
        ]
      },
      {
        "title": "Boss — Abraknyde Ancestral",
        "mechanics": [
          "Frappe au CAC dans les 150 PDV.",
          "Invoque des Araknes Majeures (poussent et débuffent les joueurs).",
          "Retire de l'agilité et des PA aux joueurs.",
          "Reconstitution : récupère environ 2 000 PV.",
          "Empoisonnement PA : empoisonne un allié — chaque PA dépensé lui inflige 50 dommages (très dangereux — prévoir un désenvouteur).",
          "L'AA a 53 % de résistances partout sauf en agilité et en feu → cibler ces éléments en priorité."
        ]
      }
    ],
    "tips": [
      "Clef du donjon : 2× Racine d'Abraknyde Sombre, 2× Racine d'Abraknyde Vénérable, 2× Écorce d'Abrakne Sombre, 2× Viande Rassie, 2× Kralamoure, 3× Orchidée Freyesque, 3× Lin.",
      "Accès : se rendre en [-9,-14] dans la Forêt Sombre, puis parler à Tronkny Baussope pour entrer.",
      "Pour capturer le boss, prévoir une pierre d'âme de puissance 100 minimum.",
      "La capture de l'âme de ce boss est utile pour la quête du Dofus Ocre : L'éternelle moisson.",
      "Quêtes liées : Munster lève le mystère, Un juge hystérique, Vengeance par procuration.",
      "Si un allié est empoisonné, lui faire passer son tour ou le désenvoutor immédiatement pour éviter des pertes de PV massives.",
      "Si l'Abraknyde Ancestral retire de l'agilité au personnage air, basculer sur un combattant feu."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Distance respectueuse",
        "strategy": "Les combattants alliés ne doivent avoir aucun ennemi situé à 3 PO ou moins d'eux lorsqu'ils infligent des dommages à un ennemi. Il faut rester à distance tout en faisant attention de rester également à distance des invocations ennemies (Champa, Arakne Majeure et Tronknyde).",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Le Chêne Mou est le boss de la Clairière du Chêne Mou, un arbre géant qui attire les perso
  10: {
    "summary": "Le Chêne Mou est le boss de la Clairière du Chêne Mou, un arbre géant qui attire les personnages en ligne puis frappe fort en eau, repousse, et peut taquer ou retirer des PA/PM. La stratégie consiste à éliminer d'abord les branches encombrantes (Branche Soignante en priorité, Branche Invocatrice), à garder le boss hors de portée, puis à le focus en eau et air une fois seul.",
    "recommendedLevel": "100 — 120",
    "composition": "Équipe avec érosion recommandée pour contrer les soins de la Branche Soignante. Prévoir du soin ou de la protection. Combat plus facile en Butin 6 ou plus (plus de personnages pour gérer les invocations). Un Enutrof peut aider à retirer la PO du boss.",
    "keyResist": [
      "Eau",
      "Air"
    ],
    "phases": [
      {
        "title": "Monstres du donjon (salles 1 à 4)",
        "mechanics": [
          "Abrakne Sombre Irascible : boost ses alliés en CC, se téléporte et frappe au CàC (élément terre) en retirant des PA, peut désenvoûter au CàC.",
          "Abraknyde Sombre Irascible : invoque des Tronknydes et des Arbres pour tacler, frappe à distance et au CàC en retirant des PA.",
          "Araknotron Irascible : frappe à distance en retirant des PM.",
          "Branche Invocatrice : invoque des monstres du donjon (+ éventuellement une Branche Soignante et une autre Branche Invocatrice).",
          "Branche Soignante : soigne fortement ses alliés et elle-même chaque tour (aucun PM) — à tuer en premier."
        ]
      },
      {
        "title": "Boss : Chêne Mou — Sorts et mécaniques",
        "mechanics": [
          "Attire les personnages en ligne avec lui puis frappe très fort en élément eau et les repousse.",
          "Frappe au CàC en élément agilité (air).",
          "Si personne n'est en ligne : tape à distance (élément terre, retire des PA), 3 fois par tour, une fois par personnage.",
          "Se booste fortement en PO, CC et dommages — désenvoutez-le et retirez-lui de la PO (Enutrof).",
          "Tornade de Branches : inflige dégâts air et repousse de 2 cases dans une zone cercle de taille 2 autour du Chêne Mou.",
          "Écorçage : inflige dégâts eau et vole 2 PM à la cible pour un tour (portée jusqu'à 10 PO).",
          "Branchele-Bas : échange de position avec un allié."
        ]
      },
      {
        "title": "Branche Invocatrice — Mécanique d'invocation",
        "mechanics": [
          "Invoque un monstre du donjon aléatoirement tous les deux tours à partir du tour 1.",
          "Tape neutre jusqu'à 10 PO en retirant 2 PA pour deux tours.",
          "Invulnérable tant que le Chêne Mou est en vie.",
          "Si la Branche Invocatrice invoque une autre Branche, cette dernière sera également invulnérable."
        ]
      },
      {
        "title": "Branche Soignante — Mécanique de soin",
        "mechanics": [
          "Soigne du 700 jusqu'à 4 monstres alliés par tour.",
          "Inflige des dégâts feu jusqu'à 10 PO.",
          "Applique un état sur un personnage : quand ce personnage utilise des PM, l'allié le plus proche est soigné (le soin se déclenche à chaque déplacement, pas à chaque PM utilisé en un seul coup).",
          "Astuce : si vous êtes sous cet état, ne bougez pas ou déplacez-vous vers un ennemi qui n'a pas perdu de PV."
        ]
      },
      {
        "title": "Stratégie globale du combat de boss",
        "mechanics": [
          "Placer les personnages avec le moins de PV au fond de la map.",
          "Éliminer en priorité les 2 Branches (Soignante d'abord, puis Invocatrice).",
          "Désenvoutez le Chêne Mou s'il se boost en PO, et retirez-lui de la PO (Enutrof).",
          "Retirer les PM du Chêne Mou pour éviter qu'il attire au CàC.",
          "Garder le Chêne Mou hors de portée de la team jusqu'à l'élimination des sbires.",
          "Focus final sur le Chêne Mou en prioritisant les sorts eau et air.",
          "Gérer les invocations de la Branche Invocatrice dès leur apparition si le boss tarde à tomber."
        ]
      }
    ],
    "tips": [
      "Accès : Forêt Sombre en [-14,-13], parler à Josette Taplane pour entrer et pour sortir.",
      "Clé : 10x Racine d'Abraknyde Sombre, 10x Racine d'Abraknyde Vénérable, 10x Écorce d'Abrakne Sombre, 2x Ginseng, 2x Lotte, 2x Chanvre, 2x Viande Macérée.",
      "Prévoir une pierre d'âme de niveau 150 minimum.",
      "La capture de l'âme du boss est utile pour la quête du Dofus Ocre : L'éternelle moisson.",
      "Quêtes liées : La voie du guerrier, Convoi humanitaire, Apprentissage : Adepte des Écrits (Bontarien ordre 3), L'art de la langue de bois, Plongeon et Dragon, Un pouvoir mérydique.",
      "Avoir de l'érosion est recommandé pour limiter les soins de la Branche Soignante sur le Chêne Mou.",
      "Le combat est plus facile en Butin 6 ou plus (plus de joueurs = invocations mieux gérées)."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Enchaînemou",
        "strategy": "Les alliés doivent terminer leur tour en ligne d'un ennemi. Éviter de finir en ligne trop souvent avec le Chêne Mou pour ne pas subir trop de dégâts. Il peut être intéressant d'éliminer le Chêne Mou en premier car une fois seul, il faudra forcément finir son tour en ligne avec lui.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Le Clos des Blops propose 4 Blops Royaux (Coco, Griotte, Indigo, Reinette) à affronter sép
  11: {
    "summary": "Le Clos des Blops propose 4 Blops Royaux (Coco, Griotte, Indigo, Reinette) à affronter séparément, chacun ayant 94% de résistance dans son propre élément. La stratégie consiste à cibler l'élément adverse du boss choisi, à éliminer en priorité le Blopignon puis le Tronkoblop, et à surveiller les invocations (notamment le Gloutoblop qui OS en mêlée). En option, le Blop Multicolore Royal accompagné des 4 Blops Royaux peut être affronté après le boss principal.",
    "recommendedLevel": "60",
    "composition": "Au moins 2 personnages jouant dans des éléments différents est conseillé, surtout si l'objectif est de faire les 4 Blops Royaux à la suite. Pour le succès Prudent, des classes avec mobilité et sorts de placement sont utiles.",
    "keyResist": [
      "Éviter l'élément du Blop Royal choisi (94% de résistance dans son propre élément)",
      "Coco : éviter Air, frapper dans un autre élément",
      "Griotte : éviter Feu, frapper dans un autre élément",
      "Indigo : éviter Eau, frapper dans un autre élément",
      "Reinette : éviter Terre, frapper dans un autre élément",
      "Chaque Blop Royal a 12% de faiblesse dans tous les autres éléments"
    ],
    "phases": [
      {
        "title": "Salles 1 à 4 — Blops et sbires",
        "mechanics": [
          "Les salles contiennent des Blops (Coco/Griotte/Indigo/Reinette) accompagnés de Biblops, Blopignons, Gloutoblops et Tronkoblops",
          "Bibloperie (Blops) : 80 dégâts dans l'élément du Blop, ligne, 2PO sans LdV, 1 fois par cible",
          "Blyphe : retire 1PM, zone croix taille 1 + glyphe blanc 2 tours — si on finit son tour dessus : 60 dégâts + 1PM retiré. 14PO modifiable",
          "Biblopition : invoque un Biblop de même élément à 1PO (relance 5 tours)",
          "Cache Biblop : rend toutes les invocations alliées invisibles pendant 2 tours, cercle taille 5, 12PO",
          "Bloblo (Blopignon) : 85 dégâts air + vole 1PM, mêlée, 1 fois par tour",
          "Blopiction (Blopignon) : 140 dégâts eau + retire 4PO (6 en crit) pour 3 tours, 12PO modifiable, relance 3 tours",
          "Bloprojection (Blopignon) : 40 dégâts terre anneau taille 2 + poison terre (13 dégâts par PM utilisé pendant 1 tour), autour de lui",
          "Gloutage (Gloutoblop) : OS en mêlée toute cible sauf boss et autres Gloutoblops — peut tuer ses alliés et gagner PM+vitalité à chaque kill",
          "Blopium (Tronkoblop) : dévoile les invisibles cercle taille 3, +10 esquive PM aux alliés",
          "Blopsoin (Tronkoblop) : soigne 100PV le Tronkoblop et ses alliés proches, relance 2 tours",
          "Blopzone (Tronkoblop) : 100 dégâts feu cercle taille 3 + 1PM aux alliés",
          "Ne pas finir son tour sur un glyphe blanc posé par un Blop"
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj62-bibloperie_orig.png",
            "caption": "Bibloperie — zone d'effet"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj62-blyphe_orig.png",
            "caption": "Blyphe — glyphe blanc et perte de PM"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj62-cache-biblop_orig.png",
            "caption": "Cache Biblop — rend les invocations invisibles"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj62-bloblo_orig.png",
            "caption": "Bloblo (Blopignon) — OS + vol PM mêlée"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj62-blopiction_orig.png",
            "caption": "Blopiction (Blopignon) — dégâts eau + retrait PO"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj62-bloprojection_orig.png",
            "caption": "Bloprojection (Blopignon) — poison terre par PM"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj62-gloutage_orig.png",
            "caption": "Gloutage — OS en mêlée, peut tuer les alliés"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj62-blopium_orig.png",
            "caption": "Blopium (Tronkoblop) — dévoile invisibles + esquive PM"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj62-blopsoin_orig.png",
            "caption": "Blopsoin (Tronkoblop) — soin 100PV zone"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj62-blopzone_orig.png",
            "caption": "Blopzone (Tronkoblop) — 100 dégâts feu zone"
          }
        ]
      },
      {
        "title": "Choix du Blop Royal et résistances",
        "mechanics": [
          "Après la salle 4, parler à Bibiblop pour choisir la couleur du Blop Royal à affronter (Coco/Griotte/Indigo/Reinette)",
          "Le choix est définitif pour le donjon en cours — se mettre d'accord en équipe avant",
          "Chaque Blop Royal a 94% de résistance dans son élément et 12% de faiblesse dans tous les autres",
          "Reinette : résistances Terre. Griotte : résistances Feu. Indigo : résistances Eau. Coco : résistances Air",
          "Petit rappel : chaque boss a presque 100% de résistance dans son élément de prédilection"
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj62-8_orig.jpg",
            "caption": "Tableau des résistances des 4 Blops Royaux par élément"
          }
        ]
      },
      {
        "title": "Combat contre le Blop Royal",
        "mechanics": [
          "Blopunition Royale : 120 dégâts vol de vie dans l'élément du Blop Royal + vole 1PM (2 en crit) pour 1 tour, 4PO modifiable",
          "Blotection : donne 100% de résistances dans son élément à un allié pour 3 tours (6 en crit), 4PO, relance 3 tours",
          "Blovocation : invoque aléatoirement un Blop du donjon (Biblop, Blop, Blopignon, Gloutoblop ou Tronkoblop), 2PO, relance 3 tours",
          "Gloutoblop invoqué : environ 4.5% de chance — le garder loin de votre équipe OU le laisser faire le ménage sur les alliés (il ne peut pas manger son invocateur)",
          "Si un Gloutoblop est invoqué, il gagne PM et vitalité à chaque kill — ne pas le laisser trop grossir",
          "Priorité : Blopignon en premier (tape le plus fort, peu de PV), puis Tronkoblop (soigne mais peu dangereux), puis le Blop Royal",
          "Si le Blop classique fuit dès le tour 1, le laisser et l'éliminer en dernier",
          "Ne pas finir son tour sur les glyphes blancs posés par le Blop classique"
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj62-blopunition-royale_orig.png",
            "caption": "Blopunition Royale — dégâts + vol PM"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj62-blotection_orig.png",
            "caption": "Blotection — 100% résistances à un allié"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj62-blovocation_orig.png",
            "caption": "Blovocation — invocation aléatoire d'un Blop"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj62-30gloutage1_orig.png",
            "caption": "Mécanique du Gloutoblop invoqué — danger en mêlée"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj62-31gloutage2_orig.png",
            "caption": "Gloutoblop — OS ses alliés et grossit à chaque kill"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj62-32blotection_orig.png",
            "caption": "Blotection appliquée à un allié — résistances 100%"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj62-35glyphe-blanc_orig.jpg",
            "caption": "Glyphe blanc — éviter d'y finir son tour"
          }
        ]
      },
      {
        "title": "Option : Blop Multicolore Royal",
        "mechanics": [
          "Après le boss, Bibiblop permet d'affronter le Blop Multicolore Royal accompagné des 4 Blops Royaux, ou de sortir du donjon",
          "Le Blop Multicolore est de niveau 120 — combat plus difficile qu'un Blop Royal individuel à niveau 60",
          "Conseil : entrer dans la salle même si on ne combat pas, pour obtenir la sauvegarde de progression",
          "Si succès Donjons Avancés en cours : attendre d'être au dernier donjon Blop pour prendre la sauvegarde",
          "Vaincre le Blop Multicolore donne un morceau de clef permettant de craft la Clef de l'Antre du Blop Multicolore"
        ]
      }
    ],
    "tips": [
      "Position du donjon : entrée au Lac de Cania en [-7,-43]",
      "Recette de la clef : 1x Bout de Blop Coco, 1x Bout de Blop Griotte, 1x Bout de Blop Indigo, 1x Bout de Blop Reinette, 5x Bois de Chêne, 5x Kobalte, 5x Menthe Sauvage, 5x Houblon",
      "Pierre d'âme de puissance 100 minimum pour capturer le boss",
      "La capture de l'âme du boss est utile pour la quête du Dofus Ocre : L'éternelle moisson",
      "Pour les 4 Blops Royaux, il faut refaire le donjon 4 fois (un par run) — avoir au moins 2 éléments différents dans l'équipe",
      "Avoir le sort commun Libération est utile pour le succès Prudent (permet de pousser les ennemis)",
      "Si succès Donjons Avancés en cours : attendre d'être au dernier donjon Blop pour prendre la sauvegarde dans la salle du Blop Multicolore",
      "Quêtes liées : Entre quatre blops, Le Tabi d'Amayiro"
    ],
    "rewards": [
      "Morceau de Clef de couleur (craft de la Clef de l'Antre du Blop Multicolore)",
      "Âme du boss (utile pour la quête du Dofus Ocre — L'éternelle moisson)"
    ],
    "achievements": [
      {
        "name": "Duel",
        "strategy": "Lorsqu'un combattant allié attaque un ennemi, aucun autre allié ne doit attaquer cet ennemi pendant tout le combat. Attribuer un monstre à chaque personnage. Laisser le Blop fuir et s'en occuper en dernier. Attention aux invocations (Chaferfu, etc.) qui peuvent faire échouer le succès.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duel.png"
      },
      {
        "name": "Prudent",
        "strategy": "Les combattants alliés ne doivent jamais finir leur tour sur une case adjacente à celle d'un ennemi. Attention aux invocations invisibles (Cache Biblop). Utiliser le sort commun Libération pour pousser les ennemis. Des classes avec mobilité sont conseillées.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/prudent.png"
      },
      {
        "name": "Spécial : Touche pas à mon blop",
        "strategy": "Les invocations ennemies ne doivent subir aucun dommage. Faire attention aux dégâts de zones, aux dommages de poussée, et aux invocations personnelles. Attention aux invocations rendues invisibles par le Blop.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 20 tours. Faire les 4 donjons avec 2 personnages jouant dans des éléments différents. Priorité : Blop si possible → Blopignon → Tronkoblop → Blop Royal.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // La Bworkette est le boss du Donjon des Bworks : c'est un tank avec de nombreuses résistanc
  13: {
    "summary": "La Bworkette est le boss du Donjon des Bworks : c'est un tank avec de nombreuses résistances et une forte capacité de soin. La stratégie consiste à éliminer d'abord les Bwork Mage et Bwork Archer (les plus dangereux), puis à finir la Bworkette en eau pour contourner ses résistances élevées.",
    "recommendedLevel": "50",
    "composition": "Avoir au moins un personnage tapant en eau est conseillé (résistance eau de la Bworkette la plus faible à 18%). Éviter les personnages feu (48% de résistance feu). Un personnage avec retrait PM est utile. Des sorts réduisant les soins (Puissance Sylvestre du Sadida, Hémorragie du Sacrieur) sont un atout.",
    "keyResist": [
      "Eau (résistance la plus faible : 18%)"
    ],
    "phases": [
      {
        "title": "Monstres du donjon — Bwork",
        "mechanics": [
          "Éventration : 150 dégâts neutre uniquement en mêlée (2 fois/tour, 1 fois/cible)",
          "Rage : augmente les dommages du Bwork de 6 à 20 pendant 3 tours (relance 4 tours)",
          "Soufflette : repousse les cibles autour de la case ciblée d'une case, 2 à 8 PO sans ligne de vue (relance 2 tours)"
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj65-eventration_orig.png",
            "caption": "Éventration — zone d'effet en mêlée"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj65-rage_orig.png",
            "caption": "Rage — boost dommages"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj65-soufflette_orig.png",
            "caption": "Soufflette — poussée zone"
          }
        ]
      },
      {
        "title": "Monstres du donjon — Bwork Archer",
        "mechanics": [
          "Flèche Trouveuse : 55 dégâts air, jusqu'à 8 PO (modifiable) sans LdV (1 fois/cible)",
          "Maîtrise des Armes de Jet : +60 dommages (70 critique) à lui-même ou un allié pendant 3 tours, jusqu'à 6 PO sans LdV (relance 5 tours)",
          "Projectile Puissant : +250 puissance (290 critique) pendant 3 tours, jusqu'à 6 PO (relance 6 tours)"
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj65-fleche-trouveuse_orig.png",
            "caption": "Flèche Trouveuse — portée"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj65-maitrise-armes-jet_orig.png",
            "caption": "Maîtrise des Armes de Jet — boost dommages allié"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj65-projectile-puissant_orig.png",
            "caption": "Projectile Puissant — boost puissance allié"
          }
        ]
      },
      {
        "title": "Monstres du donjon — Bwork Mage",
        "mechanics": [
          "Éclair en Série : 30 dégâts feu (air en critique) zone cercle taille 2, de 3 à 6 PO",
          "Invocation de Tofu Maléfique : invoque un Tofu Maléfique uniquement à 1 PO (relance 3 tours)",
          "Tornade : 80 dégâts air et repousse la cible de 5 cases uniquement en mêlée (1 fois/cible)"
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj65-eclair-en-serie_orig.png",
            "caption": "Éclair en Série — zone feu"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj65-invocation-tofu-malefique_orig.png",
            "caption": "Invocation de Tofu Maléfique — position"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj65-tornade_orig.png",
            "caption": "Tornade — poussée en mêlée"
          }
        ]
      },
      {
        "title": "Monstres du donjon — Tofu Maléfique (invoqué par Bwork Mage)",
        "mechanics": [
          "Béco Maléfique : 50 dégâts air et retire 10 tacle (15 critique) pour 1 tour jusqu'à 2 PO (1 fois/cible) ; sur invocations : vol de vie",
          "Maléfice : 20% d'érosion (30 critique) + état Insoignable pour 1 tour en zone croix taille 1, jusqu'à 3 PO (relance 2 tours)"
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj65-beco-malefique_orig.png",
            "caption": "Béco Maléfique — portée et effet"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj65-malefice_orig.png",
            "caption": "Maléfice — érosion + Insoignable"
          }
        ]
      },
      {
        "title": "Boss — Bworkette : sorts",
        "mechanics": [
          "Abolition : 500 dégâts neutre sur une invocation, jusqu'à 4 PO (relance 5 tours)",
          "Charge : 110 dégâts terre en mêlée + la Bworkette gagne 5 dommages pendant 5 tours (relance 2 tours)",
          "Mot Croisé : 100 dégâts feu sur ennemis et soigne alliés de 100 en zone croix taille 3, jusqu'à 6 PO (2 fois/tour)",
          "Rage : +16 à 20 dommages pendant 3 tours (relance 4 tours)",
          "Reconstitution Bwork : soigne 50% PV max (75% en critique) uniquement en ligne jusqu'à 7 PO (relance 6 tours)"
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj65-abolition_orig.png",
            "caption": "Abolition — ciblage invocation"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj65-charge_orig.png",
            "caption": "Charge — mêlée terre"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj65-mot-croise_orig.png",
            "caption": "Mot Croisé — zone croix taille 3, dégâts + soin"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj65-rage-bworkette_orig.png",
            "caption": "Rage — boost dommages Bworkette"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj65-reconstitution-bwork_orig.png",
            "caption": "Reconstitution Bwork — gros soin en ligne"
          }
        ]
      },
      {
        "title": "Boss — Bworkette : mécanique de combat",
        "mechanics": [
          "Tank avec de nombreuses résistances (feu 48%, eau 18% la plus faible)",
          "Mot Croisé : utilisable 2 fois/tour, soigne 100 PV et tape en zone croix taille 3 jusqu'à 9 PO de portée effective",
          "Reconstitution Bwork : soigne 50% des PV max, disponible tous les 6 tours — peut cibler un allié",
          "Abolition : élimine une invocation tous les 5 tours",
          "Sensible au retrait PM (seulement 10 d'esquive PM)"
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj65-30mot-croise_orig.png",
            "caption": "Mot Croisé — portée effective jusqu'à 9 PO via zone croix 3"
          }
        ]
      },
      {
        "title": "Stratégie globale",
        "mechanics": [
          "Éliminer d'abord le Bwork Mage et le Bwork Archer (les plus dangereux)",
          "Garder la Bworkette et le(s) Bwork à distance pendant ce temps",
          "Le Bwork n'est dangereux qu'en mêlée : facile à tenir à distance",
          "Espacer les personnages pour limiter la rentabilité de Mot Croisé (zone croix 3)",
          "Laisser un monstre bas en PV pour forcer la Reconstitution Bwork dessus (puis 6 tours sans soin)",
          "Si dégâts insuffisants pour tuer en 6 tours : éroder et/ou utiliser des sorts réduisant les soins avant la Reconstitution"
        ]
      }
    ],
    "tips": [
      "Position du donjon : entrée dans le Village des Bworks en [-5,10]",
      "Recette de la clef : 2x Poils de Barbe du Bwork Mage, 2x Épaulière de Bwork, 2x Slip de Bwork Archer, 2x Bière Bwork, 2x Viande Tendre, 2x Poisson-Chaton, 3x Trèfle à 5 feuilles, 3x Avoine",
      "Capture du boss : pierre d'âme de puissance 50 minimum requise",
      "L'âme de la Bworkette est utile pour la quête du Dofus Ocre : L'éternelle moisson",
      "À la fin du donjon, vous obtenez automatiquement l'émote Pointer du doigt",
      "Salle de transition (cachot) : ne pas combattre le Trooll Apprivoisé ni Kreuvète la Bwork Ingénue — cliquer directement sur la porte",
      "Retrait PM très efficace sur la Bworkette (10 d'esquive PM seulement)",
      "Éviter les sorts feu (Bworkette : 48% résistance feu)",
      "Sorts réduisant les soins utiles : Puissance Sylvestre (Sadida), Hémorragie (Sacrieur)",
      "Érosion utile en duo ou avec peu de stuff : Pression (Iop), Belote (Écaflip), Charogne (Ouginak)"
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Misanthrope",
        "strategy": "Ne jamais finir son tour sur une cellule adjacente à un allié. Succès simple, conseillé si vous ne l'avez pas. Depuis la refonte des challenges, finir au contact d'une invocation n'échoue plus le succès.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/misanthrope.png"
      },
      {
        "name": "Premier",
        "strategy": "La Bworkette doit être achevée en premier. Il faut lui infliger un maximum de dégâts dès le tour 1 (utiliser des sorts réduisant les soins pour limiter sa Reconstitution au tour 2). Un personnage eau est conseillé. Tenir les autres Bworks à distance pendant ce temps.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/premier.png"
      },
      {
        "name": "Tombés sous le charme",
        "strategy": "Les ennemis ne doivent être achevés que par des combattants dans l'état Insoignable. La seule source d'Insoignable dans le combat est le Tofu Maléfique invoqué par le Bwork Mage (un tour sur deux). Laisser le Bwork Mage en vie jusqu'à la fin. Alternatives : sorts Prohibition, Berserk, Mot de Reconstitution, Fougue, ou compagnon Inferno (sort Enclutte).",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 20 tours. Un personnage eau est conseillé pour éliminer rapidement la Bworkette. Même stratégie : monstres d'abord, Bworkette en dernier.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      },
      {
        "name": "Les pandaliens",
        "strategy": "Vaincre avec 4 personnages minimum dont au moins un compagnon parmi : Mirh, Rekto Topi, Traçon ou Logram. Peut se faire avec 2 personnages + 2 compagnons (un obligatoirement parmi ceux listés, le second au choix).",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/compagnon2.png"
      }
    ]
  },
  // Le Bworker est un boss qui frappe exclusivement au corps à corps, avec des coups extrêmeme
  14: {
    "summary": "Le Bworker est un boss qui frappe exclusivement au corps à corps, avec des coups extrêmement puissants (jusqu'à 2400 en neutre). La stratégie consiste à l'empêcher d'atteindre le càc de vos personnages, soit par retrait de PM, soit en le bloquant dans un coin avec des monstres bien placés.",
    "recommendedLevel": "100 — 120",
    "composition": "Un Enutrof retrait PM est idéal pour légumiser le Bworker à chaque tour. Un Pandawa ou toute classe avec des sorts de placement (poussée/déplacement) est très utile pour bloquer le boss dans un coin. Des personnages avec un bon tacle sont nécessaires pour maintenir les monstres bloqueurs en place.",
    "keyResist": [
      "Neutre"
    ],
    "phases": [
      {
        "title": "Monstres du donjon — Élémentaires Bwork",
        "mechanics": [
          "Épée Céleste Bwork (Bwork Élémentaire Air) : 250 dégâts air en cercle rayon 2, retire 200 puissance pour 1 tour. Portée 3PO en ligne, LDV requise.",
          "Larme Bwork (Bwork Élémentaire Eau) : 350 dégâts eau, retire 2PM esquivables pour 1 tour. Portée 15PO en ligne, sans LDV.",
          "Poussière Temporelle Bwork (Bwork Élémentaire Feu) : 280 dégâts feu en cercle rayon 2, retire 4PA esquivables pour 1 tour. Portée 12PO, LDV requise. Dispersez vos personnages pour éviter les pertes massives de PA.",
          "Épée du Bwork (Bwork Élémentaire Terre) : 250 dégâts terre en croix taille 3, met 20% d'érosion pour 2 tours. Portée 5PO en ligne, LDV requise.",
          "Sollicitude Élémentaire (tous Bworks) : Invoque une Flammèche qui attire de 4 cases un ennemi (2–5PO), puis s'immole au càc pour ~500 dégâts (1000 en cc). Éliminez la flammèche rapidement ou positionnez-vous hors de sa portée d'attraction.",
          "Communion Élémentaire : Booste l'invocation de 50% de vitalité — la rend encore plus dangereuse si elle explose sur vos personnages."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/epee-celeste-bwork_orig.png",
            "caption": "Schéma de portée — Épée Céleste Bwork (air, cercle R2)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/sollicitude_orig.png",
            "caption": "Schéma — Sollicitude Élémentaire Venteuse (invocation Flammèche)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/larme-bwork_orig.png",
            "caption": "Schéma de portée — Larme Bwork (eau, retrait PM)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/sollicitude_1_orig.png",
            "caption": "Schéma — Sollicitude Élémentaire Aqueuse (invocation Flammèche)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/poussiere-temporelle-bwork_orig.png",
            "caption": "Schéma de portée — Poussière Temporelle Bwork (feu, retrait PA)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/sollicitude_2_orig.png",
            "caption": "Schéma — Sollicitude Élémentaire Fumeuse (invocation Flammèche)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/epee-du-bwork_orig.png",
            "caption": "Schéma de portée — Épée du Bwork (terre, érosion 20%)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/sollicitude_3_orig.png",
            "caption": "Schéma — Sollicitude Élémentaire Terreuse (invocation Flammèche)"
          }
        ]
      },
      {
        "title": "Monstres du donjon — Cybwork et Mama Bwork",
        "mechanics": [
          "Cybarmure : Se booste de 510 PB et réduit ses dégâts subis de 6 (9 en cc) pour 2 tours.",
          "Don de Soi : Intercepte les dégâts subis par ses alliés en cercle rayon 2 pour 2 tours. Portée 5PO sans LDV. Tuez-le avec des sorts de frappe en zone qui touchent aussi les monstres qu'il protège.",
          "Pulsation : 550 dégâts terre, retire 2PM pour 1 tour. Portée 6PO en ligne, LDV requise. Évitez de rester en ligne de vue avec lui.",
          "Mama Bwork — Couperet : 250 dégâts air en ligne perpendiculaire + boost de 200 puissance pour 2 tours (cumulable). Sort uniquement au càc. Évitez son càc.",
          "Mama Bwork — Cri Revitalisant : Soin ~120–150 PV sur ses alliés en cercle rayon 3. Peut lancer 3 fois par tour.",
          "Mama Bwork — Cri de Reconstitution : Se soigne ou soigne un allié d'environ 2700 PV, mais entre dans l'état insoignable pour 3 tours. Relance toutes les 7 tours. Stratégie : lui retirer ~600 PV, l'isoler, attendre qu'elle utilise ce sort, puis l'entamer."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/don-de-soi_orig.png",
            "caption": "Schéma — Don de Soi (protection en zone, Cybwork)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/pulsation_orig.png",
            "caption": "Schéma de portée — Pulsation (terre, retrait PM)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/couperet_orig.png",
            "caption": "Schéma — Couperet (air, càc, boost puissance cumulable)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/cri-revitalisant_orig.png",
            "caption": "Schéma — Cri Revitalisant (soin de zone, Mama Bwork)"
          }
        ]
      },
      {
        "title": "Boss — Bworker : sorts",
        "mechanics": [
          "Correction Bwork : Frappe en neutre proportionnellement aux PV manquants du Bworker (30%, 45% en cc de ses PV manquants). Sort uniquement au càc. Plus le boss a perdu de PV, plus il frappe fort.",
          "Fauchoir : 350 dégâts neutre + repousse de 2 cases. Sort uniquement au càc.",
          "Sanction Bwork : 2400 dégâts neutre. Sort uniquement au càc. Très dangereux.",
          "Poursuite : Booste le Bworker de 3PM tous les X tours."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/bworker_orig.png",
            "caption": "Schéma tactique du Bworker"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/sorts_orig.png",
            "caption": "Schéma de zone — Correction Bwork (neutre, càc)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/sorts_1_orig.png",
            "caption": "Schéma de zone — Fauchoir (neutre, càc, repousse 2 cases)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/sorts_2_orig.png",
            "caption": "Schéma de zone — Sanction Bwork (2400 dégâts neutre, càc)"
          }
        ]
      },
      {
        "title": "Stratégie globale — Option 1 : Distance et retrait PM",
        "mechanics": [
          "Utilisez un Enutrof (ou équivalent) pour retirer des PM au Bworker à chaque tour, l'empêchant de vous atteindre.",
          "Avec les autres personnages, éliminez les monstres en priorité.",
          "Si le Bworker avance trop, repoussez-le avec des sorts de poussée.",
          "Si le Bworker n'atteint jamais le càc, le combat est très simple."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/tactique_3.png",
            "caption": "Schéma tactique — Tenir le Bworker à distance"
          }
        ]
      },
      {
        "title": "Stratégie globale — Option 2 : Bloquer le Bworker dans un coin",
        "mechanics": [
          "Laissez le Bworker avancer sans qu'il n'atteigne le càc, puis placez-le dans un coin avec un Pandawa ou des sorts de déplacement.",
          "Bloquez-le avec deux monstres ennemis (évitez le Cybwork qui protège, et la Mama Bwork qui soigne).",
          "Placez un allié avec beaucoup de tacle au càc des deux monstres bloqueurs pour qu'ils ne bougent pas.",
          "Si le tacle est insuffisant : repositionnez les monstres bloqueurs à chaque fois qu'ils bougent, ou bloquez aussi leur càc."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/tact1_orig.png",
            "caption": "Schéma de placement — Bloquer le Bworker dans un coin avec deux monstres"
          }
        ]
      }
    ],
    "tips": [
      "Position du donjon : L'entrée se trouve à Gisgoul en [-15,14].",
      "Recette de la clef : 2x Bandeau troué de Feu, 2x Bandeau troué de Terre, 2x Bandeau troué d'Eau, 2x Bandeau troué d'Air, 2x Mandragore, 2x Millet, 2x Tanche, 2x Viande Gâtée.",
      "Pour capturer le Boss, prévoyez une pierre d'âme de puissance 190 minimum.",
      "La capture de l'âme du Bworker est utile pour la quête du Dofus Ocre : L'éternelle moisson.",
      "Quêtes liées : La voie du guerrier, La dernière pierre, Ruée sur le Bworker.",
      "Les Flammèches invoquées par les Bworks élémentaires sont prioritaires : éliminez-les immédiatement ou positionnez-vous hors de leur portée d'attraction (au-delà de 5PO ou hors ligne).",
      "Le Bwork Élémentaire de Feu retire énormément de PA : dispersez vos personnages pour ne pas vous retrouver à plusieurs avec 0 PA.",
      "La Mama Bwork se soigne massivement (Cri de Reconstitution, ~2700 PV) mais entre ensuite dans l'état insoignable 3 tours — attendez ce moment pour l'entamer.",
      "Ne mettez pas le Cybwork ni la Mama Bwork pour bloquer le Bworker : l'un protège les alliés, l'autre les soigne."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Baston équitable",
        "strategy": "Les ennemis ne doivent subir ni retrait PM, ni retrait PA, ni retrait PO, ni tentative de déplacement. Éliminez le Bworker rapidement en premier. Si vous ne pouvez pas l'éliminer au tour 1, utilisez des invocations ou une classe tank pour le coincer afin qu'il utilise Correction Bwork (qui inflige de lourds dégâts en fonction de ses PV manquants) sur ces derniers.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Le Meulou est l'un des donjons les plus difficiles de sa tranche de niveau
  15: {
    "summary": "Le Meulou est l'un des donjons les plus difficiles de sa tranche de niveau. Le boss possède de grosses résistances dans tous les éléments sauf feu (-5%) et un état Invulnérable permanent : la première ligne de dégâts à chaque tour est absorbée, rendant vulnérable jusqu'au tour du personnage suivant. La stratégie principale consiste à éliminer les monstres en priorité, garder le Meulou à distance, et le bloquer entre ses deux invocations pour l'empêcher de taper.",
    "recommendedLevel": "100",
    "composition": "Conseillé de jouer dans l'élément feu. Utile d'avoir des classes de soin et de protection pour tanker. Éviter d'invoquer sauf en cas d'extrême urgence (ou si 2 Milimeulou sont déjà présents). Des personnages avec des sorts puissants sur une seule ligne de dégâts sont à privilégier.",
    "keyResist": [
      "Feu (-5% résistance)"
    ],
    "phases": [
      {
        "title": "Salles — Monstres du donjon",
        "mechanics": [
          "Cocholou : Dents Longues (150 air, augmente les dégâts subis de 15% pendant 2 tours). Priorité d'élimination : retirer sa PO pour limiter ses actions.",
          "Mergranlou : Chaperon (soigne un allié de 150PV + boost 200 Puissance/4PA pour 2 tours avec malus de fuite et résistances), Mergran (150 feu + malus retrait PA/PM pour 1 tour). Priorité d'élimination élevée.",
          "Muloubard : Baïkeur (état Inébranlable, +2PM, réduit dégâts distance de 56 pendant 2 tours sur 4 — ne peut pas être repoussé quand actif). Métalour (100 terre en mêlée, poison PA). Priorité d'élimination.",
          "Mulou : Césarienne (250 terre + état Pesanteur en mêlée), Cri du Mulou (250 neutre sur invocations en cercle rayon 5).",
          "Mulounoké : Froid de Mulou (20% érosion + malus tacle/fuite/PO en zone croix taille 1, relance 2 tours), Ruée Bestiale (s'attire sur cible + 150 air). Priorité d'élimination.",
          "Ordre de priorité : Cocholou > Muloubard > Mulounoké. Ne pas éliminer le Milimeulou."
        ]
      },
      {
        "title": "Boss — Mécanique Fureur (passif)",
        "mechanics": [
          "Fureur (passif) : à chaque début de tour d'un personnage, le Meulou passe en état Invulnérable. La première ligne de dégâts qu'il reçoit absorbe l'invulnérabilité sans faire de dégâts, mais il reste vulnérable jusqu'au début du tour du personnage suivant.",
          "Fureur boost : chaque ligne de dégâts subie (y compris celle qui retire l'invulnérabilité) lui donne +30 Puissance pendant 4 tours (cumulable, débuffable). Un sort à 4 lignes de dégâts lui donne 4×30 Puissance.",
          "Privilégier des sorts à 1 seule ligne de dégâts lourds pour minimiser les stacks de Puissance.",
          "Les poisons et glyphes fonctionnent pendant son tour uniquement si le personnage jouant avant lui lui a retiré son invulnérabilité."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark49meulou10_orig.png",
            "caption": "Mécanique Fureur : chaque ligne de dégâts reçue booste le Meulou de 30 Puissance"
          }
        ]
      },
      {
        "title": "Boss — Invocations et Mulanthropie",
        "mechanics": [
          "Invocation de Milimeulou : au tour 1 puis tous les 8 tours, le Meulou invoque un Milimeulou. À sa mort, le Milimeulou donne +2PM et +200 Puissance pendant 2 tours (non débuffable) à tous les alliés monstres. Ne pas tuer les Milimeulou sauf si impossible autrement.",
          "Milimeulou tape en mêlée et retire de la fuite.",
          "Mulanthropie : le Milimeulou peut appliquer ce sort en mêlée tous les 2 tours. Si la cible meurt, un Mulou est invoqué près du Meulou (durée infinie, non débuffable).",
          "Étripage : si le Meulou tue un personnage ou une invocation avec ce sort (neutre en mêlée), il le remplace par un Mulou. Le Meulou est limité à 2 invocations simultanées.",
          "Exception à la règle d'invocation : si 2 Milimeulou sont déjà présents, les invocations peuvent être utilisées car le Meulou ne peut en avoir que 2."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark49meulou46_orig.png",
            "caption": "Le Milimeulou et la mécanique Mulanthropie"
          }
        ]
      },
      {
        "title": "Boss — Régénération (Rage Reconstituante)",
        "mechanics": [
          "Rage Reconstituante : se soigne de 2000PV (3000 en CC) et gagne +20 Tacle/+2PM pour 2 tours. Uniquement si ≤80% de ses PV. Disponible à partir du tour 2 puis tous les 6 tours.",
          "Bug IA : entre 81% et 84% de PV, le Meulou peut utiliser ce sort sans effet (condition ≤80% non remplie). Exploiter cette faille en le maintenant autour de 82% pour lui faire gaspiller le sort.",
          "Étripage : sort neutre en mêlée (vol de vie), peut soigner massivement si boosté en Puissance.",
          "Contre-mesures : éroder le Meulou pour réduire ses PV max, appliquer malus de soins reçus (Hémorragie Sacrieur, Leçon de Grunob), état Insoignable (Fougue Zobal), ou placer 2 personnages en mêlée pour qu'il préfère taper plutôt que se soigner (coût 5PA pour le soin vs 3PA par Étripage)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark49meulou4_orig.jpg",
            "caption": "État Insoignable empêche la Rage Reconstituante"
          }
        ]
      },
      {
        "title": "Boss — Stratégie : bloquer le Meulou",
        "mechanics": [
          "Démarrer le combat le plus loin possible du Meulou (7PM de base).",
          "Option 1 — Distance : le garder à distance en le repoussant et lui retirant des PM, l'éliminer à petit feu.",
          "Option 2 — Tank : 2 personnages en mêlée pour l'empêcher d'utiliser sa reconstitution (préfère taper ses cibles proches).",
          "Option 3 — Blocage dans un coin : attendre que le Meulou ait 2 invocations (tour 9 ou provoquer une invocation de Mulou via sacrifice d'une invocation alliée), puis le coincer entre les 2 créatures avec un personnage qui tacle les invocations ou les replace en contact chaque tour.",
          "Pour le taper : chaque personnage doit lui infliger une ligne de dégâts pour retirer l'invulnérabilité, puis attaquer avec des sorts mono-ligne puissants."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark49meulou22_orig.jpg",
            "caption": "Le Meulou bloqué entre ses 2 invocations : il ne peut pas taper"
          }
        ]
      }
    ],
    "tips": [
      "Position du donjon : Landes de Sidimote, zone des Hauts des Hurlements en [-23,0].",
      "Clé du donjon : 2× Queue du Mulou, 2× Œil de Cocholou, 2× Poils du Mulounoké, 2× Canine de Mergranlou, 2× Viande Exsudative, 2× Anguille, 2× Edelweiss, 2× Seigle.",
      "Pierre d'âme de puissance 100 minimum pour capturer le Boss.",
      "L'âme du Meulou est utile pour la quête du Dofus Ocre (L'éternelle moisson).",
      "Quêtes liées : Un juge hystérique, Allumer le feu, Draconanthropie, Mulanthropie (alignement brâkmarien), Apprentissage : Surineur.",
      "Donjon difficile même pour des personnages de niveau 150+ : faire le donjon normalement avant d'essayer les succès difficiles.",
      "Éliminer les monstres avant le boss : Cocholou en priorité (retirer sa PO), puis Muloubard, puis Mulounoké.",
      "Ne jamais tuer les Milimeulou sauf si impossible (ils donnent +2PM et +200 Puissance à tous les monstres à leur mort).",
      "Jouer dans l'élément feu : seule faiblesse du Meulou (-5%).",
      "Éviter d'invoquer : si une invocation meurt en mêlée du Meulou, elle est remplacée par un Mulou. Exception : si 2 invocations du Meulou sont déjà présentes.",
      "Utiliser des sorts à 1 seule ligne de dégâts lourds plutôt que des sorts multi-lignes."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Meulou y es-tu ?",
        "strategy": "Les ennemis ne peuvent pas subir plus de 3 attaques par tour de la part du même allié. Le Meulou étant invulnérable, la 1ère ligne de dégâts consomme une des 3 attaques pour lui retirer l'invulnérabilité, laissant seulement 2 attaques pour infliger des dégâts. Un sort à 4 lignes de dégâts fait échouer le succès directement. Un sort à 3 lignes de dégâts consomme toutes les attaques du tour. Conseillé : sorts qui tapent fort sur une seule ligne, personnages en feu. Les poisons, glyphes et effets hors-tour sont autorisés (ils ne comptent pas comme attaques du personnage), mais le personnage jouant avant le Meulou doit lui retirer son invulnérabilité pour qu'ils s'appliquent.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Le Wa Wobot est le boss du Terrier du Wa Wabbit, un combat centré sur une mécanique de fli
  17: {
    "summary": "Le Wa Wobot est le boss du Terrier du Wa Wabbit, un combat centré sur une mécanique de flipper : il invoque des Wobot Tamponneur qui rebondissent les entités poussées contre eux. La stratégie optimale consiste à placer deux Wobot Tamponneur en ligne à 5 cases ou moins l'un de l'autre, puis à pousser le Wa Wobot entre eux pour le tuer en un tour grâce aux dégâts de poussée en cascade.",
    "recommendedLevel": "Variable (donjon lié au Dofus Cawotte)",
    "composition": "Sorts de poussée et d'attirance indispensables. Classes sans sort de poussée doivent prendre le sort commun Libération. Avoir une classe capable de retirer des PM est un gros avantage (notamment pour le succès spécial). Éviter de jouer en mêlée.",
    "keyResist": [
      "Variable (voir résistances)"
    ],
    "phases": [
      {
        "title": "Salles de monstres — Wobot classiques",
        "mechanics": [
          "Black Wo Wabbit — Aspiwation : attire de 10 cases, 60 dégâts air, invoque une Cawotte Woyale à la position initiale (1 Cawotte max par Black Wo Wabbit ; nouvelle invocation remplace l'ancienne)",
          "Black Wo Wabbit — Étweinte : 90 dégâts terre + état Pesanteur pour 1 tour",
          "Black Wo Wabbit — Ventwe Webondi (passif) : tout attaquant en mêlée est repoussé de 3 cases et perd 3 PM pour 1 tour",
          "Blanc Pa Wabbit — Cawotte Suwvitaminée : 50 dégâts feu zone cercle 2, soigne les alliés de 100 PV dans la zone",
          "Blanc Pa Wabbit — Mawtyw : quand il subit des dégâts à distance, lui et les alliés/ennemis en cercle 2 gagnent 1 PA et 20 dommages pour 2 tours",
          "Blanc Pa Wabbit — Motivation Cawottique : donne 2 PM + 2 PO aux alliés en cercle 2, retire 2 PM + 2 PO aux ennemis dans la zone",
          "Tiwobot — Coup de Boule : 80 dégâts neutre, état Affaibli 1 tour, repousse de 1 case (mêlée uniquement)",
          "Tiwobot — Lancew de Cawotte : 70 dégâts air, repousse de 2 cases, ligne 3-6 PO",
          "Tiwobot — Wetouw du Wabbit : se téléporte sur la case ciblée puis inflige 70 dégâts terre en croix 2 autour de lui, repoussant de 2 cases",
          "Wobot — Louwdeuw (passif) : si le Wobot est poussé ou échange de position, l'attaquant subit 70 dégâts feu",
          "Wobot — Massue Wotative : 70 dégâts neutre + retire 2 PM zone cercle 2, 3-6 PO",
          "Wobot — Wavelot : 55 dégâts air, réduit résistances de poussée de 20 (30 crit) pour 2 tours",
          "Wobot Kiafin — Louwdeuw (passif) : même effet que le Wobot standard",
          "Wobot Kiafin — Glissement de tewwain : attire de 2 cases + 70 dégâts terre en cercle 3 autour de lui",
          "Wobot Kiafin — Weuche : avance de 4 cases sur la cible puis 70 dégâts en cône 2, retire 15 fuite pour 1 tour"
        ]
      },
      {
        "title": "Salle du boss — Wa Wobot : sorts et mécanique des Wobot Tamponneur",
        "mechanics": [
          "Mékattwaction : attire de 12 cases, 80 dégâts neutre, invoque un Wobot Tamponneur à la position initiale de la cible — ligne 4-12 PO (2 fois/tour, 1 fois/cible)",
          "Mékawapace : le Wa Wobot gagne 30% de résistance dans tous les éléments pour 2 tours (non débuffable) — se lance à partir du tour 3 puis tous les 5 tours",
          "Substitution : échange de position avec un Wobot Tamponneur ciblé, jusqu'à 3 PO sans ligne de vue",
          "Twansmutation : OS une Cawotte Woyale alliée et la transforme en Wobot Tamponneur, jusqu'à 10 PO sans ligne de vue (2 fois/tour)",
          "Wouste : 90 dégâts feu + repousse de 3 cases, ligne jusqu'à 2 PO sans ligne de vue (2 fois/tour)",
          "Wobot Tamponneur — Bumper (passif) : quand il subit des dégâts de poussée indirecte, repousse toutes les entités à son contact de 6 cases ; le pousseur est téléporté symétriquement par rapport à lui",
          "Wobot Tamponneur — si le Wa Wobot est repoussé par un Tamponneur, il perd 500 résistance poussée pour 1 tour",
          "Wobot Tamponneur — Bump Incontwôlable : si un 2e Tamponneur est en ligne avec le 1er, il gagne 200 dommages de poussée pour 1 tour ; tous les Tamponneurs en ligne gagnent 1000 résistances de poussée",
          "Wobot Tamponneur — Entewwement : si la téléportation symétrique du pousseur est bloquée par un obstacle, tous les Tamponneurs en ligne avec ce personnage sont OS",
          "Les Wobot Tamponneur ont 150% de résistance dans tous les éléments, sont statiques et ne peuvent pas être portés, téléportés ni emprunter des portails",
          "Chaque Tamponneur ne peut déclencher son effet Bump qu'une seule fois"
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark42wobot12_orig.png",
            "caption": "Le Wa Wobot (rouge) attire un personnage (vert) — un Wobot Tamponneur (bleu) apparaît à sa position initiale"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark42wobot13_orig.png",
            "caption": "Le Wobot Tamponneur (bleu) apparaît à la position qu'occupait le personnage avant l'attirance"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark42wobot1_orig.png",
            "caption": "Exemple 1 : Pandawa (vert) pousse un monstre (rouge) sur le Wobot Tamponneur (bleu)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark42wobot2_orig.png",
            "caption": "Exemple 1 résultat : Pandawa téléporté symétriquement, monstre repoussé de 6 cases"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark42wobot3_orig.png",
            "caption": "Exemple 2 : Pandawa (vert) pousse un monstre (rouge) vers 2 Wobot Tamponneur (bleu) en ligne"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark42wobot4_orig.png",
            "caption": "Exemple 2 résultat : le monstre rebondit en ping-pong entre les deux Tamponneurs jusqu'à mourir des dégâts de poussée"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark42wobot5_orig.png",
            "caption": "Schéma : le Wa Wobot poussé entre 2 Tamponneurs perd 500 résistances poussée à chaque rebond — OS en un seul tour"
          }
        ]
      },
      {
        "title": "Stratégie globale — élimination des monstres puis du Wa Wobot",
        "mechanics": [
          "Priorité 1 : éliminer le Black Wo Wabbit (état Pesanteur qui bloque la téléportation symétrique du pousseur)",
          "Priorité 2 : éliminer le Tiwobot (sorts de poussée multiples qui perturbent les placements)",
          "Ne jamais attaquer le Black Wo Wabbit en mêlée (Ventwe Webondi repousse de 3 cases)",
          "Option 1 — Bourrage classique : taper directement le Wa Wobot, mais Mékawapace donne +30% résistances tous éléments non débuffable dès le tour 3 puis tous les 5 tours — méthode viable mais longue",
          "Option 2 — Mécanique Tamponneur (recommandée) : placer 2 Wobot Tamponneur en ligne à 5 cases ou moins l'un de l'autre, placer le Wa Wobot entre eux, le pousser contre un Tamponneur pour l'OS via rebonds",
          "Seuls les sorts de poussée et d'attirance peuvent déplacer les Wobot Tamponneur et le Wa Wobot",
          "Le personnage qui pousse ne doit pas être en état Pesanteur (il ne serait pas téléporté symétriquement)",
          "Effet Entewwement : si la téléportation symétrique est bloquée par un obstacle, tous les Tamponneurs en ligne avec le pousseur sont OS — éviter les positions près des murs"
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark42wobot6_orig.png",
            "caption": "Schéma de positionnement : personnage (vert 1) pousse le boss entre deux Tamponneurs, téléporté en vert 2"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark42wobot10_orig.png",
            "caption": "Positionnement optimal : 2 Wobot Tamponneur en ligne avec le Wa Wobot entre eux pour la stratégie OS"
          }
        ]
      }
    ],
    "tips": [
      "Position du donjon : entrée sur l'Îlot de Waldo de l'Île des Wabbits en [28,-12]",
      "Recette de la clef : 2x Os de Wabbit Squelette, 2x Estomac de Wo Wabbit, 2x Poils de Barbe du Grand Pa Wabbit, 2x Bandeau de Black Wabbit Squelette, 2x Viande Sanguinolente, 2x Brochet, 2x Orchidée Freyesque, 2x Lin",
      "Capture de l'âme du boss : pierre d'âme de puissance 100 minimum",
      "L'âme du boss est nécessaire pour la quête du Dofus Émeraude : 'Le voleur d'âmes'",
      "C'est dans ce donjon qu'on récupère le Dofus Cawotte via la quête 'L'œuf ou la cawotte ?'",
      "Classes sans sort de poussée : prendre le sort commun Libération",
      "Éviter de finir son tour au contact d'un Wobot Tamponneur (risque de dégâts collatéraux)",
      "Les Wobot Tamponneur ne peuvent déclencher leur effet Bump qu'une seule fois — bien choisir le moment de les utiliser",
      "Distance maximale entre 2 Tamponneurs pour que le rebond fonctionne : 6 cases",
      "Le Wa Wobot ne peut être ni porté, ni téléporté — uniquement poussé ou attiré"
    ],
    "rewards": [
      "Dofus Cawotte (via quête 'L'œuf ou la cawotte ?')",
      "Âme du Wa Wobot (utile pour la quête du Dofus Émeraude 'Le voleur d'âmes', pierre d'âme puissance 100 min)"
    ],
    "achievements": [
      {
        "name": "A fond les boulons",
        "strategy": "Les alliés ne doivent pas recevoir de dommages de poussée. Éliminer le Tiwobot en premier (sorts de poussée multiples). Retirer des PM au Wa Wobot (10 d'esquive seulement) pour éviter qu'il approche et utilise Mékattwaction. Ne jamais se placer en ligne avec le Wa Wobot. Ne jamais se coller aux Wobot Tamponneur. Ne jamais attaquer le Black Wo Wabbit en mêlée (Ventwe Webondi repousse de 3 cases). Rester toujours à plus de 3 cases d'un obstacle si le Wa Wobot peut approcher (Wouste pousse de 3 cases, ligne 2 PO sans LdV). Si l'opportunité se présente de l'OS avec les Tamponneurs dès le début du combat, la saisir.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Le Craqueleur Légendaire est le boss des Pitons Rocheux des Craqueleurs
  18: {
    "summary": "Le Craqueleur Légendaire est le boss des Pitons Rocheux des Craqueleurs. Sa mécanique centrale est l'effet 'Couche Rocailleuse' qui lui confère des résistances massives et 500 d'esquive PA/PM, et son sort Pierre Étourdissante (déclenché à 20 PA) inflige d'énormes dégâts sur toute la map et applique 'Craqueboulisation' à tout le groupe. La priorité absolue est de débuffer ses PA en permanence pour l'empêcher d'atteindre 20 PA.",
    "recommendedLevel": "Variable (donjon de la Montagne des Craqueleurs)",
    "composition": "Un débuffeur de PA est indispensable (Pandawa/Souillure, Eniripsa/Mot Interdit, Enutrof/Pelle Fantomatique, Sadida/Ronce Insolente…). Sans débuff, le boss doit être éliminé avant son tour 4.",
    "keyResist": [
      "Neutre (-11% de résistance sur le boss)",
      "Air (8% — la plus faible résistance positive)"
    ],
    "phases": [
      {
        "title": "Monstres du donjon (salles 1 à 5)",
        "mechanics": [
          "Craqueboule : Martèlement — frappe neutre au càc + boost dommages 5 tours ; Motivation Tellurique — +2PM puis +4PA au tour suivant.",
          "Craqueleur des Plaines : Écrasement Handicapant — frappe terre + retire 2PA (esquivables) ; Jet de pierre — frappe feu + retire PM ; Frappe Sismique — retire 1PA en rayon 5PO.",
          "Craqueleur : Écrasement Handicapant — frappe terre + retire 2PA ; Jet de pierre — frappe feu + retire PM.",
          "Craquelope : Caillassage — frappe terre + retire 2PO ; Percussion — frappe terre en s'attirant au càc ; Plainitude — déclenche Plainitude infini + 2PM.",
          "L'élémentaire : Sismologie — retire 25% résistance terre + 1PM en croix de 1PO ; Terpanation — frappe terre + état 'Terpané' 2 tours ; Terraportation — se téléporte.",
          "Pont invisible salle 5 : activer la grille (clic droit > Options générales > Afficher la grille), suivre la ligne du milieu cellule par cellule — tomber déclenche un combat en bas pour remonter."
        ]
      },
      {
        "title": "Boss : Couche Rocailleuse et glyphes noirs",
        "mechanics": [
          "Couche Rocailleuse (passif combat) : le Craqueleur Légendaire gagne +50% résistances partout, +200 résistances fixes, +500 esquive PA et PM pour toute la durée du combat.",
          "Les monstres alliés gagnent également +20% résistances, +100 fixes, +200 esquive PA/PM.",
          "À la fin de son tour, chaque monstre ennemi pose un glyphe noir sur sa case — y entrer applique 'Craqueboulisation' : +30% PV en bouclier mais -100 PM et +100% dommages subis pour toute la durée du combat.",
          "Retrait de Craqueboulisation : infliger des dégâts en mêlée OU des dommages de poussée au personnage affecté (par un allié) retire l'état.",
          "Choc Tellurique : dégâts mêlée sur un personnage 'Craqueboulisé' → les monstres à son contact perdent 'Couche Rocailleuse' pendant 3 tours.",
          "Craqueboule-tout : dommages de poussée sur un personnage 'Craqueboulisé' → les monstres dans un carré de taille 3 autour de lui perdent 'Couche Rocailleuse' pendant 2 tours."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/expgild664afd2699e2e_orig.png",
            "caption": "Glyphe noir et effet Couche Rocailleuse"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/expgild664afd6dab563_orig.png",
            "caption": "État Craqueboulisation"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/expgild664afda5ddd19_orig.png",
            "caption": "Mécaniques de retrait de l'état Craqueboulisation"
          }
        ]
      },
      {
        "title": "Boss : Pierre Étourdissante (mécanique des 20 PA)",
        "mechanics": [
          "Le Craqueleur Légendaire commence le combat avec 16 PA et gagne +1 PA par tour pendant 5 tours (cet effet est débuffable).",
          "Pierre Étourdissante : se déclenche dès qu'il atteint 20 PA — inflige 2 000 dégâts feu sur toute la map, retire 6 PA à tous les personnages et invocations pendant 1 tour, et applique 'Craqueboulisation' à tout le groupe. Lançable à chaque tour tant qu'il a 20 PA.",
          "Le retrait direct de PA n'est pas viable à cause des 500 d'esquive PA de la Couche Rocailleuse — utiliser des débuffs directs (sorts de malédiction/désenvoutement de PA maximum).",
          "Sans débuff : tuer le Craqueleur Légendaire avant le début de son tour 4, en retirant sa Couche Rocailleuse dès le tour 1 via Choc Tellurique ou Craqueboule-tout."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/expgild664afddcd9b5e_orig.png",
            "caption": "Mécanique des 20 PA et Pierre Étourdissante"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/expgild664afe25252a0_orig.png",
            "caption": "Dégâts neutres sur le boss : les alliés ennemis gagnent 3 000 de bouclier"
          }
        ]
      },
      {
        "title": "Boss : sorts, invocations et stratégie finale",
        "mechanics": [
          "Peau de Silex : donne 70% de résistances au Craqueleur Légendaire et aux monstres dans un rayon de 2PO autour de lui.",
          "Invocation Montagnarde : invoque un Craqueleur aléatoire du donjon toutes les 3 tours à partir du tour 1 (jusqu'à 3PO, sans ligne de vue).",
          "Peau de Topaze : réduit les dommages d'un monstre allié ciblé de 1 000 pendant 3 tours (débuffable, relance 5 tours).",
          "Frappe du Craqueleur Légendaire : 1 000 dégâts feu en cercle rayon 2PO — touche alliés comme ennemis.",
          "Tuer les monstres en priorité (notamment le Craqueboule, très dangereux en mêlée). Ne pas taper le boss en élément neutre pendant ce temps (ses alliés gagneraient 3 000 de bouclier par ligne de dégâts neutres).",
          "Une fois les monstres morts, attaquer le boss. Option 1 : ignorer 'Craqueboulisation' et éroder. Option 2 : déclencher Craqueboule-tout (poussée sur un 'Craqueboulisé') pour retirer les résistances puis taper."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/expgild664afe55f3b95_orig.png",
            "caption": "Vue d'ensemble stratégique du combat"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/expgild664afe90097b5_orig.png",
            "caption": "Conseils de stratégie finale"
          }
        ]
      }
    ],
    "tips": [
      "Recette de la clef : 2x Fragment de Pierre Polie, 2x Pierre du Craqueleur, 2x Silex, 2x Charbon, 2x Viande Avariée, 2x Sardine Brillante, 3x Menthe Sauvage, 3x Houblon. Taxe gratuite.",
      "Accès : Montagne des Craqueleurs en [-3,-7], parler à Krakotte pour entrer (et pour sortir).",
      "Pierre d'âme de puissance 100 minimum pour capturer l'âme du boss.",
      "La capture de l'âme du Craqueleur Légendaire est utile pour la quête du Dofus Ocre : L'éternelle moisson.",
      "Pont invisible en salle 5 : activer la grille (clic droit > Options générales > Afficher la grille) et avancer cellule par cellule sur la ligne du milieu. Tomber déclenche un combat en bas ; le vaincre permet de remonter.",
      "Ne jamais infliger de dégâts neutres sur le Craqueleur Légendaire pendant que vous focalisez les monstres — cela leur octroie 3 000 de bouclier à ses alliés pendant 2 tours.",
      "Si vous n'avez pas de débuff de PA, tuez le Craqueleur Légendaire avant son tour 4 en retirant sa Couche Rocailleuse dès le tour 1 et en le focalisant immédiatement."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "De véritables craqu'",
        "strategy": "Aucun combattant ennemi ne doit subir des dégâts lorsque des invocations ennemies sont en vie. Le Craqueleur Légendaire invoque au tour 1 puis tous les 3 tours : si une invocation est en vie, taper uniquement cette invocation jusqu'à sa mort avant de frapper les autres ennemis. Alternative : focus le Craqueleur Légendaire en premier pour l'éliminer avant qu'il joue et éviter toute contrainte.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Le boss Mob l'Éponge commence le combat avec 100% de résistances dans tous les éléments
  19: {
    "summary": "Le boss Mob l'Éponge commence le combat avec 100% de résistances dans tous les éléments. La stratégie consiste à frapper les Pichons alliés (invulnérables) pour lui retirer ses résistances via renvoi (1% par ligne de dégâts), avant de l'achever. Il peut également être tué uniquement par dégâts de poussée, sa résistance poussée étant nulle.",
    "recommendedLevel": "30 — 50",
    "composition": "Privilégier des classes avec des sorts de zone et multi-lignes pour retirer rapidement les résistances du boss via les renvois des Pichons. Un personnage tanqueur/tackleur est utile pour bloquer Mob l'Éponge à distance. Éviter les équipes avec trop de joueurs en élément air (50–66% de résistances chez tous les ennemis en expédition).",
    "keyResist": [
      "Eau (attaques principales du boss)",
      "Éviter l'air (50–66% résistances ennemies en expédition)"
    ],
    "phases": [
      {
        "title": "Salles normales — Pichons",
        "mechanics": [
          "Pichon Blanc — Bouffée d'Air : 15 dégâts air au càc, malus 10 esquive PM 2 tours",
          "Pichon Blanc — Nage Terrestre : boost alliés +5 fuite/tacle, malus 50 agilité ennemis 2 tours (cercle R2)",
          "Pichon Bleu — Vaguelette : 15 dégâts eau, retire 1 PM en ligne perpendiculaire 3PO (max 8PO)",
          "Pichon Bleu — Résistivité : +10% résistance alliés, malus 50 chance ennemis 2 tours (cercle R2)",
          "Pichon Kloune — Blag : 5 terre + 5 air, poison 7–10 dégâts air+feu 1 tour (max 3PO)",
          "Pichon Kloune — Klounerie : dommages retournés 16 sur lui-même pour 1 tour",
          "Pichon Orange — Sable Brûlant : 10 dégâts feu en croix 1PO (max 5PO)",
          "Pichon Orange — Sel Marin : soigne alliés 9–12 PV, malus 50 intelligence ennemis 2 tours (cercle R2)",
          "Pichon Vert — Reflux : 25 dégâts terre au càc, repousse 1 case",
          "Pichon Vert — Onde Enrageante : +50 puissance alliés, malus 50 force ennemis 2 tours (cercle R2)"
        ]
      },
      {
        "title": "Boss — Mob l'Éponge : sorts",
        "mechanics": [
          "Rinçage : enlève les envoûtements ennemis en cercle R2 (donjon normal) ; en expédition : 600 dégâts eau + réduit soins 70% 1 tour ; si cible Dégraissée → perd tous envoûtements, repoussée 20 cases + 1 100 dégâts terre supplémentaires (max 2PO, 1x par tour)",
          "Dégraissage (donjon normal) : 10 dégâts eau (50 CC) en ligne 9PO depuis càc, retire 2PO (3 CC) pour 1 tour",
          "Dégraissage (expédition) : poison 900 dégâts feu pendant 2 tours + applique état Dégraissé sur la cible (3–16PO, non cumulable, 1x par cible, 3x par tour)",
          "Régénération Spontanée : soigne 60 PV en cercle R2 (donjon normal) ; en expédition : soigne 10% PV max (12% CC), puis au tour suivant 10% PV max par monstre allié en vie (relance 4 tours)",
          "Résistance poussée nulle : peut être tué uniquement via dégâts de poussée (éroder si cette stratégie est choisie car il se soigne tous les 4 tours)"
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/rin-age_orig.png",
            "caption": "Schéma du sort Rinçage"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/d-graissage_orig.png",
            "caption": "Schéma du sort Dégraissage"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/r-g-n-ration-spontan-e_orig.png",
            "caption": "Schéma du sort Régénération Spontanée"
          }
        ]
      }
    ],
    "tips": [
      "Position : entrée dans les Calanques d'Astrub en [13,-28]",
      "Clef : 2x Serviette de Plage, 2x Nageoire de Compétition, 2x Crème à bronzer, 2x Conque Marine, 2x Viande Faisandée, 2x Orge, 2x Sauge, 2x Truite",
      "Quête liée : Donjon en Mousse",
      "Pierre d'âme 50 minimum pour capturer le boss ; utile pour la quête du Dofus Ocre (L'éternelle moisson)",
      "Sortir immédiatement du glyphe rouge du Pichon Orange : la pesanteur empêche la téléportation — utiliser sorts de gain PM ou rush (ex. Déferlement du Iop) ; équiper un Dofus Abyssal pour +1 PM non retirable par le glyphe",
      "Garder Mob l'Éponge à distance : Dégraissage se lance à partir de 3PO avec ligne de vue — le tacler ou se placer derrière des obstacles",
      "Attention au Pichon Bleu qui peut appliquer l'état intacleur jusqu'à 3PO (sans LdV) — tacler les ennemis hors du glyphe vert du Pichon Blanc",
      "Si impossible de taper en zone, concentrer les attaques sur un seul Pichon pour faire baisser les résistances du boss dans un seul élément",
      "Utiliser le sort Klounerie du Pichon Kloune contrôlé pour doubler les dégâts de renvoi sur Mob l'Éponge",
      "Protéger le Pichon Kloune que vous contrôlez : si un monstre le retue, il en reprend le contrôle et Mob l'Éponge en invoque un nouveau"
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Passer l'éponge",
        "strategy": "À partir du tour 2, Mob l'Éponge doit être poussé ou attiré au moins une fois à chaque tour global. L'idéal est d'éliminer Mob l'Éponge dès le tour 1 pour éviter d'avoir à le pousser.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Le Coffre des Forgerons est le boss du Donjon des Forgerons, accessible dans le Territoire
  21: {
    "summary": "Le Coffre des Forgerons est le boss du Donjon des Forgerons, accessible dans le Territoire des Bandits en [13,21]. Sa mécanique principale repose sur son sort « Tchaiste » qui inflige des dégâts proportionnels à ses PV manquants — il faut éviter de l'entamer avant d'être prêt à le finir en un tour. Le conseil clé : éliminer d'abord tous les monstres alliés, puis blitzer le Coffre ou le bloquer entre invocations à 3PO ou moins.",
    "recommendedLevel": "40 — 60",
    "composition": "Groupe standard ; classes avec dégâts concentrés ou invocations pour bloquer le Coffre recommandées. Sort commun « Maîtrise des invocations » conseillé pour contrôler les invocations de blocage.",
    "keyResist": [
      "Variable (voir résistances)"
    ],
    "phases": [
      {
        "title": "Salles de monstres (avant le Boss)",
        "mechanics": [
          "4 groupes de monstres à affronter avant le Boss : Bandits du Clan des Roublards, Boulangers Sombres, Forgerons Sombres, Mineurs Sombres.",
          "La plupart des monstres sont dangereux uniquement en mêlée — rester à distance.",
          "Le Mineur Sombre peut retirer 2PA à tous les ennemis dans un cercle de taille 8 (Gaucherie de Masse) et se booster avec Rage.",
          "Le Forgeron Sombre peut repousser de 5 cases (Embrochement) et se protéger (Protection Magique : -10 dégâts reçus).",
          "Priorité de focus : Mineur Sombre et Boulanger Sombre en premier, puis Forgeron Sombre, puis Bandit du Clan des Roublards (à 5+).",
          "Deux chemins possibles : chemin court (2 combats) ou chemin passant par l'attitude Saluer (plus de salles à pied, même nombre de combats)."
        ]
      },
      {
        "title": "Combat du Boss : Coffre des Forgerons",
        "mechanics": [
          "Avidité : inflige 90 dégâts terre en vol de vie et vole 4PA (8 en critique) pour 1 tour — uniquement en mêlée (1 fois par cible).",
          "Tchaiste : inflige 30% des PV manquants du Coffre en dégâts terre dans une zone cercle inversée de taille 4 autour de lui ; les monstres alliés dans la zone gagnent 30 dommages. Lançable 1 fois par tour.",
          "Le Coffre a une IA fuyarde : il n'avancera jamais vers vous sauf pour vous atteindre en mêlée (3PM).",
          "Tchaiste tape uniquement les cibles à 4PO ou plus — rester à 3PO ou moins pour éviter ses dégâts de zone.",
          "Ne jamais l'entamer partiellement : plus il a peu de PV, plus il fait mal (jusqu'à ~350 dégâts sur tous les personnages en bas de PV).",
          "Stratégie principale : éliminer tous les monstres en premier, booster le groupe, puis blitzer le Coffre en un tour après qu'il a joué.",
          "Alternative : bloquer le Coffre entre 2 invocations/personnages et se placer à 3PO ou moins pour le taper sans subir Tchaiste."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj66-30tchaiste_orig.png",
            "caption": "Zone d'effet du sort Tchaiste (cercle inversé taille 4)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj66-31blocagecoffre_orig.jpg",
            "caption": "Exemple de blocage du Coffre entre invocations, personnages à 3PO ou moins"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj66-32blocage-strat_orig.jpg",
            "caption": "Stratégie de blocage en coin avec invocations"
          }
        ]
      }
    ],
    "tips": [
      "Entrée du donjon dans le Territoire des Bandits en [13,21].",
      "Recette de la clef : 2x Sceau Royal Contrefait, 2x Graine de la Discorde, 2x Chaînes Brisées, 2x Bourse Suspecte, 2x Viande Tendre, 2x Poisson-Chaton, 3x Trèfle à 5 feuilles, 3x Avoine.",
      "Pierre d'âme de puissance 50 minimum pour capturer le boss.",
      "L'attitude Saluer est obtenue dans le donjon en cliquant sur la Stèle (chemin optionnel).",
      "À la fin du donjon, vous obtenez automatiquement le sort « Maîtrise d'Arme ».",
      "Ne jamais taper le Coffre des Forgerons tant que les monstres ne sont pas tous éliminés.",
      "Le sort commun « Libération » (poussée) est utile pour le succès Nomade si un monstre vous tackle.",
      "Le sort commun « Maîtrise des invocations » permet de contrôler les invocations de blocage (sauf Chaferfu qui reste incontrôlable)."
    ],
    "rewards": [
      "Attitude Saluer (chemin optionnel dans le donjon)",
      "Sort « Maîtrise d'Arme » (obtenu automatiquement à la fin)"
    ],
    "achievements": [
      {
        "name": "Nomade",
        "strategy": "Utiliser tous ses PM à chaque tour pendant tout le combat. Attention aux tackles ennemis : si un monstre vous bloque sans sort de dégagement, le succès échoue. Le sort commun Libération (poussée) peut aider. Ne pas oublier d'utiliser ses PM au dernier tour avant de terminer le combat.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/nomade.png"
      },
      {
        "name": "Premier",
        "strategy": "Le Coffre des Forgerons doit être achevé en premier. Idéalement l'éliminer en un tour au tour 2 (boost tour 1, blocage des monstres avec invocations). Si pas assez de dégâts, l'entamer légèrement au tour 1 ou le bloquer entre invocations à 3PO ou moins.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/premier.png"
      },
      {
        "name": "Spécial : Ouverture facile",
        "strategy": "Incompatible avec le succès Premier. Taper le Coffre jusqu'à moins de 50% de ses PV, puis éliminer tous les monstres pendant qu'il est sous 50% PV, puis finir le Coffre en dernier. Possible de bloquer le Coffre à 3PO ou moins pendant la phase de nettoyage des monstres.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 20 tours. Éliminer les monstres en premier, puis finir le Coffre (blitz en 2 tours, entame + finition en 3 tours, ou blocage entre invocations à 3PO ou moins). Le sort commun Invocation de Chaferfu peut servir de blocage.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      },
      {
        "name": "Compagnon : Compagnons, quel est votre métier ?",
        "strategy": "Vaincre les monstres avec 4 personnages minimum dont au moins un des compagnons : Kloug, Klûme, Grizou ou Laikteur. Vous pouvez jouer à 2 personnages + 2 compagnons, dont l'un obligatoirement parmi les 4 listés.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/compagnon2.png"
      }
    ]
  },
  // Le Grand Ougah est un boss niveau 180 qui inflige des dégâts massifs via des poisons et in
  22: {
    "summary": "Le Grand Ougah est un boss niveau 180 qui inflige des dégâts massifs via des poisons et invoque des renforts à chaque tour. La stratégie consiste à le booster au tour 1, le débuffer au tour 2 puis le tuer en focus avant de finir les invocations.",
    "recommendedLevel": "180",
    "composition": "Classes avec capacités de débuff recommandées pour retirer les boosts de Puissance du boss. Pandawa utile pour bloquer lOugah. Au minimum 4 personnages requis pour franchir la salle 4.",
    "keyResist": [
      "Feu",
      "Terre",
      "Air"
    ],
    "phases": [
      {
        "title": "Salles 1-2 : Monstres du donjon",
        "mechanics": [
          "Champ à Gnons : poison neutre à distance (11 PO), retire 3 portée, invoque un Champa Explosif (1 PM, tape feu en zone cercle rayon 3, se boost de 200 dommages/tour).",
          "Champaknyde : frappe tous éléments en mêlée, réduit soins reçus des ennemis.",
          "Champbis : applique 25% faiblesse tous éléments (8 PO), poison feu, boost dommages de 50 — à éliminer en priorité.",
          "Champ Champ : frappe eau en mêlée, poison terre 3 tours à 6 PO.",
          "Champagne : poison neutre à distance (10 PO) qui retire de lagilité, soigne alliés en mêlée, renvoi de dommages.",
          "Champodonte : tape en mêlée selon ses PV actuels (10%), retire jusqu à 5 PA — ne pas le laisser approcher.",
          "Tromperelle : poison air à distance (2-15 PO) proportionnel aux PA utilisés, tape eau en mêlée, réduit dommages ennemis."
        ]
      },
      {
        "title": "Salle 3 : Division de l équipe (mécanique obligatoire)",
        "mechanics": [
          "Division obligatoire en 2 groupes (minimum 2 personnages par porte, maximum 4 par groupe).",
          "Chaque groupe doit placer un personnage sur chacune des 2 dalles pour ouvrir la grille du groupe adverse.",
          "Une fois les grilles franchies, chaque groupe combat en parallèle pendant 2 salles.",
          "Attention : ne pas ouvrir sa grille avant que l autre groupe ait ouvert la vôtre."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj36-4_orig.jpg",
            "caption": "Salle des dalles — division de léquipe"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj36-5_orig.jpg",
            "caption": "Schéma salles parallèles"
          }
        ]
      },
      {
        "title": "Combat contre le Grand Ougah (boss)",
        "mechanics": [
          "Bizarrerie : boost ennemi ciblé de 50 Puissance/dommages subis (2 tours, cumulable x5) ; boost alliés monstres en zone croix 2 de 300 Puissance/dommages subis. 2-8 PO, relance 2 tours.",
          "Opiniâtreté : 600 dégâts feu + 600 dégâts terre (zone croix 1), -20% résistance air 4 tours, poison air 300 en vol de vie 4 tours. Jusqu à 8 PO, 1 fois/tour.",
          "Sirop Spore : poison neutre 80 dégâts/PA utilisé pendant 4 tours (fin de tour). Jusqu à 4 PO, actif à partir du tour 3, relance 3 tours.",
          "Spore Hanchambre : se boost de 50% critique par dommage reçu pour 1 tour ; choisit aléatoirement 1 condition (33% : soigné entièrement si dommages reçus / 33% : soigné si retrait PA / 33% : soigné si retrait PM). Prévisualisation des dégâts indique si laction le soigne. Actif à partir du tour 2, relance 3 tours.",
          "Les coprins d abord : invoque aléatoirement un monstre de la zone (jusqu à 6 invocations). 2-8 PO, actif à partir du tour 2, 1 fois/tour."
        ]
      },
      {
        "title": "Stratégie globale contre l Ougah",
        "mechanics": [
          "Objectif principal : le tuer en 1 tour si possible (boost maximum dès le tour 1).",
          "Si impossible en 1 tour : booster au maximum au tour 1, débuffer (retirer Spore Hanchambre) avec le personnage le plus rapide en début de tour 2, puis focus maximum.",
          "Une fois lOugah mort, finir les invocations restantes sans précipitation.",
          "Le Pandawa peut bloquer lOugah entre 2 monstres pour réduire son impact.",
          "Ne pas utiliser de retrait PA/PM si Spore Hanchambre en cours sans vérifier la prévisualisation."
        ]
      }
    ],
    "tips": [
      "Entrée du donjon : Caverne des Fungus en [-9,29].",
      "Minimum 4 personnages requis pour franchir la salle 4 (dalles).",
      "Pierre d âme de puissance 190 minimum pour capturer le boss.",
      "L âme du Grand Ougah est utile pour la quête du Dofus Ocre (L éternelle moisson).",
      "Recette clé : 2x Écorce de Champaknyde, 2x Trompe de la Tromperelle, 2x Langue de Champodonte, 2x Lamelle de Champbis, 2x Bave de Champ à Gnons, 2x Mandragore, 2x Tanche, 2x Viande Gâtée.",
      "Éliminer le Champbis en priorité (applique 25% de faiblesse tous éléments).",
      "Ne pas laisser le Champodonte approcher en mêlée (frappe proportionnellement à ses PV)."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Collant",
        "strategy": "Les combattants alliés doivent finir leur tour adjacent à un autre allié. Préférer se coller aux invocations alliées plutôt qu aux personnages pour éviter Opiniâtreté de lOugah qui tape en zone.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/collant.png"
      },
      {
        "name": "Dernier",
        "strategy": "L Ougah doit être achevé en dernier. Éliminer les monstres rapidement (il invoque chaque tour), possibilité de bloquer lOugah avec un Pandawa pour limiter son impact.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/dernier.png"
      },
      {
        "name": "Spécial : Mycologie",
        "strategy": "Ne pas terminer son tour en ligne ou en diagonale d un ennemi. Faire en butin 4. Focus lOugah en premier (invocations nombreuses), puis le Champ à Gnons (invoque des Champa Explosifs).",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 15 tours. Reprendre la stratégie globale, prévoir plusieurs tours pour tuer lOugah.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // La Gelaxième dimension oppose le groupe à 4 Gelées Royales (Bleuet/Eau, Citron/Air, Fraise
  24: {
    "summary": "La Gelaxième dimension oppose le groupe à 4 Gelées Royales (Bleuet/Eau, Citron/Air, Fraise/Feu, Menthe/Terre) que l’on peut affronter simultanément ou séparément selon les flaques collectées dans les salles. Chaque Royale dispose de 10% de faiblesses dans son élément propre et 70% de résistances dans les autres, mais le sort Tartinade leur permet de poser des glyphes colorés qui retirent 15% de résistances aux gelées adverses placées dedans.",
    "recommendedLevel": "40 — 70",
    "composition": "Équipe couvrant idéalement 3 à 4 éléments différents pour exploiter les faiblesses de chaque Gelée Royale. À défaut, 2 éléments suffisent en exploitant les glyphes pour baisser les résistances. Le Pandawa est recommandé pour le succès Collant (déplacements alliés).",
    "keyResist": [
      "Eau (Bleuet)",
      "Air (Citron)",
      "Feu (Fraise)",
      "Terre (Menthe)"
    ],
    "phases": [
      {
        "title": "Accès au donjon et mécanique des flaques (salles 1 à 4)",
        "mechanics": [
          "Pas de PNJ : aucune sauvegarde, aucun trousseau de clef. Perte ou déconnexion = reprise depuis le début.",
          "Clef = Multygely (consommable craftable par un Paysan niv. 60 min) : 4x Blugely + 2x Rougely + 3x Vertgely. La consommer téléporte directement en salle 1.",
          "Chaque salle propose 4 groupes, chacun à majorité d’une couleur de gelée (Bleuet / Citron / Fraise / Menthe).",
          "Victoire d’un groupe = obtention d’une flaque de la couleur majoritaire.",
          "Pour affronter les 4 Gelées Royales simultanément : collecter une flaque de chaque couleur (un groupe de couleur différente par salle).",
          "Pour n’affronter qu’une seule Royale : choisir 4 groupes à majorité de la même couleur.",
          "Si 2 flaques de même couleur et 2 d’une autre : choix libre parmi les 2 couleurs ayant 2 flaques.",
          "Parler à n’importe quelle Gelée Royale après la salle 4 pour lancer le combat boss."
        ]
      },
      {
        "title": "Combat des monstres normaux (salles 1-4)",
        "mechanics": [
          "Gelée Bleuet — Bleuet Os : 60 dégâts eau + -30 Chance à la cible (1/cible, 2/tour, ligne 2-7PO).",
          "Gelée Bleuet — Gelpikes : 50 dégâts neutre zone carré taille 1 autour d’elle (1/tour).",
          "Gelée Bleuet — Isométrie : +3PA 2 tours à elle et alliés adjacents (relance 4 tours).",
          "Gelée Bleuet — Tartinade : téléportation + glyphe bleu zone carré taille 1 (2 tours) : 45 dégâts eau aux personnages/invocations début de tour, soin 20PV aux Bleuets, -15% résistances eau 3 tours aux gelées d’autre couleur (à partir tour 2, relance 3 tours).",
          "Gelée Citron — Citron Os : 60 dégâts air + -30 Agilité (1/cible, 2/tour, ligne 2-7PO).",
          "Gelée Citron — Fixation Béton : réduit dommages subis de 24 pendant 2 tours (relance 4 tours).",
          "Gelée Citron — Tartinade : glyphe jaune, mêmes règles qu’Bleuet en air.",
          "Gelée Fraise — Fraise Os : 60 dégâts feu + -30 Intelligence (1/cible, 2/tour, ligne 2-7PO).",
          "Gelée Fraise — Gélifiant : soin 10% PV max + soins reçus +30% 2 tours à elle ou allié (4PO, relance 2 tours).",
          "Gelée Fraise — Tartinade : glyphe rouge, mêmes règles en feu.",
          "Gelée Menthe — Menthe Os : 60 dégâts terre + -30 Force (1/cible, 2/tour, ligne 2-7PO).",
          "Gelée Menthe — Pik-assaut : +2PM 2 tours à elle et alliés adjacents (relance 4 tours).",
          "Gelée Menthe — Tartinade : glyphe vert, mêmes règles en terre."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj56-bleuet-os_orig.png",
            "caption": "Zone de sort Bleuet Os"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj56-tartinade_orig.png",
            "caption": "Zone de sort Tartinade (glyphe coloré)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj56-isometrie_orig.png",
            "caption": "Zone de sort Isométrie"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj56-pik-assaut_orig.png",
            "caption": "Zone de sort Pik-assaut"
          }
        ]
      },
      {
        "title": "Combat boss — Les 4 Gelées Royales",
        "mechanics": [
          "Chaque Royale a 10% de faiblesses dans son propre élément (Bleuet=Eau, Citron=Air, Fraise=Feu, Menthe=Terre) et 70% de résistances dans les 3 autres.",
          "Royale Bleuet Os : 80 dégâts eau + retire 2PA à la cible (1/cible, 2/tour, 2-7PO).",
          "Royale Citron Os : 80 dégâts air + retire 30 puissance à la cible (1/cible, 2/tour, 2-7PO).",
          "Royale Fraise Os : 80 dégâts feu + retire 30 soins à la cible (1/cible, 2/tour, 2-7PO).",
          "Royale Menthe Os : 80 dégâts terre + retire 2PM à la cible (1/cible, 2/tour, 2-7PO).",
          "Tartinade (version Royale) : glyphe de même couleur, 65 dégâts élémentaires (au lieu de 45), soin alliés, -15% résistances aux gelées adverses (à partir tour 2).",
          "Chaque Royale invoque une Gelée de sa couleur à 1PO (relance 5 tours). Au tour 1, les 4 Royales invoquent chacune une gelée : 4 ennemis supplémentaires dès le début.",
          "Gélifiant (Royale Fraise) : soin 10% PV max + soins reçus +30% 2 tours (relance 2 tours).",
          "Isométrie (Royale Bleuet) : +3PA 2 tours à elle et ses alliés adjacents (relance 4 tours).",
          "Pik-assaut (Royale Menthe) : +2PM 2 tours à elle et ses alliés adjacents (relance 4 tours).",
          "Fixation Béton (Royale Citron) : réduit dommages subis de 24 pendant 2 tours (relance 4 tours).",
          "Malus de résistances via glyphes : cumulable. Placer les Royales adverses dans les glyphes de votre élément pour gratter -15% (ou plus si plusieurs passages).",
          "Les gelées n’ont aucune résistance poussée : les dégâts de poussée sont toujours efficaces si une gelée est placée contre un obstacle."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj56-59gelees-roy-res_orig.png",
            "caption": "Tableau des résistances des Gelées Royales"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj56-60glyphes-gel_orig.jpg",
            "caption": "Schéma des glyphes colorés posés par les gelées"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj56-61malus-res_orig.png",
            "caption": "Malus de résistances appliqué par un glyphe adverse"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj56-62res-cumul_orig.png",
            "caption": "Cumul des malus de résistances via glyphes"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj56-66blue-in-yellow_orig.jpg",
            "caption": "Placement d’une Royale Bleuet dans le glyphe jaune (Citron)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj56-67blue-in-yellow2_orig.png",
            "caption": "Résultat : -15% résistances air sur la Royale Bleuet"
          }
        ]
      }
    ],
    "tips": [
      "Accès via Multygely (consommable), sans PNJ : pas de sauvegarde possible. Perte = recommencer depuis le début avec une nouvelle clef.",
      "Pour affronter les 4 Gelées Royales : choisir un groupe de couleur différente à chaque salle (une flaque de chaque couleur).",
      "Pierre d’âme de puissance 100 minimum requise pour capturer le boss.",
      "La capture des 4 âmes de Gelées Royales est utile pour la quête du Dofus Ocre (L’éternelle moisson).",
      "Si l’équipe ne couvre qu’un ou deux éléments, conserver les Royales de cet élément en vie pour profiter de leurs glyphes et réduire les résistances des autres.",
      "Les dégâts de poussée ignorent toutes les résistances élémentaires des gelées : très utile si une Royale a trop de résistances.",
      "Le malus -15% des glyphes est cumulable : plusieurs passages dans un glyphe peuvent rendre une Royale récalcitrante beaucoup plus vulnérable."
    ],
    "rewards": [
      "Flaques de gelées (inventaire, servent à choisir le boss)",
      "Âme des Gelées Royales (nécessaire pour la quête du Dofus Ocre)"
    ],
    "achievements": [
      {
        "name": "Duel",
        "strategy": "Lorsqu’un combattant allié attaque un ennemi, aucun autre allié ne doit attaquer ce même ennemi. Assigner une Gelée Royale par personnage. Respecter la règle aussi sur les invocations. Si un personnage doit finir une Royale seul en fin de combat, le booster au maximum ou utiliser les dégâts de poussée.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duel.png"
      },
      {
        "name": "Collant",
        "strategy": "Finir chaque tour sur une case adjacente à un allié (les invocations ne comptent pas). Utiliser des sorts de placement (ex. Pandawa) pour maintenir la condition. Attention à la Royale Menthe qui retire 2PM.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/collant.png"
      },
      {
        "name": "Spécial : Privé de dessert",
        "strategy": "Les invocations ennemies ne doivent subir aucun dommage. Ne pas les attaquer, éviter les dégâts de zone et de poussée sur elles. Utiliser leurs glyphes pour baisser les résistances des Royales et raccourcir le combat.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages en moins de 20 tours. Éviter 2 personnages du même élément. Chaque personnage s’occupe de la Royale de son élément, puis les deux focalisent les Royales restantes en utilisant les faiblesses élémentaires ou les dégâts de poussée.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Le Corailleur Magistral est le boss de la Grotte Hesque (Île d'Otomaï), frappant en air
  25: {
    "summary": "Le Corailleur Magistral est le boss de la Grotte Hesque (Île d'Otomaï), frappant en air. Il est absolument inoffensif à distance mais possède un sort d'OS en mêlée (Frappe de Corail Magistrale, 20 000 dégâts air). La stratégie consiste à rester à distance, éliminer les Palmifleurs en priorité à cause de leur malus de résistance, puis finir le boss au loin.",
    "recommendedLevel": "50 — 60",
    "composition": "Classes à distance conseillées ; éléments air et terre favorisés pour les faiblesses du boss. Un Pandawa ou Féca utile pour l'invulnérabilité en mêlée (succès Spécial). Débuffeurs recommandés pour enlever le malus Décapsulation (Éniripsa, Pandawa).",
    "keyResist": [
      "Terre",
      "Air"
    ],
    "phases": [
      {
        "title": "Salles de monstres (avant le boss)",
        "mechanics": [
          "4 salles de monstres à traverser avant le boss.",
          "Monstres présents : Coraillers, Crustorails (4 variantes élémentaires : eau/terre/air/feu) et Palmifleurs (4 variantes élémentaires).",
          "Coraillement (Corailler) : inflige 60 dégâts eau et retire 10% résistance eau pendant 3 tours en zone croix taille 1.",
          "Frappe de Corail (Corailler) : retire 1PM et inflige 90 dégâts eau en zone cercle taille 6 (relance 6 tours).",
          "Lancer de Corail (Corailler) : retire 1PM et inflige 50 dégâts eau à la cible (portée 10PO).",
          "Pince de Corail (Crustorail) : inflige 60 dégâts dans son élément et augmente les dommages alliés de 3 à 8 pendant 5 tours (mêlée uniquement).",
          "Protection de Corail (Crustorail) : augmente résistances de 20% (40% crit) dans son élément pour lui et alliés pendant 3 tours (relance 5 tours).",
          "Décapsulation (Palmifleur) : retire 100% résistances (200% crit) dans tous éléments pendant 2 tours — débuffable (portée 8PO, relance 4 tours).",
          "Fleur des îles (Palmifleur) : inflige 90 dégâts en vol de vie dans son élément et soigne alliés de 60 (portée 2PO)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj70-coraillement_orig.png",
            "caption": "Zone du sort Coraillement (Corailler)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj70-frappe-corail_orig.png",
            "caption": "Zone du sort Frappe de Corail (Corailler)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj70-lancer-corail_orig.png",
            "caption": "Zone du sort Lancer de Corail (Corailler)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj70-pince-corail_orig.png",
            "caption": "Zone du sort Pince de Corail (Crustorail)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj70-protection-corail_orig.png",
            "caption": "Zone du sort Protection de Corail (Crustorail)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj70-decapsulation_orig.png",
            "caption": "Zone du sort Décapsulation (Palmifleur)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj70-fleur-des-iles_orig.png",
            "caption": "Zone du sort Fleur des îles (Palmifleur)"
          }
        ]
      },
      {
        "title": "Combat du Boss — Corailleur Magistral",
        "mechanics": [
          "Coraillement Magistral : le boss gagne 12PA et 400 puissance pendant 4 tours, mais perd ses 3PM en fin de tour pendant toute la durée (relance 5 tours). Il y a donc 1 tour par cycle où il a ses PM mais pas le boost PA.",
          "Frappe de Corail Magistrale : inflige 20 000 dégâts air en vol de vie uniquement en mêlée — OS n'importe quel personnage sans exception. Coûte 16PA, donc ne peut être lancé que sous l'effet de Coraillement Magistral.",
          "Lancer de Corail Magistral : inflige 25 dégâts air et retire 30 agilité (60 crit) pendant 2 tours (portée 5PO).",
          "Sous Coraillement Magistral : le boss a 20PA mais 0PM, il ne peut pas bouger pour atteindre en mêlée.",
          "Le 5e tour du cycle : le boss récupère ses PM mais sans le boost PA, il peut bouger mais ne peut pas utiliser le sort d'OS.",
          "Même un personnage invulnérable est OS par Frappe de Corail Magistrale (sauf bug d'IA au tour 1 si le personnage invulnérable se colle en mêlée).",
          "Les Palmifleurs présents dans le combat de boss peuvent réduire les résistances de 100% — très dangereux.",
          "Rester à distance en permanence ; ne jamais se placer en mêlée avec le boss."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj70-coraillement-magistral_orig.png",
            "caption": "Zone du sort Coraillement Magistral (Boss)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj70-frappe-corail-magistrale_orig.png",
            "caption": "Zone du sort Frappe de Corail Magistrale (OS en mêlée)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj70-lancer-corail-magistral_orig.png",
            "caption": "Zone du sort Lancer de Corail Magistral"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj70-35pm_orig.png",
            "caption": "Le Corailleur Magistral avec 20PA mais 0PM sous Coraillement Magistral"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj70-36decap_orig.png",
            "caption": "Effet Décapsulation en combat boss (malus résistances)"
          }
        ]
      }
    ],
    "tips": [
      "Accès : Île d'Otomaï accessible après les quêtes 'Le nouveau monde' et 'L'Île des naufragés'. Entrée du donjon sur la Plage de Corail en [-59,14].",
      "Recette de la clef : 2x Bulbe Kouraçao, 2x Bulbe Malibout, 2x Bulbe Passaoh, 2x Bulbe Morito, 2x Viande Tendre, 2x Poisson-Chaton, 3x Trèfle à 5 feuilles, 3x Avoine.",
      "Donjon magistral.",
      "Pour capturer l'âme du boss, prévoir une pierre d'âme de puissance 50 minimum.",
      "L'âme du Corailleur Magistral est utile pour la quête du Dofus Ocre : L'éternelle moisson.",
      "Quête liée : Après lui, le déluge.",
      "Ne jamais aller en mêlée avec le Corailleur Magistral : son sort Frappe de Corail Magistrale OS à tous les coups.",
      "Éliminer les Palmifleurs en priorité : leur Décapsulation retire 100% résistances dans tous éléments pendant 2 tours (débuffable).",
      "Le sort Décapsulation est débuffable (Mot de Jouvence de l'Éniripsa, Lait de Bambou du Pandawa, etc.).",
      "Ordre de focus recommandé : Palmifleurs → Crustorails → Corailler → puis Corailleur Magistral à distance.",
      "Le boss est inoffensif à distance et souvent à 0PM : maintenir la distance garantit la sécurité totale."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Hardi",
        "strategy": "Les combattants alliés doivent finir leur tour en cellule adjacente à un ennemi. Garder le Corailler (monstre) en vie pour s'y coller tout en tapant le Corailleur Magistral à distance. À 5 personnages ou plus, garder un second monstre en vie (éviter les Palmifleurs si possible). En fin de combat, éliminer le dernier monstre et le boss au même tour. Il n'est pas nécessaire d'être en mêlée lors du coup de grâce.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj70-37hardi_orig.jpg"
      },
      {
        "name": "Blitzkrieg",
        "strategy": "Chaque ennemi attaqué doit être achevé avant son prochain tour. Focus les monstres un par un dans l'ordre Palmifleur → Crustorail → Corailler, en commençant juste après leur tour pour avoir un tour complet pour les éliminer. Puis se booster au maximum à distance et tout lâcher sur le Corailleur Magistral juste après son tour. Éléments terre et air conseillés pour exploiter les faiblesses du boss."
      },
      {
        "name": "Spécial : Collé-serré",
        "strategy": "À partir du tour global 2, chaque combattant allié doit commencer son tour au corps-à-corps du Corailleur Magistral, et le boss doit être achevé en dernier. Stratégie recommandée : un Pandawa (ou Féca) avec invulnérabilité en mêlée joue premier, se colle au boss au tour 1, absorbe l'OS grâce à l'invulnérabilité, puis place l'équipe autour du boss au tour 2. Alternative plus simple : finir tous les ennemis y compris le boss au tour 1."
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 20 tours. Stratégie identique à la globale : rester à distance, focus Palmifleurs → Crustorails → Corailler → Corailleur Magistral. Facile à réaliser au niveau 50."
      },
      {
        "name": "Compagnon : Les z'autres",
        "strategy": "Au moins un compagnon parmi Haku, Manitou Zoth, Karotz, Grouillot ou Phong Huss doit participer, avec au minimum 4 combattants au total (2 personnages + 2 compagnons valide). Le second compagnon peut être n'importe lequel parmi les 52 existants."
      }
    ]
  },
  // Le Kanniboul Ebil invoque une Poupée Aycetroy qui gagne 50 de puissance par tour et tape e
  27: {
    "summary": "Le Kanniboul Ebil invoque une Poupée Aycetroy qui gagne 50 de puissance par tour et tape en zone autour d elle. La stratégie clé est d ignorer la Poupée, rester à distance du boss (qui ne tape qu en ligne), et focus les monstres un par un en commençant par le Kanniboul Sarbak.",
    "recommendedLevel": "100 — 130",
    "composition": "Classes à distance recommandées. Pour le succès Premier, privilégier des classes tapant en air (faiblesse du boss). Sort Libération utile pour le succès Zombie.",
    "keyResist": [
      "Air"
    ],
    "phases": [
      {
        "title": "Salles avant le boss",
        "mechanics": [
          "Le donjon comporte plusieurs salles avec des Kannibouls Ark, Eth, Jav, Sarbak et Tam.",
          "Kanniboul Ark : frappe en feu, repousse en mêlée ou retire 5% de résistance à distance.",
          "Kanniboul Eth : en mêlée, applique \"Éternuement Collatéral\" — la cible intercepte tous les dégâts reçus par le Kanniboul Eth pendant 1 tour (débuffable en débuffant le Kanniboul Eth, pas la cible).",
          "Kanniboul Jav : vol de vie en eau + bouclier (10% PV) sur les alliés proches.",
          "Kanniboul Sarbak : applique via \"Sarbakanniboul\" un poison qui inflige 12 dégâts terre par PA utilisé — retirer sa PO en priorité.",
          "Kanniboul Tam : tape en zone cercle autour de lui (inoffensif à distance), booste aléatoirement les alliés proches.",
          "Ordre de focus conseillé : Sarbak > Jav > Tam. Garder le Kanniboul Eth à distance (butin 6+ seulement)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj71-sarbakanniboul_orig.png",
            "caption": "Sarbakanniboul — poison PA"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj71-eternuement-collateral_orig.png",
            "caption": "Éternuement Collatéral — interception de dégâts"
          }
        ]
      },
      {
        "title": "Combat contre le Kanniboul Ebil (boss)",
        "mechanics": [
          "Bénédiction Moonesque : tous les monstres dans un cercle de taille 2 autour d une cible frappée sont soignés de 50% des dégâts infligés — actif 2 tours sur 4, focus les monstres un par un pour limiter l effet.",
          "Inspiration Moonesque : invoque une Poupée Aycetroy dès le tour 1 ; réinvocable immédiatement après mort, 1 seule à la fois.",
          "Frénésie Moonesque (Poupée) : gagne 50 puissance par tour (infini) et tape en zone cercle de taille 2 en fin de tour — s inflige aussi des dégâts.",
          "Myopie Poupesque (Poupée) : échange de place avec un personnage et retire 5PO pendant 2 tours (portée 10PO, relance 4 tours).",
          "Bouboule : inflige 110 dégâts neutre et applique \"Maudit\" — tous les dégâts infligés à la Poupée sont renvoyés sur le personnage maudit (sauf le coup de grâce). Uniquement en ligne jusqu à 6PO.",
          "Ignorer la Poupée Aycetroy : la tuer est inutile car elle est réinvoquée, et taper la Poupée renvoie les dégâts sur le personnage maudit.",
          "Rester à distance du boss (hors ligne ou au-delà de 6PO) pour éviter Bouboule et ne jamais être maudit.",
          "Le Kanniboul Ebil a de bonnes résistances terre (30%) et une faiblesse air (10%).",
          "Éliminer d abord tous les Kannibouls alliés, puis finir le boss."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj71-30frenesie_orig.png",
            "caption": "Frénésie Moonesque — montée en puissance infinie de la Poupée"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj71-31bouboule_orig.png",
            "caption": "Bouboule — renvoi de dégâts sur le personnage maudit"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj71-32renvoi_orig.jpg",
            "caption": "Exemple de renvoi de dégâts via sort Bouboule et la Poupée"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj71-34benediction_orig.jpg",
            "caption": "Bénédiction Moonesque — soin des monstres adjacents"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj71-35interception_orig.jpg",
            "caption": "Éternuement Collatéral — le Pandawa intercepte les dégâts destinés au Kanniboul Eth"
          }
        ]
      }
    ],
    "tips": [
      "Entrée du donjon : Forêt des Masques sur l Île de Moon en [29,9].",
      "Accès à l île : réaliser la quête \"Partir un jour sans retour\" depuis [11,10], acheter un ticket et s équiper d ailes en bois + casque (tailleur) pour le canon.",
      "Clef : 1 Poupée Vaudou Ark + 1 Poupée Vaudou Eth + 1 Poupée Vaudou Jav + 1 Poupée Vaudou Sarbak + 5 Bois de Chêne + 5 Kobalte + 5 Menthe Sauvage + 5 Houblon.",
      "Pierre d âme de puissance 100 minimum requise pour capturer le boss.",
      "L âme du boss est utile pour la quête du Dofus Émeraude \"Le voleur d âmes\".",
      "Lancer la quête \"T as les boules\" avant le donjon (aucun prérequis, juste valider le donjon).",
      "Quêtes liées : Un indigeste chez les indigènes, Un Kanniboul versé, T as les boules.",
      "Après le boss, cliquer sur l urne dans la salle de sortie pour récupérer le parchemin du sort commun Kannibulle (lié au personnage, non échangeable).",
      "Ignorer la Poupée Aycetroy : inutile de la tuer, elle est réinvoquée immédiatement.",
      "Retirer la PO du Kanniboul Sarbak pour neutraliser son poison PA.",
      "Garder le Kanniboul Eth à distance pour éviter son sort d interception de mêlée (butin 6+)."
    ],
    "rewards": [
      "Sort commun Kannibulle (parchemin dans l urne après le boss).",
      "Âme du Kanniboul Ebil (utile pour le Dofus Émeraude)."
    ],
    "achievements": [
      {
        "name": "Zombie",
        "strategy": "Utiliser exactement 1 PM par tour. Avoir de la fuite pour se détacler. Le sort commun Libération (pousse les ennemis) est très utile pour les classes sans mobilité.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/zombie.png"
      },
      {
        "name": "Premier",
        "strategy": "Le Kanniboul Ebil doit être achevé en premier. Privilégier les éléments autres que terre (faiblesse air 10%). Full focus le boss, retirer la portée des autres Kannibouls. Ne pas taper de monstre à moins de 2PO du boss sous Bénédiction Moonesque (il serait soigné).",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/premier.png"
      },
      {
        "name": "Spécial : Rituel de survie",
        "strategy": "Chaque ennemi frappé doit avoir une entité adjacente (allié ou ennemi). Trois techniques : frapper en mêlée, placer les Kannibouls côte à côte via sorts de placement, ou placer des invocations au contact des cibles. Commencer par les monstres les plus faciles.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "2 personnages maximum, moins de 20 tours. Focus Sarbak > Jav > Tam, ignorer la Poupée, rester à distance du boss. Retirer la PO au Sarbak si impossible de le one-shot. Finir par le Kanniboul Ebil hors ligne ou en retirant sa PO.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Le Kimbo possède 400% de résistances dans tous les éléments
  28: {
    "summary": "Le Kimbo possède 400% de résistances dans tous les éléments. Il faut choisir un duo (Eau/Terre ou Air/Feu), frapper Kimbo dans cet élément pour lui appliquer un état (Glyphe pair ou impair), attendre que son Disciple invoque les glyphes correspondants, puis faire commencer le tour du Kimbo sur un glyphe pour lui retirer 400% de résistances dans les deux éléments choisis. Le placement est critique : commencer son tour sur un glyphe = mort instantanée.",
    "recommendedLevel": "190",
    "composition": "Tout type de groupe ; conseillé d'avoir un personnage avec bonne capacité de placement et forte initiative pour déplacer les alliés hors des glyphes. Un personnage capable d'appliquer Pesanteur/Enraciné/Indéplaçable est un plus pour neutraliser le Kaskargo.",
    "keyResist": [
      "Air",
      "Feu"
    ],
    "phases": [
      {
        "title": "Monstres du donjon",
        "mechanics": [
          "Pédoncule perfide — Radicelle : booste un allié de 200 Puissance + 10 dommages pour 2 tours, cumulable à chaque frappe de l'allié affecté ; ne pas frapper un monstre affecté par ce sort.",
          "Pédoncule perfide — Radicule : 250 Terre depuis le càc ; rester hors càc.",
          "Bitouf aérien — Aéroportage : échange de place + 250 Eau, jusqu'à 10 PO sans LdV ; peut placer un personnage sur un glyphe du Kaskargo ou du Kimbo.",
          "Bitouf aérien — Tornade pernicieuse : 300 Air + repousse 3 cases au càc.",
          "Kaskargo — Bave : se téléporte et pose un glyphe OS (1 case blanche), 2 glyphes par tour, jusqu'à 5 PO sans LdV.",
          "Kaskargo — Coopération Baveuse : échange de place avec une cible et la pose sur le glyphe ; relance toutes les 3 tours, NON utilisable au tour 1.",
          "Kaskargo — Mucus : 400 dégâts élément aléatoire en croix taille 1 + retire 2 PM et 20 fuite, uniquement si en état Déplacé/Pesanteur/Indéplaçable/Enraciné.",
          "Meupette Choh — malus 50 esquive PA/PM sur tous les personnages pour 2 tours, se répète à chaque frappe (cumulable).",
          "Meupette Choh — Meurtrissure : 250 Eau en zone ligne très grande portée sans LdV ; ne pas aligner plusieurs personnages.",
          "Poolay — Haleine de vers : 150 Feu + 150 Air + 150 Eau, retire 1 PO (5 tours) et 1 PA/PM esquivables (5 tours).",
          "Poolay — Poolay frit : 250 Air + attire 2 cases, 3-5 PO sans LdV (1 fois par cible)."
        ]
      },
      {
        "title": "Boss — Kimbo : sorts et principe",
        "mechanics": [
          "Boum Boh : +50 Agilité pour 3 tours (buff personnel).",
          "Furie du Kimbo : 350 Air + 50 Air vol de vie + repousse 2 cases, uniquement au càc.",
          "Invocation du Disciple : invoque le Disciple du Kimbo (0 PM de base, résistances le rendant intuable).",
          "Téléportation du Kimbo : se téléporte jusqu'à 8 cases sans LdV.",
          "Le Kimbo a 400% de résistances dans chaque élément ; frapper Terre/Eau → état Glyphe Impair ; frapper Air/Feu → état Glyphe Pair. L'élément neutre n'a aucun effet. Les deux états ne se cumulent pas.",
          "Disciple du Kimbo : après activation d'un état, se booste 9 000 Agilité + 1 PM ; peut OS au càc après ce boost."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/furie-du-kimbo_orig.png",
            "caption": "Furie du Kimbo — schéma de portée"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/teleportation-du-kimbo_orig.png",
            "caption": "Téléportation du Kimbo — schéma de portée"
          }
        ]
      },
      {
        "title": "Mécanique des glyphes (Disciple du Kimbo)",
        "mechanics": [
          "Glyphe Impair (déclenché en frappant Eau/Terre) : glyphes posés sur toutes les cases à distance impaire du Disciple. Si Kimbo commence son tour sur un glyphe : perd 400% résist. Eau/Terre, gagne 800% résist. Air/Feu pour 1 tour.",
          "Glyphe Pair (déclenché en frappant Air/Feu) : glyphes posés sur toutes les cases à distance paire du Disciple. Si Kimbo commence son tour sur un glyphe : perd 400% résist. Air/Feu, gagne 800% résist. Eau/Terre pour 1 tour.",
          "Commencer son tour sur un glyphe du Disciple = OS instantané.",
          "Si état Impair : se placer à distance paire du Disciple avant qu'il pose les glyphes.",
          "Si état Pair : se placer à distance impaire du Disciple (hors càc) avant qu'il pose les glyphes.",
          "Quand le Disciple pose les glyphes, il gagne 1 PM et se déplace : au tour suivant les glyphes ne sont plus aux mêmes cases. Pour stabiliser : repousser le Disciple d'un nombre impair de cases entre deux cycles, ou finir son tour sur une case glyphée sans déplacer le Disciple.",
          "Pour tuer Kimbo en plusieurs tours : re-frapper dans le même élément pour relancer les glyphes au cycle suivant."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/impaire_orig.png",
            "caption": "État Impair — cases glyphées aux distances impaires du Disciple"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/paire_orig.png",
            "caption": "État Pair — cases glyphées aux distances paires du Disciple"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/tactique_3_orig.png",
            "caption": "Schéma tactique global du combat Kimbo"
          }
        ]
      },
      {
        "title": "Stratégie globale et risques de placement",
        "mechanics": [
          "Première fois : éliminer tous les monstres avant de s'attaquer au Kimbo.",
          "Si combat simultané : attention au Bitouf (coopère + pousse 3 cases) et à la poussée de 2 cases du Kimbo contre un obstacle — risque d'atterrir sur un glyphe.",
          "Poussée du Kimbo sans obstacle : atterrissage sur une case safe.",
          "Poussée du Kimbo contre un obstacle : risque d'atterrir sur un glyphe.",
          "Bitouf — coopère et pousse 3 cases : risque de placement sur un glyphe dans les deux cas."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/kim-pousse1_orig.png",
            "caption": "Kimbo pousse contre un obstacle — risque de finir sur un glyphe"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/kim-pousse2_orig.png",
            "caption": "Kimbo pousse sans obstacle — case safe"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/bitouf-pousse2_orig.png",
            "caption": "Bitouf pousse 3 cases et coopère — risque de placement sur un glyphe"
          }
        ]
      }
    ],
    "tips": [
      "Position du donjon : entrée dans le Feuillage de l'arbre Hakam en [-54,16].",
      "Recette de la clef : 2x Bar Rikain, 2x Cloaque du Poolay, 2x Croupion du Bitouf aérien, 2x Souche de l'Abrakleur clair, 2x Bave du Kaskargo, 3x Belladone, 3x Maïs, 2x Viande Fraîche.",
      "Pierre d'âme : puissance 190 minimum pour capturer le boss.",
      "La capture de l'âme du Kimbo est utile pour la quête du Dofus Ocre : L'éternelle moisson.",
      "Quêtes liées : Tour de main, La bénédiction de Thomahon, Ruée sur le Kimbo, Un pouvoir mérydique.",
      "Choisir son duo d'élément dès le début et s'y tenir — Eau/Terre ou Air/Feu.",
      "Ne jamais commencer son tour sur un glyphe du Disciple (OS instantané).",
      "Mettre le Kaskargo en Pesanteur/Enraciné/Indéplaçable pour bloquer sa Coopération Baveuse.",
      "Appliquer Pesanteur/Enraciné/Indéplaçable sur le personnage jouant juste après le Kaskargo pour qu'il ne puisse pas être coopéré."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Une paire d'impairs",
        "strategy": "Chaque ennemi doit subir les effets du glyphe déclenché par le Disciple du Kimbo avant de recevoir des dégâts. Frapper le Kimbo dès le tour 1 pour que le Disciple invoque les glyphes au tour 2. Utiliser un personnage avec forte initiative et bonne capacité de placement pour positionner les monstres dans les glyphes à partir du tour 2. Mettre en Pesanteur/Enraciné/Indéplaçable le premier personnage en initiative (pour déplacer des alliés hors des glyphes) et le personnage jouant juste après le Kaskargo. Possible aussi de mettre le Kaskargo en Pesanteur avant son premier tour pour bloquer sa Coopération Baveuse.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Le Koulosse est un boss de la Caverne du Koulosse qui ne fait aucun dégât direct mais util
  30: {
    "summary": "Le Koulosse est un boss de la Caverne du Koulosse qui ne fait aucun dégât direct mais utilise son Souffle du Koulosse pour transformer les personnages en Boufcoul (perte de 100 PA), invoque des Bouftous des Cavernes et peut invoquer des Boufcoul si coup critique. La stratégie principale consiste à rester à distance en abusant des sorts de retrait PM/PO, se cacher derrière des obstacles, et éliminer immédiatement tout Boufcoul invoqué.",
    "recommendedLevel": "100",
    "composition": "Préférer une équipe avec diversité élémentaire (2 persos eau/feu + 2 persos terre/air). Des classes avec des sorts de débuff sont très utiles (Pandawa, Sadida, Enutrof, Eniripsa) car la majorité des effets sont débuffables.",
    "keyResist": [
      "Eau",
      "Feu"
    ],
    "phases": [
      {
        "title": "Salles 1 à 4 — Progression dans le Canyon",
        "mechanics": [
          "Salles 1 et 2 : groupes classiques à éliminer, pas de mécanique spéciale.",
          "Transition dans les cavernes : présence de Boufcoul et Bouftou des Cavernes ; profiter pour taper les Boufcoul afin de débloquer le succès Boufcools.",
          "Boufcoul (Bise du Boufcoul) : rend invisible la cible pour 1 tour, lui donne 5 PM, 10% de critique et 200 agilité pour 2 tours (cumulable). Mêlée uniquement.",
          "Boufcoul (Morsure du Boufcoul) : retire 10 fuite et inflige 100 dégâts eau. Mêlée uniquement.",
          "Bouftou des Cavernes (Bavouille) : retire 2 PA à distance (6 PO, esquivable).",
          "Bouftou des Cavernes (Crachouille) : retire 2 PM à distance (6 PO, esquivable).",
          "Bouftou des Cavernes (Morsure) : inflige 150 dégâts neutre en mêlée.",
          "Salles 3 et 4 : idem, progresser jusqu'au boss."
        ]
      },
      {
        "title": "Boss — Le Koulosse",
        "mechanics": [
          "Appel du Koulosse : attire la cible de 10 cases en ligne (2-8 PO, modifiable). Seul sort utilisable au tour 1. Ne pas se placer en ligne avec lui en phase de préparation.",
          "Souffle du Koulosse : transforme la cible en Boufcoul pour 1 tour en ligne jusqu'à 5 PO (3 fois/tour, 1 fois/cible). La cible perd 100 PA et ne peut qu'utiliser ses PM. Débuffable par un allié. Disponible uniquement à partir du tour 2.",
          "Invocation de Bouftou des Cavernes : invoque un Bouftou (en cc, invoque un Boufcoul). Jusqu'à 3 PO sans LdV. Disponible à partir du tour 2. Maximum 2 invocations simultanées.",
          "Calumet de la Paix : change l'apparence d'un Bouftou invoqué en Boufcoul et lui donne 200 For/Agi/Cha/Vit + 5 PM pour 2 tours. Utilisable uniquement sur ses invocations, lançable tous les 2 tours.",
          "Boufcoul invoqué (10% de chance sur cc) : peut rendre le Koulosse invisible et lui donner 5 PM en mêlée — situation très dangereuse, focus immédiat.",
          "Le Koulosse a énormément d'initiative, très difficile de jouer avant lui à bas niveau.",
          "Le Koulosse ne fait aucun dégât direct : tous ses sorts sont utilitaires ou d'invocation."
        ]
      },
      {
        "title": "Stratégie globale — Combat du boss",
        "mechanics": [
          "Rester à distance du Koulosse en utilisant des sorts de retrait PM et de poussée.",
          "Se cacher derrière des obstacles pour briser la ligne de vue (ses sorts nécessitent une LdV).",
          "Retirer la PO du Koulosse : tous ses sorts sont à PO modifiable, en lui retirant sa PO il ne peut agir qu'en mêlée (quasi inoffensif).",
          "Si un personnage est transformé en Boufcoul : le débuffer ou le placer hors de portée du Koulosse.",
          "Si un Boufcoul est invoqué : focus total immédiat avant qu'il ne rende invisible le Koulosse.",
          "Si le Koulosse est invisible et qu'un Boufcoul est présent : débuffer le Koulosse avant son prochain tour.",
          "Ordre recommandé : éliminer tous les Bouftous des Cavernes et invocations, puis attaquer le Koulosse. Ou laisser 2 Bouftous des Cavernes en vie pour empêcher toute nouvelle invocation (max 2 simultanées).",
          "Si équipe eau/feu uniquement : focus Koulosse en priorité (faiblesse eau et feu)."
        ]
      }
    ],
    "tips": [
      "Accès : [-17,8] au bout du Canyon Sauvage (Montagne des Koalaks). Se placer sur la case devant le PNJ Gardien Koalak avant de lui parler.",
      "Recette clef : 2x Os de Pékeualak, 2x Étoffe de Dok Alako, 2x Peau de Piralak, 2x Boomerang du Warko Marron, 2x Viande Exsudative, 2x Anguille, 2x Edelweiss, 2x Seigle.",
      "Pierre d'âme de puissance 100 minimum pour capturer le boss. Utile pour la quête du Dofus Ocre : L'éternelle moisson.",
      "Après la salle boss, une grotte contient des Boufcoul et Bouftou des Cavernes : taper ces monstres pour débloquer le succès Boufcools. L'archi-monstre Doktopuss le Maléfique peut s'y trouver.",
      "À la fin du donjon : 1x Pelote de laine boufcoul (craft panoplie du Koulosse) + téléportation au zaap Koalak [-16,1].",
      "Quêtes liées : C'est stupéfiant, Un juge hystérique.",
      "Le Koulosse ne fait aucun dégât direct : il joue sur les transformations, invocations et les déplacements."
    ],
    "rewards": [
      "1x Pelote de laine boufcoul (permet de craft la panoplie du Koulosse)",
      "Téléportation au zaap Koalak [-16,1]"
    ],
    "achievements": [
      {
        "name": "Boufcools",
        "strategy": "Taper des Boufcoul et Bouftou des Cavernes dans la grotte du donjon (après la salle boss ou lors de la transition entre salles). On n'en trouve que dans ce donjon."
      },
      {
        "name": "À la cool",
        "strategy": "Aucun allié ne doit être transformé en Boufcoul pendant tout le combat. Le sort de transformation ne se lance qu'en ligne jusqu'à 5 PO et seulement à partir du tour 2. Retirer la PO du Koulosse pour le limiter à la mêlée, ou ne jamais rester en ligne avec lui. Si le Koulosse est éliminé avant le tour 2, le succès est automatiquement validé.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Le Kralamoure Géant possède 900% de résistances permanentes dans tous les éléments
  31: {
    "summary": "Le Kralamoure Géant possède 900% de résistances permanentes dans tous les éléments. La stratégie consiste à invoquer les quatre tentacules dans le bon ordre en les tapant par élément, puis à les placer correctement pour forcer le boss à perdre ses résistances pendant 1 tour.",
    "recommendedLevel": "200",
    "composition": "Requiert au minimum 49 personnes pour ouvrir le donjon. Inclure un Pandawaste ou une invocation pour bloquer les tentacules. Des classes avec sorts de placement sont utiles pour le succès spécial.",
    "keyResist": [
      "Eau",
      "Feu",
      "Terre",
      "Air"
    ],
    "phases": [
      {
        "title": "Ouverture du donjon",
        "mechanics": [
          "Réunir 49 personnages minimum pour ouvrir l'antre.",
          "Placer 12 personnages sur les dalles de chacune des 4 salles de l'île d'Otomaï : [-52,15], [-49,9], [-56,4], [-55,11].",
          "Placer un personnage sur la dalle à l'entrée du Kralamoure en [-60,-8] pour ouvrir la grille.",
          "La porte reste ouverte environ 40 minutes. Un PNJ Référent des salles aux dalles peut téléporter vers l'entrée une fois le donjon ouvert.",
          "Accès prérequis : avoir terminé les quêtes 'Le Gardien du Pont de la Mort' et 'La vengeance de Peggy la Porkass'."
        ]
      },
      {
        "title": "Salles de monstres",
        "mechanics": [
          "Tour Bassingue - Tourbe réparatrice : boost de 25% critique + soin ~125 PV en zone cercle rayon 2PO autour de lui (1 tour sur 2).",
          "Tour Bassingue - Tourbe malveillante : 80 dommages air en zone marteau + retire 3 PO (6 en cc) pour 2 tours, portée max 7 cases.",
          "Ouassingue Entourbé - Equarrissage : 60 dommages eau uniquement depuis la case càc.",
          "Ouassingue Entourbé - Réformation : soin ~800 PV sur lui-même ou allié, mais met l'état insoignable 3 tours.",
          "Ouassingue Entourbé - Abnégation : zone cercle rayon 2PO, sacrifie alliés pour 2 tours (dégâts sur eux redirigés vers le ouassingue).",
          "Ouassingue Entourbé - Permutation : échange de place avec un allié, entre en état déplacé 1 tour.",
          "Bourbassingue - Attraction boueuse : attire une cible à son càc en ligne, portée max 6 cases.",
          "Bourbassingue - Boue sirupeuse : 60 dommages eau vol de vie depuis càc + poison 16-25 vol de vie eau pour 4 tours (cumulable).",
          "Bourbassingue - Bourbier : retire 3 PM en zone cercle rayon 3PO.",
          "Roissingue - Retour du Roi : boost un allié de 120 Puissance pour 2 tours (si personnage au càc de l'ennemi boosté, perd 220 Puissance).",
          "Roissingue - Déchaussage : 250 dommages terre (600 en cc) en zone marteau + retire 7 PM esquivables 1 tour, portée en ligne max 5 cases.",
          "Roissingue - Dépouillage : retire 50 soins et 420 agilité pour 2 tours en zone croix 3PO."
        ]
      },
      {
        "title": "Combat contre le Kralamoure Géant - Invocation des tentacules",
        "mechanics": [
          "Le Kralamoure Géant a 900% de résistances dans tous les éléments. Taper un élément invoque le tentacule correspondant au tour suivant.",
          "Ordre conseillé : Tour 1 = taper Eau (invoque Tentacule Quaternaire), Tour 2 = taper Feu (Tentacule Tertiaire), Tour 3 = taper Terre (Tentacule Secondaire), Tour 4 = taper Air (Tentacule Primaire en dernier).",
          "Tentacule Primaire (air) : OS au càc sauf à son premier tour.",
          "Tentacule Secondaire (terre) : malus de 400 soins + frappe 70 dommages feu.",
          "Tentacule Tertiaire (feu) : frappe 150 dommages air + retire 6 PM esquivables.",
          "Tentacule Quaternaire (eau) : passe le tour en zone marteau + frappe 20 dommages terre.",
          "Bloquer Quaternaire, Tertiaire et Secondaire dans le coin gauche autour d'une invocation type Pandawasta (la protéger absolument).",
          "Placer le Tentacule Primaire devant le nez du Kralamoure pour bloquer sa ligne de vue.",
          "Premier tour : placer personnages avec le plus de vitalité en première ligne, les autres derrière. Puis se placer sur deux lignes pour que seuls deux personnages par ligne prennent les dégâts."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/vierge-copie_orig.png",
            "caption": "Schéma de placement des tentacules"
          }
        ]
      },
      {
        "title": "Tours 5-6 : Placement et protection",
        "mechanics": [
          "Tour 5 : le Kralamoure invoque le Tentacule Primaire, le placer devant le Kralamoure. Placer une invocation (ex. chafer) au càc du Primaire (derrière le tentacule pour éviter la ligne de vue du Krala).",
          "Tour 6 : Le Primaire tue l'invocation et avance. Replacer le Primaire devant le Krala. Retirer un maximum de PM aux tentacules. Placer une nouvelle invocation au càc du Primaire.",
          "Les tentacules Secondaire, Tertiaire, Quaternaire doivent taper chacun l'invocation qui les bloque sans la tuer."
        ]
      },
      {
        "title": "Tour 7 : Vulnérabilité du Kralamoure",
        "mechanics": [
          "Vulnérabilité de la Tourbière : le Kralamoure perd ses 900% de résistances pour 1 tour et booste tous les ennemis de 8000 dégâts, 63 PO, 1000 vitalité + tentacules +2 PM pour 1 tour.",
          "Les tentacules peuvent OS au càc à ce tour : éviter absolument qu'un tentacule vienne à votre càc.",
          "Tuer le Kralamoure en 1 tour si possible, sinon replacer le Primaire devant son nez pour bloquer sa ligne de vue.",
          "Si impossible de finir : replacer le Primaire, éloigner les trois autres tentacules, répéter les tours 5-6.",
          "Sorts du Kralamoure - Tourbe écrasante : met l'état pesanteur (infini) sur tous + boost de 1000 sagesse pour 6 tours.",
          "Sorts du Kralamoure - Kracheau immobilisant : désenvoûte la cible + 450 dommages feu + poison (perte de PM si soigné) ; lancé 2 fois par tour, 1 fois par cible (débuff avant de soigner).",
          "Sorts du Kralamoure - Kraken : boost de 500 vitalité pour 2 tours."
        ]
      }
    ],
    "tips": [
      "Accès prérequis : avoir terminé les quêtes 'Le Gardien du Pont de la Mort' et 'La vengeance de Peggy la Porkass'.",
      "L'entrée se trouve dans la Tourbière nauséabonde en [-60,-8].",
      "Aucune clef requise, mais 49 personnes minimum pour ouvrir l'antre.",
      "La porte reste ouverte environ 40 minutes après l'ouverture.",
      "Pour la quête du Dofus Ocre : équiper la pda spéciale obtenue à la dernière étape ; pas besoin de lancer 'capture d'âme' pour obtenir l'âme du Kralamoure.",
      "Quête liée : L'éternelle moisson."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Un projet tentaculaire",
        "strategy": "Les combattants ne doivent pas terminer leur tour en ligne d'un allié. La map est étroite et il faut éviter d'être en ligne de vue du Kralamoure au tour où il perd ses résistances. Préférable en butin 4. Des classes avec sorts de placement aident à libérer les lignes.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Le Kwakwa est un boss qui démarre avec 80% de résistances dans tous les éléments
  32: {
    "summary": "Le Kwakwa est un boss qui démarre avec 80% de résistances dans tous les éléments. Il faut éliminer ses invocations (Bwaks) pour lui retirer 40% de résistances par monstre mort dans l'élément correspondant, ou utiliser la Kwapoussée (dégâts de poussée) pour baisser ses résistances de 10% par coup pendant 3 tours.",
    "recommendedLevel": "40 — 70",
    "composition": "Idéalement 2 personnages tapant dans des éléments différents pour éliminer les Kwaks adverses plus efficacement. Des sorts de poussée sont un atout majeur.",
    "keyResist": [
      "Variable (élément opposé aux Kwaks ciblés — Terre et Air s'opposent, Eau et Feu s'opposent)"
    ],
    "phases": [
      {
        "title": "Salles normales",
        "mechanics": [
          "Monstres de 3 types : Bwaks, Kwaks, Kwakeres — chacun en 4 éléments (Terre, Vent, Glace, Flamme).",
          "Chaque monstre a de fortes résistances dans son élément et des faiblesses dans l'élément opposé (Terre/Air, Eau/Feu).",
          "Tous les monstres ont -50 résistances de poussée.",
          "Kwapoussée : dès qu'un monstre subit des dégâts de poussée, il perd 10% de résistances dans tous les éléments pendant 3 tours (cumulable, non débuffable) mais gagne 10 dommages de poussée pendant 3 tours.",
          "Bwakikui : 50 dégâts en ligne jusqu'à 5PO (1 fois par cible).",
          "Bwakitori : repousse de 2 cases en ligne de 2 à 4PO (1 fois par tour).",
          "Éventrement : 80 dégâts neutre en mêlée (1 fois par cible).",
          "Kwakoukas : 50 dégâts + repousse 3 cases en ligne jusqu'à 7PO modifiable (1 fois par cible).",
          "Wakpot : vole 100 en statistique élémentaire à la cible pour 2 tours + 25 dégâts vol de vie, portée 3PO (relance 2 tours).",
          "Griffes Acérées : 100 dégâts neutre en mêlée (Kwakere, 1 fois par cible).",
          "Wakolanterne : 25 dégâts vol de vie + +10% dégâts subis 1 tour + repousse 4 cases en ligne jusqu'à 7PO modifiable (Kwakere, 1 fois par cible).",
          "Wakzefeute : vole 50 puissance à la cible pour 3 tours (cumulable 3 fois) + 30 dégâts vol de vie, portée 3PO (Kwakere, relance 2 tours)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj58-13res-kwakere_orig.png",
            "caption": "Tableau des résistances des Kwakeres"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj58-14kwapoussee_orig.png",
            "caption": "Mécanique Kwapoussée : effet au déclenchement"
          }
        ]
      },
      {
        "title": "Combat du Boss — Kwakwa",
        "mechanics": [
          "Le Kwakwa a 80% de résistances dans tous les éléments au départ.",
          "Kwayauté : chaque fois qu'un monstre meurt, le Kwakwa perd 40% de résistances permanentes dans l'élément du monstre éliminé mais gagne 40 dommages de poussée permanents (cumulable).",
          "Kwapoussée (boss) : identique aux monstres normaux — chaque dégât de poussée retire 10% de résistances dans tous les éléments pendant 3 tours mais ajoute 10 dommages de poussée pendant 3 tours.",
          "Le Kwakwa invoque immédiatement 4 Bwaks (un de chaque élément) et les réinvoque tous les 5 tours si tous ont été éliminés.",
          "L'IA du Kwakwa est fuyarde : il recule après avoir agi ; s'il ne peut pas taper, il avance vers vous.",
          "Kwabolition : 40 dégâts dans chaque élément (sauf neutre) en mêlée (1 fois par tour).",
          "Kwakoukas Kwayal : 70 dégâts neutre + repousse 4 cases en ligne jusqu'à 7PO modifiable (1 fois par cible).",
          "Kwaristocratie : donne +2PA et +30 puissance à tous les monstres alliés pour 1 tour (dès tour 2, relance 4 tours).",
          "Kwarmée Kwayal : invoque 4 Bwaks à 2PO en ligne autour du Kwakwa + récupère 2PA ; relance possible uniquement quand les 4 Bwaks invoqués sont morts (relance 5 tours).",
          "Wakpot Kwayal : vole 50 puissance (75 en critique) pendant 3 tours (cumulable 3 fois) + 45 dégâts aléatoires en vol de vie, portée 3PO (relance 2 tours).",
          "Ne pas se placer en ligne avec le Kwakwa pour éviter Kwakoukas Kwayal ; ne pas raser les murs pour limiter les dégâts de poussée.",
          "Stratégie : éliminer en priorité les Kwaks/Bwaks de l'élément opposé à vos personnages pour baisser les résistances du Kwakwa dans votre élément principal avant de le focus."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj58-16kwakwares_orig.png",
            "caption": "Tableau des résistances du Kwakwa (80% de base)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj58-17kwayaute1_orig.png",
            "caption": "Kwayauté : perte de résistance du Kwakwa à la mort d'un monstre (étape 1)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj58-18kwayaute2_orig.png",
            "caption": "Kwayauté : perte de résistance du Kwakwa à la mort d'un monstre (étape 2)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj58-19kwapoussee2_orig.png",
            "caption": "Kwapoussée appliquée au Kwakwa"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj58-21kwakoukas_orig.png",
            "caption": "Placement à éviter : ne pas se retrouver en ligne avec Kwakwa"
          }
        ]
      }
    ],
    "tips": [
      "Entrée du donjon en Amakna, Montagne des Craqueleurs, [-4,-7].",
      "Recette de la clef : 2x Plume du Kwak de Glace, 2x Plume du Kwak de Flamme, 2x Plume du Kwak de Vent, 2x Plume du Kwak de Terre, 2x Viande Tendre, 2x Poisson-Chaton, 3x Trèfle à 5 feuilles, 3x Avoine.",
      "Pierre d'âme de puissance 50 minimum pour capturer le Kwakwa.",
      "Après le donjon, parler au PNJ Esprit Volatile pour obtenir le sort « Capture d'âmes ».",
      "Tous les monstres ont -50 résistances de poussée : les dégâts de poussée sont très efficaces.",
      "Éliminer les Kwaks dans l'élément opposé au vôtre (ex: si vous tapez Air, éliminez les Kwaks de Vent en tapant Terre) pour baisser les résistances du Kwakwa dans votre élément.",
      "L'IA du Kwakwa est fuyarde : commencer loin de lui pour qu'il s'éloigne après les invocations et gagner un tour tranquille.",
      "En bulit 4 (Duo), il n'y a pas de Kwak de Flamme : éviter l'élément Feu."
    ],
    "rewards": [
      "Sort « Capture d'âmes » (via PNJ Esprit Volatile après le combat)."
    ],
    "achievements": [
      {
        "name": "Zombie",
        "strategy": "Utiliser exactement 1 PM par tour. Avoir de l'agilité (10 de fuite) pour pouvoir détacler si les Kwaks vous encerclent. Focus le Kwak de Vent en priorité car il vole 100 d'agilité à courte portée.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/zombie.png"
      },
      {
        "name": "Mains propres",
        "strategy": "Achever tous les ennemis (y compris les Bwaks invoqués) uniquement avec des dégâts indirects : poison, invocations, glyphes, dommages de poussée, pièges, mur de bombes Roublard. Les dégâts de poussée sont particulièrement efficaces grâce au malus de -50 résistances de poussée des Kwaks.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/mains-propres.png"
      },
      {
        "name": "Kwakwa ? Kwapoussée !",
        "strategy": "Ne faire aucun dégât de poussée aux ennemis. Attention : si un Kwak pousse un de vos personnages sur un autre Kwak, il subit des dégâts de poussée et le succès est échoué. Soigner son placement pour éviter de se retrouver entre 2 Kwaks.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "2 personnages maximum, moins de 20 tours. Idéalement 2 éléments différents : chaque personnage focus les Kwaks de l'élément opposé au sien pour baisser les résistances du Kwakwa dans son élément. En bulit 4 il n'y a pas de Kwak de Flamme, éviter l'élément Feu.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // La Shin Larve est le boss du Donjon des Larves, avec de bonnes résistances en neutre/terre
  33: {
    "summary": "La Shin Larve est le boss du Donjon des Larves, avec de bonnes résistances en neutre/terre/feu mais de grosses faiblesses eau et air. Elle invoque des larves de différentes couleurs tous les 2 tours et possède un sort clé (Enlisement) qui donne 4 PA à tous mais retire 6 PM aux joueurs. La priorité est de focus la Larve Saphir (soigneuse) et de profiter des PA bonus pour éliminer le boss rapidement.",
    "recommendedLevel": "50",
    "composition": "Au moins un personnage eau ou air recommandé. Minimum 2 joueurs obligatoires (mécaniques de leviers). Sorts de déplacement ou poussée utiles pour le succès Prudent (ex. Bond du Iop, sort Libération).",
    "keyResist": [
      "Eau",
      "Air"
    ],
    "phases": [
      {
        "title": "Salles 1 à 10 bis — Progression avec séparations d'équipe",
        "mechanics": [
          "11 salles au total, dont 7 avec des combats.",
          "Après la salle 1, séparation en deux groupes en salle 2/3 : placer un personnage sur chaque dalle pour activer le levier et ouvrir la grille.",
          "Équipe du haut : salles 4 et 5. Équipe du bas : salles 4 bis et 5 bis. Maximum 4 joueurs de chaque côté.",
          "Les deux équipes se rejoignent en salle 6 — attendre tous les alliés avant de continuer.",
          "En salle 7, nouvelle séparation identique. Équipe du haut : salles 9 et 10. Équipe du bas : salles 9 bis et 10 bis.",
          "Les deux équipes se rejoignent en salle 11 (salle du boss)."
        ]
      },
      {
        "title": "Combat du boss — Shin Larve",
        "mechanics": [
          "Convocation gluante : invoque aléatoirement 1 larve parmi 7 (Bleue, Émeraude, Jaune, Orange, Rubis, Saphir, Verte) à 1 PO. Disponible à partir du tour 2, relance 2 tours.",
          "Déglutition : 120 dégâts neutre, retire 3 PA et repousse de 4 cases la cible. Uniquement en mêlée, 1 fois par tour.",
          "Enlisement : retire 6 PM à tous les personnages et donne 4 PA à toutes les entités (alliés et ennemis) pour un tour. Zone autour d'elle, relance 3 tours, à partir du tour 2. Déclenché aux tours 2, 5, 7, etc.",
          "La Shin Larve n'a que 2 PM et attaque uniquement en mêlée — rester à distance réduit sa dangerosité.",
          "Larves dangereuses à prioritiser : Saphir (soigne 75 PV un allié, jusqu'à 200/tour), Émeraude (retire envoûtements), Rubis (frappe 45 dégâts terre).",
          "Focus Larve Saphir en priorité absolue si invoquée.",
          "Profiter du boost Enlisement : se positionner aux tours 1, 4, 7 pour maximiser les dégâts au tour suivant.",
          "Stratégie eau/air suffisante : focus direct Shin Larve, booster au tour 1, taper sous Enlisement au tour 2.",
          "Stratégie faibles dégâts eau/air : éliminer les larves d'abord, puis finir la Shin Larve seule.",
          "La Larve Dorée n'est présente qu'en salle du boss — réaliser un challenge pour le succès monstres des Grosses Larves."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj67-30enlisement_orig.png",
            "caption": "Positionnement stratégique pour le sort Enlisement"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj67-convocation-gluante_orig.png",
            "caption": "Convocation gluante — portée et zone du sort"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj67-deglutition_orig.png",
            "caption": "Déglutition — portée et zone du sort"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj67-enlisement_orig.png",
            "caption": "Enlisement — portée et zone du sort"
          }
        ]
      }
    ],
    "tips": [
      "Accès : pas de clef, il faut 1 x Oeuf de Larve Dorée (drop sur toutes les larves, taux de base 9,24%). Consommer l'oeuf pour faire apparaître une larve dorée qui vous suit, puis cliquer sur la grille.",
      "Entrée : se rendre en [-2,-5] (Montagne des Craqueleurs) et traverser 10 cartes de souterrain pour atteindre la grille.",
      "Minimum 2 joueurs obligatoires pour activer les leviers (séparation d'équipe à deux reprises).",
      "Impossible d'utiliser le trousseau de clef ou de téléporter le groupe.",
      "Pierre d'âme de puissance 50 minimum pour capturer la Shin Larve.",
      "La capture de l'âme de la Shin Larve est utile pour la quête du Dofus Ocre : L'éternelle moisson.",
      "Quêtes liées : Les sbires du maître, Pauvre larve... dorée.",
      "Sort commun Libération (pousse les ennemis) utile pour le succès Prudent."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Prudent",
        "strategy": "Les combattants alliés ne doivent jamais finir leur tour sur une case adjacente à un ennemi. Attention au sort Enlisement qui retire 6 PM : une larve peut venir se coller et sans PM il est difficile de respecter ce succès. Avoir des sorts de déplacement ou de poussée (Bond du Iop, sort Libération commun) permet de décaler les larves. Rester à distance des larves dès le départ.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj67-31libe-prudent_orig.png"
      },
      {
        "name": "Versatile",
        "strategy": "Les combattants alliés ne doivent utiliser qu'une seule fois une même action pendant leurs tours de jeu. Être attentif avec les PA supplémentaires d'Enlisement qui poussent à réutiliser le même sort. Éviter d'utiliser deux fois Picole/Karcham (Pandawa) ou Portail (Éliotrope) par instinct."
      },
      {
        "name": "Spécial — Enlisement larvaire",
        "strategy": "Ne infliger de dégâts qu'à la Shin Larve lorsqu'on est sous l'effet d'Enlisement (tours 2, 5, 7...). Hors effet Enlisement, on peut taper normalement tous les ennemis. Stratégie : éliminer une larve au tour 1, puis sous Enlisement ne taper que la Shin Larve ou se booster. Si la Shin Larve invoque une Larve Saphir, la focus mais hors des tours Enlisement."
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 20 tours. Au moins un personnage eau ou air conseillé. Éliminer les larves d'abord, focus la Larve Saphir si invoquée au tour 2, puis attaquer la Shin Larve en ignorant les invocations non-Saphir."
      }
    ]
  },
  // La Maison Fantôme est un donjon de bas niveau accessible à la Foire du Trool [-13,-41]
  34: {
    "summary": "La Maison Fantôme est un donjon de bas niveau accessible à la Foire du Trool [-13,-41]. Le boss Boostache est enraciné et lourd (impossible à déplacer), réinvoque des monstres morts et invoque des Ashi-magari qui retirent 100 PM.",
    "recommendedLevel": "30 — 60",
    "composition": "Équipe standard, pas de composition spécifique mentionnée.",
    "keyResist": [
      "Variable (voir résistances)"
    ],
    "phases": [
      {
        "title": "Salles 1 à 4 — Monstres courants",
        "mechanics": [
          "Boorrade (Boostache prépubère) : frappe neutre au càc (40), et Rancune Totale : donne l'état Rancune infini à tous les monstres (+2 PM infini).",
          "Gargrouille : Souffle gargouillesque (feu, ligne 4 cases, 15), Gargouilli (air, -100 puissance, demi-cercle rayon 2, 30), Couteau (neutre càc, environ 3000, variable).",
          "Kwoan : Confusion Optique (-6 PO 5 tours à distance, cercle rayon 1), Frappe Gerbante (neutre càc, 60), Déplacement Libre (+10 Esquive PM 2 tours).",
          "Tofu Maléfique : Béco Maléfique (air, -15 tacle 1 tour, 60), Maléfice (20% érosion + insoignable 1 tour, croix 1PO), Punksnotdède (esquive 100% des coups en reculant de 1 case 1 tour).",
          "Vampire : Vol de Vie (eau càc, 35), Force des Âmes Putrides (+50 puissance à un allié 4 tours), Nosfuraté (terre zone anneau 3-4 PO, 20, vole 50 Force et Chance 2 tours)."
        ]
      },
      {
        "title": "Boss — Boostache",
        "mechanics": [
          "Boostache est en état Lourd et Enraciné en permanence (sort Une nuit en enfer) : impossible de le porter, coopérer, pousser ou déplacer.",
          "Frayeurs : repousse tous les ennemis à 3 PO en ligne.",
          "L'Enfer des Zombies : réinvoque un monstre mort du donjon chaque tour.",
          "Le Dentiste : frappe air (60) + 30% érosion pour 2 tours.",
          "Esprit empêtrant : invoque un Ashi-magari à 3 PO max. L'Ashi-magari utilise Enchevêtrement : retire 100 PM et met l'état pesanteur 1 tour (seulement au càc)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png",
            "caption": "Tactique succès spécial Boostache — Empêtrement d'esprit entêtant"
          }
        ]
      }
    ],
    "tips": [
      "Recette de la clef : 2x Cuir de Gargrouille, 2x Oeil de Kwoan, 2x Sang du Vampire, 2x Aile du Tofu Maléfique, 2x Viande Minérale, 2x Poisson-Chaton, 2x Trèfle à 5 feuilles, 2x Avoine.",
      "Pour capturer le boss, prévoir une pierre d'âme de puissance 50 minimum.",
      "La capture de l'âme du boss est utile pour la quête du Dofus Émeraude : « Le voleur d'âmes ».",
      "Accès : se rendre à la Foire du Trool en [-13,-41] et parler au Gentil Organisateur Chafer.",
      "Quêtes liées : Fantômes contre fantômes, Donjon en lambeaux."
    ],
    "rewards": [
      "Attitude Pleurer (parler au Gentil Organisateur Chafer à la sortie)."
    ],
    "achievements": [
      {
        "name": "Empêtrement d'esprit entêtant",
        "strategy": "Aucun Ashi-magari ne doit être achevé pendant toute la durée du combat. Il faut éliminer le boss en premier sans s'occuper de ses invocations.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Donjon du Laboratoire de Brumen Tinctorias, dont le boss est Nelween
  35: {
    "summary": "Donjon du Laboratoire de Brumen Tinctorias, dont le boss est Nelween. La stratégie repose sur la gestion des soins (qui retirent PA ou PM aux alliés) et sur le placement lors du succès spécial (aucun allié à 3 PO ou moins lors de l'infligement de dégâts).",
    "recommendedLevel": "~60",
    "composition": "Équipe standard jusqu'à 8 combattants ; pierres d'âme de puissance 100 minimum pour capturer Nelween.",
    "keyResist": [
      "Variable (voir résistances)"
    ],
    "phases": [
      {
        "title": "Salle 1",
        "mechanics": [
          "Ouginak Déchaîné : désenvoutement, empoisonnement (pertes de PV en air à chaque début de tour), frappe eau au corps-à-corps, peut pousser tout en frappant en agilité.",
          "Scorbute Renforcé : retire des caractéristiques et empoisonne.",
          "Kolérat de Laboratoire : renvoie les dommages, frappe au corps-à-corps.",
          "Corbac Terrien : frappe à distance et désenvoute.",
          "Versions normales (plus faibles) de chaque créature présentes également."
        ]
      },
      {
        "title": "Salles 2, 3 et 4",
        "mechanics": [
          "Mêmes créatures que la salle 1 (ADN modifié), pas de nouveaux monstres introduits.",
          "Salle 4 : avant-dernière salle avant le boss."
        ]
      },
      {
        "title": "Boss — Nelween",
        "mechanics": [
          "En début de combat, Nelween applique un état : soigner un allié lui retire 1 PM ou 1 PA et minimise ses effets aléatoires.",
          "Peut retirer des PA et des % de résistances.",
          "Frappe faiblement tout en volant des PV.",
          "Peut minimiser les effets aléatoires.",
          "Lance un sort de renvoi de sort sur ses alliés.",
          "Succès spécial « Laboratoire de curiosité » : aucun allié ne doit se trouver à 3 PO ou moins du combattant qui inflige des dégâts — contrainte de placement sur une map très petite, pas de difficulté technique supplémentaire."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png",
            "caption": "Tactique succès spécial Nelween — Laboratoire de curiosité"
          }
        ]
      }
    ],
    "tips": [
      "Accès : Landes de Sidimote [-27,17], parler à Tassa pour entrer.",
      "Clef requise (ou trousseau de clef) : recette = 2× Papatte de Croc Gland, 2× Graine de Scorbute, 2× Plume de Crowneille, 2× Moustache de Kolérat, 2× Viande Avariée, 2× Sardine Brillante, 3× Menthe Sauvage, 3× Houblon.",
      "Pour capturer Nelween, prévoir une pierre d'âme de puissance 100 minimum.",
      "L'âme de Nelween est utile pour la quête du Dofus Émeraude « Le voleur d'âmes ».",
      "Soigner des alliés est pénalisant (perte de PA ou PM) — adapter la composition en conséquence.",
      "Quêtes liées : Où est passée la 7e compagnie ?, Histoire de chiens., Poison de scorbute pour la prison., Du venin sinon rien., Les morts vivants."
    ],
    "rewards": [
      "Capture de l'âme de Nelween (pierre d'âme puissance 100 minimum)"
    ],
    "achievements": [
      {
        "name": "Laboratoire de curiosité",
        "strategy": "Aucun allié ne doit se trouver à 3 PO ou moins du combattant qui inflige des dégâts. Contrainte de placement uniquement, sur une map très petite — pas de difficulté technique particulière.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Le Sapik est un boss statique (0 PM, non deplacable) qui invoque jusqu'a 5 Kipik de Sapik 
  36: {
    "summary": "Le Sapik est un boss statique (0 PM, non deplacable) qui invoque jusqu'a 5 Kipik de Sapik par tour. La strategie consiste a rester hors de sa ligne de vue, eliminer les monstres en priorite (Kwakus et Kitsou Nakwatus en premier), puis finir le Sapik a distance pour eviter ses degats melee air.",
    "recommendedLevel": "50",
    "composition": "Un personnage feu est recommande car tous les monstres ont des faiblesses feu (notamment le Kwakus avec 100% de faiblesse feu).",
    "keyResist": [
      "Feu"
    ],
    "phases": [
      {
        "title": "Salles normales — monstres glacon",
        "mechanics": [
          "Certains monstres (Black Tiwabbitus, Kitsou Nakwatus, Kwakus) demarrent dans un etat Gele avec un seuil de PV a 50% ; en-dessous du seuil ils passent en etat Degel et changent de sorts.",
          "Black Tiwabbitus (Gele) — Wabehameha : frappe eau 50, vole 1 PM pour 1 tour, 4 PO ; Frappus : frappe terre 40, -10% erosion pour 1 tour, melee.",
          "Black Tiwabbitus (Degel) — Enewgie Tewestwe : frappe terre 2x50 sur deux lignes, vole 2x1 PO pour 1 tour, 6 PO, 2 fois/tour ; Twansposition : frappe air 60, echange de place, 4 PO sans LdV, relance 2 tours.",
          "Kipik — Savapike : boost allies de +10% critiques en cercle rayon 3, 2 fois/tour ; Branche Kipik : frappe eau 40, 6 PO.",
          "Kitsou Nakwatus (Gele) — Kitsinition Frissonnante : frappe eau 70 en ligne 2 PO sans LdV ; Ruse Hivernale : +2 PM a tous les allies + 100 Puissance dans 1 tour (relance 3 tours).",
          "Kitsou Nakwatus (Degel) — Kitsouqueue : frappe air 80 en ligne taille 3, soigne les monstres dans la zone de 10% PV max, 1 PO ; Kitsouflamme : frappe feu 35, 11 PO sans LdV, 3 fois/tour.",
          "Kwakus (Gele) — Kwakokus : frappe feu 40, repousse 3 cases, 7 PO ; Wakpotus : frappe feu 50 vol de vie + vole 50 Intelligence pour 2 tours, 4 PO.",
          "Kwakus (Degel) — Kwakikri : frappe feu 85, 7 PO ; Kwakiboost : +70 Puissance a tous les allies pour 2 tours, relance 2 tours.",
          "Tofu Enneige — Tombee de Neige : teleportation + frappe terre 45 en croix taille 1, 5 PO relance 2 tours ; Debarbouillage : frappe eau 60 + malus -2 PO pour 2 tours en cercle rayon 2, relance 3 tours.",
          "Focus Kwakus et Kitsou Nakwatus en priorite : le Kitsou donne +2 PM tous les 3 tours a ses allies (y compris le Sapik)."
        ]
      },
      {
        "title": "Combat de boss — Sapik",
        "mechanics": [
          "Sapik a 0 PM et ne peut pas etre deplace (sauf boost PM externe) ; il reste fixe toute la duree du combat.",
          "Kokapik : invoque un Kipik de Sapik jusqu'a 5 invocations max, 3 PO, 1 fois/tour ; il invoque automatiquement 1 Kipik a chaque debut de tour.",
          "Calin Kipik : frappe air 80 + malus -10 Fuite pour 2 tours en croix taille 1 autour de lui (melee), 1 fois/tour.",
          "Enguirlandage : frappe eau 35 + malus -15% Critiques pour 2 tours, portee infinie avec LdV, 3 fois/tour.",
          "Strategie : rester hors de sa ligne de vue pour le neutraliser, puis focus les monstres ; eliminer les Kipik de Sapik invoquees des qu'ils apparaissent.",
          "Une fois les monstres elimines, focus le Sapik a distance pour eviter Calin Kipik.",
          "Si PV bas, se cacher derriere des obstacles ou des invocations pour briser la LdV de Enguirlandage."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj46-kokapik_orig.png",
            "caption": "Sort Kokapik — invocation Kipik de Sapik"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj46-calin-kipik_orig.png",
            "caption": "Sort Calin Kipik — frappe air melee + malus Fuite"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj46-enguirlandage_orig.png",
            "caption": "Sort Enguirlandage — frappe eau portee infinie + malus Critiques"
          }
        ]
      }
    ],
    "tips": [
      "Position d'entree : Ile de Nowel, zone Havre de Nowel en [-32,-89].",
      "Recette de la clef : 1x Moule de Clef du Donjon de Nowel, 1x Flocon de Neige, 3x Pierre du Craqueleur, 5x Dent de Wabbit.",
      "Pour capturer le boss, prevoir une pierre d'ame de puissance 50 minimum.",
      "Quetes liees : Sapik Epique et Colegram — L'Etoile du Sapik.",
      "Ne pas entourer le Kwakus pour le succes Hardi car il possede un sort de poussee.",
      "Le Kitsou Nakwatus donne +2 PM tous les 3 tours a ses allies (y compris le Sapik) : le focus en priorite."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Chrono",
        "strategy": "Vaincre tous les monstres en moins de 9 tours. Reprendre la strategie globale sans modification particuliere.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/chrono.png"
      },
      {
        "name": "Hardi",
        "strategy": "Les combattants allies doivent finir leur tour sur une cellule adjacente a celle d'un ennemi. Se coller autour d'un monstre, eliminer les autres rapidement, puis finir le monstre entoure en dernier. Ne pas entourer le Kwakus (sort de poussee).",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/hardi.png"
      },
      {
        "name": "Blitzkrieg",
        "strategy": "Lorsqu'un ennemi est attaque, il doit etre acheve avant le debut de son tour. Preparer des sorts de boost au maximum pour eliminer le Sapik en un seul tour.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/blitzkrieg.png"
      },
      {
        "name": "Special",
        "strategy": "Il ne doit y avoir qu'un seul Kipik maximum invoque a la fin du tour du Sapik. Soit eliminer le Sapik avant qu'il rejoue, soit eliminer chaque Kipik invoque a chaque tour.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours. Reprendre la strategie globale avec 2 personnages.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Papa Nowel peut OS en mêlée et se reconstitue à bas PV avant de se scinder en deux (jambes
  37: {
    "summary": "Papa Nowel peut OS en mêlée et se reconstitue à bas PV avant de se scinder en deux (jambes + buste). La stratégie consiste à éliminer les monstres rapidement, puis à burst le boss en un tour pour éviter la phase de séparation ; si la séparation a lieu, focus les jambes pour terminer le combat.",
    "recommendedLevel": "Île de Nowel (événement saisonnier)",
    "composition": "Aucune composition imposée. Pour le succès Statue, privilégier les classes à sorts de placement à distance (Pandawa) et du retrait PM. Duo réalisable avec n'importe quelle composition.",
    "keyResist": [
      "Neutre",
      "Eau",
      "Air",
      "Terre",
      "Feu"
    ],
    "phases": [
      {
        "title": "Phase 1 — Papa Nowel entier",
        "mechanics": [
          "Hotte d'or : gagne 5PO pour 1 tour à chaque tentative de retrait PM subie — ne pas retirer ses PM.",
          "Aspir'nenfan : attire de 3 cases en ligne, portée infinie (x2/tour) — risque d'être ramené en mêlée.",
          "Infantophagie : OS la cible en mêlée et se soigne de 500PV (x1/tour) — rester hors mêlée à tout prix.",
          "Engluement : 150 neutre + retire 1–4PM (jusqu'à 8PO, x3/tour).",
          "Trak'nenfan : invoque un cadeau aléatoire parmi 4 (Kol'nenfan, Koup'nenfan, Pet'nenfan, Cadob'Onux) de 4 à 5PO.",
          "Embûche de Nowel : se soigne de 100% de ses PV et entre dans l'état Fragilisé — déclenché à faible % de PV.",
          "Cadob'Onux (cadeau) : donne 150 puissance à tous les monstres pendant 1 tour à chaque tour.",
          "Monstres de salles : Bonhomme de Neige (téléportation/poussée eau+air), Bouboule de Neige (vol de vie terre+eau+soins), Croc-Gland de Nowel (retrait PA/PM air), Kanigrou Hivernal (boost puissance neutre+air), Mininuit (érosion 15%+feu, vol de puissance, indéplaçable)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/editor/dj47-aspirnenfan.png?1669687257",
            "caption": "Aspir'nenfan — portée et zone d'attraction"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/editor/dj47-infantophagie.png?1669687261",
            "caption": "Infantophagie — sort OS mêlée"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj47-embuche-de-nowel_orig.png",
            "caption": "Embûche de Nowel — reconstitution totale + état Fragilisé"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/published/dj47-engluement.png?1669687327",
            "caption": "Engluement — dégâts neutres + retrait PM"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/published/dj47-traknenfan.png?1669687332",
            "caption": "Trak'nenfan — invocation d'un cadeau aléatoire"
          }
        ]
      },
      {
        "title": "Phase 2 — Séparation (état Fragilisé puis Séparé)",
        "mechanics": [
          "Dichotomie : sacrifie 50% de ses PV et invoque un Demi Papa Nowel (buste) — déclenché en état Fragilisé.",
          "Papa Nowel (jambes) : conserve Aspir'nenfan + Infantophagie (OS mêlée toujours présent) ; perd Engluement et Trak'nenfan.",
          "Demi Papa Nowel (buste) récupère : Engluement (150 neutre + retrait PM) et Trak'nenfan (invocation cadeaux).",
          "Demi Papa Nowel : Empaquetage — transforme un personnage en cadeau pour 2 tours (−1PM, −4PA, état Affaibli), portée 5PO, relance 4 tours.",
          "Demi Papa Nowel : Attrap'nenfan — repousse de 6 cases en mêlée (relance 2 tours).",
          "Éliminer le Papa Nowel (jambes) met fin au combat : le Demi Papa Nowel disparaît automatiquement.",
          "Papa Nowel n'a que la moitié de ses PV en phase 2 — burst possible en 1 tour."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj47-601_orig.png",
            "caption": "Schéma de la séparation — Papa Nowel entre dans l'état Fragilisé"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj47-602_orig.png",
            "caption": "Répartition des sorts après la séparation"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/editor/dj47-empaquetage.png?1669687182",
            "caption": "Empaquetage — transformation en cadeau (−4PA, −1PM)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/published/dj47-attrapnenfan.png?1669687485",
            "caption": "Attrap'nenfan — poussée mêlée 6 cases"
          }
        ]
      }
    ],
    "tips": [
      "Prérequis : avoir terminé la quête Sapik épique et Colégram (Donjon de Nowel).",
      "Position de l'entrée : Île de Nowel, zone Terre de Nowel, [-36,-89].",
      "Quête liée : Petit Papa Nowel.",
      "Recette de la clef : 1x Moule de Clef de la Caverne de Nowel, 10x Flocon de Neige, 3x Bec du Kido, 3x Coco du Bitouf des Plaines, 3x Bâton du Kilibriss, 1x Nectar Vivifiant, 5x Pistil de Floristile.",
      "Pierre d'âme de puissance 150 minimum pour capturer Papa Nowel.",
      "Ne jamais retirer de PM au Papa Nowel — il gagne 5PO par tentative grâce à Hotte d'or.",
      "Idéal : burst le Papa Nowel entier en 1 tour pour éviter la phase de séparation.",
      "Si la séparation a lieu : focus les jambes (Papa Nowel) qui ont la moitié des PV ; le buste disparaît automatiquement.",
      "Rester hors ligne de l'Aspir'nenfan pour ne pas se retrouver en mêlée."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Succès Chrono",
        "strategy": "Vaincre tous les monstres en moins de 9 tours. Suivre la stratégie globale et burst efficacement.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/chrono.png"
      },
      {
        "name": "Succès Premier",
        "strategy": "Papa Nowel doit être achevé en premier. Se booster au maximum au tour 1 et éliminer Papa Nowel dès le tour 2.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/premier.png"
      },
      {
        "name": "Succès Statue",
        "strategy": "Les alliés doivent finir leur tour sur la même case que celle où ils l'ont commencé pendant tout le combat. Se placer loin du Papa Nowel pour éviter l'attraction. Utiliser une classe à sorts de placement (ex. Pandawa) et du retrait PM ou des sorts de poussée à distance pour bloquer son avancée.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/statue.png"
      },
      {
        "name": "Succès Spécial",
        "strategy": "Achever le Demi Papa Nowel sans infliger de dégâts au Papa Nowel une fois en état Séparé. Éliminer d'abord tous les monstres, puis amener Papa Nowel à ~40% de PV pour qu'il invoque. Une fois le Demi Papa Nowel apparu, l'éliminer sans toucher les jambes.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Succès Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 20 tours. Aucune composition particulière requise, suivre la stratégie globale.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Le Père Fwetar est le boss de la Maison du Papa Nowel ; il OS en mêlée et dispose d'une re
  38: {
    "summary": "Le Père Fwetar est le boss de la Maison du Papa Nowel ; il OS en mêlée et dispose d'une reconstitution totale de PV tous les 10 tours. La stratégie repose sur la gestion stricte de ses invocations (Poutch Ingball → marionnettes aléatoires) et l'exploitation de sa faiblesse terre, sans jamais lui retirer de PM sous peine de le rendre inarrêtable.",
    "recommendedLevel": "190",
    "composition": "Équipe standard 4-8 personnages avec de bons élémentaires Terre ; un Pandawa est conseillé pour bloquer le boss lors du succès Hardi. Bonne puissance de feu nécessaire pour tuer le boss en un tour avant sa reconstitution.",
    "keyResist": [
      "Terre"
    ],
    "phases": [
      {
        "title": "Salles d'approche",
        "mechanics": [
          "Abominable Yiti des Neiges — Colère du Yiti : +3PM/70Tacle/10% PV en bouclier (2 tours, relance 3). Gueuleton : 250 dégâts Terre vol de vie + retire 30 Fuite (mêlée, 3x/tour).",
          "Cadob' — Surprise drainante : 225 Feu vol de vie ligne taille 4 (1PO, 2x/tour). Surprise empoisonnante : poison 120 Eau 2 tours (jusqu'à 6PO, 3x/tour). Invocation de Cadob' : cadeau aléatoire (Cadob'Imbo soigne monstres 5% PV ; Cadob'Omb OS zone cercle rayon 2 ; Cadob'Onux +150 Puissance 1 tour) 1x/tour en mêlée.",
          "Craqueleur des Glaces — Écrasement glacial : 300 Terre + -3PA esquivable (mêlée, 2x/tour). Pic de glace : 180 Eau + -2PM esquivable (jusqu'à 8PO, 2x/tour).",
          "Peluche Bouftou — Coutures Renforcées : +500 Vitalité si détaclée partiellement (relance 4). Ecchymose : 380 Terre + Pesanteur (mêlée, 2x/tour). Traumatisme : 30% érosion à chaque dommage d'invocation (mêlée, 1x/tour).",
          "Peluche Tofu — Entorse : -1 à 3PM (2PO, relance 2). Pique-Couic : jets minimum si détaclage partiel 2 tours (2PO, relance 2). Priorité car difficile à tenir à distance avec ses nombreux PM.",
          "Peluche Wabbit — Cawotte de Nowel : invoque une Cawotte (5PO, tour 4+, relance 6). Malédiction de la Cawotte : -1000 soins zone cercle rayon 3 + attire 3 cases (8PO, 1x/tour). Rembourrage : 1000 PV de soin (1600 sur Père Fwetar) (8PO, 2x/tour). A FOCUS EN PRIORITÉ car soigne énormément ses alliés."
        ]
      },
      {
        "title": "Combat contre le Père Fwetar — mécanique centrale",
        "mechanics": [
          "Vilain Garnement (passif permanent) : +1PM pour chaque tentative de retrait PM subie, cumulable à l'infini. NE JAMAIS retirer de PM au Père Fwetar.",
          "Aspir'nenfan : Attire de 3 cases en ligne (2-infini PO, 2x/tour/cible). Ne pas rester dans sa ligne.",
          "Fwetage : 700 dégâts élément aléatoire (CC = vol de vie), portée 8-infini sans LdV (2x/tour/cible). Rester à 7 cases ou moins pour l'annuler.",
          "Infantophagie : OS en mêlée + se soigne de 2100PV (1x/cible). Ne jamais se retrouver au contact.",
          "Embûche de Nowel : Soin intégral + +100 Puissance à tous les monstres pour 10 tours (relance 10). Se déclenche vers 30-35% PV. Finir le boss en un tour à cet instant ou maintenir ses PV au-dessus du seuil.",
          "Invocation de Jouet Cassé : Invoque un Poutch Ingball (1500PV, +1PM) jusqu'à 3PO sans LdV (relance 3). Invoque aux tours 1, 4, 7, 10...",
          "Parade des Vieux Jouets : 1/3 de chance +2PA infini au Poutch (risque Tuerie qui OS toute l'équipe si boosté 2 fois = 4PA). 2/3 transformation en marionnette aléatoire. Éliminer le Poutch non transformé dans les 3 tours suivants.",
          "Marionnettes possibles — Bouftou Royal : soigne énormément, tacler ou bloquer LdV. Dark Vlad : moins dangereux, peut mettre -10PM en mêlée. Dragon Cochon : la plus dangereuse (Étourderie quasi-mortelle : poison neutre par PA utilisé 2 tours), désenvoûter ou éliminer immédiatement. Minotoror : gros dégâts mêlée, repousser et retirer PM. Mulou Meulé : ne pas tuer le Milimeulou invoqué (+2PM/200 Puissance à tous les monstres à sa mort).",
          "En butin 5+ : des Cadob' sont présents, éliminer en priorité (1 chance sur 4 d'invoquer un Cadob'Omb qui OS zone cercle rayon 2 chaque tour).",
          "Le Père Fwetar gagne +1PM au tour de chaque invocation de Poutch (ne pas se faire surprendre)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/editor/dj48-aspirnenfan.png?1669858499",
            "caption": "Aspir'nenfan — zone d'attirance en ligne"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/editor/dj48-embuche-de-nowel.png?1669858504",
            "caption": "Embûche de Nowel — reconstitution totale des PV"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/editor/dj48-fwetage.png?1669858710",
            "caption": "Fwetage — portée minimale 8, sans ligne de vue"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/editor/dj48-infantophagie.png?1669858513",
            "caption": "Infantophagie — OS en mêlée"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/editor/dj48-invocation-de-jouet-casse.png?1669858455",
            "caption": "Invocation de Jouet Cassé — Poutch Ingball"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/editor/dj48-parade-de-vieux-jouets.png?1669858460",
            "caption": "Parade des Vieux Jouets — transformation ou boost PA"
          }
        ]
      },
      {
        "title": "Stratégie finale — élimination du Père Fwetar",
        "mechanics": [
          "Stratégie 1 (standard) : Tuer tous les monstres d'abord — priorité Peluche Wabbit → Cadob' (butin 5+) → Peluche Tofu → Peluche Bouftou — puis finir le boss.",
          "Stratégie 2 (blocage) : Bloquer le Père Fwetar entre deux monstres dans un coin de map et l'éliminer à petit feu (cf. succès Hardi). Un Pandawa facilite le placement.",
          "Stratégie 3 (burst tour 2) : Éliminer le boss rapidement au tour 2 avant qu'il puisse utiliser Embûche de Nowel.",
          "Pour finir le boss : soit burst en un tour depuis ~35% PV, soit le maintenir au-dessus du seuil de reconstitution et finir dès que possible.",
          "Exploiter la faiblesse Terre du Père Fwetar.",
          "Rester à 7 cases ou moins pour neutraliser Fwetage. Ne jamais rester dans sa ligne (attirance + OS mêlée)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj48-hardi-bloquer-pere-fwetar_orig.png",
            "caption": "Schéma de blocage du Père Fwetar (succès Hardi) : rouge = boss, vert = monstres bloquants, bleu = personnages tapeurs, orange = invocation optionnelle"
          }
        ]
      }
    ],
    "tips": [
      "Position du donjon : Île de Nowel, Taïga de Nowel [-34,-89].",
      "Recette de la clef : 1 Moule de Clef de la Maison du Papa Nowel + 20 Flocon de Neige + 1 String en Cuir de la Mama Bwork + 1 Bave de Champ à Gnons + 1 Lamelle de Champbis + 1 Langue du Champodonte + 1 Caleçon de Cybwork + 1 Pédoncule de Mérulette.",
      "Pierre d'âme de puissance 190 minimum pour capturer le boss.",
      "Quêtes liées : 'Vilain petit n'enfant' et 'Groocse se fait sonner les cloches' (salle 1 seulement).",
      "NE JAMAIS retirer de PM au Père Fwetar (Vilain Garnement : +1PM permanent par tentative).",
      "Rester à 7 cases ou moins du boss pour annuler Fwetage (portée min 8).",
      "En butin 5+ : focus les Cadob' en premier — risque d'OS zone cercle rayon 2 à chaque tour.",
      "Éliminer le Poutch Ingball non transformé dans les 3 tours suivants (risque OS toute l'équipe si boosté 2x en PA).",
      "Ne pas tuer le Milimeulou si la Marionnette du Mulou Meulé est invoquée (+2PM/200 Puissance à tous les monstres à sa mort).",
      "Marionnette Dragon Cochon = la plus dangereuse : désenvoûter Étourderie quasi-mortelle ou l'éliminer immédiatement.",
      "Ne pas baisser le boss en dessous de 35-40% PV si vous ne pouvez pas le finir dans la foulée."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Chrono",
        "strategy": "Vaincre tous les monstres en moins de 9 tours. Reprendre la stratégie globale avec une bonne force de frappe.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/chrono.png"
      },
      {
        "name": "Nomade",
        "strategy": "Utiliser tous ses PM à chaque tour pendant tout le combat. Ne pas perdre de PM lors de tentatives de détaclage (fail instantané).",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/nomade.png"
      },
      {
        "name": "Hardi",
        "strategy": "Finir chaque tour adjacent à un ennemi. Méthode 1 (freestyle) : entourer la Peluche Wabbit (57+ Fuite pour détacler), puis éliminer les monstres en restant collé. Méthode 2 (blocage) : bloquer le Père Fwetar dans un coin entre la Peluche Tofu (case 1, IA fuyarde, doit être entourée) et la Peluche Bouftou (case 2). Personnages tapeurs sur les cases avec LdV, un personnage en support sans LdV. Pandawa recommandé pour le placement. Éliminer la Peluche Wabbit en priorité. Tuer les Poutch Ingball non transformés.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/hardi.png"
      },
      {
        "name": "Spécial",
        "strategy": "Achever au moins une marionnette du Père Fwetar. Attendre la transformation du Poutch (2/3 de chance), puis focus immédiatement la marionnette. Éliminer tout Poutch boosté en PA pour éviter l'OS. Dark Vlad et Dragon Cochon = peu de PV, plus faciles. Bouftou Royal = 4000+ PV + soins massifs. Minotoror = 3000 PV mais résistances >40% dans tous les éléments. Mulou Meulé = faiblesse Terre/Feu mais >6000 PV.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 20 tours. Reprendre la stratégie globale. Si l'invocation du tour 1 est trop difficile à gérer, recommencer jusqu'à obtenir un Poutch boosté en PA (non transformé) pour simplifier.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Le boss Silf le Rasboul Majeur possède 200% de résistances dans tous les éléments
  41: {
    "summary": "Le boss Silf le Rasboul Majeur possède 200% de résistances dans tous les éléments. Pour le rendre vulnérable, il faut le booster à 14 PA (via vol ou ajout de PA) pour déclencher son sort Hololole, qui lui fait perdre 50% de résistance dans l'élément frappé. Frapper ensuite constamment dans le même élément pour l'abattre.",
    "recommendedLevel": "150",
    "composition": "Inclure un Xélor ou personnage capable de voler/ajouter des PA. Classes avec sorts à faible coût en PA conseillées.",
    "keyResist": [
      "Variable (choisir un élément et conserver jusqu'à la fin)"
    ],
    "phases": [
      {
        "title": "Salle 1",
        "mechanics": [
          "Kilibriss : saute dans tous les sens, fait passer le prochain tour de la cible s'il attaque au CàC.",
          "Craqueleur Poli : n'attaque qu'au CàC.",
          "Craqueboule Poli : frappe au CàC, peu fort."
        ]
      },
      {
        "title": "Salle 2",
        "mechanics": [
          "Apparition du Mufafah : frappe au CàC.",
          "Monstres des salles précédentes toujours présents."
        ]
      },
      {
        "title": "Salle 3",
        "mechanics": [
          "Kido : frappe au CàC.",
          "Bitouf des Plaines : beaucoup de PM, frappe au CàC puis s'éloigne rapidement."
        ]
      },
      {
        "title": "Salle 4",
        "mechanics": [
          "Pas de nouveaux monstres, mais les plus gros spécimens du donjon sont présents."
        ]
      },
      {
        "title": "Boss — Silf le Rasboul Majeur",
        "mechanics": [
          "200% de résistances dans tous les éléments de base.",
          "Peut coopérer ses ennemis en les frappant.",
          "Invoque chaque tour un Rasboul Mineur : 75% de résistance partout sauf dans un élément aléatoire où il a -75% (peut soigner un allié ou le boss).",
          "Pour déclencher Hololole : amener Silf à 14 PA minimum (vol de PA ou sorts d'ajout tels que Dévouement, Mot Stimulant, Piqûre Motivante).",
          "Hololole : à chaque coup reçu dans un élément, Silf perd 50% de résistance dans cet élément et gagne 50% dans les autres.",
          "Frapper toujours dans le même élément choisi — éviter le CàC multi-éléments.",
          "Les 4 premiers coups après déclenchement de Hololole ne causent aucun dégât.",
          "Hololole dure 2 tours ; renouveler la procédure si le boss survit.",
          "Commencer par tuer tous les monstres et invocations présents, puis gérer les Rasbouls Mineurs au fil des tours."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png",
            "caption": "Illustration succès spécial Silf le Rasboul Majeur"
          }
        ]
      }
    ],
    "tips": [
      "Prévoir une pierre d'âme de niveau 150 minimum.",
      "La capture de l'âme du boss est utile pour la quête du Dofus Ocre : L'éternelle moisson.",
      "Accès en [-51,9] : parler à Razbitume pour entrer.",
      "Recette de la clef : 3x Seigle, 3x Edelweiss, 2x Duvet du Kilibriss, 2x Fragment de cerveau poli, 2x Moustache du Mufafah, 2x Plume de fesse du Kido, 2x Dorade Grise, 2x Viande Séchée.",
      "Quête liée : Comment perdre ses plumes."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Ras le boule",
        "strategy": "Il ne doit jamais y avoir plus de 2 Rasbouls Mineurs sur le terrain au début du tour de Silf le Rasboul Majeur. Éliminer les Rasbouls Mineurs au fur et à mesure qu'ils sont invoqués (jusqu'à 2 par tour)."
      }
    ]
  },
  // Le Rat Blanc est le boss du Garde-manger situé dans les égouts de Bonta
  42: {
    "summary": "Le Rat Blanc est le boss du Garde-manger situé dans les égouts de Bonta. Son sort « Rascasse » lui confère 50% de résistances dans chaque élément où il est frappé (cumulable jusqu'à 100%), mais cet effet est débuffable. La stratégie repose sur le débuff de Rascasse pour maintenir une fenêtre de dégâts, tout en gérant les soins de l'Aloevée Rat.",
    "recommendedLevel": "60",
    "composition": "Pas de composition imposée. Des sorts de débuff sont fortement conseillés pour contrer le sort Rascasse du boss. Pour le succès Hardi, des classes très mobiles (téléportation, boost PM) sont nécessaires. Le Pandawa peut aider les classes lentes à rejoindre les ennemis.",
    "keyResist": [
      "Variable (voir résistances)"
    ],
    "phases": [
      {
        "title": "Salles (monstres)",
        "mechanics": [
          "Aloevée Rat — Soignerat : soigne 20% des PV max des alliés (zone cercle rayon 2), applique état insoignable aux ennemis dans la zone pendant 2 tours. Priorité : focus ou éloigner du boss.",
          "Aloevée Rat — Drainerat : 80 dégâts eau en vol de vie à distance (2–8 PO, 2×/tour).",
          "Aloevée Rat — Pousserat : 140 dégâts air + recul 2 cases en mêlée.",
          "Capoei Rat — Egaliserat : 50% PV en bouclier au début ; au tour 4 perd 50% résistances pendant 2 tours. Dangereux en mêlée.",
          "Capoei Rat — Stabiliserat : +40 tacle (lanceur) / −50 tacle (cible) ; modifie la fuite au tour suivant.",
          "Capoei Rat — Confinerat : attire 2 cases + état pesanteur 2 tours (ligne 2–4 PO).",
          "Capoei Rat — Déchiquetterat : 160 + 120 eau vol de vie en zone carré taille 1 autour de lui.",
          "Chak Rat — Préciserat : +15% critique à tous les alliés pour 2 tours.",
          "Chak Rat — Assoifferat : 100 dégâts air + poison 50 air pendant 1 tour (ligne jusqu'à 6 PO).",
          "Chak Rat — Affinerat : 200 dégâts terre sur les cases adjacentes + +5% critique permanent.",
          "Chika Rat — Embrocherat : 130 dégâts terre en ligne taille 2, mêlée 2×/tour.",
          "Chika Rat — Lancerat : 80 air + poison 40 neutre/2 tours (ligne 2–6 PO).",
          "Chika Rat — Aurat : effets rotatifs sur 3 tours (tour 2 : −2PM +10% résist ; tour 3 : −10% résist +10% dégâts ; tour 4 : −10% dégâts +2PM).",
          "Scélée Rate — Collapserat : 100 dégâts eau + −1PA esquivable pendant 2 tours (zone cercle rayon 2, jusqu'à 5 PO sans LdV).",
          "Scélée Rate — Affaiblirat : −10% critique et −10% résistances cible pendant 2 tours.",
          "Scélée Rate — Freinerat : 100 dégâts feu + −1 tour envoûtement + −10 fuite pendant 2 tours."
        ]
      },
      {
        "title": "Boss — Rat Blanc",
        "mechanics": [
          "Rascasse : pendant 2 tours, chaque attaque subie lui confère +50% résistances dans l'élément de l'attaque (cumulable → 100% = immunité). Sort débuffable. Relance 5 tours.",
          "Rapierre : 180 dégâts feu vol de vie en mêlée + −10 esquive PA/PM (2×/tour).",
          "Ravage : 200 dégâts terre en ligne taille 3 + +50% critique pour 1 tour, uniquement en mêlée.",
          "Peste Blanche : état « Peste Blanche » 4 tours (6 en critique) — si la cible est soignée, elle perd TOUS ses envoûtements. Portée jusqu'à 6 PO. Attention : enlève aussi bien les buffs que les malus."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj21-52_orig.png",
            "caption": "Rascasse : schéma de résistances cumulées selon l'élément d'attaque"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj21-53_orig.png",
            "caption": "Rascasse : schéma complémentaire des effets de résistances"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj21-rapierre_orig.png",
            "caption": "Rapierre : zone d'effet du sort"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj21-ravage_orig.png",
            "caption": "Ravage : zone d'effet du sort"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj21-peste-blanche_orig.png",
            "caption": "Peste Blanche : zone d'effet du sort"
          }
        ]
      },
      {
        "title": "Stratégie globale",
        "mechanics": [
          "Utiliser impérativement des sorts de débuff sur le Rat Blanc pour retirer Rascasse ou empêcher son application.",
          "Focus l'Aloevée Rat en premier si on ne vise pas le succès Premier, pour éviter ses soins.",
          "Éloigner le Rat Blanc de l'Aloevée Rat pour l'empêcher d'être soigné ; donner une invocation à l'Aloevée Rat pour canaliser son IA fuyarde.",
          "Se méfier du Capoei Rat en mêlée et de son bouclier initial.",
          "La Peste Blanche empêche les soins (tous les envoûtements retirés si soigné) : éviter de se faire soigner sous cet état si on tient à ses buffs, mais peut aussi retirer des malus."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj21-50_orig.png",
            "caption": "Schéma stratégique — Peste Blanche et gestion des envoûtements"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj21-51_orig.png",
            "caption": "Schéma stratégique complémentaire"
          }
        ]
      }
    ],
    "tips": [
      "Position du donjon : entrée dans les Canaux méphitiques (égouts de Bonta) en [-34,-59].",
      "Quêtes liées : La Geste de Ratagnan, Vin Diou (Alignement Bontarien 41), Un juge hystérique.",
      "Recette de la clef : 2x Lance de Chika Rat, 2x Collier de Chak Rat, 2x Lance-Pierre de Scélée Rate, 2x Ouvrage magique d'Aloevée Rate, 2x Viande Séchée, 2x Dorade Grise, 3x Edelweiss, 3x Seigle.",
      "Pierre d'âme de puissance 150 minimum pour capturer le boss.",
      "La capture de l'âme du boss est utile pour la quête du Dofus Ocre : L'éternelle moisson.",
      "Rascasse est débuffable : retirer l'état avant qu'il n'atteigne 100% dans un élément, ou après pour le ramener à 0%.",
      "La Peste Blanche retire tous les envoûtements si soigné — éviter de se faire soigner si on a des buffs importants ; peut cependant aussi retirer des malus."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Premier",
        "strategy": "Achever le Rat Blanc en premier. Focus maximum sur le boss dès le début, utiliser des débuffs pour contrer Rascasse. Éloigner le Rat Blanc de l'Aloevée Rat pour éviter les soins, ou donner une invocation à l'Aloevée Rat pour canaliser son IA fuyarde.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/premier.png"
      },
      {
        "name": "Hardi",
        "strategy": "Tous les combattants alliés doivent finir leur tour sur une cellule adjacente à celle d'un ennemi. La map a des placements de départ très éloignés : privilégier les classes très mobiles (téléportation, boost PM). Un Pandawa avec l'initiative peut emmener les classes lentes (Eniripsa, Sadida) vers les ennemis. Niveau 180+ : la Prymaradite « Ratrapy Iridescente » (+3 PM) ou un Dofus Abyssal facilitent la chose.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/hardi.png"
      },
      {
        "name": "La taille du rat (Spécial)",
        "strategy": "Chaque ennemi doit subir des dégâts au moins une fois entre chacun de ses tours. Attaquer chaque ennemi au moins une fois par tour.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 20 tours. N'importe quel duo de classes peut réussir ce donjon sans conseils particuliers.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Le Rat Noir est le boss de la Sousouriciere, situe dans les Entrailles de Brakmar
  43: {
    "summary": "Le Rat Noir est le boss de la Sousouriciere, situe dans les Entrailles de Brakmar. Les deux dangers principaux sont Peste Noire (les soins declenchent des degats air massifs) et Kackitu (tue la cible si elle recoit des degats terre/neutre apres le sort). La strategie consiste a rester a distance, privilegier feu et air (20% de faiblesse), et ne jamais soigner un personnage affecte par Peste Noire.",
    "recommendedLevel": "100",
    "composition": "Classes feu et air recommandees. Un Pandawa est utile (Vulnerabilite pour Blitzkrieg, porter un allie pour Hardi). Prevoir une invocation avec tacle (bloqueuse, sacrifiee, pandawasta) pour absorber Kackitu.",
    "keyResist": [
      "Feu",
      "Air"
    ],
    "phases": [
      {
        "title": "Salles (monstres normaux)",
        "mechanics": [
          "Rate Atinee : Radotage (invoque Rat Molo en melee, 90 degats feu), Rapiat (90 degats feu zone carre taille 1 + soins allies dans la zone, 2-8 PO), Ratatouille (+2% dommages finaux a tous ses allies).",
          "Rate Iboisee : Rapprochement (teleportation jusqu'a la case ciblee + indeplacement 1 tour, jusqu'a 3 PO sans LdV), Raviner (200 degats neutre + retrait 20 fuite, melee), Raffinage (glyphe +30% dommages melee autour de la cible, jusqu'a 2 PO).",
          "Rat Li : Rappel a l'ordre (attire 3 cases + pesanteur, en ligne 3-6 PO sans LdV), Rapia (100 degats feu + -2 PA esquivable, jusqu'a 3 PO en ligne, 2x/tour), Rapport (teleportation derriere la cible + 120 degats terre + repousse 3 cases zone croix taille 1, en ligne jusqu'a 5 PO).",
          "Rat Plapla : Radioactivite (poison 100 air + -3 PO puis 100 degats neutre tour suivant, en ligne 3-6 PO), Raclage (150 degats terre + insoignable 2 tours + 70 degats air vol de vie sur ennemis en melee de la cible, en ligne jusqu'a 2 PO), Radar (-5% resistances au lanceur/allies mais +10% dommages pendant 2 tours, relance 3 tours).",
          "Rat Sio : Rancon (etat evolue de 1 a 3 chaque tour, -10% resistances par etat), Ratissage (200/180/120 degats neutre zone croix selon etat Rancon + -1 PM + applique Rancon aux cibles), Rayonnage (80/60/40 degats feu et eau selon etat + -1 PA, 2-8 PO, 2x/tour), Rapace (-3/2/1 PO zone croix selon etat, 2-8 PO)."
        ]
      },
      {
        "title": "Salle du Boss - Rat Noir",
        "mechanics": [
          "Kackitu : Applique l'etat Kackitu a toutes les entites ennemies en zone croix taille 1 autour du Rat Noir. Si une entite dans cet etat subit des degats terre ou neutre, elle meurt instantanement. Lance uniquement en melee (relance 7 tours) - rester a distance pour l'eviter.",
          "Kackisoigne : Applique l'etat Kackisoigne a un allie (3 tours) : si la cible recoit des degats terre ou neutre, elle est entierement soignee. Ne pas taper terre/neutre sur les allies du Rat Noir sous cet etat (jusqu'a 8 PO, relance 2 tours).",
          "Peste Noire : Applique l'etat Peste Noire a un ennemi (6 tours) : si la cible recoit des soins, elle subit 50% des PV actuels du Rat Noir en degats air. Ne JAMAIS soigner un personnage sous Peste Noire. Le vol de vie ne compte pas comme soin - peut etre utilise librement (6 PO, relance 3 tours).",
          "Rafale : 100 degats vol de vie dans chaque element, uniquement en melee (2x/tour).",
          "Resistances du Rat Noir : 50% terre (eviter absolument cet element) ; 20% de faiblesse en feu et air (a privilegier).",
          "Strategique : Rester a distance pour ne pas subir Kackitu. Placer une invocation tacleuse en melee pour l'absorber (relance 7 tours = tranquille pour longtemps). Privilegier feu et air. Ne jamais soigner les cibles sous Peste Noire. Ne pas jouer terre/neutre car Kackisoigne soigne les allies si on les tape avec ces elements."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj22-602_orig.png",
            "caption": "Schema Peste Noire - ne pas soigner la cible affectee"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj22-601_orig.png",
            "caption": "Schema Kackitu - placer une invocation tacleuse pour absorber le sort"
          }
        ]
      }
    ],
    "tips": [
      "Entree du donjon : Entrailles de Brakmar (egouts de Brakmar) en [-28,37].",
      "Recette clef : 3 Seigle, 3 Edelweiss, 2 Dorade Grise, 2 Viande Sechee, 2 Vieux Bouquin de Rat Li, 2 Oreille de Rat Plapla, 2 Crane magique de Rate Atinee, 2 Tuyau Rouille de Rate Iboisee.",
      "Pierre d'ame : puissance 150 minimum pour capturer le Rat Noir.",
      "L'ame du Rat Noir est utile pour la quete du Dofus Ocre (L'eternelle moisson).",
      "Quetes liees : Fait comme un rat, Triple X (Alignement Brakmarien 41), Un juge hysterique.",
      "Le vol de vie ne compte pas comme soin : vous pouvez en abuser pour vous soigner meme sous Peste Noire.",
      "Kackitu a une relance de 7 tours : une fois absorbe par une invocation, vous avez largement le temps de tuer le boss."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Blitzkrieg",
        "strategy": "Tuer le Rat Noir avant le debut de son tour. Utiliser feu et air (faiblesses -20%). Se booster et augmenter ses degats subis (Vulnerabilite du Pandawa) avant de commencer le focus. Commencer avec le personnage qui joue juste apres le Rat Noir en initiative. Les poisons font effet avant le debut de son tour et peuvent reussir le challenge s'il meurt de leurs degats.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/blitzkrieg.png"
      },
      {
        "name": "Hardi",
        "strategy": "Les combattants allies doivent finir leur tour adjacent a un ennemi. Difficulte : Kackitu. Option 1 (Sacrifice) : placer un personnage/invocation en melee du Rat Noir pour absorber Kackitu (relance 7 tours). Option 2 (L'Infiltre) : tuer le Rat Noir en premier via un monstre du combat a distance (ne fonctionne pas avec idoles Dynamo). Option 3 (Blocage) : bloquer le Rat Noir dans un coin entre ses acolytes et le focus en premier. Un Pandawa peut porter un allie en melee d'un mob sans faire echouer Hardi.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/hardi.png"
      },
      {
        "name": "Rat-trapage",
        "strategy": "Le Rat Noir ne doit pas subir de dommages avant que tous les autres ennemis soient achebes. Eliminer tous les monstres tout en restant a distance du Rat Noir pour eviter Kackitu.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 20 tours. Pas de difficulte particuliere, reprendre la strategie standard du combat.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Donjon mid-level des Souterrains du Château d'Amakna, accessible via une clef combinant de
  44: {
    "summary": "Donjon mid-level des Souterrains du Château d'Amakna, accessible via une clef combinant des drops du Rat Blanc et du Rat Noir. Le boss Sphincter Cell possède 200% de résistances dans tous les éléments et doit être rendu vulnérable grâce à ses propres invocations de tortues avant de pouvoir être tué.",
    "recommendedLevel": "150",
    "composition": "Un personnage capable de mettre en état pesanteur (Iop, Cra ou Enu) est recommandé pour immobiliser le Cell. Utile d'avoir un Enu pour la corruption.",
    "keyResist": [
      "Variable (tortues de couleur pour choisir l'élément)"
    ],
    "phases": [
      {
        "title": "Salles 1 à 4 — Monstres préliminaires",
        "mechanics": [
          "Rat Colleur : retire des PA et de la PO.",
          "Rat Masseur : pousse les personnages, vole des PV, frappe en zone et soigne ses alliés en zone.",
          "Rat Goûtant : attaque directe.",
          "Ratmane d'Égoutant : applique des malus PA/Intelligence/Agilité/Force et booste ses alliés et lui-même en PM.",
          "Rat Pine (salle 2, 8 joueurs) : malus en retrait PM.",
          "Rat Fraîchi (salle 2, 8 joueurs) : malus en fuite, frappe en ligne.",
          "Rat Botteur (salle 3) : applique l'état Affaibli (interdit les attaques CàC), booste ses alliés en dommages.",
          "Rat Caille (salle 3) : booste ses alliés en PM, se booste en Force quand elle est frappée.",
          "Salle 4 : composée uniquement des 2 plus gros monstres du donjon, sans nouvelles mécaniques."
        ]
      },
      {
        "title": "Boss — Sphincter Cell : présentation et invocations",
        "mechanics": [
          "Sphincter Cell possède 200% de résistances dans chaque élément à son état normal : impossible à blesser directement.",
          "Le Cell peut se téléporter et frappe très fort dans tous les éléments.",
          "Il invoque des tortues colorées : rouge (feu), jaune (air/agilité), verte (terre), bleue (eau).",
          "Rat Noir (acolyte) : sort poison qui peut tuer d'un coup si le personnage est soigné, et sort qui tue si le personnage est frappé.",
          "Rat Blanc (acolyte) : gagne 50% de résistances dans l'élément avec lequel on le frappe.",
          "Priorité : tuer d'abord le Rat Noir et le Rat Blanc avant de gérer le Cell."
        ]
      },
      {
        "title": "Boss — Mécanique des tortues pour retirer l'invulnérabilité",
        "mechanics": [
          "Chaque tortue invoquée par le Cell peut lui appliquer -200% de résistances dans son élément, mais uniquement si elle est placée au CàC du Cell ET qu'un personnage allié est au CàC de la tortue.",
          "Kawabunga : sort des tortues qui applique des faiblesses en zone croix (taille 1) autour d'elles — affecte aussi les alliés adjacents.",
          "Immobiliser le Cell : le mettre en état Pesanteur (via Iop, Cra ou Enu) ou utiliser une Corruption (Enu) pour l'empêcher de bondir.",
          "Mettre la tortue à 0 PM pour qu'elle reste en place au CàC.",
          "Il est possible de placer plusieurs tortues au CàC du Cell pour cumuler les faiblesses (-200% par tortue).",
          "Si le Cell n'est pas tué en 1-2 tours, renouveler l'opération pour cumuler davantage de faiblesses."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/8097000_orig.png",
            "caption": "Placement : case rouge = Cell, case verte = tortue, case bleue = personnage allié au CàC de la tortue"
          }
        ]
      }
    ],
    "tips": [
      "La Première clef s'obtient sur le Rat Blanc dans son donjon (drop 100%), la Deuxième clef sur le Rat Noir dans son donjon (drop 100%).",
      "Prévoir une Pierre d'Âme de niveau 150 minimum.",
      "L'âme du Sphincter Cell est utile pour la quête du Dofus Ocre : L'Éternelle Moisson.",
      "Tuer en priorité le Rat Noir (ses poisons peuvent tuer instantanément) et le Rat Blanc avant de s'occuper du Cell.",
      "Tuer les tortues dont l'élément ne vous intéresse pas pour le Cell.",
      "Succès Spécial «Pizwa quatre couleurs» : ne jamais se placer au CàC d'une tortue pour ne pas subir le sort Kawabunga."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Pizwa quatre couleurs",
        "strategy": "Aucun allié ne doit subir les effets du sort Kawabunga (sort des tortues qui applique des faiblesses en zone croix de taille 1 autour de la tortue). Ne jamais se placer au contact d'une tortue pendant tout le combat contre le boss.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Le Scarabosse Dore est le boss du Donjon des Scarafeuilles, un donjon de niveau 40 en Amak
  45: {
    "summary": "Le Scarabosse Dore est le boss du Donjon des Scarafeuilles, un donjon de niveau 40 en Amakna. Chaque Scarafeuille a 100% de resistance dans son element et 50% de faiblesse dans l'element oppose, ce qui impose de constituer une equipe multi-elements. La strategie consiste a rester a distance, eliminer les Flammeches et Scarafeuilles Immatures rapidement, et focus le Scarabosse Dore en dernier.",
    "recommendedLevel": "40",
    "composition": "Equipe multi-elements fortement conseillee pour couvrir les faiblesses des differents Scarafeuilles (Blanc=faiblesse Terre, Bleu=faiblesse Feu, Rouge=faiblesse Eau, Vert=faiblesse Air).",
    "keyResist": [
      "Variable selon les Scarafeuilles presents — taper dans l'element oppose a la couleur du Scarafeuille cible"
    ],
    "phases": [
      {
        "title": "Salles de monstres (Salles 1, 3, 4, 5)",
        "mechanics": [
          "Chaque Scarafeuille a 100% de resistance dans son element de predilection et 50% de faiblesse dans l'element oppose.",
          "Scarafeuille Blanc : 100% resistance Air, 50% faiblesse Terre.",
          "Scarafeuille Bleu : 100% resistance Eau, 50% faiblesse Feu.",
          "Scarafeuille Rouge : 100% resistance Feu, 50% faiblesse Eau.",
          "Scarafeuille Vert : 100% resistance Terre, 50% faiblesse Air.",
          "Scarafeuille Noir : 100% resistances neutre ; peut se rendre invisible (lui et ses allies) a partir du tour 2 avec Scarinvi ; retire 6PM avec Scarimmo (portee 6PO).",
          "Scarafeuille Immature : 100% resistance dans un element aleatoire ; se transforme au bout de 2 tours en Scarafeuille de l'element correspondant (gain de 1PA, 1PM, 20% vitalite).",
          "Tous les Scarafeuilles peuvent invoquer une Flammeche (relance 3 tours) et la booster via Elemental Dispersion.",
          "Flammeches : tres faibles en PV mais peuvent exploser (Bomball : 200% de leurs PV en zone croix 1).",
          "Salle 2 : salle de traversee sans combat, attention aux trous dans le sol."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj57-50exemple-res_orig.png",
            "caption": "Tableau des resistances des Scarafeuilles"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj57-55elements-scara_orig.png",
            "caption": "Elements et faiblesses des Scarafeuilles"
          }
        ]
      },
      {
        "title": "Combat boss — Scarabosse Dore",
        "mechanics": [
          "Brouillard Empoisonne : retire 6PO et 2PM pendant 1 tour a tous les personnages (relance 4 tours — des le tour 1 puis tous les 4 tours).",
          "Expulsion : repousse de 3 cases en croix de taille 1 autour du Scarabosse Dore (lancable 1 fois par tour).",
          "Naissance : invoque un Scarafeuille Immature en ligne jusqu'a 3PO (relance 5 tours).",
          "Picoti : inflige 60 degats en vol de vie dans un element aleatoire (sauf neutre), en ligne jusqu'a 3PO (1 fois par cible).",
          "Premiers soins : soigne le Scarabosse Dore et ses allies de 100PV en cercle de taille 2 (relance 3 tours).",
          "Le Scarabosse Dore n'est pas invulnerable et n'a pas de mecanique de phase particuliere.",
          "Resistances du Scarabosse Dore : 24% dans tous les elements.",
          "Focus conseille : Scarafeuille Noir en priorite (avant le tour 2 pour eviter l'invisibilite), puis Scarafeuilles selon faiblesses, enfin le Scarabosse Dore.",
          "Eliminer les Scarafeuilles Immatures des leur invocation avant transformation (au bout de 2 tours).",
          "Rester a distance : la plupart des sorts ennemis n'ont que 2PO de portee."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj57-brouillard-empoisonnev2_orig.png",
            "caption": "Brouillard Empoisonne — zone d'effet"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj57-expulsion_orig.png",
            "caption": "Expulsion — zone d'effet"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj57-naissance_orig.png",
            "caption": "Naissance — invocation Scarafeuille Immature"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj57-56scarabosse-dore_orig.png",
            "caption": "Strategie globale — focus Scarabosse en dernier"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj57-57scarainvi_orig.png",
            "caption": "Invisibilite du Scarafeuille Noir — focus avant tour 2"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj57-58brouillard-empoisonne_orig.png",
            "caption": "Brouillard Empoisonne — impact retrait PO/PM"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj57-59scara-imma_orig.png",
            "caption": "Gestion des Scarafeuilles Immatures invoques"
          }
        ]
      }
    ],
    "tips": [
      "Entree du donjon : Amakna, Plaine des Scarafeuilles en [1,26].",
      "Recette de la clef : 2x Ailes de Scarafeuille Blanc, 2x Ailes de Scarafeuille Bleu, 2x Ailes de Scarafeuille Rouge, 2x Ailes de Scarafeuille Vert, 2x Viande Minerale, 2x Poisson-Chaton, 2x Trefle a 5 feuilles, 2x Avoine.",
      "Pierre d'ame de puissance 50 minimum pour capturer le Boss.",
      "L'ame du Scarabosse Dore est utile pour la quete du Dofus Ocre : L'eternelle moisson.",
      "Quete liee : Les sbires du maitre.",
      "Taper chaque Scarafeuille dans son element de faiblesse (oppose a sa couleur).",
      "Focus le Scarafeuille Noir avant son 2eme tour pour l'empecher d'utiliser l'invisibilite ; si impossible, rester hors de ses 6PO pour eviter Scarimmo (retrait PM).",
      "Focus le Scarabosse Dore en dernier car il a beaucoup de PV, des resistances a 24% dans tous les elements et se soigne tous les 3 tours."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Zombie",
        "strategy": "Utiliser exactement 1PM par tour. Investir en fuite PM (environ 10 suffisent) pour ne pas etre bloque par le tacle. Focus le Scarafeuille Noir en priorite car son sort Scarimmo (6PO) peut retirer jusqu'a 6PM. Rester hors de ses 6PO pour eviter le retrait de PM. Si un personnage se retrouve sans PM, lui donner des PM via des sorts allies.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/zombie.png"
      },
      {
        "name": "Mains propres",
        "strategy": "Achever tous les ennemis (y compris Flammeches et invocations) uniquement avec des degats indirects : poison, invocations, glyphes, degats de poussee, pieges, mur de bombes Roublard. Sorts communs utilisables : Liberation (degats de poussee), invocations d'Arakne et Chafer.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/mains-propres.png"
      },
      {
        "name": "Special : Doree, mi fa sol",
        "strategy": "Les invocations ennemies ne doivent subir aucun dommage. Ignorer les Flammeches sans leur infliger de degats (ni zone, ni poussee). Astuce : placer une invocation alliee pres d'une Flammeche pour qu'elle explose dessus sans faire echouer le succes.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 20 tours. Eviter 2 personnages dans le meme element (agilite ou chance) car difficile contre le Scarafeuille a 100% resistance. Focus : Scarafeuille Noir, puis Scarafeuilles Bleu et Blanc, puis Scarabosse Dore. Eliminer les Scarafeuilles Immatures au fur et a mesure.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Le Repaire de Skeunk est un donjon en 5 salles : 4 salles de poupées/Sadidas (Diamantine, 
  46: {
    "summary": "Le Repaire de Skeunk est un donjon en 5 salles : 4 salles de poupées/Sadidas (Diamantine, Emeraude, Rubise, Saphira) aux mecaniques variees, puis un boss final reunissant les 4 poupees et la Poupee Affamee. La strategie principale consiste a eliminer la Poupee Affamee en premier (en la nourrissant d'invocations ou en la boostant en PA) avant de traiter les poupees dans l'ordre.",
    "recommendedLevel": "150",
    "composition": "Equipe standard ; prevoir des invocateurs pour nourrir la Poupee Affamee (elle monte en PA en gobant des invocations, max 2/tour, et explose a 8 PA). Aucune classe imposee.",
    "keyResist": [
      "Variable (voir resistances)"
    ],
    "phases": [
      {
        "title": "Salle 1 - Diamantine",
        "mechanics": [
          "Diamantine applique l'etat Pesanteur des le debut : bonds, cooperation et deplacements lies sont impossibles.",
          "Elle frappe a distance en Terre, se boost en PV, donne l'etat Affaibli (interdit le CaC si elle vous frappe au CaC) et des-invoque les ennemis au CaC.",
          "Elle invoque une Poupee Mortelle qui OS au CaC : ne pas approcher cette invocation.",
          "Si le groupe est > 4 personnages, des Warko Violet et Koalak Farouche (invisible) la rejoignent.",
          "Faiblesse de la Poupee Mortelle dans un element aleatoire."
        ]
      },
      {
        "title": "Salle 2 - Emeraude",
        "mechanics": [
          "Emeraude se comporte comme une Sacrieur : elle utilise Transposition et Cooperation tout en attaquant.",
          "Les Poupees Emeraude retirent des PA ; elles ont 90% de resistances dans tous les elements sauf Agilite (Air) => les frapper exclusivement en Air."
        ]
      },
      {
        "title": "Salle 3 - Rubise",
        "mechanics": [
          "Rubise vous pousse en frappant et vous transforme en Totem au CaC : vous passez a 0 PA et 0 PM.",
          "Elle invoque des Totems qui la soignent et la boostent.",
          "Si le groupe est > 4, des Fauchalak (OS au CaC), Koalak Sanguin (soins) et Guerrier Koalak apparaissent."
        ]
      },
      {
        "title": "Salle 4 - Saphira",
        "mechanics": [
          "Saphira frappe en retirant des PA et se rend invisible.",
          "La Poupee Affamee reconstitue tous les monstres a chaque tour : la tuer en priorite.",
          "Pour tuer la Poupee Affamee : la nourrir d'invocations (max 2/tour) ou la booster en PA. Elle gagne 1 PA par invocation gobee et explose automatiquement a 8 PA, infligeant des degats Feu a tous les personnages.",
          "Une fois la Poupee Affamee eliminee, tuer Saphira."
        ]
      },
      {
        "title": "Boss - Skeunk",
        "mechanics": [
          "Le Skeunk est accompagne des 4 poupees (Diamantine, Emeraude, Rubise, Saphira) et de la Poupee Affamee.",
          "Le Skeunk fonctionne comme un Eniripsa : reconstitue ses allies ou lui-meme, soigne, retire des PM, frappe en Feu, debuff et se boost en PA.",
          "Priorite 1 : eliminer la Poupee Affamee (meme methode : invocations ou boost PA => explosion a 8 PA).",
          "Priorite 2 : tuer Rubise (transformation en Totem) et Diamantine (Poupee Mortelle qui OS au CaC) avant les autres.",
          "Eviter le CaC de la Poupee Mortelle de Diamantine pendant tout le combat.",
          "Rubise transforme en Totem au CaC : garder ses distances ou la tuer rapidement."
        ]
      }
    ],
    "tips": [
      "Acces : aller en [-20,10] (Vallee de la Morh'Kitu), parler a Kakolak ; voir le guide Chemin Skeunk pour le chemin exact.",
      "Clef : 2x Foulard de Koalak Farouche, 2x Poils de Guerrier Koalak, 2x Couche usagee du Warko Violet, 2x Houpette du Koalak Sanguin, 2x Crane d'Aventurier, 2x Perche, 2x Graine de Pandouille, 2x Malt.",
      "Pierre d'ame de puissance 150 minimum pour capturer l'ame du Skeunk (utile pour la quete du Dofus Ocre : L'eternelle moisson).",
      "Traverser 2 salles sans combat pour acceder a la salle 1.",
      "Les Poupees Emeraude ont 90% de resistances partout sauf en Agilite (Air) : les frapper uniquement en Air.",
      "Sort Boomerang Perfide : apres avoir tue le Skeunk, parler a Diamantine et lui donner 10 boomerangs de chaque type (Dok Alako, Koalak Sanguin, Maitre Koalak, Warko Marron).",
      "Dofus Kaliptus (6 a 30 Prospection) obtenu automatiquement en parlant au Skeunk a la sortie (en echangeant les 4 broches recuperees dans les salles).",
      "Familier Koalak Sanguin : donner une panoplie Koalak complete a Emeraude apres le combat.",
      "Quetes liees : L'epee du rocher, La voie du guerrier."
    ],
    "rewards": [
      "Dofus Kaliptus (6 a 30 Prospection) - obtenu en parlant au Skeunk a la sortie.",
      "Familier Koalak Sanguin - echange panoplie Koalak complete avec Emeraude.",
      "Sort Boomerang Perfide - donner 10 boomerangs de 4 types a Diamantine."
    ],
    "achievements": [
      {
        "name": "Les fans et les enfants d'abord",
        "strategy": "Au debut du combat boss, une poupee Sadida est designee par un etat ; l'eliminer en premier. A sa mort, une autre est designee, et ainsi de suite. Toutes les Sadidas doivent etre achevees avant que le Skeunk ne puisse subir des degats. La Poupee Affamee peut etre tuee a tout moment. Si vous avez assez de degats pour eliminer les Sadidas avant que la Poupee Affamee ne joue (elle soigne tout le monde a 100% a son tour), eliminez d'abord les Sadidas ; sinon tuez d'abord la Poupee Affamee. Attention aux degats de zone qui toucheraient le Skeunk par inadvertance.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Le Donjon des Squelettes est dominé par le Chafer Rōnin, un boss qui crée 4 illusions de l
  47: {
    "summary": "Le Donjon des Squelettes est dominé par le Chafer Rōnin, un boss qui crée 4 illusions de lui-même à chaque tour via le sort Bunshin, obligeant les joueurs à l'identifier parmi ses copies. La véritable menace vient des Chafer Draugr qui appliquent un poison lié aux PM et posent des glyphes dévastateurs, rendant leur élimination prioritaire.",
    "recommendedLevel": "40",
    "composition": "Pas de composition imposée. Avoir au moins un personnage avec un sort de zone facilite la recherche du vrai Chafer Rōnin parmi ses illusions. Un personnage capable d'appliquer un poison de fin de tour est très utile pour le révéler automatiquement. Des sorts de retrait de PO permettent de neutraliser les Chafer Draugr.",
    "keyResist": [
      "terre"
    ],
    "phases": [
      {
        "title": "Salles normales",
        "mechanics": [
          "Chafer Draugr — Do Fus Rah ! : repousse de 5 cases en ligne (éviter de se placer en ligne avec les entités ciblables, risque de dégâts de poussée contre un mur).",
          "Chafer Draugr — Hel : applique un poison de fin de tour infligeant 18 dégâts air par PM utilisé + pose un glyphe d'une case sous la cible pendant un tour (ne pas y finir son tour).",
          "Chafer Draugr — Mjölnir : dégâts air + état pesanteur en zone croix de taille 1, uniquement à 1PO.",
          "Chafer Invisible — Camouflage : devient invisible pendant 2 tours.",
          "Chafer Primitif — Robustesse : réduit les dégâts subis en mêlée de 40 pendant 3 tours.",
          "Rib — Embrochement : repousse de 5 cases en mêlée. Disruption : renvoie 15 dommages pendant 2 tours.",
          "Focus prioritaire : Chafer Draugr en premier, puis Chafer Primitif."
        ]
      },
      {
        "title": "Combat du boss — Chafer Rōnin",
        "mechanics": [
          "Bunshin : à partir du tour 2, le Chafer Rōnin crée 4 illusions de lui-même et passe son tour. Il y a donc 5 Chafer Rōnin sur le terrain ; frapper une illusion la fait disparaître, trouver le bon les supprime toutes.",
          "Bushido : 60 dégâts terre en vol de vie, zone ligne de taille 2, uniquement en mêlée, lançable 4 fois par tour.",
          "Kikoha : 45 dégâts feu + retire 1 PM pour un tour (2 en critique), jusqu'à 6PO.",
          "Les 2 Chafer Draugr présents dans ce combat sont la véritable menace du donjon (poison PM + glyphes + poussée de 5 cases).",
          "Astuce clé : appliquer un poison de fin de tour dès le tour 1 sur le Chafer Rōnin (ex. Sève Paralysante du Sadida) — il prend les dégâts après Bunshin, se révèle et ses illusions disparaissent toutes.",
          "Utiliser des sorts de zone pour localiser le vrai Chafer Rōnin rapidement.",
          "Retirer la PO des Chafer Draugr et rester hors de portée de Hel (7PO modifiable).",
          "Ne pas utiliser trop de PM si sous l'effet de Hel ; utiliser des sorts de déplacement si possible.",
          "Éviter de se placer en ligne avec des entités susceptibles d'être ciblées par Do Fus Rah !"
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj68-30illusions_orig.jpg",
            "caption": "Le Chafer Rōnin et ses 4 illusions (sort Bunshin)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj68-31poison_orig.jpg",
            "caption": "Glyphe du Chafer Draugr (sort Hel) : ne pas finir son tour dedans"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj68-33strat-poison_orig.png",
            "caption": "Stratégie : poison de fin de tour sur le Chafer Rōnin pour le révéler après Bunshin"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj68-34revelation_orig.png",
            "caption": "Révélation du Chafer Rōnin — toutes les illusions disparaissent"
          }
        ]
      }
    ],
    "tips": [
      "Accès : se rendre au Cimetière d'Amakna en [10,15] et se placer sur la dalle en haut à gauche à côté de la tombe — une dalle se déplace et révèle des escaliers vers le donjon.",
      "Clef : 2x Os de Chafer, 2x Casque Cassé du Chafer, 2x Côtes de Rib, 2x Os Invisible du Chafer Invisible, 2x Viande Minérale, 2x Poisson-Chaton, 2x Trèfle à 5 feuilles, 2x Avoine.",
      "Pierre d'âme : puissance 50 minimum pour capturer le boss.",
      "Quête liée : Le maître des clefs.",
      "Après le donjon, parler au Chaferfu et choisir « Demander son secret » puis « Demander à apprendre l'invocation de Chaferfu » puis « Dire bonjour » pour apprendre le sort Invocation de Chaferfu.",
      "Les monstres des salles normales n'ont pas énormément de PV et tapent principalement en mêlée — ils peuvent être focus rapidement.",
      "Laisser le Chafer Rōnin dans son coin si ses illusions ne gênent pas, sauf s'il doit être repoussé pour dégager de l'espace."
    ],
    "rewards": [
      "Sort « Invocation de Chaferfu » (appris en parlant au Chaferfu à la fin du donjon)."
    ],
    "achievements": [
      {
        "name": "Nomade",
        "strategy": "Utiliser tous ses PM à chaque tour durant tout le combat. Difficultés : éviter les tacles des monstres (sort Libération commun utile pour repousser les ennemis) et le sort Hel du Chafer Draugr dont le poison inflige des dégâts proportionnels aux PM utilisés. Se débuffer si possible. Attention aux illusions qui peuvent également tacler. Ne pas oublier d'utiliser ses PM au dernier tour.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/nomade.png"
      },
      {
        "name": "Premier",
        "strategy": "Le Chafer Rōnin doit être tué en premier. Il joue en troisième position, après les 2 Chafer Draugr. Attaquer dès le tour 1 pour l'éliminer avant qu'il joue au tour 2. Appliquer un poison de fin de tour pour le révéler automatiquement. Utiliser des sorts de zone si encore vivant au tour 2.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/premier.png"
      },
      {
        "name": "Désillusion",
        "strategy": "Aucune illusion du Chafer Rōnin ne doit être présente au début de son tour. Appliquer un poison de fin de tour dès le tour 1 pour révéler le boss à chaque tour automatiquement. Possibilité de tuer le Chafer Rōnin au tour 1 ou au tour 2 avant qu'il joue pour nullifier l'effet. Se combine naturellement avec le succès Premier.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 20 tours. Privilégier une classe avec poison de fin de tour pour révéler le Chafer Rōnin. Attaquer les Chafer Draugr un par un en restant à distance. Une fois les Chafer Draugr éliminés, le plus dur est fait.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      },
      {
        "name": "Revenus d'outre-tombe",
        "strategy": "Vaincre les monstres avec 4 personnages minimum dont au moins un compagnon parmi : Kockis, Kubitus, Kalkanéus, Hectaupe ou Hichète. Possible avec 2 personnages + 2 compagnons (dont un de la liste). Le second compagnon peut être au choix parmi les 52 existants.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/compagnon2.png"
      }
    ]
  },
  // Le boss Batofu invoque des Tofus Fugaces et des Tofus Noirs tout en possédant une IA fuyar
  48: {
    "summary": "Le boss Batofu invoque des Tofus Fugaces et des Tofus Noirs tout en possédant une IA fuyarde ; l'objectif est de le bloquer dans un coin pour l'empêcher d'invoquer. Le Tofu Ventripotent, très résistant mais peu dangereux, doit être éliminé en dernier avec des dégâts eau.",
    "recommendedLevel": "20 — 40",
    "composition": "Au moins un personnage eau pour exploiter la faiblesse du Tofu Ventripotent (-21% eau). Les invocations sont utiles pour bloquer le Batofu et aider le succès Statue.",
    "keyResist": [
      "Eau",
      "Feu"
    ],
    "phases": [
      {
        "title": "Salles normales",
        "mechanics": [
          "La salle 2 est une zone à trous : éviter de cliquer sur les trous (chute dans le souterrain, remontée par l'échelle). Passer par le milieu pour le chemin le plus simple.",
          "Les monstres ont entre 8 et 12 PM et une IA fuyarde : ils tapent puis fuient. Reculer plutôt qu'avancer permet de les attirer vers soi.",
          "Tofukaz : priorité à éliminer avant son tour 2, car il peut rendre invisible ses alliés dans une zone cercle de taille 2 (sort Disparition groupée, relance 4 tours).",
          "Tofoune : soigne et donne des PA aux alliés (Picota : 2-3 PA dans zone cercle 2) — éliminer après le Tofukaz.",
          "Tofu Ventripotent : laissez-le dans son coin, tapez-le en dernier ; il boost ses alliés (Bénédiction du Tofulailler) et invoque des Bomberfus (explosion feu zone cercle 2).",
          "Tofu Mutant et Tofu Noir : à focus si plus de 4 personnages. Les Tofus Noirs érodent (Béco Rosif : 20% érosion)."
        ]
      },
      {
        "title": "Combat contre le Batofu (boss)",
        "mechanics": [
          "Béco de Batofu : 110 dégâts air jusqu'à 2 PO (1 fois par cible).",
          "Gotame : invoque un Tofu Noir en ligne jusqu'à 3 PO (relance 5 tours).",
          "Lancer de Tofu Fugace : invoque un Tofu Fugace en ligne jusqu'à 10 PO (relance 2 tours) ; repousse et inflige 30 dégâts neutre si quelqu'un est derrière la cellule ciblée.",
          "Batofu a 36% résistance air → préférer feu et eau pour l'attaquer.",
          "Bloquer le Batofu dans un coin (invocations ou encerclement) : il ne peut plus invoquer ni fuir, devient inoffensif.",
          "Ne pas éliminer les Tofus Fugaces : ils meurent automatiquement à la fin de leur 2e tour.",
          "Tofus Noirs invoqués par le Batofu érodent → les éliminer si le combat dure.",
          "Ordre recommandé : Tofukaz → Tofoune → Batofu (si bloqué) → reste des monstres → Tofu Ventripotent en dernier.",
          "Tofu Ventripotent : faiblesse eau (-21%), très résistant dans tous les autres éléments. Nécessite un personnage eau pour l'éliminer rapidement."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj69-30blocage_orig.jpg",
            "caption": "Bloquer le Batofu dans un coin l'empêche d'invoquer et de fuir"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj69-beco-de-batofu_orig.png",
            "caption": "Schéma du sort Béco de Batofu"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj69-gotame_orig.png",
            "caption": "Schéma du sort Gotame (invocation Tofu Noir)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj69-lancer-de-tofu_orig.png",
            "caption": "Schéma du sort Lancer de Tofu Fugace"
          }
        ]
      }
    ],
    "tips": [
      "Entrée : sous-sol de l'atelier paysan du Champ des Ingalsse en [5,6].",
      "Recette de la clef : 2x Oeuf de Tofu, 2x Oeil de Tofu Noir, 2x Patte de Tofukaz, 2x Dent de Tofu Mutant, 2x Viande Minérale, 2x Poisson-Chaton, 2x Trèfle à 5 feuilles, 2x Avoine.",
      "Pierre d'âme de puissance 50 minimum pour capturer le boss.",
      "Capture de l'âme utile pour la quête du Dofus Ocre : L'éternelle moisson.",
      "Quête liée : Le maître des clefs."
    ],
    "rewards": [
      "Drops classiques de monstres de la famille Tofu (Oeuf de Tofu, Oeil de Tofu Noir, Patte de Tofukaz, Dent de Tofu Mutant, etc.)"
    ],
    "achievements": [
      {
        "name": "Statue",
        "strategy": "Les combattants alliés doivent finir leur tour sur la même case que celle où ils l'ont commencé pendant tout le combat. Utiliser des invocations librement (elles ne sont pas soumises à la contrainte). Se placer près d'un monstre dès le départ pour l'éliminer avant son premier tour. Les sorts de placement sur alliés restent autorisés.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/statue.png"
      },
      {
        "name": "Versatile",
        "strategy": "Ne pas utiliser deux fois la même action dans un tour. Être attentif aux sorts réflexes : Picole (Pandawa), Karcham (Pandawa), Portail (Eliotrope).",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/versatile.png"
      },
      {
        "name": "Bécotam (Spécial)",
        "strategy": "Infliger des dégâts uniquement en ligne avec l'ennemi ciblé. Attention aux dégâts hors tour (glyphes, pièges, poisons). Les invocations doivent aussi être en ligne avec leur cible.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages en moins de 20 tours. Conseillé : un personnage eau. Ordre : Tofukaz → Tofoune → bloquer et focus Batofu → Tofu Ventripotent en dernier.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      },
      {
        "name": "Rats… au sens propre ou au figuré (Compagnon)",
        "strategy": "4 personnages minimum dont au moins un compagnon parmi : Rapiat, Rapine, Ougicle ou Hulkrap. Possible avec 2 personnages + 2 compagnons.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/compagnon2.png"
      }
    ]
  },
  // Le Blop Multicolore Royal possède 100% de résistances dans tous les éléments ; pour les re
  49: {
    "summary": "Le Blop Multicolore Royal possède 100% de résistances dans tous les éléments ; pour les retirer, il faut tuer le Blop Royal correspondant (Coco=air, Griotte=feu, Indigo=eau, Reinette=terre). La stratégie consiste à rester à distance (les Blops Royaux tapent jusqu'à 6 PO) et à cibler les Blops Royaux un par un pour ouvrir les éléments du boss.",
    "recommendedLevel": "150",
    "composition": "Équipe polyvalente pouvant taper dans les 4 éléments ; classes de protection (Zobal, Féca) conseillées ; retrait PO utile pour neutraliser les Blops Royaux à distance.",
    "keyResist": [
      "Terre",
      "Feu",
      "Eau",
      "Air"
    ],
    "phases": [
      {
        "title": "Présence des 4 Blops Royaux",
        "mechanics": [
          "Le Blop Multicolore Royal a 100% de résistances dans tous les éléments au départ.",
          "Blotection : chaque Blop Royal peut donner 100% de résistances dans son élément à un allié pour 1 tour (ralentit le focus).",
          "Blovocation : chaque Blop Royal invoque un Blop de son élément (Coco=air, Griotte=feu, Indigo=eau, Reinette=terre).",
          "Blops invoqués : posent un glyphe blanc (case unique, jusqu'à 16 PO) — tout personnage terminant son tour dedans est OS ; ils infligent aussi 800 dégâts de leur élément + vol 1 PM jusqu'à 3 PO en ligne.",
          "Bloputinition Royal : inflige 1 000 dégâts (vol de vie) dans l'élément du Blop Royal jusqu'à 6 PO, 2 fois par tour par cible.",
          "Rester à distance des Blops Royaux (portée de dégâts 6 PO) ; le retrait PO peut les réduire à la mêlée.",
          "Tuer un Blop Royal supprime 100% de résistances du Blop Multicolore dans l'élément correspondant."
        ]
      },
      {
        "title": "Le Blop Multicolore Royal — sorts et menaces",
        "mechanics": [
          "Blopoutrage Royal : inflige 250 dégâts dans chaque élément (vol de vie) jusqu'à 6 PO, 1 fois par cible, 2 fois par tour ; vole aussi 2 PM pour 1 tour. Les dégâts augmentent légèrement dans les éléments où il a perdu ses résistances.",
          "Blopagation : applique état insoignable (1 tour) + poison (160 dégâts / élément pendant 2 tours) à tous personnages et invocations ; relance 3 tours.",
          "Blopacification : donne 300 puissance à tous les Blops Royaux alliés pour 2 tours, relance 3 tours.",
          "Tuer les Blops Royaux un par un permet de rendre le Multicolore attaquable élément par élément."
        ]
      },
      {
        "title": "Monstres secondaires — Blopignon et Tronkoblop",
        "mechanics": [
          "Blopignon — Bloblo : 600 dégâts air + vol 1 PM, zone croix 1 case, mêlée uniquement.",
          "Blopignon — Bloprojection : 450 dégâts terre, anneau de taille 2 autour de lui.",
          "Blopignon — Blopiction : 500 dégâts eau + retire 5 PO pour 1 tour, zone croix taille 1, jusqu'à 12 PO.",
          "Tronkoblop — Blopzone : attire les personnages (croix taille 6, 3 cases) puis inflige 850 dégâts feu en cercle taille 3 ; lançable 2 fois par tour.",
          "Tronkoblop — Blopium : donne 2 PM et 10 esquive PM à lui-même et ses alliés en cercle taille 3 pour 1 tour.",
          "Tronkoblop — Blopsoin : soigne lui-même et alliés en cercle taille 3 de 10% de leurs PV max par tour.",
          "Gloutoblop (si présent) : peut OS un personnage ou une invocation en mêlée, gagne 1 000 vitalité et 2 PM pour chaque personnage/invocation tué."
        ]
      }
    ],
    "tips": [
      "Accès : depuis la salle de sortie du donjon Clos des Blops. Se rendre au Lac de Cania en [-7,-43] puis parler à Bibiblop.",
      "Recette de la clef : 1 Morceau de clef Coco + 1 Morceau de clef Griotte + 1 Morceau de clef Indigo + 1 Morceau de clef Reinette.",
      "Prévoir une pierre d'âme de niveau 150 minimum.",
      "La capture de l'âme du boss est utile pour la quête du Dofus Ocre : L'éternelle moisson.",
      "Quêtes liées : Tour de table.",
      "Ne jamais terminer son tour dans un glyphe blanc posé par un Blop invoqué (OS immédiat).",
      "Retirer la PO aux Blops Royaux pour les empêcher de taper à 6 PO.",
      "Les sorts de débuff sont très utiles pour retirer les bonus de résistance/puissance et les malus (poison, insoignable) appliqués aux personnages.",
      "Les Blops Royaux ont 30% de faiblesse dans leur élément opposé : Coco faible au feu, Griotte faible à l'eau, Indigo faible à l'air, Reinette faible à l'air."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Touche pas à mes blops",
        "strategy": "Concentrer toutes les attaques sur le Blop Multicolore Royal jusqu'à ce qu'il meure, sans tuer les Blops Royaux avant lui. Ce succès est équivalent au challenge Blop Multicolore [Élitiste].",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Le Tofu Royal possède 30 PM et est invulnerable tant qu'il utilise des PM chaque tour
  50: {
    "summary": "Le Tofu Royal possède 30 PM et est invulnerable tant qu'il utilise des PM chaque tour. Pour lever son invulnerabilite deux tours, il faut l'empecher de bouger. Il pose cycliquement des glyphes noirs et des boosts (dont +50% dommages au tour 2) qui touchent tous les ennemis.",
    "recommendedLevel": "150",
    "composition": "Groupe capable de bloquer le Tofu Royal (invocations ou personnages pour l'encercler) et de retirer des PM aux monstres (ex. sort Retraite Anticipee de l'Enutrof).",
    "keyResist": [
      "Feu"
    ],
    "phases": [
      {
        "title": "Salle 1",
        "mechanics": [
          "Tofutoflamme : peut se rendre invisible et rendre ses allies invisibles, frappe en feu a distance et empoisonne.",
          "Vilain Petit Tofu : frappe a distance, 12 PM — tres mobile et dangereux."
        ]
      },
      {
        "title": "Salle 2",
        "mechanics": [
          "Tofuzmo : retire de la PO et frappe a distance, 12 PM."
        ]
      },
      {
        "title": "Salle 3",
        "mechanics": [
          "Pas obligatoire de combattre : traverser en evitant les trous et les monstres agressifs sur le passage."
        ]
      },
      {
        "title": "Salle 4",
        "mechanics": [
          "Tofubine : empoisonne au CaC (perte de 6 PV par PA utilise), soigne ses allies et se booste en PA."
        ]
      },
      {
        "title": "Salle 5",
        "mechanics": [
          "Tofu Dodu : booste ses allies en PA et les soigne, peut retirer de l'agilite et des PA."
        ]
      },
      {
        "title": "Boss — Tofu Royal",
        "mechanics": [
          "30 PM : extremement mobile.",
          "Invulnerable par defaut ; perd son invulnerabilite pour 2 tours si le Tofu Royal n'utilise aucun PM pendant son tour.",
          "Chaque degat en melee inflige a un ennemi lui retire 1 PM en permanent (max 5 retraits par tour).",
          "Galiformation Royal (cyclique) — Tour 2 : +50% dommages finaux 1 tour ; Tour 4 : 10% PV en Bouclier 1 tour ; Tour 6 : Intaclable 1 tour ; Tour 8 : Soin de 10% PV max. Cycle repart au tour 10.",
          "Nid Princier : pose un glyphe noir (cercle taille 4, dure 2 tours) a chaque tour — reduit les degats a distance des monstres de 20% et soigne les monstres qui y finissent leur tour de 8% PV max.",
          "Royal Becot : 1200 degats eau en zone ligne de taille 5, applique l'etat pesanteur, portee 5 PO en ligne.",
          "Envolée Lyrique : 500 dégâts air, repousse la cible d'une case, retire 2 PA, portée 12 PO.",
          "Résistances du boss : Neutre 28%, Terre 13%, Feu 8%, Eau 13%, Air 38% — frapper en Feu est le plus efficace.",
          "Les monstres ne sont pas invulnérables : les tuer en priorité avant de s'attaquer au boss.",
          "Tuer des monstres avant le tour 2 pour éviter le pic de +50% dommages.",
          "Bloquer le Tofu Royal en l'encerclant (invocations + personnages) pour l'empêcher de se libérer malgré sa capacité à pousser.",
          "Sortir le Tofu Royal de son propre glyphe pour annuler le bouclier et les soins qu'il procure.",
          "Tofuzmo et Vilain Petit Tofu sont les monstres les plus dangereux (12 PM + forts dégâts)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png",
            "caption": "Tactique succès spécial : Poursuite royale"
          }
        ]
      }
    ],
    "tips": [
      "Accès : atelier paysan en [5,6], parler à Kazy Ingalsse.",
      "Recette clef : 10x Oeuf de Tofu, 10x Dent de Tofu Mutant, 10x Patte de Tofukaz, 10x Oeil de Tofu Noir, 2x Perche, 2x Graine de Pandouille, 2x Malt, 2x Viande Saignante.",
      "Pierre d'âme de niveau 150 minimum recommandée.",
      "La capture de l'âme du boss est utile pour la quête du Dofus Ocre : L'éternelle moisson.",
      "Utiliser le sort Retraite Anticipée de l'Enutrof pour retirer 100 PM à toutes les entités en combat."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Poursuite royale",
        "strategy": "Chaque combattant ennemi doit jouer au moins un tour sans utiliser de PM avant d'être achevé. Bloquer les monstres en les entourant, en les coinçant dans un coin, ou en retirant leurs PM (ex. Retraite Anticipée de l'Enutrof).",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Le Laboratoire du Tynril confronte le groupe à 4 boss simultanés (Tynril Perfide, Déconcer
  51: {
    "summary": "Le Laboratoire du Tynril confronte le groupe à 4 boss simultanés (Tynril Perfide, Déconcerté, Consterné, Ahuri), chacun immunisé dans tous les éléments sauf un. Chaque Tynril applique -2000% de résistances dans son élément sur le personnage le plus proche, puis frappe au CàC dans cet élément — un personnage affaibli peut être OS. La clé est de retirer tous leurs PM (seulement 2 PM, esquive faible) pour les immobiliser, puis de les taper dans l'élément approprié.",
    "recommendedLevel": "150",
    "composition": "Personnages capables de retirer des PM (priorité à l'initiative), et des pousseurs (Cra, Iop…) en appoint. Les soins sont inutiles au boss.",
    "keyResist": [
      "Terre",
      "Feu",
      "Air",
      "Eau"
    ],
    "phases": [
      {
        "title": "Salle 1",
        "mechanics": [
          "Fécorce : poison retirant des PV pour chaque PA utilisé.",
          "Brouture : poison frappant en Agilité à chaque début de tour.",
          "Nerbe : attaque en zone.",
          "Chiendent : boost ses alliés en PA/PM."
        ]
      },
      {
        "title": "Salle 2",
        "mechanics": [
          "Floribonde (nouveau monstre) : applique des faiblesses donnant -50% dans un élément à chaque coup reçu."
        ]
      },
      {
        "title": "Salle 3",
        "mechanics": [
          "Bitouf Sombre (nouveau monstre) : retire des PA et de la PO, frappe au CàC."
        ]
      },
      {
        "title": "Salle 4",
        "mechanics": [
          "Abrakleur Sombre (nouveau monstre) : frappe au CàC et possède un sort pouvant faire très mal."
        ]
      },
      {
        "title": "Boss — Les 4 Tynrils",
        "mechanics": [
          "4 boss simultanés : Tynril Perfide (200% résistances partout sauf Intelligence), Tynril Déconcerté (sauf Chance), Tynril Consterné (sauf Agilité), Tynril Ahuri (sauf Force).",
          "Chaque Tynril applique -2000% de résistances dans son élément sur le personnage le plus proche — un coup dans l'élément correspondant peut OS instantanément.",
          "Les Tynrils ne frappent qu'au CàC dans leur élément : rester hors de portée est vital.",
          "Deux Tynrils au CàC l'un de l'autre peuvent se reconstituer (se soigner mutuellement).",
          "À chaque tour, un Tynril se transpose avec un autre, échangeant leurs places.",
          "Stratégie : retirer les PM des Tynrils (2 PM, esquive faible — les mettre à 0 PM idéalement). Placer les personnages importants le plus loin possible au placement initial. En cas d'impossibilité de retirer tous les PM, pousser les Tynrils (Cra, Iop…). Une fois immobilisés, frapper chaque Tynril dans son élément faible."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/9724800_orig.png",
            "caption": "Tynril Ahuri, Perfide, Déconcerté, Consterné — tableau des résistances/éléments"
          }
        ]
      }
    ],
    "tips": [
      "Recette de la clef : 2x Carpelle de Brouture, 2x Étamine de Floribonde, 2x Sépale de Nerbe, 2x Calice de Fécorce, 2x Bractée de Chiendent, 2x Lotte, 3x Chanvre, 2x Viande Macérée.",
      "Prévoir une pierre d'âme de niveau 150 minimum.",
      "L'âme du boss est utile pour la quête du Dofus Ocre : L'éternelle moisson.",
      "Accès : Jungle Obscure [-53,20], parler à Mulèze pour entrer.",
      "Quêtes liées : Tour de passe-passe, La bénédiction de Viti.",
      "Les soins sont inutiles au combat du boss.",
      "Priorité à l'initiative sur les retireurs de PM pour agir avant les Tynrils."
    ],
    "rewards": [
      "Clef de la Canopée du Kimbo.",
      "Relique du Tynril."
    ],
    "achievements": [
      {
        "name": "Prendre racine",
        "strategy": "Les ennemis ne doivent ni être déplacés (téléportation, attirance, poussée), ni subir de tentative de retrait de PM. Note : le porter/jeter du Pandawa n'est pas considéré comme un déplacement. Sans retrait de PM ni déplacement, taper le plus fort possible pour éliminer les Tynrils rapidement.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Le Wa Wabbit est un boss tankiste avec peu de dégâts mais beaucoup de PV, accompagné de Gr
  52: {
    "summary": "Le Wa Wabbit est un boss tankiste avec peu de dégâts mais beaucoup de PV, accompagné de Grand Pa Wabbit et d'un Wo Wabbit invocateur. La stratégie consiste à ignorer le boss en début de combat, à focus le Wo Wabbit puis les Grand Pa avant de s'attaquer au Wa Wabbit, en se méfiant du sort Abrutissement qui réduit les statistiques élémentaires.",
    "recommendedLevel": "60",
    "composition": "Classes mobiles conseillées (Pandawa, Iop, Ouginak). Au moins un personnage eau ou air pour exploiter les faiblesses du boss. Pour Blitzkrieg, privilégier Roublard ou Éliotrope.",
    "keyResist": [
      "Eau",
      "Air"
    ],
    "phases": [
      {
        "title": "Monstres du donjon",
        "mechanics": [
          "Black Tiwabbit : Frappe des Wabbits (55 dégâts terre, mêlée) ; Petit Wabehameha (70 dégâts feu + recul 1 case, ligne jusqu'à 8PO).",
          "Black Wabbit : Frappe des Wabbits (55 dégâts terre, mêlée) ; Wabeha (55 dégâts air + recul 1 case en ligne de taille 3, 11PO, 1 fois/tour).",
          "Grand Pa Wabbit (dangereux) : Cawotte Explosive (125 dégâts feu, cercle taille 2, 7PO) ; Cawotte Paralysante (retire 1-2PA et 2-3PM, cercle taille 2, 12PO) ; Cawotte Vitaminée (soigne 80PV alliés, cercle taille 2, 4PO) ; Frappe des Wabbits (95 dégâts terre, mêlée). A 1200PV.",
          "Tiwabbit : Envoie la patate (100 puissance + 10 dommages aux alliés, croix taille 1, 8PO, relance 2 tours) ; Frappe des Wabbits (70 dégâts terre, mêlée).",
          "Tiwabbit Kiafin : Panique (repousse ennemis croix taille 1 + 20 fuite, autour de lui, 1 fois/tour) ; Vent de panique (poison 50 dégâts neutre/tour pendant 4 tours sur tous, relance 5 tours).",
          "Wabbit : Farandole de cawottes (alliés cercle taille 2 gagnent 1PA/1PM/1PO + soin 20% PV max tour suivant, relance 2 tours) ; Frappe des Wabbits (75 dégâts terre, mêlée).",
          "Wo Wabbit : Invoque des Tiwabbits dans l'ordre Tiwabbit Kiafin → Tiwabbit → Black Tiwabbit (max 2 invocations, à partir des tours 1/2/3 respectivement) ; Ventroboom (70 dégâts neutre + recul 6 cases, mêlée, 1 fois/cible)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj61-cawotte-paralysante_orig.png",
            "caption": "Cawotte Paralysante — portée et zone"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj61-vent-panique_orig.png",
            "caption": "Vent de panique — zone d'effet"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj61-invocation-ti-kia_orig.png",
            "caption": "Invocation Tiwabbit Kiafin — portée"
          }
        ]
      },
      {
        "title": "Combat boss — Wa Wabbit",
        "mechanics": [
          "Abrutissement : Retire 101-200 (jusqu'à 400 en cc) en Force/Chance/Intelligence/Agilité pendant 3 tours à tous sur le terrain. Relance 6 tours.",
          "Awmuwe Woyale : Réduit les dommages d'armes de 200 (220cc) pendant 4 tours. Se lance sur lui-même, relance 5 tours.",
          "Cawotte Woyale : Invoque une Cawotte Woyale posant un glyphe croix taille 1 qui soigne les alliés de 60PV/tour début de tour, dure 6 tours. Jusqu'à 5PO, relance 5 tours.",
          "WaWabehameha : 70 dégâts neutre (240 en cc). Jusqu'à 11PO, 1 fois/tour. Taux de crit de base 10%.",
          "Le Wa Wabbit a une IA fuyarde : il reste au fond de la map.",
          "Résistances élevées en neutre, terre et feu ; faiblesses en eau et air.",
          "Il est accompagné d'au moins 2 Grand Pa Wabbit et 1 Wo Wabbit invocateur.",
          "Stratégie : ignorer le Wa Wabbit, focus Wo Wabbit en premier (moins de PV), puis les Grand Pa, enfin le boss seul.",
          "Éparpiller les personnages pour limiter l'impact des sorts de zone (cercle taille 2) des Grand Pa Wabbit.",
          "Débuffer le malus Abrutissement avec des sorts de désenvoûtement (Mot de Jouvence, Lait de Bambou...).",
          "Ne pas utiliser d'armes quand Awmuwe Woyale est actif (réduction 200 dégâts d'armes)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj61-abrutissement_orig.png",
            "caption": "Abrutissement — portée et zone"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj61-cawotte-woyale_orig.png",
            "caption": "Cawotte Woyale — glyphe de soin"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj61-wawabehameha_orig.png",
            "caption": "WaWabehameha — portée"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj61-30abrutissement_orig.png",
            "caption": "Exemple d'Abrutissement : malus de stats appliqué"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj61-31reduc-degats_orig.png",
            "caption": "Réduction dégâts d'armes (Awmuwe Woyale)"
          }
        ]
      }
    ],
    "tips": [
      "Entrée : Îlot de la Couronne de l'Île des Wabbits en [24,-13]. Réaliser la quête « Intrusion chez les Wabbits » pour obtenir la potion contre la myxomawose, puis prendre le bateau en [9,-2] (Capitaine Lily).",
      "Recette clef : 1x Morceau de clef du Matin Pewlant + 1x Morceau de clef du Midi Wayonnant + 1x Morceau de clef du Soiw Woulant + 5x Bois de Chêne + 5x Kobalte + 5x Menthe Sauvage + 5x Houblon.",
      "Pierre d'âme de puissance 100 minimum pour capturer le boss.",
      "L'âme du Wa Wabbit est utile pour la quête du Dofus Ocre : L'éternelle moisson.",
      "Le Wa Wabbit a une IA fuyarde : ne pas le poursuivre, se concentrer sur ses alliés d'abord.",
      "Débuffer Abrutissement dès que possible ; choisir un tour sans ce malus pour attaquer le boss."
    ],
    "rewards": [
      "Succès Duo : attitude Dévorer une Cawotte."
    ],
    "achievements": [
      {
        "name": "Hardi",
        "strategy": "Tous les alliés doivent finir leur tour adjacent à un ennemi. Se placer sur les cases les plus avancées dès le départ. Il faut au moins 5PM ou des sorts de déplacement pour atteindre un ennemi au tour 1. Classes mobiles recommandées (Pandawa, Iop, Ouginak). Regrouper les personnages autour d'un même monstre et l'éliminer en dernier. Attention au Wo Wabbit qui peut repousser de 5 cases. À 5+ personnages, il faut être adjacent à 2 monstres différents.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/hardi.png"
      },
      {
        "name": "Blitzkrieg",
        "strategy": "Chaque ennemi attaqué doit être éliminé avant son prochain tour. Difficile au niveau 60 à cause des 3000PV du Wa Wabbit (750 dégâts/perso en 4 joueurs). Conseillé d'attendre d'être bien au-dessus du niveau 60. Si tentative : maximum de personnages eau/air, Roublard (mur de bombes) et/ou Éliotrope (portails multiplicateurs). Attaquer le boss lors d'un tour sans Abrutissement actif.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/blitzkrieg.png"
      },
      {
        "name": "Mené à la cawotte (Succès Spécial)",
        "strategy": "Quand la Cawotte Woyale est présente, seul le Wa Wabbit doit recevoir des dommages. Le Wa Wabbit invoque sa Cawotte dès le tour 1, ne jamais l'éliminer. Essayer d'éliminer 1-2 monstres avant que le boss joue (focus Wo Wabbit). Sinon, ignorer les autres monstres et focus directement le Wa Wabbit. Autre tactique : bloquer le Wa Wabbit au tour 1 pour l'empêcher d'invoquer sa Cawotte (case adjacente à 1PO requise).",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres à 2 personnages en moins de 20 tours. Classes eau ou air conseillées. Ordre : Wo Wabbit → Grand Pa Wabbit (x2) → Wa Wabbit. Éviter de se regrouper à cause des zones (cercle taille 2) des Grand Pa. Récompense : attitude Dévorer une Cawotte.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Le Royalmouth est invulnérable en permanence grace à son sort Inimouth ; la seule facon de
  54: {
    "summary": "Le Royalmouth est invulnérable en permanence grace à son sort Inimouth ; la seule facon de le blesser est de le pousser pour lever son état invulnérable pendant 1 tour. Attention aux dommages de poussée en ligne qui tuent les personnages alignés avec lui et boostent ses alliés.",
    "recommendedLevel": "150",
    "composition": "Prévoir au moins un personnage capable de pousser le boss (écaflip, crâ, sacrieur...) ; les autres tapent sans déplacer le boss.",
    "keyResist": [
      "Feu"
    ],
    "phases": [
      {
        "title": "Salles de monstres",
        "mechanics": [
          "Klougmouth : 100 dégâts eau en ligne (4-6 PO), vol 2 PM pour 2 tours.",
          "Krouth : 110 dégâts terre en vol de vie au càc.",
          "Moumouth : Dommages retournés 1-50 pour 1 tour sur un allié.",
          "Boufbaffe : 270 dégâts neutres en ligne (7 PO max), vol 1 PM.",
          "Hubermouth : Boost dommages +59 (cercle 2 PO) pour 2 tours sur lui et ses alliés.",
          "Koudblouze : -50% résistances tous éléments pour 1 tour + +50 dommages par coup reçu pour 1 tour.",
          "Koudkorn : 190 dégâts eau en zone ligne perpendiculaire au càc, retire 2 PA esquivable.",
          "Moutharde : 100 dégâts air + repousse 4 cases en ligne (4-5 PO).",
          "Bizmouth : Soin allié ~250 PV en ligne (6 PO max).",
          "Moursure : 90 dégâts air au càc + vol 200 agilité pour 2 tours."
        ]
      },
      {
        "title": "Boss — Royalmouth",
        "mechanics": [
          "Inimouth : Confère l'état invulnérable infini au boss dès le début du combat (avant le premier tour) ; se désactive pour 1 tour en poussant le Royalmouth.",
          "Aléamouth : Invoque un monstre du donjon aléatoire à 3 PO maximum.",
          "Lichemouth : 600 dégâts feu en vol de vie sur les ennemis au càc.",
          "Regroupmouth : Attire les personnages en ligne à 2 cases de lui, retire 1 PM esquivable pour 1 tour.",
          "Pousser le Royalmouth : le rend vulnérable du tour de la personne qui l'a poussé jusqu'à son prochain tour, mais lui octroie +4 PM pour 1 tour (cumulable).",
          "Berserkmouth : Si un personnage est en ligne avec le Royalmouth lors d'un dommage de poussée sur lui, ce personnage est tué et le boss booste ses alliés de +100 dommages pour 1 tour. Pousser un allié contre le Royalmouth a le même effet."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/tactique_orig.png",
            "caption": "Schéma des dommages de poussée en ligne avec le Royalmouth"
          }
        ]
      }
    ],
    "tips": [
      "Entrée du donjon : Champs de glace [-84,-49].",
      "Recette de la clef : 2x Oreille de Bouftonmouth, 2x Laine de Boufmouth légendaire, 2x Corne de Boufmouth de guerre, 2x Laine de Boufmouth, 2x Viande Saignante, 2x Perche, 2x Graine de Pandouille, 2x Malt.",
      "Pierre d'âme de capture 150 minimum pour capturer le boss.",
      "Accès direct possible en achetant des skis de tremble jetables en [-82,-46] (après la quête Star Ski et Dutch)."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Parcimonie royale",
        "strategy": "Durant son tour, si un allié déplace un ennemi, il ne doit plus infliger de dommages à cet ennemi pendant le reste de son tour. Désigner un personnage pour pousser le Royalmouth et lever son invulnérabilité ; les autres le tapent sans le déplacer. Ne pas déplacer les autres ennemis sauf urgence, et si c'est le cas ne plus les frapper ce tour.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Le Mansot Royal démarre invulnérable (état Mansomure) et se booste à chaque allié tué (Man
  55: {
    "summary": "Le Mansot Royal démarre invulnérable (état Mansomure) et se booste à chaque allié tué (Mansomon). Pour le rendre vulnérable 6 tours, il faut soigner un allié en mêlée du boss, ce qui active Mansodah et retire son invulnérabilité.",
    "recommendedLevel": "150",
    "composition": "Un soigneur est indispensable pour activer le mécanisme de désactivation de l'invulnérabilité (soin en mêlée du boss).",
    "keyResist": [
      "Eau",
      "Feu"
    ],
    "phases": [
      {
        "title": "Salles (monstres normaux)",
        "mechanics": [
          "Mansolfatare : se téléporte jusqu'à 5PO et frappe environ 120 feu au càc de sa case d'arrivée.",
          "Mansoron : frappe environ 230 neutre au càc, échange de place avec la cible, inflige l'état Pesanteur 1 tour.",
          "Mansoja : boost de 57 dommages 2 tours + 50% chance soin x1 ou dégâts x2 par frappe sur lui et ses alliés au càc.",
          "Mansolex : frappe environ 130 feu au càc et vole 2PM (esquivable).",
          "Mansovegarde (Mamansot) : ressuscite le dernier monstre mort avec 10% PV en état zombi toutes les 3 tours ; si la Mamansot meurt, son ressuscité meurt aussi.",
          "Mansoviétik : boost zone cercle rayon 4 : +20% critique OU +50 dommages OU +100 soins OU +2PM pour 1 tour.",
          "Mansogrenu : frappe environ 130 eau en zone cercle rayon 2 autour de lui.",
          "Mansoldat : échange de place avec un allié jusqu'à 5PO et le booste de 54 dommages 2 tours.",
          "Mansolotage : frappe environ 170 terre vol de vie au càc et pousse de 1 case.",
          "Mansorcier : inflige malus aléatoire (200 puissance, 2PA, 2PM, 10% critique, 100 soins, 100 dommages ou 3PO) en zone cercle rayon 2.",
          "Mansote-mouton : échange de position (2-3PO), frappe environ 160 air, inflige état Affaibli 1 tour.",
          "Mansovage : frappe environ 20 terre et vole 2PO 2 tours en croix taille 1 à 2-6PO.",
          "Mansonnette : frappe environ 110 eau au càc et repousse de 2 cases.",
          "Mansotise : frappe environ 50 feu en ligne 11PO depuis le càc et inflige -40 dommages 1 tour.",
          "Mansovetage : échange de place avec un allié (max 10PO) et le soigne environ 175 PV."
        ]
      },
      {
        "title": "Combat boss — Mansot Royal",
        "mechanics": [
          "Mansomure : le boss est invulnérable dès le début du combat (état infini).",
          "Mansomon : pour chaque allié tué, le boss gagne +1000 PV, +50 dommages et +1PM (infini, non désenvoûtable). Les invocations/zombis ne comptent pas.",
          "Mansodah (sort passif de zone) : tout soin appliqué à un personnage frappe ses voisins au càc d'environ 200 eau ; si le soigneur est lui-même en mêlée, il reçoit environ 900.",
          "Mansolénoïde : frappe 100-400 feu au càc selon les PV manquants du boss (plus fort quand le boss a peu de PV).",
          "Mansoluble : frappe environ 400 eau vol de vie au càc et échange de position avec la cible (ou un allié sans frapper).",
          "Mécanisme de désactivation : soigner un allié en mêlée du Mansot Royal déclenche Mansodah sur le boss et retire son invulnérabilité pour 6 tours.",
          "Si le joueur soigné meurt pendant ces 6 tours, le boss récupère immédiatement son invulnérabilité.",
          "Soigner une invocation ne fonctionne pas pour désactiver l'invulnérabilité.",
          "Certains groupes préfèrent tuer le Mansot Royal en premier pour éviter l'accumulation des boosters Mansomon."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/tactique_1_orig.png",
            "caption": "Schéma de désactivation de l'invulnérabilité : soigner un allié en mêlée du boss active Mansodah sur les cases adjacentes et retire l'état invulnérable du boss."
          }
        ]
      },
      {
        "title": "Succès spécial — Privilège royal",
        "mechanics": [
          "Chaque début de tour, le Mansot Royal désigne un combattant (icône cœur) qui sera le seul à pouvoir recevoir des soins.",
          "Seul ce combattant désigné peut se placer en mêlée du boss pour retirer l'invulnérabilité."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png",
            "caption": "Illustration du succès spécial Privilège royal."
          }
        ]
      }
    ],
    "tips": [
      "Position du donjon : entrée dans le Lac gelé en [-64,-55].",
      "Recette de la clef : 2x Plume du Timansot, 2x Poil de barbe du Shamansot, 2x Peau de Mansobèse, 2x Duvet de Mamansot, 2x Queue du Fu Mansot, 2x Ginseng, 2x Lotte, 2x Chanvre.",
      "Pour capturer le boss, prévoir une pierre d'âme de capture niveau 150 minimum.",
      "Accès rapide possible via une paire de skis sombres jetables en [-82,-46] (nécessite avoir fait la quête Star Ski et Dutch).",
      "Dans les salles, des blocs de glace peuvent contenir un Apéwicube cliquable (rare, repop aléatoire toutes les 4h environ).",
      "Quêtes liées : Les joyeux de la couronne, Porte Mansot Royal trésor, Monarchie parlementaire, La bénédiction de Viti, Les chasseurs, Pêche en eaux gelées."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Privilège royal",
        "strategy": "Chaque début de tour, le Mansot Royal désigne un combattant (seul à pouvoir être soigné). Seul ce combattant peut se placer en mêlée du boss pour retirer l'invulnérabilité.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Ben le Ripate est le boss de l'Épave du Grolandais violent, rendu invulnérable dès le débu
  56: {
    "summary": "Ben le Ripate est le boss de l'Épave du Grolandais violent, rendu invulnérable dès le début du combat. La clé du combat consiste à manœuvrer le Hamrack (invoqué par le boss) jusqu'au corps-à-corps de Ben pour déclencher son explosion et retirer temporairement l'invulnérabilité.",
    "recommendedLevel": "150",
    "composition": "Équipe capable de pousser le boss et de booster les PM du Hamrack (sorts de boost PM utiles).",
    "keyResist": [
      "Eau",
      "Feu"
    ],
    "phases": [
      {
        "title": "Salles normales",
        "mechanics": [
          "Ben le Ripate (monstre) — Ancre d'échine : frappe ~250 Terre en ligne 3PO max + attire 1 case.",
          "Jet d'Ancre : frappe ~170 Eau + vol 2PO pour 2 tours, ligne 3–5PO.",
          "Ancre Harton : boost lui et alliés au càc de 50 dommages pour 1 tour.",
          "Barre barre : frappe ~200 Eau vol de vie en ligne 4 cases.",
          "Barre Hikade : boost alliés cercle rayon 3 de 4PO pour 3 tours, pénalise ennemis de 4PO.",
          "Barre botage : soin différé + boost 100 dommages à un allié pour 3 tours.",
          "Bertha (Pitrouille) : invoque Pitrouille — Ch'bam met état Pitrouille (explosion OS cercle rayon 4 si frappée) ; Ch'bang boost alliés cercle rayon 3 de 40 dommages pour 4 tours.",
          "Boulay : frappe ~200 Feu au càc + boost 10% critique pour 3 tours.",
          "Bouhay : soigne alliés au càc de 51–70 PV pour 1 tour.",
          "Boule : état Paytank sur lui et alliés au càc — retire 30PM et repousse 4 cases en ligne quand frappé (cumulable).",
          "Cédoine : frappe ~200 Neutre en ligne 4 cases.",
          "Kake : frappe ~200 Eau en ligne 2–10PO + repousse 4 cases.",
          "Hissage : frappe ~200 Air vol de vie en ligne 3 cases + vol 100 Agilité pour 4 tours.",
          "Homiseur : poison Feu — chaque PA utilisé fait perdre 3PV Feu pour 3 tours, ligne 4–8PO.",
          "Hure : sort sur allié — l'ennemi qui le frappe est soigné de 100% des dommages infligés pendant 2 tours.",
          "Hardé : malus 1000 soins + 20% érosion cercle rayon 4 pour 1 tour.",
          "Hérissage : échange de position 2–4PO + frappe ~220 Neutre (vitalité manquante) la cible échangée et alliés au càc d'arrivée.",
          "Roce : frappe ~500 Terre (vitalité manquante) ligne 3 cases perpendiculaire au càc + retire 63PM + état pesanteur pour 1 tour."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ancre-d-chine_orig.png",
            "caption": "Schéma sort Ancre d'échine"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/jet-d-ancre_orig.png",
            "caption": "Schéma sort Jet d'Ancre"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/barre-barre_orig.png",
            "caption": "Schéma sort Barre barre"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/barre-hikade_orig.png",
            "caption": "Schéma sort Barre Hikade"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/bouhay_orig.png",
            "caption": "Schéma sort Bouhay"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/boulay_orig.png",
            "caption": "Schéma sort Boulay"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/boule_orig.png",
            "caption": "Schéma sort Boule (état Paytank)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/c-doine_orig.png",
            "caption": "Schéma sort Cédoine"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/kake_orig.png",
            "caption": "Schéma sort Kake"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/hissage_orig.png",
            "caption": "Schéma sort Hissage"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/homiseur_orig.png",
            "caption": "Schéma sort Homiseur"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/hard_orig.png",
            "caption": "Schéma sort Hardé"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/h-rissage_orig.png",
            "caption": "Schéma sort Hérissage"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/roce_orig.png",
            "caption": "Schéma sort Roce"
          }
        ]
      },
      {
        "title": "Boss — Ben le Ripate",
        "mechanics": [
          "Flibrute (lancé avant le 1er tour) : donne état invulnérable (infini) et état lourd (infini) à Ben le Ripate dès le début du combat.",
          "Frère de la côte : invoque un monstre du donjon au hasard tous les 3 tours.",
          "Mâte l'eau : frappe ~250 Feu en croix 4PO + attire 3 cases ; dégâts augmentent quand Ben a peu de PV.",
          "Mousse Haillon : frappe ~350 Eau vol de vie en ligne 5 cases.",
          "Tore tue : invoque un Hamrack (état lourd + invulnérable + enraciné, 2PM de base) à 5–10PO ; peut réinvoquer toutes les 2 tours.",
          "Mécanique clé — Hamrack : doit s'approcher de Ben et lancer Gouverne ail (explosion au càc) pour retirer l'invulnérabilité de Ben pour 5 tours. L'explosion frappe aussi les alliés sur les cases en bâton autour de Ben pour ~350 Eau.",
          "Ben est dans l'état Lourd (impossible de le porter ou d'échanger de position avec lui).",
          "Le Hamrack est Lourd + Enraciné (impossible de le pousser, porter ou échanger) — il ne peut se déplacer qu'avec ses PM.",
          "Le Hamrack disparaît au bout de 3 tours même s'il est bien placé.",
          "Bon barde : si on tente de retirer des PM au Hamrack, il se boost de 3PM pour 1 tour."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/m-te-l-eau_orig.png",
            "caption": "Schéma sort Mâte l'eau"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/mousse-haillon_orig.png",
            "caption": "Schéma sort Mousse Haillon"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/tore-tue_orig.png",
            "caption": "Schéma sort Tore tue (invocation Hamrack)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/hamrack2_orig.png",
            "caption": "Le Hamrack invoqué par Ben le Ripate"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/gouverne-ail_orig.png",
            "caption": "Schéma Gouverne ail — zone touchée quand le Hamrack explose sur Ben (cases rouges = dégâts alliés)"
          }
        ]
      },
      {
        "title": "Stratégie : amener le Hamrack au contact de Ben",
        "mechanics": [
          "Pousser Ben vers le Hamrack (pas l'inverse, le Hamrack est enraciné et ne peut pas être poussé).",
          "Bloquer Ben avec des personnages ou invocations après l'avoir approché du Hamrack pour qu'il reste au contact.",
          "Booster les PM du Hamrack : utiliser un sort de boost PM d'une classe, ou tenter de lui retirer des PM (déclenche Bon barde : +3PM pour 1 tour).",
          "Ben joue avant le Hamrack — il risque de s'éloigner après son tour ; anticiper avec du blocage.",
          "Une fois le Hamrack adjacent à Ben, il lance Gouverne ail et retire l'invulnérabilité pour 5 tours — DPS durant cette fenêtre.",
          "Éloigner les alliés de Ben au moment de l'explosion du Hamrack pour éviter les ~350 Eau de Gouverne ail."
        ]
      }
    ],
    "tips": [
      "Accès : entrer dans le Berceau d'Alma nécessite d'avoir fait au moins une fois les donjons Serre du Royalmouth et Excavation du Mansot Royal.",
      "Position de l'entrée : Berceau d'Alma en [-60,-84].",
      "Recette de la clef : 2x Étoffe de Vigie Pirate, 2x Écaille de Harpirate, 2x Mât de Fantômat, 2x Coquille de Fantimonier, 2x Pince du Fancrôme, 3x Ginseng, 2x Raie Bleue, 2x Viande de Brousse.",
      "Pierre d'âme : prévoir une pierre d'âme de capture niveau 150 minimum pour capturer Ben le Ripate.",
      "Quêtes liées : Fais dodo t'auras du gâteau ; Porte Ben le Ripate trésor ; Piwates des sept mers et demies ; La bénédiction de Thomahon."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Hamrack'n roll",
        "strategy": "Les alliés ne doivent pas subir de dommages provenant d'un Hamrack. Rester éloigné de Ben le Ripate au moment où le Hamrack explose et lui retire son invulnérabilité, pour éviter les dégâts en zone de Gouverne ail.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // L'Obsidiantre est un boss disposant d'un etat invulnerable permanent qu'il faut desactiver
  57: {
    "summary": "L'Obsidiantre est un boss disposant d'un etat invulnerable permanent qu'il faut desactiver en poussant un allie contre lui pour infliger des degats de poussee. Il invoque des Pougnettes qui explosent au 5e tour et tuent les personnages trop eloignes. La strategie consiste a alterner les fenetres de vulnerabilite tout en gerant les Pougnettes.",
    "recommendedLevel": "130",
    "composition": "Un Pandawa est recommande pour activer la mecanique de poussee et rendre le boss vulnerable. Equipe polyvalente.",
    "keyResist": [
      "Variable (voir resistances)"
    ],
    "phases": [
      {
        "title": "Salles 1 a 4 - monstres du donjon",
        "mechanics": [
          "Atomystique - Daimocritique : ressuscite le dernier monstre mort a 10% PV tous les 2 tours ; tuer l'Atomystique supprime le monstre ressuscite.",
          "Atomystique - Neuthron : booste un allie de 200 degats pour 4 tours et place l'etat Nukléon 2 tours (6PO max).",
          "Atomystique - Prothon : frappe air 260 et place l'etat Affaibli 1 tour (corps a corps).",
          "Crapeur - Crapitulation : booste un allie +2PM +100 degats pour 3 tours et l'attire de 8 cases (ligne, 8PO max).",
          "Crapeur - Crapoute : frappe terre en vol de vie corps a corps et retire 2PA esquivable (4 en cc).",
          "Crapeur - Crapture : attire de 8 cases et frappe eau ~300 en 3 tours (ligne, 8PO max).",
          "Fumeux - Fumigene : minimise les effets aleatoires pour 2 tours (ligne, 3-8PO).",
          "Fumeux - Fumisterie : frappe neutre 250 et impose -100 fuite pour 1 tour (ligne, 4PO max).",
          "Fumeux - Fumoir : frappe terre 150 et vole 2PO pour 4 tours (ligne, 3-8PO).",
          "Despere - Demere : place un etat 2 tours sur un allie : 50% de chances de soigner la cible de vos degats ou 50% de lui infliger le double de vos degats.",
          "Despere - Depere : se teleporte jusqu'a 6PO et soigne ses allies adjacents ~200PV.",
          "Despere - Duslipe : frappe eau 250 corps a corps et inflige 20% erosion pour 1 tour.",
          "Solfatare - Soufre douleur : place l'etat Solfasoin (soin ~250PV si frappe en cercle rayon 3).",
          "Solfatare - Soufre hance : frappe air en vol de vie en zone ligne 3 cases.",
          "Solfatare - Soufre latte : frappe feu 150 et retire 3PM esquivable (ligne, 3-7PO)."
        ]
      },
      {
        "title": "Boss - Obsidiantre",
        "mechanics": [
          "Obligation : le boss part avec l'etat Invulnerable infini des le debut du combat.",
          "Rendre vulnerable : pousser un personnage ALLIE contre l'Obsidiantre (degats de poussee) -> le boss devient vulnerable 3 tours et se booste de 50 degats pour 4 tours. Pousser une invocation ou pousser le boss sur un allie ne fonctionne PAS.",
          "Objurgation : pousser un monstre sur une case adjacente au boss -> soin 2000PV + boost 50 degats (a eviter absolument).",
          "Objection : frappe feu 500 en ligne jusqu'a 10PO.",
          "Scie licate : echange de position (3PO max) et frappe terre 100-500 selon les PV manquants du boss (plus il est bas en PV, plus il frappe fort).",
          "Scie lisse : invoque une Pougnette (etat Lourd infini, impossible a porter ou echanger de place) tous les 3 tours.",
          "Pougnette - Tikette (infini) : renvoie 150 des degats infliges a la Pougnette.",
          "Pougnette - Pikette : explose au tour 5 et OS tous les personnages a plus de 7PO d'elle.",
          "Gestion Pougnette option 1 : se placer dans un rayon 1-7PO d'elle avant son explosion (la pousser si necessaire pour ajuster la zone).",
          "Gestion Pougnette option 2 : la tuer en encaissant le renvoi Tikette.",
          "Astuce anti-Pikette : un sort placant la Pougnette en etat Pacifiste le tour de son explosion annule l'OS (ex: sort Corruption)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/tactique1_orig.png",
            "caption": "Schema : allie (vert) pousse contre l'Obsidiantre (orange) pour activer la vulnerabilite"
          }
        ]
      }
    ],
    "tips": [
      "Acces : avoir complete le donjon Epave du Grolandais Violent au moins une fois. Entree : Larmes d'Ouronigride [-71,-83].",
      "Recette de la clef : 2x Residu de Solfataré, 2x Coeur de Crapeur, 2x Pierre d'Atomystique, 2x Belladone, 2x Mais, 2x Viande Fraiche, 2x Bar Rikain.",
      "Pierre d'ame de puissance 190 minimum pour capturer le boss.",
      "Quetes liees : Lavomatique, Porte Obsidiantre tresor, Pour qui sonne le glagla, La benediction de Thomahon, Chaud du S.L.I.P., Fleuries mais rougissent, Champ Pomy, A la recherche de Dan Lavy (salle 4, sans vaincre l'Obsidiantre).",
      "Ne jamais pousser de monstres sur les cases adjacentes au boss (declenche Objurgation - soin 2000PV + boost).",
      "Succes special 'A son hypogee' : les ennemis ne doivent etre ni attires ni pousses. Utiliser un Pandawa pour la mecanique (pousser un allie contre le boss) sans deplacer les ennemis."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "A son hypogee",
        "strategy": "Les ennemis ne doivent etre ni attires ni pousses durant tout le combat. Utiliser un Pandawa pour rendre le boss vulnerable en portant et posant un allie contre lui, sans jamais deplacer d'ennemis.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Le boss Tengu Givrefoux commence le combat dans un etat Invulnerable
  58: {
    "summary": "Le boss Tengu Givrefoux commence le combat dans un etat Invulnerable. Pour le rendre vulnerable, il faut dans le meme tour placer le Yomi Givrefoux en ligne avec lui et le frapper a l'arme (etat Fulguration) ET pousser/attirer le Yokai Givrefoux dans sa diagonale (etat Floutage). Une variante du combat propose d'affronter Tengu et Fuji Givrefoux ensemble sur une map plus petite et plus dangereuse.",
    "recommendedLevel": "190",
    "composition": "Au moins un personnage avec une arme a distance (arc, baguette) pour frapper le Yomi sans approcher le Maho Givrefoux. Une classe capable de pousser/attirer pour manipuler le Yokai. En variante Fuji, une classe pouvant retirer des PM et repousser est conseillée.",
    "keyResist": [
      "Variable (voir resistances)"
    ],
    "phases": [
      {
        "title": "Salles 1 a 4 — Monstres normaux",
        "mechanics": [
          "4 salles a traverser avant le boss, peuplees des differents Givrefoux (Kami, Maho, Soryo, Yokai, Yomi).",
          "Kami Givrefoux — Foulette : boost aleatoire de 500 stats (allies et ennemis) pendant 2 tours ; Foux de la fortune : gagne 25 degats par ligne subie mais subit aussi 20% de ses PV actuels en degats neutre par ligne subie ; Foux ou rien : vol de vie 200 degats tous elements en diagonale jusqu'a 7PO (2x/tour).",
          "Maho Givrefoux — Fourapin : 800 degats terre vol de vie zone baton a 1PO (tape aussi les allies) ; Fournee : +100 tacle/fuite a lui et ses allies au contact pendant 3 tours ; Fourrage : attire de 3 cases en ligne 2-4PO (2x/tour).",
          "Soryo Givrefoux — Fouraille : 300 degats air + retire 20 Esquive PA pendant 3 tours, en ligne 3-5PO ; Fourbissage : 450 degats neutre + retire 4PA pour 1 tour en melee.",
          "Yokai Givrefoux — passif Lourd (ne peut pas etre porte par Pandawa) ; quand pousse/attire : prend de la taille, +1PM, +10 degats, ses allies en diagonale +10 degats, ennemis en diagonale entrent dans Affaibli (empeche l'utilisation d'arme) et tous en diagonale entrent dans Floutage pendant 2 tours ; Fourre-tout : 15% PV manquants en degats eau zone ligne a 1PO ; Foutaise : teleportation + 300 degats feu zone croix.",
          "Yomi Givrefoux — passif Lourd ; quand frappe par une arme : change d'apparence, +6PO, +50 soins pour 1 tour, et applique 20% d'erosion a tous les ennemis en ligne pendant 1 tour, lui et ses allies alignes gagnent l'etat Fulguration pour 2 tours ; Fouguefoux : 450 degats neutre + retire 10PM en melee ; Fouille : soin ~400PV a un allie en melee.",
          "Restez a distance du Yomi (retire PM) et du Maho (fort en melee). Evitez la diagonale de la Kami (elle ne tape qu'en diagonale)."
        ]
      },
      {
        "title": "Choix avant le boss : Tengu seul ou Tengu + Fuji",
        "mechanics": [
          "Apres la salle 4, une salle de transition permet de choisir entre affronter Tengu seul (grande map) ou Tengu et Fuji ensemble (map plus petite). Ce choix est irreversible.",
          "Tengu seul = combat plus simple grace a la grande map.",
          "Tengu + Fuji = combat plus difficile, Fuji remplace la Kami Givrefoux."
        ]
      },
      {
        "title": "Boss — Tengu Givrefoux (solo)",
        "mechanics": [
          "Tengu commence en etat Invulnerable et Lourd (ne peut pas etre porte).",
          "Pour rendre le Tengu vulnerable, il faut DANS LE MEME TOUR : (1) Placer le Yomi en ligne avec le Tengu et le frapper avec une arme (declenche Fulguration sur Tengu) ; (2) Pousser ou attirer le Yokai dans la diagonale du Tengu (declenche Floutage sur Tengu).",
          "Au debut de son prochain tour, si le Tengu a les etats Fulguration ET Floutage, il lance Toison givree : perd l'invulnerabilite pendant 4 tours.",
          "Si Tengu a uniquement Fulguration : il peut utiliser Mornifle qui OS en melee (relance 3 tours) — restez a distance.",
          "Si Tengu a uniquement Floutage : il peut utiliser Torgnole givree qui applique 30% d'erosion a tous vos personnages (debuffable).",
          "Calin frigorifique : attire de 3 cases en ligne jusqu'a 8PO sans ligne de vue — evitez d'etre en ligne avec lui.",
          "Malice glacee : 10% erosion + 800 degats eau vol de vie en melee — uniquement dans l'etat Invulnerable.",
          "Farce : degats air (% PV manquants) + 600 degats terre en melee — uniquement dans l'etat Vulnerable.",
          "Foux d'amour : invoque un Yomi ou Yokai Givrefoux (au tour 2 puis tous les 3 tours). Maximum 1 Yomi + 1 Yokai (2 invocations max).",
          "Strategie : eliminez les autres monstres du boss en laissant Yokai et Yomi en vie. Declenchez les deux etats dans le meme tour. Si le Tengu n'est pas tue en 4 tours, repetez l'operation.",
          "Si Tengu invoque, vous pouvez eliminer le monstre en double (il ne peut avoir qu'un Yomi et un Yokai).",
          "Le Yomi inflige 20% d'erosion a vos personnages en ligne quand il est frappe a l'arme. L'etat Affaibli (declenche par le deplacement du Yokai) empeche d'utiliser une arme : le personnage qui tape le Yomi ne doit pas etre dans la diagonale du Yokai au moment du push/pull."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark112-tengu1_orig.png",
            "caption": "Schema — placement Yomi en ligne + Yokai en diagonale pour retirer l'invulnerabilite du Tengu"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark112tengu20_orig.png",
            "caption": "Calin frigorifique — portee de l'attirance"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark112tengu19_orig.png",
            "caption": "Foux d'amour — zone d'invocation"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark112tengu10_orig.png",
            "caption": "Torgnole givree — zone d'effet"
          }
        ]
      },
      {
        "title": "Boss — Tengu + Fuji Givrefoux (variante)",
        "mechanics": [
          "Fuji Givrefoux n'a pas d'etat invulnerable.",
          "Instinct maternel (passif) : quand un monstre est elimine, tous les monstres gagnent 1PM pour 1 tour ET Fuji et Tengu gagnent 1 000 degats pour 1 tour (cumulable, non debuffable). Ne jamais laisser Fuji ou Tengu a portee lors d'une elimination.",
          "Progeniutre : OS la cible en melee et la remplace par un monstre aleatoire du donjon (1x/tour). Restez a distance de Fuji.",
          "Foufoux : 20% erosion + 800 degats eau vol de vie en diagonale 3-4PO (2x/tour).",
          "Lait Maternel : soigne elle et ses allies en zone cercle de ~900PV + 200 degats pendant 2 tours (toutes les 3 tours).",
          "Fuji ne tape qu'en diagonale — restez en ligne avec elle pour l'empecher de vous toucher.",
          "Tengu ne tape qu'en melee mais peut attirer de 3 cases en ligne — utilisez les obstacles.",
          "Il est conseille de focus Fuji d'abord (pas d'invulnerabilite). Si on peut retirer l'invulnerabilite du Tengu des le tour 2, l'eliminer en premier est viable.",
          "Ne laissez pas d'invocations proches de Fuji : elle peut les OS et les remplacer."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark112tengu22_orig.png",
            "caption": "Foufoux — zone d'effet diagonale"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark112tengu21_orig.png",
            "caption": "Lait Maternel — zone de soin/buff"
          }
        ]
      }
    ],
    "tips": [
      "Position du donjon : entree dans la Crevasse Perge en [-80,-75].",
      "Pierre d'ame de puissance 190 minimum pour capturer le Tengu Givrefoux.",
      "Recette de la clef : 2x Oreille de Soryo Givrefoux, 2x Laine de Maho Givrefoux, 2x Laine de Yokai Givrefoux, 2x Malleole de Yomi Givrefoux, 3x Belladone, 3x Mais, 2x Morue, 2x Viande Maigre.",
      "Quetes liees : C'est frais, mais c'est pas grave et Guerriers foux.",
      "Equipez au moins un personnage d'une arme a distance (arc ou baguette) pour frapper le Yomi sans approcher le Maho.",
      "Pour sortir du donjon : laissez-vous tomber dans l'un des trous puis suivez le chemin."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Autonomie givree",
        "strategy": "Tous les allies doivent terminer leur tour a plus de 4PO de tous les autres allies. Contrainte de placement uniquement, pas de difficulte particuliere. Realisable en meme temps que le succes Fuji mais la map plus petite complique le placement.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Le Korriandre est un boss de Frigost sans etat invulnerable, mais il place des glyphes mor
  59: {
    "summary": "Le Korriandre est un boss de Frigost sans etat invulnerable, mais il place des glyphes mortels sur les cases de debut de tour des joueurs. La strategie principale consiste a tuer le Korriandre en priorite au premier tour (ou le plus vite possible) avant que la map ne se remplisse de glyphes letaux.",
    "recommendedLevel": "190",
    "composition": "Equipe capable de burst important pour tuer le boss en 1 tour idealement. Un Osamodas peut etre utile pour effacer des glyphes via la mort de ses invocations.",
    "keyResist": [
      "Variable (voir resistances)"
    ],
    "phases": [
      {
        "title": "Salle 1 - Abrazif & Merulette",
        "mechanics": [
          "Abrazif : se booste de 100 dommages si frappe au CaC ; invoque une motte inoffensive sauf si frappee (frappe alors toute la team en zone) ; frappe a distance en zone et retire des PA.",
          "Merulette : frapper avec un sort provoque un raulebaque (toute la team retourne a sa position initiale) ; frapper au CaC inflige -100 aux soins ; sinon frappe en ligne."
        ]
      },
      {
        "title": "Salle 2 - Fongeur & Dramanite",
        "mechanics": [
          "Fongeur : frappe toute la team d'un coup ; tres peu de degats a pleine vitalite, mais tres fort a faible vitalite.",
          "Dramanite : se booste en dommages et se reconstitue ; retire des PM au CaC ; empoisonne (130 degats par PA utilise) - ne pas frapper tant qu'empoisonne."
        ]
      },
      {
        "title": "Salle 3 - Fistulor",
        "mechanics": [
          "Fistulor : frappe au CaC et en diagonale en volant des PV.",
          "Fistulor : peut faire un transfert de vie sur ses allies (soins a ses allies, degats sur lui-meme)."
        ]
      },
      {
        "title": "Boss - Korriandre",
        "mechanics": [
          "Glyphes mortels : a chaque debut de tour d'un joueur, un glyphe se place sur sa case de depart ; un joueur commencant son tour sur un glyphe est tue en un coup (OS).",
          "Les glyphes persistent jusqu'a la fin du combat. Si un allie meurt, toutes ses glyphes s'effacent (l'Osamodas peut exploiter cela).",
          "Korriandre attire les joueurs et frappe environ 700-800 degats ; moins il a de PV, plus il frappe fort.",
          "Invoque une Sporakne : peut pousser d'une case et repousse tout ce qui se trouve dans ses quatre lignes si on tente de la pousser.",
          "Merulettes presentes dans la salle boss : NE PAS les frapper avec un sort (raulebaque = toute la team sur une case glyphee = mort assuree).",
          "Strategie : tuer le Korriandre en priorite, idealement en 1 tour. Se booster au premier tour, frapper le boss, garder les allies du boss a distance. Traiter les monstres restants en gardant les Fongeurs pour la fin.",
          "Une fois le Korriandre mort, les glyphes restent en place - rester vigilant lors de l'elimination des monstres restants."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/1873014_orig.png",
            "caption": "Carte de la salle boss avec glyphes"
          }
        ]
      }
    ],
    "tips": [
      "Recette de la clef : 2x Lamelle de Dramanite, 2x Volve de Fongeur, 2x Volve de Fistulor, 2x Ecorce d'Abrazif, 2x Mandragore, 2x Millet, 2x Tanche, 2x Viande Gatee.",
      "Pour capturer le boss, prevoir une pierre d'ame de puissance 190 minimum.",
      "Acces : La foret petrifiee en [-73,-69], parler a Sylvie Barbe pour entrer et sortir.",
      "Quetes liees : Sans ma barbe, quelle barbe / Donjon sans dragon / La benediction de Foluk / Porte, Korriandre, tresor / Marque d'une pierre blanche / Gele a pierre fendre / Les derniers d'entre nous."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Pas dans mes pattes",
        "strategy": "Tous les combattants allies doivent terminer leur tour a plus de 3 PO d'un allie. Contrainte de placement uniquement, sans difficulte particuliere : surveiller sa position en fin de chaque tour.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Le donjon des Cavernes du Kolosso se deroule en 5 etapes : 4 salles de monstres (Blerices,
  60: {
    "summary": "Le donjon des Cavernes du Kolosso se deroule en 5 etapes : 4 salles de monstres (Blerices, Bleroms, Blerauves, Fleuros) a completer dans n'importe quel ordre pour collecter les 4 reliques, puis affrontement du boss Kolosso. Le Kolosso est invulnerable sauf quand une invocation alliee le frappe au CaC, et les soins classiques sont bloques pendant tout le combat boss.",
    "recommendedLevel": "190",
    "composition": "Sacrieur (pour cooperation), invocateurs (Osamodas), classes capables de retirer des PM ; 8 joueurs maximum pour les 4 salles.",
    "keyResist": [
      "Terre",
      "Feu"
    ],
    "phases": [
      {
        "title": "Salle 1 — Blerices (et monstres varies)",
        "mechanics": [
          "Blerice — Frostiz : si vous le frappez au CaC sous cet etat, retire 100 PM a toute l'equipe pour 1 tour.",
          "Blerice : peut attirer et pousser, frappe en feu et eau.",
          "Blerom — Sacrifice : sacrifie ses allies ; sous l'etat Toxin, s'il vous tacle lors d'une fuite, il se reconstitue. Frappe en agilite.",
          "Wolvero : attire les ennemis ; sort de soin sur lui-meme (recupere 150 PV par coup recu). Frappe au CaC en feu.",
          "Croleur — Fugue : devient invisible si frappe sous cet etat et peut reculer d'une case. Attaque a distance en retirant de la PO, et au CaC en feu avec detour."
        ]
      },
      {
        "title": "Salle 2 — Bleroms",
        "mechanics": [
          "Blerom sacrifie ses allies.",
          "Sous l'etat Toxin, si vous fuyez son CaC et qu'il vous tacle, il se reconstitue.",
          "Frappe en agilite."
        ]
      },
      {
        "title": "Salle 3 — Blerauves",
        "mechanics": [
          "Blerauve : peut bondir.",
          "Etat de regeneration : gagne +500 PV pour 4 tours par coup recu lorsque l'etat est actif.",
          "Frappe en neutre au CaC en retirant des PM."
        ]
      },
      {
        "title": "Salle 4 — Fleuros",
        "mechanics": [
          "Fleuro : frappe au CaC en terre en appliquant un malus de dommages.",
          "Sous l'etat Brulie : vole des PV en feu quand vous le frappez au CaC.",
          "Peut empoisonner (dommages en feu sur la duree)."
        ]
      },
      {
        "title": "Boss — Kolosso + Professeur Xa",
        "mechanics": [
          "Des le debut du combat, tous vos allies recoivent l'etat -10 000 soins non desenvoutable : aucun soin classique possible pendant tout le combat.",
          "Kolosso est dans l'etat Lourd (ne peut pas etre porte/jete).",
          "Kolosso — Razepoutine : se lance uniquement s'il a un allie ou un ennemi a son CaC (invocations comprises). Inflige de tres gros dommages terre en zone triangle dans la direction de la cible ; les degats augmentent quand ses PV sont bas. Il peut attirer ses ennemis pour declencher le sort.",
          "Kolosso est invulnerable sauf pendant 1 tour lorsqu'une invocation alliee le frappe au CaC.",
          "Kolosso peut soigner ses allies.",
          "Professeur Xa : frappe en feu en zone de 3 cases devant son CaC en retirant des PA.",
          "Professeur Xa peut ressusciter les monstres morts.",
          "Professeur Xa — Kirbili (tous les 2 tours) : tous ses allies gagnent +100 dommages par coup recu ET soignent vos allies de 100 PV dans une zone cercle 4 PO autour du monstre frappe. C'est le seul moyen de se soigner pendant ce combat.",
          "Strategie recommandee : tour 1 boost + placement du sacrieur en fond de map + retrait PM ; tour 2 cooperation du Kolosso a la place du sacrieur. Garder le Kolosso a 0 PM ou tres peu de PM chaque tour pour qu'il ne frappe pas. Eliminer les monstres en profitant des soins du Xa, puis tuer le Xa en dernier. Invoquer pour rendre le Kolosso vulnerable et le tuer."
        ]
      }
    ],
    "tips": [
      "Recette de la clef : 2x Oreille de Fleuro, 2x Queue de Wolvero, 2x Griffe de Blerauve, 2x Oreille de Croleur, 2x Molaire de Blerice, 3x Mandragore, 2x Espadon, 2x Viande Noire.",
      "Acces : Les Crocs de Verre en [-61,-69], parler au Professeur Xa pour entrer.",
      "Les 4 salles de reliques peuvent etre faites dans n'importe quel ordre ; une fois les 4 reliques reunies, reparler au Professeur Xa pour acceder au boss.",
      "Pour capturer le boss, prevoir une pierre d'ame de puissance 190 minimum.",
      "Le Kolosso ne devient vulnerable que pendant 1 tour, uniquement quand une invocation alliee le frappe. Gerer les invocations prudemment pour eviter que le Kolosso declenche Razepoutine.",
      "Le vol de vie n'est pas considere comme du soin (utile pour le succes special)."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Allies passes au futur",
        "strategy": "Les allies (et invocations) ne doivent recevoir aucun soin pendant tout le combat. Kirbili est lance par le Professeur Xa au tour 1 puis tous les 2 tours : quand un ennemi subit des dommages directs, il soigne les personnages dans un cercle de 5 PO autour de lui. Il ne doit donc pas y avoir d'allies a 5 PO d'un monstre qui subit des degats pendant l'effet du sort. Tuer le Professeur Xa en priorite (avant de s'attaquer au Kolosso) est conseille. Le vol de vie n'est pas considere comme du soin.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // L'Antichambre des Gloursons se termine contre le Glourséleste, un boss invulnérable qui ne
  61: {
    "summary": "L'Antichambre des Gloursons se termine contre le Glourséleste, un boss invulnérable qui ne peut être endommagé qu'au CàC (état invulnérable levé seulement le tour du personnage qui frappe). Moins il a de PV, plus il frappe fort (10% de ses PV manquants). La stratégie consiste à gérer les mobs prioritaires (Glourmand en premier) avant de se concentrer sur le boss.",
    "recommendedLevel": "190+",
    "composition": "Pandawa utile (Pandawasta pour distraire les monstres), Zobal (Mascarade), soigneur ; armures recommandées pour toute l'équipe.",
    "keyResist": [
      "Terre",
      "Agilité"
    ],
    "phases": [
      {
        "title": "Salle 1",
        "mechanics": [
          "Couloir sans combat, avancer vers la salle 2."
        ]
      },
      {
        "title": "Salle 2",
        "mechanics": [
          "Glourmand : se boost de 1000 dommages de poussées à chaque coup reçu — désenvoutez ou évitez de le frapper ; frappe feu au CàC avec poussée de 2 cases (OS si obstacle).",
          "Boulglours : boost ses alliés en PM si retrait PM ; frappe à distance et au CàC.",
          "Apériglours : sort qui fait que toute attaque au CàC le soigne lui et ses alliés adjacents ; soigne ses alliés au CàC ; attaque feu au CàC avec -500 soins.",
          "Gloursaya : fuyard, vole des PM à distance, gagne +100 dommages par coup reçu, vole des PV au CàC (très dangereux si boosté).",
          "Frapper en priorité dans l'élément agilité en évitant le CàC sur l'Apériglours."
        ]
      },
      {
        "title": "Salle 3",
        "mechanics": [
          "Beaucoup d'Apériglours : frapper dans l'élément agilité en priorité.",
          "Mêmes mécaniques que la salle 2."
        ]
      },
      {
        "title": "Salle 4",
        "mechanics": [
          "Nouveau monstre : Glouragan — attire tout ce qui est en ligne avec lui quand il reçoit un coup ; frappe en zone bâton ennemis ET alliés.",
          "Ne pas frapper le Glouragan s'il est aligné avec un allié ou le Glourséleste (plus tard)."
        ]
      },
      {
        "title": "Salle 5",
        "mechanics": [
          "Méliglours : peut sacrifier ses alliés (transfère les dommages reçus), boost ses alliés de 1000 PV, frappe en volant des PV (élément chance).",
          "Priorité élément terre : se booster à distance puis frapper dans le tas ; les Méliglours sacrifieront les Glourmands et mourront en premier.",
          "Désenvoutez les Glourmands encore boostés restants avant de les taper."
        ]
      },
      {
        "title": "Boss — Glourséleste",
        "mechanics": [
          "État invulnérable permanent : seule une attaque au CàC désactive l'invulnérabilité, uniquement pour le tour du personnage qui frappe.",
          "Le premier coup au CàC n'inflige aucun dégât : utiliser un petit sort ou une arme multi-lignes.",
          "Attaque au CàC : repousse de 4 cases tous les personnages/mobs en ligne à 4 PO — OS si obstacle sur le chemin.",
          "Moins il a de PV, plus il frappe fort : 10% de ses PV manquants en dommages.",
          "Vol de PV : environ 700-800 deux fois par tour, une fois par cible.",
          "Taclours : si une esquive échoue contre un mob au CàC du Glourséleste, mort du personnage et alliés proches.",
          "Ne jamais retirer de PM, de PO ni déplacer le Glourséleste — sinon il ressuscite des mobs tués.",
          "Ne pas frapper le Glouragan s'il est en ligne avec le Glourséleste (attrait = résurrection).",
          "Stratégie : tuer Glourmand et Méliglours en premier, puis Glouragan, Boulglours, Apériglours ; laisser Gloursaya pour la fin (IA fuyarde, pratique pour la capture d'âme).",
          "Lancer Pandawasta au fond de la map au début pour distraire les mobs pendant les boost.",
          "Mascarade (Zobal) ou corruption du Glourséleste pour 2 tours tranquilles ; viser à le tuer en 1-2 tours maximum.",
          "Pierre d'âme de puissance 190 minimum pour la capture."
        ]
      }
    ],
    "tips": [
      "Recette de la clef : 2x Oreille d'Apériglours, 2x Poils de Boulglours, 2x Cuir de Glouragan, 2x Antenne de Gloursaya, 2x Queue de Méliglours, 3x Mandragore, 2x Espadon, 2x Viande Noire.",
      "Accès : Mont Torrideau en [-63,-75], parler à Willy (voir le chemin Glourséleste).",
      "Pierre d'âme de puissance 190 minimum pour capturer le boss.",
      "Ne jamais retirer PM/PO ni déplacer le Glourséleste sous peine de résurrections.",
      "Quêtes liées : Le pic qui glace, Glourson et lumière, Porte / Glourséleste / trésor, Mission Solution, Un remède draconien."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Complaisance gloursonne",
        "strategy": "Les ennemis ne doivent subir ni retrait PM, ni retrait PA, ni retrait PO, ni tentative de déplacement par les alliés. Faire attention aux sorts ayant des effets secondaires de retrait PO ou PA. Éliminer le Glourséleste en dernier : les retraits PM/PO et déplacements l'entrent en état Résuglours (résurrections), donc gérer cela naturellement s'applique déjà. Attention uniquement à ne pas lui retirer de PA.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Grolloum est le boss du Donjon de la Mine de Sakai, invulnerable en permanence et capable 
  62: {
    "summary": "Grolloum est le boss du Donjon de la Mine de Sakai, invulnerable en permanence et capable de ressusciter les monstres elimines en etat Zombi. Pour le rendre vulnerable, il faut amener un monstre Zombi en melee avec lui sous l'effet Gelee blanche puis eliminer ce monstre, ouvrant une fenetre d'attaque d'un tour. Le boss est faible a l'element eau.",
    "recommendedLevel": "100 — 130",
    "composition": "Prevoir des personnages pouvant frapper dans l'element eau pour eliminer Grolloum rapidement lors de sa fenetre de vulnerabilite. Un Pandawa avec l'initiative est recommande pour l'expedition Bravoure.",
    "keyResist": [
      "Eau"
    ],
    "phases": [
      {
        "title": "Salles de monstres",
        "mechanics": [
          "Courtilieur : frappe terre en melee + poison terre, sort eau vol de vie + etat Affaibli en melee, sort air en ligne (3-5 PO) en fonction de ses PV manquants + attire 4 cases. Eviter sa melee et ne pas rester en ligne.",
          "Gobosteur : frappe air + retire PA en melee, se boost lui et allies en dommages en melee, sort terre en ligne (4-6 PO) retire PM. Peu dangereux, eviter la melee.",
          "Maraudeur : frappe eau en vol de vie en zone ligne courte + repousse 2 cases, frappe eau vol de vie en ligne moyenne distance + vole PM, effet esquive en melee + boost dommages par coup recu. Jouer a distance.",
          "Ouilleur : frappe terre vol de vie en melee + erosion, soigne allies a distance, boost aleatoire (PM/PA/dommages/CC/soin) par ligne de dommages recue. Eviter la melee, tuer rapidement.",
          "Perku : frappe eau en ligne (2-10 PO) + poison eau declenche aux soins, boost allies en dommages + jets max (rayon 4), invoque Gobus tous les 3 tours en ligne. Attention aux invocations de Gobus multiples.",
          "Gobus (invoque par Perku) : 0 PM (indeplacable sauf boost PM exterieur), boost allies en melee de 200 dommages. Au 2e tour, OS tous les ennemis en ligne avec lui puis meurt. Ne jamais rester en ligne avec un Gobus.",
          "Sapeur : frappe feu en melee + se boost dommages, echange de position (exactement 5 PO) + frappe eau au contact de sa case d'arrivee, effet Goblosion (boost dommages + frappe terre en melee par ligne de dommages recue). Eviter la melee, ne pas frapper quand il a Goblosion si des allies sont en melee."
        ]
      },
      {
        "title": "Boss : Grolloum — Mecanique d'invulnerabilite",
        "mechanics": [
          "Dur comme la roche : Grolloum est Invulnerable en permanence des le debut du combat. Toute tentative de retrait PM lui donne +8000 resistances dans chaque element pour 1 tour.",
          "Cycle : ressuscite le dernier monstre mort en etat Zombi avec une partie de ses PV (tous les 2 tours, 5-10 PO sans ligne de vue). Ressuscite de preference en melee avec un personnage.",
          "Gelee blanche : boost un allie Zombi de 200 dommages + lui applique l'effet Instant pour 1 tour. Quand le monstre Zombi avec Instant meurt en melee de Grolloum, ce dernier devient Vulnerable pour 1 tour.",
          "Banquise (Grolloum Invulnerable) : frappe eau 660 vol de vie en zone ligne taille 5 + retire 4 PO pour 1 tour, Grolloum se soigne de 1500 PV par personnage dans la zone. Se lance a 1 PO.",
          "Frimas (Grolloum Vulnerable) : echange de position avec allie ou ennemi, frappe ennemi feu 300 + ligne dependant de ses PV manquants (10% PV manquants). En ligne jusqu'a 4 PO."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj39-50_orig.png",
            "caption": "Schema — Grolloum invulnerable, monstre a eliminer pour le ressusciter en Zombi"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj39-51_orig.png",
            "caption": "Schema — Grolloum lance Gelee blanche sur le monstre Zombi"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj39-52_orig.png",
            "caption": "Schema — Eliminer le monstre Zombi en melee avec Grolloum pour le rendre vulnerable"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj39-grolloum-vulne_orig.jpg",
            "caption": "Grolloum devient vulnerable apres la mort du monstre Zombi en melee"
          }
        ]
      },
      {
        "title": "Strategie globale du boss",
        "mechanics": [
          "Eliminer tous les monstres en s'arrangeant pour que le Gobus soit le dernier tue avant le tour de Grolloum (il ressuscite le dernier monstre mort).",
          "Rapprocher le Gobus Zombi en melee de Grolloum et reduire ses PV au maximum.",
          "Attendre que Grolloum cible le Gobus Zombi avec Gelee blanche (effet Instant).",
          "Un personnage elimine le Gobus en melee de Grolloum (avec le moins de PA possible) -> Grolloum devient Vulnerable jusqu'au debut du prochain tour de ce personnage.",
          "Eliminer Grolloum en un seul tour avant qu'il ne rejoue. Idealement, le personnage qui rend Grolloum vulnerable joue juste apres lui.",
          "Si impossible en un tour : technique erosion — rendre Grolloum vulnerable avec retrait PM (8000 resistances) puis eroder ses PV max sans lui retirer de PV, repeter pour baisser sa vitalite maximale progressivement.",
          "Ne jamais tenter de retrait PM le tour precedant le delock de vulnerabilite (car 8000 resistances pendant 1 tour bloquerait les degats).",
          "Ne jamais rester en ligne avec le Gobus Zombi (il peut OS en ligne a son second tour)."
        ]
      }
    ],
    "tips": [
      "Entree du donjon : Foret enneigee de l'ile de Sakai en [-52,-45].",
      "Acces a Sakai : bateau depuis Madrestam en [12,-3] ou transporteur frigostien.",
      "Recette de la clef : 2x Oreille de Gobosteur, 2x Perone du Maraudeur, 2x Peau d'Ouilleur, 2x Oeil de Sapeur, 3x Mandragore, 3x Millet, 2x Espadon, 2x Viande Noire.",
      "Pierre d'ame de puissance 190 minimum pour capturer Grolloum.",
      "Grolloum est faible en element eau — prevoir des personnages capables de taper eau pour l'eliminer rapidement lors de sa fenetre de vulnerabilite.",
      "Ne pas tenter de retrait PM sur Grolloum le tour avant de le rendre vulnerable.",
      "Arranger l'ordre des kills pour que le Gobus soit le dernier monstre mort avant le tour de Grolloum."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "On voulait l'autre",
        "strategy": "Les ennemis dans l'etat Zombi ne doivent pas etre deplaces. Pour retirer l'invulnerabilite de Grolloum, deplacer Grolloum au contact du monstre ressuscite (et non l'inverse). Grolloum ressuscite les monstres avec 10% de leurs PV, placer la resurrection au contact de Grolloum sous l'effet Gelee blanche.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Halouine est le boss du Potager d'Halouine, un donjon evenementiel ouvert trois semaines p
  66: {
    "summary": "Halouine est le boss du Potager d'Halouine, un donjon evenementiel ouvert trois semaines par an. Sa mecanique principale est le sort Moissonnage (uniquement en melee) qui lui permet de booster sa vitalite, cumulable 5 fois. La strategie consiste a le garder a distance, lui retirer PO et PM, et debuffer son bonus de vitalite pour le tuer.",
    "recommendedLevel": "Variable (donjon evenementiel)",
    "composition": "Classes avec sorts de debuff (Sadida, Pandawa, Eniripsa) tres utiles pour retirer le bonus de vitalite d'Halouine. Un soigneur est conseille pour le succes Hardi.",
    "keyResist": [
      "Variable (voir resistances)"
    ],
    "phases": [
      {
        "title": "Salles 1 a 4 — monstres classiques",
        "mechanics": [
          "4 salles a traverser avant d'affronter le boss Halouine.",
          "Cauchemarakne : Mort Sure (degats feu en melee, -10% resistance, etat Affaibli 2 tours — bloque l'arme corps a corps). Toile Tisse-Trouille : glyphe damier taille 4 duree 2 tours, etat Emberlificote + -4PM aux personnages qui terminent leur tour dedans.",
          "Champetrouille : Cueillette (attire 4 cases, -10 fuite). Dinguerie (repousse puis s'attire, necessite etat Dingue). Frappe a Dingues (degats eau en melee, en critique applique etat Dingue sur lui-meme).",
          "Chauffe-Soutrille : Faux-Fuyant (esquive 50% attaques melee, donne tacle). Pus des Pieds (degats air en melee + poison proportionnel aux PM utilises).",
          "Devhorreur (salle 4 uniquement) : Malheur (zone croix, si soigne sous cet effet : -50% vitalite). Terreur (degats neutre, etat Torpeur -20 fuite cumulable). Torpeur (-4PM inesquivable, donne PM si allies tapent la cible).",
          "Lanverne : Subterfuge (invisibilite + poison 25% PV manquants en degats terre aux adjacents). Vermifuge (degats terre ligne taille 3, +100 puissance monstres allies, -100 puissance joueurs).",
          "NOTE : Le Devhorreur ne se trouve qu'a la salle 4. Les Gumizes (drop Devhorreur et Halouine) donnent +100 puissance / -200 vitalite.",
          "Evitez de terminer votre tour dans le glyphe du Cauchemarakne (retire jusqu'a 4PM)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj59-mort-sure_orig.png",
            "caption": "Sort Mort Sure (Cauchemarakne) — zone et portee"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj59-toile-tisse-trouille_orig.png",
            "caption": "Sort Toile Tisse-Trouille — glyphe damier"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj59-cueillette_orig.png",
            "caption": "Sort Cueillette (Champetrouille)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj59-dinguerie_orig.png",
            "caption": "Sort Dinguerie (Champetrouille)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj59-frappe-a-dingue_orig.png",
            "caption": "Sort Frappe a Dingues (Champetrouille)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj59-faux-fuyant_orig.png",
            "caption": "Sort Faux-Fuyant (Chauffe-Soutrille)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj59-pus-des-pieds_orig.png",
            "caption": "Sort Pus des Pieds (Chauffe-Soutrille)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj59-malheur_orig.png",
            "caption": "Sort Malheur (Devhorreur)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj59-terreur_orig.png",
            "caption": "Sort Terreur (Devhorreur)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj59-torpeur_orig.png",
            "caption": "Sort Torpeur (Devhorreur)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj59-subterfuge_orig.png",
            "caption": "Sort Subterfuge (Lanverne)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj59-vermifuge_orig.png",
            "caption": "Sort Vermifuge (Lanverne)"
          }
        ]
      },
      {
        "title": "Boss — Halouine",
        "mechanics": [
          "Citwouille Explosive : 110 degats feu zone croix taille 1, jusqu'a 7PO, peut toucher ses allies.",
          "Moissonnage : 200 degats terre vol de vie en melee, repousse la cible d'1 case, Halouine gagne 20% vitalite pendant 3 tours (cumulable 5 fois, debuffable). DANGER : peut quasi doubler ses PV s'il l'utilise chaque tour.",
          "Peste Issyde : etat Poutchicide (2 tours), 50% des degats recus renvoyes aux allies proches sous forme de degats air.",
          "Plantes Zombies : ressuscite le dernier monstre allie mort avec 1% de ses PV, invulnerable 1 tour (2 en critique, debuffable). Disponible a partir du tour 3, toutes les 2 tours.",
          "Rattirance : attire 5 cases en ligne, applique etat Pesanteur (bloque teleportations). Permet a Halouine de ramener les joueurs a portee de melee.",
          "Gardez Halouine a distance pour l'empecher d'utiliser Moissonnage.",
          "Retirez-lui de la PO pour bloquer son attirance, combine a du retrait PM c'est encore mieux.",
          "Desenvoultez son bonus de vitalite quand il a peu de PV (Puissance Sylvestre Sadida, Souillure Pandawa, Mot Interdit Eniripsa). Le bonus vitalite expire aussi naturellement : si Halouine a moins de PV que le bonus arrivant a expiration au debut de son tour, il meurt automatiquement.",
          "A partir du tour 3, il ressuscite un allie toutes les 2 tours avec 1% de ses PV max (~dizaine de PV). L'invulnerabilite peut etre debuffee pour l'achever directement.",
          "Ordre recommande : Cauchemarakne -> Lanverne (avant tour 3 d'Halouine idealement) -> Champetrouille (Chauffe-Soutrille avant Champetrouille en butin 6+) -> Halouine en dernier.",
          "Le Champetrouille devient le monstre regulierement ressuscite en fin de combat.",
          "Si Halouine est entoure avec invocations/obstacles bloquant sa poussee, il ne peut pas ressusciter ses allies."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj59-citwouille-explosive_orig.png",
            "caption": "Sort Citwouille Explosive"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj59-moissonnage_orig.png",
            "caption": "Sort Moissonnage — boost vitalite"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj59-peste-issyde_orig.png",
            "caption": "Sort Peste Issyde — etat Poutchicide"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj59-plantes-zombies_orig.png",
            "caption": "Sort Plantes Zombies — resurrection alliee"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj59-rattirance_orig.png",
            "caption": "Sort Rattirance — attirance en ligne"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj59-30moissonnage_orig.jpg",
            "caption": "Effet Moissonnage cumule sur Halouine"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj59-31pertevita_orig.jpg",
            "caption": "Halouine perd son bonus de vitalite au debut de son tour"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj59-35glyphe_orig.jpg",
            "caption": "Glyphe Cauchemarakne — zone a eviter"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj59-41explicationdebuff_orig.png",
            "caption": "Schema debuff vitalite Halouine — combo sort + expiration naturelle"
          }
        ]
      }
    ],
    "tips": [
      "Donjon evenementiel : ouvert uniquement trois semaines par an lors de l'evenement Halouine.",
      "Entree : Plaine des Scarafeuilles [-1,22].",
      "Clef : 6 Graines de Citwouille Maudites + 2 Anguille + 2 Viande Exsudative + 2 Edelweiss + 2 Seigle.",
      "Pierre d'ame de puissance 150 minimum recommandee pour capturer Halouine.",
      "Les Graines de Citwouille Maudites se droppent dans les Champs de Citwouilles au-dessus du donjon.",
      "Les Gumizes donnent +100 puissance / -200 vitalite.",
      "L'attitude Halouine est droppee automatiquement a la fin du donjon (liee au personnage).",
      "Lors du Donjon Rusher Halouine, le Fourclier (bouclier d'apparat) se droppe automatiquement sur le boss.",
      "Quete liee : Une Citwouille pour Halouine.",
      "L'etat Affaibli (Cauchemarakne) empeche d'utiliser l'arme de corps a corps.",
      "L'etat Pesanteur (Rattirance d'Halouine) empeche d'utiliser des sorts de teleportation.",
      "Si Halouine est entoure par 4 personnages avec invocations/obstacles bloquant la poussee, il ne peut pas ressusciter ses allies."
    ],
    "rewards": [
      "Attitude Halouine (droppee automatiquement, liee au personnage)",
      "Friandises variees dont Gumizes (sur Devhorreur et Halouine)",
      "Fourclier — bouclier d'apparat (uniquement lors de l'evenement Donjon Rusher Halouine)",
      "Items de la Panoplitrouille (via drops dans les salles)"
    ],
    "achievements": [
      {
        "name": "Chrono",
        "strategy": "Vaincre tous les monstres en moins de 9 tours. Focusez Halouine en premier en le gardant a distance (lui retirer PO et PM). Boostez au tour 1 puis tapez directement Halouine. Evitez le glyphe du Cauchemarakne. Une fois Halouine mort, eliminez les monstres restants avant la fin du tour 8. Avec des sorts de debuff, vous pouvez aussi l'attaquer en melee et debuffer son bonus vitalite.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/chrono.png"
      },
      {
        "name": "Hardi",
        "strategy": "Les combattants allies doivent finir leur tour sur une cellule adjacente a celle d'un ennemi. Melee generale des le tour 1. Des sorts de debuff sont fortement conseilles pour gerer le bonus vitalite d'Halouine. Eliminez tous les monstres puis entourez Halouine. Placez invocations/obstacles derriere vos personnages pour bloquer sa poussee. Il n'est pas necessaire d'etre en melee avec Halouine quand vous terminez le combat. Les monstres ressuscites en melee ne font pas echouer Hardi.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/hardi.png"
      },
      {
        "name": "Dernier",
        "strategy": "Halouine doit etre acheve en dernier. Compatible avec la strategie globale et le succes Hardi. Aucune difficulte supplementaire.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/dernier.png"
      },
      {
        "name": "Special : Rester plante la",
        "strategy": "Les combattants allies ne doivent pas etre deplaces. Halouine ne doit jamais etre en ligne a 6PO ou moins d'un personnage (attirance). Le Champetrouille ne doit jamais etre en ligne a 5PO ou moins (attirance) ni a 4PO (poussee). Focusez Halouine en premier puis le Champetrouille. Ne pas utiliser de sorts de placement sur ses propres allies.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 20 tours. Un personnage avec sorts de debuff est conseille. Ordre de focus : Cauchemarakne -> Lanverne -> Champetrouille. Gerer les resurrections toutes les 2 tours a partir du tour 3. Garder Halouine a distance, debuffer son bonus vitalite en fin de combat.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Le Sylargh démarre invulnérable et ne peut être blessé que via la mécanique Nécromignon : 
  67: {
    "summary": "Le Sylargh démarre invulnérable et ne peut être blessé que via la mécanique Nécromignon : tuer les monstres Zombi (réinvoqués à 10% PV) entre 5 et 10PO du Sylargh pour lui retirer son invulnérabilité 1 tour. Il faut rester sous 90% PV pour éviter leffet Pacifiste qui survient à chaque élimination de Zombi.",
    "recommendedLevel": "200",
    "composition": "Retrait PM/PO (limiter le champ daction du Sylargh), classe de dégâts à distance. Pour le duo : 1 retrait PM + 1 DPS distance.",
    "keyResist": [
      "Eau",
      "Feu",
      "Terre",
      "Air"
    ],
    "phases": [
      {
        "title": "Monstres normaux (Brikoglours, Kanimate, Mansordide, Mécanofoux, Mérulor)",
        "mechanics": [
          "Brikoglours — Clef battue : 700 dégâts terre + attire 2 cases (ligne, 6PO, sans LDV). Clef en glaise : 550 dégâts feu vol de vie + dégâts eau basés sur ses PV manquants (2PO). Clef nergumène : +50 Tacle + Indéplaçable, et riposte mêlée en donnant 500 dommages aux alliés en ligne.",
          "Kanimate — Arc éclectique : état Retour historique, renvoie lattaquant à sa position précédente (+ 950 dégâts eau si téléfrag). Machine Ception : 550 dégâts terre vol de vie + retour position début de tour. Marionnettoyage : 550 dégâts air + -6PO.",
          "Mansordide — Engrenage de glace : 550 dégâts eau + 30% érosion en cercle taille 2 autour de lui. Envol de mort : soigne un allié + 550 feu + repousse contacts. Rotaplumes (relance 3 tours) : +200 soins 2 tours + état Rotativernal — renvoie 100% des dégâts à distance à toutes les entités alignées.",
          "Mécanofoux — Dé grippant : 650 dégâts neutre + -4PA (mêlée). Pétarade : 550 dégâts eau + repousse 1 case (ligne 3-12PO sans LDV). Rotapousse (relance 3 tours) : +200 dommages poussée 2 tours + état Expulsar — repousse 4 cases en étoile taille 4 quand il subit des dégâts.",
          "Mérulor — Brûlage bête : 600 dégâts feu + -200 rés. poussée (ligne 3-12PO). Dégage limite : +500 dommages poussée puis repousse 3 cases (mêlée). Vidange gardien (relance 3 tours) : intercepte dommages des alliés à 2PO (Sacrifice) + donne 200 dommages aux unités proches.",
          "Priorité délimination : Mansordide en premier (soigne ses alliés), puis Mécanofoux (dégâts distance sans LDV), enfin Brikoglours.",
          "Ne pas taper le Mansordide sous Rotativernal si des alliés sont en ligne (renvoi 100% des dégâts).",
          "Exploiter Rotapousse du Mécanofoux : taper le Mécanofoux sous Expulsar pour repousser les monstres et infliger dégâts de poussée."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark108sylargh22_orig.png",
            "caption": "Portée Machine Ception (Kanimate)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark108sylargh23_orig.png",
            "caption": "Portée Marionnettoyage (Kanimate)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark108sylargh24_orig.png",
            "caption": "Portée Engrenage de glace (Mansordide)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark108sylargh25_orig.png",
            "caption": "Portée Envol de mort (Mansordide)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark108sylargh26_orig.png",
            "caption": "Portée Rotaplumes (Mansordide)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark108sylargh40_orig.png",
            "caption": "Portée Dé grippant (Mécanofoux)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark108sylargh27_orig.png",
            "caption": "Portée Pétarade (Mécanofoux)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark108sylargh28_orig.png",
            "caption": "Portée Rotapousse (Mécanofoux)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark108sylargh29_orig.png",
            "caption": "Portée Brûlage bête (Mérulor)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark108sylargh30_orig.png",
            "caption": "Portée Dégage limite (Mérulor)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark108sylargh31_orig.png",
            "caption": "Portée Vidange gardien (Mérulor)"
          }
        ]
      },
      {
        "title": "Boss : Sylargh — mécanique Nécromignon (invulnérabilité)",
        "mechanics": [
          "Chambranle (passif) : Sylargh démarre invulnérable et est lourd (ne peut être déplacé) pendant tout le combat.",
          "Mécanique Nécromignon : en début de combat, Sylargh applique Nécromignon sur lui-même et tous les monstres. Quand un monstre meurt, le prochain monstre à jouer le réinvoque à exactement 6PO de lui (priorité horaire) dans létat Apprivoisement/Zombi avec ~10% de ses PV (~660 PV).",
          "Monstres Zombi : indéplaçables 1 tour (débuffable), +300 dommages 2 tours, ne jouent pas leur premier tour.",
          "Retrait invulnérabilité : tuer un monstre Zombi qui se trouve entre 5 et 10PO du Sylargh déclenche Zombidule → Sylargh devient vulnérable 1 tour. La vulnérabilité ne se prolonge pas si un autre Zombi est éliminé dans la même plage.",
          "Zombidule (explosion) : inflige 1 200 dégâts feu dégressifs en cercle taille 5 autour du monstre Zombi éliminé (alliés et ennemis). OS directement les autres monstres Zombi dans la zone.",
          "Pacifiste : quand un Zombi est éliminé, tous les personnages à 90% PV ou plus deviennent pacifistes 1 tour (non débuffable). Rester sous 90% PV en permanence.",
          "Réinvocations en chaîne : si plusieurs monstres meurent, le prochain qui joue réinvoque le dernier mort, qui lui-même réinvoque le précédent, etc. Éliminer le premier Zombi de la chaîne élimine tous les suivants.",
          "Si le Sylargh est éliminé avec des monstres encore en vie, il est lui-même réinvoqué par le prochain monstre à jouer.",
          "Sorts du Sylargh — Chambranle (passif), Dégage de qualité : +500 dommages et +200 tacle à un allié en mêlée (relance 2 tours, débuffable). Mortier : 650 dégâts terre + état qui inflige 650 dégâts eau pour chaque ligne de dégâts en mêlée subis (10PO modifiable). Poinçon : 1 100 dégâts air vol de vie + retire tous les envoûtements + -100 fuite (zone ligne taille 2, 1PO).",
          "Retirer PO et PM du Sylargh pour limiter sa portée (Mortier est à PO modifiable)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark108sylargh8_orig.png",
            "caption": "Schéma réinvocation — cases possibles à 6PO (priorité horaire)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark108sylargh9_orig.png",
            "caption": "Zone 5-10PO pour retirer linvulnérabilité du Sylargh (Zombidule)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark108sylargh10_orig.png",
            "caption": "Zone dexplosion Zombidule (cercle taille 5)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark108sylargh32_orig.png",
            "caption": "Portée Dégage de qualité (Sylargh)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark108sylargh33_orig.png",
            "caption": "Portée Mortier (Sylargh)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark108sylargh34_orig.png",
            "caption": "Portée Poinçon (Sylargh)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark108sylargh35_orig.jpg",
            "caption": "Sylargh placé à gauche, réinvocations repoussées à droite"
          }
        ]
      }
    ],
    "tips": [
      "Entrée : zone Remparts à vent de Frigost III en [-52,-87].",
      "Prérequis : avoir vaincu au moins une fois le Glourséleste pour accéder à Frigost III.",
      "Recette de la clef : 1 Perce-Neige, 1 Poisskaille, 1 Frostiz, 2 Viande Goûtue, 2 Canine de Kanimate, 2 Bec de Mansordide, 2 Astragale de Mécanofoux, 2 Volve de Mérulor.",
      "Pierre dâme de puissance 1000 requise pour capturer le Sylargh.",
      "Rester sous 90% PV en permanence pour éviter létat Pacifiste.",
      "Placer le Sylargh à gauche de la map : la priorité horaire fait que les réinvocations apparaissent à droite, éloignées de léquipe.",
      "Éliminer toujours le premier Zombi de la chaîne : cela élimine directement tous les suivants.",
      "Débuffer létat Indéplaçable des Zombis pour pouvoir les repositionner si nécessaire.",
      "Il peut être avantageux de ne pas prendre de pain pour démarrer le combat sous 90% PV.",
      "Réaction en chaîne possible : placer le Sylargh proche de plusieurs Zombis pour multiplier les dégâts feu de Zombidule sur lui."
    ],
    "rewards": [
      "Quêtes liées : Il faut mettre un terme aux maîtres, Porte/Sylargh/trésor, Chaud et Froid, Les desseins de Sylargh, Il est temps de mourir, Les totems de Maïmane."
    ],
    "achievements": [
      {
        "name": "Misanthrope",
        "strategy": "Les combattants alliés ne doivent jamais finir leur tour sur une cellule adjacente à celle dun autre allié. Ne pas se soucier des invocations (contact autorisé). Vigilance constante mais ne rajoute pas de difficulté mécanique.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/misanthrope.png"
      },
      {
        "name": "Barbare",
        "strategy": "Achever tous les ennemis (y compris les Zombis) avec une arme. Utiliser une arme à distance (Baguette ou Arc) pour éviter les dégâts de lexplosion Zombidule.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/barbare.png"
      },
      {
        "name": "Spécial : Brikolère",
        "strategy": "Les Zombis éliminés ne doivent infliger de dommages ni aux alliés ni aux ennemis. Il ne doit y avoir aucune entité à 5PO du Zombi éliminé. Pour retirer linvulnérabilité, placer le Sylargh entre 6 et 10PO du Zombi. Idéal : mettre le Sylargh à 0PM (il réapparaît à 6PO après réinvocation et ne subira pas les dégâts).",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres à 2 personnages en moins de 40 tours. Conseillé : 1 retrait PM + 1 DPS distance. Ordre délimination : Mansordide, Mécanofoux, Brikoglours. Éliminer les Zombis en priorité avant leur deuxième tour.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Le Klime est invulnerable par defaut ; il faut lui infliger des degats de poussee indirect
  68: {
    "summary": "Le Klime est invulnerable par defaut ; il faut lui infliger des degats de poussee indirecte (pousser une entite sur lui) pour le rendre vulnerable 1 tour. Des le tour 3, chaque personnage doit finir son tour dans un glyphe blanc pose par les monstres pour eviter l'etat Pacifiste lance par le Klime a chaque debut de tour. La strategie consiste a eliminer les monstres allies en premier, puis a tuer le Klime rapidement une fois seul.",
    "recommendedLevel": "200",
    "composition": "Classe capable de tacler et placer (Pandawa recommande pour le duo) ; classes de mobilite utiles pour les succes. Personnages de soutien peuvent jouer pacifistes sans probleme.",
    "keyResist": [
      "Feu",
      "Air"
    ],
    "phases": [
      {
        "title": "Tours 1-2 : elimination des monstres allies",
        "mechanics": [
          "Cuirboule : 1 PM de base ; sort principal tape extremement fort en Terre en ligne sans LdV jusqu'a 11 PO, attire de 10 cases puis repousse de 10 - ne pas etre en ligne avec lui.",
          "Cuirboule : poison eau de fin de tour proportionnel aux PM utilises si vous finissez a 5 PO - rester a distance.",
          "Cuirboule : se soigne et gagne 600 dommages quand il est detacle (actif 2 tours sur 3).",
          "Empaille : se teleporte jusqu'a 3 PO en infligeant degats air + 40% erosion en croix taille 1 autour de sa case d'arrivee.",
          "Empaille : attire une cible jusqu'a 6 PO, echange de place, 500 degats neutre + etat Pesanteur 1 tour.",
          "Empaille : se boost de 1000 dommages le tour suivant (Pesanteur ce tour, relance 3 tours).",
          "Grodruche : un tour sur deux, indeplacable et donne 2 PM a toutes les entites dans un cercle rayon 4 quand il subit des degats ; les entites a exactement 5 PO subissent les memes degats.",
          "Grodruche : sort en ligne qui attire de 5 cases (eau, jusqu'a 6 PO) ; sort melee terre vol de vie + Pesanteur.",
          "Harrogant : tape uniquement en ligne longue distance (impossible si tackle) ; sort air retire 4 PO ; sort neutre sans LdV repousse de 4 cases.",
          "Harrogant : 1 tour sur 2, soigne allies (cercle rayon 5) et tape toutes les entites a exactement 6 PO a hauteur des degats subis.",
          "Peunch : applique Affaibli + retire 100 fuite (cercle rayon 3) ; sort feu vol de vie vole 100 Intelligence 3 tours (anneau taille 2) ; sort eau en melee = 50% PV manquants du Peunch + retire 8 PM.",
          "Ordre conseille : Empaille -> Grodruche (focus aux tours pairs pour eviter le boost PM) -> Cuirboule.",
          "Ne pas tenter de rendre le Klime vulnerable avant le tour 3."
        ]
      },
      {
        "title": "Tours 1-3 : mecanique des glyphes et Peau lisse",
        "mechanics": [
          "Au debut du combat, les personnages entrent en etat Peau lisse pour 3 tours : ils ne peuvent pas devenir Pacifiste pendant ces 3 premiers tours.",
          "Chaque monstre (y compris le Klime) pose un glyphe blanc de taille 1 au debut de son tour, qui dure 2 tours.",
          "Le glyphe donne l'etat Peau lisse aux personnages qui terminent leur tour dessus ; il donne 300 dommages pendant 2 tours au monstre qui finit son tour dessus.",
          "Si un monstre est tue, ses 2 glyphes disparaissent immediatement.",
          "A partir du tour 4, tout personnage n'ayant pas fini son tour sur un glyphe au tour precedent recoit l'etat Pacifiste pour 1 tour.",
          "Un personnage peut deplacer un autre hors d'un glyphe pour en prendre la place.",
          "Des le tour 3, placer les personnages qui vont frapper dans des glyphes."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj31-glyphes-klime_orig.jpg",
            "caption": "Fonctionnement des glyphes blancs de Klime"
          }
        ]
      },
      {
        "title": "Phase Boss : rendre Klime vulnerable et le vaincre",
        "mechanics": [
          "Klime est Invulnerable jusqu'a ce qu'il subisse des degats de poussee indirecte : pousser un allie, une invocation ou un ennemi sur lui.",
          "Il ne peut pas perdre l'etat Invulnerable avant le debut du tour 3.",
          "Klime est vulnerable pendant 1 tour seulement - frapper le plus fort possible dans cette fenetre.",
          "Cuir Moustache : attire la cible de 6 cases + poison feu fin de tour 250 degats pendant 3 tours (ligne jusqu'a 7 PO sans LdV, 2 fois/tour).",
          "Moustacheron : 250 feu + 250 air vol de vie + 10% PV manquants du Klime en neutre (melee, 2 fois/tour).",
          "Cuir a feu doux (sort supplementaire quand vulnerable) : renvoie Klime et allies a leurs positions de debut de tour ; personnage sur une case d'arrivee echange de place et perd 6 PM ; Klime et allies gagnent 100 tacle et 300 dommages pour 1 tour (relance 2 tours).",
          "Moins Klime a de PV, plus il tape fort - le tuer rapidement une fois attaque.",
          "Les 300 dommages des glyphes et le buff Cuir a feu doux sont debuffables.",
          "Ne pas rendre Klime vulnerable tant que les monstres allies sont encore en vie (risque de Cuir a feu doux)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj31-klime-vulne_orig.jpg",
            "caption": "Comment rendre Klime vulnerable : pousser une entite sur lui"
          }
        ]
      }
    ],
    "tips": [
      "Acces Frigost III : avoir deja vaincu le Gloursceleste au moins une fois.",
      "Recette de la clef : 1 Perce-Neige, 1 Poisskaille, 1 Frostiz, 2 Viande Goutue, 2 Oeil de Harrogant, 2 Cuir de Grodruche, 2 Cuir d'Empaille, 2 Cuir de Cuirboule.",
      "Entree du donjon : Tannerie Ecarlate de Frigost III en [-63,-93].",
      "Passage secret entre la salle 3 et 4 : activer le chandelier le plus proche - un rideau s'ouvre, une trappe apparait vers la salle 4.",
      "Pierre d'ame de puissance 1000 requise pour capturer le Klime.",
      "Tuer le Klime en dernier ; ne pas lui retirer son etat Invulnerable tant que ses allies sont vivants.",
      "Quand il ne reste que le Klime et que les 2 glyphes sont occupes, deplacer les personnages pour liberer les glyphes.",
      "Si le Klime finit son tour sur un glyphe (gain de 300 dommages), le desenvouter."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Prudent",
        "strategy": "Ne jamais finir son tour sur une case adjacente a un ennemi. Utiliser une invocation ou une classe pouvant se liberer du tacle pour pousser quelque chose sur le Klime sans etre au contact.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/prudent.png"
      },
      {
        "name": "Nomade",
        "strategy": "Utiliser tous ses PM a chaque tour. La difficulte est de finir sur un glyphe tout en ayant utilise tous ses PM. Privilegier les classes avec sorts de teleportation, attirance, echange de position, ou des placeurs qui calibrent exactement le deplacement de leurs allies.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/nomade.png"
      },
      {
        "name": "Special : Dur a cuir",
        "strategy": "Aucun allie ne doit entrer en etat Pacifiste. A partir du tour 3, tous les allies doivent finir leur tour dans un glyphe blanc. Alternative : eliminer tous les monstres aux tours 1-2 puis le Klime au tour 3 (il ne peut perdre l'Invulnerabilite qu'au tour 3).",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages en moins de 40 tours. Un Pandawa est conseille pour tacler le Klime et lui retirer facilement son Invulnerabilite.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Missiz Frizz et tous les monstres commencent le combat dans l'état Invulnérable
  69: {
    "summary": "Missiz Frizz et tous les monstres commencent le combat dans l'état Invulnérable. Pour les rendre vulnérables, il faut les repousser via les glyphes « congères » qui apparaissent en début de tour autour de chaque personnage. L'ordre recommandé est : Verglasseur en premier (dangereux), puis Stalak, Karkanik, et enfin Missiz Frizz en dernier.",
    "recommendedLevel": "170 — 200",
    "composition": "Compositions mêlée ou blitz conseillées. Pour le succès score 200 : Yoches + Nékinéko + Dynamo/Hulhu. Possibilité d'utiliser des sorts Indéplaçable (ex. Glyphe Gravitationnel du Féca, Stabilisation du Pandawa).",
    "keyResist": [
      "Feu",
      "Eau"
    ],
    "phases": [
      {
        "title": "Monstres des salles — Frimar, Karkanik, Stalak, Ventrublion, Verglasseur",
        "mechanics": [
          "Frimar : sort « Glacéré » donnant 1 PM + 4 PM et 500 dommages à chaque déplacement subi (actif 2 tours/3) ; sort feu cône taille 4 à 1PO ; sort terre+air en ligne taille 3 à 1PO (dégâts proportionnels aux PV manquants, retire 100 fuite).",
          "Karkanik : état « Pesanteur » + retire 100 fuite en cercle rayon 6 quand touché à distance (actif 2/3) ; sort eau longue portée (4-12PO) retire 4 PM ; sort air à 10PO retire 5PO zone croix.",
          "Stalak : renvoi dégâts distance (alliés et ennemis) + 20% érosion en cercle rayon 2 (actif 2/3) ; tape feu en ligne taille 2 à 8PO ; rush à 10PO + échange de place + 15% PV cible en neutre.",
          "Ventrublion : +2 PM + renvoi dégâts distance en croix taille 1 + 500 dommages chaque fois qu'il subit des dégâts à distance (actif 2/3) ; sort terre 5PO attire 4 cases et retire 50 fuite ; sort eau 2PO échange de place + état « Pesanteur ».",
          "Verglasseur : +2 PM + abaisse PV alliés (25%) et ennemis (75%) en cercle rayon 5 quand touché à distance (actif 2/3) ; sort neutre mêlée repousse 2 cases et retire 4 PA ; sort air ligne 4PO attire 3 cases puis repousse 3 cases et retire 4 PM."
        ]
      },
      {
        "title": "Combat principal — mécaniques des congères et de l'invulnérabilité",
        "mechanics": [
          "Tous les monstres et Missiz Frizz commencent en état « Invulnérable » et « Lourd » pour toute la durée du combat.",
          "Congères : au début de chaque tour d'un personnage, un glyphe noir apparaît sur les 4 cases adjacentes autour de lui.",
          "Marcher dans une congère : soigne 15% PV max, repousse le personnage d'1 case supplémentaire, et repousse tous les ennemis/alliés en croix taille 6 et croix diagonale taille 3 d'1 case.",
          "Tout ennemi repoussé par une congère perd son invulnérabilité pour 1 tour.",
          "Les invocations ne génèrent pas de congère.",
          "Si un personnage ne bouge pas, la congère se cumule et les effets sont doubles au tour suivant.",
          "Monogel : lorsqu'un monstre ou personnage est poussé par un sort de déplacement, il est soigné de 15% PV max et repousse les entités en ligne et diagonale à 6PO d'1 case (autre moyen de retirer l'invulnérabilité).",
          "Dégâts de poussée : subir des dégâts de poussée applique 20% d'érosion permanente + environ 800 dégâts neutre supplémentaires si Missiz Frizz est vivante.",
          "Glace de pic : Missiz Frizz attire tous les personnages en ligne et en diagonale à son contact + état « Surgelé » quand elle subit des dégâts.",
          "État « Surgelé » : permet à Missiz Frizz de taper une ligne supplémentaire avec « Sang Froid » (800 dégâts feu + 800 vol de vie eau).",
          "Cristallisation : état « Intacleur » sur tous les monstres pour 1 tour ; tout retrait PM sur un ennemi lui donne 3 PM à la place (se lance à partir du tour 2, relance 3 tours).",
          "Glace trop physique : 20% érosion + 550 dégâts feu + 35% PV érodés en air + état « Intaclable » 1 tour sur la cible (jusqu'à 8PO, 1 fois/tour)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj32-invu-missiz_orig.jpg",
            "caption": "Schéma — rendre Missiz Frizz vulnérable (état Invulnérable)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj32-glyphe-missiz_orig.jpg",
            "caption": "Schéma — fonctionnement du glyphe congère et retrait de l'invulnérabilité"
          }
        ]
      },
      {
        "title": "Stratégie globale — ordre de focus",
        "mechanics": [
          "Focus Missiz Frizz en DERNIER.",
          "Commencer par le Verglasseur (dangereux : 2 sorts de poussée) — l'idéal est de le tuer au tour 1.",
          "Ensuite Stalak (plus simple à focus que le Karkanik qui a une IA fuyarde).",
          "Puis Karkanik.",
          "Enfin Missiz Frizz : éviter la mêlée pour ne pas la soigner via les congères ; ne pas avoir d'alliés en ligne ou diagonale avec elle pour éviter l'état « Surgelé ».",
          "Pour bloquer Missiz Frizz : utiliser Indéplaçable, Enraciné ou Inébranlable (Glyphe Gravitationnel du Féca, Stabilisation du Pandawa).",
          "Si elle ne peut pas être bloquée : appliquer Insoignable ou réduire ses soins (ex. sort « Dépeçage » de l'Ouginak).",
          "Pousser les alliés peut les soigner (15% PV max par congère)."
        ]
      }
    ],
    "tips": [
      "Entrée du donjon : Bastion des froides légions de Frigost III en [-71,-88].",
      "Prérequis : avoir vaincu au moins une fois le Glourséleste pour accéder à Frigost III.",
      "Clef : 1 Perce-Neige, 1 Poisskaille, 1 Frostiz, 2 Viande Goûtue, 2 Sang de Ventrublion, 2 Incisive de Stalak, 2 Incus de Verglasseur, 2 Sang de Karkanik.",
      "Pierre d'âme de puissance 1000 requise pour capturer Missiz Frizz.",
      "Ne pas taper le Stalak à distance quand des alliés sont proches (renvoi dégâts distance en cercle rayon 2).",
      "Ne pas taper le Ventrublion à distance (renvoi + boost dommages).",
      "Utiliser sorts Indéplaçable/Enraciné/Inébranlable pour éviter d'être poussé par les congères.",
      "Quêtes liées : « Il faut mettre un terme aux maîtres », « Porte, Missiz Frizz, trésor », « Chaud et Froid », « La dernière carte », « À glacer le sang » (bontarien), « Sueurs froides » (brâkmarien), « Les totems de Maïmane »."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Nomade",
        "strategy": "Utiliser tous ses PM à chaque tour pendant tout le combat. Pas de difficulté particulière — éviter de se faire tacler.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/nomade.png"
      },
      {
        "name": "Collant",
        "strategy": "Finir son tour sur une case adjacente à un allié. Risque de réactions en chaîne avec les congères. Conseillé : se coller à ses invocations plutôt qu'à un autre personnage pour limiter les érosions et dégâts de poussée involontaires.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/collant.png"
      },
      {
        "name": "Spécial — Attention, sol glissant",
        "strategy": "Aucun allié ne doit subir de dégâts de poussée. Focus Verglasseur en premier (2 sorts de poussée). Faire attention au placement de fin de tour pour éviter de pousser un allié contre un obstacle via les congères. Utiliser sorts Indéplaçable/Inébranlable/Enraciné ou téléportation si besoin.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 40 tours. Reprendre la stratégie globale avec 2 personnages.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Nileza est le boss le plus accessible de Frigost 3 (niveau 200)
  70: {
    "summary": "Nileza est le boss le plus accessible de Frigost 3 (niveau 200). Sa mécanique clé est son passif Cohobation : taper Nileza à distance provoque un échange de place avec l'attaquant et un renvoi de 200% des dégâts infligés en zone cercle 2PO autour de sa case d'arrivée, permettant d'éliminer facilement les monstres. Attention à l'effet Chifouchimie qui OS tout personnage adjacent à un allié en fin de tour.",
    "recommendedLevel": "200",
    "composition": "Classes mobiles ou capables de se placer facilement, avec de bons dégâts à distance. Idéal : 2 classes mobiles avec beaucoup de dégâts pour le succès Duo.",
    "keyResist": [
      "Air"
    ],
    "phases": [
      {
        "title": "Salles 1 à 3 — Monstres du donjon",
        "mechanics": [
          "Dodox — Duvet Téran : 500 bouclier sur lui et effet Plumide (bouclier en chaîne aux alliés/ennemis en ligne) ; Pligeon : téléportation 3PO + 550 dégâts + retrait 1000 soins en croix.",
          "Drosérâle — Bractérie : applique Sporange mécanique (repousse l'attaquant de 2 cases à chaque frappe sur un monstre affecté) ; Stigmatraque : 500 dégâts terre vol-de-vie + repousse en croix.",
          "Krakal — Pelage de glace : état Figel, boost dommages alliés si déplacé ; Morsure de soie : dégâts eau % PV manquants + attire d'une case.",
          "Nessil — Drako : renvoi 400 dégâts par ligne à distance pendant 2 tours ; Loch : 600 dégâts terre + vulnérabilité 40% sur 1 tour.",
          "Termystique — Glusure : poison 160 dégâts neutre par PM utilisé (uniquement en ligne) ; Sérum à tout faire : 100 tacle + renvoi 900 dégâts eau + retrait 3PA en mêlée."
        ]
      },
      {
        "title": "Salle du Boss — Nileza (passif Cohobation)",
        "mechanics": [
          "Chifouchimie (passif) : tout personnage qui termine son tour adjacent à un autre personnage OS ce dernier (invocations exclues).",
          "Ogavodra (passif) : chaque fois que Nileza subit des dégâts à distance, il échange de place avec l'attaquant.",
          "Molalité illéplochable (passif) : à chaque attaque à distance reçue, Nileza applique 40% d'érosion et renvoie 200% des dégâts subis en dégâts air dans un cercle 2PO autour de sa case d'arrivée. Le renvoi a lieu APRÈS l'échange de place.",
          "Liqueur de Fée Ling : actif au tour 1 puis tous les 3 tours — soigne Nileza de 5% PV max et lui donne 300 dommages par ligne de dégâts en mêlée reçus. Taper en mêlée uniquement aux tours 3, 6, 9…",
          "Fraction de molaire : 550 dégâts eau + dégâts terre proportionnels aux PV manquants de Nileza, ligne 12PO (modifiable), repousse 3 cases. Plus Nileza est bas en PV, plus il fait mal.",
          "Glace sèche : échange de place + 750 dégâts feu en croix autour de sa case d'arrivée, 2PO sans LdV.",
          "Mécanique Pacifiste (tours impairs à partir du tour 3) — Alchymne à la joie T3 : Pacifiste aux personnages >11PO + perte 200 fuite ; Gromation T5 : Pacifiste >9PO + perte 200 tacle ; Carba Gnion T7 : Pacifiste >7PO + Pesanteur ; Cabalcaloïde T9+ : Pacifiste >5PO + Insoignable (tous non débuffables)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/effet-chifouchimie_orig.png",
            "caption": "Effet Chifouchimie — zone d'OS adjacente"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark102nileza34_orig.png",
            "caption": "Zone d'effet de Molalité illéplochable (cercle 2PO autour de la case d'arrivée de Nileza)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark102nileza30_orig.png",
            "caption": "Alchymne à la joie — zone Pacifiste au tour 3"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark102nileza31_orig.png",
            "caption": "Gromation — zone Pacifiste au tour 5"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark102nileza32_orig.png",
            "caption": "Carba Gnion — zone Pacifiste au tour 7"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark102nileza33_orig.png",
            "caption": "Cabalcaloïde — zone Pacifiste au tour 9+"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/fraction-de-molaire_orig.png",
            "caption": "Portée du sort Fraction de molaire (ligne 12PO modifiable)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/glace-seche_orig.png",
            "caption": "Zone d'effet de Glace sèche"
          }
        ]
      },
      {
        "title": "Stratégie globale — Phase monstres",
        "mechanics": [
          "Ne jamais terminer son tour adjacent à un allié (Chifouchimie OS).",
          "Se placer à 2PO ou moins des monstres, puis taper Nileza à distance : il échange de place et renvoie 200% des dégâts en zone air 2PO autour de lui, éliminant ou affaiblissant les monstres proches.",
          "Packer les monstres avant de taper Nileza pour maximiser les dégâts du renvoi.",
          "Si un monstre est sous le renvoi du Nessil (Drako), Nileza subira aussi ce renvoi : dégâts supplémentaires sur lui.",
          "Si le Drosérâle a appliqué Sporange mécanique sur Nileza, vous serez repoussé avant l'échange de place : anticiper ce déplacement.",
          "Utiliser l'échange de place (en tapant Nileza) pour repositionner Nileza près de vos personnages et rester dans la zone anti-Pacifiste.",
          "Éliminer en priorité le Drosérâle et le Nessil (les plus dangereux)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark102nileza27_orig.jpg",
            "caption": "Placement à 2PO des monstres avant de taper Nileza pour déclencher le renvoi"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark102nileza28_orig.jpg",
            "caption": "Nileza échange de place et renvoie 200% des dégâts en zone air"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark102nileza29_orig.png",
            "caption": "Exemple de dégâts du renvoi : 372 dégâts infligés = 744 renvoyés en zone"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark102nileza3bracterie_orig.png",
            "caption": "Effet Sporange mécanique sur Nileza : le personnage est repoussé avant l'échange de place"
          }
        ]
      },
      {
        "title": "Stratégie globale — Phase Nileza seul",
        "mechanics": [
          "Une fois les monstres éliminés, Nileza est affaibli si le renvoi a bien été utilisé.",
          "Attention : Fraction de molaire tape plus fort en fonction des PV manquants de Nileza — finir le combat rapidement.",
          "Fraction de molaire ne se lance qu'en ligne (PO modifiable) : lui retirer de la PO réduit son efficacité.",
          "Rester proche de Nileza (≤5PO aux tours 9+) pour ne pas entrer dans l'état Pacifiste/Insoignable.",
          "Si situation critique, il est possible d'accepter temporairement le Pacifiste pour se soigner, mais uniquement avant le tour 9 (après T9, l'état Insoignable s'ajoute).",
          "Taper en mêlée uniquement aux tours 3, 6, 9… (hors Liqueur de Fée Ling)."
        ]
      }
    ],
    "tips": [
      "Accès : Frigost, Jardins d'Hiver en [-59,-74]. Nécessite d'avoir déjà battu le Glourséleste.",
      "Recette de la clef : 2x Bave de Nessil, 2x Canine de Krakal, 2x Plume de Dodox, 2x Bractée de Drosérâle, 2x Viande Goûtue, 1x Poisskaille, 1x Perce-Neige, 1x Frostiz.",
      "Pierre d'âme de capture 1000 requise pour capturer Nileza.",
      "Nileza n'a pas d'état invulnérable — c'est le donjon niveau 200 le plus abordable.",
      "Nileza a une IA fuyarde : utiliser l'échange de place pour le ramener proche de vos personnages.",
      "Les états Pacifiste, Pesanteur et Insoignable ne sont pas débuffables.",
      "Quêtes liées : Il faut mettre un terme aux maîtres, Porte Nileza trésor, Au-delà du mur, Chaud et Froid, Une voix de crystal, Les totems de Maïmane."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Prudent",
        "strategy": "Les combattants alliés ne doivent jamais finir leur tour sur une cellule adjacente à celle d'un ennemi. Faire attention à ne pas être taclé totalement si on va en mêlée. Le Drosérâle, Nessil et Nileza ont des IA fuyardes et viennent rarement au contact.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/prudent.png"
      },
      {
        "name": "Dernier",
        "strategy": "Nileza doit être achevé en dernier. Ce succès est quasi offert avec la stratégie de base (utiliser Nileza pour éliminer les monstres avec son renvoi).",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/dernier.png"
      },
      {
        "name": "Spécial : Alchi-pludent",
        "strategy": "Aucun allié ne doit entrer dans l'état Pacifiste. S'assurer que tous les personnages restent à bonne distance de Nileza avant chaque tour impair (T3 : ≤11PO, T5 : ≤9PO, T7 : ≤7PO, T9+ : ≤5PO). Utiliser l'échange de place pour repositionner Nileza favorablement.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 40 tours. Privilégier 2 classes mobiles avec beaucoup de dégâts. Utiliser le renvoi de Nileza en priorité contre le Drosérâle et le Nessil.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Le Maitre des Pantins est invulnerable en permanence et ne peut etre blesse que 2 tours ap
  72: {
    "summary": "Le Maitre des Pantins est invulnerable en permanence et ne peut etre blesse que 2 tours apres elimination de ses 5 Marionnettes colorees. La strategie consiste a eliminer toutes les Marionnettes avant le tour 5, a supprimer l'effet Bunraku en se tapant entre allies, puis a burster le boss lors de sa fenetre de vulnerabilite de 2 tours.",
    "recommendedLevel": "100",
    "composition": "Equipe variee en elements indispensable : chaque Marionnette a 200% de resistance dans son element. Conseille de jouer a 5+ personnages car le boss n'invoque que 5 Marionnettes en tout quelle que soit la taille du groupe.",
    "keyResist": [
      "Variable (voir resistances)"
    ],
    "phases": [
      {
        "title": "Salles 1-2 — Acces a l'emote Jongler (optionnel)",
        "mechanics": [
          "Avant la salle 3, actionnez les 5 leviers dans l'ordre indique pour ouvrir un passage secret.",
          "Parlez a Shaca dans la salle secrete pour obtenir l'emote Jongler.",
          "Revenez en arriere pour continuer le donjon."
        ]
      },
      {
        "title": "Salle 4 — Mini-boss Dramak",
        "mechanics": [
          "Le Dramak est invulnerable pendant tout le combat, pas de PM, ne peut etre pousse ni attire ni porte.",
          "Il invoque un Pantin au tour 1 puis tous les 3 tours.",
          "Reduisez le Pantin a 10% de ses PV : le personnage le plus proche en prend le controle (Pantin invulnerable 2 tours).",
          "Denouement : le conroleur lance ce sort sur le Dramak pour retirer son invulnerabilite 2 tours et detruit le Pantin.",
          "Entracte : 120 degats feu et repousse 4 cases en zone carre taille 1 autour du Dramak, 1 fois par tour.",
          "Manipulation : 180 degats air jusqu'a 12PO, 1 fois par cible.",
          "Marionnette : transforme la cible, retire 100PA et 100PM ; en debut de tour la cible et allies en cercle 2 subissent 200 degats eau et perdent 20 resistances de poussee, les monstres sont soignes de 200PV, relance 3 tours."
        ]
      },
      {
        "title": "Combat final — Maitre des Pantins",
        "mechanics": [
          "Placement preparation : utilisez les 5 cases sures marquees pour ne pas recevoir de degats au tour 1.",
          "Tour 1 : le boss invoque 5 Marionnettes Blanche Air, Bleue Eau, Grise Neutre, Rouge Feu, Verte Terre, chacune 200% resistance dans son element. Elles jouent juste apres le boss.",
          "Objectif : eliminer les 5 Marionnettes AVANT le debut du tour 5 ; sinon le boss reinvoque celles manquantes.",
          "Priorite d'elimination : Grise en premier car elle retire 35% resistances tous elements, puis Verte car elle reduit les soins de 75%.",
          "Bunraku : le boss applique cet etat a un personnage jusqu'a 10PO sans LdV, relance 3 tours. Au prochain tour du boss une Petite Marionnette est invoquee au contact si l'etat est toujours present. Pour l'annuler : un allie inflige n'importe quels degats au personnage cible.",
          "Petite Marionnette si invoquee : agit comme invocation du joueur cible avec ses stats, moitie de ses resistances, moitie de ses PA et PM. Representation en debut de tour : degats terre en croix 2 et repousse 2 cases. A sa mort : 50% de ses PV en degats element aleatoire en croix 1.",
          "Ne jamais terminer son tour au contact de la Petite Marionnette.",
          "Quand les 5 Marionnettes sont eliminees, le boss devient vulnerable au debut de son prochain tour pour 2 tours.",
          "Fenetre de vulnerabilite : boostez-vous au maximum avec invocations, poisons, sorts a charges pour tuer le boss en 2 tours.",
          "Tirer les ficelles disponible seulement quand vulnerable : retire 2 tours d'envoutements et vole 100 stats dans un element aleatoire ou inflige 160 degats, en croix taille 1 a PO infinie sans LdV. Evitez de rester groupes.",
          "Ensecret reinvoque les 5 Marionnettes, relance 4 tours, disponible a partir du tour 5.",
          "Les poisons et glyphes poses se declenchent avant que le boss ne recupere son invulnerabilite.",
          "Le boss ne se deplace pas et ne taclera pas."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark52dramak37_orig.jpg",
            "caption": "Vue generale du combat final contre le Maitre des Pantins"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark52dramak28_orig.jpg",
            "caption": "Positions d'invocation des 5 Marionnettes a 3PO du boss en priorite horaire"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark52dramak44_orig.jpg",
            "caption": "Cases sures de placement en phase de preparation"
          }
        ]
      }
    ],
    "tips": [
      "Entree du donjon sur l'Ile de Kartonpath en [21,7] ; passer par la grotte en [14,14] pour rejoindre l'ile.",
      "Recette de la clef : 2x Oreille de Rhinoferoce, 2x Dent de Molette, 2x Plume de Gobvious, 2x Patte de Bouledogre, 2x Viande Exsudative, 2x Anguille, 2x Edelweiss, 2x Seigle.",
      "Pierre d'ame de puissance 1 000 requise pour capturer le boss.",
      "Minimum 1 500 PV recommandes pour encaisser les 5 Marionnettes au tour 1.",
      "Plus facile a 5+ personnages (butin 5+) : les Marionnettes restent au nombre de 5 quelle que soit la taille du groupe.",
      "Jouez avec au moins un element different dans l'equipe pour couvrir toutes les resistances des Marionnettes.",
      "Poisons et glyphes poses avant que le boss redevienne invulnerable continuent de faire des degats au tour de recuperation.",
      "Quetes liees : Ainsi font les petites marionnettes (emote Brandir son bouclier) et Tour de marionnettes."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Spectacle de marionnettes",
        "strategy": "Eliminer les 5 Marionnettes dans l'ordre exact d'invocation : Blanche > Bleue > Rouge > Verte > Grise. L'ordre est indique par un etat au-dessus de la marionnette suivante a abattre. Les Marionnettes Grise et Verte (les plus dangereuses) doivent etre eliminees en dernier.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Merkator est un boss aquatique qui impose des le debut du combat l'effet Mer Kantile renda
  73: {
    "summary": "Merkator est un boss aquatique qui impose des le debut du combat l'effet Mer Kantile rendant tous les ennemis indeplacables, reduisant ses degats a distance de 50% et amplifiant ses dommages finaux a chaque attaque a distance recue. La strategie consiste a rester a distance du Merkator, eliminer les monstres par ordre de priorite (Eskoglyphe, Harpo, Cyclophandre), puis finir le boss en melee ou a distance prudemment.",
    "recommendedLevel": "195 — 200",
    "composition": "Equipe polyvalente ; classes avec sorts de protection (ex. Feca : Ataraxie, Bastion, Egide) utiles pour retirer des PM sans subir les degats de Mer Veille. Classes pouvant taper fort en melee recommandees pour finir le boss.",
    "keyResist": [
      "Terre",
      "Eau",
      "Feu",
      "Air"
    ],
    "phases": [
      {
        "title": "Salles avant le boss",
        "mechanics": [
          "Differentes compositions de monstres (Cyclophandre, Eskoglyphe, Harpo, Krabouilleur, Pikoleur) a traverser avant d'atteindre le boss.",
          "Eskoglyphe — Predateur de Gloire : gagne 2PM et entre dans l'etat Filouteriposte ; si tape a distance, donne 1PM et 100 dommages a tous les ennemis a plus de 8PO (relance 3 tours).",
          "Harpo — Campeur et sans reproches : repousse les ennemis, applique Cessez le feu et au tour suivant lance Moule Chote avec 1000 dommages pousses supplementaires (lancable a partir du tour 2).",
          "Pikoleur — Par ici : echange de place, attire de 9 cases, retire 4PM, puis inflige 1300 degats feu en cercle de rayon 4 le tour suivant.",
          "Krabouilleur — Flou de Mer : etat Pinception, les entites a 4PO exactement subissent 100% des degats infliges au Krabouilleur."
        ]
      },
      {
        "title": "Combat contre Merkator — Mecanique Mer Kantile (permanent)",
        "mechanics": [
          "Mer Kantile (lance des le debut, permanent) : Merkator et tous les monstres sont indeplacables, Merkator reduit les degats a distance de 50%, gagne 2% de dommages finaux a chaque attaque a distance recue.",
          "Mer Veille : toute tentative de retrait PM sur un monstre inflige environ 500 degats feu en vol de vie a l'attaquant.",
          "Mer Cure (effets sur personnages) : frapper un allie avec une arme repousse les monstres en croix diagonale de taille 3 de 3 cases et repousse les allies en croix de taille 3 de 3 cases.",
          "Mer Cure (effets sur monstres) : attaquer un monstre en melee repousse ses allies en croix de taille 3 de 3 cases et repousse les personnages en croix diagonale de taille 3 de 3 cases.",
          "Maree Descendante (via Baphe Thysca, a partir du tour 3 puis tous les tours impairs) : Merkator attire tous les ennemis en ligne jusqu'a 12PO a sa melee et leur retire 4PM esquivables.",
          "Baphe Thysca : a chaque degat subi, les degats de base de Sondage de Bronze augmentent de 30 (cumulable 5 fois) pour 1 tour (lancable a partir du tour 2, relance 2 tours).",
          "Bouche-a-Bouche : reinvoque le dernier allie mort avec 50% de vitalite (a partir du tour 7, relance 5 tours).",
          "Sondage de Bronze : 950 degats terre en ligne de taille 5, uniquement en ligne jusqu'a 3PO.",
          "Torpillage de Glace : 1100 degats eau en melee, reduit la vitalite de 50% et applique Pesanteur pour 1 tour."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj24-500_orig.jpg",
            "caption": "Effet Mer Kantile — resistances et etat indeplacable"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj24-501_orig.png",
            "caption": "Effet Mer Kantile sur Merkator"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj24-502_orig.png",
            "caption": "Effet Mer Kantile sur les monstres"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj24-repouss-indep1-fixed1_orig.png",
            "caption": "Mer Cure : repousser un allie monstre en frappant en melee"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj24-repouss-indep2-fixed1_orig.png",
            "caption": "Mer Cure : repousser un ennemi en frappant un allie avec une arme"
          }
        ]
      },
      {
        "title": "Strategie globale",
        "mechanics": [
          "Priorite : tuer d'abord l'Eskoglyphe (boost PM genants), puis le Harpo (Moule Chote tres dangereux au tour 3), enfin le Cyclophandre.",
          "Se tenir a distance du Merkator pendant l'elimination des monstres (ses sorts ont tres peu de PO).",
          "Eviter d'etre en ligne avec le Merkator les tours impairs a partir du tour 3 pour esquiver l'attirance de Maree Descendante.",
          "Ne pas taper le Merkator quand il a l'effet Baphe Thysca pour eviter de booster Sondage de Bronze.",
          "Pour finir Merkator : melee conseillee (ignore la reduction 50% a distance et evite de booster ses dommages finaux) ; sinon taper a distance a petit feu.",
          "Tuer le Pikoleur en 1 tour si possible — dangereux quand ses PV sont bas (Perforage en cercle inverse + Par ici).",
          "Utiliser des invocations comme leurre pres de Merkator pour detourner ses attaques.",
          "Protection Feca (Ataraxie, Bastion, Egide) pour retirer des PM sans subir Mer Veille."
        ]
      }
    ],
    "tips": [
      "Acces : entree dans la base Abyssale en [21,18].",
      "Recette de la clef : 2x Cuir d'Eskoglyphe, 2x Carapace de Krabouilleur, 2x Pic de Pikoleur, 2x Barbe du Cyclophandre, 1x Perce-Neige, 1x Poisskaille, 1x Frostiz, 2x Viande Goutue.",
      "Pierre d'ame : puissance 1000 requise pour capturer Merkator.",
      "Quetes liees : Tour nage, Pollution je dis non, Prise de notes, alignement ordre 5 (Heros Legendaire / Gardien du Savoir / Maitre des Illusions / Heros de l'Apocalypse / Gardien des Tortures / Maitre des Ombres), Les totems de Maimane."
    ],
    "rewards": [
      "Cuir d'Eskoglyphe",
      "Carapace de Krabouilleur",
      "Pic de Pikoleur",
      "Barbe du Cyclophandre"
    ],
    "achievements": [
      {
        "name": "Dernier",
        "strategy": "Merkator doit etre acheve en dernier. Plus simple que le combat normal car les monstres sont elimines avant le boss.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/dernier.png"
      },
      {
        "name": "Mystique",
        "strategy": "Les combattants allies ne doivent infliger que des degats et soins de sorts (pas d'armes). Enleve la possibilite de deplacer les ennemis via Mer Cure, mais ces deplacements ne sont pas indispensables.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/mystique.png"
      },
      {
        "name": "Special : Voyez, il y a du monde",
        "strategy": "Chaque combattant allie doit commencer ou terminer son tour en ligne d'un ennemi. Eviter de finir en ligne avec Merkator tant qu'il y a des monstres (Maree Descendante). Une fois seul, taper en melee de preference.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 40 tours. Suffisamment de degats pour tomber rapidement les monstres ; contre Merkator seul, courir autour de la map en le tapant.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Ombre est invulnérable par défaut ; il faut placer sa Silhouette dans le glyphe blanc du G
  74: {
    "summary": "Ombre est invulnérable par défaut ; il faut placer sa Silhouette dans le glyphe blanc du Globilum tout en maintenant Ombre hors de ce glyphe pour lui retirer son invulnérabilité. La stratégie recommandée est de focus les monstres (Sombléro en premier) avant de gérer le placement Silhouette/Globilum pour abattre Ombre.",
    "recommendedLevel": "190",
    "composition": "Groupe capable de gérer les retraits PA/PM (Caznoar) et les soins adverses (Noctulule) ; personnages tanky utiles pour le succès Spécial (dégâts mêlée uniquement). Duo possible.",
    "keyResist": [
      "Neutre",
      "Eau",
      "Air"
    ],
    "phases": [
      {
        "title": "Salles préalables — monstres",
        "mechanics": [
          "Brutopak : applique Pesanteur (1 tour) sur tous les ennemis, peut se mettre Indéplaçable, attire et inflige dégâts eau ; échange de place (air) avec sa cible ; retire résistances de poussée en mêlée (terre).",
          "Caznoar : retire des PA à son attaquant sur dégâts à distance ; boost PM ; retire PA et repousse de 3 cases à courte distance (eau) ; dégâts neutre en mêlée avec réduction de 1 tour de durée d'effets.",
          "Noctulule : en début de tour soigne les alliés à rayon 2 de 10% PV max et inflige 10% d'érosion supplémentaire aux ennemis dans cette zone pour 2 tours ; frappe air en repoussant ; vole PM à 4PO (neutre).",
          "Panterreur : invisible 1 tour + renvoi 200 dommages 2 tours ; effet Planque (si poussé : redevient invisible + rend alliés rayon 2 invisibles) ; frappe neutre en mêlée (-10PM) ; sort feu en croix taille 3 à 3PO avec attraction vers le centre.",
          "Sombléro : buff alliés toutes les 3 tours (Brutopak = Invulnérabilité, Caznoar = portée Aigriffure +2 et +30 Retrait PA, Noctulule = portée Bouligane +3 et +30 Retrait PM, Panterreur = 200 Puissance) ; frappe neutre cercle rayon 2 autour de tous les monstres à max 10PO ; retire 10% résistances 2 tours (air) jusqu'à 7PO.",
          "Priorité d'élimination : Sombléro en premier (buffs alliés et dégâts à distance), puis Caznoar (retrait PA), puis Noctulule."
        ]
      },
      {
        "title": "Combat boss — Ombre",
        "mechanics": [
          "Ombre commence Invulnérable et dans l'état Lourd (permanent).",
          "Globilum : invoqué en début de combat, Invulnérable et Indéplaçable toute la durée ; laisse un glyphe blanc cercle rayon 3 à la fin de son tour (+20% dommages finaux aux ennemis dans le glyphe) ; se déplace d'1 case par tour ; repousse d'1 case les ennemis à son contact en début de tour.",
          "Silhouette : invoquée par le Globilum, état Lourd permanent ; frappe feu en fonction des PV érodés (40%) de la cible ; retire 10PM 1 tour + 20% d'érosion.",
          "Éclairage (début de tour d'Ombre) : 350 dégâts neutre aux ennemis dans cercle inversé rayon 6 autour du Globilum ; +50 dommages aux monstres dans cette zone 1 tour.",
          "Encrage : Ombre et la Silhouette deviennent Indéplaçables 1 tour et gagnent 100 Puissance 1 tour dès qu'ils sont déplacés ; on ne peut donc les déplacer qu'une seule fois par tour chacun.",
          "Liaison : attire la cible de 3 cases + Ombre se rapproche de 3 cases, 500 dégâts neutre ; dommages +30 au tour suivant ; ligne uniquement, 2 à 7PO, 2 fois/tour.",
          "Distorsion : 700 dégâts eau, cercle rayon 3 autour de lui, 1 fois/tour.",
          "Pénombre (à partir du tour 2, relance 3 tours) : +2PM à lui et ses alliés cercle rayon 2 pour 1 tour ; dommages de base de Distorsion augmentés de 20 à chaque dégât à distance reçu pendant 1 tour.",
          "Condition pour rendre Ombre vulnérable : Silhouette dans le glyphe blanc du Globilum ET Ombre hors du glyphe. Dès que la Silhouette sort ou qu'Ombre entre, il redevient invulnérable.",
          "La Silhouette a une IA fuyarde après avoir frappé ; elle a 7PM et ses sorts ont 5PO — lui laisser assez de PM pour reculer dans le glyphe après vous avoir attaqué, sinon retirer ses PM pour limiter ses déplacements.",
          "Le Globilum se déplace d'une case par tour : en tenir compte pour le placement de la Silhouette."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj33-globilum_orig.png",
            "caption": "Glyphe blanc du Globilum — zone +20% dommages finaux"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj33-silhouette_orig.png",
            "caption": "Placement de la Silhouette dans le glyphe pour retirer l'invulnérabilité d'Ombre"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj33-ombres-doubles_orig.jpg",
            "caption": "Schéma — Ombre dans le glyphe (invulnérable) vs configuration requise pour le rendre vulnérable"
          }
        ]
      }
    ],
    "tips": [
      "Accès : Dimension Obscure en [5,9] ; entrée de la dimension en [6,13] (voir guide Chemin vers Ombre).",
      "Recette de la clef : 2x Masque de la Vengeance, 2x Masque de la Violence, 2x Masque de la Vivacité, 2x Masque du Vide, 3x Mandragore, 3x Millet, 2x Espadon, 2x Viande Noire.",
      "Pierre d'âme de puissance 190 minimum pour capturer Ombre.",
      "Ne déplacer Ombre et la Silhouette qu'une fois par tour chacun (état Encrage).",
      "Retirer des PM à la Silhouette si elle a trop de PM pour finir dans le glyphe après avoir tapé.",
      "Le Globilum se déplace d'une case par tour — anticiper son mouvement pour le placement.",
      "Quêtes liées : L'armée des ombres, Une ombre au tableau."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Premier",
        "strategy": "Ombre doit être achevé en premier. Placer la Silhouette dans le glyphe du Globilum tout en gardant Ombre et les monstres à distance pour le focus en premier.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/premier.png"
      },
      {
        "name": "Collant",
        "strategy": "Les combattants alliés doivent finir leur tour sur une cellule adjacente à celle d'un autre combattant allié. Pas de difficulté particulière, juste finir son tour au contact d'un allié.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/collant.png"
      },
      {
        "name": "Spécial : Jeux d'ombres",
        "strategy": "Les combattants ennemis ne doivent subir que des dommages de mêlée. Personnages tanky recommandés. Éliminer Ombre en premier conseillé. Rappel : Silhouette dans le glyphe + Ombre hors du glyphe pour retirer l'invulnérabilité.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 26 tours. Reprendre la stratégie globale, pas de difficulté particulière.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Kanigroula n’a pas d’état Invulnérable, mais le combat est rendu dangereux par plusieurs e
  75: {
    "summary": "Kanigroula n’a pas d’état Invulnérable, mais le combat est rendu dangereux par plusieurs effets permanents. À la mort de Kanigroula, les monstres vivants gagnent PM, puissance et résistances; à la mort d’un monstre, les personnages perdent résistances et puissance. Les ennemis proches d’un personnage au début et à la fin de son tour gagnent aussi critique et puissance.",
    "recommendedLevel": "160 mentionné dans la fiche comme tranche de difficulté",
    "composition": "Jeu à distance et capacité à garder les monstres dangereux loin de l’équipe. Dégâts rapides utiles, surtout pour les succès Premier et Hardi.",
    "keyResist": [],
    "phases": [
      {
        "title": "Monstres du donjon",
        "mechanics": [
          "Alhyène : tape air/neutre à distance, tape feu en mêlée avec vol de vitalité, et retire provisoirement 30% de vitalité à distance.",
          "Félygiène : dégâts air longue portée, vol d’agilité, malus de résistance et de portée.",
          "Kaniblou : dégâts feu à distance, vol d’intelligence, soin des alliés, et peut faire passer le tour si la cible est poussée ou subit des dommages de poussée après Griffes enflammées.",
          "Kanihilan : rush jusqu’à 6PO avec dégâts air en zone, tape neutre en mêlée avec retrait PM, et renvoie les sorts à distance pendant 1 tour tous les 3 tours.",
          "Orfélin : dangereux en mêlée, dégâts terre, vol de force, 20% érosion, et réduction des dommages subis en mêlée pendant 2 tours.",
          "Panthégros : tape surtout eau en mêlée, vole de la chance, OS les invocations en cercle 2 et minimise les effets aléatoires."
        ]
      },
      {
        "title": "Kanigroula — effets permanents",
        "mechanics": [
          "Odorat Bestial révèle toutes les entités invisibles ennemies au début de chaque tour.",
          "Sauvagerie : quand Kanigroula meurt, tous les monstres vivants gagnent 2PM, 200 puissance et 10% résistances pour tout le combat.",
          "Mort Méphitique : quand un monstre meurt, les personnages perdent 10% résistances et 50 puissance pour tout le combat, cumulable.",
          "Phéromones Sauvages : au début et à la fin du tour d’un personnage, les ennemis dans un cercle 2 autour de lui gagnent 10% critique et 100 puissance pour 1 tour, cumulable.",
          "Kanigroula peut donner 3PA à tous ses alliés à partir du tour 2 puis tous les 2 tours, avec des bonus propres à certains sorts de monstres."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/3307502_orig.png",
            "caption": "Effets permanents du combat Kanigroula"
          }
        ]
      },
      {
        "title": "Stratégie globale",
        "mechanics": [
          "La stratégie la plus sûre est de tuer les monstres avant Kanigroula.",
          "Kanigroula a une IA fuyarde : la laisser s’éloigner pendant que l’équipe gère les monstres.",
          "Focus le Kaniblou en premier, car il est dangereux à distance et peut soigner.",
          "Garder l’Orfélin à distance et le focus en deuxième, plutôt à distance à cause de Boubou.",
          "Achever le Kanihilan en troisième, en faisant attention à son renvoi de sort; le taper en mêlée évite ce renvoi.",
          "Une fois les monstres morts, focus Kanigroula de préférence à distance, car Rugissement Matriarcal peut infliger de lourds dégâts autour d’elle si elle a beaucoup de PV."
        ]
      }
    ],
    "tips": [
      "Le choix de tuer Kanigroula ou les monstres en premier complique forcément la suite à cause des effets de mort.",
      "Pour Premier, il faut tuer Kanigroula rapidement puis finir vite les monstres boostés.",
      "Pour Hardi, garder le Kanihilan en vie peut fournir un ennemi au contact si Kanigroula et Kaniblou fuient."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Premier",
        "strategy": "Kanigroula doit être achevée en premier. La focus rapidement, garder Orfélin et Kanihilan à distance, puis finir vite les monstres boostés.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/premier.png"
      },
      {
        "name": "Hardi",
        "strategy": "Finir adjacent à un ennemi. Focus l’Orfélin très rapidement, puis choisir entre Kanigroula ou Kaniblou selon les dégâts disponibles; garder Kanihilan en vie peut aider à valider Hardi.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/hardi.png"
      },
      {
        "name": "Spécial : Crocs à crocs",
        "strategy": "Les ennemis ne doivent subir que des dommages en mêlée. Les monstres seront boostés par les phéromones; éliminer les monstres en premier en commençant par Kaniblou.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Reprendre la stratégie globale avec 2 personnages en moins de 20 tours.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Le Palais du roi Nidas est un donjon de dimension en une seule salle avec 5 vagues de mons
  76: {
    "summary": "Le Palais du roi Nidas est un donjon de dimension en une seule salle avec 5 vagues de monstres. La première vague arrive au tour 1, puis une nouvelle vague tous les 5 tours (6, 11, 16, 21) ou immédiatement si la vague précédente est éliminée. Le combat demande de tuer les monstres assez vite pour ne pas être submergé, tout en gérant le Roi Nidas et la Boubourse.",
    "recommendedLevel": "220 pour le Roi Nidas; monstres 212 dans le tableau de la fiche",
    "composition": "Jeu à distance conseillé. Priorités de rôles indiquées : dégâts à distance, entrave PM/PO, placement. Pour farm : Roublard pour Kaboom/bombes, trois tapeurs à distance, un ou deux personnages d’entrave PM/PO.",
    "keyResist": [],
    "phases": [
      {
        "title": "Vagues dimensionnelles",
        "mechanics": [
          "Une seule salle avec boss dès le début et 5 vagues de monstres.",
          "Les vagues arrivent aux tours 1, 6, 11, 16 et 21, ou plus tôt si tous les monstres de la vague sont tués.",
          "Les monstres des nouvelles vagues sont invulnérables jusqu’à ce qu’ils aient joué au moins un tour.",
          "Les vagues réapparaissent sur les cases initiales; si une vague précédente est encore vivante, les nouveaux monstres jouent en fin de timeline.",
          "Les monstres de la première vague ont 6600 PV chacun; à partir de la vague 2, ils apparaissent avec 25% de vitalité de moins, soit 4950 PV."
        ]
      },
      {
        "title": "Monstres du palais",
        "mechanics": [
          "Barbétoal : Barbe à trucs augmente ses propres dommages de base à chaque lancer; Super saillant le boost en PM, puissance et état intaclable.",
          "Kamastérisk : applique Pesanteur et attire au début de son tour les cibles proches en ligne; peut se téléporter et taper air en zone.",
          "Lévitrof : Reflets placides force le personnage ciblé à le taper avant son prochain tour ou mourir; le prochain personnage qui l’endommage échange de place avec lui.",
          "Paspartou : peut rendre invulnérables les cibles ennemies au contact de la cible visée par Clémence; booste puissance en zone.",
          "Piloztère : donne 1000 bouclier aux entités à 1-2PO quand il est frappé; éviter les sorts de zone tant qu’il n’est pas mort."
        ]
      },
      {
        "title": "Roi Nidas et Boubourse",
        "mechanics": [
          "Attrape-mutin : à partir du tour 2, attire de 6 cases en ligne puis échange de position avec le Roi Nidas.",
          "Confusion : applique Zizanie; au tour suivant du Nidas, les personnages affectés infligent des dommages autour d’eux en cercle 2 et retirent 2 tours d’effets aux cibles touchées.",
          "Liquidation : dégâts feu puis seconde ligne eau selon 20% des PV érodés du lanceur.",
          "Toucher de Nidas invoque une Boubourse liée à un allié ou un ennemi.",
          "Mon Précieux : à partir du tour 4 puis tous les 3 tours, Nidas échange avec la Boubourse à 5PO sans ligne de vue, inflige 1000 terre à la Boubourse et réduit ses propres dommages finaux de 50%.",
          "Décoffrage tue la Boubourse au corps à corps."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/attrape-mutin_orig.png",
            "caption": "Attrape-mutin"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/confusion_orig.png",
            "caption": "Confusion"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/liquidation_orig.png",
            "caption": "Liquidation"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/mon-precieux_orig.png",
            "caption": "Mon Précieux"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/boubourse_orig.png",
            "caption": "Boubourse"
          }
        ]
      },
      {
        "title": "Stratégie globale",
        "mechanics": [
          "Jouer plutôt à distance pour éviter les coups au lieu de les tanker.",
          "Tuer les monstres assez rapidement pour ne pas avoir trop de vagues simultanément.",
          "Relire et surveiller surtout Lévitrof, Roi Nidas, Boubourse, Kamastérisk et Piloztère, cités comme les principaux dangers.",
          "Préférer garder la Boubourse dans le camp allié afin que Nidas ne puisse pas changer de place facilement avec elle.",
          "Si des alliés ont Zizanie, veiller à ce qu’aucun personnage ne soit à 2PO au tour suivant du Nidas."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/tactique_2_orig.png",
            "caption": "Tactique générale Roi Nidas"
          }
        ]
      }
    ],
    "tips": [
      "Retirer de la PO au Lévitrof le rend inoffensif; le tuer ou le frapper avec le personnage ciblé par Reflets placides évite la mort.",
      "Donner une Cawotte à exactement 5PO au Paspartou peut lui faire perdre des PM indirectement quand il recule après avoir tapé.",
      "Le Piloztère peut être achevé avec un sort de zone sans donner de bouclier après sa mort.",
      "Le trousseau et la téléportation devant le donjon ne fonctionnent pas en dimension."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Premier",
        "strategy": "Roi Nidas doit être achevé en premier. Utiliser une composition qui tape dans ses résistances les plus faibles, éviter terre selon la fiche, et prévoir de l’entrave pour les monstres. Bases citées : Roublard + Pandawa, ou Eliotrope + Ecaflip/Iop.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/premier.png"
      },
      {
        "name": "Statue",
        "strategy": "Finir sur sa case de début de tour. Jouer une composition très forte à distance avec beaucoup d’entrave; un Pandawa ou une classe qui déplace hors tour est vivement conseillé.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/statue.png"
      },
      {
        "name": "Spécial : Pingrerie",
        "strategy": "Lorsqu’un allié inflige des dommages, il doit être en ligne ou diagonale de sa cible. Attention aux zones qui toucheraient un monstre non aligné.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // La Galerie du Phossile est un donjon de dimension à 5 vagues
  79: {
    "summary": "La Galerie du Phossile est un donjon de dimension à 5 vagues. Le Phossile n’est pas invulnérable en stratégie normale; il faut surtout gérer Centrage, qui retire des PM aux monstres à plus de 8PO mais les soigne, et Abîme, qui OS les personnages dans un rayon de 3 autour du Phossile tous les 4 tours à partir du tour 5.",
    "recommendedLevel": "Non précisé dans la fiche",
    "composition": "Jeu à distance conseillé avec assez de dégâts pour éliminer le Phossile en premier avant le tour 5. Pandawa utile pour placer les monstres dans certains succès ou expéditions.",
    "keyResist": [],
    "phases": [
      {
        "title": "Vagues dimensionnelles",
        "mechanics": [
          "Une seule salle avec 5 vagues de monstres.",
          "Les vagues arrivent aux tours 1, 6, 11, 16 et 21, ou plus tôt si la vague en cours est éliminée.",
          "Les nouvelles vagues sont invulnérables pendant 1 tour à leur arrivée."
        ]
      },
      {
        "title": "Monstres du Phossile",
        "mechanics": [
          "Mère Veilleuse : Phouille donne Phobie, qui inflige des dégâts terre en vol de vie aux ennemis au contact au début du tour; Phormage déclenche différents effets selon le Phorreur ciblé.",
          "Métaphorreur : réduit fortement les dommages à distance subis par lui et ses alliés proches pendant 1 tour.",
          "Père Phorreur : échange avec un allié puis tape/attire en croix; sous Transfert, les attaques de mêlée le soignent lui et ses alliés proches.",
          "Phorrêveur : pose des glyphes PA ou soin, attire ses alliés, et pose un glyphe qui réduit de 50% les dommages subis des monstres dedans.",
          "Phozami : téléportation en ligne et dégâts air en zone; peut rendre ses alliés proches intaclables et leur faire gagner des PM quand il subit des dégâts à distance."
        ]
      },
      {
        "title": "Phossile — Abîme, Glyphiphi, Centrage",
        "mechanics": [
          "Abîme : tous les 4 tours à partir du tour 5 (T5, T9, T13...), le Phossile OS tous les personnages dans un cercle de rayon 3 autour de lui au début de son tour.",
          "Glyphiphi : lorsqu’un personnage ou un monstre hors Phossile est poussé ou attiré, il dépose sous lui un glyphe rouge d’une case pendant 3 tours; ce glyphe augmente les dommages subis de 30% tant qu’on est dedans.",
          "Centrage : quand un personnage finit son tour, les ennemis à plus de 8PO de lui perdent 1PM pour 1 tour et sont soignés de 300; les alliés dans un cercle 4 autour de lui sont aussi soignés."
        ]
      },
      {
        "title": "Stratégie globale",
        "mechanics": [
          "Jouer à distance et éliminer le Phossile en premier.",
          "Placer les personnages à moins de 8PO du Phossile pour éviter que Centrage le soigne.",
          "Idéalement tuer le Phossile avant le tour 5 pour éviter Abîme.",
          "Si le Phossile est encore vivant au tour 4, éloigner tous les personnages à plus de 3PO avant son tour 5.",
          "Après la mort du Phossile, achever les vagues de monstres.",
          "Appliquer Pesanteur au Phossile ou au Père Phorreur peut empêcher Tunnellipse d’échanger de place.",
          "Sortir le focus du glyphe Appel à l’aide du Phorrêveur avant de taper, car il réduit les dommages subis de 50%."
        ]
      }
    ],
    "tips": [
      "Pour Liberté, l’effet Centrage peut faire échouer le succès en retirant des PM aux monstres à plus de 8PO.",
      "Le Phorrêveur a une IA fuyarde : le tacler ou le bloquer aide à éviter qu’il s’éloigne.",
      "En expédition Audace, placer des monstres au contact du Phossile avant son tour lui retire des PV selon le nombre de monstres en mêlée."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Hardi",
        "strategy": "Finir adjacent à un ennemi. Bien placer les personnages dès le tour 1 car les cases de départ sont éloignées. La fiche conseille de le faire avec Liberté.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/hardi.png"
      },
      {
        "name": "Liberté",
        "strategy": "Ne pas tenter de retirer PM ou PO. Attention à Centrage : rester près des monstres, se regrouper et forcer les monstres à venir au contact; Pandawa utile pour replacer les nouvelles vagues.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/liberte.png"
      },
      {
        "name": "Spécial : Diagonale du vide",
        "strategy": "Les alliés ne doivent pas terminer leur tour en diagonale d’un ennemi ou allié. Placer les personnages en ligne face aux monstres pour éviter les diagonales.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Reprendre la stratégie globale à 2 personnages en moins de 30 tours.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Le Ring du Capitaine Ekarlatte est un donjon de dimension (Srambad) en une seule salle ave
  81: {
    "summary": "Le Ring du Capitaine Ekarlatte est un donjon de dimension (Srambad) en une seule salle avec 5 vagues de monstres. Le Capitaine Ekarlatte est présent dès le début et peut déplacer les joueurs via des attractions, échanges de place et téléportations. La stratégie conseille de l'éliminer rapidement pour limiter les perturbations.",
    "recommendedLevel": "Variable (donjon de dimension Srambad)",
    "composition": "Équipe modulaire (1 à 4 joueurs) ; aucune recommandation de classe particulière indiquée.",
    "keyResist": [
      "Variable (voir résistances)"
    ],
    "phases": [
      {
        "title": "Salle unique — 5 vagues de monstres",
        "mechanics": [
          "Un seul combat en une salle unique (donjon de dimension Srambad).",
          "Le Capitaine Ekarlatte est présent dès le début du combat avec 3 autres monstres (en groupe de 4 joueurs) + 1 monstre supplémentaire par personnage additionnel.",
          "5 vagues de monstres : chaque vague arrive à un nombre de tours défini ou immédiatement si tous les monstres précédents sont éliminés.",
          "La timeline en bas à droite indique le chrono des vagues.",
          "Conseil : tuer rapidement les monstres de chaque vague pour éviter l'accumulation (10+ monstres simultanés).",
          "Capitaine Ekarlatte : peut attirer les joueurs, échanger de place, téléporter — il perturbe les positions de l'équipe.",
          "Tromblion : possède un piège qui pousse de 2 cases — danger pour le succès spécial."
        ]
      }
    ],
    "tips": [
      "Ce donjon ne se capture pas et le trousseau de clef ne fonctionne pas ici.",
      "La téléportation vers le donjon est également désactivée.",
      "Accès en Srambad, zone Ruelles des Eaux-Suaires en [6,3] ; parler à Guy Cheutié (dans le mur à droite) pour entrer.",
      "Recette de la clef : 2x Raie Bleue, 3x Graine de Pandouille, 2x Viande Persillée, 1x Insigne de Malveilleur, 2x Foulard de Milimaître, 2x Sacoche de Kartouche, 2x Os de Sramouraï, 2x Bandelette de Tromblion.",
      "L'Insigne de Malveilleur s'achète contre 1x Orichor auprès du PNJ Collecteur Tess en [2,2] dans Srambad (Orichors obtenus via quêtes de dimensions divines).",
      "Quêtes liées : « Un ring pour les gouverner tous » et « L'anneau de Tot ».",
      "Parler au Capitaine Ekarlatte à la fin du combat pour sortir du donjon."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Sortie de ring",
        "strategy": "Les alliés doivent terminer leur tour sur leur cellule de début de combat. Éliminer le Capitaine Ekarlatte en priorité car il peut déplacer les joueurs (attraction, échange de place, téléportation). Faire attention au piège du Tromblion qui pousse de 2 cases : si ce dernier est en vie, conserver toujours 2 PM supplémentaires pour revenir à sa cellule de départ.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Le Toxoliath est le boss de la Cave du Toxoliath, donjon de dimension (Srambad) à 5 vagues
  82: {
    "summary": "Le Toxoliath est le boss de la Cave du Toxoliath, donjon de dimension (Srambad) à 5 vagues. La mécanique centrale est Toxmose : frapper le boss inflige un poison eau de 700 dégâts par PM utilisé pendant 2 tours. Il faut le tuer avant le tour 6 pour éviter son sort Poison Volatile.",
    "recommendedLevel": "180 — 200",
    "composition": "Classes à distance conseillées ; classes avec sorts de désenvoûtement (Eniripsa, etc.) très utiles contre les nombreux poisons. Pour le succès Duo : Cra, Steamer ou classes à gros dégâts distance.",
    "keyResist": [
      "Variable (voir résistances)"
    ],
    "phases": [
      {
        "title": "Vague 1 — Tour 1 : Le Toxoliath + monstres initiaux",
        "mechanics": [
          "Toxmose (passif permanent) : chaque ligne de dégâts infligée au Toxoliath applique un poison eau de 700 dégâts par PM utilisé pendant 2 tours (non cumulable).",
          "Flacune : 550 dégâts neutre + 20% érosion (1 tour) + poison neutre 70 dégâts/PA utilisé. Jusqu'à 2 PO, lançable 3 fois/tour, cumulable 2 fois.",
          "Venin Salvateur : cible violette, +50% dégâts subis, soigne les attaquants de 150% des dégâts infligés, perd 1 tour d'envoûtement par ligne de dégâts. PO infinie, 1 fois/tour.",
          "Vile Ruse : 400 dégâts air + poison fin de tour 350 dégâts air pendant 5 tours. En ligne jusqu'à 7 PO, 3 fois/tour.",
          "Priorité absolue : tuer le Toxoliath avant son tour 6 pour éviter Poison Volatile.",
          "Ne pas utiliser de PM après avoir frappé le Toxoliath (poison 700 dégâts/PM). Utiliser sorts de déplacement (Bond, Téléportation) si besoin.",
          "Option : tuer le Toxoliath en un seul tour avec un personnage — le poison disparaît à la mort du boss.",
          "Sorts de désenvoûtement très utiles pour atténuer les nombreux poisons."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj25-506_orig.jpg",
            "caption": "Zone d'effet du glyphe Poison Volatile (augmente dégâts subis)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj25-poison-volatile_orig.png",
            "caption": "Schéma sort Poison Volatile"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj25-venin-salvateur_orig.png",
            "caption": "Schéma sort Venin Salvateur"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj25-flacune_orig.png",
            "caption": "Schéma sort Flacune"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj25-vile-ruse_orig.png",
            "caption": "Schéma sort Vile Ruse"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj25-500_orig.png",
            "caption": "Illustration effet Toxmose sur le joueur"
          }
        ]
      },
      {
        "title": "Monstres des vagues — Eperfide",
        "mechanics": [
          "Brûlurgence : 250 dégâts feu en zone cercle taille 2 + retire 5 PA esquivables (1 tour). 4-10 PO sans LdV.",
          "Drain : 400 dégâts air en vol de vie. 2-5 PO sans LdV, 2 fois/tour.",
          "Etoile d'Arakne : 250 dégâts terre + glyphe étoile taille 2 pendant 2 tours (Pesanteur, -4 PM esquivables ; 100 dégâts terre supplémentaires en vol de vie par dégât subi dans le glyphe). En ligne 3-7 PO sans LdV.",
          "Priorité : tuer les Eperfides en premier — portée élevée, sans LdV, dégâts élevés et retraits PA/PM."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj25-brulurgence_orig.png",
            "caption": "Schéma sort Brûlurgence (Eperfide)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj25-drain_orig.png",
            "caption": "Schéma sort Drain (Eperfide)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/editor/dj25-etoile-d-arakne.png?1644262453",
            "caption": "Schéma sort Etoile d'Arakne (Eperfide)"
          }
        ]
      },
      {
        "title": "Monstres des vagues — Lucrane",
        "mechanics": [
          "Carapace Gardée (passif) : renvoie 50% des dégâts subis + poison neutre 120 dégâts/ligne de dégâts au début du prochain tour de l'attaquant. Infliger des dégâts de poussée retire l'effet mais rend la Lucrane Indéplaçable pendant 1 tour.",
          "Offensivière : rush vers la cible + 250 dégâts air. En ligne 2-6 PO, 2 fois/tour.",
          "Pinsecte : retire 50% des PV actuels de la cible pour 1 tour. En ligne jusqu'à 2 PO, 2 fois/tour.",
          "Tactique : infliger des dégâts de poussée AVANT de frapper la Lucrane pour désactiver Carapace Gardée."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj25-offensiviere_orig.png",
            "caption": "Schéma sort Offensivière (Lucrane)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj25-pinsecte_orig.png",
            "caption": "Schéma sort Pinsecte (Lucrane)"
          }
        ]
      },
      {
        "title": "Monstres des vagues — Morfrelon",
        "mechanics": [
          "Dardagnan : poison eau début de tour 350 dégâts pendant 3 tours. En mêlée, 2 fois/tour.",
          "Plongeon Quille : 350 dégâts neutre + vole 3 PO pour 2 tours. 3-7 PO sans LdV, 2 fois/tour.",
          "Puissance Cible : gagne 100 de puissance par ligne de dégâts subis pendant 2 tours. Relance 3 tours.",
          "IA craintive : le Morfrelon fuit si vous êtes proches et accumule de la portée. Retirer sa PO et rester loin de lui."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj25-dardagnan_orig.png",
            "caption": "Schéma sort Dardagnan (Morfrelon)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj25-plongeon-quille_orig.png",
            "caption": "Schéma sort Plongeon Quille (Morfrelon)"
          }
        ]
      },
      {
        "title": "Monstres des vagues — Puceronde",
        "mechanics": [
          "Brazéro : dégâts feu équivalents à 30% (36% en critique) des PV manquants de la Puceronde. En mêlée, 2 fois/tour.",
          "Langagement : téléportation + attire personnages en cercle taille 3 de 2 cases + état Pesanteur 1 tour + état Langagement (chaque poussée applique poison air 50 dégâts/PA utilisé). En ligne 2-7 PO sans LdV, lançable à partir du tour 3.",
          "Largage Personnel : 250 dégâts terre + 50% des PV érodés de la cible en dégâts terre en cercle taille 2. 1 fois/tour.",
          "Très dangereuse en mêlée si elle a peu de PV ou si la cible a beaucoup d'érosion."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj25-brazero_orig.png",
            "caption": "Schéma sort Brazéro (Puceronde)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj25-langagement_orig.png",
            "caption": "Schéma sort Langagement (Puceronde)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/editor/dj25-largage-personnel.png?1644262627",
            "caption": "Schéma sort Largage Personnel (Puceronde)"
          }
        ]
      },
      {
        "title": "Monstres des vagues — Scoliopode",
        "mechanics": [
          "Coup Percutant : 400 dégâts eau + poison 75 dégâts terre/PM utilisé pendant 1 tour. Tue les invocations automatiquement. En mêlée, 2 fois/tour.",
          "Poison Incurable : chaque ligne de dégâts subie applique état Insoignable à l'attaquant + vole 2 PM esquivables pour 1 tour. Relance 3 tours.",
          "Salivraison : 300 dégâts neutre + attire d'1 case + 15% érosion pour 2 tours. En ligne jusqu'à 3 PO sans LdV.",
          "Attendre la fin de Poison Incurable avant de focus si on ne peut pas tuer en un tour."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj25-coup-percutant_orig.png",
            "caption": "Schéma sort Coup Percutant (Scoliopode)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj25-salivraison_orig.png",
            "caption": "Schéma sort Salivraison (Scoliopode)"
          }
        ]
      },
      {
        "title": "Vagues 2 à 5 — Tours 6/11/16/21",
        "mechanics": [
          "5 vagues au total apparaissant aux tours 1/6/11/16/21 ou dès que tous les adversaires sont morts.",
          "Les monstres d'une nouvelle vague sont invulnérables pendant 1 tour à leur arrivée.",
          "Priorité de focus : Eperfides > Morfrelon > Scoliopode > Puceronde > Lucrane.",
          "A partir du tour 6, le Toxoliath lance Poison Volatile (si encore vivant) : -2 PA, +2 PM, poison feu début de tour 350 dégâts + glyphe cercle inversé taille 8 (+50% dégâts subis dans la zone) pendant 2 tours. Relance 4 tours.",
          "Tuer assez vite chaque vague pour éviter de cumuler trop de monstres simultanément."
        ]
      }
    ],
    "tips": [
      "Position du donjon : dimension divine Srambad en [8,8].",
      "Recette de la clef : 2x Mandragore, 2x Millet, 2x Tanche, 2x Patte de Scoliopode, 2x Aile de Puceronde, 2x Venin d'Eperfide, 2x Pince de Lucrane, 1x Chitine de Nécrotique (achat contre 2x Orichor à l'avant-poste de Srambad en [2,2]).",
      "Donjon de dimension : trousseau de clef et téléportation de groupe ne fonctionnent pas. Recherche de portail obligatoire.",
      "Une seule salle avec 5 vagues (donjon modulaire : boss + 3 monstres pour 4 combattants, +1 par combattant supplémentaire).",
      "Ce Boss ne peut pas être capturé.",
      "Quêtes liées : L'art me ment ; Le disparu de Sufokia (niv. 190-200) ; Depuis l'enfer (après succès Circulez) ; Les gloutons des dimensions.",
      "Ne pas utiliser de PM après avoir frappé le Toxoliath (poison Toxmose 700 dégâts/PM). Utiliser sorts de déplacement sans PM (Bond, Téléportation, rush).",
      "Infliger des dégâts de poussée à la Lucrane avant de la frapper pour désactiver Carapace Gardée.",
      "Sorts de désenvoûtement (ex. Mot de Jouvence Eniripsa) essentiels pour annuler les nombreux poisons."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Circulez !",
        "strategy": "Ne pas retirer de PM aux adversaires pendant toute la durée du combat. Plus difficile sans contrôle de distance : privilégier classes pouvant pousser ou avec gros dégâts. Le retrait de PO reste autorisé.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/circulez.png"
      },
      {
        "name": "Misanthrope",
        "strategy": "Les combattants alliés ne doivent jamais finir leur tour sur une cellule adjacente à un autre allié. Se placer correctement avant de frapper le Toxoliath car on ne pourra plus utiliser de PM après.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/misanthrope.png"
      },
      {
        "name": "Relation toxique (Succès Spécial)",
        "strategy": "Eliminer le Toxoliath en dernier. Survivre aux 5 vagues avant de tuer le boss. A partir du tour 6 et tous les 4 tours, glyphe cercle inversé taille 8 qui augmente les dégâts subis de 50% à chaque poison subi. Soins nécessaires. Eperfides à focus en priorité.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 40 tours. Classes à gros dégâts distance recommandées (Cra, Steamer) pour niveau 180. Faisable sans contrainte de classe à niveau 200.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Le Trône de la Cour Sombre est un donjon de dimension (Srambad) avec une seule salle et 5 
  83: {
    "summary": "Le Trône de la Cour Sombre est un donjon de dimension (Srambad) avec une seule salle et 5 vagues de monstres, dont le boss est la Reine des Voleurs. La mécanique centrale tourne autour des Bonbombes invoquées automatiquement par les personnages : rouges elles tuent en ligne, bleues elles soignent. La clé est de maîtriser leur placement pour en faire des alliés plutôt que des ennemis.",
    "recommendedLevel": "200",
    "composition": "Crâ (maintien à distance, repoussées) + Enutrof (ralentissement) recommandés. Pandawa + Roublard efficace pour exploser la Reine rapidement. Faisable avec toutes compositions.",
    "keyResist": [
      "Variable (voir résistances)"
    ],
    "phases": [
      {
        "title": "Mécanique des Bonbombes",
        "mechanics": [
          "Chaque personnage invoque automatiquement une Bonbombe à 2PO devant lui au début de son tour.",
          "Quand un personnage a 2 Bonbombes sur le terrain, la première explose, entraînant une réaction en chaîne avec les bombes en ligne.",
          "Bonbombe rouge : OS tous les personnages (et invocations) en ligne à 10PO et inflige ~1200 dégâts feu aux ennemis.",
          "Bonbombe bleue (obtenue si une bombe explose en diagonale d'elle) : soigne intégralement les personnages en ligne à 10PO et inflige ~1200 dégâts feu aux ennemis.",
          "La Reine des Voleurs est immunisée aux dégâts des Bonbombes.",
          "Pour chaque Bonbombe présente sur le terrain, la Reine subit 10% de dégâts en moins.",
          "Les Bonbombes sont invulnérables mais déplaçables par poussée (pas par porter/jeter — état Lourd).",
          "Placement Autowin : aligner les personnages en colonne pour que les bombes forment des lignes propres qui n'explosent jamais sur les alliés."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj4-fonctionnement-bombes_orig.png",
            "caption": "Schéma de fonctionnement des Bonbombes (ordre d'explosion, rouges/bleues)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj4-invocation-bonbombe_orig.jpg",
            "caption": "Ordre d'invocation des Bonbombes autour du personnage (sens horaire)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj4-placement-autowin_orig.png",
            "caption": "Placement Autowin : personnages en colonne, bombes en lignes latérales inoffensives"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj4-placement-debut-combat-4_orig.png",
            "caption": "Placement en phase de préparation à 4 pour la tactique Autowin"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj4-placement-debut-combat-5_orig.png",
            "caption": "Placement en phase de préparation à 5 pour la tactique Autowin"
          }
        ]
      },
      {
        "title": "Boss : Reine des Voleurs — Sorts",
        "mechanics": [
          "Coup Critique : 50% CC. Normal : ~900 dégâts eau + poison (perd 20 PV par PM utilisé pendant 1 tour). CC : réduit effets de 4 tours, ~1500 dégâts tous éléments + même poison. Càc uniquement, 2/tour.",
          "Mort en Sursis : La Reine s'attire sur la cible et échange de position. Applique l'état Mort en sursis à l'ennemi : mort dans 6 tours si non soigné par Bonbombe bleue ou Reine non tuée. Inflige dégâts air proportionnels aux PV érodés de la Reine. En ligne, 5PO max, 2/tour.",
          "Péché Mignon : A la mort de la Reine, les personnages subissent 50% de dégâts supplémentaires pour le reste du combat.",
          "Brume : Pose un glyphe noir de rayon 3 autour d'elle, la rend invisible dans le glyphe (et tous les monstres présents aussi). La Reine ne peut se trouver que sur 3 cases précises (rayon supérieur du glyphe, 33% chacune). Pas avant le tour 4, relance 3 tours."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj4-placement-reine-brume_orig.png",
            "caption": "Les 3 cases possibles de la Reine des Voleurs dans sa Brume (en rouge)"
          }
        ]
      },
      {
        "title": "Monstres du donjon",
        "mechanics": [
          "Bourôliste — Coupable : ~1000 dégâts eau + réduit durée effets de 2 tours ; tue les invocations. Càc uniquement, 2/tour.",
          "Bourôliste — Tournoyade : Enlève 10PM esquivable + état Pesanteur 2 tours ; si déplacement dans ces 2 tours : 500 dégâts air. Càc uniquement, relance 3 tours.",
          "Bourôliste — Vers la Lumière : Attire la cible de 6 cases. En ligne, 2-7PO, 2/tour.",
          "Doublure — Doublage : Crée un double + rend Doublure invisible 1 tour. Double et Doublure partagent les dégâts et gagnent 100 puissance infini à chaque coup reçu. Après 3 tours, le double meurt et inflige 600 dégâts terre en cercle rayon 2. 2PO max, relance 3 tours.",
          "Doublure — Coupe Circulaire : 600 dégâts feu + vole 2PM esquivable + retire 3PA esquivables en cercle rayon 2. Le double répète ce sort en fin de tour. 1/tour.",
          "Doublure — Subtilité : Echange de position avec le double (6PO) ; zone rayon 2 autour de la Doublure : 500 dégâts neutre + repoussé 2 cases ; zone taille 3 autour du double : 500 dégâts neutre + attiré 3 cases. 1/tour.",
          "Mâchassin — Piège à Le Ours : 500 dégâts feu + pose 4 pièges autour de la cible (500 dégâts feu au déclenchement). 8PO max, 2/tour.",
          "Mâchassin — Sans se Mouiller : ~600 dégâts eau + retire 3PA esquivables. En ligne, 4-10PO, 2/tour.",
          "Magouille — Avertissement : Envoûtement sur elle et alliés à 3PO : si on les frappe, pose un poison de 300 dégâts eau (2 tours). Cumul max 3, relance 3 tours.",
          "Magouille — Crâmes : 650 dégâts neutre + piège taille 2 en diagonale (enlève 10PM esquivable + soigne 10% PV max en rayon 2 au déclencheur). 4-8PO, 2/tour.",
          "Magouille — Crânéantissement : 550 dégâts terre + soigne toutes entités en rayon 2 autour de la cible de 15% PV max (alliés et ennemis). 3-7PO, 1/tour.",
          "Terristocrate — Attentat : 750 dégâts neutre en cercle rayon 4. 1/tour.",
          "Terristocrate — Bombe Illicale : 500 dégâts neutre vol de vie + invoque une Bombe Illicale indéplaçable au càc de la cible. Explose au prochain tour du Terristocrate ou à sa mort, tuant tout dans rayon 2. Quand un allié frappe un monstre, la bombe se rapproche de 3 cases. 6PO max, relance 3 tours.",
          "Terristocrate — Fumérus : Téléportation en ligne à 4PO + ~700 dégâts air vol de vie + retire 4PO pour 1 tour en rayon 2 autour de sa case d'arrivée. En ligne, 4PO max, relance 2 tours."
        ]
      },
      {
        "title": "Vagues de monstres et stratégie globale",
        "mechanics": [
          "5 vagues au total ; le boss est présent dès le début. Les vagues arrivent à intervalles définis ou immédiatement si la vague courante est éliminée plus tôt.",
          "Chaque vague est invulnérable 1 tour à son arrivée.",
          "Vague 1 : Focus le Terristocrate (Bombe Illicale dangereuse), commencer à taper la Reine.",
          "Vague 2 : Retirer la PO de la Magouille, tuer les 2 Doublures facilement. Continuer sur la Reine (idéalement la tuer vague 2).",
          "Vague 3 : 2 Terristocrates + 1 Magouille. Retirer PO de la Magouille, ralentir les Terristocrates, focus un Terristocrate puis l'autre.",
          "Vague 4 (la plus difficile) : 2 Magouilles (3 si 6+ joueurs) + 1 Terristocrate. Retirer PO des 2 Magouilles, focus Terristocrate puis Magouilles.",
          "Vague 5 : 1 Magouille (+ 1 Terristocrate si 5 joueurs). Retirer PO, tuer tranquillement.",
          "Placer les monstres dans les lignes des Bonbombes pour qu'ils subissent un maximum de dégâts (jusqu'à 4000+ par tour).",
          "Retirer la PO des Magouilles en priorité (sort Crâmes : 0PM + risque de se retrouver dans une ligne de bombes).",
          "Retirer les PM des Terristocrates pour retarder la Bombe Illicale.",
          "Tuer la Reine le plus tôt possible ; profiter des moments où peu de Bonbombes sont présentes (chaque bombe = -10% dégâts sur la Reine).",
          "Si Bombe Illicale au càc : éloignez-vous à plus de 2PO, attirez la bombe vers vous en tapant un monstre, puis revenez. Ou placez une Cawotte pour la bloquer."
        ]
      }
    ],
    "tips": [
      "Position du donjon : dimension Srambad en [8,-4]. Accès via portail depuis la Tour des Voyageurs en [-22,-24].",
      "Recette de la clef : 1 Perce-Neige + 1 Poisskaille + 1 Frostiz + 2 Pièges désamorcés de Mâchassin + 2 Mèches de bombe de Terristocrate + 2 Chouchous de Doublure + 2 Epaulettes de Bourôliste + 1 Etoffe de la Cour Sombre (achat à l'avant-poste de Srambad contre 3 Orichor).",
      "Le trousseau de clef ne fonctionne pas en dimension ; la téléportation de groupe devant le donjon non plus.",
      "Ce boss ne peut pas être capturé.",
      "Quêtes liées : La cour des miracles, L'oeuf de Crocabulia, Les totems de Maïmane.",
      "Modificateurs actifs (Srambad, 10 au total) : Coups Bas (+25% dégâts indirects), Invocations incapacitantes, Berserker (+33% dégâts si <50% PV), Disparitions détonantes, Jeu dangereux (piège à ses pieds), Poussées revigorantes, Larcin (vol de vie mêlée), Liaison longue portée (20% dégâts renvoyés à 10+ PO), Evasion (repousse de 3 cases en mêlée), Puissance cyclique (+50% vitalité ennemis, +25% dégâts alliés par tour cumulable tous les 5 tours).",
      "Péché Mignon : +50% dégâts subis après la mort de la Reine — anticiper la gestion des vagues restantes.",
      "Un modificateur ne change qu'après avoir terminé le donjon niveau 200 de la zone."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Collant",
        "strategy": "Les combattants alliés doivent finir leur tour sur une cellule adjacente à un autre allié. Avec Autowin, placer des invocations fixes (Cawottes) à gauche de chaque personnage. Le dernier personnage place son invocation derrière lui. Alternative sans Autowin : se coller aux bombes ou aux autres personnages.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/collant.png"
      },
      {
        "name": "Premier",
        "strategy": "La Reine des Voleurs doit être achevée en premier. S'assurer que les Bonbombes ne tuent aucun monstre avant. Roublard : mur de bombes + explosion tour 3 ou 4. Iop : charger la colère tour 1 et tuer la Reine au tour 4.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/premier.png"
      },
      {
        "name": "Spécial : La vie est une chausse-trappe",
        "strategy": "Les alliés ne doivent pas être soignés par les Bonbombes bleues. Rester à 100% PV ou décaler les bombes bleues hors de sa ligne. Alternative : aligner tous les personnages sur une même ligne et se déplacer ensemble à chaque tour — aucune bombe ne devient bleue. Attention : une invocation alliée soignée fait échouer le succès.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Trio",
        "strategy": "Vaincre tous les monstres avec 3 personnages maximum en moins de 80 tours. Option Cra + Enutrof + classe : combat normal. Option Pandawa + Roublard + classe : tuer la Reine tour 3-4 avec mur de bombes puis reformer un mur pour chaque vague. Autre composition : tuer la Reine idéalement tour 5-6.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/trio.png"
      }
    ]
  },
  // Le Ventre de la Baleine est un donjon de Frigost où tous les monstres (les Krobes) sont in
  84: {
    "summary": "Le Ventre de la Baleine est un donjon de Frigost où tous les monstres (les Krobes) sont invulnérables : ils ne peuvent être éliminés qu'en respectant une condition spécifique pendant 5 tours consécutifs. Le boss, le Protozorreur, est invulnérable et indéplaçable sauf via une mécanique d'attirance en ligne combinée à un glyphe violet (Protoglyphe infectieux) ; il doit rester dans l'état Infection pendant 10 tours consécutifs pour mourir.",
    "recommendedLevel": "120 — 150",
    "composition": "Enutrof retrait PM (initiative recommandée, peut s'infliger des dégâts avec Lancer de pièce) ou un personnage tank. Classes de dégâts à distance en appui. Eliotrope et Pandawa conseillés pour le succès Statue.",
    "keyResist": [
      "Variable (voir résistances)"
    ],
    "phases": [
      {
        "title": "Mécanique Dislocation — la Malamibe",
        "mechanics": [
          "Tous les Krobes sont invulnérables ; les dégâts leur sont infligés via la Malamibe qui intercepte tous les dégâts reçus par les monstres.",
          "Malamibe : 2 000 PV par personnage encore en vie (les invocations ne comptent pas, les compagnons oui).",
          "Taper directement la Malamibe : réduction 50 % des dégâts. Taper un Krobe : dégâts transmis à la Malamibe normalement (200 % × 50 % = 100 %).",
          "Si un personnage meurt, la Malamibe perd instantanément 2 000 PV ; si elle a moins de 2 000 PV elle meurt.",
          "DANGER : si la Malamibe reste en vie 2 tours complets, elle OS toute l'équipe.",
          "La Malamibe est réinvoquée par le prochain ennemi qui joue après sa mort.",
          "Pour augmenter les dégâts sur la Malamibe (ex. vulnérabilité Pandawa), appliquer le debuff sur la Malamibe et non sur le Krobe frappé."
        ]
      },
      {
        "title": "Mécanique Restauration — élimination des Krobes",
        "mechanics": [
          "Bacterrib (Restauration Éloignée) : ne doit avoir aucun adversaire à 5 PO ou moins au début de son tour, pendant 5 tours consécutifs.",
          "Pataugerme (Restauration Élémentaire) : doit être tapé dans les 4 éléments (Terre, Feu, Eau, Air) à chaque tour pendant 5 tours consécutifs.",
          "Tabacille (Restauration Curative) : ne pas soigner pendant 5 tours consécutifs (le vol de vie est autorisé).",
          "Verminocule (Restauration de Proximité) : un personnage doit être au contact au début du tour du Verminocule pendant 5 tours consécutifs (invocations non prises en compte).",
          "Virustine (Restauration Mobile) : ne pas la déplacer ni lui retirer des PM pendant 5 tours consécutifs ; les déplacements par ses alliés (échange de place du Tabacille) réinitialisent aussi le compteur.",
          "Si la condition n'est pas respectée un tour, le compteur revient à 0.",
          "Ordre de priorité conseillé : Tabacilles et Bacterribs en premier ; Virustines en les poussant 7 fois contre un obstacle (perd 1 PM infini par dommages de poussée) ; Pataugermes et Verminocules en dernier.",
          "ATTENTION : Si le Tabacille échange de place avec la Virustine, il réinitialise l'état Infection de cette dernière et lui redonne tous ses PM. Éloigner le Tabacille de la Virustine (portée 4 PO en ligne)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj38-malamibe_orig.png",
            "caption": "Schéma de la Malamibe — mécanique d'interception des dégâts"
          }
        ]
      },
      {
        "title": "Boss : Protozorreur",
        "mechanics": [
          "Restauration Infectieuse — Protomatisme : le Protozorreur gagne 100 de puissance au début de chaque tour ; ce bonus est réinitialisé quand il entre en état Infection.",
          "Jet Proto : inflige 500 dégâts air en ligne jusqu'à 10 PO ; hors état Infection, les dommages augmentent de 5 (infini) à chaque lancer ; en état Infection, attire la cible au contact du Protozorreur.",
          "Électrocution : inflige 1 000 dégâts feu jusqu'à 2 PO sans LdV ; hors Infection → retire 6 PM ; en Infection → retire 6 PA (débuffable).",
          "Infection : tue les invocations en mêlée ; hors Infection → 20 % érosion + repousse 3 cases cercle rayon 3 ; en Infection → dégâts eau = 50 % des PV érodés + attire 3 cases cercle rayon 4. (Lançable à partir du tour 3, relance 3 tours.)",
          "Le Protozorreur est invulnérable et indéplaçable sauf via l'attirance en ligne : il est attiré au contact du personnage qui lui inflige des dégâts en étant aligné avec lui (seulement sur la première frappe du tour).",
          "Protoglyphe infectieux : pose un glyphe violet (taille 1) sous le personnage qui subit des dégâts ; inflige 550 dégâts air au personnage qui passe dedans ; fait entrer le Protozorreur en état Infection pour 3 tours s'il y entre.",
          "Objectif : faire entrer le Protozorreur dans le glyphe violet au moins une fois tous les 2 tours ; maintenir l'état Infection pendant 10 tours pour le tuer.",
          "ATTENTION : quand le Protozorreur entre en état Infection, ses effets sont réinitialisés — la première frappe en ligne le déplace de nouveau ; frapper d'abord hors ligne pour bloquer l'attirance.",
          "Au 10ème tour d'Infection il meurt à la fin de son propre tour — continuer à sécuriser l'équipe pendant ce tour."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj38-delock1_orig.jpg",
            "caption": "Schéma : attirance du Protozorreur en ligne vers le glyphe violet"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj38-delock2_orig.jpg",
            "caption": "Schéma : positionnement du glyphe violet entre le personnage et le Protozorreur"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj38-delock3_orig.jpg",
            "caption": "Schéma : Protozorreur en état Infection dans le glyphe violet"
          }
        ]
      },
      {
        "title": "Stratégie 1 — Distance et retrait PM",
        "mechanics": [
          "Composition idéale : Enutrof retrait PM (base 190) avec l'initiative + classes DPS distance.",
          "L'Enutrof se place en ligne avec le Protozorreur, utilise Lancer de pièces sur lui-même pour créer un glyphe, recule de 2 cases, utilise Tamisage pour attirer le Protozorreur dans le glyphe et lui retirer des PM.",
          "Décaler ensuite pour utiliser Pelle de Jugement et Maladresse afin de retirer un maximum de PM.",
          "Répéter tous les 2 tours jusqu'à la mort du Protozorreur (10 tours d'Infection).",
          "Virustine : pousser 7 fois contre un obstacle pour la mettre à 0 PM (elle passera ses tours).",
          "Verminocule : un personnage reste au contact 5 tours ; utiliser Sac Animé / Corruption de l'Enutrof pour protéger 2 tours ; une fois le Tabacille mort, soigner le personnage en mêlée.",
          "ATTENTION : plus il reste peu de monstres, plus il est difficile d'éliminer la Malamibe (moins de cibles disponibles pour frapper en zone)."
        ]
      },
      {
        "title": "Stratégie 2 — Tanker le Protozorreur",
        "mechanics": [
          "Composition idéale : personnage tank avec l'initiative, 81 de fuite minimum pour détacler (exception : Pandawa).",
          "Le personnage tank se laisse taper par le Protozorreur pour créer un glyphe violet, se place au contact du glyphe en ligne avec le boss, attire le Protozorreur dans le glyphe.",
          "Répéter tous les tours (ou tous les 2 tours) pendant 10 tours d'Infection.",
          "Pandawa : utiliser Cascade pour se décaler d'une case après avoir porté un tonneau, frapper le boss en ligne, reposer le tonneau — pas besoin de détacler à chaque fois.",
          "Virustine : pousser 7 fois contre un obstacle pour la mettre à 0 PM.",
          "Même vigilance sur le Tabacille et la Virustine (échange de place réinitialise l'Infection)."
        ]
      }
    ],
    "tips": [
      "Accès : entrée sur le Roc des Salbatroces en [-85,-59]. Y accéder par le bateau dans le Port de Givre de Frigost en [-84,-40].",
      "Recette de la clef : 1 × Perce-Neige, 1 × Poisskaille, 1 × Frostiz, 2 × Viande Goûtue, 2 × Patte de Tabacille, 2 × Œil de Verminocule, 2 × Antenne de Bacterrib, 2 × Coquille de Virustine.",
      "Pierre d'âme requise : puissance 1 000.",
      "Quêtes liées : Grand corps malade (jusqu'à la salle 4), Qui dit baume, Examen de passage, Les totems de Maïmane, Les gloutons des dimensions.",
      "Éviter de se faire taper par le Protozorreur : son sort Jet Proto augmente en dégâts de façon infinie à chaque lancer.",
      "Garder le Tabacille le plus loin possible de la Virustine (portée 4 PO en ligne) pour éviter qu'il réinitialise son état Infection.",
      "Le personnage ayant l'initiative doit être celui qui place le Protozorreur dans le glyphe, afin que les autres personnages puissent ensuite taper librement le boss.",
      "Conseillé : donner l'initiative à une classe capable de s'infliger des dégâts (ex. Enutrof avec Lancer de pièce) pour créer un glyphe sous elle-même."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Barbare",
        "strategy": "Les personnages alliés doivent achever les ennemis avec une arme. Utiliser une arme à 2 PA (ex. Arc en Racine d'Abraknyde : 2 PA, bonus 1 PA, peut frapper un allié). Frapper uniquement la Malamibe ou un allié (pas directement un Krobe ou le Protozorreur). Une frappe à 0 dégâts fait échouer le succès. Stratégie avec retrait PM conseillée.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/barbare.png"
      },
      {
        "name": "Statue",
        "strategy": "Les combattants alliés doivent finir leur tour sur la même case que celle où ils l'ont commencé. Composition conseillée : Enutrof (initiative, Abyssal conseillé) + Pandawa (Chamrak sans LdV) + Eliotrope (Cabale, Interruption). Placement en file indienne. L'Enutrof se déplace via portails Eliotrope pour revenir à sa case de départ tout en attirant le Protozorreur dans le glyphe.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/statue.png"
      },
      {
        "name": "Spécial : Qui dit boum ?",
        "strategy": "La Malamibe doit être achevée avant le début de son prochain tour (en un seul tour). Éliminer d'abord le Tabacille et la Virustine ; garder le Verminocule pour la fin (attaques de zone plus efficaces). Éliminer le Protozorreur en 10 tours puis finir le Verminocule.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 40 tours. Compositions conseillées : Pandawa + autre classe, Enutrof + autre classe, ou Eliotrope + autre classe.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Donjon de dimension Xélorium en une seule salle avec 5 vagues de monstres
  85: {
    "summary": "Donjon de dimension Xélorium en une seule salle avec 5 vagues de monstres. Le boss Fraktale invoque une Auroraire sur un cadran-horloge dont le sens de rotation (horaire/anti-horaire) détermine si les dégâts frappent ou soignent les ennemis. Il faut gérer la distance entre le boss et son invocation pour contrôler ce sens.",
    "recommendedLevel": "Donjon du Xélorium (dimension divine, contenu haut niveau)",
    "composition": "Groupe modulaire (3-6 joueurs recommandés) ; classes capables de gérer les déplacements et de contrôler la distance boss/Auroraire.",
    "keyResist": [
      "Variable (voir résistances)"
    ],
    "phases": [
      {
        "title": "Accès et préparation",
        "mechanics": [
          "Se rendre en [7,3] dans les Chemins d'hier du Xélorium.",
          "Clef du Mégalithe de Fraktale obligatoire (trousseau de clef et téléportation non fonctionnels).",
          "Recette de clef : 2x Perche, 2x Graine de Pandouille, 2x Malt, 2x Pixel de Gromorso, 2x Pixel d'Éklateth, 2x Pixel de Farfacette, 2x Pixel de Brikablak, 1x Symbole de Xélomorphe.",
          "Symbole de Xélomorphe : s'achète contre 1x Orichor auprès du PNJ Collecteur Sup en [1,6] (dimension Xélorium). Orichors obtenus via quêtes dans les dimensions divines.",
          "Parler à Hypéria Gritch pour entrer dans le donjon."
        ]
      },
      {
        "title": "Système de vagues",
        "mechanics": [
          "Une seule salle, 5 vagues totales : le boss + 3 monstres dès le début (donjon modulaire, +1 monstre par combattant supplémentaire).",
          "Vague 2 arrive au tour 6, Vague 3 tour 11, Vague 4 tour 16, Vague 5 tour 21 (ou dès que la vague précédente est éliminée).",
          "Priorité : tuer les monstres rapidement pour éviter de cumuler 10+ ennemis simultanément.",
          "Mécanique commune — Fragmentation : lancé en début de combat sur tous les Xélomorphes, dommages subis x70% (infini), renvoie les dommages en zone de 2 PO autour du monstre (affecte alliés et ennemis)."
        ]
      },
      {
        "title": "Monstres des vagues — sorts à connaître",
        "mechanics": [
          "Gromorso — Assurance : déclenchée tous les 2 tours. Pluixel : ~100 dégâts neutres en zone proche. Attaque surprise : ~150 eau + pose état « Soigne sur attaque (2 tours) » sur la cible (toute frappe soigne le personnage ciblé).",
          "Éklateth — Bulle agrippante : si un allié frappe en ligne ce monstre il recule et le monstre avance (2 tours). Secoust : pousse de 4 cases. Eklatlatête : pousse de 6 cases.",
          "Farfacette — Farce cachée : dommages réduits de 10 (1 tour). Tornadhésive : vole ~30 PV terre + 2 PM (esquivables). Cercle de lumière : ~100 feu en zone + pose « Dommages subis x150% (1 tour) » sur la cible.",
          "Brikablak — Échauffement songeur : état indéplaçable 1 tour puis +2 PM au tour suivant. Transmission instantanée : téléporte la cible à 2 PO max tout en la frappant de ~130 agilité. Massassine : tue la cible au CàC.",
          "Cinquième type — Feu usé : ~60 dégâts intelligence. Segmentation : ~100 agilité + 20% érosion sur la cible (1 tour)."
        ]
      },
      {
        "title": "Combat contre Fraktale (boss) — mécanique de l'Auroraire",
        "mechanics": [
          "Le sol forme un cadran d'horloge (chiffres romains I à XII). Au tour 1, Fraktale invoque une Auroraire sur la cellule I.",
          "Si l'Auroraire tourne dans le sens horaire : dégâts normaux sur tous les monstres.",
          "Si l'Auroraire tourne dans le sens anti-horaire (trigo) : vos sorts de frappe soignent ennemis ET alliés.",
          "Sens de rotation quand le boss est à plus de 50% de PV : si boss à plus de 4 PO de l'Auroraire → sens horaire (OK) ; si boss à 4 PO ou moins → sens anti-horaire (danger).",
          "Sens de rotation quand le boss est à moins de 50% de PV : logique inversée : si boss à plus de 4 PO → sens anti-horaire ; si boss à 4 PO ou moins → sens horaire.",
          "L'Auroraire se déplace à chaque début de tour de chaque joueur selon la position du boss.",
          "Stratégie clé : gérer en permanence la distance boss/Auroraire pour maintenir le sens horaire selon la phase de PV du boss."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png",
            "caption": "Tactique succès spécial — L'heure tourne"
          }
        ]
      }
    ],
    "tips": [
      "Ce donjon ne se capture pas (pas de pierre d'âme possible).",
      "Le trousseau de clef et la téléportation sont désactivés dans ce donjon.",
      "Quêtes liées : « Prisonniers du temps » et « L'épée du rocher ».",
      "Parler à Hypéria Gritch pour sortir après le combat.",
      "Succès spécial « L'heure tourne » : les ennemis ne doivent pas infliger de dégâts aux autres ennemis. Éviter qu'un ennemi se trouve à 2 PO ou moins autour du Xélomorphe que vous frappez (renvoi de dégâts de Fragmentation)."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "L'heure tourne",
        "strategy": "Les ennemis ne doivent pas infliger de dégâts aux autres ennemis. Lorsque vous frappez un Xélomorphe, il renvoie les dégâts en zone de 2 PO autour de lui : aucun ennemi ne doit se trouver à 2 PO ou moins du monstre tapé.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // XLII est le boss de l'Horologium, donjon de dimension du Xélorium
  86: {
    "summary": "XLII est le boss de l'Horologium, donjon de dimension du Xélorium. Le combat tourne autour de l'Auroraire, une invocation qui parcourt un cadran de 12 heures en modifiant chaque tour les dommages infligés et reçus. La stratégie consiste à profiter des heures hautes (6e–11e) pour éliminer XLII rapidement avant que l'Auroraire ne repasse en phase basse.",
    "recommendedLevel": "200",
    "composition": "Équipe équilibrée ; préférer des personnages capables de maintenir une longue distance avec le boss pour éviter l'état Pacifiste. Les sorts à forte puissance monoélémentaire (terre notamment) sont utiles contre les Trantroa.",
    "keyResist": [
      "Terre",
      "Eau",
      "Air",
      "Feu",
      "Neutre"
    ],
    "phases": [
      {
        "title": "Particularités du donjon de dimension",
        "mechanics": [
          "Donjon à salle unique avec 5 vagues de monstres (même nombre de monstres que de combattants par vague).",
          "Trousseau de clef et téléportation de groupe non fonctionnels : accès via portail de dimension.",
          "Les vagues nouvelles sont invulnérables durant 1 tour à leur arrivée.",
          "Tuer tous les monstres d'une vague avant le délai imparti déclenche immédiatement la vague suivante.",
          "Boss XLII non capturable."
        ]
      },
      {
        "title": "Effet Rage Mahal (monstres hors XLII)",
        "mechanics": [
          "Chaque monstre déclenche un effet à chaque ligne de dommages reçue, différent selon que sa vitalité est > ou ≤ 50%.",
          "Seith (>50%) : attire son attaquant d'1 case. (≤50%) : +50 Dommages Critiques (1 tour) — dangereux car ses sorts tapent plusieurs lignes.",
          "Soissanth (>50%) : retire 2 PO à l'attaquant. (≤50%) : +1 PM +10 Fuite (1 tour).",
          "Trantroa (>50%) : +1 PM +10 Tacle (1 tour). (≤50%) : +10% Vitalité (2 tours) — boost débuffable.",
          "Trezz (>50%) : +3% Résistance (2 tours). (≤50%) : +50 Puissance (infini).",
          "Vindeux (>50%) : soigne ses alliés dans un rayon de 2 de 10% de ses PV max. (≤50%) : l'attaquant redistribue 50% des dégâts infligés aux entités dans un rayon de 2."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj40-54_orig.png",
            "caption": "Tableau Rage Mahal — effets par monstre selon seuil de vitalité"
          }
        ]
      },
      {
        "title": "Monstres : sorts et comportements",
        "mechanics": [
          "Seith — Tourbête : 100 air + 100 eau jusqu'à 3 PO (2×/tour, 1×/cible) ; Massue : 100 terre + 100 feu + 100 neutre en mêlée (2×/tour, 1×/cible).",
          "Soissanth — Poinzon : poison 45 neutre (≈250 dégâts) 2 tours, 5–10 PO (2×/tour, 1×/cible) ; Taplaudissement : poison –1 PA / 5 PV air 2 tours, ligne 5–10 PO.",
          "Trantroa — Brute Haleine : 250 neutre zone croix 1 + ligne bonus (33% PV manquants neutre), ligne jusqu'à 3 PO (1×/tour) ; Poing terne : identique en diagonale, élément feu (1×/tour).",
          "Trezz — Rayons entravants : 350 feu + vole 4 PM 1 tour, ligne jusqu'à 5 PO sans LDV (1×/tour) ; Rebond manqué : 400 terre vol de vie + état Insoignable 1 tour, mêlée (2×/tour, 1×/cible).",
          "Vindeux — Massurance : 300 air + état Pesanteur 1 tour, ligne jusqu'à 6 PO (2×/tour, 1×/cible) ; Mécontentement : 300 eau – 3 PA 1 tour, ligne 2–5 PO (2×/tour, 1×/cible)."
        ]
      },
      {
        "title": "Boss XLII — sorts et mécanique de l'Auroraire",
        "mechanics": [
          "Buff heure : dès le début du combat, invoque une Auroraire et se met l'état Lourd (permanent). Entre dans l'état Dérèglement si déplacé.",
          "Coquetterie : 500 air zone cercle rayon 2 + réduit de 1 la durée des effets des cibles, autour de lui ou à 1 PO (1×/tour).",
          "Souffle démoniaque : 650 eau + état Pacifiste 1 tour, jusqu'à 3 PO sans LDV (3×/tour, 1×/cible).",
          "Dérèglement (si XLII a été déplacé) : échange de place avec un allié, portée infinie (2×/tour).",
          "L'Auroraire est Invulnérable et Indéplaçable ; elle tourne heure par heure à chaque tour joué par un allié.",
          "Tableau Auroraire — Dommages subis des monstres (votre frappe) / Dommages finaux occasionnés (frappe ennemie) :",
          "12e heure : ×40% / –10% | 1e : ×50% / –50% | 2e : ×60% / –40% | 3e : ×70% / –30% | 4e : ×80% / –20% | 5e : ×90% / –10%",
          "6e heure : ×100% (normal) / +10% | 7e : ×110% / +20% | 8e : ×120% / +30% | 9e : ×130% / +40% | 10e : ×140% / +50% | 11e : ×150% / +60%",
          "Si un personnage ou monstre occupe la case de destination de l'Auroraire, elle s'y transpose avec lui.",
          "Frapper l'Auroraire téléporte l'attaquant symétriquement sans lui infliger de dégâts.",
          "Éliminer XLII supprime l'Auroraire et tous ses bonus/malus."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj40-auroraire_orig.png",
            "caption": "L'Auroraire sur son cadran de 12 heures"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj40-horloge-auroraire_orig.png",
            "caption": "Schéma fonctionnement Auroraire : zone rouge (réduction) vs zone verte (augmentation)"
          }
        ]
      },
      {
        "title": "Stratégie globale",
        "mechanics": [
          "De la 12e à la 5e heure : dommages réduits des deux côtés → profitez-en pour booster vos personnages au maximum.",
          "À partir de la 6e heure : commencez à éliminer les monstres présents en priorité le Trantroa.",
          "Vers la 9e–10e heure : entamez XLII pour le finir avant que l'Auroraire ne revienne à la 12e heure.",
          "Tenir XLII à distance (≥ 4 PO) pour éviter son Souffle démoniaque (Pacifiste).",
          "Ne pas repousser XLII sauf si indispensable (risque Dérèglement + échange avec allié proche). Si on le repousse, le mettre aussi Pesanteur pour bloquer le coopé.",
          "Trantroa sous 50% PV : privilégier une seule ligne de dégâts par attaque (terre si possible) ; le bonus de vitalité déclenché est débuffable et le tuera s'il n'avait plus de PV.",
          "Plus l'équipe est nombreuse, plus l'Auroraire tourne vite : adapter le rythme en conséquence.",
          "Une fois XLII éliminé, éliminer les vagues restantes en ciblant toujours les Trantroa en premier."
        ]
      }
    ],
    "tips": [
      "Accès : dimension Xélorium, zone Jour présent en [7,-2]. Portail Xélorium à trouver depuis [-22,-24].",
      "Recette clef : 2 Belladone, 3 Maïs, 2 Morue, 1 Poils d'Hordémon, 2 Dent de Trezz, 2 Peau de Vindeux, 2 Pagne de Trantroa, 2 Barbe de Seith.",
      "Poils d'Hordémon : s'achète contre 2 Orichor auprès du PNJ Collecteur Sup en [1,6] dans la dimension Xélorium.",
      "Trousseau de clef et téléportation de groupe inopérants dans les dimensions.",
      "Quêtes liées : La Vie, l'Hormonde et le Reste ; Le disparu de Sufokia.",
      "XLII ne peut pas être capturé.",
      "Succès Barbare : si un personnage est Pacifiste il ne peut pas frapper à l'arme. L'état est débuffable.",
      "Succès Spécial (C'est très vague !) : tous les ennemis d'une vague doivent être éliminés avant l'arrivée de la vague suivante — éliminer XLII avant le retour à la 12e heure.",
      "Modificateurs de combat de la dimension Xélorium (10 au total, changent en finissant le Vortex niveau 200) : En quête d'action, Puissance cyclique, Saute-Bouftou, Disparitions détonantes, Retour arrière, Liaison longue portée, Actions entravées, Poussées revigorantes, Solitude Momifiante, Invocations incapacitantes."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "C'est très vague !",
        "strategy": "Tous les ennemis d'une vague doivent être éliminés avant l'arrivée de la vague suivante. Profiter des boosts de l'Auroraire (heures 6–11) pour éliminer XLII rapidement avant qu'elle ne revienne à la 12e heure.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Barbare",
        "strategy": "Ne pas laisser un personnage se retrouver dans l'état Pacifiste (infligé par Souffle démoniaque ou Coquetterie de XLII). L'état est débuffable. Garder XLII à distance et éviter ses sorts."
      }
    ]
  },
  // Le Kankreblath est un boss sans mécanique spéciale, mais son sort Sfvc%$*$R 
  88: {
    "summary": "Le Kankreblath est un boss sans mécanique spéciale, mais son sort Sfvc%$*$R ? peut invoquer des monstres aléatoires dangereux. Le vrai danger du donjon est le Pyrasite, qui doit être éliminé en priorité absolue. Rester à distance est fortement conseillé car tous les monstres tapent à courte portée ou en mêlée.",
    "recommendedLevel": "60",
    "composition": "Équipe classique. Conseillé d'avoir un ou deux personnages jouant l'élément eau (faiblesses de la majorité des monstres).",
    "keyResist": [
      "Feu",
      "Eau"
    ],
    "phases": [
      {
        "title": "Salles 1 à 4 — monstres classiques",
        "mechanics": [
          "Cafarcher : Coup de cure-dent (70 dégâts feu, mêlée) ; Tir de cure-dent (50 dégâts feu, 3–6 PO).",
          "Céglumen : Attrape coton-tige (80 dégâts terre + attire de 3 cases + retire 10 esquive PM, ligne jusqu'à 4 PO) ; Badigeonnage de cérumen (glyphe jaune cercle taille 2, 2 tours : -1 PM, -10 fuite, 75 dégâts terre à chaque début de tour dans la zone).",
          "Mirgrillon : Coup de boutonclier (60 dégâts feu + repousse 1 case + retire 2 PA, mêlée) ; Mini empalement (105 dégâts terre, ligne taille 3, mêlée).",
          "Pyrasite : Cri de l'insecte ardent (boost lui-même et alliés de +2 PM et +50 puissance pour un tour, relance 3 tours) ; Souffle brûlant (95 dégâts feu cône taille 2 à 1 PO + poison 45 dégâts feu/tour pendant 2 tours, cumulable 2 fois).",
          "Sakarien : Frappe Circulaire (110 dégâts terre cercle taille 2 autour de lui, +135 contre invocations) ; Invocation de Poupoussière (110 PV, 3 PM, 50 dégâts neutre + -1 PO zone carré taille 1, relance 3 tours, dès tour 2).",
          "Focus Pyrasite en premier : il tape très fort, applique un poison et booste tous ses alliés.",
          "Pyrasite a 20% de faiblesse eau : il tombe vite avec des sorts eau.",
          "Ensuite focus Céglumen et Sakarien (absents en butin 4), puis Cafarcher (portée jusqu'à 6 PO) avant Mirgrillon (mêlée uniquement).",
          "Rester à distance : tous les monstres tapent à courte portée ou en mêlée."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj60-coup-cure-dent_orig.png",
            "caption": "Zone sort Coup de cure-dent (Cafarcher)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj60-tir-cure-dent_orig.png",
            "caption": "Zone sort Tir de cure-dent (Cafarcher)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj60-attrape-coton-tige_orig.png",
            "caption": "Zone sort Attrape coton-tige (Céglumen)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj60-badigeonnage-cerumen_orig.png",
            "caption": "Zone sort Badigeonnage de cérumen (Céglumen)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj60-coup-boutonclier_orig.png",
            "caption": "Zone sort Coup de boutonclier (Mirgrillon)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj60-mini-empalement_orig.png",
            "caption": "Zone sort Mini empalement (Mirgrillon)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj60-cri-insecte-ardent_orig.png",
            "caption": "Zone sort Cri de l'insecte ardent (Pyrasite)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj60-souffle-brulant_orig.png",
            "caption": "Zone sort Souffle brûlant (Pyrasite)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj60-frappe-circulaire_orig.png",
            "caption": "Zone sort Frappe Circulaire (Sakarien)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj60-invocation-poupoussiere_orig.png",
            "caption": "Zone sort Invocation de Poupoussière (Sakarien)"
          }
        ]
      },
      {
        "title": "Combat contre le Kankreblath (Boss)",
        "mechanics": [
          "Sfvc%$*$R ? : effet aléatoire parmi 3 (33,3% chacun) — rend le Kankreblath invisible pour un tour / téléporte le Kankreblath sur la case ciblée / invoque un monstre aléatoire de la zone. Se lance jusqu'à 6 PO sans ligne de vue (relance 3 tours, dès tour 2).",
          "Blathération : 100 dégâts feu, zone ligne taille 6, uniquement à 1 PO (1 fois par tour).",
          "Kankroulahoup : 80 dégâts feu zone cercle taille 3 autour de lui + soigne les alliés dans la zone de 80, autour de lui (relance 3 tours).",
          "Le Kankreblath a 34% de résistances terre et 26% de résistances eau : éviter ces éléments pour l'attaquer.",
          "Ses sorts ont une portée limitée et ne tapent pas extrêmement fort, mais les sorts de zone peuvent être dangereux si plusieurs personnages sont groupés.",
          "Éliminer les monstres avant de s'attaquer au Kankreblath.",
          "Si le Kankreblath invoque un Pyrasite ou un monstre dangereux via Sfvc%$*$R ?, le focus immédiatement.",
          "Sfvc%$*$R ? a une relance de 3 tours : il est possible qu'il n'invoque pas de monstre du tout.",
          "L'IA du Kankreblath est agressive et il avance toujours vers les personnages."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj60-sfvc_orig.png",
            "caption": "Zone sort Sfvc%$*$R ? (Kankreblath)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj60-blatheration_orig.png",
            "caption": "Zone sort Blathération (Kankreblath)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj60-kankroulahoup_orig.png",
            "caption": "Zone sort Kankroulahoup (Kankreblath)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj60-39kankr-res2e_orig.jpg",
            "caption": "Tableau des résistances du Kankreblath"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj60-30zone1kank_orig.png",
            "caption": "Zone ligne du sort Blathération (Kankreblath)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj60-31zone2kank_orig.png",
            "caption": "Zone cercle du sort Kankroulahoup (Kankreblath)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj60-33pyrasite-strat_orig.jpg",
            "caption": "Stratégie focus Pyrasite"
          }
        ]
      }
    ],
    "tips": [
      "Entrée du donjon en [3,-17] dans Astrub.",
      "Recette de la clef : 8x Antennes de Vilinsekt, 2x Viande Minérale, 2x Poisson-Chaton, 2x Trèfle à 5 feuilles, 2x Avoine.",
      "Pour entrer : équiper une Baguette Rikiki (craft sculpteur niv. 40 mini : 1x Étoffe du Sanglier, 1x Pétale Magique du Tournesol Affamé, 1x Poils de Darit) pour passer un trou de Vilinsekts. Une seule baguette par groupe suffit pour entrer.",
      "Pour capturer le boss : prévoir une pierre d'âme de capture 50 minimum.",
      "La baguette Rikiki est nécessaire pour lancer la quête liée à la fin du donjon.",
      "Attitude Affamé : après la salle 3, équiper la Baguette Rikiki pour passer sous le château de carte et cliquer sur la fraise dans le Garde-manger. Attention : cliquer sur la fraise téléporte directement en salle 4.",
      "Quête liée : Donjon Rikiki — Aventure miniature.",
      "La majorité des monstres ont des faiblesses eau : conseillé de jouer 1–2 personnages en eau.",
      "Éviter l'élément terre contre le Kankreblath (34% de résistances)."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Collant",
        "strategy": "Les combattants alliés doivent finir leur tour sur une cellule adjacente à celle d'un autre combattant allié (les invocations ne comptent pas). Rester groupés mais attention aux sorts de zone du Pyrasite et du Kankreblath. Focus Pyrasite en premier. Si le Kankreblath se rapproche dangereusement, l'éliminer en deuxième si possible.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/collant.png"
      },
      {
        "name": "Dernier",
        "strategy": "Le Kankreblath doit être achevé en dernier. La stratégie normale du donjon le laisse naturellement en dernier : se référer à la stratégie globale.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/dernier.png"
      },
      {
        "name": "Spécial — La ligne interdite",
        "strategy": "Les alliés ne doivent terminer leur tour ni en ligne d'un ennemi, ni en ligne d'un autre allié. Ne pas invoquer (les invocations doivent aussi respecter la condition). Si le Kankreblath devient invisible via Sfvc%$*$R ?, risque d'échouer sans le savoir. Éliminer rapidement les monstres (y compris invocations) pour avoir plus de place. L'IA du Kankreblath est agressive, il avance toujours vers les personnages.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 20 tours. Éviter l'élément terre (34% résistance du Kankreblath). Focus Pyrasite en premier. La réussite dépend de l'aléatoire de Sfvc%$*$R ? : une invocation dès le tour 2 complique grandement le combat. Rester à distance du Kankreblath une fois seul.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // La Reine Nyée est une araignée-boss aux résistances polarisées (faible feu/eau, résistante
  89: {
    "summary": "La Reine Nyée est une araignée-boss aux résistances polarisées (faible feu/eau, résistante terre/air). La mécanique principale repose sur ses invocations d'Oeufs de Trégénaire (anecdotique), mais la vraie difficulté vient des monstres alliés — notamment la Néfileuse (Cocon) et l'Arapex (OS) qui forment un combo léthal. La stratégie consiste à focus la Néfileuse en premier à distance, puis la Dardalaine, avant de terminer sur la Reine.",
    "recommendedLevel": "110 — 130",
    "composition": "Privilégier des personnages frappant en feu ou eau. Des classes pouvant bloquer ou retenir à distance (Sadida, Pandawa) sont utiles pour gérer la Néfileuse et la Dardalaine.",
    "keyResist": [
      "Feu",
      "Eau"
    ],
    "phases": [
      {
        "title": "Salles normales — monstres",
        "mechanics": [
          "Arapex — Estocade : dégâts terre + état Proie, s'avance de 2 cases (en ligne 2-3PO, 2x/tour)",
          "Arapex — Tourbillon mortel : dégâts terre + attire d'1 case en cercle 2 autour d'elle",
          "Arapex — Exécution : OS instantané sur cible en état Cocon (jusqu'à 2PO sans LdV, relance 3 tours)",
          "Dardalaine — Sécrétion acide : dégâts neutre + poison neutre 1 tour + -200 puissance, en ligne jusqu'à 7PO sans LdV — ne jamais taper en mêlée",
          "Dardalaine — Kissifrotsipik (passif) : renvoi de dégâts neutre à tout contact mêlée ; dégâts doublés si cible Empoisonnée",
          "Néfileuse — Fil collant : attire la cible de 5 cases en ligne jusqu'à 6PO + -5% résistances",
          "Néfileuse — Prison de soie : transforme la cible en Cocon uniquement en mêlée (-100PA -100PM 2 tours, non débuffable) ; un allié peut retirer l'état en infligeant des dégâts directs à la cible",
          "Néfileuse — Toile paralysante : invoque une Toile (400PV) qui génère un glyphe blanc cercle 2 : -100PM + Pesanteur + Inébranlable tant que la Toile est en vie",
          "Gargantûl — Mastication : dégâts neutre zone bâton + buff dommages cumulable 5x",
          "Saltik — Pressage : téléportation + repousse de 3 cases en cercle 2 sur zone d'arrivée"
        ]
      },
      {
        "title": "Combat du Boss — Reine Nyée",
        "mechanics": [
          "Résistances : +30% terre, +40% air, -20% feu et eau — frapper obligatoirement en feu ou eau",
          "Cisaillage : dégâts neutre zone bâton à 1PO, repousse d'1 case + -2PM 1 tour — éparpiller les personnages",
          "Mitraille de soie : dégâts neutre + -15% résistances tous éléments 2 tours en cercle 2, en ligne jusqu'à 8PO sans LdV",
          "Ponte d'Oeuf : invoque un Oeuf de Trégénaire tous les 2 tours (800PV, aucune résistance) ; l'Oeuf inflige 35 dégâts neutre vol de vie à chaque début de tour ; taper un Oeuf soigne de 50% des dégâts infligés",
          "Appel de la Reine (passif) : quand la Reine subit des dégâts, toutes les Trégénaires présentes entrent en état Dévoué — elles gagnent 2PM permanents et 50 puissance (cumulable 4 fois) et ne soignent plus mais foncent en mêlée pour s'exploser (200 dégâts neutre cercle 2)",
          "Trégénaire éclose (après 2 tours) : soigne la Reine de 130PV/tour tant qu'elle n'est pas Dévouée",
          "Ordre de priorité : 1) Néfileuse, 2) Dardalaine, 3) Arapex, 4) Reine Nyée",
          "Si un allié est en Cocon : lui infliger immédiatement des dégâts directs (sort faible) pour annuler l'état",
          "Ne pas taper la Reine Nyée tant que des Trégénaires sont en vie (évite de les passer en état Dévoué)",
          "Éliminer les Toiles de la Néfileuse (400PV) pour supprimer le glyphe blanc et récupérer les PM",
          "Ne jamais taper la Dardalaine en mêlée (renvoi de dégâts, doublés si Empoisonné)",
          "Rester à distance de la Néfileuse pour éviter Prison de soie (uniquement en mêlée)",
          "Bloquer Dardalaine et Néfileuse avec des invocations (Bloqueuse Sadida, Pandawasta) pour les empêcher de se placer en ligne"
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark43nyee3_orig.png",
            "caption": "Zone du sort Cisaillage (bâton mêlée)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark43nyee4_orig.png",
            "caption": "Zone du sort Mitraille de soie (cercle 2 en ligne)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark43nyee12_orig.png",
            "caption": "Effet de Sécrétion acide de la Dardalaine (-200 puissance + poison)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark43nyee11_orig.jpg",
            "caption": "Combo Fil collant + Prison de soie de la Néfileuse (état Cocon)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark43nyee9_orig.jpg",
            "caption": "Toile de la Néfileuse et son glyphe blanc (-100PM + Pesanteur)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark43nyee16_orig.jpg",
            "caption": "Arapex en position pour lancer Exécution sur un personnage en Cocon"
          }
        ]
      }
    ],
    "tips": [
      "Entrée du donjon : Bois des Arak-hai, Foret des Abraknydes [-6,-15]",
      "Recette de la clef : 2x Laine de Dardalaine, 2x Dent de Gargantul, 2x Fil de Nefileuse, 2x Oeil de Saltik, 2x Viande Rassie, 2x Kralamoure, 3x Orchidee Freyesque, 3x Lin",
      "Pierre d'ame de puissance 100 minimum pour capturer la Reine Nyee",
      "Quetes liees : Arak-hai en pagaille, Comme un corbac sur sa branche, Munster leve le mystere, Un assassin... a Bonta ?, Une friandise pas comme les autres, Tour du proprietaire",
      "Utiliser les Oeufs de Tregenaire comme source de soins (50% des degats infliges recuperes) si besoin",
      "Les Tregenaires devouees peuvent etre ignorees si on reste concentre sur les priorites"
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "On ne peut la Nyee",
        "strategy": "Chaque Oeuf de Tregenaire invoque par la Reine Nyee doit etre elimine avant le debut du prochain tour de la Reine. La Reine invoque un Oeuf tous les deux tours (tours impairs 1, 3, 5...) ; chaque Oeuf a 800PV et aucune resistance. Il faut reserver systematiquement assez de degats pour detruire l'Oeuf dans le meme tour. Si le groupe a suffisamment de degats, ce succes ne pose pas de probleme ; sinon, prendre quelques niveaux supplementaires avant de revenir.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Le Kardorim est le boss du premier donjon du jeu (Incarnam)
  90: {
    "summary": "Le Kardorim est le boss du premier donjon du jeu (Incarnam). Il tape uniquement en mêlée, invoque un Kardorib qui repousse, et possède des faiblesses eau et terre. La stratégie consiste à focus le boss en priorité dès le tour 1.",
    "recommendedLevel": "1 — 20",
    "composition": "Toutes classes conviennent ; des sorts de déplacement/téléportation sont utiles pour les succès.",
    "keyResist": [
      "Eau",
      "Terre"
    ],
    "phases": [
      {
        "title": "Monstres des salles",
        "mechanics": [
          "Chafer Débutant — Petit coup du Chafer : 35 dégâts terre en mêlée.",
          "Chafer Débutant — Souffle Spectral : 30 dégâts neutre, ligne 2-3PO.",
          "Chafer Éclaireur — Flèche de Feu : 20 dégâts feu + poison 10 dégâts feu pendant 1 tour, ligne jusqu'à 6PO.",
          "Chafer Éclaireur — Flèches Critiques : +40% critique sur lui-même pendant 2 tours (relance 5 tours).",
          "Chafer Furtif — Camouflage : invisible 1 tour (dès tour 2, relance 3 tours).",
          "Chafer Piquier — Empalement : 30 dégâts air en ligne taille 3, uniquement à 1PO.",
          "Chafer Piquier — Euphorie Malsaine : +10 dommages à tous ses alliés (sauf lui) pour 1 tour (relance 3 tours).",
          "Sergent Chafer — Frénésie : +50 puissance à tous ses alliés (sauf lui) pour 2 tours (relance 3 tours).",
          "Sergent Chafer — Petit coup du Chafer : 40 dégâts terre en mêlée."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj64-euphorie-malsaine_orig.png",
            "caption": "Euphorie Malsaine — zone d'effet (boost alliés)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj64-empalement_orig.png",
            "caption": "Empalement — zone ligne taille 3 à 1PO"
          }
        ]
      },
      {
        "title": "Boss : Kardorim",
        "mechanics": [
          "Appel de Kardorib : invoque un Kardorib à 1PO (relance 6 tours) — invoqué dès le tour 1.",
          "Casse-crâne : 55 dégâts neutre en zone ligne taille 2, uniquement en mêlée.",
          "Craquement d'Os : +1PM pour lui et ses alliés dans un cercle taille 2 autour de lui (relance 3 tours, dès tour 2).",
          "Kardorib (invocation) — Embrochement : 30 dégâts neutre + repousse 2 cases, uniquement en mêlée.",
          "Le Kardorim n'a que 4PM ; faiblesses eau et terre.",
          "Focus le Kardorim en priorité au tour 1. Si le Kardorib gêne, éliminez-le (ne peut pas être réinvoqué avant 6 tours). Sinon, gardez-le à distance et terminez le boss rapidement."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj64-appel-de-kardorib_orig.png",
            "caption": "Appel de Kardorib — zone d'invocation à 1PO"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj64-casse-crane_orig.png",
            "caption": "Casse-crâne — zone ligne taille 2 en mêlée"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj64-craquement-dos_orig.png",
            "caption": "Craquement d'Os — zone cercle taille 2 autour du Kardorim"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj64-embrochement_orig.png",
            "caption": "Embrochement (Kardorib) — repousse 2 cases en mêlée"
          }
        ]
      }
    ],
    "tips": [
      "Entrée du donjon : Incarnam [5,-1].",
      "Recette de la clef : 3x Relique d'Incarnam + 5x Cendres Éternelles.",
      "Pierre d'âme de capture niveau 50 minimum requise pour capturer le boss.",
      "Quêtes liées : Dans la gueule du Milimilou, Cryptologie.",
      "Niveau 12+ avec panoplie Piou : le Kardorim peut être éliminé en 3 attaques."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Zombie",
        "strategy": "Utiliser exactement 1PM par tour. Privilégier les classes avec sorts de déplacement/téléportation pour éviter les tacles. Sinon, éliminer rapidement le Kardorim avant qu'il ne bloque. Bien penser à utiliser le PM avant d'achever le dernier ennemi.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/zombie.png"
      },
      {
        "name": "Premier",
        "strategy": "Le Kardorim doit être achevé en premier. Se placer près du boss dès le placement pour l'atteindre dès le tour 1.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/premier.png"
      },
      {
        "name": "Lâche mes côtes",
        "strategy": "Le Kardorim ne doit jamais finir son tour en mêlée d'un combattant, et les Kardoribs ne doivent subir ni dommages ni poussée. Garder le Kardorim à distance et l'éliminer rapidement. Attention : si le Kardorib est en mêlée sans sort de déplacement, vous êtes bloqué (ne peut être ni poussé ni tapé).",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages max en moins de 20 tours. Si assez de dégâts : focus Kardorim en premier. Sinon : commencer loin et nettoyer les monstres d'abord avant d'attaquer le boss.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Le Chouque est un boss pirate dont le passif Malediction Pirate minimise les effets aleato
  91: {
    "summary": "Le Chouque est un boss pirate dont le passif Malediction Pirate minimise les effets aleatoires du personnage le plus proche et OS ceux sous 30% PV. La strategie repose sur le maintien de distances suffisantes, l'application de l'etat Pesanteur sur le Chouque pour bloquer son echange de place, et le fait de rester a plus de 30% (idealement 50%) de PV en permanence.",
    "recommendedLevel": "120",
    "composition": "Classes de soins recommandees. Peut se jouer a distance ou en melee, mais distance est plus sur. Retrait PM utile pour maintenir les distances.",
    "keyResist": [
      "Neutre",
      "Feu"
    ],
    "phases": [
      {
        "title": "Salles normales",
        "mechanics": [
          "Boomba (Feu) : Bombe Pirate — 150 degats feu + 15% erosion en croix taille 1 (jusqu'a 8PO). Feu d'Artifesse — rend lui et ses allies proches invisibles + 30% critique (relance 3 tours).",
          "Canondorf (Feu) : Canon Tournoyant — repousse de 2 cases et retire 25% resistances tous elements (autour de lui). Gros Boulet Pirate — 140 degats feu + repousse 2 cases, en ligne PO infinie sans LdV.",
          "Ivremor (Feu) : Cocktail Rhumotov — 110 degats feu + glyphe rouge 2 tours (110 degats feu/tour a ceux qui s'y trouvent en debut de tour), 3-8PO sans LdV. Et une bouteille de Rhum ! — boost intelligence cumulable. Crachat de Rhum — 110 degats feu en cone taille 2 + consomme les buff intelligence.",
          "Nakunbra (Neutre) : A l'abordage ! (passif) — gagne 1PM par degat recu. Sus a l'ennemi ! — attire tous les personnages en ligne vers la case ciblee + tacle aux allies proches. Tranchage Mortel — 150 degats neutre, OS si cible <= 50% PV (melee seulement).",
          "Ricanif (Neutre) : Coupe-genoux — 140 degats neutre + retire 100 fuite (melee). Tornade de Lames — 100 degats neutre + vole 1PM en cercle taille 2.",
          "Ivremor, Boomba et Canondorf ont une IA fuyarde (reculent apres avoir tape). Ricanif et Nakunbra ont une IA agressive."
        ]
      },
      {
        "title": "Combat boss — Le Chouque",
        "mechanics": [
          "Coup de Sabre Maudit : 170 degats neutre + retire 150 puissance + applique etat Maudit 2 tours. Si cible <= 50% PV, invoque un pirate aleatoire au contact. Uniquement en melee.",
          "Malediction Pirate (passif) : Debut de tour — minimise les effets aleatoires du personnage le plus proche non-Maudit ET de tous les personnages Maudits. Si leurs PV > 30% : inflige 110 degats eau vol de vie. Si leurs PV <= 30% : OS et invoque un pirate aleatoire sur leur case.",
          "Teleportation Spectrale : Echange de place avec un allie (PO infinie sans LdV, 1 fois/tour) ; l'allie ciblé gagne 200 puissance 2 tours. Bloque si le Chouque ou l'allie ciblé est en etat Pesanteur.",
          "Maintenir tous les personnages au-dessus de 30% PV (idealement 50%) en permanence.",
          "Garder le Chouque a plus de 5 cases de distance pour eviter la melee (il a 5PM).",
          "Appliquer l'etat Pesanteur sur le Chouque pour bloquer son echange de place.",
          "Eviter de jouer dans l'element eau (le Chouque a 36% resistance eau).",
          "Ne pas finir son tour en ligne avec le Nakunbra (attraction).",
          "Placer un personnage tank comme cible prioritaire du passif Malediction Pirate.",
          "Ordre de focus avec retrait PM : Ricanif -> Nakunbra -> Chouque. Ordre avec retrait PO : Ivremor -> Boomba.",
          "Ivremor en priorite car il tape a distance, pose des glyphes et se booste en intelligence.",
          "Nakunbra : l'eliminer en un tour si possible (il gagne des PM a chaque degat recu).",
          "Une fois tous les monstres elimines, le Chouque ne peut plus echanger de place et peut etre fini tranquillement a distance."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark44chouque1_orig.png",
            "caption": "Passif Malediction Pirate — personnage le plus proche non-Maudit cible"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark44chouque2_orig.png",
            "caption": "OS si moins de 30% PV lors du passif"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark44chouque4_orig.png",
            "caption": "Echange de place du Chouque avec un allie"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark44chouque14_orig.png",
            "caption": "Au-dessus de 50% PV : personnage safe"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark44chouque15_orig.png",
            "caption": "En dessous de 50% PV : personnage en danger de mort"
          }
        ]
      },
      {
        "title": "Succes special — Saute-pirate",
        "mechanics": [
          "Condition : lorsque le Chouque echange de place avec un allie, ce dernier doit etre acheve en moins de deux tours.",
          "Le Chouque doit etre elimine en dernier.",
          "Focus systematique sur le monstre avec lequel le Chouque vient d'echanger.",
          "Idealement l'eliminer avant le prochain tour du Chouque.",
          "Le Chouque a peu d'initiative : au premier tour, il est possible d'eliminer ou d'entamer un monstre avant son premier echange.",
          "Une fois tous les allies morts, le succes est valide et le Chouque peut etre termine sereinement."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png",
            "caption": "Illustration tactique du succes special Saute-pirate"
          }
        ]
      }
    ],
    "tips": [
      "Acces : Entree au bout du Chemin du Crane sur l'Ile de Moon en [33,3]. Prerequis : quete Partir un jour sans retour.",
      "Recette de la clef : 2x Calecon Mignon du Pirate, 2x Boulet de Canondorf, 2x Bandeau de Nakunbra, 2x Canif Rouille, 2x Viande Rassie, 2x Kralamoure, 3x Orchidee Freyesque, 3x Lin.",
      "Pour capturer le Chouque, prevoir une pierre d'ame de puissance 100 minimum.",
      "Quetes liees : C'est du bateau, Le radeau ivre, Squelettes et amulettes.",
      "Retrait PM tres utile pour maintenir la distance de securite.",
      "Eviter l'element eau (36% resistance sur le Chouque)."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Saute-pirate",
        "strategy": "Lorsque le Chouque echange de place avec un allie, achever cet allie en moins de deux tours. Toujours eliminer le Chouque en dernier. Focus immediat sur le monstre cible de l'echange, idealement avant le tour suivant du Chouque. Le Chouque ayant peu d'initiative, le premier tour permet d'entamer un monstre avant le premier echange.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Moon est le boss de l'Arbre de Moon, situé sur l'Île de Moon
  92: {
    "summary": "Moon est le boss de l'Arbre de Moon, situé sur l'Île de Moon. Il possède 100% de résistances dans tous les éléments : pour le vulnérabiliser, il faut placer les totems de couleur invoqués par Darkli Moon sur les glyphes de leur élément correspondant. Chaque totem placé retire à Moon ses résistances dans l'élément concerné, permettant de le blesser.",
    "recommendedLevel": "130",
    "composition": "Équipe classique ; privilégier des sorts de placement, de gain PM et de téléportation pour déplacer les totems efficacement. Éviter les personnages qui tapent uniquement en Air (monstres très résistants en Air).",
    "keyResist": [
      "Variable (voir résistances — débloquées par placement des totems)"
    ],
    "phases": [
      {
        "title": "Salles 1 à 4 — monstres de l'île",
        "mechanics": [
          "Domoizelle — Invocation de Dodoune : invoque un Dokachu (Dorage : frappe + état affaibli), un Dolbinos (Dotite en zone + poussée, Coup de Bec Affaiblissant : retire 200 puissance) ou un Dolivar.",
          "Domoizelle — Poussée Dormone : boost elle et ses alliés de 50 dégâts de poussée pour 1 tour.",
          "Domoizelle — Protection Maternelle : frappe et repousse de 2 cases.",
          "Dostrogo — Dochirure : frappe et retire 2 PM esquivables.",
          "Dostrogo — Coup de Bec Dominant : frappe et pousse avec dégâts de poussée.",
          "Fourbasse — Tir Embusqué : frappe et retire 2 PA esquivables.",
          "Fourbasse — L'Attaque du Chasseur : frappe, retire 63 PO et applique l'état Chassé (infini).",
          "Gloutovore — Corps Gluant (passif) : soigne les alliés à chaque tentative de retrait PM ; si le Gloutovore subit un retrait PA, il gagne 1 PM.",
          "Gloutovore — Crasse Piration : attire en ligne et vole des PV.",
          "Gloutovore — Gobage : OS la cible en mêlée (peu importe ses PV), se soigne de 100% de ses PV et gagne 1 PM.",
          "Trukikol — Électromagnétisme : dégâts Terre en zone ; applique un effet permettant aux monstres de s'attirer vers leur cible.",
          "Trukikol — Virevoltage Collant : frappe et pose un glyphe retirant 100 PM aux personnages présents dessus."
        ]
      },
      {
        "title": "Boss — Moon",
        "mechanics": [
          "Rituel d'Emprisonnement : Moon reçoit 100% de résistances dans tous les éléments (il est invulnérable sans action préalable).",
          "Face Cachée : invoque Darkli Moon (3 PM) qui pose des glyphes de couleur sur la map et échange sa position avec un personnage ou une invocation (ce qui booste Moon de 100 en puissance dans le donjon normal, ou 300 puissance en expédition).",
          "Marteau de Moon : frappe du 130 (donjon normal) ou 500 dégâts neutre (expédition), retire 3 PA, 3 PM et 1 PO pour 1 tour.",
          "Choc Sismique : frappe du 60 en zone (donjon normal) ou 500 dégâts neutre + téléportation symétrique autour du Moon (expédition).",
          "Mécanique clé — Totems de couleur : Darkli Moon invoque 4 totems (Rouge=Feu, Vert=Air, Bleu=Eau, Jaune=Terre) et pose des glyphes de la couleur correspondante. Pour retirer les 100% de résistances de Moon dans un élément, il faut placer le totem de cet élément sur la glyphe de sa couleur.",
          "Déplacement des totems : les sorts de placement (poussée, etc.) ne fonctionnent pas sur les totems. Pour les attirer, frapper le totem en ligne avec un sort de son élément : le totem est attiré au contact du personnage (s'il est en ligne et sans obstacle).",
          "Les totems ont 100% de résistances dans leur propre élément (impossible de les tuer en les attirant).",
          "Frapper Darkli Moon échange la position du personnage avec lui (utile pour se déplacer).",
          "Glyphes mal placées : si deux glyphes se superposent ou si un totem est inaccessible, le placement peut être impossible.",
          "En expédition : Moon a 200% de résistances ; les totems ne font que 500 PV ; à chaque fin de tour le personnage échange de place avec le totem le plus proche ; ce totem pose un glyphe noir qui OS ; tuer tous les totems au tour 1 évite ces échanges pendant 5 tours."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/8378912_orig.jpg",
            "caption": "Moon invulnérabilité — schéma état"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/8320726_orig.jpg",
            "caption": "Retirer l'état invulnérable de Moon — placement des totems sur glyphes"
          }
        ]
      }
    ],
    "tips": [
      "Accès : se rendre sur l'Île de Moon dans la Jungle Interdite en [29,6] puis parler à la Servante de Moon pour entrer. Prérequis : avoir réalisé la quête « Partir un jour sans retour » (lancée en [11,10]).",
      "Quêtes liées : Rendez-vous avec la lune, Tour d'horizon.",
      "Recette de la clef : 2x Feuille de Fourbasse, 2x Fleur de Gloutovore, 2x Trukikol Mort, 2x Plume de Dostrogo, 2x Viande Exsudative, 2x Anguille, 2x Edelweiss, 2x Seigle.",
      "Prévoir une pierre d'âme de puissance 100 minimum pour capturer le boss.",
      "La capture de l'âme de Moon est utile pour la quête du Dofus Ocre (L'éternelle moisson).",
      "À la fin du donjon, vous récupérez le sort « Marteau de Moon ».",
      "Ne jamais tenter de déplacer les totems avec des sorts de poussée/placement classiques — cela ne fonctionne pas.",
      "Frapper Darkli Moon échange votre position avec lui : utilisez-le pour vous repositionner facilement.",
      "Éviter l'élément Air : les monstres ont entre 20 et 42% de résistances Air en expédition.",
      "Stratégie expédition recommandée : tuer les 4 totems dès le tour 1 pour éviter les échanges de place et glyphes noirs OS pendant les 5 premiers tours, puis replacer les totems sur les glyphes à partir du tour 6."
    ],
    "rewards": [
      "Sort « Marteau de Moon » (obtenu en fin de donjon).",
      "Âme de Moon (pierre d'âme puissance 100 minimum — utile pour la quête du Dofus Ocre)."
    ],
    "achievements": [
      {
        "name": "Animal totem",
        "strategy": "Les totems de Darkli Moon ne doivent jamais perdre de points de vie. Ne taper les totems que dans l'élément correspondant à leur résistance pour les attirer sans les blesser. Frapper en ligne dans l'élément du totem l'attire au contact du personnage sans lui infliger de dégâts.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Le Pounicheur est le boss du Miausolee, un donjon de dimension (Ecaflipus) en une seule sa
  93: {
    "summary": "Le Pounicheur est le boss du Miausolee, un donjon de dimension (Ecaflipus) en une seule salle avec 5 vagues de monstres. La mecanique principale du boss repose sur 3 puces invoquees (Tipoune, Tipoune, Tipoude) dont les etats I/II/III doivent etre synchronises pour eviter que le Pounicheur ne renvoie le double des degats a toute l'equipe.",
    "recommendedLevel": "Variable (dimension divine Ecaflipus)",
    "composition": "Equipe capable de gerer plusieurs vagues simultanees ; poisons utiles contre le boss car non renvoyes.",
    "keyResist": [
      "Variable (voir resistances)"
    ],
    "phases": [
      {
        "title": "Vagues de monstres (5 vagues)",
        "mechanics": [
          "Une seule salle, 5 vagues de monstres ; la vague suivante arrive a un nombre de tours predefini ou des que tous les monstres de la vague precedente sont elimines.",
          "Nombre de monstres par vague = nombre de combattants (donjon modulaire).",
          "Tuer les monstres rapidement evite de se retrouver face a 10+ ennemis simultanement.",
          "Ecaflipuce — Nuee de tiques : degats eau ~130 en zone cercle taille 2, vol de 2 portee.",
          "Ecaflipuce — Ponction revitalisante : vol de vie air ~100 en ligne, sans LdV, portee minimale.",
          "Ecaflipuce — Parasitage : malus 10% resistances sans LdV portee infinie, cumulatif jusqu'a 100% ; IA fuyarde, tacler pour eviter les attaques.",
          "Pikpuce — Secouage : degats feu ~150 au CaC, poussee 4 cases.",
          "Pikpuce — Demangeaisons : degats terre ~150 au CaC, -50% dommages finaux 1 tour sur la cible.",
          "Pikpuce — Saut de puce : teleportation jusqu'a 4 PO, retire 2 PM autour de la case d'arrivee.",
          "Pupuce — Morzerk : etat infini, +50 puissance par coup recu.",
          "Pupuce — Roupetkifouette : degats terre ~100-150 jusqu'a 3 PO, 15% erosion 1 tour.",
          "Pupuce — Invasion parasitaire : degats neutre ~100-150 en ligne, tres grande portee (15+ PO), echange de place avec la cible.",
          "Pikbul — Dejection empoisonnee : poison feu, perte de 10 PV par PA utilise pendant 1 tour.",
          "Pikbul — Infestation : degats terre ~200 en diagonale, grande portee, attire le lanceur vers la cible.",
          "Pikbul — Ectoparasite : CaC uniquement, -200 fuite, etats Pesanteur et Indeplac,able ; si le Pikbul est frappe au CaC, les degats frappent la cible sous Ectoparasite.",
          "Pupouce — Pupulsion : etat infini, +100% critique (1 tour) a celui qui l'attaque au corps porte (possible bug).",
          "Pupouce — Pupussucion : degats air ~100 en ligne, ~5 PO, vol 2 PM 1 tour.",
          "Pupouce — Pupunition : degats neutre ~150 au contact."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/6428082_orig.jpg",
            "caption": "Zone Nuee de tiques (Ecaflipuce)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/1109275_orig.jpg",
            "caption": "Zone Ponction revitalisante (Ecaflipuce)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/6109209_orig.jpg",
            "caption": "Zone Parasitage (Ecaflipuce)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/2046349_orig.jpg",
            "caption": "Zone Secouage (Pikpuce)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/1516734_orig.jpg",
            "caption": "Zone Demangeaisons (Pikpuce)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/6658888_orig.jpg",
            "caption": "Zone Saut de puce (Pikpuce)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/311581_orig.jpg",
            "caption": "Zone Morzerk (Pupuce)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/5348824_orig.jpg",
            "caption": "Zone Roupetkifouette (Pupuce)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/3555414_orig.jpg",
            "caption": "Zone Invasion parasitaire (Pupuce)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/4953652_orig.jpg",
            "caption": "Zone Dejection empoisonnee (Pikbul)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/5015614.jpg",
            "caption": "Zone Infestation (Pikbul)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/6802249_orig.jpg",
            "caption": "Zone Ectoparasite (Pikbul)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/2737739_orig.jpg",
            "caption": "Zone Pupulsion (Pupouce)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/2568450_orig.jpg",
            "caption": "Zone Pupussucion (Pupouce)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/8961137_orig.jpg",
            "caption": "Zone Pupunition (Pupouce)"
          }
        ]
      },
      {
        "title": "Boss : Pounicheur — Mecanique des puces",
        "mechanics": [
          "Le Pounicheur invoque des le debut du combat Tipoune, Tipoune et Tipoude (3 puces invulnerables) dans les etats I, II ou III.",
          "Au debut de chacun de ses tours, le Pounicheur change l'etat de toutes ses puces.",
          "Si les 3 puces ont le meme etat, il lance Pourrification (retire 1 tour d'effet a tous les allies) et Poulverisation (degats neutres en zone autour de lui + poussee 4 cases).",
          "Renvoi de dommages : si les 3 puces n'ont PAS le meme etat, le Pounicheur renvoie ~200% des degats recus a toute l'equipe.",
          "Synchronisation des puces : frapper une puce au CaC (en etant sur la case adjacente) incremente son etat (I->II->III->I) et repousse de 2 cases ; les 2 autres puces decrementent leur etat (III->II->I->III).",
          "Objectif : aligner les 3 puces sur le meme etat avant d'attaquer le boss.",
          "Si l'alignement est impossible ce tour : attendre un tour ou utiliser des poisons (non renvoyes).",
          "Alternative : eliminer le Pounicheur en une seule ligne de degats massifs (ex. Colere de Iop) car le renvoi n'est pas declenche si le boss meurt du coup.",
          "Pourrification : enleve un tour d'effet a tous les allies si les 3 puces sont dans le meme etat.",
          "Poulverisation : degats neutres en zone autour du Pounicheur + poussee 4 cases."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/4280938_orig.jpg",
            "caption": "Zone Pourrification (Pounicheur)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/8725020_orig.jpg",
            "caption": "Zone Poulverisation (Pounicheur)"
          }
        ]
      }
    ],
    "tips": [
      "Donjon dans la dimension divine Ecaflipus, en [3,-9] zone Pierres de l'elevation.",
      "Clef du Miausolee du Pounicheur requise (trousseau et teleportation ne fonctionnent pas).",
      "Recette de la clef : 3x Seigle, 3x Edelweiss, 2x Dorade Grise, 2x Palpe de Pikbul, 2x Peau de Geriatique, 2x Epine de Grath, 2x Patte de Pupuce, 1x Larve petrifiee d'Ecaflipuce.",
      "La Larve petrifiee d'Ecaflipuce s'achete contre 1 Orichor aupres du PNJ Collecteur Ekah en [-1,-6] dans Ecaflipus (Orichors obtenus via quetes des dimensions divines).",
      "Parler au Caporal Tomonte pour entrer dans le donjon.",
      "Ce donjon ne se capture pas (boss non capturable).",
      "Quete liee : Teste et approuve.",
      "Les poisons ne sont pas renvoyes par le Pounicheur : strategie viable pour l'eliminer sans risque.",
      "Tuer l'Ecaflipuce en priorite pour eviter l'accumulation de malus de resistances (Parasitage cumulatif jusqu'a -100%).",
      "Tacler l'Ecaflipuce pour limiter sa mobilite (IA fuyarde)."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Sac a pupuces",
        "strategy": "Chaque pupuce invoquee par le Pounicheur ne doit pas changer d'etat plus d'une fois par tour global. Synchroniser les puces en un minimum de changements d'etat par tour.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Le Plateau de Ush est un donjon de la dimension divine Ecaflipus composé d'une seule salle
  94: {
    "summary": "Le Plateau de Ush est un donjon de la dimension divine Ecaflipus composé d'une seule salle avec 5 vagues de monstres. Le combat final oppose deux boss Ush Galesh qui partagent leurs dégâts et changent d'état à chaque coup reçu, obligeant à alterner frappes à distance et au corps-à-corps.",
    "recommendedLevel": "Variable (donjon de dimension divine)",
    "composition": "Groupe de 4 joueurs (modulaire). Roublard recommandé pour le succès spécial. Sorts à fort dégâts de base utiles.",
    "keyResist": [
      "Variable (voir résistances)"
    ],
    "phases": [
      {
        "title": "Vagues 1 à 5 — Monstres (Chacrebleu, Chakaroze, Chakichan, Chargus, Chasquatch)",
        "mechanics": [
          "Matoumorphose : sort commun à tous les monstres, placé sur le monstre le plus proche de celui qui le lance à chaque début de tour ; si un seul monstre reste, il est toujours en état Matoumorphose.",
          "Si un personnage en état Matoumorphose meurt, l'état est transmis au monstre le plus proche.",
          "Chacrebleu — Fortifichation : dégâts feu au CàC cases adjacentes + bouclier 1 tour ; en Matoumorphose : vol 2 PM.",
          "Chacrebleu — Retour de Chachaton : dégâts feu, état « C'est toi le Chacha ! » (renvoie dégâts au CàC) 1 tour.",
          "Chacrebleu — Chamboulement : ligne 3 PO, avance vers la cible puis détour, malus fuite 1 tour, dégâts terre.",
          "Chakaroze — Griffure Ondulante : dégâts terre en ligne 6 PO, déclenche 1-5 dégâts Terre infinis (retiré par soin).",
          "Chakaroze — Chatomisation : dégâts terre zone cercle rayon 2 PO, malus tacle 1 tour.",
          "Chakaroze — Miaoulement : dégâts chance ligne 8 PO sans LDV, -1 à la durée des effets.",
          "Chakichan — Chakcélération : boost de 1 PM par coup reçu (infini).",
          "Chakichan — Mawatougeri : poison 7 PO sans LDV, chaque PM utilisé fait perdre 15 PV feu 1 tour.",
          "Chakichan — Griffe à un Pouce : dégâts neutres au CàC selon vitalité restante, peut être lancé 2 fois/tour ; en Matoumorphose, tue la cible au CàC.",
          "Chargus — Duplichation : invoque un double (mêmes sorts) pendant 2 tours, CD 4 tours.",
          "Chargus — Vieillissement Prématuré : dégâts agilité diagonale 3 PO, vol puissance 1 tour ; en Matoumorphose : boost de 400 puissance + état Pacifiste à la cible.",
          "Chargus — Queue de Poing : dégâts eau, pousse la cible de 3 cases.",
          "Chasquatch — Ailurophilie : boost infini, soigne les personnages à 5 PO quand Chasquatch est frappé (premier coup de chaque personnage seulement).",
          "Chasquatch — Câlin Félin : dégâts eau zone croix 2 PO à 4-10 PO en ligne uniquement.",
          "Chasquatch — Léchouille : dégâts feu 6 PO, soin de 400 PV lors du prochain premier coup contre le monstre.",
          "Tuer les monstres rapidement pour éviter d'accumuler plusieurs vagues simultanément."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/9133293_orig.jpg",
            "caption": "Zone d'effet Fortifichation (Chacrebleu)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/7739152_orig.jpg",
            "caption": "Zone d'effet Retour de Chachaton (Chacrebleu)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/7244569_orig.jpg",
            "caption": "Zone d'effet Chamboulement (Chacrebleu)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/3738381_orig.jpg",
            "caption": "Zone d'effet Griffure Ondulante (Chakaroze)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/4841374_orig.jpg",
            "caption": "Zone d'effet Chatomisation (Chakaroze)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/8856295_orig.jpg",
            "caption": "Zone d'effet Miaoulement (Chakaroze)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/2801479_orig.jpg",
            "caption": "Zone d'effet Chakcélération (Chakichan)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/6117585_orig.jpg",
            "caption": "Zone d'effet Mawatougeri (Chakichan)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/5413834_orig.jpg",
            "caption": "Zone d'effet Griffe à un Pouce (Chakichan)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/2414521_orig.jpg",
            "caption": "Zone d'effet Duplichation (Chargus)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/6910261_orig.jpg",
            "caption": "Zone d'effet Vieillissement Prématuré (Chargus)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/4754230_orig.jpg",
            "caption": "Zone d'effet Queue de Poing (Chargus)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/3312470_orig.jpg",
            "caption": "Zone d'effet Ailurophilie (Chasquatch)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/7626646_orig.jpg",
            "caption": "Zone d'effet Câlin Félin (Chasquatch)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/6779711_orig.jpg",
            "caption": "Zone d'effet Léchouille (Chasquatch)"
          }
        ]
      },
      {
        "title": "Boss — Ush Galesh (deux exemplaires)",
        "mechanics": [
          "Deux Ush Galesh simultanément : les dégâts infligés à l'un sont divisés par 2 et appliqués aux deux.",
          "Rouge et Noir : met les états Intaclable, Indéplaçable, Rouge (infini) et Noir (infini) sur un des Ush.",
          "Négativisme : annule l'état Rouge et Noir pour le transférer à l'autre Ush.",
          "Mécanique clé : chaque coup reçu (qui inflige des dégâts) fait changer d'état l'Ush frappé — il faut alterner frappe à distance et frappe au CàC.",
          "État rouge → frapper au CàC ; état noir → frapper à distance.",
          "Les deux Ush partagent l'état Lourd, ce qui peut empêcher les poussées.",
          "Éclair Rouge (Ush rouge) : dégâts feu ligne 12 PO, -15% résistance 1 tour.",
          "Frappe Noire (Ush noir) : dégâts terre au CàC, retire 3 PM.",
          "Pulsation Malsaine (Ush rouge) : dégâts feu au CàC + repousse 3 cases.",
          "Pulsation Malsaine (Ush noir) : dégâts neutres en croix, attire la cible à 3 PO minimum."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/6074062_orig.jpg",
            "caption": "Zone d'effet Éclair Rouge (Ush rouge)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/9139599_orig.jpg",
            "caption": "Zone d'effet Frappe Noire (Ush noir)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/7582534.jpg",
            "caption": "Zone d'effet Pulsation Malsaine (Ush rouge)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/5854989_orig.jpg",
            "caption": "Zone d'effet Pulsation Malsaine (Ush noir)"
          }
        ]
      }
    ],
    "tips": [
      "Accès : dimension divine Ecaflipus, zone Lande Poilue en [7,-3]. Parler à Chalfred pour entrer.",
      "Clef du Plateau de Ush requise (trousseau de clef ne fonctionne pas ici, téléportation impossible).",
      "Recette clef : 2x Belladone, 2x Maïs, 2x Bar Rikain, 2x Queue du Chasquatch, 2x Poil de Chacrebleu, 2x Collier de Chakichan, 2x Oreille de Chargus, 1x Griffe de Matougarou.",
      "La Griffe de Matougarou s'achète contre 2x Orichor auprès du PNJ Collecteur Ekah en [-1,-6] dans Ecaflipus.",
      "Donjon modulaire : 1 boss + 3 monstres pour 4 joueurs, +1 monstre par combattant supplémentaire. 5 vagues au total.",
      "Ce donjon ne se capture pas et le boss ne peut pas être capturé.",
      "Quête liée : En rouge et noir.",
      "Tuer vite chaque vague pour ne pas cumuler trop d'ennemis simultanément.",
      "Pour le boss, surveiller l'état de l'Ush ciblé (rouge = CàC, noir = distance) et alterner à chaque coup."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Succès Spécial : Duel et pique",
        "strategy": "Chaque ennemi ne peut subir qu'une seule ligne de dégâts par tour complet. Utiliser des sorts à fort dégâts de base pour éliminer en 1-2 attaques. Idéal : préparer un mur de bombes avec un Roublard et y placer les ennemis un par un pour les éliminer en une ligne de dégâts.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Le Capitaine Meno est un boss invoqueur qui reduit les degats subis de 50% mais se soigne 
  97: {
    "summary": "Le Capitaine Meno est un boss invoqueur qui reduit les degats subis de 50% mais se soigne a hauteur des degats infliges a vos personnages. La cle est de survivre une dizaine de tours pour accumuler les 20% de degats finaux par tour, utiliser les glyphes Crystallisation pour le bouclier, et privilegier les poisons (non reduits par sa resistance).",
    "recommendedLevel": "120 — 160",
    "composition": "Classes avec retrait PM / poussee a distance (Cra, Enutrof, Sadida). Pour Blitzkrieg : Eliotrope + Iop ou Cra. Pour Duo : Feca (eau/Pavois) ou Sram (air/poisons). Une classe de soin ou protection est conseillee.",
    "keyResist": [
      "Variable (voir resistances)"
    ],
    "phases": [
      {
        "title": "Monstres — Effet special Mutation Instable",
        "mechanics": [
          "Chaque monstre lance Mutation Instable a son debut de tour : l'etat de Mutation depend de son % de PV (100-76% : aucune mutation ; 75-51% : Mutation I ; 50-26% : Mutation II ; 25-0% : Mutation III).",
          "Chaque etat debloque un sort supplementaire propre au monstre, avec des effets croissants de Mutation I a III.",
          "Mutation II confere +1 PM au monstre.",
          "Pour retirer l'etat Mutation d'un monstre, le pousser sans lui infliger de degats de poussee.",
          "Crabe Yoloniste — Gesticulation Ridicule : 400 degats eau + invoque une Etoile Swagante (1 000 PV, renvoie 200% des dommages recus), sort en ligne jusqu'a 8 PO.",
          "Crabe Yoloniste — Pince Ecrasante : 1 100 degats neutre en melee (x2/tour).",
          "Crabe Yoloniste — Yolosouage (Mutation) : echange de place avec l'Etoile Swagante + attire en cercle croissant (rayon 3/4/5) selon la Mutation.",
          "Gambaf — Pas Chasse Frontal : avance en melee, 650 degats terre + repousse 4 cases (si degats de poussee : +400 puissance pour 1 tour et attire la cible).",
          "Gambaf — Point-meteore : teleportation au contact d'un allie + 550 degats eau en cercle 2.",
          "Gambaf — Enchainement de Coups de Poing Normaux (Mutation) : 750 degats terre + retire 2/4/6 PA et reduit duree des effets de 1/2/3 tours en melee.",
          "Mantaze — Eclair Obscur : 250 degats feu + etat Conducteur 3 tours + +15% degats subis. Soigner la cible retire l'etat Conducteur.",
          "Mantaze — Electrochoc : degats neutre = 10% des PV erodes de la cible, jusqu'a 6 PO.",
          "Mantaze — Foudre Marine (Mutation) : 500/725/950 degats air a TOUS les personnages en etat Conducteur (lancable a partir du tour 3, relance 3 tours).",
          "Mol Husk — Bave Acide : 350 degats air + retire 2 PA, jusqu'a 12 PO.",
          "Mol Husk — Trainee Collante : 550 degats feu + glyphe en ligne retirant 100 PM et 50% vitalite, 5 PO en ligne sans LdV.",
          "Mol Husk — Roulemboule (Mutation) : 550 degats neutre + erosion 10/20/30% pour 1 tour, jusqu'a 3 PO en ligne.",
          "Tilamproie — Piege Parasite : pose un piege croix diagonale taille 1 (jusqu'a 6 PO) ; declenche, teleporte le Tilamproie en melee avec vous.",
          "Tilamproie — Succion Attractive : 550 degats eau + attire 4 cases, en ligne jusqu'a 5 PO.",
          "Tilamproie — Morsure Filtrante (Mutation) : 450 degats terre + poison 450 terre (1/2/3 tours) + retire 3/5/7 PO pour 1 tour, jusqu'a 2 PO."
        ]
      },
      {
        "title": "Boss — Capitaine Meno",
        "mechanics": [
          "Meno reduit les degats subis de 50% pour tout le combat. En contrepartie, chaque personnage gagne +20% de degats finaux par tour (cumulable a l'infini).",
          "Les poisons ne sont PAS reduits par sa resistance — a privilegier.",
          "A chaque fois qu'un monstre ou Meno inflige des degats a vos personnages, Meno est soigne du meme montant.",
          "Matiere Volatile : 500 degats air, jusqu'a 4 PO sans LdV (1 fois/tour).",
          "Crystallisation : 500 degats eau + pose un glyphe permanent taille 1 sur la case cible (etat Crystallisation si on y finit son tour), jusqu'a 10 PO (2 fois/tour).",
          "Mecanique Glyphe Crystallisation : au debut du tour de Meno, tout glyphe occupe est declenche — 1 300 degats feu a tous les personnages alignes avec les entites sur glyphes a 5 PO + devoile les invisibles. Un personnage dans un glyphe gagne 1 000 de bouclier pour 1 tour.",
          "Au debut du combat, Meno modifie Mutation Instable de tous les monstres : ils deviennent invulnerables MAIS perdent 25% PV max par tour (meurent au bout de 4 tours) et perdent 1 PM pour tout le combat.",
          "Tour 1 : Meno n'invoque pas de monstre. A partir du tour 2 : invoque 2 monstres/tour (3 en butin 5+) selon un schema cyclique fixe.",
          "Butin 4 — T2 : Crabe Yoloniste + Mol Husk ; T3 : Gambaf + Mantaze ; T4 : Mol Husk + Tilamproie ; T5 : Crabe Yoloniste + Gambaf ; T6 : Mantaze + Tilamproie (puis cycle).",
          "Il faut environ une dizaine de tours pour accumuler suffisamment de degats pour tuer le Meno."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/66ark1mpazr_orig.jpg",
            "caption": "Tableau de resistances et sorts du Capitaine Meno"
          }
        ]
      }
    ],
    "tips": [
      "Position du donjon : Ville submergee des profondeurs de Sufokia, en [24,27]. L'acces aux profondeurs se trouve a Sufokia en [23,24].",
      "Recette de la clef : 2x Bave de Mol Usk, 2x Pince de Crabe Yoloniste, 2x Ecaille de Gambaf, 1x Bois d'Aquajou, 1x Salikrone, 1x Quisnoa, 1x Patelle, 1x Ecume de mer.",
      "Quetes liees : Piege de crystal, Une voix de crystal, Les totems de Maimane.",
      "Il n'est pas possible de capturer le Boss.",
      "Placez les personnages en diagonale les uns des autres sur les glyphes Crystallisation pour eviter les degats en ligne.",
      "Soignez les cibles du sort Eclair Obscur de la Mantaze pour retirer l'etat Conducteur et neutraliser Foudre Marine.",
      "Repoussez le Crabe Yoloniste en priorite quand il est bas en PV (etat Mutation III = tres dangereux), n'hesitez pas a tuer l'Etoile Swagante si elle est trop proche.",
      "Evitez de declencher le Piege Parasite du Tilamproie (ne pas marcher dans ses diagonales adjacentes).",
      "Les poisons ne sont pas reduits par la resistance du Meno : les utiliser autant que possible."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Blitzkrieg",
        "strategy": "Ne pas toucher le Capitaine Meno pendant de nombreux tours (environ 15 tours avec Eliotrope+Iop, environ 30 tours avec un seul Cra) afin d'accumuler suffisamment de degats pour l'achever en un seul tour.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/blitzkrieg.png"
      },
      {
        "name": "Prudent",
        "strategy": "Ne jamais finir son tour en case adjacente a un ennemi. Attention au Piege Parasite du Tilamproie (croix diagonale taille 1) qui peut le teleporter en melee avec vous.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/prudent.png"
      },
      {
        "name": "Parfum de mutinerie (Special)",
        "strategy": "Toujours finir son tour en ligne avec un allie. La contrainte limite l'usage des glyphes Crystallisation ; finir a plus de 6 PO en ligne d'un allie pour utiliser les glyphes sans degats collateraux. L'erosion et les attaques directes sur le Meno permettent de terminer le combat en 7 a 10 tours.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Feca eau (Pavois invulnerable coupe les lignes de vue) + autre classe, ou Sram air (Brume + poisons pour tuer le Meno en 10 tours environ en se cachant derriere un Comploteur).",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // La Larve de Koutoulou est le boss du Temple de Koutoulou, dans les Abysses de Sufokia
  98: {
    "summary": "La Larve de Koutoulou est le boss du Temple de Koutoulou, dans les Abysses de Sufokia. La mecanique centrale Horreur Cosmique force un echange de place avec l entite la plus proche a chaque degat direct inflige, et finir son tour en ligne de vue du Koutoulou fait gagner un etat de Folie. La strategie cle est d eviter la ligne de vue du boss, d eliminer rapidement le Klutiste et le Li-Fo, et d utiliser les poisons pour frapper sans declencher les echanges de place.",
    "recommendedLevel": "Variable (donjon de haut niveau, Abysses de Sufokia)",
    "composition": "Equipe polyvalente avec un Pandawa conseille pour les succes Hardi et Special. Pour le duo, un Sram agilite avec ses poisons est recommande. Privilegier des personnages tapant fort au cac pour le score 200.",
    "keyResist": [
      "Terre"
    ],
    "phases": [
      {
        "title": "Salles avant le Boss",
        "mechanics": [
          "Les etats de Folie (1 a 10) sont actifs dans tout le donjon mais rarement fatals avant le boss.",
          "Folie 2 : inflige 100% des degats du sort utilise a tous les allies dans une zone 2PO autour de soi.",
          "Folie 4 : soins recus x50%.",
          "Folie 6 : dommages subis x100%.",
          "Folie 10 : mort instantanee (OS).",
          "Chaque etat de Folie cumule les malus des etats precedents.",
          "On perd 1 etat de Folie a chaque debut de tour — cacher un personnage trop fou quelques tours pour decremente.",
          "Sources de Folie dans les salles : Klutiste (Folle Cacophonie), Grofond (Sphere Corrosive), Li-Fo (Ponction Morbide), N'Yalg (Enfouissement si attire), Shokkoth (doubles via Triangle Dement ou Oeil Horrifiant).",
          "Grofond — Attraction Repugnante : attire de 5 cases + 500 degats eau, ligne jusqu'a 6PO.",
          "Grofond — Sphere Corrosive : 450 degats terre, zone cercle rayon 2, Pesanteur 1 tour, +1 Folie.",
          "Klutiste — Folle Cacophonie : 700 degats feu, demi-cercle rayon 2, repousse 3 cases, +1 Folie, cac uniquement.",
          "Klutiste — Intensite Demoniaque : boost allies dans rayon 3 (2PM, 200 puissance, 25% vitalite) pour 1 tour.",
          "Klutiste — Melopee Pernicieuse : -4PM (esquivables) + 500 degats eau, 5-12PO modifiable.",
          "Li-Fo — Duplication Grotesque : dedouble un monstre cible jusqu'a 3PO (pas au tour 1, relance 3 tours).",
          "Li-Fo — Ponction Morbide : vol 1000 PV pour 2 tours (cumulable x2) + Insoignable 1 tour, +1 Folie, ligne jusqu'a 5PO.",
          "N'Yalg — Enfouissement : N'Yalg devient indeplecable 1 tour + attire les personnages en ligne a 4PO cac (+1 Folie si attire).",
          "N'Yalg — Expulsion Miasmatique : 600 degats eau, invoque Miasme Polarisateur (glyphe rayon 2 qui reduit degats finaux de 25% et frappe ~40 en fin de tour), ligne jusqu'a 6PO.",
          "N'Yalg — Flagellation Paralysante : 400 degats air, -4PM esquivable, jusqu'a 3PO.",
          "Shokkoth — Triangle Dement : invoque glyphe noir (cone taille 3) ; les allies qui le traversent sont dedoubles. Le double avance vers les ennemis sans frapper, vous subissez ses degats. +1 Folie si le double joue.",
          "Shokkoth — Oeil Horrifiant : 500 degats neutres + dedouble le personnage touche. +1 Folie si le double joue. Cac uniquement."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj3-folies_orig.png",
            "caption": "Tableau des etats de Folie (1-10) et leurs malus"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj3-attraction-repugnante_orig.png",
            "caption": "Schema sort Attraction Repugnante (Grofond)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj3-sphere-corrosive_orig.png",
            "caption": "Schema sort Sphere Corrosive (Grofond)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj3-folle-cacophonie_orig.png",
            "caption": "Schema sort Folle Cacophonie (Klutiste)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj3-intensite-demoniaque_orig.png",
            "caption": "Schema sort Intensite Demoniaque (Klutiste)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj3-melopee-pernicieuse_orig.png",
            "caption": "Schema sort Melopee Pernicieuse (Klutiste)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj3-duplication-grotesque_orig.png",
            "caption": "Schema sort Duplication Grotesque (Li-Fo)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj3-ponction-morbide_orig.png",
            "caption": "Schema sort Ponction Morbide (Li-Fo)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj3-enfouissement_orig.png",
            "caption": "Schema sort Enfouissement (N'Yalg)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj3-expulsion-miasmatique_orig.png",
            "caption": "Schema sort Expulsion Miasmatique (N'Yalg)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj3-flagellation-paralysante_orig.png",
            "caption": "Schema sort Flagellation Paralysante (N'Yalg)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj3-triangle-dement_orig.png",
            "caption": "Schema sort Triangle Dement (Shokkoth)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj3-oeil-horrifiant_orig.png",
            "caption": "Schema sort Oeil Horrifiant (Shokkoth)"
          }
        ]
      },
      {
        "title": "Combat du Boss — Larve de Koutoulou",
        "mechanics": [
          "Note : le boss combattu est une larve de Koutoulou ; le vrai Koutoulou est visible au fond de la map.",
          "Horreur Cosmique : a chaque degat direct inflige a un ennemi, echange de place avec l entite la plus proche (ennemi ou allie, hors invocation alliee). Cette entite gagne l etat Hallucine pour le tour en cours.",
          "Horreur Cosmique — ennemi : si vous echangez 2 fois de place avec le meme ennemi pendant votre tour, il devient invulnerable jusqu au prochain tour de l allie qui l a rendu invulnerable, et vous gagnez +1 Folie (cumulable).",
          "Horreur Cosmique — allie : si vous echangez 2 fois de place avec le meme allie pendant votre tour, vous gagnez +1 Folie (cumulable).",
          "L echange de place est force et ne peut pas etre evite par Pesanteur, Enracine ou Indeplecable.",
          "Limite : l effet est plafonne a 10 echanges par tour ; au-dela vous frappez librement sans echange.",
          "Vacillement de l Univers (passif) : finir son tour en ligne de vue du Koutoulou = +1 Folie.",
          "Vacillement de l Univers (actif, tour 2+) : au debut de son tour, le Koutoulou teleporte tous les personnages en ligne de vue a son cac. Pesanteur/Enracine/Indeplecable protegeent. Invocation devant le Koutoulou en fin de tour pour bloquer sa ligne de vue.",
          "Frappe Koutonienne : 1300 degats terre, melee uniquement, +1 Folie, lancable 4x/tour et 2x/cible.",
          "Permutation Inquietante : echange avec un allie jusqu a 6PO sans ligne de vue (2x/tour, 1x/cible) — pas au tour 1. Pesanteur sur le Koutoulou ou sur un monstre le bloque.",
          "Koutoulou frappe environ 2500 par tour sur 2 personnages en melee : eviter absolument le corps a corps.",
          "Koutoulou ne fait rien au tour 1 (utilise juste ses PM).",
          "Les poisons (hors epidemie et piege insidieux) ne declenchent PAS l echange de place — a utiliser sans moderation.",
          "Ordre de focus : Klutiste > Li-Fo > Shokkoth. Eliminer le Klutiste avant le tour 2 du Li-Fo pour empecher la duplication.",
          "Garder le Shokkoth a plus de 5PO des personnages pour eviter la duplication ; si un double apparait, le pousser contre un monstre.",
          "Koutoulou seul = peu dangereux : rester hors de sa ligne de vue + a plus de 6PM suffit."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj3-frappe-koutonienne_orig.png",
            "caption": "Schema sort Frappe Koutonienne (Koutoulou)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj3-permutation-inquietante_orig.png",
            "caption": "Schema sort Permutation Inquietante (Koutoulou)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj3-placement-koutoulou-seul_orig.png",
            "caption": "Placement optimal quand Koutoulou est seul (cases vertes = positions des personnages)"
          }
        ]
      }
    ],
    "tips": [
      "Entree du donjon : Abysses de Sufokia en [27,26] (entree des abysses en [23,24] dans le Palais de Sufokia).",
      "Recette de la clef : 1x Ecume de mer, 1x Patelle, 1x Quisnoa, 1x Salikrone, 1x Bois d Aquajou, 2x Tentacule de Grofond, 2x Tentacule de N Yalg, 2x Oeil de Shokkoth.",
      "Quetes liees : De mal en impie, Le creuset de Meriana, Les totems de Maimane.",
      "Ce boss ne peut pas etre capture.",
      "Les poisons (hors epidemie et piege insidieux) ne declenchent pas l echange de place — a privilegier pour frapper sans risque de Folie ni d invulnerabilite.",
      "A Folie 2 ou plus, rester a au moins 3PO de chaque allie quand on frappe un monstre.",
      "Placer une invocation devant le Koutoulou en fin de tour pour couper sa ligne de vue.",
      "Appliquer Pesanteur sur le Koutoulou pour bloquer Permutation Inquietante."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Prudent",
        "strategy": "Ne jamais finir son tour adjacent a un ennemi. Facile : la strategie normale du donjon le permet naturellement. Incompatible avec Hardi en simultane.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/prudent.png"
      },
      {
        "name": "Hardi",
        "strategy": "Finir chaque tour adjacent a un ennemi. Strategie Pandawa (81 fuite minimum, coiffe Chapeau Lithique pour relance Stabilisation/Brassage en 2 tours). Pandawa porte le second personnage au cac du Li-Fo, applique Pesanteur/Enracine sur le Li-Fo chaque tour, replace le Koutoulou loin. Le second personnage porte frappe depuis le Pandawa (50% degats en moins, mais en securite). Attention : etre porte n empechant pas les etats de Folie si on tape 2 fois.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/hardi.png"
      },
      {
        "name": "Special : Chaises musicales",
        "strategy": "Apres son premier tour, chaque ennemi doit echanger de place avec un allie au moins une fois entre chacun de ses tours. Jouer en butin 4 conseille. Utiliser la mecanique Horreur Cosmique pour declencher l echange apres chaque tour de monstre. Pandawa pour replacer les ennemis facilement. Focus Klutiste > isoler Li-Fo > gerer doubles Shokkoth > Koutoulou en dernier.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre avec 2 personnages en moins de 40 tours. Strategie : Sram agilite (Injection Toxique + Poison Insidieux) + une seconde classe forte au cac (stuff mono-element, 1 seule ligne de degats, Dofus Ebene conseille). Le second fait un max de degats sur le Klutiste avant de mourir, le Sram solote avec invisibilite + poisons. Contre le Koutoulou seul : se placer a 7PM, derriere obstacle, repousser avec Peur + poisons.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Dantinéa invoque des Grokillages liés à chaque personnage qui réduisent de 50% les dégâts 
  99: {
    "summary": "Dantinéa invoque des Grokillages liés à chaque personnage qui réduisent de 50% les dégâts tant qu'ils sont en vie, et OS les personnages liés s'ils survivent au tour 6. Il faut éliminer rapidement les Grokillages des damage dealers, puis tuer les monstres (Tryde en priorité) avant de finir Dantinéa.",
    "recommendedLevel": "~120",
    "composition": "Équipe équilibrée avec des damage dealers puissants ; des sorts de zone aident à localiser le Tryde invisible.",
    "keyResist": [
      "Neutre",
      "Eau",
      "Terre",
      "Air",
      "Feu"
    ],
    "phases": [
      {
        "title": "Monstres du donjon",
        "mechanics": [
          "Diondin — Projection Hydraulique : 450 eau, repousse croix infinie de 2 cases, uniquement en ligne jusqu'à 2PO (x2/tour).",
          "Diondin — Fougou Rebondissant : 500 terre en cercle rayon 2, applique état Intacleur 1 tour, uniquement en ligne jusqu'à 6PO.",
          "Diondin — Poussette Mortelle : 500 feu, repousse de 4 cases, met effet Poussette Mortelle aux personnages Pacifistes en ligne → OS si dommages de poussée reçus, uniquement en ligne à exactement 4PO.",
          "Poulpée — Séduction Abyssale (passif permanent) : terminer son tour en ligne de vue de la Poulpée → Insoignable 2 tours ; récidiver → perte de 100PM 2 tours en plus.",
          "Poulpée — Siphonage : échange de position avec un allié et le soigne de 13% de ses PV max, jusqu'à 4PO sans LdV.",
          "Poulpée — Tourbillonnement : 350 eau, -5PO 1 tour, poison « PM → 16PV eau » si cible en état Pesanteur, en ligne de 3 à 10PO (x2/tour).",
          "Rilur — Harpon-éclair : 300 air + poison ~300 air 1 tour, OS les personnages en état Affaibli ; pose un glyphe jaune (Pesanteur + 600 feu) sous lui, en ligne jusqu'à 2PO (x2/tour).",
          "Rilur — Charge Frontale : 350 neutre, s'attire sur la cible de 4 cases, pose glyphe jaune (Pesanteur + 600 feu) sous lui, en ligne jusqu'à 5PO.",
          "Tourthon — Retour de Bulles (passif) : renvoie 50% des dommages reçus si l'attaquant est Insoignable.",
          "Tourthon — Attraction Lumineuse : 250 feu, -4PA 1 tour, attire de 4 cases, en ligne jusqu'à 10PO (x2/tour).",
          "Tourthon — Enlacement : 800 neutre + état Pacifiste 1 tour, mêlée uniquement.",
          "Tryde — Camouflage Sous-marin (passif) : se rend invisible au début de chaque tour, gagne +100 Puissance cumulable infini ; seule la réception de dommages le rend visible et remet la Puissance à 0.",
          "Tryde — Prison Aqueuse : 500 air, téléportation en mêlée derrière la cible, pose piège invisible en croix taille 1 sous lui (attraction au centre si on marche dessus, incontournable sans téléportation/enraciné/inébranlable/indéplaçable), jusqu'à 5PO sans LdV (x3/tour)."
        ]
      },
      {
        "title": "Combat contre Dantinéa — Pacte Maléfique (Grokillages)",
        "mechanics": [
          "Dès le lancement, Dantinéa invoque autant de Grokillages (0PA/0PM, 1000PV) que de personnages.",
          "Chaque Grokillage est lié à un personnage (numéro fixe selon placement en préparation) : tant que le Grokillage lié est en vie, le personnage n'inflige que 50% de ses dégâts sur tous les monstres/Grokillages, et perd 1PM par tour.",
          "Les Grokillages sont invoqués à des positions fixes et assignés selon un ordre de priorité basé sur la case de départ choisie en prépa.",
          "À chaque début de tour, Dantinéa frappe 600 eau tous les personnages en ligne avec un Grokillage.",
          "Tous les 5 tours (tours 6, 11, 16…) : Dantinéa OS les Grokillages encore en vie ET les personnages liés à ces Grokillages, puis réinvoque une nouvelle vague.",
          "Dantinéa — Siphon d'Âme : 1000 neutre vol de vie, jusqu'à 3PO (x2/tour).",
          "Dantinéa — Danse Tentaculaire : 600 terre + 600 air en cercle rayon 2 autour d'elle.",
          "Dantinéa — Cooquillation : échange de position avec un de ses Grokillages, jusqu'à 6PO sans LdV (à partir du tour 2, tous les 2 tours)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj41-placements-grokillages_orig.png",
            "caption": "Positions des Grokillages (bleu) et ordre d'attribution aux personnages (rouge) selon la case de placement en préparation"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj41-54_orig.png",
            "caption": "Placements fixes des Grokillages dans le combat"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj41-53_orig.png",
            "caption": "Schéma récapitulatif du cycle OS au tour 6"
          }
        ]
      },
      {
        "title": "Stratégie globale",
        "mechanics": [
          "Prioriser l'élimination des Grokillages liés aux personnages avec la plus grande force de frappe pour libérer leur potentiel en premier.",
          "Ordre de priorité pour les monstres : Tryde (le plus gênant) → Rilur → Diondin.",
          "Les personnages encore liés à un Grokillage peuvent servir à frapper le Tryde une fois par tour pour empêcher l'accumulation de Puissance.",
          "Impératif : éliminer tous les Grokillages avant le tour 6 pour éviter les OS ; viser à tuer tous les monstres avant le tour 6 de Dantinéa.",
          "Après le tour 6, Dantinéa réinvoque des Grokillages : retuer en priorité ceux des damage dealers, puis rusher Dantinéa avant son tour 11.",
          "Éviter de rester en ligne avec les Grokillages (frappe eau de Dantinéa).",
          "Ne pas attaquer le Tourthon si un allié est en état Insoignable (50% dommages renvoyés).",
          "Ne jamais finir son tour en ligne de vue de la Poulpée.",
          "Fuir le Rilur si l'on a l'état Affaibli (OS sur Harpon-éclair).",
          "Éviter les glyphes jaunes posés par le Rilur (Pesanteur + 600 feu).",
          "Ne jamais finir en mêlée avec le Tourthon (Enlacement 800 neutre + Pacifiste) ; rester hors de sa ligne d'attraction à 10PO."
        ]
      }
    ],
    "tips": [
      "Position du donjon : Domaine des Trithons des Profondeurs de Sufokia en [19,26].",
      "Accès aux Profondeurs de Sufokia : Sufokia en [23,24].",
      "Recette de la clef : 1 Écume de mer, 1 Patelle, 1 Quisnoa, 1 Salikrone, 1 Bois d'Aquajou, 2 Trident de Tryde, 2 Encre de Poulpée, 2 Lanterne de Tourthon.",
      "Il n'est pas possible de capturer Dantinéa.",
      "Utiliser des sorts de zone pour localiser le Tryde invisible.",
      "Pour sortir du piège du Tryde : utiliser une téléportation ou être dans l'état enraciné/inébranlable/indéplaçable."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Chasse aux coquillages (succès Spécial)",
        "strategy": "Chaque personnage doit être le seul à taper le Grokillage qui lui est lié (le personnage n°1 tape uniquement le Grokillage n°1, etc.). Se placer stratégiquement en prépa pour éliminer les Grokillages rapidement avant le tour 6 grâce au schéma de placement.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Le Mantiscore est le boss du Cimetiere des Mastodontes, situe a Saharach
  100: {
    "summary": "Le Mantiscore est le boss du Cimetiere des Mastodontes, situe a Saharach. Sa mecanique centrale est le sort Garde-Bouclier : frappe a distance, il se teleporte sur une case adjacente disponible. La strategie consiste a rester a distance pour exploiter ce deplacement force, eliminer les Leolhyenes en priorite, et eviter absolument la melee pour ne pas declencher la boucle de soin via Darmocles.",
    "recommendedLevel": "80 — 100",
    "composition": "Personnages capables de soigner et de resister aux coups du Mantiscore ; privilegier la melee pour le succes score 200 avec composition Yoche + Dynamo.",
    "keyResist": [
      "Variable (voir resistances)"
    ],
    "phases": [
      {
        "title": "Monstres des salles (Boulepique, Fennex, Leolhyene, Ouroboulos, Scordion Bleu)",
        "mechanics": [
          "Boulepique — Durcissement : s'attire de 2 cases vers la cible, retire 3 PA esquivables pour 1 tour.",
          "Boulepique — Lance-Boulettes : 160 degats feu + etat affaibli dans un cercle taille 2, portee 2-4 PO.",
          "Boulepique — Pique Rate : 50 degats terre + retire 3 PM esquivables, zone ligne taille 4, uniquement en melee.",
          "Fennex — Enragement Motivant : applique +30% vitalite et +100 puissance a un allie pour 2 tours.",
          "Fennex — Entrave Sableuse : 70 degats neutre + poison eau infligeant 23 degats par PM utilise pendant 2 tours.",
          "Fennex — Reconnaissance : +3 PM et +150 Agilite pour 2 tours, revele les invisibles.",
          "Leolhyene — Hyaignement : 60 degats feu + poison feu (13 degats par PA utilise pendant 3 tours) ; retirable par soin.",
          "Leolhyene — Mort Sure : 120 degats terre en melee ; si relance sur la meme cible 2 tours apres, OS instantane.",
          "Leolhyene — Sirocco : 90 degats air + boost de 50 puissance aux allies dans un cercle de rayon 2.",
          "Ouroboulos — Carapassable : +10% resistance aux allies proches ; gagne 1 PM et +5% resistance a chaque degat a distance subi.",
          "Ouroboulos — Roulo-Boulos : 50 degats terre + repousse de 1 case + vole 2 PM esquivables, ligne 1-3 PO sans LDV.",
          "Ouroboulos — Sablacane : 60 degats eau + 50 degats air + retire 3 PO dans une croix taille 1, exactement a 3 PO en ligne.",
          "Scordion Bleu — Creuse Sable : glyphe carre retirant 20% vitalite et 2 PM aux ennemis ; le Scordion devient invisible 2 tours.",
          "Scordion Bleu — Dard Empoisonne : poison eau debut de tour (30 degats eau + -100 puissance par tour pendant 3 tours), portee 2 PO sans LDV.",
          "Scordion Bleu — Pince Pattes : 80 degats terre + retire 20 tacle et 2 PM esquivables en melee."
        ]
      },
      {
        "title": "Boss — Mantiscore",
        "mechanics": [
          "Garde-Bouclier (passif permanent) : chaque degat a distance force le Mantiscore a se teleporter sur une case adjacente disponible. Si aucune case libre, il perd 50% de resistance mais gagne 200 puissance pour 2 tours + etat Dereglement (ne se teleporte plus pendant 2 tours).",
          "Darmocles : 200 degats feu + applique l'etat Sursis a la cible en melee. Si la cible est deja en Sursis : 300 degats feu et le Mantiscore se soigne de 600 PV.",
          "Force Poigne : 130 degats eau + vole 2 PA esquivables ; applique l'etat Force Poigne (boost +20 puissance au Mantiscore a chaque soin de la cible).",
          "Provocaspion : attire tous les ennemis de 3 cases vers lui et gagne +50 puissance par ennemi en melee apres attirance. Relance 5 tours (tours 1, 6, 11...).",
          "Tombeau du Desert : 110 degats terre + Enracine 2 tours, portee 2-5 PO."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj26-9_orig.png",
            "caption": "Principe Garde-Bouclier : teleportation du Mantiscore apres frappe a distance"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj26-10_orig.png",
            "caption": "Schema de l'attirance Provocaspion (tours 1/6/11...)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj26-darmocles_orig.png",
            "caption": "Portee et zone de Darmocles"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj26-force-poigne_orig.png",
            "caption": "Portee et zone de Force Poigne"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj26-provocaspion_orig.png",
            "caption": "Portee et zone de Provocaspion"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj26-tombeau-du-desert_orig.png",
            "caption": "Portee et zone de Tombeau du Desert"
          }
        ]
      }
    ],
    "tips": [
      "Entree du donjon : Saharach, est de la zone Dunes des ossements en [19,-61].",
      "Recette de la clef : 2x Ecailles d'Ouroboulos, 2x Queue de Scordion Bleu, 2x Queue de Fennex, 2x Oeil de Leolhyene, 2x Viande Sanguinolente, 2x Brochet, 2x Orchidee Freyesque, 2x Lin.",
      "Pierre d'ame : puissance 100 minimum pour capturer le boss.",
      "Exploitez Garde-Bouclier : frapper a distance eloigne le Mantiscore d'une case, permettant de le maintenir hors de portee de melee.",
      "Eliminez les Leolhyenes en premier : leur sort Mort Sure peut OS un personnage si lance deux fois sur la meme cible en 2 tours.",
      "Avant les tours d'attirance (1/6/11...), se positionner derriere des obstacles ou invocations statiques pour bloquer Provocaspion.",
      "Ne pas encercler le Mantiscore : si ses 4 cases adjacentes sont bloquees, il perd 50% resistance mais gagne 200 puissance.",
      "Quetes liees : Le roi scorpion (vaincre le Mantiscore avec les gants equipes), Sans chair et en os, Retrouver un femur dans une botte d'ossements, Le fossile et le marteau."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Mains Propres",
        "strategy": "Achever tous les ennemis sans degats directs : utiliser poisons, glyphes, pieges, degats de poussee, renvois ou invocations.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/mains-propres.png"
      },
      {
        "name": "Zombie",
        "strategy": "Utiliser exactement 1 PM par tour. Exploiter Garde-Bouclier pour maintenir le Mantiscore a distance malgre la mobilite reduite ; des sorts de retrait PM peuvent aider.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/zombie.png"
      },
      {
        "name": "Special : A portee de dard",
        "strategy": "Le Mantiscore ne doit recevoir aucun degat a distance. Eliminer d'abord tous les monstres, puis finir le Mantiscore uniquement en melee (Garde-Bouclier inactif en melee).",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 20 tours. Si trop difficile, revenir avec quelques niveaux de plus.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // El Piko est le boss de la Caverne d'El Piko, un cactus qui applique l'effet Guerillero a t
  101: {
    "summary": "El Piko est le boss de la Caverne d'El Piko, un cactus qui applique l'effet Guerillero a tout le combat : chaque personnage finissant son tour en melee d'un allie inflige 110 degats a cet allie. A chaque debut de tour d'El Piko, tous les monstres recoivent un etat Tactique aleatoire (A/B/C/D) qui modifie leurs sorts et leur octroie un bonus. La strategie consiste a jouer a distance, tuer les Levitos en priorite, puis focus El Piko.",
    "recommendedLevel": "~100",
    "composition": "Equipe polyvalente conseillee a distance. Un Iop peut aider pour le succes Blitzkrieg (Colere). Focus Levito(s) en premier.",
    "keyResist": [
      "Variable (voir resistances)"
    ],
    "phases": [
      {
        "title": "Salles avant le boss",
        "mechanics": [
          "Monstres rencontres : Cactanus, Cacteau, Cactoblongo (Mouerte), Pampactus (Milepines, Unepine), Levito.",
          "Hors combat de boss, les monstres n'ont pas d'etat Tactique.",
          "Cactanus - Bonussocac : boost de 30 puissance + renvoi 30% degats corps a corps si frappe en melee. Pixor : renvoi de tous les degats de sorts pendant 1 tour.",
          "Pampactus - Milepines : retire 1000 PV pendant 1 tour (desenvoutable).",
          "Levito - Joropo : se boost de 3PA, 2PM mais perd esquive/tacle. Maracac : 200 degats feu + repousse. Salsa : 200 degats terre + retire 2PA/2PM esquivables."
        ]
      },
      {
        "title": "Combat contre El Piko (Boss)",
        "mechanics": [
          "Effet Guerillero (infini des le debut) : tout personnage finissant son tour inflige 110 degats a tous les personnages adjacents. L'element depend de l'etat Tactique d'El Piko (A=Terre, B=Feu, C=Air, D=Eau).",
          "Etat Tactique aleatoire a chaque debut de tour d'El Piko (25% chacun) : A=+10% resistances tous elements, B=+25 tacle/fuite, C=+25 esquive PA/PM, D=+100 puissance.",
          "Bamba : selon etat Tactique - A : vole 1PA (zone cercle r2) ; B : vole 1PM (croix diagonale t2) ; C : vole 2PO (etoile t2) ; D : vole 100 vitalite (cone t2). Portee 7PO.",
          "Pikak : 300 degats + vole 50 resistances elementaires, en melee. Element : A=Air, B=Eau, C=Terre, D=Feu.",
          "Pikepik : 220 degats vol de vie + poison 220 degats fin de tour (zone croix t1). Element : A=Eau, B=Terre, C=Feu, D=Air. Portee 12PO.",
          "El Piko possede un renvoi de 50 degats pour chaque ligne de degats subie.",
          "Priorite : tuer les Levitos d'abord (vol de PA/PM), puis focus El Piko.",
          "Jouer a distance pour eviter les sorts en melee des monstres et le renvoi d'El Piko.",
          "Ne JAMAIS finir son tour adjacent a un allie (Guerillero)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj27-600_orig.png",
            "caption": "Bonus etat Tactique A (+10% resistances)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj27-603_orig.png",
            "caption": "Bonus etat Tactique B (+25 tacle/fuite)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj27-602_orig.png",
            "caption": "Bonus etat Tactique C (+25 esquive PA/PM)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj27-601_orig.png",
            "caption": "Bonus etat Tactique D (+100 puissance)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj27-bambaa_orig.png",
            "caption": "Bamba en etat Tactique A (vol 1PA, cercle r2)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj27-bambab_orig.png",
            "caption": "Bamba en etat Tactique B (vol 1PM, croix diagonale t2)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj27-bambac_orig.png",
            "caption": "Bamba en etat Tactique C (vol 2PO, etoile t2)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj27-bambad_orig.png",
            "caption": "Bamba en etat Tactique D (vol 100 vitalite, cone t2)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj27-pikak_orig.png",
            "caption": "Pikak (300 degats + vol 50 resistances, melee)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj27-pikepik_orig.png",
            "caption": "Pikepik (220 degats vol de vie + poison croix t1)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj27-613_orig.png",
            "caption": "Schema effet Guerillero : degats aux adjacents en fin de tour"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj27-percepinea_orig.png",
            "caption": "Percepine (Mouerte) en etat Tactique A"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj27-percepineb_orig.png",
            "caption": "Percepine (Mouerte) en etat Tactique B"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj27-percepinec_orig.png",
            "caption": "Percepine (Mouerte) en etat Tactique C"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj27-percepined_orig.png",
            "caption": "Percepine (Mouerte) en etat Tactique D"
          }
        ]
      }
    ],
    "tips": [
      "Acces : Saharach, Territoire Cacterre en [15,-65].",
      "Recette clef : 2x Parchemin de Cactana, 2x Fleur de Cactiflore, 2x Moustaches de Cactoblongo, 2x String de Pampactus, 3x Malt, 2x Raie Bleue, 3x Graine de Pandouille, 2x Viande Persillee.",
      "Pierre d'ame de puissance 150 minimum pour capturer El Piko.",
      "Quetes liees : Le monde entier est un cactus ; L'Etoile de la Mer.",
      "Ne jamais finir son tour adjacent a un allie (effet Guerillero actif tout le combat).",
      "Tuer les Levitos en priorite : ils volent PA/PM et appliquent des etats genants.",
      "Jouer a distance pour eviter les sorts en melee et le renvoi de 50 degats d'El Piko.",
      "Les etats Tactique changent peu le combat : pas necessaire de les connaitre par coeur."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Blitzkrieg",
        "strategy": "Tout ennemi attaque doit etre acheve avant le debut de son tour. Tuer les monstres d'abord, puis preparer un tour de burst maximal pour tuer El Piko en un seul tour (un Iop avec Colere aide). Attention a l'etat Tactique A (+10% resistances) : attendre un tour si necessaire.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/blitzkrieg.png"
      },
      {
        "name": "Duel",
        "strategy": "Un allie qui commence a attaquer un ennemi doit etre le seul a l'attaquer jusqu'a sa mort. Utiliser les personnages avec le plus de degats pour tuer rapidement le Levito et El Piko.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duel.png"
      },
      {
        "name": "Special : Guerilla",
        "strategy": "Les allies ne doivent pas s'infliger de degats via Guerillero. Ne jamais finir son tour colle a un allie pendant tout le combat.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 20 tours. N'importe quel duo fonctionne. Focus Levito en premier, jouer a distance, garder El Piko pour la fin.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Le Père Ver est immobile et invulnérable à distance : il faut impérativement le taper en m
  102: {
    "summary": "Le Père Ver est immobile et invulnérable à distance : il faut impérativement le taper en mêlée. Les monstres alliés bénéficient du soutien du boss (partage de dommages, boosts PM/Puissance) et possèdent des états passifs complexes (Inébranlable, Lourd, glyphes). La stratégie standard consiste à éliminer tous les monstres en premier avant de rusher le Père Ver en mêlée.",
    "recommendedLevel": "150 — 180",
    "composition": "Privilégier des classes capables de tanker et de frapper en mêlée ; un soigneur ou une classe de protection est conseillé. Éviter l'élément air (Père Ver : 50% résistances air). Pour le Duo, s'équiper d'un Dofus Émeraude et d'un Dorigami.",
    "keyResist": [
      "Neutre",
      "Terre",
      "Feu"
    ],
    "phases": [
      {
        "title": "Passifs et états des monstres",
        "mechanics": [
          "Cycloporth — Passif Lasccar : au tour 2 puis tous les 4 tours, se met sur le dos 2 tours (Enraciné, -100PM, +20% dégâts subis, perd Volvation). Pose un glyphe rouge 3x3 infligeant 500 dégâts feu en vol de vie, -6PM et état Pesanteur 1 tour.",
          "Cycloporth — Aspiration Gourmande : si un personnage est dans le glyphe rouge, les dommages subis par le Cycloporth sont interceptés par ce personnage 1 tour ; attire tous les personnages en étoile taille 15 de 8 cases. Uniquement en état Lasccar.",
          "Cycloporth — Céphalonde : 400 eau, retire 4PA 1 tour quand déplacé pendant 3 tours. Jusqu'à 12PO, uniquement hors état Lasccar.",
          "Cycloporth — Volvation : réduit dégâts à distance subis de 54 pendant 2 tours ; si retrait PM ou poussé/attiré, gagne 2PO 2 tours. Uniquement hors état Lasccar, relance 3 tours.",
          "Masticroc — états Inébranlable et Lourd (non visibles) : ne peut pas être poussé, attiré ni porté.",
          "Masticroc — Ensablage : devient invisible 2 tours (invulnérable, 100% critique), se téléporte aléatoirement et termine son tour. Relance 3 tours.",
          "Masticroc — Surgissement : visible, se téléporte sur la case ciblée, 500 eau -3PM 2 tours en croix taille 1, applique état Surgissement (Pesanteur + renvoie 50% dégâts subis en carré 3x3). Portée infinie sans ligne de vue, uniquement si invisible.",
          "Morsquale — Passif Les Dents de la Mer de Sable + état Lourd : Inébranlable infini (non repoussable/attirable). Chaque fois qu'un personnage ennemi subit des dégâts, gagne +20 Puissance 2 tours (cumulable).",
          "Morsquale — Charge Croquante : perd Inébranlable le temps du sort, s'attire de 4 cases sur la cible, se téléporte symétriquement, 300 air vol de vie + poison 150 air 1 tour. En ligne jusqu'à 5PO.",
          "Trémorse — états Inébranlable et Lourd (non visibles) : ne peut pas être poussé, attiré ni porté.",
          "Trémorse — Crachat Amer : nécessite que la cible ait préalablement subi Avalement ET Coups de Langues ; inflige 250 eau + 10% érosion 2 tours + poison 250 eau fin de tour 2 tours. Jusqu'à 5PO.",
          "Pikténia — Gyroskopik : échange de place avec la cible et pose un glyphe noir 350 terre -2PA 1 tour. En mêlée, 2 fois par tour.",
          "Pikténia — Pik Ver : +40 Esquive PM 2 tours, renvoie 30% dommages subis, perd 2PM si soigné. Relance 4 tours."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj53-10lasccar_orig.png",
            "caption": "Cycloporth en état Lasccar (changement d'apparence)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj53-aspiration-gourmande_orig.png",
            "caption": "Sort Aspiration Gourmande du Cycloporth"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj53-cephalonde_orig.png",
            "caption": "Sort Céphalonde du Cycloporth"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj53-volvation_orig.png",
            "caption": "Sort Volvation du Cycloporth"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj53-12dentsmer_orig.png",
            "caption": "Passif Les Dents de la Mer de Sable du Morsquale"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj53-ensablage_orig.png",
            "caption": "Sort Ensablage du Masticroc"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj53-surgissement_orig.png",
            "caption": "Sort Surgissement du Masticroc"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj53-avalement_orig.png",
            "caption": "Sort Avalement du Trémorse"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj53-crachat-amer_orig.png",
            "caption": "Sort Crachat Amer du Trémorse (condition : Avalement + Coups de Langues)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj53-gyroskopik_orig.png",
            "caption": "Sort Gyroskopik du Pikténia"
          }
        ]
      },
      {
        "title": "Combat boss — Père Ver",
        "mechanics": [
          "Passif Digestion Lente : Père Ver Invulnérable à distance (infini), Indéplaçable, position fixe en haut à droite de la map.",
          "Monstres alliés en état Intaclable (infini).",
          "Si Père Ver en vie : tous les personnages ont -10% Érosion infinie ; déplacement d'un personnage déclenche des dégâts eau (~200) ; fin de chaque tour du Père Ver : attire tous les personnages dans sa ligne de vue de 4 cases et révèle les invisibles ; chaque personnage débute son tour en posant un glyphe marron (soin 15% PV max si fin de tour dedans).",
          "Si Père Ver éliminé : poison eau de fin de tour (~200) appliqué à tous les personnages (infini) ; les glyphes marrons disparaissent.",
          "Décès Traumatisant : à chaque mort d'un monstre, 500 dégâts feu à tous les personnages dans sa ligne de vue. Père Ver perd 10% résistances mais se soigne de 20% PV max.",
          "Coup d'Oeil : 350 neutre + poison PM (47 dégâts neutre par PM utilisé) à tous les ennemis en zone autour de lui. Relance 2 tours, toujours lancé en premier si disponible.",
          "Paternalisme (à partir du tour 2) : partage dommages Père Ver avec un monstre ciblé 1 tour + soin 10% PV max pour le monstre au début de son tour. Non débuffable. Lancé uniquement si un monstre a perdu des PV ou si Père Ver peut taper autour.",
          "Bien vu l'Aveugle : +2PM et +200 Puissance à un monstre ciblé, portée infinie sans ligne de vue, 1 fois par cible.",
          "Père Ver frappe 450 terre tous les personnages à sa mêlée au début de chaque tour (passif)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj53-16invu-distance_orig.png",
            "caption": "État Invulnérable à distance du Père Ver"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj53-18erosion_orig.png",
            "caption": "Érosion infinie et poison eau si déplacé (passif Père Ver)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj53-15glyphe-marron_orig.png",
            "caption": "Glyphe marron : terminer son tour dessus soigne 15% PV max"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj53-17effets-monstres_orig.png",
            "caption": "Effets monstres : Décès Traumatisant + gain résistances Père Ver"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj53-coup-doeil_orig.png",
            "caption": "Sort Coup d'Oeil du Père Ver (neutre + poison PM)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj53-paternalisme_orig.png",
            "caption": "Sort Paternalisme : partage dommages avec un monstre allié"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj53-bien-vu-laveugle_orig.png",
            "caption": "Sort Bien vu l'Aveugle : boost PM et Puissance à un monstre"
          }
        ]
      },
      {
        "title": "Stratégie globale",
        "mechanics": [
          "Tour 1 : rester à distance hors de portée des monstres, se booster ou commencer à distance. Le Trémorse a haute initiative : le focus en priorité avant le tour 2.",
          "Éliminer les monstres un par un avant de s'attaquer au Père Ver. Le Père Ver seul n'est pas dangereux.",
          "Ne pas focus un monstre ciblé par le sort Paternalisme (partage dommages réduit les dégâts de 50%, la seconde moitié étant absorbée par l'invulnérabilité du Père Ver).",
          "Avant d'éliminer un monstre, bloquer sa ligne de vue avec des invocations ou obstacles pour limiter les 500 dégâts feu de Décès Traumatisant.",
          "Abuser du glyphe marron : terminer son tour dessus pour se soigner de 15% PV max.",
          "Limiter les PM utilisés lors des tours où Coup d'Oeil est actif (poison PM).",
          "La majorité des monstres sont Inébranlables et Lourds : difficile de les repositionner ; favoriser la mêlée.",
          "Une fois tous les monstres morts, aller en mêlée avec le Père Ver (invulnérable à distance). Utiliser un bouclier optimisant les dégâts en mêlée (ex : Bouclier Taverne).",
          "Si des personnages sont très bas en vie, se détacler du Père Ver pour éviter les 450 terre en mêlée au début de son tour."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj53-23placement-elimination_orig.png",
            "caption": "Placement pour limiter la ligne de vue lors de l'élimination d'un monstre (rouge = monstre, bleu = personnages hors LdV, vert = invocation bloquant LdV)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj53-14perever-invu_orig.jpg",
            "caption": "Position fixe du Père Ver en haut à droite de la map"
          }
        ]
      }
    ],
    "tips": [
      "Accès : île de Saharach en [7,-70], zone Gorge des Vents Hurlants.",
      "Clef : 3x Belladone, 3x Maïs, 2x Morue, 2x Viande Maigre, 2x Dent de Cycloporth, 2x Langue de Morsquale, 2x Patte de Masticroc, 2x Peau de Trémorse.",
      "Quête liée : Le mystère des vers.",
      "Le Père Ver ne peut pas être capturé.",
      "Le Père Ver a 50% de résistances air : éviter cet élément pour le focus.",
      "Stuff conseillé : résistances correctes, bonne vitalité, Dofus Émeraude ou Dorigami pour tanker.",
      "Pour le succès Premier : entamer légèrement tous les monstres (~100PV) afin que le Père Ver répartisse son sort Paternalisme plutôt que de le maintenir sur le même monstre."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Premier",
        "strategy": "Éliminer le Père Ver en premier. Tour 1 : rusher en mêlée le Père Ver (position fixe haut droite) avec la majorité des personnages, placer un leurre/invocation à l'opposé pour attirer les monstres. Ne pas taper les monstres inutilement (cibles potentielles du partage de dommages). À partir du tour 2, surveiller le monstre ciblé par Paternalisme et arrêter de taper le Père Ver si la vie de ce monstre devient faible. Entamer légèrement tous les monstres (~100PV) pour que le boss change de cible de partage chaque tour.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/premier.png"
      },
      {
        "name": "Zombie",
        "strategy": "Utiliser exactement 1 PM par tour. Avoir des classes avec sorts de déplacement ou prévoir ~30 de fuite pour détacler les monstres. Se rapprocher du Père Ver dès le début du combat.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/zombie.png"
      },
      {
        "name": "Spécial — On ne touche pas",
        "strategy": "Terminer chaque tour en diagonale d'un ennemi. Éliminer les monstres en premier. Pour le Père Ver (invulnérable à distance) : taper en mêlée puis se décaler en diagonale à 2PO. Prévoir ~30 de fuite pour se détacler.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages en moins de 20 tours. Reprendre la stratégie de base (monstres en premier). S'équiper d'un Dofus Émeraude et d'un Dorigami. Prendre une classe capable de protéger ou soigner.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Tal Kasha est invulnérable en permanence ; pour la rendre vulnérable, il faut la faire pas
  103: {
    "summary": "Tal Kasha est invulnérable en permanence ; pour la rendre vulnérable, il faut la faire passer sur les glyphes laissés par 3 monstres différents après leur mort. Elle ressuscite infiniment ses alliés et peut frapper depuis la position de n'importe quel allié, rendant le positionnement en ligne fatal.",
    "recommendedLevel": "200",
    "composition": "Enutrof retrait PM (indispensable pour placer le boss sur les glyphes sans risque), Crâ pour repousser Tal Kasha et les monstres à distance. Composition orientée distance et érosion recommandée.",
    "keyResist": [
      "Variable (voir résistances)"
    ],
    "phases": [
      {
        "title": "Accès au donjon — Pyramide maudite",
        "mechanics": [
          "L'entrée se trouve dans la Pyramide maudite en [12,-77].",
          "Premier obstacle : 4 personnages requis — 2 en [8,-78] et 2 en [14,-72] sur les dalles élémentaires, puis actionner le levier pour ouvrir les portes en [9,-77] et [14,-73].",
          "Second obstacle : vaincre Tabasma en [14,-75] (mêmes sorts qu'un Griffotep) pour ouvrir la porte en [11,-74].",
          "Si un joueur est déjà devant le donjon, il peut téléporter le groupe directement."
        ]
      },
      {
        "title": "Salles — Mécanique Maudification (tous monstres)",
        "mechanics": [
          "Maudification : tous les monstres ont cet état dès le début. Quand vous frappez un monstre, le voisin le plus proche gagne Maudification 1 tour : -50% dommages subis et -2PM.",
          "Ne pas frapper en zone pour éviter de mettre tous les monstres en Maudification simultanément.",
          "Privilégier le focus sur un seul monstre à la fois.",
          "L'état Maudification se retire via des dommages de poussée (indirects ou directs).",
          "En cas d'égale distance, c'est le monstre le plus proche dans le sens des aiguilles d'une montre qui reçoit l'état.",
          "Bandleth — Morve érosive : éviter de pousser la Bandleth (malus 40% érosion + poison 100 dégâts neutre pour 2 tours). Porter/attirer/transposer sans pousser est possible.",
          "Chakanoubis — Harcèlement de la pyramide : retrait 4PA/3PM à PO infinie ; frapper une fois par tour pour désactiver ce sort au prochain tour. Attention au boost +10PM à chaque frappe + sort Pyrâmide (900 eau au càc).",
          "Griffotep — Aigriffes/Arrivée fracassante : se boost en dommages de poussée cumulables ; ne pas rester en ligne ni en diagonale avec lui.",
          "Momistik — Héritage Huppermage : chaque élément utilisé réduit les dommages de cet élément de 50% pour 1 tour ; frapper dans les 4 éléments simultanément retire la réduction mais booste ses sorts.",
          "Rykaon — Remplacement maudit : échange de place et frappe eau si échange avec un joueur (jusqu'à 4PO) ; Sabrupt : vol 100 puissance et frappe feu au càc. Rester à plus de 4PO."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/etat-maudification_orig.png",
            "caption": "État Maudification — schéma"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/etat-maudification2_orig.png",
            "caption": "Affichage de l'état Maudification sur un monstre"
          }
        ]
      },
      {
        "title": "Combat de boss — Tal Kasha",
        "mechanics": [
          "Tal Kasha est invulnérable en permanence grâce à Malédiction de la pyramide.",
          "Filature : 500 feu, attire la cible de 4 cases (jusqu'à 5PO, ligne, ligne de vue).",
          "Transe-Perse : 1700 neutre au càc.",
          "Tal Kasha peut utiliser Filature et Transe-Perse comme si elle était à la place de n'importe quel allié — ne jamais rester en ligne avec un monstre ni avec le boss.",
          "Malédiction de la pyramide : échange de place avec le personnage qui lui retire des PM (1 fois/tour) ; seule exception : être porté par un Pandawa lors du kik PM.",
          "Mort d'un monstre : laisse un glyphe marron sur sa case de mort.",
          "Tour suivant : Tal Kasha ressuscite le monstre exactement là où il est mort ; le monstre ressuscité passe son premier tour et perd 1PM infini (non cumulable).",
          "Désactivation invulnérabilité : faire passer Tal Kasha sur 3 glyphes de 3 monstres différents (état I puis II puis III au-dessus du boss).",
          "Une fois vulnérable, Tal Kasha débloque Cheveux partir de là : téléportation jusqu'à 4PO, relance 2 tours, ligne, ligne de vue.",
          "Stratégie distance + retrait PM : utiliser un Enutrof pour positionner le boss sur les glyphes sans se retrouver au càc.",
          "Stratégie érosion : éroder les monstres au maximum pour qu'ils ressuscitent avec 1PV et soient éliminés instantanément, simplifiant le combat."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/glyphe_1_orig.png",
            "caption": "Glyphe laissé par un monstre à sa mort"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/glyphe2_orig.png",
            "caption": "Monstre ressuscité sur le glyphe"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/invuln_orig.png",
            "caption": "Compteur I/II/III pour rendre Tal Kasha vulnérable"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/tactique_5.png",
            "caption": "Schéma tactique global — placement et glyphes"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/filature_orig.png",
            "caption": "Sort Filature — portée et effet"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/transe-perse_orig.png",
            "caption": "Sort Transe-Perse — frappe càc"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/cheveux-partir-de-la_2_orig.png",
            "caption": "Sort Cheveux partir de là — téléportation en état vulnérable"
          }
        ]
      }
    ],
    "tips": [
      "Recette de la clef : 2x Fragment de Chakanoubis, 2x Dent de Bandleth, 2x Grenat de Momistik, 2x Paupière Dorée de Rykaon, 2x Viande Goûtue, 1x Salikrone, 1x Quisnoa, 1x Patelle.",
      "Pour capturer Tal Kasha, prévoir une pierre d'âme de puissance 1000.",
      "Ne jamais retirer de PM à Tal Kasha en début de combat (risque d'échange de place au milieu de l'équipe) ; attendre d'avoir positionné le groupe.",
      "Être porté par un Pandawa est le seul moyen de kiker PM Tal Kasha sans subir l'échange de place.",
      "Quêtes liées : Le secret de la pyramide, Nordalie, Les totems de Maïmane."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Focus",
        "strategy": "Utiliser l'érosion max sur chaque monstre l'un après l'autre. Les monstres ressuscités ont très peu de PV et peuvent être tués en un coup. Une fois le boss entamé, ne plus toucher aux monstres.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/focus.png"
      },
      {
        "name": "Statue",
        "strategy": "Les combattants alliés doivent finir leur tour sur la même case que celle où ils l'ont commencé, pendant toute la durée du combat. Conseils à venir.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/statue.png"
      },
      {
        "name": "Spécial : Système pyramidal",
        "strategy": "Un ennemi ne doit pas être ressuscité plus de deux fois. Focus le Chakanoubis en premier, pousser son cadavre hors du glyphe et placer Tal Kasha dessus. Garder le Chakanoubis à distance (1 frappe/tour). Enchaîner avec Momistik ou Bandleth, puis le dernier monstre. Une fois Tal Kasha vulnérable, l'éliminer le plus vite possible en ignorant ou tenant les monstres à distance.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum et en moins de 40 tours. Conseils à venir.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Le Comte Razof est un boss disposant de plus de 100% de résistances dans tous les éléments
  104: {
    "summary": "Le Comte Razof est un boss disposant de plus de 100% de résistances dans tous les éléments. La mécanique centrale consiste à invoquer des invocations non-statiques pour lui retirer 20% de résistances par invocation vivante à la fin de son tour. Il invoque également une Minikrone invulnérable dans le camp allié, dont la mort inflige des malus permanents et sévères.",
    "recommendedLevel": "190",
    "composition": "Classe invocatrice fortement recommandée (Sadida, Osamodas, Enutrof) ; personnage tacleur (~150 Tacle) idéal pour bloquer le Razof. Chafer et Arakne (sorts communs) suffisent en l'absence de classe invocatrice.",
    "keyResist": [
      "Terre",
      "Eau"
    ],
    "phases": [
      {
        "title": "Mecanique de zone : etat Piege",
        "mechanics": [
          "L'etat Piege (tete de mort bleue) est applique uniquement par le piege Eblouissant du Nemroz.",
          "Piege Eblouissant : piege invisible d'une case ; le declencher retire 6PA (1 tour), 9PO et applique l'etat Piege pour 2 tours a la cible et aux personnages dans un rayon de 2.",
          "Cet etat amplifie les degats de nombreux sorts des monstres du donjon.",
          "Sans Nemroz dans le combat, l'etat Piege ne peut pas etre obtenu."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj52-57etat-piege_orig.png",
            "caption": "Etat Piege"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj52-56piege-eblouissant_orig.png",
            "caption": "Piege Eblouissant"
          }
        ]
      },
      {
        "title": "Monstres du donjon",
        "mechanics": [
          "Brokouillon — Hors Piste : 500 neutre sur invocations + malus 50 retrait PA/PM zone cercle r2. Pandanois : 450 neutre + retire 3PA + invoque une Bouteille de Pandanois (1300PV, frappe 300 neutre zone r2 a sa mort). Pistage : revele invisibles, +20% degats subis zone r3.",
          "Chevrotine — Invocation de Chienchien Courant : invoque un Chienchien (2400PV, 102 tacle) qui retire 100PM en melee. Tir au Juge : 350 neutre + poison 350 neutre/tour pendant 2 tours.",
          "Crambo — Premier Sang : 1000 feu si cible a 100% PV, 500 feu sinon (portee 15PO). Lampe Bleue : invocation statique, boost Crambo de 4PO et 200 Puissance. Uranus : 250 neutre en melee + recul.",
          "Nemroz — Piege Eblouissant : pose un piege invisible (voir mecanique etat Piege). Piege Erosif : glyphe vert r2, 10% erosion + 450 feu/debut de tour. Trempe jusqu'a l'Eau : 400 eau + -20 esquive PA.",
          "Viandargh — Appater : attire de 2 cases + retire 400 Puissance (2 tours). Saute de Viande : 600 neutre si cible >50% PV, 750 si <50%. Viande Hachee : 450 air + reduction soins 30% zone r1.",
          "Le Viandargh est le monstre le plus dangereux (malus de Puissance + attirance) — a focus en premier."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj52-piege-erosif_orig.png",
            "caption": "Piege Erosif (Nemroz)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj52-premier-sang_orig.png",
            "caption": "Premier Sang (Crambo)"
          }
        ]
      },
      {
        "title": "Boss : Comte Razof — sorts et mecanique Minikrone",
        "mechanics": [
          "Jeu Dangereux : invoque une Minikrone dans le camp adverse des le debut du combat.",
          "Archi-Pelle : 500 eau, revele invisibles, zone r2, chaque touche propage 100% des degats en croix de taille 1 (portee 6PO non modifiable).",
          "Pelliste : 700 terre, retire 6PM + etats Affaibli et Pesanteur (portee 15PO, 2 fois/tour).",
          "Chasse Gardee : bouclier reduisant degats a distance de 63 pour ses allies zone r2 (relance 3 tours).",
          "Trophee de Chasse : OS une invocation ennemie en melee pour gagner 1PM et 200 Puissance (disponible a partir du tour 2).",
          "Minikrone : invulnerable, invoquee au contact de l'allie le plus proche de Razof en debut de combat (ne peut pas etre portee par un Pandawa).",
          "Minikrone — Mort Impure : si elle meurt, tous les personnages perdent 20% resistances et 2PA de maniere permanente.",
          "Minikrone — Impurete : si elle commence son tour au contact d'un ennemi, tous les allies perdent 600 Puissance pour 1 tour.",
          "Minikrone — Benediction Arc-en-ciel : si elle commence son tour au contact d'un allie, le soigne de 10% PV max + bouclier de 10% de ses PV pour 1 tour.",
          "Minikrone — Captivite : glyphe noir sous ses pieds ; si elle termine son tour dessus, tous les allies perdent 2PM et subissent +50% d'erosion pour 1 tour.",
          "La Minikrone suit son invocateur ; la pousser d'au moins une case si l'invocateur reste sur sa case evite qu'elle reste sur le glyphe noir."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj52-59mort-impure_orig.png",
            "caption": "Mort Impure (Minikrone)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj52-58impurete_orig.png",
            "caption": "Impurete (Minikrone)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj52-55benediction_orig.png",
            "caption": "Benediction Arc-en-ciel (Minikrone)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj52-54captivite_orig.png",
            "caption": "Captivite (Minikrone)"
          }
        ]
      },
      {
        "title": "Mecanique de resistances du Comte Razof",
        "mechanics": [
          "Razof a 100% neutre, 120% terre, 115% feu, 135% eau et 105% air de resistances de base.",
          "Pour chaque invocation non-statique vivante a la fin du tour du Comte, il perd 20% de resistances pour 1 tour.",
          "La Minikrone compte comme une invocation (-20% supplementaire).",
          "Si une invocation meurt en cours de tour, le malus est calcule sur le nombre d'invocations vivantes a la fin du tour du Comte.",
          "Avec 6 invocations (dont Minikrone), le Comte perd 120% de resistances.",
          "Placer les invocations hors de la ligne de vue et a l'ecart est primordial pour maintenir les malus."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj52-52jeu-dangereux_orig.png",
            "caption": "Jeu Dangereux : mecanique de retrait de resistances par invocations"
          }
        ]
      },
      {
        "title": "Strategie 1 : personnage tacleur",
        "mechanics": [
          "Un personnage tank avec ~150 Tacle bloque le Comte Razof en melee tout au long du combat.",
          "Le tacleur ne doit pas etre le plus proche de Razof en phase de preparation (pour ne pas recevoir la Minikrone).",
          "Placer le tacleur entre Razof et les autres personnages pour couper la ligne de vue.",
          "Focus Viandargh en premier, puis Crambo (peut pousser le tacleur), puis les autres monstres.",
          "Rester hors de la ligne de vue du Crambo si a 100% PV (Premier Sang tres dangereux).",
          "Placer une invocation derriere le Crambo pour l'empecher de s'expulser du contact avec le tacleur.",
          "Une fois les monstres elimines, invoquer un maximum d'invocations hors de la ligne de vue du Razof et le taper.",
          "Permet de realiser facilement le succes Liberte."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj52-21tacle-razof1_orig.png",
            "caption": "Placement tacleur au contact du Razof"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj52-22tacle-razof-monstres_orig.png",
            "caption": "Tacleur bloquant Razof et monstres, invocation pour bloquer le Crambo"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj52-23tacle-invocations_orig.png",
            "caption": "Phase finale : invocations hors ligne de vue, tacleur au contact"
          }
        ]
      },
      {
        "title": "Strategie 2 : a distance avec retrait PM/PO",
        "mechanics": [
          "Garder les ennemis a distance grace au retrait PO (Cra, Feca, Enutrof) et retrait PM.",
          "Concentrer le retrait PO sur Nemroz et Comte Razof en priorite.",
          "Ne pas retirer la PO du Viandargh (inutile), ni du Crambo (trop de PO via Lampe Bleue).",
          "Focus Viandargh, puis Crambo, puis Nemroz.",
          "Utiliser la Minikrone invulnerable comme bouclier pour bloquer les lignes de vue.",
          "Attention : Pelliste se lance jusqu'a 15PO, Archi-Pelle jusqu'a 6PO non modifiable — placer les invocations au-dela de 6PO de Razof.",
          "Cette strategie est incompatible avec le succes Liberte."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj52-24distance-ret_orig.png",
            "caption": "Strategie distance : Razof repousse, Minikrone en bouclier, invocations protegees"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj52-20placement-invos_orig.png",
            "caption": "Placement invocations sur la droite pour les proteger de Razof"
          }
        ]
      }
    ],
    "tips": [
      "Position du donjon : entree sur l'ile de Nimotopia en [-68,30]. Prendre le Muldobus en [-28,-31] apres avoir termine la quete 'A plus dans l'muldobus'.",
      "Recette de la clef : 3x Mandragore, 3x Millet, 2x Espadon, 2x Viande Noire, 2x Queue de Chevrotine, 2x Bave de Brokouillon, 2x Os de Nemroz, 2x Fleche de Crambo.",
      "Pierre d'ame de puissance 190 minimum pour capturer le boss.",
      "Quete liee : La valse des manuels.",
      "Apprendre les sorts Chafer et Arakne (sorts communs) avant ce donjon si pas de classe invocatrice.",
      "Ne jamais laisser la Minikrone finir son tour sur son glyphe noir — la pousser si necessaire.",
      "Attention au sort Premier Sang du Crambo (15PO) si un personnage est a 100% PV — taper legerement les allies suffit.",
      "Disperser les invocations pour eviter qu'Archi-Pelle ne les elimine toutes d'un coup."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Liberte",
        "strategy": "Ne pas tenter de retirer de PM ou de PO aux adversaires pendant toute la duree du combat. Utiliser la strategie du tacleur ou le freestyle.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/liberte.png"
      },
      {
        "name": "Premier",
        "strategy": "Invoquer des le tour 1 pour retirer rapidement les resistances au Comte Razof. Passer le premier tour a invoquer et se booster pour finir le Comte Razof au tour 2 ou 3. Ensuite eliminer les monstres restants.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/premier.png"
      },
      {
        "name": "Special : Nos amies les betes",
        "strategy": "Aucune invocation alliee ne doit etre acheveee par un ennemi (Minikrone comprise). Bloquer Razof avec un tacleur. Eliminer tous les monstres en premier puis s'occuper du Razof avec les invocations protegees derriere des obstacles.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres a 2 personnages en moins de 20 tours. Prevoir une classe invocatrice. Eliminer les monstres avant de s'attaquer au Razof. Si tacleur disponible, bloquer Razof ; sinon garder le Razof a distance des invocations et disperser ces dernieres.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Le grand Choudini est un boss très mobile avec un passif déclenchant des échanges de place
  105: {
    "summary": "Le grand Choudini est un boss très mobile avec un passif déclenchant des échanges de place en début de tour. La stratégie consiste à éliminer les monstres en priorité avant de se concentrer sur lui, tout en anticipant les déplacements et en gérant le poison Reste assis.",
    "recommendedLevel": "Variable",
    "composition": "Équipe avec diversité élémentaire conseillée (chaque monstre a 60% de résistance dans un élément différent). Prévoir des sorts de téléportation pour poursuivre Choudini malgré le poison de PM.",
    "keyResist": [
      "Eau",
      "Air",
      "Terre",
      "Feu"
    ],
    "phases": [
      {
        "title": "Combat général — Élimination des monstres",
        "mechanics": [
          "Bozoteur : échange de place avec alliés/ennemis (Dans la Boîte), vole 4PO (Bang), pose des boucliers sur ses alliés (Baudruche). Résistance 60% neutre.",
          "Graboule : pièges PA en mêlée (Balle Piégée), pièges en zone damier retirant PA/PM et appliquant état Pesanteur (Jonglerie), pièges PM (Poirier). Résistance 60% air.",
          "Pirolienne : dégâts air en zone autour d'elle avec retrait PO (Chaudasse), dégâts feu en zone diagonale avec buff puissance alliés (Haleine Ardente), 20% d'érosion en zone étoile (Roulette Infernale). Résistance 60% feu.",
          "Roukouto : poison terre de fin de tour (Chapeau de Roue), poison air de début de tour + retrait 200 puissance (Ériktion), se buff puissance quand il subit des poisons (Peintures). Résistance 60% eau.",
          "Tivelo : dégâts feu à longue portée 4-16PO (Fusée Explosive), buff fuite pour lui et ses alliés (Monocycle), repousse d'une case en mêlée (Roule ma Poule). Résistance 60% terre.",
          "Focus en priorité le monstre avec des malus de résistance dans votre élément de frappe.",
          "Conseil : focus Roukouto en premier car il réduit la puissance de votre équipe.",
          "Retrait PM et retrait PO peu utiles : tous les monstres ont 12PO minimum."
        ]
      },
      {
        "title": "Passif de Choudini — Prends ma place",
        "mechanics": [
          "Prends ma place (passif) : au début de chaque tour de Choudini, il échange de place avec un personnage au contact (zone croix taille 1), selon la priorité horaire.",
          "Si Choudini est dans l'état Pesanteur ou Enraciné : il inflige 180 dégâts feu à toutes les entités à son contact au lieu d'échanger.",
          "Si un personnage au contact est Pesanteur ou Enraciné : il subit 180 dégâts feu, Choudini échange avec un personnage non-pesanteur.",
          "Si tous les personnages autour de Choudini sont pesanteur/enracinés : ils subissent tous 180 dégâts feu et Choudini n'échange pas de place.",
          "Avoir les 2 états (pesanteur et enraciné) simultanément = dégâts infligés deux fois.",
          "Choudini n'échange de place qu'avec un seul personnage par tour."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark46choudini2_orig.png",
            "caption": "Zone d'effet du passif Prends ma place et ordre de priorité horaire"
          }
        ]
      },
      {
        "title": "Sort Vinriktus — Échange de place à distance",
        "mechanics": [
          "Vinriktus : inflige 180 dégâts eau, retire 2PM à la cible, et la fait échanger de place avec l'allié le plus proche (sans limite de distance).",
          "Si la cible est Pesanteur ou Enracinée : l'échange de place n'est pas effectué.",
          "Si le personnage le plus proche de la cible est Pesanteur ou Enraciné : l'échange se fait avec le personnage non-pesanteur le plus proche.",
          "Si tous les alliés sont Pesanteur/Enracinés : aucun échange de place."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark46choudini4_orig.png",
            "caption": "Choudini cible le personnage n°1 qui échange avec le personnage n°2 (le plus proche)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark46choudini6_orig.png",
            "caption": "Si le personnage le plus proche (n°2) est pesanteur, l'échange se fait avec le n°3"
          }
        ]
      },
      {
        "title": "Autres sorts de Choudini",
        "mechanics": [
          "Détriktus : inflige 130 dégâts air et repousse en zone croix taille 1 de 3 cases, sans ligne de vue, jusqu'à 12PO.",
          "Reste assis : poison de fin de tour pendant 2 tours qui inflige 27 dégâts terre par PM utilisé dans le tour. Retire 20 de tacle.",
          "Limiter l'utilisation de PM si affecté par Reste assis, ou se débuffer (ex. Lait de Bambou du Pandawa). Utiliser des sorts de téléportation pour se déplacer sans consommer de PM.",
          "Tous les sorts de Choudini ont une portée de 12PO ou plus : inutile de chercher à réduire sa portée."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark46choudini12_orig.png",
            "caption": "Tableau des dégâts du poison Reste assis selon le nombre de PM utilisés"
          }
        ]
      },
      {
        "title": "Phase finale — Focus Choudini seul",
        "mechanics": [
          "Une fois les monstres éliminés, concentrez-vous sur Choudini.",
          "Les personnages sous Reste assis doivent limiter leurs PM et utiliser des sorts de téléportation pour avancer.",
          "Les personnages sans ce poison peuvent poursuivre Choudini normalement.",
          "Avec des sorts à longue portée, il est possible de le toucher sans se rapprocher.",
          "Anticiper les échanges de place en début de tour pour ne pas être surpris."
        ]
      }
    ],
    "tips": [
      "Entrée du donjon : Route des Roulottes dans les Landes de Sidimote en [-22,12].",
      "Pierre d'âme de puissance 100 minimum pour capturer le Choudini.",
      "Recette de la clef : 2x Roue de Tivelo, 2x Bourgeon de Pirolienne, 2x Couteau de Roukouto, 2x Bombe de Graboule, 2x Viande Rassie, 2x Kralamoure, 3x Orchidée Freyesque, 3x Lin.",
      "Quêtes liées : La grande parade, Le spectacle vivant.",
      "Équipe avec diversité élémentaire recommandée car chaque monstre a 60% de résistance dans un élément différent.",
      "Retrait PM et PO peu efficaces contre les monstres qui ont tous 12PO minimum."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Chacun son tour de magie",
        "strategy": "Lorsque Choudini déplace un allié avec Détriktus (poussée de 3 cases), il doit lui-même être déplacé par un allié avant le début de son prochain tour. L'échange de place du Bozoteur n'est pas pris en compte. Utiliser sorts d'échange, d'attirance ou de poussée (ex. porter du Pandawa). Si les personnages ne peuvent pas être poussés (indéplaçables, enracinés, contre un mur), il n'est pas nécessaire de déplacer Choudini. Il est possible d'achever Choudini s'il vous a déplacé, même sans l'avoir redéplacé.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Anerice la Shushess est la boss du Manoir des Katrepat
  106: {
    "summary": "Anerice la Shushess est la boss du Manoir des Katrepat. Elle possède une résilience vampyrique qui réduit les dégâts de 90% : il faut soit exploiter l'érosion (qui contourne ce buff), soit accumuler un maximum de goules sur le terrain pour annuler progressivement la réduction. Tuer d'abord tous les monstres, en commençant par la Kérigoule qui partage les dégâts entre tous les monstres.",
    "recommendedLevel": "~100",
    "composition": "Idéal : Crâ (érosion + recul) + Enutrof (retrait PM). Alternative goule : Iop/Roublard + Pandawa + Eniripsa. Duo possible : Crâ + n'importe quelle classe.",
    "keyResist": [
      "Terre",
      "Eau"
    ],
    "phases": [
      {
        "title": "Mécanique de zone : Marche des Goules",
        "mechanics": [
          "Chaque monstre possède un effet déclenché : quand vous lui infligez des dégâts, tous les autres monstres avancent d'une case vers l'attaquant (1 fois par tour par monstre, réinitialisé au début du tour du monstre frappé).",
          "Si vous frappez plusieurs monstres n'ayant pas encore déclenché leur effet dans le même tour (frappe en zone), les autres monstres sont attirés d'autant de cases que le nombre de monstres frappés.",
          "Conseil : focalisez un seul monstre par tour pour limiter l'attraction globale."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj5-avancement-monstres_orig.jpg",
            "caption": "Schéma Marche des Goules : les monstres non frappés avancent d'une case vers le joueur attaquant"
          }
        ]
      },
      {
        "title": "Salles — monstres à gérer avant le boss",
        "mechanics": [
          "Kérigoule — Chauffetage : partage les dommages entre tous les monstres (débuffable) + échange de place avec le monstre frappé quand actif (1 fois/monstre/tour, à partir du tour 2, relance 3 tours). Tranche air : 600 dégâts air vol de vie + vole 5PM esquivables rayon 3 (1 fois/tour).",
          "Gouligane — Gouli Gouli : 500 dégâts eau, double dommages + état Pacifiste aux personnages en ligne à ≤3PO de la cible (5PO, 2 fois/tour). Griffouille : 600 dégâts neutre + retire 4PA esquivables (8PO modifiable, 2 fois/tour).",
          "Goultime — Dantagoule : 700 dégâts feu en zone rayon 2 + soigne les monstres proches de 800 (5PO, 2 fois/tour). Poings vire-goule : 700 dégâts air + attire les personnages en ligne à ≤3PO de la cible au càc (ligne, 7PO, 2 fois/tour).",
          "Goulafre — Bidonnage : 1200 dégâts feu + réduit dommages finaux de la cible de 50% pour 1 tour, débuffable, càc, 3 fois/tour. Goulala : +4PM au Goulafre tous les 2 tours.",
          "Pipisteuse — Chauffe Kipeu : 600 dégâts eau + attire la cible de 3 cases (ligne, 6PO sans LdV, 2 fois/tour). Déplacement Furtif : téléportation en ligne 4PO sans LdV.",
          "Priorité : tuer la Kérigoule avant son tour 2 pour éviter le partage de dégâts.",
          "Retirer la PO du Gouligane pour le rendre inoffensif à >5PO de lui.",
          "Attention au Goultime : tape fort en zone et soigne les monstres proches.",
          "Un Enutrof (retrait PM) est précieux pour ralentir l'avancée des monstres."
        ]
      },
      {
        "title": "Boss : Anerice la Shushess",
        "mechanics": [
          "Résilience vampyrique : lancé en début de combat, réduit tous les dégâts subis de 90% (infini).",
          "Appétit sanguinaire : +2PM et +50% dommages finaux à tous les monstres (hors Anerice) pour 1 tour — s'applique aussi aux personnages en état Goule (à partir du tour 2, relance 3 tours).",
          "Goulification : 1200 dégâts eau + transforme la cible en Goule jusqu'à 3PO (2 fois/tour). En Goule : +150% dégâts subis, Anerice peut utiliser Coopération. Chaque Goule présente augmente les dégâts qu'Anerice subit. Pour sortir de l'état Goule : subir des dégâts d'un allié ou de soi-même.",
          "Coopération : téléportation au càc d'une cible en état Goule + attire les autres personnages en ligne à ≤3 cases au càc de la cible (PO infinie, sans LdV, relance 2 tours).",
          "Vampyrisme : 1000 dégâts terre vol de vie en zone rayon 2, ligne 6PO, tous les tours.",
          "Stratégie 1 — Goules : laisser Anerice transformer 3–4 personnages/invocations en Goule pour annuler progressivement sa résilience, puis l'éliminer. Préparer Colère de Iop ou mur de bombe avant la transformation.",
          "Stratégie 2 — Érosion : éroder Anerice (50% total dont 10% de base) pour réduire ses PV maximaux malgré la Résilience vampyrique. La garder à >14PO pour éviter toute transformation en Goule. Crâ + Flèche cinglante idéal."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj5-appetit-sanguinaire_orig.png",
            "caption": "Zone d'effet du sort Appétit sanguinaire"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj5-goulification_orig.png",
            "caption": "Zone d'effet du sort Goulification"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj5-vampyrisme_orig.png",
            "caption": "Zone d'effet du sort Vampyrisme"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj5-placement-safe_orig.png",
            "caption": "Placement sécurisé pour la stratégie Érosion : zone rouge hors portée d'Anerice"
          }
        ]
      }
    ],
    "tips": [
      "Entrée du donjon : Terres Désacrées en [-14,25].",
      "Recette de la clef : 2× Viande Goûtue, 1× Salikrone, 1× Quisnoa, 1× Patelle, 2× Nez de Pipisteuse, 2× Oeil de Gouligane, 2× Poils de Goultime, 2× Aile de Kérigoule.",
      "Pierre d'âme de puissance 1000 requise pour capturer Anerice la Shushess.",
      "Quêtes liées : Entretien avec une Vampyre, Le mort dans l'âme, Les totems de Maïmane.",
      "Ne jamais frapper plusieurs monstres en zone simultanément : tous les autres seraient attirés d'autant de cases.",
      "Utiliser le sort Chauffetage de la Kérigoule à son avantage : il échange Kérigoule avec le monstre frappé, permettant de reculer un monstre dangereux.",
      "Un personnage en état Goule peut se frapper lui-même (avec un sort propre) pour en sortir.",
      "L'érosion contourne la Résilience vampyrique : les PV érodés se calculent sur les résistances AVANT le combat."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Prudent",
        "strategy": "Les combattants alliés ne doivent jamais finir leur tour sur une cellule adjacente à celle d'un ennemi. Garder les monstres à distance en les repoussant et retirant leurs PM. Stratégie érosion recommandée pour le boss mais non obligatoire.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/prudent.png"
      },
      {
        "name": "Premier",
        "strategy": "Anerice la Shushess doit être achevée en premier. Méthode 1 : accumuler 3–4 goules, one-turn Anerice au tour 4 avec Colère de Iop ou mur de bombe préparé au tour 1. Méthode 2 : sort Vitalité du Iop — baisser les PV de chaque monstre sous le seuil de vitalité et attendre l'expiration du sort pour les tuer, puis éliminer Anerice en dernier (le succès se valide quand même).",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/premier.png"
      },
      {
        "name": "Spécial : Qu'est-ce qu'elle a ma goule ?",
        "strategy": "Chaque combattant doit être goulifié au moins une fois au cours du combat. Laisser Anerice libre de ses mouvements et finir son tour près d'elle pour se faire transformer. Une fois tous les personnages transformés en Goule, éliminer Anerice en premier puis les monstres restants.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages en moins de 40 tours. Composition recommandée : Crâ + n'importe quelle classe. Tourner autour de la map pour rester hors de portée. Tuer la Kérigoule en premier, repousser les autres monstres en tournant gauche → haut → droite. Finir Anerice avec érosion depuis la zone sécurisée.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Ilyzaelle est la boss du Belvédère de Frigost III
  107: {
    "summary": "Ilyzaelle est la boss du Belvédère de Frigost III. Le combat se déroule en 2 phases déclenchées à 75% et 50% de ses PV : à chaque seuil, elle se téléporte dans le camp allié, devient invulnérable 2 tours et pose un glyphe offensif (+400% dégâts finaux, -30% dégâts subis). La stratégie consiste à garder monstres et boss à distance, exploiter le glyphe pour tuer les monstres, puis survivre 2 tours lors de la seconde phase.",
    "recommendedLevel": "200",
    "composition": "Classes infligeant de gros dégâts à distance. Un Pandawa est conseillé pour placer les monstres et vulnérabiliser Ilyzaelle. Éviter les équipements full critique (Ilyzaelle a 250 résistances critique).",
    "keyResist": [
      "Eau"
    ],
    "phases": [
      {
        "title": "Mécanique de l'état Brûlure",
        "mechanics": [
          "Chaque déplacement d'un mob ou retrait de PM sur un mob confère l'état Brûlure à votre personnage.",
          "Le premier mob jouant après vous consomme l'état Brûlure (cible aléatoire si plusieurs personnages ont l'état).",
          "Chause — Doublâme : retire 50% de critique pour 2 tours (PO infinie, sans ligne de vue).",
          "Crâme — Lance lumière : renvoie la cible à sa position de début de tour + +150% dégâts subis pour 2 tours (PO infinie, sans ligne de vue).",
          "Ectorche — Combustion spontanée : 1100 dégâts feu en croix taille 2 autour de la cible (la cible n'est pas affectée). PO infinie, sans ligne de vue.",
          "Esprigné — Sens spectral : détecte entités invisibles dans un rayon de 2 PO (PO infinie, sans ligne de vue).",
          "Feutôme — Revenant : s'attire sur la cible en ligne et vole 4 PM pour 1 tour (PO infinie, en ligne, nécessite ligne de vue)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj1-etat-brulure_orig.png",
            "caption": "Schéma explicatif de l'état Brûlure"
          }
        ]
      },
      {
        "title": "Monstres du donjon",
        "mechanics": [
          "Chause — Ébullition : 800 dégâts eau + retire 3 PA esquivables pour 1 tour. Jusqu'à 6 PO en ligne (x3/tour).",
          "Chause — Flâmi : partage les dégâts avec un allié 2 tours ; si l'un meurt, l'autre gagne 400 puissance 2 tours. Jusqu'à 3 PO (relance 3 tours).",
          "Crâme — Boule d'eau : 600 dégâts eau + état Frustration 1 tour. Jusqu'à 4 PO (x3/tour). Frustration : +3 PM et +100% dommages finaux pour 4 tours s'il n'a pas tapé durant son tour.",
          "Ectorche — Combustions en chaîne : 900 dégâts feu en croix taille 2. Jusqu'à 3 PO (x1/tour).",
          "Ectorche — Coupe-Souffle : 700 dégâts air + vole 2 PM dans un rayon de 2. De 3 à 5 PO (x1/tour).",
          "Esprigné — Bouillie : 1500 dégâts eau + Insoignable 1 tour. Dégâts décroissants selon PM utilisés. Jusqu'à 8 PO en ligne (x3/tour).",
          "Esprigné — Tranche-âme : 500 dégâts terre + vole 100 puissance pour 4 tours. Jusqu'à 5 PO (x3/tour).",
          "Feutôme — Apparition spectrale : 900 dégâts neutres + pesanteur 1 tour + téléportation au CàC de la cible. Jusqu'à 4 PO (x2/tour).",
          "Feutôme — Feu critique : 1100 dégâts feu + retire 30% critique 1 tour. Jusqu'à 2 PO (x3/tour)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj1-ebullition_orig.png",
            "caption": "Ébullition — Chause"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj1-flami_orig.png",
            "caption": "Flâmi — Chause"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj1-boule-d-eau_orig.png",
            "caption": "Boule d'eau — Crâme"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj1-combustions-en-chaine_orig.png",
            "caption": "Combustions en chaîne — Ectorche"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj1-coupe-souffle_orig.png",
            "caption": "Coupe-Souffle — Ectorche"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj1-bouillie_orig.png",
            "caption": "Bouillie — Esprigné"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj1-tranche-ame_orig.png",
            "caption": "Tranche-âme — Esprigné"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj1-apparition-spectrale_orig.png",
            "caption": "Apparition spectrale — Feutôme"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj1-feu-critique_orig.png",
            "caption": "Feu critique — Feutôme"
          }
        ]
      },
      {
        "title": "Sorts du boss Ilyzaelle",
        "mechanics": [
          "Hantâme : se téléporte sur la case ciblée, inflige 1800 dégâts feu + 40% d'érosion 2 tours dans un rayon de 2 PO. Jusqu'à 3 PO (x1/tour, ne se lance pas au tour 1).",
          "Lance de l'effroi : 1500 dégâts feu + état Pacifiste 1 tour. Jusqu'à 4 PO (x3/tour).",
          "Vers les ténèbres : attire de 10 cases en ligne vers Ilyzaelle tous les personnages du combat. Relance 3 tours (à partir du tour 3).",
          "Possession : +300% vitalité sur tous les monstres pour toute la durée du combat ; fait apparaître des monstres tous les 3 tours (2 monstres si <=4 joueurs depuis tour 4 ; 2 monstres si 5 joueurs depuis tour 3 ; 3 monstres si >=6 joueurs depuis tour 3).",
          "Ne peut pas être capturée."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj1-hantame_orig.png",
            "caption": "Hantâme — zone et portée"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj1-lance-de-l-effroi_orig.png",
            "caption": "Lance de l'effroi — portée"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj1-vers-les-tenebres_orig.png",
            "caption": "Vers les ténèbres — schéma d'attraction par personnage (couleurs)"
          }
        ]
      },
      {
        "title": "Phase 1 : atteindre 75% de PV d'Ilyzaelle",
        "mechanics": [
          "Dès que les PV d'Ilyzaelle passent sous 75%, elle se téléporte dans le camp allié sur une case fixe (indéplaçable).",
          "Elle devient invulnérable et pose un glyphe orange (rayon 3) : +400% dégâts finaux et -30% dégâts subis pour tout personnage dans le glyphe.",
          "Tout monstre entrant dans le glyphe subit 15 000 dégâts neutres infligés par Ilyzaelle. Tous les monstres gagnent 2 PM.",
          "Le glyphe dure 2 tours, puis Ilyzaelle repasse côté ennemi et reste invulnérable 1 tour supplémentaire.",
          "Idéal : atteindre les 75% en fin de tour 2. Taper Ilyzaelle dès le tour 1, garder les monstres à distance, rester hors des 4 PO de Lance de l'effroi.",
          "Utiliser le glyphe pour tuer les monstres qui se sont trop approchés.",
          "Préparer les boosts (colère Iop, mur de bombes Roublard) pour la phase 2."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj1-ily-aliee_orig.png",
            "caption": "Ilyzaelle dans le camp allié — glyphe orange actif"
          }
        ]
      },
      {
        "title": "Phase 2 : atteindre 50% de PV d'Ilyzaelle (décisive)",
        "mechanics": [
          "Quand les PV passent sous 50%, Ilyzaelle retourne dans le camp allié avec le même glyphe.",
          "Il suffit de survivre 2 tours : Ilyzaelle tue ensuite tous les monstres restants et le combat se termine. Attention : il doit rester au moins un monstre sur le terrain ou elle n'utilise pas son sort final.",
          "Exploiter le glyphe pour tuer les monstres encore présents.",
          "Ralentir et repousser les monstres ou les tuer via le glyphe. Utiliser trêve, retraite anticipée, invisibilité pour temporiser.",
          "Ne jamais éroder Ilyzaelle : réduire ses PV max décale les seuils et oblige à faire plus de dégâts.",
          "Éviter qu'une Chause ne partage ses dégâts avec Ilyzaelle en phase 2.",
          "Soigner avec précaution : soins de zone peuvent soigner Ilyzaelle (toujours considérée ennemie même dans le camp allié)."
        ]
      }
    ],
    "tips": [
      "Entrée du donjon : Frigost III en [-73,-76].",
      "Recette de la clef : 2x Viande Goûtue, 1x Salikrone, 1x Quisnoa, 1x Patelle, 2x Oeil de Feutôme, 2x Fragment d'Ectorche, 2x Pince de Crâme, 2x Restes d'Esprigné.",
      "Quêtes liées : Fée d'hiver (Bontarien), Lettre à Ilyz (Brâkmarien), L'avis de la Mort, Une dernière volonté, Les totems de Maïmane.",
      "Ilyzaelle a 250 résistances critique : retirer Dofus Turquoise et Kokulte, remplacer le quatre-feuille par un Stalak, équiper un robuste majeur.",
      "Aux tours 3/6/9... se cacher derrière des blocs ou des cawottes pour ne pas être attiré par Vers les ténèbres. Un Pandawa peut stabiliser ; un Féca peut poser un glyphe gravitationnel.",
      "Ne pas éroder Ilyzaelle : cela décale les seuils de PV et complique les phases.",
      "Élément le plus faible d'Ilyzaelle : Eau (seulement 15% de résistance).",
      "Exploiter l'état Brûlure du Crâme : si seul le personnage ayant la plus haute initiative a l'état, le Crâme jouant juste après le renverra à sa position de début de tour — technique pour se replacer après avoir repoussé des mobs."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Liberté",
        "strategy": "Ne pas tenter de retirer de PM ou de PO aux adversaires pendant tout le combat. Repousser les monstres ou accepter de prendre des dégâts. Rester hors de portée de Lance de l'effroi (état Pacifiste). Maximiser les dégâts sur Ilyzaelle et exploiter le glyphe pour tuer les monstres.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/liberte.png"
      },
      {
        "name": "Focus",
        "strategy": "Lorsqu'un ennemi est attaqué, il doit être achevé avant qu'un autre ne soit attaqué. Les dégâts du glyphe d'Ilyzaelle sur les monstres ne font pas échouer ce succès. Utiliser uniquement des sorts de retrait PM/PO sans dégâts. Un Pandawa en tête d'initiative (juste avant le Crâme) est idéal. Possible aussi avec un Sram et ses pièges, mais aléatoire.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/focus.png"
      },
      {
        "name": "Aux portes d'Externam (Spécial)",
        "strategy": "Ilyzaelle doit être achevée avant l'apparition de la 3e vague de monstres (tour 10). Atteindre le premier seuil de 75% au tour 2 au plus tard, idéalement au tour 1. Si 75% atteint au tour 2, elle sera vulnérable au tour 6 avec un seul tour pour atteindre 50% : bien se préparer au tour 5. La stratégie globale standard suffit.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "2 personnages maximum, moins de 40 tours. Option 1 : 2 personnages eau à grande mobilité, rester hors de portée et taper chaque tour. Option 2 : Sram + 1 DPS eau distance (>=10 PO, peu de critique, Dofus Ébène recommandé). Le Sram bouche les passages avec des pièges tour 1 (Piège de dérive violet, Répulsif noir, Funestes/Fangeux marron) puis renforce (oranges et verts). Ilyzaelle est repoussée chaque tour avec Peur (2x Peur sur la case grise). Utiliser Piège Scélérat si elle se place mal. Le DPS tape Ilyzaelle pendant que le Sram pose poisons (Injection Toxique) et Arnaques. Ne pas rester invisible trop longtemps pour ne pas perturber le déplacement d'Ilyzaelle.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Bethel Akarna est le boss de la Tour de Bethel, donjon aquatique des Epaves Silencieuses
  108: {
    "summary": "Bethel Akarna est le boss de la Tour de Bethel, donjon aquatique des Epaves Silencieuses. La mecanique centrale repose sur le sort Necronyx (obtenu en quete) : chaque monstre doit etre dans cet etat avant de mourir, sinon toute la team est OS. Le Dagon des Profondeurs, invoque dans votre camp apres la mort du Monolithe, est la seule entite capable de blesser Bethel.",
    "recommendedLevel": "~170",
    "composition": "Equipe capable de jouer en melee pour focus le Monolithe (invulnerable a distance). Un personnage tank (ex. Pandawa avec Dame Jhessica) pour bloquer Bethel et le Zombruth. Minimum 4 000 PV et Dofus Ivoire conseilles pour le succes special.",
    "keyResist": [
      "Eau",
      "Air",
      "Terre",
      "Feu"
    ],
    "phases": [
      {
        "title": "Mecanique generale — Aquazomb et Necronyx",
        "mechanics": [
          "Necronyx (sort de quete, 1 tour sur 2) : doit etre applique sur chaque monstre avant sa mort, sinon toute la team est OS. Attention : passer son tour lors du lancement.",
          "Aquazomb : a partir du tour 2, chaque joueur doit terminer son tour a moins de 6 PO d'un monstre (hors invocations : Bethel, Monolithe, monstres reinvoques). Sinon : boost 2PM/1PO a tous les monstres (cumulable) + effets speciaux.",
          "Effets Aquazomb par type si on finit a plus de 6PO : Tournoyé => invisibilite + 2PM/1PO allies ; Cranonier => 1PO + 20% degats distance ; Macrab => 2PM/1PO + 660 bouclier 2 tours ; Funespadon => 2PM/1PO + -10 degats subis 2 tours ; Zombruth => 40 esquive PM + etat Inebranlable 2 tours.",
          "Bethel retire l'etat Necronyx au bout de 3 tours (depuis MaJ 20/01/2026) : re-Necronyx au tour 4 si applique au tour 1."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/82_3_orig.png",
            "caption": "Sort Necronyx (sort special du donjon)"
          }
        ]
      },
      {
        "title": "Salles du donjon — Monstres",
        "mechanics": [
          "Hydraire (Morlusque) : 10% erosion + 200 air + poison air 2 tours ; Hydraire : 300 eau zone cercle R2 a 6PO+ (ligne), pose piege eau ~400.",
          "Funespadon (Profondeurs Marines) : Piquants (renvoi degats) ; Talion : 300 terre + etat Talion ; Profondeurs Marines : malus 4PO si >9PO 2 tours.",
          "Macrab (Vapeur) : Coup de Pince 350 terre + poison PA ; Vapeur : 300 feu zone cercle R2 cac.",
          "Tournoyé (Restoute) : Franchissement teleport 7 cases + degats subis x120% 2 tours ; Restoute : -2PM + fuite/tacle zone croix R1 ; Monodent : 450 eau + repousse 2 cases.",
          "Zombruth (Cumul des Mandales + Siphon) : Siphon 280 air cercle R2 + -300 puissance ; Cumul des Mandales 320 terre cac + -200 res. poussee 2 tours ; Aquaponey : boost +3PM +2PO zone cercle R2 2 tours."
        ]
      },
      {
        "title": "Combat boss — Phase Monolithe (debut)",
        "mechanics": [
          "Glyphe sur le pourtour de la map : -100PM + etat Pesanteur si on marche dessus.",
          "Contrat Indicible : Bethel invoque un Monolithe et un Dagon des Profondeurs ; Bethel et Dagon sont invulnerables ; Monolithe invulnerable a distance (melee uniquement).",
          "Monolithe (Hieroglyphes) : chaque tour => bouclier 2600PB aux monstres zone cercle R4 pour 2 tours + 200 puissance invocations + utilisation de sort supplementaire. Le bouclier peut etre desenvouté.",
          "Monolithe : repousse les personnages au cac de 2 cases en debut de tour.",
          "Dagon des Profondeurs : Presence Effrayante -3PA cac ; Charge Aquatique s'attire au cac jusqu'a 8PO + -60 fuite 1 tour ; Souffle Chaud 600-900 feu depuis cac + -2PA esquivables.",
          "Bethel : Pantang ~500-800 air (1-12PO) ; Offrande Monolithique (au cac du Monolithe) invoque Amas de Tentacules Vaporeux au cac de chaque perso (110PV, bloquants, +300 puissance Bethel, +200 monstres, relance 3 tours) ; sort de repousse si pas etat Necronyx et cible a 6PO.",
          "Necronyx Bethel des le tour 1 pour eviter le repousse dans le glyphe de bord de map.",
          "Focus le Monolithe en melee jusqu'a sa mort."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark151bethel1_orig.png",
            "caption": "Schema de positionnement — Necronyx sur Bethel (tour 1)"
          }
        ]
      },
      {
        "title": "Combat boss — Phase Dagon allie (Bethel vulnerable)",
        "mechanics": [
          "A l'elimination du Monolithe : le Dagon est invoque dans votre camp, controle par le joueur le plus proche. Bethel reinvoque un nouveau Monolithe + Dagon invulnerables cote ennemi (ne jouent pas).",
          "Seul le Dagon allie peut blesser Bethel, uniquement en melee avec Souffle Chaud (~1000/tour). Booster le Dagon au maximum.",
          "Bethel gagne Etoile de Mer : glyphe etoile qui frappe ~700 eau + -4PA -2PM par tour passe dedans. Relance 2 tours => replacer Bethel tous les 2 tours.",
          "Bethel gagne aussi une teleportation sans LDV jusqu'a 3 cases.",
          "Pousser le Dagon ennemi a chaque tour pour le mettre en etat Inebranlable (empeche de s'attirer sur les joueurs).",
          "Phase d'environ 7 a 8 tours.",
          "Necronyx obligatoire sur Bethel avant sa mort, meme s'il est le dernier. Apres sa mort : finir les monstres normalement (Necronyx non obligatoire)."
        ]
      }
    ],
    "tips": [
      "Position du donjon : [-48,-82] dans les Epaves Silencieuses. Acces conditionne a la quete 'La colere des dieux'.",
      "Sort Necronyx requis : s'obtient via la quete 'L'arme fatale'.",
      "Recette de la clef : 1 Patelle, 1 Salikrone, 1 Quisnoa, 2 Viande Goûtue, 2 Pointe de Lance de Tournoyé, 2 Protection de Funespadon, 2 Aquarakne de Cranonier, 2 Bout d'Armure de Macrab.",
      "Quetes liees : 'Les coeurs livides', 'A la recherche de Crocoburio', 'Les totems de Maimane'.",
      "Ne jamais tuer un monstre sans lui avoir applique Necronyx (sauf apres la mort de Bethel pour le succes special) => sinon OS de toute la team.",
      "Bethel retire Necronyx au bout de 3 tours (MaJ 20/01/2026) : surveiller le compteur de duree."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "La mort sait attendre",
        "strategy": "Aucun ennemi ne doit entrer dans l'etat Necronyx avant la mort de Bethel. Jouer en melee pour focus rapidement le Monolithe (invulnerable a distance). Minimum 4 000 PV + Dofus Ivoire conseilles. Un tank (Pandawa + Dame Jhessica) bloque Bethel et Zombruth. Tour 1 : Necronyx sur Bethel + avancer vers le Monolithe. Pousser le Dagon ennemi chaque tour (Inebranlable). Focus Monolithe en melee (desenvouté le bouclier). Une fois le Monolithe mort, positionner le Dagon allie au cac de Bethel et le booster (phase ~7-8 tours). Replacer Bethel tous les 2 tours hors du glyphe Etoile de Mer. Necronyx Bethel avant sa mort. Apres la mort de Bethel, finir les autres monstres librement sans Necronyx.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // La Tour de Solar est un donjon des Marches Magmatiques dont le boss Solar alterne 4 états 
  109: {
    "summary": "La Tour de Solar est un donjon des Marches Magmatiques dont le boss Solar alterne 4 états cycliques (Aurore, Zénith, Crépuscule, Nadir) et est invulnérable sauf en état Nadir. La mécanique centrale est le sort Nécronyx (obtenu en quête) : appliqué avant la mort de chaque monstre pour supprimer le renvoi de dégâts, et obligatoirement sur Solar juste avant de le tuer, sans quoi il OS toute l'équipe à sa résurrection.",
    "recommendedLevel": "180 — 200",
    "composition": "Équipe capable d'un gros burst de dégâts concentré sur un seul tour pour éliminer Solar en état Nadir. Un personnage tank pour bloquer les monstres. Classes Iop (Colère) ou Sram (réseau de sorts) appréciées pour le burst.",
    "keyResist": [
      "Terre",
      "Feu",
      "Air",
      "Eau"
    ],
    "phases": [
      {
        "title": "Mécanique globale : état Pyrozomb et sort Nécronyx",
        "mechanics": [
          "Tous les monstres lancent Pyrozomb dès le début : quand un monstre meurt, le prochain monstre à jouer ressuscite un allié mort.",
          "Renvoi de dégâts : frapper un monstre depuis la case càc lui fait renvoyer les dégâts en zone.",
          "Sort Nécronyx (obtenu dans la quête L'arme fatale) : se lance sur un ennemi, une fois sur deux, mais fait passer le tour du lanceur. Effets : supprime le renvoi càc du monstre ciblé et empêche le monstre ressuscité de taper.",
          "Nécronyx est OBLIGATOIRE sur chaque monstre avant sa mort, et sur Solar avant de le tuer, sinon Solar OS toute l'équipe à sa résurrection.",
          "Accès zone : la quête La colère des dieux doit être terminée. Sort Nécronyx : obtenu dans la quête L'arme fatale."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/solardj82fixed_orig.png",
            "caption": "Schéma explicatif du sort Nécronyx"
          }
        ]
      },
      {
        "title": "Monstres du donjon",
        "mechanics": [
          "Hacharné — Haleine Enflammée : 250 feu, zone demi-croix 1PO, portée 2PO max. Magmache : 350 air en ligne de 3 cases. Visiosoufre : -7PO pour 2 tours à distance.",
          "Halbardent — Geoassaut : 430 terre + 30% érosion 2 tours (portée 2PO). Lance-flammes : 180 feu en ligne de 4 cases (5PO). Chauffard : +200 Puissance et +3PM sur lui-même pour 1 tour.",
          "Klémort — Conjuration Volcanique : 350 feu + attire 2 cases vers lui (frappe ceux à plus de 4PO). Épéruption : 600 terre + -2PM en zone diagonale autour de la case càc. Magmagique : -40 tacle sur lui et alliés adjacents mais -50% dégâts 2 tours (taper au càc ou désenvoûter avant d'attaquer).",
          "Moribombe — Grenade Collante : 400 eau en ligne jusqu'à 8PO. Zhen Tian Lei : 400 air en cercle 2PO + repousse 1 case (très longue portée). Chaudière : +1300PB 2 tours pour lui et alliés dans un rayon de 2PO.",
          "Trépavois — Charge au Bouclier : 400 terre en zone carré 3 cases (ligne, jusqu'à 5PO). Glaive Sommaire : 500 eau + s'attire sur la cible (jusqu'à 5PO). Avancée Inexorable : invulnérable à distance + Indéplaçable 2 tours."
        ]
      },
      {
        "title": "Boss Solar — Cycle des 4 états",
        "mechanics": [
          "Solar alterne 4 états par cycle de 3 tours : Aurore (tours 1-3), Zénith (tours 4-6), Crépuscule (tours 7-9), Nadir (tour 10+).",
          "Appliquer Nécronyx à Solar le fait passer à l'état suivant à son prochain tour.",
          "Solar est invulnérable en états Aurore, Zénith et Crépuscule. Il n'est vulnérable qu'en état Nadir.",
          "Renvoi de dégâts en zone carré de taille 1 autour de Solar : appliquer Nécronyx supprime ce renvoi mais il faut le tuer avant qu'il rejoue.",
          "Glyphe permanent sur les bords de la map (actif tout le combat) — effets en début de tour selon l'état de Solar : Aurore = -300 Puissance ; Zénith = 20% érosion ; Crépuscule = -2PA ; Nadir = -4PO.",
          "État Aurore : Solar rend ~700PV à lui et ses alliés, +1000 esquive PA/PM ; les joueurs gagnent +1PA.",
          "État Zénith : boost alliés +200 Puissance, -6PO aux joueurs 1 tour ; Solar est Lourd et Intaclable ; les joueurs gagnent +2PA.",
          "État Crépuscule : -1PA aux joueurs.",
          "État Nadir : Solar devient vulnérable ; les joueurs perdent 2PA."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/published/5-copie.png?1512436006",
            "caption": "Exemple du glyphe permanent en bordure de map"
          }
        ]
      },
      {
        "title": "Sorts de Solar par état",
        "mechanics": [
          "AURORE — Lève-tôt : ~1200 terre en croix de 5PO + 1300PB aux alliés en ligne. Aube Saine : +2PM/+40 tacle alliés + 900 feu en ligne 4 cases (s'attire au càc). Rossée Matinale : eau proportionnel aux PV érodés de la cible (4PO max).",
          "ZÉNITH — Coup de Soleil : ~1100 terre en mêlée (1400 si Pesanteur), maximise effets aléatoires. Éruption Solaire : ~800 feu sur TOUS les joueurs (1200 si Pesanteur) + -6PO à tous. Démons de Midi : téléportation + 950 air + -40 fuite en zone croix 1 (6PO sans ligne de vue).",
          "CRÉPUSCULE — Le Grand Soir : 400 terre, ligne perpendiculaire infinie + -80 tacle. Cours du Soir : 400 air + état Affaibli 1 tour (6PO). Coucher de Soleil : -4PM + Pesanteur/Indéplaçable/Lourd en ligne 4 (3PO).",
          "NADIR — Nuit Blanche : 200 eau + poison eau 400/tour 2 tours + -20% PV max 2 tours (6PO). Protecteur d'émoi : 150 feu en croix 2PO + -60 retrait PM/PA + poison PM (90PV feu par PM utilisé) 2 tours (12PO). Démons de Minuit : 150 air zone marteau + poison air 54/PA utilisé 2 tours + +20% dégâts distance reçus (12PO)."
        ]
      },
      {
        "title": "Stratégie générale du combat",
        "mechanics": [
          "Appliquer Nécronyx avant de tuer CHAQUE monstre (monstres de salles et Solar).",
          "Pour Solar : Nécronyx aux tours 1, 2 et 3 pour le passer en état Nadir au tour 4, puis le tuer en Nadir avec Nécronyx appliqué.",
          "Si Solar ne peut pas être tué en un seul tour en Nadir : l'entamer au maximum sans Nécronyx (attention renvoi de dégâts), puis au tour suivant appliquer Nécronyx en premier (premier en initiative) pour que les autres puissent taper sans renvoi et le finir.",
          "Si Solar survit à l'état Nadir, il repasse en Aurore (invulnérable) : attendre ou utiliser 3 Nécronyx successifs pour le ramener en Nadir.",
          "Priorité à éliminer le Moribombe en premier : son sort Grenade Collante augmente les dégâts subis de 50%.",
          "Klémort sous Magmagique : taper au càc ou désenvoûter son buff avant d'attaquer.",
          "Eviter les cases de bord de map (glyphe permanent actif tout le combat)."
        ]
      }
    ],
    "tips": [
      "Accès : entrée du donjon aux Marches Magmatiques en [-31,15]. Zone accessible uniquement après la quête La colère des dieux.",
      "Sort Nécronyx indispensable : s'obtient dans la quête L'arme fatale.",
      "Recette de la clef : 2× Viande Goûtue + 1× Salikrone + 1× Quisnoa + 1× Patelle + 2× Vertèbre de Trépavois + 2× Langue de Hacharné + 2× Grenade de Moribombe + 2× Oeil de Halbardent.",
      "Quêtes liées : Les cœurs livides, Un nouvel héritier, Qui nous protège du protecteur ?, Les totems de Maïmane.",
      "Ne jamais frapper un monstre sans lui avoir appliqué Nécronyx si on veut éviter le renvoi de dégâts.",
      "Préparer un gros burst (Colère de Iop, réseau de Sram) pour éliminer Solar en un seul tour en état Nadir si possible.",
      "Ne pas rester sur les cases de bordure de map (glyphe permanent)."
    ],
    "rewards": [
      "Drops des monstres entrant dans la recette de la clef : Viande Goûtue, Salikrone, Quisnoa, Patelle, Vertèbre de Trépavois, Langue de Hacharné, Grenade de Moribombe, Oeil de Halbardent."
    ],
    "achievements": [
      {
        "name": "La mort sait attendre",
        "strategy": "Aucun ennemi ne doit entrer dans l'état Nécronyx avant la mort de Solar. Éliminer Solar en premier : Nécronyx aux tours 1, 2 et 3 pour le passer en Nadir au tour 4. Tenter de le tuer en un tour (burst recommandé) ou deux tours maximum. Tacler les autres monstres avec un tank en attendant. Après la mort de Solar, vigilance : à chaque résurrection de Solar par un monstre, il perd Nécronyx et doit être ré-Nécronyx avant d'être tué à nouveau. Priorité à éliminer le monstre qui a ressuscité Solar.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      }
    ]
  },
  // Le boss Dazak Martegel possède plus de 100% de résistances dans tous les éléments
  110: {
    "summary": "Le boss Dazak Martegel possède plus de 100% de résistances dans tous les éléments. Pour lui en retirer, il faut le laisser atteindre l état Nimpatience 3 (ne pas le laisser frapper pendant 3 tours), puis le pousser/attirer pour lui faire perdre 5% de résistances par déplacement sur les 2 tours suivants. La difficulté principale est de gérer le système de Nimpatience des monstres du donjon, surtout le Tanklume qu il faut éliminer avant son état 3.",
    "recommendedLevel": "200",
    "composition": "Crâ fortement conseillé pour les dégâts à distance et le recul. Enutrof pour retrait PM. Pandawa tank pour bloquer les 3 monstres au càc. Un soigneur (Eniripsa) ou classe de protection (Zobal, Féca) est un atout. Classes avec sorts de placement très utiles pour le duo.",
    "keyResist": [
      "Neutre",
      "Air",
      "Feu",
      "Eau",
      "Terre"
    ],
    "phases": [
      {
        "title": "Système de Nimpatience (tous les monstres)",
        "mechanics": [
          "Nimpatience : état qui s incrément quand un monstre ne frappe PAS un personnage (les invocations ne comptent pas) — 3 niveaux.",
          "Niveaux 1 et 2 : boost le monstre (PM, dégâts, résistances selon le monstre).",
          "Niveau 3 : boost supplémentaire + débloque un nouveau sort ou un effet supplémentaire sur un sort, utilisable au tour suivant puis état réinitialisé.",
          "Si le monstre reste au niveau 3 sans pouvoir utiliser son sort, il reste au niveau 3 jusqu à ce qu il puisse le lancer.",
          "Les niveaux de Nimpatience accumulés sont conservés même si le monstre peut vous frapper (ils ne redescendent pas).",
          "Barbélier Nimpatience 3 : retire ~25% de vitalité (infini) et frappe double avec Coup de cornes.",
          "Boufbos Nimpatience 3 : met état Pacifiste 1 tour et frappe double avec Lance-pierre.",
          "Kasrok Nimpatience 3 : retire 7PA esquivables (au lieu de 4) et frappe double avec Marteau pillon en zone rayon 5 (au lieu de 3).",
          "Tanklume Nimpatience 3 : lance Ninfluence — téléporte les 4 ennemis les plus proches à son càc et devient indéplaçable 1 tour.",
          "Vatenbière Nimpatience 3 : lance Nimplantation — retire 100PM à tous ses ennemis pour 1 tour."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/etats_orig.png",
            "caption": "Tableau des niveaux de Nimpatience des monstres"
          }
        ]
      },
      {
        "title": "Monstres du donjon",
        "mechanics": [
          "Barbélier (Feu) — Bélier : s attire sur la cible à 6PO, boost de ~900PB pour 2 tours, uniquement en ligne, 2 fois/tour. Coup de cornes : frappe 1200 feu au càc + 20% érosion 2 tours, 3 fois/tour.",
          "Boufbos (Air) — Forte-tête : retire 4PM, repousse 2 cases et se recule 2 cases, jusqu à 2PO, relance 2 tours. Lance-pierre : frappe 1000 air, uniquement en ligne 3-12PO, 3 fois/tour.",
          "Kasrok (Eau) — Marteau pillon : frappe 700 eau en zone cercle rayon 3 + retire 4PA esquivables, 1 fois/tour. Nimpulsion : malus -50% critique, pousse 4 cases et s attire 4 cases, au càc, 2 fois/tour.",
          "Tanklume (Neutre) — Ninrmure : échange de place avec un allié et intercepte ses dégâts pour 1 tour, boost 930PB 1 tour, en ligne jusqu à 3PO sans LDV, 2 fois/tour. Triple attaque : frappe 800 neutre en zone ligne perpendiculaire taille 3 + malus -50 fuite 2 tours, en ligne jusqu à 2PO, 3 fois/tour.",
          "Vatenbière (Terre) — Gigantosité : met état Pesanteur 1 tour, en ligne jusqu à 8PO, 2 fois/tour. Hachis : frappe 800 terre en zone croix taille 3 + malus -6PO 1 tour, de 3 à 8PO, 2 fois/tour."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/coup-de-cornes_orig.png",
            "caption": "Zone du sort Coup de cornes (Barbélier)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/lance-pierre_orig.png",
            "caption": "Zone du sort Lance-pierre (Boufbos)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj10-marteau-pillon-fixed_orig.png",
            "caption": "Zone du sort Marteau pillon (Kasrok)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/nimpulsion_orig.png",
            "caption": "Zone du sort Nimpulsion (Kasrok)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj10-ninrmure-fixed_orig.png",
            "caption": "Zone du sort Ninrmure (Tanklume)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj10-triple-attaque-fixed_orig.png",
            "caption": "Zone du sort Triple attaque (Tanklume)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/gigantosit_orig.png",
            "caption": "Zone du sort Gigantosité (Vatenbière)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/hachis_orig.png",
            "caption": "Zone du sort Hachis (Vatenbière)"
          }
        ]
      },
      {
        "title": "Boss : Dazak Martegel",
        "mechanics": [
          "Empalement royal : frappe 1500 neutre au càc + 40% érosion 2 tours + malus -10% résistance (infini), 2 fois/tour.",
          "Ninfiltration : bond de 5 cases en ligne, frappe 900 air + retire 4PM esquivables aux cibles à 1PO de l arrivée (zone hache), en ligne jusqu à 5PO, cooldown 1 tour / relance 2 tours.",
          "Nintrépidité : boost tous ses alliés de +2PM et 1500PB pour 1 tour (débuffable), lancé à partir du tour 3 puis tous les 2 tours (tours 3, 5, 7, 9…).",
          "Nimpatience : +50% dégâts finaux et +1PM (infini) par niveau cumulable.",
          "Nimpatience 3 : +3PM et +150% dégâts finaux pour 2 tours."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/empalement-royal_orig.png",
            "caption": "Zone du sort Empalement royal (Dazak)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj10-ninfiltration-fixed_orig.png",
            "caption": "Zone du sort Ninfiltration (Dazak)"
          }
        ]
      },
      {
        "title": "Principe du combat : retrait de résistances",
        "mechanics": [
          "Dazak possède plus de 100% de résistances partout au départ — il faut les abaisser pour pouvoir le tuer.",
          "Pour retirer des résistances : ne pas laisser Dazak frapper pendant 3 tours pour qu il atteigne Nimpatience 3, puis les 2 tours suivants chaque poussée/attraction lui retire 5% de résistances (infini) dans tous les éléments.",
          "ATTENTION : les dégâts de poussée contre un obstacle lui font gagner 10% de résistances.",
          "Si les 2 tours passent sans assez de résistances retirées, Dazak conserve le niveau atteint et on peut recommencer en attendant son prochain Nimpatience 3.",
          "Sorts Friction ou Coup par coup du Iop : chaque déplacement lors de ces sorts fait perdre 5% de résistances à Dazak.",
          "Ninfiltration disponible tous les 2 tours à partir du tour 2 (tours 2, 4, 6, 8…) : anticiper en gardant 5 cases de distance supplémentaires.",
          "Nintrépidité débuffable avec souillure, pelle fantomatique, etc. pour enlever +2PM et 1500PB aux monstres."
        ]
      },
      {
        "title": "Stratégie globale",
        "mechanics": [
          "Priorité absolue : focus et tuer le Tanklume le plus vite possible avant son Nimpatience 3 (Ninfluence ramène toute l équipe à son càc).",
          "Laisser le Tanklume utiliser Ninrmure (sacrifice d alliés) pour l infliger des dégâts en zone ou en profitant des faiblesses élémentaires des alliés sacrifiés.",
          "Si le Tanklume est en Nimpatience 2 sans pouvoir le tuer, le laisser frapper un personnage pour ne pas qu il passe au niveau 3.",
          "Garder Dazak à distance : le repousser constamment, lui retirer des PM, rester hors de sa portée.",
          "Tacler le Boufbos contre un mur pour l empêcher de vous toucher (son sort d attaque se lance uniquement en ligne 3-12PO, Forte-tête ne fonctionne pas s il ne peut pas se reculer).",
          "Couper les lignes de vue avec le Boufbos en se cachant derrière des obstacles.",
          "Une fois le Tanklume mort, éliminer tranquillement les autres monstres tout en restant à distance de Dazak.",
          "Quand il reste uniquement Dazak : garder la distance, attendre Nimpatience 3, retirer des résistances pendant 2 tours, répéter jusqu à pouvoir le tuer."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj10-tacler-boufbos_orig.png",
            "caption": "Placement pour tacler le Boufbos contre un mur"
          }
        ]
      }
    ],
    "tips": [
      "Position du donjon : entrée dans le Royaume des Martegel en [-62,-70].",
      "Prérequis : avoir fait la quête « Frappez, ami, et entrez » pour entrer dans le Royaume des Martegel.",
      "Quêtes liées : De Brikke et de Brokke, Le dragon noir, Les totems de Maïmane.",
      "Recette de la clef : 1 Perce-Neige, 1 Poisskaille, 1 Frostiz, 2 Viande Goûtue, 2 Jambière de Kasrok, 2 Dent de Vatenbière, 2 Fronde de Boufbos, 2 Poils de barbe de Barbélier.",
      "Capture du boss : pierre d âme de puissance 1000 requise.",
      "Désenvoutez le sort Nintrépidité du Dazak (lancé tours 3, 5, 7, 9…) avec une souillure ou pelle fantomatique pour supprimer le boost +2PM et 1500PB sur les monstres.",
      "Balise tactique du Crâ : placer à 2PO de Dazak avant les tours 2, 4, 6, 8… pour qu il utilise Ninfiltration dessus et n avance pas vers l équipe.",
      "Iop : sort Friction ou Coup par coup permettent de retirer des résistances à Dazak à chaque déplacement subi."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Premier",
        "strategy": "Dazak Martegel doit être achevé en premier. Trois stratégies possibles : (1) tank + tacle des monstres pendant qu on tue Dazak, (2) retrait PM massif pour isoler les monstres d un côté pendant qu on tue Dazak de l autre, (3) stratégie Vitalité du Iop : faire mourir les monstres de la perte de la vitalité du Iop (sort Vitalité placé sur les monstres, PV réduits sous le seuil de la vitalité, attend la fin de la vitalité) pour ne pas déclencher l échec du succès.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/premier.png"
      },
      {
        "name": "Liberté",
        "strategy": "Ne pas tenter de retirer de PM ou de PO aux adversaires pendant tout le combat. Choisir les variantes des sorts de retrait PM/PO. Repousser Dazak au maximum. Tuer les monstres normalement en commençant par le Tanklume.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/liberte.png"
      },
      {
        "name": "Spécial : Manque de nimpatience",
        "strategy": "Les ennemis ne doivent être achevés que lorsqu ils se trouvent dans l état Nimpatience III. Empêcher les ennemis de frapper pendant 3 tours pour les amener en Nimpatience 3, puis les éliminer avant qu ils puissent utiliser leur sort. Attention au Tanklume qui peut sacrifier ses alliés. Dazak doit aussi être éliminé en état Nimpatience 3.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 40 tours. Stratégie Crâ + classe tank : le tank bloque les 3 monstres au càc pendant que le Crâ gère seul Dazak à distance avec sorts de recul et balise tactique. Stratégie Pandawa full agilité + classe dégâts : mobilité et placement du Pandawa pour gérer les monstres, Pandawa solote Dazak une fois les monstres morts.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // La Pretresse de Kao est le boss du Temple du dieu Kao, donjon de l'ile de Pwak
  111: {
    "summary": "La Pretresse de Kao est le boss du Temple du dieu Kao, donjon de l'ile de Pwak. Elle est invulnerable tant que 3 Eclats de Kao n'ont pas ete tues ; chaque eclat elimine la booste en degats via des etats Forastero/Trinitario/Criollo. La cle est de gerer l'etat Chocolathee applique quand on touche directement un eclat, qui amplifie massivement les degats du sort Cloches du Kao.",
    "recommendedLevel": "200",
    "composition": "Classes de soin et protection fortement conseillee (Eniripsa, Zobal, Feca). Pour les succes, un Pandawa est indispensable ; Roublard, Sram reseau ou Eliotrope+Iop permettent d'eliminer la Pretresse en 1 tour. L'element Terre est favorise (faiblesses de la Pretresse).",
    "keyResist": [
      "Neutre",
      "Terre"
    ],
    "phases": [
      {
        "title": "Mecanique de l'Eclat Kao et etat Chocolathee",
        "mechanics": [
          "Tous les monstres lancent Chocolatomanie pour invoquer un Eclat Kao : reduit de 50% les degats infliges a tous les monstres tant que l'eclat est sur le terrain.",
          "Eclat Kao : 1 000 PV de base + 500 PV par personnage dans le combat pour 1 tour ; disparait automatiquement au bout de 2 tours.",
          "Frapper l'eclat directement applique l'etat Chocolathee (3 tours) : booste les sorts de frappe des monstres et augmente les degats de Cloches du Kao de 50 par personnage ayant l'etat.",
          "Exceptions sans etat Chocolathee : tuer l'eclat en un seul coup (OS), l'attaquer avec un poison, ou via source exterieure (bombes Roublard, invocations).",
          "L'eclat rend son invocateur Invulnerable tant qu'il n'est pas tue.",
          "Pretresse de Kao gagne l'etat Intaclable lorsque l'eclat est present.",
          "Effets bonus selon invocateur : Cabosseur +4 PO, Chocoligarque +2 PM, Pralicienne +50 Tacle, Temperaturge +50 degats, Torrefactueur Indeplaxable.",
          "Spawn de l'eclat : toujours au contact du monstre invocateur selon priorite horaire."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/eclat-kao_orig.png",
            "caption": "Eclat Kao"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/etat-choco_orig.png",
            "caption": "Etat Chocolathee"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/kaofixspawn-eclat_orig.png",
            "caption": "Regle de spawn de l'eclat Kao (priorite horaire)"
          }
        ]
      },
      {
        "title": "Monstres du donjon",
        "mechanics": [
          "Cabosseur — Piege a gourmands (glyphe invisible, degats neutre rayon 2, malus esquive PM) ; Eclabossage (frappe eau, zone croix diagonale, PO modifiable) ; Feve du samedi soir (frappe feu + attire 2 cases ; avec Chocolathee degats doubles, attraction 4 cases).",
          "Chocoligarque — Ganache (teleportation avec ennemi 7PO : frappe air 200 ; avec allie : soin) ; Cacaobstruction (frappe terre 300 sans LdV, retire 2PM ; Chocolathee : degats x3, retire 4PM) ; Chocolat Sperger (frappe air 300, retire 3PO, repousse 2 cases).",
          "Pralicienne — Chococlier (frappe terre 300, bouclier 305 PB aux ennemis au cac) ; Glacage (reduction 20% degats subis 2 tours pour elle et allies rayon 2) ; Hydrolyse (frappe eau vol de vie, malus fuite 30 ; Chocolathee : degats doubles, malus 60).",
          "Temperaturge — Refroidissement (frappe air 300 en ligne, poison air, etat Refroidissement) ; Surchauffe (frappe feu 280, retire 2PA, poison feu, etat Surchauffe) ; Choc Thermique (declenche auto avec les 2 etats : frappe neutre 350 + etat Pacifiste 1 tour !) ; Chaudron Choco (glyphe rouge rayon 3 : feu 200 + poison air + pesanteur).",
          "Torrefactueur — Torrefaction (frappe feu 300, degats cumulables +5) ; Torreadeur (frappe neutre 600 en ligne, erosion 15% 2 tours, attire au cac et repousse 1 case ; Chocolathee : degats doubles, erosion 30%) ; Padbra (frappe terre 350 au cac, insoignable 1 tour, relance 2 tours).",
          "Focus prioritaire : Torrefactueur en premier (erosion elevee + forte frappe neutre). Appliquer Pesanteur sur le Chocoligarque pour bloquer son sort Ganache."
        ]
      },
      {
        "title": "Boss : Pretresse de Kao",
        "mechanics": [
          "Artisanat du Kao : confere l'etat Invulnerable au boss des le debut du combat.",
          "Cloches du Kao : frappe neutre TOUS les ennemis sur la map (tours impairs, intervalle 2 tours) ; degats de base + 50 par personnage avec etat Chocolathee — peut depasser 1 500 voire 3 000 si plusieurs Chocolathee.",
          "Equador : boost allies (cercle inverse rayon 6) de 50 degats 1 tour + soin environ 200 PV.",
          "Spatule Tranche-Gourmands : frappe air 260 zone ligne taille 4, malus 50 fuite (ligne uniquement, 4PO max).",
          "Commerce Inequitable : frappe neutre 350, vole 1 PM (2 en cc), 8PO max.",
          "Etats de boost par eclats tues — I Forastero : +52% degats finaux (infini) ; II Trinitario : +74% (infini) ; III Criollo : +99% (infini). Ces etats ne se decrementent pas.",
          "Apres passage en etat III, la Pretresse reinvoque un eclat tous les 2 tours et repasse Invulnerable ; retuer l'eclat suffit a la rendre vulnerable a nouveau."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/cloches-du-kao_orig.png",
            "caption": "Sort Cloches du Kao (AoE neutre tous personnages, tours impairs)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/equador_orig.png",
            "caption": "Sort Equador (boost + soin allies)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/spatule-tranche-gourmands_orig.png",
            "caption": "Sort Spatule Tranche-Gourmands"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/commerce-inequitable_orig.png",
            "caption": "Sort Commerce Inequitable"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/kaofixchocolathee_orig.png",
            "caption": "Schema impact etat Chocolathee sur les degats de Cloches du Kao"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/kaofixeclatkao_orig.png",
            "caption": "Mecanique eclat Kao et etat Chocolathee"
          }
        ]
      },
      {
        "title": "Strategie globale",
        "mechanics": [
          "Sans succes Chrono/Premier : eliminer d'abord tous les monstres en laissant les eclats en vie (reduction 50% degats mais Pretresse non boostee). Utiliser poisons (non affectes par la reduction 50%) pour accelerer.",
          "Focus Torrefactueur en premier (erosion + degats eleves). Appliquer Pesanteur sur le Chocoligarque si possible.",
          "Une fois monstres elimines, attaquer les eclats : OS ou poison pour eviter Chocolathee. Apres 1 tour, l'eclat repasse a 1 000 PV (perte du bonus), facilitant le one-shot.",
          "Si impossible d'OS, faire taper l'eclat par UN SEUL personnage pour limiter les Chocolathee.",
          "Apres 3 eclats tues, la Pretresse est vulnerable : la focus immediatement avant qu'elle ne reinvoque.",
          "Si eclat reinvoque avant la mort de la Pretresse : retuer l'eclat suffit.",
          "Resistances neutres tres utiles (Pretresse + Torrefactueur tapent tous les deux dans le neutre).",
          "Feca conseille : sorts Ataraxie et Bastion permettent d'eviter les degats de Cloches du Kao (Bastion peut rendre 4 personnages invulnerables sur un tour critique)."
        ]
      }
    ],
    "tips": [
      "Acces : entree sur l'Ile de Pwak en [-1,-10]. Quetes liees : Les aleas de la Chocolaterie, Chocomagie contre chocomancie.",
      "Recette de la clef : 2x Viande Goutue, 1x Patelle, 1x Quisnoa, 1x Salikrone, 2x Toque de Cabosseur, 2x Peau de Torrefactueur, 2x Meche de Pralicienne, 2x Chaudron de Temperaturge.",
      "Les poisons ne sont PAS affectes par la reduction de 50% de degats des monstres lorsque l'eclat est present.",
      "Le Roublard est tres fort : les explosions de bombes n'appliquent pas l'etat Chocolathee.",
      "Element Terre favorise contre la Pretresse (faiblesse terre confirmee).",
      "Appliquer Pesanteur sur le Chocoligarque pour bloquer son sort Ganache (echange de place).",
      "Choc Thermique du Temperaturge declenche automatiquement si un personnage a les etats Refroidissement ET Surchauffe en meme temps : frappe neutre 350 + Pacifiste 1 tour — a eviter.",
      "N'avoir qu'un seul personnage avec l'etat Chocolathee a la fois pour minimiser les degats de Cloches du Kao."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Chrono",
        "strategy": "Vaincre tous les monstres en moins de 9 tours. Eliminer les eclats rapidement ou utiliser des poisons ; n'avoir qu'un seul personnage en etat Chocolathee pour limiter les degats.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/chrono.png"
      },
      {
        "name": "Premier",
        "strategy": "La Pretresse de Kao doit etre achevee en premier. Eliminer un eclat par tour pour qu'elle soit vulnerable des le tour 3, puis l'eliminer avant le tour 5. Favoriser l'element Terre.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/premier.png"
      },
      {
        "name": "Liberte",
        "strategy": "Ne pas tenter de retirer de PM ou de PO aux adversaires pendant tout le combat. Aucune difficulte particuliere, eviter simplement les sorts de retrait PM/PO.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/liberte.png"
      },
      {
        "name": "Special - Charier la chocolaterie",
        "strategy": "Aucun Eclat du Kao ne doit etre sur le terrain lorsqu'un combattant ennemi est acheve. Eliminer l'eclat avant chaque kill de monstre ; privilegier OS ou poison pour eviter l'etat Chocolathee.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages max en moins de 40 tours. Eviter de booster les monstres et le boss. Composition 1 : Sram air + classe poison (utiliser Brume + poisons, ne pas toucher aux eclats tant que les monstres ne sont pas elimines). Composition 2 : Eliotrope + classe (portails des deux cotes de la map, maximiser resistances neutres).",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      },
      {
        "name": "Meta-succes : C'est fort en chocolat",
        "strategy": "Realiser tous les succes du donjon. Pour full succes hors Duo : Pandawa indispensable + forte classe Terre (Roublard, Sram reseau, Eliotrope+Iop, ou Iop seul). Eliminer un eclat par tour (T1, T2, T3) afin que la Pretresse soit vulnerable au tour 4 et l'eliminer avant son prochain tour impair."
      }
    ]
  },
  // Le Croqueleur est invulnérable et ne peut être vaincu qu'en lui faisant invoquer 4 Pépites
  112: {
    "summary": "Le Croqueleur est invulnérable et ne peut être vaincu qu'en lui faisant invoquer 4 Pépites successives (feu, air, eau, terre) via des frappes élémentaires suivies d'une poussée. Chaque pépite tuée lui retire 25% de ses PV et un de ses états, jusqu'à sa mort après la quatrième.",
    "recommendedLevel": "120",
    "composition": "Composition orientée càc recommandée car toutes les pépites du Croqueleur ont des résistances à distance (la première est même invulnérable à distance). Prévoir un personnage jouant juste après le Croqueleur pour invoquer les pépites et maximiser le temps pour les éliminer.",
    "keyResist": [
      "Feu",
      "Air",
      "Eau",
      "Terre"
    ],
    "phases": [
      {
        "title": "Salles normales — Monstres du donjon",
        "mechanics": [
          "Tous les monstres ont le sort passif Morcelage : frapper un monstre peut invoquer des Pépites croquantes (200PV, 10% résistances élémentaires, immobiles) à 2PO au-dessus du monstre frappé.",
          "Croquanibalisme : un monstre peut manger une pépite au càc → +1PA, soin ~150PV et effet bonus propre à chaque monstre (Chocoskargo : invisible 2 tours ; Glourson Guimauve : +250PB, +20 tacle 2 tours ; Kakoalak : +1 lancer pluie de pépite et +10 dmg 2 tours ; Kwakao : +3PO 2 tours ; Mansocolat : +50 puissance, +1PM 2 tours).",
          "Pépite croquante tuée : si l'alliance y est présente au càc → +50 Puissance et +210PB pour 2 tours.",
          "Chocoskargo — Glycémie : 125 dmg feu zone croix diag taille 1, 10% érosion 2 tours, 2–8PO.",
          "Chocoskargo — Enrobage : soin allié ~120PV +2PM 1 tour, zone croix taille 1, 3–9PO.",
          "Chocoskargo — Chocoskarfarce : 80 dmg air + soin ennemis au càc de la cible, ligne/diagonale 3–10PO.",
          "Glourson Guimauve — Attrape Gourmand : attire les cibles en zone croix 5 cases de 2 cases (3cc).",
          "Glourson Guimauve — Englumauve : 150 dmg feu zone carré 1 autour de lui au càc, -10 fuite 1 tour.",
          "Glourson Guimauve — Guimimauve : 200 dmg neutre au càc, vol 50 (100cc) intelligence 2 tours.",
          "Kakoalak — Pluie de Pépite : 180 dmg neutre, malus -10 esquive PM 1 tour, jusqu'à 5PO.",
          "Kakoalak — Kakoaklake : 160 dmg terre zone croix taille 1, -2PA esquivables 2 tours, diagonale 4PO max.",
          "Kwakao — Kwakaoust : poison (1PM utilisé = -5PV air), état pesanteur 1 tour, 3–9PO.",
          "Kwakao — Skwalala : 150 dmg feu, vol 50 intelligence 2 tours, 2–7PO.",
          "Mansocolat — Mansaut : saute au càc ennemi, -2PA esquivables contacts 2 tours, ligne 4PO max.",
          "Mansocolat — Maskansocolat : 230 dmg eau, -2PO 1 tour, jusqu'à 2PO.",
          "Mansocolat — Mansocolère : 200 dmg neutre au càc."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/pepites_orig.png",
            "caption": "Schéma d'apparition des Pépites croquantes (cellules dans l'ordre horaire depuis la position de base)"
          }
        ]
      },
      {
        "title": "Combat final — Le Croqueleur",
        "mechanics": [
          "Invulnérable dès le début du combat (sort Croquelure) : possède les états Enrobage en chocolat, Morceaux de chocolat, Mousse au chocolat et Cœur en chocolat.",
          "Mécanisme principal : frapper le Croqueleur dans l'élément requis (il entre dans l'état lié), puis le pousser → il invoque une Pépite du Croqueleur.",
          "Ordre des pépites : 1) Feu (état Fondu) → 2) Air (état Soufflé) → 3) Eau (état Lavé) → 4) Terre/Neutre (état Brisé).",
          "Chaque pépite tuée : -25% PV max du Croqueleur et perte d'un état. Croqueleur meurt à la mort de la 4e pépite.",
          "Délai : la 1ère pépite doit être tuée en 1 tour ; les suivantes en 2 tours maximum, sinon elle disparaît et il faut recommencer.",
          "Conseil de jeu : le personnage qui joue juste après le Croqueleur doit invoquer les pépites pour maximiser le temps disponible.",
          "À chaque poussée du Croqueleur : +1PA, +1PM et -20 puissance (infini, non cumulable par pépite → max +4PA, +4PM total).",
          "Pépite 1 (feu) : invulnérable à distance, PV = 25% du Croqueleur, -10% résistance feu.",
          "Pépite 2 (air) : 70% résistance distance, PV = 35% du Croqueleur, -10% résistance air.",
          "Pépite 3 (eau) : 40% résistance distance, PV = 45% du Croqueleur, -10% résistance eau.",
          "Pépite 4 (terre/neutre) : 10% résistance distance, PV = 55% du Croqueleur, -10% résistance terre.",
          "Croustichoc (feu) : 150 dmg feu zone croix diag taille 1, état affaibli 1 tour, 3–9PO.",
          "Total Impwâkt (feu) : 230 dmg feu zone triangle inversé base 3, minimise effets aléatoires, 0–2PO.",
          "Attraction gourmande (feu) : attire 3 cases en ligne, -20 fuite 1 tour, ligne 8PO.",
          "Croustichoc (air) : 150 dmg air + poison (1PA = -5PV air) 2 tours, 3–9PO.",
          "Total Impwâkt (air) : 230 dmg air, état insoignable 1 tour, 0–2PO.",
          "Attraction gourmande (air) : attire 2 cases, -50% dommages mêlée 1 tour, ligne 8PO.",
          "Croustichoc (eau) : 150 dmg eau, -2PA esquivables 1 tour, 3–9PO.",
          "Total Impwâkt (eau) : 230 dmg eau, repousse 2 cases ligne/diag + -2PM esquivables, 0–2PO.",
          "Attraction gourmande (eau) : attire 1 case, -4PO, état pesanteur 1 tour, ligne 8PO.",
          "Croustichoc (terre) : 150 dmg terre, 10% érosion 1 tour, 3–9PO.",
          "Total Impwâkt (terre) : 230 dmg terre, repousse 4 cases + -4PM (5cc) esquivables, 0–2PO.",
          "Attraction gourmande (terre) : 220 dmg neutre, état indéplaçable 1 tour + attire 1 case en ligne, ligne 8PO.",
          "ATTENTION (air) : Attraction gourmande peut infliger -50% dommages mêlée lors de la phase air.",
          "ATTENTION (spécial) : Croustichoc et Total Impwâkt sont des sorts de zone pouvant toucher les alliés du Croqueleur."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark226croqueleur2_orig.png",
            "caption": "Tableau des Pépites du Croqueleur : éléments, résistances et PV selon phase"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/tactique_6.png",
            "caption": "Schéma tactique global pour vaincre le Croqueleur"
          }
        ]
      }
    ],
    "tips": [
      "Entrée du donjon sur l'Île de Pwâk en [-1,-7].",
      "Recette de la clef : 3 Malt, 3 Graines de Pandouille, 2 Raies Bleues, 2 Viandes Persillées, 2 Becs de Kwakao, 2 Enrobages de Chocoskargo, 2 Pelages chocolatés, 2 Estomacs de Mansocolat.",
      "Quêtes liées : Les aléas de la Chocolaterie, Chocomagie contre chocomancie.",
      "Éliminer tous les monstres avant de s'attaquer au Croqueleur.",
      "Prioriser les dommages au càc sur les pépites pour éviter leurs fortes résistances à distance.",
      "Le personnage jouant juste après le Croqueleur doit être celui qui invoque les pépites.",
      "La première pépite (feu) est invulnérable à distance : avoir des personnages càc prêts à l'éliminer en 1 seul tour."
    ],
    "rewards": [
      "PV du Croqueleur (butin 4) : 6 800PV | (butin 5) : 7 400PV | (butin 6) : 8 200PV | (butin 7) : 9 000PV | (butin 8) : 10 000PV"
    ],
    "achievements": [
      {
        "name": "Chrono",
        "strategy": "Vaincre tous les monstres en moins de 9 tours. Il faut au minimum 4 tours pour tuer le Croqueleur (une pépite par tour). Éliminer rapidement les monstres accompagnant le Boss avant de s'y attaquer.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/chrono.png"
      },
      {
        "name": "Circulez !",
        "strategy": "Ne pas tenter de retirer des PM aux adversaires pendant tout le combat. Les monstres ne sont pas très dangereux, retirer des PM est inutile.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/circulez.png"
      },
      {
        "name": "Blitzkrieg",
        "strategy": "Achever tout ennemi entamé avant le début de son tour. Pour les pépites du Croqueleur, les tuer avant leur tour si elles ont été entamées. Invoquer la pépite avec le personnage jouant juste après le Boss.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/blitzkrieg.png"
      },
      {
        "name": "Spécial : J'accours, les croquants !",
        "strategy": "Tous les ennemis ne doivent subir que des dommages en mêlée. Taper tous les monstres et pépites uniquement en mêlée. Attention aux sorts de zone Croustichoc et Total Impwâkt du Croqueleur qui peuvent toucher ses propres alliés. Le Croqueleur lui-même doit être tapé en mêlée pour déclencher ses états.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 40 tours. Toutes les compos sont viables, le combat reste accessible. Bien maîtriser la mécanique du Boss.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Le boss Mawabouaino invoque des Twakeufs et pose des glyphes rouges sur les cases où meure
  113: {
    "summary": "Le boss Mawabouaino invoque des Twakeufs et pose des glyphes rouges sur les cases où meurent les ennemis. Passer sur ces glyphes confère l'état Chocomatose (+300 puissance, +3 PA pour 2 tours) mais permet aussi aux monstres de se téléporter au càc. Il faut gérer les invocations et les glyphes tout en évitant de tuer le boss avant que tous les personnages aient obtenu l'état Chocomatose (succès Spécial).",
    "recommendedLevel": "Île de Pwâk",
    "composition": "Groupe standard, pas de composition particulière mentionnée.",
    "keyResist": [
      "Terre",
      "Feu",
      "Air"
    ],
    "phases": [
      {
        "title": "Salles (monstres)",
        "mechanics": [
          "Twakeuf — Abwowption : vol 100 vitalité (125 cc) jusqu'à 3 PO pour 1 tour.",
          "Twakeuf — Souffle Liqueuwant : frappe 40 Air en zone triangle inversé base 3, uniquement à 1 PO.",
          "Twakeuf — Spiwitueuw : frappe 40 Feu au càc + malus 20 tacle (30 cc) pour 2 tours.",
          "Waccro — Gwokwik : frappe 80 Terre jusqu'à 3 PO.",
          "Waccro — Stéwoïdes : frappe 60 Terre au càc + vol 100 puissance (150 cc) pour 2 tours.",
          "Waccro — Skwat : frappe 80 Air en zone croix taille 2 centrée sur lui.",
          "Wadnozeam — Afwiandage : frappe 70 Terre + attire 1 case, uniquement en ligne 2–5 PO.",
          "Wadnozeam — Pouwsuite : retire 1 PM à la cible + s'attire de 3 cases sur elle, en ligne jusqu'à 4 PO.",
          "Wadnozeam — Wagglutinant : frappe 40 Air au càc + boost 20 tacle (30 cc) pour 2 tours.",
          "Wadulant — Céléwité : boost alliés de 2 PM (3 cc) pour 2 tours en zone carré côté 5.",
          "Wadulant — Secouwiste : frappe 40 Feu jusqu'à 5 PO sans LdV, soigne les ennemis càc de la cible.",
          "Wadulant — Oeufowie : boost un allié de 10% dommages finaux + 10% résistance pour 2 tours, jusqu'à 7 PO.",
          "Warkaik — Chokobombawde : frappe 50 Feu en zone croix taille 1, de 3 à 10 PO.",
          "Warkaik — Ombwage : frappe 60 Feu + retire 1 PO (2 cc) pour 2 tours, jusqu'à 8 PO.",
          "Warkaik — Twanchée : frappe 50 Air en zone ligne taille 6, jusqu'à 1 PO."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/abwowption_orig.png",
            "caption": "Sort Abwowption (Twakeuf) — zone et portée"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/souffle-liqueuwant_orig.png",
            "caption": "Sort Souffle Liqueuwant (Twakeuf) — zone triangle inversé"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/spiwitueuw_orig.png",
            "caption": "Sort Spiwitueuw (Twakeuf) — càc feu"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/gwokwik_orig.png",
            "caption": "Sort Gwokwik (Waccro) — frappe terre"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/stewoides_orig.png",
            "caption": "Sort Stéwoïdes (Waccro) — frappe terre càc + vol puissance"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/skwat_orig.png",
            "caption": "Sort Skwat (Waccro) — zone croix air"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/afwiandage_orig.png",
            "caption": "Sort Afwiandage (Wadnozeam) — terre + attraction"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/pouwsuite_orig.png",
            "caption": "Sort Pouwsuite (Wadnozeam) — retrait PM + auto-attraction"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/wagglutinant_orig.png",
            "caption": "Sort Wagglutinant (Wadnozeam) — air càc + boost tacle"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/celewite_orig.png",
            "caption": "Sort Céléwité (Wadulant) — boost PM alliés zone carré"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/secouwiste_orig.png",
            "caption": "Sort Secouwiste (Wadulant) — feu soin alliés càc cible"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/chokobombawde_orig.png",
            "caption": "Sort Chokobombawde (Warkaik) — feu zone croix"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ombwage_orig.png",
            "caption": "Sort Ombwage (Warkaik) — feu + retrait PO"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/twanchee_orig.png",
            "caption": "Sort Twanchée (Warkaik) — air zone ligne"
          }
        ]
      },
      {
        "title": "Boss : Mawabouaino",
        "mechanics": [
          "Cacaobstwuant : frappe 120 Terre + retire 1 PM (2 cc) pour 2 tours, jusqu'à 8 PO.",
          "Chocohowte : invoque le monstre Twakeuf.",
          "Chocolave : frappe 50 Feu + malus 20% résistance Terre (30 cc) pour 1 tour, en ligne jusqu'à 10 PO sans LdV.",
          "Éclat : frappe 120 Terre tous les ennemis dans un rayon de 2 + repousse de 2 cases (3 cc).",
          "Fondu Déchaîné (glyphe Chocomatose) : invoque un glyphe rouge sombre sur la case où un ennemi meurt. Passer sur le glyphe donne l'état Chocomatose (+300 puissance, +3 PA pour 2 tours, non-cumulable) à quiconque y passe (allié ou ennemi).",
          "Sous état Chocomatose : tous les monstres (sauf le boss) gagnent Mowfal — téléportation au càc d'un ennemi n'importe où sur la map.",
          "Les glyphes persistent tout le combat et ne disparaissent pas après utilisation. Si le boss meurt, glyphes et état Chocomatose disparaissent définitivement."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/cacaobstwuant_orig.png",
            "caption": "Sort Cacaobstwuant (boss) — frappe terre + retrait PM"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/chocolave_orig.png",
            "caption": "Sort Chocolave (boss) — feu + malus résistance terre"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/eclat_orig.png",
            "caption": "Sort Éclat (boss) — zone rayon 2 terre + repousse"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/s2_orig.jpg",
            "caption": "Schéma Fondu Déchaîné — glyphe Chocomatose et état"
          }
        ]
      }
    ],
    "tips": [
      "Position du donjon : Île de Pwâk, entrée en [-3,-4].",
      "Recette de la clef : 2× Carpe d'Iem, 2× Viande Ladre, 2× Menthe Sauvage, 2× Houblon, 2× Dent de Waddict, 2× Emballage Suspect, 2× Tendon de Waccro, 2× Oeil Bionique.",
      "Quêtes liées : Les aléas de la Chocolaterie / Chocomagie contre chocomancie.",
      "Sous état Chocomatose, les monstres peuvent se téléporter au càc instantanément — anticiper les repositionnements.",
      "Le boss génère des glyphes Chocomatose sur les cases de mort d'ennemis : un seul glyphe suffit pour tous les personnages (il ne s'efface pas après utilisation).",
      "Ne pas tuer le boss avant que tous les personnages aient obtenu l'état Chocomatose (succès Spécial Fou de choco)."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Chronos",
        "strategy": "Vaincre tous les monstres en moins de 9 tours. (Tactique non détaillée dans le guide.)",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/chrono.png"
      },
      {
        "name": "Versatile",
        "strategy": "Les combattants alliés ne doivent utiliser qu'une seule fois une même action pendant leurs tours de jeu. (Tactique non détaillée dans le guide.)",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/versatile.png"
      },
      {
        "name": "Collant",
        "strategy": "Les combattants alliés doivent finir leur tour sur une cellule adjacente à celle d'un autre combattant allié. (Tactique non détaillée dans le guide.)",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/collant.png"
      },
      {
        "name": "Spécial : Fou de choco",
        "strategy": "Tous les combattants doivent entrer dans l'état Chocomatose au moins une fois avant la fin du combat. Marcher dans un glyphe rouge foncé (apparu à la mort d'un monstre) suffit. Le même glyphe peut être utilisé par tous les personnages. ATTENTION : tuer le boss efface les glyphes et l'état définitivement — s'assurer que tous ont obtenu Chocomatose AVANT de tuer le boss.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours. (Tactique non détaillée dans le guide.)",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Torkélonia est un boss invulnérable protégé par une Lunorbe centrale qui projette un glyph
  114: {
    "summary": "Torkélonia est un boss invulnérable protégé par une Lunorbe centrale qui projette un glyphe bleu tournant (cadran lunaire). Pour frapper un ennemi, il faut se placer sur le glyphe bleu et effectuer une ligne de dégâts sur la cible pour lever son invulnérabilité ; à la fin du tour le monstre redevient invulnérable. Le personnage qui tue le boss est éliminé (sauf en Nouvelle Lune ou Pleine Lune, ou via une invocation).",
    "recommendedLevel": "200",
    "composition": "Pandawa tank (tacle + placement du boss) fortement conseillé, accompagné de personnages pouvant frapper fort au càc ou à distance selon la composition d'idoles. Zobal ou Eniripsa en soin/protection utile. Pour le succès Duo : Pandawa + 1 autre classe.",
    "keyResist": [
      "Feu",
      "Eau",
      "Neutre",
      "Terre"
    ],
    "phases": [
      {
        "title": "Cycle lunaire des monstres (mécanique globale)",
        "mechanics": [
          "Chaque tour, tous les monstres gagnent un bonus selon le cycle lunaire en cours (boucle de 8 phases).",
          "Tuer un monstre pendant un cycle transfère le bonus de ce cycle à tous les monstres restants de façon INFINIE.",
          "Nouvelle lune : renvoi de dommages léger autour de l'attaquant (cercle r2) ; si kill → tous les autres ont reconstitution + invulnérable 1 tour.",
          "Premier croissant : dommages subis x80%.",
          "Premier Quartier : 10% résistance.",
          "Gibbeuse montante : +2 PM.",
          "Pleine lune : dommages retournés de 200 ; si kill → tous les autres ont reconstitution + invulnérable 1 tour.",
          "Gibbeuse descendante : +2 PA.",
          "Dernier quartier : +500 PB.",
          "Dernier croissant : dommages finaux +20%.",
          "Ne jamais tuer un monstre lors de Pleine Lune (renvoi) ni Nouvelle Lune (renvoi léger + soin collectif)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/cycles_orig.png",
            "caption": "Tableau des 8 cycles lunaires et leurs effets"
          }
        ]
      },
      {
        "title": "Monstres des salles",
        "mechanics": [
          "Alashasss — Accumulation critique : boost 20% CC + 25 dégâts CC en zone cercle r2 pour 2 tours. Régénération sacrificielle : soigne alliés de 500-1100 en zone cercle r2 et frappe l'ennemi central de 250 feu (3-8PO). Tir de précision : 400 neutre + vol 2PM 1 tour (3-8PO modifiable). Tuer en priorité (soins importants).",
          "Caïguille — Dagyde ensorcelée : 220 neutre + retire 2PM 2 tours + état Cible lunaire 2 tours (2-5PO). Jeu d'aiguilles : 300 eau croix 1 en ligne jusqu'à 7PO + retire 2PA si cible en état Cible lunaire. Prison sanguine : glyphe orange/rouge sous la cible, malus -20% résistance 1 tour + 280 neutre + état insoignable si cible en état Cible lunaire et touche rouge. Tuer en second (retire PM/PA).",
          "Cronnibal — Cronnibalisme : 400 terre vol de vie CàC max 2PO. Rage nocturne : 480 feu triangle base 3 à 1PO + boost mêlée +50% 1 tour. Sauvagerie reptilienne : 400 feu CàC + stacks +20 dégâts base (infini).",
          "Kashkaille — Attirance de l'invisible : 300 terre + attire 5 cases en ligne/diagonale 2-6PO (danger de placement). Poison pétrifiant : poison 35 eau par PA/PM utilisé selon état Cible lunaire ; si pas d'utilisation → téléporte d'une case (2 tours, débuffable). Traquenard reptilien : piège croix 1 de 600 terre + repousse 2 cases (2-5PO).",
          "Voapah — Saut à l'aveugle : 300 air + se téléporte au CàC (2-3PO). Tornade sanglante : 240 air zone CàC. Uppercut brûlant : 380 feu ligne 3 à 1PO."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/accumulation-critique_orig.png",
            "caption": "Schéma sort Accumulation critique (Alashasss)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/prison-sanguine_orig.png",
            "caption": "Schéma glyphe Prison sanguine (Caïguille)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/attirance-de-linvisible_1_orig.png",
            "caption": "Schéma sort Attirance de l'invisible (Kashkaille)"
          }
        ]
      },
      {
        "title": "Combat du boss — Torkélonia et la Lunorbe",
        "mechanics": [
          "La Lunorbe est au centre de la map, invulnérable et indéplaçable ; elle rend tous les monstres et le boss invulnérables.",
          "La Lunorbe projette un glyphe bleu en ligne/diagonale qui tourne dans le sens des aiguilles d'une montre chaque tour (8 positions = 8 cycles lunaires).",
          "Un monstre qui passe sur le glyphe bleu se soigne de 10% de ses PV max.",
          "Pour retirer l'invulnérabilité d'un monstre/boss : se placer sur le glyphe bleu, puis effectuer une ligne de dégâts sur la cible (1re ligne retire l'invulnérabilité sans infliger de dégâts). Frapper tant qu'on est sur le glyphe. En quittant le glyphe ou en fin de tour, l'invulnérabilité est restaurée.",
          "Forcer la rotation du cadran : frapper la Lunorbe en ligne de dégâts fait passer le glyphe à la position suivante (attention aux bonus multi-cycles si on accélère trop).",
          "Tour complet du cadran forcé en moins d'un tour : le glyphe disparaît jusqu'au prochain tour ; la Lunorbe lance Parade lunaire (retire aléatoirement -1PM ou -1PA infini).",
          "Appel de la lune : invoque la Lunorbe au centre + état Protégé d'Ixchélonia (invulnérable infini) sur tous les ennemis.",
          "Carapace lunaire : dommages subis x75% pour 2 tours.",
          "Faisceau lunaire : 600 feu en ligne et diagonale distance infinie.",
          "Goutte lunaire : 600 eau, zone évolutive (carré 1 → croix 1 → cône base 3 en boucle) ; si cible en état Cible lunaire : -10% érosion 1 tour. Ligne/diagonale max 7PO.",
          "Ricochet sacré : 900 eau sur cible + rebondit sur le personnage le plus proche (cercle 5) en chaîne ; si cible en état Cible lunaire : -2PA 1 tour. Max 5PO.",
          "Le personnage qui tue Torkélonia est OS, SAUF si le kill se fait en Nouvelle Lune ou Pleine Lune, ou via une invocation.",
          "Quand Torkélonia meurt, la Lunorbe et le glyphe disparaissent ; les monstres restants deviennent vulnérables."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/cadran_orig.png",
            "caption": "Schéma du cadran lunaire — 8 positions du glyphe bleu"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/invulnerable_orig.jpg",
            "caption": "Comment se placer sur le glyphe pour retirer l'invulnérabilité"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/faisceau-lunaire_orig.png",
            "caption": "Schéma sort Faisceau lunaire (Torkélonia)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/goutte-lunaire_1_orig.png",
            "caption": "Schéma sort Goutte lunaire (Torkélonia)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ricochet-sacre_orig.png",
            "caption": "Schéma sort Ricochet sacré (Torkélonia)"
          }
        ]
      }
    ],
    "tips": [
      "Accès : Île de Crocuzko en [-84,-16]. Avoir terminé la quête \"Perdu dans le temps\" pour accéder à l'île.",
      "Quêtes liées : \"Le sens du sacrifice\" et \"Les totems de Maïmane\".",
      "Recette clef : 2x Viande Goûtue, 1x Salikrone, 1x Quisnoa, 1x Patelle, 2x Bandeau de Voapah, 2x Canine de Cronnibal, 2x Pagne d'Alashasss, 2x Poupée de Caïguille.",
      "Ce boss ne peut pas être capturé.",
      "Ne jamais tuer un monstre en Pleine Lune (renvoi 200) ni en Nouvelle Lune (renvoi léger + soin collectif).",
      "Priorité de kill des monstres : Alashasss (soins) en 1er, Caïguille (vol PM/PA) en 2e, les autres ensuite, Torkélonia idéalement en dernier.",
      "Tuer Torkélonia OS le tueur : préférer le kill en Nouvelle Lune, Pleine Lune, ou via une invocation pour éviter l'OS.",
      "Ne pas taper les monstres à distance si des idoles boostent la puissance CàC (risque de boost monstres).",
      "Poison pétrifiant du Kashkaille est débuffable (ex : Lait de Bambou du Pandawa).",
      "Viser le succès score 200 en même temps que le succès Dernier (compatible)."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Dernier",
        "strategy": "Torkélonia doit être achevée en dernier. Tuer Alashasss en premier (soins), puis Caïguille (vol PA/PM), puis les autres. Utiliser un Pandawa tank pour tacler et garder le boss à distance. Éviter de tuer des monstres lors des cycles Nouvelle Lune ou Pleine Lune. Compatible avec le succès score 200 et le succès Duo.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/dernier.png"
      },
      {
        "name": "Statue",
        "strategy": "Les combattants alliés doivent finir leur tour sur la case de départ tout le combat. Utiliser un Pandawa tank pour tacler et placer Torkélonia. Tuer Torkélonia au tour 4 maximum. Attention au Poison pétrifiant du Kashkaille qui téléporte en fin de tour (débuffer ou utiliser 1PA+1PM pour l'éviter). Si le Pandawa doit détacler : sort Nausée, Varappe ou combo invocation+Éviction. Mourir en tuant Torkélonia (OS) ne fait pas échouer le succès.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/statue.png"
      },
      {
        "name": "Spécial : Lunatique",
        "strategy": "Chaque ennemi doit être achevé en Nouvelle Lune ou Pleine Lune ; la Lunorbe ne doit jamais être utilisée pour accélérer le cycle. Conseillé en butin 4. La Pleine Lune est très difficile (renvoi violent) : viser la Nouvelle Lune. Éliminer un monstre en Nouvelle Lune soigne tous les autres et les rend invulnérables 1 tour (impossible de tuer 2 monstres la même Nouvelle Lune). Éliminer un monstre dès le tour 1 (Alashasss de préférence). Ensuite attendre 8 tours entre chaque kill. Passer les tours à entamer la prochaine cible. Bloquer Torkélonia + 1-2 monstres avec un tank.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages en moins de 40 tours. Pandawa tank + 1 autre classe. Le Pandawa tacle le boss et les 3 monstres à son CàC, sans frapper. L'autre personnage tue les monstres (Alashasss en premier). Placer le Caïguille au CàC du Pandawa pour lui couper la ligne de vue. Tourner autour du cadran pour éliminer les monstres. Tuer Torkélonia en dernier.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Le Kharnozor est le boss du Repaire du Kharnozor, entouré de Dragoss élémentaires dont la 
  115: {
    "summary": "Le Kharnozor est le boss du Repaire du Kharnozor, entouré de Dragoss élémentaires dont la mort booste les résistances des alliés (Don osseux). La stratégie clé est d'éviter de rester à moins de 2PO du boss (contre-attaque Mort Sûre) et de gérer l'ordre des kills pour ne pas surbooster le boss.",
    "recommendedLevel": "~100",
    "composition": "Équipe polyvalente capable de gérer plusieurs éléments et le buff Don osseux.",
    "keyResist": [
      "Variable (voir résistances)"
    ],
    "phases": [
      {
        "title": "Salles normales — Dragoss élémentaires",
        "mechanics": [
          "Don osseux : à la mort d'un Dragoss, tous les ennemis reçoivent +5% de résistance dans l'élément du défunt (infini et cumulable).",
          "Dragoss Ardoise (eau) : Eauzone (70 eau, zone ligne perp. 3, attire 2), Fumerolle (80 eau, zone carré 3, +1PA alliés proches 2 tours), Offrande Aqueuse (50 eau, croix 1, 4-10PO).",
          "Dragoss Argile (air) : Dragoss Inoum (40 air, retire 2PO cible 1 tour), Dragoss Tidkaliss (80 air, téléporte cible en symétrie, +2PM ennemis autour de l'arrivée), Offrande Aérienne (50 air, croix 1, 4-10PO).",
          "Dragoss Calcaire (terre) : Dragoss Pelle (60 terre, zone cercle R2, repousse 2), Offrande Rocailleuse (40 terre, croix 1, 4-10PO), Transmission sismique (50 terre, retire 1PM esquivable).",
          "Dragoss Charbon (feu) : Cirque Enflammé (glyphe à 2PO, 70 feu si on passe dessus), Combustion (90 feu, ligne 3, càc), Offrande Ardente (80 feu, croix 1, 4-10PO).",
          "Dragoss Protéiforme : prend l'apparence d'un allié via Caméléomanie, change d'élément. Engouement (150 var., boost alliés 50 stat 1 tour), Hyoïde (140 var., cercle R2, ligne 8PO, dégâts augmentent de 5 par lancer).",
          "Mort d'un Dragoss Protéiforme : boost de 200 dans la stat correspondant à son apparence actuelle."
        ]
      },
      {
        "title": "Combat du Boss — Kharnozor",
        "mechanics": [
          "Kharnozor est indéplaçable (infini).",
          "Kharnage : pose les états indéplaçable (infini) et Réflexe Primitif (infini) sur la cible.",
          "Cri déchirant : 60 air, zone cercle R7 autour de lui, retire 3PA esquivable, applique l'état Assourdi 1 tour.",
          "Emplafonnement : 350 neutre en ligne jusqu'à 6PO, s'attire sur la cible et la repousse de 6 cases.",
          "Mort Sûre : 350 terre au càc ; si la cible est Assourdie, applique aussi Insoignable + Pesanteur 2 tours.",
          "Danger zone 2PO : frapper le boss depuis moins de 2PO vous attire à son càc et déclenche Mort Sûre pour chaque coup reçu — toujours attaquer depuis 3PO minimum.",
          "À chaque mort de monstre : le Kharnozor gagne +710 vitalité et +10% de dommages finaux occasionnés (infini, cumulable)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/cri-dechirant_orig.png",
            "caption": "Zone du Cri déchirant (cercle R7)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/emplafonnement_orig.png",
            "caption": "Zone et effet d'Emplafonnement"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/mort-sure_orig.png",
            "caption": "Zone et effet de Mort Sûre"
          }
        ]
      }
    ],
    "tips": [
      "Entrée du donjon : Village des Dragoeufs en [-3,25].",
      "Recette clef : 2x Coquille de Dragoss Calcaire, 2x Coquille de Dragoss Argile, 2x Coquille de Dragoss Charbon, 2x Coquille de Dragoss Ardoise, 2x Viande Exsudative, 2x Anguille, 2x Edelweiss, 2x Seigle.",
      "Pierre d'âme de puissance 100 minimum pour capturer le Kharnozor.",
      "Ne jamais attaquer le boss depuis moins de 3PO pour éviter le déclenchement de Mort Sûre.",
      "Gérer l'ordre de kill des Dragoss avec soin : chaque mort booste les résistances et les dégâts du boss.",
      "Quête liée : Tour d'honneur."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Dernier",
        "strategy": "Le Kharnozor doit être achevé en dernier.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/dernier.png"
      },
      {
        "name": "Circulez !",
        "strategy": "Ne pas tenter de retirer de PM aux adversaires pendant toute la durée du combat.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/circulez.png"
      },
      {
        "name": "Les yeux aussi gros que le ventre",
        "strategy": "Les ennemis doivent avoir au moins un allié en ligne de vue au début de leur tour. Faire attention aux obstacles de la map et toujours finir en ligne de vue.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Draegnerys est le boss de l'Épreuve de Draegnerys, sur la Presqu'île des Dragoeufs
  116: {
    "summary": "Draegnerys est le boss de l'Épreuve de Draegnerys, sur la Presqu'île des Dragoeufs. Il invoque des Dragoeufs à chaque tour et booste ses alliés. La stratégie repose sur la gestion des états Audacieux (tour 1) et Intrépide (tour 4) que gagnent tous les monstres du donjon.",
    "recommendedLevel": "Variable",
    "composition": "Non précisé dans le guide.",
    "keyResist": [
      "Feu"
    ],
    "phases": [
      {
        "title": "Monstres du donjon — états Audacieux et Intrépide",
        "mechanics": [
          "Tour 1 : tous les monstres gagnent l'état Audacieux (infini) : +3 PA, +2 PM, +50 puissance, +200 vitalité.",
          "Tour 4 : tous les monstres gagnent l'état Intrépide (infini) : +6 PA, +4 PM, +100 puissance, +200 vitalité, changement d'apparence.",
          "Certains sorts ont des effets supplémentaires sous l'état Intrépide.",
          "Dralbatre (air) — Ronde élémentaire : boost un allié de 100 puissance pour 1 tour (rotation entre alliés). Dralbatre : poisson 11-15 dégâts air en croix taille 1, retire 2 PA esquivable (3-11 PO).",
          "Dragloméra — Frappe du 50 dans chaque élément (10 terre + 5 feu + 15 air + 15 eau environ), 3-10 PO.",
          "Dragoeuf Ardoise (eau) — Feuilletage : 80 eau en ligne jusqu'à 6 PO, augmente les dégâts de base du sort de 5 pour 1 tour. Fendage : 80 eau jusqu'à 5 PO ; en état Intrépide vole 100 (150 CC) chance pour 1 tour.",
          "Dragoeuf Argile (air) — Cataplasme : boost alliés au càc de 2 PM et frappe ennemis au càc de 50 air ; en état Intrépide vole 50 agilité pour 2 tours. Engobage : 100 air au càc.",
          "Dragoeuf Calcaire (terre) — Entartrage : 60 terre en croix taille 1 jusqu'à 5 PO ; en état Intrépide se boost de 2 PA pour 1 tour.",
          "Dragoeuf Charbon (feu) — Silicose : 50 feu, 3-10 PO ; en état Intrépide retire 1 PO pour 1 tour et gagne 3 PO supplémentaires. Crassier : 50 feu jusqu'à 10 PO."
        ]
      },
      {
        "title": "Boss — Draegnerys",
        "mechanics": [
          "Pépinière : invoque deux Dragoeufs au tour 1 puis un Dragoeuf tous les 2 tours.",
          "Drakaaris : 50 dégâts feu, portée jusqu'à 10 PO.",
          "Knout : 90 dégâts feu + repousse de 2 cases, portée jusqu'à 5 PO.",
          "Somatotropine : boost un allié de 2 PA, 2 PM, +150 vitalité et +200 puissance pour 2 tours (portée 6 PO).",
          "Les invocations de Dragoeufs s'accumulent rapidement — il est important de gérer les invocations avant qu'elles ne passent en état Intrépide."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/drakaaris_orig.png",
            "caption": "Drakaaris — portée et zone d'effet"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/knout_orig.png",
            "caption": "Knout — portée et zone d'effet"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/somatotropine_orig.png",
            "caption": "Somatotropine — portée et zone d'effet"
          }
        ]
      }
    ],
    "tips": [
      "Position du donjon : Presqu'île des Dragoeufs en [-4,29].",
      "Quête liée : C'est radical ici.",
      "Recette de la clef : 2x Coquille de Dragoeuf Calcaire, 2x Coquille de Dragoeuf Argile, 2x Coquille de Dragoeuf Charbon, 2x Coquille de Dragoeuf Ardoise, 2x Viande Avariée, 2x Sardine Brillante, 3x Menthe Sauvage, 3x Houblon.",
      "Pierre d'âme de puissance 100 minimum pour capturer le boss.",
      "La capture de l'âme de Draegnerys est utile pour la quête du Dofus Émeraude : « Le voleur d'âmes ».",
      "Les états Audacieux et Intrépide renforcent considérablement les monstres — agir vite avant le tour 4 est conseillé."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Focus",
        "strategy": "Lorsqu'un ennemi est attaqué par un allié, il doit être achevé avant qu'un autre ennemi ne soit attaqué.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/focus.png"
      },
      {
        "name": "Hardi",
        "strategy": "Les combattants alliés doivent finir leur tour sur une cellule adjacente à celle d'un ennemi.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/hardi.png"
      },
      {
        "name": "Spécial : Sortir de sa coquille",
        "strategy": "Les ennemis ne doivent être achevés que lorsqu'au moins l'un d'eux se trouve dans l'état Intrépide. Seuls les Dragoeufs Argile, Ardoise, Charbon et Calcaire peuvent atteindre l'état Intrépide (après 4 à 6 tours). Attendre qu'au moins un Dragoeuf soit dans cet état avant d'achever les ennemis.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Corruption est le boss de l’Arbre de mort, monté sur une monture qui applique un poison cu
  117: {
    "summary": "Corruption est le boss de l’Arbre de mort, monté sur une monture qui applique un poison cumulable (« Kissiphrot Sipique ») à chaque dégât infligé. La stratégie centrale consiste à soigner un allié au corps à corps de chaque monstre pour retirer cet état, gérer les 9 maladies de Corruption, et tuer les monstres avant de focus le boss une fois qu’il est délocké de sa monture.",
    "recommendedLevel": "200",
    "composition": "Prévoir au minimum une classe capable de soigner (vol de vie ou soins directs) ; un tank qui garde l’état « Peau Pourrissante » est recommandé pour absorber les maladies. Un gros damage dealer à distance facilite les succès.",
    "keyResist": [
      "Variable (voir résistances)"
    ],
    "phases": [
      {
        "title": "Mécaniques générales du donjon — maladies et Corruption",
        "mechanics": [
          "État Peau Pourrissante : appliqué dès le début du combat sur chaque personnage/invocation. Poison de 190–265 dégâts feu fixes à chaque début de tour, réduit les dégâts infligés de 90 %, et retire 10 % des PV actuels à chaque fin de tour (dès le tour 2). Pour le retirer : recevoir un effet de soin (le vol de vie fonctionne).",
          "9 maladies cumulables (« Corruption 1/2/3 » puis « Phase Germinal ») contractées via retrait PA/PM/PO ou sorts de monstres. Corruption 1 : soins ×80 %, dégâts subis ×125 %, 10 % érosion. Corruption 2 : soins ×60 %, dégâts ×150 %, 20 % érosion. Corruption 3 : soins ×40 %, dégâts ×175 %, 30 % érosion. Phase Germinal : soins ×20 %, dégâts ×200 %, 40 % érosion + transformation en Germinial qui attaque alliés et ennemis.",
          "Retirer une maladie : 3 soins sur le personnage malade (le vol de vie fonctionne). Si plusieurs maladies, chaque soin réduit chaque maladie d’un niveau.",
          "Kissiphrot Sipique : état présent sur tous les monstres et Corruption. Chaque ligne de dégâts infligée à un ennemi porteur de cet état déclenche un poison de ~1 400 dégâts terre cumulable (fin de tour). Pour retirer : soigner un allié ou une invocation au corps à corps du monstre ciblé (les monstres adjacents sont repoussés de 1 case). Une fois retiré sur un monstre, c’est permanent pour lui. Sur Corruption : retiré seulement 3 tours, puis il remonte sur sa monture et remet l’état à tous ses alliés encore en vie."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj7-etats-corruption_orig.png",
            "caption": "Tableau des niveaux de Corruption et leurs malus"
          }
        ]
      },
      {
        "title": "Salles de monstres (avant le boss)",
        "mechanics": [
          "Dolid : réplique aux dégâts en mêlée (se repousse + retire 2 PM à l’attaquant). Tétanysme : 480 eau zone croix 1, applique Tétanyte (dégâts si déplacé). Germintaïde : 300 air + soigne alliés rayon 2 de 350 PV.",
          "Gangredogue : Gangraine applique Gangrainyte (poison terre 377–443 par tour, malus soins 200, propagation autour). Tir Purulent : soigne ses alliés ou frappe 300 eau zone croix 2.",
          "Nheur’Gueule (priorité haute) : Brutalysme vol de vie feu + Brutalyte (dégâts à vos alliés dans rayon 3 à chaque sort de frappe). Tourbe Ylol 350 terre zone carré 3 + Péhatyte. Invoque des Germinions.",
          "Pistilangue : Flemingysme applique Flemingyte (−30 tacle, −960 PV, −35 % crit, −250 puissance). Sort Sacrifice sur ses alliés ; si le Pistilangue garde Kissiphrot Sipique et que sa cible sacrifiée est frappée, le poison se déclenche tout de même.",
          "Tentaclaque : Parasitysme échange votre position symétriquement + Parasityte (poison feu). Ponction Lombric : vol de vie eau + retire 3 PM + Péhaimyte."
        ]
      },
      {
        "title": "Combat contre Corruption (phase monté)",
        "mechanics": [
          "Aura du Destrier Purulent : active Kissiphrot Sipique sur lui et tous ses alliés dès le début du combat.",
          "Bêche Corrompue : 600 feu zone ligne 3 + retire 3 PA esquivables (4 en cc) + réduit durée des effets. Lançable 3 fois par tour en ligne jusqu’à 2 PO.",
          "Bombe Bactériologique : boost un allié de 660 PB + lui applique une maladie aléatoire ; à la fin du tour de ce monstre, explosion cercle rayon 3, 550 terre, propage la maladie. Lançable 1 fois par tour de 6 à 20 PO.",
          "Bouillon de culture : glyphe violet rayon 3 autour de lui ; entrer dans le glyphe inflige ~300 dégâts (150 eau + 150 air) et applique une maladie aléatoire. Éviter d’y entrer ; si nécessaire, utiliser un personnage encore sous Peau Pourrissante.",
          "Convalescence Prolifique : 400 air + repousse 2 cases, jusqu’à 10 PO, 3 fois/tour.",
          "Incu-Batteur : 500 eau + effet retour à la position précédente à chaque dégât reçu pour 1 tour."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj7-bombe-bacteriologique-monture_orig.png",
            "caption": "Portée de Bombe Bactériologique (Corruption monté)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj7-bouillon-de-culture_orig.png",
            "caption": "Zone du glyphe Bouillon de culture"
          }
        ]
      },
      {
        "title": "Combat contre Corruption (phase délocké — 3 tours)",
        "mechanics": [
          "Délock : soigner une entité au corps à corps de Corruption retire Kissiphrot Sipique et le fait descendre de sa monture pour 3 tours. Après 3 tours il remonte et remet l’état sur tous ses alliés survivants.",
          "Liquéfaction : 350 eau + 50 % de chance de maladie aléatoire + échange de place. Sans LdV, 4 fois/tour de 2 à 14 PO.",
          "Putéfaction : 700 feu de 3 à 10 PO, relance 3 tours.",
          "Éclosion germinal : 350 neutre cercle rayon 2 + malus 200 puissance (300 cc) + boost alliés ~350 PB. 1 fois/tour de 2 à 5 PO.",
          "Bombe Bactériologique (version délock) : portée réduite à 6 PO max, 2 fois/tour.",
          "Conseil : ne pas laisser passer plus de 3 tours sans le tuer, sinon il remonte sur sa monture. Mettre Corruption en état Pesanteur pour éviter les échanges de place. Utiliser une invocation pour retirer Kissiphrot Sipique afin de ne pas entrer dans le glyphe."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj7-liquefaction_orig.png",
            "caption": "Portée et zone de Liqéfaction"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj7-putrefaction_orig.png",
            "caption": "Portée de Putéfaction"
          }
        ]
      }
    ],
    "tips": [
      "Accès : entrée dans le Royaume Corrompu en [4,0]. Zaap Arche de Vili en [15,-20], accessible via la faille dans la Mine Hable en [10,-19].",
      "Recette de la clef : 1 Perce-Neige, 1 Poisskaille, 2 Frostiz, 2 Viande Goûtue, 2 Peau pourrie de Dolid, 2 Patte de Nheur’Gueule, 2 Tentacule de Tentaclaque, 2 Pétale de Gangredogue.",
      "Corruption ne peut pas être capturé.",
      "Garder l’état Peau Pourrissante sur les personnages tank/non-attaquants pour les protéger des maladies.",
      "Ne pas soigner les tanks en début de combat pour qu’ils conservent la Peau Pourrissante et restent immunes aux maladies.",
      "Le vol de vie fonctionne comme soin (retire Peau Pourrissante et les maladies).",
      "Priorités : tuer en premier le Nheur’Gueule (Brutalyte), puis le Dolid (Tétanyte), puis le Pistilangue (Flemingyte + Sacrifice).",
      "Attendre que tous les monstres soient morts avant de délocker Corruption.",
      "Quêtes liées : Mort et renouveau ; Les totems de Maïmane."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Collant",
        "strategy": "Tous les combattants alliés doivent finir leur tour sur une cellule adjacente à celle d’un autre allié. Utiliser une invocation pour retirer Kissiphrot Sipique des monstres (sans s’en approcher). Si un personnage a la Brutalyte, le soigner en priorité et le écarter provisoirement avant de frapper (puis se replaquer).",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/collant.png"
      },
      {
        "name": "Mains Propres",
        "strategy": "Achever tous les ennemis uniquement avec des dégâts indirects (poisons, invocations, dégâts de poussée, pièges, glyphes, renvois). Les Dofus Ébène peuvent aider. Soigner les invocations dès leur invocation pour retirer leur Peau Pourrissante. Depuis un correctif, les poisons déclenchent aussi Kissiphrot Sipique.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/mains-propres.png"
      },
      {
        "name": "Spécial : Immunité collective",
        "strategy": "Seuls les combattants sans maladie peuvent infliger des dégâts. Un tank garde la Peau Pourrissante (immune aux maladies) pour tacler les monstres. Les attaquants doivent être soignés 3 fois par maladie contractée avant de pouvoir retaper. Soigner une entité au contact de Corruption pour retirer Kissiphrot Sipique.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages en moins de 40 tours. Conseillé : classe de soin + gros damage dealer à distance. Utiliser une invocation pour retirer Kissiphrot Sipique. Commencer par le Nheur’Gueule, se cacher derrière les obstacles (cases gauche de la map). Alternative : Pandawa tank + Roublard (mur de bombes, Corruption dans le mur).",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Servitude est le boss du donjon Fers de la Tyrannie, le plus difficile des 4 Cavaliers de 
  118: {
    "summary": "Servitude est le boss du donjon Fers de la Tyrannie, le plus difficile des 4 Cavaliers de l'Eliocalyse. Il invoque régulièrement des Armécréantes et renvoie 200% des dégâts subis, sauf si les joueurs possèdent l'état Traître (obtenu en finissant son tour sur ses glyphes blancs). Il passe par 3 phases dont une phase finale où il se soigne de 25% de ses PV.",
    "recommendedLevel": "200",
    "composition": "Pandawa (insoignable, pesanteur, stabilisation), Féca (protections contre le renvoi), Eliotrope (placement et portails), Iop (damage dealer). Un Zobal peut remplacer le Pandawa pour appliquer l'état Insoignable.",
    "keyResist": [
      "Eau",
      "Terre"
    ],
    "phases": [
      {
        "title": "Phase 1 — Préparation et gestion des Armécréantes (jusqu'à 50% PV)",
        "mechanics": [
          "Servitude invoque une Armécréante tous les tours impairs à partir du tour 1, jusqu'à 4 Armécréantes en vie maximum.",
          "Esclavagisme : invoque une Armécréante à 2PO de lui (relance 2 tours).",
          "Asservissement : attire la cible de 9 cases en ligne (2 à 10PO), Servitude gagne 100 de tacle (1 tour).",
          "Joug Protecteur : inflige 700 dégâts eau et applique 1 000 de bouclier (infini) et 1PM à l'allié le plus proche de la cible.",
          "Tyrannie : inflige 900 dégâts eau et retire 1PA dans un cercle de rayon 2 autour de lui (lançable 1 fois/tour).",
          "Trahison : Servitude cible un personnage ayant l'état Traître, l'attire et le force à taper son allié le plus proche dans un élément aléatoire.",
          "Servitude renvoie 200% des dégâts reçus (hors poisons) ; pour éviter le renvoi, avoir l'état Traître.",
          "L'état Traître s'obtient en finissant son tour sur un glyphe blanc posé par Servitude ; s'incrémente en tapant un allié (max 5 niveaux).",
          "Chaque ligne de dégâts sur Servitude consomme un niveau de Traître.",
          "Alternative : les sorts Féca (Bastion, Barricade, Ataraxie) permettent de taper Servitude sans état Traître.",
          "Priorité d'élimination des monstres : Ecaptif (dangereux au tour 4), puis Gentyran, Boularbin, Tambourreau (laisser pour la fin).",
          "Taper chaque Armécréante au moins une fois par tour pour retirer l'état Appel des renforts et empêcher l'invocation des Iopprimés."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj9-invocation-armecreantefixed1_orig.png",
            "caption": "Positions d'invocation des Armécréantes autour de Servitude (sens horaire)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj9-glyphe-traitrefixed1_orig.jpg",
            "caption": "Glyphes blancs de Traître posés par Servitude"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj9-etats-de-traitrefixed1_orig.jpg",
            "caption": "Tableau des états de Trahison et effet sur le renvoi de Servitude"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj9-esclavagismefixed1_orig.png",
            "caption": "Schéma du sort Esclavagisme et positionnement Armécréante"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj9-servitudefixed1_orig.png",
            "caption": "Résistances et caractéristiques de Servitude"
          }
        ]
      },
      {
        "title": "Phase 2 — Servitude monte sur sa monture (de 50% à 1 PV)",
        "mechanics": [
          "À 50% de ses PV, Servitude monte sur sa monture et gagne des effets supplémentaires sur ses sorts.",
          "Asservissement (phase 2) : vole 1PM à la cible (1 tour) et inflige 650 dégâts air en plus de l'attraction.",
          "Joug Protecteur (phase 2) : Servitude gagne lui-même 1 000 points de bouclier et 1PM en plus de l'effet normal.",
          "Tyrannie (phase 2) : peut viser une Armécréante pour qu'elle échange de place avec le personnage le plus proche de Servitude.",
          "Trahison (phase 2) : utilisé sur TOUS les personnages ayant l'état Traître simultanément.",
          "Servitude risque d'avoir 1 000 points de bouclier à chaque tour.",
          "Continuer à gérer les Armécréantes, préparer l'état Insoignable avant de le passer en phase 3.",
          "Appliquer un poison (ébène ou autre) avant de le passer à 1 PV pour qu'il meure au début de son tour."
        ]
      },
      {
        "title": "Phase 3 — Rollback à 1 PV",
        "mechanics": [
          "Quand Servitude tombe à 1 PV, il rollback toutes les entités à leur position de début de combat et se soigne de 25% de ses PV.",
          "Si l'état Insoignable a été appliqué avant 1 PV, il ne récupère pas les 25% et mourra seul au début de son tour grâce au poison.",
          "Sans Insoignable : il récupère 25% de ses PV, reprendre le focus de la même manière qu'en phase 1/2.",
          "Les poisons ne sont pas affectés par le renvoi de dégâts et peuvent être appliqués sans état Traître."
        ]
      }
    ],
    "tips": [
      "Accès : entrée dans la zone Galère de Servitude en [4,-3]. Zone des 4 Cavaliers accessible via le zaap Arche de Vili en [15,-20] (faille dans la Mine Hable en [10,-19]).",
      "Recette de la clef : 1 Perce-Neige, 1 Poisskaille, 1 Frostiz, 2 Viande Goûtue, 2 Baguette Rythmique, 2 Bois de pagaie usée, 2 Manche de Fouet, 2 Boulet lesté.",
      "Quêtes liées : Briser ses chaînes, Les totems de Maïmane.",
      "Le boss ne peut pas être capturé.",
      "Plus le combat est fait en butin élevé (6, 7 ou 8), plus il est facile : Servitude invoque le même nombre d'Armécréantes quelle que soit la taille du groupe.",
      "Équiper un Dofus Nébuleux pour achever les Armécréantes rapidement (invoquées aux tours impairs).",
      "Les Armécréantes ont 15% de résistance eau — privilégier l'élément eau ou terre pour les éliminer.",
      "Utiliser les états Pesanteur, Enraciné ou Indéplaçable pour empêcher le rollback de l'Armécréante.",
      "Le Tambourreau booste ses alliés selon son % de PV (Décadance) — l'ignorer ou l'éliminer très rapidement dès qu'on l'attaque.",
      "Ne jamais utiliser son dernier état Traître sans avoir un glyphe à portée pour le réobtenir.",
      "L'Ecaptif gagne 3PM et 100% de dommages au tour 4 — à éliminer en priorité avant.",
      "Le sort Renfortiche du Boularbin donne 100% résistances à un allié à bas PV — taper le Boularbin 3 fois pour l'annuler.",
      "Servitude Terre a seulement 15% de résistance terre — préférable pour le succès Spécial.",
      "Servitude Eau a seulement 15% de résistance eau pour les Armécréantes."
    ],
    "rewards": [
      "Pierre d'âme de Servitude (boss non capturable, donc pas de pierre d'âme classique).",
      "Drops des monstres du donjon : Armécréante, Iopprimé, Boularbin, Ecaptif, Gentyran, Tambourreau."
    ],
    "achievements": [
      {
        "name": "Focus",
        "strategy": "Lorsqu'un ennemi est attaqué par un allié, il doit être achevé avant qu'un autre ennemi ne soit attaqué. Éliminer les Armécréantes via Djim (invulnérable tant que non poussé) pour ne pas rompre le focus. Ordre : Ecaptif → Gentyran → Boularbin → Tambourreau → Armécréantes restantes → Servitude. Finir Servitude pendant un tour pair (pas d'Armécréante). Composition conseillée : Eliotrope + Iop + Féca. Appliquer Insoignable + poison avant de passer en phase 3.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/focus.png"
      },
      {
        "name": "Versatile",
        "strategy": "Les combattants alliés ne doivent utiliser qu'une seule fois une même action pendant leurs tours de jeu. Reprendre la stratégie globale. Avec un Pandawa : ne pas utiliser Karcham 2 fois par tour ni Picole ; utiliser Cascade, Vertige, Eau de vie ou Propulsion pour les placements.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/versatile.png"
      },
      {
        "name": "Spécial : Bain de foule",
        "strategy": "Les alliés ne doivent pas achever les Armécréantes invoquées. Taper chaque Armécréante pour retirer l'état Appel des renforts mais sans la tuer. Éliminer Servitude rapidement (idéalement avant le tour 8) pour éviter l'envahissement. Privilégier l'élément terre (15% résistance). Un Féca permet d'éviter les états Traître. Composition Eliotrope, Roublard ou Sram conseillée pour détruire Servitude rapidement.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum en moins de 40 tours. Composition recommandée Sram Terre/Réseau + Féca Tank : poser un réseau de pièges mortels/répulsifs/sournois d'un côté de la map, repousser les monstres avec Tension, OS Servitude au tour 5 ou 7 en le poussant dans le réseau (Domakuro + Nébuleux + cape Jahash Jurgen conseillés). Alternative Eliotrope + Iop : utiliser les portails pour éliminer 3-4 monstres dès le tour 2, boucle de portails pour gérer les Armécréantes et phases de Servitude. Schémas de placement de portails disponibles ci-contre.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Misere est le boss du donjon Sentence de la Balance, une cavaliere a deux phases : sans mo
  119: {
    "summary": "Misere est le boss du donjon Sentence de la Balance, une cavaliere a deux phases : sans monture (phase 1, PV > 50%) puis sur son vautour (phase 2, PV < 50%). La strategie cle est de tuer tous les Misereux en premier pour empecher Misere de se boost massivement via le mecanisme Collecte, puis de la finir rapidement en phase 2 avant qu'elle ne vole toute la puissance de l'equipe.",
    "recommendedLevel": "200",
    "composition": "Equipe eau recommandee (Misere faible a l'eau). Pandawa tank tres utile pour porter des allies hors de portee d'attraction et bloquer Misere. Classes distance conseillee pour garder Misere hors de portee de Balance-Fleau (6 PO, en ligne).",
    "keyResist": [
      "Eau"
    ],
    "phases": [
      {
        "title": "Salles du donjon — Monstres Misereux",
        "mechanics": [
          "Thesaurisation : tout retrait de PA/PM/PO sur un monstre lui donne 10 Esquive PA/PM pour 2 tours (cumulable) — ne pas tenter les retraits.",
          "Faim du Monde : chaque monstre gagne 4 PM par tour via Charognard, SAUF si une Charogne est a 4 PO ou moins de lui a son debut de tour.",
          "Etat Collecte : un monstre entre en Collecte des qu'il vole des stats. Misere lui vole ensuite ces stats en LDV a son debut de tour.",
          "Dawaj — Fouet Gadderfi : 150 feu, repousse 2 cases + attire 4, vole 15% critique (cumulable infini), ligne 5 PO (x3/tour).",
          "Dawaj — Sol Aride : 200 terre vol de vie, ligne 6, vole 200 force (infini), cac seulement (x1/tour).",
          "Desosseur — Desossage : 300 eau, vole 1 PM (infini), max 2 PO (x2/tour).",
          "Desosseur — Souffle du Desert : se teleporte au cac, 150 air vol de vie, vole 200 agilite, max 3 PO sans LDV (x3/tour).",
          "Ferrailleur — Assembricolage : boost allies +650 PB environ pour 2 tours (rayon 2, cumul max 2, relance 3 tours).",
          "Ferrailleur — Demantelement : 300 neutre au cac, retire 350 PV + gagne 650 PV (infini), x2/tour.",
          "Ferrailleur — Terminal Gris : 200 neutre vol de vie, attire 4 cases, vole 50 dommages (infini), ligne 5 PO (x3/tour).",
          "Krevladal — Crache-Misere : 200 eau vol de vie, croix T1, vole 200 chance (infini), max 3 PO (x3/tour).",
          "Krevladal — Pouilleux Massacreur : 100 feu, vole 1 PA (infini), cac (x2/tour).",
          "Skentu — Balle Vorace : 250 feu vol de vie, vole 200 intelligence (infini), 3-8 PO modifiable (x3/tour).",
          "Skentu — Bantha : 200 air, ligne perpendiculaire T3, repousse 1, cac (x1/tour).",
          "Skentu — Grenade Aveuglante : 400 feu, croix T1, vole 2 PO (infini), 3-8 PO sans LDV (x1/tour).",
          "Priorite de kill : Ferrailleur (dommages + vole PV) > Krevladal (vole PA/chance) > Desosseur. Tuer rapidement le Skentu si equipe > 4 personnages (vole intelligence, fait tres vite d'enormes degats)."
        ]
      },
      {
        "title": "Boss — Misere Phase 1 (PV > 50%, sans monture)",
        "mechanics": [
          "Attraction Venale (passif) : en debut de tour ET a chaque ligne de degats recue, attire toutes les entites vers elle (1 case au-dessus de 75% PV, 2 cases de 75% a 50%).",
          "Balance-Fleau : 1000 degats tous elements sauf neutre, demi-cercle rayon 2, vole 200 puissance (infini, cumul max 5 = 1 000 puissance max), ligne max 6 PO (x2/tour).",
          "Barchan : 600 eau, malus -100 soins et -50% soins recus pour 1 tour, max 6 PO (x3/tour).",
          "Dakhma (phase 1 uniquement) : 600 feu, retire 100 PA/PM a la cible, la rend invulnerable 1 tour et la teleporte a sa position de debut de tour. Annulable en tapant l'allie affecte (flamiche par exemple). Max 2 PO, relance 2 tours.",
          "Mecanisme Collecte : en debut de tour, si un Misereux en Collecte est dans sa LDV, Misere lui vole ses stats accumulees (Ferrailleur : 10% PV max + 50 dommages ; Dawaj : 15% crit + 200 force ; Desosseur : 1 PM + 200 agi ; Krevladal : 1 PA + 200 chance ; Skentu : 2 PO + 200 intel). Les boosts restent sur Misere jusqu'a la mort du monstre.",
          "Strategie phase 1 : se placer derriere des obstacles, repousser Misere chaque tour. Rester a > 6 PO d'elle pour eviter Balance-Fleau (ligne LDV). Astuce Pandawa : porter un allie pour eviter les retraits de placement lies a l'attirance."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj6-placement-attirances_orig.png",
            "caption": "Placement recommande pour eviter Misere en phase 1 — equipe en rouge derriere obstacles, Misere en bleu repoussee chaque tour"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj6-balance-fleau-fixed_orig.png",
            "caption": "Zone d'effet de Balance-Fleau (demi-cercle rayon 2, ligne)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj6-dakhma_orig.png",
            "caption": "Zone d'effet de Dakhma (max 2 PO)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj6-barchan_orig.png",
            "caption": "Zone d'effet de Barchan (max 6 PO)"
          }
        ]
      },
      {
        "title": "Boss — Misere Phase 2 (PV < 50%, sur sa monture)",
        "mechanics": [
          "Passage de phase : quand Misere atteint 50% PV, elle monte sur son vautour, devient invulnerable 1 tour entier (jusqu'au tour du personnage qui l'a fait passer), gagne 4 PM (total 10 PM) et l'etat Intaclable definitif.",
          "Funerailles Celestes : 600 air + echange de place avec la cible, degats air sur entites a 2 PO de la case d'origine (attire 2 cases) ; degats terre sur entites a 2 PO de la case d'arrivee (repousse 2 cases). 4-8 PO sans LDV, relance 3 tours.",
          "Grand Urubu : 500 neutre, retire 150 resistances poussee pour 2 tours, repousse 6 cases (8 en cc). Ligne max 2 PO, relance 2 tours.",
          "Attraction Venale (suite) : 3 cases de 49% a 25% PV, 4 cases en dessous de 25% PV.",
          "Charognes : a chaque mort d'entite, une charogne (320 PV) apparait sur sa case. Un monstre a 4 PO se soigne de 1 200 PV par charogne. Misere detruit TOUTES les charognes a son debut de tour et gagne 880 bouclier par charogne. Tuer les charognes proches de Misere avant son tour.",
          "Strategie phase 2 : tuer Misere le plus vite possible. Se placer a > 8 PO d'elle pour eviter Funerailles Celestes (portee 4-8 PO). Apres sa cooperation, 3 tours disponibles avant sa relance."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj6-funerailles-celestes_orig.png",
            "caption": "Zone d'effet de Funerailles Celestes (echange de place, 4-8 PO sans LDV)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj6-grand-urubu-fixed_orig.png",
            "caption": "Zone d'effet de Grand Urubu (repousse 6 cases, ligne max 2 PO)"
          }
        ]
      }
    ],
    "tips": [
      "Acces : entree du donjon dans la zone Desert de Misere en [1,0]. Acces aux zones des 4 Cavaliers par le zaap Arche de Vili en [15,-20], accessible via la faille dans la Mine Hable en [10,-19].",
      "Recette de la clef : 1 Perce-Neige, 1 Poisskaille, 1 Frostiz, 2 Viande Goutue, 2 Capuche de Skentu, 2 Oeil de Dawaj, 2 Cotes de Desosseur, 2 Langue de Krevladal.",
      "Ce boss ne peut pas etre capture.",
      "Ne jamais tenter de retirer des PA/PM/PO sur les monstres (Thesaurisation : +10 Esquive PA/PM cumulable).",
      "Tuer les monstres AVANT de s'attaquer a Misere : chaque monstre vivant lui transfere ses stats volees, la rendant exponentiellement plus forte.",
      "Balance-Fleau vole 200 puissance et est lance 2x/tour en ligne LDV max 6 PO — rester hors de cette portee ou hors LDV.",
      "Element eau recommande contre Misere (moins de resistances eau).",
      "Placer les personnages derriere des obstacles pour limiter l'attraction de Misere (a chaque debut de tour et a chaque ligne de degats infliges).",
      "En phase 2 : rester a > 8 PO de Misere pour eviter Funerailles Celestes. Apres sa cooperation, 3 tours pour la tuer avant sa relance.",
      "Pandawa : porter un allie l'immunise contre l'attraction et Funerailles Celestes."
    ],
    "rewards": [
      "Pierre d'ame : Misere ne peut pas etre capturee."
    ],
    "achievements": [
      {
        "name": "Hardi",
        "strategy": "Les combattants allies doivent finir leur tour adjacent a un ennemi. Strategie 1 (recommandee) : tuer Misere en premier avec team full eau + Pandawa tank, la passer en phase 2 fin du tour 1 et la tuer au tour 3. Strategie 2 : bloquer Misere dans un coin avec des monstres tacls (Pandawa env. 150 tacle) pour que Balance-Fleau soit inoperant (hors ligne). Strategie 3 : tuer Misere en dernier en utilisant des charognes d'invocations pour respecter Hardi.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/hardi.png"
      },
      {
        "name": "Mains Propres",
        "strategy": "Achever tous les ennemis uniquement avec des degats indirects (poussee, poisons, invocations, pieges). Reprendre la strategie globale. Attention : si on tue Misere avec un poison, verifier qu'aucune charogne n'est a max 4 PO d'elle ce tour-la (elle gagnerait des boucliers avant de mourir).",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/mains-propres.png"
      },
      {
        "name": "Special — Abjecte opulence",
        "strategy": "Misere doit etre tuee en premiere ET entrer en etat Collecte au moins une fois par tour. Bloquer Misere dans un coin entre 2 invocations (qu'elle tue a chaque tour = charognes) avec un Misereux en diagonale qui peut frapper un allie pour etre en etat Collecte. Placer les allies a max 3 PO ou min 9 PO de Misere pour eviter Funerailles Celestes en phase 2.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres a 2 personnages en moins de 40 tours. Pandawa tank (50% resistances, Dofus Ivoire/Emeraude) + 1 personnage full degats porte en permanence. Tuer les monstres les plus eloignes de Misere en premier. En phase 2 : Pandawa porte l'allie, se place derriere obstacle ou utilise Stabilisation (relance 3 tours, meme relance que Funerailles Celestes).",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Guerre est invulnerable tant que ses monstres sont en vie
  120: {
    "summary": "Guerre est invulnerable tant que ses monstres sont en vie. Une fois seule, elle passe en etat Brave par cycles, invoque des armes a chaque seuil de 20% PV et peut s'en servir avec Celerite quand elle n'est pas Brave.",
    "recommendedLevel": "Non precise dans la fiche.",
    "composition": "Pandawa utile; pour Duo, la fiche propose Pandawa tank + classe degats, ou une classe retrait PM.",
    "keyResist": [
      "feu",
      "terre",
      "air",
      "eau",
      "erosion"
    ],
    "phases": [
      {
        "title": "Monstres puis vulnerabilite",
        "mechanics": [
          "Guerre est indeplacable et invulnerable tant qu'il reste des monstres.",
          "Tuer les monstres pour la rendre vulnerable: Trancharnier d'abord, puis Olgoth a descendre a distance jusqu'a la moitie avant de finir au contact, puis Ravalame.",
          "La fiche indique que Guerre est peu dangereuse avant d'etre seule."
        ]
      },
      {
        "title": "Etat Brave",
        "mechanics": [
          "Le tour ou elle monte sur sa monture, Guerre lance Bravoure sur elle et une cible pour 2 tours, avec relance tous les 3 tours.",
          "La cible Brave est insoignable, pesanteur et lynchee, et sera la seule cible de Guerre pendant ces 2 tours.",
          "Un personnage non Brave qui tape Guerre devient Pacifiste apres son premier coup; la cible Brave peut la taper plusieurs fois.",
          "Guerre ne peut pas utiliser Celerite ni ses armes pendant l'etat Brave."
        ]
      },
      {
        "title": "Arsenal",
        "mechanics": [
          "Guerre invoque une arme a chaque seuil de 20% PV perdus: Epee, Marteau, Hache, puis Morgenstern.",
          "Les armes frappent en zone et peuvent etre declenchees par les echanges de place de Guerre.",
          "Il est preferable de tuer une arme avant le tour de Guerre; si Guerre joue avec une arme en vie puis que l'arme meurt, Guerre gagne resistances, PM et se soigne.",
          "Deux methodes sont donnees: tuer les armes au fur et a mesure, ou les pousser loin et jouer les tours ou Guerre n'est pas Brave avec prudence."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj8-invocation-arme_orig.png",
            "caption": "Invocation des armes"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj8-epee-geante_orig.png",
            "caption": "Zone Epee Geante"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj8-marteau-geant_orig.png",
            "caption": "Zone Marteau Geant"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj8-hache-geante_orig.png",
            "caption": "Zone Hache Geante"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj8-morgenstern-geant2_orig.png",
            "caption": "Zone Morgenstern Geant"
          }
        ]
      }
    ],
    "tips": [
      "Placer l'equipe hors de la zone de l'arme avant de passer un seuil.",
      "Exploiter les 2 tours sur 3 ou Guerre est Brave pour etre tranquille vis-a-vis des armes.",
      "Retirer les PM de Guerre: la fiche signale sa faible esquive PM.",
      "Desenvoûter l'insoignable de la cible Brave pour la soigner."
    ],
    "rewards": [
      "Boss non capturable.",
      "Quetes liees: Le jour le plus long; Les totems de Maimane."
    ],
    "achievements": [
      {
        "name": "Zombie",
        "strategy": "Utiliser exactement 1 PM par tour; preparer chaque seuil et tuer l'arme avant le tour de Guerre, en attendant les boosts si besoin.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/zombie.png"
      },
      {
        "name": "Misanthrope",
        "strategy": "Faire attention a ne jamais finir adjacent a un allie ou une invocation.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/misanthrope.png"
      },
      {
        "name": "Special: Arsenal total",
        "strategy": "Aucune arme ne doit etre achevee ou deplacee par un allie; eviter les zones d'armes et dispatcher l'equipe pendant les tours ou Guerre peut utiliser Celerite.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Pandawa tank + classe degats avec Prohibition, ou retrait PM. Tuer les monstres puis choisir entre rester au contact et tuer les armes ou jouer a distance sans les tuer.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Combat final reunissant les quatre Cavaliers
  121: {
    "summary": "Combat final reunissant les quatre Cavaliers. Le Feu Primordial aide l'equipe avec de gros bonus et des degats en ligne de vue, mais si son invocateur meurt, le combat est perdu.",
    "recommendedLevel": "Non precise dans la fiche.",
    "composition": "Pandawa, Feca et Eniripsa sont cites comme classes fortes; pour Hardi, la fiche recommande plutot 5 ou 6 personnages, deux Pandawa et un Feca.",
    "keyResist": [
      "terre",
      "feu",
      "air",
      "eau",
      "neutre"
    ],
    "phases": [
      {
        "title": "Feu Primordial et rappels des Cavaliers",
        "mechanics": [
          "Le premier personnage en initiative invoque le Feu Primordial sur la case centrale; s'il meurt, le combat est perdu.",
          "Tous les personnages gagnent 500 puissance, 2PA, 2PM, 10% resistances et 50% PV; l'invocateur obtient 100% PV et 15% resistances.",
          "Le Feu tape environ 750 neutre les ennemis en ligne de vue; le frapper peut donner 600 puissance et 800 bouclier a son invocateur s'il est en ligne de vue.",
          "Butin 4: quatre Cavaliers seulement; a partir du butin 5 s'ajoutent Ferrailleur, Olgoth, Pistilangue, puis Armécréante."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj51-6feu-primordial_orig.jpg",
            "caption": "Feu Primordial sur la carte"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj51-8boostfeu_orig.png",
            "caption": "Bonus de l invocateur du Feu"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj51-8boostfeu2_orig.png",
            "caption": "Bonus des autres personnages"
          }
        ]
      },
      {
        "title": "Ordre de focus global",
        "mechanics": [
          "Ordre conseille: Corruption, Servitude, Misere, puis Guerre. Guerre meurt toujours derniere car elle reste invulnerable tant qu'elle n'est pas seule.",
          "Soigner une fois les personnages qui doivent taper pour retirer Peau Pourrissante, sinon leurs degats sont reduits de 90%.",
          "Retirer Kissiphrot Sipique de Corruption en soignant une entite en melee avec lui; quand Corruption perd cet etat, tous les ennemis le perdent aussi.",
          "Une fois Corruption morte, continuer a tuer les Armecreantes et preparer Servitude."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj51-26peau-pourri_orig.png",
            "caption": "Retrait de Peau Pourrissante"
          }
        ]
      },
      {
        "title": "Servitude",
        "mechanics": [
          "Servitude renvoie 200% des dommages subis; pour l'attaquer, il faut des etats Traitre obtenus via ses glyphes blancs puis incrementes en tapant ses allies.",
          "Chaque etat permet une ligne de degats contre Servitude; ne pas consommer le dernier etat afin de pouvoir le reincrementer.",
          "Un Feca peut permettre de taper Servitude avec des protections sans dependre totalement des glyphes.",
          "Avant de le mettre a 1PV, appliquer Insoignable si possible pour eviter son soin de 25% apres rollback."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj51-22glyphe-servi_orig.jpg",
            "caption": "Glyphe blanc de Servitude"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj51-25glyphe-servi-traite_orig.jpg",
            "caption": "Etapes de Traitrise"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj51-16sort-insoignable_orig.png",
            "caption": "Exemples d Insoignable"
          }
        ]
      },
      {
        "title": "Misere puis Guerre",
        "mechanics": [
          "Focus Misere a distance en la repoussant; passer son seuil quand l'equipe est prete, puis profiter du tour d'invulnerabilite pour se booster et la tuer avant qu'elle ne rejoue.",
          "Feca/Enutrof peuvent temporiser le tour suivant le seuil via Treve ou Corruption selon la fiche.",
          "Quand Guerre est seule, choisir entre tuer ses armes avant qu'elle ne rejoue ou les ignorer en restant a distance.",
          "Eviter le sort Brave de Guerre en restant suffisamment loin; sinon seule la cible Brave peut la taper pleinement."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj51-10strat-misere_orig.png",
            "caption": "Focus Misere a distance"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj51-17annulation-tour_orig.png",
            "caption": "Temporisation apres seuil de Misere"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj51-21brave_orig.png",
            "caption": "Etat Brave de Guerre"
          }
        ]
      }
    ],
    "tips": [
      "Mettre Corruption Pesanteur une fois descendu de monture.",
      "Garder Peau Pourrissante sur les tanks tant que possible pour eviter les maladies.",
      "Prevoir l'attirance de Misere, y compris quand le Feu la tape.",
      "Appliquer Insoignable sur Servitude avant son seuil a 1PV.",
      "Mettre un tank en premier en initiative pour invoquer le Feu Primordial."
    ],
    "rewards": [
      "Si la quete Prise de conscience est terminee, choix d'un montilier contre 20 ressources du boss correspondant: Amanite de Corruption, Chienchien de Servitude, Boufrog de Guerre, Vautour de Misere.",
      "Boss non capturables."
    ],
    "achievements": [
      {
        "name": "Liberte",
        "strategy": "Ne pas tenter de retirer PM ou PO; la fiche indique que ce retrait n'est pas tres utile, surtout eviter les sorts qui en retirent par erreur.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/liberte.png"
      },
      {
        "name": "Hardi",
        "strategy": "Toujours finir adjacent. Utiliser monstres, charognes de Misere, ou un Pandawa portant une charogne; bien preparer le rollback de Servitude et les cases autour de Guerre.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/hardi.png"
      },
      {
        "name": "Quatuor",
        "strategy": "La fiche conseille une composition robuste avec Pandawa, soigneur, damage dealer et idealement Feca, en suivant la strategie globale.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/quatuor.png"
      }
    ]
  },
  // Hanshi et Shihan partagent les dommages subis, mais Shihan reduit les dommages a distance 
  122: {
    "summary": "Hanshi et Shihan partagent les dommages subis, mais Shihan reduit les dommages a distance de 50% et Hanshi reduit les dommages de melee de 50%.",
    "recommendedLevel": "Non precise dans la fiche; pierre d'ame de puissance 150 minimum pour capturer.",
    "composition": "Non precise dans la fiche; Pandawa ou Stabilisation aide pour sortir du contact de Hanshi sur Prudent.",
    "keyResist": [
      "air",
      "terre",
      "feu",
      "erosion"
    ],
    "phases": [
      {
        "title": "Gestion des monstres",
        "mechanics": [
          "Tuer de preference les monstres avant les deux gardiens.",
          "Surveiller Kurookin qui boost une cible et devient invisible si elle reste vivante; Lichangoro peut rendre un allie invulnerable a distance; Uchiwang applique des seuils de PV donnant PM et dommages a ses allies."
        ]
      },
      {
        "title": "Hanshi et Shihan",
        "mechanics": [
          "Les deux boss partagent les degats subis.",
          "Shihan reduit les degats a distance de 50%; Hanshi reduit les degats de melee de 50%.",
          "Hanshi a des seuils qui lui donnent 4PM, puis 4PM et 20% dommages melee; Shihan a deux seuils qui lui donnent 2PM.",
          "Tuer les monstres avant de s'attaquer aux deux gardiens."
        ]
      }
    ],
    "tips": [
      "Pour tuer Shihan sans tuer Hanshi, la fiche conseille de rush Shihan en melee car Hanshi perdra moins de PV.",
      "Attention au sort Jufang de Hanshi qui applique Pesanteur et Indeplacable au contact."
    ],
    "rewards": [
      "Capture utile pour la quete du Dofus Ocre: L'eternelle moisson.",
      "Quete liee: L'equilibre des forces."
    ],
    "achievements": [
      {
        "name": "Prudent",
        "strategy": "Eviter de finir adjacent a un ennemi; prevoir assez de fuite ou Stabilisation/Brume/Invisibilite pour quitter le contact de Hanshi apres Jufang.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/prudent.png"
      },
      {
        "name": "Dernier",
        "strategy": "Hanshi doit mourir dernier; focus Shihan en melee pour profiter des reductions opposees.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/dernier.png"
      },
      {
        "name": "Special: Vents contraires",
        "strategy": "Wukin (Shihan, Kurookin, Ino-Naru) ne doivent subir que des dommages de melee; Wukang (Hanshi, Lichangoro, Fangshu, Ushiwang) uniquement des dommages a distance.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "La fiche indique que les explications viendront plus tard.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // La boss Nagate est invulnérable à distance et se place sur un îlot inaccessible
  123: {
    "summary": "La boss Nagate est invulnérable à distance et se place sur un îlot inaccessible. Pour l'atteindre, il faut qu'un monstre invoque une Bombombre à Eau (chance aléatoire, ou 100% si l'on prend le contrôle d'un Kwapa via le sort Révérence), puis se téléporter sur l'îlot en infligeant des dégâts à cette Bombombre à Eau. Elle doit ensuite être tuée au corps à corps en un tour.",
    "recommendedLevel": "50 — 80",
    "composition": "Groupe standard ; un personnage capable de rejoindre l'îlot de Nagate rapidement est nécessaire. Le sort Révérence (obtenu en dehors du donjon) est très utile pour contrôler un Kwapa et garantir l'invocation d'une Bombombre à Eau.",
    "keyResist": [
      "Feu",
      "Eau"
    ],
    "phases": [
      {
        "title": "Salles 1 à 4 — Monstres Kwapas",
        "mechanics": [
          "Tous les Kwapas peuvent invoquer des Bombombres via « Invocation de bombombre » (rechargement 3 tours, minimum 3 PO entre deux Bombombres) — chaque Bombre pose un glyphe vert qui frappe ~120 dans un élément variable selon le monstre (Akakwa=Terre, Betto=Eau, Kokom=Feu, Kwamourai=Eau, Sarkapwane=Air).",
          "Salle 3 : le Kwamouraï invoque des Bombombres à Eau au milieu de la map, les monstres sont invulnérables à distance mais leurs résistances sont largement réduites ; les malus disparaissent à la mort du Kwamouraï.",
          "Salle 4 : le Kwamouraï double les PV de tous les monstres (lui compris).",
          "Akakwa — Akabond : se téléporte derrière la cible, 150 dégâts eau zone cercle rayon 2 (lançable 2x/tour).",
          "Akakwa — Kwapoeira : 180 dégâts feu zone cercle rayon 2 autour de lui (1x/tour).",
          "Betto — Komatomi : 150 dégâts air + attire d'1 case, ligne 3-12 PO sans LDV (2x/tour).",
          "Betto — Pioche-Concombre : ~220 dégâts terre zone 3x3, jusqu'à 2 PO sans LDV (2x/tour).",
          "Kokom — Attirance du concombre : attire les ennemis de 1 à 8 cases selon distance, PO infinie (rechargement 3 tours).",
          "Kokom — Kom Koko : 100 dégâts air zone bâton (ligne perp. taille 3) + 100 dégâts eau zone pelle (ligne taille 2), repousse d'1 case au corps à corps, jusqu'à 1 PO (3x/tour).",
          "Kwamourai — Aikomu Tuyu : s'attire de 3 cases vers la cible, 180 dégâts terre, repousse d'1 case, ligne 2-7 PO (1x/tour).",
          "Kwamourai — Katanardent : 180 dégâts feu, jusqu'à 3 PO (3x/tour).",
          "Sarkapwane — Crache eau : 150 dégâts eau zone croix taille 1, 3-11 PO (3x/tour).",
          "Sarkapwane — Kwap : 180 dégâts air, échange de place avec la cible, repousse de 2 cases, ligne jusqu'à 3 PO (2x/tour).",
          "Sort Révérence (acquis hors donjon en [20,-20]) : soigne un Kwapa mais a une faible chance de vous en donner le contrôle ; sous contrôle, le sort Kwarakiri permet de le tuer. Avec un Kwapa contrôlé, l'invocation d'une Bombombre à Eau est garantie à 100%."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj15-bombombre_orig.jpg",
            "caption": "Fonctionnement de l'invocation de Bombombre et de son glyphe vert"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj15-reverence-pos_orig.jpg",
            "caption": "Schéma du sort Révérence et positionnement"
          }
        ]
      },
      {
        "title": "Combat contre Nagate (Boss)",
        "mechanics": [
          "Retraite de la dame : Nagate se téléporte en haut de la map sur son îlot, devient invulnérable à distance (permanent) et applique l'état Pesanteur à tous les ennemis.",
          "Hatsunamiku : 120 dégâts eau à tous les ennemis sur la map (rechargement 2 tours).",
          "Eau Fraîche : soigne tous les monstres présents sur la map d'environ 800 (1x/tour).",
          "Colère Bouillonnante : 300 dégâts feu au corps à corps (3x/tour).",
          "Hors de ma vue : 100 dégâts air + renvoie la cible hors de l'îlot si le personnage est sur l'îlot sans être au corps à corps de Nagate (3x/tour).",
          "Mécanisme clé : attendre qu'un monstre invoque une Bombombre à Eau (aléatoire), la positionner sur une des 3 cases du bord de map face à l'îlot, se placer au corps à corps de cette Bombombre puis lui infliger des dégâts sans la tuer → téléportation sur l'îlot.",
          "ATTENTION : si Nagate n'est pas tuée en un tour et que le personnage n'est pas au contact au début de son tour, elle retéléporte le personnage sur la map principale.",
          "Alternative : prendre le contrôle d'un Kwapa via Révérence pour garantir l'invocation d'une Bombombre à Eau (100% de réussite avec un Kwapa contrôlé)."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj15-bombombre-a-eau_orig.png",
            "caption": "Bombombre à Eau : l'invoquer pour rejoindre l'îlot de Nagate"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj15-tp-ilot_orig.png",
            "caption": "Positionnement des cases pour la téléportation sur l'îlot de Nagate (cases bleues = position Bombombre à Eau, cases vertes = position du personnage)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj15-tpbombombre_orig.jpg",
            "caption": "Exemple de téléportation sur l'îlot de Nagate via la Bombombre à Eau"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj15-hatsunamiku_orig.png",
            "caption": "Schéma du sort Hatsunamiku (dégâts eau zone map)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj15-eau-fraiche_orig.png",
            "caption": "Schéma du sort Eau Fraîche (soin masse)"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj15-colere-bouillonnante_orig.png",
            "caption": "Schéma du sort Colère Bouillonnante (300 feu corps à corps)"
          }
        ]
      }
    ],
    "tips": [
      "Entrée du donjon : Akwadala en [22,-24].",
      "Recette de la clef : 2x Akaslip d'Akakwa, 2x Salopette Kwapa, 2x Concombre, 2x Sarbacane en Bambou, 3x Malt, 2x Raie Bleue, 3x Graine de Pandouille, 2x Viande Persillée.",
      "Pierre d'âme de puissance 150 minimum pour capturer Nagate.",
      "Le sort Révérence s'obtient à la Taverne d'Osakwa en [20,-20] en parlant à Rei Beransu (répondre : « Demander comment s'en débarrasser » → « Écouter la suite » → « Demander le lien avec la politesse »).",
      "Avec un Kwapa contrôlé via Révérence, l'invocation d'une Bombombre à Eau est garantie à 100% — cela évite d'attendre le hasard.",
      "Ne tuez pas la Bombombre à Eau ; positionnez-la correctement face à l'îlot avant de s'en servir comme téléporteur."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Nomade",
        "strategy": "Les combattants alliés doivent utiliser tous leurs points de mouvement à chaque tour pendant toute la durée du combat.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/nomade.png"
      },
      {
        "name": "Prudent",
        "strategy": "Les combattants alliés ne doivent jamais finir leur tour sur une cellule adjacente à celle d'un ennemi.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/prudent.png"
      },
      {
        "name": "Spécial — Le jeu de la Dame",
        "strategy": "Les Bombombres normales ne doivent subir aucun dommage. Les Bombombres à Eau servant à atteindre Nagate ne sont pas comptabilisées.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Tous les monstres et Founoroshi commencent invulnerables
  124: {
    "summary": "Tous les monstres et Founoroshi commencent invulnerables. Il faut obtenir l'etat Extinction des feux via les glyphes noirs/bleus de Founoroshi, puis marcher sur les glyphes des feux pour eteindre les 8 feux de la carte.",
    "recommendedLevel": "Non precise dans la fiche; pierre d'ame de puissance 150 minimum pour capturer.",
    "composition": "Classes a grande mobilite conseillees: Pandawa, Iop, Xelor, Eliotrope, etc. La fiche conseille aussi 6PM et eventuellement Dofus Abyssal.",
    "keyResist": [
      "feu",
      "terre",
      "eau",
      "air",
      "PA",
      "PM",
      "PO"
    ],
    "phases": [
      {
        "title": "Extinction des feux",
        "mechanics": [
          "Tous les ennemis sont invulnerables tant que les feux ne sont pas eteints.",
          "Marcher dans un glyphe noir/bleu invoque par Founoroshi donne l'etat Extinction des feux, avec -3PO et -20 esquives PA/PM.",
          "Avec cet etat, marcher sur le glyphe marron d'un feu l'eteint; l'etat est alors perdu et doit etre repris.",
          "Il y a 8 feux a eteindre; chaque feu eteint donne a Founoroshi 1PM, 10% dommages et 1PO pendant 4 tours."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj14-map-feu_orig.png",
            "caption": "Carte des feux"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj14-cases-noires_orig.png",
            "caption": "Glyphe donnant Extinction des feux"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj14-feu-allume_orig.png",
            "caption": "Feu allume"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj14-feu-eteint_orig.png",
            "caption": "Feu eteint"
          }
        ]
      },
      {
        "title": "Founoroshi",
        "mechanics": [
          "Ses sorts changent entre etat invulnerable et vulnerable.",
          "Les compagnons et invocations non statiques peuvent eteindre les feux depuis la 2.70.",
          "Un feu eteint se rallume au bout de 8 tours si l'invulnerabilite n'a pas ete retiree; une fois les ennemis vulnerables, ils le restent jusqu'a la fin.",
          "Attention au OS: ne pas commencer le tour de Founoroshi a sa melee si celui-ci a termine son tour a votre melee le tour precedent."
        ]
      },
      {
        "title": "Tonneaux centraux",
        "mechanics": [
          "Taper les tonneaux en melee repousse de 3 cases et donne 10% dommages finaux infinis.",
          "Taper les tonneaux a distance attire d'une case et donne bouclier et soin."
        ]
      }
    ],
    "tips": [
      "Utiliser beaucoup de mobilite pour enchainer glyphes noirs et feux.",
      "Une fois les 8 feux eteints, l'equipe gagne 15% de degats par tour de jeu.",
      "Ne pas rester a la melee de Founoroshi au debut de son tour."
    ],
    "rewards": [
      "Quetes liees: Apprentissage: Adepte des Douleurs; La benediction de Viti; Le festival de la lanterne; La voie du guerrier.",
      "Capture utile uniquement pour la quete du Dofus Ocre selon la fiche."
    ],
    "achievements": [
      {
        "name": "Collant",
        "strategy": "La fiche indique que les explications viendront plus tard.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/collant.png"
      },
      {
        "name": "Prudent",
        "strategy": "La fiche indique que les explications viendront plus tard.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/prudent.png"
      },
      {
        "name": "Special: Raviver la flamme",
        "strategy": "Aucun feu ne doit se rallumer; des le premier feu eteint, eteindre tous les feux et tuer Founoroshi dans les 8 tours. Le tuer en premier fait disparaitre les feux.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "La fiche indique que les explications viendront plus tard.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Damadrya est le boss de la Bambusaie, une entite vegetale qui applique des le debut du com
  125: {
    "summary": "Damadrya est le boss de la Bambusaie, une entite vegetale qui applique des le debut du combat un sort de Sangsuc (erosion + vol de vie) sur tous les personnages. Le combat est relativement simple, sans mecanique complexe : il faut taper fort et rapidement, en evitant les Bourgeons invoques.",
    "recommendedLevel": "80 — 100",
    "composition": "Aucune composition particuliere requise. Une equipe standard suffit.",
    "keyResist": [
      "Variable (voir resistances)"
    ],
    "phases": [
      {
        "title": "Salles (monstres normaux)",
        "mechanics": [
          "Bambouto — Bambouffe : 100 degats element aleatoire en ligne a 2PO ou moins (1x/tour).",
          "Bambouto — Photosynthèse : soigne les allies de 160 en zone carre 5x5 (1x/tour).",
          "Bambouto — Presse tige : 70 degats element aleatoire au cac + repousse de 1 case (1x/tour).",
          "Bulbiflore — Bulbation : +5% CC permanent + 60 degats zone etoile taille 3 (1x/tour).",
          "Bulbiflore — Frappe vivace : 70 degats au cac ; en CC, entre en etat Intaclable 1 tour (2x/tour).",
          "Bulbiflore — Pollinisation : 2 lignes de 60 degats + s'attire jusqu'au cac, en ligne a 5PO (1x/tour).",
          "Bulbuisson — Bulbronce : renvoi de degats 15% sur un allie pendant 2 tours, relance 3 tours.",
          "Bulbuisson — Nectarissement : 50 degats + etat insoignable, jusqu'a 8PO (2x/tour).",
          "Bulbuisson — Yuccanon : 70 degats vol de vie element aleatoire jusqu'a 2PO (1x/tour).",
          "Floristile — Nez bulleux : 120 degats zone cercle rayon 2, uniquement a 1PO (2x/tour).",
          "Floristile — Petaclier : retire 1 tour d'envoutement a la cible + bouclier 100% niveau au lanceur, jusqu'a 5PO (1x/tour).",
          "Floristile — Pistirage : 70 degats zone cercle rayon 2 + attire la cible au cac, en ligne a 8PO (1x/tour).",
          "Grenufar — Amphibaffe : 100 degats au cac + vole 50 agilite 1 tour (2x/tour).",
          "Grenufar — Bactrasoin : se soigne d'environ 450 PV (relance 2 tours)."
        ]
      },
      {
        "title": "Boss — Damadrya",
        "mechanics": [
          "Sangsuc : lance en debut de combat sur tous les personnages (duree decroissante selon l'initiative), applique 20% d'erosion + 50 degats vol de vie a la fin de chaque tour du personnage.",
          "Aubepine : 70 degats element aleatoire + retire 1PM esquivable, jusqu'a 10PO sans ligne de vue (2x/tour).",
          "Urticaire : 100 degats element aleatoire en ligne a 2PO ou moins + retire 50 puissance 1 tour (affecte aussi ses allies) (1x/tour).",
          "Bourgeonnement : invoque un Bourgeon avec 20PM qui explose au cac pour 80 degats element aleatoire, jusqu'a 5PO sans ligne de vue (1x/tour).",
          "Pas de strategie particuliere : le boss est simple, il faut simplement taper."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj12-aubepine_orig.png",
            "caption": "Schema du sort Aubepine de Damadrya"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj12-bourgeonnement_orig.png",
            "caption": "Schema du sort Bourgeonnement de Damadrya"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj12-urticaire_orig.png",
            "caption": "Schema du sort Urticaire de Damadrya"
          }
        ]
      }
    ],
    "tips": [
      "Entree du donjon : Plantala en [26,-30].",
      "Recette de la clef : 2x Tige de Bambouto, 2x Epine de Bulbuisson, 2x Pistil de Floristile, 2x Langue de Grenufar, 2x Dorade Grise, 3x Seigle, 3x Edelweiss, 2x Viande Sechee.",
      "Pour capturer le boss, prevoir une pierre d'ame de puissance 150 minimum.",
      "Quetes liees : Sous le bois de sa colere, Le Saule du Promeneur, Rester plante la.",
      "Succes Special (On lui pelera le bourgeon) : un allie ne doit pas subir plus d'une fois l'explosion d'un Bourgeon. Les Bourgeons ayant 20PM, il est conseille d'eliminer Damadrya rapidement en priorite."
    ],
    "rewards": [],
    "achievements": [
      {
        "name": "Premier",
        "strategy": "Damadrya doit etre acheve en premier.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/premier.png"
      },
      {
        "name": "Hardi",
        "strategy": "Les combattants allies doivent finir leur tour sur une cellule adjacente a celle d'un ennemi.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/hardi.png"
      },
      {
        "name": "On lui pelera le bourgeon",
        "strategy": "Un allie ne doit pas subir plus d'une fois l'explosion d'un Bourgeon de Damadrya. Eliminer Damadrya en priorite pour eviter trop d'invocations.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Vaincre tous les monstres avec 2 personnages maximum et en moins de 20 tours.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Les Tanuki generent des geoglyphes qui les rendent invulnerables tant qu'ils restent dedan
  126: {
    "summary": "Les Tanuki generent des geoglyphes qui les rendent invulnerables tant qu'ils restent dedans. Il faut les sortir de leur glyphe, puis gerer les phases du Tanukoui San et ses seuils X.5 qui le soignent si on ne passe pas assez vite la phase suivante.",
    "recommendedLevel": "Non precise dans la fiche; pierre d'ame de puissance 150 minimum pour capturer.",
    "composition": "Classes de placement utiles mais pas obligatoires; Pandawa conseille pour le succes special.",
    "keyResist": [
      "terre",
      "eau",
      "feu",
      "air",
      "poussee"
    ],
    "phases": [
      {
        "title": "Geoglyphes des Tanuki",
        "mechanics": [
          "Au debut du combat et a chaque fin de tour, les monstres font apparaitre un geoglyphe; un Tanuki dedans est invulnerable.",
          "Pour le rendre vulnerable, le sortir de son glyphe et eviter qu'il se retrouve dans celui d'un autre.",
          "Quand il est dans son glyphe, une attaque de melee le repousse de 2 cases et une attaque a distance l'attire de 2 cases.",
          "Chaque monstre a une forme de glyphe differente; celui du boss evolue avec ses phases."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj11-glyphe-ishigro-pake_orig.png",
            "caption": "Glyphe Ishigro Pake"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj11-glyphe-lolojiki_orig.png",
            "caption": "Glyphe Lolojiki"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj11-glyphe-parashukoui_orig.png",
            "caption": "Glyphe Parashukoui"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj11-glyphe-shinibaru_orig.png",
            "caption": "Glyphe Shinibaru"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj11-glyphe-tetonuki_orig.png",
            "caption": "Glyphe Tetonuki"
          }
        ]
      },
      {
        "title": "Phases du Tanukoui San",
        "mechanics": [
          "Le Tanukoui San a 3 phases et des seuils X.5; s'il n'est pas passe a la phase suivante avant son tour, il se soigne d'environ 20% de sa vie max.",
          "Phase I: geoglyphe carre de cote 7x7; Phase II: damier pair de rayon 6; Phase III: etoile infinie en lignes et diagonales.",
          "Preparer les tours de degats pour passer les phases X.5 avant son tour."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj11-glyphe-tanu1_orig.png",
            "caption": "Glyphe phase I"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj11-glyphe-tanu2_orig.png",
            "caption": "Glyphe phase II"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj11-glyphe-tanu3_orig.png",
            "caption": "Glyphe phase III"
          }
        ]
      },
      {
        "title": "Strategie globale",
        "mechanics": [
          "Sortir les monstres et le boss des geoglyphes pour retirer l'invulnerabilite.",
          "Eloigner les monstres entre eux pour eviter les zones de plusieurs geoglyphes.",
          "Si le succes Premier n'est pas vise, tuer les monstres en premier puis se concentrer sur le Tanukoui San seul.",
          "Pour Premier, preparer assez de degats pour franchir les phases X.5 sans laisser le boss se soigner."
        ]
      }
    ],
    "tips": [
      "Utiliser l'attirance a distance et la poussee en melee quand un Tanuki est dans son glyphe.",
      "Eloigner le Tanukoui San si son grand geoglyphe gene les autres monstres."
    ],
    "rewards": [
      "Quetes liees: La tactique des gens d'armes; Au nom de l'Art; La voie du guerrier.",
      "Capture utile pour la quete du Dofus Ocre."
    ],
    "achievements": [
      {
        "name": "Statue",
        "strategy": "La fiche indique que les explications viendront plus tard.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/statue.png"
      },
      {
        "name": "Versatile",
        "strategy": "La fiche indique que les explications viendront plus tard.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/versatile.png"
      },
      {
        "name": "Special: Se faire des kouis en or",
        "strategy": "Un ennemi ne doit pas etre deplace plus d'une fois par tour global; Pandawa conseille, tuer si possible le monstre juste sorti de son glyphe avant qu'il ne rejoue. Commencer par Tanukoui San peut liberer de l'espace.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "La fiche indique que les explications viendront plus tard.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Koumiho est invulnerable au depart
  131: {
    "summary": "Koumiho est invulnerable au depart. Il faut tuer ses deux Kitsounebi dans le meme tour avant qu'elle rejoue; la Lanterne des Spiritueurs revele et endommage les Kitsounebi et retire plusieurs effets dangereux des monstres.",
    "recommendedLevel": "Non precise dans la fiche; pierre d'ame de puissance 190 minimum pour capturer.",
    "composition": "Lanterne fortement recommandee. Pour Duo/Score 200, Pandawa + Roublard est presente comme tres facile; autres compositions possibles a distance.",
    "keyResist": [
      "feu",
      "air",
      "terre",
      "eau",
      "renvoi de dommages"
    ],
    "phases": [
      {
        "title": "Lanterne des Spiritueurs",
        "mechanics": [
          "La lanterne peut etre lancee sur soi en rayon 3 ou invoquee au contact avec un glyphe rayon 3.",
          "Elle tue les invocations du Bakazako dans son glyphe, revele Kaonashi, retire Hitomi/renvoi de Madura apres Negai, change l'orientation du glyphe Onigori et retire des boosts du Tsume-bozu.",
          "Sur les Kitsounebi, elle inflige 20% de leur vie actuelle en degats eau et les rend visibles."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj17-lanterne-des-spiritueurs_orig.png",
            "caption": "Glyphe de la lanterne"
          }
        ]
      },
      {
        "title": "Monstres et glyphes",
        "mechanics": [
          "Eviter de tuer les tas d'or de Kaonashi si l'on ne veut pas declencher Ryoshi/Emono et Noroi.",
          "Retirer Negai du Madura en placant Madura et sa cible dans la zone de la lanterne.",
          "Les glyphes d'Onigori donnent selon leur couleur/direction des bonus de stats, PM/PA, soins ou boucliers.",
          "Tsume-bozu se boost avec Regard Imposant selon les lignes de vue; la lanterne lui retire deux boosts par effet."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/donjons/donjon-koumiho/glyphe-jaune-gauche.png",
            "caption": "Glyphe jaune gauche"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/donjons/donjon-koumiho/glyphe-jaune-droite.png",
            "caption": "Glyphe jaune droite"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/donjons/donjon-koumiho/glyphe-rouge.png",
            "caption": "Glyphe rouge"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/donjons/donjon-koumiho/glyphe-blanc.png",
            "caption": "Glyphe blanc"
          }
        ]
      },
      {
        "title": "Delock de Koumiho",
        "mechanics": [
          "Koumiho invoque deux Kitsounebi; ils deviennent invisibles a partir du tour 2.",
          "Pour rendre Koumiho vulnerable, tuer les deux Kitsounebi dans le meme tour avant qu'elle rejoue.",
          "Chaque Kitsounebi pose un glyphe bleu au debut de son tour; marcher dedans fait echanger Koumiho avec le Kitsounebi, ce qui revele sa position.",
          "Ne jamais tuer un seul Kitsounebi si l'autre ne peut pas mourir avant le tour de Koumiho: il sera reinvoque et le tueur subira de gros degats air."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj17-localiser-kitsounebi1_orig.jpg",
            "caption": "Glyphe bleu avant localisation"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj17-localiser-kitsounebi2_orig.jpg",
            "caption": "Position revelee par echange"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj17-etat-kitsounebi_orig.jpg",
            "caption": "Etat apres avoir tue un Kitsounebi"
          }
        ]
      },
      {
        "title": "Koumiho vulnerable",
        "mechanics": [
          "Une fois vulnerable, Koumiho gagne 20% dommages melee et reste vulnerable jusqu'a la fin.",
          "La tuer de preference avant Retraite; sinon arreter le focus vers 55/60% PV, attendre son tour puis la tuer au tour suivant.",
          "Alternative: appliquer Insoignable ou l'entourer quand elle passe sous 50% PV afin qu'elle ne s'enfuie pas."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj17-entourer-koumiho_orig.jpg",
            "caption": "Entourer Koumiho pour contrer Retraite"
          }
        ]
      }
    ],
    "tips": [
      "Focus les monstres d'abord, de preference Madura si son renvoi est gere; sinon Onigori ou Bakazako puis Madura apres Negai.",
      "A plus de 4 personnages, focus Tsume-bozu en premier selon la fiche.",
      "Rester a distance de Koumiho quand elle est vulnerable car ses sorts ont une portee courte."
    ],
    "rewards": [
      "Quetes liees: Requiem pour un Yokai; Quand les esprits s'echauffent.",
      "Boss capturable avec pierre d'ame puissance 190 minimum."
    ],
    "achievements": [
      {
        "name": "Focus",
        "strategy": "Les degats de lanterne ne font pas echouer Focus; tuer les Kopi du Bakazako avec la lanterne et concentrer les degats des personnages sur un Kitsounebi avant l'autre.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/focus.png"
      },
      {
        "name": "Premier",
        "strategy": "Tuer les deux Kitsounebi pour le tour 2 avec buffs et lanterne, puis burst Koumiho avant Retraite; finir ensuite les monstres.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/premier.png"
      },
      {
        "name": "Special: La lumiere ne fut jamais",
        "strategy": "Ne pas utiliser Lanterne des Spiritueurs; focus Koumiho en premier en tuant les deux Kitsounebi tour 1 pendant qu'ils sont visibles, puis tuer Koumiho rapidement.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Pandawa/Roublard: mur de bombes et porter/jeter les monstres dedans; sinon jouer distance, utiliser la lanterne et tuer les Kitsounebi le meme tour avant de finir Koumiho.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Le Shogun Tofugawa est invulnerable et requiert la Lanterne des Spiritueurs pour etre delo
  132: {
    "summary": "Le Shogun Tofugawa est invulnerable et requiert la Lanterne des Spiritueurs pour etre delock 2 tours. La lanterne repousse aussi les monstres et declenche une Brume Spectrale rendant invisibles les entites hors du glyphe de lanterne.",
    "recommendedLevel": "Non precise dans la fiche; pierre d'ame de puissance 190 minimum pour capturer.",
    "composition": "Lanterne indispensable. Classes a forts degats, de preference a distance, conseillees pour Duo.",
    "keyResist": [
      "air",
      "terre",
      "feu",
      "neutre",
      "erosion"
    ],
    "phases": [
      {
        "title": "Lanterne et Malediction du Dark Vlad",
        "mechanics": [
          "La Lanterne des Spiritueurs est necessaire pour rendre le Shogun vulnerable.",
          "Dans le donjon, les monstres ont Malediction du Dark Vlad: intaclable infini; la lanterne leur retire cet etat et 36 esquive PM pour 1 tour, et les repousse de 4 cases en ligne ou 2 en diagonale.",
          "Les monstres ne peuvent pas entrer dans le glyphe de la lanterne: ils sont repousses et subissent a nouveau les effets."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj16-lanterne-des-spiritueurs_orig.png",
            "caption": "Glyphe de la lanterne"
          }
        ]
      },
      {
        "title": "Delock du Shogun",
        "mechanics": [
          "Utiliser la lanterne sur soi ou l'invoquer afin que le Shogun soit dans le rayon 3; cela lui retire l'invulnerabilite pendant 2 tours.",
          "Le delock invoque Brume Spectrale: les monstres et le boss hors du glyphe de lanterne deviennent invisibles pendant 2 tours.",
          "Si la lanterne est invoquee, bloquer le Shogun contre un obstacle/personnage/mur pour qu'il reste dans le glyphe et visible.",
          "Des qu'il devient vulnerable, il invoque deux Assaishin qui tapent neutre en melee."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj16-lanterne-repousse_orig.jpg",
            "caption": "Repousse de la lanterne"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj16-delock-sur-soi_orig.jpg",
            "caption": "Delock lance sur soi"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj16-delock-glyphe1_orig.jpg",
            "caption": "Delock avec glyphe"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj16-delock-glyphe2_orig.jpg",
            "caption": "Bloquer le Shogun dans le glyphe"
          }
        ]
      },
      {
        "title": "Strategie globale",
        "mechanics": [
          "Garder le Shogun a distance; il n'a que 4PM mais attire a 7PO en ligne.",
          "Tuer les monstres en premier, en commencant par Tambourai car il invoque et donne des PM, puis focus les Kabushido un par un.",
          "Les Kabushido sont tres dangereux au contact et frappent selon leurs PV manquants; les garder loin ou les tuer vite apres debut du focus.",
          "Une fois seul, delock le Shogun avec la lanterne et le tuer avant la fin des 2 tours de vulnerabilite."
        ]
      }
    ],
    "tips": [
      "Utiliser la lanterne defensivement pour repousser des monstres ou creer un chemin.",
      "Bloquer le Shogun avant l'invocation de la lanterne pour eviter son invisibilite.",
      "Faire attention a Aspiration du Yokomainu qui peut attirer vers les Kabushido."
    ],
    "rewards": [
      "Quete liee: Maudite disparition.",
      "Boss capturable avec pierre d'ame puissance 190 minimum."
    ],
    "achievements": [
      {
        "name": "Premier",
        "strategy": "Retirer l'invulnerabilite tres vite, idealement tour 2 apres preparation, garder les monstres a distance et bloquer le Shogun visible dans le glyphe.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/premier.png"
      },
      {
        "name": "Hardi",
        "strategy": "Tuer les monstres avant le Shogun; utiliser leur IA agressive, puis bloquer le Shogun contre murs/personnages et invoquer la lanterne pour qu'il reste adjacent et visible.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/hardi.png"
      },
      {
        "name": "Special: Une lanterne dans la nuit",
        "strategy": "Aucun ennemi sauf Shogun ne doit subir la lanterne; tuer les monstres sans lanterne, puis placer la lanterne exactement a 3 cases du Shogun du cote ou ses invocations n'apparaitront pas.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Tuer Tambourai puis les Kabushido en evitant le contact, garder le Shogun a distance, puis delock avec la lanterne et tuer.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Donjon a trois vagues
  133: {
    "summary": "Donjon a trois vagues. Les monstres ont la mecanique Lotus a 10% PV, et le Roi Imagami passe lui-meme en Lotus a 75%, 50% et 25%, invoquant la Reine Amirukam controlee par l'equipe pour aider a nettoyer les vagues.",
    "recommendedLevel": "Non precise dans la fiche.",
    "composition": "Pandawa, Roublard, Eniripsa et Feca sont conseilles. La fiche precise qu'apres simplification 2.71, toute composition de 4 avec degats distance peut reussir; retrait PM et placement aident.",
    "keyResist": [
      "terre",
      "neutre",
      "air",
      "feu",
      "eau",
      "PM",
      "erosion"
    ],
    "phases": [
      {
        "title": "Lotus des monstres",
        "mechanics": [
          "Les monstres passent en forme Lotus a 10% de leurs PV, gagnent Invulnerable et Enracine, passent leur tour pendant 4 tours et se soignent aux tours 2 et 3.",
          "Ils invoquent leur homologue de la zone opposee; cet homologue doit mourir avant le quatrieme tour d'invulnerabilite pour tuer definitivement le monstre.",
          "Si l'homologue ne meurt pas a temps, le monstre le tue lui-meme, sort du Lotus et doit etre rabaisse a 10% PV.",
          "Les Lotus peuvent etre portes par un Pandawa."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj18-lotus_orig.png",
            "caption": "Etat Lotus"
          }
        ]
      },
      {
        "title": "Seuils du Roi Imagami",
        "mechanics": [
          "Le Roi a trois seuils: 75%, 50% et 25% PV; a chaque seuil il passe Lotus, devient enraciné/invulnerable 5 tours et invoque la Reine Amirukam.",
          "En Lotus, il pose un glyphe blanc autour de lui qui tuera les monstres d'encre dedans quand il reprend forme normale.",
          "La taille du glyphe diminue a chaque seuil: carre taille 3, puis taille 2, puis taille 1.",
          "Si le Roi n'est plus dans son glyphe quand il reprend forme normale, les monstres d'encre dans le glyphe ne sont pas OS."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj18-glypheroi1fix271_orig.png",
            "caption": "Glyphe seuil 1"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj18-glypheroi2fix271_orig.png",
            "caption": "Glyphe seuil 2"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj18-glypheroi3fix271_orig.png",
            "caption": "Glyphe seuil 3"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj18-skull-statefix271_orig.png",
            "caption": "Icone des monstres qui mourront avec le glyphe"
          }
        ]
      },
      {
        "title": "Reine Amirukam et vagues",
        "mechanics": [
          "La Reine est invoquee sur la case superieure de l'allie le plus proche du Roi au moment du seuil et est controlee par cet allie.",
          "Elle a 20PA/6PM en butin 4; utiliser Expiration du Wukin plusieurs fois et alterner ses sorts de boost/protection.",
          "Vagues butin 4: vague 1 Roi + Imorok + Imafugo + Imetsu; vague 2 Imiyama + Imiyama + Imorok + Imafugo; vague 3 Imiyama + Imetsu + Imushin + Imushin.",
          "La fiche recommande que le premier personnage en initiative controle la Reine pour pouvoir l'achever au bon moment avec Extinction du Wukin puis laisser l'equipe taper le Roi."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj18-invo-amirukam_orig.png",
            "caption": "Invocation de la Reine"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj18-stratglo1fix271_orig.png",
            "caption": "Personnage le plus proche invoquant la Reine"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj18-stratglo2fix271_orig.png",
            "caption": "Placement avec Pandawa, Reine et equipe"
          }
        ]
      },
      {
        "title": "Strategie globale",
        "mechanics": [
          "Focus conseille: Imafugo, Imushin, Imiyama, Imetsu, Imorok.",
          "A chaque retour du Roi en forme normale, le repasser rapidement a son seuil pour recuperer la Reine le plus souvent possible.",
          "Eviter que l'Imorok sacrifie le Roi ou un monstre focus; son sacrifice ne se lance qu'a 1PO et en zone cercle taille 3.",
          "Placer les monstres d'encre dans le glyphe du Roi si l'equipe prend du retard; apres le dernier seuil, tuer les monstres restants a distance puis finir le Roi."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj18-sacriimorokfix271_orig.png",
            "caption": "Zone du sacrifice Imorok"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj18-stratgly1fix271_orig.jpg",
            "caption": "Glyphe du Roi apres premier seuil"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj18-stratgly2fix271_orig.jpg",
            "caption": "Glyphe du deuxieme seuil"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj18-stratgly3fix271_orig.jpg",
            "caption": "Glyphe du troisieme seuil"
          }
        ]
      }
    ],
    "tips": [
      "Se placer au centre des glyphes blancs de Papetuerie pour eviter les degats.",
      "Declencher les seuils du Roi rapidement afin d'avoir la Reine et de limiter les degats du Roi.",
      "Faire attention aux Imushin et Imiyama, identifies comme les plus dangereux.",
      "Donner des PM a la Reine et la placer pour frapper un maximum d'ennemis.",
      "Mettre Pesanteur au Roi si l'equipe ne peut pas repasser un seuil rapidement."
    ],
    "rewards": [
      "Quetes liees: Deux souffles, une inspiration; Tant de mots et si peu de temps; Les totems de Maimane.",
      "Trousseau de clef et teleportation devant donjon indisponibles; boss non capturable."
    ],
    "achievements": [
      {
        "name": "Hardi",
        "strategy": "Faire une melee generale avec personnages robustes, soins/protections; ou ramener le Roi loin des monstres tour 1 et faire Hardi sur son Lotus pour une composition distance.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/hardi.png"
      },
      {
        "name": "Mains Propres",
        "strategy": "Achever ennemis, invocations et Roi uniquement par degats indirects, invocations ou glyphe du Roi; attention aux arbres de Mabram/Imiyama.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/mains-propres.png"
      },
      {
        "name": "Special: Regence d'encre",
        "strategy": "La Reine Amirukam doit etre achevee par un allie avant que le Roi sorte du Lotus; utiliser Extinction du Wukin avant le retour du Roi.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Trio",
        "strategy": "La fiche indique que depuis la 2.71, toute composition distance peut suivre la strategie globale sans trop de probleme.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/trio.png"
      }
    ]
  },
  // Souvenir d'Imagiro est un combat unique en 3 vagues
  134: {
    "summary": "Souvenir d'Imagiro est un combat unique en 3 vagues. La Reine Amirukam et les monstres utilisent la mécanique Lotus : aux seuils, ils deviennent invulnérables et font intervenir un homologue ou le Roi Imagami. La victoire consiste à exploiter les invocations du Roi pour nettoyer les vagues et à gérer les glyphes de la Reine.",
    "recommendedLevel": "Non précisé par la fiche.",
    "composition": "Composition à distance conseillée. Pandawa pour le placement et la temporisation, Roublard pour les dégâts en donjon à vagues, Eniripsa pour le soin, Féca pour la protection ; retrait PM et Eliotrope utiles.",
    "keyResist": [
      "Feu",
      "Eau",
      "Terre",
      "Air"
    ],
    "phases": [
      {
        "title": "Mécanique Lotus des monstres",
        "mechanics": [
          "À 10% de leurs PV, les monstres passent en Lotus, deviennent Invulnérables et Enracinés, passent leurs tours pendant 4 tours et se soignent aux tours suivants.",
          "Le monstre en Lotus invoque son homologue de la zone opposée ; cet homologue doit être tué avant la fin de l'invulnérabilité pour éliminer définitivement le monstre.",
          "Si l'homologue survit, le monstre sort du Lotus et devra être ramené à 10% de PV à nouveau.",
          "Les Lotus peuvent être portés par un Pandawa."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj19-lotus_orig.png",
            "caption": "Principe du Lotus"
          }
        ]
      },
      {
        "title": "Seuils de la Reine Amirukam",
        "mechanics": [
          "La Reine possède trois seuils de PV. À chaque seuil, elle passe en Lotus pendant 5 tours, devient enracinée et invulnérable, puis invoque le Roi Imagami contrôlé par l'allié le plus proche.",
          "Quand elle atteint un seuil, elle pose un glyphe noir autour d'elle. Les monstres de papier présents dans ce glyphe meurent quand la Reine reprend sa forme normale.",
          "La taille du glyphe diminue à chaque seuil : étoile taille 3, puis étoile taille 2, puis carré taille 1.",
          "Si la Reine est déplacée hors de son glyphe, les monstres de papier dans le glyphe ne sont pas éliminés."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj19-glyphereine1fix271_orig.png",
            "caption": "Glyphe du seuil 1"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj19-glyphereine2fix271_orig.png",
            "caption": "Glyphe du seuil 2"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj19-glyphereine3fix271_orig.png",
            "caption": "Glyphe du seuil 3"
          }
        ]
      },
      {
        "title": "Utiliser le Roi Imagami",
        "mechanics": [
          "Déclencher vite les seuils de la Reine permet d'obtenir le Roi Imagami tôt et souvent.",
          "Le Roi doit frapper un maximum de monstres, en alternant ses sorts de dégâts et ses sorts de boost/protection.",
          "Il est préférable que le premier personnage en initiative contrôle le Roi, puis puisse l'achever avec Extinction du Wukang avant que la Reine ne rejoue.",
          "Donner des PM au Roi ou le placer proche des ennemis augmente fortement son impact."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj19-stratglo1fix271_orig.png",
            "caption": "Choix du personnage qui invoque le Roi"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj19-stratglo2fix271_orig.png",
            "caption": "Placement offensif du Roi"
          }
        ]
      },
      {
        "title": "Fin du combat",
        "mechanics": [
          "Après les trois seuils, il ne reste plus qu'à tuer la Reine ; elle n'a alors plus de nouveau seuil.",
          "Tacler la Reine peut lui faire passer ses tours, car elle possède des portées minimales sur ses sorts.",
          "Si elle ne peut pas être taclée, gardez-la à distance en évitant ses lignes et diagonales, et débuffez les poisons cumulables si possible."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj19-stratglo3fix271_orig.png",
            "caption": "Tacler la Reine avec obstacle"
          }
        ]
      }
    ],
    "tips": [
      "Ordre de focus conseillé : Fugokam, Tsunam, Shinlam, Mabram, Rokoram.",
      "Éviter les glyphes de Brouillard d'Encre au tour suivant de la Reine.",
      "Rester loin de la Reine et éviter ses diagonales pour limiter Toner Deubraiste.",
      "Tuer ou garder à distance les Shinlam avant que leurs dégâts ne montent trop.",
      "Placer les monstres de papier dans les glyphes de seuil si vous prenez du retard."
    ],
    "rewards": [
      "Accès à la validation du donjon et aux succès associés.",
      "Quêtes liées : Deux souffles, une inspiration ; Tant de mots et si peu de temps ; Les totems de Maïmane."
    ],
    "achievements": [
      {
        "name": "Prudent",
        "strategy": "Reprendre la stratégie globale sans finir adjacent aux ennemis, y compris les Lotus et les arbres invoqués.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/prudent.png"
      },
      {
        "name": "Mains Propres",
        "strategy": "Finir les ennemis avec le Roi, le glyphe de la Reine ou d'autres dégâts non directs ; ne pas achever directement les invocations ni les arbres.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/mains-propres.png"
      },
      {
        "name": "Spécial : Régence de papier",
        "strategy": "Achever le Roi Imagami avec un allié avant que la Reine ne sorte de sa phase Lotus ; Extinction du Wukang peut servir à cela.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Trio",
        "strategy": "Le donjon est indiqué comme très simplifié depuis la 2.71 ; une composition à distance reprend la stratégie globale.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/trio.png"
      }
    ]
  },
  // Rituel de Kabahal repose sur les Bras démoniaques
  135: {
    "summary": "Rituel de Kabahal repose sur les Bras démoniaques. Kabahal est invulnérable aux dégâts directs : il faut contrôler ou exploiter les Bras pour lui infliger des dégâts neutres, tout en évitant qu'il invoque cinq Bras et déclenche l'Incarnation du Ch'Tyx.",
    "recommendedLevel": "Non précisé par la fiche.",
    "composition": "Classe de placement fortement conseillée, surtout Pandawa, Eliotrope ou Xelor. Soin/protection avec Zobal, Féca ou Eniripsa ; retrait PM utile ; dégâts secondaires pour tuer les monstres.",
    "keyResist": [
      "Neutre",
      "Air",
      "Feu",
      "Eau",
      "Terre"
    ],
    "phases": [
      {
        "title": "Bras démoniaques de zone",
        "mechanics": [
          "Les monstres posent des runes via Menace Grandissante ; au tour suivant, un Bras apparaît et crée un glyphe autour de lui.",
          "Entrer dans le glyphe déclenche un sort aléatoire du Bras : poussée, téléportation symétrique ou dégâts de zone.",
          "Se placer sur la rune jusqu'au tour du monstre empêche l'apparition du Bras, inflige 300 dégâts feu au personnage et donne le contrôle de tous les Bras pour le tour.",
          "Instabilité Chaotique modifie les résistances des monstres à chaque ligne de dégâts reçue."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj20-50glyphebras1_orig.png",
            "caption": "Rune de Bras démoniaque"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj20-51glyphebras2_orig.png",
            "caption": "Apparition du Bras"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj20-62instabilite_orig.png",
            "caption": "Instabilité Chaotique"
          }
        ]
      },
      {
        "title": "Invulnérabilité de Kabahal",
        "mechanics": [
          "Kabahal ne peut être endommagé que par les Bras démoniaques qu'il invoque.",
          "Il faut le placer dans le glyphe d'un Bras ou contrôler les Bras pour le frapper plusieurs fois.",
          "Les tours pairs, placez un personnage sur une rune ; les tours impairs, contrôlez les Bras.",
          "Les Bras de Kabahal ont une zone de glyphe plus grande que ceux des monstres."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj20-70invulnerable_orig.png",
            "caption": "Kabahal invulnérable"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj20-71brasboss_orig.png",
            "caption": "Bras utilisés contre Kabahal"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj20-73position-bras_orig.png",
            "caption": "Positions fixes des Bras"
          }
        ]
      },
      {
        "title": "Éviter le Ch'Tyx",
        "mechanics": [
          "Si Kabahal réussit à invoquer les 5 Bras, il invoque ensuite l'Incarnation du Ch'Tyx qui tue toute l'équipe.",
          "Empêchez une invocation de Bras en plaçant un personnage sur une rune, ou tuez un Bras avant le tour de Kabahal.",
          "Les monstres et invocations placés sur les runes sont éliminés mais n'empêchent pas l'apparition du Bras."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj20-120_orig.jpg",
            "caption": "Incarnation du Ch'Tyx"
          }
        ]
      },
      {
        "title": "Placement final de Kabahal",
        "mechanics": [
          "Une fois les monstres morts, gardez Kabahal à distance et proche d'un ou deux Bras.",
          "La méthode la plus simple consiste à le tacler avec un personnage tank, idéalement à 5PO de deux Bras pour enchaîner les frappes.",
          "Sans tacle, retirez ses PM ou manipulez son IA pour qu'il termine à portée des Bras."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj20-82biafix271_orig.png",
            "caption": "Tacle de Kabahal entre deux Bras"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj20-82iaboss_orig.png",
            "caption": "Manipulation de l'IA"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj20-83iaboss_orig.png",
            "caption": "Tour pair : glyphe du Bras"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj20-84iaboss_orig.png",
            "caption": "Tour impair : Bras contrôlé"
          }
        ]
      }
    ],
    "tips": [
      "Tuer rapidement les monstres si vous ne faites pas de succès, mais commencer à faire subir des dégâts à Kabahal dès le tour 1.",
      "Focus conseillé : Eninferno, puis Krâradia si possible, puis Bwariok en dernier.",
      "Ne finissez pas en ligne avec les Bras ou les runes : Ratafia Putride peut vous attirer dessus.",
      "Baisser les résistances neutres de Kabahal avec des armes ou sorts neutres, même s'il reste invulnérable aux dégâts directs.",
      "Éviter la mêlée avec Kabahal à cause d'Offrande au Chaos."
    ],
    "rewards": [
      "Accès à la validation du donjon et aux succès associés.",
      "Quêtes liées : Le chant du Pandamonium ; Un vrai petit garçon ; Les totems de Maïmane."
    ],
    "achievements": [
      {
        "name": "Hardi",
        "strategy": "Garder un Bwariok en vie ou utiliser Pesanteur sur l'Eninferno pour conserver une entité au contact, tout en continuant à gérer Kabahal comme dans la stratégie globale.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/hardi.png"
      },
      {
        "name": "Mains Propres",
        "strategy": "Utiliser les Bras démoniaques pour achever les ennemis ; ne pas tuer directement les invocations de Kabahal ni les Bras.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/mains-propres.png"
      },
      {
        "name": "Spécial : Gros Bras",
        "strategy": "Entamer les monstres puis les faire achever uniquement par les Bras. Placer Kabahal entre deux Bras dès que possible et ne pas tuer les invocations à partir du tour 5 sauf avec les Bras.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Pandawa + autre classe conseillé. Privilégier la survie, contrôler les Bras et maintenir une pression constante sur Kabahal avant les invocations du tour 5.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Bataille de l'Aurore Pourpre oppose l'équipe à l'Éternel Conflit, protégé par deux diablot
  136: {
    "summary": "Bataille de l'Aurore Pourpre oppose l'équipe à l'Éternel Conflit, protégé par deux diablotins et par un seuil de PV. Il faut gérer les états Colère Bontarienne et Haine Brâkmarienne, déclencher l'état X pour retirer le seuil, puis tuer le boss tout en contrôlant les monstres et le Cauchemar des Ravageurs.",
    "recommendedLevel": "Non précisé par la fiche.",
    "composition": "Pandawa, Cra, Enutrof, Eliotrope et Féca sont conseillés. Le jeu à distance, le retrait PM, la protection et les combos de burst comme Eliotrope/Iop, Roublard ou Sram sont mis en avant.",
    "keyResist": [
      "Feu",
      "Eau",
      "Terre",
      "Air",
      "Neutre"
    ],
    "phases": [
      {
        "title": "Modificateur et Cauchemar",
        "mechanics": [
          "Tant que des monstres sont en vie, finir son tour sans ennemi en ligne de vue peut matérialiser le Cauchemar des Ravageurs.",
          "Quand un ennemi est achevé, les ennemis dans sa ligne de vue deviennent invisibles pendant 1 tour.",
          "Le Cauchemar disparaît au bout d'un tour s'il n'est pas descendu à son seuil, puis renvoie les entités à leur position de début de combat et soigne/boost les ennemis.",
          "La fiche conseille généralement de ne pas chercher le seuil du Cauchemar et d'attendre sa disparition."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj23-modificateurfix271_orig.png",
            "caption": "Modificateur du Cauchemar"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj23-cauchemar_orig.png",
            "caption": "État Cauchemar"
          }
        ]
      },
      {
        "title": "Diablotins et invulnérabilités",
        "mechanics": [
          "L'Éternel Conflit est invulnérable en mêlée et à distance, et possède un seuil à 4000 PV.",
          "Tuer le Bonraphin retire l'invulnérabilité à distance ; tuer le Brâklotin retire l'invulnérabilité en mêlée ; tuer les deux retire les deux invulnérabilités temporairement.",
          "Les diablotins sont réinvoqués 2 tours après leur mort.",
          "Tuer les diablotins peut invoquer le Cauchemar des Ravageurs."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj23-590_orig.jpg",
            "caption": "Principe des deux diablotins"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj23-804_orig.png",
            "caption": "Seuil du boss"
          }
        ]
      },
      {
        "title": "Passage en état X",
        "mechanics": [
          "Le Bonraphin commence avec Colère Bontarienne 10 et le Brâklotin avec Haine Brâkmarienne 10 ; décrémenter ces états incrémente ceux du boss.",
          "Taper le Bonraphin à distance ou le laisser utiliser Colonne de Lumière incrémente la Colère du boss.",
          "Taper le Brâklotin en mêlée ou le laisser utiliser Colonne de Flammes incrémente la Haine du boss.",
          "Quand le boss atteint 10 états dans chaque jauge, il passe en état X au début de son prochain tour, tue les diablotins, devient vulnérable 2 tours, gagne du bouclier et perd définitivement son seuil de PV."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj23-600_orig.jpg",
            "caption": "États initiaux"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj23-641_orig.jpg",
            "caption": "Exemple d'incrémentation"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj23-668_orig.jpg",
            "caption": "État X"
          }
        ]
      },
      {
        "title": "Stratégie globale",
        "mechanics": [
          "Tuer d'abord les Maléfisto, puis les soigneurs ou monstres dangereux selon le butin, tout en tenant le boss et ses diablotins à distance.",
          "Une fois les monstres morts, tuer le boss soit en burst pendant l'état X, soit à petit feu en retirant l'invulnérabilité utile via un diablotin puis en déclenchant l'état X pour supprimer le seuil.",
          "Si les dégâts ne suffisent pas pendant l'état X, temporiser ces deux tours puis finir après réinvocation des diablotins."
        ]
      }
    ],
    "tips": [
      "Toujours finir en ligne de vue d'un ennemi tant que des monstres sont vivants.",
      "Bloquer les lignes de vue d'un monstre sur ses alliés avant de l'achever pour limiter l'invisibilité.",
      "Mettre le Cauchemar Pesanteur et l'éloigner s'il apparaît.",
      "Retirer des PM au boss avant son état X, car il y devient insensible au retrait PM.",
      "Le Dofus du Cauchemar peut apporter les fantômes de soldat, mais invoquer les deux fantômes le même tour matérialise le Cauchemar."
    ],
    "rewards": [
      "Accès à la validation du donjon et aux succès associés.",
      "Quêtes liées : La danse de la dissonance ; Au bout du rouleau ; Qui nous protège du protecteur ?"
    ],
    "achievements": [
      {
        "name": "Zombie",
        "strategy": "Utiliser exactement 1 PM par tour, tuer vite les monstres, puis passer le boss en état X et le finir ou tuer le Bonraphin ensuite pour retirer l'invulnérabilité à distance.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/zombie.png"
      },
      {
        "name": "Premier",
        "strategy": "Temporiser les monstres avec une composition de burst, construire un mur Roublard, un réseau Sram ou un combo Elio/Iop, puis tuer l'Éternel Conflit pendant l'état X avant les autres.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/premier.png"
      },
      {
        "name": "Spécial : Jusqu'à l'Aurore",
        "strategy": "Ne pas achever le Bonraphin ni le Brâklotin ; tuer les monstres, monter les deux états à 10 et éliminer le boss pendant ses deux tours d'état X.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Plusieurs approches citées : Eliotrope + damage dealer, Pandawa + X, distance avec Cra/Féca/Enu + X, ou Sram + X. Le principe reste de tuer vite les monstres puis gérer l'état X et l'invulnérabilité restante.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Akadémie des Gobs est un donjon bas niveau centré sur le passif Travail d'équipe : les gob
  138: {
    "summary": "Akadémie des Gobs est un donjon bas niveau centré sur le passif Travail d'équipe : les gobelins se renforcent quand ils commencent leur tour proches les uns des autres. Le boss Directeur Grunob invoque Dagobert et boost ses alliés, mais n'a pas de mécanique d'invulnérabilité.",
    "recommendedLevel": "Niveau 40 mentionné par la fiche.",
    "composition": "Aucune composition spécifique requise ; les sorts de placement aident surtout pour Nomade et pour garder les monstres à distance.",
    "keyResist": [
      "Eau",
      "Air",
      "Terre",
      "Feu"
    ],
    "phases": [
      {
        "title": "Travail d'équipe",
        "mechanics": [
          "Tous les monstres, boss compris, gagnent des dommages finaux pendant 1 tour selon le nombre de gobelins dans une zone cercle de rayon 2 autour d'un gobelin qui commence son tour.",
          "Séparer les gobelins limite donc leurs bonus."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj29-700_orig.png",
            "caption": "Zone du passif Travail d'équipe"
          }
        ]
      },
      {
        "title": "Directeur Grunob",
        "mechanics": [
          "Grunob frappe à moyenne portée, attire les monstres autour de sa cible et donne des PM à ses alliés.",
          "Il invoque Dagobert, qui peut voler des PA autour de lui.",
          "Tuer Dagobert dès son invocation rend le combat plus serein."
        ]
      },
      {
        "title": "Stratégie globale",
        "mechanics": [
          "Éliminer d'abord les monstres accompagnant le Directeur, car ils tombent plus vite.",
          "Prioriser le Gobaliste s'il est présent, car c'est le monstre avec la plus grande portée.",
          "Rester à distance pour subir moins de dégâts, tuer Dagobert quand il apparaît, puis finir le Directeur."
        ]
      }
    ],
    "tips": [
      "Si les dégâts subis deviennent trop élevés, séparez les gobelins pour empêcher leurs boosts de proximité.",
      "Le Gobaliste n'est pas présent dans la salle du boss en butin 4 d'après la fiche.",
      "Le sort Foudroiement de Grunob peut être récupéré avant la première salle en entrant dans l'armoire puis en cliquant le parchemin."
    ],
    "rewards": [
      "Accès à la validation du donjon et aux succès associés.",
      "Quêtes liées : De joyeux petits arbres ; La raison du plus fort ; Donjon éducatif."
    ],
    "achievements": [
      {
        "name": "Nomade",
        "strategy": "Utiliser tous ses PM chaque tour, rester à distance et prévoir du placement pour éviter le tacle.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/nomade.png"
      },
      {
        "name": "Premier",
        "strategy": "Tuer le Directeur Grunob en premier ; son invocation peut être tuée sans faire échouer le succès. Garder les monstres à distance pendant le focus boss.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/premier.png"
      },
      {
        "name": "Spécial : Dirige mais mal rédige",
        "strategy": "À partir du tour 2, les ennemis doivent commencer leur tour adjacent à une entité ; aucune contrainte si tous les adversaires meurent tour 1.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Même stratégie que le combat normal avec deux personnages maximum.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Tertre du long sommeil repose sur les Malterego : au premier tour des monstres, ils devien
  139: {
    "summary": "Tertre du long sommeil repose sur les Malterego : au premier tour des monstres, ils deviennent invisibles et invoquent un double. Hell Mina est invulnérable jusqu'à ce que l'équipe incrémente son état de Rage avec les éléments qu'elle assigne aux personnages.",
    "recommendedLevel": "Non précisé par la fiche.",
    "composition": "Pas de composition imposée. Des dégâts rapides aident à tuer des Malters avant leur premier tour ; disposer de sorts dans plusieurs éléments facilite les états de Rage.",
    "keyResist": [
      "Feu",
      "Terre",
      "Eau",
      "Air",
      "Neutre"
    ],
    "phases": [
      {
        "title": "Appel du Malterego",
        "mechanics": [
          "Quand un monstre commence son premier tour, il devient invisible et invoque son Malterego, doté de sorts différents.",
          "Tuer le Malterego rend son invocateur visible, lui retire des PM, des résistances et réduit ses dégâts.",
          "Il est possible de trouver et frapper le Malter invisible sans tuer son double ; les sorts de révélation fonctionnent."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj28-58_orig.png",
            "caption": "Effet d'invocation du Malterego"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj28-59_orig.jpg",
            "caption": "État spécial du Malterego"
          }
        ]
      },
      {
        "title": "Rage de Hell Mina",
        "mechanics": [
          "Au début de chacun de ses tours, Hell Mina attribue à chaque personnage un élément aléatoire parmi Terre, Feu, Eau et Air.",
          "Chaque personnage qui utilise une attaque dans l'élément assigné consomme son état et incrémente la Rage de Hell Mina de 1.",
          "À la sixième attaque élémentaire correcte, Hell Mina perd ses états Lourd et Invulnérable pour le reste du combat.",
          "Si un personnage n'utilise pas l'attaque de l'élément assigné, il subit des dégâts dans cet élément et l'état disparaît sans incrémenter Hell Mina."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj28-600_orig.png",
            "caption": "Colère d'Hell Mina"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj28-601_orig.png",
            "caption": "États de Rage élémentaire"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj28-619_orig.png",
            "caption": "Hell Mina vulnérable"
          }
        ]
      },
      {
        "title": "Gestion des monstres",
        "mechanics": [
          "Tuer les monstres en premier tout en incrémentant Hell Mina, mais éviter de la rendre vulnérable trop tôt si les monstres sont encore vivants.",
          "Tuer si possible des Malters avant qu'ils ne jouent, notamment ceux en fin d'initiative.",
          "Le Maltrio est prioritaire en butin 6+ à cause de son poison PA."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj28-blocagemalter1_orig.jpg",
            "caption": "Blocage d'un Malter"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj28-blocagemalter2_orig.jpg",
            "caption": "Malter bloqué par son Malterego"
          }
        ]
      },
      {
        "title": "Finir Hell Mina",
        "mechanics": [
          "Une fois les monstres morts, incrémenter la Rage jusqu'à rendre Hell Mina vulnérable.",
          "Préparer les dégâts avant la sixième attaque élémentaire correcte, car Hell Mina gagne ensuite PM, dommages finaux et critiques.",
          "Éviter les murs et décors à cause de ses dommages de poussée."
        ]
      }
    ],
    "tips": [
      "Utilisez systématiquement une attaque dans l'élément assigné, même dans le vide si nécessaire.",
      "Profitez des boosts des Malterego, mais attention au poison PA du Malterego de Maltrio.",
      "Hell Mina a une résistance feu élevée selon la fiche ; privilégier eau et air pour la tuer rapidement.",
      "Bloquer un Malter dans un coin peut limiter l'impact de l'invisibilité et de l'invocation."
    ],
    "rewards": [
      "Accès à la validation du donjon et aux succès associés.",
      "Quêtes liées : Arrête-la si tu peux ; Pas de fumée sans feu.",
      "Capture utile pour la quête du Dofus Ocre : L'éternelle moisson."
    ],
    "achievements": [
      {
        "name": "Dernier",
        "strategy": "Suivre la stratégie globale et achever Hell Mina après les monstres.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/dernier.png"
      },
      {
        "name": "Statue",
        "strategy": "Finir chaque tour sur sa case de départ ; tuer si possible le Malzerb avant son premier tour et tuer Hell Mina rapidement une fois vulnérable.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/statue.png"
      },
      {
        "name": "Spécial : Hellémentaire",
        "strategy": "Frapper Hell Mina avec l'élément attribué à chaque personnage jusqu'à ce qu'elle devienne vulnérable ; le succès se valide à ce moment.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "N'importe quelle composition peut réussir, mais avec deux personnages il faut trois tours complets pour retirer l'invulnérabilité de Hell Mina.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Chambre des maléfices est un combat en deux cycles contre Belladone
  140: {
    "summary": "Chambre des maléfices est un combat en deux cycles contre Belladone. Tant qu'elle est sur son îlot, elle est invulnérable et booste ses alliés ; il faut tuer tous les monstres pour la faire descendre, atteindre son seuil de 50%, puis recommencer avec les monstres réinvoqués avant de l'achever.",
    "recommendedLevel": "Non précisé par la fiche.",
    "composition": "Deux méthodes principales : Pandawa tank qui tacle les monstres, ou composition retrait PM jouant derrière les obstacles. Protection, soin, Pesanteur et désenvoûtement sont utiles.",
    "keyResist": [
      "Feu",
      "Eau",
      "Terre",
      "Air",
      "Neutre"
    ],
    "phases": [
      {
        "title": "Détection des Protecteurs",
        "mechanics": [
          "Un monstre qui commence son tour avec un personnage en ligne de vue à plus de 4PO entre en Férocité des Protecteurs.",
          "Il se téléporte alors au contact de la cible, lui applique Pesanteur et Détecté, inflige des dégâts et gagne des bonus importants.",
          "Après ce tour, il entre en Protecteur au repos, perd des résistances et ne peut pas relancer Férocité au tour suivant.",
          "Rester hors ligne de vue ou à 4PO ou moins empêche la téléportation."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj44-st-ferocite-des-protecteurs_orig.png",
            "caption": "Férocité des Protecteurs"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj44-st-protecteur-repos_orig.png",
            "caption": "Protecteur au repos"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj44-st-detecte_orig.png",
            "caption": "État Détecté"
          }
        ]
      },
      {
        "title": "Belladone sur son îlot",
        "mechanics": [
          "Belladone est invulnérable, ne se déplace pas et utilise surtout des sorts de boost.",
          "Chaque monstre tué incrémente son état Ensorcellement jusqu'à III, ce qui renforce ses sorts de soutien.",
          "Ensorcellement explosif peut faire échanger de place le monstre ciblé avec le premier personnage qui le frappe, puis infliger de lourds dégâts feu autour du monstre au tour suivant.",
          "Glyphe de condamnation cible un personnage en ligne de vue de Belladone et pose un glyphe étoile qui OS au début du tour."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj44-ensorcellement-explosif_orig.png",
            "caption": "Ensorcellement explosif"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj44-glyphe-de-condamnation_orig.png",
            "caption": "Glyphe de condamnation"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj44-ensor-explo_orig.jpg",
            "caption": "État de l'Ensorcellement explosif"
          }
        ]
      },
      {
        "title": "Belladone sur le terrain",
        "mechanics": [
          "Quand tous les monstres sont morts, Belladone se téléporte sur le personnage le plus proche et devient vulnérable à la fin de son tour.",
          "Elle possède un seuil à 50% de ses PV. Quand le seuil est atteint, elle retourne sur son îlot, replace tous les personnages sur leur position de départ et réinvoque les monstres.",
          "Les monstres réinvoqués sont invulnérables un tour, puis gagnent des dommages finaux et perdent des résistances à chaque début de tour.",
          "Après avoir tué les monstres une seconde fois, Belladone revient et il faut enlever ses 50% de PV restants."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj44-belladone-seule_orig.jpg",
            "caption": "Belladone sur l'îlot"
          }
        ]
      },
      {
        "title": "Méthodes de placement",
        "mechanics": [
          "Avec un Pandawa tank, taclez les monstres pendant que les autres personnages restent hors ligne de vue derrière les obstacles.",
          "Avec du retrait PM, jouez derrière les obstacles, gardez les monstres séparés et éloignez le Caméliache.",
          "Focus conseillé : Caméliache en premier, avec Pesanteur si possible ; éviter ou désenvoûter Partage Épineux de l'Armuguet."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj44-strategie-panda-tank_orig.png",
            "caption": "Placement Pandawa tank"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj44-strategie-ret-pm_orig.png",
            "caption": "Placement retrait PM"
          }
        ]
      }
    ],
    "tips": [
      "Ne tapez pas un monstre sous Ensorcellement explosif avec un petit 2, sauf si vous pouvez gérer ou annuler l'échange.",
      "Ne laissez pas de personnages en ligne de vue de Belladone lorsqu'elle est sur son îlot.",
      "Éroder les monstres avant la première mort aide quand ils seront réinvoqués.",
      "Préparer boosts, soins, protections ou gros tours de dégâts en laissant un dernier monstre en vie.",
      "Sortir immédiatement du glyphe posé par Maléfice immobile quand Belladone est sur le terrain."
    ],
    "rewards": [
      "Accès à la validation du donjon et aux succès associés.",
      "Quêtes liées : La sorcière exilée ; Flovoraison."
    ],
    "achievements": [
      {
        "name": "Collant",
        "strategy": "Reprendre la stratégie globale en finissant adjacent à un allié ; attention pendant la phase Belladone au personnage ciblé par Maléfice immobile.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/collant.png"
      },
      {
        "name": "Mains Propres",
        "strategy": "Achever chaque monstre, y compris les réinvoqués, avec dégâts indirects. Le passage du seuil de Belladone n'a pas cette contrainte, mais son achèvement final oui.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/mains-propres.png"
      },
      {
        "name": "Spécial : Cible facile",
        "strategy": "La fiche fournit une tactique dédiée ; elle s'appuie sur la stratégie globale et sur le respect de la contrainte du personnage désigné finissant en ligne de vue de Belladone.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Pandawa + Sadida, Pandawa + Roublard, Sram + X et autres variantes sont citées. Préparer un gros tour pour passer le seuil de Belladone, puis répéter après la réinvocation des monstres.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Bastion des Marteaux-Aigris tourne autour de Nimpatience, qui augmente quand les Nimbos in
  141: {
    "summary": "Bastion des Marteaux-Aigris tourne autour de Nimpatience, qui augmente quand les Nimbos infligent des dégâts. Barbéryl Clochecuivre applique l'état Clochecuivre aux personnages touchés et peut OS en Nimpatience III/V ; la stratégie la plus simple est souvent de la tuer rapidement.",
    "recommendedLevel": "Non précisé par la fiche.",
    "composition": "Pour tuer Barbéryl vite, prévoir de gros dégâts et éventuellement Pesanteur. Pour la tuer en dernier, retrait PM fortement recommandé ; désenvoûtement utile contre Ninspiration du Sanglirok.",
    "keyResist": [
      "Eau",
      "Terre",
      "Air",
      "Feu"
    ],
    "phases": [
      {
        "title": "Nimpatience",
        "mechanics": [
          "Chaque ligne de dégâts infligée par un Nimbos à un personnage incrémente sa Nimpatience, jusqu'à 5 états.",
          "Les bonus dépendent du type de Nimbos et sont permanents.",
          "À Nimpatience III, chaque Nimbos débloque un sort spécial utilisable une fois ; à Nimpatience V, ce sort devient disponible chaque tour et souvent renforcé.",
          "Barbéryl gagne des dommages finaux par Nimpatience et débloque Nindécence, qui OS au contact."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/editor/dj43-nimpatiencestates.png?1669606354",
            "caption": "États de Nimpatience"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj43-40nimpatience_orig.png",
            "caption": "Exemple de Nimpatience"
          }
        ]
      },
      {
        "title": "État Clochecuivre",
        "mechanics": [
          "Barbéryl est Lourde pendant tout le combat et gagne 20% de résistances pour 2 tours chaque fois qu'elle est poussée.",
          "Le premier personnage qui subit des dégâts pendant un tour reçoit l'état Clochecuivre.",
          "Au début de son prochain tour, Barbéryl consomme cet état, échange de place avec le personnage et lui retire 100PM.",
          "Infliger des dégâts de mêlée à Barbéryl avec un personnage ou une invocation retire l'état Clochecuivre avant qu'elle ne le consomme."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj43-41clochecuivre_orig.png",
            "caption": "Effet Clochecuivre"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj43-43etatclochecuivre_orig.png",
            "caption": "État sur personnage"
          }
        ]
      },
      {
        "title": "Tuer Barbéryl en premier",
        "mechanics": [
          "La fiche présente cette méthode comme la plus simple hors succès Dernier.",
          "Booster au tour 1 puis éliminer Barbéryl au tour 2 si possible, afin d'éviter son OS de Nimpatience.",
          "Ne pas pousser Barbéryl pendant le focus pour éviter de lui donner des résistances.",
          "Empêcher ou désenvoûter Ninspiration du Sanglirok s'il partage les dégâts avec Barbéryl."
        ]
      },
      {
        "title": "Tuer Barbéryl en dernier",
        "mechanics": [
          "Pour le succès Dernier ou une stratégie plus lente, tuer les monstres à distance avec retrait PM tout en évitant l'état Clochecuivre.",
          "Focus conseillé : Marthos en premier car il peut toucher à très longue ligne et appliquer Clochecuivre ; surveiller Boufronde et Blindur selon le butin.",
          "Une fois les monstres morts, taper Barbéryl à distance avec retrait PM et sans la pousser sauf urgence."
        ]
      }
    ],
    "tips": [
      "Dès qu'un personnage a Clochecuivre, le retirer en priorité en tapant Barbéryl en mêlée.",
      "Pesanteur, Enraciné, Indéplaçable ou porter le personnage empêchent l'échange de place de Clochecuivre.",
      "Ne placez pas d'invocations proches des monstres si elles ne servent pas, car elles peuvent faire monter Nimpatience.",
      "Si Barbéryl atteint Nimpatience III ou V, placez des invocations sur son chemin pour qu'elle utilise son OS dessus.",
      "Éviter de pousser Barbéryl pendant le focus, sauf si vous acceptez le gain de résistances."
    ],
    "rewards": [
      "Accès à la validation du donjon et aux succès associés.",
      "Quête liée : L'île maudite."
    ],
    "achievements": [
      {
        "name": "Dernier",
        "strategy": "Tuer les monstres à distance avec retrait PM, éviter Clochecuivre, puis finir Barbéryl en la gardant à distance.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/dernier.png"
      },
      {
        "name": "Versatile",
        "strategy": "Ne pas utiliser deux fois la même action pendant un tour ; pas de difficulté particulière annoncée.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/versatile.png"
      },
      {
        "name": "Spécial : Antioxydant",
        "strategy": "Empêcher tout ennemi d'atteindre Nimpatience V : éviter de subir des lignes de dégâts et tuer Barbéryl rapidement, idéalement au tour 2, puis finir les monstres proches de l'état V.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Deux approches : tuer Barbéryl en premier avec deux gros damage dealers, ou reprendre la stratégie Dernier avec une classe retrait PM, en moins de 20 tours.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Refuge Sylvestre est un donjon simple sans invulnérabilité
  142: {
    "summary": "Refuge Sylvestre est un donjon simple sans invulnérabilité. Les monstres appliquent des faiblesses dans leur élément de frappe ; Rakoopeur applique une faiblesse prysmatique multi-élément et protège ses alliés avec Camaraderie.",
    "recommendedLevel": "Non précisé par la fiche.",
    "composition": "Aucune composition spécifique requise. Rester à distance facilite Prudent et le succès spécial.",
    "keyResist": [
      "Terre",
      "Neutre",
      "Air",
      "Eau",
      "Feu"
    ],
    "phases": [
      {
        "title": "Faiblesses élémentaires",
        "mechanics": [
          "Chaque monstre a un élément de frappe et applique à lui-même et à sa cible un malus de résistances dans cet élément lorsqu'il attaque.",
          "En coup critique, le monstre se met un malus plus faible et applique un malus plus fort à sa cible.",
          "L'effet peut se cumuler jusqu'à 3 fois par élément."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj42-50faiblesseeau_orig.png",
            "caption": "Exemple de faiblesse élémentaire"
          }
        ]
      },
      {
        "title": "Rakoopeur",
        "mechanics": [
          "Rakoopeur n'a pas d'état invulnérable.",
          "Ses sorts frappent dans les cinq éléments et appliquent Faiblesse prysmatique : malus de résistances dans tous les éléments à sa cible et à lui-même.",
          "Avec Camaraderie, il se téléporte en mêlée d'un allié et lui donne des points de bouclier."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/dj42-51faiblesseprysmatique_orig.png",
            "caption": "Faiblesse prysmatique"
          }
        ]
      },
      {
        "title": "Stratégie globale",
        "mechanics": [
          "Éliminer les monstres avant Rakoopeur, en commençant par le Timangouste selon la fiche.",
          "Continuer avec le Buffalourd puis le Grolours, avant de finir Rakoopeur.",
          "Si Rakoopeur booste un allié avec Camaraderie, laisser ce monstre tranquille jusqu'à la fin du bonus de bouclier.",
          "Si le Grolours partage les dommages, focus un monstre non concerné par le partage."
        ]
      }
    ],
    "tips": [
      "Rester à distance réduit les faiblesses subies et aide pour Prudent.",
      "Ne pas forcer un focus sur un monstre sous bouclier de Camaraderie.",
      "Surveiller Empressement du Grolours et changer de cible si un partage de dommages gêne le focus."
    ],
    "rewards": [
      "Accès à la validation du donjon et aux succès associés.",
      "Quêtes liées : Association de fureteurs ; Les sbires du maître."
    ],
    "achievements": [
      {
        "name": "Dernier",
        "strategy": "Tuer les monstres avant Rakoopeur, comme dans la stratégie globale.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/dernier.png"
      },
      {
        "name": "Prudent",
        "strategy": "Ne jamais finir adjacent à un ennemi ; rester à distance et repousser ou se téléporter si nécessaire.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/prudent.png"
      },
      {
        "name": "Spécial : Vigilance forestière",
        "strategy": "Éviter de cumuler plus de deux faiblesses élémentaires différentes au début de son tour en restant à distance et en limitant les coups reçus.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Duo",
        "strategy": "Survivre et éliminer tous les monstres avec deux personnages en moins de 20 tours ; la fiche ne signale pas de difficulté particulière.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/duo.png"
      }
    ]
  },
  // Breuil du Vénérable est un donjon de dimension à 5 vagues
  164: {
    "summary": "Breuil du Vénérable est un donjon de dimension à 5 vagues. Les monstres sont apathiques tant qu'ils ne sont pas alertés ; la stratégie consiste à gérer les vagues sans réveiller le Vénérable, puis tuer sa Monture pour le rendre vulnérable et finir le boss à distance.",
    "recommendedLevel": "Non précisé par la fiche.",
    "composition": "Retrait PM et dégâts de zone sont conseillés. Les classes à gros burst sont utiles pour Premier ; Pandawa aide pour Hardi et l'isolement, mais Gyrafor et Gropotam ne peuvent pas être portés.",
    "keyResist": [
      "Terre",
      "Neutre",
      "Air",
      "Eau",
      "Feu"
    ],
    "phases": [
      {
        "title": "Vagues de dimension",
        "mechanics": [
          "Le combat comporte 5 vagues. Les vagues apparaissent aux tours 1, 6, 11, 16 et 21, ou plus tôt si la vague précédente est éliminée.",
          "Lorsqu'une nouvelle vague arrive, ses monstres sont invulnérables jusqu'à la fin de leur premier tour.",
          "Les monstres des vagues à partir de la vague 2 ont moins de PV."
        ]
      },
      {
        "title": "Apathique et Alerté",
        "mechanics": [
          "Tous les monstres commencent Apathiques : ils perdent la majorité de leurs PM, ne peuvent pas utiliser leurs sorts, sont Intacleurs et se soignent au début de leur tour.",
          "Quand un monstre subit des dégâts, il passe Alerté pendant 2 tours et tous les monstres à 3PO ou moins de lui passent aussi Alertés.",
          "Un monstre éliminé déclenche aussi Alerté autour de lui ; son bébé disparaît avec lui et déclenche également l'état autour de lui.",
          "Isoler une cible à plus de 3PO des autres permet de ne réveiller qu'un monstre à la fois."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark161vene2_orig.png",
            "caption": "État Apathique"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark161vene1_orig.png",
            "caption": "Zone de déclenchement de l'état Alerté"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark161vene17_orig.jpg",
            "caption": "Exemple de focus isolé"
          }
        ]
      },
      {
        "title": "Saisons et troupeau",
        "mechanics": [
          "Selon la saison, les monstres gagnent Agressif, Paniqué ou Protecteur, avec des comportements et bonus différents.",
          "En fin de tour, un monstre partage les dommages avec les monstres alliés à 3PO ou moins et donne un bonus selon son type.",
          "Chaque monstre invoque au début du combat un bébé du même type, qui suit les mêmes mécaniques."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark161vene6_orig.png",
            "caption": "États liés aux saisons"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark153vene28_orig.jpg",
            "caption": "Invocation des bébés"
          }
        ]
      },
      {
        "title": "Vénérable et Monture",
        "mechanics": [
          "Le Vénérable est à ignorer tant que les vagues ne sont pas finies : le taper ou alerter un monstre proche de lui peut le réveiller.",
          "Au tour 1, il invoque sa Monture, qui augmente progressivement les dommages finaux des monstres tant qu'elle vit.",
          "Pour retirer définitivement l'invulnérabilité du Vénérable, il faut tuer sa Monture ; il se réveille alors et devient vulnérable.",
          "À 50% de ses PV, le Vénérable déclenche Gare au Gorille et gagne des dommages finaux, PO, dommages de poussée et retrait PA/PM."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark153vene2_orig.png",
            "caption": "Monture du Vénérable"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark161vene9_orig.png",
            "caption": "Gare au Gorille"
          },
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark153vene36_orig.jpg",
            "caption": "Placement hors ligne de vue du Vénérable"
          }
        ]
      },
      {
        "title": "Stratégie de l'enclos",
        "mechanics": [
          "La technique de l'enclos consiste à placer des invocations pour bloquer le rush et garder les monstres parqués.",
          "Elle est surtout utile pendant la saison de la naissance.",
          "La fiche conseille de réveiller une fois le Vénérable en début de combat pour le sortir de l'enclos ; il se rendort 2 tours après avoir été réveillé.",
          "Une fois les monstres contenus, préparer des dégâts de zone pour les éliminer rapidement."
        ],
        "images": [
          {
            "src": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/ark153vene30_orig.jpg",
            "caption": "Cases d'invocations pour l'enclos"
          }
        ]
      }
    ],
    "tips": [
      "Ne jamais taper un monstre à 3PO ou moins du Vénérable si vous ne voulez pas le réveiller.",
      "Le Gyrafor est indiqué comme le monstre le plus dangereux : le garder à distance et lui retirer de la PO si possible.",
      "Une fois le Vénérable réveillé, se cacher derrière un obstacle avant son Cri Vénérable.",
      "Appliquer Pesanteur au Vénérable empêche son saut ; retrait PM et retrait PO aident aussi.",
      "Achever la Monture avec le personnage qui joue juste après le Vénérable donne plus de temps pour frapper le boss avant son tour."
    ],
    "rewards": [
      "Accès à la validation du donjon et aux succès associés.",
      "Quête liée : Devoir de réserve."
    ],
    "achievements": [
      {
        "name": "Premier",
        "strategy": "Ignorer les monstres apathiques et ne pas les taper. Tuer la Monture puis burst le Vénérable, idéalement avant d'être submergé par les vagues.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/premier.png"
      },
      {
        "name": "Hardi",
        "strategy": "Utiliser un Pandawa et/ou Ratrapry Iridescente pour garder une entité au contact, puis éliminer les monstres un par un sans alerter tout le groupe.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/hardi.png"
      },
      {
        "name": "Spécial : Dernier",
        "strategy": "Ne jamais taper un monstre à 3PO ou moins du Vénérable ; reprendre la stratégie globale et achever le Vénérable en dernier.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/special.png"
      },
      {
        "name": "Trio",
        "strategy": "Comme la stratégie globale, choisir entre éliminer les monstres un par un ou taper en zone selon la composition.",
        "image": "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/dj-succes/illus/trio.png"
      }
    ]
  },
};
