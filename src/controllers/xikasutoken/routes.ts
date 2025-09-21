import { Request, Response, NextFunction } from "express";
import { IRouteInfo } from "../../middleware/schemaValidator";
import { checkUserDevice } from "../../middleware/check.user.device";
import { adminValidation } from "../../middleware/admin.validation";
// import {
//   IXiKasuTokenHistoryRequest,
//   xiKasuTokenFilterResp,
//   xiKasuTokenFilterSchema,
// } from "../../models/schema/xikasu.token.filter.schema";

import {
  IXiKasuTokenHistoryRequest,
  IXiKasuTokenTransferRequest,
  xiKasuTokenFilterResp,
  xiKasuTokenFilterSchema,
  xiKasuTokenTransferSchema,
  xiKasuTokenTransferResp,
  xiKasuTokenAssignSchema,
  xiKasuTokenAssignResp,
  IXiKasuTokenAssignRequest,
  xiKasuTokenSendResp,
  xiKasuTokenSendSchema,
  IXiKasuTokenSendRequest,
} from "../../reqSchema/xikasu.token.schema";

import { tokenService } from "../../shared/services/token.service";

const routes: IRouteInfo[] = [
  {
    path: `/api/v${process.env.API_VERSION}/token/history`,
    method: "get",
    validationSchema: xiKasuTokenFilterSchema,
    tags: ["Token"],
    responses: xiKasuTokenFilterResp,
    handler: [
      checkUserDevice,
      async (
        { query }: IXiKasuTokenHistoryRequest,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const result = await tokenService.getTokenHistory(query);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/token/transfer`,
    method: "put",
    validationSchema: xiKasuTokenTransferSchema,
    tags: ["Token"],
    responses: xiKasuTokenTransferResp,
    handler: [
      checkUserDevice,
      async (
        { body }: IXiKasuTokenTransferRequest,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const result = await tokenService.tokenTransfer(body);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/token/assign`,
    method: "post",
    validationSchema: xiKasuTokenAssignSchema,
    tags: ["Token"],
    responses: xiKasuTokenAssignResp,
    handler: [
      adminValidation,
      async (
        { body }: IXiKasuTokenAssignRequest,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const result = await tokenService.tokenAssign(body);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/tokenAssign`,
    method: "post",
    tags: ["Token"],
    handler: [
      async ({ body }: Request, res: Response, next: NextFunction) => {
        try {
          const result = await tokenService.tokenAssignByPdo(body);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/token/send`,
    method: "put",
    validationSchema: xiKasuTokenSendSchema,
    tags: ["Token"],
    responses: xiKasuTokenSendResp,
    handler: [
      adminValidation,
      async (
        { body }: IXiKasuTokenSendRequest,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const result = await tokenService.tokenSend(body);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
];
export default routes;
