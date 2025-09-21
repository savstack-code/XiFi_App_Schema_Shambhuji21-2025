// import { EntityRepository, EntityManager } from "typeorm";
// import XiKasuConfig from "../../shared/database/entities/XiKasuConfig";

import { XiKasuConfigModel } from "../models/xiKasuConfig.model";

//@EntityRepository()
export class XiKasuConfigRepository {
  //constructor(private manager: EntityManager) {}

  findByCategory = (category: string) => {
    // let findOptions: any = {
    //   select: [
    //     "id",
    //     "code",
    //     "description",
    //     "status",
    //     "xiKasuTokens",
    //     "category",
    //     "bandwidth",
    //     "time",
    //   ],
    //   where: { category: category },
    // };

    // return this.manager.find(XiKasuConfig, findOptions);
    return XiKasuConfigModel.find({ category: category }).select([
      "id",
      "code",
      "description",
      "status",
      "xiKasuTokens",
      "category",
      "bandwidth",
      "time",
    ]);
  };
}
