import {EntityRepository, EntityManager} from "typeorm";
import PdoaConfig from "../../shared/database/entities/PdoaConfig";

@EntityRepository()
export class PdoaRepository {
    constructor(private manager: EntityManager) {
    }

    findByProviderId(providerId: string) {
       return this.manager.findOne(PdoaConfig, { where:{ 'pdoaId' : providerId } });
    }
}