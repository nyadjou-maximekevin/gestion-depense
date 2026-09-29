import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { API_URL } from '../config';
import { authGuard } from './auth.guards';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

describe('Authentification (frontend)', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let auth: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthService);
  });

  afterEach(() => httpMock.verify());

  function seConnecter() {
    auth.connexion({ email: 'a@b.fr', motDePasse: 'motdepasse' }).subscribe();
    httpMock.expectOne(`${API_URL}/auth/login`).flush({
      accessToken: 'jeton-123',
      user: { id: '1', email: 'a@b.fr', nom: 'A', creeLe: '' },
    });
  }

  it('garde la session après la connexion', () => {
    seConnecter();
    expect(auth.estConnecte()).toBe(true);
    expect(auth.user()?.nom).toBe('A');
    expect(localStorage.getItem('gd_token')).toBe('jeton-123');
  });

  it("l'intercepteur ajoute le token aux appels vers l'API", () => {
    seConnecter();
    http.get(`${API_URL}/depenses`).subscribe();
    const req = httpMock.expectOne(`${API_URL}/depenses`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer jeton-123');
    req.flush([]);
  });

  it("l'intercepteur n'envoie pas le token à un autre site", () => {
    seConnecter();
    http.get('https://autre-site.com/data').subscribe();
    const req = httpMock.expectOne('https://autre-site.com/data');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('un 401 sur une route protégée déconnecte (session expirée)', () => {
    seConnecter();
    http.get(`${API_URL}/depenses`).subscribe({ error: () => {} });
    httpMock.expectOne(`${API_URL}/depenses`).flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(auth.estConnecte()).toBe(false);
    expect(localStorage.getItem('gd_token')).toBeNull();
  });

  it('un mauvais mot de passe (401 sur /auth/login) ne déclenche pas de déconnexion forcée', () => {
    const deconnexion = vi.spyOn(auth, 'deconnexion');
    auth.connexion({ email: 'a@b.fr', motDePasse: 'faux' }).subscribe({ error: () => {} });
    httpMock.expectOne(`${API_URL}/auth/login`).flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(deconnexion).not.toHaveBeenCalled();
  });

  it("authGuard redirige vers /connexion si l'utilisateur n'est pas connecté", () => {
    const resultat = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));
    expect(resultat).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(resultat as UrlTree)).toBe('/connexion');
  });

  it("authGuard laisse passer un utilisateur connecté", () => {
    seConnecter();
    expect(TestBed.runInInjectionContext(() => authGuard({} as never, {} as never))).toBe(true);
  });
});
