import { ServiceResponse } from "../models/response/ServiceResponse";
// import { DatabaseProvider } from "../database/database.provider";
import _ from "lodash";
// import { DataAccountingRepository } from "../database/repositories/data.accounting.repository";
import { DataAccountingRepository } from "../database/mongodb/repositories/data.accounting.repository";
// import { DataPlanRepository } from "../database/repositories/data.plan.repository";
import { DataPlanRepository } from "../database/mongodb/repositories/data.plan.repository";
import { userDeviceService } from "./user.device.service";
import { setError } from "../utils/shared";
// import { UserRepository } from "../database/repositories/user.repository";
import { UserRepository } from "../database/mongodb/repositories/user.repository";
import { UserDeviceRepository } from "../database/mongodb/repositories/user.device.repository";
// import { DataUserTokenRepository } from "../shared/database/repositories/data.user.token.repository";
import { DataUserTokenRepository } from "../database/mongodb/repositories/data.user.token.repository";
// import { DataSessionRepository } from "../database/repositories/data.session.repository";
import { DataSessionRepository } from "../database/mongodb/repositories/data.session.repository";
// import { IDataUsageHistoryRequest } from "../models/schema/dataUsage/data.usage.filter.schema";
import { IDataUsageHistoryRequest } from "../reqSchema/data.usage.schema";
// import { SsidRepository } from "../database/repositories/ssid.repository";
import { SsidRepository } from "../database/mongodb/repositories/ssid.repository";
// import { PdoaConfigRepository } from "../database/repositories/pdoa.config.repository";
import { PdoaConfigRepository } from "../database/mongodb/repositories/pdoa.config.repository";

export class DataUsageService {
  dataAccountingRepository: DataAccountingRepository;
  dataPlanRepository: DataPlanRepository;
  userRepository: UserRepository;
  dataUserTokenRepository: DataUserTokenRepository;
  dataSessionRepository: DataSessionRepository;
  ssidRepository: SsidRepository;
  pdoaConfigRepository: PdoaConfigRepository;
  userDeviceRepository: UserDeviceRepository;
  constructor() {
    this.dataAccountingRepository = new DataAccountingRepository();
    this.dataPlanRepository = new DataPlanRepository();
    this.userRepository = new UserRepository();
    this.dataUserTokenRepository = new DataUserTokenRepository();
    this.dataSessionRepository = new DataSessionRepository();
    this.ssidRepository = new SsidRepository();
    this.pdoaConfigRepository = new PdoaConfigRepository();
    this.userDeviceRepository = new UserDeviceRepository();
  }
  public async getDataAccountingHistory(
    dataUsageHistoryrequest: IDataUsageHistoryRequest["query"]
  ): Promise<ServiceResponse> {
    console.log("start 46");
    const serviceResponse = new ServiceResponse();
    //const connection = await DatabaseProvider.getConnection();
    const loginUser = await this.userDeviceRepository.findOne(
      dataUsageHistoryrequest.userDeviceId
    );
    if (!loginUser) {
      const errorMessage = `User not found.`;
      setError(serviceResponse, errorMessage, "404");
      return serviceResponse;
    }

    //let userRepository = connection.getCustomRepository(UserRepository);
    let user = await this.userRepository.findByUserId(loginUser.userId);
    if (!user) {
      setError(serviceResponse, `User not found.`, "404");
      return serviceResponse;
    }

    if (!user.apUserName) {
      // user has no data uses
      return serviceResponse.setSuccess([]);
    }
    // let dataAccountingRepository = connection.getCustomRepository(
    //   DataAccountingRepository
    // );
    // const ssidRepo = connection.getCustomRepository(SsidRepository);
    // const pdoaConfigRepo = connection.getCustomRepository(PdoaConfigRepository);
    console.log(user.userID, "user");
    let dataUsageHistory =
      await this.dataAccountingRepository.findDataAccountingHistory(
        user.userID,
        dataUsageHistoryrequest.currentPage,
        dataUsageHistoryrequest.pageSize,
        dataUsageHistoryrequest.userPlanId,
        dataUsageHistoryrequest.planType
      );
    // console.log(dataUsageHistory, "dataUsageHistory");
    // serviceResponse.result = dataUsageHistory;
    let dataAccountInfolist: any = [];
    if (dataUsageHistory.length > 0) {
      // if (dataUsageHistoryrequest.userPlanId) {
      //   let userPlanIds = [dataUsageHistoryrequest.userPlanId.toString()];
      //   let sources = ["XiFiNow", "XiFiMax"];
      //   // const dataUserTokenRepository = connection.getCustomRepository(
      //   //   DataUserTokenRepository
      //   // );
      //   let dataUserTokens =
      //     await this.dataUserTokenRepository.findDataUserTokens(
      //       userPlanIds,
      //       sources
      //     );
      //   // const dataPlanRepository = connection.getCustomRepository(
      //   //   DataPlanRepository
      //   // );
      //   let dataPlans = await this.dataPlanRepository.findAllActivePlans();
      //   dataAccountInfolist = await Promise.all(
      //     _.map(dataUsageHistory, async (dataAccounting: any) => {
      //       let dataPlan = _.find(
      //         dataPlans,
      //         (item) => item.planId == dataAccounting.planId
      //       );
      //       dataAccounting.planName = dataPlan ? dataPlan.planName : null;
      //       dataAccounting.xiKasuTokenBalance = null;
      //       dataAccounting.dataUserTokenId = null;
      //       dataAccounting.xiKasuTokens = null;
      //       dataAccounting.tokenSource = null;
      //       let dataUserToken = _.find(
      //         dataUserTokens,
      //         (item) => item.referenceNo == dataAccounting.userPlanId
      //       );
      //       if (dataUserToken) {
      //         dataAccounting.xiKasuTokenBalance = dataUserToken
      //           ? dataUserToken.balance
      //           : null;
      //         dataAccounting.dataUserTokenId = dataUserToken
      //           ? dataUserToken.identifier
      //           : null;
      //         dataAccounting.xiKasuTokens = dataUserToken
      //           ? dataUserToken.tokens
      //           : 0;
      //         dataAccounting.tokenSource = dataUserToken
      //           ? dataUserToken.source
      //           : null;
      //       }
      //       dataAccounting.pdoaName = null;
      //       dataAccounting.ssid = {
      //         jsp: null,
      //         rate: null,
      //         latitude: null,
      //         langitude: null,
      //         deviceUsed: null,
      //         sSID: null,
      //       };

      //       const ssid = await this.ssidRepository.findByDeviceId(
      //         dataAccounting.calledStation.replace(/-/g, ":"),
      //         ["sSID", "latitude", "langitude", "providerID", "avgSpeed"]
      //       );
      //       if (ssid) {
      //         dataAccounting.ssid.sSID = ssid.sSID;
      //         dataAccounting.ssid.rate = ssid.avgSpeed;
      //         dataAccounting.ssid.latitude = ssid.latitude;
      //         dataAccounting.ssid.langitude = ssid.langitude;

      //         if (ssid.providerID) {
      //           const pdoaInfo = await this.pdoaConfigRepository.findByPdoaId(
      //             ssid.providerID
      //           );
      //           if (pdoaInfo) {
      //             dataAccounting.ssid.jsp = pdoaInfo.pdoaName;
      //             dataAccounting.pdoaName = pdoaInfo.pdoaName;
      //           }
      //         }
      //       }
      //       return dataAccounting;
      //     })
      //   );
      // }
      if (dataUsageHistoryrequest.planType) {
        // const dataSessionRepository = connection.getCustomRepository(
        //   DataSessionRepository
        // );
        let dataUsageHistory =
          await this.dataSessionRepository.findDataAccountingHistory(
            user.userID,
            dataUsageHistoryrequest.currentPage,
            dataUsageHistoryrequest.pageSize,
            dataUsageHistoryrequest.planType
          );
        console.log(dataUsageHistory, "171");
        dataAccountInfolist = await Promise.all(
          _.map(dataUsageHistory, async (dataAccounting: any) => {
            // for (let dataAccounting of dataUsageHistory) {
            let dataAccountingCopy: any = {};
            // dataAccounting.planName = null;
            // dataAccounting.dataUserTokenId = null;
            // dataAccounting.tokenSource = dataAccounting.category;
            // dataAccounting.referenceId = null;
            // dataAccounting.pdoaName = null;
            dataAccounting.other = {
              pdoaName: null,
              referenceId: null,
              tokenSource: dataAccounting.category,
              dataUserTokenId: null,
              planName: null,
            };
            dataAccounting.ssid = {
              jsp: null,
              rate: null,
              latitude: null,
              langitude: null,
              deviceUsed: loginUser.deviceModel,
              sSID: null,
            };
            console.log(
              dataAccounting.calledStation,
              "dataAccounting.calledStation"
            );
            // const calledStation = dataAccounting.calledStation.toLowerCase()
            const ssid = await this.ssidRepository.findByDeviceId(
              dataAccounting.calledStation.replace(/-/g, ":")
            );
            console.log(ssid, "ssid");
            if (ssid) {
              dataAccounting.ssid.sSID = ssid.sSID;
              dataAccounting.ssid.rate = ssid.avgSpeed;
              dataAccounting.ssid.latitude = ssid.latitude;
              dataAccounting.ssid.langitude = ssid.langitude;
              if (ssid.providerID) {
                const pdoaInfo = await this.pdoaConfigRepository.findByPdoaId(
                  ssid.providerID
                );
                if (pdoaInfo) {
                  dataAccounting.ssid.jsp = pdoaInfo.pdoaName;
                  dataAccounting.other.pdoaName = pdoaInfo.pdoaName;
                }
              }
            } //remove when ssid issue resolved
            dataAccounting.ssid.deviceUsed = loginUser.deviceModel;
            dataAccountingCopy = JSON.parse(
              (
                JSON.stringify(dataAccounting) +
                JSON.stringify(dataAccounting.ssid) +
                JSON.stringify(dataAccounting.other)
              ).replace(/}{/g, ",")
            );
            // } uncomment when ssid resolved
            // console.log(dataAccountingCopy, "dataAccountingCopy");
            return dataAccountingCopy;
            // }
          })
        );
      }
      serviceResponse.result = dataAccountInfolist;
    }
    serviceResponse.success = true;
    serviceResponse.statusCode = "200";
    return serviceResponse;
  }
}

export const dataUsageService = new DataUsageService();
