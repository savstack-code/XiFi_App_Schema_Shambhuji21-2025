import PdoaConfigModel from "../../database/mongodb/models/pdoaConfig.model";
import PdoaConfig from "../../shared/database/entities/PdoaConfig";
import { migrate } from "../util";

migrate(PdoaConfig, PdoaConfigModel)
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.log("error: ", err);
  });
