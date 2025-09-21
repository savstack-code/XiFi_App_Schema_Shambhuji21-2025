import { Document, model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IUserDeviceDoc extends Document {
  identifier: string;
  userId: string;
  deviceId: string;
  playerId?: string;
  status?: string;
  deviceType?: string;
  deviceToken?: string;
  createdOn?: Date;
  modifiedOn?: Date;
  createdBy?: string;
  modifiedBy?: string;
  pdoaId?: string;
  OSType?: string;
  OSVersion?: string;
  deviceModel?: string;
  lat?: number;
  lng?: number;
  locationUpdatedOn?: Date;
  macAddr?: string;
}

const userDeviceSchema = new Schema({
  identifier: {
    type: String,
    required: true,
    default: uuidv4,
  },
  userId: {
    type: String,
    required: true,
  },
  deviceId: {
    type: String,
    required: true,
  },
  playerId: {
    type: String,
  },
  status: {
    type: String,
  },
  deviceType: {
    type: String,
  },
  deviceToken: {
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
  pdoaId: {
    type: String,
  },
  OSType: {
    type: String,
  },
  OSVersion: {
    type: String,
  },
  deviceModel: {
    type: String,
  },
  lat: {
    type: Number,
  },
  lng: {
    type: Number,
  },
  locationUpdatedOn: {
    type: Date,
  },
  macAddr: {
    type: String,
  },
});

export const UserDeviceModel = model<IUserDeviceDoc>(
  "UserDevice",
  userDeviceSchema,
  "UserDevice"
);

export default UserDeviceModel;
