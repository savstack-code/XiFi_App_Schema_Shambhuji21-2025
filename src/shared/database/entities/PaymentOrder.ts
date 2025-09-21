import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity("PaymentOrder")
export default class PaymentOrder {
    @PrimaryGeneratedColumn({ name: "Id", type: "int" })
    id!: number;

    @Column({ name: "Amount", type: "decimal", precision: 18, scale: 6, nullable: true })
    amount!: number;

    @Column({ name: "Currency", length: 15, nullable: true })
    currency!: string;

    @Column({ name: "TokenPlanId", type: "int" })
    tokenPlanId!: number;

    @Column({ name: "Attempts", type: "int", nullable: true })
    attempts!: number;

    @Column({ name: "PaymentCapture", nullable: true })
    paymentCapture!: boolean;

    @Column({ name: "TransactionId", length: 100, nullable: true })
    transactionId!: string;

    @Column({ name: "CheckoutId", length: 100, nullable: true })
    checkoutId!: string;

    @Column({ name: "RazorpayOrderId", length: 256, nullable: true })
    razorpayOrderId!: string;

    @Column({ name: "RazorpayOrderCreatedAt", length: 50, nullable: true })
    razorpayOrderCreatedAt!: string;

    @Column({ name: "RazorpayPaymentId", length: 100, nullable: true })
    razorpayPaymentId!: string;

    @Column({ name: "RazorpaySignature", length: 256, nullable: true })
    razorpaySignature!: string;

    @Column({ name: "PaymentMethod", length: 50, nullable: true })
    paymentMethod!: string;

    @Column({ name: "UserId", length: 50, nullable: true })
    userId!: string;

    @Column({ name: "RazorpayStatus", length: 50, nullable: true })
    razorpayStatus!: string;

    @Column({ name: "Status", length: 50, nullable: true })
    status!: string;

    @Column({ name: "ErrorCode", length: 50, nullable: true })
    errorCode!: string;

    @Column({ name: "ErrorMessage", length: 50, nullable: true })
    errorMessage!: string;

    @Column({ name: "RefundStatus", length: 50, nullable: true })
    refundStatus!: string;

    @Column({ name: "AmountRefunded", type: "decimal", precision: 18, scale: 6, nullable: true })
    amountRefunded!: string;

    @Column({ name: "RazorpayRefundId", length: 100, nullable: true })
    razorpayRefundId!: string;

    @Column({ name: "RefundCreatedAt", length: 50, nullable: true })
    refundCreatedAt!: string;

    @Column({ name: "DisputeId", length: 50, nullable: true })
    disputeId!: string;

    @Column({ name: "DisputeReasonCode", length: 50, nullable: true })
    disputeReasonCode!: string;

    @Column({ name: "DisputePhase", length: 50, nullable: true })
    disputePhase!: string;

    @Column({ name: "DisputeStatus", length: 50, nullable: true })
    disputeStatus!: string;

    @Column({ name: "DisputeCreatedAt", length: 50, nullable: true })
    disputeCreatedAt!: string;

    @Column({ name: "DisputeRespondBy", length: 50, nullable: true })
    disputeRespondBy!: string;

    @CreateDateColumn({ name: "CreatedOn", type: 'datetime', nullable: true })
    createdOn!: Date;

    @Column({ name: "ModifiedOn", type: 'datetime', nullable: true })
    modifiedOn!: Date;

    @Column({ name: "CreatedBy", length: 50, nullable: true })
    createdBy!: string;

    @Column({ name: "ModifiedBy", length: 50, nullable: true })
    modifiedBy!: string;
}