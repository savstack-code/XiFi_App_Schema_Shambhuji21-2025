// import {
//   EntityRepository,
//   EntityManager,
//   MoreThanOrEqual,
//   Equal,
//   Not,
//   In,
// } from "typeorm";
//import DataUserPlan from "../../../shared/database/entities/DataUserPlan";
// import DataUserPlanModel from "../../../models/dataUserPlan/data.user.plan.model";
import dateFns from "date-fns";

import { DataUserPlanModel } from "../models/dataUserPlan.model";
import { IDataUserPlanRequest } from "../../../reqSchema/data.user.plan.schema";

//@EntityRepository()
export class DataUserPlanRepository {
  //constructor(private manager: EntityManager) {}

  createAndSave = async (dataUserPlanModel: IDataUserPlanRequest["body"]) => {
    const dataUserPlan = new DataUserPlanModel();
    // dataUserPlan.id = dataUserPlanModel.id;
    dataUserPlan.userId = dataUserPlanModel.userId;
    dataUserPlan.planId = dataUserPlanModel.planId;
    dataUserPlan.planExpiryDate = dataUserPlanModel.planExpiryDate;
    dataUserPlan.status = dataUserPlanModel.status;
    dataUserPlan.bandwidthLimit = dataUserPlanModel.bandwidthLimit;
    dataUserPlan.remainingData = dataUserPlanModel.remainingData;
    dataUserPlan.modifiedBy = "System";
    dataUserPlan.createdBy = "System";
    dataUserPlan.createdOn = new Date();
    // return this.manager.save(dataUserPlan);
    return dataUserPlan.save();
  };

  findUserActivePlan(planId: number, status: string, userId: string) {
    // return this.manager.findOne(DataUserPlan, {
    //   where: { planId: planId, status: status, userId: userId },
    // });
    return DataUserPlanModel.findOne({
      planId: planId,
      status: status,
      userId: userId,
    });
  }

  findUserValidPlans(userId: string, planIds: number[]) {
    let validityDateString = dateFns.format(
      new Date(),
      "YYYY-MM-DD HH:mm:ss.SSS"
    );
    // return this.manager.find(DataUserPlan, {
    //   where: {
    //     planExpiryDate: MoreThanOrEqual(validityDateString),
    //     userId: userId,
    //     status: Not(Equal("Used")),
    //     planId: In(planIds),
    //   },
    // });

    let whereCondition: any = {};
    whereCondition.userId = userId;
    whereCondition.status = { $ne: "Used" };
    whereCondition.planId = { $in: planIds };
    whereCondition.planExpiryDate = { $gte: validityDateString };

    return DataUserPlanModel.find(whereCondition);
  }

  findUserValidActivePlan(planId: number, userId: string) {
    let validityDateString = dateFns.format(
      new Date(),
      "YYYY-MM-DD HH:mm:ss.SSS"
    );
    // return this.manager.findOne(DataUserPlan, {
    //   where: {
    //     planId: planId,
    //     planExpiryDate: MoreThanOrEqual(validityDateString),
    //     userId: userId,
    //     status: Not(Equal("Used")),
    //   },
    // });

    let whereCondition: any = {};
    whereCondition.userId = userId;
    whereCondition.status = { $ne: "Used" };
    whereCondition.planId = planId;
    whereCondition.planExpiryDate = { $gte: validityDateString };
    return DataUserPlanModel.findOne(whereCondition);
  }

  findDataUserPlanHistory(
    userId: string,
    currentPage: number,
    pageSize: number
  ) {
    // return this.manager.find(DataUserPlan, {
    //   order: {
    //     createdOn: "DESC",
    //   },
    //   where: { userId: userId },
    //   skip: (currentPage - 1) * pageSize,
    //   take: pageSize,
    // });

    return DataUserPlanModel.find({ userId: userId })
      .sort({ createdOn: "desc" })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);
  }

  getUserActivePlans(planId: number, status: string, userId: string) {
    // return this.manager.find(DataUserPlan, {
    //   where: { planId: planId, status: status, userId: userId },
    // });
    return DataUserPlanModel.find({
      planId: planId,
      status: status,
      userId: userId,
    });
  }

  updateMany = (dataUserPlans: IDataUserPlanRequest[]) => {
    // return this.manager.save(dataUserPlans, { chunk: 10000 });
    //Will Update : Optimization this query
    return Promise.all(
      dataUserPlans.map((dp) => {
        const userPlans = new DataUserPlanModel(dp);
        return userPlans.update();
      })
    );
  };

  update = (dataUserPlan: IDataUserPlanRequest["body"]) => {
    // return this.manager.save(dataUserPlan);
    const DataUserPlan = new DataUserPlanModel(dataUserPlan);
    return DataUserPlan.save();
  };
}
