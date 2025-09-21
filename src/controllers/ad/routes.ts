import { Request, Response, NextFunction } from "express";
import request from "request-promise";
import { IRouteInfo } from "../../middleware/schemaValidator";
import { checkUserDevice } from "../../middleware/check.user.device";
// import { IAdRequest, adSchema } from "../../models/schema/ad/ad.schema";
import {
  IAdRequest,
  adSchema,
  adCompleteNotificationSchema,
} from "../../reqSchema/ad.schema";

const routes: IRouteInfo[] = [
  {
    path: `/api/v${process.env.API_VERSION}/ad`,
    method: "get",
    tags: ["Ad"],
    validationSchema: adSchema,
    handler: [
      //validateGetAdRequest, //Comment Old Code By NT
      checkUserDevice,
      async (
        { query, body }: IAdRequest,
        res: Response,
        next: NextFunction
      ) => {
        try {
          let adUrl = `http://${process.env.HOST}:${process.env.PORT}/api/v${process.env.API_VERSION}/ad/getanadd?userDeviceId=${query.userDeviceId}&planType=${query.planType}`;
          const result = await request(adUrl);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/ad/notifycomplete`,
    method: "get",
    tags: ["Ad"],
    validationSchema: adCompleteNotificationSchema,
    handler: [
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          let adUrl = `http://${process.env.HOST}:${process.env.PORT}/api/v${process.env.API_VERSION}/ad/completenotification?userDeviceId=${query.userDeviceId}&planType=${query.planType}&adId=${query.adId}`;
          const result = await request(adUrl);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
];
export default routes;
