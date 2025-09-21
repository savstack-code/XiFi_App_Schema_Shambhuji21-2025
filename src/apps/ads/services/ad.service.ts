// import { DatabaseProvider } from "../database/database.provider";
// import { AdRepository } from "../database/repositories/ad.repository";
import { AdRepository } from "../../../database/mongodb/repositories/ad.repository";
// import AdModel from "../models/ad.model";
// import { IAdDoc } from "../../../database/mongodb/models/ad.model";
import { IAdCreateRequest } from "../../../reqSchema/ad.schema";
import logger from "../../../config/winston.logger";
import _ from "lodash";
// import { DataPlanRepository } from "../database/repositories/data.plan.repository";
import { DataPlanRepository } from "../../../database/mongodb/repositories/data.plan.repository";
import { AdSessionInfo } from "../models/ad.session.info.model";
import request from "request-promise";
import { tokenService } from "../../../shared/services/token.service";
import Ad from "../../../shared/database/entities/Ad";
//import { AdStoreRepository } from "../database/repositories/ad.store.repository";
import { AdStoreRepository } from "../../../database/mongodb/repositories/ad.store.repository";
// import { UserRepository } from "../database/repositories/user.repository";
import { UserRepository } from "../../../database/mongodb/repositories/user.repository";
import { userDeviceService } from "../../../services/user.device.service";
// import DataUserTokenModel from "../../../shared/models/data.user.token.model";
import { IDataUserTokenRequest } from "../../../reqSchema/data.user.token.schema";
import { XiKasuSourceEnum } from "../../../shared/enums/xikasu.source.enum";
// import DataUserPolicyModel from "../../../models/dataUserPlan/data.user.policy.model";
import { IDataUserPolicyRequest } from "../../../reqSchema/data.user.plan.schema";
import { dataConnectService } from "../../../shared/services/data.connect.service";
// import { UserDeviceRepository } from "../../../database/repositories/user.device.repository";
import { UserDeviceRepository } from "../../../database/mongodb/repositories/user.device.repository";
import { ServiceResponse } from "../../../models/response/ServiceResponse";
import { string } from "joi";

export class AdService {
  dataPlanRepository: DataPlanRepository;
  userRepository: UserRepository;
  userDeviceRepository: UserDeviceRepository;
  adStoreRepository: AdStoreRepository;
  adRepository: AdRepository;
  constructor() {
    this.dataPlanRepository = new DataPlanRepository();
    this.userRepository = new UserRepository();
    this.userDeviceRepository = new UserDeviceRepository();
    this.adStoreRepository = new AdStoreRepository();
    this.adRepository = new AdRepository();
  }
  public async getAnAd(planType: string): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    let loginUser = userDeviceService.getLoginUser();
    if (!loginUser) {
      serviceResponse.statusCode = "404";
      serviceResponse.errors.push("User Device Id not found.");
      return serviceResponse;
    }

    // const connection = await DatabaseProvider.getConnection(); // Comment by NT
    // let dataPlanRepository = connection.getCustomRepository(DataPlanRepository); // Comment by NT
    // console.log("planType", planType);
    let dataPlan = await this.dataPlanRepository.findByPlanType(planType);

    // console.log("dataPlan", dataPlan);
    if (!dataPlan) {
      serviceResponse.statusCode = "404";
      serviceResponse.errors.push("Not a valid plantype.");
      return serviceResponse;
    }
    // let userRepository = connection.getCustomRepository(UserRepository);
    let user = await this.userRepository.findByUserId(loginUser.userId);
    if (!user) {
      serviceResponse.statusCode = "404";
      serviceResponse.errors.push("User not found.");
      return serviceResponse;
    }
    // let adRepository = connection.getCustomRepository(AdRepository);
    let viewedAds = await this.adRepository.findTodayAdsByUserPlan(
      "Viewed",
      dataPlan.planId,
      user.userID
    );
    if (
      dataPlan.maximumAdsPerDay &&
      viewedAds &&
      viewedAds.length >= dataPlan.maximumAdsPerDay
    ) {
      let sessionInfo = new AdSessionInfo();
      let message = "You have reached the maximum ads limit for today.";
      this.setAdSuccessServiceResponse(
        serviceResponse,
        "ExceedLimit",
        message,
        sessionInfo
      );
      return serviceResponse;
    }
    if (planType == process.env.XIFI_FREE_PLAN) {
      let latestAd = await this.adRepository.findLatestAd(
        dataPlan.planId,
        user.userID
      );
      if (latestAd) {
        if (latestAd.status == "Viewed") {
          let xifiFreePlanExtraTime = parseInt(
            process.env.XIFI_FREE_PLAN_EXTRA_TIME
              ? process.env.XIFI_FREE_PLAN_EXTRA_TIME
              : "0"
          );
          let planTimeLimit = dataPlan.timeLimit ? dataPlan.timeLimit : 0; //Ask about it

          let differenceTime = latestAd.adViewedOn
            ? (new Date().getTime() - new Date(latestAd.adViewedOn).getTime()) /
              1000
            : 0; //Ask about it
          //expired
          if (differenceTime >= planTimeLimit) {
            let renewalTime =
              latestAd.adViewedOn && dataPlan.renewalTime && dataPlan.timeLimit
                ? new Date(latestAd.adViewedOn).setSeconds(
                    dataPlan.renewalTime + dataPlan.timeLimit
                  )
                : 0; // Ask about it
            let renewalDifferenceTime = Math.ceil(
              renewalTime - new Date().getTime()
            ); //in milli seconds
            if (renewalDifferenceTime > 0) {
              let renewalTimeInSeconds = Math.round(
                renewalDifferenceTime / 1000
              );
              let sessionInfo = new AdSessionInfo();
              sessionInfo.remainingTime = "0";
              sessionInfo.renewalTime = renewalTimeInSeconds;
              let timeObject = this.convertMS(renewalDifferenceTime);
              let message = `Please wait for ${_.padStart(
                timeObject.hour.toString(),
                2,
                "0"
              )} hour(s) ${_.padStart(
                timeObject.minute.toString(),
                2,
                "0"
              )} minutes to use XiFi Free. Meanwhile you can collect XiKasu and redeem them in XiFiNow and XiFiMax`;
              this.setAdSuccessServiceResponse(
                serviceResponse,
                "Expired",
                message,
                sessionInfo
              );
              return serviceResponse;
            }
          }
          //in session
          if (differenceTime < planTimeLimit) {
            let remainingTime = Math.round(planTimeLimit - differenceTime);
            let sessionInfo = new AdSessionInfo();
            sessionInfo.remainingTime = remainingTime.toString();
            sessionInfo.renewalTime = dataPlan.renewalTime
              ? dataPlan.renewalTime
              : 0;
            let remainingTimeInMinutes = Math.floor(remainingTime / 60);
            let seconds = Math.round(remainingTime % 60);
            let message = `You already in Free plan. You can access free wifi for another ${_.padStart(
              remainingTimeInMinutes.toString(),
              2,
              "0"
            )}:${_.padStart(seconds.toString(), 2, "0")} mins.`;
            this.setAdSuccessServiceResponse(
              serviceResponse,
              "InSession",
              message,
              sessionInfo
            );
            return serviceResponse;
          }
        }
      }
      //fresh
      let freshAddResponse = await this.getAFreshAdd(
        dataPlan.planId,
        user.userID,
        planType
      );
      if (freshAddResponse.success) {
        this.setAdSuccessServiceResponse(
          serviceResponse,
          "Fresh",
          "",
          freshAddResponse.result.sessionInfo
        );
        return serviceResponse;
      }
    } else if (planType == process.env.XI_KASU_PLAN) {
      //fresh
      let freshAddResponse = await this.getAFreshAdd(
        dataPlan.planId,
        user.userID,
        planType
      );
      if (freshAddResponse.success) {
        this.setAdSuccessServiceResponse(
          serviceResponse,
          "Fresh",
          "",
          freshAddResponse.result.sessionInfo
        );
        return serviceResponse;
      }
    } else {
      serviceResponse.statusCode = "404";
      serviceResponse.errors.push("Not a valid plantype.");
      return serviceResponse;
    }
    return serviceResponse;
  }

  private setAdSuccessServiceResponse(
    serviceResponse: ServiceResponse,
    state: string,
    message: string,
    sessionInfo: AdSessionInfo
  ) {
    serviceResponse.success = true;
    serviceResponse.statusCode = "200";
    serviceResponse.result = {
      state: state,
      message: message,
      sessionInfo: sessionInfo,
    };
  }

  private async getAFreshAdd(
    planId: number,
    userId: string,
    planType: string
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    let loginUser = userDeviceService.getLoginUser();
    if (!loginUser && planType != process.env.XI_KASU_PLAN) {
      serviceResponse.statusCode = "404";
      serviceResponse.errors.push("User Device Id not found.");
      return serviceResponse;
    }
    // const connection = await DatabaseProvider.getConnection();
    // let adStoreRepository = connection.getCustomRepository(AdStoreRepository);
    let adRecords = await this.adStoreRepository.findAll();
    if (adRecords && adRecords.length > 0) {
      let adIndex = 0;
      // let adRepository = connection.getCustomRepository(AdRepository);
      let latestAd: any = await this.adRepository.findLatestAd(planId, userId);
      if (latestAd) {
        let index = _.findIndex(adRecords, (o) => o.url == latestAd.url);
        if (index == adRecords.length - 1) {
          adIndex = 0;
        } else {
          adIndex = index + 1;
        }
      }
      let adRecord = adRecords[adIndex];
      if (adRecord) {
        let htmlString = `<html>  
                                    <body>
                                    <video id="myVideo" autoplay width="100%">
                                        <source src="${adRecord.url}">
                                    </video>
                                    </body>
                                </html> `;
        let adModel = {
          // Ask about this error
          skipTime: adRecord.skipTime,
          url: adRecord.url,
          planId: planId,
          userId: userId,
          status: "Active",
          pdoaId: loginUser.pdoaId,
        };
        // let adRepository = connection.getCustomRepository(AdRepository);
        let ad = await this.adRepository.createAndSave(adModel);
        if (ad) {
          serviceResponse.success = true;
          serviceResponse.statusCode = "200";
          let sessionInfo = new AdSessionInfo();
          sessionInfo.adId = ad._id; // Ask aout it
          sessionInfo.skipTime = adModel.skipTime
            ? adModel.skipTime.toString()
            : "0"; // ask about it
          sessionInfo.durationTime = adRecord.duration
            ? adRecord.duration.toString()
            : "0"; // ask about it
          sessionInfo.adUrl = htmlString;
          serviceResponse.result = {
            state: "Fresh",
            sessionInfo: sessionInfo,
          };
        }
      }
    }
    return serviceResponse;
  }

  public async completeAdNotification(
    pdoaIdIn: any,
    planType: string,
    adId: string
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    let loginUser = userDeviceService.getLoginUser();
    if (!loginUser) {
      serviceResponse.statusCode = "404";
      serviceResponse.errors.push("User Device Id not found.");
      return serviceResponse;
    }
    // const connection = await DatabaseProvider.getConnection();
    // let dataPlanRepository = connection.getCustomRepository(DataPlanRepository);
    let dataPlan = await this.dataPlanRepository.findByPlanType(planType);
    if (!dataPlan) {
      serviceResponse.statusCode = "404";
      serviceResponse.errors.push("Not a valid plantype.");
      return serviceResponse;
    }
    // let userRepository = connection.getCustomRepository(UserRepository);
    let user = await this.userRepository.findByUserId(loginUser.userId);
    if (!user) {
      serviceResponse.statusCode = "404";
      serviceResponse.errors.push("User not found.");
      return serviceResponse;
    }
    // let adRepository = connection.getCustomRepository(AdRepository);
    let ad = await this.adRepository.findAd(adId, dataPlan.planId, user.userID);
    if (!ad) {
      serviceResponse.statusCode = "404";
      serviceResponse.errors.push("Ad not found.");
      return serviceResponse;
    }
    if (ad.status == "Viewed") {
      serviceResponse.errors.push("You have already viewed this add.");
      return serviceResponse;
    }
    if (planType == process.env.XIFI_FREE_PLAN) {
      let dataUserPolicyModel: IDataUserPolicyRequest["body"] = {
        bandwidth: dataPlan.bandwidthLimit ? dataPlan.bandwidthLimit : 0,
        time: dataPlan.timeLimit,
        planId: dataPlan.planId,
        xiKasuTokens: dataPlan.xiKasuTokens,
        userName: user.apUserName ? user.apUserName : "",
        userId: user.userID,
        mobileNumber: user.mobileNumber,
      };
      let xifiFreePlanExtraTime = parseInt(
        process.env.XIFI_FREE_PLAN_EXTRA_TIME
          ? process.env.XIFI_FREE_PLAN_EXTRA_TIME
          : "0"
      );
      let planTimeLimit = dataPlan.timeLimit + xifiFreePlanExtraTime;
      let loginUser = userDeviceService.getLoginUser();
      let pdoaId =
        pdoaIdIn != undefined
          ? pdoaIdIn
          : loginUser.pdoaId != undefined
          ? loginUser.pdoaId
          : process.env.DEFAULT_PDOA_ID;
      let updateUserPolicyResponse = await dataConnectService.allowBandwidth(
        pdoaId,
        dataUserPolicyModel
      );
      if (updateUserPolicyResponse.success) {
        serviceResponse.success = true;
        serviceResponse.statusCode = "200";
        serviceResponse.result = {
          remainingTime: dataPlan.timeLimit,
          renewalTime: dataPlan.renewalTime,
        };
        let statusUpdateResponse = await this.setAdViewedStatusCreditTokens(
          ad,
          dataPlan.xiKasuTokens,
          XiKasuSourceEnum.XiFiFree
        );
        if (statusUpdateResponse.success) {
          serviceResponse.result.tokensEarned =
            statusUpdateResponse.result.tokensEarned;
          serviceResponse.result.totalTokens =
            statusUpdateResponse.result.totalTokens;
        } else {
          serviceResponse.success = false;
          serviceResponse.statusCode = "400";
          serviceResponse.errors = statusUpdateResponse.errors;
          return serviceResponse;
        }
      } else {
        serviceResponse.success = false;
        serviceResponse.statusCode = updateUserPolicyResponse.statusCode;
        serviceResponse.errors = updateUserPolicyResponse.errors;
        return serviceResponse;
      }
    } else if (planType == process.env.XI_KASU_PLAN) {
      let statusUpdateResponse = await this.setAdViewedStatusCreditTokens(
        ad,
        dataPlan.xiKasuTokens,
        XiKasuSourceEnum.XiKasuAd
      );
      if (statusUpdateResponse.success) {
        serviceResponse.success = true;
        serviceResponse.statusCode = "200";
        serviceResponse.result.tokensEarned =
          statusUpdateResponse.result.tokensEarned;
        serviceResponse.result.totalTokens =
          statusUpdateResponse.result.totalTokens;
        serviceResponse.result.remainingTime = "";
        serviceResponse.result.renewalTime = "";
      } else {
        serviceResponse.success = false;
        serviceResponse.statusCode = "400";
        serviceResponse.errors = statusUpdateResponse.errors;
        return serviceResponse;
      }
    } else {
      serviceResponse.statusCode = "400";
      serviceResponse.errors.push("Not a valid plantype to view ads.");
      return serviceResponse;
    }

    return serviceResponse;
  }

  private async setAdViewedStatusCreditTokens(
    // ad: Ad,
    ad: IAdCreateRequest["body"],
    creditTokens: number,
    planType: string
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    ad.status = "Viewed";
    ad.adViewedOn = new Date();
    // const connection = await DatabaseProvider.getConnection();
    // let adRepository = connection.getCustomRepository(AdRepository);
    let updateResponse = await this.adRepository.update(ad);
    if (updateResponse) {
      let dataUserTokenModel: IDataUserTokenRequest = {
        userId: ad.userId,
        referenceNo: ad.identifier,
        transactionType: "Cr",
        status: "Credited",
        tokens: creditTokens,
        source: planType,
      };
      let createResponse = await tokenService.saveTokens(dataUserTokenModel);
      return createResponse;
    }
    return serviceResponse;
  }

  private convertMS = (milliseconds: number) => {
    var day, hour, minute, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    return {
      day: day,
      hour: hour,
      minute: minute,
      seconds: seconds,
    };
  };
}

export const adService = new AdService();
