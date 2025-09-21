import SSIDModel from "../../database/mongodb/models/ssid.model";
import {STATE_NAME} from "../constant"
console.log(`Running ssid update script`);


const allStateName = Object.keys(STATE_NAME)

for (const shortStateName of allStateName) {
   SSIDModel.updateMany(
    { state: shortStateName },
    [
      {
        $set: {
            state : STATE_NAME[shortStateName].toUpperCase()
        },
      },
    ]
  )
    .then((r) => {
      console.log("updated:", r);
    })
    .catch((err) => {
      console.log("error:", err);
    });
}

console.log(`All State updated`);



