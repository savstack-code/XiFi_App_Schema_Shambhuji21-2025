import accountRoutes from "./account/routes";
import registrationRoutes from "./registration/routes";
import AdRoutes from "./ad/routes";
import DataPlanRoutes from "./dataplan/routes";
import DataUserPlanRoutes from "./datauserplan/routes";
import XifiVouchers from "./xifivoucher/routes";
import PaymentRoutes from "./payment/routes";
import TokenPlanRoutes from "./tokenplan/routes";
import XiKasuTokenRoutes from "./xikasutoken/routes";
import DataUsageRoutes from "./datausage/routes";
import SsidRoutes from "./ssid/routes";
import PdoaRoutes from "./pdoa/routes";
import CronRoutes from "./cron/routes";
import ProviderRoutes from "./provider/routes";
import { IRouteInfo } from "../middleware/schemaValidator";

const routes: IRouteInfo[] = [
  ...registrationRoutes,
  ...AdRoutes,
  ...DataPlanRoutes,
  ...DataUserPlanRoutes,
  ...XifiVouchers,
  ...PaymentRoutes,
  ...TokenPlanRoutes,
  ...XiKasuTokenRoutes,
  ...DataUsageRoutes,
  ...SsidRoutes,
  ...PdoaRoutes,
  ...accountRoutes,
  ...CronRoutes,
  ...ProviderRoutes,
];

export default routes;
