/** Helpers de mois au format "AAAA-MM" (calculs sans objet Date : aucun piège de fuseau horaire) */

/** "2026-09" décalé de n mois → "2026-06" pour n = -3 */
export function decalerMois(mois: string, n: number): string {
  const [annee, m] = mois.split('-').map(Number);
  const index = annee * 12 + (m - 1) + n;
  return `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, '0')}`;
}

/** Premier et dernier jour d'un mois : "2026-02" → { du: "2026-02-01", au: "2026-02-28" } */
export function bornesMois(mois: string): { du: string; au: string } {
  const [annee, m] = mois.split('-').map(Number);
  // Jour 0 du mois suivant = dernier jour du mois (Date.UTC évite tout décalage)
  const dernierJour = new Date(Date.UTC(annee, m, 0)).getUTCDate();
  return { du: `${mois}-01`, au: `${mois}-${String(dernierJour).padStart(2, '0')}` };
}

/** Liste des n mois se terminant par `mois` : ("2026-09", 3) → ["2026-07", "2026-08", "2026-09"] */
export function derniersMois(mois: string, n: number): string[] {
  return Array.from({ length: n }, (_, i) => decalerMois(mois, i - n + 1));
}
