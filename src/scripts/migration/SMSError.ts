import SMSErrorModel from "../../database/mongodb/models/smsError.model";
import SMSError from "../../shared/database/entities/SMSError";
import { migrate } from "../util";

migrate(SMSError, SMSErrorModel)
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.log("error: ", err);
  });
