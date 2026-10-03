import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';
import { DataSource } from 'typeorm';
import type { JwtPayload } from '../auth/jwt-payload.js';
import { Depense } from '../depenses/depense.entity.js';
import { User } from '../users/user.entity.js';
import { genererDonneesDemo } from './donnees-demo.js';

export const EMAIL_DEMO = 'demo@gestion-depenses.app';

/**
 * Compte de démonstration pour les visiteurs (recruteurs) :
 * à chaque connexion, ses données sont remplacées par 6 mois de dépenses à jour.
 */
@Injectable()
export class DemoService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {}

  async connexion() {
    const aujourdhui = new Date().toISOString().slice(0, 10);

    // Transaction : soit tout est remplacé, soit rien (jamais de compte à moitié vide)
    const user = await this.dataSource.transaction(async (manager) => {
      let demo = await manager.findOneBy(User, { email: EMAIL_DEMO });
      if (!demo) {
        // Mot de passe aléatoire jamais communiqué : on n'entre que par POST /auth/demo
        const motDePasseHash = await bcrypt.hash(randomBytes(32).toString('hex'), 10);
        demo = await manager.save(manager.create(User, { email: EMAIL_DEMO, nom: 'Compte démo', motDePasseHash }));
      }

      await manager.delete(Depense, { userId: demo.id });
      await manager.insert(
        Depense,
        genererDonneesDemo(aujourdhui).map((d) => ({ ...d, userId: demo.id })),
      );
      return demo;
    });

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const { motDePasseHash: _, ...sansHash } = user;
    return { accessToken: await this.jwtService.signAsync(payload), user: sansHash };
  }
}
