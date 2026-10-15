import type { Carte } from "../cartes/_types/Carte";
import type { IdCartes } from "../cartes/paquets/IdCartes";
import { TAILLE_MAIN, type EtatJeu } from "./etat";
import { piocherAvecRecyclage } from "./piocher";
import { recalculerProduction } from "./production";
import { arrondir, RESSOURCES_GLOBALES } from "./ressources";

/** Phase de pioche : remplit la main jusqu'à `TAILLE_MAIN` cartes (avec recyclage de la défausse). */
export function phasePioche(etat: EtatJeu): EtatJeu {
  return {
    ...etat,
    ...piocherAvecRecyclage(
      etat.pioche,
      etat.defausse,
      etat.main,
      TAILLE_MAIN - etat.main.length,
    ),
  };
}

/**
 * Phase de production : chaque exemplaire à stock de branches gagne une branche, l'énergie est
 * réinitialisée, puis chaque ressource ajoute sa production par cycle (dans la limite du stock max).
 */
export function phaseProduction(etat: EtatJeu, cartes: Record<IdCartes, Carte>): EtatJeu {
  const terrain = etat.terrain.map((c) => ({
    ...c,
    exemplaires: c.exemplaires.map((e) =>
      e.branchesMax > 0 ? { ...e, branches: Math.min(e.branches + 1, e.branchesMax) } : e,
    ),
  }));
  const base = recalculerProduction({ ...etat, terrain }, cartes);
  const ressources = Object.fromEntries(
    RESSOURCES_GLOBALES.map((id) => {
      const r = base.ressources[id];
      const stock = id === "energie" ? 0 : r.stock;
      return [id, { ...r, stock: arrondir(Math.min(stock + r.parCycle, r.stockMax)) }];
    }),
  ) as EtatJeu["ressources"];
  return { ...base, ressources };
}

/** Termine le cycle en cours (production) puis en démarre un nouveau (pioche). */
export function nouveauCycle(etat: EtatJeu, cartes: Record<IdCartes, Carte>): EtatJeu {
  const produit = phaseProduction(etat, cartes);
  return recalculerProduction(phasePioche({ ...produit, cycle: etat.cycle + 1 }), cartes);
}
