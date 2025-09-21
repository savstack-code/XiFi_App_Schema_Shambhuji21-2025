import { EntityRepository, EntityManager } from "typeorm";
import DataUserPlan from "../../../../shared/database/entities/DataUserPlan";

@EntityRepository()
export class DataUserPlanRepository {
    constructor(private manager: EntityManager) {
    }

    findUserActivePlan(planId: string, status: string, userName: string) {
        return this.manager.findOne(DataUserPlan, { where: { 'planId': planId, 'status': status, 'userName': userName } });
    }
}