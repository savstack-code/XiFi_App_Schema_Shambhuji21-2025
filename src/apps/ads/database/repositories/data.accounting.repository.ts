import { EntityRepository, EntityManager, MoreThanOrEqual } from "typeorm";
import DataAccounting from "../../../../shared/database/entities/DataAccounting";

@EntityRepository()
export class DataAccountingRepository {
    constructor(private manager: EntityManager) { }

    findOne = (userName: string) => {
        let findOptions: any = {
            where: { userName: userName }
        };
        return this.manager.findOne(DataAccounting, findOptions);
    };

    findSessions = (userName: string, planActivatedOn: Date) => {
        let findOptions: any = {
            where: { userName: userName, startTime: MoreThanOrEqual(planActivatedOn) }
        };
        return this.manager.find(DataAccounting, findOptions);
    };
}