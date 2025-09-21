import { EntityRepository, Repository, EntityManager, In } from "typeorm";
// import DataUserToken from "../entities/DataUserToken";
import { DataUserTokenModel } from "../mongodb/models/dataUserToken.model";
// import DataUserTokenModel from "../../models/data.user.token.model";
import { IDataUserTokenRequest } from "../../reqSchema/user.create.schema";
// @EntityRepository()
export class DataUserTokenRepository {
  //   constructor(private manager: EntityManager) {}

  createAndSave = async (dataUserTokenModel: IDataUserTokenRequest["body"]) => {
    const dataUserToken = new DataUserTokenModel();
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
    return dataUserToken.save();
    // return this.manager.save(dataUserToken);
  };

  update = async (dataUserToken: IDataUserTokenRequest["body"]) => {
    const dataUserTokenData = new DataUserTokenModel(dataUserToken);
    return dataUserTokenData.save();
    // return this.manager.save(dataUserToken);
  };

  findByReferenceNo(source: string, userId: string, referenceNo: string) {
    // return this.manager.findOne(DataUserToken, {
    //   order: {
    //     createdOn: "DESC",
    //   },
    //   where: { source: source, userId: userId, referenceNo: referenceNo },
    // });
    return DataUserTokenModel.findOne({
      source: source,
      userId: userId,
      referenceNo: referenceNo,
    }).sort({ createdOn: "desc" });
  }

  findByTokenReferenceNo(userId: string, referenceNo: string) {
    // return this.manager.findOne(DataUserToken, {
    //   where: { userId: userId, referenceNo: referenceNo },
    // });
    return DataUserTokenModel.findOne({
      userId: userId,
      referenceNo: referenceNo,
    });
  }

  findDataUserTokens(referenceNos: Array<string>, sources: Array<string>) {
    // return this.manager.find(DataUserToken, {
    //   where: { source: In(sources), referenceNo: In(referenceNos) },
    // });
    let findCon: any;
    findCon.source = { $in: sources };
    findCon.referenceNo = { $in: referenceNos };

    return DataUserTokenModel.find(findCon);
  }

  findXiKasuTokenHistory(
    userId: string,
    currentPage: number,
    pageSize: number
  ) {
    // return this.manager.find(DataUserToken, {
    //   order: {
    //     createdOn: "DESC",
    //   },
    //   select: [
    //     "identifier",
    //     "tokens",
    //     "balance",
    //     "transactionType",
    //     "referenceNo",
    //     "source",
    //     "status",
    //     "createdOn",
    //   ],
    //   where: { userId: userId },
    //   skip: (currentPage - 1) * pageSize,
    //   take: pageSize,
    // });

    return DataUserTokenModel.find({ userId: userId })
      .select([
        "identifier",
        "tokens",
        "balance",
        "transactionType",
        "referenceNo",
        "source",
        "status",
        "createdOn",
      ])
      .sort({
        createdOn: "DESC",
      })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);
  }
}
