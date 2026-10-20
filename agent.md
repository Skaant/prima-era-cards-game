# Conventions du projet (notes pour agents)

Notes issues de l'exploration du repo, à tenir à jour quand de nouvelles conventions apparaissent.

## Stack

- Astro (pages `.astro`) + îlot Preact (`client:only="preact"`) pour la partie jouable (`src/pages/jouer.astro` → `src/jeu/Jeu.tsx`).
- Pas de store global (redux/zustand) : état du jeu géré par un seul `useReducer(reducteur, ...)` dans `Jeu.tsx`, état initial via `etatInitial()` (`src/jeu/etat.ts`).
- TypeScript partout, français pour les identifiants de domaine (types, variables, fichiers) : `carte`, `paquet`, `pioche`, `defausse`, `terrain`, `exemplaire`, `branches`, `gains`, `couts`, `prerequis`, `tribu`, `ressource`.

## Documentation (`docs/`)

Deux dossiers avec des formats distincts et complémentaires — toujours écrire les deux pour une nouvelle mécanique :

- **`docs/concepts/*.md`** : prose explicative d'un concept. Sections typiques `## Données`, `## Usage`, `## Implémentation`, `## Références`, parfois `## Divergence connue` (pour documenter un écart assumé entre le concept et le code). La section `## Implémentation` liste les fichiers/types/fonctions concrets concernés, en chemins + backticks.
- **`docs/regles/*.md`** : table markdown stricte `| N° | Clé | Description | Histoire |`, une règle par ligne, `Clé` presque toujours vide, `Description` = règle terse en français. Les règles pas encore codées sont taguées `*(spec, non implémenté)*` dans la description.
- Skills dédiées : `maj-regles` (met à jour `docs/regles/` dès qu'une règle de gameplay est énoncée) et `sync-docs-code` (garde `docs/` et le code synchronisés) — à invoquer systématiquement sur ce genre de tâche.
- Pas encore de dossier `docs/features/` : à créer si besoin pour une doc de feature transverse (ex : tribus).

## Modèle de cartes

- Types sous `src/cartes/_types/` : `Carte` (`Carte.ts`), `CoutsCarte`, `GainsCarte`, `PrerequisCarte`, `ParRessource`.
- `GainsCarte.ressources[]` : gains de ressource, avec `stock?: true` (augmente un plafond plutôt que le stock courant), `parCycle?: true` (production récurrente, traitée dans `recalculerProduction`), `parRessource?` (gain proportionnel à une autre ressource), `prerequis?` (condition sur `branches.min/max/eq` de l'exemplaire, évaluée **à chaque recalcul**, pas accumulée).
- `GainsCarte.tribus[]` existe déjà dans le type (`id: IdTribu; value; parRessource?; parCycle?`) mais **n'est pas branché** dans `jouer.ts`/`production.ts` — scaffold posé pour une mécanique d'affinité de tribu pas encore implémentée (cf. feature "évolutions").
- `PrerequisCarte.tribus` existe aussi (seuils d'affinité par tribu) mais n'est pas évalué par le code actuel.
- Chaque paquet a : un fichier d'ids (`IdCartesXxx.ts`), un fichier de cartes (`xxx.cartes.ts` → `IndexCartes<IdCartesXxx>`), un fichier de paquet (`xxx.paquet.ts` → `Paquet<IdCartesXxx>` = `{ id, cartes: { [id]: quantite } }`). Registres globaux : `IdCartes.ts`, `toutes.cartes.ts` (`TOUTES_CARTES`), `IdPaquets.ts`, `tous.paquets.ts` (`TOUS_PAQUETS`).
- Attention : il existe un **second type `Paquet`** divergent sous `src/cartes/_types/Paquet.ts` (forme liste `{id, quantite}[]`, utilisé seulement par le paquet de la tribu Kolos) — ne pas confondre avec `src/cartes/paquets/Paquet.ts` (forme map, utilisé par le jeu). Documenté comme divergence connue dans `docs/concepts/paquet.md`.

## Ressources

- `IdRessource` (`src/ressources/IdRessource.ts`) : union large incluant beaucoup de ressources pas encore implémentées en jeu.
- Seul un sous-ensemble est un **stock global réellement suivi dans l'état** : `IdRessourceGlobale = "eau" | "jing" | "data" | "zums" | "energie"` (`src/jeu/etat.ts`), avec `RessourceGlobale = { stock, parCycle, stockMax }`. Liste canonique : `RESSOURCES_GLOBALES` (`src/jeu/ressources.ts`).
- `data` est global dans l'état bien que non marqué `stockGlobal` dans `src/data/ressources.ts` (divergence documentée dans `docs/concepts/ressource.md`).
- `branches`/`branchesMax` sont une ressource **individuelle par exemplaire** (`Exemplaire` dans `src/jeu/etat.ts`), pas globale : chaque copie posée d'une carte a son propre compteur. +1 branche par cycle automatique (plafonné à `branchesMax`) dans `phaseProduction` (`src/jeu/cycle.ts`).
- Tribus (`IdTribu`, `src/tribus/IdTribu.ts` + `TRIBUS` dans `src/data/tribus.ts`) : 30 tribus déjà cataloguées (nom + couleur) pour les pages `/les-tribus/*`, mais **pas de suivi d'affinité dans `EtatJeu`** à ce jour — à ajouter pour la feature évolutions.

## Immutabilité / recalcul

- `jouer.ts` : `copier(etat)` fait une copie superficielle contrôlée (ressources + terrain/exemplaires clonés) avant mutation en place, puis retour via `recalculerProduction`.
- `production.ts` : `recalculerProduction` **recalcule entièrement** `parCycle` à partir de l'état courant du terrain à chaque appel (pas d'accumulation incrémentale) — tout gain conditionnel (ex. `prerequis.ressources.branches.min`) est donc réévalué en live. C'est le pattern à suivre pour une valeur dérivée de l'état courant (ex : affinité de tribu qui diminue si une condition cesse d'être vraie).
- Appelé après chaque action qui change le terrain ou les choix "or" (`jouer`, `choisirRessourceOr(Groupe)`), et dans `nouveauCycle`.

## UI (`Jeu.tsx`)

- Pas de librairie de composants/modale : le seul pattern de "dialog" existant remplace entièrement le contenu de la bottom bar (`.jeu-bas`) par un state local (`dialog: "pioche" | "defausse" | null`), avec un bouton d'action contextuel + un bouton `✕ Fermer` (`.jeu-sortir`). Ouverture via `ouvrirDialog(type)` (ferme aussi la nav). Aucun composant modal plein écran n'existe encore — à inventer pour un nouveau besoin (ex : arbre d'évolutions plein écran).
- Contenu HTML de certaines cartes/icônes est pré-rendu côté Astro dans des `<template>` cachés sur `jouer.astro`, puis cloné via `innerHTML` dans l'îlot Preact (les composants Astro ne peuvent pas s'exécuter dans l'îlot). Voir `htmlCarte`, `htmlIconeData`, `htmlNavbar` dans `Jeu.tsx`/`htmlModeles.ts`.
- Bottom bar normale : deux `.jeu-bas-groupe` (gauche : Pioche/Main/Défausse ; droite : `Cycle N` + bouton "Nouveau cycle"). CSS dans `src/jeu/jeu.css`.

## Pioche / mélange

- `src/jeu/piocher.ts` : `melanger<T>()` (Fisher-Yates immuable), `creerPioche(paquet)` (déplie `paquet.cartes` puis mélange), `piocher(pioche, main, x)`, `piocherAvecRecyclage(pioche, defausse, main, x)` (recycle la défausse mélangée si la pioche est insuffisante).
