export default interface PaymentOrderHistoryRequest {
    currentPage: number;
    pageSize: number;
    userDeviceId: string;
    userId?: string;
    orderFromDate?: string;
    orderToDate?: string;
}