import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1666844240021 implements MigrationInterface {
    name = 'Initial1666844240021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "correct_guess" ("collectionId" integer NOT NULL, "guesserId" integer NOT NULL, "collectionEntryId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fffd8b3117b71631ebc5d501620" PRIMARY KEY ("collectionId", "guesserId", "collectionEntryId"))`);
        await queryRunner.query(`CREATE TABLE "like" ("userId" integer NOT NULL, "collectionId" integer NOT NULL, CONSTRAINT "PK_4410a4a431f0bf2a2c4093bc921" PRIMARY KEY ("userId", "collectionId"))`);
        await queryRunner.query(`CREATE TABLE "saved_collection" ("userId" integer NOT NULL, "collectionId" integer NOT NULL, CONSTRAINT "PK_e13e51a98e2d34860991201a71c" PRIMARY KEY ("userId", "collectionId"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "avatar" character varying, "bio" character varying, "letterboxd_url" character varying, "twitter_url" character varying, "website_url" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "appeal" ("id" SERIAL NOT NULL, "state" character varying NOT NULL, "collectionId" integer NOT NULL, "externalId" integer NOT NULL, "externalTitle" character varying NOT NULL, "externalImagePath" character varying NOT NULL, "externalReleaseDate" character varying NOT NULL, "appealById" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f644a99d2dfcff9facb08bd1697" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d224f19e7bf2aa72cf7dd2c7f8" ON "appeal" ("state") `);
        await queryRunner.query(`CREATE TABLE "collection" ("id" SERIAL NOT NULL, "reference" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying(255), "points" integer NOT NULL DEFAULT '0', "creatorId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ad3f485bbc99d875491f44d7c85" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fc8e5cca280a8543074f644c88" ON "collection" ("reference") `);
        await queryRunner.query(`CREATE INDEX "IDX_a228386bbbd59fa3ab75483b95" ON "collection" ("creatorId") `);
        await queryRunner.query(`CREATE TABLE "collection_entry" ("id" SERIAL NOT NULL, "collectionId" integer NOT NULL, "externalId" integer NOT NULL, "externalTitle" character varying NOT NULL, "externalImagePath" character varying NOT NULL, "externalReleaseDate" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a8d0a8055a02726d9a17918a24c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "leaderboard" ("userId" integer NOT NULL, "stat" integer NOT NULL, "type" character varying NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bb31526cc23e63a0199d0f6f25b" PRIMARY KEY ("userId", "stat", "type"))`);
        await queryRunner.query(`ALTER TABLE "correct_guess" ADD CONSTRAINT "FK_80b78ed7964b2f577557af9f66c" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "correct_guess" ADD CONSTRAINT "FK_9194450a47242ccb4735227c355" FOREIGN KEY ("guesserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "correct_guess" ADD CONSTRAINT "FK_2869c04489cc6faf5425d1180ca" FOREIGN KEY ("collectionEntryId") REFERENCES "collection_entry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_e8fb739f08d47955a39850fac23" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_d9fcd028d670c3631ab9ebd74fb" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "saved_collection" ADD CONSTRAINT "FK_561173669ff5cd376417140adce" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "saved_collection" ADD CONSTRAINT "FK_e90e9dc6c502fa539a222ce9eb8" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appeal" ADD CONSTRAINT "FK_2604f68a0c4f507ca6c2ebc23a9" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appeal" ADD CONSTRAINT "FK_56859cad7e923a2b3053897491f" FOREIGN KEY ("appealById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "collection" ADD CONSTRAINT "FK_a228386bbbd59fa3ab75483b953" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "collection_entry" ADD CONSTRAINT "FK_4f24fd39e03d1586c1ddd7dee0e" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "leaderboard" ADD CONSTRAINT "FK_a77cb06009c75ceb055b231e120" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "leaderboard" DROP CONSTRAINT "FK_a77cb06009c75ceb055b231e120"`);
        await queryRunner.query(`ALTER TABLE "collection_entry" DROP CONSTRAINT "FK_4f24fd39e03d1586c1ddd7dee0e"`);
        await queryRunner.query(`ALTER TABLE "collection" DROP CONSTRAINT "FK_a228386bbbd59fa3ab75483b953"`);
        await queryRunner.query(`ALTER TABLE "appeal" DROP CONSTRAINT "FK_56859cad7e923a2b3053897491f"`);
        await queryRunner.query(`ALTER TABLE "appeal" DROP CONSTRAINT "FK_2604f68a0c4f507ca6c2ebc23a9"`);
        await queryRunner.query(`ALTER TABLE "saved_collection" DROP CONSTRAINT "FK_e90e9dc6c502fa539a222ce9eb8"`);
        await queryRunner.query(`ALTER TABLE "saved_collection" DROP CONSTRAINT "FK_561173669ff5cd376417140adce"`);
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_d9fcd028d670c3631ab9ebd74fb"`);
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_e8fb739f08d47955a39850fac23"`);
        await queryRunner.query(`ALTER TABLE "correct_guess" DROP CONSTRAINT "FK_2869c04489cc6faf5425d1180ca"`);
        await queryRunner.query(`ALTER TABLE "correct_guess" DROP CONSTRAINT "FK_9194450a47242ccb4735227c355"`);
        await queryRunner.query(`ALTER TABLE "correct_guess" DROP CONSTRAINT "FK_80b78ed7964b2f577557af9f66c"`);
        await queryRunner.query(`DROP TABLE "leaderboard"`);
        await queryRunner.query(`DROP TABLE "collection_entry"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a228386bbbd59fa3ab75483b95"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fc8e5cca280a8543074f644c88"`);
        await queryRunner.query(`DROP TABLE "collection"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d224f19e7bf2aa72cf7dd2c7f8"`);
        await queryRunner.query(`DROP TABLE "appeal"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "saved_collection"`);
        await queryRunner.query(`DROP TABLE "like"`);
        await queryRunner.query(`DROP TABLE "correct_guess"`);
    }

}
