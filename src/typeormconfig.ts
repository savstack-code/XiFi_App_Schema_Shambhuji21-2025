/*
 --Install typeorm and ts-node globally
    npm i -g typeorm
    npm i -g ts-node
 -- Schema Sync for first time only
    npm run typeorm:cli -- schema:sync
 --Create migration file
    npm run typeorm:cli -- migration:create -n Add_New_Column_UserCode_In_User_Table
 --To run migration execute the following command
    npm run typeorm:cli -- migration:run
*/
import { ConnectionOptions } from "typeorm";
let dbType: any = process.env.DB_TYPE || "mysql";

const config: ConnectionOptions = {
  type: dbType,
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "ags@1",
  database: process.env.DB_NAME || "testnode",
  entities: ["src/shared/database/entities/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  cli: {
    migrationsDir: "src/migrations",
  },
};

export = config;
