import type { IndexCartes } from "../../IndexCartes";
import type { IdCarteRessource } from "./IdCarteRessource";

export const CARTES_RESSOURCES: IndexCartes<IdCarteRessource> = {
  eau: { nom: "Eau", type: "ressource", description: "+1 eau" },
  jing: {
    nom: "Jing",
    type: "ressource",
    gains: {
      ressources: [{ id: "jing", value: 1 }],
    },
  },
  waild: { nom: "Waïld", type: "ressource", description: "+1 waild" },
  data: { nom: "Data", type: "ressource", description: "+1 data" },
};
