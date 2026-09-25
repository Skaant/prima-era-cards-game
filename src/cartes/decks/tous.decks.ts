import { BASE_DECK } from "./base/base.deck";
import type { Deck } from "./Deck";

import type { IdDecks } from "./IdDecks";

export const TOUS_DECKS: {[id in IdDecks]: Deck} = {
    base: BASE_DECK,
};