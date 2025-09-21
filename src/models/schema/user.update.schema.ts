import Joi from "joi";
import { IRequestSchema } from "../../middleware/schemaValidator";

export const userUpdateSchema: IRequestSchema = {
  body: Joi.object()
    .keys({
      firstName: Joi.string().max(20).label("First Name"),
      lastName: Joi.string().max(20).label("Last Name"),
      name: Joi.string().optional().label("Name"),
      emailId: Joi.string()
        .email({ minDomainAtoms: 2 })
        .optional()
        .label("Email Id"),
      referralCode: Joi.string().optional().label("Referral Code"),
      userDeviceId: Joi.string()
        .regex(
          /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
        )
        .required()
        .label("User Device Id"),
    })
    .unknown(false),
};
