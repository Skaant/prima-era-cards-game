import type { IndexCartes } from "../IndexCartes";
import type { IdCarteNeutre } from "./IdCarteNeutre";
import { CARTES_PLANTES } from "./plantes/cartes-plantes";
import { CARTES_RESSOURCES } from "./ressources/cartes-ressources";

export const CARTES_NEUTRES: IndexCartes<IdCarteNeutre> = {
  ...CARTES_RESSOURCES,
  ...CARTES_PLANTES,
};
