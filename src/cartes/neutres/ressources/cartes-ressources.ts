import type { IndexCartes } from "../../IndexCartes";
import type { IdCarteRessource } from "./IdCarteRessource";

export const CARTES_RESSOURCES: IndexCartes<IdCarteRessource> = {
  eau: {
    nom: "Eau",
    type: "ressource",
    gains: { ressources: [{ id: "eau", value: 1 }] },
    histoire:
      "Les bivaros sont une tribu dédiée à l'accumulation d'eau, grâce aux barrages notamment. Les novinas sont très fort pour en dégotter dans le désert. L'eau est une ressource si importante que la plupart des tribus ont des moyens d'en trouver.",
  },
  jing: {
    nom: "Jing",
    type: "ressource",
    gains: {
      ressources: [{ id: "jing", value: 1 }],
    },
    histoire:
      "Fascinant de voir comme les composants les plus simples ont donné naissance à toute la diversité des êtres vivants. Le {{jing}} est la structure de toute matière organique.",
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
