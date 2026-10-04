import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { DEVISES, type Devise } from '../../users/devises.js';

/** PATCH /auth/me : champs facultatifs, seuls ceux envoyés sont modifiés */
export class UpdateProfilDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  @MaxLength(80)
  nom?: string;

  @IsOptional()
  @IsIn(DEVISES, { message: `Devise invalide. Valeurs possibles : ${DEVISES.join(', ')}` })
  devise?: Devise;
}
