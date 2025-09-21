import Joi from "joi";
import { Request } from "express";
import { IRequestSchema } from "../middleware/schemaValidator";

export interface IDataPlanCreateRequest extends Request {
  body: {
    identifier: number;
    planName: string;
    description: string;
    planId: number;
    bandwidthLimit: number;
    timeLimit: number;
    renewalTime: number;
    status: "Active" | "Inactive";
    expiryDate: Date;
    tokenQuantity: number;
    tokenValue: number;
    maximumAdsPerDay: number;
    planType: string;
    validity: number;
    uot: string;
    priceInRupees: number;
    xiKasuTokens: number;
  };
}

export const dataPlanCreateSchema: IRequestSchema = {
  body: Joi.object().keys({
    planName: Joi.string().required().max(50).label("PlanName"),
    description: Joi.string().required().max(100).label("Description"),
    planId: Joi.number().required().max(50).label("PlanId"),
    bandwidthLimit: Joi.number().required().max(50).label("BandwidthLimit"),
    timeLimit: Joi.number().required().max(50).label("TimeLimit"),
    renewalTime: Joi.number().required().max(50).label("RenewalTime"),
    status: Joi.string()
      .valid("Active", "Inactive")
      .required()
      .max(50)
      .label("Status"),
    expiryDate: Joi.date().required().label("ExpiryDate"),
    tokenQuantity: Joi.number().required().label("TokenQuantity"),
    tokenValue: Joi.number().required().label("TokenValue"),
    maximumAdsPerDay: Joi.number().required().label("MaximumAdsPerDay"),
    planType: Joi.string().required().max(50).label("PlanType"),
    validity: Joi.number().required().label("Validity"),
    uot: Joi.string().required().max(50).label("UOT"),
    priceInRupees: Joi.number().required().label("PriceInRupees"), // Add More Validation
    xiKasuTokens: Joi.number().required().label("XiKasuTokens"),
  }),
};

export interface IDataPlanUpdateRequest extends Request {
  params: {
    identifier: number;
  };
  body: {
    planName?: string;
    description?: string;
    planId?: number;
    planType?: string;
    bandwidthLimit?: number;
    timeLimit?: number;
    renewalTime?: number;
    status?: "Active" | "Inactive";
    expiryDate?: Date;
    tokenQuantity?: number;
    tokenValue?: number;
    maximumAdsPerDay?: number;
    validity?: number;
    uot?: string;
    priceInRupees?: number;
    xiKasuTokens?: number;
  };
}

export const dataPlanUpdateSchema: IRequestSchema = {
  params: Joi.object().keys({
    identifier: Joi.number().required().max(50).label("Identifier"),
  }),
  body: Joi.object().keys({
    planName: Joi.string().max(50).label("PlanName"),
    description: Joi.string().max(100).label("Description"),
    planId: Joi.string().max(50).label("PlanId"),
    bandwidthLimit: Joi.string().max(50).label("BandwidthLimit"),
    timeLimit: Joi.string().max(50).label("TimeLimit"),
    renewalTime: Joi.string().max(50).label("RenewalTime"),
    status: Joi.string().valid("Active", "Inactive").label("Status"),
    expiryDate: Joi.date().label("ExpiryDate"),
    tokenQuantity: Joi.number().label("TokenQuantity"),
    tokenValue: Joi.number().label("TokenValue"),
    maximumAdsPerDay: Joi.number().label("MaximumAdsPerDay"),
    validity: Joi.number().label("Validity"),
    uot: Joi.string().max(50).label("UOT"),
    priceInRupees: Joi.number().label("PriceInRupees"), //Ask about Add More Validation
    xiKasuTokens: Joi.number().label("XiKasuTokens"),
  }),
};

export const getAllDataPlansSchema: IRequestSchema = {
  query: Joi.object().keys({
    userDeviceId: Joi.string()
      .regex(
        /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
      )
      .label("User Device Id"),
    planType: Joi.string().required().label("Plan Type"),
  }),
};

export interface IDataPlanGetRequest extends Request {
  params: {
    identifier: number;
  };
}

export const getDataPlansSchema: IRequestSchema = {
  params: Joi.object().keys({
    identifier: Joi.number().required().max(50).label("Identifier"),
  }),
};
