// import { EntityRepository, EntityManager } from "typeorm";
// import PdoaConfig from "../../../shared/database/entities/PdoaConfig";
// import PdoaCreateRequest from "../../../models/request/pdoa/pdoa.create.request";

import { PdoaConfigModel } from "../models/pdoaConfig.model";
import { IPdoaCreateRequest } from "../../../reqSchema/pdoa.schema";

// @EntityRepository()
export class PdoaConfigRepository {
  //constructor(private manager: EntityManager) {}
  createAndUpdate(requestModel: IPdoaCreateRequest["body"]) {
    return PdoaConfigModel.updateOne(
      { pdoaId: requestModel.pdoaId },
      {
        $set: {
          pdoaPublicKey: requestModel.pdoaPublicKey,
          updateDataPolicyUrl: requestModel.updateDataPolicyUrl,
          keyExp: requestModel.keyExp,
          pdoaName: requestModel.pdoaName,
          imageUrl: requestModel.imageUrl,
          stopUserSessionUrl: requestModel.stopUserSessionUrl,
          updatedOn: new Date(),
          provider: requestModel.provider,
          apUrl: requestModel.apUrl,
        },
        $setOnInsert: {
          createdOn: new Date(),
          createdBy: "Cron",
        },
      },
      { upsert: true }
    );
  }

  createAndSave = (requestModel: IPdoaCreateRequest["body"]) => {
    const pdoa = new PdoaConfigModel();
    if (requestModel.id) {
      pdoa.id = requestModel.id;
    }
    // if (requestModel.hasOwnProperty("pdoaId"))
    //   pdoa.pdoaId = requestModel.pdoaId;
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
    if (requestModel.hasOwnProperty("stopUserSessionUrl"))
      pdoa.stopUserSessionUrl = requestModel.stopUserSessionUrl;
    // return this.manager.save(pdoa);
    return pdoa.save();
  };

  update = (pdoa: IPdoaCreateRequest) => {
    // return this.manager.save(pdoa);
    const pdoaData = new PdoaConfigModel(pdoa);
    return pdoaData.save();
  };

  findByPdoaId(pdoaId: string) {
    // return this.manager.findOne(PdoaConfig, { where: { pdoaId: pdoaId } });
    return PdoaConfigModel.findOne({ pdoaId: pdoaId });
  }

  find() {
    // return this.manager.find(PdoaConfig);
    return PdoaConfigModel.find({});
  }
}
