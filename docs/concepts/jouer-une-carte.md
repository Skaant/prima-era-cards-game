# Jouer une carte

Jouer une carte consiste à la faire passer de la [Main](main.md) au [Terrain](terrain.md), en **payant ses coûts** (`Carte.couts`) et en **récoltant ses gains** (`Carte.gains`) en [Ressources](ressource.md). Le prérequis (`Carte.prerequis`) doit être respecté.

## Destination de la carte

- **Première fois** : le premier exemplaire reste sur le Terrain, sauf les cartes de type **Action** qui vont directement dans la [Défausse](defausse.md).
- **Exemplaires suivants** : ajoutent un [Jeton Quantité](jeton.md) sur le premier exemplaire du Terrain, puis la carte jouée va dans la Défausse.

## Quand

Pendant la phase « pose de cartes et actions » du [Cycle](cycle.md).

## Implémentation

Pas encore implémenté. Les données utiles existent dans `Carte` (`src/cartes/_types/Carte.ts`) : `type`, `prerequis`, `couts`, `gains`.
