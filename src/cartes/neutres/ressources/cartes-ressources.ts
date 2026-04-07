import type { IndexCartes } from "../../IndexCartes";
import type { IdCarteRessource } from "./IdCarteRessource";

export const CARTES_RESSOURCES: IndexCartes<IdCarteRessource> = {
  eau: {
    nom: "Eau",
    type: "ressource",
    gains: { ressources: [{ id: "eau", value: 1 }] },
  },
  jing: {
    nom: "Jing",
    type: "ressource",
    gains: {
      ressources: [{ id: "jing", value: 1 }],
    },
  },
  waild: {
    nom: "Waïld",
    type: "ressource",
    gains: { ressources: [{ id: "waild", value: 1 }] },
  },
  data: {
    nom: "Data",
    type: "ressource",
    gains: { ressources: [{ id: "data", value: 3 }] },
  },
  "protection-waild": {
    nom: "Protection waïld",
    type: "ressource",
    gains: { ressources: [{ id: "protection-waild", value: 1 }] },
  },
};
