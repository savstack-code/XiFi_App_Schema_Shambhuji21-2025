import Joi from "joi";
import { Request } from "express";
import { IRequestSchema } from "../middleware/schemaValidator";
export interface ISsidCreateRequest extends Request {
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
    provider?: "own" | "cDot";
  };
}

export const ssidCreateSchema: IRequestSchema = {
  body: Joi.object()
    .keys({
      providerID: Joi.string().required().label("providerID"),
      cpUrl: Joi.string().required().label("cPRUL"),
      locationName: Joi.string().label("locationName"),
      state: Joi.string().required().label("state"),
      type: Joi.string().required().label("type"),
      latitude: Joi.string().required().label("latitude"),
      langitude: Joi.string().required().label("langitude"),
      address: Joi.string().label("address"),
      deviceId: Joi.string().required().label("deviceId"),
      status: Joi.string()
        .valid("Active", "InActive")
        .required()
        .label("status"),
      ssid: Joi.string().required().label("sSID"),
      openBetween: Joi.string().label("openBetween"),
      avgSpeed: Joi.number().allow(0).integer().label("avgSpeed"),
      freeBand: Joi.number().allow(0).integer().label("freeBand"),
      paymentModes: Joi.string().required().label("paymentModes"),
      description: Joi.string().required().label("description"),
      loginScheme: Joi.string().required().label("loginScheme"),
      provider: Joi.string().valid("own", "cDot").allow("").default("own"),
    })
    .unknown(false),
};

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

export interface ISsidUpdateRequest {
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
}

export const getSsidsSchema: IRequestSchema = {
  query: Joi.object().keys({
    userDeviceId: Joi.string()
      .regex(
        /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
      )
      .required()
      .label("User Device Id"),
    location: Joi.string()
      .regex(/^[A-Za-z]+$/)
      .allow("")
      .label("Location"),
  }),
};

export interface INearBySSIDs extends Request {
  query: {
    lat: number;
    lng: number;
    page: number;
  };
}

export const nearBySSIDs: IRequestSchema = {
  query: Joi.object({
    lat: Joi.number()
      .min(-90)
      .max(90)
      .required()
      .description(`Min -90, max 90`),
    lng: Joi.number()
      .min(-180)
      .max(180)
      .required()
      .description(`Min -180, max: 180`),
    page: Joi.number().required().min(1).description(`Min: 1`),
  }),
};


export interface CityListSchema extends Request {
  query: {
    city?: string;
  },
  params:{
    identifier:string;
  };
}

export const cityRequest: IRequestSchema = {
  query: Joi.object({
    city: Joi.string().allow("")
  }),
  params: Joi.object().keys({
    identifier: Joi.string()
      .label("SSID State ID"),
  })
};



export interface StateRequest extends Request {
  query: {
    state?: string;
  };
}

export const stateRequest: IRequestSchema = {
  query: Joi.object({
    state: Joi.string().allow("")
  }),
};