import XiKasuConfigModel from "../../database/mongodb/models/xiKasuConfig.model";
import XiKasuConfig from "../../shared/database/entities/XiKasuConfig";
import { migrate } from "../util";

migrate(XiKasuConfig, XiKasuConfigModel)
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.log("error: ", err);
  });
