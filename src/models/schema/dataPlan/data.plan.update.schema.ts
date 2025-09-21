import Joi from "joi";
import { JoiErrors } from "../../../utils/joiErrors";

export const DataPlanUpdateSchema = Joi.object()
  .keys({
    planName: Joi.string()
      .allow(null)
      .optional()
      .label("Plan Name")
      .error((errors) => JoiErrors(errors)),
    description: Joi.string()
      .allow(null)
      .optional()
      .label("Description")
      .error((errors) => JoiErrors(errors)),
    planId: Joi.string()
      .allow(null)
      .optional()
      .label("Plan Id")
      .error((errors) => JoiErrors(errors)),
    bandwidthLimit: Joi.string()
      .allow(null)
      .optional()
      .label("Bandwidth Limit")
      .error((errors) => JoiErrors(errors)),
    timeLimit: Joi.string()
      .allow(null)
      .optional()
      .label("Time Limit")
      .error((errors) => JoiErrors(errors)),
    renewalTime: Joi.string()
      .allow(null)
      .optional()
      .label("Renewal Time")
      .error((errors) => JoiErrors(errors)),
    status: Joi.string()
      .required()
      .label("Status")
      .error((errors) => JoiErrors(errors)),
    expiryDate: Joi.string()
      .allow(null)
      .optional()
      .label("ExpiryDate")
      .error((errors) => JoiErrors(errors)),
    tokenQuantity: Joi.number()
      .allow(null)
      .optional()
      .label("Token Quantity")
      .error((errors) => JoiErrors(errors)),
    tokenValue: Joi.number()
      .allow(null)
      .optional()
      .label("Token Value")
      .error((errors) => JoiErrors(errors)),
    maximumAdsPerDay: Joi.number()
      .allow(null)
      .optional()
      .label("Maximum Ads Per Day")
      .error((errors) => JoiErrors(errors)),
    planType: Joi.string()
      .allow(null)
      .optional()
      .label("Plan Type")
      .error((errors) => JoiErrors(errors)),
    validity: Joi.number()
      .allow(null)
      .optional()
      .label("Validity")
      .error((errors) => JoiErrors(errors)),
    uot: Joi.string()
      .allow(null)
      .optional()
      .label("UOT")
      .error((errors) => JoiErrors(errors)),
    priceInRupees: Joi.number()
      .allow(null)
      .optional()
      .label("Price In Rupees")
      .error((errors) => JoiErrors(errors)),
    xiKasuTokens: Joi.number()
      .allow(null)
      .optional()
      .label("XiKasu Tokens")
      .error((errors) => JoiErrors(errors)),
  })
  .unknown(false)
  .error((errors) => JoiErrors(errors));
