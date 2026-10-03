import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { optionsBaseDeDonnees } from './database/data-source.js';
import { DepensesModule } from './depenses/depenses.module.js';
import { DemoModule } from './demo/demo.module.js';

@Module({
  imports: [
    // Charge les variables du fichier .env (DATABASE_URL, ...) dans process.env
    ConfigModule.forRoot({ isGlobal: true }),

    // Connexion à PostgreSQL (Neon) via l'URL du fichier .env
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...optionsBaseDeDonnees(config.getOrThrow<string>('DATABASE_URL')),
        // Applique au démarrage les migrations pas encore exécutées (idempotent)
        migrationsRun: true,
      }),
    }),

    AuthModule,
    DepensesModule,
    DemoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
