# Ressource

Le mécanisme principal du jeu est de transformer des ressources en d'autres. Une ressource est une valeur numérique, suivie sur les barrettes de ressources (`src/ressources/barrettes/Barrette.astro`) avec des jetons. Ses données sont dans `RESSOURCES` (`src/data/ressources.ts`).

Ressources concernées ici : **eau**, **jing**, **data**, **zums**, **branches**, **énergie**.

## Globales et individuelles

- **Globale** : un seul stock pour toute la partie (`stockGlobal`). Eau, jing, zums, énergie.
- **Individuelle** : liée à chaque [Exemplaire](exemplaire.md) d'une [Carte](carte.md), représentée par des [Jetons](jeton.md) (`stockIndividuel`). Seules les **branches** pour l'instant (croissance d'une plante ou d'un bâtiment).
- La **data** n'a pas de stock : elle est comptée (objectif de victoire : 200 data).

## Production par cycle

Lors de la phase de production du [Cycle](cycle.md), la production par cycle ajoute des ressources au stock. Ressources avec `parCycle` : eau, jing, data, zums.

- Les **zums** produisent chacun +1 data et +1 énergie par cycle (`ResumeZums`).
- L'**énergie** sert à jouer les cartes Action ou utiliser les actions des cartes en jeu ; elle n'est pas conservée entre les cycles.

## Stock max

Certaines ressources sont stockables jusqu'à leur **stock max** : le stock ne peut jamais le dépasser. Sont concernées :

- globales : **eau**, **jing**, **zums** ;
- individuelle : **branches** (stock max propre à chaque carte/jeton).

## Implémentation

- `src/jeu/ressources.ts` : `RESSOURCES_GLOBALES` (eau, jing, data, zums, energie), `stockMaxInitial(id)`.
- `src/jeu/etat.ts` : `RessourceGlobale = { stock, parCycle, stockMax }`.
- Stock max : **0 au départ** pour eau, jing, zums ; il augmente en jouant des cartes dont un gain est marqué `stock: true` (p. ex. Vaisseau-graine : +5 eau, +5 jing, +3 zums). Ces gains sont appliqués avant les gains de stock de la même carte. Data et énergie sont illimitées.
- Branches (individuelles) : `Exemplaire.branches` / `branchesMax` (`src/jeu/etat.ts`, voir [Exemplaire](exemplaire.md)). Un gain `{ id: "branches", stock: true }` augmente le stock max de l'exemplaire joué ; +1 branche par exemplaire et par [Cycle](cycle.md) tant que son max n'est pas atteint.
- Production par cycle : voir [Cycle](cycle.md). L'énergie est remise à 0 avant la production.
- Divergence : `data` est traitée comme globale dans `etat.ts` alors que `RESSOURCES` ne lui donne pas de stock global.
