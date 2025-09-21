import { dataUserPlanService } from "../../services/data.user.plan.service";
// import DataUserPlanCreateRequest from "../../models/dataUserPlan/data.user.plan.create.request";
import { IDataUserPlanCreateRequest } from "../../reqSchema/data.user.plan.create.schema";
// import DataUserPlanHistoryRequest from "../../models/dataUserPlan/data.user.plan.history.request";
import { IDataUserPlanHistoryRequest } from "../../reqSchema/data.user.plan.schema";
export const createDataUserPlan = async (
  request: IDataUserPlanCreateRequest
) => {
  const result = await dataUserPlanService.createDataUserPlan(request);
  return result;
};
export const activateDataUserPlan = async (
  pdoaId: string,
  planId: number,
  planType: string
) => {
  const result = await dataUserPlanService.activateDataUserPlan(
    pdoaId,
    planId,
    planType
  );
  return result;
};

export const getDataUserPlanHistory = async (
  query: IDataUserPlanHistoryRequest["query"]
) => {
  const result = await dataUserPlanService.getDatauserPlanHistory(query);
  return result;
};
