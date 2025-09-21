// import { EntityRepository, Repository, EntityManager } from "typeorm";
// import DataUserTokenBalance from "../entities/DataUserTokenBalance";
// import DataUserTokenBalanceModel from "../../models/data.user.token.balance";
import { DataUserTokenBalanceModel } from "../models/dataUserTokenBalance.model";
import { IDataUserTokenBalanceRequest } from "./../../../reqSchema/data.user.plan.schema";

// @EntityRepository()
export class DataUserTokenBalanceRepository {
  //   constructor(private manager: EntityManager) {}
  createAndSave = async (
    dataUserTokenBalanceModel: IDataUserTokenBalanceRequest["body"]
  ) => {
    const dataUserTokenBalance = new DataUserTokenBalanceModel();
    dataUserTokenBalance.userId = dataUserTokenBalanceModel.userId;
    dataUserTokenBalance.tokens = dataUserTokenBalanceModel.tokens;
    dataUserTokenBalance.status = dataUserTokenBalanceModel.status;
    dataUserTokenBalance.modifiedBy = "System";
    dataUserTokenBalance.createdBy = "System";
    dataUserTokenBalance.createdOn = new Date();
    return dataUserTokenBalance.save();
    // return this.manager.save(dataUserTokenBalance);
  };

  update = async (
    dataUserTokenBalance: IDataUserTokenBalanceRequest["body"]
  ) => {
    const dataUserTokenBalanceModel = new DataUserTokenBalanceModel(
      dataUserTokenBalance
    );
    return dataUserTokenBalanceModel.save();
    // return this.manager.save(dataUserTokenBalance);
  };

  findOne(userId: string) {
    return DataUserTokenBalanceModel.findOne({ userId: userId });
    // return this.manager.findOne(DataUserTokenBalance, {
    //   where: { userId: userId },
    // });
  }
  addTokenToUserAccount = async (userId: any, token: any) => {
    const userBalance = await DataUserTokenBalanceModel.findOne({ userId: userId })
    if (userBalance) {
      userBalance.tokens = userBalance?.tokens + token
      return await userBalance.save()
    }
  }
}
