export default interface DataPlanDisplayModel {
  identifier: number;
  planName: string;
  description: string;
  planId: string;
  bandwidthLimit: string;
  timeLimit: string;
  renewalTime: string;
  status: string;
  expiryDate: Date;
  tokenQuantity: number;
  tokenValue: number;
  maximumAdsPerDay: number;
  planType: string;
  validity: number;
  uot: string;
  priceInRupees: number;
  xiKasuTokens: number;
}
