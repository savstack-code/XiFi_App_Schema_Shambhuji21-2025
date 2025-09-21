import { Request } from "express";
import Joi from "joi";
import { IRequestSchema } from "../../../middleware/schemaValidator";

export interface INewAPReq extends Request {
  body: {
    latitude: number;
    longitude: number;
    deviceId: string;
    message: string;
  };
}

export const newAPReqSchema: IRequestSchema = {
  body: Joi.object({
    latitude: Joi.number().min(-90).max(90).required().label("Latitude"),
    longitude: Joi.number().min(-180).max(180).required().label("Longitude"),
    deviceId: Joi.string().required().label("Device Id"),
    message: Joi.string().max(255).required().label("Message"),
  }),
};
