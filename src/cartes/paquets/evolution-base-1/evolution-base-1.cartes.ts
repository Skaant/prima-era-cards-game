import type { IndexCartes } from "../../IndexCartes";
import type { IdCartesEvolutionBase1 } from "./IdCartesEvolutionBase1";

export const EVOLUTION_BASE_1_CARTES: IndexCartes<IdCartesEvolutionBase1> = {
  doucheureuse: {
    nom: "Doucheureuse",
    type: "plante",
    prerequis: { ressources: { waild: { min: 5 } } },
    couts: {
      ressources: [
        { id: "eau", value: 1 },
        { id: "jing", value: 2 },
      ],
    },
    gains: {
      ressources: [
        {
          id: "waild",
          value: 1,
        },
        {
          id: "branches",
          value: 2,
          stock: true,
        },
        {
          id: "eau",
          value: 1,
          parRessource: {
            id: "branches",
          },
          parCycle: true,
        },
      ],
    },
  },
  chiandit: {
    nom: "Chiandit",
    type: "plante",
    prerequis: { ressources: { waild: { max: 25 } } },
    couts: {
      ressources: [
        { id: "eau", value: 1 },
        { id: "jing", value: 1 },
      ],
    },
    gains: {
      ressources: [
        {
          id: "waild",
          value: 1,
        },
        {
          id: "branches",
          value: 2,
          stock: true,
        },
      ],
      autres: [
        {
          type: "on",
          id: "branches",
          gain: { ressources: [{ id: "waild", value: 1 }] },
        },
      ],
    },
  },
  trappeureuse: {
    nom: "Trappeureuse",
    type: "zum",
    prerequis: {
      ressources: {
        waild: { min: 10 },
      },
    },
    couts: {
      ressources: [
        {
          id: "zums",
          value: 1,
        },
        {
          id: "jing",
          value: 2,
        },
        {
          id: "data",
          value: 4,
        },
      ],
    },
    gains: {
      ressources: [
        { id: "eau", value: 1, parCycle: true },
        { id: "jing", value: 1, parCycle: true },
        { id: "data", value: 1, parCycle: true },
      ],
    },
    actions: [
      {
        nom: "Réduire",
        couts: { ressources: [{ id: "energie", value: 1 }] },
        gains: { ressources: [{ id: "waild", value: -1 }] },
      },
    ],
  },
  roinx: {
    nom: "Roinx",
    type: "plante",
    prerequis: { ressources: { waild: { min: 5 } } },
    couts: {
      ressources: [
        { id: "eau", value: 2 },
        { id: "jing", value: 1 },
      ],
    },
    gains: { ressources: [{ id: "waild", value: 1, parCycle: true }] },
  },
  desicateurice: {
    nom: "Désicateurice",
    type: "bâtiment",
    prerequis: { ressources: { waild: { max: 40 } } },
    couts: {
      ressources: [
        { id: "eau", value: 1 },
        { id: "jing", value: 3 },
      ],
    },
    gains: { ressources: [{ id: "eau", stock: true, value: 4 }] },
    actions: [
      {
        nom: "Suspendre",
        couts: {
          ressources: [
            { id: "energie", value: 1 },
            { id: "waild", value: 1 },
          ],
        },
        gains: { ressources: [{ id: "eau", value: 2 }] },
        fois: { value: 2 },
      },
    ],
  },
  arroseureuse: {
    nom: "Arroseureuse",
    type: "zum",
    prerequis: {},
    couts: {
      ressources: [
        { id: "zums", value: 1 },
        { id: "data", value: 4 },
      ],
    },
    actions: [
      {
        nom: "Arroser",
        couts: {
          ressources: [
            { id: "energie", value: 1 },
            { id: "eau", value: 1 },
          ],
        },
        gains: {
          autres: [
            {
              type: "or",
              resources: [
                { id: "waild", value: 1 },
                { id: "branches", value: 1 },
              ],
            },
          ],
        },
      },
    ],
  },
  emolianx: {
    nom: "Emolianx",
    type: "champignon",
    prerequis: { ressources: { waild: { min: 10 } } },
    couts: { ressources: [{ id: "waild", value: 3 }] },
    gains: {},
    actions: [
      {
        nom: "Arroser",
        couts: { ressources: [{ id: "eau", value: 1 }] },
        gains: { ressources: [{ id: "jing", value: 2 }] },
        fois: {
          value: 1,
        },
      },
    ],
  },
  sapienx: {
    nom: "Sapienx",
    type: "champignon",
    prerequis: { ressources: { waild: { min: 15, max: 45 } } },
    couts: { ressources: [{ id: "eau", value: 1 }] },
    gains: {
      ressources: [{ id: "branches", stock: true, value: 8 }],
      autres: [
        {
          type: "on",
          id: "branches",
          gain: { ressources: [{ id: "data", value: 1 }] },
        },
      ],
    },
  },
  sentienx: {
    nom: "Sentienx",
    type: "saint",
    unique: true,
    prerequis: { ressources: { waild: { min: 8 } } },
    couts: {
      ressources: [
        { id: "eau", value: 4 },
        { id: "jing", value: 3 },
        { id: "data", value: 7 },
      ],
    },
    gains: {
      autres: [
        {
          type: "on",
          id: "waild",
          gain: { ressources: [{ id: "data", value: 1 }] },
        },
      ],
    },
  },
};
