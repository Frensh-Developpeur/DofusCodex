// Fresque de progression Ganymède (https://ganymede-app.com/tree) — snapshot figé.
// Les données (nœuds positionnés + connexions) sont embarquées dans la page Inertia de
// Ganymède (script application/json), PAS dans l'API publique /api/guides : il n'existe
// aucun endpoint JSON dédié. On en garde donc un instantané ici (comme dungeonGuides /
// wantedPosters). Chaque nœud renvoie vers un guide Ganymède (guideId) déjà géré par l'app.
// Re-générable depuis le <script data-page> de /tree (champs *_fr, x/y, x_alt/y_alt, image, guides.fr.id).
//
// Deux dispositions existent : (x,y) = arbre brut ; (xAlt,yAlt) = vue « Débutant » ordonnée
// par paliers de niveau (lignes y_alt impaires = bandes 1-40 / 40-60 / 60-100 / 100-150 /
// 150-190 / 190-200, lignes paires vides = séparateurs). On affiche la vue par paliers.

// Base des images de nœuds, hébergées par Ganymède (img-src https: autorisé en CSP).
export const TREE_IMG_BASE = "https://ganymede-app.com/images/tree";

export interface TreeNode {
  id: number;
  name: string;
  description: string;
  level: number;
  x: number; // colonne — disposition « arbre brut »
  y: number; // ligne   — disposition « arbre brut »
  xAlt: number; // colonne — disposition « Débutant » (par paliers de niveau)
  yAlt: number; // ligne   — disposition « Débutant » (par paliers de niveau)
  image: string; // fichier image du nœud (TREE_IMG_BASE/<image>)
  guideId: number | null; // id du guide Ganymède FR associé (route /guides/:id)
}

export interface TreeEdge {
  from: number; // id du nœud prérequis
  to: number; // id du nœud débloqué
}

export const TREE_NODES: TreeNode[] = [
  { id: 1, name: "Frigost 1", description: "Débuter l'ascension", level: 150, x: 4, y: 9, xAlt: 17, yAlt: 7, image: "frigost1.png", guideId: 98 },
  { id: 2, name: "Frigost 2", description: "Atteindre le camp de base", level: 180, x: 5, y: 9, xAlt: 17, yAlt: 9, image: "frigost2.png", guideId: 112 },
  { id: 3, name: "Frigost 3 + Dofus des Glaces", description: "Atteindre le sommet", level: 200, x: 6, y: 9, xAlt: 17, yAlt: 13, image: "ddg.png", guideId: 113 },
  { id: 5, name: "Alignement Bonta", description: "Bonta", level: 200, x: 6, y: 8, xAlt: 6, yAlt: 11, image: "bonta.png", guideId: 516 },
  { id: 6, name: "Bonta / Brakmar", description: "Frères ennemis", level: 110, x: 7, y: 10, xAlt: 22, yAlt: 7, image: "bontabrak.png", guideId: 308 },
  { id: 7, name: "Nimotopia", description: "Les Chasses du Comte Razof", level: 190, x: 6, y: 10, xAlt: 5, yAlt: 11, image: "nimotopia.png", guideId: 354 },
  { id: 8, name: "Dofus Ivoire", description: "Le Dragon ou la Liche", level: 200, x: 7, y: 9, xAlt: 5, yAlt: 12, image: "dofusivoire.png", guideId: 658 },
  { id: 9, name: "Dofus Abyssal", description: "Mystère abyssal", level: 200, x: 8, y: 6, xAlt: 10, yAlt: 11, image: "dofusabyssal.png", guideId: 1729 },
  { id: 10, name: "Fratrie des Oubliés", description: "Tout commence avec une croquette ...", level: 200, x: 10, y: 12, xAlt: 10, yAlt: 3, image: "fratrie.png", guideId: 427 },
  { id: 11, name: "Dofus Forgelave", description: "Entre le marteau et l'enclume", level: 200, x: 10, y: 11, xAlt: 6, yAlt: 14, image: "dofusforgelave.png", guideId: 2029 },
  { id: 12, name: "Otomai 3", description: "Service de dépannage", level: 150, x: 7, y: 3, xAlt: 11, yAlt: 9, image: "otomai3.png", guideId: 602 },
  { id: 13, name: "Otomai 2", description: "Sacrée Tourbière", level: 110, x: 7, y: 4, xAlt: 11, yAlt: 7, image: "otomai2.png", guideId: 186 },
  { id: 14, name: "Otomai 1", description: "Voyage vers une île paradisiaque", level: 40, x: 7, y: 5, xAlt: 11, yAlt: 3, image: "otomai1.png", guideId: 183 },
  { id: 15, name: "Sufokia", description: "Le sud du continent a besoin de vous !", level: 50, x: 8, y: 5, xAlt: 12, yAlt: 3, image: "sufokia1.png", guideId: 310 },
  { id: 16, name: "Ecaflipus 1", description: "Tu peux toujours te gratter", level: 110, x: 2, y: 2, xAlt: 21, yAlt: 7, image: "ecaflipus1.png", guideId: 538 },
  { id: 17, name: "Ecaflipus 2", description: "Angoraphobie", level: 160, x: 2, y: 3, xAlt: 21, yAlt: 9, image: "ecaflipus2.png", guideId: 701 },
  { id: 18, name: "Ecaflipus 3", description: "On va tout défausser", level: 200, x: 2, y: 4, xAlt: 21, yAlt: 11, image: "ecaflipus3.png", guideId: 702 },
  { id: 19, name: "Dofus Ebène", description: "Sur les traces de crocoburio", level: 200, x: 10, y: 10, xAlt: 5, yAlt: 14, image: "dofusebene.png", guideId: 705 },
  { id: 20, name: "Dofus Vulbis", description: "L'oeuf de Crocabulia ?", level: 200, x: 11, y: 11, xAlt: 12, yAlt: 12, image: "dofusvulbis.png", guideId: 704 },
  { id: 21, name: "Crocuzko", description: "Arpenter l'Archipel des Ecailles", level: 200, x: 11, y: 10, xAlt: 12, yAlt: 11, image: "crocuzko.png", guideId: 1138 },
  { id: 22, name: "Campement Bwork / Gobelins", description: "Rencontre avec la faune locale", level: 40, x: 8, y: 3, xAlt: 22, yAlt: 3, image: "bwork.png", guideId: 28 },
  { id: 23, name: "Koalak", description: "Convoyeur de fond en comble", level: 90, x: 8, y: 4, xAlt: 22, yAlt: 5, image: "koalak.png", guideId: 309 },
  { id: 24, name: "Dofus Emeraude", description: "À la poursuite du Dark Vlad", level: 120, x: 11, y: 7, xAlt: 5, yAlt: 7, image: "dofusemeraude.png", guideId: 66 },
  { id: 25, name: "L'arbre qui cache la forêt", description: "Protecteur des Protecteurs", level: 200, x: 7, y: 13, xAlt: 10, yAlt: 16, image: "larbrequicachelaforet.png", guideId: 2042 },
  { id: 27, name: "Saharach 3", description: "La Pyramide Ocre", level: 200, x: 9, y: 3, xAlt: 13, yAlt: 11, image: "saharach4.png", guideId: 1237 },
  { id: 28, name: "Saharach 2", description: "Apprendre le langage Cacterre", level: 130, x: 9, y: 2, xAlt: 13, yAlt: 7, image: "saharach3.png", guideId: 291 },
  { id: 29, name: "Saharach 1", description: "Sur les traces de l'Epice", level: 80, x: 9, y: 1, xAlt: 13, yAlt: 5, image: "saharach1.png", guideId: 65 },
  { id: 30, name: "Royaume d'Amakna", description: "Traître ou pas Traître", level: 120, x: 9, y: 4, xAlt: 23, yAlt: 3, image: "royaumedamakna.png", guideId: 375 },
  { id: 31, name: "Dofus Argenté", description: "Entrer dans les pas des plus grands", level: 1, x: 9, y: 5, xAlt: 6, yAlt: 1, image: "dofusargente.png", guideId: 2 },
  { id: 32, name: "Mais où sont les dofus", description: "À la rencontre de Meriana", level: 40, x: 9, y: 6, xAlt: 6, yAlt: 3, image: "meriana.webp", guideId: 3 },
  { id: 33, name: "Dofus Pourpre", description: "La malédiction du Minotot", level: 130, x: 9, y: 7, xAlt: 6, yAlt: 7, image: "dofuspourpre.png", guideId: 1954 },
  { id: 34, name: "Quatre sur Six", description: "Les Primordiaux Elementaires", level: 200, x: 9, y: 8, xAlt: 3, yAlt: 11, image: "4sur6.png", guideId: 1755 },
  { id: 35, name: "Six sur Six", description: "La fin... ou le commencement", level: 200, x: 9, y: 9, xAlt: 3, yAlt: 15, image: "6sur6.png", guideId: 1891 },
  { id: 36, name: "Dom de Pin", description: "On vous ferait vraiment croire n'importe quoi.", level: 200, x: 8, y: 13, xAlt: 11, yAlt: 16, image: "domdepin.png", guideId: 2025 },
  { id: 38, name: "Dofus Sylvestre", description: "En attendant le printemps", level: 200, x: 8, y: 14, xAlt: 11, yAlt: 17, image: "dofussylvestre.png", guideId: 2043 },
  { id: 39, name: "Dokoko", description: "Sur une Île en croissant de lune", level: 100, x: 11, y: 4, xAlt: 10, yAlt: 5, image: "dokoko.png", guideId: 30 },
  { id: 40, name: "Dofus Cawotte", description: "Le premier (faux ?) Dofus !", level: 80, x: 11, y: 5, xAlt: 8, yAlt: 5, image: "dofuscawotte.png", guideId: 24 },
  { id: 41, name: "Dofus Turquoise", description: "Suivez l'idole !", level: 180, x: 10, y: 7, xAlt: 7, yAlt: 9, image: "dofusturquoise.png", guideId: 131 },
  { id: 42, name: "Dofus Argenté Scintillant", description: "Le silence est d'Aure", level: 200, x: 10, y: 9, xAlt: 3, yAlt: 16, image: "dofusargentescintillant.png", guideId: 1892 },
  { id: 43, name: "Valonia 1", description: "Nos amis les hommes", level: 50, x: 8, y: 10, xAlt: 16, yAlt: 3, image: "valonia1.png", guideId: 25 },
  { id: 44, name: "Valonia 2", description: "Un clan hétéroclite", level: 190, x: 8, y: 11, xAlt: 16, yAlt: 11, image: "valonia2.png", guideId: 1140 },
  { id: 45, name: "Valonia 3", description: "Triste Cire", level: 190, x: 8, y: 12, xAlt: 16, yAlt: 13, image: "valonia3.png", guideId: 2035 },
  { id: 46, name: "Dofus Ocre", description: "Gotta catch'em all !", level: 200, x: 8, y: 7, xAlt: 4, yAlt: 5, image: "dofusocre.png", guideId: 182 },
  { id: 47, name: "Atoll des Possédés", description: "D'autres mœurs", level: 200, x: 13, y: 10, xAlt: 9, yAlt: 14, image: "atoll.png", guideId: 2044 },
  { id: 48, name: "Aurore Pourpre", description: "Démons et merveilles", level: 200, x: 12, y: 14, xAlt: 11, yAlt: 12, image: "aurorepourpre.png", guideId: 2026 },
  { id: 49, name: "Ocre d'Ambre", description: "Retrouver la trace de Terrakourial", level: 170, x: 7, y: 7, xAlt: 3, yAlt: 5, image: "ocredambre.png", guideId: 104 },
  { id: 50, name: "Domakuro", description: "Les Esprits de Pandala", level: 140, x: 12, y: 6, xAlt: 8, yAlt: 7, image: "domakuro.png", guideId: 88 },
  { id: 51, name: "Dorigami", description: "La Légende du Peki Garou", level: 170, x: 12, y: 7, xAlt: 8, yAlt: 9, image: "dorigami.png", guideId: 189 },
  { id: 52, name: "Dofus Tacheté", description: "Un rêve en clair-obscur", level: 200, x: 12, y: 8, xAlt: 8, yAlt: 11, image: "dofustachete.png", guideId: 1867 },
  { id: 53, name: "Après la Pluie", description: "Une bien étrange prophétie", level: 200, x: 12, y: 9, xAlt: 8, yAlt: 13, image: "apreslapluie.png", guideId: 2017 },
  { id: 54, name: "Ravagés", description: "Le début de la fin", level: 200, x: 12, y: 10, xAlt: 9, yAlt: 13, image: "ravages.png", guideId: 2022 },
  { id: 56, name: "Dofus Cauchemar", description: "Réminiscence", level: 200, x: 12, y: 13, xAlt: 11, yAlt: 13, image: "dofuscauchemar.png", guideId: 2023 },
  { id: 57, name: "Le Secret des Dofus: Prologue", description: "Renaissance", level: 200, x: 9, y: 13, xAlt: 11, yAlt: 15, image: "lesecretdesdofus.png", guideId: 2024 },
  { id: 58, name: "Eliocalypse RESONANCE", description: "Résonance", level: 200, x: 14, y: 9, xAlt: 11, yAlt: 11, image: "resonance.png", guideId: 1714 },
  { id: 59, name: "L'Avenir du Futur", description: "Les 4 Cavaliers de l'Eliocalypse", level: 200, x: 14, y: 13, xAlt: 12, yAlt: 13, image: "avenirdufutur.png", guideId: 1914 },
  { id: 60, name: "Pandala 1", description: "Quand les éléments s'emmêlent", level: 140, x: 13, y: 6, xAlt: 9, yAlt: 7, image: "pandala1.png", guideId: 428 },
  { id: 61, name: "Pandala 2", description: "Histoires de fantômes pandawas", level: 170, x: 13, y: 7, xAlt: 9, yAlt: 9, image: "pandala2.png", guideId: 603 },
  { id: 62, name: "Pandala 3", description: "Mots d'esprits sans jeux de mots", level: 200, x: 13, y: 8, xAlt: 9, yAlt: 11, image: "pandala3.png", guideId: 2050 },
  { id: 63, name: "Cania 3", description: "La voyageuse imprudente", level: 160, x: 15, y: 11, xAlt: 12, yAlt: 9, image: "cania3.png", guideId: 736 },
  { id: 64, name: "Guerre", description: "La guerre éternelle", level: 200, x: 14, y: 14, xAlt: 13, yAlt: 14, image: "laguerre.png", guideId: 2007 },
  { id: 65, name: "Cania 2", description: "Ça en valait la plaine", level: 150, x: 15, y: 10, xAlt: 12, yAlt: 7, image: "cania2.png", guideId: 426 },
  { id: 66, name: "Corruption", description: "Je suis malade, complètement malade", level: 200, x: 13, y: 14, xAlt: 13, yAlt: 13, image: "jesuismalade.png", guideId: 2011 },
  { id: 67, name: "Xelorium 3", description: "Le puits du fou", level: 200, x: 4, y: 4, xAlt: 19, yAlt: 11, image: "xelo3.png", guideId: 479 },
  { id: 68, name: "Xelorium 2", description: "Carpe Diem", level: 170, x: 4, y: 3, xAlt: 19, yAlt: 9, image: "xelo2.png", guideId: 435 },
  { id: 69, name: "Xelorium 1", description: "Les temps qui courent", level: 120, x: 4, y: 2, xAlt: 19, yAlt: 7, image: "xelo1.png", guideId: 434 },
  { id: 70, name: "Cania 1", description: "Caniablanca", level: 90, x: 15, y: 9, xAlt: 12, yAlt: 5, image: "cania1.png", guideId: 305 },
  { id: 71, name: "Misère", description: "Jugement dernier", level: 200, x: 15, y: 13, xAlt: 13, yAlt: 12, image: "jugement.png", guideId: 2010 },
  { id: 72, name: "Dofus Nébuleux", description: "Odyssée en trois dimensions", level: 200, x: 4, y: 5, xAlt: 19, yAlt: 13, image: "dofusnebuleux.png", guideId: 483 },
  { id: 73, name: "Enutrosor 3", description: "Le roi et moi", level: 200, x: 3, y: 4, xAlt: 18, yAlt: 11, image: "enu3.png", guideId: 433 },
  { id: 74, name: "Enutrosor 2", description: "Après les phorreurs, le réconfort", level: 150, x: 3, y: 3, xAlt: 18, yAlt: 9, image: "enu2.png", guideId: 432 },
  { id: 75, name: "Enutrosor 1", description: "Même pas malle", level: 100, x: 3, y: 2, xAlt: 18, yAlt: 7, image: "enu1.png", guideId: 431 },
  { id: 76, name: "Dofus des Veilleurs", description: "A travers les dimensions", level: 100, x: 4, y: 1, xAlt: 19, yAlt: 5, image: "dofusveilleur.png", guideId: 62 },
  { id: 77, name: "Servitude", description: "Prisonniers de la mer", level: 200, x: 15, y: 14, xAlt: 12, yAlt: 14, image: "prisonnier.png", guideId: 2009 },
  { id: 78, name: "Srambad 3", description: "Le jeu du trône", level: 200, x: 5, y: 4, xAlt: 20, yAlt: 11, image: "sram3.png", guideId: 482 },
  { id: 79, name: "Srambad 2", description: "Crache ton venin", level: 180, x: 5, y: 3, xAlt: 20, yAlt: 9, image: "sram2.png", guideId: 481 },
  { id: 80, name: "Srambad 1", description: "Sauvé par le gong", level: 130, x: 5, y: 2, xAlt: 20, yAlt: 7, image: "sram1.png", guideId: 480 },
  { id: 81, name: "Forêt Maléfique", description: "Cherche et Trouve", level: 150, x: 11, y: 9, xAlt: 22, yAlt: 9, image: "foretmalefique.png", guideId: 606 },
  { id: 82, name: "Justiciers", description: "Faire la peau aux Recherchés", level: 200, x: 10, y: 3, xAlt: 23, yAlt: 7, image: "justiciers.png", guideId: 430 },
  { id: 83, name: "Dolmanax", description: "Savoir être régulier", level: 10, x: 10, y: 5, xAlt: 8, yAlt: 1, image: "dolmanax.png", guideId: 484 },
  { id: 84, name: "Krosmoz", description: "Pour une petite touche d'histoire", level: 80, x: 10, y: 4, xAlt: 10, yAlt: 1, image: "krosmoz.png", guideId: 374 },
  { id: 85, name: "Sidimote1", description: "Du cimetière à la Désolation", level: 70, x: 4, y: 7, xAlt: 14, yAlt: 5, image: "sidimote1.png", guideId: 306 },
  { id: 86, name: "Sidimote2", description: "Du Chapiteau à la Tanière", level: 100, x: 5, y: 6, xAlt: 14, yAlt: 7, image: "sidimote2.png", guideId: 307 },
  { id: 87, name: "Sidimote3", description: "Le village de Gisgoul", level: 180, x: 5, y: 7, xAlt: 14, yAlt: 9, image: "sidimote3.png", guideId: 429 },
  { id: 88, name: "Sidimote4", description: "Les cavernes hallucinées", level: 180, x: 6, y: 6, xAlt: 15, yAlt: 9, image: "sidimote4.png", guideId: 604 },
  { id: 89, name: "Sidimote5", description: "Qu'est-ce qu'elle a ma goule ?", level: 200, x: 6, y: 7, xAlt: 14, yAlt: 11, image: "sidimote5.png", guideId: 703 },
  { id: 94, name: "Halouine", description: "Bouh !", level: 200, x: 13, y: 4, xAlt: 21, yAlt: 15, image: "halouine.png", guideId: 440 },
  { id: 95, name: "Nowel", description: "Un Nowel Presque Parfait", level: 200, x: 14, y: 4, xAlt: 22, yAlt: 15, image: "nowel.png", guideId: 1541 },
  { id: 96, name: "Pwak", description: "Chauuuuud cacao !", level: 200, x: 13, y: 3, xAlt: 21, yAlt: 14, image: "pwak.png", guideId: 2045 },
  { id: 97, name: "Vulkania", description: "Vulkanologie", level: 200, x: 14, y: 3, xAlt: 22, yAlt: 14, image: "dokille.png", guideId: 2673 },
  { id: 98, name: "Roc des Salbatroces", description: "C'est assez", level: 200, x: 5, y: 10, xAlt: 17, yAlt: 14, image: "proto.png", guideId: 1900 },
  { id: 99, name: "Royaume des Martegel", description: "Là-bas sous la montagne", level: 200, x: 4, y: 10, xAlt: 18, yAlt: 13, image: "dazak.png", guideId: 2047 },
  { id: 100, name: "Alignement Brakmar", description: "Brakmar", level: 200, x: 7, y: 8, xAlt: 6, yAlt: 12, image: "brakmar.png", guideId: 773 },
  { id: 101, name: "Guide Complet", description: "Un Guide pour les gouverner tous !", level: 1, x: 5, y: 12, xAlt: 14, yAlt: 1, image: "ring.png", guideId: 2747 },
  { id: 102, name: "Osavora", description: "La dimension divine d'Osamodas", level: 200, x: 3, y: 5, xAlt: 22, yAlt: 11, image: "osavora.png", guideId: 2680 },
];

export const TREE_EDGES: TreeEdge[] = [
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 7, to: 8 },
  { from: 8, to: 35 },
  { from: 15, to: 14 },
  { from: 16, to: 17 },
  { from: 17, to: 18 },
  { from: 19, to: 35 },
  { from: 24, to: 34 },
  { from: 25, to: 38 },
  { from: 31, to: 32 },
  { from: 29, to: 28 },
  { from: 28, to: 27 },
  { from: 32, to: 24 },
  { from: 32, to: 40 },
  { from: 32, to: 33 },
  { from: 32, to: 41 },
  { from: 32, to: 46 },
  { from: 33, to: 34 },
  { from: 34, to: 35 },
  { from: 35, to: 42 },
  { from: 35, to: 57 },
  { from: 36, to: 38 },
  { from: 41, to: 34 },
  { from: 43, to: 44 },
  { from: 44, to: 45 },
  { from: 45, to: 36 },
  { from: 46, to: 34 },
  { from: 50, to: 51 },
  { from: 51, to: 52 },
  { from: 52, to: 53 },
  { from: 53, to: 54 },
  { from: 56, to: 57 },
  { from: 57, to: 36 },
  { from: 58, to: 53 },
  { from: 58, to: 59 },
  { from: 59, to: 56 },
  { from: 64, to: 59 },
  { from: 66, to: 59 },
  { from: 71, to: 59 },
  { from: 77, to: 59 },
  { from: 76, to: 80 },
  { from: 76, to: 75 },
  { from: 76, to: 69 },
  { from: 69, to: 68 },
  { from: 68, to: 67 },
  { from: 75, to: 74 },
  { from: 74, to: 73 },
  { from: 80, to: 79 },
  { from: 79, to: 78 },
  { from: 78, to: 72 },
  { from: 73, to: 72 },
  { from: 67, to: 72 },
  { from: 32, to: 50 },
  { from: 32, to: 49 },
  { from: 49, to: 34 },
  { from: 54, to: 56 },
];

// Paliers de niveau (vue « Débutant ») : libellé + ligne yAlt où le placer.
export const TREE_BANDS: { yAlt: number; label: string; note?: string }[] = [
  { yAlt: 1, label: "1 à 40", note: "Tutoriel" },
  { yAlt: 3, label: "40 à 60" },
  { yAlt: 5, label: "60 à 100" },
  { yAlt: 7, label: "100 à 150" },
  { yAlt: 9, label: "150 à 190" },
  { yAlt: 11, label: "190 à 200" },
];
