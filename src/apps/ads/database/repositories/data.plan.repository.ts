import { EntityRepository, EntityManager } from "typeorm";
import DataPlan from "../../../../shared/database/entities/DataPlan";

@EntityRepository()
export class DataPlanRepository {

    constructor(private manager: EntityManager) {
    }

    findByPlanType(planType: string) {
        return this.manager.findOne(DataPlan, { where: { 'planType': planType, 'status': 'Active' } });
    }
}