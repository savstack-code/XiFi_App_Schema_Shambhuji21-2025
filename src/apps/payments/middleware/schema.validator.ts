import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import _ from "lodash";
import { ServiceResponse } from "../../../models/response/ServiceResponse";
import { createOrderRequestSchema } from "../models/schema/create.order.request.schema";
import { getPaymentOrderRequestSchema } from "../models/schema/get.payment.order.request.schema";
import { historyPaymentOrderRequestSchema } from "../models/schema/history.payment.order.schema";
import { verifyPaymentOrderRequestSchema } from "../models/schema/verify.order.request.schema";

// Joi validation options
const _validationOptions = {
  abortEarly: false, // abort after the last validation error
  allowUnknown: true, // allow unknown keys that will be ignored
  stripUnknown: true, // remove unknown keys from the validated data
};

let serviceResponse = new ServiceResponse();

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

const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
  schema: Joi.ObjectSchema,
  fromBody: boolean = true
) => {
  let data = fromBody ? req.body : req.query;
  const result = Joi.validate(data, schema, _validationOptions);
  if (result.error) {
    let resultObject = getValidationErrors(
      result.error.details,
      serviceResponse
    );
    res.status(200).send(resultObject);
  } else {
    next();
  }
};

export const validateCreateOrderRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateRequest(req, res, next, createOrderRequestSchema);
};

export const validateGetPaymentOrderRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateRequest(req, res, next, getPaymentOrderRequestSchema, false);
};

export const validateHistoryPaymentOrderRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateRequest(req, res, next, historyPaymentOrderRequestSchema, false);
};

export const validateVerifyOrderRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateRequest(req, res, next, verifyPaymentOrderRequestSchema);
};
