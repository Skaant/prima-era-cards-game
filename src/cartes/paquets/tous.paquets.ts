import { BASE_PAQUET } from "./base/base.paquet";
import type { Paquet } from "./Paquet";

import type { IdPaquets } from "./IdPaquets";

export const TOUS_PAQUETS: {[id in IdPaquets]: Paquet} = {
    base: BASE_PAQUET,
};