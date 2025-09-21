import "reflect-metadata";
import { createConnection, Connection, ConnectionOptions } from "typeorm";

import PdoaConfig from "../shared/database/entities/PdoaConfig";
import Ad from "../shared/database/entities/Ad";
import AdStore from "../shared/database/entities/AdStore";
import AppProviderConfig from "../shared/database/entities/AppProviderConfig";
import UserDevice from "../shared/database/entities/UserDevice";
import User from "../shared/database/entities/User";
import ProfileOtp from "../shared/database/entities/ProfileOTP";
import * as dotenv from "dotenv";
import SSID from "../shared/database/entities/SSID";
import PDOA from "../shared/database/entities/PDOA";
import DataUserTokenBalance from "../shared/database/entities/DataUserTokenBalance";
import DataPlan from "../shared/database/entities/DataPlan";
import DataUserPlan from "../shared/database/entities/DataUserPlan";
import DataUserToken from "../shared/database/entities/DataUserToken";
import PaymentGatewayConfig from "../shared/database/entities/PaymentGatewayConfig";
import PaymentOrder from "../shared/database/entities/PaymentOrder";
import ProfileOTP from "../shared/database/entities/ProfileOTP";
import XifiVoucher from "../shared/database/entities/XifiVoucher";
import TokenPlan from "../shared/database/entities/TokenPlan";
import DataAccounting from "../shared/database/entities/DataAccounting";
import ObjectTypes from "../shared/database/entities/ObjectTypes";
import XiKasuConfig from "../shared/database/entities/XiKasuConfig";
import DataSession from "../shared/database/entities/DataSession";
import SMSError from "../shared/database/entities/SMSError";
import APRequest from "../shared/database/entities/APRequest";

dotenv.config();

export class DatabaseProvider {
  private static connection: Connection;

  public static async getConnection(): Promise<Connection> {
    if (DatabaseProvider.connection) {
      return DatabaseProvider.connection;
    }
    let dbType: any = process.env.DB_TYPE || "mysql";
    let connectionOpts: ConnectionOptions = {
      type: "mssql",
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 1433,
      username: process.env.DB_USERNAME || "sa",
      password: process.env.DB_PASSWORD || "ags@1",
      database: process.env.DB_NAME || "testnode",
      entities: [
        AdStore,
        Ad,
        PdoaConfig,
        AppProviderConfig,
        User,
        UserDevice,
        ProfileOtp,
        SSID,
        PDOA,
        DataPlan,
        DataUserPlan,
        DataUserToken,
        DataUserTokenBalance,
        PaymentGatewayConfig,
        PaymentOrder,
        ProfileOTP,
        XifiVoucher,
        TokenPlan,
        DataAccounting,
        ObjectTypes,
        XiKasuConfig,
        DataSession,
        SMSError,
        APRequest,
      ],
      extra: {
        trustedConnection: false,
      },
      synchronize: false,
    };
    DatabaseProvider.connection = await createConnection(connectionOpts);
    return DatabaseProvider.connection;
  }
}
