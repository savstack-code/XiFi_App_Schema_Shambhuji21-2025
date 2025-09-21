import { EntityRepository, Repository, EntityManager } from "typeorm";
import User from "../../../../shared/database/entities/User";


@EntityRepository()
export class UserRepository {
    constructor(private manager: EntityManager) {
    }

    findByMobileNumber = (mobileNumber: string) => {
        return this.manager.findOne(User, { where: { 'mobileNumber': mobileNumber } });
    }

    findByUserId = (userId: string) => {
        return this.manager.findOne(User, { where: { 'userID': userId } });
    }

    findByApUserName = (apUserName: string) => {
        return this.manager.findOne(User, { where: { 'apUserName': apUserName } });
    }

    generateKey = async (manager: EntityManager, objectType: string) => {
        const rawData = await manager.query(`EXEC SP_GENERATE_KEY '${objectType}'`);
        return rawData[0].UserId;
    }
}