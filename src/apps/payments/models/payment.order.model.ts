export default interface PaymentOrderModel {
    amount: number;
    attempts: number;
    currency: string;
    tokenPlanId: number;
    checkoutId: any;
    paymentCapture: any;
    razorpayOrderId: any;
    razorpayPaymentId: any;
    razorpayOrderCreatedAt?: any;
    razorpaySignature?: any;
    razorpayStatus?: any;
    status: any;
    transactionId: any;
    userId: string;
    errorCode: any;
    errorMessage: any;
    refundStatus: any;
    amountRefunded: any;
    disputeId: any;
    disputeReasonCode: any;
    disputePhase: any;
    disputeStatus: any;
    disputeCreatedAt: any;
    disputeRespondBy: any;
    paymentMethod: any;
}