# Exemplaire

Un **Exemplaire** est une copie d'une [Carte](carte.md) posée sur le [Terrain](terrain.md). Une même carte peut être jouée plusieurs fois : elle n'apparaît qu'une fois sur le Terrain, avec autant d'exemplaires que de fois où elle a été jouée.

- Le **premier exemplaire** est la carte elle-même, posée par [Jouer une carte](jouer-une-carte.md).
- Chaque **exemplaire suivant** est une copie supplémentaire ; la carte jouée va ensuite dans la [Défausse](defausse.md).
- Chaque exemplaire est indépendant : il a ses propres [Jetons Branche](jeton.md) et son propre stock max de branches, qui ne sont pas partagés avec les autres.
- Chaque exemplaire compte séparément dans la production par cycle (voir [Cycle](cycle.md)).

## Représentation

Les exemplaires d'une carte forment une pile : le premier est devant, chaque exemplaire suivant est une carte derrière, dépassant légèrement par le haut (le fond des cartes est blanc pour masquer celles de derrière).

## Implémentation

- `src/jeu/etat.ts` : type `Exemplaire` (`branches`, `branchesMax`) ; `CarteTerrain.exemplaires` contient un élément par exemplaire, le premier étant la carte elle-même.
- `src/jeu/jouer.ts` : `ajouterExemplaire` ajoute un exemplaire à la carte du Terrain (ou la pose si c'est le premier).
- `src/jeu/Jeu.tsx` + `jeu.css` : pile de cartes (`jeu-pile`, `jeu-exemplaire`).
