export default interface DataPlanUpdateRequest {
    planName: string;
    description: string;
    planId: string;
    planType: string;
    bandwidthLimit: string;
    timeLimit: string;
    renewalTime: string;
    status: string;
    expiryDate: Date;
    tokenQuantity: number;
    tokenValue: number;
    maximumAdsPerDay: number;
    validity: number;
    uot: string;
    priceInRupees: number;
    xiKasuTokens: number;
}