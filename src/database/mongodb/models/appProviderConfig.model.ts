import { Document, model, Schema } from "mongoose";

export interface IAppProviderConfigDoc extends Document {
  id: number;
  appProviderId: string;
  publicKey: string;
  privateKey: string;
  expiration?: string;
  createdOn?: Date;
  modifiedOn?: Date;
  createdBy?: string;
  modifiedBy?: string;
}

const appProviderConfigSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  appProviderId: {
    type: String,
    required: true,
  },
  publicKey: {
    type: String,
    required: true,
  },
  privateKey: {
    type: String,
    required: true,
  },
  expiration: {
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
}).index({ id: 1 }, { unique: true });

export const AppProviderConfigModel = model<IAppProviderConfigDoc>(
  "AppProviderConfig",
  appProviderConfigSchema,
  "AppProviderConfig"
);

export default AppProviderConfigModel;
