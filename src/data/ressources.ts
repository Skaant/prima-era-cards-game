import type { IdRessource } from "../ressources/IdRessource";
import type { IdColor } from "./IdColor";

export type RessourceData = {
  name: string;
  plural?: string;
  color: IdColor;
  stockGlobal?: true;
  stockIndividuel?: true;
  temporalite?: number;
  parCycle?: true;
};

export const RESSOURCES: {
  [key in IdRessource]: RessourceData;
} = {
  eau: { name: "eau", color: "blue", stockGlobal: true, parCycle: true },
  jing: { name: "jing", color: "skin", stockGlobal: true, parCycle: true },
  waild: { name: "waild", color: "dark-green", parCycle: true },
  data: { name: "data", color: "turquoize", parCycle: true },
  aibs: { name: "aïbs", color: "gold" },
  zums: { name: "zum", plural: "zums", color: "skin", stockGlobal: true },
  actions: {
    name: "action",
    plural: "actions",
    color: "skin",
    stockGlobal: true,
    parCycle: true,
  },
  enfants: {
    name: "enfant",
    plural: "enfants",
    color: "light-skin",
    stockGlobal: true,
    temporalite: 5,
    parCycle: true,
  },
  psik: { name: "psik", color: "purple" },
  joie: { name: "joie", color: "gold" },
  "waild-entretenu": { name: "waild entretenu", color: "light-green" },
  humus: { name: "humus", color: "brown", temporalite: 3, parCycle: true },
  branches: {
    name: "branche",
    plural: "branches",
    color: "light-brown",
    stockIndividuel: true,
  },
  miko: { name: "miko", color: "dark-purple" },
  "inerte-supervisé": {
    name: "inerte supervisé",
    color: "light-blue",
  },
  praim: {
    name: "praïm",
    color: "turquoize",
  },
  soleil: {
    name: "soleil",
    color: "gold",
  },
  pluie: {
    name: "pluie",
    color: "blue",
  },
  vent: {
    name: "vent",
    color: "light",
  },
  foto: {
    name: "foto",
    color: "light-gold",
  },
  shpak: {
    name: "shpak",
    color: "orange",
  },
  genes: {
    name: "gêne",
    plural: "gênes",
    color: "dark-turquoize",
  },
  "bourgeons-totipotents": {
    name: "bourgeon totipotent",
    plural: "bourgeons totipotents",
    color: "light-green",
    parCycle: true,
  },
  "protection-waild": {
    name: "protection waïld",
    color: "dark-green",
  },
  "protection-waild-min": {
    name: "protection waïld min",
    color: "dark-green",
  },
  "protection-waild-max": {
    name: "protection waïld max",
    color: "dark-green",
  },
  batiments: {
    name: "bâtiment",
    plural: "bâtiments",
    color: "light-blue",
  },
  plantes: {
    name: "plante",
    plural: "plantes",
    color: "light-green",
  },
  "etres-vivants": {
    name: "être vivant",
    plural: "êtres vivants",
    color: "light-skin",
  },
  "etres-vegetatifs": {
    name: "être végétatif",
    plural: "êtres végétatifs",
    color: "light-green",
  },
};
