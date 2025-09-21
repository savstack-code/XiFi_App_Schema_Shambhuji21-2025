import APRequestModel from "../../database/mongodb/models/aPRequest.model";
import APRequest from "../../shared/database/entities/APRequest";
import { migrate } from "../util";

migrate(APRequest, APRequestModel)
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.log("error: ", err);
  });
