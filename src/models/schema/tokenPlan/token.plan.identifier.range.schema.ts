import Joi from "joi";
import { JoiErrors } from "../../../utils/joiErrors";

export const TokenplanIdentifierRangeSchema = Joi.object()
  .keys({
    identifier: Joi.number()
      .integer()
      .label("Identifier")
      .greater(0)
      .less(2147483647)
      .error((errors) => JoiErrors(errors)),
  })
  .unknown(false)
  .error((errors) => JoiErrors(errors));
