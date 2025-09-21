import { Request } from "express";
import Joi from "joi";
import { IRequestSchema } from "../../middleware/schemaValidator";
import { mobileNumberJoi } from "./common.schema";

export interface ISendOTPReq extends Request {
  query: {
    mobileNumber: number;
    IMEI: string;
    countryCode?: string;
  };
}
export const sendOtpSchema: IRequestSchema = {
  query: Joi.object().keys({
    IMEI: Joi.string().max(60).required().label("IMEI Number"),
    ...mobileNumberJoi,
  }),
};

export const sendOtpRespSchema = Joi.object({
  "200": Joi.object({
    success: Joi.boolean().required(),
    result: Joi.object({
      message: Joi.string().required(),
      newUser: Joi.boolean().required(),
      newDeviceId: Joi.boolean(),
    }),
    statusCode: Joi.string().valid("200").required(),
    errors: Joi.array().items(Joi.string()),
  }),
});
