import type { Carte } from "../cartes/_types/Carte";
import type { IdCartes } from "../cartes/paquets/IdCartes";
import type { EtatJeu, IdRessourceGlobale } from "./etat";
import { arrondir, estRessourceGlobale, RESSOURCES_GLOBALES } from "./ressources";

type Cartes = Record<IdCartes, Carte>;

/** Production par cycle : gains `parCycle` des cartes du terrain (× exemplaires) + effet des zums. */
export function recalculerProduction(etat: EtatJeu, cartes: Cartes): EtatJeu {
  const production = Object.fromEntries(
    RESSOURCES_GLOBALES.map((id) => [id, 0]),
  ) as Record<IdRessourceGlobale, number>;

  for (const { id, exemplaires } of etat.terrain) {
    for (const { branches } of exemplaires) {
      for (const gain of cartes[id].gains?.ressources ?? []) {
        if (!gain.parCycle || gain.parRessource || !estRessourceGlobale(gain.id)) continue;
        // Seul le prérequis sur les branches de l'exemplaire est évalué.
        const { min, max, eq } = gain.prerequis?.ressources?.branches ?? {};
        if (
          (min !== undefined && branches < min) ||
          (max !== undefined && branches > max) ||
          (eq !== undefined && branches !== eq)
        ) {
          continue;
        }
        production[gain.id] += gain.value;
      }
    }
  }
  // Chaque zum (entier) produit en plus 1 data et 1 action.
  const zums = Math.floor(etat.ressources.zums.stock);
  production.data += zums;
  production.energie += zums;

  return {
    ...etat,
    ressources: Object.fromEntries(
      RESSOURCES_GLOBALES.map((id) => [
        id,
        { ...etat.ressources[id], parCycle: arrondir(production[id]) },
      ]),
    ) as EtatJeu["ressources"],
  };
}
