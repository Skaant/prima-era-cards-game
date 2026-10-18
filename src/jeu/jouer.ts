import type { Carte } from "../cartes/_types/Carte";
import type { IdCartes } from "../cartes/paquets/IdCartes";
import {
  type EtatJeu,
  type Exemplaire,
  type IdRessourceGlobale,
  zumsMobilises,
} from "./etat";
import { recalculerProduction } from "./production";
import { estRessourceGlobale } from "./ressources";

type Cartes = Record<IdCartes, Carte>;

/** Coûts de la carte payables avec les ressources globales (hors coûts par cycle ou proportionnels). */
function coutsSimples(carte: Carte) {
  return (carte.couts?.ressources ?? []).filter(
    (c) => !c.parCycle && !c.parRessource,
  );
}

/**
 * Stock de la ressource réellement payable : pour les zums, le stock global inclut les zums
 * déjà associés à un exemplaire (voir `zum.md`), qui ne sont pas disponibles pour un coût.
 */
function stockDisponible(etat: EtatJeu, id: IdRessourceGlobale) {
  const stock = etat.ressources[id].stock;
  return id === "zums" ? stock - zumsMobilises(etat) : stock;
}

export function peutJouer(etat: EtatJeu, carte: Carte): boolean {
  return coutsSimples(carte).every(
    (c) => !estRessourceGlobale(c.id) || stockDisponible(etat, c.id) >= c.value,
  );
}

/** Copie profonde des parties de l'état modifiées par une carte. */
function copier(etat: EtatJeu): EtatJeu {
  return {
    ...etat,
    ressources: Object.fromEntries(
      Object.entries(etat.ressources).map(([id, r]) => [id, { ...r }]),
    ) as EtatJeu["ressources"],
    terrain: etat.terrain.map((c) => ({ ...c, exemplaires: c.exemplaires.map((e) => ({ ...e })) })),
  };
}

/** Ajoute un exemplaire de la carte au terrain (créant l'entrée au besoin) et le renvoie. */
function ajouterExemplaire(etat: EtatJeu, id: IdCartes): Exemplaire {
  const exemplaire = { branches: 0, branchesMax: 0, zumsAssocies: 0 };
  const entree = etat.terrain.find((c) => c.id === id);
  if (entree) entree.exemplaires.push(exemplaire);
  else etat.terrain.push({ id, exemplaires: [exemplaire] });
  return exemplaire;
}

/**
 * Applique les gains immédiats de la carte. Les gains `stock: true` augmentent le stock max
 * (global, ou celui des branches de l'exemplaire joué) et sont appliqués avant les autres.
 * Ignorés : gains par cycle (voir `production.ts`), conditionnels, proportionnels, `autres`.
 * `etat` est modifié en place.
 */
function appliquerGains(etat: EtatJeu, carte: Carte, exemplaire: Exemplaire | undefined) {
  const gains = (carte.gains?.ressources ?? []).filter(
    (g) => !g.parCycle && !g.prerequis && !g.parRessource && !g.stockIndividuel,
  );
  for (const gain of gains.filter((g) => g.stock)) {
    if (estRessourceGlobale(gain.id)) etat.ressources[gain.id].stockMax += gain.value;
    else if (gain.id === "branches" && exemplaire) exemplaire.branchesMax += gain.value;
  }
  for (const gain of gains.filter((g) => !g.stock)) {
    if (estRessourceGlobale(gain.id)) {
      const r = etat.ressources[gain.id];
      r.stock = Math.min(r.stock + gain.value, r.stockMax);
    } else if (gain.id === "branches" && exemplaire) {
      exemplaire.branches = Math.min(exemplaire.branches + gain.value, exemplaire.branchesMax);
    }
  }
}

/**
 * Joue la carte d'index `index` de la main : coûts payés, gains récoltés, un exemplaire
 * ajouté au terrain. La carte jouée va ensuite à la défausse, sauf si elle est `unique`
 * (elle disparaît alors : pas de défausse, et donc ne peut plus être rejouée ni repiochée).
 * Sans effet si l'index est invalide ou si les coûts ne sont pas payables.
 */
export function jouer(etat: EtatJeu, index: number, cartes: Cartes): EtatJeu {
  const id = etat.main[index];
  if (id === undefined) return etat;
  const carte = cartes[id];
  if (!peutJouer(etat, carte)) return etat;

  const suivant = copier(etat);
  suivant.main = etat.main.filter((_, i) => i !== index);
  // Un coût en zums d'une carte de type "zum" ne quitte pas le stock global (il continue de
  // le compter en production) : il est seulement associé à l'exemplaire joué, ce qui le rend
  // indisponible pour payer un autre coût (voir `zum.md`, `zumsMobilises`).
  let zumsAssocies = 0;
  for (const cout of coutsSimples(carte)) {
    if (!estRessourceGlobale(cout.id)) continue;
    if (carte.type === "zum" && cout.id === "zums") {
      zumsAssocies += cout.value;
      continue;
    }
    suivant.ressources[cout.id].stock -= cout.value;
  }

  if (!carte.unique) suivant.defausse = [...etat.defausse, id];
  const exemplaire = ajouterExemplaire(suivant, id);
  exemplaire.zumsAssocies += zumsAssocies;
  appliquerGains(suivant, carte, exemplaire);

  return recalculerProduction(suivant, cartes);
}
