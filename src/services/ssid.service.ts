// import SsidUpdateRequest from "../models/request/ssid/ssid.update.request";
// import { DatabaseProvider } from "../database/database.provider";
// import { SsidRepository } from "../database/repositories/ssid.repository";
import { SsidRepository } from "../database/mongodb/repositories/ssid.repository";
import logger from "../config/winston.logger";
// import { INewAPReq } from "../models/schema/ssid/ssid.newReq.schema";
// import { APRequestRepository } from "../database/repositories/apRequest.repository";
import { APRequestRepository } from "../database/mongodb/repositories/apRequest.repository";
// import { UserDeviceRepository } from "../database/repositories/user.device.repository";
import { UserDeviceRepository } from "../database/mongodb/repositories/user.device.repository";
// import ISsidCreateRequest from "../models/schema/ssid/ssid.create.schema";
import { INearBySSIDs, ISsidCreateRequest, StateRequest } from "../reqSchema/ssid.schema";
import { ServiceResponse } from "../models/response/ServiceResponse";
import { ISsidUpdateRequest, INewAPReq, CityListSchema } from "../reqSchema/ssid.schema";

export class SsidService {
  ssidRepository: SsidRepository;
  aPRequestRepository: APRequestRepository;
  userDeviceRepository: UserDeviceRepository;
  constructor() {
    this.ssidRepository = new SsidRepository();
    this.aPRequestRepository = new APRequestRepository();
    this.userDeviceRepository = new UserDeviceRepository();
  }

  public async getSsidByIdentifier(
    identifier: string
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    let ssid = await this.ssidRepository.findOne(identifier);
    if (ssid) {
      return serviceResponse.setSuccess(ssid);
    }
    return serviceResponse.setError("Ssid not found.", "404");
  }

  public async getSsids(query: any): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    let ssids = await this.ssidRepository.findQuery(query);
    if (ssids) {
      return serviceResponse.setSuccess(ssids);
    }
    return serviceResponse.setError("No Ssids are found.", "404");
  }

  public async createSsid(
    requestModel: ISsidCreateRequest["body"]
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    let ssidCheck = await this.ssidRepository.findByDeviceId(
      requestModel.deviceId
    );
    if (ssidCheck) {
      serviceResponse.setError("SSID already existed");
      return serviceResponse;
      //
    }
    //  requestModel.status = SsidStatus.Active;

    let ssid = await this.ssidRepository.createAndSave(requestModel);
    if (ssid) {
      serviceResponse.setSuccess({
        identifier: ssid._id,
        message: "Ssid details created successfully.",
      });
    }
    return serviceResponse;
  }

  public async deleteSsid(identifier: string): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    let ssid = await this.ssidRepository.findByIdentifier(identifier);
    if (ssid) {
      await ssid.remove();
      return serviceResponse.setSuccess({
        identifier,
        message: "Ssid deleted successfully.",
      });
    }
    const errorMessage = `Ssid not found to delete.`;
    return serviceResponse.setError(errorMessage, "404");
  }

  public async updateSsid(
    identifier: string,
    ssidUpdateRequest: ISsidUpdateRequest
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();
    let ssid = await this.ssidRepository.findByIdentifier(identifier);
    if (!ssid) {
      const errorMessage = `Ssid not found.`;
      return serviceResponse.setError(errorMessage, "404");
    }
    if (ssidUpdateRequest.hasOwnProperty("ssid")) {
      let entity = await this.ssidRepository.findBySsidNameNotEqualToIdentifier(
        identifier,
        ssidUpdateRequest.ssid
      );
      if (entity) {
        const errorMessage = `Ssid already existed with this ssid name.`;
        this.setError(serviceResponse, errorMessage, "400");
        return serviceResponse;
      }
      ssid.sSID = ssidUpdateRequest.ssid;
    }
    if (ssidUpdateRequest.hasOwnProperty("deviceId")) {
      let entity = await this.ssidRepository.findByDeviceIdNotEqualToIdentifier(
        identifier,
        ssidUpdateRequest.deviceId
      );
      if (entity) {
        const errorMessage = `Ssid already existed with this device id.`;
        this.setError(serviceResponse, errorMessage, "400");
        return serviceResponse;
      }
      ssid.deviceID = ssidUpdateRequest.deviceId;
    }
    if (ssidUpdateRequest.hasOwnProperty("locationName"))
      ssid.locationName = ssidUpdateRequest.locationName;
    if (ssidUpdateRequest.hasOwnProperty("providerID"))
      ssid.providerID = ssidUpdateRequest.providerID;
    if (ssidUpdateRequest.hasOwnProperty("state"))
      ssid.state = ssidUpdateRequest.state;
    if (ssidUpdateRequest.hasOwnProperty("type"))
      ssid.locationType = ssidUpdateRequest.type;
    if (ssidUpdateRequest.hasOwnProperty("cpUrl"))
      ssid.cPURL = ssidUpdateRequest.cpUrl;
    if (ssidUpdateRequest.hasOwnProperty("latitude"))
      ssid.latitude = ssidUpdateRequest.latitude;
    if (ssidUpdateRequest.hasOwnProperty("langitude"))
      ssid.langitude = ssidUpdateRequest.langitude;
    if (ssidUpdateRequest.hasOwnProperty("address"))
      ssid.address = ssidUpdateRequest.address;
    if (ssidUpdateRequest.hasOwnProperty("status"))
      ssid.status = ssidUpdateRequest.status;
    if (ssidUpdateRequest.hasOwnProperty("openBetween"))
      ssid.openBetween = ssidUpdateRequest.openBetween;
    if (ssidUpdateRequest.hasOwnProperty("avgSpeed"))
      ssid.avgSpeed = ssidUpdateRequest.avgSpeed;
    if (ssidUpdateRequest.hasOwnProperty("freeBand"))
      ssid.freeBand = ssidUpdateRequest.freeBand;
    if (ssidUpdateRequest.hasOwnProperty("paymentModes"))
      ssid.paymentModes = ssidUpdateRequest.paymentModes;
    if (ssidUpdateRequest.hasOwnProperty("description"))
      ssid.description = ssidUpdateRequest.description;
    if (ssidUpdateRequest.hasOwnProperty("loginScheme"))
      ssid.loginScheme = ssidUpdateRequest.loginScheme;
    ssid.modifiedOn = new Date();
    ssid.modifiedBy = "ADMIN";
    const response = await ssid.save();
    return serviceResponse.setSuccess({
      identifier: response._id,
      message: "Ssid updated successfully.",
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

  public requestNewAccessPoint = async (req: INewAPReq["body"]) => {
    const serviceResponse = new ServiceResponse();
    //const connection = await DatabaseProvider.getConnection();
    //const apReqRepo = connection.getCustomRepository(APRequestRepository);
    //const userDeviceRepo = connection.getCustomRepository(UserDeviceRepository);
    const deviceCheck = await this.userDeviceRepository.findOne(req.deviceId);
    if (!deviceCheck) {
      serviceResponse.errors.push("Invalid device id");
      return serviceResponse;
    }
    await this.aPRequestRepository.createAndSave(req);
    serviceResponse.success = true;
    serviceResponse.statusCode = "200";
    serviceResponse.result.message = "Your request has been submitted";
    return serviceResponse;
  };

  async nearBySSIDs(query: INearBySSIDs["query"]) {
    const serviceResponse = new ServiceResponse();
    const result = await this.ssidRepository.findGeoNear(
      { lat: query.lat, lng: query.lng },
      query.page
    );
    return serviceResponse.setSuccess(result);
  }

  async stateBySsid(request : StateRequest["query"]) {
    const serviceResponse = new ServiceResponse();
    const stateName = request.state || '';
    const result = await this.ssidRepository.stateGroupBySsid(stateName);
    return serviceResponse.setSuccess(result);
  }

  async cityBySsid(params : CityListSchema['params'], query : CityListSchema['query']) {
    const serviceResponse = new ServiceResponse();
    const identifier = params.identifier;
    const city = query.city || "";
    const result = await this.ssidRepository.cityGroupBySsid(identifier, city);
    return serviceResponse.setSuccess(result);
  }
}

export const ssidService = new SsidService();
