import { tokenPlanService } from "../../services/token.plan.service";
// import TokenPlanCreateRequest from "../../models/request/tokenplan/token.plan.create.request";
// import TokenPlanUpdateRequest from "../../models/request/tokenplan/token.plan.update.request";
import {
  ITokenPlanUpdateRequest,
  ITokenPlanCreateRequest,
  ITokenplanGetRequest,
} from "../../reqSchema/token.plan.schema";

export const createDataPlan = async (
  request: ITokenPlanCreateRequest["body"]
) => {
  const result = await tokenPlanService.createDataPlan(request);
  return result;
};

export const updateDataPlan = async (
  identifier: ITokenPlanUpdateRequest["params"],
  request: ITokenPlanUpdateRequest["body"]
) => {
  const result = await tokenPlanService.updateDataPlan(identifier, request);
  return result;
};

export const getTokenPlanByIdentifier = async (
  identifier: ITokenplanGetRequest["params"]
) => {
  const result = await tokenPlanService.getTokenPlanByIdentifier(identifier);
  return result;
};

export const getTokenPlans = async (identifier: any) => {
  const result = await tokenPlanService.getTokenPlans(identifier);
  return result;
};

export const deleteTokenPlan = async (
  identifier: ITokenplanGetRequest["params"]
) => {
  const result = await tokenPlanService.deleteTokenPlan(identifier);
  return result;
};

export const getActivePlans = async (query: any) => {
  const result = await tokenPlanService.getActivePlans(query);
  return result;
};
