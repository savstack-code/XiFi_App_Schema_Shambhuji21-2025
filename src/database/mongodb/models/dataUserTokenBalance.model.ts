import { Document, model, Schema } from "mongoose";

export interface IDataUserTokenBalanceDoc extends Document {
  identifier?: number;
  userId: string;
  tokens: number;
  status?: string;
  createdOn?: Date;
  modifiedOn?: Date;
  createdBy?: string;
  modifiedBy?: string;
  previousSessionTime?: number;
  previousUses?: number;
}

const dataUserTokenBalanceSchema = new Schema({
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
  previousSessionTime: {
    type: Number,
  },
  previousUses: {
    type: Number,
  },
}).index({ userId: 1 });

export const DataUserTokenBalanceModel = model<IDataUserTokenBalanceDoc>(
  "DataUserTokenBalance",
  dataUserTokenBalanceSchema,
  "DataUserTokenBalance"
);

export default DataUserTokenBalanceModel;
