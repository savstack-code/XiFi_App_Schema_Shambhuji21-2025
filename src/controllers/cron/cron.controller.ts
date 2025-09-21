import { cronServices } from "../../services/cron.services";
const request = require("request");
import { parseString } from "xml2js";

export const cronCdotMigrate = async () => {
  request(
    // "https://pmwani.cdot.in/wani/registry/wani_providers.xml",
    "https://pmwani.gov.in/wani/registry/wani_providers.xml",
    function (error: any, response: any, body: any) {
      if (error === null && response && response.statusCode == 200 && body) {
        parseString(body, async function (err, results) {
          let data = JSON.stringify(results);
          const result = await cronServices.migrateCdotPdoa(data);
          return result;
        });
      } else {
        return {
          error: 400,
          message: "URL not working",
        };
      }
    }
  );
  return {
    statusCode: "200",
    success: true,
    result: {
      message: "cDot Access point data sync cron started.",
    },
  };
};
