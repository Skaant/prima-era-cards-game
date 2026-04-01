import type { Carte } from "./type/Carte";
import type { IdCarte } from "./IdCarte";

export type IndexCartes<Ids extends IdCarte | string = string> = {
  [id in Ids]: Carte;
};
