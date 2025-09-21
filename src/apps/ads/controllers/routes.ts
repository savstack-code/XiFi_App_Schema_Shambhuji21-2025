import { Request, Response, NextFunction } from "express";
import { getAnAd, completeAdNotification } from "./ad.controller";
// import {
//   validateGetAdRequest,
//   validateAdComleteNotificationRequest,
// } from "../middleware/schema.validator";
import { IRouteInfo } from "../../../middleware/schemaValidator";

import {
  IAdRequest,
  adSchema,
  adCompleteNotificationSchema,
} from "../../../reqSchema/ad.schema";
import { checkUserDevice } from "../../../middleware/check.user.device";

const routes: IRouteInfo[] = [
  {
    path: `/api/v${process.env.API_VERSION}/ad/getanadd`,
    method: "get",
    validationSchema: adSchema,
    handler: [
      //validateGetAdRequest,
      checkUserDevice,
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          const result = await getAnAd(query.planType);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/ad/completenotification`,
    method: "get",
    validationSchema: adCompleteNotificationSchema,
    handler: [
      //validateAdComleteNotificationRequest,
      checkUserDevice,
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          const result = await completeAdNotification(
            query.pdoaId,
            query.planType,
            query.adId
          );
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
];

export default routes;
