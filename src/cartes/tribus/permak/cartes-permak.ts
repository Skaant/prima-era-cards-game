import type { IndexCartes } from "../../IndexCartes";
import type { IdCartePermak } from "./IdCartePermak";

export const CARTES_PERMAK: IndexCartes<IdCartePermak> = {
  cueilleur: {
    nom: "Cueilleur",
    type: "zum",
    description:
      "Collecte (jing / waïld entretenu) : +1 [jing ou humus] supplémentaire",
  },
  jardin: {
    nom: "Jardin",
    type: "bâtiment-artificiel",
    description:
      '-1 waïld, -1 eau, +2 waïld entretenu. *Barettes "conduit" et "récolté"*',
  },
  "échanges avec le jardin": {
    nom: "Échanges avec le jardin",
    type: "amélioration-instantanée",
    description:
      '+2 [eau ou jing ou humus], +1 compteur "conduit" sur le jardin, +1 compteur "récolté" sur le jardin à supprimer au cycle suivant',
  },
  "récolte des fruits": {
    nom: "Récolte des fruits",
    type: "action",
    description: "+1 jing",
  },
  "pluri-collecteur": {
    nom: "Pluri-collecteur",
    type: "zum",
    description: "",
  },
};
