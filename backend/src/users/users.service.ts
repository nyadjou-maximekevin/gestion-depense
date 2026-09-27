import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity.js';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  findById(id: string) {
    return this.users.findOneBy({ id });
  }

  /** Inclut le hash du mot de passe : à utiliser uniquement pour la connexion */
  findByEmailAvecMotDePasse(email: string) {
    return this.users
      .createQueryBuilder('user')
      .addSelect('user.motDePasseHash')
      .where('user.email = :email', { email })
      .getOne();
  }

  existe(email: string) {
    return this.users.existsBy({ email });
  }

  async create(data: { email: string; nom: string; motDePasseHash: string }) {
    const user = await this.users.save(this.users.create(data));
    // On ne renvoie jamais le hash, même juste après la création
    const { motDePasseHash: _, ...sansHash } = user;
    return sansHash;
  }
}
