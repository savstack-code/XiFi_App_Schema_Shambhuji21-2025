import { Request, Response, NextFunction } from "express";
import {
  createPaymentOrder,
  verifyPayment,
  getPaymentOrder,
  getPaymentOrderHistory,
  handleRazorpayNotificationEvent,
} from "./payment.controller";
// import {
//   validateCreateOrderRequest,
//   validateGetPaymentOrderRequest,
//   validateHistoryPaymentOrderRequest,
// } from "../middleware/schema.validator";

import { IRouteInfo } from "../../../middleware/schemaValidator";
// import PaymentOrderCreateRequest from "../models/request/payment.order.create.request";
import logger from "../../../config/winston.logger";
// import PaymentVerificationRequest from "../models/request/payment.verification.request";
// import PaymentOrderHistoryRequest from "../models/request/payment.order.history.request";
// import { validateVerifyOrderRequest } from "../../../middleware/schemaValidator";
import { checkUserDevice } from "../../../middleware/check.user.device";
import {
  createOrderRequestSchema,
  getPaymentOrderRequestSchema,
  historyPaymentOrderRequestSchema,
  IPaymentOrderCreateRequest,
  IPaymentVerificationRequest,
  IPaymentOrderHistoryRequest,
  verifyPaymentOrderRequestSchema,
} from "../../../reqSchema/payment.schema";

const routes: IRouteInfo[] = [
  {
    path: `/api/v${process.env.API_VERSION}/payment/order`,
    method: "post",
    validationSchema: createOrderRequestSchema,
    handler: [
      //   validateCreateOrderRequest,
      checkUserDevice,
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          let paymentOrderCreateRequest: IPaymentOrderCreateRequest["body"] = body;
          const result = await createPaymentOrder(paymentOrderCreateRequest);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/payment/completenotification`,
    method: "post",
    handler: [
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          await handleRazorpayNotificationEvent(body);
          res.status(200).send({ message: "Successfully saved the payload." });
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/payment/verification`,
    method: "post",
    validationSchema: verifyPaymentOrderRequestSchema,
    handler: [
      //   validateVerifyOrderRequest,
      checkUserDevice,
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          let paymentVerificationRequest: IPaymentVerificationRequest["body"] = body;
          const result = await verifyPayment(paymentVerificationRequest);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/payment/gettheorder`,
    method: "get",
    validationSchema: getPaymentOrderRequestSchema,
    handler: [
      //   validateGetPaymentOrderRequest,
      checkUserDevice,
      async (
        { query, body, params }: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const result = await getPaymentOrder(query.orderId);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/payment/orderhistory`,
    method: "get",
    validationSchema: historyPaymentOrderRequestSchema,
    handler: [
      //   validateHistoryPaymentOrderRequest,
      checkUserDevice,
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          let PaymentOrderHistoryRequest: IPaymentOrderHistoryRequest["query"] = query;
          const result = await getPaymentOrderHistory(
            PaymentOrderHistoryRequest
          );
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
];

export default routes;
