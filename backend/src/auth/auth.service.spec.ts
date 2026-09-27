import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { AuthService } from './auth.service.js';
import { UsersService } from '../users/users.service.js';

describe('AuthService', () => {
  const jwtService = { signAsync: async () => 'token' } as unknown as JwtService;
  let usersService: Record<string, ReturnType<typeof vi.fn>>;
  let service: AuthService;

  beforeEach(() => {
    usersService = {
      existe: vi.fn(),
      create: vi.fn(async (data) => ({ id: '1', email: data.email, nom: data.nom })),
      findByEmailAvecMotDePasse: vi.fn(),
    };
    service = new AuthService(usersService as unknown as UsersService, jwtService);
  });

  it('refuse une inscription avec un email déjà utilisé', async () => {
    usersService.existe.mockResolvedValue(true);
    await expect(
      service.register({ email: 'a@b.fr', nom: 'A', motDePasse: 'motdepasse' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('hache le mot de passe à l\'inscription', async () => {
    usersService.existe.mockResolvedValue(false);
    await service.register({ email: 'a@b.fr', nom: 'A', motDePasse: 'motdepasse' });

    const { motDePasseHash } = usersService.create.mock.calls[0][0];
    expect(motDePasseHash).not.toBe('motdepasse');
    expect(await bcrypt.compare('motdepasse', motDePasseHash)).toBe(true);
  });

  it('refuse une connexion avec un mauvais mot de passe', async () => {
    usersService.findByEmailAvecMotDePasse.mockResolvedValue({
      id: '1',
      email: 'a@b.fr',
      motDePasseHash: await bcrypt.hash('bon-mot-de-passe', 4),
    });
    await expect(
      service.login({ email: 'a@b.fr', motDePasse: 'mauvais' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('ne renvoie jamais le hash à la connexion', async () => {
    usersService.findByEmailAvecMotDePasse.mockResolvedValue({
      id: '1',
      email: 'a@b.fr',
      motDePasseHash: await bcrypt.hash('motdepasse', 4),
    });
    const resultat = await service.login({ email: 'a@b.fr', motDePasse: 'motdepasse' });
    expect(resultat.accessToken).toBe('token');
    expect(resultat.user).not.toHaveProperty('motDePasseHash');
  });
});
