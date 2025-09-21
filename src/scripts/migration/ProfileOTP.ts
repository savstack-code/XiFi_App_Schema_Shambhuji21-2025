import ProfileOTPModel from "../../database/mongodb/models/profileOTP.model";
import ProfileOTP from "../../shared/database/entities/ProfileOTP";
import { migrate } from "../util";

migrate(ProfileOTP, ProfileOTPModel)
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.log("error: ", err);
  });
