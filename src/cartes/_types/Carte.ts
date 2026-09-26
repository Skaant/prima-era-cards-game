import type { _TypeCarte } from "../type-carte/TypeCarte";
import type { CarteBatimentOrganique } from "../type-carte/CarteBatimentOrganique";
import type { CartePlante } from "../type-carte/CartePlante";
import type { GainsCarte } from "./GainsCarte";
import type { PrerequisCarte } from "./PrerequisCarte";
import type { CoutsCarte } from "./CoutsCarte";
import type { ParRessource } from "./ParRessource";

export type Carte = {
  nom: string;
} & (
  | {
      type: _TypeCarte;
    }
  | CartePlante
  | CarteBatimentOrganique
) & {
    prerequis?: PrerequisCarte;
    couts?: CoutsCarte;
    gains?: GainsCarte;
    actions?: {
      prerequis?: PrerequisCarte;
      nom: string;
      couts: CoutsCarte;
      gains: GainsCarte;
      /** Combien de fois par tour */
      fois?: {
        value: number;
        parRessource?: ParRessource;
      };
      notes?: string[];
    }[];
    notes?: string[];
    histoire?: string;
  };
