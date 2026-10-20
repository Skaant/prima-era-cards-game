import type { Carte } from "../cartes/_types/Carte";
import type { PrerequisCarte } from "../cartes/_types/PrerequisCarte";
import type { IdCartes } from "../cartes/paquets/IdCartes";
import type { IdRessource } from "../ressources/IdRessource";
import type { IdTribu } from "../tribus/IdTribu";
import { RESSOURCES } from "../data/ressources";
import type { EtatJeu, Exemplaire } from "./etat";
import { arrondir, estRessourceGlobale } from "./ressources";

type Cartes = Record<IdCartes, Carte>;

/** Référence vers un gain (de ressource ou de tribu) conditionné par un `prerequis`. */
export type RefGain = {
  idCarte: IdCartes;
  /** Exemplaire propriétaire du gain. */
  exemplaireId: string;
  gainType: "ressource" | "tribu";
  /** Index dans `gains.ressources[]` ou `gains.tribus[]`. */
  gainIndex: number;
};

/** Listeners qui ne sont pas rattachés à un exemplaire précis (ressource globale ou tribu). */
export type TableListenersGlobaux = {
  ressources: Partial<Record<IdRessource, RefGain[]>>;
  tribus: Partial<Record<IdTribu, RefGain[]>>;
};

export function tableListenersVide(): TableListenersGlobaux {
  return { ressources: {}, tribus: {} };
}

function idGain(ref: RefGain): string {
  return `${ref.exemplaireId}#${ref.gainType}#${ref.gainIndex}`;
}

function trouverExemplaireParId(
  etat: EtatJeu,
  exemplaireId: string,
): Exemplaire | undefined {
  for (const { exemplaires } of etat.terrain) {
    const trouve = exemplaires.find((e) => e.id === exemplaireId);
    if (trouve) return trouve;
  }
  return undefined;
}

function seuilSatisfait(
  cond: { eq?: number; min?: number; max?: number } | undefined,
  valeur: number,
): boolean {
  if (!cond) return true;
  if (cond.min !== undefined && valeur < cond.min) return false;
  if (cond.max !== undefined && valeur > cond.max) return false;
  if (cond.eq !== undefined && valeur !== cond.eq) return false;
  return true;
}

/** Valeur courante d'une ressource ciblée par un prérequis : individuelle (sur `exemplaire`) ou globale. */
function valeurRessource(
  etat: EtatJeu,
  idRessource: IdRessource,
  exemplaire: Exemplaire,
): number {
  if (RESSOURCES[idRessource].stockIndividuel) {
    return idRessource === "branches" ? exemplaire.branches : 0;
  }
  return estRessourceGlobale(idRessource) ? etat.ressources[idRessource].stock : 0;
}

/** Réévalue le `prerequis` complet d'un gain (toutes ses conditions), pas seulement celle qui a changé. */
function prerequisSatisfait(
  etat: EtatJeu,
  prerequis: PrerequisCarte,
  exemplaire: Exemplaire,
): boolean {
  for (const [id, cond] of Object.entries(prerequis.ressources ?? {})) {
    if (!seuilSatisfait(cond, valeurRessource(etat, id as IdRessource, exemplaire))) {
      return false;
    }
  }
  for (const [id, min] of Object.entries(prerequis.tribus ?? {})) {
    const stock = etat.affinitesTribus[id as IdTribu]?.stock ?? 0;
    if (stock < (min as number)) return false;
  }
  return true;
}

/**
 * Pour chaque entrée de `carte.gains.ressources`/`gains.tribus` portant un `prerequis`, enregistre
 * une `RefGain` sous chaque ressource/tribu référencée : sur `exemplaire.listeners` si la ressource
 * est individuelle (`branches`), sinon dans `etat.listeners` (ressource globale ou tribu). Mute
 * `etat.listeners` et `exemplaire` en place (appelé sur un état déjà copié).
 */
export function enregistrerListeners(
  etat: EtatJeu,
  idCarte: IdCartes,
  exemplaire: Exemplaire,
  carte: Carte,
): void {
  const groupes: ["ressource" | "tribu", NonNullable<Carte["gains"]>["ressources" | "tribus"]][] = [
    ["ressource", carte.gains?.ressources],
    ["tribu", carte.gains?.tribus],
  ];
  for (const [gainType, gains] of groupes) {
    (gains ?? []).forEach((gain, gainIndex) => {
      if (!gain.prerequis) return;
      const ref: RefGain = { idCarte, exemplaireId: exemplaire.id, gainType, gainIndex };
      for (const id of Object.keys(gain.prerequis.ressources ?? {}) as IdRessource[]) {
        if (RESSOURCES[id].stockIndividuel) {
          exemplaire.listeners ??= {};
          (exemplaire.listeners[id] ??= []).push(ref);
        } else {
          (etat.listeners.ressources[id] ??= []).push(ref);
        }
      }
      for (const id of Object.keys(gain.prerequis.tribus ?? {}) as IdTribu[]) {
        (etat.listeners.tribus[id] ??= []).push(ref);
      }
    });
  }
}

function gainVise(ref: RefGain, cartes: Cartes) {
  const carte = cartes[ref.idCarte];
  return ref.gainType === "ressource"
    ? carte.gains?.ressources?.[ref.gainIndex]
    : carte.gains?.tribus?.[ref.gainIndex];
}

/** Applique ou retire la contribution d'un gain déjà basculé. Cible toujours une ressource globale ou une tribu. */
function appliquerToggle(
  etat: EtatJeu,
  ref: RefGain,
  gain: { id: IdRessource | IdTribu; value: number; parCycle?: true },
  actif: boolean,
  cartes: Cartes,
): void {
  const signe = actif ? 1 : -1;
  if (ref.gainType === "ressource") {
    const idRessource = gain.id as IdRessource;
    if (!estRessourceGlobale(idRessource)) return;
    if (gain.parCycle) {
      // Ne touche jamais `ressources[id].parCycle` directement : ce champ est entièrement
      // recalculé par `recalculerProduction`, qui additionne cette contribution conditionnelle
      // à la production de base plutôt que de l'écraser (voir `etat.ts`).
      etat.parCycleConditionnel[idRessource] = arrondir(
        (etat.parCycleConditionnel[idRessource] ?? 0) + signe * gain.value,
      );
    } else {
      const cible = etat.ressources[idRessource];
      cible.stock = arrondir(Math.min(Math.max(cible.stock + signe * gain.value, 0), cible.stockMax));
    }
  } else {
    const idTribu = gain.id as IdTribu;
    const cible = (etat.affinitesTribus[idTribu] ??= { stock: 0, parCycle: 0, stockMax: Infinity });
    if (gain.parCycle) cible.parCycle = arrondir(cible.parCycle + signe * gain.value);
    else cible.stock = arrondir(Math.min(Math.max(cible.stock + signe * gain.value, 0), cible.stockMax));
    notifierTribu(etat, idTribu, cartes);
  }
}

/** Réévalue chaque `RefGain` et bascule (active/désactive) sa contribution si son prérequis a changé de résultat. */
function reevaluerEtToggler(etat: EtatJeu, refs: RefGain[], cartes: Cartes): void {
  for (const ref of refs) {
    const gain = gainVise(ref, cartes);
    if (!gain?.prerequis) continue;
    const exemplaire = trouverExemplaireParId(etat, ref.exemplaireId);
    if (!exemplaire) continue;
    const actif = prerequisSatisfait(etat, gain.prerequis, exemplaire);
    const cle = idGain(ref);
    if ((etat.prerequisActifs[cle] ?? false) === actif) continue;
    etat.prerequisActifs[cle] = actif;
    appliquerToggle(etat, ref, gain, actif, cartes);
  }
}

/** À appeler après toute mutation de `etat.affinitesTribus[idTribu]` : réévalue les gains qui en dépendent. */
export function notifierTribu(etat: EtatJeu, idTribu: IdTribu, cartes: Cartes): void {
  reevaluerEtToggler(etat, etat.listeners.tribus[idTribu] ?? [], cartes);
}

/** Modifie le stock d'une ressource globale puis réévalue les gains qui en dépendent. */
export function ajusterRessourceGlobale(
  etat: EtatJeu,
  idRessource: Extract<IdRessource, keyof EtatJeu["ressources"]>,
  delta: number,
  cartes: Cartes,
): void {
  const cible = etat.ressources[idRessource];
  cible.stock = arrondir(Math.min(Math.max(cible.stock + delta, 0), cible.stockMax));
  reevaluerEtToggler(etat, etat.listeners.ressources[idRessource] ?? [], cartes);
}

/** Modifie une valeur individuelle de l'exemplaire (aujourd'hui `branches`) puis réévalue ses listeners. */
export function ajusterValeurExemplaire(
  etat: EtatJeu,
  exemplaire: Exemplaire,
  idRessource: IdRessource,
  delta: number,
  cartes: Cartes,
): void {
  if (idRessource === "branches") {
    exemplaire.branches = Math.min(Math.max(exemplaire.branches + delta, 0), exemplaire.branchesMax);
  }
  reevaluerEtToggler(etat, exemplaire.listeners?.[idRessource] ?? [], cartes);
}
