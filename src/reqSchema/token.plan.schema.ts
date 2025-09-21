import Joi from "joi";
import { Request } from "express";
import { IRequestSchema } from "../middleware/schemaValidator";

export interface ITokenPlanCreateRequest extends Request {
  body: {
    identifier: number;
    name: string;
    amount: number;
    xiKasuTokens: number;
    status: string;
    currency: string;
    description: string;
  };
}

export const tokenplanCreateSchema: IRequestSchema = {
  body: Joi.object().keys({
    // identifier: Joi.number().required().label("Identifier"),
    name: Joi.string().allow(null).optional().label("Name"),
    description: Joi.string().allow(null).optional().label("Description"),
    amount: Joi.number().required().label("Amount").greater(0).less(2147483647),
    xiKasuTokens: Joi.number()
      .required()
      .label("XiKasu Tokens")
      .greater(0)
      .less(2147483647),
    status: Joi.string().required().label("Status"),
    currency: Joi.string().required().label("Currency").valid(["INR"]),
  }),
};

// export const tokenPlanCreateSchema: IRequestSchema = {
//   body: Joi.object().keys({
//     identifier: Joi.number().required().label("Identifier"),
//     name: Joi.string().max(50).required().label("Name"),
//     amount: Joi.number().required().label("Amount"), //More Validation for decimal
//     xiKasuTokens: Joi.number().required().label("XiKasuTokens"),
//     status: Joi.string().max(50).required().label("Status"),
//     currency: Joi.string().max(50).required().label("Currency"),
//     description: Joi.string().max(100).required().label("Description"),
//   }),
// };

export interface ITokenPlanUpdateRequest extends Request {
  body: {
    identifier: number;
    name: string;
    amount: number;
    xiKasuTokens: number;
    status: string;
    currency: string;
    description: string;
  };
}

export const tokenPlanUpdateSchema: IRequestSchema = {
  params: Joi.object().keys({
    identifier: Joi.number().required().label("Identifier"),
  }),
  body: Joi.object().keys({
    name: Joi.string().optional().label("Name"),
    description: Joi.string().optional().label("Description"),
    amount: Joi.number().optional().label("Amount").greater(0).less(2147483647),
    xiKasuTokens: Joi.number()
      .optional()
      .label("XiKasu Tokens")
      .greater(0)
      .less(2147483647),
    status: Joi.string().optional().label("Status"),
    currency: Joi.string().optional().label("Currency").valid(["INR"]),
  }),
};

export const getActiveTokenPlansSchema: IRequestSchema = {
  query: Joi.object().keys({
    userDeviceId: Joi.string()
      .regex(
        /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
      )
      .label("User Device Id"),
  }),
};

export const getTokenPlansFilterSchema: IRequestSchema = {
  body: Joi.object().keys({
    name: Joi.string().optional().label("Name"),
    amount: Joi.number().optional().label("Amount").greater(0).less(2147483647),
    xiKasuTokens: Joi.number()
      .optional()
      .label("XiKasu Tokens")
      .greater(0)
      .less(2147483647),
    status: Joi.string().optional().label("Status"),
  }),
};

export interface ITokenplanGetRequest extends Request {
  params: {
    identifier: number;
  };
}

export const tokenplanGetSchema: IRequestSchema = {
  params: Joi.object().keys({
    identifier: Joi.number()
      .integer()
      .label("Identifier")
      .greater(0)
      .less(2147483647),
  }),
};

export const tokenplanIdentifierRangeSchema: IRequestSchema = {
  query: Joi.object().keys({
    identifier: Joi.number()
      .integer()
      .label("Identifier")
      .greater(0)
      .less(2147483647),
  }),
};
