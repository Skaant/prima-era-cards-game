import type { Paquet } from "../cartes/paquets/Paquet";
import type { IdCartes } from "../cartes/paquets/IdCartes";

/** Mélange de Fisher-Yates, sans modifier le tableau d'origine. */
export function melanger<T>(elements: readonly T[]): T[] {
  const resultat = [...elements];
  for (let i = resultat.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [resultat[i], resultat[j]] = [resultat[j], resultat[i]];
  }
  return resultat;
}

/** Crée une pioche : les cartes du paquet (selon leur nombre) dans un ordre aléatoire. */
export function creerPioche(paquet: Paquet<IdCartes>): IdCartes[] {
  const cartes = (
    Object.entries(paquet.cartes) as [IdCartes, number][]
  ).flatMap(([id, nombre]) => Array<IdCartes>(nombre).fill(id));
  return melanger(cartes);
}

/**
 * Pioche X cartes : extrait les X dernières entrées de la pioche pour les ajouter à la main.
 * Si la pioche contient moins de X cartes, toutes les cartes restantes sont piochées.
 */
export function piocher(
  pioche: readonly IdCartes[],
  main: readonly IdCartes[],
  x: number,
): { pioche: IdCartes[]; main: IdCartes[] } {
  const nombre = Math.max(0, Math.min(x, pioche.length));
  const restant = pioche.length - nombre;
  return {
    pioche: pioche.slice(0, restant),
    main: [...main, ...pioche.slice(restant)],
  };
}
