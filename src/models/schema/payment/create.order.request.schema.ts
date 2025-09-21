import Joi from "joi";
import { JoiErrors } from "../../../utils/joiErrors";

export const createOrderRequestSchema = Joi.object().keys({
  tokenPlanId: Joi.number()
    .required()
    .label("Token Plan Id")
    .greater(0)
    .less(2147483647)
    .error((errors) => JoiErrors(errors)),
  userDeviceId: Joi.string()
    .regex(
      /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
    )
    .required()
    .label("User Device Id")
    .error((errors) => JoiErrors(errors)),
});
