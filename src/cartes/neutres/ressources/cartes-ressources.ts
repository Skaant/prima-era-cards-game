import type { IndexCartes } from "../../IndexCartes";
import type { IdCarteRessource } from "./IdCarteRessource";

export const CARTES_RESSOURCES: IndexCartes<IdCarteRessource> = {
  eau: {
    nom: "Eau",
    type: "ressource",
    gains: {
      ressources: [
        { id: "eau", value: 1 },
        { id: "eau", value: 1, parRessource: { id: "waild", value: 5 } },
      ],
    },
    histoire:
      "L'eau est une ressource si importante que la plupart des tribus ont des moyens d'en trouver. Plus il y a d'{{eau}}, plus les ecosystèmes croissent de façon exponentielle.",
  },
  jing: {
    nom: "Jing",
    type: "ressource",
    gains: {
      ressources: [
        { id: "jing", value: 1 },
        {
          id: "jing",
          value: 1,
          parRessource: {
            id: "eau",
            value: 3,
          },
        },
      ],
    },
    histoire:
      "Les composants les plus simples ont donné naissance à toute la diversité des êtres vivants. Le {{jing}} est la structure de toute matière organique.",
  },
  waild: {
    nom: "Waïld",
    type: "ressource",
    gains: {
      ressources: [
        { id: "waild", value: 1 },
        {
          id: "waild",
          value: 1,
          parRessource: {
            id: "eau",
            value: 5,
          },
        },
        {
          id: "waild",
          value: 1,
          parRessource: {
            id: "plantes",
            value: 3,
          },
        },
      ],
    },
  },
  data: {
    nom: "Data",
    type: "ressource",
    gains: {
      ressources: [
        { id: "data", value: 3 },
        {
          id: "data",
          value: 1,
          parRessource: {
            id: "zums",
            value: 3,
          },
        },
      ],
    },
  },
  "protection-waild": {
    nom: "Protection waïld",
    type: "ressource",
    gains: {
      ressources: [
        { id: "protection-waild", value: 1 },
        {
          id: "protection-waild",
          value: 1,
          parRessource: {
            id: "zums",
            value: 5,
          },
        },
        {
          id: "protection-waild",
          value: 1,
          parRessource: {
            id: "batiments",
            value: 3,
          },
        },
      ],
    },
  },
};
