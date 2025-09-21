import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSPROCSPGENERATEKEY1566395427148 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE OR REPLACE PROCEDURE SP_GENERATE_KEY (
          ObjectType VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_bin'
        )
         BEGIN
           UPDATE ObjectTypes SET FollowupObject=FollowupObject+1 where ObjectTypesID=ObjectType;
            SELECT CONCAT(ObjectTypesID,LPAD(FollowupObject+1, LENGTH(MaxLimit), '0')) UserId from ObjectTypes  where ObjectTypesID= ObjectType;
         END;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
