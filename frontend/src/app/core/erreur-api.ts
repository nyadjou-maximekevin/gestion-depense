import { HttpErrorResponse } from '@angular/common/http';

/**
 * Transforme une erreur HTTP en message lisible.
 * NestJS renvoie { message: string } ou { message: string[] } (erreurs de validation).
 */
export function messageErreur(erreur: unknown): string {
  if (erreur instanceof HttpErrorResponse) {
    if (erreur.status === 0) return "Impossible de joindre le serveur. L'API est-elle démarrée ?";

    const message = erreur.error?.message;
    if (Array.isArray(message)) return message.join('\n');
    if (typeof message === 'string') return message;
  }
  return 'Une erreur inattendue est survenue.';
}
