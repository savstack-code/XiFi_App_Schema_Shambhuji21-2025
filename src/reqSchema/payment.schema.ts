import Joi from "joi";
import { Request } from "express";
import { IRequestSchema } from "../middleware/schemaValidator";

export interface IPaymentOrderRequest extends Request {
  body: {
    amount: number;
    attempts: number;
    currency: string;
    tokenPlanId: number;
    checkoutId?: string;
    paymentCapture?: boolean;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    razorpayOrderCreatedAt: string;
    razorpaySignature?: string;
    razorpayStatus?: string;
    status?: string;
    transactionId?: string;
    userId: string;
    errorCode?: string;
    errorMessage?: string;
    refundStatus?: string;
    amountRefunded?: string;
    disputeId?: string;
    disputeReasonCode?: string;
    disputePhase?: string;
    disputeStatus?: string;
    disputeCreatedAt?: string;
    disputeRespondBy?: string;
    paymentMethod?: string;
  };
}
export interface IPaymentOrderCreateRequest extends Request {
  body: {
    tokenPlanId: number;
    userDeviceId: string;
  };
}

export const createOrderRequestSchema: IRequestSchema = {
  body: Joi.object().keys({
    tokenPlanId: Joi.number()
      .required()
      .label("Token Plan Id")
      .greater(0)
      .less(2147483647),
    userDeviceId: Joi.string()
      .regex(
        /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
      )
      .required()
      .label("User Device Id"),
  }),
};

export const getPaymentOrderRequestSchema: IRequestSchema = {
  params: Joi.object().keys({
    userDeviceId: Joi.string()
      .regex(
        /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
      )
      .required()
      .label("User Device Id"),
    orderId: Joi.string().required().label("Order Id"),
  }),
};

export interface IPaymentOrderHistoryRequest extends Request {
  query: {
    currentPage: number;
    pageSize: number;
    userDeviceId: string;
    userId?: string;
    orderFromDate?: string;
    orderToDate?: string;
  };
}

export const historyPaymentOrderRequestSchema: IRequestSchema = {
  query: Joi.object().keys({
    userDeviceId: Joi.string()
      .regex(
        /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
      )
      .required()
      .label("User Device Id"),
    orderFromDate: Joi.string()
      .optional()
      .regex(
        /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\s([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/
      )
      .label("Order From Date"),
    orderToDate: Joi.string()
      .optional()
      .regex(
        /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\s([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/
      )
      .label("Order To Date"),
    currentPage: Joi.number()
      .integer()
      .required()
      .label("Current Page")
      .greater(0),
    pageSize: Joi.number().integer().required().label("Page Size").greater(0),
  }),
  //   .with("orderFromDate", "orderToDate")
  //   .error((errors) => JoiErrors(errors))
  //   .with("orderToDate", "orderFromDate")
  //   .error((errors) => JoiErrors(errors));
  //Ask About above query
};

export interface IPaymentVerificationRequest extends Request {
  body: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    userDeviceId: string;
  };
}

export const verifyPaymentOrderRequestSchema: IRequestSchema = {
  body: Joi.object().keys({
    userDeviceId: Joi.string()
      .regex(
        /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/
      )
      .required()
      .label("User Device Id"),
    razorpayOrderId: Joi.string().required().label("Razorpay Order Id"),
    razorpayPaymentId: Joi.string().required().label("Razorpay Payment Id"),
    razorpaySignature: Joi.string().required().label("Razorpay Signature"),
  }),
};
