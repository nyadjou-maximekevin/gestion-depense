import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { DepensesModule } from './depenses/depenses.module.js';

@Module({
  imports: [
    // Charge les variables du fichier .env (DATABASE_URL, ...) dans process.env
    ConfigModule.forRoot({ isGlobal: true }),

    // Connexion à PostgreSQL (Neon) via l'URL du fichier .env
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.getOrThrow<string>('DATABASE_URL'),
        ssl: true,
        // Enregistre automatiquement les entités déclarées dans les modules
        autoLoadEntities: true,
        // Crée/met à jour les tables à partir des entités : pratique en développement,
        // à remplacer par des migrations avant la mise en production
        synchronize: config.get('NODE_ENV') !== 'production',
      }),
    }),

    AuthModule,
    DepensesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
