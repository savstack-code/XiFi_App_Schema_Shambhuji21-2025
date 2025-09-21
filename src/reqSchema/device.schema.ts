import Joi from "joi";
import { Request } from "express";
import { IRequestSchema } from "../middleware/schemaValidator";

export interface IUserDeviceRequest extends Request {
  body: {
    userId: string;
    deviceId: string;
    playerId?: string;
    status?: string;
    deviceType?: string;
    deviceToken?: string;
    createdOn?: Date;
    modifiedOn?: Date;
    createdBy?: string;
    modifiedBy?: string;
    pdoaId?: string;
    OSType?: string;
    OSVersion?: string;
    deviceModel?: string;
    lat?: number;
    lng?: number;
    locationUpdatedOn?: Date;
    macAddr?: string;
  };
}

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

export const activateInternetSchema: IRequestSchema = {
  query: Joi.object({
    userDeviceId: Joi.string()
      .regex(
        /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
      )
      .required()
      .label("User Device Id"),
  }),
};

export interface IActivateInternetReq extends Request {
  query: {
    userDeviceId: string;
  };
}
