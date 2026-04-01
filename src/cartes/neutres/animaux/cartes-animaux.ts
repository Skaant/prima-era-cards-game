import type { Carte } from "../../type/Carte";

export const CARTES_ANIMAUX: { [key: string]: Carte } = {
  "ouistitchoing velu": {
    nom: "Ouistitchoing velu",
    type: "animal",
    prerequis: {
      ressources: [{ id: "waild", op: "min", value: 30 }],
    },
    gains: {
      ressources: [
        { id: "jing", value: 1, parCycle: true },
        { id: "waild", value: 1, parCycle: true },
      ],
    },
  },
};
