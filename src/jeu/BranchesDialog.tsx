import { useState } from "preact/hooks";
import type { IdCartes } from "../cartes/paquets/IdCartes";
import { TOUTES_CARTES } from "../cartes/paquets/toutes.cartes";
import { exemplairesABrancher } from "./branches";
import type { ActionJeu, EtatJeu } from "./etat";
import ExemplairesCarte from "./ExemplairesCarte";

type Props = {
  etat: EtatJeu;
  dispatch: (action: ActionJeu) => void;
};

/**
 * Dialogue ouvert tant qu'une branche est en attente (`etat.branchesEnAttente`) et qu'un exemplaire
 * peut la recevoir : les exemplaires à stock de branches non plein sont affichés comme sur le
 * Terrain (pile, exemplaire current en entier). Un clic sur le current lui pose la branche ; un
 * clic sur un exemplaire masqué en fait le current, sans poser de branche.
 */
export default function BranchesDialog({ etat, dispatch }: Props) {
  /** Index réel de l'exemplaire current, par carte (par défaut, le dernier exemplaire éligible). */
  const [actifs, setActifs] = useState<Partial<Record<IdCartes, number>>>({});
  const cartes = exemplairesABrancher(etat);
  if (cartes.length === 0) return null;

  return (
    <div
      class="evolutions-choix branches-dialog"
      role="dialog"
      aria-label="Placer une branche"
      onClick={(e) => {
        const exemplaire = (e.target as HTMLElement).closest<HTMLElement>("[data-exemplaire-index]");
        const idCarte = exemplaire
          ?.closest<HTMLElement>("[data-carte-terrain]")
          ?.dataset.carteTerrain as IdCartes | undefined;
        if (!exemplaire || !idCarte) return;
        const index = Number(exemplaire.dataset.exemplaireIndex);
        if (exemplaire.classList.contains("jeu-exemplaire-actif")) {
          dispatch({ type: "brancher", idCarte, exemplaireIndex: index });
        } else {
          setActifs((actuel) => ({ ...actuel, [idCarte]: index }));
        }
      }}
    >
      <p class="evolutions-nom">
        Placer {etat.branchesEnAttente > 1 ? `${etat.branchesEnAttente} branches` : "une branche"}
      </p>
      <ul class="jeu-terrain branches-cartes">
        {cartes.map(({ id, indices }) => {
          const position = indices.indexOf(actifs[id] ?? -1);
          return (
            <ExemplairesCarte
              key={id}
              id={id}
              carte={TOUTES_CARTES[id]}
              exemplaires={indices.map((i) => etat.terrain.find((c) => c.id === id)!.exemplaires[i])}
              indices={indices}
              actif={position === -1 ? indices.length - 1 : position}
              etat={etat}
              groupe={false}
            />
          );
        })}
      </ul>
    </div>
  );
}
