import { Connection } from "typeorm";
import * as crypto from "crypto";
import * as _ from "lodash";
// import { DatabaseProvider } from "../database/database.provider";
// import { UserRepository } from "../database/repositories/user.repository";
import { UserRepository } from "../database/mongodb/repositories/user.repository";
// import { UserDeviceRepository } from "../database/repositories/user.device.repository";
import { UserDeviceRepository } from "../database/mongodb/repositories/user.device.repository";
// import { PdoaRepository } from "../database/repositories/pdoa.repository";
import { PdoaRepository } from "../database/mongodb/repositories/pdoa.repository";
// import { AppProviderConfigRepository } from "../database/repositories/app.provider.config.repository";
import { AppProviderConfigRepository } from "../database/mongodb/repositories/app.provider.config.repository";
import { ServiceResponse } from "../models/response/ServiceResponse";
// import { SsidRepository } from "../database/repositories/ssid.repository";
import { SsidRepository } from "../database/mongodb/repositories/ssid.repository";
import logger from "../config/winston.logger";
import { HTTP400Error } from "../utils/httpErrors";
// import { ISSIDDoc } from "../shared/database/mongodb.models/ssid.model_removeFile";
import { ISSIDDoc, SSIDModel } from "../database/mongodb/models/ssid.model";

let connection: Connection;
let initialized = false;
// let userRepository: UserRepository;
// let userDeviceRepository: UserDeviceRepository;
// let pdoaRepository: PdoaRepository;
// let appProviderConfigRepository: AppProviderConfigRepository;

let XIFI_PDOA_PUBLIC_KEY: any = null;

let XIFI_APP_PROVIDER_PRIVATE_KEY: any = null;

export class AccountService {
  userRepository: UserRepository;
  userDeviceRepository: UserDeviceRepository;
  pdoaRepository: PdoaRepository;
  appProviderConfigRepository: AppProviderConfigRepository;
  ssidRepository: SsidRepository;
  constructor() {
    this.userRepository = new UserRepository();
    this.userDeviceRepository = new UserDeviceRepository();
    this.pdoaRepository = new PdoaRepository();
    this.appProviderConfigRepository = new AppProviderConfigRepository();
    this.ssidRepository = new SsidRepository();
  }
  private async initialize() {
    // connection = await DatabaseProvider.getConnection();
    initialized = true;
    //pdoaRepository = await connection.getCustomRepository(PdoaRepository);
    // appProviderConfigRepository = await connection.getCustomRepository(
    //   AppProviderConfigRepository
    // );
    //userRepository = await connection.getCustomRepository(UserRepository);
    // userDeviceRepository = await connection.getCustomRepository(
    //   UserDeviceRepository
    // );
  }

  public async pdoaTokenAuthentication(
    wanipdoatoken: string
  ): Promise<ServiceResponse> {
    try {
      // read request param and...
      logger.info("handleAppProviderURL, wanipdoatoken:" + wanipdoatoken);
      wanipdoatoken = wanipdoatoken.split(" ").join("+");
      // get pdoa id
      const tokenArray = wanipdoatoken.split("|");
      const pdoaId = tokenArray[0];
      const keyExpiration = tokenArray[1];
      const requestPacket = tokenArray[2];

      const serviceResponse = new ServiceResponse();

      if (
        pdoaId == null ||
        requestPacket == null ||
        keyExpiration == null ||
        pdoaId == "" ||
        requestPacket == "" ||
        keyExpiration == ""
      ) {
        throw new HTTP400Error("Invalid wanipdoatoken.");
      }

      if (!initialized) {
        await this.initialize();
      }

      const pdoaData = await this.pdoaRepository.findByProviderId(pdoaId);
      if (pdoaData) {
        if (
          pdoaData.keyExp &&
          keyExpiration &&
          pdoaData.keyExp.toString() === keyExpiration
        ) {
          XIFI_PDOA_PUBLIC_KEY = pdoaData.pdoaPublicKey;
        } else {
          const errorMessage = "Invalid Token.";
          this.setError(serviceResponse, errorMessage, "400");
          logger.error(errorMessage);
          return serviceResponse;
        }
      } else {
        const errorMessage = "Invalid Token.";
        this.setError(serviceResponse, errorMessage, "400");
        logger.error(errorMessage);
        return serviceResponse;
      }

      let enctoken;
      let encryptedWaniAppTokenBuffer;
      if (process.env.RSA_CHUNKS && process.env.RSA_CHUNKS == "true") {
        const waniAppToken = this.chunksPublicDecrypt(
          requestPacket,
          XIFI_PDOA_PUBLIC_KEY,
          crypto.constants.RSA_PKCS1_PADDING
        );
        const waniAppTokenArray = waniAppToken.split("|");
        const base64EncryptedToken = waniAppTokenArray[1];
        encryptedWaniAppTokenBuffer = Buffer.from(
          base64EncryptedToken,
          "base64"
        );
      } else {
        enctoken = Buffer.from(requestPacket, "base64");
        logger.info("PDOA Encrypted Token2: " + enctoken);
        encryptedWaniAppTokenBuffer = this.publicDecrypt(
          enctoken,
          XIFI_PDOA_PUBLIC_KEY,
          crypto.constants.RSA_NO_PADDING
        );
      }

      const appProviderConfig = await this.appProviderConfigRepository.find();
      if (appProviderConfig) {
        // XIFI_APP_PROVIDER_PUBLIC_KEY = appProviderConfig[0].publicKey;
        XIFI_APP_PROVIDER_PRIVATE_KEY = appProviderConfig[0].privateKey;
      } else {
        const errorMessage = "Invalid Token.";
        this.setError(serviceResponse, errorMessage, "400");
        return serviceResponse;
      }

      const decryptedTokenBuffer = this.privateDecrypt(
        encryptedWaniAppTokenBuffer,
        XIFI_APP_PROVIDER_PRIVATE_KEY,
        crypto.constants.RSA_PKCS1_PADDING
      );
      const token = decryptedTokenBuffer.toString("utf8");
      console.log(token, "token")
      const tokenObject = JSON.parse(token);
      let userDevice = await this.userDeviceRepository.findOne(
        tokenObject.username
      );
      if (userDevice) {
        const userDevices =
          await this.userDeviceRepository.findUserDevicesByStatus(
            userDevice.userId,
            "Active"
          );
        console.log(userDevice, "UserDevice APP")
        if (userDevices && userDevices.length > 0) {
          userDevice = userDevices[0];
          if (userDevice.pdoaId != pdoaId) {
            userDevice.pdoaId = pdoaId;
            userDevice.modifiedOn = new Date();
            const response = await this.userDeviceRepository.update(userDevice);
            if (response) {
              logger.info("PDOA ID updated " + pdoaId);
            }
          }
          const userInfo = await this.userRepository.findByUserId(
            userDevice.userId
          );
          console.log("172", userDevice.userId, userInfo)
          const mobileNumber = userInfo ? userInfo.mobileNumber : undefined;
          const PDOA_SUCCESS_REDIRECT_PAGE = process.env.XIFI_LAUNCH_URL;
          serviceResponse.result = {
            paymentUrl: PDOA_SUCCESS_REDIRECT_PAGE,
            launchingUrl: PDOA_SUCCESS_REDIRECT_PAGE,
            userId: userDevice.userId,
            mobileNumber,
            devices: _.map(userDevices, (item) => item.deviceId),
          };
          serviceResponse.success = true;
          return serviceResponse;
        }
      } else {
        const errorMessage = `User Not found Active ${tokenObject.username}, when authenticating the pdoa token.`;
        this.setError(serviceResponse, errorMessage, "404");
        logger.error(errorMessage);
        return serviceResponse;
      }

      const errorMessage = `User Not found for mobile number ${tokenObject.username}, when authenticating the pdoa token.`;
      this.setError(serviceResponse, errorMessage, "404");
      logger.error(errorMessage);
      return serviceResponse;
    } catch (error: any) {
      logger.error(error.message);
      throw new HTTP400Error("Invalid Token.");
    }
  }

  public async getAppProviderPublicKey() {
    const serviceResponse = new ServiceResponse();

    //const connection = await DatabaseProvider.getConnection();
    // const appProviderConfigRepository = await connection.getCustomRepository(
    //   AppProviderConfigRepository
    // );
    const appProviderConfig = await this.appProviderConfigRepository.find();
    if (appProviderConfig.length > 0) {
      serviceResponse.success = true;
      serviceResponse.result = {
        providerId: appProviderConfig[0].appProviderId,
        publicKey: appProviderConfig[0].publicKey,
      };
      return serviceResponse;
    }
    const errorMessage = "App Provider keys are not found.";
    this.setError(serviceResponse, errorMessage, "404");
    logger.error(errorMessage);
    return serviceResponse;
  }

  public async getSsids(location?: string): Promise<ServiceResponse> {
    const serviceResponse = new ServiceResponse();
    // const connection = await DatabaseProvider.getConnection();
    let ssids: Array<ISSIDDoc>;
    // const ssidRepository = connection.getCustomRepository(SsidRepository);
    if (location == null || location == "") {
      ssids = await this.ssidRepository.find();
    } else {
      ssids = await this.ssidRepository.findByLocation(location);
    }
    serviceResponse.setSuccess(ssids);
    return serviceResponse;
  }

  private chunksPublicDecrypt = (
    data: string,
    publicKey: string,
    padding: any
  ) => {
    let decrypted = "";
    const buffer = Buffer.from(data, "base64"); // buffer is the base64 decoded string
    const byteLength: any = process.env.RSA_BYTE_LENGTH
      ? process.env.RSA_BYTE_LENGTH
      : 256;
    const size = parseInt(byteLength);
    const keyOptions = { key: publicKey, padding: padding };
    for (let i = 0; i < buffer.length; i += size) {
      const decryptedBufer = crypto.publicDecrypt(
        keyOptions,
        buffer.slice(i, i + size)
      );
      decrypted += decryptedBufer.toString("utf8");
    }
    return decrypted;
  };

  private privateDecrypt = (data: any, privateKey: string, padding: any) => {
    const buffer = Buffer.from(data);
    const keyOptions = { key: privateKey, padding: padding };
    const decryptedBufer = crypto.privateDecrypt(keyOptions, buffer);
    return decryptedBufer;
  };

  private setError = (
    serviceResponse: ServiceResponse,
    errorMessage: string,
    statusCode: string
  ) => {
    serviceResponse.statusCode = statusCode;
    serviceResponse.errors.push(errorMessage);
    logger.error(errorMessage);
  };

  private publicDecrypt = (data: any, publicKey: string, padding: any) => {
    const buffer = Buffer.from(data);
    const keyOptions = { key: publicKey, padding: padding };
    const decrypted = crypto.publicDecrypt(keyOptions, buffer);
    return decrypted;
  };
}

export const accountService = new AccountService();
