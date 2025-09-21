export default interface DataUserPolicyModel {
  userId: string;
  userName: string;
  xiKasuTokens: number;
  planId?: string;
  planType?: string;
  time: string;
  bandwidth: number;
  mobileNumber: string;
}
