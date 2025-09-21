import { Request, Response, NextFunction } from "express";
import {
  //userRegistration,
  updateProfile,
  verifyOtp,
  signOff,
  getProfile,
  signOffAllDevices,
  resetReferralCode,
  registerUserDeviceToken,
  getProfileByMobile
} from "./registration.controller";
// import UserUpdateRequest from "../../models/request/user.update.request";
import { IUserUpdateRequest } from "../../reqSchema/user.create.schema";
import { IRouteInfo } from "../../middleware/schemaValidator";
import { checkUserDevice } from "../../middleware/check.user.device";
import UserDeviceTokenSaveRequest from "../../models/request/user.device.token.save.request";
import {
  IUserCreateRequestNew,
  userCreateSchema,
  userCreateSchemaNew,
} from "../../models/schema/user.create.schema";
import {
  ISendOTPReq,
  sendOtpRespSchema,
  sendOtpSchema,
} from "../../models/schema/send.otp.schema";
import { userUpdateSchema } from "../../models/schema/user.update.schema";
import { signOffSchema } from "../../models/schema/user.sign.off.scheme";
import {
  IVerifyOTPNewReq,
  verifyOtpRespSchema,
  verifyOtpSchema,
  verifyOtpSchemaNew,
} from "../../models/schema/verify.otp.schema";
import { signOffAllDevicesSchema } from "../../models/schema/user.sign.off.all.devices.schema";
import {
  getProfileResp,
  getProfileSchema,
} from "../../models/schema/get.profile.schema";
import {
  IUpdateLocationReq,
  updateLocationResp,
  updateLocationSchema,
  userDeviceTokenSaveSchema,
} from "../../models/schema/user.device.token.save.schema";
import {
  deleteUserRespSchema,
  deleteUserSchema,
  IDeleteUserReq,
} from "../../models/schema/user.delete.schema";
import { registrationService } from "../../services/registration.service";
import { combineMobileUmber } from "../../utils/mobileNumber";
import { adminValidation } from "../../middleware/admin.validation";

const routes: IRouteInfo[] = [
  {
    path: `/api/v${process.env.API_VERSION}/account/sendOTP`,
    method: "get",
    tags: ["Account"],
    validationSchema: sendOtpSchema,
    responses: sendOtpRespSchema,
    handler: [
      async ({ query }: ISendOTPReq, res: Response, next: NextFunction) => {
        try {
          const mobileNumber = combineMobileUmber(
            query.mobileNumber,
            query.countryCode
          );
          const result = await registrationService.sendOtp(
            mobileNumber,
            query.IMEI
          );
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/account/verifyotpNew`,
    method: "get",
    tags: ["Account"],
    validationSchema: verifyOtpSchemaNew,
    responses: verifyOtpRespSchema,
    handler: [
      async (
        { query }: IVerifyOTPNewReq,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const countryCode = query.countryCode
            ? query.countryCode.replace(" ", "+")
            : query.countryCode;
          const result = await registrationService.verifyOtpNew(
            `${query.mobileNumber}`,
            query.IMEI,
            query.otp,
            countryCode,
            query.OSType,
            query.OSVersion,
            query.deviceModel,
            query.macAddr
          );
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/account/registerNew`,
    method: "post",
    validationSchema: userCreateSchemaNew,
    tags: ["Account"],
    handler: [
      async (
        { body }: IUserCreateRequestNew,
        res: Response,
        next: NextFunction
      ) => {
        try {

          const result = await registrationService.registerNew(body);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  // {
  //   path: `/api/v${process.env.API_VERSION}/account/register`,
  //   method: "post",
  //   validationSchema: userCreateSchema,
  //   tags: ["Account"],
  //   handler: [
  //     async ({ query, body }: Request, res: Response, next: NextFunction) => {
  //       try {
  //         const createRequest = body;
  //         const result = await userRegistration(createRequest);
  //         res.status(200).send(result);
  //       } catch (error) {
  //         next(error);
  //       }
  //     },
  //   ],
  // },
  {
    path: `/api/v${process.env.API_VERSION}/account/verifyotp`,
    method: "get",
    tags: ["Account"],
    validationSchema: verifyOtpSchema,
    handler: [
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          const countryCode = query.countryCode
            ? query.countryCode.replace(" ", "+")
            : query.countryCode;
          const result = await verifyOtp(
            query.mobileNumber,
            query.deviceId,
            query.otp,
            countryCode
          );
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/account/delete`,
    method: "delete",
    tags: ["Account"],
    validationSchema: deleteUserSchema,
    responses: deleteUserRespSchema,
    handler: [
      async ({ query }: IDeleteUserReq, res: Response, next: NextFunction) => {
        try {
          const result = await registrationService.deleteUser(
            query.mobileNumber,
            query.countryCode
          );
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/account/profileUpdate`,
    method: "post",
    tags: ["Account"],
    validationSchema: userUpdateSchema,
    handler: [
      checkUserDevice,
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          const updateRequest: IUserUpdateRequest = body;
          const result = await updateProfile(updateRequest);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/account/signoff`,
    method: "get",
    tags: ["Account"],
    validationSchema: signOffSchema,
    handler: [
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          const result = await signOff(query.userDeviceId);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/account/signoffalldevices`,
    method: "get",
    tags: ["Account"],
    validationSchema: signOffAllDevicesSchema,
    handler: [
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          const result = await signOffAllDevices(query.mobileNumber);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/account/resetreferralcode`,
    method: "get",
    tags: ["Account"],
    validationSchema: signOffAllDevicesSchema,
    handler: [
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          const result = await resetReferralCode(query.mobileNumber);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/account/profile`,
    method: "get",
    tags: ["Account"],
    validationSchema: getProfileSchema,
    responses: getProfileResp,
    handler: [
      checkUserDevice,
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          const result = await getProfile();
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/account/userDeviceToken`,
    method: "post",
    tags: ["Account"],
    validationSchema: userDeviceTokenSaveSchema,
    handler: [
      checkUserDevice,
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          const userDeviceTokenSaveRequest: UserDeviceTokenSaveRequest = body;
          const result = await registerUserDeviceToken(
            userDeviceTokenSaveRequest
          );
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/account/deviceLocation`,
    method: "patch",
    tags: ["Account"],
    validationSchema: updateLocationSchema,
    responses: updateLocationResp,
    handler: [
      checkUserDevice,
      async (req: IUpdateLocationReq, res: Response, next: NextFunction) => {
        try {
          const result = await registrationService.updateDeviceLocation(
            req.body
          );
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/userByMobile`,
    method: "post",
    tags: ["Account"],
    responses: getProfileResp,
    jwtAuth: true,
    handler: [
      adminValidation,
      async ({ body }: Request, res: Response, next: NextFunction) => {
        try {
          const result = await getProfileByMobile(body);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
];

export default routes;
