import type { Carte } from "../../_types/Carte";
import type { IdCarteAnimal } from "./IdCarteAnimal";

export const CARTES_ANIMAUX: { [key in IdCarteAnimal]: Carte } = {
  "ouistitchoing-velu": {
    nom: "Ouistitchoing velu",
    type: "animal",
    prerequis: {
      ressources: { waild: { min: 30 } },
    },
    gains: {
      ressources: [
        { id: "jing", value: 1, parCycle: true },
        { id: "waild", value: 1, parCycle: true },
      ],
    },
  },
  "chiouf-cordial": {
    nom: "Chiouf cordial",
    type: "animal",
    prerequis: {
      ressources: { waild: { min: 8 } },
    },
    couts: {
      ressources: [
        { id: "eau", value: 1 },
        { id: "jing", value: 2 },
      ],
    },
    gains: {
      ressources: [{ id: "protection-waild", value: 2 }],
    },
    actions: [
      {
        nom: "Flatter",
        couts: {
          ressources: [{ id: "actions", value: 1 }],
        },
        gains: {
          ressources: [{ id: "jing", value: 2 }],
        },
      },
    ],
  },
  "skarabara-gratgrat": {
    nom: "Skarabara gratgrat",
    type: "animal",
    prerequis: {
      ressources: {
        waild: {
          min: 20,
        },
      },
    },
    couts: {
      ressources: [{ id: "jing", value: 2 }],
    },
    gains: {
      ressources: [
        { id: "waild", value: 1 },
        { id: "jing", value: 1, stock: true, stockIndividuel: "out" },
      ],
    },
    actions: [
      {
        nom: "Digérer",
        couts: { ressources: [{ id: "humus", value: 1 }] },
        gains: {
          ressources: [
            { id: "jing", value: 1, stockIndividuel: true },
            { id: "waild", value: 3 },
          ],
        },
      },
    ],
  },
  "farmi-groutaliniere": {
    nom: "Farmi groutalinière",
    type: "animal",
    prerequis: { ressources: { waild: { min: 2, max: 25 } } },
    couts: {
      ressources: [
        { id: "jing", value: 1 },
        { id: "waild", value: 1 },
      ],
    },
    gains: {
      ressources: [{ id: "waild", parCycle: true, value: 1 }],
    },
  },
  "pique-pique-crete-bleue": {
    nom: "Pique-pique crête bleue",
    type: "animal",
    prerequis: { ressources: { waild: { min: 15, max: 50 } } },
    couts: {
      ressources: [
        { id: "eau", value: 1 },
        { id: "jing", value: 1, parCycle: true },
      ],
    },
    gains: {
      ressources: [{ id: "humus", parCycle: true, value: 2 }],
    },
  },
  "galegou-criard": {
    nom: "Galegou criard",
    type: "animal",
    prerequis: { ressources: { waild: { min: 10, max: 60 } } },
    couts: {
      ressources: [
        { id: "eau", value: 1 },
        { id: "jing", value: 1 },
      ],
    },
    gains: {
      ressources: [{ id: "waild", parCycle: true, value: 3 }],
    },
    notes: [
      "Désactive les effets d'une plante, ou désactive ses propres effets",
    ],
  },
  "lazazar-souzelar": {
    nom: "Lazazar souzelar",
    type: "animal",
    prerequis: { ressources: { waild: { min: 0, max: 30 } } },
    couts: {
      ressources: [{ id: "jing", value: 2 }],
    },
    actions: [
      {
        nom: "Kiffer",
        couts: { ressources: [{ id: "soleil", value: 1 }] },
        gains: { ressources: [{ id: "waild", value: 2 }] },
      },
    ],
  },
  "groakon-mares": {
    nom: "Groakon mares",
    type: "animal",
    prerequis: { ressources: { eau: { min: 8 }, waild: { min: 10, max: 25 } } },
    couts: {
      ressources: [{ id: "pluie", value: 1 }],
    },
    actions: [
      {
        nom: "Kiffer",
        couts: { ressources: [{ id: "pluie", value: 1 }] },
        gains: { ressources: [{ id: "humus", value: 1 }] },
      },
    ],
  },
  "gris-argente-sous-cailloux": {
    nom: "Gris argenté sous-cailloux",
    type: "animal",
    prerequis: {
      ressources: { eau: { min: 15 }, waild: { min: 10, max: 30 } },
    },
    couts: {
      ressources: [
        { id: "eau", value: 1 },
        { id: "jing", value: 1 },
      ],
    },
    gains: {
      ressources: [{ id: "waild", parCycle: true, value: 1 }],
    },
  },
  "maakiri-voulvoulnavier": {
    nom: "Maakiri voulvoulnavier",
    type: "animal",
    prerequis: { ressources: { waild: { min: 15, max: 45 } } },
    couts: {
      ressources: [
        { id: "eau", value: 1 },
        { id: "jing", value: 2 },
      ],
    },
    gains: {
      ressources: [
        { id: "humus", stock: true, stockIndividuel: "out", value: 2 },
      ],
    },
    actions: [
      {
        nom: "Manger",
        couts: { ressources: [{ id: "waild", value: 1 }] },
        gains: {
          ressources: [
            { id: "jing", value: 1 },
            { id: "humus", value: 1, stockIndividuel: true },
          ],
        },
      },
    ],
  },
  "babou-replanteur": {
    nom: "Babou replanteur",
    type: "animal",
    prerequis: { ressources: { waild: { min: 10, max: 65 } } },
    couts: {
      ressources: [
        { id: "eau", value: 2 },
        { id: "jing", value: 1 },
      ],
    },
    gains: {
      ressources: [{ id: "waild", parCycle: true, value: 1 }],
    },
    actions: [
      {
        nom: "Manger",
        couts: { ressources: [{ id: "jing", value: 1 }] },
        gains: {
          ressources: [
            { id: "waild", value: 2 },
            { id: "data", value: 2 },
          ],
        },
      },
    ],
  },
};
