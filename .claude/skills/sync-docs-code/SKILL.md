---
name: sync-docs-code
description: Keeps docs/ and code in sync. Use whenever a task changes code that a doc in docs/ describes, or changes a doc in docs/ (concepts, features, specs). Ensures the counterpart is updated, and that code changes implied by doc changes are included in the initial plan.
---

# Synchronisation documentation ↔ code

`docs/` (notamment `docs/concepts/`) et le code (`src/`) décrivent les mêmes choses. Si l'un change, l'autre doit suivre dans la même tâche. Ne rien inventer : la doc ne décrit que ce qui est spécifié ou présent dans le code.

## Avant de commencer (planification)

1. **Repérer les liens.** Chaque doc de concept a des sections `Références` / `Implémentation` qui pointent vers des fichiers de `src/`. Pour une tâche donnée :
   - Tâche sur du code → `grep` le chemin/identifiant modifié dans `docs/` pour trouver les docs concernées.
   - Tâche sur une doc → lire ses références vers `src/` pour trouver le code concerné.
2. **Évaluer l'impact dans les deux sens, dès le plan initial.**
   - Un changement de doc (nouvelle règle, champ, comportement, renommage) peut impliquer des changements de code parfois importants (types, fonctions pures dans `src/jeu/`, état, composants Astro/Preact, pages, données de cartes/paquets). Les lister **dans le plan initial** avec les fichiers visés, pas après coup.
   - Un changement de code peut rendre des docs obsolètes (chemins, noms d'identifiants, signatures, comportements). Les lister aussi.
3. Si le plan est conséquent (le changement de doc entraîne beaucoup de code), présenter le plan complet (doc + code) à l'utilisateur avant d'implémenter.

## Pendant l'implémentation

- Appliquer doc et code ensemble, pas l'un sans l'autre.
- Garder le vocabulaire français du projet (ex. « paquet », « pioche », « main ») identique dans les deux.
- Mettre à jour les chemins de fichiers cités dans les docs lors de tout déplacement/renommage (`git mv`).
- Si la doc et le code se contredisent déjà, ne pas trancher seul : signaler la divergence à l'utilisateur.

## Vérification finale

- `grep` des anciens noms/chemins dans `docs/` et `src/` : aucune occurrence résiduelle.
- Chaque chemin cité dans une doc modifiée existe.
- Chaque comportement décrit dans une doc modifiée correspond au code (signatures, valeurs par défaut, cas limites).
- Dans le message final, indiquer brièvement ce qui a été mis à jour côté doc et côté code, et toute divergence laissée volontairement.
