import type { IdRessource } from "../../../types/ressources/IdRessource";

export type IdCarteRessource = Extract<
  IdRessource,
  "eau" | "jing" | "waild" | "data" | "protection-waild"
>;
