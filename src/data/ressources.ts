import type { IdRessource } from "../types/ressources/IdRessource";
import type { Color } from "../types/Color";

export type RessourceData = {
  name: string;
  plural?: string;
  color: Color;
};

export const RESSOURCES: {
  [key in IdRessource]: RessourceData;
} = {
  eau: { name: "eau", color: "blue" },
  jing: { name: "jing", color: "skin" },
  waild: { name: "waild", color: "dark-green" },
  data: { name: "data", color: "turquoize" },
  aibs: { name: "aïbs", color: "gold" },
  zums: { name: "zum", plural: "zums", color: "skin" },
  actions: { name: "action", plural: "actions", color: "skin" },
  enfants: { name: "enfant", plural: "enfants", color: "light-skin" },
  psik: { name: "psik", color: "purple" },
  joie: { name: "joie", color: "gold" },
  "waild-entretenu": { name: "waild entretenu", color: "light-green" },
  humus: { name: "humus", color: "brown" },
  branches: { name: "branche", plural: "branches", color: "light-brown" },
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
};
