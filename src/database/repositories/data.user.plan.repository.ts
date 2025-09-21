import {
  EntityRepository,
  EntityManager,
  MoreThanOrEqual,
  Equal,
  Not,
  In,
} from "typeorm";
import DataUserPlan from "../../shared/database/entities/DataUserPlan";
import dateFns from "date-fns";
import DataUserPlanModel from "../../models/dataUserPlan/data.user.plan.model";

@EntityRepository()
export class DataUserPlanRepository {
  constructor(private manager: EntityManager) {}

  createAndSave = async (dataUserPlanModel: DataUserPlanModel) => {
    const dataUserPlan = new DataUserPlan();
    dataUserPlan.userId = dataUserPlanModel.userId;
    dataUserPlan.planId = dataUserPlanModel.planId;
    dataUserPlan.planExpiryDate = dataUserPlanModel.planExpiryDate;
    dataUserPlan.status = dataUserPlanModel.status;
    dataUserPlan.bandwidthLimit = dataUserPlanModel.bandwidthLimit;
    dataUserPlan.remainingData = dataUserPlanModel.remainingData;
    dataUserPlan.modifiedBy = "System";
    dataUserPlan.createdBy = "System";
    dataUserPlan.createdOn = new Date();
    return this.manager.save(dataUserPlan);
  };

  findUserActivePlan(planId: string, status: string, userId: string) {
    return this.manager.findOne(DataUserPlan, {
      where: { planId: planId, status: status, userId: userId },
    });
  }

  findUserValidPlans(userId: string, planIds: string[]) {
    let validityDateString = dateFns.format(
      new Date(),
      "YYYY-MM-DD HH:mm:ss.SSS"
    );
    return this.manager.find(DataUserPlan, {
      where: {
        planExpiryDate: MoreThanOrEqual(validityDateString),
        userId: userId,
        status: Not(Equal("Used")),
        planId: In(planIds),
      },
    });
  }

  findUserValidActivePlan(planId: string, userId: string) {
    let validityDateString = dateFns.format(
      new Date(),
      "YYYY-MM-DD HH:mm:ss.SSS"
    );
    return this.manager.findOne(DataUserPlan, {
      where: {
        planId: planId,
        planExpiryDate: MoreThanOrEqual(validityDateString),
        userId: userId,
        status: Not(Equal("Used")),
      },
    });
  }

  findDataUserPlanHistory(
    userId: string,
    currentPage: number,
    pageSize: number
  ) {
    return this.manager.find(DataUserPlan, {
      order: {
        createdOn: "DESC",
      },
      where: { userId: userId },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    });
  }

  getUserActivePlans(planId: string, status: string, userId: string) {
    return this.manager.find(DataUserPlan, {
      where: { planId: planId, status: status, userId: userId },
    });
  }

  updateMany = (dataUserPlans: DataUserPlan[]) => {
    return this.manager.save(dataUserPlans, { chunk: 10000 });
  };

  update = (dataUserPlan: DataUserPlan) => {
    return this.manager.save(dataUserPlan);
  };
}
