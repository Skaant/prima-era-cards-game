import type { Carte } from "../cartes/_types/Carte";
import type { IdCartes } from "../cartes/paquets/IdCartes";
import { TOUS_PAQUETS } from "../cartes/paquets/tous.paquets";
import { EVOLUTIONS, type IdPaquetEvolution } from "../évolutions/évolutions.data";
import type { EtatJeu } from "./etat";
import { ajusterRessourceGlobale } from "./prerequis";
import { creerPioche, melanger } from "./piocher";
import { copierEtat } from "./copier";

type Cartes = Record<IdCartes, Carte>;

export type EtatEvolution = {
  /** Pile restante du paquet d'évolution, mélangée. */
  pioche: IdCartes[];
  /** Nombre de cartes effectivement ajoutées à la main du joueur depuis ce paquet. */
  achetees: number;
  /** Cartes révélées en attente de choix (1 ou 2), absent si aucune révélation en cours. */
  reveal?: IdCartes[];
};

export function creerEtatsEvolutions(): Record<IdPaquetEvolution, EtatEvolution> {
  return Object.fromEntries(
    (Object.keys(EVOLUTIONS) as IdPaquetEvolution[]).map((id) => [
      id,
      { pioche: creerPioche(TOUS_PAQUETS[id]), achetees: 0 },
    ]),
  ) as Record<IdPaquetEvolution, EtatEvolution>;
}

/** Évalue toutes les conditions de déblocage (combinées en ET) d'un paquet d'évolution. */
export function estDebloquee(etat: EtatJeu, id: IdPaquetEvolution): boolean {
  return EVOLUTIONS[id].conditions.every((condition) => {
    if (condition.type === "cartes-achetees") {
      return etat.evolutions[condition.paquet].achetees >= condition.min;
    }
    return (etat.affinitesTribus[condition.tribu]?.stock ?? 0) >= condition.min;
  });
}

export function peutRevelerEvolution(etat: EtatJeu, id: IdPaquetEvolution): boolean {
  const evolution = etat.evolutions[id];
  return (
    estDebloquee(etat, id) &&
    !evolution.reveal &&
    evolution.pioche.length > 0 &&
    etat.ressources.data.stock >= EVOLUTIONS[id].coutData
  );
}

/** Paie le coût du paquet et déplace jusqu'à 2 cartes du dessus de sa pile vers `reveal`. */
export function revelerEvolution(etat: EtatJeu, id: IdPaquetEvolution, cartes: Cartes): EtatJeu {
  if (!peutRevelerEvolution(etat, id)) return etat;
  const suivant = copierEtat(etat);
  suivant.evolutions = { ...etat.evolutions };
  ajusterRessourceGlobale(suivant, "data", -EVOLUTIONS[id].coutData, cartes);

  const evolution = etat.evolutions[id];
  const nombre = Math.min(2, evolution.pioche.length);
  suivant.evolutions[id] = {
    ...evolution,
    pioche: evolution.pioche.slice(0, evolution.pioche.length - nombre),
    reveal: evolution.pioche.slice(evolution.pioche.length - nombre),
  };
  return suivant;
}

/**
 * Choisit une des cartes révélées (`choix` = index dans `reveal`) ou aucune (`null`). La carte
 * choisie est ajoutée à la fin de la main du joueur (la pioche n'est pas touchée) et incrémente
 * `achetees`. Dans tous les cas,
 * les cartes non choisies retournent dans la pile du paquet, qui est entièrement remélangée.
 */
export function choisirCarteEvolution(
  etat: EtatJeu,
  id: IdPaquetEvolution,
  choix: number | null,
): EtatJeu {
  const evolution = etat.evolutions[id];
  const reveal = evolution.reveal;
  if (!reveal) return etat;

  const choisie = choix !== null ? reveal[choix] : undefined;
  const nonChoisies = reveal.filter((_, i) => i !== choix);

  return {
    ...etat,
    main: choisie !== undefined ? [...etat.main, choisie] : etat.main,
    evolutions: {
      ...etat.evolutions,
      [id]: {
        pioche: melanger([...evolution.pioche, ...nonChoisies]),
        achetees: evolution.achetees + (choisie !== undefined ? 1 : 0),
        reveal: undefined,
      },
    },
  };
}
