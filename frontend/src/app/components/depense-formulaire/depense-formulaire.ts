import {
  Component,
  ElementRef,
  OnInit,
  afterNextRender,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CATEGORIES, Categorie, Depense, STYLE_CATEGORIE } from '../../core/depenses/depense.model';
import { DepensesService } from '../../core/depenses/depenses.service';
import { messageErreur } from '../../core/erreur-api';
import { versIso } from '../../core/format';

/**
 * Fenêtre d'ajout / modification d'une dépense.
 * - depense = null  → création
 * - depense fournie → modification (champs pré-remplis)
 */
@Component({
  selector: 'app-depense-formulaire',
  imports: [ReactiveFormsModule],
  templateUrl: './depense-formulaire.html',
  styleUrl: './depense-formulaire.scss',
  host: {
    '(document:keydown.escape)': 'annule.emit()',
  },
})
export class DepenseFormulaire implements OnInit {
  depense = input<Depense | null>(null);

  /** Émis avec la dépense enregistrée (créée ou modifiée) */
  enregistre = output<Depense>();
  annule = output<void>();

  private service = inject(DepensesService);
  private champMontant = viewChild<ElementRef<HTMLInputElement>>('champMontant');

  readonly categories = CATEGORIES;
  readonly style = STYLE_CATEGORIE;

  form = inject(FormBuilder).group({
    montant: [null as number | null, [Validators.required, Validators.min(0.01), Validators.max(1_000_000_000)]],
    categorie: ['Alimentation' as Categorie, Validators.required],
    description: ['', Validators.maxLength(255)],
    date: [versIso(new Date()), Validators.required],
  });

  enCours = signal(false);
  erreur = signal<string | null>(null);

  constructor() {
    // Place le curseur dans le champ montant à l'ouverture
    afterNextRender(() => this.champMontant()?.nativeElement.focus());
  }

  ngOnInit() {
    const depense = this.depense();
    if (depense) {
      this.form.setValue({
        montant: depense.montant,
        categorie: depense.categorie,
        description: depense.description,
        date: depense.date,
      });
    }
  }

  invalide(champ: 'montant' | 'date' | 'description') {
    const control = this.form.controls[champ];
    return control.invalid && control.touched;
  }

  enregistrer() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { montant, categorie, description, date } = this.form.getRawValue();
    const saisie = {
      // arrondi au centime : 12.345 → 12.35
      montant: Math.round(montant! * 100) / 100,
      categorie: categorie!,
      description: description?.trim() ?? '',
      date: date!,
    };

    this.enCours.set(true);
    this.erreur.set(null);

    const depense = this.depense();
    const requete = depense ? this.service.modifier(depense.id, saisie) : this.service.creer(saisie);

    requete.subscribe({
      next: (resultat) => this.enregistre.emit(resultat),
      error: (e) => {
        this.erreur.set(messageErreur(e));
        this.enCours.set(false);
      },
    });
  }
}
