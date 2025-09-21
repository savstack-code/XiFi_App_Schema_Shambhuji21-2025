import { Request, Response, NextFunction } from "express";
import { getDataAccountingHistory } from "./data.usage.controller";
import { IRouteInfo } from "../../middleware/schemaValidator";
import { checkUserDevice } from "../../middleware/check.user.device";
// import {
//   dataUsageFilterSchema,
//   dataUsesFilterResp,
// } from "../../models/schema/dataUsage/data.usage.filter.schema";

import {
  dataUsageFilterSchema,
  dataUsesFilterResp,
} from "../../reqSchema/data.usage.schema";

const routes: IRouteInfo[] = [
  {
    path: `/api/v${process.env.API_VERSION}/datausage/history`,
    method: "get",
    validationSchema: dataUsageFilterSchema,
    responses: dataUsesFilterResp,
    tags: ["Datausage"],
    handler: [
      checkUserDevice,
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          const result = await getDataAccountingHistory(query);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
];

export default routes;
