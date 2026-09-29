import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Depense } from './depense.entity.js';
import { CreateDepenseDto } from './dto/create-depense.dto.js';
import { FiltreDepensesDto } from './dto/filtre-depenses.dto.js';
import { UpdateDepenseDto } from './dto/update-depense.dto.js';

/**
 * Toutes les méthodes reçoivent userId : un utilisateur ne peut jamais
 * lire ni modifier les dépenses d'un autre.
 */
@Injectable()
export class DepensesService {
  constructor(@InjectRepository(Depense) private readonly depenses: Repository<Depense>) {}

  create(userId: string, dto: CreateDepenseDto) {
    return this.depenses.save(this.depenses.create({ ...dto, userId }));
  }

  findAll(userId: string, filtre: FiltreDepensesDto) {
    const where: FindOptionsWhere<Depense> = { userId };

    if (filtre.du && filtre.au) where.date = Between(filtre.du, filtre.au);
    else if (filtre.du) where.date = MoreThanOrEqual(filtre.du);
    else if (filtre.au) where.date = LessThanOrEqual(filtre.au);

    if (filtre.categorie) where.categorie = filtre.categorie;

    return this.depenses.find({ where, order: { date: 'DESC', creeLe: 'DESC' } });
  }

  async findOne(userId: string, id: string) {
    const depense = await this.depenses.findOneBy({ id, userId });
    // 404 aussi quand la dépense appartient à quelqu'un d'autre : on ne révèle pas qu'elle existe
    if (!depense) throw new NotFoundException('Dépense introuvable');
    return depense;
  }

  async update(userId: string, id: string, dto: UpdateDepenseDto) {
    const depense = await this.findOne(userId, id);
    return this.depenses.save(this.depenses.merge(depense, dto));
  }

  async remove(userId: string, id: string) {
    const depense = await this.findOne(userId, id);
    await this.depenses.remove(depense);
  }
}
