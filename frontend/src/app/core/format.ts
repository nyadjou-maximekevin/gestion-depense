/**
 * Helpers de dates et de montants.
 * Les dates sont manipulées en heure LOCALE : toISOString() convertit en UTC
 * et peut décaler d'un jour (ex. minuit à Paris = 22h la veille en UTC).
 */

const euros = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
const jourCourt = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
const moisLong = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' });

/** 1234.5 → "1 234,50 €" */
export function formatEuros(montant: number): string {
  return euros.format(montant);
}

/** Date locale → "AAAA-MM-JJ" */
export function versIso(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const jj = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${mm}-${jj}`;
}

/** "AAAA-MM-JJ" → Date locale (sans décalage de fuseau) */
export function depuisIso(iso: string): Date {
  const [a, m, j] = iso.split('-').map(Number);
  return new Date(a, m - 1, j);
}

/** "2026-09-29" → "mar. 29 sept." */
export function formatJour(iso: string): string {
  return jourCourt.format(depuisIso(iso));
}

/** Date → "Septembre 2026" */
export function formatMois(date: Date): string {
  const texte = moisLong.format(date);
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

/** Premier et dernier jour du mois contenant `date`, au format AAAA-MM-JJ */
export function bornesDuMois(date: Date): { du: string; au: string } {
  const debut = new Date(date.getFullYear(), date.getMonth(), 1);
  const fin = new Date(date.getFullYear(), date.getMonth() + 1, 0); // jour 0 = dernier jour du mois précédent
  return { du: versIso(debut), au: versIso(fin) };
}

/** Décale une date de `n` mois (et la ramène au 1er du mois) */
export function ajouterMois(date: Date, n: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}
