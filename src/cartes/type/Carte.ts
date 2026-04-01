import type { IdRessource } from "../../types/ressources/IdRessource";
import type { IdTribu } from "../../types/tribus/IdTribu";
import type { _TypeCarte } from "../TypeCarte";
import type { CarteBatimentOrganique } from "./CarteBatimentOrganique";
import type { CartePlante } from "./CartePlante";

export type Carte = {
  nom: string;
} & (
  | {
      type: _TypeCarte;
    }
  | CartePlante
  | CarteBatimentOrganique
) & {
    /** Développement : résumé non formaté */
    description?: string;
    prerequis?: {
      traibs?: { [key in IdTribu]?: number };
      ressources?: { [key in IdRessource]?: { min?: number; max?: number } };
    };
    couts?: {
      [key in IdRessource]?: number;
    };
    gains?: {
      traibs?: { [key in IdTribu]?: number };
      ressources?: ({
        id: IdRessource;
        value: number;
        stockIndividuel?: true | "in" | "out";
      } & (
        | {
            stock: true;
          }
        | {
            parCycle?: true;
          }
      ) & {
          /** actif quand max branches atteint (plantes et bâtiments organiques) */
          aBranchesMax?: true;
          aBranches?: number;
          parBranche?: true;
        })[];
      autres?: string[];
    };
    actions?: {
      nom: string;
      couts: {
        [key in IdRessource]?: number;
      };
      effet: string;
    }[];
    astuces?: string[];
    histoire?: string;
  };
