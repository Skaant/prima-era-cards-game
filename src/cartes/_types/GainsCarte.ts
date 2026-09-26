import type { IdRessource } from "../../ressources/IdRessource";
import type { IdTribu } from "../../tribus/IdTribu";
import type { ParRessource } from "./ParRessource";
import type { PrerequisCarte } from "./PrerequisCarte";

export type GainsCarte = {
  tribus?: GainTribu[];
  ressources?: GainRessource[];
  autres?: string[];
};

export type GainTribu = {
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
