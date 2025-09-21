import AppProviderConfigModel from "../../database/mongodb/models/appProviderConfig.model";
import AppProviderConfig from "../../shared/database/entities/AppProviderConfig";
import { migrate } from "../util";

migrate(AppProviderConfig, AppProviderConfigModel)
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.log("error: ", err);
  });
