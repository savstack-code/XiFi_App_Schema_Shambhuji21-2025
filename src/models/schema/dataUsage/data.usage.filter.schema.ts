import Joi from "joi";
import { IRequestSchema } from "../../../middleware/schemaValidator";

export interface IDataUsageHistoryRequest {
  userDeviceId: string;
  userPlanId?: number;
  planType?: string;
  currentPage: number;
  pageSize: number;
}

export const dataUsageFilterSchema: IRequestSchema = {
  query: Joi.object()
    .keys({
      userDeviceId: Joi.string()
        .regex(
          /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
        )
        .required()
        .label("User Device Id"),
      userPlanId: Joi.number()
        .integer()
        .optional()
        .label("User Plan Id")
        .greater(0)
        .less(2147483647),
      planType: Joi.string().optional().label("Plan Type"),
      currentPage: Joi.number()
        .integer()
        .required()
        .label("Current Page")
        .greater(0),
      pageSize: Joi.number().integer().required().label("Page Size").greater(0),
    })
    .xor("userPlanId", "planType")
    .unknown(false),
};

export const dataUsesFilterResp = Joi.object({
  "200": Joi.object({
    success: Joi.boolean().required(),
    result: Joi.array().items(
      Joi.object({
        identifier: Joi.number(),
        userName: Joi.string(),
        startTime: Joi.string(),
        sessionTime: Joi.string(),
        dataUsed: Joi.string(),
        locationId: Joi.string(),
        planId: Joi.string(),
        userPlanId: Joi.number(),
        status: Joi.string(),
        xiKasuTokens: Joi.number(),
        xiKasuTokenBalance: Joi.number(),
        category: Joi.string(),
        createdOn: Joi.string(),
        planName: Joi.string(),
        dataUserTokenId: Joi.string(),
        tokenSource: Joi.string(),
        referenceId: Joi.string(),
        ssid: Joi.object({
          sSID: Joi.string(),
          jsp: Joi.string(),
          rate: Joi.number(),
          latitude: Joi.string(),
          langitude: Joi.string(),
          deviceUsed: Joi.string(),
        }),
        pdoaName: Joi.string(),
      })
    ),
    statusCode: Joi.string().valid("200").required(),
    errors: Joi.array().items(Joi.string()),
  }),
});
