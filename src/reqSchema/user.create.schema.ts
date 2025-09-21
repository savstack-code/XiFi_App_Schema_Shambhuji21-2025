import Joi from "joi";
import { Request } from "express";
import { IRequestSchema } from "../middleware/schemaValidator";

export interface IUserCreateRequest extends Request {
  body: {
    firstName: string;
    lastName: string;
    mobileNumber: string;
    emailId?: string;
    // iMENo: string;
    version: string;
    playerId: string;
    userCode?: any;
    referralCode?: any;
    referralExpired?: any;
    countryCode?: string;
  };
}

export const userCreateSchema: IRequestSchema = {
  body: Joi.object().keys({
    firstName: Joi.string().max(50).required().label("FirstName"),
    lastName: Joi.string().max(50).label("LastName"),
    mobileNumber: Joi.string().max(50).required().label("MobileNumber"),
    emailId: Joi.string().email().label("EmailId"),
    //iMENo: Joi.string().required().label("IMENo"),
    version: Joi.string().max(50).required().label("First"),
    playerId: Joi.string().max(50).required().label("First"),
    userCode: Joi.any().label("UserCode"),
    referralCode: Joi.any().label("ReferralCode"), // ask about max limit in string and number
    referralExpired: Joi.boolean().label("ReferralExpired"),
    countryCode: Joi.string().max(50).label("CountryCode"), //Ask about country Code not in DB
  }),
};

export interface IUserUpdateRequest {
  firstName?: string;
  lastName?: string;
  emailId?: string;
  userDeviceId: string;
  referralCode?: any;
}

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

export interface IProfileOtpCreateRequest {
  userId?: string;
  mobileNumber?: string;
  deviceId: string;
  otp: number;
  createdOn: Date;
}

export interface IDataUserTokenBalanceRequest {
  userId: string;
  tokens: number;
  status: "Active" | "Inactive";
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
