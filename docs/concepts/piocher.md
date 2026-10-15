# Piocher

Piocher est le mécanisme qui consiste à prendre X cartes au hasard dans la [Pioche](pioche.md) pour les ajouter à la [Main](main.md).

## Règle

**Piocher X** = extraire les **X dernières entrées** de la Pioche et les ajouter à la fin de la Main.

- Le hasard vient uniquement du mélange initial de la Pioche : piocher est ensuite déterministe.
- Si la Pioche contient moins de X cartes, toutes les cartes restantes sont piochées (la Pioche devient vide, pas d'erreur), puis la [Défausse](defausse.md) est [recyclée](recyclage.md) pour piocher le reste (`piocherAvecRecyclage`).
- X négatif est traité comme 0.

## Début de partie

La Pioche est créée depuis le paquet, puis la phase de pioche du premier [Cycle](cycle.md) remplit la Main jusqu'à 8 cartes (`TAILLE_MAIN`). Dans l'interface, la Pioche n'est plus cliquable : on ne pioche qu'en phase de pioche.

## Implémentation

- `src/jeu/piocher.ts` : `piocher(pioche, main, x)` (fonction pure).
- `src/jeu/etat.ts` : action `{ type: "piocher", nombre }`.
- `src/jeu/Jeu.tsx` : le bouton « Pioche » pioche 1 carte.
