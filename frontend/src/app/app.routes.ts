import { Routes } from '@angular/router';
import { authGuard, inviteGuard } from './core/auth/auth.guards';

// loadComponent : chaque page est chargée seulement quand on y va (lazy loading)
export const routes: Routes = [
  {
    path: 'connexion',
    title: 'Connexion — Gestion de dépenses',
    canActivate: [inviteGuard],
    loadComponent: () => import('./pages/connexion/connexion').then((m) => m.Connexion),
  },
  {
    path: 'inscription',
    title: 'Inscription — Gestion de dépenses',
    canActivate: [inviteGuard],
    loadComponent: () => import('./pages/inscription/inscription').then((m) => m.InscriptionPage),
  },
  {
    path: '',
    title: 'Tableau de bord — Gestion de dépenses',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/tableau-de-bord/tableau-de-bord').then((m) => m.TableauDeBord),
  },
  {
    path: 'parametres',
    title: 'Paramètres — Gestion de dépenses',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/parametres/parametres').then((m) => m.Parametres),
  },
  { path: '**', redirectTo: '' },
];
