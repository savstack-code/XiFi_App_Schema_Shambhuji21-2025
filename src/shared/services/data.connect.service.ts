import { setError } from "../../utils/shared";
import request from "request-promise";
// import { DatabaseProvider } from "../../database/database.provider";
// import DataUserPolicyModel from "../../models/dataUserPlan/data.user.policy.model";
import {
  IDataUserPolicyRequest,
  IDataUserPlanRequest,
} from "../../reqSchema/data.user.plan.schema";
// import { DataUserPlanRepository } from "../../database/repositories/data.user.plan.repository";
import { DataUserPlanRepository } from "../../database/mongodb/repositories/data.user.plan.repository";
import _ from "lodash";
// import DataUserPlanModel from "../../models/dataUserPlan/data.user.plan.model";
// import { UserRepository } from "../../database/repositories/user.repository";
import { UserRepository } from "../../database/mongodb/repositories/user.repository";
// import { DataAccountingRepository } from "../../database/repositories/data.accounting.repository";
import { DataAccountingRepository } from "../../database/mongodb/repositories/data.accounting.repository";
// import DataAccountingModel from "../models/data.accounting.model";
import { IDataAccountingRequest } from "../../reqSchema/data.accounting.schema";
// import { PdoaConfigRepository } from "../../database/repositories/pdoa.config.repository";
import { PdoaConfigRepository } from "../../database/mongodb/repositories/pdoa.config.repository";
import { ServiceResponse } from "../../models/response/ServiceResponse";

export class DataConnectService {
  dataUserPlanRepository: DataUserPlanRepository;
  userRepository: UserRepository;
  dataAccountingRepository: DataAccountingRepository;
  pdoaConfigRepository: PdoaConfigRepository;
  constructor() {
    this.dataUserPlanRepository = new DataUserPlanRepository();
    this.userRepository = new UserRepository();
    this.dataAccountingRepository = new DataAccountingRepository();
    this.pdoaConfigRepository = new PdoaConfigRepository();
  }
  public async allowBandwidth(
    pdoaId: string,
    dataUserPolicyModel: IDataUserPolicyRequest["body"]
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();

    let allowUserPolicyResponse = await this.allowUserPolicy(
      pdoaId,
      dataUserPolicyModel
    );
    if (allowUserPolicyResponse.success) {
      allowUserPolicyResponse.result.bandwidth = dataUserPolicyModel.bandwidth;
      allowUserPolicyResponse.result.time = dataUserPolicyModel.time;
      allowUserPolicyResponse.result.xiKasuTokens =
        dataUserPolicyModel.xiKasuTokens;
      return allowUserPolicyResponse;
    }

    return serviceResponse;
  }

  public async stopUserSession(
    pdoaId: string,
    ApUserName: string,
    mobileNumber?: string
  ) {
    let serviceResponse = new ServiceResponse();
    //const connection = await DatabaseProvider.getConnection();
    // const pdoaConfigRepository = connection.getCustomRepository(
    //   PdoaConfigRepository
    // );
    const pdoaConfig = await this.pdoaConfigRepository.findByPdoaId(pdoaId);
    if (!pdoaConfig) {
      let errorMessage =
        "Pdoa details not found for this SSID, Please contact admin.";
      setError(serviceResponse, errorMessage, "400");
      return serviceResponse;
    }

    if (!pdoaConfig.stopUserSessionUrl) {
      let errorMessage = "Pdoa Config URL not found";
      setError(serviceResponse, errorMessage, "400");
      return serviceResponse;
    }
    let userPolicyRequestOptions = {
      method: "DELETE",
      uri: pdoaConfig.stopUserSessionUrl,
      body: { pdoaId, ApUserName, mobileNumber },
      json: true, // Automatically stringifies the body to JSON
    };
    try {
      const updateUserPolicyResponse = await request(userPolicyRequestOptions);
      if (updateUserPolicyResponse.success) {
        serviceResponse.success = true;
        serviceResponse.statusCode = "200";
        serviceResponse.result = {
          message: "Successfully closed current session.",
        };
      } else {
        serviceResponse.statusCode = updateUserPolicyResponse.statusCode
          ? updateUserPolicyResponse.statusCode
          : "400";
        serviceResponse.errors = updateUserPolicyResponse.errors
          ? updateUserPolicyResponse.errors
          : [];
      }
    } catch (error) {
      setError(serviceResponse, error.message, "400");
    }
    return serviceResponse;
  }

  public async activateInternet(
    pdoaId: string,
    ApUserName?: string,
    mobileNumber?: string
  ): Promise<{
    success: boolean;
    result?: {
      pkgno: number;
      password: string;
      orgno: number;
      actno: number;
      domno: number;
      subsNo: number;
      username: string;
    };
    statusCode: string;
    errors: [string];
  }> {
    const serviceResponse = new ServiceResponse();
    // const connection = await DatabaseProvider.getConnection();
    // const pdoaConfigRepository = connection.getCustomRepository(
    //   PdoaConfigRepository
    // );
    const pdoaConfig = await this.pdoaConfigRepository.findByPdoaId(pdoaId);
    if (!pdoaConfig) {
      let errorMessage =
        "Pdoa details not found for this SSID, Please contact admin.";
      setError(serviceResponse, errorMessage, "400");
      return serviceResponse as any;
    }
    let userPolicyRequestOptions = {
      method: "POST",
      uri: `${pdoaConfig.apiBasePath} `,
      body: { mobileNumber },
      json: true, // Automatically stringifies the body to JSON
    };
    try {
      const userPolicyRequestRes = await request(userPolicyRequestOptions);
      return userPolicyRequestRes;
    } catch (error) {
      return serviceResponse.setError(error.message) as any;
    }
  }

  private async allowUserPolicy(
    pdoaId: string,
    dataUserPolicyModel: IDataUserPolicyRequest["body"]
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    // const connection = await DatabaseProvider.getConnection();
    // const pdoaConfigRepository = connection.getCustomRepository(
    //   PdoaConfigRepository
    // );
    let pdoaConfig = await this.pdoaConfigRepository.findByPdoaId(pdoaId);
    if (pdoaConfig) {
      let userPolicyRequestOptions = {
        method: "POST",
        uri: pdoaConfig.updateDataPolicyUrl,
        body: {
          pdoaId: pdoaId,
          userName: dataUserPolicyModel.userName,
          userId: dataUserPolicyModel.userId,
          planId: dataUserPolicyModel.planId,
          planType: dataUserPolicyModel.planType,
          bandwidth: dataUserPolicyModel.bandwidth,
          time: dataUserPolicyModel.time,
          mobileNumber: dataUserPolicyModel.mobileNumber,
        },
        json: true, // Automatically stringifies the body to JSON
      };
      try {
        const updateUserPolicyResponse = await request(
          userPolicyRequestOptions
        );
        if (updateUserPolicyResponse.success) {
          serviceResponse.success = true;
          serviceResponse.statusCode = "200";
          serviceResponse.result = {
            message: "Successfully connected to the plan.",
          };
          let processDataSession = await this.dataProcessAction(
            dataUserPolicyModel
          );
        } else {
          serviceResponse.statusCode = updateUserPolicyResponse.statusCode
            ? updateUserPolicyResponse.statusCode
            : "400";
          serviceResponse.errors = updateUserPolicyResponse.errors
            ? updateUserPolicyResponse.errors
            : [];
        }
      } catch (error) {
        setError(serviceResponse, error.message, "400");
      }
    } else {
      let errorMessage =
        "Pdoa details not found for this SSID, Please contact admin.";
      setError(serviceResponse, errorMessage, "400");
    }
    return serviceResponse;
  }

  private async dataProcessAction(
    dataUserPolicyModel: IDataUserPolicyRequest["body"]
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    //const connection = await DatabaseProvider.getConnection();
    if (dataUserPolicyModel.planId) {
      // let dataUserPlanRepository = await connection.getCustomRepository(
      //   DataUserPlanRepository
      // );
      let userActivePlans =
        await this.dataUserPlanRepository.getUserActivePlans(
          dataUserPolicyModel.planId,
          "Active",
          dataUserPolicyModel.userId
        );
      if (userActivePlans && userActivePlans.length > 0) {
        let userInActivePlans = _.map(userActivePlans, (item: any) => {
          item.status = "InActive";
          return item;
        });
        let updateResponse = await this.dataUserPlanRepository.updateMany(
          userInActivePlans
        );
      }

      let planExpiryDate: any;
      let remainingData = 0;
      let dataUserPlan;
      dataUserPlan = await this.dataUserPlanRepository.findUserValidActivePlan(
        dataUserPolicyModel.planId,
        dataUserPolicyModel.userId
      );
      if (dataUserPlan) {
        planExpiryDate = dataUserPlan.planExpiryDate;
        remainingData = dataUserPlan.remainingData;
      }

      if (process.env.XIFI_FREE_PLAN != dataUserPolicyModel.planType) {
        if (dataUserPlan) {
          dataUserPlan.modifiedOn = new Date();
          dataUserPlan.status = "Active";
          dataUserPlan = await dataUserPlan.save();
        }
      } else {
        let dataUserPlanModel: IDataUserPlanRequest["body"] = {
          userId: dataUserPolicyModel.userId,
          planId: dataUserPolicyModel.planId,
          planExpiryDate: planExpiryDate,
          status: "Active",
          remainingData: remainingData,
          bandwidthLimit: dataUserPolicyModel.bandwidth,
        };
        dataUserPlan = await this.dataUserPlanRepository.createAndSave(
          dataUserPlanModel
        );
      }

      if (dataUserPolicyModel.userId) {
        // let userRepository = await connection.getCustomRepository(
        //   UserRepository
        // );
        let user = await this.userRepository.findByUserId(
          dataUserPolicyModel.userId
        );
        if (user) {
          user.currentPlanId = dataUserPolicyModel.planId.toString();
          user.modifiedOn = new Date();
          let updateDataUser = await user.save();
          // let dataAccouningRepository = await connection.getCustomRepository(
          //   DataAccountingRepository
          // );
          let dataAccounting =
            await this.dataAccountingRepository.findByUserNamePlanIdStatus(
              dataUserPolicyModel.userName,
              dataUserPolicyModel.planId
            );
          // if (!dataAccounting) { //TODO ; Ask About Null value while validation required
          //   let dataAccountingModel: IDataAccountingRequest["body"] = {
          //     userName: user.apUserName,
          //     startTime: null,
          //     sessionTime: null,
          //     dataUsed: null,
          //     calledStation: null,
          //     callingStation: null,
          //     locationId: null,
          //     stopTime: null,
          //     terminateCause: null,
          //     planId: dataUserPolicyModel.planId,
          //     userPlanId: dataUserPlan ? dataUserPlan.id : null,
          //     status: "SessionPending",
          //   };
          //   let dataAccountingRecord = await this.dataAccountingRepository.createAndSave(
          //     dataAccountingModel
          //   );
          // }
        }
      }
    }
    return serviceResponse;
  }
}
export const dataConnectService = new DataConnectService();
