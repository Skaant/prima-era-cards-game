# Piocher

Piocher est le mécanisme qui consiste à prendre X cartes au hasard dans la **Pioche** pour les ajouter à la **Main**.

## Concepts

- **Pioche** : liste ordonnée de cartes (ids). Elle est créée à partir d'un deck : chaque carte y apparaît autant de fois que son nombre dans le deck (`Deck.cartes`), puis la liste est mélangée (Fisher-Yates). Pour l'instant, seul le deck de base (`src/cartes/decks/base/base.deck.ts`) existe.
- **Main** : liste des cartes détenues par le joueur, affichée au-dessus de la barre de ressources sur la page Jouer.

## Règle

**Piocher X** = extraire les **X dernières entrées** de la Pioche et les ajouter à la fin de la Main.

- Le hasard vient uniquement du mélange initial : piocher est ensuite déterministe.
- Si la Pioche contient moins de X cartes, toutes les cartes restantes sont piochées (la Pioche devient vide, pas d'erreur).
- X négatif est traité comme 0.

## Début de partie

La Pioche est créée depuis le deck, puis le joueur pioche 5 cartes (`TAILLE_MAIN_INITIALE`).

## Implémentation

- `src/jeu/piocher.ts` : `creerPioche(deck)`, `piocher(pioche, main, x)` (fonctions pures), `melanger`.
- `src/jeu/etat.ts` : état du jeu (`pioche`, `main`, `ressources`) et action `{ type: "piocher", nombre }`.
- `src/jeu/Jeu.tsx` : îlot Preact de la page Jouer ; le bouton « Pioche » pioche 1 carte.
