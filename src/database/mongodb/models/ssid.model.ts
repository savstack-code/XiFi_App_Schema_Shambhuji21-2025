import { Document, model, Schema } from "mongoose";

export interface ISSIDDoc extends Document {
  providerID: string;
  locationName: string;
  state: string;
  locationType: string;
  cPURL: string;
  /** Old implementation */
  latitude: string;
  langitude: string;

  /** for Geo near query */
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  address: string;
  deviceID: string;
  status: "Active" | "InActive";
  sSID: string;
  openBetween: string;
  avgSpeed: number;
  freeBand: number;
  paymentModes: string;
  createdOn: Date;
  modifiedOn?: Date;
  createdBy?: string;
  modifiedBy?: string;
  loginScheme: string;
  description: string;
}

const ssidSchema = new Schema({
  providerID: { type: String, required: true },
  locationName: { type: String, required: true },
  state: { type: String, required: true },
  locationType: { type: String, required: true },
  cPURL: { type: String, required: true },
  latitude: { type: String, required: true },
  langitude: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true },
  },

  deviceID: { type: String, required: true },
  status: { type: String, enum: ["Active", "InActive"], required: true },
  sSID: { type: String, required: true },
  openBetween: { type: String, required: true },
  avgSpeed: { type: Number, required: true },
  freeBand: { type: Number, required: true, default: 0 },
  paymentModes: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
  modifiedOn: Date,
  createdBy: { type: String, default: "ADMIN" },
  modifiedBy: String,
  loginScheme: String,
  description: String,
})
  .index({ status: 1 })
  .index({ providerId: 1 })
  .index({ deviceID: 1 }, { unique: true })
  .index({ location: "2dsphere" });

export const SSIDModel = model<ISSIDDoc>("ssids", ssidSchema, "ssids");

export default SSIDModel;
