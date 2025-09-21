import { Document, model, Schema } from "mongoose";

export interface IAdStoreDoc extends Document {
  name: string;
  url: string;
  adId: number;
  mediaType: string;
  skipTime: number;
  duration: number;
  status: "Inactive" | "Active";
  createdOn?: Date;
  modifiedOn?: Date;
  createdBy?: string;
  modifiedBy?: string;
}

const adStoreSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  adId: {
    type: Number,
    required: true,
  },
  mediaType: {
    type: String,
    required: true,
  },
  skipTime: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["Active", "Inactive"],
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
}).index({ adId: 1 });

export const AdStoreModel = model<IAdStoreDoc>(
  "AdStore",
  adStoreSchema,
  "AdStore"
);

export default AdStoreModel;
