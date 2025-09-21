import Joi from "joi";
import { JoiErrors } from "../../../utils/joiErrors";

export const ssidUpdateSchema = Joi.object()
  .keys({
    providerID: Joi.string()
      .required()
      .label("providerID")
      .error((errors) => JoiErrors(errors)),
    cpUrl: Joi.string()
      .required()
      .label("cPRUL")
      .error((errors) => JoiErrors(errors)),
    locationName: Joi.string()
      .required()
      .label("locationName")
      .error((errors) => JoiErrors(errors)),
    state: Joi.string()
      .required()
      .label("state")
      .error((errors) => JoiErrors(errors)),
    type: Joi.string()
      .required()
      .label("type")
      .error((errors) => JoiErrors(errors)),
    latitude: Joi.string()
      .required()
      .label("latitude")
      .error((errors) => JoiErrors(errors)),
    langitude: Joi.string()
      .required()
      .label("langitude")
      .error((errors) => JoiErrors(errors)),
    address: Joi.string()
      .required()
      .label("address")
      .error((errors) => JoiErrors(errors)),
    deviceId: Joi.string()
      .required()
      .label("deviceId")
      .error((errors) => JoiErrors(errors)),
    status: Joi.string()
      .required()
      .label("status")
      .error((errors) => JoiErrors(errors)),
    ssid: Joi.string()
      .required()
      .label("sSID")
      .error((errors) => JoiErrors(errors)),
    openBetween: Joi.string()
      .required()
      .label("openBetween")
      .error((errors) => JoiErrors(errors)),
    avgSpeed: Joi.number()
      .required()
      .allow(0)
      .integer()
      .label("avgSpeed")
      .error((errors) => JoiErrors(errors)),
    freeBand: Joi.number()
      .required()
      .allow(0)
      .integer()
      .label("freeBand")
      .error((errors) => JoiErrors(errors)),
    paymentModes: Joi.string()
      .required()
      .label("paymentModes")
      .error((errors) => JoiErrors(errors)),
    description: Joi.string()
      .required()
      .label("description")
      .error((errors) => JoiErrors(errors)),
    loginScheme: Joi.string()
      .required()
      .label("loginScheme")
      .error((errors) => JoiErrors(errors)),
  })
  .unknown(false)
  .error((errors) => JoiErrors(errors));
