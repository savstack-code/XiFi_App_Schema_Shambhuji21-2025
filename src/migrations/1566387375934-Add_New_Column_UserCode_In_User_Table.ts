import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddNewColumnUserCodeInUserTable1566387375934 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE User ADD UserCode varchar(50) DEFAULT NULL;`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE User DROP COLUMN IF EXISTS UserCode;`);
    }

}
