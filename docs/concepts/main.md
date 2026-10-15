# Main

La **Main** est la liste des **Cartes** détenues par le joueur. Elle est affichée au-dessus de la barre de ressources sur la page Jouer. Dans l'interface cible, elle est au milieu de la ligne du bas, entre la [Pioche](pioche.md) (gauche) et la [Défausse](defausse.md) (droite), sous le [Terrain](terrain.md).

## Alimentation

Les cartes y sont ajoutées à la fin par [Piocher](piocher.md), depuis la [Pioche](pioche.md).

## Sortie

Les cartes quittent la Main quand elles sont [jouées](jouer-une-carte.md).

## Début de partie

La Main est remplie jusqu'à 8 cartes (`TAILLE_MAIN`) par la phase de pioche du premier [Cycle](cycle.md), puis à chaque nouveau cycle.

## Implémentation

- `src/jeu/etat.ts` : champ `main` de l'état du jeu, `TAILLE_MAIN`.
- `src/jeu/Jeu.tsx` : liste `jeu-main` ; cliquer une carte la joue.
