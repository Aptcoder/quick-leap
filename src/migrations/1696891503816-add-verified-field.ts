import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVerifiedField1696891503816 implements MigrationInterface {
    name = 'AddVerifiedField1696891503816'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "verified" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "verified"`);
    }

}
