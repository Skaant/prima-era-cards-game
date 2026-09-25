import type { IndexCartes } from "../../IndexCartes";
import type { IdCartesBase } from "./IdCartesBase";

export const BASE_CARTES: IndexCartes<IdCartesBase> = {
    'dom': {
        nom: 'Dom',
        type: 'bâtiment-organique',
        prerequis: {
            ressources: {
                waild: {
                    max:25
                }
            }
        },
        couts: {
            ressources: [
                {id: 'eau', value: 1},
                {id: 'jing', value: 2}
            ]
        },
        gains: {
            ressources: [
                {id: 'jing', value: 1, parCycle: true},
                {id: 'zums', stock: true, value: 2}
            ]
        }
    },
    'decouvreureuse': {
        nom: 'Découvreureuse',
        type: 'zum'
    },
    'flaqueureuse': {
        nom: 'Flaqueureuse',
        type: 'champignon'
    },
    'ramasseureuse': {
        nom: 'Ramasseureuse',
        type: 'zum'
    },
    'collecte du wa': {
        nom: 'Collecte du Wa',
        type: 'action'
    },
    'senseureuse': {
        nom: 'Senseureuse',
        type: 'plante'
    }
}