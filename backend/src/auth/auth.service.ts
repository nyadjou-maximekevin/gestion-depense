import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import type { JwtPayload } from './jwt-payload.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    if (await this.usersService.existe(dto.email)) {
      throw new ConflictException('Un compte existe déjà avec cet email');
    }

    // bcrypt ajoute un "sel" aléatoire : deux mots de passe identiques donnent des hash différents
    const motDePasseHash = await bcrypt.hash(dto.motDePasse, 10);
    const user = await this.usersService.create({ email: dto.email, nom: dto.nom, motDePasseHash });

    return { accessToken: await this.signer(user.id, user.email), user };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailAvecMotDePasse(dto.email);

    // Même message que l'email existe ou non : on ne révèle pas quels comptes existent
    if (!user || !(await bcrypt.compare(dto.motDePasse, user.motDePasseHash))) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const { motDePasseHash: _, ...sansHash } = user;
    return { accessToken: await this.signer(user.id, user.email), user: sansHash };
  }

  private signer(id: string, email: string) {
    const payload: JwtPayload = { sub: id, email };
    return this.jwtService.signAsync(payload);
  }
}
