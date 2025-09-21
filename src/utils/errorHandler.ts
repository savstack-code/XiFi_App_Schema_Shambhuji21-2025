import { Response, NextFunction } from "express";
import { HTTPClientError, HTTP404Error } from "../utils/httpErrors";
import logger from "../config/winston.logger";
import { ApplicationError } from "./applicationErrors";
import { ServiceResponse } from "../models/response/ServiceResponse";

export const notFoundError = () => {
  throw new HTTP404Error("Method not found.");
};

export const clientError = (err: Error, res: Response, next: NextFunction) => {
  if (err instanceof HTTPClientError) {
    logger.error(err.stack ? err.stack : err.message);
    res.status(err.statusCode).send(err.message);
  } else if (err instanceof ApplicationError) {
    logger.error(err.stack ? err.stack : err.message);
    let serviceResponse = new ServiceResponse();

    // : ServiceResponse = {
    //   success: false,
    //   statusCode: "400",
    //   errorCode: err.errorCode,
    //   result: null,
    //   errors: [err.message]
    // };
    serviceResponse.setError(err.message, "400", err.errorCode);

    res.status(200).send(serviceResponse);
  } else {
    next(err);
  }
};

export const serverError = (err: Error, res: Response, next: NextFunction) => {
  logger.error(err.stack ? err.stack : err.message);
  if (process.env.NODE_ENV === "production") {
    res.status(500).send("Internal Server Error");
  } else {
    res.status(500).send(err.stack);
  }
};
