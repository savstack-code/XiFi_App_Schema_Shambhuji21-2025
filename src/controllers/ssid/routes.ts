import { Request, Response, NextFunction } from "express";
import {
  updateSsid,
  deleteSsid,
  getSsids,
  getSsidByIdentifier,
} from "./ssid.controller";
import SsidUpdateRequest from "../../models/request/ssid/ssid.update.request";
import {
  validateSsidUpdateRequest,
  validateSsidFilterRequest,
  IRouteInfo,
} from "../../middleware/schemaValidator";
import { checkSsidParams } from "../../middleware/checks";
import {
  INewAPReq,
  newAPReqSchema,
} from "../../models/schema/ssid/ssid.newReq.schema";
import { ssidService } from "../../services/ssid.service";
// import ISsidCreateRequest, {
//   ssidCreateSchema,
// } from "../../models/schema/ssid/ssid.create.schema";
import {
  INearBySSIDs,
  ISsidCreateRequest,
  nearBySSIDs,
  ssidCreateSchema,
  CityListSchema,
  cityRequest,
  stateRequest,
  StateRequest
} from "../../reqSchema/ssid.schema";
const routes: IRouteInfo[] = [
  {
    path: `/api/v${process.env.API_VERSION}/ssid`,
    method: "post",
    tags: ["SSID"],
    validationSchema: ssidCreateSchema,
    description: `Create SSID`,
    handler: [
      async (
        { body }: ISsidCreateRequest,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const result = await ssidService.createSsid(body);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/ssid/newRequest`,
    method: "post",
    tags: ["SSID"],
    validationSchema: newAPReqSchema,
    description: `New SSID request`,
    handler: [
      async (req: INewAPReq, res, next) => {
        try {
          const result = await ssidService.requestNewAccessPoint(req.body);
          res.status(200).send(result);
        } catch (err) {
          next(err);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/ssid/:identifier`,
    method: "put",
    tags: ["SSID"],
    description: `Update SSID`,
    handler: [
      checkSsidParams,
      validateSsidUpdateRequest,
      async (
        { query, params, body }: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const identifier = <string>params.identifier;
          const updateRequest: SsidUpdateRequest = body;
          const result = await updateSsid(identifier, updateRequest);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/ssid/:identifier`,
    method: "get",
    tags: ["SSID"],
    description: `Get SSID details`,
    handler: [
      checkSsidParams,
      async (
        { query, body, params }: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const result = await getSsidByIdentifier(<string>params.identifier);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/ssid`,
    method: "get",
    tags: ["SSID"],
    description: `List all SSIDs`,
    handler: [
      validateSsidFilterRequest,
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          const result = await getSsids(query);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/ssid/:identifier`,
    method: "delete",
    tags: ["SSID"],
    description: `Delete SSID`,
    handler: [
      checkSsidParams,
      async ({ query, params }: Request, res: Response, next: NextFunction) => {
        try {
          const result = await deleteSsid(<string>params.identifier);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/nearBySsid`,
    method: "get",
    tags: ["SSID"],
    description: `get near by SSIDs`,
    validationSchema: nearBySSIDs,
    handler: [
      async (req: INearBySSIDs, res: Response) => {
        const result = await ssidService.nearBySSIDs(req.query);
        res.json(result);
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/stateWiseSSIDs`,
    method: "get",
    tags: ["SSID"],
    description: `get all state's SSID count`,
    validationSchema: stateRequest,
    handler: [
      async (req : StateRequest, res: Response) => {
        const result = await ssidService.stateBySsid(req.query);
        res.json(result);
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/cityWiseSSIDs/:identifier`,
    method: "get",
    tags: ["SSID"],
    description: `get all city's SSID count`,
    validationSchema: cityRequest,
    handler: [
      async ({ query, params, body }: CityListSchema, res: Response) => {
        const result = await ssidService.cityBySsid(params,query);
        res.json(result);
      },
    ],
  },
];

export default routes;
