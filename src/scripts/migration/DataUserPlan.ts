import DataUserPlanModel from "../../database/mongodb/models/dataUserPlan.model";
import DataUserPlan from "../../shared/database/entities/DataUserPlan";
import { migrate } from "../util";

migrate(DataUserPlan, DataUserPlanModel)
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.log("error: ", err);
  });
