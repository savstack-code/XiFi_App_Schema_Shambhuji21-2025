// import {
//   EntityRepository,
//   EntityManager,
//   MoreThanOrEqual,
//   Equal,
//   Not,
//   In,
// } from "typeorm";
// import DataAccounting from "../../shared/database/entities/DataAccounting";
// import dateFns from "date-fns";
// import DataAccountingModel from "../../shared/models/data.accounting.model";

import { DataAccountingModel } from "../models/dataAccounting.model";
import { IDataAccountingRequest } from "../../../reqSchema/data.accounting.schema";

//@EntityRepository()
export class DataAccountingRepository {
  //constructor(private manager: EntityManager) {}

  findDataAccountingHistory = async (
    userName: string,
    currentPage: number,
    pageSize: number,
    userPlanId?: number,
    planType?: string
  ) => {
    let whereCondition: any = {};
    whereCondition.userName = userName;
    whereCondition.sessionStatus = { $nin: ["SessionPending", "SessionStart"] };

    if (userPlanId) {
      whereCondition.userPlanId = userPlanId;
    }
    // if (planType) {
    //   whereCondition.category = planType;
    // }
    console.log(whereCondition);
    const d = await DataAccountingModel.find(whereCondition)
      // .select([
      //   "identifier",
      //   "userName",
      //   "startTime",
      //   "sessionTime",
      //   "dataUsed",
      //   "planId",
      //   "status",
      //   "userPlanId",
      //   "category",
      //   "referenceId",
      //   "calledStation",
      //   "callingStation",
      //   "createdOn",
      //   "locationId",
      // ])
      .sort({ createdOn: "desc" })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);
    return d
  }

  createAndSave = (model: any) => {
    const dataAccounting = new DataAccountingModel();
    if (model.hasOwnProperty("userName"))
      dataAccounting.userName = model.userName;
    if (model.hasOwnProperty("startTime"))
      dataAccounting.startTime = model.startTime;
    if (model.hasOwnProperty("sessionTime"))
      dataAccounting.sessionTime = model.sessionTime;
    if (model.hasOwnProperty("input_octets"))
      dataAccounting.dataUsed = { download: model.input_octets, upload: model.output_octets };

    if (model.hasOwnProperty("calledStation"))
      dataAccounting.calledStation = model.calledStation;
    if (model.hasOwnProperty("callingStation"))
      dataAccounting.callingStation = model.callingStation;
    if (model.hasOwnProperty("locationId"))
      dataAccounting.locationId = model.locationId;
    if (model.hasOwnProperty("stopTime"))
      dataAccounting.stopTime = model.stopTime;
    if (model.hasOwnProperty("terminateCause"))
      dataAccounting.terminateCause = model.terminateCause;
    if (model.hasOwnProperty("planId")) dataAccounting.planId = model.planId;
    if (model.hasOwnProperty("userPlanId"))
      dataAccounting.userPlanId = model.userPlanId;
    if (model.hasOwnProperty("status")) dataAccounting.status = model.status;
    dataAccounting.modifiedOn = new Date();
    // return this.manager.save(dataAccounting);
    return dataAccounting.save();
  };

  findByUserNamePlanIdStatus = (userName: string, planId: number) => {
    // let findOptions: any = {
    //   where: {
    //     userName: userName,
    //     status: In(["SessionStart", "SessionUpdate", "SessionPending"]),
    //     planId: planId,
    //   },
    // };
    // return this.manager.findOne(DataAccounting, findOptions);

    let whereCondition: any = {};
    whereCondition.userName = userName;
    whereCondition.status = {
      $in: ["SessionStart", "SessionUpdate", "SessionPending"],
    };
    whereCondition.planId = planId;

    return DataAccountingModel.findOne(whereCondition);
  };
}
