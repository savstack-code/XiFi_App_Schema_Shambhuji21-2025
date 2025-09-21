import { Request, Response, NextFunction } from "express";
import { cronCdotMigrate } from "./cron.controller";
import {
  IRouteInfo,
  // validateGetSsidsRequest,
} from "../../middleware/schemaValidator";
const routes: IRouteInfo[] = [
  {
    path: `/api/v${process.env.API_VERSION}/cDotApSync`,
    method: "get",
    tags: ["Cron"],
    handler: [
      async ({ query }: Request, res: Response, next: NextFunction) => {
        try {
          const result = await cronCdotMigrate();
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
];

export default routes;
