import { Request, Response, NextFunction } from "express";
import {
  createDataUserPlan,
  getDataUserPlanHistory,
} from "./data.user.plan.controller";
// import DataUserPlanCreateRequest from "../../models/dataUserPlan/data.user.plan.create.request";
import { IDataUserPlanCreateRequest } from "../../reqSchema/data.user.plan.create.schema";
import { IRouteInfo } from "../../middleware/schemaValidator";
import { checkUserDevice } from "../../middleware/check.user.device";
// import {
//   dataUserPlanActivateSchema,
//   IDataUserPlanActivateReq,
// } from "../../models/schema/dataUserPlan/data.user.plan.activate.schema";
import {
  IDataUserPlanActivateReq,
  dataUserPlanActivateSchema,
} from "../../reqSchema/data.user.plan.activate.schema";
import { dataUserPlanService } from "../../services/data.user.plan.service";
// import {
//   dataUserCurrentSessionSchema,
//   getActiveSessionResp,
//   IDataUserCurrentSessionReq,
// } from "../../models/schema/dataUserPlan/data.user.currentSession";

// import { dataUserPlanBuySchema } from "../../models/schema/dataUserPlan/data.user.plan.buy.schema";
// import { dataUserPlanFilterSchema } from "../../models/schema/dataUserPlan/data.user.filter.schema";
// import {
//   dataUserDisconnectSessionSchema,
//   IDataUserDisconnectSessionReq,
// } from "../../models/schema/dataUserPlan/data.user.disconnectSession";
// import {
//   activateInternetResp,
//   activateInternetSchema,
//   IActivateInternetReq,
// } from "../../models/schema/dataUserPlan/data.user.activateInternet.schema";
import {
  dataUserCurrentSessionSchema,
  getActiveSessionResp,
  IDataUserCurrentSessionReq,
  dataUserPlanBuySchema,
  dataUserPlanFilterSchema,
  dataUserDisconnectSessionSchema,
  IDataUserDisconnectSessionReq,
} from "../../reqSchema/data.user.plan.schema";
import {
  activateInternetResp,
  activateInternetSchema,
  IActivateInternetReq,
} from "../../reqSchema/device.schema";

const routes: IRouteInfo[] = [
  {
    path: `/api/v${process.env.API_VERSION}/userplan/buy`,
    method: "post",
    tags: ["UserPlan"],
    validationSchema: dataUserPlanBuySchema,
    handler: [
      checkUserDevice,
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          const createRequest: IDataUserPlanCreateRequest = body;
          const result = await createDataUserPlan(createRequest);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/userplan/connect`,
    method: "get",
    tags: ["UserPlan"],
    validationSchema: dataUserPlanActivateSchema,
    handler: [
      checkUserDevice,
      async (
        { query }: IDataUserPlanActivateReq,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const result = await dataUserPlanService.activateDataUserPlan(
            query.pdoaId,
            query.planId,
            query.planType,
            query.userDeviceId
          );
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/userplan/history`,
    method: "get",
    tags: ["UserPlan"],
    validationSchema: dataUserPlanFilterSchema,
    handler: [
      checkUserDevice,
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          const result = await getDataUserPlanHistory(query);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/userplan/currentSession`,
    method: "get",
    tags: ["UserPlan"],
    validationSchema: dataUserCurrentSessionSchema,
    responses: getActiveSessionResp,
    handler: [
      async (req: IDataUserCurrentSessionReq, res) => {
        const result = await dataUserPlanService.getCurrentActiveSession(
          req.query.userDeviceId
        );
        res.status(200).send(result);
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/userplan/disconnect`,
    method: "get",
    tags: ["UserPlan"],
    validationSchema: dataUserDisconnectSessionSchema,
    handler: [
      checkUserDevice,
      async (req: IDataUserDisconnectSessionReq, res) => {
        const result = await dataUserPlanService.disconnectSession(
          req.query.pdoaId
        );
        res.status(200).send(result);
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/userplan/activateInternet`,
    method: "post",
    tags: ["UserPlan"],
    validationSchema: activateInternetSchema,
    responses: activateInternetResp,
    handler: [
      checkUserDevice,
      async (req: IActivateInternetReq, res: Response) => {
        const result = await dataUserPlanService.activateInternet();
        res.status(200).send(result);
      },
    ],
  },
];

export default routes;
