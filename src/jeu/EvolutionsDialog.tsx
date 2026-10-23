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

/**
 * Jauge de progression en rectangles, même système que la jauge de branches des exemplaires
 * (`CarteItemJaugeBranches.astro`) : un segment par unité de `cible`, remplis jusqu'à `valeur`.
 */
function JaugeProgression({ valeur, cible }: { valeur: number; cible: number }) {
  return (
    <div class="evolutions-jauge-bloc">
      <div class="evolutions-jauge-label">
        {Math.min(valeur, cible)} / {cible}
      </div>
      <div class="evolutions-jauge">
        {Array.from({ length: cible }).map((_, k) => (
          <span
            key={k}
            class={`evolutions-jauge-segment${k < valeur ? " evolutions-jauge-segment-remplie" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

/** Valeur actuelle, cible et libellé d'une condition de déblocage, pour l'afficher sous forme de jauge. */
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

/** Classe du lien vers le paquet d'origine : noir si l'origine est débloquée, muté sinon. */
function classeLien(actif: boolean) {
  return actif ? " evolutions-lien-actif" : "";
}

/** Conditions de déblocage d'un paquet, toujours affichées (même une fois validées). */
function Conditions({ id, etat }: { id: IdPaquetEvolution; etat: EtatJeu }) {
  return (
    <div class="evolutions-conditions">
      {EVOLUTIONS[id].conditions.map((condition, i) => {
        const { valeur, cible, label } = progression(etat, condition);
        return (
          <div class="evolutions-condition" key={i}>
            <JaugeProgression valeur={valeur} cible={cible} />
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function Noeud({
  id,
  etat,
  dispatch,
  lien,
}: { id: IdPaquetEvolution; lien: boolean } & Props) {
  const config = EVOLUTIONS[id];

  if (!estDebloquee(etat, id)) {
    return (
      <div class={`evolutions-noeud evolutions-verrouille${classeLien(lien)}`} aria-disabled="true">
        <p class="evolutions-nom">{config.nom}</p>
        <Conditions id={id} etat={etat} />
      </div>
    );
  }

  return (
    <button
      class={`evolutions-noeud evolutions-debloquee${classeLien(lien)}`}
      disabled={!peutRevelerEvolution(etat, id)}
      onClick={() => dispatch({ type: "evolution-reveler", paquet: id })}
    >
      <p class="evolutions-nom">{config.nom}</p>
      <Conditions id={id} etat={etat} />
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
 * (kolos-1, perma-1, nov-1) les uns sous les autres sous leur colonne parente.
 */
export default function EvolutionsDialog({ etat, dispatch }: Props) {
  const ok = (id: IdPaquetEvolution) => estDebloquee(etat, id);
  const p = { etat, dispatch };
  return (
    <div class="evolutions-dialog" role="dialog" aria-label="Évolutions">
      <div class="evolutions-colonne">
        <div class="evolutions-base">
          <div class="evolutions-noeud evolutions-racine">Paquet de base</div>
        </div>
      </div>
      <div class="evolutions-colonne">
        <div class={`evolutions-base${classeLien(true)}`}>
          <Noeud id="evolution-base-1" lien={true} {...p} />
        </div>
        <Noeud id="kolos-1" lien={ok("evolution-base-1")} {...p} />
      </div>
      <div class="evolutions-colonne">
        <div class={`evolutions-base${classeLien(ok("evolution-base-1"))}`}>
          <Noeud id="evolution-base-2" lien={ok("evolution-base-1")} {...p} />
        </div>
        <div class="evolutions-enfants">
          <Noeud id="perma-1" lien={ok("evolution-base-2")} {...p} />
          <Noeud id="nov-1" lien={ok("evolution-base-2")} {...p} />
        </div>
      </div>
      <div class="evolutions-colonne">
        <div class={`evolutions-base${classeLien(ok("evolution-base-2"))}`}>
          <Noeud id="evolution-base-3" lien={ok("evolution-base-2")} {...p} />
        </div>
      </div>
    </div>
  );
}

/** Paquet d'évolution dont les cartes révélées attendent un choix, s'il y en a un. */
export function paquetEnChoix(etat: EtatJeu): IdPaquetEvolution | undefined {
  return (Object.keys(etat.evolutions) as IdPaquetEvolution[]).find(
    (id) => etat.evolutions[id].reveal,
  );
}

/** Dialog de choix entre les cartes révélées d'un paquet (affichées en x2), ou aucune. */
export function ChoixEvolutionDialog({ etat, dispatch }: Props) {
  const id = paquetEnChoix(etat);
  const reveal = id && etat.evolutions[id].reveal;
  if (!id || !reveal) return null;
  return (
    <div class="evolutions-choix" role="dialog" aria-label="Choisir une carte">
      <p class="evolutions-nom">{EVOLUTIONS[id].nom}</p>
      <div class="evolutions-cartes-revelees">
        {reveal.map((idCarte, i) => (
          <button
            key={i}
            class="jeu-carte-bouton evolutions-carte-zoom"
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
