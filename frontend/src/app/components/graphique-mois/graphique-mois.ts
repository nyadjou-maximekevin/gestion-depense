import { Component, computed, input, output } from '@angular/core';
import { formatMontant } from '../../core/format';

/** Arrondit vers le haut à une valeur "ronde" pour l'axe : 83 → 100, 1340 → 2000, 260 → 500 */
export function maximumRond(max: number): number {
  if (max <= 0) return 100;
  const puissance = 10 ** Math.floor(Math.log10(max));
  const palier = [1, 2, 2.5, 5, 10].find((m) => m * puissance >= max)!;
  return palier * puissance;
}

const moisCourt = new Intl.DateTimeFormat('fr-FR', { month: 'short' });
const moisLong = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' });

/**
 * Évolution sur 6 mois : colonnes, le mois affiché en couleur, les autres en gris
 * (forme "mise en avant" : on voit tout de suite où se situe le mois courant).
 * Survol / focus clavier → info-bulle ; clic → aller à ce mois.
 */
@Component({
  selector: 'app-graphique-mois',
  template: `
    <div class="zone" role="group" aria-label="Total des dépenses par mois">
      <!-- Grille et graduations (valeurs rondes) -->
      @for (g of graduations(); track g.valeur) {
        <div class="grille" [style.bottom.%]="g.position">
          <span>{{ g.libelle }}</span>
        </div>
      }

      <div class="colonnes">
        @for (c of colonnes(); track c.mois) {
          <button
            type="button"
            class="colonne"
            [class.active]="c.mois === moisActif()"
            [attr.aria-label]="c.libelleLong + ' : ' + c.montant"
            (click)="choisir.emit(c.mois)"
          >
            @if (c.mois === moisActif() && c.total > 0) {
              <span class="etiquette" [style.bottom.%]="c.hauteur">{{ c.montant }}</span>
            }
            <span class="barre" [style.height.%]="c.hauteur"></span>
            <!-- Juste au-dessus de la barre survolée -->
            <span class="bulle" role="tooltip" [style.bottom]="'calc(' + c.hauteur + '% + 8px)'">
              <strong>{{ c.libelleLong }}</strong>
              {{ c.montant }}
            </span>
          </button>
        }
      </div>
    </div>

    <div class="axe-x" aria-hidden="true">
      @for (c of colonnes(); track c.mois) {
        <span [class.active]="c.mois === moisActif()">{{ c.libelleCourt }}</span>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      --hauteur: 180px;
      --marge-axe: 56px;
    }

    .zone {
      position: relative;
      height: var(--hauteur);
      margin-left: var(--marge-axe);
      margin-top: 22px;
    }

    /* Grille : hairline pleine, discrète */
    .grille {
      position: absolute;
      left: 0;
      right: 0;
      border-top: 1px solid var(--viz-grille);

      span {
        position: absolute;
        right: calc(100% + 10px);
        top: -0.6em;
        font-size: 0.75rem;
        color: var(--text-faint);
        white-space: nowrap;
        font-variant-numeric: tabular-nums;
      }
    }

    .colonnes {
      position: absolute;
      inset: 0;
      display: grid;
      grid-template-columns: repeat(6, 1fr);
    }

    /* Toute la bande est cliquable/survolable : cible plus grande que la barre */
    .colonne {
      position: relative;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      height: 100%;
      padding: 0;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: 8px 8px 0 0;

      &:hover,
      &:focus-visible {
        background: rgba(255, 255, 255, 0.03);

        .bulle {
          opacity: 1;
          transform: translate(-50%, 0);
        }
      }
    }

    .barre {
      width: 24px; /* colonne fine : on laisse respirer la bande */
      min-height: 2px;
      border-radius: 4px 4px 0 0; /* arrondi en haut, carré sur la ligne de base */
      background: var(--viz-gris);
      transition: height 0.5s cubic-bezier(0.2, 0.7, 0.2, 1), background 0.2s ease;
    }

    .colonne.active .barre {
      background: var(--viz-accent);
    }

    /* Valeur uniquement sur le mois mis en avant (étiquetage sélectif) */
    .etiquette {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -6px);
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text);
      white-space: nowrap;
      pointer-events: none;
    }

    .bulle {
      position: absolute;
      left: 50%;
      z-index: 2;
      display: flex;
      flex-direction: column;
      padding: 8px 12px;
      border-radius: 10px;
      background: #1a1d2e;
      border: 1px solid var(--border-strong);
      color: var(--text-muted);
      font-size: 0.82rem;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transform: translate(-50%, 4px);
      transition: opacity 0.15s ease, transform 0.15s ease;

      strong {
        color: var(--text);
        font-weight: 600;
      }
    }

    /* Colonnes des bords : la bulle s'aligne vers l'intérieur pour ne pas dépasser du graphique */
    .colonne:first-child .bulle,
    .colonne:first-child:hover .bulle,
    .colonne:first-child:focus-visible .bulle {
      left: 0;
      transform: none;
    }

    .colonne:last-child .bulle,
    .colonne:last-child:hover .bulle,
    .colonne:last-child:focus-visible .bulle {
      left: auto;
      right: 0;
      transform: none;
    }

    .axe-x {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      margin-left: var(--marge-axe);
      padding-top: 8px;
      border-top: 1px solid var(--border-strong); /* ligne de base */

      span {
        text-align: center;
        font-size: 0.8rem;
        color: var(--text-faint);
        text-transform: capitalize;

        &.active {
          color: var(--text);
          font-weight: 600;
        }
      }
    }
  `,
})
export class GraphiqueMois {
  evolution = input.required<{ mois: string; total: number }[]>();
  /** "AAAA-MM" du mois mis en avant */
  moisActif = input.required<string>();
  devise = input('EUR');
  choisir = output<string>();

  private maximum = computed(() => maximumRond(Math.max(0, ...this.evolution().map((e) => e.total))));

  protected graduations = computed(() => {
    const max = this.maximum();
    return [0.5, 1].map((part) => ({
      valeur: max * part,
      position: part * 100,
      // Graduations rondes : pas de décimales ("1 000 €" plutôt que "1 000,00 €")
      libelle: formatMontant(max * part, this.devise()).replace(/,00(?=\D*$)/, ''),
    }));
  });

  protected colonnes = computed(() =>
    this.evolution().map((e) => {
      const [annee, mois] = e.mois.split('-').map(Number);
      const date = new Date(annee, mois - 1, 1);
      return {
        mois: e.mois,
        total: e.total,
        montant: formatMontant(e.total, this.devise()),
        hauteur: (e.total / this.maximum()) * 100,
        libelleCourt: moisCourt.format(date),
        libelleLong: moisLong.format(date),
      };
    }),
  );
}
