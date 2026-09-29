import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { API_URL } from '../config';
import { AuthService } from './auth.service';

/**
 * Intercepte chaque requête HTTP :
 * 1. ajoute "Authorization: Bearer <token>" pour les appels à notre API
 * 2. si l'API répond 401 (token expiré ou invalide), déconnecte l'utilisateur
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();
  const versNotreApi = req.url.startsWith(API_URL);

  const requete =
    token && versNotreApi ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(requete).pipe(
    catchError((erreur: unknown) => {
      // Un 401 sur /auth/login = mauvais mot de passe : ce n'est pas une session expirée
      const estRouteAuth = /\/auth\/(login|register)$/.test(req.url);
      const sessionExpiree =
        erreur instanceof HttpErrorResponse && erreur.status === 401 && versNotreApi && !estRouteAuth;

      if (sessionExpiree) {
        auth.deconnexion();
      }
      return throwError(() => erreur);
    }),
  );
};
