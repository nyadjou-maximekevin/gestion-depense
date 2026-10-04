/** Types partagés : ils reflètent les réponses de l'API */

/** Mêmes devises que le backend (backend/src/users/devises.ts) */
export const DEVISES = ['EUR', 'USD', 'GBP', 'CAD', 'CHF', 'XAF', 'MAD'] as const;
export type Devise = (typeof DEVISES)[number];
export const DEVISE_PAR_DEFAUT: Devise = 'EUR';

/** Libellés affichés dans les listes de choix */
export const NOMS_DEVISES: Record<Devise, string> = {
  EUR: 'Euro (€)',
  USD: 'Dollar américain ($)',
  GBP: 'Livre sterling (£)',
  CAD: 'Dollar canadien ($ CA)',
  CHF: 'Franc suisse (CHF)',
  XAF: 'Franc CFA (FCFA)',
  MAD: 'Dirham marocain (MAD)',
};

export interface User {
  id: string;
  email: string;
  nom: string;
  /** Absente des sessions enregistrées avant l'ajout des devises : EUR par défaut */
  devise?: Devise;
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
  devise: Devise;
}

export interface Profil {
  nom?: string;
  devise?: Devise;
}
