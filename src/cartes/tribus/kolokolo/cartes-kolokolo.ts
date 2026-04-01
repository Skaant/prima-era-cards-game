import type { Carte } from "../../type/Carte";
import type { IdCarteKolokolo } from "./IdCarteKolokolo";

export const CARTES_KOLOKOLO: Record<IdCarteKolokolo, Carte> = {
  "petit-dom": {
    nom: "Petit dom",
    type: "bâtiment-organique",
    prerequis: {
      ressources: { waild: { min: 10, max: 25 } },
    },
    couts: { eau: 2, jing: 1 },
    gains: {
      ressources: [
        { id: "branches", value: 2, stock: true, stockIndividuel: true },
        { id: "branches", value: 1, parCycle: true, stockIndividuel: true },
        { id: "zums", value: 3, stock: true, aBranchesMax: true },
        { id: "enfants", value: 0.2, parCycle: true, aBranchesMax: true },
      ],
    },
  },
  "entrepot-stockage": {
    nom: "Entrepôt de stockage",
    type: "bâtiment-artificiel",
    prerequis: {
      ressources: { waild: { max: 25 } },
    },
    couts: {
      jing: 3,
    },
    gains: {
      ressources: [
        {
          stock: true,
          id: "jing",
          value: 8,
        },
      ],
    },
  },
  citerne: {
    nom: "Citerne",
    type: "bâtiment-artificiel",
    prerequis: {
      ressources: {
        waild: {
          max: 20,
        },
      },
    },
    couts: {
      jing: 2,
    },
    gains: {
      ressources: [{ id: "eau", value: 5, stock: true }],
    },
  },
  glaneur: {
    nom: "Glâneur",
    type: "zum",
    description: "+1 eau ou jing / cycle,\nCollecte (jing): +1 jing",
  },
  "haie-mature": {
    nom: "Haie mature",
    type: "bâtiment-organique",
    prerequis: {
      ressources: { waild: { min: 5, max: 50 } },
    },
    couts: { eau: 2, jing: 2 },
    gains: {
      ressources: [
        { id: "branches", stockIndividuel: true, value: 1, parCycle: true },
        { id: "branches", stockIndividuel: true, value: 2, stock: true },
        { id: "waild", value: 1, parBranche: true },
        { id: "protection-waild", value: 3, parBranche: true },
        {
          id: "humus",
          stockIndividuel: "out",
          value: 1,
          parCycle: true,
          aBranchesMax: true,
        },
        { id: "humus", stockIndividuel: "out", value: 2, stock: true },
      ],
    },
  },
  "poche-impermeable": {
    nom: "Poche imperméable",
    type: "module-organique",
    prerequis: {
      traibs: {
        kolokolo: 4,
      },
      ressources: {
        waild: {
          min: 5,
          max: 45,
        },
      },
    },
    couts: {
      eau: 1,
    },
    gains: {
      ressources: [{ id: "eau", stock: true, value: 2 }],
    },
    astuces: ["Compatible seulement avec un bâtiment organique"],
  },
  cellier: {
    nom: "Cellier",
    type: "module-artificiel",
    prerequis: {
      traibs: {
        kolokolo: 4,
      },
      ressources: {
        waild: {
          max: 55,
        },
      },
    },
    couts: {
      jing: 1,
    },
    gains: {
      ressources: [{ id: "jing", stock: true, value: 2 }],
    },
    astuces: ["Compatible seulement avec un bâtiment artificiel"],
  },
  "mousse-epaisse": {
    nom: "Mousse épaisse",
    type: "module-organique",
    prerequis: {
      traibs: {
        kolokolo: 4,
      },
      ressources: {
        waild: {
          min: 10,
        },
      },
    },
    couts: {
      eau: 1,
    },
    gains: {
      ressources: [
        { id: "waild", stock: true, value: 1 },
        { id: "jing", stock: true, stockIndividuel: "out", value: 2 },
        { id: "jing", parCycle: true, stockIndividuel: true, value: 1 },
      ],
    },
    actions: [
      {
        nom: "Croissance",
        couts: {
          pluie: 1,
        },
        effet: "+1 {{waild}}, si {{jing}} (stock indiv.) plein : +1 {{humus}}",
      },
    ],
  },
  treille: {
    nom: "Treille",
    type: "module-organique",
    prerequis: {
      traibs: {
        kolokolo: 4,
      },
      ressources: {
        waild: {
          min: 10,
          max: 30,
        },
      },
    },
    couts: {
      eau: 1,
      jing: 1,
    },
    gains: {
      ressources: [{ id: "jing", parCycle: true, value: 1 }],
    },
    actions: [
      {
        nom: "Fructification",
        couts: {
          soleil: 1,
        },
        effet: "+1 {{jing}}, si {{jing}} global plein : +2 {{waild}}",
      },
    ],
  },
};
