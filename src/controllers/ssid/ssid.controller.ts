import { ssidService } from "../../services/ssid.service";
import SsidUpdateRequest from "../../models/request/ssid/ssid.update.request";

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
