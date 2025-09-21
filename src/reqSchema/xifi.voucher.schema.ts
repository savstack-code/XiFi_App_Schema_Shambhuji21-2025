import Joi from "joi";
import { Request } from "express";
import { IRequestSchema } from "../middleware/schemaValidator";

export interface IXifiVoucherCreateRequest extends Request {
  body: {
    identifier: number;
    code: string;
    description: string;
    status: string;
    xiKasuTokens: number;
    expiryTime: Date;
    allowCount: number;
    redeemCount: number;
  };
}

export const xifiVoucherCreateSchema: IRequestSchema = {
  body: Joi.object().keys({
    code: Joi.string().max(50).required().label("Code"),
    description: Joi.string().max(100).required().label("Description"),
    status: Joi.string().max(50).required().label("Status"),
    xiKasuTokens: Joi.number().required().label("XiKasuTokens"),
    expiryTime: Joi.date().required().label("ExpiryTime"),
    allowCount: Joi.number().required().label("AllowCount"),
    redeemCount: Joi.number().required().label("RedeemCount"),
  }),
};

export interface IXifiVoucherUpdateRequest extends Request {
  params: {
    identifier: number;
  };
  body: {
    description: string;
    status: string;
    expiryTime: string;
    allowCount: number;
  };
}

export const xifiVoucherUpdateSchema: IRequestSchema = {
  params: Joi.object().keys({
    identifier: Joi.number().required().label("identifier"),
  }),
  body: Joi.object().keys({
    description: Joi.string().allow("").optional().label("Description"),
    status: Joi.string().allow("").optional().label("Status"),
    expiryTime: Joi.string().allow("").optional().label("Expiry Time"),
    allowCount: Joi.number()
      .integer()
      .allow("")
      .optional()
      .label("Allow Count"),
  }),
};

// export const XifiVoucherCreateSchema = Joi.object().keys({
//   code: Joi.string().required().label("Code"),
//   description: Joi.string().required().label("Description"),
//   status: Joi.string().required().label("Status"),
//   expiryTime: Joi.string().required().label("Expiry Time"),
//   allowCount: Joi.number().integer().positive().required().label("Allow Count"),
//   xiKasuTokens: Joi.number()
//     .integer()
//     .positive()
//     .required()
//     .label("XiKasu Tokens"),
// });

export const xifiVoucherFilterSchema: IRequestSchema = {
  query: Joi.object().keys({
    code: Joi.string().allow("").optional().label("Code"),
    status: Joi.string().allow("").optional().label("Status"),
    expiryTime: Joi.string().allow("").optional().label("Expiry Time"),
  }),
};

export const xifiVoucherRedeemSchema: IRequestSchema = {
  query: Joi.object().keys({
    userDeviceId: Joi.string()
      .regex(
        /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
      )
      .required()
      .label("User Device Id"),
    code: Joi.string().required().label("Code"),
  }),
};

export interface IXifiVoucherGetRequest extends Request {
  params: {
    identifier: number;
  };
}
export const xifiVoucherGetSchema: IRequestSchema = {
  params: Joi.object().keys({
    identifier: Joi.number().required().label("Identifier"),
  }),
};
