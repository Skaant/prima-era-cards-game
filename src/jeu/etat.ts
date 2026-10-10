import { BASE_PAQUET } from "../cartes/paquets/base/base.paquet";
import type { Paquet } from "../cartes/paquets/Paquet";
import type { IdCartes } from "../cartes/paquets/IdCartes";
import type { IdRessource } from "../ressources/IdRessource";
import { creerPioche, piocher } from "./piocher";

export const TAILLE_MAIN_INITIALE = 5;

export type IdRessourceGlobale = Extract<
  IdRessource,
  "eau" | "jing" | "data" | "zums" | "actions"
>;

export const RESSOURCES_GLOBALES: IdRessourceGlobale[] = [
  "eau",
  "jing",
  "data",
  "zums",
  "actions",
];

export type RessourceGlobale = { stock: number; parCycle: number };

export type EtatJeu = {
  pioche: IdCartes[];
  main: IdCartes[];
  ressources: Record<IdRessourceGlobale, RessourceGlobale>;
};

export type ActionJeu = { type: "piocher"; nombre: number };

export function etatInitial(paquet: Paquet<IdCartes> = BASE_PAQUET): EtatJeu {
  const { pioche, main } = piocher(creerPioche(paquet), [], TAILLE_MAIN_INITIALE);
  return {
    pioche,
    main,
    ressources: Object.fromEntries(
      RESSOURCES_GLOBALES.map((id) => [id, { stock: 0, parCycle: 0 }]),
    ) as EtatJeu["ressources"],
  };
}

export function reducteur(etat: EtatJeu, action: ActionJeu): EtatJeu {
  switch (action.type) {
    case "piocher":
      return { ...etat, ...piocher(etat.pioche, etat.main, action.nombre) };
  }
}
