import DataAccountingModel from "../../database/mongodb/models/dataAccounting.model";
import DataAccounting from "../../shared/database/entities/DataAccounting";
import { migrate } from "../util";

migrate(DataAccounting, DataAccountingModel)
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.log("error: ", err);
  });
