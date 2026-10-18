# Zum

Un **Zum** est une unité individuelle de la [Ressource](ressource.md) zums : une instance avec ses propres propriétés, plutôt qu'une simple valeur stockée. Chaque unité du stock global de zums devient ainsi un objet traçable individuellement, un peu comme un [Exemplaire](exemplaire.md) a son propre stock individuel de branches.

## Association à une carte

Lorsqu'une carte de type **zum** est jouée ([Jouer une carte](jouer-une-carte.md)), son coût en zums ne décrémente **pas** le stock global : une unité Zum disponible (non encore associée) est simplement associée à l'exemplaire créé. Le stock global de zums reste donc le total de tous les Zum existants, libres ou associés.

Cette unité associée :

- n'est plus disponible pour payer le coût d'une autre carte : le stock « libre » (payable) est le stock global **moins** le nombre de Zum déjà associés à un exemplaire du Terrain ;
- reste associée à cet exemplaire de façon **définitive**, pour le reste de la partie (ne redevient jamais libre, même si la carte est ensuite défaussée) ;
- est la **seule** à pouvoir payer le coût en énergie des actions de cette carte : une action de la carte dépense les points d'énergie propres à ce Zum, pas le stock d'énergie global.

## Production

L'association ne change pas la production par cycle des zums (voir [Cycle](cycle.md), [Ressource](ressource.md)) : chaque Zum, libre ou associé, continue de produire +1 data et +1 énergie dans les stocks globaux à chaque cycle (le stock global les compte tous).

## Implémentation

- `src/jeu/etat.ts` : `Exemplaire.zumsAssocies`, nombre de Zum associés à cet exemplaire (0 par défaut, voir [Exemplaire](exemplaire.md)) ; `zumsMobilises(etat)`, somme des `zumsAssocies` de tous les exemplaires du Terrain.
- `src/jeu/jouer.ts` : `peutJouer` compare un coût en zums au stock libre (`stock - zumsMobilises`), pas au stock global ; `jouer` — pour un coût en zums d'une carte de type `zum`, le stock global n'est pas modifié, seule `zumsAssocies` de l'exemplaire créé augmente.
- `src/jeu/production.ts` : `recalculerProduction` compte, pour l'effet des zums (+1 data, +1 énergie par zum), le stock global directement (il inclut déjà les Zum associés).
- Pas encore implémenté : dépense de l'énergie propre d'un Zum associé dans les actions des cartes (les actions des cartes ne sont pas encore jouables, voir [Cycle](cycle.md)).
