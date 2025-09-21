import { EntityRepository, EntityManager } from "typeorm";
import XifiVoucher from "../../shared/database/entities/XifiVoucher";
import voucherCreateRequest from "../../models/xifiVoucher/xifi.voucher.request";

@EntityRepository()
export class XifiVoucherRepository {
  constructor(private manager: EntityManager) {}

  createAndSave = (request: voucherCreateRequest) => {
    const xifiVoucher = new XifiVoucher();
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
    return this.manager.save(xifiVoucher);
  };

  update = (xifiVoucher: XifiVoucher) => {
    return this.manager.save(xifiVoucher);
  };

  find = (queryObject: any) => {
    let findOptions: any = {
      select: [
        "identifier",
        "code",
        "description",
        "status",
        "xiKasuTokens",
        "expiryTime",
        "allowCount",
        "redeemCount",
      ],
    };
    if (Object.keys(queryObject).length > 0) {
      findOptions.where = queryObject;
    }
    return this.manager.find(XifiVoucher, findOptions);
  };

  findOne(identifier: number) {
    return this.manager.findOne(XifiVoucher, {
      select: [
        "identifier",
        "code",
        "description",
        "status",
        "xiKasuTokens",
        "expiryTime",
        "allowCount",
        "redeemCount",
      ],
      where: { identifier: identifier },
    });
  }

  findByCode(code: string) {
    return this.manager.findOne(XifiVoucher, { where: { code: code } });
  }

  findByIdentifier(identifier: number) {
    return this.manager.findOne(XifiVoucher, {
      where: { identifier: identifier },
    });
  }

  remove = (xifiVoucher: XifiVoucher) => {
    return this.manager.remove(xifiVoucher);
  };
}
