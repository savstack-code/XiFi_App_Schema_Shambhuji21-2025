import { EntityRepository, Repository, EntityManager, In } from "typeorm";
import DataUserToken from "../entities/DataUserToken";
import DataUserTokenModel from "../../models/data.user.token.model";
@EntityRepository()
export class DataUserTokenRepository {
  constructor(private manager: EntityManager) {}

  createAndSave = async (dataUserTokenModel: DataUserTokenModel) => {
    const dataUserToken = new DataUserToken();
    dataUserToken.userId = dataUserTokenModel.userId;
    dataUserToken.tokens = dataUserTokenModel.tokens;
    dataUserToken.balance = dataUserTokenModel.balance;
    dataUserToken.referenceNo = dataUserTokenModel.referenceNo;
    dataUserToken.status = dataUserTokenModel.status;
    dataUserToken.transactionType = dataUserTokenModel.transactionType;
    dataUserToken.source = dataUserTokenModel.source;
    dataUserToken.modifiedBy = "System";
    dataUserToken.createdBy = "System";
    dataUserToken.createdOn = new Date();
    return this.manager.save(dataUserToken);
  };

  update = async (dataUserToken: DataUserToken) => {
    return this.manager.save(dataUserToken);
  };

  findByReferenceNo(source: string, userId: string, referenceNo: string) {
    return this.manager.findOne(DataUserToken, {
      order: {
        createdOn: "DESC",
      },
      where: { source: source, userId: userId, referenceNo: referenceNo },
    });
  }

  findByTokenReferenceNo(userId: string, referenceNo: string) {
    return this.manager.findOne(DataUserToken, {
      where: { userId: userId, referenceNo: referenceNo },
    });
  }

  findDataUserTokens(referenceNos: Array<string>, sources: Array<string>) {
    return this.manager.find(DataUserToken, {
      where: { source: In(sources), referenceNo: In(referenceNos) },
    });
  }

  findXiKasuTokenHistory(
    userId: string,
    currentPage: number,
    pageSize: number
  ) {
    return this.manager.find(DataUserToken, {
      order: {
        createdOn: "DESC",
      },
      select: [
        "identifier",
        "tokens",
        "balance",
        "transactionType",
        "referenceNo",
        "source",
        "status",
        "createdOn",
      ],
      where: { userId: userId },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    });
  }
}
