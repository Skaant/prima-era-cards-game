import type { IdRessource } from "../../ressources/IdRessource";

export type ParRessource = {
  id: IdRessource;
  value?: number;
  stock?: true;
  stockIndividuel?: true;
};
