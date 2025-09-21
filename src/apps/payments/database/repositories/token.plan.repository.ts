import { EntityRepository, EntityManager } from "typeorm";
import TokenPlan from "../../../../shared/database/entities/TokenPlan";

@EntityRepository()
export class TokenPlanRepository {
    constructor(private manager: EntityManager) { }

    findByidentifier(identifier: number) {
        return this.manager.findOne(TokenPlan, { where: { 'identifier': identifier } });
    }

    getActivePlans() {
        return this.manager.find(TokenPlan, {
            select: [
                "identifier",
                "name",
                "amount",
                "status",
                "currency",
                "xiKasuTokens",
                "description"
            ],
            where: { 'status': 'Active' }
        });
    }
}