import { EntityRepository, EntityManager } from "typeorm";
import PaymentGatewayConfig from "../../../../shared/database/entities/PaymentGatewayConfig";

@EntityRepository()
export class PaymentGatewayConfigRepository {
    constructor(private manager: EntityManager) {
    }

    findOne(name: string) {
        return this.manager.findOne(PaymentGatewayConfig, { where: { 'providerName': name } });
    }
}