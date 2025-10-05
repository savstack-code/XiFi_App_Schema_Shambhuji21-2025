import { ssidService } from "../../services/ssid.service";
import SsidUpdateRequest from "../../models/request/ssid/ssid.update.request";
import { Response } from "express";

export const updateSsid = async (
  identifier: string,
  request: SsidUpdateRequest
) => {
  const result = await ssidService.updateSsid(identifier, request);
  return result;
};

export const deleteSsid = async (identifier: string) => {
  const result = await ssidService.deleteSsid(identifier);
  return result;
};

export const getSsidByIdentifier = async (identifier: string) => {
  const result = await ssidService.getSsidByIdentifier(identifier);
  return result;
};

export const getSsids = async (query: any) => {
  const result = await ssidService.getSsids(query);
  return result;
};

// New streaming function for large datasets
export const streamSsids = async (query: any, res: Response) => {
  try {
    const cursor = ssidService.getSsidsStream(query);

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Transfer-Encoding", "chunked");

    res.write(
      '{"success":true, "statusCode": "200", "errorCode": null, "errors": [],"result":['
    );

    let isFirst = true;
    let hasData = false;

    // Use async iteration with proper cursor
    for (
      let doc = await cursor.next();
      doc != null;
      doc = await cursor.next()
    ) {
      hasData = true;
      if (!isFirst) {
        res.write(",");
      }

      // Transform document to match aggregation output
      const transformedDoc = {
        ...doc.toObject(),
        identifier: doc._id,
        type: doc.locationType,
      };

      res.write(JSON.stringify(transformedDoc));
      isFirst = false;
    }

    if (!hasData) {
      res.status(404).json({
        success: false,
        error: "No Ssids are found.",
        code: "404",
      });
      return;
    }

    res.write("]}");
    res.end();
  } catch (error: any) {
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    } else {
      // If headers are already sent, try to close the JSON properly
      res.write("]}");
      res.end();
    }
  }
};
