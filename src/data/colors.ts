import type { Color } from "../types/Color";
export type { Color };

type ColorData = {
  hexa: string;
  textWhite?: boolean;
};

export const COLORS: { [color in Color]: ColorData } = {
  light: { hexa: "#eee" },
  muted: { hexa: "#6c757d", textWhite: true },
  dark: { hexa: "#111", textWhite: true },
  gold: { hexa: "#ffcd5c" },
  "light-gold": { hexa: "#ffde95" },
  blue: { hexa: "#5d89ff", textWhite: true },
  "light-blue": { hexa: "#bfd8ff" },
  deep: { hexa: "#433869", textWhite: true },
  "light-deep": { hexa: "#b6b1c5" },
  jewel: { hexa: "#ffdcb0" },
  skin: { hexa: "#ff6e38" },
  "dark-skin": { hexa: "#a7654d", textWhite: true },
  "light-skin": { hexa: "#FFAF92" },
  green: { hexa: "#46af49", textWhite: true },
  "light-green": { hexa: "#95df3a" },
  "dark-green": { hexa: "#209100", textWhite: true },
  purple: { hexa: "#a735ff", textWhite: true },
  "light-purple": { hexa: "#c579ff" },
  "dark-purple": { hexa: "#6a0dad", textWhite: true },
  brown: { hexa: "#7B4A2D", textWhite: true },
  "light-brown": { hexa: "#B47C5B" },
  turquoize: { hexa: "#00ffab" },
  "dark-turquoize": { hexa: "#44b596", textWhite: true },
  orange: { hexa: "#ff9900" },
};
