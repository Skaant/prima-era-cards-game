import { BASE_PAQUET } from "./base/base.paquet";
import { EVOLUTION_BASE_1_PAQUET } from "./evolution-base-1/evolution-base-1.paquet";
import { EVOLUTION_BASE_2_PAQUET } from "./evolution-base-2/evolution-base-2.paquet";
import { EVOLUTION_BASE_3_PAQUET } from "./evolution-base-3/evolution-base-3.paquet";
import { KOLOS_1_PAQUET } from "./kolos-1/kolos-1.paquet";
import { PERMA_1_PAQUET } from "./perma-1/perma-1.paquet";
import { NOV_1_PAQUET } from "./nov-1/nov-1.paquet";
import type { Paquet } from "./Paquet";

import type { IdPaquets } from "./IdPaquets";

export const TOUS_PAQUETS: {[id in IdPaquets]: Paquet} = {
    base: BASE_PAQUET,
    'evolution-base-1': EVOLUTION_BASE_1_PAQUET,
    'evolution-base-2': EVOLUTION_BASE_2_PAQUET,
    'evolution-base-3': EVOLUTION_BASE_3_PAQUET,
    'kolos-1': KOLOS_1_PAQUET,
    'perma-1': PERMA_1_PAQUET,
    'nov-1': NOV_1_PAQUET,
};