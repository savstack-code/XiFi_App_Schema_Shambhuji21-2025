import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class DropColumnUserCodeInUserTable1566394853248 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        // await queryRunner.query(`ALTER TABLE User DROP COLUMN IF EXISTS UserCode;`);
        await queryRunner.addColumn("User", new TableColumn({
            name: "UserCode",
            type: "varchar"
        }));

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
