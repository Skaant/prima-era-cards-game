import type { Carte } from "../../_types/Carte";
import type { IdCarteKolokolo } from "./IdCarteKolokolo";

export const CARTES_KOLOKOLO: Record<IdCarteKolokolo, Carte> = {
  "petit-dom": {
    nom: "Petit dom",
    type: "bâtiment-organique",
    prerequis: {
      ressources: { waild: { min: 10, max: 25 } },
    },
    couts: {
      ressources: [
        { id: "eau", value: 2 },
        { id: "jing", value: 1 },
      ],
    },
    gains: {
      tribus: {
        kolokolo: 1,
      },
      ressources: [
        { id: "branches", value: 2, stock: true, stockIndividuel: true },
        { id: "branches", value: 1, parCycle: true, stockIndividuel: true },
        {
          id: "zums",
          value: 3,
          stock: true,
          prerequis: { ressources: { branches: { max: 2 } } },
        },
        {
          id: "enfants",
          value: 0.2,
          parCycle: true,
          prerequis: { ressources: { branches: { max: 2 } } },
        },
      ],
    },
  },
  "entrepot-stockage": {
    nom: "Entrepôt de stockage",
    type: "bâtiment-artificiel",
    prerequis: {
      ressources: { waild: { max: 25 } },
    },
    couts: { ressources: [{ id: "jing", value: 3 }] },
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
    couts: { ressources: [{ id: "jing", value: 2 }] },
    gains: {
      ressources: [{ id: "eau", value: 5, stock: true }],
    },
  },
  glaneur: {
    nom: "Glâneur",
    type: "zum",
    couts: {
      ressources: [
        { id: "zums", value: 1 },
        { id: "data", value: 2 },
      ],
    },
    gains: {
      autres: [
        "+1 {{eau}} ou {{jing}} / cycle",
        "Peut collecter 2 ressources pour 1 {{actions}}",
      ],
    },
  },
  "haie-mature": {
    nom: "Haie mature",
    type: "bâtiment-organique",
    prerequis: {
      ressources: { waild: { min: 5, max: 50 } },
    },
    couts: {
      ressources: [
        { id: "eau", value: 2 },
        { id: "jing", value: 2 },
      ],
    },
    gains: {
      ressources: [
        { id: "branches", stockIndividuel: true, value: 2, stock: true },
        { id: "branches", stockIndividuel: true, value: 1, parCycle: true },
        {
          id: "waild",
          value: 1,
          parRessource: {
            id: "branches",
          },
        },
        {
          id: "protection-waild",
          value: 3,
          parRessource: {
            id: "branches",
          },
        },
        {
          id: "humus",
          stockIndividuel: "out",
          value: 2,
          stock: true,
          prerequis: { ressources: { branches: { min: 2 } } },
        },
        {
          id: "humus",
          stockIndividuel: true,
          value: 1,
          parCycle: true,
          prerequis: { ressources: { branches: { min: 2 } } },
        },
      ],
    },
  },
  "poche-impermeable": {
    nom: "Poche imperméable",
    type: "module-organique",
    prerequis: {
      tribus: {
        kolokolo: 4,
      },
      ressources: {
        waild: {
          min: 5,
          max: 45,
        },
      },
    },
    couts: { ressources: [{ id: "eau", value: 1 }] },
    gains: {
      ressources: [{ id: "eau", stock: true, value: 2 }],
    },
    notes: ["Compatible seulement avec un bâtiment organique"],
  },
  cellier: {
    nom: "Cellier",
    type: "module-artificiel",
    prerequis: {
      tribus: {
        kolokolo: 4,
      },
      ressources: {
        waild: {
          max: 55,
        },
      },
    },
    couts: { ressources: [{ id: "jing", value: 1 }] },
    gains: {
      ressources: [{ id: "jing", stock: true, value: 2 }],
    },
    notes: ["Compatible seulement avec un bâtiment artificiel"],
  },
  "mousse-epaisse": {
    nom: "Mousse épaisse",
    type: "module-organique",
    prerequis: {
      tribus: {
        kolokolo: 4,
      },
      ressources: {
        waild: {
          min: 10,
        },
      },
    },
    couts: { ressources: [{ id: "eau", value: 1 }] },
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
          ressources: [{ id: "pluie", value: 1 }],
        },
        gains: {
          ressources: [
            { id: "waild", value: 1 },
            {
              prerequis: {
                ressources: {
                  jing: {
                    stockIndividuelPlein: true,
                  },
                },
              },
              id: "humus",
              value: 1,
            },
          ],
        },
      },
    ],
  },
  treille: {
    nom: "Treille",
    type: "module-organique",
    prerequis: {
      tribus: {
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
      ressources: [
        { id: "eau", value: 1 },
        { id: "jing", value: 1 },
      ],
    },
    gains: {
      ressources: [{ id: "jing", parCycle: true, value: 1 }],
    },
    actions: [
      {
        nom: "Fructification",
        couts: {
          ressources: [{ id: "soleil", value: 1 }],
        },
        gains: {
          ressources: [
            { id: "jing", value: 1 },
            {
              prerequis: {
                ressources: {
                  jing: {
                    stockPlein: true,
                  },
                },
              },
              id: "waild",
              value: 2,
            },
          ],
        },
      },
    ],
  },
  "extension-habitable": {
    nom: "Extension habitable",
    type: "module-organique",
    prerequis: {
      tribus: {
        kolokolo: 4,
      },
    },
    couts: { ressources: [{ id: "eau", value: 1 }] },
    gains: {
      ressources: [{ id: "zums", value: 1, stock: true }],
    },
    notes: ["Compatible seulement avec un bâtiment organique"],
  },
  "ambiance-forestiere": {
    nom: "Ambiance forestière",
    type: "amélioration-durable",
    prerequis: {
      tribus: {
        kolokolo: 10,
      },
    },
    couts: { ressources: [{ id: "data", value: 20 }] },
    gains: {
      autres: [
        "+1 bâtiment organique → +1 {{waild}} / cycle",
        "+1 module organique → +2 {{waild}}",
      ],
    },
  },
  ecole: {
    nom: "Ecole",
    type: "bâtiment-organique",
    prerequis: {
      tribus: {
        kolokolo: 10,
      },
    },
    couts: {
      ressources: [
        { id: "eau", value: 2 },
        { id: "jing", value: 2 },
        { id: "data", value: 10 },
      ],
    },
    gains: {
      ressources: [
        {
          id: "data",
          value: 1,
          parCycle: true,
          parRessource: {
            id: "enfants",
          },
        },
      ],
      autres: ["Une fois par cycle : +1 maturité pour 1 {{enfants}}"],
    },
    histoire:
      "L'école est une structure protéiforme, qui génère des motifs simples et se laisse modeler par les enfants.",
  },
  pepiniere: {
    nom: "Pépinière",
    type: "bâtiment-organique",
    prerequis: {
      tribus: {
        kolokolo: 10,
      },
    },
    couts: {
      ressources: [
        { id: "eau", value: 1, parCycle: true },
        { id: "jing", value: 1 },
      ],
    },
    gains: {
      ressources: [
        {
          id: "bourgeons-totipotents",
          value: 1,
          parCycle: true,
        },
      ],
      autres: [
        "Réduit de 1 le coût d'une plante ou d'un bâtiment organique, *une fois / cycle*",
      ],
    },
  },
  "avant-poste": {
    nom: "Avant-poste",
    type: "bâtiment-artificiel",
    prerequis: {
      tribus: {
        kolokolo: 5,
      },
    },
    gains: {
      ressources: [
        {
          id: "data",
          value: 1,
          parCycle: true,
          parRessource: {
            id: "waild",
            value: 10,
          },
        },
        {
          id: "protection-waild",
          value: 2,
        },
      ],
    },
  },
  "station-purin": {
    nom: "Station à purin",
    type: "bâtiment-artificiel",
    prerequis: {
      tribus: {
        kolokolo: 8,
      },
    },
    couts: {
      ressources: [
        {
          id: "jing",
          value: 2,
        },
      ],
    },
    actions: [
      {
        nom: "Remplir",
        couts: {
          ressources: [
            {
              id: "eau",
              value: 1,
            },
          ],
        },
        gains: {
          ressources: [
            {
              id: "branches",
              value: 1,
            },
          ],
        },
        notes: ["2 fois par cycle max"],
      },
    ],
  },
  "confiance-mutuelle": {
    nom: "Confiance mutuelle",
    type: "amélioration-ponctuelle",
    prerequis: {
      tribus: {
        kolokolo: 12,
      },
    },
    couts: {
      ressources: [{ id: "data", value: 12 }],
    },
    gains: {
      ressources: [
        { id: "waild", value: 1 },
        { id: "protection-waild", value: 1 },
      ],
    },
  },
  brasero: {
    nom: "Brasero",
    type: "bâtiment-artificiel",
    prerequis: {
      tribus: { kolokolo: 5 },
    },
    couts: {
      ressources: [
        {
          id: "jing",
          value: 2,
        },
        { id: "waild", value: 1, parCycle: true },
      ],
    },
    gains: {
      ressources: [
        { id: "humus", value: 1, parCycle: true },
        { id: "protection-waild", value: 6 },
      ],
    },
  },
  "vault-cooperation": {
    nom: "Vault de coopération",
    type: "vault",
    prerequis: {
      tribus: {
        kolokolo: 25,
      },
    },
    couts: {
      ressources: [
        { id: "eau", value: 5 },
        { id: "jing", value: 2, parCycle: true },
      ],
    },
    gains: {
      ressources: [
        { id: "protection-waild", value: 12 },
        {
          id: "data",
          value: 1,
          parRessource: {
            id: "protection-waild",
          },
          parCycle: true,
        },
      ],
    },
  },
  "coeur-colonie": {
    nom: "Coeur de la colonie",
    type: "saint",
    prerequis: {
      tribus: {
        kolokolo: 20,
      },
      ressources: {
        zums: { min: 15 },
      },
    },
    couts: {
      ressources: [
        { id: "zums", value: 1 },
        { id: "data", value: 25 },
      ],
    },
    gains: {
      ressources: [
        {
          id: "data",
          value: 1,
          parRessource: {
            id: "batiments",
          },
          parCycle: true,
        },
      ],
      autres: ["{{enfants}} *devient* {{zums}} → +5 {{data}}"],
    },
  },
  "liberateur-du-waild": {
    nom: "Libérateur du waïld",
    type: "saint",
    prerequis: { tribus: { kolokolo: 18 }, ressources: { zums: { min: 12 } } },
    couts: {
      ressources: [
        { id: "zums", value: 1 },
        { id: "data", value: 30 },
      ],
    },
    gains: {
      ressources: [{ id: "humus", value: 2, parCycle: true }],
    },
    actions: [
      {
        nom: "Libérer",
        couts: { ressources: [{ id: "protection-waild", value: 1 }] },
        gains: {
          ressources: [
            { id: "waild", value: 3 },
            { id: "data", value: 8 },
          ],
        },
      },
    ],
  },
  "balise-pshf": {
    nom: "Balise pshf",
    type: "bâtiment-organique",
    prerequis: {
      tribus: {
        kolokolo: 6,
      },
    },
    couts: {
      ressources: [
        { id: "eau", value: 1 },
        { id: "jing", value: 1 },
      ],
    },
    gains: {
      ressources: [
        { id: "branches", stock: true, stockIndividuel: true, value: 3 },
        {
          id: "protection-waild-max",
          value: 1,
          parRessource: { id: "branches" },
        },
      ],
    },
    actions: [
      {
        nom: "Consummer",
        couts: {
          ressources: [{ id: "waild", value: 1 }],
        },
        gains: {
          ressources: [
            { id: "branches", value: 1, stockIndividuel: true },
            { id: "jing", value: 1 },
            {
              id: "humus",
              value: 1,
              prerequis: {
                ressources: {
                  branches: {
                    min: 3,
                  },
                },
              },
            },
          ],
        },
      },
    ],
  },
  "salon-confortable": {
    nom: "Salon confortable",
    type: "module-organique",
    prerequis: {
      tribus: { kolokolo: 8 },
      ressources: {
        zums: {
          min: 4,
        },
      },
    },
    couts: {
      ressources: [
        { id: "jing", value: 1 },
        { id: "data", value: 4 },
      ],
    },
    gains: {
      ressources: [{ id: "enfants", parCycle: true, value: 0.3 }],
    },
    notes: ["Compatible seulement avec un bâtiment organique"],
  },
  "vault-comemorative": {
    nom: "Vault comémorative",
    type: "vault",
    prerequis: {
      tribus: { kolokolo: 30 },
      ressources: {
        waild: { min: 40 },
        batiments: { min: 15 },
      },
    },
    couts: {
      ressources: [
        {
          id: "eau",
          value: 10,
        },
        {
          id: "jing",
          value: 10,
        },
      ],
    },
    gains: {
      ressources: [
        {
          id: "data",
          value: 1,
          parRessource: {
            id: "batiments",
          },
          parCycle: true,
        },
        {
          id: "zums",
          value: 1,
          stock: true,
          parRessource: {
            id: "batiments",
          },
        },
        {
          id: "enfants",
          value: 0.1,
          parRessource: {
            id: "batiments",
          },
          parCycle: true,
        },
      ],
    },
  },
  faculte: {
    nom: "Faculté",
    type: "bâtiment-organique",
    prerequis: { tribus: { kolokolo: 15 }, ressources: { data: { min: 40 } } },
    couts: {
      ressources: [
        { id: "eau", value: 2 },
        { id: "jing", value: 4 },
      ],
    },
    gains: {
      autres: [
        "+1 {{waild}} / {{enfants}} avec maturité ⋝ 2 / cycle",
        "+1 {{actions}} / {{enfants}} avec maturité ⋝ 2 / cycle",
      ],
    },
  },
  ludotheque: {
    nom: "Ludothèque",
    type: "bâtiment-organique",
    prerequis: { tribus: { kolokolo: 8 }, ressources: { data: { min: 20 } } },
    couts: {
      ressources: [
        { id: "eau", value: 2 },
        { id: "jing", value: 2 },
      ],
    },
    gains: {
      ressources: [
        {
          id: "data",
          value: 1,
          parRessource: {
            id: "enfants",
          },
          parCycle: true,
        },
      ],
    },
    actions: [
      {
        nom: "Animer",
        couts: {
          ressources: [
            {
              id: "actions",
              value: 1,
              parRessource: {
                id: "enfants",
                value: 4,
              },
            },
          ],
        },
        gains: {
          ressources: [
            {
              id: "data",
              value: 1,
              parRessource: {
                id: "enfants",
              },
            },
          ],
        },
      },
    ],
  },
  "cuisine-sauvage": {
    nom: "Cuisine sauvage",
    type: "action",
    prerequis: {
      tribus: {
        kolokolo: 5,
      },
      ressources: {
        waild: {
          min: 12,
        },
      },
    },
    couts: {
      ressources: [
        { id: "actions", value: 1 },
        { id: "waild", value: 1 },
      ],
    },
    gains: { ressources: [{ id: "jing", value: 3 }] },
  },
  "reduction-utile": {
    nom: "Réduction utile",
    type: "action",
    prerequis: { tribus: { kolokolo: 4 } },
    couts: {
      ressources: [
        { id: "actions", value: 1 },
        { id: "branches", value: 1 },
      ],
    },
    gains: {
      ressources: [
        { id: "eau", value: 1 },
        { id: "jing", value: 1 },
      ],
    },
  },
  banquet: {
    nom: "Banquet",
    type: "action",
    prerequis: {
      tribus: {
        kolokolo: 4,
      },
    },
    couts: {
      ressources: [
        { id: "actions", value: 1 },
        { id: "eau", value: 1 },
        { id: "jing", value: 1 },
      ],
    },
    gains: {
      ressources: [
        { id: "enfants", value: 0.5 },
        { id: "data", value: 5 },
      ],
    },
    notes: ["Peut-être dupliqué pour chaque tranche de 5 {{zums}}"],
  },
  serre: {
    nom: "Serre",
    type: "bâtiment-organique",
    prerequis: {
      tribus: { kolokolo: 10 },
      ressources: { waild: { min: 8, max: 30 } },
    },
    couts: {
      ressources: [
        { id: "eau", value: 1, parCycle: true },
        { id: "jing", value: 1 },
      ],
    },
    gains: { ressources: [{ id: "jing", value: 2, parCycle: true }] },
  },
  "magicien-decharge": {
    nom: "Magicien de la décharge",
    type: "zum",
    prerequis: { tribus: { kolokolo: 8 } },
    couts: {
      ressources: [
        { id: "zums", value: 1 },
        { id: "data", value: 4 },
      ],
    },
    gains: {
      autres: ["+1 {{batiments}} → +1 {{eau}} ou +1 {{jing}}"],
    },
    actions: [
      {
        nom: "Recycler",
        couts: { ressources: [{ id: "actions", value: 1 }] },
        gains: {
          autres: [
            "Récupère 2 ressources du coût d'un bâtiment ou d'une plante, jusqu'à épuisement. *La carte devient* en recyclage *.*",
          ],
        },
        notes: ["Une carte en recyclage ne produit plus d'effets."],
      },
    ],
  },
  "curieux-plantes": {
    nom: "Curieux des plantes",
    type: "zum",
    prerequis: { tribus: { kolokolo: 6 }, ressources: { waild: { min: 6 } } },
    couts: {
      ressources: [
        { id: "zums", value: 1 },
        { id: "data", value: 8 },
      ],
    },
    gains: {
      autres: ["+1 {{plantes}} → +1 {{data}} / {{zums}} {{kolokolo}}"],
    },
  },
  fermenteur: {
    nom: "Fermenteur",
    type: "zum",
    prerequis: { tribus: { kolokolo: 3 }, ressources: { jing: { min: 8 } } },
    couts: {
      ressources: [
        { id: "zums", value: 1 },
        { id: "data", value: 5 },
      ],
    },
    gains: { ressources: [{ id: "jing", value: 2, stock: true }] },
    actions: [
      {
        nom: "Faire fermenter",
        couts: {
          ressources: [
            { id: "actions", value: 1 },
            { id: "eau", value: 1 },
            { id: "jing", value: 1 },
          ],
        },
        gains: { ressources: [{ id: "jing", value: 4 }] },
      },
    ],
  },
  potagiste: {
    nom: "Potagiste",
    type: "zum",
    prerequis: { tribus: { kolokolo: 6 } },
    couts: {
      ressources: [
        { id: "zums", value: 1 },
        { id: "data", value: 10 },
      ],
    },
    gains: {
      autres: ["+1 {{waild}} → +1 {{data}}, *max 5 fois / cycle*"],
    },
    actions: [
      {
        nom: "Cultiver",
        couts: {
          ressources: [
            { id: "soleil", value: 1 },
            { id: "actions", value: 1 },
          ],
        },
        gains: { ressources: [{ id: "jing", value: 3 }] },
      },
    ],
  },
  ensorceleur: {
    nom: "Ensorceleur",
    type: "zum",
    prerequis: { tribus: { kolokolo: 12 }, ressources: { zums: { min: 8 } } },
    couts: {
      ressources: [
        { id: "zums", value: 1 },
        { id: "jing", value: 2 },
        { id: "data", value: 8 },
      ],
    },
    gains: {
      ressources: [{ id: "enfants", value: 0.3, parCycle: true }],
      autres: [
        "{{enfants}} *devient* {{zums}} → +0.1 {{enfants}} / cycle",
        "{{enfants}} *devient* {{zums}} → +1 {{waild}}",
      ],
    },
  },
};
