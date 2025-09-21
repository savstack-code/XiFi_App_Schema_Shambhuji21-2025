// import { DatabaseProvider } from "../database/database.provider";
// import { PaymentOrderRepository } from "../database/repositories/payment.order.repository";
import { PaymentOrderRepository } from "../../../database/mongodb/repositories/payment.order.repository";
// import PaymentOrderModel from "../models/payment.order.model";
import logger from "../../../config/winston.logger";
import * as crypto from "crypto";
import request from "request-promise";
import _ from "lodash";
// import PaymentOrderCreateRequest from "../models/request/payment.order.create.request";
// import { PaymentGatewayConfigRepository } from "../database/repositories/payment.gateway.config.repository";
import { PaymentGatewayConfigRepository } from "../../../database/mongodb/repositories/payment.gateway.config.repository";
import { DataUserTokenRepository } from "../../../database/mongodb/repositories/data.user.token.repository";

// import PaymentVerificationRequest from "../models/request/payment.verification.request";
// import PaymentOrder from "../../../shared/database/entities/PaymentOrder";
import { PaymentOrderModel } from "../../../database/mongodb/models/paymentOrder.model";
// import PaymentOrderHistoryRequest from "../models/request/payment.order.history.request";
// import { TokenPlanRepository } from "../database/repositories/token.plan.repository";
import { TokenPlanRepository } from "../../../database/mongodb/repositories/token.plan.repository";
import { DataUserTokenBalanceRepository } from "../../../database/mongodb/repositories/data.user.token.balance.repository";

import { userDeviceService } from "../../../services/user.device.service";
import { setError } from "../../../utils/shared";
import { tokenService } from "../../../shared/services/token.service";
// import DataUserTokenModel from "../../../shared/models/data.user.token.model";
import { IDataUserTokenRequest } from "../../../reqSchema/user.create.schema";
import { XiKasuSourceEnum } from "../../../shared/enums/xikasu.source.enum";
import { ServiceResponse } from "../../../models/response/ServiceResponse";
import { CommandRepository } from "../../../database/mongodb/repositories/comman.repository";

import {
  IPaymentOrderRequest,
  IPaymentOrderCreateRequest,
  IPaymentVerificationRequest,
  IPaymentOrderHistoryRequest,
} from "../../../reqSchema/payment.schema";

export class PaymentService {
  paymentOrderRepository: PaymentOrderRepository;
  paymentGatewayConfigRepository: PaymentGatewayConfigRepository;
  tokenPlanRepository: TokenPlanRepository;
  commandRepository: CommandRepository;
  dataUserTokenRepository: DataUserTokenRepository
  dataUserTokenBalanceRepository: DataUserTokenBalanceRepository
  constructor() {
    this.paymentOrderRepository = new PaymentOrderRepository();
    this.paymentGatewayConfigRepository = new PaymentGatewayConfigRepository();
    this.tokenPlanRepository = new TokenPlanRepository();
    this.commandRepository = new CommandRepository();
    this.dataUserTokenRepository = new DataUserTokenRepository();
    this.dataUserTokenBalanceRepository = new DataUserTokenBalanceRepository();
  }
  public async CreatePaymentOrder(
    paymentOrderCreateRequest: IPaymentOrderCreateRequest["body"]
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    try {
      let loginUser = userDeviceService.getLoginUser();
      if (!loginUser) {
        let errorMessage = "User not found.";
        setError(serviceResponse, errorMessage, "404");
        return serviceResponse;
      }

      //const connection = await DatabaseProvider.getConnection();
      // let paymentGatewayConfigRepository = connection.getCustomRepository(
      //   PaymentGatewayConfigRepository
      // );
      let paymentGatewayConfig =
        await this.paymentGatewayConfigRepository.findOne("Razorpay");

      if (paymentGatewayConfig) {
        // let tokenPlanRepository = connection.getCustomRepository(
        //   TokenPlanRepository
        // );
        let tokenPlan = await this.tokenPlanRepository.findByidentifier(
          paymentOrderCreateRequest.tokenPlanId
        );

        if (tokenPlan) {
          if (!tokenPlan.amount) {
            let errorMessage = "Token Amount Not Found.";
            setError(serviceResponse, errorMessage, "404");
            return serviceResponse;
          }

          if (!tokenPlan.currency) {
            let errorMessage = "Token Currency Not Found.";
            setError(serviceResponse, errorMessage, "404");
            return serviceResponse;
          }
          let amountString =
            parseInt(tokenPlan.amount.toString()).toString() + "00";
          let amount = parseInt(amountString);
          let adUrl = `${paymentGatewayConfig.urlScheme}://${paymentGatewayConfig.keyId}:${paymentGatewayConfig.keySecret}@${paymentGatewayConfig.baseUrlSegment}/orders`;
          let paymentCreateOrderRequestOptions = {
            method: "POST",
            uri: adUrl,
            body: {
              amount: amount,
              currency: tokenPlan.currency,
              receipt: paymentOrderCreateRequest.tokenPlanId.toString(),
              payment_capture: 1,
            },
            json: true, // Automatically stringifies the body to JSON
          };
          const paymentCreateOrderResponse = await request(
            paymentCreateOrderRequestOptions
          );
          if (paymentCreateOrderResponse) {
            let paymentOrderModel: IPaymentOrderRequest["body"] = {
              amount: tokenPlan.amount,
              tokenPlanId: paymentOrderCreateRequest.tokenPlanId,
              attempts: 1,
              checkoutId: "",
              paymentCapture: false,
              razorpayOrderId: paymentCreateOrderResponse.id,
              razorpayOrderCreatedAt: paymentCreateOrderResponse.created_at,
              razorpayPaymentId: "",
              razorpaySignature: "",
              transactionId: "",
              currency: tokenPlan.currency,
              status: "",
              razorpayStatus: paymentCreateOrderResponse.status,
              userId: loginUser.userId,
              errorCode: "",
              errorMessage: "",
              refundStatus: "",
              amountRefunded: "",
              disputeId: "",
              disputeReasonCode: "",
              disputePhase: "",
              disputeStatus: "",
              disputeCreatedAt: "",
              disputeRespondBy: "",
              paymentMethod: "",
            };

            // let paymentOrderRepository = connection.getCustomRepository(
            //   PaymentOrderRepository
            // );

            // let paymentOrderID =
            //   this.commandRepository.generateKey("PaymentOrder");
            // paymentOrderModel.id = paymentOrderID;
            let paymentOrder = await this.paymentOrderRepository.createAndSave(
              paymentOrderModel
            );
            if (paymentOrder) {
              serviceResponse.success = true;
              serviceResponse.statusCode = "200";
              serviceResponse.result = {
                orderId: paymentCreateOrderResponse.id,
                message: "Order created successfully.",
              };
              return serviceResponse;
            }
          }
        } else {
          let errorMessage = "Token plan not found.";
          setError(serviceResponse, errorMessage, "404");
          return serviceResponse;
        }
      } else {
        let errorMessage = "Payment gateway details not found.";
        setError(serviceResponse, errorMessage, "404");
        return serviceResponse;
      }

      return serviceResponse;
    } catch (error) {
      logger.error(error.message);
      throw new Error(error);
    }
  }

  public async verifyPayment(
    paymentVerificationRequest: IPaymentVerificationRequest["body"]
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();

    let loginUser = userDeviceService.getLoginUser();
    if (!loginUser) {
      serviceResponse.statusCode = "404";
      serviceResponse.errors.push("User not found.");
      return serviceResponse;
    }

    // const connection = await DatabaseProvider.getConnection();
    // let paymentOrderRepository = connection.getCustomRepository(
    //   PaymentOrderRepository
    // );
    let paymentOrder = await this.paymentOrderRepository.findByOrderAndUserId(
      paymentVerificationRequest.razorpayOrderId,
      loginUser.userId
    );
    if (paymentOrder) {
      // let paymentGatewayConfigRepository = connection.getCustomRepository(
      //   PaymentGatewayConfigRepository
      // );
      let paymentGatewayConfig =
        await this.paymentGatewayConfigRepository.findOne("Razorpay");
      if (paymentGatewayConfig) {
        if (!paymentGatewayConfig.keySecret) {
          let errorMessage = "Payment gateway secre key not found.";
          setError(serviceResponse, errorMessage, "404");
          return serviceResponse;
        }
        const bd = paymentVerificationRequest.razorpayOrderId + "|" + paymentVerificationRequest.razorpayPaymentId
        var generatedSignature = crypto
          .createHmac("SHA256", paymentGatewayConfig.keySecret)
          .update(bd.toString())
          .digest("hex");
        if (
          generatedSignature == paymentVerificationRequest.razorpaySignature
        ) {
          paymentOrder.status = "Success";
          paymentOrder.razorpayOrderId =
            paymentVerificationRequest.razorpayOrderId;
          paymentOrder.razorpayPaymentId =
            paymentVerificationRequest.razorpayPaymentId;
          paymentOrder.razorpaySignature =
            paymentVerificationRequest.razorpaySignature;
          paymentOrder = await paymentOrder.save();

          const tokenPlanDetails = await this.tokenPlanRepository.findByidentifier(paymentOrder.tokenPlanId)
          let uid, tkn
          if (loginUser && tokenPlanDetails) {
            uid = loginUser.userId
            tkn = tokenPlanDetails.xiKasuTokens
          }

          const ub = await this.dataUserTokenBalanceRepository.addTokenToUserAccount(uid, tkn)
          if (ub) {
            let dataUserTokenModel: any = {}
            dataUserTokenModel.userId = loginUser?.userId
            dataUserTokenModel.tokens = tokenPlanDetails?.xiKasuTokens
            dataUserTokenModel.balance = ub.tokens
            dataUserTokenModel.status = "Credited"
            dataUserTokenModel.transactionType = "Cr"
            dataUserTokenModel.referenceNo = paymentOrder.razorpayOrderId
            dataUserTokenModel.source = "App Buy"
            const buyToken = await this.dataUserTokenRepository.createAndSave(dataUserTokenModel)
          }
          if (paymentOrder === null) {
            let errorMessage = "Payment Order Data not found.";
            setError(serviceResponse, errorMessage, "404");
            return serviceResponse;
          }

          if (!paymentOrder.razorpayOrderId) {
            let errorMessage = "Razorpay Order Id not found.";
            setError(serviceResponse, errorMessage, "404");
            return serviceResponse;
          }
          let tokenResponse = await tokenService.getDataUserTokenByReferenceNo(
            paymentOrder.userId,
            paymentOrder.razorpayOrderId
          );
          serviceResponse.success = true;
          serviceResponse.statusCode = "200";
          serviceResponse.result = {
            orderId: paymentOrder.razorpayOrderId,
            tokens: null,
            totalTokens: null,
          };
          if (tokenResponse.success) {
            serviceResponse.result = {
              orderId: paymentOrder.razorpayOrderId,
              message: `Payment successfully done. ${tokenResponse.result.xiKasuTokens} XiKasu Tokens have been added to your account.`,
              tokens: tokenResponse.result.xiKasuTokens,
              totalTokens: tokenResponse.result.totalTokens,
            };
            paymentOrder.tokens = tokenResponse.result.xiKasuTokens
            paymentOrder.tokenBalance = tokenResponse.result.totalTokens
            await paymentOrder.save()
            return serviceResponse;
          }

          serviceResponse.result.message = `Payment is under process. Benefit XiKasu Tokens will be added to your account.`;
          return serviceResponse;
        } else {
          let errorMessage = "Invalid signature";
          setError(serviceResponse, errorMessage, "400");
        }
      } else {
        let errorMessage = "Payment gateway configuration details not found.";
        setError(serviceResponse, errorMessage, "404");
      }
    } else {
      let errorMessage = "Order not found.";
      setError(serviceResponse, errorMessage, "404");
    }

    return serviceResponse;
  }

  public async getPaymentOrder(orderId: string): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();

    let loginUser = userDeviceService.getLoginUser();
    if (!loginUser) {
      let errorMessage = "User not found.";
      setError(serviceResponse, errorMessage, "404");
      return serviceResponse;
    }
    // const connection = await DatabaseProvider.getConnection();
    // let paymentOrderRepository = connection.getCustomRepository(
    //   PaymentOrderRepository
    // );
    let paymentOrder = await this.paymentOrderRepository.findByOrderAndUserId(
      orderId,
      loginUser.userId
    );
    if (paymentOrder) {
      let paymentOrderModel = this.mapEnityToModel(paymentOrder);
      serviceResponse.success = true;
      serviceResponse.statusCode = "200";
      serviceResponse.result = paymentOrderModel;
      return serviceResponse;
    } else {
      let errorMessage = "Order not found.";
      setError(serviceResponse, errorMessage, "404");
    }

    return serviceResponse;
  }

  public async getPaymentOrderHistory(
    paymentOrderHistoryRequest: IPaymentOrderHistoryRequest["body"]
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();

    let loginUser = userDeviceService.getLoginUser();
    if (!loginUser) {
      let errorMessage = "User not found.";
      setError(serviceResponse, errorMessage, "404");
      return serviceResponse;
    }
    if (
      paymentOrderHistoryRequest.orderFromDate &&
      paymentOrderHistoryRequest.orderToDate
    ) {
      let fromDate: any = paymentOrderHistoryRequest.orderFromDate;
      let toDate: any = paymentOrderHistoryRequest.orderToDate;
      if (new Date(toDate) <= new Date(fromDate)) {
        let errorMessage =
          "Order From Date must be less than or equal to Order To Date.";
        setError(serviceResponse, errorMessage, "404");
        return serviceResponse;
      }
    }
    // const connection = await DatabaseProvider.getConnection();
    paymentOrderHistoryRequest.userId = loginUser.userId;
    // let paymentOrderRepository = connection.getCustomRepository(
    //   PaymentOrderRepository
    // );
    let paymentOrders = await this.paymentOrderRepository.findPaymentHistory(
      paymentOrderHistoryRequest
    );
    if (paymentOrders) {
      // const tokenplanRepository = connection.getCustomRepository(
      //   TokenPlanRepository
      // );
      let tokenPlans = await this.tokenPlanRepository.getActivePlans();
      let paymentOrdersHistory = _.map(paymentOrders, (paymentOrder: any) => {
        let tokenPlan = _.filter(
          tokenPlans,
          (item) => item.identifier == paymentOrder.tokenPlanId
        );
        paymentOrder.xiKasuTokens =
          tokenPlan && tokenPlan.length > 0 ? tokenPlan[0].xiKasuTokens : 0;
        return paymentOrder;
      });
      serviceResponse.success = true;
      serviceResponse.statusCode = "200";
      serviceResponse.result = paymentOrdersHistory;
      return serviceResponse;
    }

    return serviceResponse;
  }

  public async handleRazorpayNotificationEvent(
    eventPayLoad: any
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    let order: any = {};

    if (eventPayLoad["event"] == "payment.authorized") {
      order = this.buildOrderModel(eventPayLoad.payload.payment.entity);
      let orderResponse = this.updatePaymentOrder(order);
      return orderResponse;
    }

    if (eventPayLoad["event"] == "payment.captured") {
      order = this.buildOrderModel(eventPayLoad.payload.payment.entity);
      let orderResponse = await this.updatePaymentOrder(order);
      if (orderResponse.success) {
        // const connection = await DatabaseProvider.getConnection();
        // let tokenPlanRepository = connection.getCustomRepository(
        //   TokenPlanRepository
        // );
        let tokenPlan = await this.tokenPlanRepository.findByidentifier(
          orderResponse.result.tokenPlanId
        );
        if (tokenPlan) {
          if (!tokenPlan.xiKasuTokens) {
            let errorMessage = "XiKasu Token not found.";
            setError(serviceResponse, errorMessage, "404");
            return serviceResponse;
          }
          let dataUserTokenModel: IDataUserTokenRequest["body"] = {
            userId: orderResponse.result.userId,
            referenceNo: order.orderId,
            transactionType: "Cr",
            status: "Credited",
            tokens: tokenPlan.xiKasuTokens,
            source: XiKasuSourceEnum.Payment,
          };
          let createResponse = await tokenService.saveTokens(
            dataUserTokenModel
          );
          if (!createResponse.success) {
            let errorMessage = "Error when crediting the tokens.";
            setError(serviceResponse, errorMessage, "400");
            return serviceResponse;
          }
          serviceResponse.success = true;
          serviceResponse.statusCode = "200";
          serviceResponse.result = {
            orderId: order.orderId,
            message: "Credited XiKasu Tokens",
          };
          logger.info(
            `${tokenPlan.xiKasuTokens} XiKasu Tokens credited to the user ${orderResponse.result.userId} for the order ${order.orderId}`
          );
        }
      }

      return orderResponse;
    }

    if (eventPayLoad["event"] == "payment.failed") {
      order = this.buildOrderModel(eventPayLoad.payload.payment.entity);
      let orderResponse = this.updatePaymentOrder(order);
      return orderResponse;
    }

    if (eventPayLoad["event"] == "order.paid") {
      order = this.buildOrderModel(eventPayLoad.payload.payment.entity);
      let orderResponse = this.updatePaymentOrder(order);
      return orderResponse;
    }

    if (eventPayLoad["event"] == "refund.created") {
      let refund = this.buildRefundPaymentModel(
        eventPayLoad.payload.refund.entity
      );
      let refundResponse = this.updateRefundPayment(refund);
      return refundResponse;
    }

    return serviceResponse;
  }

  private buildOrderModel(payload: any): any {
    let paymentOrder: any = {};
    if (payload.hasOwnProperty("id")) paymentOrder.paymentId = payload.id;
    if (payload.hasOwnProperty("order_id"))
      paymentOrder.orderId = payload.order_id;
    if (payload.hasOwnProperty("status"))
      paymentOrder.razorpayStatus = payload.status;
    if (payload.hasOwnProperty("amount")) paymentOrder.amount = payload.amount;
    if (payload.hasOwnProperty("captured"))
      paymentOrder.paymentCapture = payload.captured;
    if (payload.hasOwnProperty("invoice_id"))
      paymentOrder.invoiceId = payload.invoice_id;
    if (payload.hasOwnProperty("currency"))
      paymentOrder.currency = payload.currency;
    if (payload.hasOwnProperty("method"))
      paymentOrder.paymentMethod = payload.method;
    if (payload.hasOwnProperty("amount_refunded"))
      paymentOrder.amountRefunded = payload.amount_refunded;
    if (payload.hasOwnProperty("refund_status"))
      paymentOrder.refundStatus = payload.refund_status;
    if (payload.hasOwnProperty("description"))
      paymentOrder.description = payload.description;
    if (payload.hasOwnProperty("bank")) paymentOrder.bank = payload.bank;
    if (payload.hasOwnProperty("wallet")) paymentOrder.wallet = payload.wallet;
    if (payload.hasOwnProperty("vpa")) paymentOrder.vpa = payload.vpa;
    if (payload.hasOwnProperty("email")) paymentOrder.email = payload.email;
    if (payload.hasOwnProperty("contact"))
      paymentOrder.contact = payload.contact;
    if (payload.hasOwnProperty("customer_id"))
      paymentOrder.customerId = payload.customer_id;
    if (payload.hasOwnProperty("fee")) paymentOrder.fee = payload.fee;
    if (payload.hasOwnProperty("tax")) paymentOrder.tax = payload.tax;
    if (payload.hasOwnProperty("error_code"))
      paymentOrder.errorCode = payload.error_code;
    if (payload.hasOwnProperty("error_description"))
      paymentOrder.errorMessage = payload.error_description;
    if (payload.hasOwnProperty("created_at"))
      paymentOrder.createdAt = payload.created_at;

    return paymentOrder;
  }

  private buildRefundPaymentModel(payload: any): any {
    let refundPayment: any = {};
    if (payload.hasOwnProperty("id")) refundPayment.refundId = payload.id;
    if (payload.hasOwnProperty("payment_id"))
      refundPayment.paymentId = payload.payment_id;
    if (payload.hasOwnProperty("entity")) refundPayment.entity = payload.entity;
    if (payload.hasOwnProperty("amount")) refundPayment.amount = payload.amount;
    if (payload.hasOwnProperty("currency"))
      refundPayment.currency = payload.currency;
    if (payload.hasOwnProperty("receipt"))
      refundPayment.receipt = payload.receipt;
    if (payload.hasOwnProperty("created_at"))
      refundPayment.createdAt = payload.created_at;
    if (payload.hasOwnProperty("notes"))
      refundPayment.comment = payload.notes.comment
        ? payload.notes.comment
        : null;
    if (payload.hasOwnProperty("acquirer_data"))
      refundPayment.acquirerData = payload.acquirer_data;

    return refundPayment;
  }

  private async updateRefundPayment(
    refundPayment: any
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    // const connection = await DatabaseProvider.getConnection();
    // let paymentOrderRepository = connection.getCustomRepository(
    //   PaymentOrderRepository
    // );
    let paymentOrder = await this.paymentOrderRepository.findByPaymentId(
      refundPayment.paymentId
    );
    if (paymentOrder) {
      if (refundPayment.hasOwnProperty("id"))
        paymentOrder.razorpayRefundId = refundPayment.id;
      if (refundPayment.hasOwnProperty("amount"))
        paymentOrder.amountRefunded = refundPayment.amount;
      if (refundPayment.hasOwnProperty("entity"))
        paymentOrder.refundStatus = refundPayment.entity;
      if (refundPayment.hasOwnProperty("created_at"))
        paymentOrder.refundCreatedAt = refundPayment.created_at;

      paymentOrder = await paymentOrder.save();

      // let tokenPlanRepository = connection.getCustomRepository(
      //   TokenPlanRepository
      // );
      if (paymentOrder === null) {
        let errorMessage = "Payment Order Data not found.";
        setError(serviceResponse, errorMessage, "404");
        return serviceResponse;
      }

      if (!paymentOrder.razorpayOrderId) {
        let errorMessage = "Payment Order Data not found.";
        setError(serviceResponse, errorMessage, "404");
        return serviceResponse;
      }

      let tokenPlan = await this.tokenPlanRepository.findByidentifier(
        paymentOrder.tokenPlanId
      );
      if (tokenPlan) {
        if (!tokenPlan.xiKasuTokens) {
          let errorMessage = "xiKasuTokens not found.";
          setError(serviceResponse, errorMessage, "404");
          return serviceResponse;
        }
        let dataUserTokenModel: IDataUserTokenRequest["body"] = {
          userId: paymentOrder.userId,
          referenceNo: paymentOrder.razorpayOrderId,
          transactionType: "Dr",
          status: "Debited",
          tokens: tokenPlan.xiKasuTokens,
          source: XiKasuSourceEnum.RefundPayment,
        };
        let createResponse = await tokenService.saveTokens(dataUserTokenModel);
      }

      serviceResponse.success = true;
      serviceResponse.statusCode = "200";
      serviceResponse.result = {
        paymentId: refundPayment.order_id,
        userId: paymentOrder.userId,
        tokenPlanId: paymentOrder.tokenPlanId,
        message: "Payment successfully updated.",
      };
      return serviceResponse;
    } else {
      let errorMessage = "Payment not found.";
      setError(serviceResponse, errorMessage, "404");
    }
    return serviceResponse;
  }

  private async updatePaymentOrder(order: any): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    // const connection = await DatabaseProvider.getConnection();
    // let paymentOrderRepository = connection.getCustomRepository(
    //   PaymentOrderRepository
    // );
    let paymentOrder = await this.paymentOrderRepository.findByOrderId(
      order.orderId
    );
    if (paymentOrder) {
      if (order.hasOwnProperty("razorpayStatus"))
        paymentOrder.razorpayStatus = order.razorpayStatus;
      if (order.hasOwnProperty("checkoutId"))
        paymentOrder.checkoutId = order.checkoutId;
      if (order.hasOwnProperty("paymentCapture"))
        paymentOrder.paymentCapture = order.paymentCapture;
      if (order.hasOwnProperty("errorCode"))
        paymentOrder.errorCode = order.errorCode;
      if (order.hasOwnProperty("errorMessage"))
        paymentOrder.errorMessage = order.errorMessage;
      if (order.hasOwnProperty("refundStatus"))
        paymentOrder.refundStatus = order.refundStatus;
      if (order.hasOwnProperty("amountRefunded"))
        paymentOrder.amountRefunded = order.amountRefunded;
      if (order.hasOwnProperty("disputeId"))
        paymentOrder.disputeId = order.disputeId;
      if (order.hasOwnProperty("disputeReasonCode"))
        paymentOrder.disputeReasonCode = order.disputeReasonCode;
      if (order.hasOwnProperty("disputePhase"))
        paymentOrder.disputePhase = order.disputePhase;
      if (order.hasOwnProperty("disputeCreatedAt"))
        paymentOrder.disputeCreatedAt = order.disputeCreatedAt;
      if (order.hasOwnProperty("disputeRespondBy"))
        paymentOrder.disputeRespondBy = order.disputeRespondBy;
      if (order.hasOwnProperty("paymentMethod"))
        paymentOrder.paymentMethod = order.paymentMethod;

      paymentOrder = await paymentOrder.save();

      if (paymentOrder === null) {
        let errorMessage = "Payment Order Data not found.";
        setError(serviceResponse, errorMessage, "404");
        return serviceResponse;
      }

      serviceResponse.success = true;
      serviceResponse.statusCode = "200";
      serviceResponse.result = {
        orderId: order.order_id,
        userId: paymentOrder.userId,
        tokenPlanId: paymentOrder.tokenPlanId,
        message: "Order successfully updated.",
      };
      return serviceResponse;
    } else {
      let errorMessage = "Order not found.";
      setError(serviceResponse, errorMessage, "404");
    }
    return serviceResponse;
  }

  private mapEnityToModel(
    paymentOrder: IPaymentOrderRequest["body"]
  ): IPaymentOrderRequest["body"] {
    let paymentOrderModel: IPaymentOrderRequest["body"] = {
      amount: paymentOrder.amount,
      tokenPlanId: paymentOrder.tokenPlanId,
      attempts: paymentOrder.attempts,
      checkoutId: paymentOrder.checkoutId,
      paymentCapture: paymentOrder.paymentCapture,
      razorpayOrderId: paymentOrder.razorpayOrderId,
      razorpayOrderCreatedAt: paymentOrder.razorpayOrderCreatedAt,
      razorpayPaymentId: paymentOrder.razorpayPaymentId,
      transactionId: paymentOrder.transactionId,
      currency: paymentOrder.currency,
      status: paymentOrder.status,
      razorpayStatus: paymentOrder.razorpayStatus,
      paymentMethod: paymentOrder.paymentMethod,
      userId: paymentOrder.userId,
      errorCode: paymentOrder.errorCode,
      errorMessage: paymentOrder.errorMessage,
      refundStatus: paymentOrder.refundStatus,
      amountRefunded: paymentOrder.amountRefunded,
      disputeId: paymentOrder.disputeId,
      disputeReasonCode: paymentOrder.disputeReasonCode,
      disputePhase: paymentOrder.disputePhase,
      disputeStatus: paymentOrder.disputeStatus,
      disputeCreatedAt: paymentOrder.disputeCreatedAt,
      disputeRespondBy: paymentOrder.disputeRespondBy,
    };
    return paymentOrderModel;
  }
}

export const paymentService = new PaymentService();
