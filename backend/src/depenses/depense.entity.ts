import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity.js';
import type { Categorie } from './categories.js';

/** Table "depenses" : une dépense appartient à un utilisateur */
@Entity('depenses')
@Index(['userId', 'date'])
export class Depense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * numeric(12,2) : montant exact au centime (jamais de float pour de l'argent).
   * PostgreSQL renvoie les numeric sous forme de texte : le transformer les reconvertit en nombre.
   */
  @Column('numeric', {
    precision: 12,
    scale: 2,
    transformer: { to: (v: number) => v, from: (v: string) => Number(v) },
  })
  montant: number;

  @Column({ type: 'varchar', length: 40 })
  categorie: Categorie;

  @Column({ type: 'varchar', length: 255, default: '' })
  description: string;

  /** Date de la dépense au format AAAA-MM-JJ (sans heure) */
  @Column({ type: 'date' })
  date: string;

  @Column('uuid')
  userId: string;

  // Si l'utilisateur est supprimé, ses dépenses le sont aussi
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn({ type: 'timestamptz' })
  creeLe: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  modifieLe: Date;
}
