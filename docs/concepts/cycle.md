# Cycle

Une partie se déroule en plusieurs **cycles**, jusqu'à ce qu'un objectif de victoire soit atteint (80 waild, ou 200 data). Chaque cycle comporte trois phases (manuel : `src/pages/manuel/index.astro`) :

1. **Pioche** : remplir la [Main](main.md) jusqu'à 8 cartes (`TAILLE_MAIN`), avec [Recyclage](recyclage.md) si besoin.
2. **Pose de cartes et actions** : [Jouer des cartes](jouer-une-carte.md) (coûts payés) et utiliser les actions des cartes en jeu.
3. **Production** : comptage des gains de [Ressources](ressource.md) du cycle.

Ensuite, un nouveau cycle commence. Le premier cycle commence par sa phase de pioche (début de partie).

## Nouveau cycle

Le bouton « Nouveau cycle » (en haut de l'interface) termine le cycle en cours puis en démarre un :

1. **Production** (dans cet ordre) :
   - chaque exemplaire du [Terrain](terrain.md) qui a un stock de branches (stock max > 0) gagne **1 branche** (dans la limite de son stock max) ;
   - l'**énergie est réinitialisée** à 0 ;
   - chaque ressource globale ajoute sa **production par cycle** à son stock, dans la limite du stock max.
2. **Pioche** : la Main est remplie jusqu'à 8 cartes.

### Production par cycle

La production d'une ressource globale est la somme :
- des gains `parCycle` des cartes du Terrain, comptés pour chaque exemplaire (un gain conditionnel sur les branches n'est compté que si celles de l'exemplaire sont suffisantes) ;
- de l'effet des zums : **+1 data et +1 énergie par zum** (partie entière du stock de zums).

## Implémentation

- `src/jeu/cycle.ts` : `phasePioche`, `phaseProduction`, `nouveauCycle`. Action `{ type: "nouveau-cycle" }` dans `src/jeu/etat.ts` ; champ `cycle`.
- `src/jeu/production.ts` : `recalculerProduction` (met à jour `parCycle` à chaque changement du Terrain ou des zums).
- `src/jeu/Jeu.tsx` : bouton « Nouveau cycle » et numéro du cycle en haut.
- Pas implémenté : choix par carte en phase de pioche (main / paquet stase / défausse définitive), actions des cartes, objectifs de victoire.
