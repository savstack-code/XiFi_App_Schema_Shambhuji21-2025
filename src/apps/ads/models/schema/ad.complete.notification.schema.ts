import Joi from "joi";
import { JoiErrors } from "../../../../utils/joiErrors";

export const adCompleteNotificationSchema = Joi.object().keys({
    //pdoaId: Joi.string().regex(/^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/).required().label("Pdoa Id").error(errors => JoiErrors(errors)),
    userDeviceId: Joi.string().regex(/^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/).required().label("User Device Id").error(errors => JoiErrors(errors)),
    planType: Joi.string().required().label("Plan Type").error(errors => JoiErrors(errors)),
    adId: Joi.string().regex(/^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/).required().label("Ad Id").error(errors => JoiErrors(errors)),
});