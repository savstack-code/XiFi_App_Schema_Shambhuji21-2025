import { EntityManager, EntityRepository } from "typeorm";
import APRequest from "../../shared/database/entities/APRequest";
@EntityRepository()
export class APRequestRepository {
  constructor(private manager: EntityManager) {}
  createAndSave = async (request: {
    latitude: number;
    longitude: number;
    deviceId: string;
    message: string;
  }) => {
    const apReqDoc = new APRequest();
    apReqDoc.latitude = request.latitude;
    apReqDoc.longitude = request.longitude;
    apReqDoc.deviceId = request.deviceId;
    apReqDoc.message = request.message;
    apReqDoc.createdOn = new Date();
    return this.manager.save(apReqDoc);
  };
}
