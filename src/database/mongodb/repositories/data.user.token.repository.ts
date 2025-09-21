// import { EntityRepository, Repository, EntityManager, In } from "typeorm";
// import DataUserToken from "../entities/DataUserToken";
// import DataUserTokenModel from "../../models/data.user.token.model";
import { DataUserTokenModel } from "../models/dataUserToken.model";
import { DataUserTokenBalanceModel } from "../models/dataUserTokenBalance.model";
import { UserModel } from "../models/user.model";
import { combineMobileUmber } from "../../../utils/mobileNumber";

import { IDataUserTokenRequest } from "../../../reqSchema/data.user.token.schema";
import { IXiKasuTokenTransferRequest } from "../../../reqSchema/xikasu.token.schema";

//@EntityRepository()
export class DataUserTokenRepository {
  // constructor(private manager: EntityManager) {}

  createAndSave = async (dataUserTokenModel: any) => {
    const dataUserToken = new DataUserTokenModel();
    dataUserToken.userId = dataUserTokenModel.userId;
    dataUserToken.tokens = dataUserTokenModel.tokens;
    dataUserToken.balance = dataUserTokenModel.balance;
    dataUserToken.referenceNo = dataUserTokenModel.referenceNo;
    dataUserToken.status = dataUserTokenModel.status;
    dataUserToken.transUserId = dataUserTokenModel.transUserId;
    dataUserToken.transMobileNumber = dataUserTokenModel.transMobileNumber;
    dataUserToken.transactionType = dataUserTokenModel.transactionType;
    dataUserToken.source = dataUserTokenModel.source;
    dataUserToken.modifiedBy = dataUserTokenModel.modifiedBy || "System";
    dataUserToken.createdBy = dataUserTokenModel.createdBy || "System";
    dataUserToken.createdOn = new Date();
    // return this.manager.save(dataUserToken);
    return dataUserToken.save();
  };

  update = async (dataUserToken: IDataUserTokenRequest) => {
    const userToken = new DataUserTokenModel(dataUserToken);
    return userToken.save();
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
    let whereCondition: any = {};
    whereCondition.source = { $in: sources };
    whereCondition.referenceNo = { $in: referenceNos };
    return DataUserTokenModel.find(whereCondition);
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
    return (
      DataUserTokenModel.find({ userId: userId })
        // .select([
        //   "token",
        //   "balance",
        //   "transactionType",
        //   "referenceNo",
        //   "source",
        //   "status",
        //   "createdOn",
        //   "identifier",
        //   "userName",
        //   "startTime",
        //   "sessionTime",
        //   "dataUsed",
        //   "planId",
        //   "status",
        //   "userPlanId",
        //   "category",
        //   "referenceId",
        //   "calledStation",
        //   "callingStation",
        //   "locationId",
        // ])
        .sort({ createdOn: "desc" })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
    );
  }

  tokenTransfer = async (
    userId: string,
    receiverMobile: string,
    token: number,
    countryCode: any
  ) => {
    let user = await DataUserTokenBalanceModel.findOne({ userId: userId });

    if (user) {
      user.tokens = user.tokens - token;
      user = await user.save();
      receiverMobile = combineMobileUmber(receiverMobile, countryCode);
      const ruser = await UserModel.findOne({ mobileNumber: receiverMobile });
      if (ruser) {
        let csModel = {
          userId: user.userId,
          tokens: token,
          balance: user.tokens,
          transactionType: "Dr",
          transUserId: ruser.userID,
          transMobileNumber: ruser.mobileNumber,
          status: "Debited",
          source: "Transfer",
        };

        await this.createAndSave(csModel);
        let cuser = await DataUserTokenBalanceModel.findOne({
          userId: ruser.userID,
        });
        if (cuser) {
          const cmuser = await UserModel.findOne({ userID: userId });
          if (cmuser) {
            cuser.tokens = cuser.tokens + token;
            cuser = await cuser.save();
            csModel = {
              userId: cuser.userId,
              tokens: token,
              balance: cuser.tokens,
              transactionType: "Cr",
              transUserId: user.userId,
              transMobileNumber: cmuser.mobileNumber,
              status: "Credited",
              source: "Transfer",
            };
            await this.createAndSave(csModel);
          }
          let responseModel = {
            userId: user.userId,
            transUserId: cuser.userId,
            token: token,
            transuser: {
              name: ruser.firstName,
              mobileNumber: ruser.mobileNumber,
            },
            balance: user.tokens,
          };
          return responseModel;
        }
      }
    }
  };

  tokenAssign = async (
    receiverMobile: string,
    token: number,
    countryCode: any
  ) => {
    receiverMobile = combineMobileUmber(receiverMobile, countryCode);
    const ruser = await UserModel.findOne({ mobileNumber: receiverMobile });
    if (ruser) {
      let cuser = await DataUserTokenBalanceModel.findOne({
        userId: ruser.userID,
      });
      if (cuser) {
        cuser.tokens = cuser.tokens + token;
        cuser = await cuser.save();
        let csModel = {
          userId: ruser.userID,
          tokens: cuser.tokens,
          balance: cuser.tokens,
          transactionType: "Cr",
          status: "Assigned",
          source: "null",
        };
        await this.createAndSave(csModel);
        const responseModel = {
          userId: ruser.userID,
          token: token,
        };
        return responseModel;
      }
    }
  };

  tokenAssignByPdo = async (body: any) => {
    const mobileNumber = combineMobileUmber(
      body.mobileNumber,
      body.countryCode
    );
    const ruser = await UserModel.findOne({ mobileNumber: mobileNumber });
    if (ruser) {
      let cuser = await DataUserTokenBalanceModel.findOne({
        userId: ruser.userID,
      });
      if (cuser) {
        cuser.tokens = cuser.tokens + body.tokens;
        cuser = await cuser.save();
        let csModel = {
          userId: ruser.userID,
          tokens: body.tokens,
          balance: cuser.tokens,
          transactionType: "Cr",
          status: "Assigned",
          source: "PDO Buy",
          modifiedBy: "PDO",
          createdBy: "PDO",
        };
        const responseModel = await this.createAndSave(csModel);

        return responseModel;
      }
    }
  };

  tokenSend = async (
    senderMobile: string,
    receiverMobile: string,
    token: number,
    rCountryCode: any,
    sCountryCode: any
  ) => {
    senderMobile == combineMobileUmber(senderMobile, sCountryCode);
    let suser = await UserModel.findOne({
      mobileNumber: { $regex: senderMobile },
    });
    if (suser) {
      let suserBalance = await DataUserTokenBalanceModel.findOne({
        userId: suser.userID,
      });
      if (suserBalance) {
        suserBalance.tokens = suserBalance.tokens - token;
        suserBalance = await suserBalance.save();
        receiverMobile == combineMobileUmber(receiverMobile, rCountryCode);
        const ruser = await UserModel.findOne({
          mobileNumber: { $regex: receiverMobile },
        });
        if (ruser) {
          let csModel = {
            userId: suserBalance.userId,
            tokens: suserBalance.tokens,
            balance: suserBalance.tokens,
            transactionType: "Dr",
            transUserId: ruser.userID,
            status: "Debited",
            source: "null",
          };
          await this.createAndSave(csModel);
          let cuser = await DataUserTokenBalanceModel.findOne({
            userId: ruser.userID,
          });
          if (cuser) {
            cuser.tokens = cuser.tokens + token;
            cuser = await cuser.save();
            csModel = {
              userId: cuser.userId,
              tokens: cuser.tokens,
              balance: cuser.tokens,
              transactionType: "Cr",
              transUserId: suserBalance.userId,
              status: "Credited",
              source: "null",
            };
            await this.createAndSave(csModel);
            let responseModel = {
              userId: suserBalance.userId,
              transUserId: cuser.userId,
              token: token,
              transuser: {
                name: ruser.firstName,
                mobileNumber: ruser.mobileNumber,
              },
              balance: suserBalance.tokens,
            };
            return responseModel;
          }
        }
      }
    }
  };
}
