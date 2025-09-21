import { ServiceResponse } from "../models/response/ServiceResponse";
// import { DatabaseProvider } from "../database/database.provider";
// import { UserDeviceRepository } from "../database/repositories/user.device.repository";
import { UserDeviceRepository } from "../database/mongodb/repositories/user.device.repository";
import { setError } from "../utils/shared";
const requestContext = require("request-context");

export class UserDeviceService {
  userDeviceRepository: UserDeviceRepository;
  constructor() {
    this.userDeviceRepository = new UserDeviceRepository();
  }

  public async getUserDeviceStatus(userDeviceId: string) {
    let serviceResponse = new ServiceResponse();
    if (!userDeviceId) {
      const errorMessage = "User device Id is required.";
      setError(serviceResponse, errorMessage, "400");
      return serviceResponse;
    }
    //const connection = await DatabaseProvider.getConnection(); // Comment Old code By NT
    // const userDeviceRepository = connection.getCustomRepository(
    //   UserDeviceRepository
    // );
    let userDevice = await this.userDeviceRepository.findOne(userDeviceId);
    if (userDevice) {
      if (userDevice.status == "InActive") {
        const errorMessage = `You have logged in some other device, please log off that device.`;
        setError(serviceResponse, errorMessage, "403");
        return serviceResponse;
      }
      serviceResponse.success = true;
      serviceResponse.statusCode = "200";
      serviceResponse.result = {
        userId: userDevice.userId,
        pdoaId:
          userDevice.pdoaId != undefined
            ? userDevice.pdoaId
            : process.env.DEFAULT_PDOA_ID,
      };
      return serviceResponse;
    }
    const errorMessage = `User not existed with this Id`;
    setError(serviceResponse, errorMessage, "404");
    return serviceResponse;
  }

  public getLoginUser(): any {
    return requestContext.get("request:user");
  }
}

export const userDeviceService = new UserDeviceService();
