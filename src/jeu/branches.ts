import type { Carte } from "../cartes/_types/Carte";
import type { IdCartes } from "../cartes/paquets/IdCartes";
import type { EtatJeu } from "./etat";
import { copierEtat } from "./copier";
import { ajusterValeurExemplaire } from "./prerequis";
import { recalculerProduction } from "./production";

type Cartes = Record<IdCartes, Carte>;

/** Un exemplaire peut recevoir une branche s'il a un stock de branches qui n'est pas plein. */
export function peutRecevoirBranche(e: { branches: number; branchesMax: number }): boolean {
  return e.branchesMax > 0 && e.branches < e.branchesMax;
}

/** Nombre de branches que les exemplaires du Terrain peuvent encore recevoir en tout. */
export function placesDeBranches(etat: EtatJeu): number {
  return etat.terrain.reduce(
    (total, { exemplaires }) =>
      total + exemplaires.reduce((t, e) => t + (peutRecevoirBranche(e) ? e.branchesMax - e.branches : 0), 0),
    0,
  );
}

/**
 * Exemplaires pouvant recevoir une branche, regroupés par carte, avec leur index réel dans la
 * carte du Terrain. Vide s'il n'y a aucune branche en attente.
 */
export function exemplairesABrancher(etat: EtatJeu): { id: IdCartes; indices: number[] }[] {
  if (etat.branchesEnAttente <= 0) return [];
  return etat.terrain
    .map(({ id, exemplaires }) => ({
      id,
      indices: exemplaires.flatMap((e, i) => (peutRecevoirBranche(e) ? [i] : [])),
    }))
    .filter(({ indices }) => indices.length > 0);
}

/**
 * Pose une branche en attente sur l'exemplaire `exemplaireIndex` de la carte `idCarte`.
 * Sans effet s'il n'y a pas de branche en attente ou si l'exemplaire ne peut pas la recevoir.
 */
export function brancher(
  etat: EtatJeu,
  idCarte: IdCartes,
  exemplaireIndex: number,
  cartes: Cartes,
): EtatJeu {
  if (etat.branchesEnAttente <= 0) return etat;
  const cible = etat.terrain.find((c) => c.id === idCarte)?.exemplaires[exemplaireIndex];
  if (!cible || !peutRecevoirBranche(cible)) return etat;

  const suivant = copierEtat(etat);
  suivant.branchesEnAttente -= 1;
  const exemplaire = suivant.terrain.find((c) => c.id === idCarte)!.exemplaires[exemplaireIndex];
  ajusterValeurExemplaire(suivant, exemplaire, "branches", 1, cartes);
  return recalculerProduction(suivant, cartes);
}
