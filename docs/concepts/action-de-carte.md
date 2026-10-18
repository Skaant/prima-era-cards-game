# Action de carte

Une **Action de carte** est une transformation de [Ressources](ressource.md) que l'exemplaire d'une [Carte](carte.md) posée sur le [Terrain](terrain.md) propose, en plus de ses gains. Par exemple, Découvreureuse propose l'action « Temps libre » (coûte 1 énergie, rapporte 1 data).

Les cartes de type **Action** (ex. Collecte du wa) sont un cas particulier : posées gratuitement sur le Terrain (pas de `couts`/`gains` au niveau de la carte, voir [Carte](carte.md)), leur seul coût et gain sont ceux de leur unique action, répétable chaque cycle contre ce coût. Comme pour les autres cartes, leurs exemplaires s'accumulent sur le Terrain à chaque fois qu'elles sont jouées.

## Règles

- **Coûts et gains** : comme ceux d'une carte (`Carte.couts` / `Carte.gains`), payés en ressources globales et récoltés immédiatement. Seuls les coûts/gains simples (ressources globales, sans `parCycle` ni `parRessource`) sont pris en compte, le reste est ignoré (mêmes limites que [Jouer une carte](jouer-une-carte.md)).
- **Limite `fois`** : une action peut être limitée à un nombre d'utilisations par [Cycle](cycle.md) (`fois.value`). Le compteur est remis à zéro à chaque nouveau cycle.
- Le compteur d'utilisation est propre à chaque [Exemplaire](exemplaire.md) : jouer l'action d'un exemplaire ne consomme pas les utilisations des autres exemplaires de la même carte. Chaque exemplaire affiche sa propre icône pour la jouer (voir Exemplaire pour l'affichage sur les exemplaires masqués), grisée indépendamment des autres.
- **Action groupée** : si une carte a plusieurs exemplaires, une ligne sous sa pile propose, par action, un bouton qui la joue pour chaque exemplaire un par un (dans l'ordre de la liste), en vérifiant à chaque exemplaire que son coût peut encore être payé. Dès qu'un exemplaire ne peut plus payer (ressources insuffisantes ou limite `fois` atteinte), l'exécution s'arrête : les exemplaires précédents ont déjà joué l'action, les suivants ne la jouent pas.

## Quand

Pendant la phase « pose de cartes et actions » du [Cycle](cycle.md), comme jouer une carte.

## Implémentation

- `src/jeu/actions.ts` : `peutUtiliserAction(etat, carte, idCarte, exemplaireIndex, actionIndex)`, `utiliserAction(etat, idCarte, exemplaireIndex, actionIndex, cartes)` ; `utiliserActionGroupe(etat, idCarte, actionIndex, cartes)` rejoue `utiliserAction` pour chaque exemplaire, dans l'ordre, et s'arrête au premier qui ne change pas l'état (signe que l'action n'a pas pu être jouée). Actions `{ type: "jouer-action", idCarte, exemplaireIndex, actionIndex }` et `{ type: "jouer-action-groupe", idCarte, actionIndex }` dans `src/jeu/etat.ts`.
- `src/jeu/etat.ts` : champ `actionsUtilisees` (compteur par clé `${idCarte}:${exemplaireIndex}:${actionIndex}`), remis à `{}` dans `nouveauCycle` (`src/jeu/cycle.ts`).
- `src/cartes/ListeCarte/CarteItem/CarteItemActions.astro` : chaque action est un `<button data-action-carte={id} data-action-index={index}>` ; l'exemplaire concerné est déduit de l'ancêtre `[data-exemplaire-index]` (voir Exemplaire), pas d'un attribut dédié.
- `src/jeu/ExemplairesCarte.tsx` : ligne d'actions groupées (`jeu-actions-groupees`, `jeu-actions-groupees-boutons`), un bouton par action (`[data-action-groupe-carte]`), affiché seulement si la carte a plusieurs exemplaires ; désactivé si le premier exemplaire ne peut pas jouer l'action (sinon l'exécution groupée ne ferait rien).
- `src/jeu/Jeu.tsx` : délégation de clic sur `.jeu-terrain` (dispatch `jouer-action` avec l'exemplaire déduit de `[data-exemplaire-index]`, ou `jouer-action-groupe` pour `[data-action-groupe-carte]`) ; un effet synchronise l'attribut `disabled` de chaque bouton d'action d'exemplaire avec `peutUtiliserAction` (les boutons groupés sont désactivés directement en JSX, voir ci-dessus).
- Pas implémenté : `fois.parRessource`, coûts/gains `parRessource` ou `parCycle`, `prerequis` d'action.
