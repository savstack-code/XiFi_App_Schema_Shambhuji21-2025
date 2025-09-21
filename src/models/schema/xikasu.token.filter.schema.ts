import { Request } from "express";
import Joi from "joi";
import { IRequestSchema } from "../../middleware/schemaValidator";
export interface IXiKasuTokenHistoryRequest extends Request {
  query: {
    userDeviceId: string;
    currentPage: number;
    pageSize: number;
  };
}

export const xiKasuTokenFilterSchema: IRequestSchema = {
  query: Joi.object({
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

export const xiKasuTokenFilterResp = Joi.object({
  "200": Joi.object({
    success: Joi.boolean().required(),
    result: Joi.object({
      userId: Joi.string().required(),
      tokenBalance: Joi.number().required(),
      tokenHistory: Joi.array().items(
        Joi.object({
          identifier: Joi.number().required(),
          tokens: Joi.number().required(),
          balance: Joi.number().required(),
          transactionType: Joi.string().valid("Dr", "Cr"),
          referenceNo: Joi.string(),
          status: Joi.string(),
          source: Joi.string(),
          createdOn: Joi.date(),
          adId: Joi.string(),
          voucherId: Joi.string(),
          userPlanId: Joi.string(),
          dataAccountingId: Joi.string(),
          referrerId: Joi.string(),
          refereeId: Joi.string(),
        })
      ),
    }),
    statusCode: Joi.string().valid("200").required(),
    errors: Joi.array().items(Joi.string()),
  }),
});
