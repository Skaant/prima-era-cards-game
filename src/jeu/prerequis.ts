import type { Carte } from "../cartes/_types/Carte";
import type { PrerequisCarte } from "../cartes/_types/PrerequisCarte";
import type { IdCartes } from "../cartes/paquets/IdCartes";
import type { IdRessource } from "../ressources/IdRessource";
import type { IdTribu } from "../tribus/IdTribu";
import { RESSOURCES } from "../data/ressources";
import type {
  GainOn,
  GainRessource,
  GainsCarteSansOn,
  GainTribu,
  SurAugmentation,
} from "../cartes/_types/GainsCarte";
import type { EffetOn, EtatJeu, Exemplaire, IdRessourceGlobale } from "./etat";
import { arrondir, estRessourceGlobale } from "./ressources";

type Cartes = Record<IdCartes, Carte>;

/**
 * Référence vers un gain conditionné par un `prerequis`/`parRessource` (dans `gains.ressources[]`
 * ou `gains.tribus[]`), ou vers un gain `on` (dans `gains.autres[]`, repéré par son index).
 */
export type RefGain = {
  idCarte: IdCartes;
  /** Exemplaire propriétaire du gain. */
  exemplaireId: string;
} & (
  | { gainType: "ressource" | "tribu"; gainIndex: number }
  | { gainType: "on"; autreIndex: number }
);

/** Listeners qui ne sont pas rattachés à un exemplaire précis (ressource globale ou tribu). */
export type TableListenersGlobaux = {
  ressources: Partial<Record<IdRessource, RefGain[]>>;
  tribus: Partial<Record<IdTribu, RefGain[]>>;
};

export function tableListenersVide(): TableListenersGlobaux {
  return { ressources: {}, tribus: {} };
}

function idGain(ref: RefGain): string {
  const index = ref.gainType === "on" ? ref.autreIndex : ref.gainIndex;
  return `${ref.exemplaireId}#${ref.gainType}#${index}`;
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

/**
 * Vérifie le `prerequis` d'une carte pour savoir si elle peut être jouée depuis la main : seules les
 * ressources globales et les tribus comptent, la carte n'ayant pas encore d'exemplaire sur le terrain.
 */
export function prerequisCarteSatisfait(etat: EtatJeu, prerequis: PrerequisCarte | undefined): boolean {
  if (!prerequis) return true;
  for (const [id, cond] of Object.entries(prerequis.ressources ?? {})) {
    if (!estRessourceGlobale(id as IdRessource)) continue;
    if (!seuilSatisfait(cond, etat.ressources[id as IdRessourceGlobale].stock)) return false;
  }
  for (const [id, min] of Object.entries(prerequis.tribus ?? {})) {
    const stock = etat.affinitesTribus[id as IdTribu]?.stock ?? 0;
    if (stock < (min as number)) return false;
  }
  return true;
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
  const enregistrer = (ref: RefGain, id: IdRessource) => {
    if (RESSOURCES[id].stockIndividuel) {
      exemplaire.listeners ??= {};
      (exemplaire.listeners[id] ??= []).push(ref);
    } else {
      (etat.listeners.ressources[id] ??= []).push(ref);
    }
  };

  const groupes: ["ressource" | "tribu", NonNullable<Carte["gains"]>["ressources" | "tribus"]][] = [
    ["ressource", carte.gains?.ressources],
    ["tribu", carte.gains?.tribus],
  ];
  for (const [gainType, gains] of groupes) {
    (gains ?? []).forEach((gain, gainIndex) => {
      const ref: RefGain = { idCarte, exemplaireId: exemplaire.id, gainType, gainIndex };
      // Un gain `parCycle` proportionnel (`parRessource`) suit le stock de la ressource ciblée.
      if (gain.parRessource && gain.parCycle) enregistrer(ref, gain.parRessource.id);
      if (!gain.prerequis) return;
      for (const id of Object.keys(gain.prerequis.ressources ?? {}) as IdRessource[]) {
        enregistrer(ref, id);
      }
      for (const id of Object.keys(gain.prerequis.tribus ?? {}) as IdTribu[]) {
        (etat.listeners.tribus[id] ??= []).push(ref);
      }
    });
  }

  // Un gain `on` (dans `gains.autres`) n'écoute que la ressource qui le déclenche ; les éventuels
  // `prerequis` de son `gain` sont évalués au moment du déclenchement, pas par ces listeners.
  (carte.gains?.autres ?? []).forEach((autre, autreIndex) => {
    if (typeof autre === "string" || autre.type !== "on") return;
    enregistrer({ idCarte, exemplaireId: exemplaire.id, gainType: "on", autreIndex }, autre.id);
  });
}

function gainVise(ref: Extract<RefGain, { gainType: "on" }>, cartes: Cartes): GainOn | undefined;
function gainVise(
  ref: Extract<RefGain, { gainType: "ressource" | "tribu" }>,
  cartes: Cartes,
): GainRessource | GainTribu | undefined;
function gainVise(ref: RefGain, cartes: Cartes): GainRessource | GainTribu | GainOn | undefined {
  const carte = cartes[ref.idCarte];
  if (ref.gainType === "on") {
    const autre = carte.gains?.autres?.[ref.autreIndex];
    return autre && typeof autre !== "string" && autre.type === "on" ? autre : undefined;
  }
  return ref.gainType === "ressource"
    ? carte.gains?.ressources?.[ref.gainIndex]
    : carte.gains?.tribus?.[ref.gainIndex];
}

/** Ajoute `montant` (signé) à la contribution d'un gain. Cible toujours une ressource globale ou une tribu. */
function appliquerToggle(
  etat: EtatJeu,
  ref: RefGain,
  gain: { id: IdRessource | IdTribu; parCycle?: true },
  montant: number,
  cartes: Cartes,
): void {  if (ref.gainType === "ressource") {
    const idRessource = gain.id as IdRessource;
    if (!estRessourceGlobale(idRessource)) return;
    if (gain.parCycle) {
      // Ne touche jamais `ressources[id].parCycle` directement : ce champ est entièrement
      // recalculé par `recalculerProduction`, qui additionne cette contribution conditionnelle
      // à la production de base plutôt que de l'écraser (voir `etat.ts`).
      etat.parCycleConditionnel[idRessource] = arrondir(
        (etat.parCycleConditionnel[idRessource] ?? 0) + montant,
      );
    } else {
      const cible = etat.ressources[idRessource];
      cible.stock = arrondir(Math.min(Math.max(cible.stock + montant, 0), cible.stockMax));
    }
  } else {
    const idTribu = gain.id as IdTribu;
    const cible = (etat.affinitesTribus[idTribu] ??= { stock: 0, parCycle: 0, stockMax: Infinity });
    if (gain.parCycle) cible.parCycle = arrondir(cible.parCycle + montant);
    else cible.stock = arrondir(Math.min(Math.max(cible.stock + montant, 0), cible.stockMax));
    notifierTribu(etat, idTribu, cartes);
  }
}

/** Contribution `parCycle` courante d'un gain proportionnel (`parRessource`) : nulle si son prérequis échoue. */
function contributionProportionnelle(
  etat: EtatJeu,
  gain: { value: number; prerequis?: PrerequisCarte; parRessource: NonNullable<SurAugmentation["fois"]>["parRessource"] },
  exemplaire: Exemplaire,
): number {
  const par = gain.parRessource;
  if (!par) return 0;
  if (gain.prerequis && !prerequisSatisfait(etat, gain.prerequis, exemplaire)) return 0;
  const facteur = Math.floor(valeurRessource(etat, par.id, exemplaire) / (par.value ?? 1));
  return arrondir(facteur * gain.value);
}

/**
 * Réévalue chaque `RefGain` : bascule (active/désactive) la contribution d'un gain à `prerequis` si son
 * résultat a changé, et réajuste celle d'un gain `parCycle` proportionnel (`parRessource`) à la valeur
 * courante de la ressource ciblée.
 */
function reevaluerEtToggler(etat: EtatJeu, refs: RefGain[], cartes: Cartes): void {
  for (const ref of refs) {
    if (ref.gainType === "on") continue;
    const gain = gainVise(ref, cartes);
    if (!gain) continue;
    const exemplaire = trouverExemplaireParId(etat, ref.exemplaireId);
    if (!exemplaire) continue;
    const cle = idGain(ref);
    if (gain.parRessource && gain.parCycle) {
      const cible = contributionProportionnelle(etat, { ...gain, parRessource: gain.parRessource }, exemplaire);
      const delta = arrondir(cible - (etat.contributionsParRessource[cle] ?? 0));
      if (delta === 0) continue;
      etat.contributionsParRessource[cle] = cible;
      appliquerToggle(etat, ref, gain, delta, cartes);
      continue;
    }
    if (!gain.prerequis) continue;
    const actif = prerequisSatisfait(etat, gain.prerequis, exemplaire);
    if ((etat.prerequisActifs[cle] ?? false) === actif) continue;
    etat.prerequisActifs[cle] = actif;
    appliquerToggle(etat, ref, gain, actif ? gain.value : -gain.value, cartes);
  }
}

/** Évalue une première fois les gains conditionnels / proportionnels d'un exemplaire qui vient d'être posé. */
export function evaluerGainsExemplaire(etat: EtatJeu, exemplaire: Exemplaire, idCarte: IdCartes, cartes: Cartes): void {
  const carte = cartes[idCarte];
  const refs: RefGain[] = [];
  (carte.gains?.ressources ?? []).forEach((_, gainIndex) =>
    refs.push({ idCarte, exemplaireId: exemplaire.id, gainType: "ressource", gainIndex }),
  );
  (carte.gains?.tribus ?? []).forEach((_, gainIndex) =>
    refs.push({ idCarte, exemplaireId: exemplaire.id, gainType: "tribu", gainIndex }),
  );
  reevaluerEtToggler(etat, refs, cartes);
}

/** À appeler après toute mutation de `etat.affinitesTribus[idTribu]` : réévalue les gains qui en dépendent. */
export function notifierTribu(etat: EtatJeu, idTribu: IdTribu, cartes: Cartes): void {
  reevaluerEtToggler(etat, etat.listeners.tribus[idTribu] ?? [], cartes);
}

/**
 * Gains `on` déjà joués dans la chaîne en cours (un gain qui en déclenche un autre, etc.) : un
 * effet ne peut pas se re-déclencher dans la même chaîne, ce qui la rend non récursive. Vidé
 * quand la chaîne se termine (`profondeurOn` revient à 0).
 */
const effetsJouesDansChaine = new Set<string>();
let profondeurOn = 0;

const EFFET_ON_INITIAL: EffetOn = { compteur: 0, fois: 0 };

/** Clé de `etat.effetsOn` du gain `on` d'index `autreIndex` (dans `gains.autres`) de l'exemplaire `exemplaireId`. */
export function cleEffetOn(exemplaireId: string, autreIndex: number): string {
  return `${exemplaireId}#on#${autreIndex}`;
}

/** Un effet `on` est actif sauf s'il a été désactivé par le joueur (`activable`). */
export function effetOnActif(etat: EtatJeu, exemplaireId: string, autreIndex: number): boolean {
  return !etat.effetsOn[cleEffetOn(exemplaireId, autreIndex)]?.desactive;
}

/** Nombre de déclenchements permis par cycle (`Infinity` sans limite `fois`). */
function limiteFois(
  etat: EtatJeu,
  fois: NonNullable<SurAugmentation["fois"]>,
  exemplaire: Exemplaire,
): number {
  const par = fois.parRessource;
  if (!par) return fois.value;
  const facteur = Math.floor(valeurRessource(etat, par.id, exemplaire) / (par.value ?? 1));
  return fois.value * facteur;
}

/**
 * Applique `n` fois chaque gain de `gain` (ressources, tribus, `autres` de type `"or"`) : stock
 * global ou max, branches de l'exemplaire, ou affinité de tribu. Un gain portant son propre
 * `prerequis` n'est appliqué que s'il est satisfait (indépendamment des autres gains de `gain`,
 * et du comptage commun du déclenchement `on`). Un gain `autres` de type `"or"` applique sa
 * première ressource (pas de choix persistant pour un gain déclenché par `on`).
 */
function appliquerGainsSurAugmentation(
  etat: EtatJeu,
  gain: GainsCarteSansOn,
  exemplaire: Exemplaire,
  n: number,
  cartes: Cartes,
): void {
  for (const g of gain.tribus ?? []) {
    if (g.prerequis && !prerequisSatisfait(etat, g.prerequis, exemplaire)) continue;
    const cible = (etat.affinitesTribus[g.id] ??= { stock: 0, parCycle: 0, stockMax: Infinity });
    cible.stock = arrondir(Math.min(Math.max(cible.stock + n * g.value, 0), cible.stockMax));
    notifierTribu(etat, g.id, cartes);
  }
  for (const g of gain.ressources ?? []) {
    if (g.prerequis && !prerequisSatisfait(etat, g.prerequis, exemplaire)) continue;
    if (g.stock) {
      if (estRessourceGlobale(g.id)) etat.ressources[g.id].stockMax += n * g.value;
      else if (g.id === "branches") exemplaire.branchesMax += n * g.value;
      continue;
    }
    if (estRessourceGlobale(g.id)) ajusterRessourceGlobale(etat, g.id, n * g.value, cartes);
    else if (g.id === "branches") ajusterValeurExemplaire(etat, exemplaire, "branches", n * g.value, cartes);
  }
  for (const autre of gain.autres ?? []) {
    if (typeof autre === "string" || autre.type !== "or") continue;
    const ressource = autre.resources[0];
    if (!ressource) continue;
    if (estRessourceGlobale(ressource.id)) {
      ajusterRessourceGlobale(etat, ressource.id, n * ressource.value, cartes);
    } else if (ressource.id === "branches") {
      ajusterValeurExemplaire(etat, exemplaire, "branches", n * ressource.value, cartes);
    }
  }
}

/**
 * Déclenche les gains `on` de `refs` écoutant `idRessource`, dont la ressource vient d'augmenter de
 * `delta` (> 0) : compteur de l'exemplaire, limite `fois` du cycle et activation sont pris en
 * compte. Les ressources gagnées au-delà de la limite `fois` sont perdues pour le compteur.
 * Un effet déjà atteint dans la chaîne en cours (joué ou non) n'est pas revu (ni compté).
 */
function declencherSurAugmentation(
  etat: EtatJeu,
  refs: RefGain[],
  idRessource: IdRessource,
  delta: number,
  cartes: Cartes,
): void {
  if (delta <= 0) return;
  profondeurOn++;
  try {
    // Copie : la cascade peut enregistrer d'autres listeners pendant l'itération.
    for (const ref of [...refs]) {
      if (ref.gainType !== "on") continue;
      const gain = gainVise(ref, cartes);
      if (!gain || gain.id !== idRessource) continue;
      const exemplaire = trouverExemplaireParId(etat, ref.exemplaireId);
      if (!exemplaire) continue;
      const cle = idGain(ref);
      if (effetsJouesDansChaine.has(cle)) continue;
      // Inscrit dès que l'effet est atteint, qu'il soit ensuite joué ou non (désactivé, valeur non
      // atteinte, limite `fois`) : il ne sera pas revu dans cette chaîne.
      effetsJouesDansChaine.add(cle);
      const effet = etat.effetsOn[cle] ?? EFFET_ON_INITIAL;
      if (effet.desactive) continue;

      const valeurOn = gain.value ?? 1;
      const total = arrondir(effet.compteur + delta);
      const atteints = Math.floor(total / valeurOn + 1e-9);
      const limite = gain.fois ? limiteFois(etat, gain.fois, exemplaire) : Infinity;
      const n = Math.min(atteints, Math.max(0, limite - effet.fois));
      etat.effetsOn[cle] = {
        ...effet,
        compteur: arrondir(total - atteints * valeurOn),
        fois: effet.fois + n,
      };
      if (n > 0) appliquerGainsSurAugmentation(etat, gain.gain, exemplaire, n, cartes);
    }
  } finally {
    if (--profondeurOn === 0) effetsJouesDansChaine.clear();
  }
}

/** À appeler quand le stock d'une ressource globale a augmenté de `delta` : déclenche les gains `on`. */
export function notifierAugmentation(
  etat: EtatJeu,
  idRessource: IdRessource,
  delta: number,
  cartes: Cartes,
): void {
  declencherSurAugmentation(etat, etat.listeners.ressources[idRessource] ?? [], idRessource, delta, cartes);
}

/**
 * Active ou désactive l'effet `on` `activable` d'index `autreIndex` (dans `gains.autres`) des
 * exemplaires `exemplaireIndices` de la carte `idCarte`. Sans effet si le gain n'est pas `activable`.
 */
export function definirEffetOnActif(
  etat: EtatJeu,
  idCarte: IdCartes,
  exemplaireIndices: number[],
  autreIndex: number,
  actif: boolean,
  cartes: Cartes,
): EtatJeu {
  const carte = cartes[idCarte];
  const autre = carte?.gains?.autres?.[autreIndex];
  const gain = autre && typeof autre !== "string" && autre.type === "on" ? autre : undefined;
  if (!gain?.activable) return etat;
  const exemplaires = etat.terrain.find((c) => c.id === idCarte)?.exemplaires ?? [];
  const effetsOn = { ...etat.effetsOn };
  for (const i of exemplaireIndices) {
    const exemplaire = exemplaires[i];
    if (!exemplaire) continue;
    const cle = cleEffetOn(exemplaire.id, autreIndex);
    const effet = effetsOn[cle] ?? EFFET_ON_INITIAL;
    effetsOn[cle] = { ...effet, desactive: actif ? undefined : true };
  }
  return { ...etat, effetsOn };
}

/** Modifie le stock d'une ressource globale puis réévalue les gains qui en dépendent. */
export function ajusterRessourceGlobale(
  etat: EtatJeu,
  idRessource: Extract<IdRessource, keyof EtatJeu["ressources"]>,
  delta: number,
  cartes: Cartes,
): void {
  const cible = etat.ressources[idRessource];
  const avant = cible.stock;
  cible.stock = arrondir(Math.min(Math.max(cible.stock + delta, 0), cible.stockMax));
  reevaluerEtToggler(etat, etat.listeners.ressources[idRessource] ?? [], cartes);
  notifierAugmentation(etat, idRessource, arrondir(cible.stock - avant), cartes);
}

/** Modifie une valeur individuelle de l'exemplaire (aujourd'hui `branches`) puis réévalue ses listeners. */
export function ajusterValeurExemplaire(
  etat: EtatJeu,
  exemplaire: Exemplaire,
  idRessource: IdRessource,
  delta: number,
  cartes: Cartes,
): void {
  let augmentation = 0;
  if (idRessource === "branches") {
    const avant = exemplaire.branches;
    exemplaire.branches = Math.min(Math.max(exemplaire.branches + delta, 0), exemplaire.branchesMax);
    augmentation = exemplaire.branches - avant;
  }
  const refs = exemplaire.listeners?.[idRessource] ?? [];
  reevaluerEtToggler(etat, refs, cartes);
  declencherSurAugmentation(etat, refs, idRessource, augmentation, cartes);
}
