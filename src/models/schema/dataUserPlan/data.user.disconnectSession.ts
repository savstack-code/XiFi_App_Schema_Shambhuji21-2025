import { Request } from "express";
import Joi from "joi";
import { IRequestSchema } from "../../../middleware/schemaValidator";

export interface IDataUserDisconnectSessionReq extends Request {
  query: {
    userDeviceId: string;
    pdoaId: string;
  };
}

export const dataUserDisconnectSessionSchema: IRequestSchema = {
  query: Joi.object().keys({
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
  }),
};
