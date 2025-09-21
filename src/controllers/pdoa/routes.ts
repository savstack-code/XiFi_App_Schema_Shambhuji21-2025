import { Request, Response, NextFunction } from "express";
import {
  getPdoaByPdoaId,
  createPdoa,
  getPdoas,
  updatePdoa,
} from "./pdoa.controller";
// import PdoaCreateRequest from "../../models/request/pdoa/pdoa.create.request";
// import PdoaUpdateRequest from "../../models/request/pdoa/pdoa.update.request";
import {
  IPdoaCreateRequest,
  IPdoaUpdateRequest,
  poaCreateSchema,
} from "../../reqSchema/pdoa.schema";

import { IRouteInfo } from "../../middleware/schemaValidator";

const routes: IRouteInfo[] = [
  {
    path: `/api/v${process.env.API_VERSION}/pdoa`,
    method: "post",
    tags: ["Pdoa"],
    validationSchema: poaCreateSchema,
    handler: [
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          const createRequest: IPdoaCreateRequest["body"] = body;
          const result = await createPdoa(createRequest);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/pdoa/:pdoaId`,
    method: "put",
    tags: ["Pdoa"],
    handler: [
      async (
        { query, params, body }: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const pdoaId = <string>params.pdoaId;
          const updateRequest: IPdoaUpdateRequest["body"] = body;
          const result = await updatePdoa(pdoaId, updateRequest);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/pdoa/:pdoaId`,
    method: "get",
    tags: ["Pdoa"],
    handler: [
      async (
        { query, body, params }: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const result = await getPdoaByPdoaId(<string>params.pdoaId);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/pdoa`,
    method: "get",
    tags: ["Pdoa"],
    handler: [
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          const result = await getPdoas();
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
];

export default routes;
