# Main

La **Main** est la liste des **Cartes** détenues par le joueur. Elle est affichée au-dessus de la barre de ressources sur la page Jouer. Dans l'interface cible, elle est au milieu de la ligne du bas, entre la [Pioche](pioche.md) (gauche) et la [Défausse](defausse.md) (droite), sous le [Terrain](terrain.md).

## Alimentation

Les cartes y sont ajoutées à la fin par [Piocher](piocher.md), depuis la [Pioche](pioche.md).

## Sortie

Les cartes quittent la Main quand elles sont [jouées](jouer-une-carte.md).

## Début de partie

La Main de départ contient uniquement le **Vaisseau-graine** (`CARTES_DE_DEPART`). La [Pioche](pioche.md) existe dès le début ; la phase de pioche de chaque [Cycle](cycle.md) ajoute des cartes à la Main (0 tant que le Vaisseau-graine n'est pas posé, `cartesParTour` valant 0).

## Taille

Le nombre de cartes piochées à chaque cycle n'est plus fixe : il est égal à `cartesParTour`, la ressource « cartes par tour » produite par les cartes du Terrain (le Vaisseau-graine en produit 2 par cycle). Elle est affichée dans le bouton Main de l'interface, à côté du nombre de cartes en main.

## Implémentation

- `src/jeu/etat.ts` : champ `main` de l'état du jeu ; `CARTES_DE_DEPART` ; champ `cartesParTour`.
- `src/jeu/production.ts` : `recalculerProduction` calcule `cartesParTour` à partir des gains `cartes-par-tour` (`parCycle`) des cartes du Terrain.
- `src/jeu/Jeu.tsx` : liste `jeu-main` ; cliquer une carte la joue ; bouton Main affiche `cartesParTour`.
