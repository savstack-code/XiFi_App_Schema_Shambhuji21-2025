// import {
//   EntityRepository,
//   EntityManager,
//   MoreThanOrEqual,
//   LessThanOrEqual,
//   Between,
// } from "typeorm";
// import PaymentOrder from "../../../../shared/database/entities/PaymentOrder";
import { PaymentOrderModel } from "../../mongodb/models/paymentOrder.model";
// import PaymentOrderModel from "../../models/payment.order.model";
// import PaymentOrderHistoryRequest from "../../models/request/payment.order.history.request";
import {
  IPaymentOrderRequest,
  IPaymentOrderHistoryRequest,
} from "../../../reqSchema/payment.schema";

// @EntityRepository()
export class PaymentOrderRepository {
  //   constructor(private manager: EntityManager) {}

  createAndSave = async (paymentOrderModel: IPaymentOrderRequest["body"]) => {
    const paymentOrder = new PaymentOrderModel();
    paymentOrder.amount = paymentOrderModel.amount;
    paymentOrder.attempts = paymentOrderModel.attempts;
    paymentOrder.tokenPlanId = paymentOrderModel.tokenPlanId;
    paymentOrder.checkoutId = paymentOrderModel.checkoutId;
    paymentOrder.currency = paymentOrderModel.currency;
    paymentOrder.paymentCapture = paymentOrderModel.paymentCapture;
    paymentOrder.razorpayOrderId = paymentOrderModel.razorpayOrderId;
    paymentOrder.razorpayOrderCreatedAt =
      paymentOrderModel.razorpayOrderCreatedAt;
    paymentOrder.razorpayPaymentId = paymentOrderModel.razorpayPaymentId;
    paymentOrder.razorpaySignature = paymentOrderModel.razorpaySignature;
    paymentOrder.razorpayStatus = paymentOrderModel.razorpayStatus;
    paymentOrder.status = paymentOrderModel.status;
    paymentOrder.transactionId = paymentOrderModel.transactionId;
    paymentOrder.userId = paymentOrderModel.userId;
    paymentOrder.errorCode = paymentOrderModel.errorCode;
    paymentOrder.errorMessage = paymentOrderModel.errorMessage;
    paymentOrder.refundStatus = paymentOrderModel.refundStatus;
    paymentOrder.amountRefunded = paymentOrderModel.amountRefunded;
    paymentOrder.disputeId = paymentOrderModel.disputeId;
    paymentOrder.disputeReasonCode = paymentOrderModel.disputeReasonCode;
    paymentOrder.disputePhase = paymentOrderModel.disputePhase;
    paymentOrder.disputeStatus = paymentOrderModel.disputeStatus;
    paymentOrder.disputeCreatedAt = paymentOrderModel.disputeCreatedAt;
    paymentOrder.disputeRespondBy = paymentOrderModel.disputeRespondBy;
    paymentOrder.paymentMethod = paymentOrderModel.paymentMethod;
    paymentOrder.modifiedBy = "System";
    paymentOrder.createdBy = "System";
    paymentOrder.createdOn = new Date();
    return paymentOrder.save();
    // return this.manager.save(paymentOrder);
  };

  update = async (paymentOrder: IPaymentOrderRequest["body"]) => {
    const paymentOrderData = new PaymentOrderModel(paymentOrder);
    return paymentOrderData.save();
    // return this.manager.save(paymentOrder);
  };

  findByOrderId(orderId: string) {
    // return this.manager.findOne(PaymentOrder, {
    //   where: { razorpayOrderId: orderId },
    // });
    return PaymentOrderModel.findOne({ razorpayOrderId: orderId });
  }

  findByPaymentId(paymentId: string) {
    // return this.manager.findOne(PaymentOrder, {
    //   where: { razorpayPaymentId: paymentId },
    // });
    return PaymentOrderModel.findOne({ razorpayPaymentId: paymentId });
  }

  findByOrderAndUserId(orderId: string, userId: string) {
    // return this.manager.findOne(PaymentOrder, {
    //   where: { razorpayOrderId: orderId, userId: userId },
    // });
    return PaymentOrderModel.findOne({
      razorpayOrderId: orderId,
      userId: userId,
    });
  }

  findPaymentHistory(
    paymentOrderHistoryRequest: IPaymentOrderHistoryRequest["body"]
  ) {
    let condition: any = { userId: paymentOrderHistoryRequest.userId };
    if (
      paymentOrderHistoryRequest.hasOwnProperty("orderFromDate") &&
      paymentOrderHistoryRequest.hasOwnProperty("orderToDate")
    ) {
      // condition.createdOn = Between(
      //     paymentOrderHistoryRequest.orderFromDate,
      //     paymentOrderHistoryRequest.orderToDate
      //   );
      condition.createdOn = {
        $gte: paymentOrderHistoryRequest.orderFromDate,
        $lt: paymentOrderHistoryRequest.orderToDate,
      };
    }

    // return this.manager.find(PaymentOrder, {
    //   order: {
    //     createdOn: "DESC",
    //   },
    //   select: [
    //     "id",
    //     "amount",
    //     "attempts",
    //     "tokenPlanId",
    //     "checkoutId",
    //     "currency",
    //     "paymentCapture",
    //     "razorpayOrderId",
    //     "razorpayPaymentId",
    //     "razorpayStatus",
    //     "paymentMethod",
    //     "status",
    //     "userId",
    //     "errorCode",
    //     "errorMessage",
    //     "razorpayRefundId",
    //     "refundStatus",
    //     "refundCreatedAt",
    //     "amountRefunded",
    //     "disputeId",
    //     "disputeReasonCode",
    //     "disputePhase",
    //     "disputeStatus",
    //     "disputeCreatedAt",
    //     "disputeRespondBy",
    //     "createdOn",
    //   ],
    //   where: condition,
    //   skip:
    //     (paymentOrderHistoryRequest.currentPage - 1) *
    //     paymentOrderHistoryRequest.pageSize,
    //   take: paymentOrderHistoryRequest.pageSize,
    // });

    return PaymentOrderModel.find(condition)
      .select([
        "id",
        "amount",
        "attempts",
        "tokenPlanId",
        "checkoutId",
        "currency",
        "paymentCapture",
        "razorpayOrderId",
        "razorpayPaymentId",
        "razorpayStatus",
        "paymentMethod",
        "status",
        "userId",
        "errorCode",
        "errorMessage",
        "razorpayRefundId",
        "refundStatus",
        "refundCreatedAt",
        "amountRefunded",
        "disputeId",
        "disputeReasonCode",
        "disputePhase",
        "disputeStatus",
        "disputeCreatedAt",
        "disputeRespondBy",
        "createdOn",
        "tokens",
        "tokenBalance"
      ])
      .sort({
        createdOn: "DESC",
      })
      .skip(
        (paymentOrderHistoryRequest.currentPage - 1) *
        paymentOrderHistoryRequest.pageSize
      )
      .limit(paymentOrderHistoryRequest.pageSize);
  }
}
