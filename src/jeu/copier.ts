import type { EtatJeu } from "./etat";

/**
 * Copie superficielle contrôlée des parties de l'état modifiées par une action du moteur
 * (ressources, affinités de tribu, terrain/exemplaires avec leurs listeners, listeners globaux,
 * prérequis actifs), avant mutation en place par les wrappers de `prerequis.ts`.
 */
export function copierEtat(etat: EtatJeu): EtatJeu {
  return {
    ...etat,
    ressources: Object.fromEntries(
      Object.entries(etat.ressources).map(([id, r]) => [id, { ...r }]),
    ) as EtatJeu["ressources"],
    parCycleConditionnel: { ...etat.parCycleConditionnel },
    affinitesTribus: Object.fromEntries(
      Object.entries(etat.affinitesTribus).map(([id, r]) => [id, { ...r }]),
    ) as EtatJeu["affinitesTribus"],
    terrain: etat.terrain.map((c) => ({
      ...c,
      exemplaires: c.exemplaires.map((e) => ({
        ...e,
        listeners: e.listeners ? { ...e.listeners } : undefined,
      })),
    })),
    listeners: {
      ressources: { ...etat.listeners.ressources },
      tribus: { ...etat.listeners.tribus },
    },
    prerequisActifs: { ...etat.prerequisActifs },
    contributionsParRessource: { ...etat.contributionsParRessource },
    effetsOn: { ...etat.effetsOn },
  };
}
