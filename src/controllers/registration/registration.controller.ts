import { registrationService } from "../../services/registration.service";
// import UserUpdateRequest from "../../models/request/user.update.request";
import {
  IUserCreateRequest,
  IUserUpdateRequest,
} from "../../reqSchema/user.create.schema";

import UserDeviceTokenSaveRequest from "../../models/request/user.device.token.save.request";
// import { IUserCreateRequest } from "../../models/schema/user.create.schema";

// export const userRegistration = async (request: IUserCreateRequest["body"]) => {
//   const result = await registrationService.register(request);
//   return result;
// };

export const updateProfile = async (request: IUserUpdateRequest) => {
  const result = await registrationService.updateProfile(request);
  return result;
};

export const verifyOtp = async (
  mobileNumber: string,
  deviceId: string,
  otp: number,
  countryCode?: string
) => {
  const result = await registrationService.verifyOtp(
    mobileNumber,
    deviceId,
    otp,
    countryCode
  );
  return result;
};

export const signOff = async (userDeviceId: string) => {
  const result = await registrationService.signOff(userDeviceId);
  return result;
};

export const signOffAllDevices = async (mobileNumber: string) => {
  const result = await registrationService.signOffAllDevices(mobileNumber);
  return result;
};

export const getProfile = async () => {
  const result = await registrationService.getProfile();
  return result;
};

export const getProfileByMobile = async (body: any) => {
  const result = await registrationService.getProfileByMobile(body);
  return result;
};
export const resetReferralCode = async (mobileNumber: string) => {
  const result = await registrationService.resetReferralCode(mobileNumber);
  return result;
};

export const registerUserDeviceToken = async (
  reuest: UserDeviceTokenSaveRequest
) => {
  const result = await registrationService.registerDeviceToken(reuest);
  return result;
};
