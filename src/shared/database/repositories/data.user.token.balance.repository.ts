import { EntityRepository, Repository, EntityManager } from "typeorm";
import DataUserTokenBalance from "../entities/DataUserTokenBalance";
import DataUserTokenBalanceModel from "../../models/data.user.token.balance";

@EntityRepository()
export class DataUserTokenBalanceRepository {
  constructor(private manager: EntityManager) {}

  createAndSave = async (
    dataUserTokenBalanceModel: DataUserTokenBalanceModel
  ) => {
    const dataUserTokenBalance = new DataUserTokenBalance();
    dataUserTokenBalance.userId = dataUserTokenBalanceModel.userId;
    dataUserTokenBalance.tokens = dataUserTokenBalanceModel.tokens;
    dataUserTokenBalance.status = dataUserTokenBalanceModel.status;
    dataUserTokenBalance.modifiedBy = "System";
    dataUserTokenBalance.createdBy = "System";
    dataUserTokenBalance.createdOn = new Date();
    return this.manager.save(dataUserTokenBalance);
  };

  update = async (dataUserTokenBalance: DataUserTokenBalance) => {
    return this.manager.save(dataUserTokenBalance);
  };

  findOne(userId: string) {
    return this.manager.findOne(DataUserTokenBalance, {
      where: { userId: userId },
    });
  }
}
