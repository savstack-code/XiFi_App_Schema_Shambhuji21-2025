import DataPlanInfoModel from "./data.plan.info.model";
import DataActivePlanModel from "./data.active.plan.model";

export default class DataPlanModel {
  activePlan?: DataActivePlanModel;
  plans?: DataPlanInfoModel[];
}
