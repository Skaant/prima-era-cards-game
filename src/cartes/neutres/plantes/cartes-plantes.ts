import type { IndexCartes } from "../../IndexCartes";
import type { IdCartePlante } from "./IdCartePlante";

export const CARTES_PLANTES: IndexCartes<IdCartePlante> = {
  "poadi rhizomatique": {
    nom: "Poadi rhizomatique",
    type: "plante",
    description:
      "+1 humus / cycle. Si humus > 10, +1 jing / cycle supplémentaire",
  },
  "bilibli soyeux": {
    nom: "Bilibli soyeux",
    type: "plante",
    description:
      "+1 jing / cycle. Si humus > 25, +1 jing et +1 humus / cycle supplémentaires",
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
          parBranche: true,
          value: 1,
        },
        {
          id: "waild",
          parCycle: true,
          parBranche: true,
          value: 0.25,
        },
        {
          aBranchesMax: true,
          id: "humus",
          parCycle: true,
          value: 3,
        },
      ],
    },
    actions: [
      {
        nom: "Arrosage",
        couts: {},
        effet: "1 {{eau}} / {{branches}} => +1 {{branches}}",
      },
    ],
  },
};
