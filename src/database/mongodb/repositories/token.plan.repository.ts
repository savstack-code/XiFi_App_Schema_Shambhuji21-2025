// import { EntityRepository, EntityManager } from "typeorm";
// import TokenPlan from "../../../shared/database/entities/TokenPlan";
// import TokenPlanCreateRequest from "../../../models/request/tokenplan/token.plan.create.request";
// import TokenPlanUpdateRequest from "../../../models/request/tokenplan/token.plan.update.request";

import { TokenPlanModel } from "../models/tokenPlan.model";
import {
  ITokenPlanCreateRequest,
  ITokenplanGetRequest,
} from "../../../reqSchema/token.plan.schema";

//@EntityRepository()
export class TokenPlanRepository {
  //constructor(private manager: EntityManager) {}

  createAndSave = async (request: ITokenPlanCreateRequest["body"]) => {
    const tokenplan = new TokenPlanModel();
    tokenplan.identifier = request.identifier;
    tokenplan.name = request.name;
    tokenplan.amount = request.amount;
    tokenplan.xiKasuTokens = request.xiKasuTokens;
    tokenplan.status = request.status;
    tokenplan.currency = request.currency;
    tokenplan.description = request.description;
    tokenplan.createdOn = new Date();
    tokenplan.modifiedOn = new Date();
    // return this.manager.save(tokenplan);
    return tokenplan.save();
  };

  findByAmountOrKiKasuTokens(amount: number, xiKasuTokens: number) {
    // return this.manager.find(TokenPlan, {
    //   where: [{ amount: amount }, { xiKasuTokens: xiKasuTokens }],
    // });
    return TokenPlanModel.find({ $or: [{ amount }, { xiKasuTokens }] });
  }

  findByidentifier(identifier: any) {
    // return this.manager.findOne(TokenPlan, {
    //   where: { identifier: identifier },
    // });
    return TokenPlanModel.findOne({ identifier: parseInt(identifier) });
  }

  update = (TokenPlan: ITokenPlanCreateRequest) => {
    // return this.manager.save(TokenPlan);
    const tokenplan = new TokenPlanModel(TokenPlan);
    return tokenplan.save();
  };

  remove = (TokenPlan: ITokenPlanCreateRequest) => {
    // return this.manager.remove(TokenPlan);
    const tokenplan = new TokenPlanModel(TokenPlan);
    return tokenplan.remove();
  };

  find = (identifier: any) => {
    // let findOptions: any = {
    //   select: [
    //     "identifier",
    //     "name",
    //     "amount",
    //     "status",
    //     "currency",
    //     "xiKasuTokens",
    //     "description",
    //   ],
    // };
    // if (Object.keys(queryObject).length > 0) {
    //   findOptions.where = queryObject;
    // }
    // return this.manager.find(TokenPlan, findOptions);

    return TokenPlanModel.findOne({ identifier: identifier }).select([
      "identifier",
      "name",
      "amount",
      "status",
      "currency",
      "xiKasuTokens",
      "description",
    ]);
  };

  getActivePlans() {
    // return this.manager.find(TokenPlan, {
    //   select: [
    //     "identifier",
    //     "name",
    //     "amount",
    //     "status",
    //     "currency",
    //     "xiKasuTokens",
    //     "description",
    //   ],
    //   where: { status: "Active" },
    // });
    return TokenPlanModel.find({ status: "Active" }).select([
      "identifier",
      "name",
      "amount",
      "status",
      "currency",
      "xiKasuTokens",
      "description",
    ]);
  }
}
