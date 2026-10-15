# Jeton

Les **Jetons** sont posés sur un [Exemplaire](exemplaire.md) d'une [Carte](carte.md) du [Terrain](terrain.md) pour comptabiliser des valeurs qui lui sont relatives. Type actuel :

- **Jeton Branche** : indique le niveau de croissance d'une plante ou d'un bâtiment (ressource individuelle « branches », voir [Ressource](ressource.md)). À chaque [Cycle](cycle.md), chaque exemplaire gagne un Jeton Branche (dans la limite de son maximum). Ils sont représentés par de petits cercles contenant le symbole branches (`SvgBranches`), en haut de l'exemplaire.

Le nombre d'exemplaires d'une carte n'est pas un jeton : voir [Exemplaire](exemplaire.md).

## Implémentation

- `Exemplaire.branches` / `branchesMax` (`src/jeu/etat.ts`) : un nombre de Jetons Branche par exemplaire.
- `src/jeu/Jeu.tsx` + `jeu.css` : cercles `jeu-jeton-branche` ; le symbole vient d'un `<template data-modele-jeton-branche>` rendu par `src/pages/jouer.astro`.

Sur les barrettes de ressources, des jetons servent déjà à suivre les valeurs (manuel).
