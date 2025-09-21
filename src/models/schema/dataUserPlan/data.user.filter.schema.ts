import Joi from "joi";
import { IRequestSchema } from "../../../middleware/schemaValidator";

export const dataUserPlanFilterSchema: IRequestSchema = {
  body: Joi.object().keys({
    userDeviceId: Joi.string()
      .regex(
        /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
      )
      .required()
      .label("User Device Id"),
    currentPage: Joi.number()
      .integer()
      .required()
      .label("Current Page")
      .greater(0),
    pageSize: Joi.number().integer().required().label("Page Size").greater(0),
  }),
};
