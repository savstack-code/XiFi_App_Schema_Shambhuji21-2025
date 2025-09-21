import { Document, model, Schema } from "mongoose";

export interface IPaymentOrderDoc extends Document {
  // id: number;
  amount: number;
  currency: string;
  tokenPlanId: number;
  tokens?: number;
  tokenBalance?: number
  attempts: number;
  paymentCapture?: boolean;
  transactionId?: string;
  checkoutId?: string;
  razorpayOrderId: string;
  razorpayOrderCreatedAt: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentMethod?: string;
  userId: string;
  razorpayStatus?: string;
  status?: string;
  errorCode?: string;
  errorMessage?: string;
  refundStatus?: string;
  amountRefunded?: string;
  razorpayRefundId?: string;
  refundCreatedAt?: string;
  disputeId?: string;
  disputeReasonCode?: string;
  disputePhase?: string;
  disputeStatus?: string;
  disputeCreatedAt?: string;
  disputeRespondBy?: string;
  createdOn: Date;
  modifiedOn?: Date;
  createdBy: string;
  modifiedBy?: string;
}

const paymentOrderSchema = new Schema({
  // id: {
  //   type: Number,
  //   required: true,
  //   unique: true,
  // },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  tokenPlanId: {
    type: Number,
    required: true,
  },
  tokens: { type: Number },
  tokenBalance: { type: Number },
  attempts: {
    type: Number,
    required: true,
  },
  paymentCapture: {
    type: Boolean,
  },
  transactionId: {
    type: String,
  },
  checkoutId: {
    type: String,
  },
  razorpayOrderId: {
    type: String,
    required: true,
  },
  razorpayOrderCreatedAt: {
    type: String,
    required: true,
  },
  razorpayPaymentId: {
    type: String,
  },
  razorpaySignature: {
    type: String,
  },
  paymentMethod: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
  },
  razorpayStatus: {
    type: String,
  },
  status: {
    type: String,
    default: "Pending"
  },
  errorCode: {
    type: String,
  },
  errorMessage: {
    type: String,
  },
  refundStatus: {
    type: String,
  },
  amountRefunded: {
    type: String,
  },
  razorpayRefundId: {
    type: String,
  },
  refundCreatedAt: {
    type: String,
  },
  disputeId: {
    type: String,
  },
  disputeReasonCode: {
    type: String,
  },
  disputePhase: {
    type: String,
  },
  disputeStatus: {
    type: String,
  },
  disputeCreatedAt: {
    type: String,
  },
  disputeRespondBy: {
    type: String,
  },
  createdOn: {
    type: Date,
    required: true,
    default: Date.now,
  },
  modifiedOn: {
    type: Date,
  },
  createdBy: {
    type: String,
    required: true,
    default: "System",
  },
  modifiedBy: {
    type: String,
  },
});

export const PaymentOrderModel = model<IPaymentOrderDoc>(
  "PaymentOrder",
  paymentOrderSchema,
  "PaymentOrder"
);

export default PaymentOrderModel;
