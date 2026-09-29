import { IsIn, IsISO8601, IsOptional } from 'class-validator';
import { CATEGORIES, type Categorie } from '../categories.js';

/** Filtres facultatifs de GET /depenses?du=2026-09-01&au=2026-09-30&categorie=Transport */
export class FiltreDepensesDto {
  @IsOptional()
  @IsISO8601({ strict: true }, { message: '"du" doit être au format AAAA-MM-JJ' })
  du?: string;

  @IsOptional()
  @IsISO8601({ strict: true }, { message: '"au" doit être au format AAAA-MM-JJ' })
  au?: string;

  @IsOptional()
  @IsIn(CATEGORIES, { message: 'Catégorie invalide' })
  categorie?: Categorie;
}
