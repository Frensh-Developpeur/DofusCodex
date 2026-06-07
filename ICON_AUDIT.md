# Audit des icônes — DofusCodex

Suivi de l'audit page par page du remplacement des icônes par les assets du client Dofus 3.
Workflow : on recense **toutes** les icônes d'un écran, l'utilisateur dit lesquelles changer, on applique (build + dev), puis page suivante. **Pas de push sans feu vert.**

## Conventions / décisions globales
- Source assets : `public/dofus-icons/official/` (extraits du client Dofus 3, prioritaires) → `public/dofus-icons/client/` → distant `dofusdb.fr` (fallback).
- Résolution dans `src/components/DofusIcon.tsx` : `OFFICIAL_PATHS` → `CLIENT_PATHS` → `PATHS` (distant).
- `DofusIcons.tsx` = remplaçant lucide (mêmes noms, mappés via `ALIASES`).
- **Flèches** : recolorées en **vert** (`client/arrow-right.png` recoloré) — s'applique à toutes les flèches/chevrons.
- Une `<img>` ne prend PAS la couleur via `text-*`/`currentColor` → pour teinter/masquer, utiliser opacité/filtre ou rendu conditionnel.

## Mappings de référence (sidebar, validés)
- Accueil=world · Donjons=dungeon · Guides=**book** · Classes=group · Monstres=**bestiary** · Équipements=menuStuffs · Panoplies=menuItemsets(pastille) · Objets=inventory · Havre-Sacs=havenbag · Succès=trophy · Skinator=**character** · Mes Skins=glyph · Builder=**characteristic** · Chasse=**map** · Almanax=**calendar** · Paramètres=**settingsGear**

## Avancement

### ✅ Sidebar — TERMINÉ
Toutes validées. Changements : Guides→livre, Monstres→bestiaire, Skinator→portrait, Builder→ADN, Chasse→boussole, Almanax→calendrier, Paramètres→engrenage cyan (était cœur jaune `seuil`). Classes & Panoplies gardés.

### ✅ Bugs transverses corrigés
- Bouton Copier (Skinator) : chaîne fine → `btnIcon_copy` blanc.
- Case « Copier /travel » (Hunt) : coche verte image masquée correctement (rendu conditionnel).
- Flèches de chasse (Hunt) : `icon_hunt_arrow0/2/4/6` blanches ; logo coffre ; Position=globe, Direction=boussole.
- Settings compteurs : Builds→ADN, Skins→portrait. « Données live » (Settings+Dashboard) : marteau→globe.
- Almanax bonus « challenge » : donjon→épées croisées.

### ✅ Dashboard (Accueil) — TERMINÉ
Tuiles synchronisées sur la sidebar : Builder→characteristic, Skinator→character, Guides→book, Encyclopédie→bestiary, Chasse→map. Donjons=dungeon gardé. Reste OK : Données live=world, CalendarDays=calendar, Coins=kama, ChevronRight=flèche verte.

### ✅ Donjons (`Dungeons.tsx`) — TERMINÉ
Avertissement « Guides v1 »→info, badge Guide→book, « X ennemis »→bestiary, « X salles »→dungeonDoor (structure donjon client, nouvelle clé). Gardés : carte=dungeon, boss=monsterGrey(12px), favoris=star, terminé=Check, recherche=Search, flèche=verte.

### ✅ DungeonDetail (`DungeonDetail.tsx`) — TERMINÉ
Boss (badge 12, portrait 128, pastille 14)→`boss` (iconBossSkull). Pastilles Guide détaillé/auto→`book`. « Mécaniques du combat »→`epeesCroisees`. « Habitants du donjon »→`bestiary`. Gardés : succès/récompenses=trophy/cadeau, conseils=sagesse.
Aussi : « Conseils »→`info` (bulle), « Récompenses »→`reward` (coffre, nouvelle clé icon_bonus_reward), StatChip « Niveau »→`boss`. Résistances ELEMENTS = tx_*Res officiels (OK). PV/PA/PM officiels (OK).
Nouvelles clés ajoutées au passage : `boss`=iconBossSkull, `bestiary`=bestiary, `book`=encyclopedia, `reward`=icon_bonus_reward, `dungeonDoor`=dungeon(client), `character`/`characteristic`/`calendar`/`map`/`copy`/`share`/`havenbag`/`inventory`.

### ✅ Classes (`Classes.tsx`) — TERMINÉ
« Sorts » : `multiElement`→`spells` (baguette officielle, nouvelle clé). Gardés : sorts PA/PO/critique (officiels), étoiles difficulté (starFilled/Empty), spinner Loader2.
**MAJ icône Classes** : `group`→**`emote`** (perso Dofus, asset emote.png) — appliqué partout où
l'icône représente « Classes » : sidebar Classes, titre « Classes » du Skinator, sélecteur de
classe du Builder (bouton + état vide). Clé ajoutée : `emote`.

### ✅ Monsters (`Monsters.tsx`) — TERMINÉ
Filtre « Boss uniquement » + badge boss carte : `monsterGrey`→`boss`. Recherche=Search. Vignettes monstres = API.

### ✅ MonsterDetail (`MonsterDetail.tsx`) — TERMINÉ
Pastille Boss + badge famille→`boss`. « Sorts »→`spells`. « Butin »→`reward`. « Zone ciblable » (×2)→`target` (réticule btnIcon_focus, nouvelle clé). Bouton Agrandir→`zoom` (loupe icon_magnifier, nouvelle clé). Croix fermer modale agrandie→`closeRed` (X rouge, nouvelle clé close-red.png). Dynamiques OK : CHARS(force…), RES(resTerre…), elementIcon, utilityIcon, BigStat pv/pa/pm, sorts PA/PO/critique, donjons=dungeon.

### ✅ Stuffinator (`Stuffinator.tsx`) — TERMINÉ
Créatures : Familiers=companions, Montilier=familier, Dragodinde=dragodinde, Muldo=horseshoe, Volkorne=mount (5 distincts, nouvelles clés). Slots d'armes → `weaponColored` (épée colorée equipments) via meta.ts (impacte aussi Builder). Slots armure gris distincts gardés. Recherche=Search, filtres=SlidersHorizontal(gear).
Clés ajoutées : `companions`,`mount`,`dragodinde`,`horseshoe`,`weaponColored`,`target`(rouge),`zoom`(bleu),`closeRed`,`spells`,`reward`.

### ✅ Stuffinator (`Stuffinator.tsx`) — REVALIDÉ
Slots d'armure (silhouettes grises du client) recolorés via masque CSS (prop `tint` ajoutée à
DofusIcon) dans un **beige** unique `#d8c39a` (ton manche d'arme). Familiers/montures : **même
icône `companions`** pour toute la rangée (uniformisé). Armes=`weaponColored`. Recherche=Search.

### ✅ ItemDetail (`ItemDetail.tsx`) — TERMINÉ
Caractéristiques + Effets : `multiElement`→`characteristic` (ADN). Droppé par : `monsterGrey`→
`bestiary` (colorée, = onglet Monstres). Gardés : Arme=`weapon`, Portée=`po`, Recette=`recipe`,
Panoplie=`menuItemsets`, chevrons, caracs/bonus dynamiques.

### ✅ ResourceDetail (`ResourceDetail.tsx`, nouvelle page) — TERMINÉ
Page distincte pour objets non-équipement (ressource/conso/divers). Pastille type : `chestGrey`→
`inventory` (sac coloré). Effets=`characteristic`. Placeholder « introuvable »=`chestGrey`.

### ✅ Panoplies (`Sets.tsx` liste + `SetDetail`) — TERMINÉ
Badge **Apparat** : `glyph`→`cosmetics` (colorée). Vignette panoplie = 1er item (fallback
`menuItemsets`). Recherche=Search. Bonus dynamiques. Clé ajoutée : `cosmetics`.

### ✅ Objets & Ressources (`Resources.tsx`) — TERMINÉ
Ressources : `recoltable`→`resources` (feuilles vertes 🌿). Consommables : `recipe`→`consumables`.
Divers : `chestGrey`→`inventory`. Recherche=Search. Clés ajoutées : `resources`,`consumables`.

> Hors-icônes (validé cette session) : suppression des modales → pages routées
> (ItemDetail/ResourceDetail/SetDetail/ClassDetail/HavenbagDetail) ; bouton **DetailBack**
> contextuel (section vs Retour) ; navbar qui suit le type d'objet ; pile de retour
> dédoublonnée (`itemNav`) ; pages de détail toujours ouvertes en haut.

### ✅ Havre-Sacs (`Havenbags.tsx` liste + `HavenbagDetail`) — TERMINÉ
Liste : recherche=Search, fond vignette=`havenbag`. Détail : en-tête=`havenbag`, **Décorations**:
`chestGrey`→`cupboard` (commode colorée, nouvelle clé). **Bouton DofusDB retiré**. **Agrandir**
refait à l'identique de la map monstres (bouton `zoom` → overlay plein écran + croix `closeRed`).
Décorations **laissées non cliquables** : les meubles DofusDB n'ont aucun id d'objet (que gfxId/
elementId, pas de nom) → pas de lien `/objets/:id` possible. Clé ajoutée : `cupboard`.

### ✅ Monsters / MonsterDetail / Classes (ClassDetail) — DÉJÀ FAITS (sessions précédentes)

### ✅ Succès (`Achievements.tsx`) — TERMINÉ
Validé par l'utilisateur sans changement (icônes déjà correctes).

### ✅ Skinator (`Skinator.tsx`) — TERMINÉ
Audit centré sur le **moteur Barbofus** (vue par défaut), icônes côté app hors webview.
« Ouvrir le moteur » → **icône retirée**. « Agrandir/Réduire » → **`zoom` (loupe) / `closeRed`
(croix rouge)** comme la map interactive des monstres. « Sauvegarder » (barre + modale) →
**`bank`** (banque/coffre, nouvelle clé bank.png). Imports lucide inutilisés supprimés
(Save/Maximize2/Minimize2/X/ChevronLeft/RefreshCw). Clé ajoutée : `bank`.
Modale « Quitter le Skinator ? » (`SkinatorLeavePrompt.tsx`) : « Laisser en fond » `tour`→
**`sablier`** ; « Fermer le moteur » `energie`(batterie)→**`lightning`** (éclair) ; croix
haut-droite `X`→**`closeRed`** (rouge). Clé ajoutée : `lightning` (client lightning.png).

### ✅ Mes Skins (`SkinatorSkins.tsx`) — TERMINÉ
Carte refondue (langage visuel du Builder) : rendu du skin en **fond plein cadre**, dégradé bas,
nom + date superposés, badge `#id`. Actions regroupées dans un **overlay au survol avec libellés**
(Charger / Renommer / Supprimer) → plus d'icônes muettes. Édition du nom dans un overlay dédié
(Valider/Annuler labellisés). En-tête + état vide → **`glyph`** (colle à la sidebar Mes Skins) ;
« Charger » → **`character`** (sidebar Skinator) ; « Renommer » → **texte seul** (pas d'asset
Dofus pertinent) ; bouton **Barbofus retiré** ; « Supprimer » → **`closeRed`** (croix rouge) ;
« Ouvrir le Skinator » croix `plus` teintée au **vert des flèches sidebar** (#04ff2d) ; « Annuler » (édition) →
**`closeRed`**. Carte refondue : `mix-blend-screen` retiré (voile blanc), barre d'actions en
**slide-up** au survol + nom qui remonte + halo violet/zoom doux. Imports lucide nettoyés.

### ✅ BuildGallery (`BuildGallery.tsx`) — TERMINÉ (design)
Cartes de la galerie refondues au style **Mes Skins** : illustration de classe plein cadre +
zoom au survol, halo violet, nom/meta qui remontent, **barre d'actions slide-up** (Ouvrir
=`characteristic` + Supprimer=`closeRed`). Encadré « Builder v1 » : `characteristic`→**`trophy`**.
« Créer le build » : `Plus`→**`plus` teinté vert** (#04ff2d, comme Mes Skins). Animation de
suppression corrigée : `AnimatePresence mode="popLayout"` + transition `layout` dédiée (reflow
propre, cartes qui se ré-empilent). Même correctif appliqué à **Mes Skins**. Imports
Plus/Trash2/ChevronRight nettoyés.

### ✅ Builder (éditeur `Builder.tsx`) — TERMINÉ
**Slots** : toutes silhouettes officielles distinctes (slotHat/slotCloak/slotAmulet/slotBelt/
slotBoots/slotRing/slotShield/slotWeapon/slotPet/slotDofus). **Sorts & dégâts** → `spells` ;
**Dofus & Trophées** → `dofus` (œuf, nouvelle clé) ; **Équipement** → `menuStuffs` (= sidebar
Équipements). **Supprimer le build** : tête de mort (`Trash2`=danger)→`closeRed`. **Rotation
perso** : swirl/blason `tour`→**flèches `ArrowLeft`/`ArrowRight`**. **Réinitialiser** : `tour`→
**`reset`** (flèche circulaire, asset client btnIcon_reset extrait, recoloré bleu #22d3ee).
**Auto-save retiré** → vrai bouton **Enregistrer** (`bank`). Croix **fermer modale Sorts** +
**Retirer un item** → **`closeRed`**. Modale sorts : « Limitation par tour par cible » +
« Utilisations par tour » → **`reset`** (bleu). Classe (sélecteur) → `emote` (fait avant).
Imports lucide nettoyés (Trash2/Save/X/RotateCcw/RotateCw). Clés ajoutées : `dofus`, `reset`.
Laissés tels quels (OK utilisateur) : Panoplies=`menuItemsets`, Bonus spéciaux=`etoile`,
Dommages & Résistances=`weapon`, Soutien & divers=`pv`, retour=`ArrowLeft`, Variante=`Shuffle`.

### ✅ Hunt (`Hunt.tsx`) — TERMINÉ (passe finale)
Sac/coffre du SectionHeader (`right`) **retiré**. « Quel est votre indice ? » : `pip`(ogrine)→
**`zoom`** (loupe bleue). Flèche distance « x map » (DistanceBadge) : violet→**vert `#34d399`**
(via `tint`/masque). `DIR_ICON` mort retiré. Gardés : Position=`world`, Direction=`map`, Votre
indice=`pp`, flèches directionnelles blanches, Continuer=`ChevronRight`, Données fiables=`BadgeCheck`.

### ✅ Almanax (`Almanax.tsx` + `almanaxBonusStyle` meta.ts) — TERMINÉ
Icônes de bonus refondues pour cohérence : loot/quality→**`reward`**, récolte/nature/pêche→
**`resources`**, craft/forgemagie→**`job`** (outils, nouvelle clé job.png), montures/amour→
**`mount`**. Gardés : xp, challenge=`epeesCroisees`, poverty=`kama`, music=`sagesse`, temporel=
`sablier`, défaut=`etoile`. **Carte principale** : pastille type de bonus (à droite des kamas)
`cadeau` statique → **`BonusIcon` dynamique**. « Aujourd'hui » (retour) `RotateCcw`(swirl)→
**`reset`**. Fermer calendrier `X`→**`closeRed`**. Imports lucide nettoyés (Coins/RotateCcw/X).
Clé ajoutée : `job`.

### ✅ Settings (`Settings.tsx` + `ClearCacheButton.tsx`) — TERMINÉ
« À propos » : `ShieldCheck`(blason)→**`info`**. « Mes données » : `workbenchOff`→`bank`→
**`inventory`**. Guides (stat + téléchargés) : `questGroup`→**`book`** (= sidebar). « Vérifier les
MAJ » : `RefreshCw`→**`reset`** (spinner Loader2 gardé). « Exporter mes données » : `Download`
(=cadeau !)→**`bank`**. **Vider le cache** (Settings + sidebar) + **Tout supprimer** (modale) :
`Trash2`(tête de mort)→**`closeRed`**. Sources « Données live » : icône `Github`→**`world`**,
ouverture **navigateur externe** (`target="_blank"`→setWindowOpenHandler), **Barbofus ajouté**.
Imports nettoyés (Download/ShieldCheck/Github/RefreshCw/Trash2). Laissés : Import=`Upload`,
spinner=`Loader2`, stats (etoile/dungeon/success/characteristic/character).

### ✅ Composants partagés (SlotPicker, DetailBack, ui.tsx) — VÉRIFIÉS
SlotPicker (Search=loupe, X=close, tris=flèches vertes), DetailBack (ArrowLeft=flèche verte),
ui.tsx (erreur=`AlertTriangle` triangle). **Fix** : `SearchX` (état vide « aucun résultat »)
`warning`→**`search`** (loupe) → un état vide ne ressemble plus à une erreur. Reste OK.

### ✅ TitleBar — RIEN À CHANGER
Barre de fenêtre maison : logo CodexMark (SVG marque) + nom + badges Dofus3/version. Aucune
icône générique/lucide.

### ✅ Guides (liste + GuideDetail + guideMarkup + GuideTabs/SyncBar) — TERMINÉ
Guides.tsx : « Tous »=`areaCross`→**`book`**, « En cours »=`tour`→**`sablier`** (+ badge carte),
« Principal »=`questGroup`→**`crown`** (doré), « Guide »=`questGroup`→**`book`**, avertissement→
**`book`**. guideCategory : Principal→`crown`, Guide→`book`. GuidesSyncBar : `questGroup`→**`book`**.
GuideTabs : « Liste »=`areaCross`→**`grid`** (asset btnIcon_grid). GuideDetail : Réinitialiser
`RotateCcw`(swirl)→**`reset`**, plein écran `Maximize2`/`Minimize2`→**`zoom`/`closeRed`**, +
overlay plein écran en **createPortal** (z-[60], top-10 sous TitleBar mac) + **GuideTabs** dedans
pour switcher. guideMarkup : position `MapPin`(ping=chapeau)→**`pin`** (btnIcon_pin cyan).

### ✅ PASSE GLOBALE DE COHÉRENCE (alias DofusIcons)
- `RefreshCw`/`RotateCcw`/`RotateCw` : `tour`(swirl/blason)→**`reset`** (flèche circulaire).
- `Download` : `cadeau`→**`download`** (btnIcon_update, vraie flèche de téléchargement).
- `SearchX` : `warning`→**`search`** (loupe ≠ erreur). `LayoutGrid` : `areaCross`→**`grid`**.
- `X` (toutes les croix de fermeture) : `close`(sombre)→**`closeRed`** → croix uniformes/visibles.
- `MapPin` : `ping`→**`pin`**.
**Assets extraits du client Dofus 3** (recolorés) : btnIcon_reset (bleu), btnIcon_update (slate),
btnIcon_grid (slate), btnIcon_pin (cyan) ; tx_crown recoloré doré.
Clés DofusIcon ajoutées sur l'ensemble de l'audit : bank, lightning, emote, dofus, reset, job,
download, grid, pin (+ celles des sessions précédentes).

## 🎉 AUDIT DES ICÔNES — TERMINÉ (toutes les pages + composants + passe globale).
