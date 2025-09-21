import { Request } from "express";
import Joi from "joi";
import { IRequestSchema } from "../../middleware/schemaValidator";
export interface IUserCreateRequest {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  emailId: string;
  iMENo: string;
  version: string;
  playerId: string;
  userCode?: any;
  referralCode?: any;
  referralExpired?: any;
  countryCode?: string;
}

export const userCreateSchema: IRequestSchema = {
  body: Joi.object().keys({
    firstName: Joi.string()
      .min(3)
      .max(20)
      .not(Joi.number())
      .trim()
      .label("First Name")
      .required(),
    lastName: Joi.string().min(3).max(20).trim().label("Last Name"),
    name: Joi.string().label("Name"),
    mobileNumber: Joi.string()
      .min(6)
      .max(15)
      .regex(/[0-9]/)
      .required()
      .label("Mobile Number"),
    emailId: Joi.string()
      .email({ minDomainAtoms: 2 })
      .required()
      .label("Email Id"),
    iMENo: Joi.string().required().label("IMENo"),
    version: Joi.string().optional(),
    playerId: Joi.string().optional(),
    countryCode: Joi.string().label("Country Code").optional(),
    referralCode: Joi.string().optional().label("Referral Code"),
    otp: Joi.number().integer().min(100000).max(999999).label("OTP"),
  }),
};

export interface IUserCreateRequestNew extends Request {
  body: {
    firstName: string;
    lastName: string;
    mobileNumber: string;
    emailId?: string;
    deviceId: string;
    version: string;
    playerId: string;
    referralCode?: any;
    countryCode?: string;
  };
}

export const userCreateSchemaNew: IRequestSchema = {
  body: Joi.object().keys({
    firstName: Joi.string()
      .min(3)
      .max(20)
      .not(Joi.number())
      .trim()
      .label("First Name")
      .required(),
    lastName: Joi.string().min(3).max(20).trim().label("Last Name"),
    mobileNumber: Joi.string()
      .min(6)
      .max(15)
      .regex(/[0-9]/)
      .required()
      .label("Mobile Number"),
    emailId: Joi.string()
      .email({ minDomainAtoms: 2 })
      .allow("")
      .label("Email Id"),
    deviceId: Joi.string().required().label("device Id"),
    version: Joi.string().optional(),
    playerId: Joi.string().optional(),
    countryCode: Joi.string().label("Country Code").optional(),
    referralCode: Joi.string().optional().label("Referral Code"),
  }),
};
