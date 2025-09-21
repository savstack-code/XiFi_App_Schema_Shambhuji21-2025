import { ServiceResponse } from "../models/response/ServiceResponse";
// import DataPlanCreateRequest from "../models/request/data.plan.create.request";
// import DataPlanUpdateRequest from "../models/request/data.plan.update.request";
import {
  IDataPlanUpdateRequest,
  IDataPlanCreateRequest,
  IDataPlanGetRequest,
} from "../reqSchema/data.plan.schema";
import logger from "../config/winston.logger";
import DataPlanModel from "../models/dataPlan/data.plan.model";
import DataActivePlanModel from "../models/dataPlan/data.active.plan.model";
// import { DatabaseProvider } from "../database/database.provider";
// import { DataPlanRepository } from "../database/repositories/data.plan.repository";
import { DataPlanRepository } from "../database/mongodb/repositories/data.plan.repository";
import _ from "lodash";
import DataPlanInfoModel from "../models/dataPlan/data.plan.info.model";
// import { DataUserPlanRepository } from "../database/repositories/data.user.plan.repository";
import { DataUserPlanRepository } from "../database/mongodb/repositories/data.user.plan.repository";
import DataPlanUsageModel from "../models/dataPlan/data.plan.usage.model";
import dateFns from "date-fns";
// import { UserRepository } from "../database/repositories/user.repository";
import { UserRepository } from "../database/mongodb/repositories/user.repository";
import { userDeviceService } from "./user.device.service";
import { CommandRepository } from "../database/mongodb/repositories/comman.repository";
import { number } from "joi";
export class DataPlanService {
  dataPlanRepository: DataPlanRepository;
  userRepository: UserRepository;
  dataUserPlanRepository: DataUserPlanRepository;
  commandRepository: CommandRepository;
  constructor() {
    this.dataPlanRepository = new DataPlanRepository();
    this.userRepository = new UserRepository();
    this.dataUserPlanRepository = new DataUserPlanRepository();
    this.commandRepository = new CommandRepository();
  }
  public async getDataPlanByIdentifier(
    identifier: IDataPlanGetRequest["params"]
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    //const connection = await DatabaseProvider.getConnection();
    // const dataPlanRepository = connection.getCustomRepository(
    //   DataPlanRepository
    // );
    let dataPlan = await this.dataPlanRepository.findByidentifier(identifier);
    if (dataPlan) {
      serviceResponse.statusCode = "200";
      serviceResponse.success = true;
      serviceResponse.result = dataPlan;
      return serviceResponse;
    }
    serviceResponse.statusCode = "404";
    serviceResponse.errors.push("Data Plan not found.");
    return serviceResponse;
  }

  public async getDataPlans(query: any): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    //const connection = await DatabaseProvider.getConnection();
    let dataPlanModel = new DataPlanModel();
    let dataPlanUsageModel = new DataPlanUsageModel();
    let dataActivePlanModel = new DataActivePlanModel();
    var user: any;
    let loginUser = userDeviceService.getLoginUser();
    if (loginUser) {
      // let userRepository = connection.getCustomRepository(UserRepository);
      user = await this.userRepository.findByUserId(loginUser.userId);
    } else {
      serviceResponse.statusCode = "404";
      serviceResponse.errors.push("User not found.");
      return serviceResponse;
    }

    // let dataPlanRepository = connection.getCustomRepository(DataPlanRepository);
    let dataPlans = await this.dataPlanRepository.findAllByPlanType(
      query.planType
    );
    if (dataPlans && dataPlans.length) {
      let dataPlanInfoList: DataPlanInfoModel[];
      dataPlanInfoList = _.map(dataPlans, (dataPlan) => {
        let validityString: string =
          dataPlan.uot == "Days" && dataPlan.validity == 1
            ? "day"
            : dataPlan.uot
            ? dataPlan.uot.toLowerCase()
            : "";
        let dataPlanInfoModel = new DataPlanInfoModel();
        dataPlanInfoModel.planId = dataPlan.planId;
        dataPlanInfoModel.planName = dataPlan.planName;
        dataPlanInfoModel.bandwidthLimit = dataPlan.bandwidthLimit
          ? dataPlan.bandwidthLimit
          : 0;
        dataPlanInfoModel.timeLimit = dataPlan.timeLimit
          ? dataPlan.timeLimit
          : 0;
        //dataPlanInfoModel.validity = `${dataPlan.validity} ${validityString}`; //Ask about this is string
        dataPlanInfoModel.validity = dataPlan.validity ? dataPlan.validity : 0;
        dataPlanInfoModel.priceInRupees = dataPlan.priceInRupees
          ? dataPlan.priceInRupees
          : 0;
        dataPlanInfoModel.xiKasuTokens = dataPlan.xiKasuTokens
          ? dataPlan.xiKasuTokens
          : 0;
        return dataPlanInfoModel;
      });
      dataPlanModel.plans = dataPlanInfoList;
    }
    if (user) {
      if (dataPlanModel.plans && dataPlanModel.plans.length > 0) {
        // let dataUserPlanRepository = connection.getCustomRepository(
        //   DataUserPlanRepository
        // );
        let planIds = _.map(dataPlanModel.plans, (planItem) => planItem.planId);
        let purchasedPlans =
          await this.dataUserPlanRepository.findUserValidPlans(
            user.userID,
            planIds
          );
        if (purchasedPlans && purchasedPlans.length > 0) {
          let planInfoList = _.filter(
            dataPlanModel.plans,
            (dataPlan) => dataPlan.planId == purchasedPlans[0].planId
          );
          if (planInfoList && planInfoList.length > 0) {
            dataActivePlanModel.planInfo = planInfoList[0];
          }
          let dataUserPlan =
            await this.dataUserPlanRepository.findUserValidActivePlan(
              purchasedPlans[0].planId,
              user.userID
            );
          if (dataUserPlan) {
            dataPlanUsageModel.startDate = dateFns.format(
              dataUserPlan.createdOn ? dataUserPlan.createdOn : new Date(), //Ask about this condition
              "DD-MM-YYYY HH:mm:ss"
            );
            dataPlanUsageModel.ExpiresOn = dateFns.format(
              dataUserPlan.planExpiryDate,
              "DD-MM-YYYY HH:mm:ss"
            );
            dataPlanUsageModel.remainingBandWidth = dataUserPlan.remainingData;
            dataActivePlanModel.planUsage = dataPlanUsageModel;
          }
        }
      }
    }
    dataPlanModel.activePlan = dataActivePlanModel;
    serviceResponse.success = true;
    serviceResponse.statusCode = "200";
    serviceResponse.result = dataPlanModel;
    return serviceResponse;
  }

  public async createDataPlan(
    requestModel: IDataPlanCreateRequest["body"]
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    // const connection = await DatabaseProvider.getConnection();
    // const dataplanrepository = connection.getCustomRepository(
    //   DataPlanRepository
    // );

    let dataPlanIdentifier = await this.commandRepository.generateKey(
      "DataPlan"
    );

    if (!dataPlanIdentifier) {
      const errorMessage = `Data Plan Identifier not generated`;
      this.setError(serviceResponse, errorMessage, "404");
      return serviceResponse;
    }
    requestModel.identifier = parseInt(dataPlanIdentifier.toString());
    let dataPlan = await this.dataPlanRepository.findByPlanIdInPlanType(
      requestModel.planId,
      requestModel.planType
    );
    if (!dataPlan) {
      let entity = await this.dataPlanRepository.createAndSave(requestModel);
      if (entity) {
        serviceResponse.statusCode = "200";
        serviceResponse.success = true;
        serviceResponse.result = {
          identifier: entity.identifier,
          message: "DataPlan details created successfully.",
        };
        return serviceResponse;
      }
    } else {
      serviceResponse.statusCode = "400";
      serviceResponse.success = false;
      serviceResponse.result = {
        message: `Already have the ${requestModel.planId} in ${requestModel.planType}.`,
      };
      return serviceResponse;
    }

    serviceResponse.statusCode = "400";
    serviceResponse.success = false;
    serviceResponse.result = {
      message: "Invalid data to save.",
    };
    return serviceResponse;
  }

  public async deleteDataPlan(
    identifier: IDataPlanGetRequest["params"]
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    // const connection = await DatabaseProvider.getConnection();
    // const dataPlanRepository = connection.getCustomRepository(
    //   DataPlanRepository
    // );
    let dataPlan = await this.dataPlanRepository.findByidentifier(identifier);
    if (dataPlan) {
      let response = await dataPlan.remove();
      serviceResponse.success = true;
      serviceResponse.statusCode = "200";
      serviceResponse.result = {
        identifier: identifier,
        message: "Data plan deleted successfully.",
      };
      return serviceResponse;
    }
    const errorMessage = `Data plan not found to delete.`;
    this.setError(serviceResponse, errorMessage, "404");
    return serviceResponse;
  }

  public async updateDataPlan(
    identifier: IDataPlanUpdateRequest["params"],
    dataPlanUpdateRequest: IDataPlanUpdateRequest["body"]
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    // const connection = await DatabaseProvider.getConnection();
    // const dataPlanRepository = connection.getCustomRepository(
    //   DataPlanRepository
    // );

    let dataPlan = await this.dataPlanRepository.findByidentifier(identifier);
    if (dataPlan) {
      if (dataPlanUpdateRequest.hasOwnProperty("planName"))
        dataPlan.planName = dataPlanUpdateRequest.planName || dataPlan.planName;
      if (dataPlanUpdateRequest.hasOwnProperty("description"))
        dataPlan.description =
          dataPlanUpdateRequest.description || dataPlan.description;
      if (dataPlanUpdateRequest.hasOwnProperty("planId"))
        dataPlan.planId = dataPlanUpdateRequest.planId || dataPlan.planId;
      if (dataPlanUpdateRequest.hasOwnProperty("planType"))
        dataPlan.planType = dataPlanUpdateRequest.planType || dataPlan.planType;
      if (dataPlanUpdateRequest.hasOwnProperty("bandwidthLimit"))
        dataPlan.bandwidthLimit = dataPlanUpdateRequest.bandwidthLimit;
      if (
        dataPlanUpdateRequest.hasOwnProperty("timeLimit") &&
        dataPlanUpdateRequest.timeLimit
      )
        dataPlan.timeLimit = dataPlanUpdateRequest.timeLimit;
      if (dataPlanUpdateRequest.hasOwnProperty("renewalTime"))
        dataPlan.renewalTime = dataPlanUpdateRequest.renewalTime;
      if (
        dataPlanUpdateRequest.hasOwnProperty("status") &&
        dataPlanUpdateRequest.status
      )
        dataPlan.status = dataPlanUpdateRequest.status;
      if (dataPlanUpdateRequest.hasOwnProperty("expiryDate"))
        dataPlan.expiryDate = dataPlanUpdateRequest.expiryDate;
      if (dataPlanUpdateRequest.hasOwnProperty("tokenQuantity"))
        dataPlan.tokenQuantity = dataPlanUpdateRequest.tokenQuantity;
      if (dataPlanUpdateRequest.hasOwnProperty("tokenValue"))
        dataPlan.tokenValue = dataPlanUpdateRequest.tokenValue;
      if (dataPlanUpdateRequest.hasOwnProperty("maximumAdsPerDay"))
        dataPlan.maximumAdsPerDay = dataPlanUpdateRequest.maximumAdsPerDay;
      if (dataPlanUpdateRequest.hasOwnProperty("validity"))
        dataPlan.validity = dataPlanUpdateRequest.validity;
      if (dataPlanUpdateRequest.hasOwnProperty("uot"))
        dataPlan.uot = dataPlanUpdateRequest.uot;
      if (dataPlanUpdateRequest.hasOwnProperty("priceInRupees"))
        dataPlan.priceInRupees = dataPlanUpdateRequest.priceInRupees;
      if (
        dataPlanUpdateRequest.hasOwnProperty("xiKasuTokens") &&
        dataPlanUpdateRequest.xiKasuTokens
      )
        dataPlan.xiKasuTokens = dataPlanUpdateRequest.xiKasuTokens;

      dataPlan.modifiedOn = new Date();
      let response = await dataPlan.save();
      serviceResponse.success = true;
      serviceResponse.statusCode = "200";
      serviceResponse.result = {
        identifier: response.identifier,
        message: "Dataplan updated successfully.",
      };
      return serviceResponse;
    }
    const errorMessage = `Data Plan not found.`;
    this.setError(serviceResponse, errorMessage, "404");
    return serviceResponse;
  }

  private setError = (
    serviceResponse: ServiceResponse,
    errorMessage: string,
    statusCode: string
  ) => {
    serviceResponse.statusCode = statusCode;
    serviceResponse.errors.push(errorMessage);
    logger.error(errorMessage);
  };
}

export const dataPlanService = new DataPlanService();
