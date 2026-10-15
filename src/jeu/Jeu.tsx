import { useReducer } from "preact/hooks";
import type { IdCartes } from "../cartes/paquets/IdCartes";
import { RESSOURCES } from "../data/ressources";
import { TOUTES_CARTES } from "../cartes/paquets/toutes.cartes";
import { peutJouer } from "./jouer";
import { etatInitial, reducteur, RESSOURCES_GLOBALES } from "./etat";
import "./jeu.css";

/** HTML de la carte, rendu côté Astro par CarteItem dans un <template> de la page. */
function htmlCarte(id: IdCartes) {
  const modele = document.querySelector<HTMLTemplateElement>(
    `template[data-modele-carte="${CSS.escape(id)}"]`,
  );
  return modele?.innerHTML ?? id;
}

/** HTML du symbole branches, rendu côté Astro (SvgBranches) dans un <template> de la page. */
function htmlJetonBranche() {
  return (
    document.querySelector<HTMLTemplateElement>("template[data-modele-jeton-branche]")
      ?.innerHTML ?? ""
  );
}

export default function Jeu() {
  const [etat, dispatch] = useReducer(reducteur, undefined, () =>
    etatInitial(),
  );

  return (
    <div class="jeu">
      <div class="jeu-haut">
        <span>Cycle {etat.cycle}</span>
        <button class="jeu-cycle" onClick={() => dispatch({ type: "nouveau-cycle" })}>
          Nouveau cycle
        </button>
      </div>

      <ul class="jeu-terrain" aria-label="Terrain">
        {etat.terrain.map(({ id, exemplaires }) => (
          <li
            class="jeu-carte jeu-pile"
            key={id}
            style={`--derriere: ${exemplaires.length - 1}`}
          >
            {/* Le premier exemplaire est devant ; chaque exemplaire suivant est une carte
                derrière, dépassant par le haut. */}
            {exemplaires.map((e, i) => (
              <div class="jeu-exemplaire" style={`--rang: ${i}`} key={i}>
                <div dangerouslySetInnerHTML={{ __html: htmlCarte(id) }} />
                {e.branchesMax > 0 && (
                  <span class="jeu-jetons-branche" title={`${e.branches} / ${e.branchesMax} branches`}>
                    {Array.from({ length: e.branches }, (_, k) => (
                      <span
                        class="jeu-jeton-branche"
                        key={k}
                        dangerouslySetInnerHTML={{ __html: htmlJetonBranche() }}
                      />
                    ))}
                  </span>
                )}
              </div>
            ))}
          </li>
        ))}
      </ul>

      <div class="jeu-bas">
        <div class="jeu-paquet" aria-label="Pioche">
          Pioche
          <span>{etat.pioche.length}</span>
        </div>

        <ul class="jeu-main" aria-label="Main">
          {etat.main.map((id, i) => (
            <li class="jeu-carte" key={`${id}-${i}`}>
              <button
                class="jeu-carte-bouton"
                disabled={!peutJouer(etat, TOUTES_CARTES[id])}
                onClick={() => dispatch({ type: "jouer", index: i })}
                title="Jouer cette carte"
                dangerouslySetInnerHTML={{ __html: htmlCarte(id) }}
              />
            </li>
          ))}
        </ul>

        <div class="jeu-paquet" aria-label="Défausse">
          Défausse
          <span>{etat.defausse.length}</span>
        </div>
      </div>

      <ul class="jeu-ressources" aria-label="Ressources">
        {RESSOURCES_GLOBALES.map((id) => {
          const { stock, parCycle, stockMax } = etat.ressources[id];
          return (
            <li key={id}>
              <span class="jeu-ressource-nom">{RESSOURCES[id].plural ?? RESSOURCES[id].name}</span>
              <span class="jeu-ressource-stock">
                {stock}
                <small> / {Number.isFinite(stockMax) ? stockMax : "∞"}</small>
              </span>
              <span class="jeu-ressource-cycle">
                {parCycle >= 0 ? "+" : ""}
                {parCycle} / cycle
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
