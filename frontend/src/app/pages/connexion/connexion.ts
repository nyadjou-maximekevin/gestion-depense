import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { messageErreur } from '../../core/erreur-api';

@Component({
  selector: 'app-connexion',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './connexion.html',
  styleUrl: '../auth-page.scss',
})
export class Connexion {
  private auth = inject(AuthService);
  private router = inject(Router);

  // Formulaire réactif : la structure et les règles sont définies en TypeScript
  form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', Validators.required],
  });

  enCours = signal(false);
  erreur = signal<string | null>(null);

  /** Affiche l'erreur d'un champ seulement après que l'utilisateur l'a touché */
  invalide(champ: 'email' | 'motDePasse') {
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

    this.auth.connexion(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/']),
      error: (e) => {
        this.erreur.set(messageErreur(e));
        this.enCours.set(false);
      },
    });
  }
}
