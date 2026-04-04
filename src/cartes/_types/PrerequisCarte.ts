import type { IdRessource } from "../../types/ressources/IdRessource";
import type { IdTribu } from "../../types/tribus/IdTribu";

export type PrerequisCarte = {
  tribus?: { [key in IdTribu]?: number };
  ressources?: {
    [key in IdRessource]?: {
      eq?: number;
      min?: number;
      max?: number;
      stockPlein?: true;
      stockIndividuelPlein?: true;
    };
  };
};
