import { paymentService } from "../services/payment.service";
// import PaymentOrderCreateRequest from '../models/request/payment.order.create.request';
// import PaymentVerificationRequest from '../models/request/payment.verification.request';
// import PaymentOrderHistoryRequest from '../models/request/payment.order.history.request';
import {
  IPaymentOrderCreateRequest,
  IPaymentVerificationRequest,
  IPaymentOrderHistoryRequest,
} from "../../../reqSchema/payment.schema";

export const createPaymentOrder = async (
  paymentOrderCreateRequest: IPaymentOrderCreateRequest["body"]
) => {
  const result = await paymentService.CreatePaymentOrder(
    paymentOrderCreateRequest
  );
  return result;
};

export const verifyPayment = async (
  paymentVerificationRequest: IPaymentVerificationRequest["body"]
) => {
  const result = await paymentService.verifyPayment(paymentVerificationRequest);
  return result;
};

export const getPaymentOrder = async (orderId: string) => {
  const result = await paymentService.getPaymentOrder(orderId);
  return result;
};

export const getPaymentOrderHistory = async (
  paymentOrderHistoryRequest: IPaymentOrderHistoryRequest["body"]
) => {
  const result = await paymentService.getPaymentOrderHistory(
    paymentOrderHistoryRequest
  );
  return result;
};

export const handleRazorpayNotificationEvent = async (eventPayload: any) => {
  const result = await paymentService.handleRazorpayNotificationEvent(
    eventPayload
  );
  return result;
};
