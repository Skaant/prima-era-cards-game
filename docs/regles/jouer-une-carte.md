# Jouer une carte

| N° | Clé | Description | Histoire |
|----|-----|-------------|----------|
| 1 | | Jouer une carte la fait passer de la Main au Terrain, pendant la phase de pose de cartes et actions. | |
| 2 | | Pour jouer une carte, chaque coût en ressource globale (eau, jing, data, zums, énergie) doit être couvert par le stock (pour les zums, le stock libre, voir règle 11) ; sinon la carte ne peut pas être jouée. | |
| 3 | | Jouer une carte paie ses coûts en les retirant des stocks. Les coûts « par cycle » ou « proportionnels » ne sont pas payés. *(spec, non implémenté)* | |
| 4 | | Les gains immédiats de la carte (ni « par cycle », ni conditionnels, ni proportionnels) sont récoltés dès qu'elle est jouée. | |
| 5 | | Les gains conditionnels (prérequis), proportionnels, de stock individuel et les gains « autres » non « par cycle » ne sont pas appliqués à la pose. *(spec, non implémenté)* | |
| 6 | | Le prérequis d'une carte (ex. Dom : waild ≤ 55) doit être respecté pour la jouer : seules ses conditions sur les ressources globales et les tribus comptent (la carte n'a pas encore d'exemplaire sur le Terrain, donc une condition individuelle comme les branches ne peut pas s'appliquer). | |
| 7 | | Une carte jouée va ensuite dans la Défausse. | |
| 8 | | Une carte « unique » (ex. Vaisseau-graine) disparaît une fois jouée : pas de Défausse, elle ne peut plus être rejouée ni repiochée. | |
| 9 | | Une carte de type Action est posée gratuitement sur le Terrain : son coût et son gain sont ceux de son unique action. | |
| 10 | | Les cartes de type Zum (ex. Découvreureuse, Ramasseureuse) qui coûtent des zums : les zums payés restent dans le stock global (il n'est pas décrémenté) mais sont associés définitivement à l'exemplaire créé. | |
| 11 | | Un zum associé à un exemplaire ne retourne jamais au stock libre, même si la carte est défaussée : le stock libre payable est le stock global moins le nombre de zums déjà associés à un exemplaire du Terrain, et un zum associé ne peut plus payer le coût d'une autre carte. | |
| 12 | | Un zum associé continue de produire +1 data et +1 énergie par cycle (phase-de-production, règle 6). | |
| 13 | | Seul le zum associé à une carte peut payer le coût en énergie des actions de cette carte (énergie propre au zum, et non l'énergie globale). *(spec, non implémenté)* | |
