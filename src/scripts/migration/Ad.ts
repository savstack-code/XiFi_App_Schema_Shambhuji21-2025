import AdModel from "../../database/mongodb/models/ad.model";
import Ad from "../../shared/database/entities/Ad";
import { migrate } from "../util";

migrate(Ad, AdModel)
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.log("error: ", err);
  });
