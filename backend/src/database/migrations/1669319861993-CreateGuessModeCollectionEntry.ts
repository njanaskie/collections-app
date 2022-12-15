import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGuessModeCollectionEntry1669319861993
  implements MigrationInterface
{
  name = "CreateGuessModeCollectionEntry1669319861993";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "guess_mode_collection_entry" ("id" SERIAL NOT NULL, "collectionEntryId" integer NOT NULL, "correctCollectionId" integer NOT NULL, "firstIncorrectCollectionId" integer NOT NULL, "secondIncorrectCollectionId" integer NOT NULL, "thirdIncorrectCollectionId" integer NOT NULL, "optionsOrder" integer array NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c7f78c4dd4f348443cedd318370" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "guess_mode_collection_entry" ADD CONSTRAINT "FK_4ae880d55228ac279cb2158a109" FOREIGN KEY ("collectionEntryId") REFERENCES "collection_entry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "guess_mode_collection_entry" ADD CONSTRAINT "FK_4b0ccc40d3a77c99863ff903f86" FOREIGN KEY ("correctCollectionId") REFERENCES "collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "guess_mode_collection_entry" ADD CONSTRAINT "FK_27b755b0a0968b1e80d7e04439e" FOREIGN KEY ("firstIncorrectCollectionId") REFERENCES "collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "guess_mode_collection_entry" ADD CONSTRAINT "FK_e172af5ff0de3b31c15d3925174" FOREIGN KEY ("secondIncorrectCollectionId") REFERENCES "collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "guess_mode_collection_entry" ADD CONSTRAINT "FK_8842f7de3996bcfda4264b1c61d" FOREIGN KEY ("thirdIncorrectCollectionId") REFERENCES "collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "guess_mode_collection_entry" DROP CONSTRAINT "FK_8842f7de3996bcfda4264b1c61d"`
    );
    await queryRunner.query(
      `ALTER TABLE "guess_mode_collection_entry" DROP CONSTRAINT "FK_e172af5ff0de3b31c15d3925174"`
    );
    await queryRunner.query(
      `ALTER TABLE "guess_mode_collection_entry" DROP CONSTRAINT "FK_27b755b0a0968b1e80d7e04439e"`
    );
    await queryRunner.query(
      `ALTER TABLE "guess_mode_collection_entry" DROP CONSTRAINT "FK_4b0ccc40d3a77c99863ff903f86"`
    );
    await queryRunner.query(
      `ALTER TABLE "guess_mode_collection_entry" DROP CONSTRAINT "FK_4ae880d55228ac279cb2158a109"`
    );
    await queryRunner.query(`DROP TABLE "guess_mode_collection_entry"`);
  }
}
