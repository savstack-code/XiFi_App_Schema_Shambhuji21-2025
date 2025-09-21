import { EntityRepository, EntityManager } from "typeorm";
import DataPlan from "../../shared/database/entities/DataPlan";
import DataPlanCreateRequest from "../../models/request/data.plan.create.request";

@EntityRepository()
export class DataPlanRepository {
  constructor(private manager: EntityManager) {}

  createAndSave = (request: DataPlanCreateRequest) => {
    const dataplan = new DataPlan();
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
    return this.manager.save(dataplan);
  };

  findByPlanType(planType: string) {
    return this.manager.findOne(DataPlan, {
      where: { planType: planType, status: "Active" },
    });
  }

  findByPlanNameInPlanType(planName: string, planType: string) {
    return this.manager.findOne(DataPlan, {
      where: { planName: planName, status: "Active", planType: planType },
    });
  }

  findByPlanIdInPlanType(planId: string, planType: string) {
    return this.manager.findOne(DataPlan, {
      where: { planId: planId, status: "Active", planType: planType },
    });
  }

  findByPlanId(planId: number) {
    return this.manager.findOne(DataPlan, {
      where: { planId: planId, status: "Active" },
    });
  }

  findAllByPlanType(planType: string) {
    return this.manager.find(DataPlan, {
      where: { planType: planType, status: "Active" },
    });
  }

  findAllActivePlans() {
    return this.manager.find(DataPlan, { where: { status: "Active" } });
  }

  findByidentifier(identifier: number) {
    return this.manager.findOne(DataPlan, {
      where: { identifier: identifier },
    });
  }

  remove = (DataPlan: DataPlan) => {
    return this.manager.remove(DataPlan);
  };

  update = (DataPlan: DataPlan) => {
    return this.manager.save(DataPlan);
  };
}
