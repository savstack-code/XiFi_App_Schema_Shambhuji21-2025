import { EntityRepository, EntityManager } from "typeorm";
import TokenPlan from "../../shared/database/entities/TokenPlan";
import TokenPlanCreateRequest from "../../models/request/tokenplan/token.plan.create.request";
import TokenPlanUpdateRequest from '../../models/request/tokenplan/token.plan.update.request';

@EntityRepository()
export class TokenPlanRepository {
    constructor(private manager: EntityManager) { }

    createAndSave = async (request: TokenPlanCreateRequest) => {
        const tokenplan = new TokenPlan();
        tokenplan.name = request.name;
        tokenplan.amount = request.amount;
        tokenplan.xiKasuTokens = request.xiKasuTokens;
        tokenplan.status = request.status;
        tokenplan.currency = request.currency;
        tokenplan.description = request.description;
        tokenplan.createdOn = new Date();
        tokenplan.modifiedOn = new Date();

        return this.manager.save(tokenplan);
    }

    findByAmountOrKiKasuTokens(amount: number, xiKasuTokens: number) {
        return this.manager.find(TokenPlan, { where: [{ 'amount': amount }, { 'xiKasuTokens': xiKasuTokens }] });
    }

    findByidentifier(identifier: number) {
        return this.manager.findOne(TokenPlan, { where: { 'identifier': identifier } });
    }

    update = (TokenPlan: TokenPlan) => {
        return this.manager.save(TokenPlan);
    };

    remove = (TokenPlan: TokenPlan) => {
        return this.manager.remove(TokenPlan);
    };

    find = (queryObject: any) => {
        let findOptions: any = {
            select: [
                "identifier",
                "name",
                "amount",
                "status",
                "currency",
                "xiKasuTokens",
                "description"
            ]
        };
        if (Object.keys(queryObject).length > 0) {
            findOptions.where = queryObject;
        }
        return this.manager.find(TokenPlan, findOptions);
    };

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