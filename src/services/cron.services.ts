import _ from "lodash";
import request from "request-promise";
import { parseStringPromise } from "xml2js";
import Bluebird from "bluebird";

import { ServiceResponse } from "../models/response/ServiceResponse";
import { PdoaConfigRepository } from "../database/mongodb/repositories/pdoa.config.repository";
import { SsidRepository } from "../database/mongodb/repositories/ssid.repository";
import { IPdoaCreateRequest } from "../reqSchema/pdoa.schema";
import { ISsidCreateRequest } from "../reqSchema/ssid.schema";

import logger from "../config/winston.logger";

export class CronServices {
  pdoaConfigRepository: PdoaConfigRepository;
  ssidRepository: SsidRepository;
  constructor() {
    this.pdoaConfigRepository = new PdoaConfigRepository();
    this.ssidRepository = new SsidRepository();
  }

  public async migrateCdotPdoa(data: any): Promise<void> {
    // const serviceResponse = new ServiceResponse();
    // const connection = await DatabaseProvider.getConnection();
    // const userDeviceRepository = connection.getCustomRepository(
    //   UserDeviceRepository
    // );
    // const userRepository = connection.getCustomRepository(UserRepository);
    const cdotData = JSON.parse(data);
    const pdoaConfigData = cdotData?.WaniRegistry?.PDOAs[0]?.PDOA;

    logger.info(`cDot synced started`);
    for (const item of pdoaConfigData) {
      let itemData = item.$;
      let pdoaKey = item?.Keys[0]?.Key[0]?._;
      let pdoaKeyExp = item?.Keys[0]?.Key[0]?.$?.exp;

      const pdoaId = itemData.id;
      const pdoaPublicKey = pdoaKey;
      const keyExp = pdoaKeyExp;
      const apiBasePath = itemData.apUrl || null;
      const apUrl = itemData.apUrl;
      const createdOn = new Date().getTime();
      const modifiedOn = new Date().getTime();
      const createdBy = "Admin";
      const modifiedBy = "Admin";
      const pdoaName = itemData.name;

      const mongoData: IPdoaCreateRequest["body"] = {
        // id: index,
        pdoaId,
        pdoaPublicKey,
        keyExp,
        pdoaName,
        imageUrl: "",
        updateDataPolicyUrl: "",
        stopUserSessionUrl: "",
        provider: "cDot",
        apUrl,
      };
      const pdatResult = await this.pdoaConfigRepository.createAndUpdate(
        mongoData
      );
      await this.migrateSsidData(apiBasePath, pdoaId);
    }
    logger.info(`cDot synced successfully`);
  }

  public async migrateSsidData(
    apiBasePath: string,
    providerId: string
  ): Promise<void> {
    if (!apiBasePath) {
      logger.error(`apiBasePath is required`);
      return Promise.resolve();
    }
    const responseTxt = await request(apiBasePath);

    const responseTxtAbx = JSON.stringify(responseTxt);
    const response = JSON.parse(responseTxtAbx);
    if (!response) {
      logger.error(
        `Unable to get data from ${apiBasePath}. err: ${JSON.stringify(
          response
        )}`
      );
      return Promise.resolve();
    }

    const results = await parseStringPromise(response);
    let data = JSON.stringify(results);

    const cdotSsidData = JSON.parse(data);
    if (
      !cdotSsidData ||
      !cdotSsidData.WaniAPList ||
      !cdotSsidData.WaniAPList.Location ||
      cdotSsidData.WaniAPList["Location"].length === 0
    ) {
      logger.debug(`No location found for this PDOA: ${providerId}`);
      return Promise.resolve();
    }

    const loationArr = cdotSsidData.WaniAPList["Location"];

    await Bluebird.map(
      loationArr,
      async (locationData: any) => {
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        let cPURLValue,
          deviceIDValue,
          sSIDValue,
          locationNameValue,
          stateValue,
          locationTypeValue,
          addressValue,
          latitudeValue,
          langitudeValue,
          openBetween,
          paymentModes = "",
          freeBand,
          avgSpeed = 0;
        let statusValue: "Active" | "InActive" = "InActive";

        if (locationData.$) {
          locationNameValue = locationData.$?.name || "";
          stateValue = locationData.$?.state || "";
          locationTypeValue = locationData.$?.type || "";
          addressValue = locationData.$?.name || "";

          const apData = locationData?.AP[0]?.$;
          const tagData = locationData?.AP[0]?.Tag;

          if (apData && apData["geoLoc"]) {
            const latLang = apData["geoLoc"].split(",");
            if (latLang && latLang.length == 2) {
              latitudeValue = latLang[0];
              langitudeValue = latLang[1];
            }
          }
          if (tagData && tagData.length > 0) {
            for (const item of tagData) {
              if (item && item.$ && item.$.name) {
                let nameOfTag = item?.$?.name;

                switch (nameOfTag) {
                  case "PAYMENTMODES":
                    paymentModes = item?.$?.value ? item?.$?.value : "";
                    break;
                  case "FREEBAND":
                    freeBand = item?.$?.value ? item?.$?.value : 0;
                    break;
                  case "AVGSPEED":
                    avgSpeed = item?.$?.value ? item?.$?.value : 0;
                    break;
                  case "OPENBETWEEN":
                    openBetween = item?.$?.value ? item?.$?.value : "";
                    break;
                  default:
                    break;
                }
              }
            }
          }
        }

        if (
          locationData.AP &&
          locationData.AP.length > 0 &&
          locationData.AP[0].$
        ) {
          const apData = locationData?.AP[0]?.$;
          cPURLValue = apData.cpUrl || "";
          deviceIDValue = apData.macid || "";
          sSIDValue = apData.ssid || "";
          statusValue =
            apData && apData.status && apData.status === "ACTIVE"
              ? "Active"
              : "InActive";
        }

        let ssidData: ISsidCreateRequest["body"] = {
          providerID: providerId,
          locationName: locationNameValue || "",
          state: stateValue || "",
          type: locationTypeValue || "",
          cpUrl: cPURLValue,
          latitude: latitudeValue,
          langitude: langitudeValue,
          address: addressValue || "",
          deviceId: deviceIDValue,
          status: statusValue,
          // status: "Active",
          ssid: sSIDValue,
          openBetween: openBetween || "",
          avgSpeed: avgSpeed || 0,
          freeBand: freeBand || 0,
          paymentModes: paymentModes || "",
          loginScheme: "Login",
          description: "dec",
          provider: "cDot",
        };

        if (!cPURLValue || !deviceIDValue || !sSIDValue) {
          logger.warn(`Invalid values ${JSON.stringify(ssidData)}`);
          return Promise.resolve();
        }

        await this.ssidRepository.createAndUpdate(ssidData);
        logger.debug(
          `SSID Updated, MACAdd:${deviceIDValue}, state:${stateValue}, locationname:${locationNameValue} `
        );
      },
      { concurrency: 50 }
    );
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

export const cronServices = new CronServices();
