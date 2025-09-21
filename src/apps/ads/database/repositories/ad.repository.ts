import { EntityRepository, EntityManager, Between } from "typeorm";
import Ad from "../../../../shared/database/entities/Ad";
import AdModel from "../../models/ad.model";
import dateFns from "date-fns";

@EntityRepository()
export class AdRepository {
  constructor(private manager: EntityManager) {}

  createAndSave = async (adModel: AdModel) => {
    const ad = new Ad();
    ad.url = adModel.url;
    ad.skipTime = adModel.skipTime;
    ad.modifiedBy = "System";
    ad.createdBy = "System";
    ad.planId = adModel.planId;
    ad.status = adModel.status;
    ad.userId = adModel.userId;
    ad.pdoaId = adModel.pdoaId;
    ad.createdOn = new Date();
    return this.manager.save(ad);
  };

  update = (ad: Ad) => {
    return this.manager.save(ad);
  };

  findOne(identifier: string) {
    return this.manager.findOne(Ad, { where: { identifier: identifier } });
  }

  findLatestAd(planId: string, userId: string) {
    return this.manager.findOne(Ad, {
      order: {
        createdOn: "DESC",
      },
      where: { planId: planId, userId: userId },
    });
  }

  findAd(identifier: string, planId: string, userId: string) {
    return this.manager.findOne(Ad, {
      where: { identifier: identifier, planId: planId, userId: userId },
    });
  }

  findAdsByUserPlan(status: string, planId: string, userId: string) {
    return this.manager.find(Ad, {
      where: { status: status, planId: planId, userId: userId },
    });
  }

  findTodayAdsByUserPlan(status: string, planId: string, userId: string) {
    let start = new Date(new Date().setHours(0, 0, 0, 0));
    let end = new Date(new Date().setHours(23, 59, 59, 999)).toString();
    let startDateString = dateFns.format(start, "YYYY-MM-DD HH:mm:ss.SSS");
    let endDateString = dateFns.format(end, "YYYY-MM-DD HH:mm:ss.SSS");
    return this.manager.find(Ad, {
      where: {
        status: status,
        planId: planId,
        userId: userId,
        createdOn: Between(startDateString, endDateString),
      },
    });
  }
}
