import Joi from "joi";
import { Request } from "express";
import { IRequestSchema } from "../../../middleware/schemaValidator";
export default interface ISsidCreateRequest extends Request {
  body: {
    providerID: string;
    locationName: string;
    state: string;
    type: string;
    cpUrl: string;
    latitude: string;
    langitude: string;
    address: string;
    deviceId: string;
    status: "Active" | "InActive";
    ssid: string;
    openBetween: string;
    avgSpeed: number;
    freeBand: number;
    paymentModes: string;
    description: string;
    loginScheme: string;
  };
}

export const ssidCreateSchema: IRequestSchema = {
  body: Joi.object()
    .keys({
      providerID: Joi.string().required().label("providerID"),
      cpUrl: Joi.string().required().label("cPRUL"),
      locationName: Joi.string().required().label("locationName"),
      state: Joi.string().required().label("state"),
      type: Joi.string().required().label("type"),
      latitude: Joi.string().required().label("latitude"),
      langitude: Joi.string().required().label("langitude"),
      address: Joi.string().required().label("address"),
      deviceId: Joi.string().required().label("deviceId"),
      status: Joi.string()
        .valid("Active", "InActive")
        .required()
        .label("status"),
      ssid: Joi.string().required().label("sSID"),
      openBetween: Joi.string().required().label("openBetween"),
      avgSpeed: Joi.number().required().allow(0).integer().label("avgSpeed"),
      freeBand: Joi.number().required().allow(0).integer().label("freeBand"),
      paymentModes: Joi.string().required().label("paymentModes"),
      description: Joi.string().required().label("description"),
      loginScheme: Joi.string().required().label("loginScheme"),
    })
    .unknown(false),
};
