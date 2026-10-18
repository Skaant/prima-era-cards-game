import { useEffect, useReducer, useRef, useState } from "preact/hooks";
import type { IdCartes } from "../cartes/paquets/IdCartes";
import type { IdRessource } from "../ressources/IdRessource";
import { RESSOURCES } from "../data/ressources";
import { TOUTES_CARTES } from "../cartes/paquets/toutes.cartes";
import { peutJouer } from "./jouer";
import { peutUtiliserAction } from "./actions";
import {
  coutPiocher,
  etatInitial,
  GAIN_DEFAUSSER,
  peutPiocherPayant,
  reducteur,
  RESSOURCES_GLOBALES,
  zumsMobilises,
} from "./etat";
import { htmlCarte } from "./htmlModeles";
import ExemplairesCarte from "./ExemplairesCarte";
import "./jeu.css";

/** HTML de l'icône cartes par tour, rendu côté Astro (SvgCarte) dans un <template> de la page. */
function htmlIconeCartesParTour() {
  return (
    document.querySelector<HTMLTemplateElement>(
      "template[data-modele-icone-cartes-par-tour]",
    )?.innerHTML ?? ""
  );
}

/** HTML de l'icône data, rendu côté Astro (SvgData) dans un <template> de la page. */
function htmlIconeData() {
  return (
    document.querySelector<HTMLTemplateElement>(
      "template[data-modele-icone-data]",
    )?.innerHTML ?? ""
  );
}

/** HTML de la barre de navigation, rendu côté Astro (Navbar) dans un <template> de la page. */
function htmlNavbar() {
  return (
    document.querySelector<HTMLTemplateElement>("template[data-modele-navbar]")
      ?.innerHTML ?? ""
  );
}

export default function Jeu() {
  const [navVisible, setNavVisible] = useState(false);
  const [mainVisible, setMainVisible] = useState(true);
  const [etat, dispatch] = useReducer(reducteur, undefined, () =>
    etatInitial(),
  );
  const terrainRef = useRef<HTMLUListElement>(null);
  /** Dialog d'action ouvert à la place de la bottom bar (Pioche ou Défausse). */
  const [dialog, setDialog] = useState<"pioche" | "defausse" | null>(null);
  /** Index de la carte de la Main choisie pour être défaussée. */
  const [aDefausser, setADefausser] = useState<number | null>(null);
  /**
   * Exemplaire affiché en entier (les autres sont masqués), par id de carte du Terrain.
   * Purement visuel (voir `exemplaire.md`) : ne change pas l'ordre des exemplaires dans l'état
   * du jeu, donc l'exemplaire choisi reste affiché à son emplacement habituel dans la pile.
   * Mis à jour explicitement sur le nouvel exemplaire quand une carte est jouée (sinon un
   * exemplaire précédent resterait affiché en entier), en plus du défaut au dernier exemplaire.
   */
  const [exemplaireActif, setExemplaireActif] = useState<
    Partial<Record<IdCartes, number>>
  >({});
  const defausseEnCours = dialog === "defausse";
  const ouvrirDialog = (type: "pioche" | "defausse") => {
    setNavVisible(false);
    setADefausser(null);
    setDialog(type);
  };
  const fermerDialog = () => {
    setDialog(null);
    setADefausser(null);
  };

  // Le HTML des actions (boutons `[data-action-carte]`) vient d'un <template> cloné : son
  // attribut `disabled` est mis à jour ici à chaque changement d'état. Le nombre d'utilisations
  // (`fois`) est compté par exemplaire (voir `peutUtiliserAction`), donc chaque bouton ne dépend
  // que de l'exemplaire auquel il appartient (`[data-exemplaire-index]` le plus proche).
  useEffect(() => {
    const boutons = terrainRef.current?.querySelectorAll<HTMLButtonElement>(
      "[data-action-carte]",
    );
    boutons?.forEach((bouton) => {
      const idCarte = bouton.dataset.actionCarte as IdCartes;
      const actionIndex = Number(bouton.dataset.actionIndex);
      const exemplaireIndex = Number(
        bouton.closest<HTMLElement>("[data-exemplaire-index]")?.dataset
          .exemplaireIndex,
      );
      bouton.disabled = !peutUtiliserAction(
        etat,
        TOUTES_CARTES[idCarte],
        idCarte,
        exemplaireIndex,
        actionIndex,
      );
    });
  });

  // Le HTML des gains "or" (`[data-or-carte]`) vient d'un <template> cloné sans attribut `name`
  // (pour ne pas lier entre eux les boutons radio de plusieurs exemplaires) : la sélection cochée
  // est donc mise à jour ici à chaque changement d'état, à partir de `choixOr`. Dans la ligne
  // d'actions groupées (hors de la pile, pas de `[data-exemplaire-index]`), la sélection
  // affichée est celle que tous les exemplaires partagent, ou aucune si elle diffère entre eux.
  useEffect(() => {
    const groupes =
      terrainRef.current?.querySelectorAll<HTMLFieldSetElement>(
        "[data-or-carte]",
      );
    groupes?.forEach((groupe) => {
      const idCarte = groupe.dataset.orCarte as IdCartes;
      const autreIndex = Number(groupe.dataset.orIndex);
      const autre = TOUTES_CARTES[idCarte]?.gains?.autres?.[autreIndex];
      if (!autre || typeof autre === "string") return;
      const carteTerrain = etat.terrain.find((c) => c.id === idCarte);
      if (!carteTerrain) return;

      let choisie: IdRessource | undefined;
      if (groupe.closest(".jeu-actions-groupees")) {
        const choix = carteTerrain.exemplaires.map(
          (e) => e.choixOr?.[autreIndex] ?? autre.resources[0]?.id,
        );
        choisie = choix.every((c) => c === choix[0]) ? choix[0] : undefined;
      } else {
        const exemplaireIndex = Number(
          groupe.closest<HTMLElement>("[data-exemplaire-index]")?.dataset
            .exemplaireIndex,
        );
        choisie =
          carteTerrain.exemplaires[exemplaireIndex]?.choixOr?.[autreIndex] ??
          autre.resources[0]?.id;
      }
      groupe
        .querySelectorAll<HTMLInputElement>("[data-or-ressource]")
        .forEach((input) => {
          input.checked = input.dataset.orRessource === choisie;
        });
    });
  });

  // La jauge de branches vient du modèle de carte cloné (`CarteItemJaugeBranches.astro`),
  // toujours à 0 par défaut : sur l'exemplaire affiché en entier, elle est mise à jour ici avec
  // son propre stock de branches (voir `exemplaire.md`).
  useEffect(() => {
    const actifs = terrainRef.current?.querySelectorAll<HTMLElement>(
      ".jeu-exemplaire-actif",
    );
    actifs?.forEach((actifEl) => {
      const pile = actifEl.closest<HTMLElement>("[data-carte-terrain]");
      const idCarte = pile?.dataset.carteTerrain as IdCartes;
      const index = Number(actifEl.dataset.exemplaireIndex);
      const exemplaire = etat.terrain.find((c) => c.id === idCarte)
        ?.exemplaires[index];
      if (!exemplaire) return;
      const jauge = actifEl.querySelector<HTMLElement>(".jauge-branches");
      const x = actifEl.querySelector<HTMLElement>(".jauge-branches-x");
      if (!jauge || !x) return;
      x.textContent = `${exemplaire.branches}`;
      jauge
        .querySelectorAll<HTMLElement>(".jauge-branches-segment")
        .forEach((segment, k) => {
          segment.classList.toggle(
            "jauge-branches-segment-remplie",
            k < exemplaire.branches,
          );
        });
    });
  });

  return (
    <div class="jeu">
      {navVisible ? (
        <div
          class="jeu-nav"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("[data-menu-jeu]"))
              setNavVisible(false);
          }}
          dangerouslySetInnerHTML={{ __html: htmlNavbar() }}
        />
      ) : (
        <div class="jeu-haut">
          <ul class="jeu-ressources" aria-label="Ressources">
            {RESSOURCES_GLOBALES.map((id) => {
              const { stock, parCycle, stockMax } = etat.ressources[id];
              return (
                <li key={id}>
                  <span class="jeu-ressource-nom">
                    {RESSOURCES[id].plural ?? RESSOURCES[id].name}
                  </span>
                  <div class="jeu-ressource-valeurs">
                    <div>
                      <span class="jeu-ressource-stock">
                        {stock}
                        {Number.isFinite(stockMax) && (
                          <small> / {stockMax}</small>
                        )}
                      </span>
                      <span class="jeu-ressource-cycle">
                        {parCycle >= 0 ? "+" : ""}
                        {parCycle} / cycle
                      </span>
                    </div>
                    {id === "zums" && (
                      <small class="jeu-ressource-mobilises">
                        {zumsMobilises(etat)} mobilisé
                        {zumsMobilises(etat) === 1 ? "" : "s"}
                      </small>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          <button class="jeu-sortir" onClick={() => setNavVisible(true)}>
            Sortir
          </button>
        </div>
      )}

      <ul
        class="jeu-terrain"
        aria-label="Terrain"
        ref={terrainRef}
        onClick={(e) => {
          const cible = e.target as HTMLElement;

          const radio = cible.closest<HTMLInputElement>("[data-or-ressource]");
          if (radio) {
            const groupe = radio.closest<HTMLElement>("[data-or-carte]");
            if (!groupe) return;
            // Dans la ligne d'actions groupées, hors de la pile : le choix s'applique à tous
            // les exemplaires de la carte à la fois.
            if (radio.closest(".jeu-actions-groupees")) {
              dispatch({
                type: "choisir-ressource-or-groupe",
                idCarte: groupe.dataset.orCarte as IdCartes,
                autreIndex: Number(groupe.dataset.orIndex),
                ressourceId: radio.dataset.orRessource as IdRessource,
              });
              return;
            }
            const exemplaire = radio.closest<HTMLElement>(
              "[data-exemplaire-index]",
            );
            if (!exemplaire) return;
            dispatch({
              type: "choisir-ressource-or",
              idCarte: groupe.dataset.orCarte as IdCartes,
              exemplaireIndex: Number(exemplaire.dataset.exemplaireIndex),
              autreIndex: Number(groupe.dataset.orIndex),
              ressourceId: radio.dataset.orRessource as IdRessource,
            });
            return;
          }

          // Bouton de la ligne d'actions groupées : joue l'action pour tous les exemplaires de
          // la carte, un par un (voir `utiliserActionGroupe`).
          const boutonGroupe = cible.closest<HTMLButtonElement>(
            "[data-action-groupe-carte]",
          );
          if (boutonGroupe) {
            dispatch({
              type: "jouer-action-groupe",
              idCarte: boutonGroupe.dataset.actionGroupeCarte as IdCartes,
              actionIndex: Number(boutonGroupe.dataset.actionIndex),
            });
            return;
          }

          const bouton = cible.closest<HTMLButtonElement>(
            "[data-action-carte]",
          );
          if (bouton) {
            const exemplaire = bouton.closest<HTMLElement>(
              "[data-exemplaire-index]",
            );
            if (!exemplaire) return;
            dispatch({
              type: "jouer-action",
              idCarte: bouton.dataset.actionCarte as IdCartes,
              exemplaireIndex: Number(exemplaire.dataset.exemplaireIndex),
              actionIndex: Number(bouton.dataset.actionIndex),
            });
            return;
          }

          // Clic sur un exemplaire (masqué ou non) : il devient celui affiché en entier, à son
          // emplacement habituel (pas de changement d'ordre des exemplaires, voir `exemplaire.md`).
          const exemplaire = cible.closest<HTMLElement>(
            "[data-exemplaire-index]",
          );
          const pile = exemplaire?.closest<HTMLElement>("[data-carte-terrain]");
          if (!exemplaire || !pile) return;
          const idCarte = pile.dataset.carteTerrain as IdCartes;
          setExemplaireActif((actuel) => ({
            ...actuel,
            [idCarte]: Number(exemplaire.dataset.exemplaireIndex),
          }));
        }}
      >
        {etat.terrain.map(({ id, exemplaires }) => {
          const carte = TOUTES_CARTES[id];
          // Par défaut, le current est le dernier exemplaire posé (voir `exemplaire.md`).
          const actif = exemplaireActif[id] ?? exemplaires.length - 1;
          return (
            <ExemplairesCarte
              key={id}
              id={id}
              carte={carte}
              exemplaires={exemplaires}
              actif={actif}
              etat={etat}
            />
          );
        })}
      </ul>

      {(mainVisible || defausseEnCours) && (
        <ul class="jeu-main" aria-label="Main">
          {etat.main.map((id, i) => (
            <li
              class={`jeu-carte${aDefausser === i ? " jeu-carte-choisie" : ""}`}
              key={`${id}-${i}`}
            >
              <button
                class="jeu-carte-bouton"
                disabled={
                  !defausseEnCours && !peutJouer(etat, TOUTES_CARTES[id])
                }
                onClick={(e) => {
                  if (defausseEnCours) {
                    setADefausser(aDefausser === i ? null : i);
                    return;
                  }
                  // Le choix de ressource "or" n'a de sens qu'une fois la carte sur le terrain.
                  if ((e.target as HTMLElement).closest("[data-or-ressource]"))
                    return;
                  // Le nouvel exemplaire (posé à la fin de la pile) devient le current, même si
                  // un exemplaire précédent de la même carte était affiché en entier.
                  const nombreExemplaires =
                    etat.terrain.find((c) => c.id === id)?.exemplaires.length ??
                    0;
                  setExemplaireActif((actuel) => ({
                    ...actuel,
                    [id]: nombreExemplaires,
                  }));
                  dispatch({ type: "jouer", index: i });
                }}
                title={
                  defausseEnCours ? "Choisir cette carte" : "Jouer cette carte"
                }
                dangerouslySetInnerHTML={{ __html: htmlCarte(id) }}
              />
            </li>
          ))}
        </ul>
      )}

      {dialog ? (
        <div class="jeu-bas" role="dialog">
          {dialog === "pioche" ? (
            <button
              class="jeu-dialog-action"
              disabled={!peutPiocherPayant(etat)}
              onClick={() => dispatch({ type: "piocher-payant" })}
            >
              Piocher {coutPiocher(etat)}
              <span
                class="jeu-icone-data"
                dangerouslySetInnerHTML={{ __html: htmlIconeData() }}
              />
            </button>
          ) : (
            <button
              class="jeu-dialog-action"
              disabled={aDefausser === null}
              onClick={() => {
                if (aDefausser === null) return;
                dispatch({ type: "defausser", index: aDefausser });
                setADefausser(null);
              }}
            >
              Défausser +{GAIN_DEFAUSSER}
              <span
                class="jeu-icone-data"
                dangerouslySetInnerHTML={{ __html: htmlIconeData() }}
              />
            </button>
          )}
          <button
            class="jeu-sortir"
            aria-label="Fermer"
            title="Fermer"
            onClick={fermerDialog}
          >
            ✕
          </button>
        </div>
      ) : (
        <div class="jeu-bas">
          <div class="jeu-bas-groupe">
            <button
              class="jeu-paquet"
              aria-label="Pioche"
              aria-expanded={dialog === "pioche"}
              onClick={() => ouvrirDialog("pioche")}
            >
              Pioche <span>{etat.pioche.length}</span>
            </button>
            <button
              class="jeu-paquet"
              aria-expanded={mainVisible}
              onClick={() => setMainVisible(!mainVisible)}
            >
              Main <span>{etat.main.length}</span>
              <small
                class="jeu-paquet-muted"
                dangerouslySetInnerHTML={{
                  __html: `+${etat.cartesParTour}${htmlIconeCartesParTour()} / cycle`,
                }}
              />
            </button>
            <button
              class="jeu-paquet"
              aria-label="Défausse"
              aria-expanded={dialog === "defausse"}
              onClick={() => ouvrirDialog("defausse")}
            >
              Défausse <span>{etat.defausse.length}</span>
            </button>
          </div>

          <div class="jeu-bas-groupe">
            <span>Cycle {etat.cycle}</span>
            <button
              class="jeu-cycle"
              onClick={() => dispatch({ type: "nouveau-cycle" })}
            >
              Nouveau cycle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
