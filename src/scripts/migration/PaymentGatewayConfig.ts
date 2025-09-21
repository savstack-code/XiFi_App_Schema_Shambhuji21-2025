import PaymentGatewayConfigModel from "../../database/mongodb/models/paymentGatewayConfig.model";
import PaymentGatewayConfig from "../../shared/database/entities/PaymentGatewayConfig";
import { migrate } from "../util";

migrate(PaymentGatewayConfig, PaymentGatewayConfigModel)
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.log("error: ", err);
  });
