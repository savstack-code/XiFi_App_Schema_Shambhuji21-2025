import { DatabaseProvider } from "../../database/database.provider";
import UserModel from "../../database/mongodb/models/user.model";
import User from "../../shared/database/entities/User";

DatabaseProvider.getConnection()
  .then(async (connection) => {
    await UserModel.deleteMany({});
    const userRepo = connection.getRepository(User);
    const users = await userRepo.find();
    console.log(`Total users: ${users.length}`);
    for (const user of users) {
      // const userDoc: Partial<IUserDoc> = {
      //   //   userID: user.userID,
      //   //   objectType: user.objectType,
      //   //   firstName: user.firstName,
      //   //   lastName: user.lastName,
      //   //   password: user.password,
      //   //   deviceID: user.deviceID,
      //   //   validFrom: user.validFrom,
      //   //   validTo: user.validTo,
      //   //   status: user.status.toLowerCase() === "active" ? "Active" : "Inactive",
      //   //   userType: user.userType,
      //   //   mobileNumber: user.mobileNumber,
      //   //   logonName: user.logonName,
      //   //   emailID: user.emailID,
      //   //   reportingUserID: user.reportingUserID,
      //   //   image: user.image,
      //   //   address: user.address,
      //   //   pincode: user.pincode,
      //   //   apUserName: user.apUserName,
      //   //   apPassword: user.apPassword,
      //   //   currentPlanId: user.currentPlanId,
      //   //   createdOn: user.createdOn,
      //   //   modifiedOn: user.modifiedOn,
      //   //   createdBy: user.createdBy,
      //   //   modifiedBy: user.modifiedBy,
      //   //   gender: user.gender,
      //   //   emailValidationFlag: user.emailValidationFlag,
      //   //   passwordExpiryDate: user.passwordExpiryDate,
      //   //   userCode: user.userCode,
      //   //   referralCode: user.referralCode,
      //   //   referralExpired: user.referralCode,
      //   //   asDeviceId: user.asDeviceId,
      //   //   railTelOrgNo: user.railTelOrgNo,
      //   //   railTelLastSessId: user.railTelLastSessId,
      // };
      const userDoc = JSON.parse(JSON.stringify(user));
      // console.log("userdoc: ", userDoc);
      await new UserModel(userDoc).save().catch((err) => {
        console.log(`Error on insert: ${err.message}`);
      });
    }
  })
  .then(() => {
    console.log(`SSID migrated`);
  })
  .catch((err) => {
    console.log("Error on ssid import", err);
  });
