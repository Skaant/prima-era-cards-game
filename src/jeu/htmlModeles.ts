import type { IdCartes } from "../cartes/paquets/IdCartes";

/** HTML de la carte, rendu côté Astro par CarteItem dans un <template> de la page. */
export function htmlCarte(id: IdCartes) {
  const modele = document.querySelector<HTMLTemplateElement>(
    `template[data-modele-carte="${CSS.escape(id)}"]`,
  );
  return modele?.innerHTML ?? id;
}

/** HTML de l'icône data, rendu côté Astro (SvgData) dans un <template> de la page. */
export function htmlIconeData() {
  return (
    document.querySelector<HTMLTemplateElement>(
      "template[data-modele-icone-data]",
    )?.innerHTML ?? ""
  );
}

/** HTML du symbole branches, rendu côté Astro (SvgBranches) dans un <template> de la page. */
export function htmlJetonBranche() {
  return (
    document.querySelector<HTMLTemplateElement>(
      "template[data-modele-jeton-branche]",
    )?.innerHTML ?? ""
  );
}

/** HTML de la chip énergie, rendu côté Astro (SvgEnergie) dans un <template> de la page. */
export function htmlChipEnergie() {
  return (
    document.querySelector<HTMLTemplateElement>(
      "template[data-modele-chip-energie]",
    )?.innerHTML ?? ""
  );
}

/**
 * HTML du choix "or" (`autreIndex` de `gains.autres`) de la carte `id`, réutilisé tel que rendu
 * côté Astro par `CarteItemGains` (fieldset `[data-or-carte][data-or-index]`, avec les icônes de
 * ressource), pour la ligne d'actions groupées sous une pile d'exemplaires (voir `exemplaire.md`).
 */
export function htmlGainOr(id: IdCartes, autreIndex: number) {
  const modele = document.querySelector<HTMLTemplateElement>(
    `template[data-modele-carte="${CSS.escape(id)}"]`,
  );
  const fieldset = modele?.content.querySelector<HTMLElement>(
    `[data-or-carte="${CSS.escape(id)}"][data-or-index="${autreIndex}"]`,
  );
  return fieldset?.outerHTML ?? "";
}
