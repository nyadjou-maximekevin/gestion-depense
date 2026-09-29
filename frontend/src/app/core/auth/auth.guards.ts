import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Pages privées : redirige vers /connexion si l'utilisateur n'est pas connecté */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.estConnecte() || inject(Router).createUrlTree(['/connexion']);
};

/** Pages connexion/inscription : inutile d'y aller si on est déjà connecté */
export const inviteGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return !auth.estConnecte() || inject(Router).createUrlTree(['/']);
};
