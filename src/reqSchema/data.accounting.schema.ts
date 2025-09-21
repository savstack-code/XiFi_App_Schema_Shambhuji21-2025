import Joi from "joi";
import { Request } from "express";
import { IRequestSchema } from "../middleware/schemaValidator";

export interface IDataAccountingRequest extends Request {
  body: {
    userName: string;
    startTime: Date;
    sessionTime: string;
    dataUsed: string;
    calledStation: string;
    callingStation: string;
    locationId: string;
    stopTime: Date;
    terminateCause: string;
    planId: string;
    userPlanId?: number;
    status: string;
  };
}

export const dataAccountingSchema: IRequestSchema = {
  body: Joi.object().keys({
    userName: Joi.string().max(50).required().label("UserName"),
    startTime: Joi.date().required().label("StartTime"),
    sessionTime: Joi.string().max(50).required().label("SessionTime"),
    dataUsed: Joi.string().max(50).required().label("DataUsed"),
    calledStation: Joi.string().max(50).required().label("CalledStation"),
    callingStation: Joi.string().max(50).required().label("CallingStation"),
    locationId: Joi.string().max(50).required().label("LocationId"),
    stopTime: Joi.date().required().label("StopTime"),
    terminateCause: Joi.string().max(250).required().label("TerminateCause"),
    planId: Joi.string().max(50).required().label("PlanId"),
    status: Joi.string().max(50).required().label("Status"),
    userPlanId: Joi.number().label("UserPlanId"),
  }),
};
