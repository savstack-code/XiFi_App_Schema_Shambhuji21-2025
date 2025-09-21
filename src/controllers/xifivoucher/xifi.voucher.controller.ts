import { xifiVoucherService } from "../../services/xifi.voucher.service";
// import XifiVoucherCreateRequest from "../../models/xifiVoucher/xifi.voucher.request";
// import XifiVoucherUpdateRequest from "../../models/xifiVoucher/xifi.voucher.update.request";
import {
  IXifiVoucherUpdateRequest,
  IXifiVoucherCreateRequest,
  IXifiVoucherGetRequest,
} from "../../reqSchema/xifi.voucher.schema";

export const createXifiVoucher = async (
  request: IXifiVoucherCreateRequest["body"]
) => {
  const result = await xifiVoucherService.createVoucher(request);
  return result;
};

export const updateXifiVoucher = async (
  identifier: IXifiVoucherUpdateRequest["params"],
  request: IXifiVoucherUpdateRequest["body"]
) => {
  const result = await xifiVoucherService.updateVoucher(identifier, request);
  return result;
};

export const redeemXifiVocher = async (code: string) => {
  const result = await xifiVoucherService.redeemXifiVoucher(code);
  return result;
};

export const deleteXifiVoucher = async (
  identifier: IXifiVoucherUpdateRequest["params"]
) => {
  const result = await xifiVoucherService.deleteVoucher(identifier);
  return result;
};

export const getXifiVoucherByIdentifier = async (
  identifier: IXifiVoucherGetRequest["params"]
) => {
  const result = await xifiVoucherService.getVoucherByIdentifier(identifier);
  return result;
};

export const getXifiVouchers = async (query: any) => {
  const result = await xifiVoucherService.getVouchers(query);
  return result;
};
