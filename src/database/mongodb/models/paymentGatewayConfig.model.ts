import { Document, model, Schema } from "mongoose";

export interface IPaymentGatewayConfigDoc extends Document {
  id: number;
  providerName: string;
  urlScheme?: string;
  baseUrlSegment?: string;
  keyId?: string;
  keySecret?: string;
  status?: string;
  createdOn?: Date;
  modifiedOn?: Date;
  createdBy?: string;
  modifiedBy?: string;
}

const paymentGatewayConfigSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  providerName: {
    type: String,
    required: true,
  },
  urlScheme: {
    type: String,
  },
  baseUrlSegment: {
    type: String,
  },
  keyId: {
    type: String,
  },
  keySecret: {
    type: String,
  },
  status: {
    type: String,
  },
  createdOn: {
    type: Date,
  },
  modifiedOn: {
    type: Date,
  },
  createdBy: {
    type: String,
  },
  modifiedBy: {
    type: String,
  },
});

export const PaymentGatewayConfigModel = model<IPaymentGatewayConfigDoc>(
  "PaymentGatewayConfig",
  paymentGatewayConfigSchema,
  "PaymentGatewayConfig"
);

export default PaymentGatewayConfigModel;
