import { Request, Response, NextFunction } from "express";
import {
  createDataPlan,
  updateDataPlan,
  getTokenPlanByIdentifier,
  deleteTokenPlan,
  getTokenPlans,
  getActivePlans,
} from "./token.plan.controller";
// import TokenPlanCreateRequest from "../../models/request/tokenplan/token.plan.create.request";
// import TokenPlanUpdateRequest from "../../models/request/tokenplan/token.plan.update.request";
import {
  ITokenPlanCreateRequest,
  ITokenPlanUpdateRequest,
  tokenPlanUpdateSchema,
  tokenplanCreateSchema,
  getActiveTokenPlansSchema,
  getTokenPlansFilterSchema,
  tokenplanIdentifierRangeSchema,
  ITokenplanGetRequest,
  tokenplanGetSchema,
} from "../../reqSchema/token.plan.schema";
import {
  // validateTokenPlanCreateRequest,
  // validateTokenPlanUpdateRequest,
  // validateGetActiveTokenPlanSchemaRequest,
  // validateGetTokenPlanFilterSchemaRequest,
  // validateTokenPlanIdentifierRangeRequest,
  IRouteInfo,
} from "../../middleware/schemaValidator";
import { checkDataPlanParams } from "../../middleware/checks";
import { checkUserDevice } from "../../middleware/check.user.device";

const routes: IRouteInfo[] = [
  {
    path: `/api/v${process.env.API_VERSION}/tokenplan`,
    method: "post",
    tags: ["Tokenplan"],
    validationSchema: tokenplanCreateSchema,
    handler: [
      // validateTokenPlanCreateRequest,
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          const createRequest: ITokenPlanCreateRequest["body"] = body;
          const result = await createDataPlan(createRequest);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/tokenplan/:identifier`,
    method: "put",
    tags: ["Tokenplan"],
    validationSchema: tokenPlanUpdateSchema,
    handler: [
      checkDataPlanParams,
      // validateTokenPlanUpdateRequest,
      async (
        { query, params, body }: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const identifier: ITokenPlanUpdateRequest["params"] =
            params.identifier;
          const updateRequest: ITokenPlanUpdateRequest["body"] = body;
          const result = await updateDataPlan(identifier, updateRequest);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/tokenplan/getplans`,
    method: "get",
    tags: ["Tokenplan"],
    validationSchema: getActiveTokenPlansSchema,
    handler: [
      // validateGetActiveTokenPlanSchemaRequest,
      checkUserDevice,
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          const result = await getActivePlans(query);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/tokenplan/:identifier`,
    method: "get",
    tags: ["Tokenplan"],
    validationSchema: tokenplanGetSchema,
    handler: [
      checkDataPlanParams,
      // validateTokenPlanIdentifierRangeRequest,
      async (
        { query, body, params }: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const identifier: ITokenplanGetRequest["params"] = params.identifier;
          const result = await getTokenPlanByIdentifier(identifier);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/tokenplan/:identifier`,
    method: "delete",
    tags: ["Tokenplan"],
    validationSchema: tokenplanGetSchema,
    handler: [
      checkDataPlanParams,
      // validateTokenPlanIdentifierRangeRequest,
      async ({ query, params }: Request, res: Response, next: NextFunction) => {
        try {
          const identifier: ITokenplanGetRequest["params"] = params.identifier;
          const result = await deleteTokenPlan(identifier);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/tokenplan`,
    method: "get",
    tags: ["Tokenplan"],
    validationSchema: tokenplanIdentifierRangeSchema,
    handler: [
      // validateGetTokenPlanFilterSchemaRequest,
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          const result = await getTokenPlans(query);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
];

export default routes;
