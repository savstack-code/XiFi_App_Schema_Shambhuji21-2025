import { Request, Response, NextFunction, Router } from "express";
import { ServiceResponse } from "../models/response/ServiceResponse";

export const sendResponse = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let serviceResponse = new ServiceResponse();

  // : ServiceResponse = {
  //     success: true,
  //     statusCode: "200",
  //     errorCode: null,
  //     result: res.locals.result,
  //     errors: []
  // };

  serviceResponse.setSuccess(res.locals.result);
  res.status(200).send(serviceResponse);
};
