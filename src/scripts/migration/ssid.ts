import { DatabaseProvider } from "../../database/database.provider";
import SSIDModel, { ISSIDDoc } from "../../database/mongodb/models/ssid.model";
import {STATE_NAME} from "../constant"

import SSID from "../../shared/database/entities/SSID";
console.log(`========Migrating SSID========`);

DatabaseProvider.getConnection()
  .then(async (connection) => {
    await SSIDModel.deleteMany({});
    const ssidRepo = connection.getRepository(SSID);
    const data = await ssidRepo.find();
    console.log(`Total data: ${data.length}`);
    for (const ssid of data) {
      const ssidDoc: Partial<ISSIDDoc> = {
        providerID: ssid.providerID,
        locationName: ssid.locationName,
        state: STATE_NAME[ssid.state] ? STATE_NAME[ssid.state].toUpperCase() : ssid.state,
        locationType: ssid.type,
        cPURL: ssid.cPURL,
        langitude: ssid.langitude,
        latitude: ssid.latitude,
        address: ssid.address,
        deviceID: ssid.deviceID,
        status: ssid.status.toLowerCase() === "active" ? "Active" : "InActive",
        sSID: ssid.sSID,
        openBetween: ssid.openBetween,
        avgSpeed: ssid.avgSpeed,
        freeBand: ssid.freeBand,
        paymentModes: ssid.paymentModes,
        createdOn: ssid.createdOn,
        createdBy: ssid.createdBy,
        modifiedBy: ssid.modifiedBy,
        loginScheme: ssid.loginScheme,
        description: ssid.description,
      };
      await new SSIDModel(ssidDoc).save().catch((err) => {
        console.log(`Error on insert: ${err.message}`);
      });
    }
  })
  .then(() => {
    console.log(`SSID migrated`);
  })
  .catch((err) => {
    console.log("Error on ssid import", err);
  });
