# HANDOFF — Rédaction des guides de donjon

But : remplir l'objet `GUIDES` de `src/data/dungeonGuides.ts` avec un guide rédigé par donjon,
**sourcé depuis DofusPourLesNoobs (DPLN)**. 44 guides sont faits, **~75 restent** (liste dans
`docs/remaining-guides.tsv`). Ne JAMAIS inventer de mécaniques : si un donjon n'est pas
récupérable/mappable, on le saute (un générateur générique sert de fallback dans l'app).

## Protocole OBLIGATOIRE — lot par lot compilé
Pour chaque lot de ~8 donjons :
1. Récupère le contenu DPLN des 8 (voir « Récupération » ci-dessous).
2. Insère les 8 entrées dans l'objet `GUIDES`, **juste avant le `};` qui ferme l'objet**
   (la ligne juste avant `const DANGER_BY_PHASE`). Outil Edit.
3. **Compile** : `npx tsc --noEmit` (cwd racine projet). DOIT passer. Si erreur → corrige
   AVANT de continuer. On n'avance jamais au lot suivant tant que `tsc` échoue.
4. Affiche un bilan court (« Lot N : ids [...], tsc OK »).
Ainsi chaque lot est sauvegardé et le fichier reste toujours compilable (anti-perte de tokens).

Traite par **niveau croissant** (ordre de `docs/remaining-guides.tsv`).

## Format d'une entrée `DungeonGuide` (clé = id DofusDB)
Respecte EXACTEMENT les entrées existantes comme modèle. Champs :
- `summary`: string (2-3 phrases) · `recommendedLevel`: string (ex `"100 — 130"`)
- `composition`: string · `keyResist`: string[] (éléments à taper)
- `phases`: BossPhase[] (2-4) où chaque phase = `{ title, hp?: "100% — 50%", mechanics: string[], danger: "low"|"medium"|"high"|"extreme" }`
- `tips`: string[] · `rewards`: string[]
- TOUT en français. Commentaire `// <Nom du donjon> — <Boss>` au-dessus de chaque entrée.
Le `danger` monte avec le niveau/la phase finale.

## Récupération du contenu DPLN
URL = `https://www.dofuspourlesnoobs.com/<slug>` où `<slug>` est la colonne 4 de
`docs/remaining-guides.tsv` (slugs déjà **normalisés en ASCII**, ex `chateau-ensable.html`).
- Utilise l'outil **WebFetch** sur l'URL avec ce prompt :
  « Boss strategy, concise: boss name; element to hit; 3-5 key mechanics (short bullets);
  2-3 tips; composition/difficulty. If no special mechanic, say so. »
- Les pages DPLN sont hébergées **sans accents** (é→e, è→e, â→a, œ→oe…) — d'où les slugs ASCII.
  WebFetch fonctionne donc sur la quasi-totalité.

### Cas « apostrophe » (4 donjons, slug à vérifier)
Ces slugs contiennent encore `'` et 404 tels quels. Trouve le vrai slug en testant des
variantes (apostrophe → `-`, ou supprimée, ou `-d-`) avec `curl -s -o /dev/null -w "%{http_code}"` :
- id 39  Cale de l'Arche d'Otomaï
- id 66  Potager d'Halouine
- id 44  Repaire de Sphincter Cell (slug DPLN : `donjon-des-rats-du-chateau-d...amakna.html`)
- id 57  Hypogée de l'Obsidiantre  (tenter `hypogee-de-lobsidiantre.html`)
- id 74  Pyramide d'Ombre          (tenter `pyramide-dombre.html`)
Si introuvable → saute et note-le.

### Non mappés (pas de guide DPLN) → SAUTER
- id 96  Temple Maudit d'Araknas
- id 95  Défi du Chalœil

## Ids DÉJÀ FAITS (ne pas refaire) — 44 entrées
1, 4, 6, 7, 8, 9, 11, 13, 14, 17, 18, 19, 21, 24, 25, 27, 30, 32, 33, 34, 35, 36,
45, 47, 48, 51, 52, 59, 60, 67, 70, 71, 76, 88, 89, 90, 91, 100, 105, 110, 113, 116, 138, 142.
(id 3 = Bibliothèque du Maître Corbac est ENCORE À FAIRE, présent dans remaining-guides.tsv.)

(Pour vérifier à tout moment quels ids sont présents :
`grep -oE "^  [0-9]+: \{" src/data/dungeonGuides.ts`)

## À la toute fin
`npm run build` (doit réussir), puis l'utilisateur lance `npm run dev` ou `npm run dist:mac`
pour voir tous les guides. Récapitule : total ajouté, ids, donjons sautés (avec raison).

## Sources
- Index DPLN des donjons : https://www.dofuspourlesnoobs.com/donjons.html
- Données ids/niveaux DofusDB déjà extraites dans `docs/remaining-guides.tsv`.
