# Cycle

Une partie se déroule en plusieurs **cycles**, jusqu'à ce qu'un objectif de victoire soit atteint (80 waild, ou 200 data). Chaque cycle comporte trois phases (manuel : `src/pages/manuel/index.astro`) :

1. **Pioche** : remplir la [Main](main.md) jusqu'à 8 cartes. Chaque carte piochée peut être ajoutée à la main, mise dans le paquet stase, ou défaussée définitivement.
2. **Pose de cartes et actions** : [Jouer des cartes](jouer-une-carte.md) (prérequis respectés, coûts payés) et utiliser les actions des cartes en jeu.
3. **Production** : comptage des gains de [Ressources](ressource.md) du cycle.

Ensuite, un nouveau cycle commence.

## Implémentation

Pas encore implémenté : la page Jouer ne gère pas les phases.

Divergences : le manuel parle de paquets tribu et stase et d'une main de 8 cartes ; le jeu n'a qu'une [Pioche](pioche.md) issue du paquet de base et pioche 5 cartes au départ (`TAILLE_MAIN_INITIALE`).
