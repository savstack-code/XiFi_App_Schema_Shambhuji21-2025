import Joi from "joi";
import { Request } from "express";
import { IRequestSchema } from "../middleware/schemaValidator";

export interface IDataUserPlanRequest extends Request {
  body: {
    // id: number;
    userId: string;
    planId: number;
    status: string;
    planExpiryDate: Date;
    remainingData: number;
    bandwidthLimit: number;
  };
}

export const dataUserPlanSchema: IRequestSchema = {
  body: Joi.object().keys({
    userId: Joi.string().required().max(50).label("UserId"),
    planId: Joi.number().required().max(50).label("PlanId"),
    status: Joi.string().required().max(50).label("Status"),
    planExpiryDate: Joi.date().required().label("PlanExpiryDate"),
    remainingData: Joi.number().required().max(50).label("RemainingData"),
    bandwidthLimit: Joi.number().required().max(50).label("BandwidthLimit"),
  }),
};

export interface IDataUserTokenBalanceRequest extends Request {
  body: {
    userId: string;
    tokens: number;
    status: string;
  };
}

export interface IDataUserTokenRequest extends Request {
  body: {
    userId: string;
    tokens: number;
    balance?: any;
    transactionType: string;
    referenceNo: string;
    status: string;
    source: string;
  };
}

export interface IDataUserPolicyRequest extends Request {
  body: {
    userId: string;
    userName: string;
    xiKasuTokens: number;
    planId?: number;
    planType?: string;
    time: number;
    bandwidth: number;
    mobileNumber: string;
  };
}

export const dataUserCurrentSessionSchema: IRequestSchema = {
  query: Joi.object().keys({
    userDeviceId: Joi.string()
      .regex(
        /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
      )
      .required()
      .label("User Device Id"),
  }),
};

export const getActiveSessionResp = Joi.object({
  "200": Joi.object({
    success: Joi.boolean().required(),
    result: Joi.object({
      sessionRunning: Joi.boolean().required(),
      userDevice: Joi.object({
        identifier: Joi.string(),
        userId: Joi.string(),
        deviceId: Joi.string(),
        playerId: Joi.string(),
        status: Joi.string(),
        deviceType: Joi.string(),
        deviceToken: Joi.string(),
        createdOn: Joi.string(),
        modifiedOn: Joi.string(),
        createdBy: Joi.string(),
        modifiedBy: Joi.string(),
        pdoaId: Joi.string(),
        OSType: Joi.string(),
        OSVersion: Joi.string(),
        deviceModel: Joi.string(),
      }),
    }),
    statusCode: Joi.string().valid("200").required(),
    errors: Joi.array().items(Joi.string()),
  }),
});

export interface IDataUserCurrentSessionReq extends Request {
  query: {
    userDeviceId: string;
  };
}

export interface IDataUserPlanHistoryRequest extends Request {
  query: {
    userDeviceId: string;
    currentPage: number;
    pageSize: number;
  };
}

export const dataUserPlanBuySchema: IRequestSchema = {
  body: Joi.object().keys({
    userDeviceId: Joi.string()
      .regex(
        /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
      )
      .required()
      .label("User Device Id"),
    planId: Joi.number().required().label("Plan Id"),
  }),
};

export const dataUserPlanFilterSchema: IRequestSchema = {
  query: Joi.object().keys({
    userDeviceId: Joi.string()
      .regex(
        /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
      )
      .required()
      .label("User Device Id"),
    currentPage: Joi.number()
      .integer()
      .required()
      .label("Current Page")
      .greater(0),
    pageSize: Joi.number().integer().required().label("Page Size").greater(0),
  }),
};

export interface IDataUserDisconnectSessionReq extends Request {
  query: {
    userDeviceId: string;
    pdoaId: string;
  };
}

export const dataUserDisconnectSessionSchema: IRequestSchema = {
  query: Joi.object().keys({
    pdoaId: Joi.string()
      .optional()
      .regex(
        /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
      )
      .optional()
      .label("pdoa Id"),
    userDeviceId: Joi.string()
      .regex(
        /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
      )
      .required()
      .label("User Device Id"),
  }),
};

export const activateInternetResp = Joi.object({
  "200": Joi.object({
    success: Joi.boolean().required(),
    result: Joi.object({
      pkgno: Joi.number(),
      password: Joi.string(),
      orgno: Joi.number(),
      actno: Joi.number(),
      domno: Joi.number(),
      subsNo: Joi.number(),
      username: Joi.string(),
    }),
    statusCode: Joi.string().valid("200").required(),
    errors: Joi.array().items(Joi.string()),
  }),
});
