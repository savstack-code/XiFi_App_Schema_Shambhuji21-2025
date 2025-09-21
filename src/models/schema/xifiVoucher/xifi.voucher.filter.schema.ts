import Joi from "joi";
import { JoiErrors } from "../../../utils/joiErrors";

export const xifiVoucherFilterSchema = Joi.object()
  .keys({
    code: Joi.string().allow("").optional().label("Code"),
    status: Joi.string().allow("").optional().label("Status"),
    expiryTime: Joi.string().allow("").optional().label("Expiry Time"),
  })
  .unknown(false)
  .error((errors) => JoiErrors(errors));
