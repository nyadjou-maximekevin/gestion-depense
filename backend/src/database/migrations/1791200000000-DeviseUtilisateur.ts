import { MigrationInterface, QueryRunner } from "typeorm";

/** Ajoute la devise de l'utilisateur. Les comptes existants passent en EUR (valeur par défaut). */
export class DeviseUtilisateur1791200000000 implements MigrationInterface {
    name = 'DeviseUtilisateur1791200000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "devise" character varying(3) NOT NULL DEFAULT 'EUR'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "devise"`);
    }

}
