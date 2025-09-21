import { Document, model, Schema } from "mongoose";

export interface IDataUserTokenDoc extends Document {
  identifier?: number;
  userId: string;
  tokens: number;
  balance?: number;
  transactionType?: string;
  referenceNo?: string;
  status?: string;
  source?: string;
  //from and to user according the transaction type
  transUserId?: string;
  transMobileNumber?: Number;
  createdOn?: Date;
  modifiedOn?: Date;
  createdBy?: string;
  modifiedBy?: string;
}

const dataUserTokenSchema = new Schema({
  identifier: {
    type: Number,
  },
  userId: {
    type: String,
    required: true,
  },
  tokens: {
    type: Number,
    required: true,
  },
  balance: {
    type: Number,
  },
  transactionType: {
    type: String,
  },
  referenceNo: {
    type: String,
  },
  status: {
    type: String,
  },
  source: {
    type: String,
  },
  transUserId: {
    type: String,
  },
  transMobileNumber: {
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
}).index({ userId: 1 });

export const DataUserTokenModel = model<IDataUserTokenDoc>(
  "DataUserToken",
  dataUserTokenSchema,
  "DataUserToken"
);

export default DataUserTokenModel;
