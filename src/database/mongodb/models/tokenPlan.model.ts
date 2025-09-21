import { Document, model, Schema } from "mongoose";

export interface ITokenPlanDoc extends Document {
  identifier: number;
  name: string;
  amount?: number;
  xiKasuTokens?: number;
  status?: string;
  currency?: string;
  description?: string;
  createdOn?: Date;
  modifiedOn?: Date;
  createdBy?: string;
  modifiedBy?: string;
}

const tokenPlanSchema = new Schema({
  identifier: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
  },
  xiKasuTokens: {
    type: Number,
  },
  status: {
    type: String,
  },
  currency: {
    type: String,
  },
  description: {
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
}).index({ identifier: 1 }, { unique: true });

export const TokenPlanModel = model<ITokenPlanDoc>(
  "TokenPlan",
  tokenPlanSchema,
  "TokenPlan"
);

export default TokenPlanModel;
