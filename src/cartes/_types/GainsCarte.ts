import type { IdRessource } from "../../types/ressources/IdRessource";
import type { IdTribu } from "../../types/tribus/IdTribu";
import type { ParRessource } from "./ParRessource";
import type { PrerequisCarte } from "./PrerequisCarte";

export type GainsCarte = {
  tribus?: {
    id: IdTribu;
    value: number;
    parRessource?: ParRessource;
    parCycle?: true;
  }[];
  ressources?: {
    prerequis?: PrerequisCarte;
    id: IdRessource;
    value: number;
    stockIndividuel?: true | "in" | "out";
    stock?: true;
    parRessource?: ParRessource;
    parCycle?: true;
  }[];
  autres?: string[];
};
