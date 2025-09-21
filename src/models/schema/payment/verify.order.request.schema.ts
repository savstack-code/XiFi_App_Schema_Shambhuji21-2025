import Joi from "joi";
import { JoiErrors } from "../../../utils/joiErrors";

export const verifyPaymentOrderRequestSchema = Joi.object().keys({
  userDeviceId: Joi.string()
    .regex(
      /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
    )
    .required()
    .label("User Device Id")
    .error((errors) => JoiErrors(errors)),
  razorpayOrderId: Joi.string()
    .required()
    .label("Razorpay Order Id")
    .error((errors) => JoiErrors(errors)),
  razorpayPaymentId: Joi.string()
    .required()
    .label("Razorpay Payment Id")
    .error((errors) => JoiErrors(errors)),
  razorpaySignature: Joi.string()
    .required()
    .label("Razorpay Signature")
    .error((errors) => JoiErrors(errors)),
});
