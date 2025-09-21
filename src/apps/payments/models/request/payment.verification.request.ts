export default interface PaymentVerificationRequest {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    userDeviceId: string;
}
