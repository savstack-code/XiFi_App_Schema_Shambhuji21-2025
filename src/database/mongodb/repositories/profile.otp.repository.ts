// import { EntityRepository, EntityManager } from "typeorm";
// import ProfileOtp from "../../../shared/database/entities/ProfileOTP";
// import ProfileOtpCreateRequest from "../../../models/request/profile.otp.create.request";

import { ProfileOTPModel } from "../models/profileOTP.model";
import { IProfileOtpCreateRequest } from "../../../reqSchema/profile.otp.create.schema";

//@EntityRepository()
export class ProfileOtpRepository {
  //constructor(private manager: EntityManager) {}

  async createAndSave(request: IProfileOtpCreateRequest["body"]) {
    const po = new ProfileOTPModel();
    po.userId = request.userId;
    po.mobileNumber = request.mobileNumber;
    po.deviceId = request.deviceId;
    po.otp = request.otp;
    po.createdOn = new Date();
    // return this.manager.save(po);
    return po.save();
  }

  async findOne(mobileNumber: string, deviceId: string) {
    // return this.manager.findOne(ProfileOtp, {
    //   order: {
    //     createdOn: "DESC",
    //     identifier: "DESC",
    //   },
    //   where: { mobileNumber: mobileNumber, deviceId: deviceId },
    // });

    return ProfileOTPModel.findOne({
      mobileNumber: mobileNumber,
      deviceId: deviceId,
    }).sort({
      createdOn: "desc",
      identifier: "desc",
    });
  }
}
