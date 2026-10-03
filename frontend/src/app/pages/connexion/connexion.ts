import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
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
  enCoursDemo = signal(false);
  /** L'API gratuite (Render) s'endort : la première requête peut prendre ~1 minute */
  serveurLent = signal(false);
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
    this.lancer(this.auth.connexion(this.form.getRawValue()));
  }

  essayerDemo() {
    this.enCoursDemo.set(true);
    this.lancer(this.auth.demo());
  }

  /** Envoie la requête, affiche un message si le serveur met du temps à se réveiller */
  private lancer(requete: Observable<unknown>) {
    this.enCours.set(true);
    this.erreur.set(null);
    const minuteur = setTimeout(() => this.serveurLent.set(true), 4000);

    const terminer = () => {
      clearTimeout(minuteur);
      this.serveurLent.set(false);
      this.enCours.set(false);
      this.enCoursDemo.set(false);
    };

    requete.subscribe({
      next: () => {
        terminer();
        this.router.navigate(['/']);
      },
      error: (e) => {
        terminer();
        this.erreur.set(messageErreur(e));
      },
    });
  }
}
