# Recyclage

Lorsque la [Pioche](pioche.md) est vide, les cartes de la [Défausse](defausse.md) sont **mélangées** puis **ajoutées dans la Pioche**. La Défausse devient vide.

Le mélange est le même que pour la création de la Pioche (`melanger`, `src/jeu/piocher.ts`).

## Implémentation

- `src/jeu/piocher.ts` : `piocherAvecRecyclage(pioche, defausse, main, x)`. Si la Pioche se vide en cours de pioche, la Défausse est mélangée et on continue.
- Le bouton Pioche n'est désactivé que si Pioche et Défausse sont vides.
