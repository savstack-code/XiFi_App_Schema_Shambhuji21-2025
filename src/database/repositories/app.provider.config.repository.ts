import {EntityRepository, EntityManager} from "typeorm";
import AppProviderConfig from "../../shared/database/entities/AppProviderConfig";

@EntityRepository()
export class AppProviderConfigRepository {

    constructor(private manager: EntityManager) {
    }

    find() {
       return this.manager.find(AppProviderConfig);
    }
    
    findByProviderId(providerId: string) {
        return this.manager.findOne(AppProviderConfig, { where:{ 'appProviderId' : providerId}});
    }
}