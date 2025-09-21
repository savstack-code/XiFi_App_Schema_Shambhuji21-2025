import Joi from "joi";
import { JoiErrors } from "../../../../utils/joiErrors";

export const historyPaymentOrderRequestSchema = Joi.object().keys({
    userDeviceId: Joi.string().regex(/^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/).required().label("User Device Id").error(errors => JoiErrors(errors)),
    orderFromDate: Joi.string().optional().regex(/^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\s([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).label("Order From Date").error(errors => JoiErrors(errors)),
    orderToDate: Joi.string().optional().regex(/^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\s([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).label("Order To Date").error(errors => JoiErrors(errors)),
    currentPage: Joi.number().integer().required().label("Current Page").greater(0).error(errors => JoiErrors(errors)),
    pageSize: Joi.number().integer().required().label("Page Size").greater(0).error(errors => JoiErrors(errors))
}).with('orderFromDate', 'orderToDate').error(errors => JoiErrors(errors))
    .with('orderToDate', 'orderFromDate').error(errors => JoiErrors(errors));