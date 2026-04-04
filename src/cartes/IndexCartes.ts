import type { Carte } from "./_types/Carte";
import type { IdCarte } from "./_types/IdCarte";

export type IndexCartes<Ids extends IdCarte | string = string> = {
  [id in Ids]: Carte;
};
