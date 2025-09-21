import { Request, Response, NextFunction } from "express";
import { HTTP400Error } from "../utils/httpErrors";

export const checkSearchParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.query.q) {
    throw new HTTP400Error("Missing q parameter");
  } else {
    next();
  }
};

export const checkWaniPdoaTokenParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.query.wanipdoatoken) {
    throw new HTTP400Error("Missing WaniPdoaToken parameter");
  } else {
    next();
  }
};

export const checkXifiVoucherParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.params.identifier) {
    throw new HTTP400Error("Missing identifier parameter.");
  } else if (isNaN(req.params.identifier)) {
    throw new HTTP400Error("Identifier parameter should be a number.");
  } else {
    next();
  }
};

export const checkDataPlanParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.params.identifier) {
    throw new HTTP400Error("Missing identifier parameter.");
  } else if (isNaN(req.params.identifier)) {
    throw new HTTP400Error("Identifier parameter should be a number.");
  } else {
    next();
  }
};

export const checkDeleteSsidParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.params.identifier) {
    throw new HTTP400Error("Missing identifier parameter.");
  } else {
    next();
  }
};

export const checkSsidParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.params.identifier) {
    throw new HTTP400Error("Missing identifier parameter.");
  } else if (isNaN(req.params.identifier)) {
    throw new HTTP400Error("Identifier parameter should be a number.");
  } else {
    next();
  }
};
