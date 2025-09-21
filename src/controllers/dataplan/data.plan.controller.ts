import { dataPlanService } from "../../services/data.plan.service";
// import DataPlanCreateRequest from "../../models/request/data.plan.create.request";
// import DataPlanUpdateRequest from '../../models/request/data.plan.update.request';
import {
  IDataPlanCreateRequest,
  IDataPlanUpdateRequest,
  IDataPlanGetRequest,
} from "../../reqSchema/data.plan.schema";

export const createDataPlan = async (
  request: IDataPlanCreateRequest["body"]
) => {
  const result = await dataPlanService.createDataPlan(request);
  return result;
};

export const updateDataPlan = async (
  identifier: IDataPlanUpdateRequest["params"],
  request: IDataPlanUpdateRequest["body"]
) => {
  const result = await dataPlanService.updateDataPlan(identifier, request);
  return result;
};

export const deleteDataPlan = async (
  identifier: IDataPlanGetRequest["params"]
) => {
  const result = await dataPlanService.deleteDataPlan(identifier);
  return result;
};

export const getDataPlanByIdentifier = async (
  identifier: IDataPlanGetRequest["params"]
) => {
  const result = await dataPlanService.getDataPlanByIdentifier(identifier);
  return result;
};

export const getDataPlans = async (query: any) => {
  const result = await dataPlanService.getDataPlans(query);
  return result;
};
