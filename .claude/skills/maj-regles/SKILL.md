---
name: maj-regles
description: Maintient docs/regles/ à jour avec les règles de jeu énoncées pendant la conversation. À appeler à CHAQUE fois qu'on touche au gameplay (mécanique, coût, gain, condition, résultat, cas limite), même en passant ou dans une demande de code : modifie les règles existantes concernées ou crée de nouvelles règles. Ne concerne pas les modifications purement techniques du code ni celles de l'interface, sauf si une règle dépend de l'interface ou l'impacte.
---

# Mise à jour des règles de jeu

`docs/regles/` contient la liste numérotée des règles du jeu, un fichier par section (objectif, mise en place, cycle, phase de pioche, piocher, actions pioche/défausse, ressources et stock, phase de production, jouer une carte, actions des cartes, terrain, exemplaire, cartes du paquet de base). Cette liste doit refléter ce que l'utilisateur spécifie au fil des sessions.

## Quand agir

Ce skill est appelé **à chaque fois qu'on touche au gameplay du jeu**. À chaque message de l'utilisateur, se demander : **touche-t-il au gameplay, c'est-à-dire énonce-t-il une règle nouvelle ou différente de celles de `docs/regles/` ?** Exemples : un coût, un gain, une condition, une limite, un ordre de résolution, un cas limite, la suppression d'une mécanique, une contrainte (« X ne sera jamais négatif »).

Ne pas agir pour :
- les modifications techniques du code (refactoring, types, performance, outillage, tests…) sans effet sur les règles ;
- les modifications d'interface (mise en page, style, libellés, composants), **sauf** si une règle dépend de l'interface ou l'impacte (ex. un bouton qui ouvre une action du jeu, un choix du joueur fait via l'interface) : dans ce cas, noter la règle de jeu qui en découle, pas le détail visuel ;
- les questions, ou les règles déjà présentes à l'identique.

## Procédure

1. **Lire** les fichiers de `docs/regles/` concernés (grep des mots-clés : ressource, carte, phase…) pour trouver les règles existantes touchées.
2. **Choisir** :
   - la règle existante est contredite, précisée ou supprimée → **modifier** sa description (ou la retirer) en conservant son numéro ;
   - la règle est nouvelle → **créer** une ligne dans la section la plus proche, avec le **numéro libre suivant dans ce fichier** (max du fichier + 1 ; la numérotation recommence à 1 dans chaque fichier). Si aucune section ne convient, créer un nouveau fichier `docs/regles/<section>.md` sur le même modèle.
   - une phrase de l'utilisateur peut impliquer plusieurs règles : une règle = une mécanique ou un résultat conditionné, à décrire séparément.
3. **Écrire** au format du tableau : `| N° | Clé | Description | Histoire |`. Ne remplir ni « Clé » ni « Histoire » (réservés à l'utilisateur) ; ne jamais les modifier s'ils sont remplis.
4. **Numéros et clés** : le numéro n'est qu'un repère de conversation (l'utilisateur s'en sert pour prompter) ; ce qui identifie une règle dans les références (code notamment) est sa **clé**. Les clés peuvent rester vides tant qu'il n'y a pas de références. Quand une règle disparaît, les suivantes du fichier **sont renumérotées (−1)** pour que les numéros restent continus. Si une règle en cite une autre, le renvoi indique le fichier et le numéro (« phase-de-production, règle 6 ») ; après toute renumérotation, corriger les renvois concernés (ou citer la clé si elle existe).
5. **Marquer** `*(spec, non implémenté)*` une règle énoncée mais absente du code ; retirer cette mention si le code l'applique désormais.
6. **Cohérence** : si la règle modifiée est aussi décrite dans `docs/concepts/` ou dans le code, appliquer le skill `sync-docs-code`. En cas de contradiction entre règles, ne pas trancher seul : la signaler.
7. **Ne rien inventer** : n'écrire que ce que l'utilisateur a dit ou que le code fait.

## Compte rendu

Terminer par une ligne indiquant les règles ajoutées/modifiées/retirées (numéros et fichiers), ou « aucune règle nouvelle » si rien n'a changé.
