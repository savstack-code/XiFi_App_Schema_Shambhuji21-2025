export interface IDataUserTokenRequest {
  userId: string;
  tokens: number;
  balance?: any;
  transactionType: string;
  referenceNo: string;
  status: string;
  source: string;
}
