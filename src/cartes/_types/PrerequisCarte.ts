import type { IdRessource } from "../../ressources/IdRessource";
import type { IdTribu } from "../../tribus/IdTribu";

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
