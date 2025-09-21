// import { DatabaseProvider } from "../database/database.provider";
import logger from "../config/winston.logger";
// import { PdoaConfigRepository } from "../database/repositories/pdoa.config.repository";
import { PdoaConfigRepository } from "../database/mongodb/repositories/pdoa.config.repository";
// import PdoaCreateRequest from "../models/request/pdoa/pdoa.create.request";
// import PdoaUpdateRequest from "../models/request/pdoa/pdoa.update.request";
import {
  IPdoaCreateRequest,
  IPdoaUpdateRequest,
} from "../reqSchema/pdoa.schema";
import { ServiceResponse } from "../models/response/ServiceResponse";
import { CommandRepository } from "../database/mongodb/repositories/comman.repository";
export class PdoaService {
  pdoaConfigRepository: PdoaConfigRepository;
  commandRepository: CommandRepository;
  constructor() {
    this.pdoaConfigRepository = new PdoaConfigRepository();
    this.commandRepository = new CommandRepository();
  }
  public async createPdoa(
    requestModel: IPdoaCreateRequest["body"]
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    // const connection = await DatabaseProvider.getConnection();
    // const pdoaRepository = connection.getCustomRepository(PdoaConfigRepository);
    let pdoa = await this.pdoaConfigRepository.findByPdoaId(
      requestModel.pdoaId
    );
    if (!pdoa) {
      let pdoIDGenrate: any = await this.commandRepository.generateKey(
        "PdoaConfig"
      );

      if (!pdoIDGenrate) {
        const errorMessage = `PDOA Id not genrated.`;
        this.setError(serviceResponse, errorMessage, "404");
        return serviceResponse;
      }
      requestModel.id = parseInt(pdoIDGenrate);

      let pdoa = await this.pdoaConfigRepository.createAndSave(requestModel);
      if (pdoa) {
        serviceResponse.statusCode = "200";
        serviceResponse.success = true;
        serviceResponse.result = {
          identifier: pdoa.id,
          message: "PDOA details created successfully.",
        };
        return serviceResponse;
      }
    } else {
      serviceResponse.errors.push("PDOA already existed.");
    }

    return serviceResponse;
  }

  public async updatePdoa(
    pdoaId: string,
    pdoaIdUpdateRequest: IPdoaUpdateRequest["body"]
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    // const connection = await DatabaseProvider.getConnection();
    // const pdoaConfigRepository = connection.getCustomRepository(
    //   PdoaConfigRepository
    // );
    let pdoa = await this.pdoaConfigRepository.findByPdoaId(pdoaId);
    if (pdoa) {
      if (pdoaIdUpdateRequest.hasOwnProperty("pdoaPublicKey"))
        pdoa.pdoaPublicKey = pdoaIdUpdateRequest.pdoaPublicKey;
      if (pdoaIdUpdateRequest.hasOwnProperty("updateDataPolicyUrl"))
        pdoa.updateDataPolicyUrl = pdoaIdUpdateRequest.updateDataPolicyUrl;
      if (pdoaIdUpdateRequest.hasOwnProperty("keyExp"))
        pdoa.keyExp = parseInt(pdoaIdUpdateRequest.keyExp);
      pdoa.modifiedOn = new Date();
      if (pdoaIdUpdateRequest.hasOwnProperty("modifiedBy"))
        pdoa.modifiedBy = pdoaIdUpdateRequest.modifiedBy;
      if (pdoaIdUpdateRequest.hasOwnProperty("pdoaName"))
        pdoa.pdoaName = pdoaIdUpdateRequest.pdoaName;
      if (pdoaIdUpdateRequest.hasOwnProperty("imageUrl"))
        pdoa.imageUrl = pdoaIdUpdateRequest.imageUrl;
      if (pdoaIdUpdateRequest.hasOwnProperty("stopUserSessionUrl"))
        pdoa.stopUserSessionUrl = pdoaIdUpdateRequest.stopUserSessionUrl;
      let response = await pdoa.save();
      serviceResponse.success = true;
      serviceResponse.statusCode = "200";
      serviceResponse.result = {
        pdoaId: response.pdoaId,
        message: "PDOA details updated successfully.",
      };
      return serviceResponse;
    }
    const errorMessage = `PDOA not found.`;
    this.setError(serviceResponse, errorMessage, "404");
    return serviceResponse;
  }

  public async getPdoaByPdoaId(pdoaId: string): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    // const connection = await DatabaseProvider.getConnection();
    // const pdoaconfigRepository = connection.getCustomRepository(
    //   PdoaConfigRepository
    // );
    let pdoa = await this.pdoaConfigRepository.findByPdoaId(pdoaId);
    if (pdoa) {
      serviceResponse.statusCode = "200";
      serviceResponse.success = true;
      serviceResponse.result = pdoa;
      return serviceResponse;
    }
    serviceResponse.statusCode = "404";
    serviceResponse.errors.push("Pdoa not found.");
    return serviceResponse;
  }

  public async getPdoas(): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    // const connection = await DatabaseProvider.getConnection();
    // const pdoaconfigRepository = connection.getCustomRepository(
    //   PdoaConfigRepository
    // );
    let pdoas = await this.pdoaConfigRepository.find();
    if (pdoas) {
      serviceResponse.statusCode = "200";
      serviceResponse.success = true;
      serviceResponse.result = pdoas;
      return serviceResponse;
    }
    serviceResponse.statusCode = "404";
    serviceResponse.errors.push("No PDOAs are found.");
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

export const pdoaService = new PdoaService();
