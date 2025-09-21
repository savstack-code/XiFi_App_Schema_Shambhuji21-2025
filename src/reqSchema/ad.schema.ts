import Joi from "joi";
import { Request } from "express";
import { IRequestSchema } from "../middleware/schemaValidator";

export interface IAdCreateRequest extends Request {
  body: {
    identifier?: string;
    skipTime: number;
    url: string;
    planId: number;
    userId: string;
    status: string;
    pdoaId?: string;
    adViewedOn?: Date;
  };
}

export interface IAdRequest extends Request {
  query: {
    userDeviceId: string;
    planType: string;
  };
}

export const adSchema: IRequestSchema = {
  query: Joi.object().keys({
    userDeviceId: Joi.string()
      .regex(
        /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
      )
      .required()
      .label("User Device Id"),
    planType: Joi.string().required().label("Plan Type"),
  }),
};

export const adCompleteNotificationSchema: IRequestSchema = {
  query: Joi.object().keys({
    userDeviceId: Joi.string()
      .regex(
        /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
      )
      .required()
      .label("User Device Id"),
    planType: Joi.string().required().label("Plan Type"),
    adId: Joi.string().max(200).required().label("Ad Id"),
  }),
};

// export interface IAdModelRequest {
//   identifier?: string;
//   url: string;
//   skipTime: string;
//   planId: string;
//   userId: string;
//   status: string;
//   pdoaId: string;
// }
