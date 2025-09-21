import { Document, model, Schema } from "mongoose";

export interface IAPRequestDoc extends Document {
  latitude?: number;
  longitude?: number;
  deviceId: string;
  message?: string;
  createdOn?: Date;
}

const aPRequestSchema = new Schema({
  latitude: {
    type: Number,
    default: 0,
  },
  longitude: {
    type: Number,
    default: 0,
  },
  deviceId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  createdOn: {
    type: Date,
  },
}).index({ deviceId: 1 });

export const APRequestModel = model<IAPRequestDoc>(
  "APRequest",
  aPRequestSchema,
  "APRequest"
);

export default APRequestModel;
