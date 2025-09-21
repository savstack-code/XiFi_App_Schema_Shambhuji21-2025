import Joi from "joi";
// import { Request } from "express";
// import { IRequestSchema } from "../middleware/schemaValidator";

export interface IDataUserPolicyModel {
  userId: string;
  userName: string;
  xiKasuTokens: number;
  planId?: number;
  planType?: string;
  time: number;
  bandwidth: number;
  mobileNumber: string;
}
