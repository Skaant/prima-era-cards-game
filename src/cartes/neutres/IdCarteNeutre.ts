import type { IdCarteAnimal } from "./animaux/IdCarteAnimal";
import type { IdCartePlante } from "./plantes/IdCartePlante";
import type { IdCarteRessource } from "./ressources/IdCarteRessource";

export type IdCarteNeutre = IdCarteRessource | IdCartePlante | IdCarteAnimal;
