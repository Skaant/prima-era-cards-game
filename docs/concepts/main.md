# Main

La **Main** est la liste des **Cartes** détenues par le joueur. Elle est affichée au-dessus de la barre de ressources sur la page Jouer. Dans l'interface cible, elle est au milieu de la ligne du bas, entre la [Pioche](pioche.md) (gauche) et la [Défausse](defausse.md) (droite), sous le [Terrain](terrain.md).

## Alimentation

Les cartes y sont ajoutées à la fin par [Piocher](piocher.md), depuis la [Pioche](pioche.md).

## Sortie

Les cartes quittent la Main quand elles sont [jouées](jouer-une-carte.md) (non implémenté).

## Début de partie

La Main est initialisée en piochant 5 cartes (`TAILLE_MAIN_INITIALE`).

## Implémentation

- `src/jeu/etat.ts` : champ `main` de l'état du jeu, `TAILLE_MAIN_INITIALE`.
- `src/jeu/Jeu.tsx` : liste `jeu-main`.
