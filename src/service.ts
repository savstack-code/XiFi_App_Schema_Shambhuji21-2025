import * as dotenv from "dotenv";
require("datejs");
dotenv.config();
import * as http from "http";
import * as fs from "fs";
import * as https from "https";
import express from "express";
import { applyMiddleware, applyRoutes } from "./utils";
import routes from "./controllers";
import middleware from "./middleware";
import errorHandlers from "./middleware/errorHandlers";

import adRoutes from "./apps/ads/controllers/routes";
import paymentRoutes from "./apps/payments/controllers/routes";
import { convertToSwagger } from "./middleware/apiDocs";
import { validateRequest } from "./middleware/schemaValidator";
import logger from "./config/winston.logger";
import { reconnectMongodb } from "./mongo.provider";
import { voucherEntry } from "./utils/scipts";

process.on("uncaughtException", (e) => {
  console.log(e);
  process.exit(1);
});

process.on("unhandledRejection", (err: any) => {
  if (err.message === "Topology was destroyed") {
    logger.warn(`Mongodb Error: Topology was destroyed. Trying to Reconnect`);
    reconnectMongodb();
  }
  if (err.code === 4601) {
    logger.warn(`Mongodb reconnect Error: Trying to Reconnect`);
    reconnectMongodb();
  }
  console.log(err);
  process.exit(1);
});
routes.forEach((r) => {
  if (r.validationSchema && Array.isArray(r.handler)) {
    r.handler.unshift(validateRequest(r.validationSchema));
  }
  convertToSwagger(r);
});

paymentRoutes.forEach((r) => {
  if (r.validationSchema && Array.isArray(r.handler)) {
    r.handler.unshift(validateRequest(r.validationSchema));
  }
  convertToSwagger(r);
});
adRoutes.forEach((r) => {
  if (r.validationSchema && Array.isArray(r.handler)) {
    r.handler.unshift(validateRequest(r.validationSchema));
  }
  convertToSwagger(r);
});
const app = express();
applyMiddleware(middleware, app);
applyRoutes(routes, app);
applyRoutes(adRoutes, app);
applyRoutes(paymentRoutes, app);
applyMiddleware(errorHandlers, app);

app.disable("x-powered-by");

const { PORT = 3000 } = process.env;
const server = http.createServer(app);

// voucherEntry();
server.listen(PORT, () =>
  console.log(`Server is running http://localhost:${PORT}...`)
);

if (process.env.SSL_KEY && process.env.SSL_CERT && process.env.SSL_PORT) {
  try {
    const key = fs.readFileSync(process.env.SSL_KEY, "utf8");
    const cert = fs.readFileSync(process.env.SSL_CERT, "utf8");
    var credentials = { key, cert };
    var httpsServer = https.createServer(credentials, app);
    httpsServer.listen(process.env.SSL_PORT, () => {
      console.log(`HTTPS is running on port:${process.env.SSL_PORT}`);
    });
  } catch (err) {
    logger.error("Unable to setup HTTPS:", err);
  }
}
