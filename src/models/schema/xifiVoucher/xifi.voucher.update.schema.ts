import Joi from "joi";
import { JoiErrors } from "../../../utils/joiErrors";

export const XifiVoucherUpdateSchema = Joi.object()
  .keys({
    description: Joi.string()
      .allow("")
      .optional()
      .label("Description")
      .error((errors) => JoiErrors(errors)),
    status: Joi.string()
      .allow("")
      .optional()
      .label("Status")
      .error((errors) => JoiErrors(errors)),
    expiryTime: Joi.string()
      .allow("")
      .optional()
      .label("Expiry Time")
      .error((errors) => JoiErrors(errors)),
    allowCount: Joi.number()
      .integer()
      .allow("")
      .optional()
      .label("Allow Count")
      .error((errors) => JoiErrors(errors)),
  })
  .unknown(false)
  .error((errors) => JoiErrors(errors));
