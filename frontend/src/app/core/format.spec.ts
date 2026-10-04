import {
  ajouterMois,
  bornesDuMois,
  decimalesDevise,
  depuisIso,
  formatMontant,
  formatMois,
  symboleDevise,
  versIso,
} from './format';

// Intl utilise des espaces insécables : on les normalise pour comparer
const n = (s: string) => s.replace(/\s/g, ' ');

describe('format', () => {
  it('formate les montants dans la devise demandée', () => {
    expect(n(formatMontant(1234.5, 'EUR'))).toBe('1 234,50 €');
    expect(n(formatMontant(1234.5, 'USD'))).toBe('1 234,50 $US');
    expect(n(formatMontant(1234.5, 'GBP'))).toBe('1 234,50 £GB');
    expect(n(formatMontant(1234.5, 'CHF'))).toBe('1 234,50 CHF');
  });

  it('formate le franc CFA sans centimes', () => {
    expect(n(formatMontant(1234.5, 'XAF'))).toBe('1 235 FCFA');
    expect(decimalesDevise('XAF')).toBe(0);
    expect(decimalesDevise('EUR')).toBe(2);
  });

  it("utilise l'euro par défaut", () => {
    expect(n(formatMontant(10))).toBe('10,00 €');
  });

  it('donne le symbole de la devise', () => {
    expect(symboleDevise('EUR')).toBe('€');
    expect(symboleDevise('XAF')).toBe('FCFA');
  });

  it('convertit une date locale en AAAA-MM-JJ sans décalage de fuseau', () => {
    expect(versIso(new Date(2026, 8, 1, 0, 0))).toBe('2026-09-01');
    expect(versIso(new Date(2026, 8, 30, 23, 59))).toBe('2026-09-30');
  });

  it('relit une date AAAA-MM-JJ en date locale', () => {
    const date = depuisIso('2026-02-28');
    expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([2026, 1, 28]);
  });

  it('calcule les bornes du mois (y compris février et années bissextiles)', () => {
    expect(bornesDuMois(new Date(2026, 8, 15))).toEqual({ du: '2026-09-01', au: '2026-09-30' });
    expect(bornesDuMois(new Date(2026, 1, 10))).toEqual({ du: '2026-02-01', au: '2026-02-28' });
    expect(bornesDuMois(new Date(2028, 1, 10))).toEqual({ du: '2028-02-01', au: '2028-02-29' });
  });

  it('change de mois en passant les années', () => {
    expect(versIso(ajouterMois(new Date(2026, 0, 31), -1))).toBe('2025-12-01');
    expect(versIso(ajouterMois(new Date(2026, 11, 15), 1))).toBe('2027-01-01');
  });

  it('affiche le mois avec une majuscule', () => {
    expect(formatMois(new Date(2026, 8, 1))).toBe('Septembre 2026');
  });
});
