import { DatabaseProvider } from "../../database/database.provider";
import UserDeviceModel from "../../database/mongodb/models/userDevice.model";
import UserDevice from "../../shared/database/entities/UserDevice";

DatabaseProvider.getConnection()
  .then(async (connection) => {
    await UserDeviceModel.deleteMany({});
    const udRepo = connection.getRepository(UserDevice);
    const data = await udRepo.find();
    console.log(`Got data: ${data.length}`);
    for (const d of data) {
      await new UserDeviceModel(JSON.parse(JSON.stringify(d)))
        .save()
        .catch((err) => {
          console.log(`Error on insert: ${err.message}`);
        });
    }
  })
  .then(() => {
    console.log(`migrated`);
  })
  .catch((err) => {
    console.log("Error on import", err);
  });
