import { EntityRepository, EntityManager, Between } from "typeorm";
// import Ad from "../../../shared/database/entities/Ad";
import { AdModel } from "../models/ad.model";
import { IAdCreateRequest } from "../../../reqSchema/ad.schema";
import dateFns from "date-fns";

//@EntityRepository()
export class AdRepository {
  //constructor(private manager: EntityManager) {}

  createAndSave = async (adModel: IAdCreateRequest["body"]) => {
    const ad = new AdModel();
    ad.url = adModel.url;
    ad.skipTime = adModel.skipTime;
    ad.modifiedBy = "System";
    ad.createdBy = "System";
    ad.planId = adModel.planId;
    ad.status = adModel.status;
    ad.userId = adModel.userId;
    ad.pdoaId = adModel.pdoaId;
    ad.createdOn = new Date();
    // return this.manager.save(ad);
    return ad.save();
  };

  update = (ad: IAdCreateRequest["body"]) => {
    // return this.manager.save(ad);
    const adModel = new AdModel(ad);
    return adModel.save();
  };

  findOne(identifier: string) {
    // return this.manager.findOne(Ad, { where: { identifier: identifier } });
    return AdModel.findOne({ identifier: identifier });
  }

  findLatestAd(planId: number, userId: string) {
    // return this.manager.findOne(Ad, {
    //   order: {
    //     createdOn: "DESC",
    //   },
    //   where: { planId: planId, userId: userId },
    // });

    return AdModel.findOne({ planId: planId, userId: userId }).sort({
      createdOn: "desc",
    });
  }

  findAd(identifier: string, planId: number, userId: string) {
    // return this.manager.findOne(Ad, {
    //   where: { identifier: identifier, planId: planId, userId: userId },
    // });
    return AdModel.findOne({
      _id: identifier,
      planId: planId,
      userId: userId,
    });
  }

  findAdsByUserPlan(
    status: "Active" | "Viewed",
    planId: number,
    userId: string
  ) {
    // return this.manager.find(Ad, {
    //   where: { status: status, planId: planId, userId: userId },
    // });
    return AdModel.find({ status: status, planId: planId, userId: userId });
  }

  findTodayAdsByUserPlan(status: string, planId: number, userId: string) {
    let start = new Date(new Date().setHours(0, 0, 0, 0));
    let end = new Date(new Date().setHours(23, 59, 59, 999)).toString();
    let startDateString = dateFns.format(start, "YYYY-MM-DD HH:mm:ss.SSS");
    let endDateString = dateFns.format(end, "YYYY-MM-DD HH:mm:ss.SSS");
    // return this.manager.find(Ad, {
    //   where: {
    //     status: status,
    //     planId: planId,
    //     userId: userId,
    //     createdOn: Between(startDateString, endDateString),
    //   },
    // });
    let whereCondition: any = {};
    whereCondition.status = status;
    whereCondition.planId = planId;
    whereCondition.userId = userId;
    whereCondition.createdOn = { $gte: startDateString, $lte: endDateString }; // Ask about this query

    return AdModel.find(whereCondition);
  }
}
