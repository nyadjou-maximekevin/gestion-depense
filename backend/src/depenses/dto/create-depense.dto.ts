import { Transform } from 'class-transformer';
import { IsIn, IsISO8601, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { CATEGORIES, type Categorie } from '../categories.js';

/** Données attendues par POST /depenses */
export class CreateDepenseDto {
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Le montant doit être un nombre (2 décimales max)' })
  @Min(0.01, { message: 'Le montant doit être supérieur à 0' })
  @Max(1_000_000_000)
  montant: number;

  @IsIn(CATEGORIES, { message: `Catégorie invalide. Valeurs possibles : ${CATEGORIES.join(', ')}` })
  categorie: Categorie;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsISO8601({ strict: true }, { message: 'La date doit être au format AAAA-MM-JJ' })
  date: string;
}
