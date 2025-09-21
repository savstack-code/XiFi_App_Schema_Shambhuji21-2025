import mongoose from "mongoose";
import logger from "./config/winston.logger";
const dbURL = process.env.MONGODB_URL || "mongodb://localhost:27017/mydb";
const dbName = process.env.MONGODB_DATABASE_NAME || "mydb";
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
export function reconnectMongodb() {
  if (process.env.NODE_ENV !== "test") {
    logger.debug(`Connecting mongodb...`);
    mongoose
      .connect(dbURL, { useNewUrlParser: true, dbName })
      .then(() => {
        logger.debug(`Mongodb connected`);
      })
      .catch((err) => {
        logger.error(`Error on connecting mongodb ${err.message}`);
      });
  }
}

reconnectMongodb();
