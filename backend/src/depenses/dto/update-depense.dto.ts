import { PartialType } from '@nestjs/mapped-types';
import { CreateDepenseDto } from './create-depense.dto.js';

/** PATCH /depenses/:id : mêmes règles que la création, mais tous les champs sont facultatifs */
export class UpdateDepenseDto extends PartialType(CreateDepenseDto) {}
