import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHouseTable1696784561041 implements MigrationInterface {
    name = 'AddHouseTable1696784561041'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "house" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" integer NOT NULL, "currency" character varying NOT NULL DEFAULT 'NGN', "location" character varying NOT NULL, "numberOfRooms" integer NOT NULL, "landlordId" uuid NOT NULL, "dateJoined" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_8c9220195fd0a289745855fe908" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "house" ADD CONSTRAINT "FK_8859e6d8e1b44129b6709c81169" FOREIGN KEY ("landlordId") REFERENCES "landlord"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "house" DROP CONSTRAINT "FK_8859e6d8e1b44129b6709c81169"`);
        await queryRunner.query(`DROP TABLE "house"`);
    }

}
