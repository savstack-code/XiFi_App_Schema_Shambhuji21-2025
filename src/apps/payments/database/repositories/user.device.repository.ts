import { EntityRepository, Repository, EntityManager } from "typeorm";
import UserDevice from "../../../../shared/database/entities/UserDevice";

@EntityRepository()
export class UserDeviceRepository {
    constructor(private manager: EntityManager) {
    }

    findOne(identifier: string) {
        return this.manager.findOne(UserDevice, { where: { 'identifier': identifier } });
    }

    findByUserDevice(userId: string, deviceId: string) {
        return this.manager.findOne(UserDevice, { where: { 'userId': userId, "deviceId": deviceId } });
    }

    findUserDevicesByStatus = (userId: string, status: string) => {
        return this.manager.find(UserDevice, { where: { 'userId': userId, "status": status } });
    }

    findUserDevices(userId: string) {
        return this.manager.find(UserDevice, { where: { 'userId': userId }, select: ['deviceId'] });
    }
}