import ISsidCreateRequest from "../../models/schema/ssid/ssid.create.schema";
// import SSIDModel, {
//   ISSIDDoc,
// } from "../../shared/database/mongodb.models/ssid.model_removeFile";

import { ISSIDDoc, SSIDModel } from "../mongodb/models/ssid.model";

export class SsidRepository {
  async find() {
    // let findManyOptions: any = {
    //   select: [
    //     "identifier",
    //     "providerID",
    //     "locationName",
    //     "state",
    //     "type",
    //     "cPURL",
    //     "latitude",
    //     "langitude",
    //     "address",
    //     "deviceID",
    //     "status",
    //     "sSID",
    //     "openBetween",
    //     "avgSpeed",
    //     "freeBand",
    //     "paymentModes",
    //     "description",
    //     "loginScheme",
    //   ],
    // };
    // return this.manager.find(SSID, findManyOptions);
    return SSIDModel.find({});
  }

  async findByLocation(locationName: string) {
    return SSIDModel.find({ locationName });
    // return this.manager.find(SSID, {
    //   where: { locationName: location },
    // });
  }

  async createAndSave(request: ISsidCreateRequest["body"]) {
    const ssid = new SSIDModel();
    if (request.hasOwnProperty("providerID"))
      ssid.providerID = request.providerID;
    if (request.hasOwnProperty("locationName"))
      ssid.locationName = request.locationName;
    if (request.hasOwnProperty("state")) ssid.state = request.state;
    if (request.hasOwnProperty("type")) ssid.locationType = request.type;
    if (request.hasOwnProperty("cpUrl")) ssid.cPURL = request.cpUrl;
    if (request.hasOwnProperty("latitude")) ssid.latitude = request.latitude;
    if (request.hasOwnProperty("langitude")) ssid.langitude = request.langitude;
    if (request.hasOwnProperty("address")) ssid.address = request.address;
    if (request.hasOwnProperty("deviceId")) ssid.deviceID = request.deviceId;
    if (request.hasOwnProperty("status")) ssid.status = request.status;
    if (request.hasOwnProperty("ssid")) ssid.sSID = request.ssid;
    if (request.hasOwnProperty("openBetween"))
      ssid.openBetween = request.openBetween;
    if (request.hasOwnProperty("avgSpeed")) ssid.avgSpeed = request.avgSpeed;
    if (request.hasOwnProperty("freeBand")) ssid.freeBand = request.freeBand;
    if (request.hasOwnProperty("paymentModes"))
      ssid.paymentModes = request.paymentModes;
    if (request.hasOwnProperty("description"))
      ssid.description = request.description;
    if (request.hasOwnProperty("loginScheme"))
      ssid.loginScheme = request.loginScheme;
    ssid.createdOn = new Date();
    ssid.createdBy = "ADMIN";
    return ssid.save();
    // return this.manager.save(ssid);
  }

  async update(ssid: ISSIDDoc) {
    return ssid.save();
    // return this.manager.save(ssid);
  }

  async findQuery(queryObject: { [k: string]: any }) {
    // let findOptions: any = {
    //   select: [
    //     "identifier",
    //     "providerID",
    //     "locationName",
    //     "state",
    //     "type",
    //     "cPURL",
    //     "latitude",
    //     "langitude",
    //     "address",
    //     "deviceID",
    //     "status",
    //     "sSID",
    //     "openBetween",
    //     "avgSpeed",
    //     "freeBand",
    //     "paymentModes",
    //     "description",
    //     "loginScheme",
    //   ],
    // };
    return SSIDModel.find(queryObject);
    // return this.manager.find(SSID, findOptions);
  }

  async findOne(identifier: string) {
    return SSIDModel.findOne({ _id: identifier });
    // return this.manager.findOne(SSID, {
    //   select: [
    //     "identifier",
    //     "providerID",
    //     "locationName",
    //     "state",
    //     "type",
    //     "cPURL",
    //     "latitude",
    //     "langitude",
    //     "address",
    //     "deviceID",
    //     "status",
    //     "sSID",
    //     "openBetween",
    //     "avgSpeed",
    //     "freeBand",
    //     "paymentModes",
    //     "description",
    //     "loginScheme",
    //   ],
    //   where: { identifier: identifier },
    // });
  }

  async findByDeviceId(deviceID: string, select?: any) {
    return SSIDModel.findOne({ deviceID });
    // return this.manager.findOne(SSID, {
    //   where: { deviceID: deviceId },
    //   ...(select ? { select } : {}),
    // });
  }

  async findByIdentifier(identifier: string) {
    return SSIDModel.findOne({ _id: identifier });
    // return this.manager.findOne(SSID, { where: { identifier: identifier } });
  }

  async findByDeviceIdNotEqualToIdentifier(
    identifier: string,
    deviceID: string
  ) {
    return SSIDModel.findOne({
      _id: { $ne: identifier },
      deviceID,
      status: "Active",
    });
    // return this.manager.findOne(SSID, {
    //   where: {
    //     identifier: Not(Equal(identifier)),
    //     deviceID: deviceId,
    //     status: "Active",
    //   },
    // });
  }

  async findBySsidNameNotEqualToIdentifier(identifier: string, sSID: string) {
    return SSIDModel.findOne({
      _id: { $ne: identifier },
      sSID,
      status: "Active",
    });

    // return this.manager.findOne(SSID, {
    //   where: {
    //     identifier: Not(Equal(identifier)),
    //     sSID: ssid,
    //     status: "Active",
    //   },
    // });
  }

  async remove(ssid: ISSIDDoc) {
    return ssid.remove();
    // return this.manager.remove(ssid);
  }
}
