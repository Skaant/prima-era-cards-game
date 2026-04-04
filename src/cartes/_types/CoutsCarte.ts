import type { IdRessource } from "../../types/ressources/IdRessource";
import type { ParRessource } from "./ParRessource";

export type CoutsCarte = {
  ressources?: {
    id: IdRessource;
    value: number;
    parRessource?: ParRessource;
    parCycle?: true;
  }[];
};
