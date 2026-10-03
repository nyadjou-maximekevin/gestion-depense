import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../config';
import { AuthResponse, Identifiants, Inscription, User } from '../models';

const CLE_TOKEN = 'gd_token';
const CLE_USER = 'gd_user';

/** Gère la session : connexion, inscription, déconnexion et conservation du token */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // État de la session sous forme de signals : les composants se mettent à jour tout seuls
  private readonly _token = signal<string | null>(lire(CLE_TOKEN));
  private readonly _user = signal<User | null>(lireJson<User>(CLE_USER));

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly estConnecte = computed(() => this._token() !== null);

  connexion(identifiants: Identifiants): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_URL}/auth/login`, identifiants)
      .pipe(tap((reponse) => this.ouvrirSession(reponse)));
  }

  inscription(donnees: Inscription): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_URL}/auth/register`, donnees)
      .pipe(tap((reponse) => this.ouvrirSession(reponse)));
  }

  /** Compte de démonstration : données réinitialisées côté API à chaque connexion */
  demo(): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_URL}/auth/demo`, {})
      .pipe(tap((reponse) => this.ouvrirSession(reponse)));
  }

  deconnexion() {
    this._token.set(null);
    this._user.set(null);
    supprimer(CLE_TOKEN);
    supprimer(CLE_USER);
    this.router.navigate(['/connexion']);
  }

  private ouvrirSession({ accessToken, user }: AuthResponse) {
    this._token.set(accessToken);
    this._user.set(user);
    ecrire(CLE_TOKEN, accessToken);
    ecrire(CLE_USER, JSON.stringify(user));
  }
}

// localStorage peut être indisponible (navigation privée, stockage bloqué) : on ne plante jamais
function lire(cle: string): string | null {
  try {
    return localStorage.getItem(cle);
  } catch {
    return null;
  }
}

function lireJson<T>(cle: string): T | null {
  try {
    const valeur = lire(cle);
    return valeur ? (JSON.parse(valeur) as T) : null;
  } catch {
    return null;
  }
}

function ecrire(cle: string, valeur: string) {
  try {
    localStorage.setItem(cle, valeur);
  } catch {
    // la session durera seulement le temps de l'onglet
  }
}

function supprimer(cle: string) {
  try {
    localStorage.removeItem(cle);
  } catch {
    // rien à faire
  }
}
