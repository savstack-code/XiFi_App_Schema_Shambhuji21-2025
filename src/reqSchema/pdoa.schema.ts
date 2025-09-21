import Joi from "joi";
import { Request } from "express";
import { IRequestSchema } from "../middleware/schemaValidator";
export interface IPdoaCreateRequest extends Request {
  body: {
    id?: number;
    pdoaId: string;
    pdoaPublicKey: string;
    updateDataPolicyUrl: string;
    apUrl?: string;
    keyExp: number;
    pdoaName: string;
    imageUrl: string;
    stopUserSessionUrl: string;
    provider?: "own" | "cDot";
  };
}

export const poaCreateSchema: IRequestSchema = {
  body: Joi.object().keys({
    pdoaPublicKey: Joi.string().max(3000).required().label("PdoaPublicKey"),
    updateDataPolicyUrl: Joi.string()
      .max(250)
      .required()
      .label("UpdateDataPolicyUrl"),
    keyExp: Joi.number().max(8).required().label("KeyExp"),
    pdoaName: Joi.string().max(100).required().label("PdoaName"),
    imageUrl: Joi.string().max(2000).required().label("ImageUrl"),
    stopUserSessionUrl: Joi.string()
      .max(2000)
      .required()
      .label("stopUserSessionUrl"),
    apUrl: Joi.string().max(2000).label("apUrl"),
    provider: Joi.string().valid("own", "cDot").allow("").default("own"),
  }),
};

export interface IPdoaUpdateRequest extends Request {
  body: {
    pdoaPublicKey: string;
    updateDataPolicyUrl: string;
    keyExp: string;
    modifiedBy: string;
    pdoaName: string;
    imageUrl: string;
    stopUserSessionUrl: string;
  };
}
