import Joi from "joi";
import { JoiErrors } from "../../../utils/joiErrors";

export const ssidFilterSchema = Joi.object()
  .keys({
    status: Joi.string()
      .optional()
      .label("Status")
      .error((errors) => JoiErrors(errors)),
    ssid: Joi.string()
      .optional()
      .label("SSID")
      .error((errors) => JoiErrors(errors)),
    deviceId: Joi.string()
      .optional()
      .label("Device Id")
      .error((errors) => JoiErrors(errors)),
  })
  .unknown(false)
  .error((errors) => JoiErrors(errors));
