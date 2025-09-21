import Joi from "joi";
import { IRequestSchema } from "../../middleware/schemaValidator";

export const getProfileSchema: IRequestSchema = {
  query: Joi.object().keys({
    userDeviceId: Joi.string()
      .regex(
        /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
      )
      .required()
      .label("User Device Id"),
  }),
};

export const getProfileResp = Joi.object({
  "200": Joi.object({
    success: Joi.boolean().required(),
    result: Joi.object({
      name: Joi.string(),
      firstName: Joi.string(),
      lastName: Joi.string(),
      mobileNumber: Joi.string(),
      email: Joi.string(),
      userCode: Joi.string(),
      referralExpired: Joi.boolean(),
      xifiTokens: Joi.number(),
      allDevices: Joi.array().items(
        Joi.object({
          identifier: Joi.string(),
          userId: Joi.string(),
          deviceId: Joi.string(),
          playerId: Joi.string(),
          status: Joi.string(),
          deviceType: Joi.string(),
          deviceToken: Joi.string(),
          createdOn: Joi.string(),
          modifiedOn: Joi.string(),
          createdBy: Joi.string(),
          modifiedBy: Joi.string(),
          pdoaId: Joi.string(),
          OSType: Joi.string(),
          OSVersion: Joi.string(),
          deviceModel: Joi.string(),
        })
      ),
    }),
    statusCode: Joi.string().valid("200").required(),
    errors: Joi.array().items(Joi.string()),
  }),
});
