import Joi from "joi";
import { JoiErrors } from "../../../utils/joiErrors";

export const GetActiveTokenPlansSchema = Joi.object().keys({
  userDeviceId: Joi.string()
    .regex(
      /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
    )
    .label("User Device Id")
    .error((errors) => JoiErrors(errors)),
});
