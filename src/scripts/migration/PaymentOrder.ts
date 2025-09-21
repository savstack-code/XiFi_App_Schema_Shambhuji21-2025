import PaymentOrderModel from "../../database/mongodb/models/paymentOrder.model";
import PaymentOrder from "../../shared/database/entities/PaymentOrder";
import { migrate } from "../util";

migrate(PaymentOrder, PaymentOrderModel)
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.log("error: ", err);
  });
