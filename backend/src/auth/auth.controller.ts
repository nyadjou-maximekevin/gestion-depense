import { Body, Controller, Get, HttpCode, NotFoundException, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { AuthService } from './auth.service.js';
import { CurrentUser } from './current-user.decorator.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { UpdateProfilDto } from './dto/update-profil.dto.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import type { JwtPayload } from './jwt-payload.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /** Route protégée : renvoie l'utilisateur connecté */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  /** Modifier son profil : nom et/ou devise */
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async modifierProfil(@CurrentUser() payload: JwtPayload, @Body() dto: UpdateProfilDto) {
    const user = await this.usersService.update(payload.sub, dto);
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }
}
