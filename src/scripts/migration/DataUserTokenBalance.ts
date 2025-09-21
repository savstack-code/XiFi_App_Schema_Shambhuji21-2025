import DataUserTokenBalanceModel from "../../database/mongodb/models/dataUserTokenBalance.model";
import DataUserTokenBalance from "../../shared/database/entities/DataUserTokenBalance";
import { migrate } from "../util";

migrate(DataUserTokenBalance, DataUserTokenBalanceModel)
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.log("error: ", err);
  });
