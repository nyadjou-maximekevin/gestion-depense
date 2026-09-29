/** Types partagés : ils reflètent les réponses de l'API */

export interface User {
  id: string;
  email: string;
  nom: string;
  creeLe: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Identifiants {
  email: string;
  motDePasse: string;
}

export interface Inscription extends Identifiants {
  nom: string;
}
