import logger from "../config/winston.logger";
import { DatabaseProvider } from "../database/database.provider";

import DataSession from "../shared/database/entities/DataSession";

logger.info("Running Change Date Time Script");

DatabaseProvider.getConnection().then(async (connection) => {
  const dsRepo = connection.getRepository(DataSession);
  const resp = await dsRepo.findOne();
  console.log("got data:", resp);
});
