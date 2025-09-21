import { Document, model, Schema } from "mongoose";

export interface IDataPlanDoc extends Document {
  identifier: number;
  planName: string;
  description: string;
  planId: number;
  planType: string;
  bandwidthLimit?: number;
  timeLimit: number;
  renewalTime?: number;
  status: "Active" | "Inactive";
  expiryDate?: Date;
  tokenQuantity?: number;
  tokenValue?: number;
  maximumAdsPerDay?: number;
  validity?: number;
  uot?: string;
  priceInRupees?: number;
  xiKasuTokens: number;
  createdOn?: Date;
  modifiedOn?: Date;
  createdBy?: string;
  modifiedBy?: string;
}

const dataPlanSchema = new Schema({
  identifier: {
    type: Number,
    required: true,
    unique: true,
  },
  planName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  planId: {
    type: Number,
    required: true,
  },
  planType: {
    type: String,
    required: true,
  },
  bandwidthLimit: {
    type: Number,
  },
  timeLimit: {
    type: Number,
  },
  renewalTime: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    required: true,
  },
  expiryDate: {
    type: Date,
  },
  macAddr: {
    type: Number,
  },
  tokenQuantity: {
    type: Number,
  },
  tokenValue: {
    type: Number,
  },
  maximumAdsPerDay: {
    type: Number,
  },
  validity: {
    type: Number,
  },
  uot: {
    type: String,
  },
  priceInRupees: {
    type: Number,
  },
  xiKasuTokens: {
    type: Number,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  modifiedOn: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
    default: "System",
  },
  modifiedBy: {
    type: String,
  },
});

export const DataPlanModel = model<IDataPlanDoc>(
  "DataPlan",
  dataPlanSchema,
  "DataPlan"
);

export default DataPlanModel;
