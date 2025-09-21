import { ServiceResponse } from "../models/response/ServiceResponse";
// import TokenPlanCreateRequest from "../models/request/tokenplan/token.plan.create.request";
// import TokenPlanUpdateRequest from "../models/request/tokenplan/token.plan.update.request";
import {
  ITokenPlanCreateRequest,
  ITokenPlanUpdateRequest,
  ITokenplanGetRequest,
} from "../reqSchema/token.plan.schema";
// import { DatabaseProvider } from "../database/database.provider";
// import { TokenPlanRepository } from "../database/repositories/token.plan.repository";
import { TokenPlanRepository } from "../database/mongodb/repositories/token.plan.repository";
import { setError } from "../utils/shared";
import { userDeviceService } from "./user.device.service";
import _ from "lodash";

import { CommandRepository } from "../database/mongodb/repositories/comman.repository";
export class TokenPlanService {
  tokenPlanRepository: TokenPlanRepository;
  commandRepository: CommandRepository;
  constructor() {
    this.tokenPlanRepository = new TokenPlanRepository();
    this.commandRepository = new CommandRepository();
  }
  public async createDataPlan(
    requestModel: ITokenPlanCreateRequest["body"]
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();

    // const connection = await DatabaseProvider.getConnection();
    // const tokenplanRepository = connection.getCustomRepository(
    //   TokenPlanRepository
    // );
    const existedPlans =
      await this.tokenPlanRepository.findByAmountOrKiKasuTokens(
        requestModel.amount,
        requestModel.xiKasuTokens
      );

    let tokenplanAmountList = _.filter(
      existedPlans,
      (item) => item.amount == requestModel.amount
    );
    let tokenplanTokensList = _.filter(
      existedPlans,
      (item) => item.xiKasuTokens == requestModel.xiKasuTokens
    );
    let validationResponse = this.checkAmountXiKasuTokensTokenPlans(
      tokenplanAmountList,
      tokenplanTokensList,
      requestModel.amount,
      requestModel.xiKasuTokens
    );
    if (!validationResponse.success) {
      return validationResponse;
    }

    let getIdentifier: any = await this.commandRepository.generateKey(
      "TokenPlan"
    );
    if (!getIdentifier) {
      const errorMessage = `Identifier not generate.`;
      setError(serviceResponse, errorMessage, "404");
      return serviceResponse;
    }
    requestModel.identifier = parseInt(getIdentifier);
    let entity = await this.tokenPlanRepository.createAndSave(requestModel);
    if (entity) {
      serviceResponse.statusCode = "200";
      serviceResponse.success = true;
      serviceResponse.result = {
        identifier: entity.identifier,
        message: "TokenPlan details created successfully.",
      };
    } else {
      const errorMessage = `TokenPlan details not created.`;
      setError(serviceResponse, errorMessage, "400");
    }

    return serviceResponse;
  }

  public async updateDataPlan(
    identifier: ITokenPlanUpdateRequest["params"],
    tokenPlanUpdateRequest: ITokenPlanUpdateRequest["body"]
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    // const connection = await DatabaseProvider.getConnection();
    // const tokenplanRepository = connection.getCustomRepository(
    //   TokenPlanRepository
    // );
    const existedPlans =
      await this.tokenPlanRepository.findByAmountOrKiKasuTokens(
        tokenPlanUpdateRequest.amount,
        tokenPlanUpdateRequest.xiKasuTokens
      );

    let tokenplanAmountList = _.filter(
      existedPlans,
      (item) =>
        item.amount == tokenPlanUpdateRequest.amount &&
        item.identifier != identifier
    );
    let tokenplanTokensList = _.filter(
      existedPlans,
      (item) =>
        item.xiKasuTokens == tokenPlanUpdateRequest.xiKasuTokens &&
        item.identifier != identifier
    );
    let validationResponse = this.checkAmountXiKasuTokensTokenPlans(
      tokenplanAmountList,
      tokenplanTokensList,
      tokenPlanUpdateRequest.amount,
      tokenPlanUpdateRequest.xiKasuTokens
    );
    if (!validationResponse.success) {
      return validationResponse;
    }

    let tokenPlan = await this.tokenPlanRepository.findByidentifier(identifier);
    if (tokenPlan) {
      if (tokenPlanUpdateRequest.hasOwnProperty("name"))
        tokenPlan.name = tokenPlanUpdateRequest.name;
      if (tokenPlanUpdateRequest.hasOwnProperty("amount"))
        tokenPlan.amount = tokenPlanUpdateRequest.amount;
      if (tokenPlanUpdateRequest.hasOwnProperty("currency"))
        tokenPlan.currency = tokenPlanUpdateRequest.currency;
      if (tokenPlanUpdateRequest.hasOwnProperty("status"))
        tokenPlan.status = tokenPlanUpdateRequest.status;
      if (tokenPlanUpdateRequest.hasOwnProperty("xiKasuTokens"))
        tokenPlan.xiKasuTokens = tokenPlanUpdateRequest.xiKasuTokens;
      if (tokenPlanUpdateRequest.hasOwnProperty("description"))
        tokenPlan.description = tokenPlanUpdateRequest.description;
      tokenPlan.modifiedOn = new Date();
      let response = await tokenPlan.save();
      serviceResponse.success = true;
      serviceResponse.statusCode = "200";
      serviceResponse.result = {
        identifier: response.identifier,
        message: "Tokenplan updated successfully.",
      };
      return serviceResponse;
    }
    const errorMessage = `Token Plan not found.`;
    setError(serviceResponse, errorMessage, "404");
    return serviceResponse;
  }

  private checkAmountXiKasuTokensTokenPlans(
    tokenplanAmountList: any,
    tokenplanTokensList: any,
    amount: number,
    xiKasuTokens: number
  ): ServiceResponse {
    let serviceResponse = new ServiceResponse();
    if (
      (tokenplanAmountList && tokenplanAmountList.length > 0) ||
      (tokenplanTokensList && tokenplanTokensList.length > 0)
    ) {
      if (
        tokenplanAmountList &&
        tokenplanAmountList.length > 0 &&
        tokenplanTokensList &&
        tokenplanTokensList.length > 0
      ) {
        const errorMessage1 = `Token Plan amount with ${amount} already existed.`;
        setError(serviceResponse, errorMessage1, "400");

        const errorMessage2 = `Token Plan XiKasuTokens with ${xiKasuTokens} already existed.`;
        setError(serviceResponse, errorMessage2, "400");
      } else if (tokenplanAmountList && tokenplanAmountList.length > 0) {
        const errorMessage = `Token Plan amount with ${amount} already existed.`;
        setError(serviceResponse, errorMessage, "400");
      } else if (tokenplanTokensList && tokenplanTokensList.length > 0) {
        const errorMessage = `Token Plan XiKasuTokens with ${xiKasuTokens} already existed.`;
        setError(serviceResponse, errorMessage, "400");
      }
      return serviceResponse;
    }
    serviceResponse.success = true;
    serviceResponse.result = { message: "No issues found." };
    serviceResponse.statusCode = "200";
    return serviceResponse;
  }

  public async getTokenPlanByIdentifier(
    identifier: ITokenplanGetRequest["params"]
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();

    // const connection = await DatabaseProvider.getConnection();
    // const tokenplanRepository = connection.getCustomRepository(
    //   TokenPlanRepository
    // );
    let tokenPlan = await this.tokenPlanRepository.findByidentifier(identifier);
    if (tokenPlan) {
      serviceResponse.statusCode = "200";
      serviceResponse.success = true;
      serviceResponse.result = tokenPlan;
      return serviceResponse;
    }
    const errorMessage = `Token Plan not found.`;
    setError(serviceResponse, errorMessage, "404");
    return serviceResponse;
  }

  public async deleteTokenPlan(
    identifier: ITokenplanGetRequest["params"]
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    // const connection = await DatabaseProvider.getConnection();
    // const tokenplanRepository = connection.getCustomRepository(
    //   TokenPlanRepository
    // );
    let dataPlan = await this.tokenPlanRepository.findByidentifier(identifier);
    if (dataPlan) {
      let response = await dataPlan.remove();
      serviceResponse.success = true;
      serviceResponse.statusCode = "200";
      serviceResponse.result = {
        identifier: identifier,
        message: "Token plan deleted successfully.",
      };
      return serviceResponse;
    }
    const errorMessage = `Token plan not found to delete.`;
    setError(serviceResponse, errorMessage, "404");
    return serviceResponse;
  }

  public async getTokenPlans(identifier: any): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    // const connection = await DatabaseProvider.getConnection();
    // const tokenplanRepository = connection.getCustomRepository(
    //   TokenPlanRepository
    // );
    let tokenPlans = await this.tokenPlanRepository.find(identifier);
    if (tokenPlans !== null && tokenPlans) {
      serviceResponse.statusCode = "200";
      serviceResponse.success = true;
      serviceResponse.result = tokenPlans;
      return serviceResponse;
    }

    const errorMessage = `No Token plans are found.`;
    setError(serviceResponse, errorMessage, "404");
    return serviceResponse;
  }

  public async getActivePlans(query: any): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();

    let loginUser = userDeviceService.getLoginUser();
    if (!loginUser) {
      const errorMessage = `User not found.`;
      setError(serviceResponse, errorMessage, "404");
      return serviceResponse;
    }

    // const connection = await DatabaseProvider.getConnection();
    // const tokenplanRepository = connection.getCustomRepository(
    //   TokenPlanRepository
    // );
    let tokenPlans: any = await this.tokenPlanRepository.getActivePlans();
    tokenPlans.paymentDisable = process.env.Payment_Disable;
    console.log("tokenPlans........", tokenPlans);
    if (tokenPlans !== null && tokenPlans) {
      serviceResponse.statusCode = "200";
      serviceResponse.success = true;
      serviceResponse.result = {
        tokenPlans,
        paymentDisable: process.env.Payment_Disable,
      };
      return serviceResponse;
    } else {
      const errorMessage = `TokenPlans not found.`;
      setError(serviceResponse, errorMessage, "404");
    }

    return serviceResponse;
  }
}

export const tokenPlanService = new TokenPlanService();
