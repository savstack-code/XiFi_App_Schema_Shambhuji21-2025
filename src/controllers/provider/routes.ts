import { Request, Response, NextFunction } from "express";
import {
  IRouteInfo,
  // validateGetSsidsRequest,
} from "../../middleware/schemaValidator";

import { getSsidsSchema } from "../../reqSchema/ssid.schema";
import { checkUserDevice } from "../../middleware/check.user.device";
import { sendResponse } from "../../middleware/send.response";
import { accountService } from "../../services/account.service";
const routes: IRouteInfo[] = [
  {
    path: `/api/v${process.env.API_VERSION}/provider/getpublickey`,
    method: "get",
    tags: ["Provider"],
    handler: [
      async ({ query }: Request, res: Response, next: NextFunction) => {
        try {
          const result = await accountService.getAppProviderPublicKey();
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/provider/getssids`,
    method: "get",
    tags: ["Provider"],
    validationSchema: getSsidsSchema,
    handler: [
      // validateGetSsidsRequest,
      checkUserDevice,
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          const result = await accountService.getSsids(query.location);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
      sendResponse,
    ],
  },
];

export default routes;
