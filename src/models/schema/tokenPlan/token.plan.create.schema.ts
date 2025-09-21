import Joi from "joi";
import { JoiErrors } from "../../../utils/joiErrors";

export const TokenplanCreateSchema = Joi.object()
  .keys({
    name: Joi.string()
      .allow(null)
      .optional()
      .label("Name")
      .error((errors) => JoiErrors(errors)),
    description: Joi.string()
      .allow(null)
      .optional()
      .label("Description")
      .error((errors) => JoiErrors(errors)),
    amount: Joi.number()
      .required()
      .label("Amount")
      .greater(0)
      .less(2147483647)
      .error((errors) => JoiErrors(errors)),
    xiKasuTokens: Joi.number()
      .required()
      .label("XiKasu Tokens")
      .greater(0)
      .less(2147483647)
      .error((errors) => JoiErrors(errors)),
    status: Joi.string()
      .required()
      .label("Status")
      .error((errors) => JoiErrors(errors)),
    currency: Joi.string()
      .required()
      .label("Currency")
      .valid(["INR"])
      .error((errors) => JoiErrors(errors)),
  })
  .unknown(false)
  .error((errors) => JoiErrors(errors));
