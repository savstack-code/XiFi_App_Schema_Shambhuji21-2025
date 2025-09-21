import Joi from "joi";

export const mobileNumberJoi = {
  mobileNumber: Joi.number()
    .integer()
    .min(100000)
    .max(9999999999)
    .required()
    .label("Mobile Number"),
  countryCode: Joi.string()
    .max(8)
    .regex(/^[\+ \-0-9]+$/)
    .label("Country Code")
    .optional(),
};
