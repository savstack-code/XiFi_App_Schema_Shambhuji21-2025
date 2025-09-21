import { ServiceResponse } from "../models/response/ServiceResponse";
// import XifiVoucherCreateRequest from "../models/xifiVoucher/xifi.voucher.request";
// import XifiVoucherUpdateRequest from "../models/xifiVoucher/xifi.voucher.update.request";
import {
  IXifiVoucherCreateRequest,
  IXifiVoucherUpdateRequest,
  IXifiVoucherGetRequest,
} from "../reqSchema/xifi.voucher.schema";
// import { DatabaseProvider } from "../database/database.provider";
// import { XifiVoucherRepository } from "../database/repositories/xifi.voucher.repository";
import { XifiVoucherRepository } from "../database/mongodb/repositories/xifi.voucher.repository";
import { tokenService } from "../shared/services/token.service";
// import DataUserTokenModel from "../shared/models/data.user.token.model";
import { IDataUserTokenRequest } from "../reqSchema/user.create.schema";
// import { DataUserTokenRepository } from "../shared/database/repositories/data.user.token.repository";
import { DataUserTokenRepository } from "../database/mongodb/repositories/data.user.token.repository";
// import { UserRepository } from "../database/repositories/user.repository";
import { UserRepository } from "../database/mongodb/repositories/user.repository";
import { setError } from "../utils/shared";
import { userDeviceService } from "./user.device.service";
import { XiKasuSourceEnum } from "../shared/enums/xikasu.source.enum";
import { CommandRepository } from "../database/mongodb/repositories/comman.repository";
import { number } from "joi";
export class XifiVoucherService {
  xifiVoucherRepository: XifiVoucherRepository;
  dataUserTokenRepository: DataUserTokenRepository;
  userRepository: UserRepository;
  commandRepository: CommandRepository;
  constructor() {
    this.xifiVoucherRepository = new XifiVoucherRepository();
    this.dataUserTokenRepository = new DataUserTokenRepository();
    this.userRepository = new UserRepository();
    this.commandRepository = new CommandRepository();
  }
  public async getVouchers(query: any): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    // const connection = await DatabaseProvider.getConnection();
    // const xifiVoucherRepository = connection.getCustomRepository(
    //   XifiVoucherRepository
    // );
    let xifiVouchers = await this.xifiVoucherRepository.find(query);
    if (xifiVouchers && xifiVouchers.length > 0) {
      serviceResponse.statusCode = "200";
      serviceResponse.success = true;
      serviceResponse.result = xifiVouchers;
      return serviceResponse;
    }

    const errorMessage = `No Vouchers are found.`;
    setError(serviceResponse, errorMessage, "404");
    return serviceResponse;
  }

  public async getVoucherByIdentifier(
    identifier: IXifiVoucherGetRequest["params"]
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();

    //const connection = await DatabaseProvider.getConnection();
    // const xifiVoucherRepository = connection.getCustomRepository(
    //   XifiVoucherRepository
    // );

    let xifiVoucher = await this.xifiVoucherRepository.findOne(identifier);
    if (xifiVoucher) {
      serviceResponse.statusCode = "200";
      serviceResponse.success = true;
      serviceResponse.result = xifiVoucher;
      return serviceResponse;
    }

    const errorMessage = `Voucher not found.`;
    setError(serviceResponse, errorMessage, "404");
    return serviceResponse;
  }

  public async createVoucher(
    requestModel: IXifiVoucherCreateRequest["body"]
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();

    // const connection = await DatabaseProvider.getConnection();
    // const xifiVoucherRepository = connection.getCustomRepository(
    //   XifiVoucherRepository
    // );
    let xifiVoucher = await this.xifiVoucherRepository.findByCode(
      requestModel.code
    );
    if (!xifiVoucher) {
      const voucherIdentifier = await this.commandRepository.generateKey(
        "XifiVoucher"
      );
      if (!voucherIdentifier) {
        const errorMessage = `Voucher ID not generated.`;
        return setError(serviceResponse, errorMessage, "404");
      }
      requestModel.identifier = parseInt(voucherIdentifier.toString());
      let xifiVoucher = await this.xifiVoucherRepository.createAndSave(
        requestModel
      );
      if (xifiVoucher) {
        serviceResponse.statusCode = "200";
        serviceResponse.success = true;
        serviceResponse.result = {
          identifier: xifiVoucher.identifier,
          message: "Voucher details created successfully.",
        };
        return serviceResponse;
      }
    } else {
      const errorMessage = `Voucher already existed.`;
      setError(serviceResponse, errorMessage, "404");
    }

    return serviceResponse;
  }

  public async deleteVoucher(
    identifier: IXifiVoucherUpdateRequest["params"]
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    // const connection = await DatabaseProvider.getConnection();
    // const xifiVoucherRepository = connection.getCustomRepository(
    //   XifiVoucherRepository
    // );
    let ssid = await this.xifiVoucherRepository.findByIdentifier(identifier);
    if (ssid) {
      let response = ssid.remove();
      serviceResponse.success = true;
      serviceResponse.statusCode = "200";
      serviceResponse.result = {
        identifier: identifier,
        message: "Voucher deleted successfully.",
      };
      return serviceResponse;
    }
    const errorMessage = `Voucher not found to delete.`;
    setError(serviceResponse, errorMessage, "404");
    return serviceResponse;
  }

  public async updateVoucher(
    identifier: IXifiVoucherUpdateRequest["params"],
    updateRequest: IXifiVoucherUpdateRequest["body"]
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();

    // const connection = await DatabaseProvider.getConnection();
    // const xifiVoucherRepository = connection.getCustomRepository(
    //   XifiVoucherRepository
    // );
    let xifiVoucher = await this.xifiVoucherRepository.findByIdentifier(
      identifier
    );
    if (xifiVoucher) {
      if (updateRequest.hasOwnProperty("description"))
        xifiVoucher.description = updateRequest.description;
      if (updateRequest.hasOwnProperty("status"))
        xifiVoucher.status = updateRequest.status;
      if (updateRequest.hasOwnProperty("expiryTime"))
        xifiVoucher.expiryTime = new Date(updateRequest.expiryTime);
      if (updateRequest.hasOwnProperty("allowCount"))
        xifiVoucher.allowCount = updateRequest.allowCount;

      xifiVoucher.modifiedOn = new Date();
      let response = await xifiVoucher.save();
      serviceResponse.success = true;
      serviceResponse.statusCode = "200";
      serviceResponse.result = {
        identifier: response.identifier,
        message: "Voucher updated successfully.",
      };
      return serviceResponse;
    }
    const errorMessage = `Voucher not found.`;
    setError(serviceResponse, errorMessage, "404");
    return serviceResponse;
  }

  public async redeemXifiVoucher(code: string): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();

    var user: any;
    let loginUser = userDeviceService.getLoginUser();
    //const connection = await DatabaseProvider.getConnection();
    if (loginUser) {
      // let userRepository = connection.getCustomRepository(UserRepository);
      user = await this.userRepository.findByUserId(loginUser.userId);
      if (!user) {
        const errorMessage = `User not found.`;
        setError(serviceResponse, errorMessage, "404");
        return serviceResponse;
      }
    } else {
      const errorMessage = `User not found.`;
      setError(serviceResponse, errorMessage, "404");
      return serviceResponse;
    }

    let voucherResponse = this.redeemXifiVoucherByUserId(
      code,
      loginUser.userId
    );
    return voucherResponse;
  }

  public async redeemXifiVoucherByUserId(
    code: string,
    userId: string
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();

    // const connection = await DatabaseProvider.getConnection();

    // const xifiVoucherRepository = connection.getCustomRepository(
    //   XifiVoucherRepository
    // );
    let xifiVoucher = await this.xifiVoucherRepository.findByCode(code);
    if (xifiVoucher) {
      if (xifiVoucher.status == "InActive") {
        const errorMessage = `InActive Code, will be available soon.`;
        setError(serviceResponse, errorMessage, "400");
        return serviceResponse;
      }

      if (!xifiVoucher.expiryTime) {
        const errorMessage = `Expiry time is not found.`;
        setError(serviceResponse, errorMessage, "400");
        return serviceResponse;
      }
      let expiryTime = xifiVoucher.expiryTime.getTime();
      let currentTime = new Date().getTime();
      if (
        currentTime > expiryTime ||
        xifiVoucher.status == "Expired" ||
        xifiVoucher.status == "Redeemed"
      ) {
        const errorMessage = `Expired Code.`;
        setError(serviceResponse, errorMessage, "400");
        return serviceResponse;
      }

      if (!xifiVoucher.allowCount) {
        const errorMessage = `Allow Count Not Found.`;
        setError(serviceResponse, errorMessage, "400");
        return serviceResponse;
      }

      if (!xifiVoucher.redeemCount) {
        const errorMessage = `Redeem Count Not Found.`;
        setError(serviceResponse, errorMessage, "400");
        return serviceResponse;
      }

      if (
        xifiVoucher.allowCount != 0 &&
        xifiVoucher.allowCount <= xifiVoucher.redeemCount
      ) {
        const errorMessage = `Reached maximum limit.`;
        setError(serviceResponse, errorMessage, "400");
        return serviceResponse;
      }

      // const dataUserTokenRepository = connection.getCustomRepository(
      //   DataUserTokenRepository
      // );
      let dataUserToken = await this.dataUserTokenRepository.findByReferenceNo(
        "Voucher",
        userId,
        code
      );
      if (dataUserToken) {
        const errorMessage = `You have already used this Code.`;
        setError(serviceResponse, errorMessage, "400");
        return serviceResponse;
      }

      if (!xifiVoucher.xiKasuTokens) {
        const errorMessage = `xiKasuTokens Not Found`;
        setError(serviceResponse, errorMessage, "400");
        return serviceResponse;
      }
      let dataUserTokenModel: IDataUserTokenRequest["body"] = {
        userId: userId,
        referenceNo: xifiVoucher.code,
        transactionType: "Cr",
        status: "Credited",
        tokens: xifiVoucher.xiKasuTokens,
        source: XiKasuSourceEnum.Voucher,
      };
      let tokenResponse = await tokenService.saveTokens(dataUserTokenModel);
      if (tokenResponse.success) {
        xifiVoucher.redeemCount = xifiVoucher.redeemCount + 1;
        if (xifiVoucher.redeemCount == xifiVoucher.allowCount) {
          xifiVoucher.status = "Redeemed";
        }
        xifiVoucher.modifiedOn = new Date();
        let voucherUpdateResponse = await xifiVoucher.save();
        serviceResponse.success = true;
        serviceResponse.statusCode = "200";
        serviceResponse.result = {
          code: xifiVoucher.code,
          tokensEarned: dataUserTokenModel.tokens,
          totalTokens: tokenResponse.result.totalTokens,
          message: `Successfully applied the code ${xifiVoucher.code}.`,
        };
        return serviceResponse;
      }
    } else {
      const errorMessage = `Invalid Code.`;
      setError(serviceResponse, errorMessage, "400");
      return serviceResponse;
    }

    return serviceResponse;
  }
}

export const xifiVoucherService = new XifiVoucherService();
