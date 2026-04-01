import type { IndexCartes } from "../../IndexCartes";
import type { IdCarteKolokolo } from "./IdCarteOraton";

export const CARTES_KOLOKOLO: IndexCartes<IdCarteKolokolo> = {
  dom: {
    nom: "Dom",
    type: "bâtiment-organique",
    description: "+2 stock zums,\n+0.3 enfants / cycle",
  },
  glâneur: {
    nom: "Glâneur",
    type: "zum",
    description: "+1 eau ou jing / cycle,\nCollecte (jing): +1 jing",
  },
};
