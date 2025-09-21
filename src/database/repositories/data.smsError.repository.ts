import { EntityManager, EntityRepository } from "typeorm";
import SMSError from "../../shared/database/entities/SMSError";

@EntityRepository()
export class SMSErrorRepository {
  constructor(private manager: EntityManager) {}
  createAndSave = (data: {
    receiver: string;
    errorText: string;
    isInternational: boolean;
  }) => {
    const smsError = new SMSError();
    smsError.receiver = data.receiver;
    smsError.errorsTxt = data.errorText;
    smsError.isInternational = data.isInternational;
    smsError.createdOn = new Date();
    return this.manager.save(smsError);
  };
}
