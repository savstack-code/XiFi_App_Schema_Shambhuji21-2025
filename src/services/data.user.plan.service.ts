// import DataUserPlanCreateRequest from "../models/dataUserPlan/data.user.plan.create.request";
import { IDataUserPlanCreateRequest } from "../reqSchema/data.user.plan.create.schema";
import { ServiceResponse } from "../models/response/ServiceResponse";
// import { DatabaseProvider } from "../database/database.provider";
// import { DataPlanRepository } from "../database/repositories/data.plan.repository";
import { DataPlanRepository } from "../database/mongodb/repositories/data.plan.repository";
// import { DataUserPlanRepository } from "../database/repositories/data.user.plan.repository";
import { DataUserPlanRepository } from "../database/mongodb/repositories/data.user.plan.repository";
// import { DataUserTokenBalanceRepository } from "../shared/database/repositories/data.user.token.balance.repository";
import { DataUserTokenBalanceRepository } from "../database/mongodb/repositories/data.user.token.balance.repository";
// import DataUserPlanModel from "../models/dataUserPlan/data.user.plan.model";
// import DataUserTokenModel from "../shared/models/data.user.token.model";
import { IDataUserPlanHistoryRequest } from "../reqSchema/data.user.plan.schema";

import {
  IDataUserPlanRequest,
  IDataUserTokenRequest,
  IDataUserPolicyRequest,
} from "../reqSchema/data.user.plan.schema";
import _ from "lodash";
import request from "request-promise";
import { tokenService } from "../shared/services/token.service";
import DataPlanInfoModel from "../models/dataPlan/data.plan.info.model";
import DataActivePlanModel from "../models/dataPlan/data.active.plan.model";
import DataPlanUsageModel from "../models/dataPlan/data.plan.usage.model";
import dateFns from "date-fns";
// import { UserRepository } from "../database/repositories/user.repository";
import { UserRepository } from "../database/mongodb/repositories/user.repository";
import { userDeviceService } from "./user.device.service";
import { setError } from "../utils/shared";
import DataUserPlanHistoryRequest from "../models/dataUserPlan/data.user.plan.history.request";
// import { XiKasuConfigRepository } from "../database/repositories/xiKasu.config.respository";
import { XiKasuConfigRepository } from "../database/mongodb/repositories/xiKasu.config.respository";
// import DataUserPolicyModel from "../models/dataUserPlan/data.user.policy.model";
import { NotEnoughXikasuTokensError } from "../utils/applicationErrors";
import { dataConnectService } from "../shared/services/data.connect.service";
// import { UserDeviceRepository } from "../database/repositories/user.device.repository";
import { UserDeviceRepository } from "../database/mongodb/repositories/user.device.repository";
import { CommandRepository } from "../database/mongodb/repositories/comman.repository";
export class DataUserPlanService {
  dataPlanRepository: DataPlanRepository;
  dataUserPlanRepository: DataUserPlanRepository;
  dataUserTokenBalanceRepository: DataUserTokenBalanceRepository;
  userRepository: UserRepository;
  xiKasuConfigRepository: XiKasuConfigRepository;
  userDeviceRepository: UserDeviceRepository;
  commandRepository: CommandRepository;
  constructor() {
    this.dataPlanRepository = new DataPlanRepository();
    this.dataUserPlanRepository = new DataUserPlanRepository();
    this.dataUserTokenBalanceRepository = new DataUserTokenBalanceRepository();
    this.userRepository = new UserRepository();
    this.xiKasuConfigRepository = new XiKasuConfigRepository();
    this.userDeviceRepository = new UserDeviceRepository();
    this.commandRepository = new CommandRepository();
  }
  public async createDataUserPlan(
    requestModel: IDataUserPlanCreateRequest
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    //const connection = await DatabaseProvider.getConnection();
    var user: any;
    let loginUser = userDeviceService.getLoginUser();
    if (loginUser) {
      //let userRepository = connection.getCustomRepository(UserRepository);
      user = await this.userRepository.findByUserId(loginUser.userId);
    } else {
      serviceResponse.statusCode = "404";
      serviceResponse.errors.push("User not found.");
      return serviceResponse;
    }
    //  let response = await connection.transaction(async (manager) => {
    // DONT USE GLOBAL getCustomRepository here!
    //let dataPlanRepository = manager.getCustomRepository(DataPlanRepository);
    let dataPlan = await this.dataPlanRepository.findByPlanId(
      requestModel.planId
    );
    if (dataPlan) {
      // let dataUserPlanRepository = manager.getCustomRepository(
      //   DataUserPlanRepository
      // );
      if (user) {
        let dataUserPlan =
          await this.dataUserPlanRepository.findUserValidActivePlan(
            requestModel.planId,
            user.userID
          );
        if (!dataUserPlan) {
          let dataPlans = await this.dataPlanRepository.findAllByPlanType(
            dataPlan.planType
          );
          let planIds = _.map(dataPlans, (planItem) => planItem.planId);
          let dataUserPlans =
            await this.dataUserPlanRepository.findUserValidPlans(
              user.userID,
              planIds
            );
          if (dataUserPlans && dataUserPlans.length > 0) {
            serviceResponse.statusCode = "400";
            let message = `You already have a plan that is active.\nYou can add a new plan only when your existing active plan is exhausted or expired.`;
            serviceResponse.errors.push(message);
            return serviceResponse;
          }
        } else {
          serviceResponse.statusCode = "400";
          let message = `You have already added this plan.\nYou can connect to the Internet through any XiFiZone Hotspot.`;
          serviceResponse.errors.push(message);
          return serviceResponse;
        }
      }
      // let dataUserTokenBalanceRepository = manager.getCustomRepository(
      //   DataUserTokenBalanceRepository
      // );
      let dataUserTokenBalance =
        await this.dataUserTokenBalanceRepository.findOne(user.userID);

      if (dataUserTokenBalance && dataPlan.xiKasuTokens) {
        if (dataUserTokenBalance.tokens >= dataPlan.xiKasuTokens) {
          let planExpiryHours = 0;
          if (dataPlan.uot == "Days") {
            planExpiryHours = 24 * (dataPlan.validity ? dataPlan.validity : 1);
          }
          if (dataPlan.uot == "Hours") {
            planExpiryHours = dataPlan.validity ? dataPlan.validity : 0;
          }
          let hourInMilliSeconds = 60 * 60 * 1000;
          let planExpiryDate = new Date(
            Date.now() + hourInMilliSeconds * planExpiryHours
          );
          // let userDataPlanID =
          //   this.commandRepository.generateKey("DataUserPlan");
          let dataUserPlanModel: IDataUserPlanRequest["body"] = {
            // id: parseInt(userDataPlanID.toString()),
            userId: user.userID,
            planId: dataPlan.planId,
            status: "InActive",
            planExpiryDate: planExpiryDate,
            bandwidthLimit: dataPlan.bandwidthLimit
              ? dataPlan.bandwidthLimit
              : 0,
            remainingData: dataPlan.bandwidthLimit
              ? dataPlan.bandwidthLimit
              : 0,
          };
          let dataUserPlan = await this.dataUserPlanRepository.createAndSave(
            dataUserPlanModel
          );

          let dataUserTokenModel: IDataUserTokenRequest["body"] = {
            userId: user.userID,
            referenceNo: dataUserPlan.id.toString(),
            transactionType: "Dr",
            status: "Redeemed",
            tokens: dataPlan.xiKasuTokens,
            source: dataPlan.planType,
          };

          let tokenResponse = await tokenService.saveTokens(dataUserTokenModel);

          if (tokenResponse.success) {
            let validityString: string =
              dataPlan.uot == "Days" && dataPlan.validity == 1
                ? "Day"
                : dataPlan.uot
                  ? dataPlan.uot
                  : "";
            let dataActivePlanModel = new DataActivePlanModel();
            let dataPlanInfoModel = new DataPlanInfoModel();
            dataPlanInfoModel.planId = dataPlan.planId;
            dataPlanInfoModel.planName = dataPlan.planName;
            dataPlanInfoModel.bandwidthLimit = dataPlan.bandwidthLimit
              ? dataPlan.bandwidthLimit
              : 0;
            dataPlanInfoModel.timeLimit = dataPlan.timeLimit
              ? dataPlan.timeLimit
              : 0;
            // dataPlanInfoModel.validity = `${dataPlan.validity} ${validityString}`; // Ask about below condition
            dataPlanInfoModel.validity = dataPlan.validity
              ? dataPlan.validity
              : 0;
            dataPlanInfoModel.priceInRupees = dataPlan.priceInRupees
              ? dataPlan.priceInRupees
              : 0;
            dataPlanInfoModel.xiKasuTokens = dataPlan.xiKasuTokens;

            dataActivePlanModel.planInfo = dataPlanInfoModel;
            let dataPlanUsageModel = new DataPlanUsageModel();
            dataPlanUsageModel.startDate = dateFns.format(
              dataUserPlan.createdOn ? dataUserPlan.createdOn : new Date(), //Ask about it this condition
              "DD-MM-YYYY HH:mm:ss"
            );
            dataPlanUsageModel.ExpiresOn = dateFns.format(
              dataUserPlan.planExpiryDate,
              "DD-MM-YYYY HH:mm:ss"
            );
            dataPlanUsageModel.remainingBandWidth = dataUserPlan.remainingData
              ? dataUserPlan.remainingData
              : 0;
            dataActivePlanModel.planUsage = dataPlanUsageModel;

            serviceResponse.success = true;
            serviceResponse.statusCode = "200";
            serviceResponse.result = {
              tokensUsed: dataUserTokenModel.tokens,
              totalTokens: tokenResponse.result.totalTokens,
              activePlan: dataActivePlanModel,
              message: `You have purchased the ${dataPlan.planName}.`,
            };
            return serviceResponse;
          } else {
            serviceResponse.statusCode = "400";
            let totalTokens: any = dataUserTokenBalance
              ? dataUserTokenBalance.tokens
              : 0;
            let message = `3 You do not have enough XiKasu token to add this plan.\nYou currently have ${totalTokens} Xikasu tokens.\nYou need at least ${dataPlan.xiKasuTokens} XiKasu Tokens to add this plan.`;
            serviceResponse.errors.push(message);
            return serviceResponse;
          }
        } else {
          serviceResponse.statusCode = "400";
          let totalTokens: any = dataUserTokenBalance
            ? dataUserTokenBalance.tokens
            : 0;
          let message = `1 You do not have enough XiKasu token to add this plan.\nYou currently have ${totalTokens} Xikasu tokens.\nYou need at least ${dataPlan.xiKasuTokens} XiKasu Tokens to add this plan.`;
          serviceResponse.errors.push(message);
          return serviceResponse;
        }
      } else {
        serviceResponse.statusCode = "400";
        let totalTokens: any = dataUserTokenBalance
          ? dataUserTokenBalance.tokens
          : 0;
        let message = `2 You do not have enough XiKasu token to add this plan.\nYou currently have ${totalTokens} Xikasu tokens.\nYou need at least ${dataPlan.xiKasuTokens} XiKasu Tokens to add this plan.`;
        serviceResponse.errors.push(message);
        return serviceResponse;
      }
    } else {
      serviceResponse.statusCode = "404";
      serviceResponse.errors.push("Plan not found.");
      return serviceResponse;
    }
    // return serviceResponse;
    // });

    // serviceResponse = response;
    // return serviceResponse;
  }

  public async getCurrentActiveSession(userDeviceId: string) {
    let serviceResponse = new ServiceResponse();
    //const connection = await DatabaseProvider.getConnection();
    //const userRepository = connection.getCustomRepository(UserRepository);
    const user = await this.userRepository.findOne({
      asDeviceId: userDeviceId,
    });
    serviceResponse.success = true;
    serviceResponse.statusCode = "200";
    if (user) {
      // const userDeviceRepository = connection.getCustomRepository(
      //   UserDeviceRepository
      // );
      const userDevice = await this.userDeviceRepository.findOne(userDeviceId);
      serviceResponse.result = { sessionRunning: true, userDevice };
    } else {
      serviceResponse.result = {
        sessionRunning: false,
      };
    }
    return serviceResponse;
  }

  public async activateDataUserPlan(
    pdoaIdIn: any,
    planId?: number,
    planType?: string,
    userDeviceId?: string
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();

    // read pdoaId from UserDevice Table or middleware validation //
    //const connection = await DatabaseProvider.getConnection();
    let loginUser = userDeviceService.getLoginUser();
    let pdoaId =
      pdoaIdIn != undefined
        ? pdoaIdIn
        : loginUser.pdoaId != undefined
          ? loginUser.pdoaId
          : process.env.DEFAULT_PDOA_ID;
    if (loginUser) {
      // let userRepository = connection.getCustomRepository(UserRepository);
      let user = await this.userRepository.findByUserId(loginUser.userId);
      if (!user) {
        serviceResponse.statusCode = "404";
        serviceResponse.errors.push("User not found.");
        return serviceResponse;
      }
      if (!user.apUserName) {
        //serviceResponse.statusCode = "404";
        //serviceResponse.errors.push("Unauthorised user.");
        //return serviceResponse;
        // ----TODO : Remove username reference in the app & read from Pdoa User Table //
        // let xifiUserName = `${user.userID}@xifi`;
        user.apUserName = `${user.userID}@xifi`;
      }

      if (planId) {
        // let dataPlanRepository = connection.getCustomRepository(
        //   DataPlanRepository
        // );
        let dataPlan = await this.dataPlanRepository.findByPlanId(planId);
        if (dataPlan) {
          // let dataUserPlanRepository = connection.getCustomRepository(
          //   DataUserPlanRepository
          // );

          let dataUserPlan =
            await this.dataUserPlanRepository.findUserValidActivePlan(
              planId,
              user.userID
            );
          if (dataUserPlan) {
            let dataUserPolicyModel: IDataUserPolicyRequest["body"] = {
              bandwidth: dataPlan.bandwidthLimit ? dataPlan.bandwidthLimit : 0,
              time: dataPlan.timeLimit ? dataPlan.timeLimit : 0,
              planId: dataPlan.planId,
              xiKasuTokens: dataPlan.xiKasuTokens ? dataPlan.xiKasuTokens : 0,
              userName: user.apUserName,
              userId: user.userID,
              mobileNumber: user.mobileNumber,
            };
            await dataConnectService.stopUserSession(
              pdoaId,
              user.apUserName,
              user.mobileNumber
            );
            if (user.asDeviceId) {
              // set bandwidth to zero
              await dataConnectService.stopUserSession(pdoaId, user.apUserName);
            }
            let allowUserPolicyResponse =
              await dataConnectService.allowBandwidth(
                pdoaId,
                dataUserPolicyModel
              );
            if (allowUserPolicyResponse.success) {
              allowUserPolicyResponse.result.bandwidth =
                dataPlan.bandwidthLimit;
              allowUserPolicyResponse.result.time = dataPlan.timeLimit;
              allowUserPolicyResponse.result.xiKasuTokens =
                dataPlan.xiKasuTokens;
            }
            if (userDeviceId) {
              user.asDeviceId = userDeviceId;
              await user.save();
            }
            return allowUserPolicyResponse;
          } else {
            serviceResponse.statusCode = "404";
            serviceResponse.errors.push(
              "You don't have the plan to connect. Please buy the plan either XiFiNow or XiFiMax"
            );
            return serviceResponse;
          }
        } else {
          serviceResponse.statusCode = "404";
          serviceResponse.errors.push("Plan not found.");
          return serviceResponse;
        }
      }
      if (planType && planType == "XiFiConnect") {
        let bandwidthResponse = await this.calculateBandwidth(loginUser.userId);
        if (bandwidthResponse.success) {
          let dataUserPolicyModel: IDataUserPolicyRequest["body"] = {
            bandwidth: bandwidthResponse.result.bandwidth,
            time: bandwidthResponse.result.time,
            planType: planType,
            xiKasuTokens: bandwidthResponse.result.xiKasuTokens,
            userName: user.apUserName,
            userId: user.userID,
            mobileNumber: user.mobileNumber,
          };

          // await dataConnectService.stopUserSession(
          //   pdoaId,
          //   user.apUserName,
          //   user.mobileNumber
          // );
          // if (user.asDeviceId) {
          //   // set bandwidth to zero
          //   await dataConnectService.stopUserSession(pdoaId, user.apUserName);
          // }
          user.currentPlanId = "XiFiConnect";
          user.modifiedOn = new Date();
          if (userDeviceId) {
            user.asDeviceId = userDeviceId;
          }
          let updateUser = await user.save();
          // let allowUserPolicyResponse = await dataConnectService.allowBandwidth(
          //   pdoaId,
          //   dataUserPolicyModel
          // );
          // if (allowUserPolicyResponse.success) {
          //   allowUserPolicyResponse.result.bandwidth =
          //     bandwidthResponse.result.bandwidth;
          //   allowUserPolicyResponse.result.time = bandwidthResponse.result.time;
          //   allowUserPolicyResponse.result.xiKasuTokens =
          //     bandwidthResponse.result.xiKasuTokens;
          // }
          let allowUserPolicyResponse: any = {
            bandwidth: bandwidthResponse.result.bandwidth,
            time: bandwidthResponse.result.time,
            xiKasuTokens: bandwidthResponse.result.xiKasuTokens,
          };
          serviceResponse.success = true;
          serviceResponse.statusCode = "200";
          serviceResponse.result = allowUserPolicyResponse;
          return serviceResponse;
        }
        return bandwidthResponse;
      }
    } else {
      serviceResponse.statusCode = "404";
      serviceResponse.errors.push("User not found.");
      return serviceResponse;
    }
    return serviceResponse;
  }

  public async activateInternet() {
    let serviceResponse = new ServiceResponse();
    //const connection = await DatabaseProvider.getConnection();
    const loginUser = userDeviceService.getLoginUser();
    if (!loginUser) {
      serviceResponse.errorCode = "404";
      serviceResponse.errors.push(`User not found`);
      return serviceResponse;
    }
    const pdoaId =
      loginUser.pdoaId != undefined
        ? loginUser.pdoaId
        : process.env.DEFAULT_PDOA_ID;
    //let userRepository = connection.getCustomRepository(UserRepository);
    let user = await this.userRepository.findByUserId(loginUser.userId);
    if (!user) {
      serviceResponse.statusCode = "404";
      serviceResponse.errors.push("User not found.");
      return serviceResponse;
    }
    const railTelUserInfo = await dataConnectService.activateInternet(
      pdoaId,
      user.apUserName ? user.apUserName : "",
      user.mobileNumber
    );
    if (railTelUserInfo.success && railTelUserInfo.result) {
      user.railTelOrgNo = railTelUserInfo.result.orgno;
      await user.save();
    }
    return railTelUserInfo;
  }

  // private async allowUserPolicy(
  //   dataUserPolicyModel: DataUserPolicyModel
  // ): Promise<ServiceResponse> {
  //   let serviceResponse: ServiceResponse = {
  //     success: false,
  //     result: {},
  //     statusCode: "400",
  //     errors: [],
  //   };
  //   let userPolicyRequestOptions = {
  //     method: "POST",
  //     uri: `http://${process.env.HOST}:${process.env.PDOA_PORT}/api/v${process.env.API_VERSION}/${process.env.PDOA_UPDATE_USER_POLICY_URL_SEGMENT}`,
  //     body: {
  //       userName: dataUserPolicyModel.userName,
  //       userId: dataUserPolicyModel.userId,
  //       planId: dataUserPolicyModel.planId,
  //       planType: dataUserPolicyModel.planType,
  //       bandwidth: dataUserPolicyModel.bandwidth,
  //       time: dataUserPolicyModel.time,
  //     },
  //     json: true, // Automatically stringifies the body to JSON
  //   };
  //   try {
  //     const updateUserPolicyResponse = await request(userPolicyRequestOptions);
  //     if (updateUserPolicyResponse.success) {
  //       serviceResponse.success = true;
  //       serviceResponse.statusCode = "200";
  //       serviceResponse.result = {
  //         message: "Successfully connected to the plan.",
  //       };
  //     } else {
  //       serviceResponse.statusCode = updateUserPolicyResponse.statusCode
  //         ? updateUserPolicyResponse.statusCode
  //         : "400";
  //       serviceResponse.errors = updateUserPolicyResponse.errors
  //         ? updateUserPolicyResponse.errors
  //         : [];
  //     }
  //   } catch (error) {
  //     setError(serviceResponse, error.message, "400");
  //   }
  //   return serviceResponse;
  // }

  private async calculateBandwidth(userId: string): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    //const connection = await DatabaseProvider.getConnection();
    // const xiKasuConfigRepository = connection.getCustomRepository(
    //   XiKasuConfigRepository
    // );
    let xiKasuConfigs = await this.xiKasuConfigRepository.findByCategory(
      "XiFiConnect"
    );
    // const dataUserTokenBalanceRepository = connection.getCustomRepository(
    //   DataUserTokenBalanceRepository
    // );
    let dataUserTokenBalance =
      await this.dataUserTokenBalanceRepository.findOne(userId);

    if (dataUserTokenBalance && dataUserTokenBalance.tokens > 0) {
      let bandwidth =
        (xiKasuConfigs[0].bandwidth
          ? parseFloat(xiKasuConfigs[0].bandwidth)
          : 0) * dataUserTokenBalance.tokens;
      serviceResponse.result = {
        bandwidth: bandwidth.toString(),
        time: xiKasuConfigs[0].time ? xiKasuConfigs[0].time.toString() : "",
        xiKasuTokens: dataUserTokenBalance.tokens,
      };
      serviceResponse.success = true;
      serviceResponse.statusCode = "200";
    } else {
      const errorMessage = `You don't have enough XiKasu Tokens to connect XiFi.`;
      setError(serviceResponse, errorMessage, "400");
      throw new NotEnoughXikasuTokensError(errorMessage);
    }
    return serviceResponse;
  }

  public async getDatauserPlanHistory(
    dataUserPlanHistoryRequest: IDataUserPlanHistoryRequest["query"]
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();

    //const connection = await DatabaseProvider.getConnection();
    let loginUser = userDeviceService.getLoginUser();
    if (loginUser) {
      // let dataUserPlanRepository = connection.getCustomRepository(
      //   DataUserPlanRepository
      // );
      let dataUserPlans =
        await this.dataUserPlanRepository.findDataUserPlanHistory(
          loginUser.userId,
          dataUserPlanHistoryRequest.currentPage,
          dataUserPlanHistoryRequest.pageSize
        );
      let dataUserPlanHistory: any = [];
      if (dataUserPlans && dataUserPlans.length > 0) {
        // const dataPlanRepository = connection.getCustomRepository(
        //   DataPlanRepository
        // );
        let dataPlans = await this.dataPlanRepository.findAllActivePlans();
        dataUserPlanHistory = _.map(dataUserPlans, (dataUserPlan: any) => {
          let dataPlan = _.find(
            dataPlans,
            (item) => item.planId == dataUserPlan.planId
          );
          dataUserPlan.planName = dataPlan ? dataPlan.planName : "";
          dataUserPlan.planType = dataPlan ? dataPlan.planType : "";
          return dataUserPlan;
        });
      }
      serviceResponse.success = true;
      serviceResponse.statusCode = "200";
      serviceResponse.result = dataUserPlanHistory;
      return serviceResponse;
    }
    const errorMessage = `User not found`;
    setError(serviceResponse, errorMessage, "404");
    return serviceResponse;
  }
  public async disconnectSession(pdoaIdIn: any): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    //const connection = await DatabaseProvider.getConnection();
    const loginUser = userDeviceService.getLoginUser();

    if (!loginUser) {
      serviceResponse.errorCode = "404";
      serviceResponse.errors.push(`User not found`);
      return serviceResponse;
    }
    const pdoaId =
      pdoaIdIn != undefined
        ? pdoaIdIn
        : loginUser.pdoaId != undefined
          ? loginUser.pdoaId
          : process.env.DEFAULT_PDOA_ID;
    //let userRepository = connection.getCustomRepository(UserRepository);
    let user = await this.userRepository.findByUserId(loginUser.userId);
    if (!user) {
      serviceResponse.statusCode = "404";
      serviceResponse.errors.push("User not found.");
      return serviceResponse;
    }
    if (!user.apUserName) {
      //serviceResponse.statusCode = "404";
      //serviceResponse.errors.push("Unauthorised user.");
      //return serviceResponse;
      // ----TODO : Remove username reference in the app & read from Pdoa User Table //
      // let xifiUserName = `${user.userID}@xifi`;
      user.apUserName = `${user.userID}@xifi`;
    }
    return dataConnectService.stopUserSession(
      pdoaId,
      user.apUserName,
      user.mobileNumber
    );
  }
}

export const dataUserPlanService = new DataUserPlanService();
