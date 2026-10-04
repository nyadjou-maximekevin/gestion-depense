import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { messageErreur } from '../../core/erreur-api';
import { formatMontant } from '../../core/format';
import { DEVISES, Devise, NOMS_DEVISES } from '../../core/models';

/** Profil de l'utilisateur : nom et devise d'affichage */
@Component({
  selector: 'app-parametres',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './parametres.html',
  styleUrl: '../auth-page.scss',
})
export class Parametres {
  private auth = inject(AuthService);

  protected readonly devises = DEVISES;
  protected readonly nomsDevises = NOMS_DEVISES;
  protected readonly deviseActuelle = this.auth.devise;
  protected readonly email = this.auth.user()?.email;

  form = inject(FormBuilder).nonNullable.group({
    nom: [this.auth.user()?.nom ?? '', [Validators.required, Validators.maxLength(80)]],
    devise: [this.auth.devise() as Devise, Validators.required],
  });

  /** Devise sélectionnée dans la liste, pour l'aperçu et l'avertissement */
  protected deviseChoisie = toSignal(this.form.controls.devise.valueChanges, {
    initialValue: this.form.controls.devise.value,
  });
  protected readonly apercu = (devise: string) => formatMontant(1234.5, devise);

  enCours = signal(false);
  erreur = signal<string | null>(null);
  succes = signal(false);

  enregistrer() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enCours.set(true);
    this.erreur.set(null);
    this.succes.set(false);

    this.auth.modifierProfil(this.form.getRawValue()).subscribe({
      next: () => {
        this.enCours.set(false);
        this.succes.set(true);
        this.form.markAsPristine();
      },
      error: (e) => {
        this.erreur.set(messageErreur(e));
        this.enCours.set(false);
      },
    });
  }
}
