import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import _ from "lodash";
import { getAdSchema } from "../models/schema/get.ad.schema";

import { adCompleteNotificationSchema } from "../models/schema/ad.complete.notification.schema";
import { ServiceResponse } from "../../../models/response/ServiceResponse";

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

export const validateGetAdRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateRequest(req, res, next, getAdSchema, false);
};

export const validateAdComleteNotificationRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateRequest(req, res, next, adCompleteNotificationSchema, false);
};
