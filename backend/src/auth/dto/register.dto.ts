import { Transform } from 'class-transformer';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { DEVISES, type Devise } from '../../users/devises.js';

/** Données attendues par POST /auth/register */
export class RegisterDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  @MaxLength(80)
  nom: string;

  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @MaxLength(72) // limite de bcrypt
  motDePasse: string;

  /** Facultatif : EUR par défaut */
  @IsOptional()
  @IsIn(DEVISES, { message: `Devise invalide. Valeurs possibles : ${DEVISES.join(', ')}` })
  devise?: Devise;
}
