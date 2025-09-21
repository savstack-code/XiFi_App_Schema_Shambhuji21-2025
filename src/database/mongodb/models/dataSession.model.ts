import { Document, model, Schema } from "mongoose";

export interface IDataSessionDoc extends Document {
  identifier: number;
  userName: string;
  startTime?: Date;
  sessionTime?: string;
  dataUsed?: string;
  calledStation?: string;
  callingStation?: string;
  locationId?: string;
  stopTime?: Date;
  terminateCause?: string;
  planId?: string;
  userPlanId?: number;
  status?: string;
  xiKasuTokens?: number;
  xiKasuTokenBalance?: number;
  category?: string;
  createdOn?: Date;
  modifiedOn?: Date;
  createdBy?: string;
  modifiedBy?: string;
}

const dataSessionSchema = new Schema({
  identifier: {
    type: Number,
    required: true,
    unique: true,
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
    type: String,
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
  userPlanId: {
    type: Number,
  },
  status: {
    type: String,
  },
  xiKasuTokens: {
    type: Number,
  },
  xiKasuTokenBalance: {
    type: Number,
  },
  category: {
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
});

export const DataSessionModel = model<IDataSessionDoc>(
  "DataSession",
  dataSessionSchema,
  "DataSession"
);

export default DataSessionModel;
