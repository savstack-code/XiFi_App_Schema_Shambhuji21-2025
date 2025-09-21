import Joi from "joi";
import { JoiErrors } from "../../../utils/joiErrors";

export const TokenPlanUpdateSchema = Joi.object()
  .keys({
    name: Joi.string()
      .optional()
      .label("Name")
      .error((errors) => JoiErrors(errors)),
    description: Joi.string()
      .optional()
      .label("Description")
      .error((errors) => JoiErrors(errors)),
    amount: Joi.number()
      .optional()
      .label("Amount")
      .greater(0)
      .less(2147483647)
      .error((errors) => JoiErrors(errors)),
    xiKasuTokens: Joi.number()
      .optional()
      .label("XiKasu Tokens")
      .greater(0)
      .less(2147483647)
      .error((errors) => JoiErrors(errors)),
    status: Joi.string()
      .optional()
      .label("Status")
      .error((errors) => JoiErrors(errors)),
    currency: Joi.string()
      .optional()
      .label("Currency")
      .valid(["INR"])
      .error((errors) => JoiErrors(errors)),
  })
  .unknown(false)
  .error((errors) => JoiErrors(errors));
