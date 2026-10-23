import type { IdRessource } from "../ressources/IdRessource";
import type { IdRessourceGlobale } from "./etat";

export const RESSOURCES_GLOBALES: IdRessourceGlobale[] = [
  "eau",
  "jing",
  "data",
  "zums",
  "energie",
  "waild",
];

export function estRessourceGlobale(id: IdRessource): id is IdRessourceGlobale {
  return (RESSOURCES_GLOBALES as string[]).includes(id);
}

/** Arrondi à 2 décimales (des gains fractionnaires existent, p. ex. 0,2 zum par cycle). */
export function arrondir(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Ressources globales dont le stock est limité par un stock max (0 au départ, augmenté par les cartes). */
const RESSOURCES_A_STOCK_MAX: IdRessource[] = ["eau", "jing", "zums"];

/** Stock max initial d'une ressource globale (`Infinity` si elle n'est pas limitée). */
export function stockMaxInitial(id: IdRessource): number {
  return RESSOURCES_A_STOCK_MAX.includes(id) ? 0 : Infinity;
}
