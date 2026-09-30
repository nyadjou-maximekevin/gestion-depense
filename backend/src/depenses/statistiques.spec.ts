import { variationEnPourcent } from './depenses.service.js';
import { bornesMois, decalerMois, derniersMois } from './statistiques.js';

describe('variationEnPourcent', () => {
  it('arrondit correctement malgré les nombres à virgule (50,375 → 50,38)', () => {
    expect(variationEnPourcent(120.3, 80)).toBe(50.38);
  });

  it('gère les baisses et l\'égalité', () => {
    expect(variationEnPourcent(50, 200)).toBe(-75);
    expect(variationEnPourcent(80, 80)).toBe(0);
  });
});

describe('helpers de mois', () => {
  it('décale en passant les années', () => {
    expect(decalerMois('2026-01', -1)).toBe('2025-12');
    expect(decalerMois('2026-12', 1)).toBe('2027-01');
    expect(decalerMois('2026-09', -5)).toBe('2026-04');
  });

  it('donne le dernier jour du mois, années bissextiles comprises', () => {
    expect(bornesMois('2026-09')).toEqual({ du: '2026-09-01', au: '2026-09-30' });
    expect(bornesMois('2026-02')).toEqual({ du: '2026-02-01', au: '2026-02-28' });
    expect(bornesMois('2028-02')).toEqual({ du: '2028-02-01', au: '2028-02-29' });
  });

  it('liste les 6 derniers mois dans l\'ordre', () => {
    expect(derniersMois('2026-02', 6)).toEqual([
      '2025-09',
      '2025-10',
      '2025-11',
      '2025-12',
      '2026-01',
      '2026-02',
    ]);
  });
});
