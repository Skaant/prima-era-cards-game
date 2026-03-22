import type { IdTribu } from "../types/tribus/IdTribu";
import type { Color } from "../types/Color";

export type TribuData = {
  name: string;
  color: Color;
};

export const TRIBUS: {
  [key in IdTribu]: TribuData;
} = {
  kolokolo: { name: "kolokolo", color: "dark-turquoize" },
  novina: { name: "novina", color: "light-blue" },
  permak: { name: "permak", color: "light-green" },
  washtu: { name: "washtu", color: "turquoize" },
  bivara: { name: "bivara", color: "blue" },
  oumtataoum: { name: "oumtataoum", color: "gold" },
  psikix: { name: "psikix", color: "purple" },
  mikori: { name: "mikori", color: "dark-purple" },
  abzu: { name: "abzu", color: "turquoize" },
  zingazong: { name: "zingazong", color: "turquoize" },
  oraton: { name: "oraton", color: "dark-turquoize" },
  tribili: { name: "tribili", color: "skin" },
  gaengeng: { name: "gaengeng", color: "blue" },
  shapa: { name: "shapa", color: "jewel" },
  kiban: { name: "kiban", color: "orange" },
  strakpa: { name: "strakpa", color: "orange" },
  raag: { name: "raag", color: "green" },
  istichif: { name: "istichif", color: "brown" },
  sionv: { name: "sionv", color: "light-green" },
  falafafu: { name: "falafafu", color: "gold" },
  kosmodin: { name: "kosmodin", color: "deep" },
  negen: { name: "negen", color: "deep" },
  rezli: { name: "rezli", color: "light-skin" },
  estek: { name: "estek", color: "purple" },
  kiouken: { name: "kiouken", color: "orange" },
  sisiklor: { name: "sisiklor", color: "light-green" },
  texnat: { name: "texnat", color: "light-brown" },
  katem: { name: "katem", color: "blue" },
};
