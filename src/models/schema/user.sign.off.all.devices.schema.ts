import Joi from "joi";
import { IRequestSchema } from "../../middleware/schemaValidator";
import { JoiErrors } from "../../utils/joiErrors";

export const signOffAllDevicesSchema: IRequestSchema = {
  query: Joi.object().keys({
    mobileNumber: Joi.number()
      .integer()
      .min(1000000000)
      .max(9999999999)
      .required()
      .label("Mobile Number")
      .error((errors) => JoiErrors(errors)),
  }),
};
