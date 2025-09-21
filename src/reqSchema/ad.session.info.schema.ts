import Joi from "joi";
import { Request } from "express";
import { IRequestSchema } from "../middleware/schemaValidator";

export interface IAdSessionInfo {
  adId: string;
  adUrl: string;
  skipTime: string;
  durationTime: string;
  remainingTime: string;
  renewalTime: string;
}

export const adSessionInfoSchema = Joi.object().keys({
  adId: Joi.string().default("").label("Ad ID"),
  adUrl: Joi.string().default("").label("Ad URL"),
  skipTime: Joi.string().default("").label("Skip Time"),
  durationTime: Joi.string().default("").label("Duration Time"),
  remainingTime: Joi.string().default("").label("Remaining Time"),
  renewalTime: Joi.string().default("").label("Renewal Time"),
});
