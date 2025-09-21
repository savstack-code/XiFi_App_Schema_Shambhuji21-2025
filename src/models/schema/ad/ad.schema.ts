import Joi from "joi";
import { Request } from "express";
import { IRequestSchema } from "../../../middleware/schemaValidator";

export interface IAdRequest extends Request {
  query: {
    userDeviceId: string;
    planType: string;
  };
}

export const adSchema: IRequestSchema = {
  query: Joi.object().keys({
    userDeviceId: Joi.string()
      .regex(
        /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
      )
      .required()
      .label("User Device Id"),
    planType: Joi.string().required().label("Plan Type"),
  }),
};
