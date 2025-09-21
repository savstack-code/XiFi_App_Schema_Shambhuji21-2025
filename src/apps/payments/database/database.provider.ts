import "reflect-metadata";
import dotenv from "dotenv";
import { createConnection, Connection, ConnectionOptions } from "typeorm";
import PaymentOrder from "../../../shared/database/entities/PaymentOrder";
import PaymentGatewayConfig from "../../../shared/database/entities/PaymentGatewayConfig";
import UserDevice from "../../../shared/database/entities/UserDevice";
import DataUserTokenBalance from "../../../shared/database/entities/DataUserTokenBalance";
import DataUserToken from "../../../shared/database/entities/DataUserToken";
import User from "../../../shared/database/entities/User";
import TokenPlan from "../../../shared/database/entities/TokenPlan";
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
      name: "xifi_payments",
      type: dbType,
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 1433,
      username: process.env.DB_USERNAME || "sa",
      password: process.env.DB_PASSWORD || "ags@1",
      database: process.env.DB_NAME || "testnode",
      entities: [
        PaymentOrder,
        PaymentGatewayConfig,
        UserDevice,
        User,
        DataUserToken,
        DataUserTokenBalance,
        TokenPlan,
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
