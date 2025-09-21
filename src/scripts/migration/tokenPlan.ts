import TokenPlanModel from "../../database/mongodb/models/tokenPlan.model";
import TokenPlan from "../../shared/database/entities/TokenPlan";
import { migrate } from "../util";

migrate(TokenPlan, TokenPlanModel)
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.log("error: ", err);
  });
