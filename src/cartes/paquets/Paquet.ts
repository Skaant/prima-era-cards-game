import type { IdPaquets } from "./IdPaquets";

export type Paquet<IdCartes extends string = string> = {
  id: IdPaquets;
  cartes: {
    [id in IdCartes]:number
  };
};
