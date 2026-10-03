import { genererDonneesDemo } from './donnees-demo.js';

describe('genererDonneesDemo', () => {
  const donnees = genererDonneesDemo('2026-10-03');

  it('couvre les 6 derniers mois', () => {
    const mois = new Set(donnees.map((d) => d.date.slice(0, 7)));
    expect([...mois].sort()).toEqual(['2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10']);
  });

  it("ne crée aucune dépense dans le futur", () => {
    expect(donnees.every((d) => d.date <= '2026-10-03')).toBe(true);
  });

  it('produit des dates valides (pas de 30 février)', () => {
    const fevrier = genererDonneesDemo('2027-02-28').filter((d) => d.date.startsWith('2027-02'));
    expect(fevrier.every((d) => Number(d.date.slice(8)) <= 28)).toBe(true);
  });

  it('produit des montants positifs au centime près', () => {
    // Comparaison avec tolérance : 0.29 * 100 vaut 28.999999… en virgule flottante
    const auCentime = (n: number) => Math.abs(n * 100 - Math.round(n * 100)) < 1e-6;
    expect(donnees.every((d) => d.montant > 0 && auCentime(d.montant))).toBe(true);
  });

  it('est déterministe : mêmes données pour le même jour', () => {
    expect(genererDonneesDemo('2026-10-03')).toEqual(donnees);
  });

  it('contient un loyer par mois, y compris le mois en cours', () => {
    expect(donnees.filter((d) => d.description === 'Loyer')).toHaveLength(6);
  });

  it('remplit le mois en cours même en tout début de mois', () => {
    const debutDeMois = genererDonneesDemo('2026-10-01').filter((d) => d.date.startsWith('2026-10'));
    expect(debutDeMois.length).toBeGreaterThan(8);
    expect(debutDeMois.every((d) => d.date === '2026-10-01')).toBe(true);
  });
});
