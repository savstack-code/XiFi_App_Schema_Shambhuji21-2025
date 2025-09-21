// import { EntityRepository, EntityManager } from "typeorm";
// import DataPlan from "../../../shared/database/entities/DataPlan";
//import DataPlanCreateRequest from "../../models/request/data.plan.create.request";

import { DataPlanModel } from "../models/dataPlan.model";
import {
  IDataPlanCreateRequest,
  IDataPlanGetRequest,
} from "../../../reqSchema/data.plan.schema";

//@EntityRepository()
export class DataPlanRepository {
  // constructor(private manager: EntityManager) {}

  createAndSave = (request: IDataPlanCreateRequest["body"]) => {
    const dataplan = new DataPlanModel();
    if (request.hasOwnProperty("identifier"))
      dataplan.identifier = request.identifier;
    if (request.hasOwnProperty("planName"))
      dataplan.planName = request.planName;
    if (request.hasOwnProperty("description"))
      dataplan.description = request.description;
    if (request.hasOwnProperty("planId")) dataplan.planId = request.planId;
    if (request.hasOwnProperty("planType"))
      dataplan.planType = request.planType;
    if (request.hasOwnProperty("bandwidthLimit"))
      dataplan.bandwidthLimit = request.bandwidthLimit;
    if (request.hasOwnProperty("timeLimit"))
      dataplan.timeLimit = request.timeLimit;
    if (request.hasOwnProperty("renewalTime"))
      dataplan.renewalTime = request.renewalTime;
    if (request.hasOwnProperty("status")) dataplan.status = request.status;
    if (request.hasOwnProperty("expiryDate"))
      dataplan.expiryDate = request.expiryDate;
    if (request.hasOwnProperty("tokenQuantity"))
      dataplan.tokenQuantity = request.tokenQuantity;
    if (request.hasOwnProperty("tokenValue"))
      dataplan.tokenValue = request.tokenValue;
    if (request.hasOwnProperty("maximumAdsPerDay"))
      dataplan.maximumAdsPerDay = request.maximumAdsPerDay;
    if (request.hasOwnProperty("validity"))
      dataplan.validity = request.validity;
    if (request.hasOwnProperty("uot")) dataplan.uot = request.uot;
    if (request.hasOwnProperty("priceInRupees"))
      dataplan.priceInRupees = request.priceInRupees;
    if (request.hasOwnProperty("xiKasuTokens"))
      dataplan.xiKasuTokens = request.xiKasuTokens;
    dataplan.createdBy = "System";
    dataplan.createdOn = new Date();
    dataplan.modifiedOn = new Date();
    // return this.manager.save(dataplan);
    return dataplan.save();
  };

  findByPlanType(planType: string) {
    // return this.manager.findOne(DataPlan, {
    //   where: { planType: planType, status: "Active" },
    // });
    return DataPlanModel.findOne({ planType: planType, status: "Active" });
  }

  findByPlanNameInPlanType(planName: string, planType: string) {
    // return this.manager.findOne(DataPlan, {
    //   where: { planName: planName, status: "Active", planType: planType },
    // });
    return DataPlanModel.findOne({
      planName: planName,
      status: "Active",
      planType: planType,
    });
  }

  findByPlanIdInPlanType(planId: number, planType: string) {
    // return this.manager.findOne(DataPlan, {
    //   where: { planId: planId, status: "Active", planType: planType },
    // });
    return DataPlanModel.findOne({
      planId: planId,
      status: "Active",
      planType: planType,
    });
  }

  findByPlanId(planId: number) {
    // return this.manager.findOne(DataPlan, {
    //   where: { planId: planId, status: "Active" },
    // });
    return DataPlanModel.findOne({ planId: planId, status: "Active" });
  }

  findAllByPlanType(planType: string) {
    // return this.manager.find(DataPlan, {
    //   where: { planType: planType, status: "Active" },
    // });

    return DataPlanModel.find({ planType: planType, status: "Active" });
  }

  findAllActivePlans() {
    // return this.manager.find(DataPlan, { where: { status: "Active" } });
    return DataPlanModel.find({ status: "Active" });
  }

  findByidentifier(identifier: any) {
    // return this.manager.findOne(DataPlan, {
    //   where: { identifier: identifier },
    // });
    return DataPlanModel.findOne({ identifier: identifier });
  }

  remove = (DataPlan: IDataPlanCreateRequest) => {
    // return this.manager.remove(DataPlan);
    return DataPlanModel.remove();
  };

  update = (DataPlan: IDataPlanCreateRequest) => {
    // return this.manager.save(DataPlan);
    const dataplan = new DataPlanModel(DataPlan);
    return dataplan.save();
  };
}
