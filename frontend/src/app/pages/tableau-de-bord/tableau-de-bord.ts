import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

/** Page protégée (authGuard) : sera remplie aux étapes 6 (dépenses) et 7 (statistiques) */
@Component({
  selector: 'app-tableau-de-bord',
  template: `
    <header class="barre">
      <div class="logo"><span>€</span> Gestion de dépenses</div>
      <button class="btn btn-ghost" type="button" (click)="auth.deconnexion()">Se déconnecter</button>
    </header>

    <main class="contenu">
      <div class="carte">
        <h1>Bonjour {{ auth.user()?.nom }} 👋</h1>
        <p>Tu es connecté avec <strong>{{ auth.user()?.email }}</strong>.</p>
        <p class="bientot">Tes dépenses et tes statistiques arrivent aux prochaines étapes.</p>
      </div>
    </main>
  `,
  styles: `
    .barre {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      max-width: 1100px;
      margin: 0 auto;
      padding: 20px 16px;
    }

    .logo {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-family: var(--font-display);
      font-weight: 700;

      span {
        display: grid;
        place-items: center;
        width: 34px;
        height: 34px;
        border-radius: 10px;
        background: var(--gradient);
        color: #05060f;
      }
    }

    .contenu {
      max-width: 1100px;
      margin: 0 auto;
      padding: 24px 16px;
    }

    h1 {
      font-size: 1.8rem;
      margin-bottom: 8px;
    }

    p {
      color: var(--text-muted);
    }

    .bientot {
      margin-top: 16px;
      color: var(--text-faint);
    }
  `,
})
export class TableauDeBord {
  protected auth = inject(AuthService);
}
