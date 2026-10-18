# Pioche

La **Pioche** est une liste ordonnée de **Cartes** (ids).

## Création

Elle est créée à partir d'un [Paquet](paquet.md) : chaque carte y apparaît autant de fois que son nombre dans le paquet (`Paquet.cartes`), puis la liste est mélangée (Fisher-Yates). Le hasard vient uniquement de ce mélange initial.

Pour l'instant, seul le paquet de base (`src/cartes/paquets/base/base.paquet.ts`) existe.

## Usage

Les cartes sont extraites de la fin de la Pioche par [Piocher](piocher.md) et ajoutées à la [Main](main.md).

## Recyclage

Quand la Pioche est vide, la [Défausse](defausse.md) est mélangée et ajoutée à la Pioche : voir [Recyclage](recyclage.md).

## Implémentation

- `src/jeu/piocher.ts` : `creerPioche(paquet)`, `melanger`.
- `src/jeu/etat.ts` : champ `pioche` de l'état du jeu ; `etatInitial` crée la Pioche (paquet hors cartes de départ).
- `src/jeu/cycle.ts` : `phasePioche` pioche `cartesParTour` cartes.
- `src/jeu/Jeu.tsx` : la Pioche (bas gauche) affiche le nombre de cartes restantes ; on pioche via la phase de pioche du [Cycle](cycle.md), avec recyclage.
