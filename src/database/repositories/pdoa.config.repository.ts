import { EntityRepository, EntityManager } from "typeorm";
import PdoaConfig from "../../shared/database/entities/PdoaConfig";
import PdoaCreateRequest from "../../models/request/pdoa/pdoa.create.request";

@EntityRepository()
export class PdoaConfigRepository {
  constructor(private manager: EntityManager) {}

  createAndSave = (requestModel: PdoaCreateRequest) => {
    const pdoa = new PdoaConfig();
    if (requestModel.hasOwnProperty("pdoaId"))
      pdoa.pdoaId = requestModel.pdoaId;
    if (requestModel.hasOwnProperty("pdoaPublicKey"))
      pdoa.pdoaPublicKey = requestModel.pdoaPublicKey;
    if (requestModel.hasOwnProperty("updateDataPolicyUrl"))
      pdoa.updateDataPolicyUrl = requestModel.updateDataPolicyUrl;
    if (requestModel.hasOwnProperty("keyExp"))
      pdoa.keyExp = requestModel.keyExp;
    pdoa.createdOn = new Date();
    pdoa.createdBy = "ADMIN";
    if (requestModel.hasOwnProperty("pdoaName"))
      pdoa.pdoaName = requestModel.pdoaName;
    if (requestModel.hasOwnProperty("imageUrl"))
      pdoa.imageUrl = requestModel.imageUrl;
    return this.manager.save(pdoa);
  };

  update = (pdoa: PdoaConfig) => {
    return this.manager.save(pdoa);
  };

  findByPdoaId(pdoaId: string) {
    return this.manager.findOne(PdoaConfig, { where: { pdoaId: pdoaId } });
  }

  find() {
    return this.manager.find(PdoaConfig);
  }
}
