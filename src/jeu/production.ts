import type { Carte } from "../cartes/_types/Carte";
import type { IdCartes } from "../cartes/paquets/IdCartes";
import type { IdRessource } from "../ressources/IdRessource";
import type { EtatJeu, IdRessourceGlobale } from "./etat";
import { arrondir, estRessourceGlobale, RESSOURCES_GLOBALES } from "./ressources";

type Cartes = Record<IdCartes, Carte>;

/** Production par cycle : gains `parCycle` des cartes du terrain (× exemplaires) + effet des zums. */
export function recalculerProduction(etat: EtatJeu, cartes: Cartes): EtatJeu {
  const production = Object.fromEntries(
    RESSOURCES_GLOBALES.map((id) => [id, 0]),
  ) as Record<IdRessourceGlobale, number>;
  let cartesParTour = 0;

  for (const { id, exemplaires } of etat.terrain) {
    for (const exemplaire of exemplaires) {
      for (const gain of cartes[id].gains?.ressources ?? []) {
        // Les gains portant un `prerequis` sont exclusivement pilotés par les listeners de
        // `prerequis.ts` (voir `parCycleConditionnel`, additionné plus bas) : jamais recalculés ici.
        if (!gain.parCycle || gain.parRessource || gain.prerequis) continue;
        if (gain.id === "cartes-par-tour") cartesParTour += gain.value;
        else if (estRessourceGlobale(gain.id)) production[gain.id] += gain.value;
      }
      (cartes[id].gains?.autres ?? []).forEach((autre, autreIndex) => {
        if (typeof autre === "string" || autre.type !== "or" || !autre.parCycle) return;
        const choisie = exemplaire.choixOr?.[autreIndex] ?? autre.resources[0]?.id;
        const ressource = autre.resources.find((r) => r.id === choisie);
        if (ressource && estRessourceGlobale(ressource.id)) {
          production[ressource.id] += ressource.value;
        }
      });
    }
  }
  // Chaque zum (entier) produit en plus 1 data et 1 action, qu'il soit libre ou associé à une carte
  // (le stock global de zums les compte tous : voir `zum.md`).
  const zums = Math.floor(etat.ressources.zums.stock);
  production.data += zums;
  production.energie += zums;

  return {
    ...etat,
    cartesParTour: arrondir(cartesParTour),
    ressources: Object.fromEntries(
      RESSOURCES_GLOBALES.map((id) => [
        id,
        {
          ...etat.ressources[id],
          parCycle: arrondir(production[id] + (etat.parCycleConditionnel[id] ?? 0)),
        },
      ]),
    ) as EtatJeu["ressources"],
  };
}

/**
 * Change la ressource choisie pour le gain `autres` de type `"or"` (index `autreIndex`) de
 * l'exemplaire `exemplaireIndex` de la carte `idCarte`, pour les prochains cycles.
 * Sans effet si la carte, l'exemplaire, le gain ou la ressource n'existent pas.
 */
export function choisirRessourceOr(
  etat: EtatJeu,
  idCarte: IdCartes,
  exemplaireIndex: number,
  autreIndex: number,
  ressourceId: IdRessource,
  cartes: Cartes,
): EtatJeu {
  const autre = cartes[idCarte]?.gains?.autres?.[autreIndex];
  if (!autre || typeof autre === "string" || autre.type !== "or") return etat;
  if (!autre.resources.some((r) => r.id === ressourceId)) return etat;

  const terrain = etat.terrain.map((entree) => {
    if (entree.id !== idCarte) return entree;
    return {
      ...entree,
      exemplaires: entree.exemplaires.map((exemplaire, i) =>
        i !== exemplaireIndex
          ? exemplaire
          : {
              ...exemplaire,
              choixOr: { ...exemplaire.choixOr, [autreIndex]: ressourceId },
            },
      ),
    };
  });

  return recalculerProduction({ ...etat, terrain }, cartes);
}

/**
 * Change la ressource choisie pour le gain `autres` de type `"or"` (index `autreIndex`) de la
 * carte `idCarte`, pour tous ses exemplaires à la fois, pour les prochains cycles.
 * Sans effet si la carte, le gain ou la ressource n'existent pas.
 */
export function choisirRessourceOrGroupe(
  etat: EtatJeu,
  idCarte: IdCartes,
  autreIndex: number,
  ressourceId: IdRessource,
  cartes: Cartes,
): EtatJeu {
  const autre = cartes[idCarte]?.gains?.autres?.[autreIndex];
  if (!autre || typeof autre === "string" || autre.type !== "or") return etat;
  if (!autre.resources.some((r) => r.id === ressourceId)) return etat;

  const terrain = etat.terrain.map((entree) => {
    if (entree.id !== idCarte) return entree;
    return {
      ...entree,
      exemplaires: entree.exemplaires.map((exemplaire) => ({
        ...exemplaire,
        choixOr: { ...exemplaire.choixOr, [autreIndex]: ressourceId },
      })),
    };
  });

  return recalculerProduction({ ...etat, terrain }, cartes);
}
