import type { IdRessource } from "../../ressources/IdRessource";
import type { IdTribu } from "../../tribus/IdTribu";
import type { ParRessource } from "./ParRessource";
import type { PrerequisCarte } from "./PrerequisCarte";

/**
 * Déclenchement sur l'augmentation de la ressource `id` (globale, ou individuelle de l'exemplaire
 * pour les branches). Voir `docs/regles/gains-sur-augmentation.md`.
 */
export type SurAugmentation = {
  id: IdRessource;
  /**
   * Quantité de ressource à gagner pour déclencher le gain une fois (1 par défaut). Au-delà de 1,
   * l'exemplaire compte les ressources gagnées jusqu'à atteindre `value`.
   */
  value?: number;
  /** L'effet peut être activé (par défaut, à l'ajout de l'exemplaire) ou désactivé. */
  activable?: true;
  /** Limite le nombre de déclenchements par cycle (par exemplaire). */
  fois?: {
    value: number;
    /** La limite est multipliée par le stock de cette ressource (divisé par `parRessource.value`). */
    parRessource?: ParRessource;
  };
};

export type GainTribu = {
  prerequis?: PrerequisCarte;
  id: IdTribu;
  value: number;
  parRessource?: ParRessource;
  parCycle?: true;
};

export type GainRessource = {
  prerequis?: PrerequisCarte;
  id: IdRessource;
  value: number;
  stockIndividuel?: true | "in" | "out";
  stock?: true;
  parRessource?: ParRessource;
  parCycle?: true;
};

export type GainOr = {
  type: "or";
  resources: { id: IdRessource; value: number }[];
  parCycle?: true;
};

/** Gains déclenchés par un gain `on` : jamais de gain `on` imbriqué (voir `GainOn`). */
export type GainsCarteSansOn = {
  tribus?: GainTribu[];
  ressources?: GainRessource[];
  autres?: (string | GainOr)[];
};

/**
 * Gain déclenché sur l'augmentation d'une ressource : applique `gain` (qui peut porter plusieurs
 * gains de ressources, de tribus et `autres`) à chaque fois que `value` est atteint. Voir
 * `docs/regles/gains-sur-augmentation.md`.
 */
export type GainOn = SurAugmentation & {
  type: "on";
  gain: GainsCarteSansOn;
};

export type GainsCarte = {
  declencheur?: {
    id: IdRessource;
    value: number;
  };
  tribus?: GainTribu[];
  ressources?: GainRessource[];
  autres?: (string | GainOr | GainOn)[];
};
