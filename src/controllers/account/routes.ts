import { Request, Response, NextFunction } from "express";
import { checkWaniPdoaTokenParams } from "../../middleware/checks";
import { pdoaTokenAuthentication } from "./account.controller";
import {
  IRouteInfo,
  // validateGetSsidsRequest,
} from "../../middleware/schemaValidator";

import { getSsidsSchema } from "../../reqSchema/ssid.schema";
import { checkUserDevice } from "../../middleware/check.user.device";
import { sendResponse } from "../../middleware/send.response";
const routes: IRouteInfo[] = [
  {
    path: `/api/v${process.env.API_VERSION}/auth`,
    method: "get",
    tags: ["Auth"],
    handler: [
      checkWaniPdoaTokenParams,
      async ({ query }: Request, res: Response, next: NextFunction) => {
        try {
          const result = await pdoaTokenAuthentication(query.wanipdoatoken);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
];

export default routes;
