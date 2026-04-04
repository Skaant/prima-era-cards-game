import type { _TypeCarte } from "../type-carte/TypeCarte";
import type { CarteBatimentOrganique } from "../type-carte/CarteBatimentOrganique";
import type { CartePlante } from "../type-carte/CartePlante";
import type { GainsCarte } from "./GainsCarte";
import type { PrerequisCarte } from "./PrerequisCarte";
import type { CoutsCarte } from "./CoutsCarte";

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
      nom: string;
      couts: CoutsCarte;
      gains: GainsCarte;
      notes?: string[];
    }[];
    notes?: string[];
    histoire?: string;
  };
