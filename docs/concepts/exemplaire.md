# Exemplaire

Un **Exemplaire** est une copie d'une [Carte](carte.md) posée sur le [Terrain](terrain.md). Une même carte peut être jouée plusieurs fois : elle n'apparaît qu'une fois sur le Terrain, avec autant d'exemplaires que de fois où elle a été jouée.

- Le **premier exemplaire** est posé par [Jouer une carte](jouer-une-carte.md) ; la carte jouée va ensuite dans la [Défausse](defausse.md) (sauf si elle est `unique`, voir [Carte](carte.md)).
- Chaque **exemplaire suivant** est une copie supplémentaire, posée de la même façon.
- Chaque exemplaire est indépendant : il a son propre stock de branches ([Ressource](ressource.md) individuelle) et son propre stock max de branches, qui ne sont pas partagés avec les autres.
- Chaque exemplaire compte séparément dans la production par cycle (voir [Cycle](cycle.md)).

## Représentation

Les exemplaires d'une carte forment une pile : un seul exemplaire est **actif** (affiché en entier), appelé **current**. Par défaut, le current est le dernier exemplaire de la liste (le plus récemment posé) ; jouer une carte déjà présente sur le Terrain rend current son nouvel exemplaire (même si un exemplaire précédent était affiché en entier). Le current est affiché en entier, par-dessus tous les autres ; son ordre dans la liste des exemplaires (`CarteTerrain.exemplaires`) n'est jamais modifié par ce choix, purement visuel.

Les autres exemplaires (masqués) dépassent légèrement de leur emplacement habituel, qui dépend de leur position par rapport au current :

- ceux qui le **précèdent** dans la liste dépassent par le haut, espacés d'un petit pas depuis le haut de la pile (comme s'il n'y avait rien au-dessus du current) ;
- ceux qui le **suivent** dépassent par le bas, décalés d'une carte entière sous le current (pour ne pas être recouverts par sa carte affichée en entier), puis d'un petit pas supplémentaire par exemplaire intermédiaire.

Plus un exemplaire masqué est proche du current (dans la liste), plus son z-index est élevé : il recouvre les exemplaires masqués plus éloignés du current. Par exemple, si le current est le dernier exemplaire (cas par défaut), le premier exemplaire de la liste (le plus éloigné) a le z-index le plus faible, et chaque exemplaire suivant a un z-index plus élevé jusqu'au current, qui dépasse tous les autres.

Un exemplaire masqué n'affiche pas le contenu de la carte, seulement un bandeau avec :

- à gauche, une chip indiquant la quantité de branches de l'exemplaire, au format `branches / branchesMax` (s'il y en a) ;
- à droite, une icône par [Action de carte](action-de-carte.md) de la carte, grisée si l'action n'est pas utilisable pour cet exemplaire précis (voir `peutUtiliserAction` ; le compteur d'utilisation `fois` est propre à chaque exemplaire). Cliquer sur une icône joue directement cette action pour cet exemplaire sans le rendre actif.

### Actions et choix "or" groupés

Si une carte a plusieurs exemplaires, une ligne apparaît sous sa pile :

- à gauche, si la carte a un gain `autres` de type `"or"` (choix de ressource entre plusieurs options, voir `Carte.gains`), les mêmes boutons radio que ceux affichés dans la carte current, mais appliqués à tous les exemplaires à la fois : cliquer sur une option change le choix de chaque exemplaire (`choixOr`). La sélection affichée reflète l'état de tous les exemplaires : une option cochée si tous l'ont choisie, aucune si elle diffère d'un exemplaire à l'autre ;
- à gauche aussi, pour chaque gain `on.activable` de la carte, la même case d'activation que dans la carte current, appliquée à tous les exemplaires à la fois (cochée si tous l'ont active) ;
- à droite, un bouton par action de la carte, qui la joue pour chaque exemplaire un par un (voir [Action de carte](action-de-carte.md)).

### Gains sur augmentation (`on`)

Un gain `on` (voir `docs/regles/gains-sur-augmentation.md`) s'affiche `+N <ressource> (max X/cycle) :` devant le gain. S'il est `activable`, une case à cocher (cochée par défaut) permet d'activer ou désactiver l'effet pour l'exemplaire affiché. L'état (désactivation, compteur de ressources gagnées, déclenchements du cycle) est propre à chaque exemplaire (`EtatJeu.effetsOn`).

### Jauge de branches

Une carte ayant un stock de branches (gain `{ id: "branches", stock: true }`) n'affiche pas ce gain dans ses gains : il est représenté à la place par une **jauge**, juste au-dessus des gains, composée :

- d'un libellé `branches [icône branches] / branchesMax` (ex. `0 🌿 / 3`) ;
- d'une ligne découpée en rectangles, un par branche possible (`branchesMax`), chacun muted par défaut, noir pour chacune des `branches` acquises.

Elle n'apparaît que sur les cartes concernées.

- Dans la [Main](main.md), ou juste après avoir joué la carte (avant tout gain de branche), la jauge affiche 0 sur le stock max déclaré par la carte (ex. `0 🌿 / 3`), aucun rectangle noir.
- Une fois l'exemplaire current dans la pile du [Terrain](terrain.md), la jauge affiche son propre état (`branches` / `branchesMax`), qui peut différer d'un exemplaire à l'autre de la même carte.

Cliquer sur un exemplaire (current ou masqué), hors des icônes d'action, le rend current : c'est lui qui est désormais affiché en entier. C'est un choix purement visuel, propre à l'affichage (pas à l'état du jeu) : l'ordre des exemplaires dans la liste n'est jamais modifié, seul l'emplacement affiché de chacun est recalculé en fonction du nouveau current (voir Représentation ci-dessus). Cela n'a aucun effet sur les règles (production, actions, etc.), qui sont insensibles à l'exemplaire current.

## Implémentation

- `src/jeu/etat.ts` : type `Exemplaire` (`branches`, `branchesMax`) ; `CarteTerrain.exemplaires` contient un élément par exemplaire, le premier étant la carte elle-même (ordre figé, jamais modifié par l'affichage).
- `src/jeu/jouer.ts` : `ajouterExemplaire` ajoute un exemplaire à la carte du Terrain (ou la pose si c'est le premier).
- `src/jeu/actions.ts` : `peutUtiliserAction(etat, carte, idCarte, exemplaireIndex, actionIndex)` indique si une action précise est utilisable pour cet exemplaire, pour griser son icône sur les exemplaires masqués ; `utiliserActionGroupe` pour l'action groupée (voir [Action de carte](action-de-carte.md)).
- `src/jeu/production.ts` : `choisirRessourceOrGroupe(etat, idCarte, autreIndex, ressourceId, cartes)` applique le choix "or" à tous les exemplaires de la carte (action `choisir-ressource-or-groupe`).
- `src/jeu/prerequis.ts` : les gains `on` s'enregistrent dans les mêmes listeners que les prérequis (`enregistrerListeners`) et se déclenchent depuis `ajusterRessourceGlobale` / `ajusterValeurExemplaire` (et `notifierAugmentation` pour la production de `cycle.ts`) ; `definirEffetOnActif` active/désactive un effet (actions `basculer-effet-on` et `basculer-effet-on-groupe`), `effetOnActif` lit son état. Les `fois` sont remis à 0 dans `nouveauCycle`.
- `src/cartes/ListeCarte/CarteItem/CarteItemOn.astro` : affichage du préfixe `on` et case d'activation (`input[data-on-carte][data-on-type][data-on-index]`) ; `htmlGainOn` (`htmlModeles.ts`) la réutilise pour la ligne groupée, et `Jeu.tsx` la synchronise avec `effetsOn` et dispatche l'action au clic.
- `src/jeu/htmlModeles.ts` : `htmlGainOr(id, autreIndex)` récupère le fieldset "or" (`[data-or-carte][data-or-index]`) déjà rendu dans le modèle de carte cloné, réutilisé tel quel pour la ligne d'actions groupées.
- `src/jeu/ExemplairesCarte.tsx` : composant affichant la pile des exemplaires d'une carte du Terrain (`jeu-carte-terrain` > `jeu-pile`, `jeu-exemplaire`, `jeu-exemplaire-actif` pour le current) ; bandeau d'exemplaire masqué (`jeu-exemplaire-masque`, `jeu-branches-chip`, `jeu-actions-masquees`, `jeu-action-masquee` ; icône d'action réutilisant le modèle `data-modele-chip-energie` de `src/pages/jouer.astro`) ; `topExemplaire` calcule le `top` de chaque exemplaire selon sa position par rapport au current (`actif`) et `hauteurPile` la hauteur totale de la pile (constantes `PAS_REM`, `CARTE_PX`, `BANDE_REM`, à garder cohérentes avec `jeu.css` et `.carte-item`) ; z-index calculé en CSS à partir de la distance au current (`--distance`, voir `jeu.css`) ; si plus d'un exemplaire, ligne `jeu-actions-groupees` (choix "or" via `htmlGainOr`, boutons `[data-action-groupe-carte]` désactivés directement en JSX via `peutUtiliserAction` sur le premier exemplaire).
- `src/cartes/ListeCarte/CarteItem/CarteItemJaugeBranches.astro` : jauge par défaut (0 rempli), affichée sur une carte ayant un gain `branches` de type `stock`, sur son stock max déclaré (`jauge-branches-label` pour le libellé — `.jauge-branches-x` pour la quantité, icône `SvgBranches`, puis `/ branchesMax` — `jauge-branches` avec un `jauge-branches-segment` par branche possible) ; utilisée par `CarteItem.astro`, juste au-dessus de `CarteItemGains` (Main, catalogue, et modèle `<template data-modele-carte>` cloné pour l'exemplaire current du Terrain).
- `src/cartes/ListeCarte/CarteItem/CarteItemGains.astro` : exclut les gains `branches` de type `stock` de l'affichage des gains (représentés par la jauge, pas en texte).
- `src/jeu/Jeu.tsx` : état local `exemplaireActif` (par id de carte, hors `useReducer`, car purement visuel, défaut au dernier exemplaire) ; clic délégué sur `.jeu-terrain` (via `data-carte-terrain` sur la pile et `data-exemplaire-index` sur l'exemplaire) qui met à jour `exemplaireActif`, sauf sur un bouton `[data-action-carte]` (dispatch `jouer-action`, exemplaire déduit de l'ancêtre `[data-exemplaire-index]`), un bouton `[data-action-groupe-carte]` (dispatch `jouer-action-groupe`) ou un radio `[data-or-ressource]` (dispatch `choisir-ressource-or` ou, dans `.jeu-actions-groupees`, `choisir-ressource-or-groupe`) ; le bouton d'une carte de la Main met aussi `exemplaireActif[id]` sur l'index du nouvel exemplaire (nombre d'exemplaires actuel de la carte sur le Terrain) avant de dispatcher `jouer`, pour qu'il devienne current ; un `useEffect` met à jour, sur l'exemplaire current (`.jeu-exemplaire-actif`) de chaque pile, la jauge de branches clonée depuis le modèle (`.jauge-branches-x` avec la quantité de branches, segments `.jauge-branches-segment`, classe `jauge-branches-segment-remplie` pour les `branches` premiers) avec le propre stock de l'exemplaire (`branches` / `branchesMax`, ce dernier déjà figé dans le modèle cloné).
