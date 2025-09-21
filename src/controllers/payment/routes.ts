import { Request, Response, NextFunction } from "express";
import request from "request-promise";
import {
  IRouteInfo,
  // validateCreateOrderRequest,
  // validateGetPaymentOrderRequest,
  // validateHistoryPaymentOrderRequest,
  // validateVerifyOrderRequest,
} from "../../middleware/schemaValidator";
import logger from "../../config/winston.logger";
import {
  createOrderRequestSchema,
  getPaymentOrderRequestSchema,
  historyPaymentOrderRequestSchema,
  verifyPaymentOrderRequestSchema,
} from "../../reqSchema/payment.schema";
import { checkUserDevice } from "../../middleware/check.user.device";

const routes: IRouteInfo[] = [
  {
    path: `/api/v${process.env.API_VERSION}/payment/createorder`,
    method: "post",
    tags: ["Payment"],
    validationSchema: createOrderRequestSchema,
    handler: [
      // validateCreateOrderRequest,
      checkUserDevice,
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          let adUrl = `http://${process.env.HOST}:${process.env.PORT}/api/v${process.env.API_VERSION}/payment/order`;
          console.log("31 adUrl :", adUrl)
          let paymentCreateOrderRequestOptions = {
            method: "POST",
            uri: adUrl,
            body: body,
            json: true, // Automatically stringifies the body to JSON
          };
          const paymentCreateOrderResponse = await request(
            paymentCreateOrderRequestOptions
          );
          console.log("response :", paymentCreateOrderResponse)
          res.status(200).send(paymentCreateOrderResponse);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/payment/verify`,
    method: "post",
    tags: ["Payment"],
    validationSchema: verifyPaymentOrderRequestSchema,
    handler: [
      // validateVerifyOrderRequest,
      checkUserDevice,
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          let adUrl = `http://${process.env.HOST}:${process.env.PORT}/api/v${process.env.API_VERSION}/payment/verification`;
          let paymentVerificationRequestOptions = {
            method: "POST",
            uri: adUrl,
            body: body,
            json: true, // Automatically stringifies the body to JSON
          };
          const paymentVerificationResponse = await request(
            paymentVerificationRequestOptions
          );
          res.status(200).send(paymentVerificationResponse);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/payment/notification`,
    method: "post",
    tags: ["Payment"],
    handler: [
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          logger.info("Razorpay event payload: " + JSON.stringify(body));
          let adUrl = `http://${process.env.HOST}:${process.env.PORT}/api/v${process.env.API_VERSION}/payment/completenotification`;
          let paymentCreateOrderRequestOptions = {
            method: "POST",
            uri: adUrl,
            body: body,
            json: true, // Automatically stringifies the body to JSON
          };
          const paymentCreateOrderResponse = await request(
            paymentCreateOrderRequestOptions
          );
          res.status(200).send(paymentCreateOrderResponse);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/payment/getorder`,
    method: "get",
    tags: ["Payment"],
    validationSchema: getPaymentOrderRequestSchema,
    handler: [
      // validateGetPaymentOrderRequest,
      checkUserDevice,
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          let adUrl = `http://${process.env.HOST}:${process.env.PORT}/api/v${process.env.API_VERSION}/payment/gettheorder?userDeviceId=${query.userDeviceId}&orderId=${query.orderId}`;
          const result = await request(adUrl);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/payment/history`,
    method: "get",
    tags: ["Payment"],
    validationSchema: historyPaymentOrderRequestSchema,
    handler: [
      // validateHistoryPaymentOrderRequest,
      checkUserDevice,
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          let querySegment: string = "";
          if (query.orderId) {
            querySegment += `&orderId=${query.orderId}`;
          }
          if (query.orderFromDate) {
            querySegment += `&orderFromDate=${query.orderFromDate}`;
          }
          if (query.orderToDate) {
            querySegment += `&orderToDate=${query.orderToDate}`;
          }
          let adUrl = `http://${process.env.HOST}:${process.env.PORT}/api/v${process.env.API_VERSION}/payment/orderhistory?userDeviceId=${query.userDeviceId}&currentPage=${query.currentPage}&pageSize=${query.pageSize}`;
          if (querySegment != "") {
            adUrl += querySegment;
          }
          const result = await request(adUrl);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
];

export default routes;
