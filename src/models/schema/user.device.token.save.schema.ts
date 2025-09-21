import Joi from "joi";
import { Request } from "express";
import { IRequestSchema } from "../../middleware/schemaValidator";

export const userDeviceTokenSaveSchema: IRequestSchema = {
  query: Joi.object().keys({
    userDeviceId: Joi.string()
      .regex(
        /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
      )
      .required()
      .label("User Device Id"),
    deviceType: Joi.string().required().label("Device Type"),
    deviceToken: Joi.string().required().label("Device Token"),
  }),
};

export interface IUpdateLocationReq extends Request {
  body: {
    userDeviceId: string;
    lat: number;
    lng: number;
  };
}

export const updateLocationSchema: IRequestSchema = {
  body: Joi.object({
    userDeviceId: Joi.string()
      .regex(
        /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
      )
      .required()
      .label("User Device Id"),
    lat: Joi.number().min(-90).max(90).required().label("Current Latitude"),
    lng: Joi.number().min(-180).max(180).required().label("Current Longitude"),
  }),
};

export const updateLocationResp = Joi.object({
  "200": Joi.object({
    success: Joi.boolean().required(),
    result: Joi.object({
      disconnect: Joi.boolean(),
    }),
    statusCode: Joi.string().valid("200").required(),
    errors: Joi.array().items(Joi.string()),
  }),
});
