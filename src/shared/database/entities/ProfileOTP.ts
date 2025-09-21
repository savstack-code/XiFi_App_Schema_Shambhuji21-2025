import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity("ProfileOTP")
export default class ProfileOtp {
  @PrimaryGeneratedColumn({ name: "Identifier", type: "int" })
  identifier!: number;

  @Column({ name: "UserId", length: 50, nullable: true })
  userId?: string;

  @Index()
  @Column({ name: "DeviceId", length: 50, nullable: true })
  deviceId!: string;

  @Index()
  @Column({ name: "MobileNumber", length: 50, nullable: true })
  mobileNumber?: string;

  @Column({ name: "OTP", type: "int", nullable: true })
  otp!: number;

  @Column({ type: "datetime", nullable: true })
  createdOn!: Date;
}
