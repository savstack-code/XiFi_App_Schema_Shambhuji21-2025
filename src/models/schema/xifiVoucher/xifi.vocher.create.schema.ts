import Joi from "joi";
import { JoiErrors } from "../../../utils/joiErrors";

export const XifiVoucherCreateSchema = Joi.object()
  .keys({
    code: Joi.string()
      .required()
      .label("Code")
      .error((errors) => JoiErrors(errors)),
    description: Joi.string()
      .required()
      .label("Description")
      .error((errors) => JoiErrors(errors)),
    status: Joi.string()
      .required()
      .label("Status")
      .error((errors) => JoiErrors(errors)),
    expiryTime: Joi.string()
      .required()
      .label("Expiry Time")
      .error((errors) => JoiErrors(errors)),
    allowCount: Joi.number()
      .integer()
      .positive()
      .required()
      .label("Allow Count")
      .error((errors) => JoiErrors(errors)),
    xiKasuTokens: Joi.number()
      .integer()
      .positive()
      .required()
      .label("XiKasu Tokens")
      .error((errors) => JoiErrors(errors)),
  })
  .unknown(false)
  .error((errors) => JoiErrors(errors));
