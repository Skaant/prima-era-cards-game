# Défausse

La **Défausse** est le paquet où sont stockées les [Cartes](carte.md) jouées, avant d'être recyclées.

## Alimentation

Toute carte jouée y va après avoir posé son [Exemplaire](exemplaire.md) sur le Terrain (voir [Jouer une carte](jouer-une-carte.md)), sauf les cartes `unique` (voir [Carte](carte.md)), qui disparaissent au lieu d'y aller.

## Action Défausser (dialog)

Cliquer sur la Défausse remplace la bottom bar par le même dialog, avec le bouton « Défausser +1 [data] » (et une croix pour fermer). La Main est alors affichée et cliquer une carte la sélectionne ; le bouton (actif seulement avec une carte sélectionnée) la place dans la Défausse et donne +1 data (`GAIN_DEFAUSSER`).

## Recyclage

Quand la [Pioche](pioche.md) est vide, la Défausse est mélangée et ajoutée à la Pioche : voir [Recyclage](recyclage.md).

## Interface

En bas à droite de l'interface, à droite de la [Main](main.md).

## Implémentation

- `src/jeu/etat.ts` : champ `defausse`.
- `src/jeu/etat.ts` : action `defausser`.
- `src/jeu/Jeu.tsx` : bouton « Défausse » en bas à droite, qui ouvre le dialog.
