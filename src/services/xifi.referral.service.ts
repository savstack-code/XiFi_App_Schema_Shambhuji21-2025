import { ServiceResponse } from "../models/response/ServiceResponse";
import { DatabaseProvider } from "../database/database.provider";
import { tokenService } from "../shared/services/token.service";
// import { UserRepository } from "../database/repositories/user.repository";
import { UserRepository } from "../database/mongodb/repositories/user.repository";
import { setError } from "../utils/shared";
// import DataUserTokenModel from "../shared/models/data.user.token.model";
import { IDataUserTokenRequest } from "../reqSchema/data.schema";
// import { XiKasuConfigRepository } from "../database/repositories/xiKasu.config.respository";
import { XiKasuConfigRepository } from "../database/mongodb/repositories/xiKasu.config.respository";
import _ from "lodash";
import { XiKasuSourceEnum } from "../shared/enums/xikasu.source.enum";
import { notificationService } from "../shared/services/notification.service";
// import PushNotificationMessageModel from "../shared/models/push.notification.message.model";
import { IPushNotificationMessageRequest } from "../reqSchema/profile.otp.create.schema";
// import { UserDeviceRepository } from "../database/repositories/user.device.repository";
import { UserDeviceRepository } from "../database/mongodb/repositories/user.device.repository";
import PushNotificationPayload from "../shared/models/push.notification.payload";
``;
export class XifiReferralService {
  userRepository: UserRepository;
  xiKasuConfigRepository: XiKasuConfigRepository;
  userDeviceRepository: UserDeviceRepository;
  constructor() {
    this.userRepository = new UserRepository();
    this.xiKasuConfigRepository = new XiKasuConfigRepository();
    this.userDeviceRepository = new UserDeviceRepository();
  }
  public async validateReferralCode(
    mobileNumber: string,
    referralCode: string
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    //const connection = await DatabaseProvider.getConnection();
    //const userRepository = connection.getCustomRepository(UserRepository);
    let referralUser;
    let user = await this.userRepository.findByMobileNumber(mobileNumber);
    if (referralCode) {
      referralUser = await this.userRepository.findByUserCode(referralCode);
      if (!referralUser) {
        serviceResponse.statusCode = "400";
        const errorMessage = `Invalid referral code.`;
        setError(serviceResponse, errorMessage, "404");
        return serviceResponse;
      }
    }
    if (user) {
      if (referralCode) {
        if (user.referralExpired) {
          serviceResponse.statusCode = "400";
          const errorMessage = `You have already used some one referral code.`;
          setError(serviceResponse, errorMessage, "400");
          return serviceResponse;
        }
        if (referralUser) {
          if (user.userID == referralUser.userID) {
            serviceResponse.statusCode = "400";
            const errorMessage = `You can not use your own referral code.`;
            setError(serviceResponse, errorMessage, "400");
            return serviceResponse;
          }

          if (user.userCode == referralUser.referralCode) {
            serviceResponse.statusCode = "400";
            const errorMessage = `Sorry, This Referee already used your ReferraL Code`;
            setError(serviceResponse, errorMessage, "400");
            return serviceResponse;
          }
          user.referralExpired = false;
          user.referralCode = referralCode;
          user.modifiedOn = new Date();
          let userUpdate = await user.save();

          serviceResponse.success = true;
          serviceResponse.result.message =
            "Referral Code successfully applied.";
          serviceResponse.statusCode = "200";
          return serviceResponse;
        }
      } else {
        if (!user.referralExpired && user.referralCode) {
          user.referralExpired = false;
          user.referralCode = null;
          user.modifiedOn = new Date();
          let userUpdate = await user.save();

          serviceResponse.success = true;
          serviceResponse.result.message =
            "Referral Code has been set as null.";
          serviceResponse.statusCode = "200";
          return serviceResponse;
        }
        serviceResponse.success = true;
        serviceResponse.result.message = "Referral Code has not been sent.";
        serviceResponse.statusCode = "200";
        return serviceResponse;
      }
    }
    serviceResponse.success = true;
    serviceResponse.result.message = "New User.";
    serviceResponse.statusCode = "200";
    return serviceResponse;
  }

  public async creditReferralTokens(
    userId: string,
    referralCode: string
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    const connection = await DatabaseProvider.getConnection();

    let response = await connection.transaction(async (manager) => {
      //const userRepository = manager.getCustomRepository(UserRepository); // DONT USE GLOBAL getCustomRepository here!
      if (referralCode) {
        let referralUser = await this.userRepository.findByUserCode(
          referralCode
        );
        if (referralUser) {
          let user = await this.userRepository.findByUserId(userId);
          if (user) {
            if (!user.referralExpired) {
              // const xiKasuConfigRepository = manager.getCustomRepository(
              //   XiKasuConfigRepository
              // );
              let xiKasuConfigs =
                await this.xiKasuConfigRepository.findByCategory("Referral");
              if (xiKasuConfigs && xiKasuConfigs.length > 0) {
                const refereeItem = _.find(
                  xiKasuConfigs,
                  (item) => item.code == "Referee"
                );
                const referrerItem = _.find(
                  xiKasuConfigs,
                  (item) => item.code == "Referrer"
                );
                if (refereeItem) {
                  let dataUserTokenModel: IDataUserTokenRequest = {
                    userId: user.userID,
                    referenceNo: referralUser.userID,
                    transactionType: "Cr",
                    status: "Credited",
                    tokens: refereeItem.xiKasuTokens
                      ? refereeItem.xiKasuTokens
                      : 1, //ask about required field
                    source: XiKasuSourceEnum.ReferrerBonus,
                  };
                  let userTokenResponse = await tokenService.saveTokens(
                    dataUserTokenModel
                  );
                  if (userTokenResponse.success) {
                    user.referralExpired = true;
                    user.referralCode = referralCode;
                    user.modifiedOn = new Date();
                    let userUpdate = await user.save();
                    serviceResponse.result = {
                      xiKasuTokens: refereeItem.xiKasuTokens,
                      totalTokens: userTokenResponse.result.totalTokens,
                    };
                  }
                }
                if (referrerItem) {
                  let dataReferralUserTokenModel: IDataUserTokenRequest = {
                    userId: referralUser.userID,
                    referenceNo: user.userID,
                    transactionType: "Cr",
                    status: "Credited",
                    tokens: referrerItem.xiKasuTokens
                      ? referrerItem.xiKasuTokens
                      : 1, //ask about required field
                    source: XiKasuSourceEnum.RefereeBonus,
                  };
                  let referralUserTokenResponse = await tokenService.saveTokens(
                    dataReferralUserTokenModel
                  );
                  if (referralUserTokenResponse.success) {
                    const notificationMessage: IPushNotificationMessageRequest =
                      {
                        title: "XiFi Smart Networks Referral Bonus",
                        body: `${referrerItem.xiKasuTokens} XiKasu tokens have been added to your account for referring to ${user.firstName}.`,
                      };
                    // const userDeviceRepository = connection.getCustomRepository(
                    //   UserDeviceRepository
                    // );
                    let userDevices =
                      await this.userDeviceRepository.findUserDevicesByStatus(
                        referralUser.userID,
                        "Active"
                      );
                    if (userDevices && userDevices.length > 0) {
                      const userDevice = userDevices[0];
                      if (userDevice.deviceToken) {
                        const notificationPayload: PushNotificationPayload = {
                          to: userDevice.deviceToken,
                          notification: notificationMessage,
                        };
                        let notificationResponse =
                          await notificationService.sendNotification(
                            userDevice.deviceType ? userDevice.deviceType : "",
                            notificationPayload
                          );
                      }
                    }
                  }
                }

                serviceResponse.success = true;
                serviceResponse.result.message =
                  "Referral Code successfully applied.";
                serviceResponse.statusCode = "200";
                return serviceResponse;
              } else {
                serviceResponse.statusCode = "400";
                const errorMessage = `XiKasus configuration problem. Please contact the Administrator.`;
                setError(serviceResponse, errorMessage, "400");
                return serviceResponse;
              }
            }
          } else {
            serviceResponse.statusCode = "400";
            const errorMessage = `User not existed.`;
            setError(serviceResponse, errorMessage, "404");
            return serviceResponse;
          }
        }
      }
      serviceResponse.statusCode = "400";
      const errorMessage = `Invalid referral code.`;
      setError(serviceResponse, errorMessage, "404");
      return serviceResponse;
    });
    return response;
  }
}

export const xifiReferralService = new XifiReferralService();
