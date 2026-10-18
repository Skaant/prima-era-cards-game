# Jouer une carte

Jouer une carte consiste à la faire passer de la [Main](main.md) au [Terrain](terrain.md), en **payant ses coûts** (`Carte.couts`) et en **récoltant ses gains** (`Carte.gains`) en [Ressources](ressource.md). Le prérequis (`Carte.prerequis`) doit être respecté.

## Destination de la carte

Un [Exemplaire](exemplaire.md) est ajouté à la carte du Terrain (le premier si c'est la première fois qu'elle est jouée, un supplémentaire sinon), puis la carte jouée va dans la [Défausse](defausse.md) — sauf si elle est `unique` (voir [Carte](carte.md)) : elle disparaît alors au lieu d'aller en Défausse, et ne peut donc plus être rejouée ni repiochée.

Les cartes de type **Action** suivent désormais cette même règle : elles sont posées gratuitement sur le Terrain (pas de `couts`/`gains` au niveau de la carte), leur coût et leur gain étant ceux de leur action (voir [Action de carte](action-de-carte.md)), répétable chaque cycle.

## Quand

Pendant la phase « pose de cartes et actions » du [Cycle](cycle.md).

## Implémentation

- `src/jeu/jouer.ts` : `jouer(etat, index, cartes)`, `peutJouer(etat, carte)`. Action `{ type: "jouer", index }` dans `src/jeu/etat.ts`. Dans `Jeu.tsx`, cliquer une carte de la Main la joue (désactivée si les coûts ne sont pas payables).
- `Carte.unique` (`src/cartes/_types/Carte.ts`) : si vrai, `jouer` n'ajoute pas la carte à `defausse`.
- Après chaque carte jouée, la production par cycle est recalculée (voir [Cycle](cycle.md)).
- Coûts : seuls les coûts en ressources globales sans `parCycle` ni `parRessource` sont payés.
- Gains immédiats : `stock: true` augmente le stock max (global, ou branches de l'exemplaire), les autres augmentent le stock (plafonné au stock max). Les gains `parCycle` sont comptés dans la production, pas immédiats. Ignorés : gains conditionnels (`prerequis`), `parRessource`, `stockIndividuel`, `autres`.
- Les `prerequis` de la carte ne sont pas vérifiés (waild n'est pas suivi).
