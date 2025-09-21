export interface IDataPlanUpdateRequest {
  planName: string;
  description: string;
  planId: number;
  planType: string;
  bandwidthLimit: number;
  timeLimit: number;
  renewalTime: number;
  status: "Active" | "InActive";
  expiryDate: Date;
  tokenQuantity: number;
  tokenValue: number;
  maximumAdsPerDay: number;
  validity: number;
  uot: string;
  priceInRupees: number;
  xiKasuTokens: number;
}
