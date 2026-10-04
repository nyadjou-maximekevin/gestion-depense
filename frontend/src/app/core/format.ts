/**
 * Helpers de dates et de montants.
 * Les dates sont manipulées en heure LOCALE : toISOString() convertit en UTC
 * et peut décaler d'un jour (ex. minuit à Paris = 22h la veille en UTC).
 */

const jourCourt = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
const moisLong = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' });

// Créer un Intl.NumberFormat est coûteux : un seul par devise, réutilisé
const formatsDevise = new Map<string, Intl.NumberFormat>();
function formatDevise(devise: string) {
  let format = formatsDevise.get(devise);
  if (!format) {
    format = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: devise });
    formatsDevise.set(devise, format);
  }
  return format;
}

/**
 * Montant dans la devise de l'utilisateur, au format français.
 * 1234.5 EUR → "1 234,50 €" · USD → "1 234,50 $US" · XAF → "1 235 FCFA" (le franc CFA n'a pas de centimes)
 */
export function formatMontant(montant: number, devise: string = 'EUR'): string {
  return formatDevise(devise).format(montant);
}

/** Symbole seul : EUR → "€", XAF → "FCFA" */
export function symboleDevise(devise: string = 'EUR'): string {
  return formatDevise(devise).formatToParts(0).find((p) => p.type === 'currency')?.value ?? devise;
}

/** Nombre de décimales de la devise : 2 pour EUR, 0 pour XAF */
export function decimalesDevise(devise: string = 'EUR'): number {
  return formatDevise(devise).resolvedOptions().maximumFractionDigits ?? 2;
}

const nombre = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 });

/** 6.89 → "6,89" ; -12.5 → "-12,5" */
export function formatPourcent(valeur: number): string {
  return nombre.format(valeur);
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
