import Joi from "joi";
import { Request } from "express";
import { IRequestSchema } from "../middleware/schemaValidator";

export interface IProfileOtpCreateRequest extends Request {
  body: {
    userId?: string;
    mobileNumber?: string;
    deviceId: string;
    otp: number;
    createdOn: Date;
  };
}

export const profileOTPCreateSchema: IRequestSchema = {
  body: Joi.object().keys({
    userId: Joi.string().max(50).label("UserId"),
    mobileNumber: Joi.string().max(50).label("MobileNumber"),
    deviceId: Joi.string().max(50).required().label("DeviceId"),
    otp: Joi.number().required().label("OTP"),
    createdOn: Joi.date().required().label("UserId"),
  }),
};

export interface IPushNotificationMessageRequest {
  title: string;
  body: string;
  image?: string;
}
