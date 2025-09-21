import ObjectTypesModel from "../../database/mongodb/models/objectTypes.model";
import ObjectTypes from "../../shared/database/entities/ObjectTypes";
import { migrate } from "../util";

migrate(ObjectTypes, ObjectTypesModel)
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.log("error: ", err);
  });
