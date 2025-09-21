import DataPlanModel from "../../database/mongodb/models/dataPlan.model";
import DataPlan from "../../shared/database/entities/DataPlan";
import { migrate } from "../util";

migrate(DataPlan, DataPlanModel)
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.log("error: ", err);
  });
