import type { IdTribu } from "../tribus/IdTribu";

export type IdPaquetEvolution =
  | "evolution-base-1"
  | "evolution-base-2"
  | "evolution-base-3"
  | "kolos-1"
  | "perma-1"
  | "nov-1";

export type ConditionDeblocage =
  | { type: "cartes-achetees"; paquet: IdPaquetEvolution; min: number }
  | { type: "affinite-tribu"; tribu: IdTribu; min: number };

export type ConfigEvolution = {
  nom: string;
  /** "base" pour un paquet qui dépend directement du paquet de base. */
  parent: IdPaquetEvolution | "base";
  coutData: number;
  /** Conditions combinées en ET. */
  conditions: ConditionDeblocage[];
};

export const EVOLUTIONS: Record<IdPaquetEvolution, ConfigEvolution> = {
  "evolution-base-1": {
    nom: "Évolution base 1",
    parent: "base",
    coutData: 5,
    conditions: [],
  },
  "evolution-base-2": {
    nom: "Évolution base 2",
    parent: "evolution-base-1",
    coutData: 30,
    conditions: [{ type: "cartes-achetees", paquet: "evolution-base-1", min: 5 }],
  },
  "evolution-base-3": {
    nom: "Évolution base 3",
    parent: "evolution-base-2",
    coutData: 200,
    conditions: [{ type: "cartes-achetees", paquet: "evolution-base-2", min: 5 }],
  },
  "kolos-1": {
    nom: "Kolos 1",
    parent: "evolution-base-1",
    coutData: 8,
    conditions: [
      { type: "cartes-achetees", paquet: "evolution-base-1", min: 5 },
      { type: "affinite-tribu", tribu: "kolos", min: 3 },
    ],
  },
  "perma-1": {
    nom: "Perma 1",
    parent: "evolution-base-2",
    coutData: 40,
    conditions: [
      { type: "cartes-achetees", paquet: "evolution-base-2", min: 5 },
      { type: "affinite-tribu", tribu: "permak", min: 5 },
    ],
  },
  "nov-1": {
    nom: "Nov 1",
    parent: "evolution-base-2",
    coutData: 40,
    conditions: [
      { type: "cartes-achetees", paquet: "evolution-base-2", min: 5 },
      { type: "affinite-tribu", tribu: "novina", min: 5 },
    ],
  },
};
