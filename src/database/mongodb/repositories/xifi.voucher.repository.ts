// import { EntityRepository, EntityManager } from "typeorm";
// import XifiVoucher from "../../../shared/database/entities/XifiVoucher";
// import voucherCreateRequest from "../../../models/xifiVoucher/xifi.voucher.create.request";

import { XifiVoucherModel } from "../models/xifiVoucher.model";
import {
  IXifiVoucherCreateRequest,
  IXifiVoucherUpdateRequest,
} from "../../../reqSchema/xifi.voucher.schema";

//@EntityRepository()
export class XifiVoucherRepository {
  //import { EntityRepository, EntityManager } from "typeorm";
  // import XifiVoucher from "../../../shared/database/entities/XifiVoucher";
  // import voucherCreateRequest from "../../../models/xifiVoucher/xifi.voucher.create.request";constructor(private manager: EntityManager) {}

  createAndSave = (request: IXifiVoucherCreateRequest["body"]) => {
    const xifiVoucher = new XifiVoucherModel();
    if (request.hasOwnProperty("identifier"))
      xifiVoucher.identifier = request.identifier;
    if (request.hasOwnProperty("code")) xifiVoucher.code = request.code;
    if (request.hasOwnProperty("description"))
      xifiVoucher.description = request.description;
    if (request.hasOwnProperty("status")) xifiVoucher.status = request.status;
    if (request.hasOwnProperty("xiKasuTokens"))
      xifiVoucher.xiKasuTokens = request.xiKasuTokens;
    if (request.hasOwnProperty("expiryTime")) {
      xifiVoucher.expiryTime = new Date(request.expiryTime);
    }
    if (request.hasOwnProperty("allowCount"))
      xifiVoucher.allowCount = request.allowCount;
    xifiVoucher.redeemCount = 0;
    xifiVoucher.createdOn = new Date();
    xifiVoucher.modifiedOn = new Date();
    // return this.manager.save(xifiVoucher);
    return xifiVoucher.save();
  };

  update = (xifiVoucher: IXifiVoucherCreateRequest) => {
    // return this.manager.save(xifiVoucher);
    const XifiVoucher = new XifiVoucherModel(xifiVoucher);
    return XifiVoucher.save();
  };

  find = (queryObject: any) => {
    // let findOptions: any = {
    //   select: [
    //     "identifier",
    //     "code",
    //     "description",
    //     "status",
    //     "xiKasuTokens",
    //     "expiryTime",
    //     "allowCount",
    //     "redeemCount",
    //   ],
    // };
    if (Object.keys(queryObject).length > 0) {
      queryObject = { ...queryObject };
    } else {
      queryObject = {};
    }
    // return this.manager.find(XifiVoucher, findOptions);
    return XifiVoucherModel.find(queryObject).select([
      "identifier",
      "code",
      "description",
      "status",
      "xiKasuTokens",
      "expiryTime",
      "allowCount",
      "redeemCount",
    ]);
  };

  findOne(identifier: any) {
    // return this.manager.findOne(XifiVoucher, {
    //   select: [
    //     "identifier",
    //     "code",
    //     "description",
    //     "status",
    //     "xiKasuTokens",
    //     "expiryTime",
    //     "allowCount",
    //     "redeemCount",
    //   ],
    //   where: { identifier: identifier },
    // });

    return XifiVoucherModel.findOne({ identifier: identifier }).select([
      "identifier",
      "code",
      "description",
      "status",
      "xiKasuTokens",
      "expiryTime",
      "allowCount",
      "redeemCount",
    ]);
  }

  findByCode(code: string) {
    // return this.manager.findOne(XifiVoucher, { where: { code: code } });
    return XifiVoucherModel.findOne({ code: code });
  }

  findByIdentifier(identifier: any) {
    // return this.manager.findOne(XifiVoucher, {
    //   where: { identifier: identifier },
    // });
    return XifiVoucherModel.findOne({ identifier: identifier });
  }

  remove = (xifiVoucher: IXifiVoucherCreateRequest) => {
    // return this.manager.remove(xifiVoucher);
    const XifiVoucher = new XifiVoucherModel(xifiVoucher);
    return XifiVoucher.remove();
  };
}
