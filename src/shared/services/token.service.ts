import { ServiceResponse } from "../../models/response/ServiceResponse";
// import { DatabaseProvider } from "../../database/database.provider";
// import DataUserTokenModel from "../models/data.user.token.model";
import { IDataUserTokenRequest } from "../../reqSchema/data.user.token.schema";
import _ from "lodash";
// import { DataUserTokenRepository } from "../database/repositories/data.user.token.repository";
import { DataUserTokenRepository } from "../../database/mongodb/repositories/data.user.token.repository";
// import { DataUserTokenBalanceRepository } from "../database/repositories/data.user.token.balance.repository";
import { DataUserTokenBalanceRepository } from "../../database/mongodb/repositories/data.user.token.balance.repository";
// import DataUserTokenBalanceModel from "../models/data.user.token.balance";
import { IDataUserTokenBalanceRequest } from "../../reqSchema/user.create.schema";
import logger from "../../config/winston.logger";
import { userDeviceService } from "../../services/user.device.service";
import { setError } from "../../utils/shared";
import { XiKasuSourceEnum } from "../enums/xikasu.source.enum";
// import { IXiKasuTokenHistoryRequest } from "../../models/schema/xikasu.token.filter.schema";
import {
  IXiKasuTokenHistoryRequest,
  IXiKasuTokenTransferRequest,
  IXiKasuTokenAssignRequest,
  IXiKasuTokenSendRequest,
} from "../../reqSchema/xikasu.token.schema";

export class TokenService {
  dataUserTokenRepository: DataUserTokenRepository;
  dataUserTokenBalanceRepository: DataUserTokenBalanceRepository;
  constructor() {
    this.dataUserTokenRepository = new DataUserTokenRepository();
    this.dataUserTokenBalanceRepository = new DataUserTokenBalanceRepository();
  }

  public async saveTokens(
    dataUserTokenModel: IDataUserTokenRequest
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    let balanceTokens = 0;
    //const connection = await DatabaseProvider.getConnection();
    // let dataUserTokenBalanceRepository = connection.getCustomRepository(
    //   DataUserTokenBalanceRepository
    // );
    let dataUserTokenBalance =
      await this.dataUserTokenBalanceRepository.findOne(
        dataUserTokenModel.userId
      );
    if (dataUserTokenBalance) {
      balanceTokens =
        dataUserTokenModel.transactionType == "Dr"
          ? dataUserTokenBalance.tokens - dataUserTokenModel.tokens
          : dataUserTokenBalance.tokens + dataUserTokenModel.tokens;
      dataUserTokenBalance.tokens = balanceTokens;
      dataUserTokenBalance.modifiedOn = new Date();
      dataUserTokenBalance = await dataUserTokenBalance.save();
    } else {
      balanceTokens = dataUserTokenModel.tokens;
      let dataUserTokenBalanceModel: IDataUserTokenBalanceRequest = {
        userId: dataUserTokenModel.userId,
        tokens: balanceTokens,
        status: "Active",
      };
      dataUserTokenBalance =
        await this.dataUserTokenBalanceRepository.createAndSave(
          dataUserTokenBalanceModel
        );
    }
    // let dataUserTokenRepository = connection.getCustomRepository(
    //   DataUserTokenRepository
    // );
    dataUserTokenModel.balance = balanceTokens;
    let dataUserToken = await this.dataUserTokenRepository.createAndSave(
      dataUserTokenModel
    );
    serviceResponse.success = true;
    serviceResponse.statusCode = "200";
    serviceResponse.result = {
      tokensEarned: dataUserTokenModel.tokens,
      totalTokens: dataUserTokenBalance ? dataUserTokenBalance.tokens : 0, //Ask About this contions
    };
    return serviceResponse;
  }

  public async getDataUserTokenByReferenceNo(
    userId: string,
    referenceNo: string
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();

    //const connection = await DatabaseProvider.getConnection();
    // let dataUserTokenRepository = connection.getCustomRepository(
    //   DataUserTokenRepository
    // );
    let dataUserToken =
      await this.dataUserTokenRepository.findByTokenReferenceNo(
        userId,
        referenceNo
      );
    if (dataUserToken) {
      // let dataUserTokenBalanceRepository = connection.getCustomRepository(
      //   DataUserTokenBalanceRepository
      // );
      let dataUserTokenBalance =
        await this.dataUserTokenBalanceRepository.findOne(userId);
      serviceResponse.success = true;
      serviceResponse.statusCode = "200";
      serviceResponse.result = {
        xiKasuTokens: dataUserToken.tokens,
        totalTokens: dataUserTokenBalance ? dataUserTokenBalance.tokens : null,
      };
    } else {
      serviceResponse.statusCode = "400";
      serviceResponse.errors.push("Data user token not found.");
    }

    return serviceResponse;
  }

  public async getTokenHistory(
    xiKasuTokenHistoryRequest: IXiKasuTokenHistoryRequest["query"]
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();

    // const connection = await DatabaseProvider.getConnection();
    let loginUser = userDeviceService.getLoginUser();
    if (!loginUser) {
      const errorMessage = "User not found";
      setError(serviceResponse, errorMessage, "404");
      return serviceResponse;
    }
    let result: any = {};
    result.userId = loginUser.userId;
    // let dataUserTokenBalanceRepository = connection.getCustomRepository(
    //   DataUserTokenBalanceRepository
    // );
    let dataUserTokenBalance =
      await this.dataUserTokenBalanceRepository.findOne(loginUser.userId);
    result.tokenBalance = dataUserTokenBalance
      ? dataUserTokenBalance.tokens
      : 0;

    // let dataUserTokenRepository = connection.getCustomRepository(
    //   DataUserTokenRepository
    // );
    console.log(dataUserTokenBalance, "dataUserTokenBalance");
    let dataUserTokens =
      await this.dataUserTokenRepository.findXiKasuTokenHistory(
        loginUser.userId,
        xiKasuTokenHistoryRequest.currentPage,
        xiKasuTokenHistoryRequest.pageSize
      );
    console.log(dataUserTokens, "dataUserTokens");
    if (dataUserTokens) {
      let dataUserTokenHistory = _.map(dataUserTokens, (item: any) => {
        item.adId = null;
        item.voucherId = null;
        item.userPlanId = null;
        item.dataAccountingId = null;
        item.referrerId = null;
        item.refereeId = null;
        if (item.createdOn) {
          const dt = new Date(item.createdOn);
          item.createdOn = new Date(dt.getTime() + (5 * 60 + 30) * 60 * 1000);
        }
        if (item.source == XiKasuSourceEnum.XiFiFree) {
          item.adId = item.referenceNo;
        }
        if (item.source == XiKasuSourceEnum.Voucher) {
          item.voucherId = item.referenceNo;
        }
        if (
          item.source == XiKasuSourceEnum.XiFiNow ||
          item.source == XiKasuSourceEnum.XiFiMax
        ) {
          item.userPlanId = item.referenceNo;
        }
        if (item.source == XiKasuSourceEnum.XiFiConnect) {
          item.dataAccountingId = item.referenceNo;
        }
        if (item.source == XiKasuSourceEnum.XiKasuAd) {
          item.adId = item.referenceNo;
        }
        if (item.source == XiKasuSourceEnum.RefereeBonus) {
          item.refereeId = item.referenceNo;
        }
        if (item.source == XiKasuSourceEnum.ReferrerBonus) {
          item.referrerId = item.referenceNo;
        }
        return item;
      });

      result.tokenHistory = dataUserTokenHistory;
      serviceResponse.success = true;
      serviceResponse.statusCode = "200";
      serviceResponse.result = result;
      return serviceResponse;
    }
    let errorMessage = "There is no XiKasu history.";
    setError(serviceResponse, errorMessage, "404");
    return serviceResponse;
  }

  public async tokenTransfer(
    IXiKasuTokenTransferRequest: IXiKasuTokenTransferRequest["body"]
  ): Promise<ServiceResponse> {
    const serviceResponse = new ServiceResponse();

    const loginUser = userDeviceService.getLoginUser();
    if (!loginUser) {
      const errorMessage = "User not found";
      setError(serviceResponse, errorMessage, "404");
      return serviceResponse;
    }
    const result: any = {};
    result.userId = loginUser.userId;
    const dataUserTokenBalance =
      await this.dataUserTokenBalanceRepository.findOne(loginUser.userId);
    result.tokenBalance = dataUserTokenBalance;
    const balance = dataUserTokenBalance ? dataUserTokenBalance.tokens : 0;
    if (balance < IXiKasuTokenTransferRequest.token) {
      const errorMessage = "insufficient Token Balance to Transfer ";
      setError(serviceResponse, errorMessage, "401");
      return serviceResponse;
    }

    let transfertokenresult = await this.dataUserTokenRepository.tokenTransfer(
      loginUser.userId,
      IXiKasuTokenTransferRequest.receiverMobile,
      IXiKasuTokenTransferRequest.token,
      IXiKasuTokenTransferRequest.countryCode
    );
    if (transfertokenresult) {
      serviceResponse.success = true;
      serviceResponse.statusCode = "200";
      serviceResponse.result = transfertokenresult;
      return serviceResponse;
    }
    const errorMessage = "Internal Server Error";
    setError(serviceResponse, errorMessage, "500");
    return serviceResponse;
  }

  public async tokenAssign(
    IXiKasuTokenAssignRequest: IXiKasuTokenAssignRequest["body"]
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();

    const result = await this.dataUserTokenRepository.tokenAssign(
      IXiKasuTokenAssignRequest.receiverMobile,
      IXiKasuTokenAssignRequest.token,
      IXiKasuTokenAssignRequest.countryCode
    );
    if (result) {
      serviceResponse.success = true;
      serviceResponse.statusCode = "200";
      serviceResponse.result = result;
      return serviceResponse;
    }
    let errorMessage = "Internal Server Error";
    setError(serviceResponse, errorMessage, "500");
    return serviceResponse;
  }

  public async tokenAssignByPdo(params: any): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();

    const result = await this.dataUserTokenRepository.tokenAssignByPdo(params);
    if (result) {
      serviceResponse.success = true;
      serviceResponse.statusCode = "200";
      serviceResponse.result = result;
      return serviceResponse;
    }
    let errorMessage = "Internal Server Error";
    setError(serviceResponse, errorMessage, "500");
    return serviceResponse;
  }

  public async tokenSend(
    IXiKasuTokenSendRequest: IXiKasuTokenSendRequest["body"]
  ): Promise<ServiceResponse> {
    const serviceResponse = new ServiceResponse();

    const result: any = {};

    let tokenSendresult = await this.dataUserTokenRepository.tokenSend(
      IXiKasuTokenSendRequest.senderMobile,
      IXiKasuTokenSendRequest.receiverMobile,
      IXiKasuTokenSendRequest.token,
      IXiKasuTokenSendRequest.rCountryCode,
      IXiKasuTokenSendRequest.sCountryCode
    );
    if (tokenSendresult) {
      serviceResponse.success = true;
      serviceResponse.statusCode = "200";
      serviceResponse.result = tokenSendresult;
      return serviceResponse;
    }
    const errorMessage = "Internal Server Error";
    setError(serviceResponse, errorMessage, "500");
    return serviceResponse;
  }
}
export const tokenService = new TokenService();
