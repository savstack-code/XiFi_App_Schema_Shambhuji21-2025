import { EntityRepository, Repository, EntityManager } from "typeorm";
import UserDevice from "../../shared/database/entities/UserDevice";

@EntityRepository()
export class UserDeviceRepository {
  constructor(private manager: EntityManager) {}

  createAndSave = async (
    userId: string,
    request: {
      iMENo: string;
      playerId: string;
      OSType?: string;
      OSVersion?: string;
      deviceModel?: string;
      macAddr?: string;
    }
  ) => {
    const userDevice = new UserDevice();
    userDevice.userId = userId;
    userDevice.deviceId = request.iMENo;
    userDevice.playerId = request.playerId;
    userDevice.modifiedBy = "USER000001";
    userDevice.createdBy = "USER000001";
    userDevice.createdOn = new Date();
    userDevice.status = "Active";
    userDevice.OSType = request.OSType;
    userDevice.OSVersion = request.OSVersion;
    userDevice.deviceModel = request.deviceModel;
    userDevice.macAddr = request.macAddr;
    return this.manager.save(userDevice);
  };
  async findAndCreate(
    userId: string,
    request: {
      deviceId: string;
      playerId: string;
      OSType?: string;
      OSVersion?: string;
      deviceModel?: string;
      macAddr?: string;
    }
  ) {
    const device = await this.findByUserDevice(userId, request.deviceId);
    if (device) {
      return device;
    }
    return this.createAndSave(userId, {
      iMENo: request.deviceId,
      playerId: request.playerId,
      OSType: request.OSType,
      OSVersion: request.OSVersion,
      deviceModel: request.deviceModel,
      macAddr: request.macAddr,
    });
  }

  update = (userDevice: UserDevice) => {
    return this.manager.save(userDevice);
  };

  updateAllStatusByUserId = (userId: string, status: string) => {
    return this.manager.update(UserDevice, { userId }, { status: status });
  };
  updateAllStatusByDeviceId = (deviceId: string, status: string) => {
    return this.manager.update(UserDevice, { deviceId }, { status });
  };
  findOne(identifier: string) {
    return this.manager.findOne(UserDevice, {
      where: { identifier },
    });
  }
  findOneByDeviceId(deviceId: string) {
    return this.manager.findOne(UserDevice, { where: { deviceId } });
  }

  findByUserDevice(userId: string, deviceId: string) {
    return this.manager.findOne(UserDevice, {
      where: { userId: userId, deviceId: deviceId },
    });
  }

  findUserDevicesByStatus = (userId: string, status: string) => {
    return this.manager.find(UserDevice, {
      where: { userId: userId, status: status },
    });
  };

  findUserDevices(userId: string) {
    return this.manager.find(UserDevice, {
      where: { userId: userId },
      select: ["deviceId"],
    });
  }

  findByPdoaId(pdoaId: string) {
    return this.manager.findOne(UserDevice, { where: { pdoaId } });
  }

  findQuery = (queryObject: any, selectAll?: boolean) => {
    const findOptions: any = {
      ...(selectAll
        ? {}
        : {
            select: [
              "userId",
              "deviceId",
              "playerId",
              "status",
              "deviceType",
              "deviceToken",
              "createdOn",
              "modifiedOn",
              "createdBy",
              "modifiedBy",
              "pdoaId",
            ],
          }),
    };
    if (Object.keys(queryObject).length > 0) {
      findOptions.where = queryObject;
    }
    return this.manager.find(UserDevice, findOptions);
  };
}
