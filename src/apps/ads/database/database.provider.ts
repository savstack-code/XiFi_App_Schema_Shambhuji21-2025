import "reflect-metadata";
import dotenv from "dotenv";
import { createConnection, Connection, ConnectionOptions } from "typeorm";
import Ad from "../../../shared/database/entities/Ad";
import UserDevice from "../../../shared/database/entities/UserDevice";
import DataAccounting from "../../../shared/database/entities/DataAccounting";
import DataUserPlan from "../../../shared/database/entities/DataUserPlan";
import DataPlan from "../../../shared/database/entities/DataPlan";
import DataUserTokenBalance from "../../../shared/database/entities/DataUserTokenBalance";
import DataUserToken from "../../../shared/database/entities/DataUserToken";
import AdStore from "../../../shared/database/entities/AdStore";
import User from "../../../shared/database/entities/User";
import SMSError from "../../../shared/database/entities/SMSError";

dotenv.config();

export class DatabaseProvider {
  private static connection: Connection;

  public static async getConnection(): Promise<Connection> {
    if (DatabaseProvider.connection) {
      return DatabaseProvider.connection;
    }
    let dbType: any = process.env.DB_TYPE || "mysql";
    let connectionOpts: ConnectionOptions = {
      name: "xifi_ads",
      type: dbType,
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 1433,
      username: process.env.DB_USERNAME || "sa",
      password: process.env.DB_PASSWORD || "ags@1",
      database: process.env.DB_NAME || "testnode",
      entities: [
        Ad,
        UserDevice,
        DataUserPlan,
        DataAccounting,
        User,
        DataPlan,
        DataUserToken,
        DataUserTokenBalance,
        AdStore,
        SMSError,
      ],
      extra: {
        trustedConnection: true,
      },
      synchronize: false,
    };
    DatabaseProvider.connection = await createConnection(connectionOpts);
    return DatabaseProvider.connection;
  }
}
