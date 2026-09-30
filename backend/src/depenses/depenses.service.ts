import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import type { Categorie } from './categories.js';
import { Depense } from './depense.entity.js';
import { bornesMois, derniersMois } from './statistiques.js';
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

  /**
   * Statistiques d'un mois, calculées par PostgreSQL (SUM + GROUP BY) :
   * seules quelques lignes de résultat transitent, pas toutes les dépenses.
   */
  async statistiques(userId: string, mois: string) {
    const { du, au } = bornesMois(mois);
    const mois6 = derniersMois(mois, 6);

    // Total et nombre par catégorie pour le mois demandé
    const parCategorie = await this.depenses
      .createQueryBuilder('d')
      .select('d.categorie', 'categorie')
      .addSelect('SUM(d.montant)', 'total')
      .addSelect('COUNT(*)', 'nombre')
      .where('d.userId = :userId', { userId })
      .andWhere('d.date BETWEEN :du AND :au', { du, au })
      .groupBy('d.categorie')
      .orderBy('total', 'DESC')
      .getRawMany<{ categorie: Categorie; total: string; nombre: string }>();

    // Total par mois sur les 6 derniers mois
    const parMois = await this.depenses
      .createQueryBuilder('d')
      .select(`to_char(d.date, 'YYYY-MM')`, 'mois')
      .addSelect('SUM(d.montant)', 'total')
      .where('d.userId = :userId', { userId })
      .andWhere('d.date BETWEEN :debut AND :au', { debut: bornesMois(mois6[0]).du, au })
      .groupBy('mois')
      .getRawMany<{ mois: string; total: string }>();

    // PostgreSQL renvoie SUM/COUNT en texte : on convertit, et on complète les mois sans dépense
    const totaux = new Map(parMois.map((ligne) => [ligne.mois, Number(ligne.total)]));
    const evolution = mois6.map((m) => ({ mois: m, total: totaux.get(m) ?? 0 }));

    const categories = parCategorie.map((ligne) => ({
      categorie: ligne.categorie,
      total: Number(ligne.total),
      nombre: Number(ligne.nombre),
    }));

    const total = arrondi(categories.reduce((somme, c) => somme + c.total, 0));
    const totalMoisPrecedent = evolution[evolution.length - 2].total;

    return {
      mois,
      total,
      nombre: categories.reduce((somme, c) => somme + c.nombre, 0),
      totalMoisPrecedent,
      // null quand le mois précédent est vide : une variation "depuis 0" n'a pas de sens
      variation: totalMoisPrecedent > 0 ? variationEnPourcent(total, totalMoisPrecedent) : null,
      parCategorie: categories,
      evolution,
    };
  }
}

/** Arrondi au centième (évite les 0.30000000000000004 des nombres à virgule) */
function arrondi(n: number) {
  return Math.round(n * 100) / 100;
}

/**
 * Variation en % arrondie au centième, calculée en centimes entiers :
 * en virgule flottante, 40.3 / 80 = 0.50374999… et 50,375 % serait arrondi à tort à 50,37.
 */
export function variationEnPourcent(actuel: number, precedent: number) {
  const centimesActuel = Math.round(actuel * 100);
  const centimesPrecedent = Math.round(precedent * 100);
  return Math.round(((centimesActuel - centimesPrecedent) * 10_000) / centimesPrecedent) / 100;
}
