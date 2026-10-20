import { BASE_CARTES } from "./base/base.cartes";
import { EVOLUTION_BASE_1_CARTES } from "./evolution-base-1/evolution-base-1.cartes";
import { EVOLUTION_BASE_2_CARTES } from "./evolution-base-2/evolution-base-2.cartes";
import { EVOLUTION_BASE_3_CARTES } from "./evolution-base-3/evolution-base-3.cartes";
import { KOLOS_1_CARTES } from "./kolos-1/kolos-1.cartes";
import { PERMA_1_CARTES } from "./perma-1/perma-1.cartes";
import { NOV_1_CARTES } from "./nov-1/nov-1.cartes";

export const TOUTES_CARTES = {
    ...BASE_CARTES,
    ...EVOLUTION_BASE_1_CARTES,
    ...EVOLUTION_BASE_2_CARTES,
    ...EVOLUTION_BASE_3_CARTES,
    ...KOLOS_1_CARTES,
    ...PERMA_1_CARTES,
    ...NOV_1_CARTES,
}