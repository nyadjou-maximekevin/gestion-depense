import type { Categorie } from '../depenses/categories.js';
import { bornesMois, derniersMois } from '../depenses/statistiques.js';

export interface DepenseDemo {
  montant: number;
  categorie: Categorie;
  description: string;
  /** AAAA-MM-JJ */
  date: string;
}

/**
 * Générateur pseudo-aléatoire déterministe (mulberry32) : avec la même graine,
 * on obtient toujours la même suite → un mois donné a toujours les mêmes dépenses.
 */
function generateur(graine: number) {
  let etat = graine >>> 0;
  return () => {
    etat = (etat + 0x6d2b79f5) >>> 0;
    let t = etat;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const centimes = (n: number) => Math.round(n * 100) / 100;

/**
 * 6 mois de dépenses réalistes se terminant aujourd'hui (aucune date dans le futur).
 * @param aujourdhui date du jour au format AAAA-MM-JJ
 */
export function genererDonneesDemo(aujourdhui: string): DepenseDemo[] {
  const moisCourant = aujourdhui.slice(0, 7);
  const depenses: DepenseDemo[] = [];

  for (const mois of derniersMois(moisCourant, 6)) {
    const aleatoire = generateur(Number(mois.replace('-', '')));
    const entre = (min: number, max: number) => centimes(min + aleatoire() * (max - min));
    const dernierJour = Number(bornesMois(mois).au.slice(8));
    // Mois en cours : on resserre le mois entier sur les jours déjà passés,
    // pour qu'un visiteur arrivant le 3 du mois voie quand même un mois bien rempli
    const jourDuMois = mois === moisCourant ? Number(aujourdhui.slice(8)) : dernierJour;
    const ajouter = (jour: number, montant: number, categorie: Categorie, description: string) => {
      if (jour > dernierJour) return;
      const jourReel = Math.max(1, Math.ceil((jour * jourDuMois) / dernierJour));
      const date = `${mois}-${String(jourReel).padStart(2, '0')}`;
      depenses.push({ montant, categorie, description, date });
    };

    // Dépenses fixes
    ajouter(5, 650, 'Logement', 'Loyer');
    ajouter(3, 86.4, 'Transport', 'Pass Navigo');
    ajouter(12, 13.49, 'Abonnements', 'Netflix');
    ajouter(18, 11.12, 'Abonnements', 'Spotify');

    // Courses chaque semaine
    for (const jour of [2, 9, 16, 23, 30]) ajouter(jour, entre(35, 95), 'Alimentation', 'Courses');
    ajouter(14, entre(12, 28), 'Alimentation', 'Marché');

    // Dépenses variables
    ajouter(Math.ceil(entre(6, 26)), entre(15, 45), 'Loisirs', 'Cinéma');
    ajouter(Math.ceil(entre(8, 28)), entre(25, 70), 'Loisirs', 'Restaurant');
    if (aleatoire() < 0.5) ajouter(Math.ceil(entre(4, 25)), entre(8, 30), 'Santé', 'Pharmacie');
    if (aleatoire() < 0.6) ajouter(Math.ceil(entre(10, 27)), entre(30, 120), 'Shopping', 'Vêtements');
    if (aleatoire() < 0.25) ajouter(Math.ceil(entre(1, 20)), 49, 'Éducation', 'Formation en ligne');
  }

  return depenses;
}
