import type { IndexCartes } from "../../IndexCartes";
import type { IdCartePlante } from "./IdCartePlante";

export const CARTES_PLANTES: IndexCartes<IdCartePlante> = {
  "poadi rhizomatique": {
    nom: "Poadi rhizomatique",
    type: "plante",
    prerequis: { ressources: { waild: { min: 2, max: 20 } } },
    couts: { ressources: [{ id: "jing", value: 1 }] },
    gains: {
      ressources: [
        { id: "humus", value: 1, parCycle: true },
        {
          prerequis: { ressources: { humus: { min: 10 } } },
          id: "jing",
          value: 1,
          parCycle: true,
        },
      ],
    },
  },
  "bilibli soyeux": {
    nom: "Bilibli soyeux",
    type: "plante",
    prerequis: { ressources: { waild: { min: 5, max: 25 } } },
    couts: { ressources: [{ id: "jing", value: 1 }] },
    gains: {
      ressources: [
        { id: "jing", value: 1, parCycle: true },
        {
          prerequis: { ressources: { humus: { min: 15 } } },
          id: "jing",
          value: 1,
          parCycle: true,
        },
        {
          prerequis: { ressources: { humus: { min: 20 } } },
          id: "humus",
          value: 1,
          parCycle: true,
        },
      ],
    },
  },
  "godosava-petites-aiguilles": {
    nom: "Godosava à petites aiguilles",
    type: "plante",
    prerequis: {
      ressources: {
        waild: { min: 20 },
      },
    },
    gains: {
      ressources: [
        { id: "branches", stock: true, stockIndividuel: true, value: 8 },
        {
          id: "branches",
          stockIndividuel: true,
          parCycle: true,
          parRessource: {
            id: "branches",
          },
          value: 1,
        },
        {
          id: "waild",
          parCycle: true,
          parRessource: {
            id: "branches",
            value: 4,
          },
          value: 1,
        },
        {
          id: "humus",
          parCycle: true,
          value: 3,
          prerequis: { ressources: { branches: { min: 8 } } },
        },
      ],
    },
    actions: [
      {
        nom: "Arrosage",
        couts: {
          ressources: [
            {
              id: "eau",
              value: 1,
              parRessource: {
                id: "branches",
              },
            },
          ],
        },
        gains: {
          ressources: [
            {
              id: "branches",
              value: 1,
              stockIndividuel: true,
            },
          ],
        },
      },
    ],
  },
  "gingin-jingong": {
    nom: "Gingin jingong",
    type: "plante",
    prerequis: { ressources: { waild: { min: 8, max: 40 } } },
    couts: { ressources: [{ id: "bourgeons-totipotents", value: 1 }] },
    gains: {
      ressources: [
        { id: "jing", value: 1, parCycle: true },
        { id: "enfants", parCycle: true, value: 0.1 },
      ],
    },
  },
  "bullo-grand-rave": {
    nom: "Bullo grand-rave",
    type: "plante",
    prerequis: { ressources: { waild: { min: 20, max: 50 } } },
    couts: {
      ressources: [
        { id: "eau", value: 2 },
        { id: "jing", value: 1 },
      ],
    },
    gains: {
      ressources: [
        { id: "eau", value: 1, parCycle: true },
        { id: "zums", stock: true, value: 1 },
      ],
    },
  },
  "grand-panus-opaque": {
    nom: "Grand panus opaque",
    type: "plante",
    prerequis: { ressources: { waild: { min: 10, max: 30 } } },
    couts: {
      ressources: [
        { id: "eau", value: 1 },
        { id: "jing", value: 1 },
      ],
    },
    gains: {
      ressources: [
        { id: "branches", stock: true, stockIndividuel: true, value: 16 },
        { id: "branches", stockIndividuel: true, parCycle: true, value: 1 },
        {
          id: "jing",
          value: 1,
          parRessource: {
            id: "branches",
            value: 4,
          },
          parCycle: true,
        },
        {
          id: "protection-waild",
          value: 1,
          parRessource: {
            id: "branches",
          },
          parCycle: true,
        },
      ],
      autres: [
        "{{soleil}} → +1 {{branches}}",

        "{{pluie}} → +1 {{waild}} / {{4 branches}}",
      ],
    },
  },
  "flotib-capsules": {
    nom: "Flotib capsules",
    type: "plante",
    prerequis: {
      ressources: { eau: { min: 15, max: 60 }, waild: { min: 10, max: 35 } },
    },
    couts: {
      ressources: [{ id: "jing", value: 1 }],
    },
    gains: {
      ressources: [
        { id: "branches", stock: true, stockIndividuel: true, value: 3 },
        { id: "branches", stockIndividuel: true, parCycle: true, value: 1 },
        { id: "eau", stock: true, parRessource: { id: "branches" }, value: 1 },
      ],
    },
  },
  "radu-long-blanc": {
    nom: "Radu long-blanc",
    type: "plante",
    prerequis: { ressources: { waild: { min: 15, max: 25 } } },
    couts: {
      ressources: [{ id: "eau", value: 1 }],
    },
    gains: {
      ressources: [
        { id: "jing", stock: true, stockIndividuel: true, value: 4 },
        { id: "jing", stockIndividuel: true, parCycle: true, value: 2 },
      ],
      autres: ["+1 {{eau}} quand collecté"],
    },
  },
  "kokimo-souple": {
    nom: "Kokimo souple",
    type: "plante",
    prerequis: {
      ressources: { eau: { min: 10 }, waild: { min: 15, max: 65 } },
    },
    couts: {
      ressources: [
        { id: "eau", value: 1 },
        { id: "jing", value: 1 },
      ],
    },
    gains: {
      ressources: [
        { id: "branches", stock: true, stockIndividuel: true, value: 8 },
        { id: "branches", stockIndividuel: true, parCycle: true, value: 2 },
        {
          prerequis: { ressources: { branches: { min: 4 } } },
          id: "jing",
          value: 1,
          parCycle: true,
        },
        {
          prerequis: { ressources: { branches: { min: 8 } } },
          id: "zums",
          stock: true,
          value: 2,
        },
        {
          prerequis: { ressources: { branches: { min: 8 } } },
          id: "waild",
          value: 2,
          parCycle: true,
        },
      ],
    },
  },
};
