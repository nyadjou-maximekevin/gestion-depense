import { Matches } from 'class-validator';

/** GET /depenses/statistiques?mois=2026-09 */
export class StatistiquesDto {
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, { message: 'Le mois doit être au format AAAA-MM' })
  mois: string;
}
