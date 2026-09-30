import { environment } from '../../environments/environment';

/**
 * Adresse de l'API NestJS.
 * Angular remplace environment.ts par environment.development.ts en développement
 * (voir "fileReplacements" dans angular.json).
 */
export const API_URL = environment.apiUrl;
