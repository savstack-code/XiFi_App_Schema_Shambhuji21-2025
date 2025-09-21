// import { EntityRepository, EntityManager, Between } from "typeorm";
import AdStore from "../../../shared/database/entities/AdStore";
import { AdStoreModel } from "../models/adStore.model";
//@EntityRepository()
export class AdStoreRepository {
  //constructor(private manager: EntityManager) {}

  findAdByAdId(adId: number) {
    // return this.manager.findOne(AdStore, {
    //   where: { adId: adId },
    // });

    return AdStoreModel.findOne({ adId: adId });
  }

  findAll() {
    // return this.manager.find(AdStore, {
    //   where: { status: "Active" },
    // });
    return AdStoreModel.find({ status: "Active" });
  }
}
