import type { Paquet } from "../Paquet";
import type { IdCartesBase } from "./IdCartesBase";

export const BASE_PAQUET: Paquet<IdCartesBase> = {
    id: 'base',
    cartes: {
        'dom': 3,
        'collecte du wa': 2,
        'decouvreureuse': 3,
        'flaqueureuse': 3,
        'ramasseureuse': 2,
        'senseureuse': 3
    }
};