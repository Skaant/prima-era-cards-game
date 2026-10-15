# Jouer une carte

Jouer une carte consiste à la faire passer de la [Main](main.md) au [Terrain](terrain.md), en **payant ses coûts** (`Carte.couts`) et en **récoltant ses gains** (`Carte.gains`) en [Ressources](ressource.md). Le prérequis (`Carte.prerequis`) doit être respecté.

## Destination de la carte

- **Première fois** : la carte devient le premier [Exemplaire](exemplaire.md) sur le Terrain, sauf les cartes de type **Action** qui vont directement dans la [Défausse](defausse.md).
- **Fois suivantes** : un exemplaire supplémentaire est ajouté à la carte du Terrain, puis la carte jouée va dans la Défausse.

## Quand

Pendant la phase « pose de cartes et actions » du [Cycle](cycle.md).

## Implémentation

- `src/jeu/jouer.ts` : `jouer(etat, index, cartes)`, `peutJouer(etat, carte)`. Action `{ type: "jouer", index }` dans `src/jeu/etat.ts`. Dans `Jeu.tsx`, cliquer une carte de la Main la joue (désactivée si les coûts ne sont pas payables).
- Après chaque carte jouée, la production par cycle est recalculée (voir [Cycle](cycle.md)).
- Coûts : seuls les coûts en ressources globales sans `parCycle` ni `parRessource` sont payés.
- Gains immédiats : `stock: true` augmente le stock max (global, ou branches de l'exemplaire), les autres augmentent le stock (plafonné au stock max). Les gains `parCycle` sont comptés dans la production, pas immédiats. Ignorés : gains conditionnels (`prerequis`), `parRessource`, `stockIndividuel`, `autres`.
- Les `prerequis` de la carte ne sont pas vérifiés (waild n'est pas suivi).
