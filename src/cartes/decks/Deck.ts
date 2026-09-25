import type { IdDecks } from "./IdDecks";

export type Deck<IdCartes extends string = string> = {
  id: IdDecks;
  cartes: {
    [id in IdCartes]:number
  };
};
