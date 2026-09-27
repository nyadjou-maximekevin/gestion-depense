import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

/** Données attendues par POST /auth/login */
export class LoginDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @IsString()
  motDePasse: string;
}
