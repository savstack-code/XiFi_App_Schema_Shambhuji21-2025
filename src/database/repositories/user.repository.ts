import { EntityRepository, EntityManager, Like } from "typeorm";
import User from "../../shared/database/entities/User";
import { combineMobileUmber } from "../../utils/mobileNumber";

interface IUserCreateRequest {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  emailId?: string;
  version: string;
  playerId: string;
  userCode?: any;
  referralCode?: any;
  referralExpired?: any;
  countryCode?: string;
}

@EntityRepository()
export class UserRepository {
  constructor(private manager: EntityManager) {}
  createAndSave = (userId: string, request: IUserCreateRequest) => {
    const user = new User();
    user.firstName = request.firstName;
    user.lastName = request.lastName;

    user.mobileNumber = request.mobileNumber;
    if (request.emailId) {
      user.emailID = request.emailId;
    }
    user.userCode = request.userCode;
    if (request.hasOwnProperty("referralCode")) {
      user.referralCode = request.referralCode;
      user.referralExpired = true;
    }
    user.status = "Active";
    user.objectType = "USER";
    user.userID = userId;
    user.password = "MTIzNDU=";
    user.validFrom = new Date();
    user.validTo = new Date(new Date().setFullYear(2050, 11, 31)); //new Date(new Date().setFullYear(2025, 11, 31));//Date.today().next().month()// Convert.ToDateTime("2050"+"-"+DateTime.Now.Month+"-"+DateTime.Now.Day);
    user.createdBy = "USER000001";
    user.createdOn = new Date();
    return this.manager.save(user);
  };

  deleteByMobileNumber = async (mobileNumber: string, countryCode?: string) => {
    const condition = [
      { mobileNumber: combineMobileUmber(mobileNumber, countryCode) },
      {
        mobileNumber: `${countryCode}${mobileNumber}`,
      },
      { mobileNumber },
    ];
    const users = await this.manager.find(User, {
      where: condition,
    });
    if (users.length === 0) {
      throw new Error(
        `No user found with Mobile Number: ${countryCode} ${mobileNumber}`
      );
    }
    await Promise.all(users.map((u) => this.manager.remove(u)));
    return users;
  };

  update = (user: User) => {
    return this.manager.save(user);
  };

  findByMobileNumber = (mobileNumber: string) => {
    return this.manager.findOne(User, {
      where: { mobileNumber: Like(`%${mobileNumber}`) },
    });
  };

  findByUserId = (userID: string) => {
    return this.manager.findOne(User, { where: { userID } });
  };

  findByApUserName = (apUserName: string) => {
    return this.manager.findOne(User, { where: { apUserName: apUserName } });
  };

  findByUserCode = (userCode: string) => {
    return this.manager.findOne(User, { where: { userCode: userCode } });
  };

  findOne = (where: any) => {
    return this.manager.findOne(User, { where });
  };

  generateKey = async (manager: EntityManager, objectType: string) => {
    let dbType: any = process.env.DB_TYPE || "mysql";
    if (dbType == "mysql") {
      const rawData = await manager.query(
        `CALL SP_GENERATE_KEY('${objectType}')`
      );
      return rawData[0][0].UserId;
    }

    const rawData = await manager.query(`EXEC SP_GENERATE_KEY '${objectType}'`);
    return rawData[0].UserId;
  };
}
