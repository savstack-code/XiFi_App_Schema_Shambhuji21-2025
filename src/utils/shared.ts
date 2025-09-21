import { ServiceResponse } from "../models/response/ServiceResponse";
import logger from "../config/winston.logger";

export const setError = (
  serviceResponse: ServiceResponse,
  errorMessage: string,
  statusCode: string
) => {
  serviceResponse.statusCode = statusCode;
  serviceResponse.errors.push(errorMessage);
  return serviceResponse;
};

export const setErrorWithStatus = (
  serviceResponse: ServiceResponse,
  errorMessage: string,
  statusCode: string
) => {
  serviceResponse.success = false;
  serviceResponse.statusCode = statusCode;
  serviceResponse.errors.push(errorMessage);
  return serviceResponse;
};
