import DataSessionModel from "../../database/mongodb/models/dataSession.model";
import DataSession from "../../shared/database/entities/DataSession";
import { migrate } from "../util";

migrate(DataSession, DataSessionModel)
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.log("error: ", err);
  });
