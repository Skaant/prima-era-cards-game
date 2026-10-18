# Cycle

Une partie se déroule en plusieurs **cycles**, jusqu'à ce qu'un objectif de victoire soit atteint (80 waild, ou 200 data). Chaque cycle comporte trois phases (manuel : `src/pages/manuel/index.astro`) :

1. **Pioche** : piocher `cartesParTour` cartes dans la [Main](main.md), avec [Recyclage](recyclage.md) si besoin.
2. **Pose de cartes et actions** : [Jouer des cartes](jouer-une-carte.md) (coûts payés) et utiliser les [Actions des cartes](action-de-carte.md) en jeu.
3. **Production** : comptage des gains de [Ressources](ressource.md) du cycle.

Ensuite, un nouveau cycle commence. Au début de la partie, la Main ne contient que le **Vaisseau-graine** et `cartesParTour` vaut 0 : le premier cycle ne pioche donc rien tant que le Vaisseau-graine n'est pas posé.

## Nouveau cycle

Le bouton « Nouveau cycle » (en haut de l'interface) termine le cycle en cours puis en démarre un :

1. **Production** (dans cet ordre) :
   - chaque exemplaire du [Terrain](terrain.md) qui a un stock de branches (stock max > 0) gagne **1 branche** (dans la limite de son stock max) ;
   - l'**énergie est réinitialisée** à 0 ;
   - chaque ressource globale ajoute sa **production par cycle** à son stock, dans la limite du stock max ;
   - les utilisations des [Actions des cartes](action-de-carte.md) (`fois`) sont remises à zéro.
2. **Pioche** : `cartesParTour` cartes sont piochées dans la Main (voir [Pioche](pioche.md)).

### Production par cycle

La production d'une ressource globale, ainsi que `cartesParTour`, sont la somme des gains `parCycle` des cartes du Terrain, comptés pour chaque exemplaire (un gain conditionnel sur les branches n'est compté que si celles de l'exemplaire sont suffisantes). La production des ressources globales ajoute en plus l'effet des zums : **+1 data et +1 énergie par zum** (partie entière du stock de zums).

## Implémentation

- `src/jeu/cycle.ts` : `phasePioche`, `phaseProduction`, `nouveauCycle`. Action `{ type: "nouveau-cycle" }` dans `src/jeu/etat.ts` ; champ `cycle`.
- `src/jeu/production.ts` : `recalculerProduction` (met à jour `parCycle` et `cartesParTour` à chaque changement du Terrain ou des zums).
- `src/jeu/Jeu.tsx` : bouton « Nouveau cycle » et numéro du cycle en haut.
- Pas implémenté : choix par carte en phase de pioche (main / paquet stase / défausse définitive), objectifs de victoire.
