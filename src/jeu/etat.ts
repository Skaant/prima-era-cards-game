import { BASE_PAQUET } from "../cartes/paquets/base/base.paquet";
import type { Paquet } from "../cartes/paquets/Paquet";
import type { IdCartes } from "../cartes/paquets/IdCartes";
import type { IdRessource } from "../ressources/IdRessource";
import type { Carte } from "../cartes/_types/Carte";
import { TOUTES_CARTES } from "../cartes/paquets/toutes.cartes";
import { nouveauCycle, phasePioche } from "./cycle";
import { jouer, poserSurTerrain } from "./jouer";
import { creerPioche, piocherAvecRecyclage } from "./piocher";
import { RESSOURCES_GLOBALES, stockMaxInitial } from "./ressources";

export { RESSOURCES_GLOBALES };

/** Taille de la main à remplir lors de la phase de pioche de chaque cycle. */
export const TAILLE_MAIN = 8;

export type IdRessourceGlobale = Extract<
  IdRessource,
  "eau" | "jing" | "data" | "zums" | "energie"
>;

export type RessourceGlobale = {
  stock: number;
  parCycle: number;
  /** Le stock ne peut pas dépasser cette valeur (`Infinity` : illimité). */
  stockMax: number;
};

/** Un exemplaire d'une carte du Terrain, avec son propre stock de branches (jetons Branche). */
export type Exemplaire = {
  branches: number;
  branchesMax: number;
};

export type CarteTerrain = {
  id: IdCartes;
  /** Un élément par exemplaire joué ; le premier est la carte elle-même. */
  exemplaires: Exemplaire[];
};

export type EtatJeu = {
  pioche: IdCartes[];
  main: IdCartes[];
  defausse: IdCartes[];
  /** Cartes jouées, regroupées par id, avec leurs exemplaires. */
  terrain: CarteTerrain[];
  /** Numéro du cycle en cours (à partir de 1). */
  cycle: number;
  ressources: Record<IdRessourceGlobale, RessourceGlobale>;
};

export type ActionJeu =
  | { type: "piocher"; nombre: number }
  | { type: "jouer"; index: number }
  | { type: "nouveau-cycle" };

/** Cartes posées automatiquement sur le terrain au début de la partie (hors pioche). */
export const CARTES_DE_DEPART: IdCartes[] = ["vaisseau-graine"];

const cartes = TOUTES_CARTES as Record<IdCartes, Carte>;

export function etatInitial(paquet: Paquet<IdCartes> = BASE_PAQUET): EtatJeu {
  const cartesPiochables = { ...paquet.cartes };
  for (const id of CARTES_DE_DEPART) delete cartesPiochables[id];
  const etat: EtatJeu = {
    pioche: creerPioche({ ...paquet, cartes: cartesPiochables }),
    main: [],
    defausse: [],
    terrain: [],
    cycle: 1,
    ressources: Object.fromEntries(
      RESSOURCES_GLOBALES.map((id) => [
        id,
        { stock: 0, parCycle: 0, stockMax: stockMaxInitial(id) },
      ]),
    ) as EtatJeu["ressources"],
  };
  // Le premier cycle commence par sa phase de pioche.
  return phasePioche(
    CARTES_DE_DEPART.reduce((e, id) => poserSurTerrain(e, id, cartes), etat),
  );
}

export function reducteur(etat: EtatJeu, action: ActionJeu): EtatJeu {
  switch (action.type) {
    case "piocher":
      return {
        ...etat,
        ...piocherAvecRecyclage(etat.pioche, etat.defausse, etat.main, action.nombre),
      };
    case "jouer":
      return jouer(etat, action.index, cartes);
    case "nouveau-cycle":
      return nouveauCycle(etat, cartes);
  }
}
