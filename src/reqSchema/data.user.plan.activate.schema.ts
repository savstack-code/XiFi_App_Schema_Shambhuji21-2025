import { Request } from "express";
import Joi from "joi";
import { IRequestSchema } from "../middleware/schemaValidator";

export interface IDataUserPlanActivateReq extends Request {
  query: {
    pdoaId: string;
    userDeviceId: string;
    planId?: number;
    planType?: string;
  };
}

export const dataUserPlanActivateSchema: IRequestSchema = {
  query: Joi.object()
    .keys({
      pdoaId: Joi.string()
        .optional()
        .regex(
          /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
        )
        .optional()
        .label("pdoa Id"),
      userDeviceId: Joi.string()
        .regex(
          /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
        )
        .required()
        .label("User Device Id"),
      planId: Joi.string().optional().label("Plan Id"),
      planType: Joi.string().optional().label("Plan Type"),
    })
    .xor("planId", "planType"),
};
