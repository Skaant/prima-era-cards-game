import type { Carte } from "../cartes/_types/Carte";
import type { IdCartes } from "../cartes/paquets/IdCartes";
import type { EtatJeu } from "./etat";
import { piocherAvecRecyclage } from "./piocher";
import { recalculerProduction } from "./production";
import { arrondir, RESSOURCES_GLOBALES } from "./ressources";
import { copierEtat } from "./copier";
import { ajusterValeurExemplaire, notifierAugmentation } from "./prerequis";

/** Phase de pioche : pioche `cartesParTour` cartes (avec recyclage de la défausse). */
export function phasePioche(etat: EtatJeu): EtatJeu {
  return {
    ...etat,
    ...piocherAvecRecyclage(etat.pioche, etat.defausse, etat.main, etat.cartesParTour),
  };
}

/**
 * Phase de production : chaque exemplaire à stock de branches gagne une branche, l'énergie est
 * réinitialisée, puis chaque ressource ajoute sa production par cycle (dans la limite du stock max).
 */
export function phaseProduction(etat: EtatJeu, cartes: Record<IdCartes, Carte>): EtatJeu {
  const suivant = copierEtat(etat);
  for (const { exemplaires } of suivant.terrain) {
    for (const exemplaire of exemplaires) {
      if (exemplaire.branchesMax > 0 && exemplaire.branches < exemplaire.branchesMax) {
        ajusterValeurExemplaire(suivant, exemplaire, "branches", 1, cartes);
      }
    }
  }
  const base = recalculerProduction(suivant, cartes);
  const ressources = Object.fromEntries(
    RESSOURCES_GLOBALES.map((id) => {
      const r = base.ressources[id];
      const stock = id === "energie" ? 0 : r.stock;
      return [id, { ...r, stock: arrondir(Math.min(stock + r.parCycle, r.stockMax)) }];
    }),
  ) as EtatJeu["ressources"];
  const produit = { ...base, ressources };
  // La production fait augmenter les stocks : les gains `on` qui écoutent ces ressources se déclenchent.
  for (const id of RESSOURCES_GLOBALES) {
    const avant = id === "energie" ? 0 : base.ressources[id].stock;
    notifierAugmentation(produit, id, arrondir(produit.ressources[id].stock - avant), cartes);
  }
  return produit;
}

/** Remet à 0 le nombre de déclenchements du cycle (`on.fois`) de chaque gain `on`. */
function reinitialiserFoisOn(etat: EtatJeu): EtatJeu {
  return {
    ...etat,
    effetsOn: Object.fromEntries(
      Object.entries(etat.effetsOn).map(([cle, effet]) => [cle, { ...effet, fois: 0 }]),
    ),
  };
}

/** Termine le cycle en cours (production) puis en démarre un nouveau (pioche). */
export function nouveauCycle(etat: EtatJeu, cartes: Record<IdCartes, Carte>): EtatJeu {
  const produit = phaseProduction(etat, cartes);
  return recalculerProduction(
    phasePioche({ ...reinitialiserFoisOn(produit), cycle: etat.cycle + 1, actionsUtilisees: {}, piochesPayantes: 0 }),
    cartes,
  );
}
