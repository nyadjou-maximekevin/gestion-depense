import { ajouterMois, bornesDuMois, depuisIso, formatEuros, formatMois, versIso } from './format';

describe('format', () => {
  it('formate les montants en euros', () => {
    // Intl utilise des espaces insécables : on les normalise pour comparer
    expect(formatEuros(1234.5).replace(/\s/g, ' ')).toBe('1 234,50 €');
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
