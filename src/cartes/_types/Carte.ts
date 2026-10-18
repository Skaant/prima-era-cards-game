import type { _TypeCarte } from "../type-carte/TypeCarte";
import type { CarteBatiment } from "../type-carte/CarteBatiment";
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
  | CarteBatiment
) & {
    prerequis?: PrerequisCarte;
    couts?: CoutsCarte;
    gains?: GainsCarte;
    /** Une fois jouée, la carte disparaît : pas de défausse, ne peut pas être rejouée ni repiochée. */
    unique?: boolean;
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
