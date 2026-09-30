import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1790790300585 implements MigrationInterface {
    name = 'Initial1790790300585'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // uuid_generate_v4() (valeur par défaut des id) vient de cette extension
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "nom" character varying NOT NULL, "motDePasseHash" character varying NOT NULL, "creeLe" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "depenses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "montant" numeric(12,2) NOT NULL, "categorie" character varying(40) NOT NULL, "description" character varying(255) NOT NULL DEFAULT '', "date" date NOT NULL, "userId" uuid NOT NULL, "creeLe" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "modifieLe" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_aff8a5d136d64b19661ecd962eb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6c836321993038deebd2e781b7" ON "depenses"  ("userId", "date") `);
        await queryRunner.query(`ALTER TABLE "depenses" ADD CONSTRAINT "FK_751fdafcdf72325d512ab7ca2d8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "depenses" DROP CONSTRAINT "FK_751fdafcdf72325d512ab7ca2d8"`);
        await queryRunner.query(`DROP INDEX "IDX_6c836321993038deebd2e781b7"`);
        await queryRunner.query(`DROP TABLE "depenses"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
