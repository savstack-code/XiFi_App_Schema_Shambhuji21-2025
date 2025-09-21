import { Request } from "express";
import Joi from "joi";
import { IRequestSchema } from "../../../middleware/schemaValidator";

export interface IDataUserCurrentSessionReq extends Request {
  query: {
    userDeviceId: string;
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
