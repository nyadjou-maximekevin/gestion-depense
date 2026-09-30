/** Mêmes catégories que le backend (backend/src/depenses/categories.ts) */
export const CATEGORIES = [
  'Alimentation',
  'Logement',
  'Transport',
  'Santé',
  'Loisirs',
  'Shopping',
  'Abonnements',
  'Éducation',
  'Autre',
] as const;

export type Categorie = (typeof CATEGORIES)[number];

/** Icône et couleur de chaque catégorie (affichage uniquement) */
export const STYLE_CATEGORIE: Record<Categorie, { icone: string; couleur: string }> = {
  Alimentation: { icone: '🛒', couleur: '#34d399' },
  Logement: { icone: '🏠', couleur: '#60a5fa' },
  Transport: { icone: '🚗', couleur: '#fbbf24' },
  Santé: { icone: '💊', couleur: '#f87171' },
  Loisirs: { icone: '🎮', couleur: '#a78bfa' },
  Shopping: { icone: '🛍️', couleur: '#f472b6' },
  Abonnements: { icone: '📺', couleur: '#22d3ee' },
  Éducation: { icone: '📚', couleur: '#fb923c' },
  Autre: { icone: '📦', couleur: '#94a3b8' },
};

/** Une dépense telle que renvoyée par l'API */
export interface Depense {
  id: string;
  montant: number;
  categorie: Categorie;
  description: string;
  /** AAAA-MM-JJ */
  date: string;
  creeLe: string;
  modifieLe: string;
}

/** Données envoyées pour créer ou modifier une dépense */
export interface DepenseSaisie {
  montant: number;
  categorie: Categorie;
  description: string;
  date: string;
}

/** Réponse de GET /depenses/statistiques?mois=AAAA-MM */
export interface Statistiques {
  mois: string;
  total: number;
  nombre: number;
  totalMoisPrecedent: number;
  /** Variation en % vs le mois précédent (null si le mois précédent est vide) */
  variation: number | null;
  /** Trié du plus gros au plus petit total */
  parCategorie: { categorie: Categorie; total: number; nombre: number }[];
  /** 6 derniers mois, du plus ancien au mois demandé */
  evolution: { mois: string; total: number }[];
}

export interface FiltreDepenses {
  du?: string;
  au?: string;
  categorie?: Categorie;
}
