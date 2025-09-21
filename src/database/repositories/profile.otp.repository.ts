import { EntityRepository, EntityManager } from "typeorm";
import ProfileOtp from "../../shared/database/entities/ProfileOTP";
import ProfileOtpCreateRequest from "../../models/request/profile.otp.create.request";

@EntityRepository()
export class ProfileOtpRepository {
  constructor(private manager: EntityManager) {}

  async createAndSave(request: ProfileOtpCreateRequest) {
    const po = new ProfileOtp();
    po.userId = request.userId;
    po.mobileNumber = request.mobileNumber;
    po.deviceId = request.deviceId;
    po.otp = request.otp;
    po.createdOn = new Date();
    return this.manager.save(po);
  }

  async findOne(mobileNumber: string, deviceId: string) {
    return this.manager.findOne(ProfileOtp, {
      order: {
        createdOn: "DESC",
        identifier: "DESC",
      },
      where: { mobileNumber: mobileNumber, deviceId: deviceId },
    });
  }
}
