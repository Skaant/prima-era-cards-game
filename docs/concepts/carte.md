# Carte

Une **Carte** est l'élément de base du jeu. Elle est décrite par le type `Carte` (`src/cartes/_types/Carte.ts`) et identifiée par un id (`IdCartes`, `src/cartes/paquets/IdCartes.ts`).

## Données

- `nom` et `type` (obligatoires).
- `prerequis`, `couts`, `gains` (optionnels).
- `unique` (optionnel) : une fois jouée, la carte disparaît au lieu d'aller à la [Défausse](defausse.md) — elle ne peut donc plus être rejouée ni repiochée (voir [Jouer une carte](jouer-une-carte.md)). Exemple : Vaisseau-graine.
- `actions` (optionnel) : liste d'[Actions de carte](action-de-carte.md), chacune avec `nom`, `couts`, `gains`, et optionnellement `prerequis`, `fois` (combien de fois par cycle) et `notes`. Les cartes de type **Action** n'ont pas de `couts`/`gains` au niveau de la carte : leur coût et leur gain sont ceux de leur unique action (voir [Action de carte](action-de-carte.md)).
- `notes` et `histoire` (optionnels).

## Références

- Les cartes sont indexées par id (`IndexCartes`, `src/cartes/IndexCartes.ts`).
- Un [Paquet](paquet.md) (`src/cartes/paquets/Paquet.ts`) référence des cartes par id, avec leur nombre (`Paquet.cartes`). Seul le paquet de base existe pour l'instant (`src/cartes/paquets/base/base.paquet.ts`).
- Dans le jeu, une carte est représentée par son id dans la **Pioche** et la **Main**. Son rendu HTML vient de `CarteItem` (Astro), fourni à la page Jouer via un `<template>`.
