# Terrain

Le **Terrain** est la zone de jeu où persistent les [Cartes](carte.md) jouées, avec leurs [Exemplaires](exemplaire.md).

## Interface

Le Terrain occupe la partie haute de l'interface de jeu. En bas, sur une ligne : la [Pioche](pioche.md) à gauche, la [Main](main.md) au milieu, la [Défausse](defausse.md) à droite.

## Alimentation

Les cartes y arrivent par [Jouer une carte](jouer-une-carte.md), y compris les cartes de type **Action** (posées gratuitement, voir [Action de carte](action-de-carte.md)). Une carte jouée plusieurs fois n'y figure qu'une fois, avec un [Exemplaire](exemplaire.md) par fois jouée.

Au début de la partie, le **Vaisseau-graine** est dans la Main (hors Pioche) : il doit être joué comme n'importe quelle carte pour rejoindre le Terrain. Une fois posé, ses gains sont récoltés (+3 zums ; stocks max +5 eau, +5 jing, +3 zums ; production +1 eau, +1 jing, +2 cartes par tour par cycle).

## Implémentation

- `src/jeu/etat.ts` : champ `terrain` (`CarteTerrain[]` : `id` + `exemplaires`, voir [Exemplaire](exemplaire.md)).
- `src/jeu/etat.ts` : `CARTES_DE_DEPART` (retirées de la Pioche dans `etatInitial`, données en Main de départ).
- Les gains `stock: true` augmentent le stock max (voir [Ressource](ressource.md)).
- `src/jeu/Jeu.tsx` : liste `jeu-terrain` en haut ; ligne du bas `jeu-bas` (Pioche, Main, Défausse).
