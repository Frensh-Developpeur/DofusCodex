# DofusCodex

Le compagnon **nouvelle génération** pour **Dofus 3** — un guide tout-en-un, thème dark,
animations soignées, données en temps réel. Application desktop **macOS & Windows** (Electron).

> Dans l'esprit de Ganymede, mais qui regroupe **tout** au même endroit.

## ✨ Fonctionnalités

- **Donjons** — liste filtrable (niveau, recherche, favoris) où **chaque carte affiche la
  vignette de son boss** (résolue via le flag `isBoss`). **22 guides de stratégie rédigés**
  d'après *DofusPourLesNoobs* (mécaniques de boss réelles : illusions, glyphes mortels,
  invulnérabilité, faiblesses élémentaires…), avec un générateur intelligent pour le reste.
  Fiche de donjon avec :
  - boss animé (aura, lévitation, glow),
  - stats du boss (PV / PA / PM / niveau),
  - barres de **résistances** animées (repère le point faible),
  - **mécaniques de combat** en phases déroulables (guides rédigés + fallback auto-généré),
  - conseils, composition conseillée, récompenses,
  - roster complet des monstres de la salle.
- **Chasse au trésor** — solveur type *Dofus Chasse* : position de départ + direction (←↑→↓),
  liste des maps triées par distance avec leurs indices, recherche d'indice qui pointe la **case
  exacte**, et chaînage « continuer d'ici » pour enchaîner les étapes.
- **Monstres** *(encyclopédie)* — recherche + filtre boss, fiche avec stats, résistances,
  **table de butin complète** (items + taux de drop) et **donjons où le croiser**.
- **Classes** — les 19 classes : tuiles colorées, **rôles & gameplay**, complexité et
  **progression des caractéristiques** par palier.
- **Stuffinator** — recherche d'équipement, filtres par emplacement (chapeau, cape, anneau,
  armes…) et par niveau. Fiche détaillée : caractéristiques colorées, stats d'arme, recette,
  **bonus de panoplie** par paliers et **« droppé par »** (sources de drop).
- **Builder** — composez votre stuff slot par slot (15 emplacements). Le **cumul des stats** et
  les **bonus de panoplies actives** se calculent en direct ; sauvegardez/chargez vos builds.
- **Quêtes** — parcours par niveau, filtre « quêtes de donjon », étapes détaillées à la demande,
  cases « fait » avec barré.
- **Almanax** — bonus du jour, offrande à déposer, kamas, et les **6 prochains jours**.
- **Progression** — favoris ⭐ et « fait » ✅ sur donjons et quêtes, persistés localement, avec
  compteurs sur l'accueil.

## 🔌 Données

Aucune clé requise — 100 % API publiques (CORS ouvert) :

- **[DofusDude](https://docs.dofusdu.de)** — items, équipements, sets, almanax (Dofus 3, FR).
- **[DofusDB](https://api.dofusdb.fr)** — donjons, monstres/boss, quêtes.

## 🚀 Démarrer

```bash
npm install      # installe les dépendances
npm run dev      # lance Vite + Electron en mode développement
```

## 📦 Packager les exécutables

```bash
npm run dist:mac   # .dmg + .zip (macOS)  ✅ testé
npm run dist:win   # installeur .nsis (Windows)
npm run dist       # plateforme courante
```

Les binaires sont générés dans `release/`.

> 🪟 **Build Windows depuis macOS/Linux** : `dist:win` requiert **wine** (l'installeur NSIS).
> Sans wine, lancez `dist:win` directement sur une machine **Windows** ou via une CI
> (GitHub Actions `runs-on: windows-latest`). Le build macOS, lui, fonctionne tel quel.

> 🎨 **Icône** : `build/icon.png` (1024×1024) est généré par `node build/gen-icon.cjs`.
> electron-builder en dérive automatiquement le `.icns` (macOS) et le `.ico` (Windows).

## 🛠 Stack

Electron · React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion · TanStack Query.

## 📁 Structure

```
build/           # gen-icon.cjs → icon.png (source des icônes mac/win)
electron/        # process principal (main) + preload (CSP, fenêtre frameless)
src/
  api/           # clients DofusDude & DofusDB + helpers fetch
  components/    # TitleBar, Sidebar, ItemModal, SlotPicker, primitives UI
  data/          # guides de donjons rédigés + métadonnées (slots, couleurs)
  hooks/         # useDebounce
  pages/         # Dashboard, Dungeons, DungeonDetail, Stuffinator, Builder, Quests, Almanax
  store/         # store local persistant (favoris, progression, builds)
```
