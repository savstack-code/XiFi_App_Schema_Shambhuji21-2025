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
import { extractTagData, parseGeoLocation } from "../utils/helpers";

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
    const startTime = new Date().getTime();
    for (const item of pdoaConfigData) {
      let itemData = item.$;
      let pdoaKey = item?.Keys[0]?.Key[0]?._;
      let pdoaKeyExp = item?.Keys[0]?.Key[0]?.$?.exp;

      const pdoaId = itemData.id;
      const pdoaPublicKey = pdoaKey;
      const keyExp = pdoaKeyExp;
      const apBasePath = itemData.apUrl || null;
      const apUrl = itemData.apUrl;
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
      await this.pdoaConfigRepository.createAndUpdate(mongoData);
      logger.info(
        `PDOA Updated: ${pdoaId}, Name: ${pdoaName}, AP_URL: ${apUrl}, migrating SSID data...`
      );
      if (!apBasePath) {
        logger.warn(`apBasePath is missing for PDOA: ${pdoaId}`);
        continue;
      }
      await this.migrateSsidData(apBasePath, pdoaId);
    }
    const endTime = new Date().getTime();
    const timeTaken = endTime - startTime;
    logger.info(`Time taken to sync cDot data: ${timeTaken} ms`);
    logger.info(`cDot synced successfully`);
  }

  public async migrateSsidData(
    apBasePath: string,
    providerId: string
  ): Promise<void> {
    if (!apBasePath) {
      logger.error(`apBasePath is required`);
      return Promise.resolve();
    }
    const responseTxt = await request(apBasePath);

    const responseTxtAbx = JSON.stringify(responseTxt);
    const response = JSON.parse(responseTxtAbx);
    if (!response) {
      logger.error(
        `Unable to get data from ${apBasePath}. err: ${JSON.stringify(
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

    const STATUS = {
      ACTIVE: "ACTIVE",
      Active: "Active",
      InActive: "InActive",
    } as const;

    // Bulk processing configuration
    const BATCH_SIZE = 1000; // Process 1000 records at a time
    const totalRecords = loationArr.length;

    logger.info(
      `Starting bulk processing of ${totalRecords} SSID records with batch size ${BATCH_SIZE}`
    );
    const migrationStartTime = Date.now();
    let totalProcessedRecords = 0;
    let totalUpsertedRecords = 0;
    let totalModifiedRecords = 0;
    let totalErrors = 0;

    // Process records in batches for optimal performance
    for (
      let batchStart = 0;
      batchStart < totalRecords;
      batchStart += BATCH_SIZE
    ) {
      const batchEnd = Math.min(batchStart + BATCH_SIZE, totalRecords);
      const currentBatch = loationArr.slice(batchStart, batchEnd);

      logger.info(
        `Processing batch ${
          Math.floor(batchStart / BATCH_SIZE) + 1
        }/${Math.ceil(totalRecords / BATCH_SIZE)} (records ${
          batchStart + 1
        }-${batchEnd})`
      );

      // Collect valid SSID data for bulk insert
      const bulkSsidData: ISsidCreateRequest["body"][] = [];
      const processingErrors: {
        index: number;
        error: string;
        locationName?: string;
      }[] = [];

      // Process current batch concurrently to collect data
      await Bluebird.map(
        currentBatch,
        async (locationData: any, index: number) => {
          try {
            // Early validation
            if (!locationData) {
              processingErrors.push({
                index: batchStart + index,
                error: "Empty location data encountered",
              });
              return;
            }

            const locationAttrs = locationData.$;
            const apArray = locationData.AP;

            if (!apArray?.length || !apArray[0]?.$) {
              processingErrors.push({
                index: batchStart + index,
                error: "Invalid AP data structure",
                locationName: locationAttrs?.name,
              });
              return;
            }

            const apData = apArray[0].$;
            const tagData = apArray[0]?.Tag;

            // Extract AP data
            const cpUrl = apData.cpUrl || "";
            const deviceId = apData.macid || "";
            const ssid = apData.ssid || "";
            const status: "Active" | "InActive" =
              apData.status === STATUS.ACTIVE ? STATUS.Active : STATUS.InActive;

            // Extract location attributes
            const locationName = locationAttrs?.name || "";
            const state = locationAttrs?.state || "";
            const locationType = locationAttrs?.type || "";
            const address = locationAttrs?.name || "";

            // Validate required fields early
            if (!cpUrl || !deviceId || !ssid) {
              processingErrors.push({
                index: batchStart + index,
                error: `Missing required fields - cpUrl: ${!!cpUrl}, deviceId: ${!!deviceId}, ssid: ${!!ssid}`,
                locationName,
              });
              return;
            }

            // Extract geo location
            const { latitude, longitude } = parseGeoLocation(apData.geoLoc);

            // Extract tag-based data
            const { paymentModes, freeBand, avgSpeed, openBetween } =
              extractTagData(tagData);

            const ssidData: ISsidCreateRequest["body"] = {
              providerID: providerId,
              locationName,
              state,
              type: locationType,
              cpUrl,
              latitude: latitude || "",
              langitude: longitude || "", // Note: keeping original typo for compatibility
              address,
              deviceId,
              status,
              ssid,
              openBetween,
              avgSpeed,
              freeBand,
              paymentModes,
              loginScheme: "Login",
              description: "dec",
              provider: "cDot",
            };

            bulkSsidData.push(ssidData);
          } catch (error: any) {
            processingErrors.push({
              index: batchStart + index,
              error: `Processing error: ${error.message}`,
              locationName: locationData?.$?.name,
            });
          }
        },
        { concurrency: 100 } // Higher concurrency for data processing since no DB calls
      );

      // Log processing errors for this batch
      if (processingErrors.length > 0) {
        totalErrors += processingErrors.length;
        logger.warn(
          `Batch processing errors: ${processingErrors.length}/${currentBatch.length} records failed`,
          {
            errors: processingErrors.slice(0, 5), // Log first 5 errors as sample
            totalErrors: processingErrors.length,
          }
        );
      }

      // Bulk insert/update valid records
      if (bulkSsidData.length > 0) {
        try {
          const startTime = Date.now();
          const result = await this.ssidRepository.bulkCreateAndUpdate(
            bulkSsidData
          );
          const endTime = Date.now();

          totalProcessedRecords += bulkSsidData.length;
          totalUpsertedRecords += result.upsertedCount || 0;
          totalModifiedRecords += result.modifiedCount || 0;

          logger.info(`Bulk operation completed:`, {
            batchNumber: Math.floor(batchStart / BATCH_SIZE) + 1,
            recordsProcessed: bulkSsidData.length,
            upsertedCount: result.upsertedCount || 0,
            modifiedCount: result.modifiedCount || 0,
            executionTimeMs: endTime - startTime,
            recordsPerSecond: Math.round(
              (bulkSsidData.length / (endTime - startTime)) * 1000
            ),
          });
        } catch (error: any) {
          logger.error(
            `Bulk database operation failed for batch ${
              Math.floor(batchStart / BATCH_SIZE) + 1
            }:`,
            {
              error: error.message,
              batchSize: bulkSsidData.length,
              batchStart,
              stack: error.stack,
            }
          );

          // Fallback to individual processing for this batch if bulk fails
          logger.info(
            "Falling back to individual processing for this batch..."
          );
          let individualSuccessCount = 0;
          let individualErrorCount = 0;

          for (const ssidData of bulkSsidData) {
            try {
              await this.ssidRepository.createAndUpdate(ssidData);
              individualSuccessCount++;
              totalProcessedRecords++;
            } catch (individualError: any) {
              individualErrorCount++;
              totalErrors++;
              logger.error(`Individual record processing failed:`, {
                deviceId: ssidData.deviceId,
                ssid: ssidData.ssid,
                error: individualError.message,
              });
            }
          }

          logger.info(`Fallback processing completed:`, {
            successCount: individualSuccessCount,
            errorCount: individualErrorCount,
            totalAttempted: bulkSsidData.length,
          });
        }
      }

      // Progress logging with performance metrics
      const processedSoFar = Math.min(batchEnd, totalRecords);
      const percentage = ((processedSoFar / totalRecords) * 100).toFixed(1);
      const elapsedTime = Date.now() - migrationStartTime;
      const avgRecordsPerSecond = Math.round(
        (processedSoFar / elapsedTime) * 1000
      );
      const estimatedTimeRemaining =
        totalRecords > processedSoFar
          ? Math.round(
              ((totalRecords - processedSoFar) / avgRecordsPerSecond) * 1000
            )
          : 0;

      logger.info(`Progress Update:`, {
        processed: processedSoFar,
        total: totalRecords,
        percentage: `${percentage}%`,
        avgRecordsPerSecond,
        elapsedTimeMs: elapsedTime,
        estimatedTimeRemainingMs: estimatedTimeRemaining,
        totalUpserted: totalUpsertedRecords,
        totalModified: totalModifiedRecords,
        totalErrors,
      });
    }

    const migrationEndTime = Date.now();
    const totalMigrationTime = migrationEndTime - migrationStartTime;

    logger.info(`✅ Bulk SSID processing completed successfully!`, {
      providerId,
      totalRecords,
      processedRecords: totalProcessedRecords,
      upsertedRecords: totalUpsertedRecords,
      modifiedRecords: totalModifiedRecords,
      totalErrors,
      totalTimeMs: totalMigrationTime,
      averageRecordsPerSecond: Math.round(
        (totalProcessedRecords / totalMigrationTime) * 1000
      ),
      batchSize: BATCH_SIZE,
      totalBatches: Math.ceil(totalRecords / BATCH_SIZE),
    });
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
