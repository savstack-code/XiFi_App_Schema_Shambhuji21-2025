import AdStoreModel from "../../database/mongodb/models/adStore.model";
import AdStore from "../../shared/database/entities/AdStore";
import { migrate } from "../util";

migrate(AdStore, AdStoreModel)
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.log("error: ", err);
  });
