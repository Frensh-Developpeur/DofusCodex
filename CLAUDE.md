# DofusCodex — contexte projet

App desktop **macOS + Windows** (Electron) : guide nouvelle génération pour **Dofus 3**.
Thème dark, animations Framer Motion. Données live, **sans clé API**.

## Stack
Electron · React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion · TanStack Query · React Router (HashRouter).

## Commandes
```bash
npm run dev        # Vite + Electron en dev, hot reload (fenêtre DofusCodex)
npm run build      # build du renderer (dist/)
npm run dist:mac   # .dmg + .zip dans release/   (dist:win pour Windows = nécessite wine)
npx tsc --noEmit   # typecheck (toujours le faire après une modif de données)
```

## Architecture
```
electron/main.cjs        # process principal : fenêtre frameless, CSP (dev vs prod), liens externes
electron/preload.cjs      # bridge contextIsolation (getPlatform)
src/api/
  client.ts               # getJson + qs helpers
  dofusdude.ts            # API DofusDude (items, équipements, sets, almanax)
  dofusdb.ts              # API DofusDB (donjons, monstres, drops, quêtes, classes, chasse)
src/components/           # TitleBar, Sidebar (groupée), ItemModal, SlotPicker, ErrorBoundary, ui.tsx
src/data/
  dungeonGuides.ts        # ★ guides de donjon rédigés (GUIDES) + générateur générique fallback
  wantedPosters.ts        # ★ avis de recherche rédigés (WANTED_POSTERS, 81 criminels, source DofusPourLesNoobs)
  meta.ts                 # slots, couleurs d'effets, levelTone
src/store/store.ts        # store persistant (favoris, progression, builds) via useSyncExternalStore
src/lib/dedupe.ts         # dedupeById (garde-fou anti-doublons)
src/api/ganymede.ts       # API Ganymède (guides communautaires : liste + détail à la demande)
src/lib/guideMarkup.tsx   # renderer du markup Ganymède (cross-links donjon/item/monstre/guide)
src/lib/guideDb.ts        # stockage local des guides en IndexedDB (timeout + repli réseau)
src/lib/guideStore.ts     # accès guides local-first + synchro « tout télécharger »/mise à jour
src/pages/                # Dashboard, Dungeons, DungeonDetail, Stuffinator, Builder,
                          # Guides, GuideDetail, Almanax, Hunt (chasse au trésor), Monsters,
                          # Wanted + WantedDetail (avis de recherche : liste filtrable + fiche stratégie)
```

## APIs — règles & pièges (IMPORTANT)
- **DofusDude** : `https://api.dofusdu.de/dofus3/v1/fr`. `ankama_id` d'un item == `id` DofusDB == `objectId` d'un drop (même espace d'ids).
- **DofusDB** : `https://api.dofusdb.fr` (Feathers). Pièges rencontrés :
  - **`$limit` plafonné à 50** → pagination via `$skip` (useInfiniteQuery + bouton « Charger plus »).
  - **Tri instable** sur les ex æquo → toujours un tri secondaire par id : `$sort[champ]=1&$sort[id]=1`. Sinon doublons entre pages.
  - **Recherche de nom** : `name.fr[$regex]=(?i)<terme>` (flag inline `(?i)`). Le service **monstres REFUSE `$options`** → ne jamais l'utiliser.
  - **Donjons** : exclure les « Expédition … » via `name.fr[$regex]=(?i)^(?!.*expédition)` (combiné à la recherche dans le même regex). Voir `dungeonNameClause`.
  - **Champs `img` virtuels** : avec `$select`, `img` devient `.../undefined.png`. Pour les items, sélectionner `iconId` et construire `…/img/items/{iconId}.png`. Pour les monstres, sélectionner `gfxId` → `…/img/monsters/{gfxId}.png`.
  - **Boss d'un donjon** : identifié par le flag `isBoss` (PAS le plus haut niveau). Fallback = dernier monstre déclaré. Voir `getMonstersLite` / `pickBoss`.
  - **Chasse au trésor** : `GET /treasure-hunt?x=&y=&direction=` (0=droite, 2=bas, 4=gauche, 6=haut), renvoie les maps + leurs `pois` (indices).
- **Ganymède** (guides) : prod = `https://ganymede-app.com/api/guides` (≈700 guides toutes langues, renvoyés d'un coup ; filtrage `lang`/`status` côté client). Détail = `…/guides/{id}` → `steps[]` `{name, map, pos_x, pos_y, text}`. ⚠️ `api.ganymede-dofus.com` est mort, `dev.ganymede-dofus.com/api` ne sert que les 95 guides `gp`. Le `text` est un markup hybride (Unity `<color=#hex>`/`<align>`/`<link>` + HTML + balises maison `<item>/<monster>/<dungeon>/<quest>/<guide>` avec id DofusDB) → rendu par `src/lib/guideMarkup.tsx`, qui transforme les entités en liens internes :
  - `<dungeon dofusdb>` → `/donjons/{id}` ; `<guide id step>` → navigue dans le lecteur **en écrivant l'étape dans le store avant** (pour que « Retour » reprenne au bon endroit — l'étape courante est pilotée par `store.guideStep`, source unique).
  - `<item dofusdb>` → ItemModal. ⚠️ l'`dofusdb` d'un item est un id **DofusDB**, pas Ankama : DofusDude (équipement) renvoie 404 sur ressources/suiveurs/consommables → ItemModal bascule alors sur `getDbItem` (DofusDB `/items?id=`).
  - `<monster dofusdb>` → `MonsterModal` (`src/components/MonsterModal.tsx`, extrait de la page Monstres).
  - `<quest dofusdb>` / blocs de quête : le `questid` du bloc est un id **interne Ganymède** (trompeur) ; le vrai id DofusDB est sur la balise `<quest dofusdb=…>`. Pour les quêtes de **donjon**, `resolveQuestDungeon` remonte quête → stepIds → objectifs → `need.generated.dungeons` et la puce devient un lien `/donjons/{id}` (ex. quête « Donjon en Mousse » 896 → Château Ensablé 19).
  - ⚠️ **`ganymede-dofus.com` est mort** (migré vers ganymede-app.com) : ses icônes (`icon_quest.png`, `icon_dungeon.png`) renvoient une erreur → `EntityIcon` les ignore et retombe sur une icône lucide.
  - **Pré-téléchargement (fluidité)** : les guides peuvent être stockés en **IndexedDB** (`guideDb.ts`) pour une navigation instantanée. `guideStore.ts` lit local-first puis réseau en repli (IDB protégé par timeout 3 s → jamais de blocage). L'utilisateur télécharge tout une fois via la barre `GuidesSyncBar` (page Guides) ; `App.tsx` relance une synchro de fond si `lastSync` > 3 j (diff par `updated_at`, ne re-télécharge que le changé). Aucun serveur à héberger. (Pas de gestion hors-ligne dédiée : sans réseau, le jeu lui-même est injouable.)
- **CSP** : hôtes autorisés déclarés dans `electron/main.cjs` (`buildCsp`). Toute nouvelle source réseau/image doit y être ajoutée. `img-src` autorise `https:` (images de guides hébergées sur hôtes variés : i.ibb.co, etc.).

## Gotchas React
- `useStore(selector)` doit renvoyer des **primitives ou des refs stables** (un objet littéral neuf provoque une boucle de rendu infinie avec `useSyncExternalStore` → React #185). Un cache shallow-equal est en place, mais préférer les sélecteurs primitifs.
- `motion.custom` n'existe plus en Framer Motion v11 → utiliser `motion(Component)`.

## Travail en cours
**Rédaction des guides de donjon** (sourcés DofusPourLesNoobs) — ✅ **TERMINÉE**.
122 guides rédigés dans `GUIDES` (`src/data/dungeonGuides.ts`). Un seul donjon reste au
générateur générique : **id 96 Temple Maudit d'Araknas** — c'est un donjon de **quête**
(lignée Bonta « L'ascension de Qu'Tan »), sans guide de mécaniques de boss pertinent.
Méthode/historique conservés dans **`HANDOFF.md`**.
