# Paquet

Un **Paquet** est une collection de **Cartes** : il dit quelles cartes le composent et en quelle quantité. Il sert de référence pour constituer une [Pioche](pioche.md).

## Données

Le type `Paquet` (`src/cartes/paquets/Paquet.ts`) :

- `id` : identifiant du paquet (`IdPaquets`, `src/cartes/paquets/IdPaquets.ts`). Seul `base` existe pour l'instant.
- `cartes` : objet `{ [idCarte]: nombre }`, le nombre d'exemplaires de chaque [Carte](carte.md) dans le paquet.

### Paquet de base

`BASE_PAQUET` (`src/cartes/paquets/base/base.paquet.ts`) contient : dom ×3, collecte du wa ×2, decouvreureuse ×3, flaqueureuse ×3, ramasseureuse ×2, senseureuse ×3. Ses ids de cartes sont typés par `IdCartesBase` (`src/cartes/paquets/base/IdCartesBase.ts`).

## Références

- `TOUS_PAQUETS` (`src/cartes/paquets/tous.paquets.ts`) indexe les paquets par `IdPaquets`.
- Pages : `src/pages/cartes/index.astro` liste les paquets, `src/pages/cartes/[idPaquet].astro` affiche un paquet.

## Usage

- [Pioche](pioche.md) : `creerPioche(paquet)` (`src/jeu/piocher.ts`) crée la Pioche depuis un paquet.
- Début de partie : `etatInitial(paquet = BASE_PAQUET)` (`src/jeu/etat.ts`). La page Jouer (`src/pages/jouer.astro`) utilise `BASE_PAQUET`.

## Divergence connue

Un second type `Paquet` existe dans `src/cartes/_types/Paquet.ts` : une liste `{ id, quantite }[]`. Il est utilisé par le paquet des Kolokolo (`KOLOKOLO_PAQUET`, `src/tribus/kolokolo/paquet.ts`) et par `ListeCartesItem.astro`. Il n'est pas lié à `IdPaquets`, `TOUS_PAQUETS` ni au jeu.
