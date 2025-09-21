import { Request } from "express";
import Joi from "joi";
import { IRequestSchema } from "../../middleware/schemaValidator";
export interface IDeleteUserReq extends Request {
  query: { mobileNumber: string; countryCode?: string };
}
export const deleteUserSchema: IRequestSchema = {
  query: Joi.object().keys({
    mobileNumber: Joi.string().required().label("Mobile Number"),
    countryCode: Joi.string()
      .default("")
      .allow("")
      .label("Country Code")
      .optional(),
  }),
};

export const deleteUserRespSchema = Joi.object({
  "200": Joi.object({
    success: Joi.boolean().required(),
    result: Joi.object({
      message: Joi.string().required(),
    }),
    statusCode: Joi.string().valid("200").required(),
    errors: Joi.array().items(Joi.string()),
  }),
});
