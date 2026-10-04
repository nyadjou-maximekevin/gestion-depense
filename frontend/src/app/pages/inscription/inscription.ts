import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { messageErreur } from '../../core/erreur-api';
import { DEVISE_PAR_DEFAUT, DEVISES, Devise, NOMS_DEVISES } from '../../core/models';

@Component({
  selector: 'app-inscription',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './inscription.html',
  styleUrl: '../auth-page.scss',
})
export class InscriptionPage {
  private auth = inject(AuthService);
  private router = inject(Router);

  // Mêmes règles que le backend (RegisterDto) pour prévenir l'utilisateur avant l'envoi
  form = inject(FormBuilder).nonNullable.group({
    nom: ['', [Validators.required, Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
    devise: [DEVISE_PAR_DEFAUT as Devise, Validators.required],
  });

  protected readonly devises = DEVISES;
  protected readonly nomsDevises = NOMS_DEVISES;

  enCours = signal(false);
  erreur = signal<string | null>(null);

  invalide(champ: 'nom' | 'email' | 'motDePasse') {
    const control = this.form.controls[champ];
    return control.invalid && control.touched;
  }

  envoyer() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enCours.set(true);
    this.erreur.set(null);

    this.auth.inscription(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/']),
      error: (e) => {
        this.erreur.set(messageErreur(e));
        this.enCours.set(false);
      },
    });
  }
}
