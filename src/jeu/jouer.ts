import type { Carte } from "../cartes/_types/Carte";
import type { IdCartes } from "../cartes/paquets/IdCartes";
import type { EtatJeu, Exemplaire } from "./etat";
import { recalculerProduction } from "./production";
import { estRessourceGlobale } from "./ressources";

type Cartes = Record<IdCartes, Carte>;

/** Coûts de la carte payables avec les ressources globales (hors coûts par cycle ou proportionnels). */
function coutsSimples(carte: Carte) {
  return (carte.couts?.ressources ?? []).filter(
    (c) => !c.parCycle && !c.parRessource,
  );
}

export function peutJouer(etat: EtatJeu, carte: Carte): boolean {
  return coutsSimples(carte).every(
    (c) => !estRessourceGlobale(c.id) || etat.ressources[c.id].stock >= c.value,
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
  const exemplaire = { branches: 0, branchesMax: 0 };
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

/** Pose une carte directement sur le terrain, sans la payer, et récolte ses gains. */
export function poserSurTerrain(etat: EtatJeu, id: IdCartes, cartes: Cartes): EtatJeu {
  const suivant = copier(etat);
  appliquerGains(suivant, cartes[id], ajouterExemplaire(suivant, id));
  return recalculerProduction(suivant, cartes);
}

/**
 * Joue la carte d'index `index` de la main : coûts payés, gains récoltés.
 * Les cartes Action vont à la défausse ; sinon le premier exemplaire reste sur le terrain
 * et les suivants ajoutent un exemplaire avant d'aller à la défausse.
 * Sans effet si l'index est invalide ou si les coûts ne sont pas payables.
 */
export function jouer(etat: EtatJeu, index: number, cartes: Cartes): EtatJeu {
  const id = etat.main[index];
  if (id === undefined) return etat;
  const carte = cartes[id];
  if (!peutJouer(etat, carte)) return etat;

  const suivant = copier(etat);
  suivant.main = etat.main.filter((_, i) => i !== index);
  for (const cout of coutsSimples(carte)) {
    if (estRessourceGlobale(cout.id)) suivant.ressources[cout.id].stock -= cout.value;
  }

  if (carte.type === "action") {
    suivant.defausse = [...etat.defausse, id];
    appliquerGains(suivant, carte, undefined);
  } else {
    // Le premier exemplaire reste sur le terrain ; les suivants s'y ajoutent
    // avant que la carte jouée n'aille à la défausse.
    if (suivant.terrain.some((c) => c.id === id)) suivant.defausse = [...etat.defausse, id];
    appliquerGains(suivant, carte, ajouterExemplaire(suivant, id));
  }
  return recalculerProduction(suivant, cartes);
}
