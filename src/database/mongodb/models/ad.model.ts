import { Document, model, Schema } from "mongoose";

export interface IAdDoc extends Document {
  identifier?: string;
  url: string;
  skipTime: number;
  planId: number;
  adViewedOn?: Date;
  userId: string;
  status: string;
  createdOn?: Date;
  modifiedOn?: Date;
  createdBy?: string;
  modifiedBy?: string;
  pdoaId?: string;
}

const adSchema = new Schema({
  identifier: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
  skipTime: {
    type: String,
    required: true,
  },
  planId: {
    type: Number,
    required: true,
  },
  adViewedOn: {
    type: Date,
  },
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  modifiedOn: {
    type: Date,
  },
  createdBy: {
    type: String,
    default: "System",
  },
  modifiedBy: {
    type: String,
    default: "System",
  },
  pdoaId: {
    type: String,
  },
}).index({ planId: 1 });

export const AdModel = model<IAdDoc>("Ad", adSchema, "Ad");

export default AdModel;
