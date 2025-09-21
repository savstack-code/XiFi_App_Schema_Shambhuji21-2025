//import ISsidCreateRequest from "../../../models/schema/ssid/ssid.create.schema";
import SSIDModel from "../models/ssid.model";
import { ISsidCreateRequest } from "../../../reqSchema/ssid.schema";

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
    return SSIDModel.aggregate([
      {
        $match: { status: "Active" },
      },
      {
        $addFields: {
          identifier: "$_id",
          type: "$locationType",
        },
      },
    ]);
  }

  async findByLocation(locationName?: string) {
    const match: any = {
      status: "Active",
    };
    if (locationName) {
      match.locationName = locationName;
    }
    return SSIDModel.aggregate([
      { $match: match },
      {
        $addFields: {
          identifier: "$_id",
          type: "$locationType",
        },
      },
    ]);
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

  async createAndUpdate(requestModel: ISsidCreateRequest["body"]) {
    const deviceIdValue = requestModel.deviceId;
    return SSIDModel.updateOne(
      { deviceID: deviceIdValue },
      {
        $set: {
          ...requestModel,
          sSID: requestModel.ssid,
          cPURL: requestModel.cpUrl,
          modifiedOn: new Date(),
          location: {
            type: "Point",
            coordinates: [
              Number(requestModel.langitude),
              Number(requestModel.langitude),
            ],
          },
        },
        $setOnInsert: {
          createdOn: new Date(),
          createdBy: "Cron",
        },
      },
      { upsert: true }
    );
  }

  async update(ssid: ISsidCreateRequest) {
    const ssidData = new SSIDModel(ssid);
    return ssidData.save();
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
    queryObject.status = "Active";
    return SSIDModel.aggregate([
      { $match: queryObject },
      {
        $addFields: {
          identifier: "$_id",
          type: "$locationType",
        },
      },
    ]);
    // return this.manager.find(SSID, findOptions);
  }

  async findOne(identifier: string) {
    return SSIDModel.findOne({ _id: identifier }).select([
      "identifier",
      "providerID",
      "locationName",
      "state",
      "type",
      "cPURL",
      "latitude",
      "langitude",
      "address",
      "deviceID",
      "status",
      "sSID",
      "openBetween",
      "avgSpeed",
      "freeBand",
      "paymentModes",
      "description",
      "loginScheme",
    ]);
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

  async findByDeviceId(deviceID: string) {
    const du = deviceID.toUpperCase()
    const dl = deviceID.toLowerCase()
    return await SSIDModel.findOne({$or:[{ deviceID: dl},{deviceID:du}]});
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

  async remove(ssid: ISsidCreateRequest) {
    const ssidData = new SSIDModel();
    return ssidData.remove();
    // return this.manager.remove(ssid);
  }
  async findGeoNear(filter: { lat: number; lng: number }, page: number) {
    const limit = 500;
    return SSIDModel.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [filter.lng, filter.lat],
          },
          spherical: true,
          distanceField: "dist",
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          freeBand: 1,
          providerID: 1,
          locationName: 1,
          cPURL: 1,
          langitude: 1,
          latitude: 1,
          address: 1,
          deviceID: 1,
          status: 1,
          sSID: 1,
          openBetween: 1,
          avgSpeed: 1,
          paymentModes: 1,
          loginScheme: 1,
          dist: 1,
          state: 1,
          type: { $ifNull: ["$locationType", ""] },
          identifier: "$_id",
        },
      },
    ]);
  }

  async stateGroupBySsid(stateName: string) {
    const limit = 500;

    let condition = [];

    if (stateName) {
      condition = [
        {
          $match: { state: stateName },
        },
        { $group: { _id: "$state", ssidCount: { $sum: 1 } } },
        {
          $sort: { ssidCount: -1 },
        },
      ];
    } else {
      condition = [
        { $group: { _id: "$state", ssidCount: { $sum: 1 } } },
        {
          $sort: { ssidCount: -1 },
        },
      ];
    }

    return SSIDModel.aggregate(condition);
  }

  async cityGroupBySsid(state: string, city: string) {
    let condition = [];
    if (city) {
      condition = [
        {
          $match: {
            state: state.toUpperCase(),
            locationName: city.toUpperCase(),
          },
        },
        { $group: { _id: "$locationName", ssidCount: { $sum: 1 } } },
        {
          $sort: { ssidCount: -1 },
        },
      ];
    } else {
      condition = [
        {
          $match: { state: state.toUpperCase() },
        },
        { $group: { _id: "$locationName", ssidCount: { $sum: 1 } } },
        {
          $sort: { ssidCount: -1 },
        },
      ];
    }

    return SSIDModel.aggregate(condition);
  }
}
