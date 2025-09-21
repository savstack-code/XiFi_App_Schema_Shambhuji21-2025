//import { EntityRepository, Repository, EntityManager } from "typeorm";  //Comment Old Code By NT
//import UserDevice from "../../shared/database/entities/UserDevice"; //Comment Old Code By NT
import { UserDeviceModel } from "../models/userDevice.model";
import { IUserDeviceRequest } from "../../../reqSchema/device.schema";
//@EntityRepository()
export class UserDeviceRepository {
  //constructor(private manager: EntityManager) {}

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
    const userDevice = new UserDeviceModel();
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
    // return this.manager.save(userDevice);
    return userDevice.save();
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
    const device = await UserDeviceModel.findOne({
      userId: userId,
      deviceId: request.deviceId,
    });
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

  update = (userDevice: IUserDeviceRequest["body"]) => {
    const userDeviceData = new UserDeviceModel(userDevice);
    return userDeviceData.save();
  };

  updateAllStatusByUserId = (userId: string, status: string) => {
    // return this.manager.update(UserDevice, { userId }, { status: status });
    return UserDeviceModel.updateMany({ userId: userId }, { status: status });
  };
  updateAllStatusByDeviceId = (deviceId: string, status: string) => {
    // return this.manager.update(UserDevice, { deviceId }, { status });
    return UserDeviceModel.updateMany(
      { deviceId: deviceId },
      { status: status }
    );
  };

  findOne = async (identifier: string) => {
    // return this.manager.findOne(UserDevice, {
    //   where: { identifier },
    // });
    const ud = await UserDeviceModel.findOne({ identifier: identifier }); // ask about _id becuase MSSQl not have any _id and _id is device id but formate is diff
    return ud
  }
  findOneByDeviceId(deviceId: string) {
    // return this.manager.findOne(UserDevice, { where: { deviceId } });
    return UserDeviceModel.findOne({ deviceId: deviceId });
  }

  findByUserDevice(userId: string, deviceId: string) {
    // return this.manager.findOne(UserDevice, {
    //   where: { userId: userId, deviceId: deviceId },
    // });
    return UserDeviceModel.find({ userId: userId, deviceId: deviceId });
  }

  findUserDevicesByStatus = async (userId: string, status: string) => {
    // return this.manager.find(UserDevice, {
    //   where: { userId: userId, status: status },
    // });
    return await UserDeviceModel.find({ userId: userId, status: status });
  };

  findUserDevices(userId: string) {
    // return this.manager.find(UserDevice, {
    //   where: { userId: userId },
    //   select: ["deviceId"],
    // });

    const deviceIds = UserDeviceModel.find({ userId: userId });
    return deviceIds.select("deviceId");
  }

  findByPdoaId(pdoaId: string) {
    // return this.manager.findOne(UserDevice, { where: { pdoaId } });
    return UserDeviceModel.find({ pdoaId: pdoaId });
  }

  findQuery = (queryObject: any, selectAll?: boolean) => {
    // const findOptions: any = {
    //   ...(selectAll
    //     ? {}
    //     : {
    //         select: [
    //           "userId",
    //           "deviceId",
    //           "playerId",
    //           "status",
    //           "deviceType",
    //           "deviceToken",
    //           "createdOn",
    //           "modifiedOn",
    //           "createdBy",
    //           "modifiedBy",
    //           "pdoaId",
    //         ],
    //       }),
    // };
    // if (Object.keys(queryObject).length > 0) {
    //   findOptions.where = queryObject;
    // }
    // return this.manager.find(UserDevice, findOptions);

    let whereCondition = Object.keys(queryObject).length > 0 ? queryObject : {};

    if (selectAll) {
      return UserDeviceModel.find(whereCondition);
    } else {
      return UserDeviceModel.find(whereCondition).select([
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
      ]);
    }
  };
}
