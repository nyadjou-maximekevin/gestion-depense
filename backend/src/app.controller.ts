import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /** Vérifie que l'API et la base de données répondent */
  @Get('health')
  health() {
    return this.appService.health();
  }
}
