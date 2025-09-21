import { Request } from "express";
import Joi from "joi";
import { IRequestSchema } from "../../middleware/schemaValidator";
import { mobileNumberJoi } from "./common.schema";

export interface IVerifyOTPReq extends Request {
  query: {
    mobileNumber: number;
    IMEI: string;
    countryCode?: string;
    otp: number;
  };
}

export const verifyOtpSchema: IRequestSchema = {
  query: Joi.object().keys({
    ...mobileNumberJoi,
    deviceId: Joi.string().required().label("Device Id"),
    otp: Joi.number().integer().min(100000).max(999999).required().label("OTP"),
  }),
};

export interface IVerifyOTPNewReq extends Request {
  query: {
    mobileNumber: number;
    IMEI: string;
    countryCode?: string;
    otp: number;
    OSType?: string;
    OSVersion?: string;
    deviceModel?: string;
    macAddr?: string;
  };
}
export const verifyOtpSchemaNew: IRequestSchema = {
  query: Joi.object().keys({
    ...mobileNumberJoi,
    IMEI: Joi.string().required().label("IMEI Number"),
    otp: Joi.number().integer().min(100000).max(999999).required().label("OTP"),
    OSType: Joi.string().max(40).optional().label("OS type"),
    OSVersion: Joi.string().max(40).optional().label("Os version"),
    deviceModel: Joi.string().max(100).optional().label("Device model"),
    macAddr: Joi.string()
      .max(50)
      .allow("")
      .optional()
      .label("MAC Address, Must pass if connecting through RailTel"),
  }),
};

export const verifyOtpRespSchema = Joi.object({
  "200": Joi.object({
    success: Joi.boolean().required(),
    result: Joi.object({
      message: Joi.string().required(),
      userDeviceId: Joi.string(),
    }),
    statusCode: Joi.string().valid("200").required(),
    errors: Joi.array().items(Joi.string()),
  }),
});
