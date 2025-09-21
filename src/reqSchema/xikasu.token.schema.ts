import { Request } from "express";
import Joi from "joi";
import { IRequestSchema } from "../middleware/schemaValidator";

export interface IXiKasuTokenHistoryRequest extends Request {
  query: {
    userDeviceId: string;
    currentPage: number;
    pageSize: number;
  };
}

export interface IXiKasuTokenTransferRequest extends Request {
  body: {
    userDeviceId: string;
    receiverMobile: string;
    countryCode?: string;
    token: number;
  }
}

export interface IXiKasuTokenAssignRequest extends Request {
  body: {
    receiverMobile: string;
    countryCode?: string;
    token: number;
  }
}

export interface IXiKasuTokenSendRequest extends Request {
  body: {
    senderMobile: string;
    receiverMobile: string;
    sCountryCode?: string;
    rCountryCode?: string;
    token: number;
  }
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

export const xiKasuTokenTransferSchema: IRequestSchema = {
  body: Joi.object().keys({
    userDeviceId: Joi.string()
      .regex(
        /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
      )
      .required()
      .label("User Device Id"),
    receiverMobile: Joi.number()
      .integer()
      .min(100000)
      .max(9999999999)
      .required().label("receiverMobile"),
    countryCode: Joi.string()
      .max(8)
      .regex(/^[\+ \-0-9]+$/)
      .label("Country Code")
      .optional(),
    token: Joi.number().optional().label("token").greater(0).less(2147483647),

  })
};

export const xiKasuTokenTransferResp = Joi.object({
  "200": Joi.object({
    success: Joi.boolean().required(),
    result: Joi.object({
      userId: Joi.string().required(),
      transUserId: Joi.string().required(),
      token: Joi.number().required(),
      balance: Joi.number().required(),
    }),
    statusCode: Joi.string().valid("200").required(),
    errors: Joi.array().items(Joi.string()),
  }),
});

export const xiKasuTokenAssignSchema: IRequestSchema = {
  body: Joi.object().keys({
    receiverMobile: Joi.number()
      .integer()
      .min(100000)
      .max(9999999999)
      .required().label("receiverMobile"),
    countryCode: Joi.string()
      .max(8)
      .regex(/^[\+ \-0-9]+$/)
      .label("Country Code")
      .optional(),
    token: Joi.number().optional().label("token").greater(0).less(2147483647),

  }),
};

export const xiKasuTokenAssignResp = Joi.object({
  "200": Joi.object({
    success: Joi.boolean().required(),
    result: Joi.object({
      userId: Joi.string().required(),
      token: Joi.number().required(),
    }),
    statusCode: Joi.string().valid("200").required(),
    errors: Joi.array().items(Joi.string()),
  }),
});


export const xiKasuTokenSendSchema: IRequestSchema = {
  body: Joi.object().keys({
    senderMobile: Joi.number()
      .integer()
      .min(100000)
      .max(9999999999)
      .required().label("senderMobile"),
    sCountryCode: Joi.string()
      .max(8)
      .regex(/^[\+ \-0-9]+$/)
      .label("sender Country Code")
      .optional(),
    receiverMobile: Joi.number()
      .integer()
      .min(100000)
      .max(9999999999)
      .required().label("receiverMobile"),
    rCountryCode: Joi.string()
      .max(8)
      .regex(/^[\+ \-0-9]+$/)
      .label("receiver Country Code")
      .optional(),
    token: Joi.number().optional().label("token").greater(0).less(2147483647),

  })
};

export const xiKasuTokenSendResp = Joi.object({
  "200": Joi.object({
    success: Joi.boolean().required(),
    result: Joi.object({
      userId: Joi.string().required(),
      transUserId: Joi.string().required(),
      token: Joi.number().required(),
      balance: Joi.number().required(),
    }),
    statusCode: Joi.string().valid("200").required(),
    errors: Joi.array().items(Joi.string()),
  }),
});