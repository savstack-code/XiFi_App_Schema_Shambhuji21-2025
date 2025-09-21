import DataUserTokenModel from "../../database/mongodb/models/dataUserToken.model";
import DataUserToken from "../../shared/database/entities/DataUserToken";
import { migrate } from "../util";

migrate(DataUserToken, DataUserTokenModel)
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.log("error: ", err);
  });
