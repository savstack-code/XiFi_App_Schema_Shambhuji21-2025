import { Document, model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IPdoaConfigDoc extends Document {
  id: number; // is id will unique or require ? Ask about it
  pdoaId: string;
  pdoaPublicKey: string;
  updateDataPolicyUrl: string;
  stopUserSessionUrl: string;
  apUrl?: string;
  apiBasePath?: string;
  keyExp: number;
  createdOn?: Date;
  modifiedOn?: Date;
  createdBy?: string;
  modifiedBy?: string;
  pdoaName: string;
  imageUrl: string;
  provider: "own" | "cDot";
}

const pdoaConfigSchema = new Schema({
  id: { type: Number },
  pdoaId: {
    type: String,
    required: true,
    default: uuidv4,
  },
  pdoaPublicKey: {
    type: String,
    required: true,
  },
  updateDataPolicyUrl: {
    type: String,
    required: true,
  },
  stopUserSessionUrl: {
    type: String,
    required: true,
  },
  apUrl: String,
  apiBasePath: {
    type: String,
  },
  keyExp: {
    type: Number,
    required: true,
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
  pdoaName: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  provider: { type: String, enum: ["own", "cDot"], default: "own" },
}).index({ pdoaId: 1 }, { unique: true });

export const PdoaConfigModel = model<IPdoaConfigDoc>(
  "PdoaConfig",
  pdoaConfigSchema,
  "PdoaConfig"
);

export default PdoaConfigModel;
