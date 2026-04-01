import type { IndexCartes } from "../IndexCartes";
import type { IdCarteTribu } from "./IdCarteTribu";
import { CARTES_KOLOKOLO } from "./kolokolo/cartes-kolokolo";
import { CARTES_NOVINA } from "./novina/cartes-novina";
import { CARTES_PERMAK } from "./permak/cartes-permak";

export const CARTES_TRIBUS: IndexCartes<IdCarteTribu> = {
  ...CARTES_KOLOKOLO,
  ...CARTES_NOVINA,
  ...CARTES_PERMAK,
};
