# Piocher

Piocher est le mécanisme qui consiste à prendre X cartes au hasard dans la [Pioche](pioche.md) pour les ajouter à la [Main](main.md).

## Règle

**Piocher X** = extraire les **X dernières entrées** de la Pioche et les ajouter à la fin de la Main.

- Le hasard vient uniquement du mélange initial de la Pioche : piocher est ensuite déterministe.
- Si la Pioche contient moins de X cartes, toutes les cartes restantes sont piochées (la Pioche devient vide, pas d'erreur).
- X négatif est traité comme 0.

## Début de partie

La Pioche est créée depuis le paquet, puis le joueur pioche 5 cartes (`TAILLE_MAIN_INITIALE`).

## Implémentation

- `src/jeu/piocher.ts` : `piocher(pioche, main, x)` (fonction pure).
- `src/jeu/etat.ts` : action `{ type: "piocher", nombre }`.
- `src/jeu/Jeu.tsx` : le bouton « Pioche » pioche 1 carte.
