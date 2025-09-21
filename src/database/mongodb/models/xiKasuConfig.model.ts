import { Document, model, Schema } from "mongoose";

export interface IXiKasuConfigDoc extends Document {
  id: number;
  code: string;
  description?: string;
  xiKasuTokens?: number;
  bandwidth?: string;
  time?: number;
  category?: string;
  status?: string;
  createdOn?: Date;
  modifiedOn?: Date;
  createdBy?: string;
  modifiedBy?: string;
}

const XiKasuConfigSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  xiKasuTokens: {
    type: Number,
  },
  bandwidth: {
    type: String,
  },
  time: {
    type: Number,
  },
  category: {
    type: String,
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
}).index({ id: 1 }, { unique: true });

export const XiKasuConfigModel = model<IXiKasuConfigDoc>(
  "XiKasuConfig",
  XiKasuConfigSchema,
  "XiKasuConfig"
);

export default XiKasuConfigModel;
