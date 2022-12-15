import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGuessModePlayed1670987524569 implements MigrationInterface {
    name = 'CreateGuessModePlayed1670987524569'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "guess_mode_played" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "modeId" integer NOT NULL, "optionId" integer NOT NULL, "success" boolean NOT NULL, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6d2d79648b13fd0ff0598f5eef5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "guess_mode_played" ADD CONSTRAINT "FK_78d2f7b8faa2f4c0ca9f46b5fc2" FOREIGN KEY ("modeId") REFERENCES "guess_mode_collection_entry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "guess_mode_played" ADD CONSTRAINT "FK_3cb38df801b1f92a91f9c10d364" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "guess_mode_played" DROP CONSTRAINT "FK_3cb38df801b1f92a91f9c10d364"`);
        await queryRunner.query(`ALTER TABLE "guess_mode_played" DROP CONSTRAINT "FK_78d2f7b8faa2f4c0ca9f46b5fc2"`);
        await queryRunner.query(`DROP TABLE "guess_mode_played"`);
    }

}
