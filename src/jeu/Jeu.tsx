import { useReducer } from "preact/hooks";
import type { IdCartes } from "../cartes/paquets/IdCartes";
import { RESSOURCES } from "../data/ressources";
import { etatInitial, reducteur, RESSOURCES_GLOBALES } from "./etat";
import "./jeu.css";

/** HTML de la carte, rendu côté Astro par CarteItem dans un <template> de la page. */
function htmlCarte(id: IdCartes) {
  const modele = document.querySelector<HTMLTemplateElement>(
    `template[data-modele-carte="${CSS.escape(id)}"]`,
  );
  return modele?.innerHTML ?? id;
}

export default function Jeu() {
  const [etat, dispatch] = useReducer(reducteur, undefined, () =>
    etatInitial(),
  );

  return (
    <div class="jeu">
      <div class="jeu-table">
        <button
          class="jeu-pioche"
          disabled={etat.pioche.length === 0}
          onClick={() => dispatch({ type: "piocher", nombre: 1 })}
          title="Piocher 1 carte"
        >
          Pioche
          <span>{etat.pioche.length}</span>
        </button>
      </div>

      <ul class="jeu-main" aria-label="Main">
        {etat.main.map((id, i) => {
          return (
            <li
              class="jeu-carte"
              key={`${id}-${i}`}
              dangerouslySetInnerHTML={{ __html: htmlCarte(id) }}
            />
          );
        })}
      </ul>

      <ul class="jeu-ressources" aria-label="Ressources">
        {RESSOURCES_GLOBALES.map((id) => {
          const { stock, parCycle } = etat.ressources[id];
          return (
            <li key={id}>
              <span class="jeu-ressource-nom">{RESSOURCES[id].plural ?? RESSOURCES[id].name}</span>
              <span class="jeu-ressource-stock">{stock}</span>
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
