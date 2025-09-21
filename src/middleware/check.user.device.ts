import { Request, Response, NextFunction } from "express";
import { userDeviceService } from "../services/user.device.service";
const requestContext = require("request-context");

export const checkUserDevice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let userDeviceId = req.query.userDeviceId || req.body.userDeviceId;
  let userDeviceResponse = await userDeviceService.getUserDeviceStatus(
    userDeviceId
  );
  if (!userDeviceResponse.success) {
    res.status(403).send(userDeviceResponse.errors[0]);
  } else {
    requestContext.set("request:user", userDeviceResponse.result);
    next();
  }
};
