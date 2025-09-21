export interface IDataUserTokenRequest {
  userId: string;
  tokens: number;
  balance?: any;
  transactionType: string;
  transUserId?: string;
  referenceNo?: string;
  status: string;
  source: string;
}
