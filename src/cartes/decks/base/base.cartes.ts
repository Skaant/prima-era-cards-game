import type { IndexCartes } from "../../IndexCartes";
import type { IdCartesBase } from "./IdCartesBase";

export const BASE_CARTES: IndexCartes<IdCartesBase> = {
  dom: {
    nom: "Dom",
    type: "bâtiment-organique",
    prerequis: {
      ressources: {
        waild: {
          max: 25,
        },
      },
    },
    couts: {
      ressources: [
        { id: "eau", value: 1 },
        { id: "jing", value: 2 },
      ],
    },
    gains: {
      ressources: [
        { id: "branches", stock: true, value: 3 },
        {
          id: "zums",
          stock: true,
          value: 2,
        },
        {
          id: "jing",
          value: 1,
          parCycle: true,
          prerequis: {
            ressources: {
              branches: { min: 2 },
            },
          },
        },
      ],
    },
  },
  decouvreureuse: {
    nom: "Découvreureuse",
    type: "zum",
    couts: {
      ressources: [{ id: "zums", value: 1 }],
    },
    actions: [
      {
        nom: "Temps libre",
        couts: {
          ressources: [
            {
              id: "actions",
              value: 1,
            },
          ],
        },
        gains: {
          ressources: [
            {
              id: "data",
              value: 1,
            },
            {
              id: "data",
              value: 1,
              parRessource: { id: "waild", value: 10 },
            },
          ],
        },
        fois: { value: 1 },
      },
    ],
  },
  "collecte du wa": {
    nom: "Collecte du wa",
    type: "action",
    couts: {
      ressources: [{ id: "actions", value: 1 }],
    },
    gains: {
      ressources: [
        { id: "eau", value: 1 },
        {
          id: "eau",
          value: 1,
          parRessource: {
            id: "eau",
            stock: true,
            value: 10,
          },
        },
      ],
    },
  },
  flaqueureuse: {
    nom: "Flaqueureuse",
    type: "champignon",
    couts: {
      ressources: [{ id: "jing", value: 1 }],
    },
    gains: {
      ressources: [
        {
          id: "eau",
          value: 1,
          parCycle: true,
        },
      ],
    },
  },
  ramasseureuse: {
    nom: "Ramasseureuse",
    type: "zum",
    couts: {
      ressources: [
        {
          id: "zums",
          value: 1,
        },
        {
          id: "data",
          value: 3,
        },
      ],
    },
    gains: {
      autres: [
        {
          type: "or",
          resources: [
            { id: "eau", value: 1 },
            { id: "jing", value: 1 },
          ],
          parCycle: true,
        },
      ],
    },
  },
  senseureuse: {
    nom: "Senseureuse",
    type: "plante",
    couts: {
      ressources: [{ id: "eau", value: 1 }],
    },
    gains: {
      ressources: [
        {
          id: "data",
          value: 1,
          parCycle: true,
        },
      ],
    },
  },
};
