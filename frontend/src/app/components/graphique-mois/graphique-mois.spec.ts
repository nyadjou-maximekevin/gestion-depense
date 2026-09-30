import { maximumRond } from './graphique-mois';

describe('maximumRond (haut de l\'axe du graphique)', () => {
  it('arrondit vers le haut à une valeur ronde', () => {
    expect(maximumRond(83)).toBe(100);
    expect(maximumRond(120.3)).toBe(200);
    expect(maximumRond(260)).toBe(500);
    expect(maximumRond(1340)).toBe(2000);
    expect(maximumRond(2400)).toBe(2500);
  });

  it('garde la valeur si elle est déjà ronde', () => {
    expect(maximumRond(500)).toBe(500);
  });

  it('donne une échelle par défaut quand tout est à 0', () => {
    expect(maximumRond(0)).toBe(100);
  });
});
