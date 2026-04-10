import type { IdRessource } from "../../../ressources/IdRessource";

export type IdCarteRessource = Extract<
  IdRessource,
  "eau" | "jing" | "waild" | "data" | "protection-waild"
>;
