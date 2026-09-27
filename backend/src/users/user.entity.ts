import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

/** Table "users" : un compte utilisateur */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  nom: string;

  /** Mot de passe haché avec bcrypt — jamais renvoyé par défaut (select: false) */
  @Column({ select: false })
  motDePasseHash: string;

  @CreateDateColumn({ type: 'timestamptz' })
  creeLe: Date;
}
