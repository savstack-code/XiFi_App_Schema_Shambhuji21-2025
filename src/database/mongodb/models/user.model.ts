import { now } from "lodash";
import { Document, model, Schema } from "mongoose";
import { Any } from "typeorm";

export interface IUserDoc extends Document {
  userID: string;
  objectType: string;
  firstName: string;
  lastName?: string;
  password: string;
  deviceID?: string;
  validFrom: Date;
  validTo: Date;
  status: "Active" | "Inactive";
  userType?: string;
  mobileNumber: string;
  logonName?: string;
  emailID: string;
  reportingUserID?: string;
  image?: string;
  address?: string;
  pincode?: number;
  apUserName?: string;
  apPassword?: string;
  currentPlanId?: string;
  createdOn: Date;
  modifiedOn?: Date;
  createdBy: string;
  modifiedBy?: string;
  gender?: string;
  emailValidationFlag?: string;
  passwordExpiryDate?: Date;
  userCode?: string;
  referralCode?: any;
  referralExpired: boolean;
  asDeviceId?: string;
  railTelOrgNo?: number;
  railTelLastSessId?: number;
}

const userSchema = new Schema({
  userID: {
    type: String,
    required: true,
  },
  objectType: {
    type: String,
    required: true,
    default: "USER",
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  deviceID: {
    type: String,
  },
  validFrom: {
    type: Date,
    required: true,
  },
  validTo: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    required: true,
  },
  userType: {
    type: String,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  logonName: {
    type: String,
  },
  emailID: {
    type: String,
    required: true,
  },
  reportingUserID: {
    type: String,
  },
  image: {
    type: String,
  },
  address: {
    type: String,
  },
  pincode: {
    type: Number,
  },
  apUserName: {
    type: String,
  },
  apPassword: {
    type: String,
  },
  currentPlanId: {
    type: String,
  },
  createdOn: {
    type: Date,
    default: Date.now,
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
  gender: {
    type: String,
  },
  emailValidationFlag: {
    type: String,
  },
  passwordExpiryDate: {
    type: Date,
  },
  userCode: {
    type: String,
  },
  referralExpired: {
    type: Boolean,
  },
  asDeviceId: {
    type: String,
  },
  railTelOrgNo: {
    type: Number,
  },
  railTelLastSessId: {
    type: Number,
  },
}).index({ userID: 1 }, { unique: true });

export const UserModel = model<IUserDoc>("User", userSchema, "User");

export default UserModel;
