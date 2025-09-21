import { Document, model, Schema } from "mongoose";

export interface IDataAccountingDoc extends Document {
  identifier: number;
  userName: string;
  startTime?: Date;
  sessionTime?: string;
  dataUsed?: {
    download?: number,
    upload?: number
  };
  calledStation?: string;
  callingStation?: string;
  locationId?: string;
  stopTime?: Date;
  terminateCause?: string;
  planId?: string;
  status?: string;
  userPlanId?: number;
  category?: string;
  referenceId?: string;
  sessionStatus?: string;
  createdOn?: Date;
  modifiedOn?: Date;
  createdBy?: string;
  modifiedBy?: string;
}

const dataAccountingSchema = new Schema({
  identifier: {
    type: Number,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
  },
  sessionTime: {
    type: String,
  },
  dataUsed: {
    download: {
      type: Number
    },
    upload: { type: Number }
  },
  calledStation: {
    type: String,
  },
  callingStation: {
    type: String,
  },
  locationId: {
    type: String,
  },
  stopTime: {
    type: Date,
  },
  terminateCause: {
    type: String,
  },
  planId: {
    type: String,
  },
  status: {
    type: String,
  },
  userPlanId: {
    type: Number,
  },
  category: {
    type: String,
  },
  referenceId: {
    type: String,
  },
  sessionStatus: {
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
}).index({ identifier: 1 }, { unique: true });

export const DataAccountingModel = model<IDataAccountingDoc>(
  "DataAccounting",
  dataAccountingSchema,
  "DataAccounting"
);

export default DataAccountingModel;
