import { Request, Response, NextFunction } from "express";
import {
  createDataPlan,
  updateDataPlan,
  deleteDataPlan,
  getDataPlans,
  getDataPlanByIdentifier,
} from "./data.plan.controller";
// import DataPlanCreateRequest from "../../models/request/data.plan.create.request";
// import DataPlanUpdateRequest from "../../models/request/data.plan.update.request";
import {
  IDataPlanCreateRequest,
  dataPlanCreateSchema,
  IDataPlanUpdateRequest,
  dataPlanUpdateSchema,
  getAllDataPlansSchema,
  IDataPlanGetRequest,
  getDataPlansSchema,
} from "../../reqSchema/data.plan.schema";
import { IRouteInfo } from "../../middleware/schemaValidator";
import { checkDataPlanParams } from "../../middleware/checks";
import { checkUserDevice } from "../../middleware/check.user.device";

const routes: IRouteInfo[] = [
  {
    path: `/api/v${process.env.API_VERSION}/dataplan`,
    method: "post",
    tags: ["Dataplan"],
    validationSchema: dataPlanCreateSchema,
    handler: [
      // validateDataPlanCreateRequest,
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          const createRequest: IDataPlanCreateRequest["body"] = body;
          const result = await createDataPlan(createRequest);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/dataplan/:identifier`,
    method: "put",
    tags: ["Dataplan"],
    validationSchema: dataPlanUpdateSchema,
    handler: [
      checkDataPlanParams,
      // validateDataPlanUpdateRequest,
      async (
        { query, params, body }: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          // const identifier = <number>params.identifier;
          const updateRequest: IDataPlanUpdateRequest["body"] = body;
          const identifier: IDataPlanUpdateRequest["params"] =
            params.identifier;
          const result = await updateDataPlan(identifier, updateRequest);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/dataplan/:identifier`,
    method: "get",
    tags: ["Dataplan"],
    validationSchema: getDataPlansSchema,
    handler: [
      checkDataPlanParams,
      async (
        { query, body, params }: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const identifier: IDataPlanGetRequest["params"] = params.identifier;
          const result = await getDataPlanByIdentifier(identifier);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/dataplan`,
    method: "get",
    tags: ["Dataplan"],
    validationSchema: getAllDataPlansSchema,
    handler: [
      // validateGetDataPlansSchemaRequest,
      checkUserDevice,
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          const result = await getDataPlans(query);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/dataplan/:identifier`,
    method: "delete",
    tags: ["Dataplan"],
    validationSchema: getDataPlansSchema,
    handler: [
      checkDataPlanParams,
      async ({ query, params }: Request, res: Response, next: NextFunction) => {
        try {
          const identifier: IDataPlanGetRequest["params"] = params.identifier;
          const result = await deleteDataPlan(identifier);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
];

export default routes;
