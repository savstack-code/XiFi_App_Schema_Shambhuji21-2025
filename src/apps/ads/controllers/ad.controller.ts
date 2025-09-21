import { adService } from "../services/ad.service";
import AdModel from "../models/ad.model";

export const getAnAd = async (planType: string) => {
  const result = await adService.getAnAd(planType);
  return result;
};

export const completeAdNotification = async (
  pdoaId: string,
  planType: string,
  adId: string
) => {
  return adService.completeAdNotification(pdoaId, planType, adId);
};
