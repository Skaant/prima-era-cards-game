import type { Carte } from "../cartes/_types/Carte";
import type { IdCartes } from "../cartes/paquets/IdCartes";
import { peutUtiliserAction } from "./actions";
import type { EtatJeu, Exemplaire } from "./etat";
import { htmlCarte, htmlChipEnergie, htmlGainOn, htmlGainOr, htmlJetonBranche } from "./htmlModeles";

interface Props {
  id: IdCartes;
  carte: Carte;
  exemplaires: Exemplaire[];
  /** Index de l'exemplaire affiché en entier (voir `exemplaire.md`). */
  actif: number;
  etat: EtatJeu;
  /**
   * Index réels (dans la carte du Terrain) des `exemplaires` affichés, quand seuls certains le
   * sont (dialogue des branches) : `data-exemplaire-index` porte alors l'index réel.
   */
  indices?: number[];
  /** Ligne d'actions groupées sous la pile (Terrain uniquement). */
  groupe?: boolean;
}

/** Doit correspondre à `--pas` dans `jeu.css`. */
const PAS_REM = 1.5;
/** Doit correspondre à la hauteur de `.carte-item` (voir `CarteItem.astro`). */
const CARTE_PX = 250;
/** Doit couvrir la hauteur rendue de `.jeu-exemplaire-masque` (bandeau d'un exemplaire masqué). */
const BANDE_REM = 2.4;

/**
 * Emplacement (`top`) de l'exemplaire de rang `i` dans la pile dont l'exemplaire `actif` est
 * affiché en entier. Les exemplaires précédant `actif` restent espacés de `--pas` depuis le
 * haut de la pile (ils dépassent légèrement par le haut de l'exemplaire actif) ; ceux qui le
 * suivent sont décalés d'une carte entière sous `actif` (plus `--pas` par exemplaire
 * intermédiaire), pour ne pas être recouverts par sa carte affichée en entier. Voir
 * `exemplaire.md`.
 */
function topExemplaire(i: number, actif: number) {
  return i <= actif
    ? `${i * PAS_REM}rem`
    : `calc(${(i - 1) * PAS_REM}rem + ${CARTE_PX}px)`;
}

/** Hauteur de la pile couvrant tous les exemplaires, quel que soit celui actif. */
function hauteurPile(n: number, actif: number) {
  const apres = n - 1 - actif;
  return apres > 0
    ? `calc(${actif * PAS_REM}rem + ${CARTE_PX}px + ${(apres - 1) * PAS_REM}rem + ${BANDE_REM}rem)`
    : `calc(${actif * PAS_REM}rem + ${CARTE_PX}px)`;
}

export default function ExemplairesCarte({
  id,
  carte,
  exemplaires,
  actif,
  etat,
  indices,
  groupe = true,
}: Props) {
  const indexReel = (i: number) => indices?.[i] ?? i;
  return (
    <li class="jeu-carte-terrain" data-carte-terrain={id}>
      <div
        class="jeu-pile"
        style={`height: ${hauteurPile(exemplaires.length, actif)}`}
      >
        {exemplaires.map((e, i) => {
          const distance = Math.abs(i - actif);
          return i === actif ? (
            <div
              class="jeu-exemplaire jeu-exemplaire-actif"
              style={`top: ${topExemplaire(i, actif)}; --distance: ${distance}`}
              data-exemplaire-index={indexReel(i)}
              key={i}
            >
              <div dangerouslySetInnerHTML={{ __html: htmlCarte(id) }} />
            </div>
          ) : (
            <div
              class="jeu-exemplaire"
              style={`top: ${topExemplaire(i, actif)}; --distance: ${distance}`}
              data-exemplaire-index={indexReel(i)}
              key={i}
            >
              <div class="jeu-exemplaire-masque">
                {e.branchesMax > 0 && (
                  <span
                    class="jeu-branches-chip"
                    title={`${e.branches} / ${e.branchesMax} branches`}
                  >
                    <span
                      class="jeu-branches-chip-icone"
                      dangerouslySetInnerHTML={{ __html: htmlJetonBranche() }}
                    />
                    {e.branches} / {e.branchesMax}
                  </span>
                )}
                <span class="jeu-actions-masquees">
                  {(carte.actions ?? []).map((action, actionIndex) => (
                    <button
                      type="button"
                      class="jeu-action-masquee"
                      data-action-carte={id}
                      data-action-index={actionIndex}
                      title={action.nom}
                      dangerouslySetInnerHTML={{ __html: htmlChipEnergie() }}
                    />
                  ))}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ligne d'actions groupées : uniquement si la carte a plusieurs exemplaires. À gauche, le
          choix "or" (s'il y en a), appliqué à tous les exemplaires à la fois ; à droite, un
          bouton par action, qui la joue pour chaque exemplaire un par un, en s'arrêtant dès que
          l'un d'eux ne peut plus payer son coût (voir `utiliserActionGroupe`). */}
      {groupe && exemplaires.length > 1 && (
        <div class="jeu-actions-groupees">
          <div class="jeu-actions-groupees-or">
            {(carte.gains?.autres ?? []).map((autre, autreIndex) =>
              typeof autre !== "string" && autre.type === "or" ? (
                <div
                  key={autreIndex}
                  dangerouslySetInnerHTML={{ __html: htmlGainOr(id, autreIndex) }}
                />
              ) : null,
            )}
            {(carte.actions ?? []).flatMap((action, actionIndex) =>
              (action.gains.autres ?? []).map((autre, autreIndex) =>
                typeof autre !== "string" && autre.type === "or" ? (
                  <div
                    key={`action-${actionIndex}-${autreIndex}`}
                    dangerouslySetInnerHTML={{ __html: htmlGainOr(id, autreIndex, actionIndex) }}
                  />
                ) : null,
              ),
            )}
            {(carte.gains?.autres ?? []).map((autre, autreIndex) =>
              typeof autre !== "string" && autre.type === "on" && autre.activable ? (
                <div
                  key={`on-${autreIndex}`}
                  dangerouslySetInnerHTML={{ __html: htmlGainOn(id, autreIndex) }}
                />
              ) : null,
            )}
          </div>
          <div class="jeu-actions-groupees-boutons">
            {(carte.actions ?? []).map((action, actionIndex) => (
              <button
                type="button"
                class="jeu-action-masquee"
                data-action-groupe-carte={id}
                data-action-index={actionIndex}
                title={`${action.nom} (tous les exemplaires)`}
                disabled={!peutUtiliserAction(etat, carte, id, 0, actionIndex)}
                dangerouslySetInnerHTML={{ __html: htmlChipEnergie() }}
                key={actionIndex}
              />
            ))}
          </div>
        </div>
      )}
    </li>
  );
}
