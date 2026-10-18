import type { Carte } from "../cartes/_types/Carte";
import type { IdCartes } from "../cartes/paquets/IdCartes";
import type { EtatJeu } from "./etat";
import { recalculerProduction } from "./production";
import { estRessourceGlobale } from "./ressources";

type Cartes = Record<IdCartes, Carte>;
type ActionCarte = NonNullable<Carte["actions"]>[number];

/** Le nombre d'utilisations (`fois`) d'une action est compté par exemplaire, pas par carte. */
function cle(idCarte: IdCartes, exemplaireIndex: number, actionIndex: number) {
  return `${idCarte}:${exemplaireIndex}:${actionIndex}`;
}

/** Coûts de l'action payables avec les ressources globales (hors coûts par cycle ou proportionnels). */
function coutsSimples(action: ActionCarte) {
  return (action.couts.ressources ?? []).filter((c) => !c.parCycle && !c.parRessource);
}

/** Utilisations encore permises ce cycle pour cet exemplaire (`Infinity` si l'action n'a pas de limite `fois`). */
function utilisationsRestantes(
  etat: EtatJeu,
  action: ActionCarte,
  idCarte: IdCartes,
  exemplaireIndex: number,
  actionIndex: number,
) {
  if (!action.fois) return Infinity;
  return action.fois.value - (etat.actionsUtilisees[cle(idCarte, exemplaireIndex, actionIndex)] ?? 0);
}

export function peutUtiliserAction(
  etat: EtatJeu,
  carte: Carte,
  idCarte: IdCartes,
  exemplaireIndex: number,
  actionIndex: number,
): boolean {
  const action = carte.actions?.[actionIndex];
  if (!action) return false;
  if (utilisationsRestantes(etat, action, idCarte, exemplaireIndex, actionIndex) <= 0) return false;
  return coutsSimples(action).every(
    (c) => !estRessourceGlobale(c.id) || etat.ressources[c.id].stock >= c.value,
  );
}

/**
 * Applique les gains immédiats de l'action (mêmes règles que les gains de carte, voir `jouer.ts`).
 * Ignorés : gains par cycle, conditionnels, proportionnels, `stockIndividuel`. `etat` est modifié en place.
 */
function appliquerGains(etat: EtatJeu, action: ActionCarte) {
  const gains = (action.gains.ressources ?? []).filter(
    (g) => !g.parCycle && !g.prerequis && !g.parRessource && !g.stockIndividuel,
  );
  for (const gain of gains) {
    if (!estRessourceGlobale(gain.id)) continue;
    const r = etat.ressources[gain.id];
    r.stock = Math.min(r.stock + gain.value, r.stockMax);
  }
}

/**
 * Utilise l'action `actionIndex` de l'exemplaire `exemplaireIndex` de la carte `idCarte` du
 * Terrain : coûts payés, gains récoltés, utilisation comptée pour la limite `fois` du cycle en
 * cours (par exemplaire, voir `cle`).
 * Sans effet si l'action n'existe pas ou si `peutUtiliserAction` est faux (retourne alors `etat`
 * tel quel, ce qui permet à `utiliserActionGroupe` de détecter l'arrêt).
 */
export function utiliserAction(
  etat: EtatJeu,
  idCarte: IdCartes,
  exemplaireIndex: number,
  actionIndex: number,
  cartes: Cartes,
): EtatJeu {
  const carte = cartes[idCarte];
  const action = carte?.actions?.[actionIndex];
  if (!action || !peutUtiliserAction(etat, carte, idCarte, exemplaireIndex, actionIndex))
    return etat;

  const suivant: EtatJeu = {
    ...etat,
    ressources: Object.fromEntries(
      Object.entries(etat.ressources).map(([id, r]) => [id, { ...r }]),
    ) as EtatJeu["ressources"],
    actionsUtilisees: { ...etat.actionsUtilisees },
  };
  for (const cout of coutsSimples(action)) {
    if (estRessourceGlobale(cout.id)) suivant.ressources[cout.id].stock -= cout.value;
  }
  appliquerGains(suivant, action);
  const k = cle(idCarte, exemplaireIndex, actionIndex);
  suivant.actionsUtilisees[k] = (suivant.actionsUtilisees[k] ?? 0) + 1;

  return recalculerProduction(suivant, cartes);
}

/**
 * Utilise l'action `actionIndex` de la carte `idCarte` pour chacun de ses exemplaires, dans
 * l'ordre de la liste, en vérifiant à chaque exemplaire que son coût peut être payé avec les
 * ressources restantes. S'arrête au premier exemplaire pour lequel l'action n'est pas utilisable
 * (ressources insuffisantes ou limite `fois` atteinte), en conservant les utilisations déjà faites.
 */
export function utiliserActionGroupe(
  etat: EtatJeu,
  idCarte: IdCartes,
  actionIndex: number,
  cartes: Cartes,
): EtatJeu {
  const carteTerrain = etat.terrain.find((c) => c.id === idCarte);
  if (!carteTerrain) return etat;

  let suivant = etat;
  for (let exemplaireIndex = 0; exemplaireIndex < carteTerrain.exemplaires.length; exemplaireIndex++) {
    const avant = suivant;
    suivant = utiliserAction(suivant, idCarte, exemplaireIndex, actionIndex, cartes);
    if (suivant === avant) break;
  }
  return suivant;
}
