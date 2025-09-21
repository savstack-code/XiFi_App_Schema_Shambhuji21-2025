import { Request, Response, NextFunction } from "express";
const requestContext = require("request-context");


export const adminValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const adminToken = req.headers['x-admintoken'];

  if (!adminToken || adminToken != process.env.ADMIN_TOKEN) {
    res.status(403).send("Admin Token required/mismatched");
  } else {
    next();
  }
};



export const checkAuthority = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const adminToken = req.headers['x-admintoken'];

  if (!adminToken || adminToken != process.env.ADMIN_TOKEN) {
    res.status(403).send("Admin Token required/mismatched");
  } else {
    next();
  }
};
