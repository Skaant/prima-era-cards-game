import { TRIBUS } from "../data/tribus";
import {
  EVOLUTIONS,
  type ConditionDeblocage,
  type IdPaquetEvolution,
} from "../évolutions/évolutions.data";
import type { ActionJeu, EtatJeu } from "./etat";
import { estDebloquee, peutRevelerEvolution } from "./evolutions";
import { htmlCarte, htmlIconeData } from "./htmlModeles";

type Props = {
  etat: EtatJeu;
  dispatch: (action: ActionJeu) => void;
};

/** Cercle de progression SVG : fond en couleur mutée, arc noir proportionnel à `valeur / cible`. */
function CercleProgression({ valeur, cible }: { valeur: number; cible: number }) {
  const pct = Math.min(valeur / cible, 1);
  const r = 16;
  const circonference = 2 * Math.PI * r;
  return (
    <svg class="evolutions-cercle" viewBox="0 0 40 40" width="40" height="40">
      <circle class="evolutions-cercle-fond" cx="20" cy="20" r={r} />
      <circle
        class="evolutions-cercle-progression"
        cx="20"
        cy="20"
        r={r}
        stroke-dasharray={`${circonference * pct} ${circonference}`}
        transform="rotate(-90 20 20)"
      />
    </svg>
  );
}

/** Valeur actuelle, cible et libellé d'une condition de déblocage, pour l'afficher sous forme de cercle. */
function progression(etat: EtatJeu, condition: ConditionDeblocage) {
  if (condition.type === "cartes-achetees") {
    return {
      valeur: etat.evolutions[condition.paquet].achetees,
      cible: condition.min,
      label: `${condition.min} cartes achetées`,
    };
  }
  return {
    valeur: etat.affinitesTribus[condition.tribu]?.stock ?? 0,
    cible: condition.min,
    label: `${TRIBUS[condition.tribu].name} ${condition.min}`,
  };
}

function Noeud({ id, etat, dispatch }: { id: IdPaquetEvolution } & Props) {
  const config = EVOLUTIONS[id];
  const evolution = etat.evolutions[id];

  if (evolution.reveal) {
    return (
      <div class="evolutions-noeud evolutions-reveal">
        <p class="evolutions-nom">{config.nom}</p>
        <div class="evolutions-cartes-revelees">
          {evolution.reveal.map((idCarte, i) => (
            <button
              key={i}
              class="jeu-carte-bouton"
              title="Choisir cette carte"
              onClick={() => dispatch({ type: "evolution-choisir", paquet: id, choix: i })}
              dangerouslySetInnerHTML={{ __html: htmlCarte(idCarte) }}
            />
          ))}
        </div>
        <button
          class="evolutions-aucune"
          onClick={() => dispatch({ type: "evolution-choisir", paquet: id, choix: null })}
        >
          Aucune
        </button>
      </div>
    );
  }

  if (!estDebloquee(etat, id)) {
    return (
      <div class="evolutions-noeud evolutions-verrouille" aria-disabled="true">
        <p class="evolutions-nom">{config.nom}</p>
        <div class="evolutions-conditions">
          {config.conditions.map((condition, i) => {
            const { valeur, cible, label } = progression(etat, condition);
            return (
              <div class="evolutions-condition" key={i}>
                <CercleProgression valeur={valeur} cible={cible} />
                <span>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <button
      class="evolutions-noeud evolutions-debloquee"
      disabled={!peutRevelerEvolution(etat, id)}
      onClick={() => dispatch({ type: "evolution-reveler", paquet: id })}
    >
      <p class="evolutions-nom">{config.nom}</p>
      <span class="evolutions-cout">
        {config.coutData}
        <span class="jeu-icone-data" dangerouslySetInnerHTML={{ __html: htmlIconeData() }} />
      </span>
    </button>
  );
}

/**
 * Arbre de déblocage des paquets d'évolution, en colonnes horizontales : Base, évolution-base-1,
 * évolution-base-2, évolution-base-3 en haut de chaque colonne, les paquets de tribu enfants
 * (kolos-1, perma-1, nov-1) sous leur colonne parente.
 */
export default function EvolutionsDialog({ etat, dispatch }: Props) {
  return (
    <div class="evolutions-dialog" role="dialog" aria-label="Évolutions">
      <div class="evolutions-colonne">
        <div class="evolutions-noeud evolutions-racine">Paquet de base</div>
      </div>
      <div class="evolutions-colonne">
        <Noeud id="evolution-base-1" etat={etat} dispatch={dispatch} />
        <Noeud id="kolos-1" etat={etat} dispatch={dispatch} />
      </div>
      <div class="evolutions-colonne">
        <Noeud id="evolution-base-2" etat={etat} dispatch={dispatch} />
        <div class="evolutions-enfants">
          <Noeud id="perma-1" etat={etat} dispatch={dispatch} />
          <Noeud id="nov-1" etat={etat} dispatch={dispatch} />
        </div>
      </div>
      <div class="evolutions-colonne">
        <Noeud id="evolution-base-3" etat={etat} dispatch={dispatch} />
      </div>
    </div>
  );
}
