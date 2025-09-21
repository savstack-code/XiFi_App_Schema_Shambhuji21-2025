import { Document, model, Schema } from "mongoose";

export interface ITabPdoaDoc extends Document {
  identifier: number;
  appUrl: string;
  emailID: string;
  providerID: string;
  name: string;
  mobilePhone: string;
  status?: string;
  iKey?: string;
  keyCode?: string;
  createdOn?: Date;
  modifiedOn?: Date;
  createdBy?: string;
  modifiedBy?: string;
  description?: string;
}

const tabPdoaSchema = new Schema({
  identifier: {
    type: Number,
    required: true,
  },
  appUrl: {
    type: String,
    required: true,
  },
  emailID: {
    type: String,
    required: true,
  },
  providerID: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  mobilePhone: {
    type: String,
    required: true,
  },
  status: {
    type: String,
  },
  iKey: {
    type: String,
  },
  keyCode: {
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
  description: {
    type: String,
  },
}).index({ identifier: 1 }, { unique: true });

export const TabPdoaModel = model<ITabPdoaDoc>(
  "TAB_PDOA",
  tabPdoaSchema,
  "TAB_PDOA"
);

export default TabPdoaModel;
