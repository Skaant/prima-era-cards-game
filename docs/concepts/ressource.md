# Ressource

Le mécanisme principal du jeu est de transformer des ressources en d'autres. Une ressource est une valeur numérique, suivie sur les barrettes de ressources (`src/ressources/barrettes/Barrette.astro`) avec des jetons. Ses données sont dans `RESSOURCES` (`src/data/ressources.ts`).

Ressources concernées ici : **eau**, **jing**, **data**, **zums**, **branches**, **actions**.

## Globales et individuelles

- **Globale** : un seul stock pour toute la partie (`stockGlobal`). Eau, jing, zums, actions.
- **Individuelle** : liée à une [Carte](carte.md) ou à ses [Jetons](jeton.md) (`stockIndividuel`). Seules les **branches** pour l'instant (croissance d'une plante ou d'un bâtiment organique).
- La **data** n'a pas de stock : elle est comptée (objectif de victoire : 200 data).

## Production par cycle

Lors de la phase de production du [Cycle](cycle.md), la production par cycle ajoute des ressources au stock. Ressources avec `parCycle` : eau, jing, data, zums.

- Les **zums** produisent chacun +1 data et +1 action par cycle (`ResumeZums`).
- Les **actions** servent à jouer les cartes Action ou utiliser les actions des cartes en jeu ; elles ne sont pas conservées entre les cycles.

## Stock max

Certaines ressources sont stockables jusqu'à leur **stock max** : le stock ne peut jamais le dépasser. Sont concernées :

- globales : **eau**, **jing**, **zums** ;
- individuelle : **branches** (stock max propre à chaque carte/jeton).

## Implémentation

- `src/jeu/etat.ts` : `RESSOURCES_GLOBALES` (eau, jing, data, zums, actions), `RessourceGlobale = { stock, parCycle }`.
- Pas encore implémenté : stock max, ressources individuelles (branches), application de la production.
- Divergence : `RESSOURCES` n'a pas de champ de stock max, et `data` est traitée comme globale dans `etat.ts`.
