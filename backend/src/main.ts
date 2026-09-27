import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Valide automatiquement les DTO (class-validator) et rejette les champs inconnus
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  // Autorise le frontend Angular à appeler l'API
  app.enableCors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:4200' });

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
