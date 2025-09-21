import { Document, model, Schema } from "mongoose";
// import { v4 as uuidv4 } from "uuid";

export interface IXifiVoucherDoc extends Document {
  identifier: number;
  code: string;
  description?: string;
  status?: string;
  expiryTime: Date;
  allowCount: number;
  redeemCount: number;
  xiKasuTokens?: number;
  createdOn?: Date;
  modifiedOn?: Date;
  createdBy?: string;
  modifiedBy?: string;
}

const xifiVoucherSchema = new Schema({
  identifier: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
  },
  expiryTime: {
    type: Date,
    required: true,
  },
  allowCount: {
    type: Number,
    required: true,
  },
  redeemCount: {
    type: Number,
    default: 0,
  },
  xiKasuTokens: {
    type: Number,
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
}).index({ identifier: 1 }, { unique: true });

export const XifiVoucherModel = model<IXifiVoucherDoc>(
  "XifiVoucher",
  xifiVoucherSchema,
  "XifiVoucher"
);

export default XifiVoucherModel;
