# Piocher

Piocher est le mécanisme qui consiste à prendre X cartes au hasard dans la [Pioche](pioche.md) pour les ajouter à la [Main](main.md).

## Règle

**Piocher X** = extraire les **X dernières entrées** de la Pioche et les ajouter à la fin de la Main.

- Le hasard vient uniquement du mélange initial de la Pioche : piocher est ensuite déterministe.
- Si la Pioche contient moins de X cartes, toutes les cartes restantes sont piochées (la Pioche devient vide, pas d'erreur), puis la [Défausse](defausse.md) est [recyclée](recyclage.md) pour piocher le reste (`piocherAvecRecyclage`).
- X négatif est traité comme 0.

## Début de partie

La Main de départ ne contient que le **Vaisseau-graine**, et la [Pioche](pioche.md) contient le reste du paquet. La phase de pioche de chaque cycle pioche `cartesParTour` cartes (la ressource produite par le Vaisseau-graine, voir [Ressource](ressource.md)). En dehors de la phase de pioche, on peut piocher 1 carte via l'action de la Pioche (voir ci-dessous).

## Action Piocher (dialog)

Cliquer sur la Pioche remplace la bottom bar par un dialog : à gauche le bouton « Piocher {x} [data] », à droite une croix pour fermer. Le coût **x = 1 + le nombre de fois où l'action a déjà été utilisée ce cycle** (compteur `piochesPayantes`, remis à 0 à chaque nouveau cycle). Le bouton est désactivé si Pioche et Défausse sont vides, ou si la data est insuffisante.

## Implémentation

- `src/jeu/piocher.ts` : `piocher(pioche, main, x)` (fonction pure).
- `src/jeu/etat.ts` : action `{ type: "piocher", nombre }`.
- `src/jeu/etat.ts` : action `piocher-payant`, `coutPiocher`, `peutPiocherPayant`, champ `piochesPayantes`.
- `src/jeu/Jeu.tsx` : le bouton « Pioche » ouvre le dialog.
