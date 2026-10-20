import type { IdCartesBase } from "./base/IdCartesBase";
import type { IdCartesEvolutionBase1 } from "./evolution-base-1/IdCartesEvolutionBase1";
import type { IdCartesEvolutionBase2 } from "./evolution-base-2/IdCartesEvolutionBase2";
import type { IdCartesEvolutionBase3 } from "./evolution-base-3/IdCartesEvolutionBase3";
import type { IdCartesKolos1 } from "./kolos-1/IdCartesKolos1";
import type { IdCartesPerma1 } from "./perma-1/IdCartesPerma1";
import type { IdCartesNov1 } from "./nov-1/IdCartesNov1";

export type IdCartes =
  | IdCartesBase
  | IdCartesEvolutionBase1
  | IdCartesEvolutionBase2
  | IdCartesEvolutionBase3
  | IdCartesKolos1
  | IdCartesPerma1
  | IdCartesNov1;
