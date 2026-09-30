import { Component, computed, input, output } from '@angular/core';
import { Categorie, STYLE_CATEGORIE, Statistiques } from '../../core/depenses/depense.model';
import { formatEuros } from '../../core/format';

/**
 * Répartition du mois par catégorie : barres horizontales triées, une seule couleur.
 * (9 catégories = trop pour un camembert ; des barres se comparent d'un coup d'œil.)
 * Cliquer une barre filtre la liste sur cette catégorie.
 */
@Component({
  selector: 'app-graphique-categories',
  template: `
    @for (ligne of lignes(); track ligne.categorie) {
      <button
        type="button"
        class="ligne"
        [class.active]="ligne.categorie === categorieActive()"
        [class.estompee]="categorieActive() && ligne.categorie !== categorieActive()"
        [attr.aria-pressed]="ligne.categorie === categorieActive()"
        [attr.aria-label]="ligne.categorie + ' : ' + ligne.montant + ', ' + ligne.pourcentage + ' % du mois'"
        (click)="choisir.emit(ligne.categorie)"
      >
        <span class="nom">{{ ligne.icone }} {{ ligne.categorie }}</span>
        <span class="piste"><span class="barre" [style.width.%]="ligne.largeur"></span></span>
        <span class="valeur">{{ ligne.montant }} <small>{{ ligne.pourcentage }} %</small></span>
      </button>
    } @empty {
      <p class="vide">Pas encore de dépense ce mois-ci.</p>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .ligne {
      display: grid;
      grid-template-columns: 140px 1fr auto;
      align-items: center;
      gap: 12px;
      padding: 8px 10px;
      border: none;
      border-radius: 10px;
      background: transparent;
      color: var(--text);
      font: inherit;
      text-align: left;
      cursor: pointer;
      transition: background 0.15s ease, opacity 0.15s ease;

      &:hover {
        background: var(--surface-hover);
      }

      &.active {
        background: rgba(29, 155, 219, 0.1);
      }

      &.estompee {
        opacity: 0.45;
      }
    }

    .nom {
      font-size: 0.9rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .piste {
      height: 10px;
      border-radius: 4px;
      background: var(--viz-grille);
    }

    .barre {
      display: block;
      height: 100%;
      min-width: 4px;
      border-radius: 0 4px 4px 0;
      background: var(--viz-accent);
      transition: width 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
    }

    .valeur {
      min-width: 110px;
      text-align: right;
      font-size: 0.9rem;
      font-weight: 600;
      font-variant-numeric: tabular-nums;

      small {
        margin-left: 4px;
        font-weight: 400;
        color: var(--text-faint);
      }
    }

    .vide {
      padding: 24px 0;
      text-align: center;
      color: var(--text-faint);
    }

    @media (max-width: 480px) {
      .ligne {
        grid-template-columns: 1fr auto;
        row-gap: 6px;
      }

      .piste {
        grid-column: 1 / -1;
        grid-row: 2;
      }
    }
  `,
})
export class GraphiqueCategories {
  stats = input.required<Statistiques>();
  categorieActive = input<Categorie | null>(null);
  choisir = output<Categorie>();

  protected lignes = computed(() => {
    const { parCategorie, total } = this.stats();
    const max = parCategorie[0]?.total ?? 0; // la liste arrive triée : le 1er est le plus gros
    return parCategorie.map((c) => ({
      categorie: c.categorie,
      icone: STYLE_CATEGORIE[c.categorie].icone,
      montant: formatEuros(c.total),
      largeur: max ? (c.total / max) * 100 : 0,
      pourcentage: total ? Math.round((c.total / total) * 100) : 0,
    }));
  });
}
