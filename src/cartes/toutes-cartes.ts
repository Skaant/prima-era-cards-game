import type { IdCarte } from "./_types/IdCarte";
import type { IndexCartes } from "./IndexCartes";
import { CARTES_NEUTRES } from "./neutres/cartes-neutres";
import { CARTES_TRIBUS } from "./tribus/cartes-tribus";

export const TOUTES_CARTES: IndexCartes<IdCarte> = {
  ...CARTES_NEUTRES,
  ...CARTES_TRIBUS,
};
