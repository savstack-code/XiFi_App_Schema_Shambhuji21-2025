// import { EntityRepository, EntityManager } from "typeorm";
// import AppProviderConfig from "../../shared/database/entities/AppProviderConfig";
import { AppProviderConfigModel } from "../models/appProviderConfig.model";

//@EntityRepository()
export class AppProviderConfigRepository {
  //constructor(private manager: EntityManager) {}

  find() {
    // return this.manager.find(AppProviderConfig);
    return AppProviderConfigModel.find({});
  }

  findByProviderId(providerId: string) {
    // return this.manager.findOne(AppProviderConfig, {
    //   where: { appProviderId: providerId },
    // });
    return AppProviderConfigModel.findOne({ appProviderId: providerId });
  }
}
