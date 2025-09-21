import XifiVoucherModel from "../../database/mongodb/models/xifiVoucher.model";
import XifiVoucher from "../../shared/database/entities/XifiVoucher";
import { migrate } from "../util";

migrate(XifiVoucher, XifiVoucherModel)
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.log("error: ", err);
  });
