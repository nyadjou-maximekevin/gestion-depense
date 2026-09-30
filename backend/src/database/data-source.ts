import { DataSource, DataSourceOptions } from 'typeorm';
import { Depense } from '../depenses/depense.entity.js';
import { User } from '../users/user.entity.js';

// Dossier des migrations compilées (dist/database/migrations) ; slashes "/" pour que le glob marche sous Windows
const dossierMigrations = `${import.meta.dirname.replace(/\\/g, '/')}/migrations/*.js`;

/**
 * Configuration PostgreSQL partagée par l'application (app.module) et la CLI TypeORM.
 * synchronize est désactivé : le schéma évolue uniquement par des migrations versionnées.
 */
export function optionsBaseDeDonnees(url: string, searchPath?: string): DataSourceOptions {
  return {
    type: 'postgres',
    // Le pooler Neon refuse le paramètre search_path : dans ce cas on passe par la connexion directe
    url: searchPath ? url.replace('-pooler.', '.') : url,
    ssl: true,
    entities: [User, Depense],
    migrations: [dossierMigrations],
    synchronize: false,
    // Permet de travailler dans un autre schéma PostgreSQL (utilisé pour tester les migrations à vide)
    ...(searchPath ? { extra: { options: `-c search_path=${searchPath}` } } : {}),
  };
}

/** Utilisé par la CLI : npm run migration:generate / migration:run */
export default new DataSource(
  optionsBaseDeDonnees(process.env.DATABASE_URL ?? '', process.env.DB_SEARCH_PATH),
);
