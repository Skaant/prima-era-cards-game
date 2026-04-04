import type { IndexCartes } from "../IndexCartes";
import { CARTES_ANIMAUX } from "./animaux/cartes-animaux";
import type { IdCarteNeutre } from "./IdCarteNeutre";
import { CARTES_PLANTES } from "./plantes/cartes-plantes";
import { CARTES_RESSOURCES } from "./ressources/cartes-ressources";

export const CARTES_NEUTRES: IndexCartes<IdCarteNeutre> = {
  ...CARTES_RESSOURCES,
  ...CARTES_PLANTES,
  ...CARTES_ANIMAUX,
};
