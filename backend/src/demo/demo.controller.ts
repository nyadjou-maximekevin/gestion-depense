import { Controller, HttpCode, Post } from '@nestjs/common';
import { DemoService } from './demo.service.js';

@Controller('auth')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  /** Connexion au compte de démonstration (données réinitialisées à chaque appel) */
  @Post('demo')
  @HttpCode(200)
  demo() {
    return this.demoService.connexion();
  }
}
