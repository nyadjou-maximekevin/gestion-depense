/** Catégories de dépenses disponibles (aussi exposées via GET /depenses/categories) */
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
