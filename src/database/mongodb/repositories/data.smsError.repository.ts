// import { EntityManager, EntityRepository } from "typeorm";
// import SMSError from "../../shared/database/entities/SMSError";
import { SMSErrorModel } from "../models/smsError.model";
//@EntityRepository()
export class SMSErrorRepository {
  //constructor(private manager: EntityManager) {}
  createAndSave = (data: {
    receiver: string;
    errorText: string;
    isInternational: boolean;
  }) => {
    const smsError = new SMSErrorModel();
    smsError.receiver = data.receiver;
    smsError.errorsTxt = data.errorText;
    smsError.isInternational = data.isInternational;
    smsError.createdOn = new Date();
    return smsError.save();
  };
}
