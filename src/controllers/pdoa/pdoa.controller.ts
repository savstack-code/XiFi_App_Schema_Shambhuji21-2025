import { pdoaService } from "../../services/pdoa.service";
// import PdoaCreateRequest from "../../models/request/pdoa/pdoa.create.request";
// import PdoaUpdateRequest from "../../models/request/pdoa/pdoa.update.request";
import {
  IPdoaUpdateRequest,
  IPdoaCreateRequest,
} from "../../reqSchema/pdoa.schema";
export const createPdoa = async (requestModel: IPdoaCreateRequest["body"]) => {
  const result = await pdoaService.createPdoa(requestModel);
  return result;
};

export const updatePdoa = async (
  pdoaId: string,
  request: IPdoaUpdateRequest["body"]
) => {
  const result = await pdoaService.updatePdoa(pdoaId, request);
  return result;
};

export const getPdoaByPdoaId = async (pdoaId: string) => {
  const result = await pdoaService.getPdoaByPdoaId(pdoaId);
  return result;
};

export const getPdoas = async () => {
  const result = await pdoaService.getPdoas();
  return result;
};
