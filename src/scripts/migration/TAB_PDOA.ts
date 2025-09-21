import PDOAModel from "../../database/mongodb/models/tabPdoa.model";
import PDOA from "../../shared/database/entities/PDOA";
import { migrate } from "../util";

migrate(PDOA, PDOAModel)
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.log("error: ", err);
  });
