/** Devises proposées (codes ISO 4217). La première est la devise par défaut. */
export const DEVISES = ['EUR', 'USD', 'GBP', 'CAD', 'CHF', 'XAF', 'MAD'] as const;

export type Devise = (typeof DEVISES)[number];

export const DEVISE_PAR_DEFAUT: Devise = 'EUR';
