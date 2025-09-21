export default interface XifiVoucherCreateRequest {
  code: string;
  description: string;
  status: string;
  xiKasuTokens: number;
  expiryTime: string;
  allowCount: number;
  redeemCount: number;
}
