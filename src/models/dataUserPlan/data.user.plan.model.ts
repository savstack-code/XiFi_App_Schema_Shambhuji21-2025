export default interface DataUserPlanModel {
  userId: string;
  planId: string;
  status: string;
  planExpiryDate: Date;
  remainingData: string;
  bandwidthLimit: string;
}
