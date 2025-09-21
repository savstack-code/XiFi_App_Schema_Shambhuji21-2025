import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import _ from "lodash";
import { ServiceResponse } from "../models/response/ServiceResponse";
import { getSsidsSchema } from "../models/schema/get.ssids.schema";
import { getAdSchema } from "../models/schema/get.ad.schema";
import { AdCompleteNotificationSchema } from "../models/schema/ad.complete.notification.scheme";
import { GetDataPlansSchema } from "../models/schema/get.data.plans.schema";
import { xifiVoucherFilterSchema } from "../models/schema/xifiVoucher/xifi.voucher.filter.schema";
import { XifiVoucherCreateSchema } from "../models/schema/xifiVoucher/xifi.vocher.create.schema";
import { XifiVoucherUpdateSchema } from "../models/schema/xifiVoucher/xifi.voucher.update.schema";
import { XifiVoucherRedeemSchema } from "../models/schema/xifiVoucher/xifi.voucher.redeem.schema";
import { DataplanCreateSchema } from "../models/schema/dataPlan/data.plan.create.schema";
import { DataPlanUpdateSchema } from "../models/schema/dataPlan/data.plan.update.schema";
import { createOrderRequestSchema } from "../models/schema/payment/create.order.request.schema";
import { getPaymentOrderRequestSchema } from "../models/schema/payment/get.payment.order..request.schema";
import { historyPaymentOrderRequestSchema } from "../models/schema/payment/history.payment.order.request.schema";
import { TokenplanCreateSchema } from "../models/schema/tokenPlan/token.plan.create.schema";
import { TokenPlanUpdateSchema } from "../models/schema/tokenPlan/token.plan.update.schema";
import { GetActiveTokenPlansSchema } from "../models/schema/tokenPlan/get.active.token.plans.schema";
import { GetTokenPlansFilterSchema } from "../models/schema/tokenPlan/get.token.plan.schema";
import { verifyPaymentOrderRequestSchema } from "../models/schema/payment/verify.order.request.schema";
import { TokenplanIdentifierRangeSchema } from "../models/schema/tokenPlan/token.plan.identifier.range.schema";
import { HTTP400Error } from "../utils/httpErrors";
import { ssidUpdateSchema } from "../models/schema/ssid/ssid.update.schema";
import { ssidFilterSchema } from "../models/schema/ssid/ssid.filter.schema";
import { JoiErrors } from "../utils/joiErrors";
import { IRoute } from "../utils";

// Joi validation options
const _validationOptions = {
  abortEarly: false, // abort after the last validation error
  allowUnknown: false, // allow unknown keys that will be ignored
  stripUnknown: false, // remove unknown keys from the validated data
};

export interface IRequestSchema {
  body?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  // user?: Joi.ObjectSchema
  files?: Joi.ObjectSchema;
}
export interface IResponseSchema extends Joi.AnySchema {
  "200"?: Joi.AnySchema;
  "201"?: Joi.AnySchema;
  "202"?: Joi.AnySchema;
  "400"?: Joi.AnySchema;
  "401"?: Joi.AnySchema;
  "402"?: Joi.AnySchema;
  "404"?: Joi.AnySchema;
}
export interface IRouteInfo extends IRoute {
  tags?: string[];
  validationSchema?: IRequestSchema;
  responses?: IResponseSchema;
  description?: string;
  summary?: string;
  jwtAuth?: boolean;
}

const getValidationErrors = (
  errors: Joi.ValidationErrorItem[],
  responseObject: ServiceResponse
) => {
  responseObject.errors = [];
  _.forEach(errors, (item: any, key: any) => {
    responseObject.errors.push(item.message);
  });
  return responseObject;
};

const validateWithPromise = async (
  object: any,
  schema: Joi.Schema,
  stripUnknown = true
) =>
  new Promise((resolve, reject) => {
    try {
      const jRes = schema
        .error((errors) => JoiErrors(errors))
        .validate(object, _validationOptions);
      if (jRes.error) {
        return reject(jRes.error);
      }
      resolve(jRes.value);
    } catch (err) {
      reject(err);
    }
  });

export const validateRequest = (joiSchema: IRequestSchema) => async (
  req: IRequestSchema,
  res: Response,
  next: NextFunction
) => {
  const promises: Promise<any>[] = [];
  const keysValidated: ("body" | "params" | "query" | "files")[] = [];

  if (joiSchema.body) {
    keysValidated.push("body");
    promises.push(validateWithPromise(req.body, joiSchema.body));
  }

  if (joiSchema.params) {
    keysValidated.push("params");
    promises.push(validateWithPromise(req.params, joiSchema.params));
  }

  if (joiSchema.query) {
    keysValidated.push("query");
    promises.push(validateWithPromise(req.query, joiSchema.query));
  }

  if (joiSchema.files) {
    keysValidated.push("files");
    promises.push(validateWithPromise(req.files, joiSchema.files, false));
  }

  try {
    const data = await Promise.all(promises);
    keysValidated.forEach((key, index) => {
      req[key] = data[index];
    });
    next();
  } catch (error) {
    const serviceResponse = new ServiceResponse();
    const resultObject = getValidationErrors(error.details, serviceResponse);
    res.status(200).send(resultObject);

    // logger.log(
    //   "JoiError:",
    //   error.message,
    //   "Fields:",
    //   keysValidated.map((f) => ({ [f]: req[f] }))
    // );
    // const details = error.details ? formatMessage(error.details) : [];
    // res.status(400).json({
    //   status: 0,
    //   message: `Invalid input: ${details.map((d) => d.message).join(", ")}.`,
    //   details,
    // });
  }
};

const validateWithJoy = (
  req: Request,
  res: Response,
  next: NextFunction,
  schema: Joi.ObjectSchema,
  fromBody: boolean = true
) => {
  let data = fromBody ? req.body : req.query;
  const result = Joi.validate(data, schema, _validationOptions);
  if (result.error) {
    const serviceResponse = new ServiceResponse();
    let resultObject = getValidationErrors(
      result.error.details,
      serviceResponse
    );
    res.status(200).send(resultObject);
  } else {
    next();
  }
};

const validateParams = (
  req: Request,
  res: Response,
  next: NextFunction,
  schema: Joi.ObjectSchema
) => {
  const result = Joi.validate(req.params, schema, _validationOptions);
  if (result.error) {
    const serviceResponse = new ServiceResponse();
    let resultObject = getValidationErrors(
      result.error.details,
      serviceResponse
    );
    res.status(200).send(resultObject);
  } else {
    next();
  }
};

export const validateGetSsidsRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateWithJoy(req, res, next, getSsidsSchema, false);
};

export const validateGetAdRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateWithJoy(req, res, next, getAdSchema, false);
};

export const validateCompleteAdNotificationRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateWithJoy(req, res, next, AdCompleteNotificationSchema, false);
};

export const validateGetDataPlansSchemaRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateWithJoy(req, res, next, GetDataPlansSchema, false);
};

export const validateXifiVoucherFilterRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateWithJoy(req, res, next, xifiVoucherFilterSchema, false);
};

export const validateXifiVoucherCreateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateWithJoy(req, res, next, XifiVoucherCreateSchema);
};

export const validateXifiVoucherUpdateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateWithJoy(req, res, next, XifiVoucherUpdateSchema);
};

export const validateXifiVoucherRedeemRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateWithJoy(req, res, next, XifiVoucherRedeemSchema, false);
};

export const validateDataPlanCreateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateWithJoy(req, res, next, DataplanCreateSchema);
};

export const validateDataPlanUpdateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateWithJoy(req, res, next, DataPlanUpdateSchema);
};

export const validateCreateOrderRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateWithJoy(req, res, next, createOrderRequestSchema);
};

export const validateVerifyOrderRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateWithJoy(req, res, next, verifyPaymentOrderRequestSchema);
};

export const validateGetPaymentOrderRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateWithJoy(req, res, next, getPaymentOrderRequestSchema, false);
};

export const validateHistoryPaymentOrderRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateWithJoy(req, res, next, historyPaymentOrderRequestSchema, false);
};

export const validateTokenPlanCreateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateWithJoy(req, res, next, TokenplanCreateSchema);
};

export const validateTokenPlanUpdateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateWithJoy(req, res, next, TokenPlanUpdateSchema);
};

export const validateGetActiveTokenPlanSchemaRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateWithJoy(req, res, next, GetActiveTokenPlansSchema, false);
};

export const validateGetTokenPlanFilterSchemaRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateWithJoy(req, res, next, GetTokenPlansFilterSchema, false);
};

export const validateTokenPlanIdentifierRangeRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateParams(req, res, next, TokenplanIdentifierRangeSchema);
};

export const validateSsidUpdateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (Object.keys(req.body).length > 0) {
    validateWithJoy(req, res, next, ssidUpdateSchema);
  } else {
    throw new HTTP400Error("Invalid data to update.");
  }
};

export const validateSsidFilterRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateWithJoy(req, res, next, ssidFilterSchema, false);
};
