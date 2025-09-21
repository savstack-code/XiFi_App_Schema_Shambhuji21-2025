export default interface ProfileOtpCreateRequest {
  userId?: string;
  mobileNumber?: string;
  deviceId: string;
  otp: number;
  createdOn: Date;
}
