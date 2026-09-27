/** Contenu du token JWT (et de request.user une fois connecté) */
export interface JwtPayload {
  /** "subject" : l'id de l'utilisateur */
  sub: string;
  email: string;
}
