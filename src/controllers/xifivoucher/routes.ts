import { Request, Response, NextFunction } from "express";
import {
  createXifiVoucher,
  updateXifiVoucher,
  deleteXifiVoucher,
  getXifiVouchers,
  getXifiVoucherByIdentifier,
  redeemXifiVocher,
} from "./xifi.voucher.controller";
// import XifiVoucherUpdateRequest from "../../models/xifiVoucher/xifi.voucher.update.request";
// import XifiVoucherCreateRequest from "../../models/xifiVoucher/xifi.voucher.create.request";
import {
  // validateXifiVoucherCreateRequest,
  // validateXifiVoucherUpdateRequest,
  // validateXifiVoucherFilterRequest,
  // validateXifiVoucherRedeemRequest,
  IRouteInfo,
} from "../../middleware/schemaValidator";
import {
  IXifiVoucherCreateRequest,
  IXifiVoucherUpdateRequest,
  xifiVoucherFilterSchema,
  xifiVoucherRedeemSchema,
  xifiVoucherUpdateSchema,
  xifiVoucherCreateSchema,
  xifiVoucherGetSchema,
  IXifiVoucherGetRequest,
} from "../../reqSchema/xifi.voucher.schema";
import { checkXifiVoucherParams } from "../../middleware/checks";
import { checkUserDevice } from "../../middleware/check.user.device";

const routes: IRouteInfo[] = [
  {
    path: `/api/v${process.env.API_VERSION}/voucher`,
    method: "post",
    tags: ["Voucher"],
    validationSchema: xifiVoucherCreateSchema,
    handler: [
      // validateXifiVoucherCreateRequest,
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          const createRequest: IXifiVoucherCreateRequest["body"] = body;
          const result = await createXifiVoucher(createRequest);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/voucher/:identifier`,
    method: "put",
    tags: ["Voucher"],
    validationSchema: xifiVoucherUpdateSchema,
    handler: [
      checkXifiVoucherParams,
      // validateXifiVoucherUpdateRequest,
      async (
        { query, params, body }: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const identifier: IXifiVoucherUpdateRequest["params"] =
            params.identifier;
          const updateRequest: IXifiVoucherUpdateRequest["body"] = body;
          const result = await updateXifiVoucher(identifier, updateRequest);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/voucher/redeem`,
    method: "get",
    tags: ["Voucher"],
    validationSchema: xifiVoucherRedeemSchema,
    handler: [
      // validateXifiVoucherRedeemRequest,
      checkUserDevice,
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          const result = await redeemXifiVocher(query.code);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/voucher/:identifier`,
    method: "get",
    tags: ["Voucher"],
    validationSchema: xifiVoucherGetSchema,
    handler: [
      checkXifiVoucherParams,
      async (
        { query, body, params }: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const identifier: IXifiVoucherGetRequest["params"] =
            params.identifier;
          const result = await getXifiVoucherByIdentifier(identifier);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/voucher`,
    method: "get",
    tags: ["Voucher"],
    validationSchema: xifiVoucherFilterSchema,
    handler: [
      // validateXifiVoucherFilterRequest,
      async ({ query, body }: Request, res: Response, next: NextFunction) => {
        try {
          const result = await getXifiVouchers(query);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
  {
    path: `/api/v${process.env.API_VERSION}/voucher/:identifier`,
    method: "delete",
    tags: ["Voucher"],
    handler: [
      checkXifiVoucherParams,
      async ({ query, params }: Request, res: Response, next: NextFunction) => {
        try {
          const result = await deleteXifiVoucher(params.identifier);
          res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      },
    ],
  },
];

export default routes;
