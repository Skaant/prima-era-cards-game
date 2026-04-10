import type { IdRessource } from "../../ressources/IdRessource";
import type { ParRessource } from "./ParRessource";

export type CoutsCarte = {
  ressources?: {
    id: IdRessource;
    value: number;
    parRessource?: ParRessource;
    parCycle?: true;
  }[];
  autres?: string[];
};
