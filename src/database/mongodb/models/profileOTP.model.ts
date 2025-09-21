import { Document, model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
export interface IProfileOTPDoc extends Document {
  identifier: string;
  userId?: string;
  deviceId: string;
  mobileNumber?: string;
  otp: number;
  createdOn?: Date;
}

const profileOTPSchema = new Schema({
  identifier: {
    type: String,
    required: true,
    default: uuidv4,
  },
  userId: {
    type: String,
  },
  deviceId: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
  },
  otp: {
    type: Number,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
})
  .index({ identifier: 1 }, { unique: true })
  .index({ deviceId: 1 })
  .index({ mobileNumber: 1 });

export const ProfileOTPModel = model<IProfileOTPDoc>(
  "ProfileOTP",
  profileOTPSchema,
  "ProfileOTP"
);

export default ProfileOTPModel;
