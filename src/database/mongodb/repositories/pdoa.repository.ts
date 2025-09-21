// import { EntityRepository, EntityManager } from "typeorm";
// import PdoaConfig from "../../../shared/database/entities/PdoaConfig";
import { PdoaConfigModel } from "../models/pdoaConfig.model";
//@EntityRepository()
export class PdoaRepository {
  //constructor(private manager: EntityManager) {}

  findByProviderId(providerId: string) {
    // return this.manager.findOne(PdoaConfig, { where: { pdoaId: providerId } });
    return PdoaConfigModel.findOne({ pdoaId: providerId });
  }
}
