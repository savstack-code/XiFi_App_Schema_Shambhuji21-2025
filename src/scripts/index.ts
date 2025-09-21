import dotenv from "dotenv";
dotenv.config();
import "../mongo.provider";

import logger from "../config/winston.logger";
logger.info("Running local script");

// import "./migration/Ad";
// import "./mixation/AppProviderConfig";
// import "./migration/APRequest";
// import "./migration/DataAccounting";
// import "./migration/DataPlan";
// import "./migration/DataSession";
// import "./migration/DataUserPlan";
// import "./migration/DataUserToken";
// import "./migration/DataUserTokenBalance";
// import "./migration/ObjectTypes";
// import "./migration/PaymentGatewayConfig";
// import "./migration/PaymentOrder";
// import "./migration/PdoaConfig";
// import "./migration/ProfileOTP";
// import "./migration/SMSError";
// import "./migration/ssid";
// import "./migration/TAB_PDOA";
// import "./migration/tokenPlan";
// import "./migration/user";
// import "./migration/userDevice";
// import "./migration/XiKasuConfig";
// import "./migration/XifiVoucher";

// import "./otherScripts/ssidUpdate";
import "./otherScripts/stateMapping";
