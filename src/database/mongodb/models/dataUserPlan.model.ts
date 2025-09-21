import { Document, model, Schema } from "mongoose";

export interface IDataUserPlanDoc extends Document {
  // id: number;
  userId: string;
  status: string;
  planId: number;
  bandwidthLimit: number;
  remainingData: number;
  planExpiryDate: Date;
  createdOn?: Date;
  modifiedOn?: Date;
  createdBy?: string;
  modifiedBy?: string;
}

const dataUserPlanSchema = new Schema({
  // id: {
  //   type: Number,
  //   required: true,
  // },
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  planId: {
    type: Number,
    required: true,
  },
  bandwidthLimit: {
    type: Number,
    required: true,
  },
  remainingData: {
    type: Number,
    required: true,
  },
  planExpiryDate: {
    type: Date,
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
  },
  modifiedBy: {
    type: String,
  },
}).index({ id: 1 }, { unique: true });

export const DataUserPlanModel = model<IDataUserPlanDoc>(
  "DataUserPlan",
  dataUserPlanSchema,
  "DataUserPlan"
);

export default DataUserPlanModel;
