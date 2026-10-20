import { BASE_PAQUET } from "../cartes/paquets/base/base.paquet";
import type { Paquet } from "../cartes/paquets/Paquet";
import type { IdCartes } from "../cartes/paquets/IdCartes";
import type { IdCartesBase } from "../cartes/paquets/base/IdCartesBase";
import type { IdRessource } from "../ressources/IdRessource";
import type { IdTribu } from "../tribus/IdTribu";
import type { Carte } from "../cartes/_types/Carte";
import { TOUTES_CARTES } from "../cartes/paquets/toutes.cartes";
import type { IdPaquetEvolution } from "../évolutions/évolutions.data";
import { nouveauCycle } from "./cycle";
import { jouer } from "./jouer";
import { utiliserAction, utiliserActionGroupe } from "./actions";
import { choisirRessourceOr, choisirRessourceOrGroupe } from "./production";
import { creerPioche, piocherAvecRecyclage } from "./piocher";
import { RESSOURCES_GLOBALES, stockMaxInitial } from "./ressources";
import { type RefGain, type TableListenersGlobaux, tableListenersVide } from "./prerequis";
import { type EtatEvolution, creerEtatsEvolutions, revelerEvolution, choisirCarteEvolution } from "./evolutions";

export { RESSOURCES_GLOBALES };

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
  /** Identifiant unique et stable de l'exemplaire (sert de clé aux listeners de prérequis). */
  id: string;
  branches: number;
  branchesMax: number;
  /** Nombre de Zum associés à cet exemplaire (payés par une carte de type `zum`, voir `zum.md`). */
  zumsAssocies: number;
  /**
   * Ressource choisie pour chaque gain `autres` de type `"or"` de la carte, par index dans
   * `gains.autres`. Absent tant que la carte n'a pas de gain `"or"` (voir `choisirRessourceOr`).
   */
  choixOr?: Record<number, IdRessource>;
  /** Listeners de prérequis sur une ressource individuelle de cet exemplaire (voir `prerequis.ts`). */
  listeners?: Partial<Record<IdRessource, RefGain[]>>;
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
  /**
   * Contribution par cycle actuellement activée par les listeners de prérequis (voir
   * `prerequis.ts`), par ressource globale — ajoutée à la production de base recalculée dans
   * `recalculerProduction`, jamais écrasée par elle (contrairement à `ressources[id].parCycle`).
   */
  parCycleConditionnel: Partial<Record<IdRessourceGlobale, number>>;
  /** Affinité accumulée par tribu (voir `prerequis.ts`, `évolutions.data.ts`) ; stock entretenu par toggle. */
  affinitesTribus: Partial<Record<IdTribu, RessourceGlobale>>;
  /** État de chaque paquet d'évolution (pile restante, cartes achetées, révélation en cours). */
  evolutions: Record<IdPaquetEvolution, EtatEvolution>;
  /** Listeners de prérequis sur une ressource globale ou une tribu (voir `prerequis.ts`). */
  listeners: TableListenersGlobaux;
  /** Dernier résultat booléen connu de chaque prérequis de gain, par clé de `idGain()`. */
  prerequisActifs: Record<string, boolean>;
  /** Compteur pour générer l'id unique du prochain exemplaire posé. */
  prochainExemplaireId: number;
  /** Nombre de cartes piochées par tour, produit par les cartes du Terrain (Vaisseau-graine). */
  cartesParTour: number;
  /** Utilisations des actions de cartes ce cycle, par clé `${idCarte}:${actionIndex}`. */
  actionsUtilisees: Record<string, number>;
  /** Nombre de fois où l'action Piocher (bouton de la Pioche) a été utilisée ce cycle. */
  piochesPayantes: number;
};

export type ActionJeu =
  | { type: "piocher"; nombre: number }
  | { type: "piocher-payant" }
  | { type: "defausser"; index: number }
  | { type: "jouer"; index: number }
  | {
      type: "jouer-action";
      idCarte: IdCartes;
      exemplaireIndex: number;
      actionIndex: number;
    }
  /** Utilise l'action pour tous les exemplaires de la carte (ligne sous la pile), voir `exemplaire.md`. */
  | { type: "jouer-action-groupe"; idCarte: IdCartes; actionIndex: number }
  | {
      type: "choisir-ressource-or";
      idCarte: IdCartes;
      exemplaireIndex: number;
      autreIndex: number;
      ressourceId: IdRessource;
    }
  /** Change le choix "or" pour tous les exemplaires de la carte (ligne sous la pile). */
  | {
      type: "choisir-ressource-or-groupe";
      idCarte: IdCartes;
      autreIndex: number;
      ressourceId: IdRessource;
    }
  | { type: "nouveau-cycle" }
  | { type: "evolution-reveler"; paquet: IdPaquetEvolution }
  | { type: "evolution-choisir"; paquet: IdPaquetEvolution; choix: number | null };

/** Cartes données en main au début de la partie (hors pioche). */
export const CARTES_DE_DEPART: IdCartes[] = ["vaisseau-graine"];

const cartes = TOUTES_CARTES as Record<IdCartes, Carte>;

/** Coût en data de l'action Piocher : 1 + le nombre d'utilisations précédentes ce cycle. */
export function coutPiocher(etat: EtatJeu) {
  return 1 + etat.piochesPayantes;
}

/** Gain en data de l'action Défausser. */
export const GAIN_DEFAUSSER = 1;

/** Nombre de zums associés à un exemplaire du Terrain (voir `zum.md`), donc non payables. */
export function zumsMobilises(etat: EtatJeu): number {
  return etat.terrain.reduce(
    (total, { exemplaires }) =>
      total + exemplaires.reduce((t, e) => t + e.zumsAssocies, 0),
    0,
  );
}

export function peutPiocherPayant(etat: EtatJeu) {
  return (
    etat.pioche.length + etat.defausse.length > 0 &&
    etat.ressources.data.stock >= coutPiocher(etat)
  );
}

function avecData(etat: EtatJeu, delta: number): EtatJeu["ressources"] {
  const data = etat.ressources.data;
  return {
    ...etat.ressources,
    data: { ...data, stock: Math.min(data.stock + delta, data.stockMax) },
  };
}

export function etatInitial(paquet: Paquet<IdCartesBase> = BASE_PAQUET): EtatJeu {
  // Passe par le type `Paquet` (= `Paquet<string>`) comme pont : un `Paquet<IdCartesBase>` s'y
  // assigne (moins de clés qu'une signature d'index), qui s'assigne à son tour à `Paquet<IdCartes>`
  // (signature d'index couvrant toutes les clés), ce qu'un assignement direct ne permet pas.
  const paquetLarge: Paquet = paquet;
  const cartesPiochables = { ...paquetLarge.cartes };
  for (const id of CARTES_DE_DEPART) delete cartesPiochables[id];
  const paquetAPiocher: Paquet = { ...paquetLarge, cartes: cartesPiochables };
  return {
    pioche: creerPioche(paquetAPiocher),
    main: [...CARTES_DE_DEPART],
    defausse: [],
    terrain: [],
    cycle: 1,
    cartesParTour: 0,
    actionsUtilisees: {},
    piochesPayantes: 0,
    ressources: Object.fromEntries(
      RESSOURCES_GLOBALES.map((id) => [
        id,
        { stock: 0, parCycle: 0, stockMax: stockMaxInitial(id) },
      ]),
    ) as EtatJeu["ressources"],
    parCycleConditionnel: {},
    affinitesTribus: {},
    evolutions: creerEtatsEvolutions(),
    listeners: tableListenersVide(),
    prerequisActifs: {},
    prochainExemplaireId: 0,
  };
}

export function reducteur(etat: EtatJeu, action: ActionJeu): EtatJeu {
  switch (action.type) {
    case "piocher":
      return {
        ...etat,
        ...piocherAvecRecyclage(etat.pioche, etat.defausse, etat.main, action.nombre),
      };
    case "piocher-payant":
      if (!peutPiocherPayant(etat)) return etat;
      return {
        ...etat,
        ...piocherAvecRecyclage(etat.pioche, etat.defausse, etat.main, 1),
        ressources: avecData(etat, -coutPiocher(etat)),
        piochesPayantes: etat.piochesPayantes + 1,
      };
    case "defausser": {
      const id = etat.main[action.index];
      if (id === undefined) return etat;
      return {
        ...etat,
        main: etat.main.filter((_, i) => i !== action.index),
        defausse: [...etat.defausse, id],
        ressources: avecData(etat, GAIN_DEFAUSSER),
      };
    }
    case "jouer":
      return jouer(etat, action.index, cartes);
    case "jouer-action":
      return utiliserAction(
        etat,
        action.idCarte,
        action.exemplaireIndex,
        action.actionIndex,
        cartes,
      );
    case "jouer-action-groupe":
      return utiliserActionGroupe(etat, action.idCarte, action.actionIndex, cartes);
    case "choisir-ressource-or":
      return choisirRessourceOr(
        etat,
        action.idCarte,
        action.exemplaireIndex,
        action.autreIndex,
        action.ressourceId,
        cartes,
      );
    case "choisir-ressource-or-groupe":
      return choisirRessourceOrGroupe(
        etat,
        action.idCarte,
        action.autreIndex,
        action.ressourceId,
        cartes,
      );
    case "nouveau-cycle":
      return nouveauCycle(etat, cartes);
    case "evolution-reveler":
      return revelerEvolution(etat, action.paquet, cartes);
    case "evolution-choisir":
      return choisirCarteEvolution(etat, action.paquet, action.choix);
  }
}
