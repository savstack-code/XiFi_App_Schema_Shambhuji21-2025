import { ServiceResponse } from "../models/response/ServiceResponse";
// import { DatabaseProvider } from "../database/database.provider";
// import { UserRepository } from "../database/repositories/user.repository";
import { UserRepository } from "../database/mongodb/repositories/user.repository";
// import { UserDeviceRepository } from "../database/repositories/user.device.repository";
import { UserDeviceRepository } from "../database/mongodb/repositories/user.device.repository";
// import { ProfileOtpRepository } from "../database/repositories/profile.otp.repository";
import { ProfileOtpRepository } from "../database/mongodb/repositories/profile.otp.repository";

// import ProfileOtpCreateRequest from "../models/request/profile.otp.create.request";
import { IProfileOtpCreateRequest } from "../reqSchema/user.create.schema";
import { smsProvider } from "../providers/sms.provider";
// import UserUpdateRequest from "../models/request/user.update.request";
import {
  IUserUpdateRequest,
  IUserCreateRequest,
  IUserCreateRequestNew,
} from "../reqSchema/user.create.schema";
import logger from "../config/winston.logger";
import _ from "lodash";
// import { DataUserTokenBalanceRepository } from "../shared/database/repositories/data.user.token.balance.repository";
import { DataUserTokenBalanceRepository } from "../database/mongodb/repositories/data.user.token.balance.repository";
import { userDeviceService } from "./user.device.service";
import { setError, setErrorWithStatus } from "../utils/shared";
import generatePassword from "generate-password";
import { xifiReferralService } from "./xifi.referral.service";
import { ErrorCodeEnum } from "../shared/enums/error-code.enum";
import UserDeviceTokenSaveRequest from "../models/request/user.device.token.save.request";
import { xifiVoucherService } from "./xifi.voucher.service";
import {
  combineMobileUmber,
  getCountryCodeMobileNumber,
} from "../utils/mobileNumber";
// import {
//   IUserCreateRequest,
//   IUserCreateRequestNew,
// } from "../models/schema/user.create.schema";
import { IUpdateLocationReq } from "../models/schema/user.device.token.save.schema";

export class RegistrationService {
  userRepository: UserRepository;
  userDeviceRepository: UserDeviceRepository;
  profileOtpRepository: ProfileOtpRepository;
  dataUserTokenBalanceRepository: DataUserTokenBalanceRepository;
  constructor() {
    this.userRepository = new UserRepository();
    this.userDeviceRepository = new UserDeviceRepository();
    this.profileOtpRepository = new ProfileOtpRepository();
    this.dataUserTokenBalanceRepository = new DataUserTokenBalanceRepository();
  }
  private isValidName(str: string) {
    if (str.length < 3) {
      return false;
    }
    return !/[0-9\~\`\!\@\#\$\%\^\&\*\(\)\-\_=\+\\\|\]\}\[\{\'\"\:\;\/\?\>\,\<]/.test(
      str
    );
  }

  public async registerNew(
    requestModel: IUserCreateRequestNew["body"]
  ): Promise<ServiceResponse> {
    const {
      mobileNumber,
      countryCode,
      firstName,
      lastName,
      emailId,
      deviceId,
      version,
      playerId,
      referralCode,
    } = requestModel;

    const serviceResponse = new ServiceResponse();
    // const connection = await DatabaseProvider.getConnection();
    // const userDeviceRepository = connection.getCustomRepository(
    //   UserDeviceRepository
    // );
    // const userRepository = connection.getCustomRepository(UserRepository);
    const condition_mobileNumber = combineMobileUmber(
      mobileNumber,
      countryCode
    );
    const condition = {
      $or: [{ emailID: emailId }, { mobileNumber: condition_mobileNumber }],
    };
    const usercheckWithEmailAndNumber = await this.userRepository.findOne1(
      condition
    );
    if (usercheckWithEmailAndNumber) {
      return setErrorWithStatus(serviceResponse, "User already exists", "400");
    }
    const device = await this.userDeviceRepository.findOne(deviceId);
    if (!device) {
      return setErrorWithStatus(
        serviceResponse,
        `User not found with device id`,
        "400"
      );
    }
    const userCheck = await this.userRepository.findByUserId(device.userId);
    if (userCheck) {
      return setErrorWithStatus(serviceResponse, "User already exists", "400");
    }
    const referralCodeResponse = await xifiReferralService.validateReferralCode(
      requestModel.mobileNumber,
      requestModel.referralCode
    );

    if (!referralCodeResponse.success) {
      serviceResponse.errorCode = ErrorCodeEnum.REFERRAL_CODE_ERROR;
      serviceResponse.errors = referralCodeResponse.errors;
    }

    const userDoc = {
      mobileNumber: combineMobileUmber(mobileNumber, countryCode),
      userCode: this.generateUserCode(
        firstName,
        combineMobileUmber(mobileNumber, countryCode)
      ),
      firstName,
      lastName,
      emailId,
      version,
      playerId,
      referralCode,
    };
    logger.debug(`Registring user: ${JSON.stringify(userDoc)}`);
    await this.userRepository.createAndSave(device.userId, userDoc);
    const applyVoucherForNewUser = process.env.APPLY_VOUCHER_FOR_NEW_USER;
    const newUserVoucher = process.env.NEW_USER_VOUCHER;
    if (
      applyVoucherForNewUser &&
      applyVoucherForNewUser == "1" &&
      newUserVoucher
    ) {
      logger.debug(`Applying voucher (${newUserVoucher}) for new user `);
      var appliedVoucher = await xifiVoucherService.redeemXifiVoucherByUserId(
        newUserVoucher,
        device.userId
      );
      if (!appliedVoucher.success) {
        logger.error(appliedVoucher.errors[0]);
      } else {
        logger.info(
          `${appliedVoucher.result.tokensEarned} XiKasu Tokens credited to the user ${device.userId} for new registration.`
        );
      }
    } else {
      logger.error("Free voucher is not applied.");
    }
    serviceResponse.setSuccess({ message: `User registered.` });
    if (referralCode) {
      const referralResponse = await xifiReferralService.creditReferralTokens(
        device.userId,
        referralCode
      );
      if (referralResponse.success) {
        serviceResponse.result.message = `${referralResponse.result.message}\n${referralResponse.result.xiKasuTokens} XiKasu tokens have been added to your account for referral benefit.`;
        serviceResponse.result.tokensEarned =
          referralResponse.result.xiKasuTokens;
      }
    }
    return serviceResponse;
  }

  // public async register(
  //   requestModel: IUserCreateRequest["body"]
  // ): Promise<ServiceResponse> {
  //   const { mobileNumber, countryCode, iMENo } = requestModel; // Ask About IMENo and Required or not
  //   await this.sendOtp(
  //     combineMobileUmber(mobileNumber, countryCode),
  //     iMENo ? iMENo : ""
  //   );

  //   const serviceResponse = new ServiceResponse();
  //   requestModel.firstName = requestModel.firstName.replace(/ +/g, " ");
  //   requestModel.lastName = requestModel.lastName.replace(/ +/g, " ");
  //   if (!this.isValidName(requestModel.firstName)) {
  //     setError(serviceResponse, "Invalid First Name", "400");
  //     return serviceResponse;
  //   }
  //   if (!this.isValidName(requestModel.lastName)) {
  //     setError(serviceResponse, "Invalid Last Name", "400");
  //     return serviceResponse;
  //   }
  //   const referralCodeResponse = await xifiReferralService.validateReferralCode(
  //     requestModel.mobileNumber,
  //     requestModel.referralCode
  //   );
  //   if (!referralCodeResponse.success) {
  //     serviceResponse.errorCode = ErrorCodeEnum.REFERRAL_CODE_ERROR;
  //     serviceResponse.errors = referralCodeResponse.errors;
  //   }
  //   const userCreateResponse = await this.createUserProfile(requestModel);
  //   if (userCreateResponse.success) {
  //     const message = `User registered.`;
  //     serviceResponse.success = true;
  //     serviceResponse.result = { message: message };
  //   }
  //   return serviceResponse;
  // }

  // private async createUserProfile(
  //   requestModel: IUserCreateRequest["body"]
  // ): Promise<ServiceResponse> {
  //   const serviceResponse = new ServiceResponse();
  //   const connection = await DatabaseProvider.getConnection();

  //   const response = await connection.transaction(async (manager) => {
  //     // const userRepository = manager.getCustomRepository(UserRepository); // DONT USE GLOBAL getCustomRepository here!
  //     // const userDeviceRepository = manager.getCustomRepository(
  //     //   UserDeviceRepository
  //     // );

  //     let user = await this.userRepository.findByMobileNumber(
  //       requestModel.mobileNumber
  //     );
  //     requestModel.mobileNumber = combineMobileUmber(
  //       requestModel.mobileNumber,
  //       requestModel.countryCode
  //     );
  //     if (!user) {
  //       const userPrefix = <string>process.env.USER_PREFIX;
  //       const userId = await this.userRepository.generateKey(
  //         manager,
  //         userPrefix
  //       );
  //       requestModel.userCode = this.generateUserCode(
  //         requestModel.firstName, // change it to firstName
  //         requestModel.mobileNumber
  //       );
  //       user = await this.userRepository.createAndSave(userId, requestModel);
  //     } else {
  //       user.emailID = requestModel.emailId;
  //       if (requestModel.firstName) {
  //         user.firstName = requestModel.firstName;
  //       }
  //       if (requestModel.lastName) {
  //         user.lastName = requestModel.lastName;
  //       }
  //       if (
  //         requestModel.countryCode &&
  //         user.mobileNumber.split(" ").length == 1
  //       ) {
  //         user.mobileNumber = requestModel.mobileNumber;
  //       }
  //       const userEntity = await user.update();
  //     }

  //     if (!requestModel.iMENo) {
  //       setError(serviceResponse, "iMENo Number is required", "400");
  //       return serviceResponse;
  //     }

  //     let userDevice = await this.userDeviceRepository.findByUserDevice(
  //       user.userID,
  //       requestModel.iMENo
  //     );

  //     if (userDevice.length === 0 && typeof requestModel.iMENo != "undefined") {
  //       await this.userDeviceRepository.createAndSave(
  //         user.userID,
  //         requestModel
  //       );
  //     }
  //     serviceResponse.success = true;
  //     serviceResponse.result = user;
  //     return serviceResponse;
  //   });

  //   return serviceResponse;
  // }

  private generateUserCode(name: string, mobileNumber: string): string {
    const userCodePart = generatePassword
      .generate({ length: 5, numbers: true })
      .toUpperCase();
    const userCode =
      name.substring(0, 3).toUpperCase() +
      userCodePart +
      mobileNumber.slice(-2).toUpperCase();
    return userCode;
  }

  private async applyReferralCode(
    userId: string,
    referralCode: string
  ): Promise<string> {
    const referralResponse = await xifiReferralService.creditReferralTokens(
      userId,
      referralCode
    );
    if (referralResponse.success) {
      return `${referralResponse.result.message}\n${referralResponse.result.xiKasuTokens} XiKasu tokens have been added to your account for referral benefit.`;
    }

    return referralResponse.errors[0];
  }

  public async updateProfile(
    userUpdateRequest: IUserUpdateRequest
  ): Promise<ServiceResponse> {
    const serviceResponse = new ServiceResponse();

    if (userUpdateRequest.firstName) {
      userUpdateRequest.firstName = userUpdateRequest.firstName.replace(
        / +/g,
        " "
      );
      if (!this.isValidName(userUpdateRequest.firstName)) {
        setError(serviceResponse, "Invalid First Name", "400");
        return serviceResponse;
      }
    }

    if (userUpdateRequest.lastName) {
      userUpdateRequest.lastName = userUpdateRequest.lastName.replace(
        / +/g,
        " "
      );
      if (!this.isValidName(userUpdateRequest.lastName)) {
        setError(serviceResponse, "Invalid Last Name", "400");
        return serviceResponse;
      }
    }

    // const connection = await DatabaseProvider.getConnection();
    const loginUser = userDeviceService.getLoginUser();
    if (!loginUser) {
      setError(serviceResponse, `User not found`, "404");
      return serviceResponse;
    }
    //const userRepository = connection.getCustomRepository(UserRepository);
    let user = await this.userRepository.findByUserId(loginUser.userId);
    if (!user) {
      setError(serviceResponse, `User not found`, "404");
      return serviceResponse;
    }

    if (userUpdateRequest.firstName) {
      user.firstName = userUpdateRequest.firstName;
    }
    if (userUpdateRequest.lastName) {
      user.lastName = userUpdateRequest.lastName;
    }
    if (userUpdateRequest.emailId) {
      user.emailID = userUpdateRequest.emailId;
    }
    user.modifiedBy = user.userID;
    user.modifiedOn = new Date();

    user.save();
    if (userUpdateRequest.referralCode) {
      const validateReferralCodeResponse =
        await xifiReferralService.validateReferralCode(
          user.mobileNumber,
          userUpdateRequest.referralCode
        );
      if (validateReferralCodeResponse.success) {
        const referralResponse = await xifiReferralService.creditReferralTokens(
          user.userID,
          userUpdateRequest.referralCode
        );
        if (referralResponse.success) {
          serviceResponse.result = {
            message: `${referralResponse.result.message}\n${referralResponse.result.xiKasuTokens} XiKasu tokens have been added to your account for referral benefit.`,
            xiKasuTokens: referralResponse.result.xiKasuTokens,
            totalTokens: referralResponse.result.totalTokens,
          };
        } else {
          serviceResponse.statusCode = referralResponse.statusCode;
          serviceResponse.errors = referralResponse.errors;
          return serviceResponse;
        }
      } else {
        serviceResponse.statusCode = validateReferralCodeResponse.statusCode;
        serviceResponse.errors = validateReferralCodeResponse.errors;
        return serviceResponse;
      }
    }

    serviceResponse.success = true;
    if (!userUpdateRequest.referralCode) {
      serviceResponse.result = { message: "User updated successfully." };
    }
    return serviceResponse;
  }

  public async deleteUser(
    mobileNumber: string,
    countryCode?: string
  ): Promise<ServiceResponse> {
    const serviceResponse = new ServiceResponse();

    // const connection = await DatabaseProvider.getConnection();
    //  const userRepository = connection.getCustomRepository(UserRepository);
    try {
      const users = await this.userRepository.deleteByMobileNumber(
        mobileNumber,
        countryCode
      );
      serviceResponse.setSuccess({
        message: `${countryCode} ${mobileNumber} with user ${users
          .map((u) => `${u.firstName} ${u.lastName || ""}`)
          .join(", ")} deleted.`,
      });
    } catch (err: any) {
      serviceResponse.errors = [`Unable to delete user: ${err.message}`];
    }
    return serviceResponse;
  }

  public async sendOtp(
    mobileNumber: string,
    deviceId: string
  ): Promise<ServiceResponse> {
    const serviceResponse = new ServiceResponse();
    const otp = this.randomFixedInteger(6);
    //const connection = await DatabaseProvider.getConnection();
    //const userRepository = connection.getCustomRepository(UserRepository);
    // const userDeviceRepository = connection.getCustomRepository(
    //   UserDeviceRepository
    // );
    const countryCodeMobileNumber = getCountryCodeMobileNumber(mobileNumber);

    const tpn = combineMobileUmber(mobileNumber);
    const ctp = tpn.substring(0, 3);
    const rpn = tpn.substring(3, tpn.length);
    const apn = ctp + " " + rpn;
    const user = await this.userRepository.findByMobileNumber(apn);
    const device = await this.userDeviceRepository.findOneByDeviceId(deviceId);
    const profileOtpCreateRequest: IProfileOtpCreateRequest = {
      userId: user ? user.userID : "",
      mobileNumber: mobileNumber,
      deviceId,
      otp,
      createdOn: new Date(),
    };
    let userName = "User";
    let newUser = true;
    let newDeviceId = device ? false : true;
    console.log(user, "user");
    if (user) {
      // profileOtpCreateRequest.userId = user.userID;
      userName = user.firstName;
      newUser = false;
    }
    // const profileOtpRepository = connection.getCustomRepository(
    //   ProfileOtpRepository
    // );

    await this.profileOtpRepository.createAndSave(profileOtpCreateRequest);
    if (
      ["", "+91", "91"].includes(
        countryCodeMobileNumber.countryCode.replace(/[ \-]/g, "")
      )
    ) {
      const messageToBeSend = `Dear ${userName}, OTP is ${otp} ${process.env.OTP_MESSAGE}`;

      const smsResponse = await smsProvider.sendSms(
        countryCodeMobileNumber.mobileNumber,
        messageToBeSend
      );
      console.log(
        messageToBeSend,
        "messageToBeSend.........................",
        smsResponse,
        "sms response................."
      );
      if (smsResponse && smsResponse.status == "failure") {
        serviceResponse.statusCode = "301";
        serviceResponse.errors.push("SMS has not been sent.");
        serviceResponse.errors.push(smsResponse.errors[0].message);
        if (smsResponse.warnings) {
          serviceResponse.errors.push(smsResponse.warnings[0].message);
        }
        return serviceResponse;
      }
      // else{
      //     serviceResponse.errors.push("SMS has not been sent.");
      //     return serviceResponse;
      // }
    } else {
      const smsResponse = await smsProvider.sendInternationalSms(
        mobileNumber.replace("+", "").replace(" ", ""),
        `Dear ${userName}, ${otp} ${process.env.OTP_MESSAGE}`
      );
      if (smsResponse && smsResponse.errorCode != "1701") {
        serviceResponse.statusCode = "301";
        serviceResponse.errors.push("SMS has not been sent.");
        serviceResponse.errors.push(`SMS error code ${smsResponse.errorCode}`);
        return serviceResponse;
      }
    }
    return serviceResponse.setSuccess({
      message: "OTP successfully sent.",
      newUser,
      newDeviceId,
    });
  }

  private async checkOtpInDb(
    mobileNumber: string,
    deviceId: string,
    otp: number,
    countryCode?: string
  ) {
    const serviceResponse = new ServiceResponse();
    const demoMobileNumber: any = process.env.DEMO_MOBILE_NUMBER;
    const demoOtp = process.env.DEMO_OTP;
    if (demoMobileNumber && demoMobileNumber == mobileNumber) {
      if (demoOtp && parseInt(demoOtp) == otp) {
        serviceResponse.success = true;
        return serviceResponse;
      }
      const errorMessage = `Not a valid OTP ${otp}, for the mobile number ${mobileNumber}.`;
      setError(serviceResponse, errorMessage, "400");
      return serviceResponse;
    }
    const profileOtpMobileNumber = combineMobileUmber(
      mobileNumber,
      countryCode
    );
    //const connection = await DatabaseProvider.getConnection();
    // const profileOtpRepository = connection.getCustomRepository(
    //   ProfileOtpRepository
    // );
    const profileOtp = await this.profileOtpRepository.findOne(
      profileOtpMobileNumber,
      deviceId
    );
    if (!profileOtp) {
      const errorMessage = `Invalid Mobile Number or Invalid Device Id.`;
      setError(serviceResponse, errorMessage, "400");
      return serviceResponse;
    }
    if (profileOtp.otp != otp) {
      const errorMessage = `Not a valid OTP ${otp}, for the mobile number ${mobileNumber}.`;
      setError(serviceResponse, errorMessage, "400");
      return serviceResponse;
    }

    const otpExpireMinutes: any = process.env.OTP_EXPIRE_MIN
      ? process.env.OTP_EXPIRE_MIN
      : 10;
    const validOtpDatetime = new Date(
      profileOtp.createdOn ? profileOtp.createdOn : ""
    ).addMinutes(otpExpireMinutes);
    if (validOtpDatetime < new Date()) {
      const errorMessage = `OTP ${otp} has been expired for the mobile number ${mobileNumber}.`;
      setError(serviceResponse, errorMessage, "400");
      return serviceResponse;
    }
    return serviceResponse.setSuccess();
  }

  public async verifyOtp(
    mobileNumber: string,
    deviceId: string,
    otp: number,
    countryCode?: string
  ): Promise<ServiceResponse> {
    const serviceResponse = await this.checkOtpInDb(
      mobileNumber,
      deviceId,
      otp,
      countryCode
    );
    if (serviceResponse.success === false) {
      return serviceResponse;
    }
    return await this.procesVerifyOtp(mobileNumber, deviceId);
  }
  public async verifyOtpNew(
    mobileNumber: string,
    deviceId: string,
    otp: number,
    countryCode?: string,
    OSType?: string,
    OSVersion?: string,
    deviceModel?: string,
    macAddr?: string
  ) {
    const serviceResponse = await this.checkOtpInDb(
      mobileNumber,
      deviceId,
      otp,
      countryCode
    );
    if (serviceResponse.success === false) {
      return serviceResponse;
    }
    // const connection1 = await DatabaseProvider.getConnection();

    //return await connection1.transaction(async (connection) => {
    // const userDeviceRepository = connection.getCustomRepository(
    //   UserDeviceRepository
    // );
    //const userRepository = connection.getCustomRepository(UserRepository);
    await this.userDeviceRepository.updateAllStatusByDeviceId(
      deviceId,
      "InActive"
    );

    const existingUser = await this.userRepository.findByMobileNumber(
      combineMobileUmber(mobileNumber, countryCode)
    );
    if (existingUser) {
      const allDevices = await this.userDeviceRepository.findQuery({
        userId: existingUser.userID,
        status: "Active",
      });

      if (allDevices.length > 4) {
        const serviceResponse = new ServiceResponse();
        serviceResponse.errors.push(
          `You already have ${allDevices.length} active devices. Please logout from old devices first to continue.`
        );
        return serviceResponse;
      }

      // await userDeviceRepository.updateAllStatusByUserId(
      //   existingUser.userID,
      //   "InActive"
      // );
      const device = await this.userDeviceRepository.findAndCreate(
        existingUser.userID,
        { deviceId, playerId: "", OSType, OSVersion, deviceModel, macAddr }
      );
      device.status = "Active";
      device.modifiedOn = new Date();
      if (macAddr) {
        device.macAddr = macAddr;
      }
      await device.save();
      return serviceResponse.setSuccess({
        userDeviceId: device.identifier,
        message: "Valid OTP.",
      });
    }
    const userPrefix = <string>process.env.USER_PREFIX;
    const userId = await this.userRepository.generateKey("user", userPrefix);
    const device = await this.userDeviceRepository.findAndCreate(userId, {
      deviceId,
      playerId: "",
      OSType,
      OSVersion,
      deviceModel,
      macAddr,
    });
    device.status = "Active";
    device.modifiedOn = new Date();
    if (macAddr) {
      device.macAddr = macAddr;
    }
    await device.save();
    return serviceResponse.setSuccess({
      userDeviceId: device.identifier,
      message: "Valid OTP.",
    });
    //});
  }

  private async procesVerifyOtp(
    mobileNumber: string,
    deviceId: string
  ): Promise<ServiceResponse> {
    const serviceResponse = new ServiceResponse();
    //const connection = await DatabaseProvider.getConnection();
    //const userRepository = connection.getCustomRepository(UserRepository);
    const user = await this.userRepository.findByMobileNumber(mobileNumber);
    if (user) {
      const applyVoucherForNewUser = process.env.APPLY_VOUCHER_FOR_NEW_USER;
      const newUserVoucher = process.env.NEW_USER_VOUCHER;
      if (
        applyVoucherForNewUser &&
        applyVoucherForNewUser == "1" &&
        newUserVoucher
      ) {
        var appliedVoucher = await xifiVoucherService.redeemXifiVoucherByUserId(
          newUserVoucher,
          user.userID
        );
        if (!appliedVoucher.success) {
          logger.error(appliedVoucher.errors[0]);
        } else {
          logger.info(
            `${appliedVoucher.result.tokensEarned} XiKasu Tokens credited to the user ${user.userID} for new registration.`
          );
        }
      } else {
        logger.error("Configuration miss match.");
      }
      // const userDeviceRepository = connection.getCustomRepository(
      //   UserDeviceRepository
      // );
      const userDeviceUpdateResult =
        await this.userDeviceRepository.updateAllStatusByUserId(
          user.userID,
          "InActive"
        );
      if (userDeviceUpdateResult) {
        let userDevice = await this.userDeviceRepository.findByUserDevice(
          user.userID,
          deviceId
        );
        //Ask about array Records
        if (userDevice.length > 0) {
          userDevice[0].status = "Active";
          userDevice[0].modifiedOn = new Date();
          let userDeviceData = await this.userDeviceRepository.update(
            userDevice[0]
          );
          serviceResponse.setSuccess({
            userDeviceId: userDeviceData.identifier,
            message: "Valid OTP.",
          });
          if (user && !user.referralExpired && user.referralCode) {
            const referralResponse =
              await xifiReferralService.creditReferralTokens(
                user.userID,
                user.referralCode
              );
            if (referralResponse.success) {
              serviceResponse.result.message = `${referralResponse.result.message}\n${referralResponse.result.xiKasuTokens} XiKasu tokens have been added to your account for referral benefit.`;
              serviceResponse.result.tokensEarned =
                referralResponse.result.xiKasuTokens;
            }
          }
        } else {
          const errorMessage = `Invalid Mobile Number or Invalid Device Id.`;
          setError(serviceResponse, errorMessage, "400");
        }
      }
    } else {
      const errorMessage = `Invalid Mobile Number or Invalid Device Id.`;
      setError(serviceResponse, errorMessage, "400");
    }
    return serviceResponse;
  }

  public async signOff(userDeviceId: string): Promise<ServiceResponse> {
    const serviceResponse = new ServiceResponse();
    //const connection = await DatabaseProvider.getConnection();
    // const userDeviceRepository = connection.getCustomRepository(
    //   UserDeviceRepository
    // );
    let userDevice = await this.userDeviceRepository.findOne(userDeviceId);
    if (userDevice) {
      userDevice.status = "InActive";
      userDevice.modifiedOn = new Date();
      userDevice = await userDevice.save();
      serviceResponse.success = true;
      serviceResponse.statusCode = "200";
      serviceResponse.result = {
        userDeviceId: userDeviceId,
        message: "Successfully Signed Off",
      };
      return serviceResponse;
    }
    const errorMessage = `User not existed with this Id`;
    setError(serviceResponse, errorMessage, "404");
    return serviceResponse;
  }

  public async signOffAllDevices(
    mobileNumber: string
  ): Promise<ServiceResponse> {
    const serviceResponse = new ServiceResponse();
    //const connection = await DatabaseProvider.getConnection();
    //const userRepository = connection.getCustomRepository(UserRepository);
    const user = await this.userRepository.findByMobileNumber(mobileNumber);
    if (user) {
      // const userDeviceRepository = connection.getCustomRepository(
      //   UserDeviceRepository
      // );
      const userDeviceUpdateResult =
        await this.userDeviceRepository.updateAllStatusByUserId(
          user.userID,
          "InActive"
        );
      if (userDeviceUpdateResult) {
        serviceResponse.success = true;
        serviceResponse.statusCode = "200";
        serviceResponse.result = {
          mobileNumber: mobileNumber,
          message: "Successfully Signed Off in all devices",
        };
        return serviceResponse;
      }
    }

    const errorMessage = `User not existed with this mobile number`;
    setError(serviceResponse, errorMessage, "404");
    return serviceResponse;
  }

  public async getProfile(): Promise<ServiceResponse> {
    const serviceResponse = new ServiceResponse();
    //const connection = await DatabaseProvider.getConnection();
    const loginUser = userDeviceService.getLoginUser();
    if (loginUser) {
      //const userRepository = connection.getCustomRepository(UserRepository);
      // const userDeviceRepository = connection.getCustomRepository(
      //   UserDeviceRepository
      // );
      let user = await this.userRepository.findByUserId(loginUser.userId);
      if (user) {
        serviceResponse.success = true;
        serviceResponse.statusCode = "200";
        if (!user.userCode) {
          user.userCode = this.generateUserCode(
            user.firstName,
            user.mobileNumber
          );
          user = await user.save();
        }

        if (user === null) {
          const errorMessage = `User not found`;
          setError(serviceResponse, errorMessage, "404");
          return serviceResponse;
        }

        const allDevices = await this.userDeviceRepository.findQuery(
          { userId: user.userID },
          true
        );
        serviceResponse.result = {
          name: user.firstName,
          firstName: user.firstName,
          lastName: user.lastName,
          mobileNumber: user.mobileNumber,
          email: user.emailID,
          userCode: user.userCode,
          referralExpired: user.referralExpired,
          xifiTokens: 0,
          allDevices,
        };

        // const dataUserTokenBalanceRepository = connection.getCustomRepository(
        //   DataUserTokenBalanceRepository
        // );
        const dataUserTokenBalance =
          await this.dataUserTokenBalanceRepository.findOne(user.userID);
        if (dataUserTokenBalance) {
          serviceResponse.result.xifiTokens = dataUserTokenBalance.tokens;
        }
      }
      return serviceResponse;
    }
    const errorMessage = `User not found.`;
    setError(serviceResponse, errorMessage, "404");
    return serviceResponse;
  }

  public async getProfileByMobile(body: any): Promise<ServiceResponse> {
    const serviceResponse = new ServiceResponse();
    const mobileNumber = combineMobileUmber(
      body.mobileNumber,
      body.countryCode
    );
    let user = await this.userRepository.findByMobileNumber(mobileNumber);
    if (user) {
      serviceResponse.success = true;
      serviceResponse.statusCode = "200";
      serviceResponse.result = user;
      return serviceResponse;
    }
    const errorMessage = `User not found.`;
    setError(serviceResponse, errorMessage, "404");
    return serviceResponse;
  }
  public async resetReferralCode(
    mobileNumber: string
  ): Promise<ServiceResponse> {
    const serviceResponse = new ServiceResponse();
    //const connection = await DatabaseProvider.getConnection();

    // const userRepository = connection.getCustomRepository(UserRepository);
    const user = await this.userRepository.findByMobileNumber(mobileNumber);
    if (user) {
      user.referralCode = null;
      user.referralExpired = false;
      const userUpdate = await user.save();
      serviceResponse.success = true;
      serviceResponse.statusCode = "200";
      serviceResponse.result = {
        mobileNumber: mobileNumber,
        message: "Successfully resetted the referral code.",
      };
      return serviceResponse;
    }
    const errorMessage = `Invalid Mobile number.`;
    setError(serviceResponse, errorMessage, "404");
    return serviceResponse;
  }

  public async registerDeviceToken(
    requestModel: UserDeviceTokenSaveRequest
  ): Promise<ServiceResponse> {
    const serviceResponse = new ServiceResponse();
    //const connection = await DatabaseProvider.getConnection();

    // const userDeviceRepository = connection.getCustomRepository(
    //   UserDeviceRepository
    // );
    let userDevice = await this.userDeviceRepository.findOne(
      requestModel.userDeviceId
    );
    if (userDevice) {
      serviceResponse.success = true;
      serviceResponse.statusCode = "200";

      userDevice.deviceType = requestModel.deviceType;
      userDevice.deviceToken = requestModel.deviceToken;
      userDevice.modifiedOn = new Date();
      userDevice = await userDevice.save();

      serviceResponse.result = {
        userDeviceId: requestModel.userDeviceId,
        message: "Device Token successfully saved.",
      };
      return serviceResponse;
    }

    const errorMessage = `User device not found.`;
    setError(serviceResponse, errorMessage, "404");
    return serviceResponse;
  }

  private randomFixedInteger = (length: number) => {
    return Math.floor(
      Math.pow(10, length - 1) +
        Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
    );
  };

  async updateDeviceLocation(reqBody: IUpdateLocationReq["body"]) {
    const serviceResponse = new ServiceResponse();
    //const connection = await DatabaseProvider.getConnection();

    // const userDeviceRepository = connection.getCustomRepository(
    //   UserDeviceRepository
    // );
    let userDevice = await this.userDeviceRepository.findOne(
      reqBody.userDeviceId
    );
    if (!userDevice) {
      const errorMessage = `User device not found.`;
      setError(serviceResponse, errorMessage, "404");
      return serviceResponse;
    }
    userDevice.lat = reqBody.lat;
    userDevice.lng = reqBody.lng;
    userDevice.locationUpdatedOn = new Date();
    await userDevice.save();
    serviceResponse.success = true;
    serviceResponse.statusCode = "200";
    serviceResponse.result = {
      disconnect: false,
    };
    return serviceResponse;
  }
}

export const registrationService = new RegistrationService();
