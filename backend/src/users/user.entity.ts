import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DEVISE_PAR_DEFAUT, type Devise } from './devises.js';

/** Table "users" : un compte utilisateur */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  nom: string;

  /** Devise d'affichage de toutes ses dépenses (code ISO 4217 : EUR, USD…) */
  @Column({ type: 'varchar', length: 3, default: DEVISE_PAR_DEFAUT })
  devise: Devise;

  /** Mot de passe haché avec bcrypt — jamais renvoyé par défaut (select: false) */
  @Column({ select: false })
  motDePasseHash: string;

  @CreateDateColumn({ type: 'timestamptz' })
  creeLe: Date;
}
